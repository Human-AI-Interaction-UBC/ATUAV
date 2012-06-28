using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Python.Runtime;
using Tobii.Eyetracking.Sdk;
using Tobii.Eyetracking.Sdk.Time;
using FixDet;

namespace ATUAV_RT
{
    class EmdatProcessor : GazeDataSynchronizedHandler, WindowingHandler
    {
        static EmdatProcessor()
        {
            PythonEngine.Initialize();
            //PythonEngine.ImportModule("emdat");
        }

        private bool collectingData;
        private LinkedList<SFDFixation> fixations = new LinkedList<SFDFixation>();
        private LinkedList<GazeDataItem> gazePoints = new LinkedList<GazeDataItem>();

        public EmdatProcessor(SyncManager syncManager)
            : base(syncManager)
        {
        }

        protected override void GazeDataReceivedSynchronized(object sender, GazeDataEventArgs e)
        {
            lock (this)
            {
                if (collectingData)
                {
                    gazePoints.AddLast(e.GazeDataItem);
                }
            }
        }

        public void FixationEnd(int time, int duration, int x, int y)
        {
            SFDFixation fix = new SFDFixation();
            fix.Time = time;
            fix.Duration = duration;
            fix.X = x;
            fix.Y = y;

            lock (this)
            {
                if (collectingData)
                {
                    fixations.AddLast(fix);
                }
            }
        }

        #region WindowingHandler Members

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

        public void StartWindow()
        {
            lock (this)
            {
                collectingData = true;
            }
        }

        public void ProcessWindow(bool keepData)
        {
            lock (this)
            {
                // TODO emdat

                if (!keepData)
                {
                    fixations.Clear();
                    gazePoints.Clear();
                }
            }
        }

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
