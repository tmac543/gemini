using Microsoft.UI;
using Microsoft.UI.Xaml;
using Microsoft.UI.Xaml.Controls;
using Microsoft.UI.Xaml.Media;
using Microsoft.UI.Xaml.Media.Animation;
using Microsoft.UI.Xaml.Shapes;
using System;
using System.Collections.Generic;
using Windows.UI;
using Path = Microsoft.UI.Xaml.Shapes.Path;

namespace TreeSizeLite.Controls
{
    public sealed partial class DonutChart : UserControl
    {
        public DonutChart()
        {
            this.InitializeComponent();
        }

        public static readonly DependencyProperty PercentageProperty =
            DependencyProperty.Register("Percentage", typeof(double), typeof(DonutChart), new PropertyMetadata(0.0, OnPercentageChanged));

        public double Percentage
        {
            get { return (double)GetValue(PercentageProperty); }
            set { SetValue(PercentageProperty, value); }
        }

        private static void OnPercentageChanged(DependencyObject d, DependencyPropertyChangedEventArgs e)
        {
            if (d is DonutChart chart)
            {
                chart.UpdateChart((double)e.NewValue);
            }
        }

        public void SetData(double targetPercentage)
        {
            // Animate to new value
            var anim = new DoubleAnimation
            {
                From = Percentage,
                To = targetPercentage,
                Duration = TimeSpan.FromMilliseconds(600),
                EasingFunction = new CubicEase { EasingMode = EasingMode.EaseOut },
                EnableDependentAnimation = true
            };

            var sb = new Storyboard();
            Storyboard.SetTarget(anim, this);
            Storyboard.SetTargetProperty(anim, "Percentage");
            sb.Children.Add(anim);
            sb.Begin();
        }

        private void UpdateChart(double percentage)
        {
            ChartCanvas.Children.Clear();
            
            // Background Circle (Track)
            var track = new Path
            {
                Stroke = new SolidColorBrush(Colors.LightGray) { Opacity = 0.3 },
                StrokeThickness = 20,
                Data = GetCircleGeometry()
            };
            ChartCanvas.Children.Add(track);

            // Progress Arc
            if (percentage > 0)
            {
                var progress = new Path
                {
                    Stroke = (Brush)Application.Current.Resources["ProgressGradientBrush"],
                    StrokeThickness = 20,
                    StrokeStartLineCap = PenLineCap.Round,
                    StrokeEndLineCap = PenLineCap.Round,
                    Data = GetArcGeometry(percentage)
                };
                ChartCanvas.Children.Add(progress);
            }

            CenterText.Text = $"{percentage:0.0}%";
        }

        private Geometry GetCircleGeometry()
        {
            return new EllipseGeometry
            {
                Center = new Windows.Foundation.Point(100, 100),
                RadiusX = 90,
                RadiusY = 90
            };
        }

        private Geometry GetArcGeometry(double percentage)
        {
            double angle = percentage * 3.6;
            if (angle >= 360) angle = 359.9; // Avoid full circle disappearance issue in legacy arc logic

            double radius = 90;
            double center = 100;
            
            double angleRad = (angle - 90) * Math.PI / 180;
            double x = center + radius * Math.Cos(angleRad);
            double y = center + radius * Math.Sin(angleRad);

            var pathGeometry = new PathGeometry();
            var pathFigure = new PathFigure
            {
                StartPoint = new Windows.Foundation.Point(center, center - radius),
                IsClosed = false
            };
            
            var arcSegment = new ArcSegment
            {
                Point = new Windows.Foundation.Point(x, y),
                Size = new Windows.Foundation.Size(radius, radius),
                IsLargeArc = angle > 180,
                SweepDirection = SweepDirection.Clockwise,
                RotationAngle = 0
            };

            pathFigure.Segments.Add(arcSegment);
            pathGeometry.Figures.Add(pathFigure);
            
            return pathGeometry;
        }
    }
}
