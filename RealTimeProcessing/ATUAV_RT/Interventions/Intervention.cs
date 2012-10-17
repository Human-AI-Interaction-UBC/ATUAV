using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Tobii.Eyetracking.Sdk.Time;

namespace ATUAV_RT
{
    /// <summary>
    /// Base class for rule based interventions.
    /// </summary>
    public abstract class Intervention : GazeDataHandler
    {
        public Intervention(SyncManager syncManager) : base(syncManager) {
            
        }

        /// <summary>
        /// Returns true if this intervention has met all requirements to be triggered.
        /// </summary>
        public abstract bool Trigger { get; }

        /// <summary>
        /// Resets the conditions for trigerring this intervention.
        /// </summary>
        public abstract void Reset();
    }
}
