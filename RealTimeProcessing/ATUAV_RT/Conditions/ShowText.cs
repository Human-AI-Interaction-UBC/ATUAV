using System;

namespace ATUAV_RT
{
	public class ShowText : Condition
	{
		private readonly EmdatProcessor processor;
		
		public ShowText(EmdatProcessor processor)
		{
			this.processor = processor;
		}
		
		public string Id
		{
			get
			{
				return "showtext";
			}
		}
		
		public bool Met
		{
			get
			{
                processor.ProcessWindow();
                object feature = processor.Features["graph_numfixations"];
                if (feature is int)
                {
                    return (int)feature > 5;
                }
                return false;
			}
		}
	}
}
