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
        public void StartTask(string userId, string taskId, string aois)
        {
            Database.UserId = userId;
            Database.TaskId = taskId;
            foreach (EmdatProcessor processor in Program.Processors.Values)
            {
                processor.AoiDefinitions = aois;
                processor.StartWindow();
            }
        }

        public Stream Condition(string processorId, string condition, string callback)
        {
            MemoryStream ms = new MemoryStream();
            StreamWriter sw = new StreamWriter(ms);
            sw.Write(callback + "(");
            // TODO if condition met write "true" else write "false"
            sw.Write(")");
            sw.Flush();
            ms.Position = 0;
            return ms;
        }

        public void StopTask()
        {
            foreach (EmdatProcessor processor in Program.Processors.Values)
            {
                processor.StopWindow();
            }
        }

        public Stream GetFeatures(string processorId, string callback)
        {
            MemoryStream ms = new MemoryStream();
            StreamWriter sw = new StreamWriter(ms);
            sw.Write(callback + "({");

            EmdatProcessor processor = Program.Processors[processorId];
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
    }
}
