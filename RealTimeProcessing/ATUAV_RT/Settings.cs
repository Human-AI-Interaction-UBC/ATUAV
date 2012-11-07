using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace ATUAV_RT
{
    public class Settings
    {
        public Uri BaseAddress;
        public Dictionary<String, List<EmdatProcessorSettings>> ProcessorDefinitions = new Dictionary<String, List<EmdatProcessorSettings>>();
    }
}
