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
        private int gazePointCounter = 0;
        private int fixationCounter = 0;
        private LinkedList<SFDFixation> fixations = new LinkedList<SFDFixation>();
        private LinkedList<GazeDataItem> gazePoints = new LinkedList<GazeDataItem>();
        private ScriptEngine engine = Python.CreateEngine();

        public event EventHandler<String> FeaturesGenerated;

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
                foreach (GazeDataItem gp in gazePoints)
                {
                    // TODO verify format
                    // [self.timestamp, self.datetimestamp, self.datetimestampstartoffset, self.number, self.gazepointxleft, self.gazepointyleft, self.camxleft, self.camyleft, self.distanceleft, self.pupilleft, self.validityleft, self.gazepointxright, self.gazepointyright, self.camxright, self.camyright, self.distanceright, self.pupilright, self.validityright, self.fixationindex, self.gazepointx, self.gazepointy,                                                                                                                                                                    self.event, self.eventkey, self.data1, self.data2, self.descriptor, self.stimuliname, self.stimuliid, self.mediawidth, self.mediaheight, self.mediaposx, self.mediaposy, self.mappedfixationpointx, self.mappedfixationpointy, self.fixationduration, self.aoiids, self.aoinames, self.webgroupimage, self.mappedgazedatapointx, self.mappedgazedatapointy, self.microsecondtimestamp, self.absolutemicrosecondtimestamp,_]
                    sb.AppendLine(/*timestamp*/ "\t" + gp.TimeStamp + "\t" /*datetimestampstartoffset*/ + "\t" + (gazePointCounter++) + "\t" + gp.LeftGazePoint2D.X + "\t" + gp.LeftGazePoint2D.Y + "\t" /*camxleft*/ + "\t" /*camyleft*/ + "\t" /*distanceleft*/ + "\t" + gp.LeftPupilDiameter + "\t" + gp.LeftValidity + "\t" + gp.RightGazePoint2D.X + "\t" + gp.RightGazePoint2D.Y + "\t" /*camxright*/ + "\t" /*camyright*/ + "\t" /*distanceright*/ + "\t" + gp.RightPupilDiameter + "\t" + gp.RightValidity + "\t" /*fixationindex*/ + "\t" + gp.RightGazePoint2D.X + "\t" + gp.RightGazePoint2D.Y + "\t" /*event*/ + "\t" /*eventkey*/ + "\t" /*data1*/ + "\t" /*data2*/ + "\t" /*descriptor*/ + "\t" /*stimuliname*/ + "\t" /*stimuliid*/ + "\t" /*mediawidth*/ + "\t" /*mediaheight*/ + "\t" /*mediaposx*/ + "\t" /*mediaposy*/ + "\t" /*mappedfixationpointx*/ + "\t" /*mappedfixationpointy*/ + "\t" /*fixationduration*/ + "\t" /*aoiids*/ + "\t" /*aoinames*/ + "\t" /*webgroupimage*/ + "\t" /*mappedgazedatapointx*/ + "\t" /*mappedgazedatapointy*/ + "\t" /*microsecondtimestamp*/ + "\t" /*absolutemicrosecondtimestamp*/ + "\t");
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
                    // [self.fixationindex, self.timestamp, self.fixationduration, self.mappedfixationpointx, self.mappedfixationpointy,_]
                    sb.AppendLine((fixationCounter++) + "\t" + fixation.Time + "\t" + fixation.Duration + "\t" + fixation.X + "\t" + fixation.Y + "\t");
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
                dynamic emdat = engine.Runtime.UseFile("../../../../emdat.py");
                dynamic features = emdat.generate_features(SegmentId, RawGazePoints, RawFixations, aoiDefinitions);

                // test
                Console.WriteLine(features);
                // test

                if (FeaturesGenerated != null)
                {
                    FeaturesGenerated(this, features);
                }

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
