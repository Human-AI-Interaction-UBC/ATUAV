
namespace ATUAV_RT
{
    public interface Condition
    {
        string Id
        {
            get;
        }

        /// <summary>
        /// True if condition is met, false otherwise.
        /// </summary>
        bool Met
        {
            get;
        }
    }
}
