using System.IO;
using System.ServiceModel;
using System.ServiceModel.Web;

namespace ATUAV_RT
{
    [ServiceContract]
    public interface AtuavWebService
    {
        [OperationContract]
        [WebGet(UriTemplate = "/start?userId={userId}&taskId={taskId}&aois={aois}")]
        void StartTask(string userId, string taskId, string aois);

        [OperationContract]
        [WebGet(UriTemplate = "/condition?processorId={processorId}&condition={condition}&callback={callback}")]
        Stream Condition(string processorId, string condition, string callback);

        [OperationContract]
        [WebGet(UriTemplate = "/stop")]
        void StopTask();

        [OperationContract]
        [WebGet(UriTemplate = "/features?processorId={processorId}&callback={callback}")]
        Stream GetFeatures(string processorId, string callback);
    }
}
