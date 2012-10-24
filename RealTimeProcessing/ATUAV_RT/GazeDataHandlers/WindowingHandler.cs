using System;

namespace ATUAV_RT
{
    /// <summary>
    /// Interface for GazeDataHandlers that process data in windows (i.e. data is collected for a time then processed all at once).
    /// The duration of a window is decided outside of the handler.
    /// </summary>
    public interface WindowingHandler
    {
        /// <summary>
        /// If true, window is open and data is being collected.
        /// If false, window is closed and no data is collected.
        /// </summary>
        bool CollectingData
        {
            get;
        }

        /// <summary>
        /// If true, data is cleared at the end of each window.
        /// If false, data is kept between windows.
        /// </summary>
        bool CumulativeData
        {
            get;
            set;
        }

        /// <summary>
        /// Start collecting data.
        /// </summary>
        void StartWindow();

        /// <summary>
        /// Pauses data collection, processes accumulated data and starts a new window. No data events should be dropped during process step.
        /// Some WindowingHandlers return a value, read relevant documentation to determine class.
        /// </summary>
        void ProcessWindow();

        /// <summary>
        /// Stops collecting data. Collected data remains cached and is NOT cleared.
        /// </summary>
        void StopWindow();
    }
}
