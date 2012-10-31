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
    public class FixationDetector : GazeDataSynchronizedHandler
    {
        private static readonly double SCREEN_HEIGHT = 1024; // Tobii T120 Eye Tracker
        private static readonly double SCREEN_WIDTH = 1280;  // Tobii T120 Eye Tracker

        private readonly FixDetector fixationDetector;

        /// <summary>
        /// Initializes fixation detector to Tobii Studio default
        /// </summary>
        /// <param name="syncManager"></param>
        public FixationDetector(SyncManager syncManager) : base(syncManager)
        {
            fixationDetector = new FixDetector();
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
        protected override void GazeDataReceivedSynchronized(object sender, GazeDataItem gazePoint)
        {
            // ignore gaze data with low validity
            if (gazePoint.LeftValidity < 2 || gazePoint.RightValidity < 2)
            {
                // convert timestamp
                long microseconds = syncManager.RemoteToLocal(gazePoint.TimeStamp);
                int milliseconds = (int)(microseconds / 1000);
                int time = milliseconds;
                if (((microseconds / 100) % 10) >= 5) time++; // round

                // convert normalized screen coordinates (float between [0 - 1]) to pixel coordinates
                // coordinates (0, 0) designate the top left corner
                double leftX = gazePoint.LeftGazePoint2D.X * SCREEN_WIDTH;
                double leftY = gazePoint.LeftGazePoint2D.Y * SCREEN_HEIGHT;
                double rightX = gazePoint.RightGazePoint2D.X * SCREEN_WIDTH;
                double rightY = gazePoint.RightGazePoint2D.Y * SCREEN_HEIGHT;

                if (gazePoint.LeftValidity < 2 && gazePoint.RightValidity < 2)
                {
                    // average left and right eyes
                    int x = (int)((leftX + rightX) / 2);
                    int y = (int)((leftY + rightY) / 2);
                    fixationDetector.addPoint(time, x, y);
                }
                else if (gazePoint.LeftValidity < 2)
                {
                    // use only left eye
                    fixationDetector.addPoint(time, (int)leftX, (int)leftY);
                }
                else if (gazePoint.RightValidity < 2)
                {
                    // use only right eye
                    fixationDetector.addPoint(time, (int)rightX, (int)rightY);
                }
            }
        }
    }
}
