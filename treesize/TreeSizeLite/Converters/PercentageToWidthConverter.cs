using Microsoft.UI.Xaml.Data;
using System;

namespace TreeSizeLite.Converters
{
    public class PercentageToWidthConverter : IValueConverter
    {
        public object Convert(object value, Type targetType, object parameter, string language)
        {
            if (value is double percentage)
            {
                // Assuming container width is 200, calculate proportional width
                return (percentage / 100.0) * 200;
            }
            return 0;
        }

        public object ConvertBack(object value, Type targetType, object parameter, string language)
        {
            throw new NotImplementedException();
        }
    }
}
