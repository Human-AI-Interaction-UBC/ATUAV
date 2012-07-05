using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using Emdat;
using Tobii.Eyetracking.Sdk;
using Tobii.Eyetracking.Sdk.Time;
using FixDet;

namespace ATUAV_RT
{
    class EmdatProcessor : GazeDataSynchronizedHandler, WindowingHandler
    {
        private EmdatModule emdat = new EmdatModule();
        private bool collectingData;
        private string aoiFilePath;
        private string aoiDefinitions;
        private LinkedList<SFDFixation> fixations = new LinkedList<SFDFixation>();
        private LinkedList<GazeDataItem> gazePoints = new LinkedList<GazeDataItem>();

        public EmdatProcessor(SyncManager syncManager)
            : base(syncManager)
        {
        }

        /// <summary>
        /// Path to Areas of Interest definitions file.
        /// </summary>
        public string AoiFilePath
        {
            get
            {
                return aoiFilePath;
            }

            set
            {
                aoiFilePath = value;
                readAoiDefinitions();
            }
        }

        private void readAoiDefinitions()
        {
            try
            {
                using (StreamReader sr = new StreamReader(aoiFilePath))
                {
                    aoiDefinitions = sr.ReadToEnd();
                }
            }
            catch (Exception e)
            {
                Console.WriteLine("AOI definitions could not be read: " + e.Message);
            }
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

        /// <summary>
        /// Uses EMDAT to process gaze point, fixation, and AOI data
        /// and generate features.
        /// </summary>
        /// <param name="keepData">If true, collected data is kept for next window. Otherwise data is cleared.</param>
        public void ProcessWindow(bool keepData)
        {
            lock (this)
            {
                string features = emdat.GenerateFeatures("segment_id", "raw_gaze_points", "raw_fixations", aoiDefinitions);

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
