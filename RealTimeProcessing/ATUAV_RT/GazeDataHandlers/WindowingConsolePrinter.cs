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
    /// Example GazeDataHandler that collects gaze data in dynamically sized windows
    /// and prints each window to console.
    /// </summary>
    class WindowingConsolePrinter : GazeDataSynchronizedHandler, WindowingHandler
    {
        private bool collectingData = false;
        private readonly LinkedList<EyetrackerEvent> events = new LinkedList<EyetrackerEvent>();

        public WindowingConsolePrinter(SyncManager syncManager)
            : base(syncManager)
        {
        }

        /// <summary>
        /// Collects gaze point events
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e">Contains gaze data item</param>
        protected override void GazeDataReceivedSynchronized(object sender, GazeDataEventArgs e)
        {
            lock (this)
            {
                if (collectingData)
                {
                    events.AddLast(new EyetrackerEvent(e.GazeDataItem));
                }
            }
        }

        /// <summary>
        /// Collects fixation events
        /// </summary>
        /// <param name="time">Start time of fixation</param>
        /// <param name="duration">Duration of fixation</param>
        /// <param name="x">Fixation Y position</param>
        /// <param name="y">Fixation X position</param>
        public void FixationEnd(int time, int duration, int x, int y)
        {
            lock (this)
            {
                if (collectingData)
                {
                    SFDFixation fixation = new SFDFixation();
                    fixation.Time = time;
                    fixation.Duration = duration;
                    fixation.X = x;
                    fixation.Y = y;

                    events.AddLast(new EyetrackerEvent(fixation));
                }
            }
        }

        /// <summary>
        /// Private non-threadsafe method for printing data to console.
        /// </summary>
        private void PrintData()
        {
            foreach (EyetrackerEvent e in events)
            {
                if (e.GazeDataItem != null)
                {
                    Console.WriteLine("GazeData - (" + e.GazeDataItem.LeftEyePosition3D.X + ", " + e.GazeDataItem.LeftEyePosition3D.Y + ")");
                }
                else
                {
                    Console.WriteLine("FixationEnd - (" + e.Fixation.X + ", " + e.Fixation.Y + ") for " + e.Fixation.Duration + "ms");
                }
            }
            Console.WriteLine();
        }

        #region WindowingHandler Members

        /// <summary>
        /// True if window is open and data is being collected, false otherwise.
        /// </summary>
        public bool CollectingData
        {
            get
            {
                lock (this)
                {
                    return collectingData;
                }
            }
        }

        /// <summary>
        /// Start collecting data in a new window.
        /// Clears any existing data.
        /// </summary>
        public void StartWindow()
        {
            lock (this)
            {
                collectingData = true;
            }
        }

        /// <summary>
        /// Prints the accumulated fixation and gaze data events without dropping intermittent events.
        /// </summary>
        /// <param name="keepData">If true, collected data is kept for next window. Otherwise data is cleared.</param>
        public void ProcessWindow(bool keepData)
        {
            lock (this)
            {
                PrintData();
                if (!keepData)
                {
                    events.Clear();
                }
            }
        }

        /// <summary>
        /// Stops collecting data. Does not clear existing data.
        /// </summary>
        public void StopWindow()
        {
            lock (this)
            {
                collectingData = false;
            }
        }

        #endregion
    }
}
