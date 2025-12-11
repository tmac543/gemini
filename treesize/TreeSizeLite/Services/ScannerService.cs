using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using TreeSizeLite.Models;

namespace TreeSizeLite.Services
{
    public class ScannerService
    {
        public async Task<DirectoryItem> ScanAsync(string path, CancellationToken token, IProgress<DirectoryItem> itemProgress = null, IProgress<string> statusProgress = null)
        {
            return await Task.Run(() => ScanIterative(new DirectoryInfo(path), token, itemProgress, statusProgress));
        }

        private DirectoryItem ScanIterative(DirectoryInfo rootInfo, CancellationToken token, IProgress<DirectoryItem> itemProgress, IProgress<string> statusProgress)
        {
            if (token.IsCancellationRequested) return null;

            var rootItem = new DirectoryItem
            {
                Name = rootInfo.Name,
                Path = rootInfo.FullName,
                IsDirectory = true
            };

            var workStack = new Stack<StackItem>();
            workStack.Push(new StackItem { DirInfo = rootInfo, Item = rootItem, State = VisitState.PreVisit });

            while (workStack.Count > 0)
            {
                if (token.IsCancellationRequested) return null;

                var current = workStack.Peek();

                if (current.State == VisitState.PreVisit)
                {
                    current.State = VisitState.PostVisit;
                    
                    statusProgress?.Report($"Scanning: {current.DirInfo.FullName}");
                    
                    try
                    {
                        // Process files
                        try
                        {
                            foreach (var file in current.DirInfo.EnumerateFiles())
                            {
                                current.Item.Size += file.Length;
                                current.Item.FileCount++;
                            }
                        }
                        catch { }

                        // Push children directories
                        foreach (var dir in current.DirInfo.EnumerateDirectories())
                        {
                            try 
                            {
                                if (dir.Attributes.HasFlag(FileAttributes.ReparsePoint)) continue;
                            }
                            catch { continue; }

                            var subItem = new DirectoryItem
                            {
                                Name = dir.Name,
                                Path = dir.FullName,
                                IsDirectory = true
                            };

                            var childStackItem = new StackItem { DirInfo = dir, Item = subItem, State = VisitState.PreVisit };
                            current.Children.Add(childStackItem);
                            workStack.Push(childStackItem);
                        }
                    }
                    catch (UnauthorizedAccessException)
                    {
                        current.Item.Name += " (Access Denied)";
                    }
                    catch { }
                }
                else // PostVisit
                {
                    workStack.Pop();
                    
                    // Aggregate stats from children
                    foreach (var child in current.Children)
                    {
                        current.Item.Size += child.Item.Size;
                        current.Item.FileCount += child.Item.FileCount;
                        current.Item.FolderCount += child.Item.FolderCount + 1;
                        current.Item.SubItems.Add(child.Item);
                    }

                    // Sort
                    var sortedList = current.Item.SubItems.OrderByDescending(x => x.Size).ToList();
                    current.Item.SubItems.Clear();
                    foreach(var s in sortedList) current.Item.SubItems.Add(s);

                    // Compute Percentage
                    if (current.Item.Size > 0)
                    {
                         foreach(var s in current.Item.SubItems)
                         {
                             s.Percentage = (double)s.Size / current.Item.Size * 100.0;
                         }
                    }
                    
                    // Report this completed item for incremental display
                    itemProgress?.Report(current.Item);
                }
            }

            return rootItem;
        }

        private class StackItem
        {
            public DirectoryInfo DirInfo;
            public DirectoryItem Item;
            public VisitState State;
            public List<StackItem> Children = new List<StackItem>();
        }

        private enum VisitState
        {
            PreVisit,
            PostVisit
        }
    }
}
