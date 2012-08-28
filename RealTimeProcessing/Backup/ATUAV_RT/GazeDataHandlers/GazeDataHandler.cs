using Tobii.Eyetracking.Sdk;
using Tobii.Eyetracking.Sdk.Time;

namespace ATUAV_RT
{
    /// <summary>
    /// Base class for gaze data event handlers.
    /// Ensures a common structure for synchronizing CPU and eyetracker clocks
    /// and common name for method GazeDataReceived.
    /// </summary>
    abstract class GazeDataHandler
    {
        /// <summary>
        /// Use for checking CPU/eyetracker clock synchronization.
        /// </summary>
        protected readonly SyncManager syncManager;

        public GazeDataHandler(SyncManager syncManager)
        {
            this.syncManager = syncManager;
        }

        /// <summary>
        /// Handles a gaze data received from eyetracker event
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e">Contains the GazeDataItem</param>
        public abstract void GazeDataReceived(object sender, GazeDataEventArgs e);
    }
}
