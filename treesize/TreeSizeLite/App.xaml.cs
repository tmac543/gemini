using Microsoft.UI.Xaml.Navigation;

namespace TreeSizeLite
{
    /// <summary>
    /// Provides application-specific behavior to supplement the default Application class.
    /// </summary>
    public partial class App : Application
    {
        public App()
        {
            this.InitializeComponent();
        }

        public static Window MainWindow { get; private set; }

        protected override void OnLaunched(LaunchActivatedEventArgs e)
        {
            MainWindow = new Window();
            
            // Enable Mica background
            MainWindow.SystemBackdrop = new Microsoft.UI.Xaml.Media.MicaBackdrop();

            if (MainWindow.Content is not Frame rootFrame)
            {
                rootFrame = new Frame();
                rootFrame.NavigationFailed += OnNavigationFailed;
                MainWindow.Content = rootFrame;
            }

            _ = rootFrame.Navigate(typeof(MainPage), e.Arguments);
            
            // Set window title
            MainWindow.Title = "TreeSize Lite";
            
            MainWindow.Activate();
        }

        /// <summary>
        /// Invoked when Navigation to a certain page fails
        /// </summary>
        /// <param name="sender">The Frame which failed navigation</param>
        /// <param name="e">Details about the navigation failure</param>
        void OnNavigationFailed(object sender, NavigationFailedEventArgs e)
        {
            throw new Exception("Failed to load Page " + e.SourcePageType.FullName);
        }
    }
}
