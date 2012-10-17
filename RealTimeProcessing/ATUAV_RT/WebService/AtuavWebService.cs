using System.IO;
using System.ServiceModel;
using System.ServiceModel.Web;

namespace ATUAV_RT
{
    [ServiceContract]
    public interface AtuavWebService
    {
        [OperationContract]
        [WebGet(UriTemplate = "/eyetracker={productId}")]
        string SetEyetracker(string productId);

        [OperationContract]
        [WebInvoke(Method = "POST", 
            UriTemplate = "/aois", 
            RequestFormat = WebMessageFormat.Json)]
        void SetAreasOfInterest(string aois);

        [OperationContract]
        [WebGet(UriTemplate = "/features?callback={callback}")]
        Stream GetFeatures(string callback);

        [OperationContract]
        [WebGet(UriTemplate = "/intervention?callback={callback}")]
        Stream GetIntervention(string callback);
    }
}
