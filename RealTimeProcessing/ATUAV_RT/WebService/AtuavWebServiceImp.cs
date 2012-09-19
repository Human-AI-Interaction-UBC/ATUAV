using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
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

        public string GetIntervention()
        {
            return Program.InterventionEngine.GetIntervention();
        }
    }
}
