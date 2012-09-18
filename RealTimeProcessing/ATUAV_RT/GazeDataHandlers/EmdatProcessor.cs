using System;
using System.Collections.Generic;
using System.Drawing;
using System.Text;
using System.IO;
using System.Windows.Forms;
using FixDet;
using Tobii.Eyetracking.Sdk;
using Tobii.Eyetracking.Sdk.Time;
using IronPython.Hosting;
using Microsoft.Scripting.Hosting;
using ATUAV_RT.GazeDataHandlers;

namespace ATUAV_RT
{
    public class EmdatProcessor : GazeDataSynchronizedHandler, WindowingHandler<Dictionary<String, String>>
    {
        private bool collectingData;
        private bool cumulativeData;
        private string aoiFilePath;
        private string aoiDefinitions = "";
        private int segmentId = 0;
        private int gazePointCounter = 0;
        private int fixationCounter = 0;
        private LinkedList<SFDFixation> fixations = new LinkedList<SFDFixation>();
        private LinkedList<GazeDataItem> gazePoints = new LinkedList<GazeDataItem>();
        private ScriptEngine engine = Python.CreateEngine();

        public EmdatProcessor(SyncManager syncManager)
            : base(syncManager)
        {
            // add script to sys.path
            string scriptDir = Path.GetDirectoryName("C:\\Documents and Settings\\Admin\\My Documents\\Visual Studio 2008\\Projects\\ATUAV_RT\\RealTimeProcessing\\emdat.py");
            string emdatDir = Path.GetDirectoryName("C:\\Documents and Settings\\Admin\\My Documents\\Visual Studio 2008\\Projects\\ATUAV_RT\\RealTimeProcessing\\EMDAT\\src\\");
            string pythonDir = Path.GetDirectoryName("C:\\Python26\\Lib\\");
            ICollection<string> paths = engine.GetSearchPaths();

            if (!String.IsNullOrEmpty(scriptDir))
            {
                paths.Add(scriptDir);
                paths.Add(emdatDir);
                paths.Add(pythonDir);
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
                    long ms = gp.TimeStamp / 1000 + (gp.TimeStamp / 100 % 10 > 5 ? 1 : 0); // convert micro to milliseconds
                    DateTime timestamp = new DateTime(syncManager.RemoteToLocal(gp.TimeStamp) * 10);
                    string dateTimeStamp = timestamp.Hour + ":" + timestamp.Minute + "." + timestamp.Second;
                    double mappedGazeDataPointX = (gp.LeftGazePoint2D.X + gp.RightGazePoint2D.X) / 2;
                    double mappedGazeDataPointY = (gp.LeftGazePoint2D.Y + gp.RightGazePoint2D.Y) / 2;
                    
                    // [self.timestamp, self.datetimestamp, self.datetimestampstartoffset, self.number, self.gazepointxleft, self.gazepointyleft, self.camxleft, self.camyleft, self.distanceleft, self.pupilleft, self.validityleft, self.gazepointxright, self.gazepointyright, self.camxright, self.camyright, self.distanceright, self.pupilright, self.validityright, self.fixationindex, self.gazepointx, self.gazepointy,                                                                                                                                                                    self.event, self.eventkey, self.data1, self.data2, self.descriptor, self.stimuliname, self.stimuliid, self.mediawidth, self.mediaheight, self.mediaposx, self.mediaposy, self.mappedfixationpointx, self.mappedfixationpointy, self.fixationduration, self.aoiids, self.aoinames, self.webgroupimage, self.mappedgazedatapointx, self.mappedgazedatapointy, self.microsecondtimestamp, self.absolutemicrosecondtimestamp,_]
                    sb.AppendLine(ms + "\t" + dateTimeStamp + "\t" /*datetimestampstartoffset*/ + "\t" + (gazePointCounter++) + "\t" + gp.LeftGazePoint2D.X + "\t" + gp.LeftGazePoint2D.Y + "\t" + gp.LeftEyePosition3D.X + "\t" + gp.LeftEyePosition3D.Y + "\t" + gp.LeftEyePosition3D.Z + "\t" + gp.LeftPupilDiameter + "\t" + gp.LeftValidity + "\t" + gp.RightGazePoint2D.X + "\t" + gp.RightGazePoint2D.Y + "\t" + gp.RightEyePosition3D.X + "\t" + gp.RightEyePosition3D.Y + "\t" + gp.RightEyePosition3D.Z + "\t" + gp.RightPupilDiameter + "\t" + gp.RightValidity + "\t" /*fixationindex*/ + "\t" + gp.RightGazePoint2D.X + "\t" + gp.RightGazePoint2D.Y + "\t" /*event*/ + "\t" /*eventkey*/ + "\t" /*data1*/ + "\t" /*data2*/ + "\t" /*descriptor*/ + "\tScreenRec\t0\t" + Screen.PrimaryScreen.Bounds.Width + "\t" + Screen.PrimaryScreen.Bounds.Height + "\t0\t0\t" /*mappedfixationpointx*/ + "\t" /*mappedfixationpointy*/ + "\t" /*fixationduration*/ + "\t0\tContent\t" /*webgroupimage*/ + "\t" + mappedGazeDataPointX + "\t" + mappedGazeDataPointY + "\t" /*microsecondtimestamp*/ + "\t" + gp.TimeStamp + "\t");
                }

                if (sb.Length > 0)
                    sb.Remove(sb.Length - 1, 1); // remove trailing "\n"
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
                    // [self.fixationindex, self.timestamp, self.fixationduration, self.mappedfixationpointx, self.mappedfixationpointy,_]
                    sb.AppendLine((fixationCounter++) + "\t" + fixation.Time + "\t" + fixation.Duration + "\t" + fixation.X + "\t" + fixation.Y + "\t");
                }

                if (sb.Length > 0)
                    sb.Remove(sb.Length - 1, 1); // remove trailing "\n"
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

        public bool CumulativeData
        {
            get
            {
                return cumulativeData;
            }

            set
            {
                cumulativeData = value;
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
        public Dictionary<String, String> ProcessWindow()
        {
            lock (this)
            {
                dynamic emdat = engine.Runtime.UseFile("../../../../emdat.py");
                dynamic features = emdat.generate_features(SegmentId, RawGazePoints, RawFixations, aoiDefinitions);

                if (!cumulativeData)
                {
                    fixations.Clear();
                    gazePoints.Clear();
                }

                return features;
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
