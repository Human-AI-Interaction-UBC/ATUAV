using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Tobii.Eyetracking.Sdk;
using Tobii.Eyetracking.Sdk.Time;

namespace ATUAV_RT
{
    abstract class GazeDataHandler
    {
        protected readonly SyncManager syncManager;

        public GazeDataHandler(SyncManager syncManager)
        {
            this.syncManager = syncManager;
        }

        public abstract void GazeDataReceived(object sender, GazeDataEventArgs e);
    }
}
