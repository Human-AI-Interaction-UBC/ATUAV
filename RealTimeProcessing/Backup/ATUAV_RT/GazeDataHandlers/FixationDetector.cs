using System;
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
        private int timestampOffset = -1;

        /// <summary>
        /// Initializes fixation detector to Tobii Studio default
        /// </summary>
        /// <param name="syncManager"></param>
        public FixationDetector(SyncManager syncManager) : base(syncManager)
        {
            fixationDetector = new FixDetectorClass();
            fixationDetector.init();

            // mimic Tobii Fixation Filter
            // Detailed information available in Tobii Studio User Manual 1.X
            // http://www.tobii.com/Global/Analysis/Downloads/User_Manuals_and_Guides/Tobii_Studio1.X_UserManual.pdf
            // as well as the appendix of Olsson, P. 2007. Real-time and offline filters for eye tracking. Msc thesis, KTH Royal Institue of Technology, April 2007.
            fixationDetector.Analyzer = EFDAnalyzer.fdaFixationSize;
            fixationDetector.Filter = EFDFilter.fdfAveraging;
            fixationDetector.setAnalyzerProperty("fixation_radius", 35);
            fixationDetector.setAnalyzerProperty("noise_filter", 1);
            fixationDetector.FilterBufferSize = 5;
            fixationDetector.MinFixDuration = 0;
        }

        ~FixationDetector()
        {
            try
            {
                fixationDetector.finalize();
            }
            catch (Exception)
            {

            }
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
        /// if CPU and Eyetracker clocks are synchronized and validity is &lt 2. If both eyes are valid gaze point coordinates are averaged,
        /// if only one eye is valid, only that eye's gaze point is used.
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e">GazeDataItem to process</param>
        protected override void GazeDataReceivedSynchronized(object sender, GazeDataEventArgs e)
        {
            // ignore gaze data with low validity
            if (e.GazeDataItem.LeftValidity < 2 || e.GazeDataItem.RightValidity < 2)
            {
                // convert timestamp
                long microseconds = e.GazeDataItem.TimeStamp;
                int milliseconds = (int)(microseconds / 1000);
                milliseconds -= getTimestampOffset(milliseconds);
                int time = milliseconds;
                if (((microseconds / 100) % 10) >= 5) time++; // round

                // convert normalized screen coordinates (float between [0 - 1]) to pixel coordinates
                // coordinates (0, 0) designate the top left corner
                double leftX = e.GazeDataItem.LeftGazePoint2D.X * SCREEN_WIDTH;
                double leftY = e.GazeDataItem.LeftGazePoint2D.Y * SCREEN_HEIGHT;
                double rightX = e.GazeDataItem.RightGazePoint2D.X * SCREEN_WIDTH;
                double rightY = e.GazeDataItem.RightGazePoint2D.Y * SCREEN_HEIGHT;

                if (e.GazeDataItem.LeftValidity < 2 && e.GazeDataItem.RightValidity < 2)
                {
                    // average left and right eyes
                    int x = (int)((leftX + rightX) / 2);
                    int y = (int)((leftY + rightY) / 2);
                    fixationDetector.addPoint(time, x, y);
                }
                else if (e.GazeDataItem.LeftValidity < 2)
                {
                    // use only left eye
                    fixationDetector.addPoint(time, (int)leftX, (int)leftY);
                }
                else if (e.GazeDataItem.RightValidity < 2)
                {
                    // use only right eye
                    fixationDetector.addPoint(time, (int)rightX, (int)rightY);
                }
            }
        }

        /// <summary>
        /// Sets the first timestamp to be at time zero, offsets all
        /// subsequent timestamps accordingly.
        /// 
        /// Only call this method when SyncManager is Synchronized.
        /// </summary>
        /// <returns>Offset in milliseconds</returns>
        private int getTimestampOffset(int milliseconds)
        {
            if (timestampOffset == -1)
            {
                timestampOffset = milliseconds;
            }
            return timestampOffset;
        }
    }
}
