using System;
using System.Collections.Generic;
using System.IO;
using System.Text;
using System.Windows.Forms;
using FixDet;
using IronPython.Hosting;
using IronPython.Runtime;
using Microsoft.Scripting.Hosting;
using Tobii.Eyetracking.Sdk;
using Tobii.Eyetracking.Sdk.Time;

namespace ATUAV_RT
{
    public class EmdatProcessor : GazeDataSynchronizedHandler, WindowingHandler<IDictionary<object, object>>
    {
        private bool collectingData;
        private bool cumulativeData = false;
        private string aoiFilePath;
        private string aoiDefinitions = "";
        private int segmentId = 0;
        private int gazePointNumber = 0;
        private int fixationCounter = 0;
        private LinkedList<SFDFixation> fixations = new LinkedList<SFDFixation>();
        private LinkedList<GazeDataItem> gazePoints = new LinkedList<GazeDataItem>();
        private ScriptEngine engine = Python.CreateEngine();
        private dynamic emdat;

        public EmdatProcessor(SyncManager syncManager)
            : base(syncManager)
        {
            // redirect python stdin/stdout
            engine.Runtime.IO.SetOutput(Console.OpenStandardOutput(), Console.OutputEncoding);
            engine.Runtime.IO.SetErrorOutput(Console.OpenStandardError(), Console.OutputEncoding);

            // set module search paths
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
            
            // import modules
            emdat = engine.ImportModule("emdat");
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
        private object[][] RawGazePoints
        {
            get
            {
                List<object[]> gazePoints = new List<object[]>();
                foreach (GazeDataItem data in this.gazePoints)
                {
                    DateTime timestamp = new DateTime(syncManager.RemoteToLocal(data.TimeStamp) * 10);
                    
                    object[] gp = new object[43];
                    gp[0]  = (int)(data.TimeStamp / 1000 + (data.TimeStamp / 100 % 10 > 5 ? 1 : 0)); // timestamp
                    gp[1]  = timestamp.Hour + ":" + timestamp.Minute + "." + timestamp.Second; // datetimestamp
                    gp[2]  = ""; // datetimestampstartoffset
                    gp[3]  = gazePointNumber++; // number
                    gp[4]  = (float)data.LeftGazePoint2D.X; // gazepointxleft
                    gp[5]  = (float)data.LeftGazePoint2D.Y; // gazepointyleft
                    gp[6]  = (float)data.LeftEyePosition3D.X; // camxleft
                    gp[7]  = (float)data.LeftEyePosition3D.Y; // camyleft
                    gp[8]  = (float)data.LeftEyePosition3D.Z; // distanceleft
                    gp[9]  = data.LeftPupilDiameter; // pupilleft
                    gp[10] = data.LeftValidity; // validityleft
                    gp[11] = (float)data.RightGazePoint2D.X; // gazepointxright
                    gp[12] = (float)data.RightGazePoint2D.Y; // gazepointyright
                    gp[13] = (float)data.RightEyePosition3D.X; // camxright
                    gp[14] = (float)data.RightEyePosition3D.Y; // camyright
                    gp[15] = (float)data.RightEyePosition3D.Z; // distanceright
                    gp[16] = data.RightPupilDiameter; // pupilright
                    gp[17] = data.RightValidity; // validityright
                    gp[18] = ""; // fixationindex
                    gp[19] = data.RightGazePoint2D.X; // gazepointx TODO average both eyes?
                    gp[20] = data.RightGazePoint2D.Y; // gazepointy TODO average both eyes?
                    gp[21] = ""; // event
                    gp[22] = ""; // eventkey
                    gp[23] = ""; // data1
                    gp[24] = ""; // data2
                    gp[25] = ""; // descriptor
                    gp[26] = "ScreenRec"; // stimuliname
                    gp[27] = 0; // stimuliid
                    gp[28] = Screen.PrimaryScreen.Bounds.Width; // mediawidth
                    gp[29] = Screen.PrimaryScreen.Bounds.Height; // mediaheight
                    gp[30] = 0; // mediaposx
                    gp[31] = 0; // mediaposy
                    gp[32] = ""; // mappedfixationpointx
                    gp[33] = ""; // mappedfixationpointy
                    gp[34] = ""; // fixationduration
                    gp[35] = 0; // aoiids
                    gp[36] = "Content"; // aoinames
                    gp[37] = ""; // webgroupimage
                    gp[38] = (int)((data.LeftGazePoint2D.X + data.RightGazePoint2D.X) / 2); // mappedgazedatapointx
                    gp[39] = (int)((data.LeftGazePoint2D.Y + data.RightGazePoint2D.Y) / 2); // mappedgazedatapointy
                    gp[40] = ""; // microsecondtimestamp
                    gp[41] = timestamp; // absolutemicrosecondtimestamp
                    gp[42] = "";
                    gazePoints.Add(gp);
                }
                return gazePoints.ToArray();
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
                    sb.Length = sb.Length - 2; // remove trailing "\r\n"
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
        public IDictionary<object, object> ProcessWindow()
        {
            lock (this)
            {
                IDictionary<object, object> features = emdat.generate_features(SegmentId, RawGazePoints, RawFixations, aoiDefinitions);
                
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
