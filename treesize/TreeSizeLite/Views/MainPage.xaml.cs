using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using Microsoft.UI.Xaml;
using Microsoft.UI.Xaml.Controls;
using Microsoft.UI.Xaml.Media;
using TreeSizeLite.Models;
using TreeSizeLite.Services;
using WinRT.Interop; // For WindowNative

namespace TreeSizeLite.Views
{
    public sealed partial class MainPage : Page
    {
        private ScannerService _scannerService;
        private CancellationTokenSource _cts;

        public MainPage()
        {
            this.InitializeComponent();
            _scannerService = new ScannerService();
        }

        private async void PickFolderButton_Click(object sender, RoutedEventArgs e)
        {
            try
            {
                var folderPicker = new Windows.Storage.Pickers.FolderPicker();
                folderPicker.SuggestedStartLocation = Windows.Storage.Pickers.PickerLocationId.ComputerFolder;
                folderPicker.FileTypeFilter.Add("*");

                // Initialize with Window handle
                var hwnd = WindowNative.GetWindowHandle(App.MainWindow);
                InitializeWithWindow.Initialize(folderPicker, hwnd);

                var folder = await folderPicker.PickSingleFolderAsync();
                if (folder != null)
                {
                    StatusTextBlock.Text = $"Scanning {folder.Path}...";
                    FolderTreeView.RootNodes.Clear();
                    
                    if (_cts != null)
                    {
                        _cts.Cancel();
                        _cts.Dispose();
                    }
                    _cts = new CancellationTokenSource();

                    try
                    {
                        var statusProgress = new Progress<string>(status =>
                        {
                            StatusTextBlock.Text = status;
                        });
                        
                        var rootItem = await _scannerService.ScanAsync(folder.Path, _cts.Token, null, statusProgress);
                        if (rootItem != null)
                        {
                            _rootItem = rootItem; // Store for search/sort
                            FolderTreeView.RootNodes.Clear();
                            var rootNode = CreateTreeNode(rootItem);
                            FolderTreeView.RootNodes.Add(rootNode);
                            rootNode.IsExpanded = true;
                            
                            // Update status bar
                            StatusTextBlock.Text = "Scan Complete";
                            PathTextBlock.Text = folder.Path;
                            TotalSizeText.Text = FormatSize(rootItem.Size);
                            TotalFilesText.Text = $"{rootItem.FileCount:N0} files";
                            TotalFoldersText.Text = $"{rootItem.FolderCount:N0} folders";
                        }
                    }
                    catch (OperationCanceledException)
                    {
                         StatusTextBlock.Text = "Scan canceled.";
                    }
                    catch (Exception ex)
                    {
                         StatusTextBlock.Text = "Error during scan: " + ex.Message;
                    }
                }
            }
            catch (Exception ex)
            {
                StatusTextBlock.Text = "Picker Error: " + ex.Message;
            }
        }

        private TreeViewNode CreateTreeNode(DirectoryItem item)
        {
            var node = new TreeViewNode() { Content = item };
            // Lazy loading: Only set HasUnrealizedChildren = true if there are subitems.
            // Do NOT recursively create children here.
            if (item.SubItems.Count > 0)
            {
                node.HasUnrealizedChildren = true;
            }
            return node;
        }

        private void FolderTreeView_Expanding(TreeView sender, TreeViewExpandingEventArgs args)
        {
            try
            {
                LogToFile($"Expanding event triggered. HasUnrealizedChildren: {args.Node.HasUnrealizedChildren}");
                
                if (args.Node.HasUnrealizedChildren)
                {
                    var item = args.Node.Content as DirectoryItem;
                    if (item != null)
                    {
                        LogToFile($"Expanding: {item.Path}");
                        LogToFile($"SubItems count: {item.SubItems.Count}");
                        
                        // Mark as realized first to prevent re-entry
                        args.Node.HasUnrealizedChildren = false;
                        
                        // Limit items to prevent UI freeze with very large directories
                        const int MAX_ITEMS = 1000;
                        int itemsToShow = Math.Min(item.SubItems.Count, MAX_ITEMS);
                        
                        if (item.SubItems.Count > MAX_ITEMS)
                        {
                            LogToFile($"WARNING: Directory has {item.SubItems.Count} items, limiting to {MAX_ITEMS}");
                        }
                        
                        // Create nodes
                        var nodesToAdd = new List<TreeViewNode>();
                        for (int i = 0; i < itemsToShow; i++)
                        {
                            nodesToAdd.Add(CreateTreeNode(item.SubItems[i]));
                        }
                        
                        LogToFile($"Created {nodesToAdd.Count} child nodes, now adding to tree");
                        
                        // Add all at once
                        foreach (var node in nodesToAdd)
                        {
                            args.Node.Children.Add(node);
                        }
                        
                        // Add a note if items were limited
                        if (item.SubItems.Count > MAX_ITEMS)
                        {
                            var moreItem = new DirectoryItem
                            {
                                Name = $"... and {item.SubItems.Count - MAX_ITEMS} more items (showing top {MAX_ITEMS} by size)",
                                Path = item.Path,
                                IsDirectory = false
                            };
                            var moreNode = new TreeViewNode { Content = moreItem };
                            args.Node.Children.Add(moreNode);
                        }
                        
                        LogToFile($"Successfully added {nodesToAdd.Count} child nodes");
                    }
                    else
                    {
                        LogToFile("ERROR: Content is not DirectoryItem!");
                    }
                    
                    LogToFile("Expansion complete");
                }
            }
            catch (Exception ex)
            {
                LogToFile($"ERROR in Expanding: {ex.Message}");
                LogToFile($"Stack trace: {ex.StackTrace}");
            }
        }

        private void MainGrid_Loaded(object sender, RoutedEventArgs e)
        {
            EntranceAnimation.Begin();
        }
        
        private void LogToFile(string message)
        {
            try
            {
                var logPath = System.IO.Path.Combine(
                    Environment.GetFolderPath(Environment.SpecialFolder.Desktop),
                    "TreeSizeLite_Debug.log"
                );
                System.IO.File.AppendAllText(logPath, $"{DateTime.Now:HH:mm:ss.fff} - {message}\n");
            }
            catch { }
        }

        private string FormatSize(long bytes)
        {
            string[] sizes = { "B", "KB", "MB", "GB", "TB" };
            double len = bytes;
            int order = 0;
            while (len >= 1024 && order < sizes.Length - 1)
            {
                order++;
                len = len / 1024;
            }
            return $"{len:0.##} {sizes[order]}";
        }

        private async void FolderTreeView_SelectionChanged(TreeView sender, TreeViewSelectionChangedEventArgs args)
        {
            if (sender.SelectedNode?.Content is DirectoryItem item)
            {
                // Show Loading Skeleton
                ShowDetailsLoading(true);

                // Artificial delay for premium feel
                await Task.Delay(200);

                UpdateDetailsPanel(item);

                // Hide Skeleton
                ShowDetailsLoading(false);
            }
        }

        private void ShowDetailsLoading(bool isLoading)
        {
            if (isLoading)
            {
                DetailsScrollViewer.Visibility = Visibility.Collapsed;
                DetailsLoadingSkeleton.Visibility = Visibility.Visible;
                SkeletonPulseAnimation.Begin();
            }
            else
            {
                SkeletonPulseAnimation.Stop();
                DetailsLoadingSkeleton.Visibility = Visibility.Collapsed;
                DetailsScrollViewer.Visibility = Visibility.Visible;
                
                // Entrance animation for content
                var anim = new Microsoft.UI.Xaml.Media.Animation.DoubleAnimation
                {
                    From = 0,
                    To = 1,
                    Duration = TimeSpan.FromMilliseconds(200),
                    EasingFunction = new Microsoft.UI.Xaml.Media.Animation.CubicEase { EasingMode = Microsoft.UI.Xaml.Media.Animation.EasingMode.EaseOut }
                };
                var sb = new Microsoft.UI.Xaml.Media.Animation.Storyboard();
                Microsoft.UI.Xaml.Media.Animation.Storyboard.SetTarget(anim, DetailsScrollViewer);
                Microsoft.UI.Xaml.Media.Animation.Storyboard.SetTargetProperty(anim, "Opacity");
                sb.Children.Add(anim);
                sb.Begin();
            }
        }

        private void UpdateDetailsPanel(DirectoryItem item)
        {
            DetailNameText.Text = item.Name;
            DetailPathText.Text = item.Path;
            DetailSizeText.Text = FormatSize(item.Size);
            DetailFilesText.Text = $"{item.FileCount:N0}";
            DetailFoldersText.Text = $"{item.FolderCount:N0}";
            
            // Update Chart
            UsageChart.SetData(item.Percentage);
            
            DetailUsageText.Text = $"{item.Percentage:0.#}% of parent";
        }

        private void TreeItem_PointerEntered(object sender, Microsoft.UI.Xaml.Input.PointerRoutedEventArgs e)
        {
            if (sender is Grid grid)
            {
                grid.Background = new SolidColorBrush(Microsoft.UI.Colors.LightGray) { Opacity = 0.3 };
            }
        }

        private void TreeItem_PointerExited(object sender, Microsoft.UI.Xaml.Input.PointerRoutedEventArgs e)
        {
            if (sender is Grid grid)
            {
                grid.Background = new SolidColorBrush(Microsoft.UI.Colors.Transparent);
            }
        }

        private async void TreeItem_RightTapped(object sender, Microsoft.UI.Xaml.Input.RightTappedRoutedEventArgs e)
        {
            if (sender is Grid grid && grid.DataContext is TreeViewNode node && node.Content is DirectoryItem item)
            {
                var menu = new MenuFlyout();
                
                // Open in Explorer
                var openItem = new MenuFlyoutItem { Text = "Open in Explorer", Icon = new FontIcon { Glyph = "\uE8DA" } };
                openItem.Click += (s, args) =>
                {
                    try
                    {
                        System.Diagnostics.Process.Start("explorer.exe", item.Path);
                    }
                    catch { }
                };
                menu.Items.Add(openItem);
                
                // Copy Path
                var copyItem = new MenuFlyoutItem { Text = "Copy Path", Icon = new FontIcon { Glyph = "\uE8C8" } };
                copyItem.Click += (s, args) =>
                {
                    var dataPackage = new Windows.ApplicationModel.DataTransfer.DataPackage();
                    dataPackage.SetText(item.Path);
                    Windows.ApplicationModel.DataTransfer.Clipboard.SetContent(dataPackage);
                };
                menu.Items.Add(copyItem);
                
                menu.Items.Add(new MenuFlyoutSeparator());
                
                // Properties
                var propsItem = new MenuFlyoutItem { Text = "Properties", Icon = new FontIcon { Glyph = "\uE946" } };
                propsItem.Click += async (s, args) =>
                {
                    var dialog = new ContentDialog
                    {
                        Title = "Folder Properties",
                        Content = $"Path: {item.Path}\nSize: {FormatSize(item.Size)}\nFiles: {item.FileCount:N0}\nFolders: {item.FolderCount:N0}",
                        CloseButtonText = "OK",
                        XamlRoot = this.XamlRoot
                    };
                    await dialog.ShowAsync();
                };
                menu.Items.Add(propsItem);
                
                menu.ShowAt(grid, e.GetPosition(grid));
            }
        }

        private void TreeItem_DoubleTapped(object sender, Microsoft.UI.Xaml.Input.DoubleTappedRoutedEventArgs e)
        {
            if (sender is Grid grid && grid.DataContext is TreeViewNode node)
            {
                // Toggle expansion state
                node.IsExpanded = !node.IsExpanded;
                e.Handled = true; // Prevent default behavior
            }
        }

        private DirectoryItem _rootItem; // Store root for search/sort

        private void SearchBox_TextChanged(AutoSuggestBox sender, AutoSuggestBoxTextChangedEventArgs args)
        {
            if (args.Reason == AutoSuggestionBoxTextChangeReason.UserInput)
            {
                var searchText = sender.Text.ToLower().Trim();
                
                if (string.IsNullOrWhiteSpace(searchText))
                {
                    // Clear search - restore full tree
                    if (_rootItem != null)
                    {
                        RebuildTree(_rootItem);
                    }
                    return;
                }
                
                // Filter tree based on search
                if (_rootItem != null)
                {
                    var filteredItem = FilterItem(_rootItem, searchText);
                    if (filteredItem != null)
                    {
                        RebuildTree(filteredItem);
                    }
                }
            }
        }

        private DirectoryItem FilterItem(DirectoryItem item, string searchText)
        {
            // Check if this item matches
            bool matches = item.Name.ToLower().Contains(searchText);
            
            // Filter children
            var filteredChildren = new List<DirectoryItem>();
            foreach (var child in item.SubItems)
            {
                var filteredChild = FilterItem(child, searchText);
                if (filteredChild != null)
                {
                    filteredChildren.Add(filteredChild);
                }
            }
            
            // Include this item if it matches or has matching children
            if (matches || filteredChildren.Count > 0)
            {
                // Return the original item if it matches (preserves SubItems for lazy loading)
                // Only create filtered copy if we need to show partial children
                if (matches && filteredChildren.Count == 0)
                {
                    // Item matches but no children match - return original with all children
                    return item;
                }
                else if (filteredChildren.Count > 0)
                {
                    // Has matching children - create filtered view but preserve original SubItems
                    var filtered = new DirectoryItem
                    {
                        Name = item.Name,
                        Path = item.Path,
                        Size = item.Size,
                        FileCount = item.FileCount,
                        FolderCount = item.FolderCount,
                        Percentage = item.Percentage,
                        IsDirectory = item.IsDirectory
                    };
                    
                    // Add filtered children for display
                    foreach (var child in filteredChildren)
                    {
                        filtered.SubItems.Add(child);
                    }
                    
                    return filtered;
                }
            }
            
            return null;
        }

        private void RebuildTree(DirectoryItem rootItem)
        {
            FolderTreeView.RootNodes.Clear();
            var rootNode = CreateTreeNode(rootItem);
            FolderTreeView.RootNodes.Add(rootNode);
            rootNode.IsExpanded = true;
        }

        private void SortBySize_Click(object sender, RoutedEventArgs e)
        {
            if (_rootItem != null)
            {
                SortItemsBySize(_rootItem);
                RebuildTree(_rootItem);
            }
        }

        private void SortByName_Click(object sender, RoutedEventArgs e)
        {
            if (_rootItem != null)
            {
                SortItemsByName(_rootItem);
                RebuildTree(_rootItem);
            }
        }

        private void SortByFileCount_Click(object sender, RoutedEventArgs e)
        {
            if (_rootItem != null)
            {
                SortItemsByFileCount(_rootItem);
                RebuildTree(_rootItem);
            }
        }

        private void SortItemsBySize(DirectoryItem item)
        {
            var sorted = item.SubItems.OrderByDescending(x => x.Size).ToList();
            item.SubItems.Clear();
            foreach (var sub in sorted)
            {
                item.SubItems.Add(sub);
                SortItemsBySize(sub); // Recursively sort children
            }
        }

        private void SortItemsByName(DirectoryItem item)
        {
            var sorted = item.SubItems.OrderBy(x => x.Name).ToList();
            item.SubItems.Clear();
            foreach (var sub in sorted)
            {
                item.SubItems.Add(sub);
                SortItemsByName(sub); // Recursively sort children
            }
        }

        private void SortItemsByFileCount(DirectoryItem item)
        {
            var sorted = item.SubItems.OrderByDescending(x => x.FileCount).ToList();
            item.SubItems.Clear();
            foreach (var sub in sorted)
            {
                item.SubItems.Add(sub);
                SortItemsByFileCount(sub); // Recursively sort children
            }
        }

        private async void Export_Click(object sender, RoutedEventArgs e)
        {
            try
            {
                var savePicker = new Windows.Storage.Pickers.FileSavePicker();
                savePicker.SuggestedStartLocation = Windows.Storage.Pickers.PickerLocationId.DocumentsLibrary;
                savePicker.FileTypeChoices.Add("CSV File", new List<string>() { ".csv" });
                savePicker.SuggestedFileName = $"TreeSize_{DateTime.Now:yyyyMMdd_HHmmss}";

                var hwnd = WindowNative.GetWindowHandle(App.MainWindow);
                WinRT.Interop.InitializeWithWindow.Initialize(savePicker, hwnd);

                var file = await savePicker.PickSaveFileAsync();
                if (file != null)
                {
                    await ExportToCSV(file);
                    
                    var dialog = new ContentDialog
                    {
                        Title = "Export Complete",
                        Content = $"Data exported to:\n{file.Path}",
                        CloseButtonText = "OK",
                        XamlRoot = this.XamlRoot
                    };
                    await dialog.ShowAsync();
                }
            }
            catch (Exception ex)
            {
                LogToFile($"Export error: {ex.Message}");
            }
        }

        private async System.Threading.Tasks.Task ExportToCSV(Windows.Storage.StorageFile file)
        {
            var csv = new System.Text.StringBuilder();
            csv.AppendLine("Path,Name,Size (Bytes),Size,Files,Folders,Percentage");

            // Export root and all children recursively
            if (FolderTreeView.RootNodes.Count > 0)
            {
                var rootNode = FolderTreeView.RootNodes[0];
                if (rootNode.Content is DirectoryItem rootItem)
                {
                    ExportNodeToCSV(rootItem, csv);
                }
            }

            await Windows.Storage.FileIO.WriteTextAsync(file, csv.ToString());
        }

        private void ExportNodeToCSV(DirectoryItem item, System.Text.StringBuilder csv)
        {
            var sizeFmt = FormatSize(item.Size);
            csv.AppendLine($"\"{item.Path}\",\"{item.Name}\",{item.Size},\"{sizeFmt}\",{item.FileCount},{item.FolderCount},{item.Percentage:F2}");

            foreach (var subItem in item.SubItems)
            {
                ExportNodeToCSV(subItem, csv);
            }
        }
        private void Card_PointerEntered(object sender, Microsoft.UI.Xaml.Input.PointerRoutedEventArgs e)
        {
            if (sender is Border border && border.RenderTransform is CompositeTransform transform)
            {
                var sb = new Microsoft.UI.Xaml.Media.Animation.Storyboard();
                
                var animX = new Microsoft.UI.Xaml.Media.Animation.DoubleAnimation
                {
                    To = 1.02,
                    Duration = TimeSpan.FromMilliseconds(200),
                    EasingFunction = new Microsoft.UI.Xaml.Media.Animation.CubicEase { EasingMode = Microsoft.UI.Xaml.Media.Animation.EasingMode.EaseOut }
                };
                Microsoft.UI.Xaml.Media.Animation.Storyboard.SetTarget(animX, transform);
                Microsoft.UI.Xaml.Media.Animation.Storyboard.SetTargetProperty(animX, "ScaleX");
                sb.Children.Add(animX);

                var animY = new Microsoft.UI.Xaml.Media.Animation.DoubleAnimation
                {
                    To = 1.02,
                    Duration = TimeSpan.FromMilliseconds(200),
                    EasingFunction = new Microsoft.UI.Xaml.Media.Animation.CubicEase { EasingMode = Microsoft.UI.Xaml.Media.Animation.EasingMode.EaseOut }
                };
                Microsoft.UI.Xaml.Media.Animation.Storyboard.SetTarget(animY, transform);
                Microsoft.UI.Xaml.Media.Animation.Storyboard.SetTargetProperty(animY, "ScaleY");
                sb.Children.Add(animY);

                sb.Begin();
            }
        }

        private void Card_PointerExited(object sender, Microsoft.UI.Xaml.Input.PointerRoutedEventArgs e)
        {
            if (sender is Border border && border.RenderTransform is CompositeTransform transform)
            {
                var sb = new Microsoft.UI.Xaml.Media.Animation.Storyboard();

                var animX = new Microsoft.UI.Xaml.Media.Animation.DoubleAnimation
                {
                    To = 1.0,
                    Duration = TimeSpan.FromMilliseconds(200),
                    EasingFunction = new Microsoft.UI.Xaml.Media.Animation.CubicEase { EasingMode = Microsoft.UI.Xaml.Media.Animation.EasingMode.EaseOut }
                };
                Microsoft.UI.Xaml.Media.Animation.Storyboard.SetTarget(animX, transform);
                Microsoft.UI.Xaml.Media.Animation.Storyboard.SetTargetProperty(animX, "ScaleX");
                sb.Children.Add(animX);

                var animY = new Microsoft.UI.Xaml.Media.Animation.DoubleAnimation
                {
                    To = 1.0,
                    Duration = TimeSpan.FromMilliseconds(200),
                    EasingFunction = new Microsoft.UI.Xaml.Media.Animation.CubicEase { EasingMode = Microsoft.UI.Xaml.Media.Animation.EasingMode.EaseOut }
                };
                Microsoft.UI.Xaml.Media.Animation.Storyboard.SetTarget(animY, transform);
                Microsoft.UI.Xaml.Media.Animation.Storyboard.SetTargetProperty(animY, "ScaleY");
                sb.Children.Add(animY);

                sb.Begin();
            }
        }

        private void Theme_Click(object sender, RoutedEventArgs e)
        {
            if (sender is MenuFlyoutItem item && item.Tag is string themeTag)
            {
                if (Enum.TryParse<ElementTheme>(themeTag, out var theme))
                {
                    // Apply to Root Content
                    if (this.Content is FrameworkElement root)
                    {
                        root.RequestedTheme = theme;
                    }
                }
            }
        }
    }
}
