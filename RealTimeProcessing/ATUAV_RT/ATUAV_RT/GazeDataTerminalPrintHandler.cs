using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Tobii.Eyetracking.Sdk;
using Tobii.Eyetracking.Sdk.Time;

namespace ATUAV_RT
{
    /// <summary>
    /// GazeDataHandler that prints all events to console.
    /// When subscribed to fixation events, also prints them to console.
    /// </summary>
    class GazeDataConsolePrintHandler : GazeDataHandler
    {
        public GazeDataConsolePrintHandler(SyncManager syncManager) : base(syncManager)
        {
        }

        /// <summary>
        /// Writes (X, Y) coordinate of gaze point to console if CPU and eyetracker clocks are synchronized.
        /// 
        /// Detailed explanation of synchronization available in Tobii SDK 3.0 Developer Guide.
        /// http://www.tobii.com/Global/Analysis/Downloads/User_Manuals_and_Guides/Tobii%20SDK%203.0%20Release%20Candidate%201%20Developers%20Guide.pdf
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        public override void GazeDataReceived(object sender, GazeDataEventArgs e)
        {
            if (syncManager.SyncState.StateFlag == SyncStateFlag.Synchronized)
            {
                Console.WriteLine("GazeData - (" + e.GazeDataItem.LeftEyePosition3D.X + ", " + e.GazeDataItem.LeftEyePosition3D.Y + ")");
            }
        }

        /// <summary>
        /// Writes fixation data to console if CPU and eyetracker clocks are synchronized.
        /// 
        /// Detailed explanation of synchronization available in Tobii SDK 3.0 Developer Guide.
        /// http://www.tobii.com/Global/Analysis/Downloads/User_Manuals_and_Guides/Tobii%20SDK%203.0%20Release%20Candidate%201%20Developers%20Guide.pdf
        /// </summary>
        /// <param name="time"></param>
        /// <param name="duration"></param>
        /// <param name="x"></param>
        /// <param name="y"></param>
        public void FixationEnd(int time, int duration, int x, int y)
        {
            if (syncManager.SyncState.StateFlag == SyncStateFlag.Synchronized)
            {
                Console.WriteLine("FixationEnd - (" + x + ", " + y + ") for " + duration + "ms");
            }
        }
    }
}
