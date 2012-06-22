using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Tobii.Eyetracking.Sdk;
using Tobii.Eyetracking.Sdk.Time;

namespace ATUAV_RT
{
    /// <summary>
    /// Base class for GazeDataHandlers that only act when CPU/eyetracker clocks
    /// are synchronized (i.e. that the timestamp of an eyetracker event can be
    /// accurately compared to a timestampt of a CPU event).
    /// </summary>
    abstract class GazeDataSynchronizedHandler : GazeDataHandler
    {
        public GazeDataSynchronizedHandler(SyncManager syncManager)
            : base(syncManager)
        {
        }

        /// <summary>
        /// Ensures synchronization before handling receive gaze data
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e">Contains the gaze data item</param>
        public override void GazeDataReceived(object sender, GazeDataEventArgs e)
        {
            if (syncManager.SyncState.StateFlag == SyncStateFlag.Synchronized)
            {
                GazeDataReceivedSynchronized(sender, e);
            }
        }

        /// <summary>
        /// Method to implement that handles the received eyetracker gaze data.
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e">Contains the gaze data item</param>
        protected abstract void GazeDataReceivedSynchronized(object sender, GazeDataEventArgs e);
    }
}
