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
                object feature = processor.Features["left_numfixations"];
                if (feature is int)
                {
                    return (int)feature > 50;
                }
                return false;
			}
		}
	}
}
