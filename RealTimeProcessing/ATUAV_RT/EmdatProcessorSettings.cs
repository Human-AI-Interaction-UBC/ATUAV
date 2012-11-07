using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace ATUAV_RT
{
    public class EmdatProcessorSettings
    {
        private string processorId;
        private bool cumulative;

        public EmdatProcessorSettings(string processorId, bool cumulative)
        {
            this.processorId = processorId;
            this.cumulative = cumulative;
        }

        public string ProcessorId
        {
            get { return processorId; }
            set { processorId = value; }
        }

        public bool Cumulative
        {
            get { return cumulative; }
            set { cumulative = value; }
        }
    }
}
