using System.IO;
using System.ServiceModel;
using System.ServiceModel.Web;

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
        [WebGet(UriTemplate = "/intervention?callback={callback}")]
        Stream GetIntervention(string callback);
    }
}
