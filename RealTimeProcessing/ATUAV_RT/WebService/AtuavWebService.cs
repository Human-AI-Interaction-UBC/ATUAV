using System;
using System.Collections.Generic;
using System.Linq;
using System.ServiceModel;
using System.ServiceModel.Web;
using System.Text;

namespace ATUAV_RT
{
    [ServiceContract]
    public interface AtuavWebService
    {
        [OperationContract]
        [WebGet(UriTemplate = "/eyetracker/{productId}")]
        string SetEyetracker(string productId);

        [OperationContract]
        [WebGet(UriTemplate = "/visualization/{visualization}")]
        void SetVisualization(string visualization);

        [OperationContract]
        [WebGet(UriTemplate = "/intervention")]
        string GetIntervention();
    }
}
