using System.Collections.ObjectModel;
using System.ComponentModel;
using System.Runtime.CompilerServices;

namespace TreeSizeLite.Models
{
    public class DirectoryItem : INotifyPropertyChanged
    {
        private string _name;
        private string _path;
        private long _size;
        private long _fileCount;
        private long _folderCount;
        private ObservableCollection<DirectoryItem> _subItems;

        public string Name
        {
            get => _name;
            set { _name = value; OnPropertyChanged(); }
        }

        public string Path
        {
            get => _path;
            set { _path = value; OnPropertyChanged(); }
        }

        public long Size
        {
            get => _size;
            set { _size = value; OnPropertyChanged(); }
        }

        public long FileCount
        {
            get => _fileCount;
            set { _fileCount = value; OnPropertyChanged(); }
        }

        public long FolderCount
        {
            get => _folderCount;
            set { _folderCount = value; OnPropertyChanged(); }
        }

        public double Percentage { get; set; }

        public bool IsDirectory { get; set; } = true;

        public ObservableCollection<DirectoryItem> SubItems
        {
            get => _subItems ??= new ObservableCollection<DirectoryItem>();
            set { _subItems = value; OnPropertyChanged(); }
        }

        public event PropertyChangedEventHandler PropertyChanged;

        protected void OnPropertyChanged([CallerMemberName] string propertyName = null)
        {
            PropertyChanged?.Invoke(this, new PropertyChangedEventArgs(propertyName));
        }
    }
}
