using System;
using System.Collections.Generic;
using System.IO;
using System.ServiceModel.Activation;
using System.Text;

namespace ATUAV_RT
{
    [AspNetCompatibilityRequirements(RequirementsMode = AspNetCompatibilityRequirementsMode.Allowed)]
    public class AtuavWebServiceImp : AtuavWebService
    {
        /// <summary>
        /// Sets the eyetracker to track
        /// </summary>
        /// <param name="productId"></param>
        /// <returns>empty string if successful, error string if unsuccessful</returns>
        public string SetEyetracker(string productId)
        {
            /*Program.InterventionEngine.CurrentEyetracker = productId;
            if (Program.InterventionEngine.CurrentEyetracker != productId)
            {
                return "error: eyetracker not connected";
            }*/

            return "";
        }

        /// <summary>
        /// Set AOIs through web service.
        /// </summary>
        /// <param name="aois"></param>
        public void SetAreasOfInterest(string aois)
        {
            //Program.InterventionEngine.CurrentProcessor.AoiDefinitions = aois;
        }

        public Stream GetFeatures(string id, string callback)
        {
            MemoryStream ms = new MemoryStream();
            StreamWriter sw = new StreamWriter(ms);
            sw.Write(callback + "({");

            EmdatProcessor processor = Program.Processors[id];
            if (processor != null)
            {
                processor.ProcessWindow();
                IDictionary<Object, Object> features = processor.Features;

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

                sb.Length--; // remove trailing comma
                sw.Write(sb.ToString());
            }

            sw.Write("})");
            sw.Flush();
            ms.Position = 0;
            return ms;
        }

        public Stream GetIntervention(string id, string callback)
        {
            MemoryStream ms = new MemoryStream();
            StreamWriter sw = new StreamWriter(ms);
            sw.Write(callback);

            EmdatProcessor processor = Program.Processors[id];
            if (processor != null)
            {
                processor.ProcessWindow();
                sw.Write(InterventionEngine.GetInterventions(processor.Features));
            }
            
            sw.Flush();
            ms.Position = 0;
            return ms;
        }
    }
}
