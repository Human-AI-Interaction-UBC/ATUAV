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
    /// Example GazeDataHandler that prints all events to console.
    /// When subscribed to fixation events, also prints them to console.
    /// </summary>
    class ConsolePrinter : GazeDataSynchronizedHandler
    {
        public ConsolePrinter(SyncManager syncManager) : base(syncManager)
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
        protected override void GazeDataReceivedSynchronized(object sender, GazeDataEventArgs e)
        {
            Print(e.GazeDataItem);
        }

        /// <summary>
        /// Writes gaze data information to console.
        /// </summary>
        /// <param name="gazePoint">GazeDataItem to write to console</param>
        protected void Print(GazeDataItem gazePoint)
        {
            DateTime dt = new DateTime(syncManager.RemoteToLocal(gazePoint.TimeStamp));
            Console.WriteLine("GazePoint [" + dt + "] - (" + gazePoint.LeftEyePosition3D.X + ", " + gazePoint.LeftEyePosition3D.Y + ")");
        }

        /// <summary>
        /// Writes fixation data to console if CPU and eyetracker clocks are synchronized.
        /// 
        /// Detailed explanation of synchronization available in Tobii SDK 3.0 Developer Guide.
        /// http://www.tobii.com/Global/Analysis/Downloads/User_Manuals_and_Guides/Tobii%20SDK%203.0%20Release%20Candidate%201%20Developers%20Guide.pdf
        /// </summary>
        /// <param name="time">Fixation start time</param>
        /// <param name="duration">Fixation duration</param>
        /// <param name="x">Fixation X position</param>
        /// <param name="y">Fixation Y position</param>
        public virtual void FixationEnd(int time, int duration, int x, int y)
        {
            Print(time, duration, x, y);
        }

        /// <summary>
        /// Writes fixation information to console.
        /// </summary>
        /// <param name="time">Start time of fixation</param>
        /// <param name="duration">Duration of fixation</param>
        /// <param name="x">X coordinate of fixation</param>
        /// <param name="y">Y coordinate of fixation</param>
        protected void Print(int time, int duration, int x, int y)
        {
            DateTime dt = new DateTime(time);
            Console.WriteLine("Fixation  [" + dt + "] - (" + x + ", " + y + ") for " + duration + "ms");
        }
    }
}
