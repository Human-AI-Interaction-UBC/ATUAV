using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace ATUAV_RT.GazeDataHandlers
{
    /// <summary>
    /// Event arguments for when features are generated.
    /// Contains a dictionary of features and values in string format.
    /// </summary>
    class FeaturesGeneratedEventArgs : EventArgs
    {
        private readonly Dictionary<String, String> features;

        public FeaturesGeneratedEventArgs()
        {
            features = new Dictionary<String, String>();
        }

        public FeaturesGeneratedEventArgs(Dictionary<String, String> features)
        {
            this.features = features;
        }

        public Dictionary<String, String> FeaturesGenerated
        {
            get
            {
                return features;
            }
        }
    }
}
