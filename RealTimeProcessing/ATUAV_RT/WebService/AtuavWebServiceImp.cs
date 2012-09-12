using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace ATUAV_RT
{
    public class AtuavWebServiceImp : AtuavWebService
    {
        public void DefineVisualization(string visualization)
        {
            // TODO give definition to decision engine so it can decide on relevant interventions
        }

        public string GetIntervention()
        {
            // TODO get intervention from decision engine

            return "atuav";
        }
    }
}
