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
        string SetEyetracker(string productId);

        [OperationContract]
        void SetVisualization(string visualization);

        [OperationContract]
        string GetIntervention();
    }
}
