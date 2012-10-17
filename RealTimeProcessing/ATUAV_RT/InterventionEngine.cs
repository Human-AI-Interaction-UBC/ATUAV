using System;
using System.Collections.Generic;
using System.Text;

namespace ATUAV_RT
{
    /// <summary>
    /// Based on features decides what (if any) intervention to use.
    /// </summary>
    public class InterventionEngine
    {
        String currentEyetracker = "TT120-204-80900268";
        Dictionary<String, EmdatProcessor> processors = new Dictionary<String, EmdatProcessor>();

        /// <summary>
        /// Eyetracker unique ProductId
        /// Engine must have a connection to the eyetracker in question or it won't select it.
        /// </summary>
        public String CurrentEyetracker
        {
            get
            {
                return currentEyetracker;
            }

            set
            {
                if (!processors.ContainsKey(value)) {
                    currentEyetracker = value;
                }
            }
        }

        public EmdatProcessor CurrentProcessor
        {
            get
            {
                return processors[currentEyetracker];
            }
        }

        public Dictionary<String, EmdatProcessor> Processors
        {
            get
            {
                return processors;
            }
        }

        public string GetIntervention(string callback)
        {
            // TODO
            return null;
        }

        public string GetFeatures(string callback)
        {
            IDictionary<object, object> features = CurrentProcessor.ProcessWindow();
            
            // sort by key
            String[] sortedFeatures = new String[features.Count];
            features.Keys.CopyTo(sortedFeatures, 0);
            Array.Sort(sortedFeatures);

            // convert to JSON
            StringBuilder sb = new StringBuilder();
            foreach (String feature in sortedFeatures)
            {
                sb.Append("\"" + feature + "\": \"" + features[feature] + "\",");
            }

            return callback + "({" + sb.ToString().Remove(sb.Length-1) + "})";
        }
    }
}
