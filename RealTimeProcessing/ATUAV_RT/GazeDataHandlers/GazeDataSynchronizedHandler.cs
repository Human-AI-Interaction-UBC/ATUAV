using Tobii.Eyetracking.Sdk;
using Tobii.Eyetracking.Sdk.Time;

namespace ATUAV_RT
{
    /// <summary>
    /// Base class for GazeDataHandlers that only act when CPU/eyetracker clocks
    /// are synchronized (i.e. that the timestamp of an eyetracker event can be
    /// accurately compared to a timestampt of a CPU event).
    /// 
    /// Detailed explanation of synchronization available in Tobii SDK 3.0 Developer Guide.
    /// http://www.tobii.com/Global/Analysis/Downloads/User_Manuals_and_Guides/Tobii%20SDK%203.0%20Release%20Candidate%201%20Developers%20Guide.pdf
    /// </summary>
    public abstract class GazeDataSynchronizedHandler : GazeDataHandler
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
        public sealed override void GazeDataReceived(object sender, GazeDataEventArgs e)
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
