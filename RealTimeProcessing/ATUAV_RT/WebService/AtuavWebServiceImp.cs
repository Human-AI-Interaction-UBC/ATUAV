using System.IO;
using System.ServiceModel.Activation;

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
            Program.InterventionEngine.CurrentEyetracker = productId;
            if (Program.InterventionEngine.CurrentEyetracker != productId)
            {
                return "error: eyetracker not connected";
            }

            return "";
        }

        public void SetVisualization(string visualization)
        {
            Program.InterventionEngine.SetVisualization(visualization);
        }

        public Stream GetIntervention(string callback)
        {
            MemoryStream ms = new MemoryStream();
            StreamWriter sw = new StreamWriter(ms);
            sw.Write(Program.InterventionEngine.GetIntervention(callback));
            sw.Flush();
            ms.Position = 0;
            return ms;
        }
    }
}
