using System;
using System.Collections.Generic;
using System.IO;
using System.Reflection;
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
    public class EmdatProcessor : GazeDataSynchronizedHandler, WindowingHandler
    {
        private static List<Type> allConditionTypes = null;

        private bool collectingData;
        private bool cumulativeData = false;
        private string aoiDefinitions = "";
        private int segmentId = 0;
        private int gazePointNumber = 0;
        private int fixationCounter = 0;
        private LinkedList<SFDFixation> fixations = new LinkedList<SFDFixation>();
        private LinkedList<GazeDataItem> gazePoints = new LinkedList<GazeDataItem>();
        private ScriptEngine engine = Python.CreateEngine();
        private dynamic emdat;
        private IDictionary<Object, Object> features = new Dictionary<Object, Object>();
		private Dictionary<String, Condition> conditions = new Dictionary<String, Condition>();

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
			
			// add conditions
            foreach (Type type in AllConditionTypes)
            {
                ConstructorInfo info = type.GetConstructor(new[] { typeof(EmdatProcessor) });
                Condition condition = (Condition) info.Invoke(new object[] { this } );
                conditions.Add(condition.Id, condition);
            }
        }

        private static List<Type> AllConditionTypes
        {
            get
            {
                if (allConditionTypes == null)
                {
                    allConditionTypes = new List<Type>();
                    foreach (Type type in Assembly.GetExecutingAssembly().GetTypes())
                    {
                        if (typeof(Condition).IsAssignableFrom(type) && type.IsClass)
                        {
                            allConditionTypes.Add(type);
                        }
                    }
                }
                return allConditionTypes;
            }
        }

        public string AoiDefinitions
        {
            get
            {
                return aoiDefinitions;
            }
            set
            {
                lock(this) 
                {
                    aoiDefinitions = value;
                }
            }
        }

        public IDictionary<Object, Object> Features
        {
            get
            {
                return features;
            }
        }
		
		public Dictionary<String, Condition> Conditions
		{
			get
			{
				return conditions;
			}
		}

        public void ClearData()
        {
            lock (this)
            {
                fixations.Clear();
                gazePoints.Clear();
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
                    long timestamp = syncManager.RemoteToLocal(data.TimeStamp);
                    DateTime time = new DateTime(timestamp * 10);

                    object[] gp = new object[] {
                        (int)(timestamp / 1000 + (timestamp / 100 % 10 > 5 ? 1 : 0)), // timestamp
                        time.Hour + ":" + time.Minute + "." + time.Second, // datetimestamp
                        "", // datetimestampstartoffset
                        gazePointNumber++, // number
                        (float)data.LeftGazePoint2D.X, // gazepointxleft
                        (float)data.LeftGazePoint2D.Y, // gazepointyleft
                        (float)data.LeftEyePosition3D.X, // camxleft
                        (float)data.LeftEyePosition3D.Y, // camyleft
                        (float)data.LeftEyePosition3D.Z, // distanceleft
                        data.LeftPupilDiameter, // pupilleft
                        data.LeftValidity, // validityleft
                        (float)data.RightGazePoint2D.X, // gazepointxright
                        (float)data.RightGazePoint2D.Y, // gazepointyright
                        (float)data.RightEyePosition3D.X, // camxright
                        (float)data.RightEyePosition3D.Y, // camyright
                        (float)data.RightEyePosition3D.Z, // distanceright
                        data.RightPupilDiameter, // pupilright
                        data.RightValidity, // validityright
                        0, // fixationindex
                        (float)data.RightGazePoint2D.X, // gazepointx TODO average both eyes?
                        (float)data.RightGazePoint2D.Y, // gazepointy TODO average both eyes?
                        "", // event
                        "", // eventkey
                        "", // data1
                        "", // data2
                        "", // descriptor
                        "ScreenRec", // stimuliname
                        0, // stimuliid
                        Screen.PrimaryScreen.Bounds.Width, // mediawidth
                        Screen.PrimaryScreen.Bounds.Height, // mediaheight
                        0, // mediaposx
                        0, // mediaposy
                        null, // mappedfixationpointx
                        null, // mappedfixationpointy
                        null, // fixationduration
                        "", // aoiids
                        "Content", // aoinames
                        "", // webgroupimage
                        (int)((data.LeftGazePoint2D.X + data.RightGazePoint2D.X) / 2), // mappedgazedatapointx
                        (int)((data.LeftGazePoint2D.Y + data.RightGazePoint2D.Y) / 2), // mappedgazedatapointy
                        null, // microsecondtimestamp
                        time // absolutemicrosecondtimestamp
                    };
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

        protected override void GazeDataReceivedSynchronized(object sender, GazeDataItem gazePoint)
        {
            lock (this)
            {
                if (collectingData)
                {
                    gazePoints.AddLast(gazePoint);
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
        public void ProcessWindow()
        {
            lock (this)
            {
                try
                {
                    IDictionary<Object, Object> features = emdat.generate_features(SegmentId, RawGazePoints, RawFixations, aoiDefinitions);
                    if (features != null)
                    {
                        this.features = features;
                    }
                    else
                    {
                        this.features.Clear();
                    }
                }
                catch (Exception e)
                {
                    System.Console.WriteLine(e);
                }
                finally
                {
                    if (!cumulativeData)
                    {
                        fixations.Clear();
                        gazePoints.Clear();
                    }
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
