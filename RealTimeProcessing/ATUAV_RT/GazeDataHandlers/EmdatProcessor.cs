using System;
using System.Collections.Generic;
using System.Text;
using System.IO;
using FixDet;
using Tobii.Eyetracking.Sdk;
using Tobii.Eyetracking.Sdk.Time;
using IronPython.Hosting;
using Microsoft.Scripting.Hosting;

namespace ATUAV_RT
{
    class EmdatProcessor : GazeDataSynchronizedHandler, WindowingHandler
    {
        private bool collectingData;
        private string aoiFilePath;
        private string aoiDefinitions;
        private int segmentId = 0;
        private LinkedList<SFDFixation> fixations = new LinkedList<SFDFixation>();
        private LinkedList<GazeDataItem> gazePoints = new LinkedList<GazeDataItem>();
        private ScriptEngine engine = Python.CreateEngine();

        public EmdatProcessor(SyncManager syncManager)
            : base(syncManager)
        {
            // add script to sys.path
            string dir = Path.GetDirectoryName("C:\\Documents and Settings\\Admin\\My Documents\\Visual Studio 2008\\Projects\\ATUAV_RT\\RealTimeProcessing\\emdat.py");
            ICollection<string> paths = engine.GetSearchPaths();

            if (!String.IsNullOrEmpty(dir))
            {
                paths.Add(dir);
            }
            else
            {
                paths.Add(Environment.CurrentDirectory);
            }
            engine.SetSearchPaths(paths);
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

        /// <summary>
        /// Auto-incrementing segment counter
        /// </summary>
        private String SegmentId
        {
            get
            {
                return segmentId++.ToString();
            }
        }

        /// <summary>
        /// Converts gaze points into formatted string
        /// </summary>
        private String RawGazePoints
        {
            get
            {
                StringBuilder sb = new StringBuilder();
                foreach (GazeDataItem gazePoint in gazePoints)
                {
                    // TODO verify format
                    sb.AppendLine(gazePoint.LeftEyePosition3D + "\t" + gazePoint.LeftEyePosition3DRelative + "\t" + gazePoint.LeftGazePoint2D + "\t" + gazePoint.LeftGazePoint3D + "\t" + gazePoint.LeftPupilDiameter + "\t" + gazePoint.LeftValidity + "\t" + gazePoint.RightEyePosition3D + "\t" + gazePoint.RightEyePosition3DRelative + "\t" + gazePoint.RightGazePoint2D + "\t" + gazePoint.RightGazePoint3D + "\t" + gazePoint.RightPupilDiameter + "\t" + gazePoint.RightValidity + "\t" + gazePoint.TimeStamp);
                }

                return sb.ToString();
            }
        }

        /// <summary>
        /// Converts fixations into formatted string
        /// </summary>
        private String RawFixations
        {
            get
            {
                StringBuilder sb = new StringBuilder();
                foreach (SFDFixation fixation in fixations)
                {
                    // TODO verify format
                    sb.AppendLine(fixation.Duration + "\t" + fixation.Time + "\t" + fixation.X + "\t" + fixation.Y);
                }

                return sb.ToString();
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
                //dynamic data_structures = engine.Runtime.UseFile("../../../../EMDAT/data_structures.py");
                dynamic emdat = engine.Runtime.UseFile("../../../../emdat.py");
                dynamic features = emdat.generate_features(SegmentId, RawGazePoints, RawFixations, aoiDefinitions);
                // TODO what to do after features have been generated? python cleanup?
                Console.WriteLine(features);

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
