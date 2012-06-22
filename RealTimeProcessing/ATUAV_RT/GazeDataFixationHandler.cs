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
    class GazeDataFixationHandler : GazeDataSynchronizedHandler
    {
        private readonly FixDetector fixationDetector;

        /// <summary>
        /// Initializes default fixation detector to Tobii Studio default **TODO**
        /// Analyzer = EFDAnalyzer.fdaFixationSize
        /// Filter = EFDFilter.fdfAveraging
        /// </summary>
        /// <param name="syncManager"></param>
        public GazeDataFixationHandler(SyncManager syncManager) : base(syncManager)
        {
            fixationDetector = new FixDetectorClass();
            fixationDetector.init();

            // TODO determine settings of Tobii Studio fixation detector
            fixationDetector.Analyzer = EFDAnalyzer.fdaFixationSize;
            fixationDetector.Filter = EFDFilter.fdfAveraging;
            // fixationDetector.FilterBufferSize =
            // fixationDetector.FilterWeight =
            // fixationDetector.MinFixDuration =
            // fixationDetector.UpdateInterval =
        }

        ~GazeDataFixationHandler()
        {
            fixationDetector.finalize();
        }

        /// <summary>
        /// Real-time fixation detector. Results available by subscription to FixationEnd, 
        /// FixationStart, and FixationUpdate events.
        /// </summary>
        public FixDetector FixationDetector
        {
            get
            {
                return fixationDetector;
            }
        }

        int count = 0;//testing

        /// <summary>
        /// Forwards 2D gaze points to fixation detector. Gaze points are only forwarded
        /// if CPU and Eyetracker clocks are synchronized.
        /// 
        /// Detailed explanation of synchronization available in Tobii SDK 3.0 Developer Guide.
        /// http://www.tobii.com/Global/Analysis/Downloads/User_Manuals_and_Guides/Tobii%20SDK%203.0%20Release%20Candidate%201%20Developers%20Guide.pdf
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        protected override void GazeDataReceivedSynchronized(object sender, GazeDataEventArgs e)
        {
            int time = (int)syncManager.RemoteToLocal(e.GazeDataItem.TimeStamp);
            int x = (int)e.GazeDataItem.LeftGazePoint3D.X; // TODO Determine which of LeftGazePoint2D, LeftGazePoint3D, RightGazePoint2D, RightGazePoint3D or combination thereof is same as Tobii Studio
            int y = (int)e.GazeDataItem.LeftGazePoint3D.Y;
            fixationDetector.addPoint(time, x, y);

            // testing
            /*GazeDataItem gdi = e.GazeDataItem;
            Console.WriteLine("GazeDataItem:\r\n" +
                "LeftEyePosition3D         (" + gdi.LeftEyePosition3D.X + ", " + gdi.LeftEyePosition3D.Y + ", " + gdi.LeftEyePosition3D.Z + ")\r\n" +
                "LeftEyePosition3DRelative (" + gdi.LeftEyePosition3DRelative.X + ", " + gdi.LeftEyePosition3DRelative.Y + ", " + gdi.LeftEyePosition3DRelative.Z + ")\r\n" +
                "LeftGazePoint2D           (" + gdi.LeftGazePoint2D.X + ", " + gdi.LeftGazePoint2D.Y + ")\r\n" +
                "LeftGazePoint3D           (" + gdi.LeftGazePoint3D.X + ", " + gdi.LeftGazePoint3D.Y + ", " + gdi.LeftGazePoint3D.Z + ")\r\n" + 
                "RightEyePosition3D         (" + gdi.RightEyePosition3D.X + ", " + gdi.RightEyePosition3D.Y + ", " + gdi.RightEyePosition3D.Z + ")\r\n" +
                "RightEyePosition3DRelative (" + gdi.RightEyePosition3DRelative.X + ", " + gdi.RightEyePosition3DRelative.Y + ", " + gdi.RightEyePosition3DRelative.Z + ")\r\n" +
                "RightGazePoint2D           (" + gdi.RightGazePoint2D.X + ", " + gdi.RightGazePoint2D.Y + ")\r\n" +
                "RightGazePoint3D           (" + gdi.RightGazePoint3D.X + ", " + gdi.RightGazePoint3D.Y + ", " + gdi.RightGazePoint3D.Z + ")");
            count++;*/
        }
    }
}
