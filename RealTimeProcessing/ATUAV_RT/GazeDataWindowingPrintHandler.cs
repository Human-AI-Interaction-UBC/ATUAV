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
    class GazeDataWindowingPrintHandler : GazeDataSynchronizedHandler
    {
        private bool collectingData = false;
        private readonly LinkedList<EyetrackerEvent> events = new LinkedList<EyetrackerEvent>();

        public GazeDataWindowingPrintHandler(SyncManager syncManager)
            : base(syncManager)
        {
        }

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
                events.Clear();
                collectingData = true;
            }
        }

        /// <summary>
        /// Clears the data of one window, prints accumulated data (if doAction=true) and 
        /// starts collecting data in a new window. Unlike calling 
        /// StopWindow(0), PrintData(0), StartWindow(0) in sequence this method will not lose 
        /// any interveening data.
        /// </summary>
        /// <param name="doAction">If true data is printed to console</param>
        public void RenewWindow(bool doAction)
        {
            lock (this)
            {
                if (collectingData && doAction)
                {
                    PrintDataUnsafe();
                }

                events.Clear();
                collectingData = true;
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

        /// <summary>
        /// Prints collected data to console. Does not clear existing data.
        /// </summary>
        public void PrintData()
        {
            lock (this)
            {
                PrintDataUnsafe();
            }
        }

        /// <summary>
        /// Private non-threadsafe method for printing data to console.
        /// </summary>
        private void PrintDataUnsafe()
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
    }
}
