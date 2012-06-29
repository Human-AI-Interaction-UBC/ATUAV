using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using FixDet;
using Tobii.Eyetracking.Sdk;
using Tobii.Eyetracking.Sdk.Time;

namespace ATUAV_RT
{
    /// <summary>
    /// GazeDataHandler that detects fixations. GazeDataReceived method must be
    /// subscribed to gaze data events for fixations to be detected. Fixation start,
    /// update and end events can be subscribed to through the FixationDetector property.
    /// 
    /// FixDetector written by Oleg Špakov at the University of Tampere in Tampere, Finland.
    /// http://www.sis.uta.fi/~csolsp/projects.php
    /// 
    /// Documentation available through download link above.
    /// </summary>
    class FixationDetector : GazeDataSynchronizedHandler
    {
        private static readonly double SCREEN_HEIGHT = 1024; // Tobii T120 Eye Tracker
        private static readonly double SCREEN_WIDTH = 1280;  // Tobii T120 Eye Tracker

        private readonly FixDetector fixationDetector;

        /// <summary>
        /// Initializes default fixation detector to Tobii Studio default **TODO**
        /// Analyzer = EFDAnalyzer.fdaFixationSize
        /// Filter = EFDFilter.fdfAveraging
        /// </summary>
        /// <param name="syncManager"></param>
        public FixationDetector(SyncManager syncManager) : base(syncManager)
        {
            fixationDetector = new FixDetectorClass();
            fixationDetector.init();

            // TODO determine settings of Tobii Fixation Filter
            fixationDetector.Analyzer = EFDAnalyzer.fdaFixationSize;
            fixationDetector.Filter = EFDFilter.fdfNone;
            fixationDetector.setAnalyzerProperty("fixation_radius", 35);
            fixationDetector.setAnalyzerProperty("noise_filter", 1);
            //fixationDetector.MinFixDuration = 17;

            // alt: Raw Data Filter

            // alt: ClearView Fixation Filter
            /*
            fixationDetector.Analyzer = EFDAnalyzer.fdaFixationSize;
            fixationDetector.Filter = EFDFilter.fdfNone;
            fixationDetector.setAnalyzerProperty("fixation_radius", 50);
            fixationDetector.MinFixDuration = 100;
            */
        }

        ~FixationDetector()
        {
            fixationDetector.finalize();
        }

        /// <summary>
        /// Real-time fixation detector. Results available by subscription to FixationEnd, 
        /// FixationStart, and FixationUpdate events.
        /// </summary>
        public FixDetector FixDetector
        {
            get
            {
                return fixationDetector;
            }
        }

        /// <summary>
        /// Forwards 2D gaze points to fixation detector. Gaze points are only forwarded
        /// if CPU and Eyetracker clocks are synchronized. Gaze point is the average of the left and right gaze points.
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        protected override void GazeDataReceivedSynchronized(object sender, GazeDataEventArgs e)
        {
            int time = (int)syncManager.RemoteToLocal(e.GazeDataItem.TimeStamp);

            // calculate coordinates in pixels (0, 0 is top left corner
            double leftX = e.GazeDataItem.LeftGazePoint2D.X * SCREEN_WIDTH;
            double leftY = e.GazeDataItem.LeftGazePoint2D.Y * SCREEN_HEIGHT;
            double rightX = e.GazeDataItem.RightGazePoint2D.X * SCREEN_WIDTH;
            double rightY = e.GazeDataItem.RightGazePoint2D.Y * SCREEN_HEIGHT;

            // average left and right eyes
            int x = (int) ((leftX + rightX) / 2);
            int y = (int) ((leftY + rightY) / 2);

            fixationDetector.addPoint(time, x, y);
        }
    }
}
