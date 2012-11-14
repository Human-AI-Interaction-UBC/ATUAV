using System;

namespace ATUAV_RT
{
	public class ShowIntervention : Condition
	{
		private readonly EmdatProcessor processor;
		
		public ShowIntervention(EmdatProcessor processor)
		{
			this.processor = processor;
		}
		
		public string Id
		{
			get
			{
				return "showintervention";
			}
		}
		
		public bool Met
		{
			get
			{
                processor.ProcessWindow();
                object feature = processor.Features["text_numfixations"];
                if (feature is int)
                {
                    return (int)feature > 5;
                }
                return false;
			}
		}
	}
}
