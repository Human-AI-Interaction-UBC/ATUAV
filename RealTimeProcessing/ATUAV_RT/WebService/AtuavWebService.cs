using System;
using System.Collections.Generic;
using System.Linq;
using System.ServiceModel;
using System.Text;

namespace ATUAV_RT
{
    [ServiceContract]
    public interface AtuavWebService
    {
        [OperationContract]
        void DefineVisualization(string visualization);

        [OperationContract]
        string GetIntervention();
    }
}
