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
        [WebGet(UriTemplate = "/features?id={id}&callback={callback}")]
        Stream GetFeatures(string id, string callback);

        [OperationContract]
        [WebGet(UriTemplate = "/intervention?id={id}&callback={callback}")]
        Stream GetIntervention(string id, string callback);
    }
}
