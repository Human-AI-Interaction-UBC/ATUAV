using System;
using System.Collections.Generic;

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
                try
                {
                    object feature = processor.Features["text_numfixations"];
                    Console.WriteLine(feature);
                    if (feature is int)
                    {
                        return (int)feature > 7;
                    }
                }
                catch (KeyNotFoundException)
                {
                    // do nothing
                }
                return false;
			}
		}
	}
}
