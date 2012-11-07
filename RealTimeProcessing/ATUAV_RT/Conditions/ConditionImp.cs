using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace ATUAV_RT
{
    public abstract class ConditionImp : Condition
    {
        protected readonly string id;
        protected readonly EmdatProcessor processor;

        public ConditionImp(string id, EmdatProcessor processor)
        {
            this.id = id;
            this.processor = processor;
        }

        public string Id
        {
            get { return id; }
        }

        public abstract bool Met
        {
            get;
        }
    }
}
