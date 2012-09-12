using FixDet;
using Tobii.Eyetracking.Sdk;

namespace ATUAV_RT
{
    /// <summary>
    /// Wrapper class for GazeDataItems and SFDFixations.
    /// </summary>
    public class EyetrackerEvent
    {
        private GazeDataItem gdi;
        private SFDFixation fixation;

        public EyetrackerEvent(GazeDataItem gdi)
        {
            this.gdi = gdi;
        }

        public EyetrackerEvent(SFDFixation fixation)
        {
            this.fixation = fixation;
        }

        public GazeDataItem GazeDataItem
        {
            get
            {
                return gdi;
            }
        }

        public SFDFixation Fixation
        {
            get
            {
                return fixation;
            }
        }
    }
}
