using Microsoft.UI;
using Microsoft.UI.Xaml.Data;
using Microsoft.UI.Xaml.Media;
using System;
using Windows.UI;

namespace TreeSizeLite.Converters
{
    public class SizeToColorConverter : IValueConverter
    {
        public object Convert(object value, Type targetType, object parameter, string language)
        {
            if (value is long bytes)
            {
                // Large files (>100MB) = Red
                if (bytes > 100 * 1024 * 1024)
                {
                    return new SolidColorBrush(Color.FromArgb(255, 209, 52, 56)); // #D13438
                }
                // Medium files (>10MB) = Orange
                else if (bytes > 10 * 1024 * 1024)
                {
                    return new SolidColorBrush(Color.FromArgb(255, 255, 140, 0)); // #FF8C00
                }
                // Small files = Green
                else
                {
                    return new SolidColorBrush(Color.FromArgb(255, 16, 124, 16)); // #107C10
                }
            }
            // Default: Accent color
            return new SolidColorBrush(Color.FromArgb(255, 0, 120, 212)); // #0078D4
        }

        public object ConvertBack(object value, Type targetType, object parameter, string language)
        {
            throw new NotImplementedException();
        }
    }
}
