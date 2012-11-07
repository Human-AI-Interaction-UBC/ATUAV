using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace ATUAV_RT
{
    public class ShowIntervention : ConditionImp
    {
        public ShowIntervention(string id, EmdatProcessor processor) : base(id, processor) { }

        public override bool Met
        {
            get { return false; } // TODO process window
        }
    }
}
