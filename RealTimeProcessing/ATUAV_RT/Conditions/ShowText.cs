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
                    object feature1 = processor.Features["text1_numfixations"];
                    object feature2 = processor.Features["text2_numfixations"];
                    object feature3 = processor.Features["text3_numfixations"];
                    Console.WriteLine(feature1 + " / " + feature2 + " / " + feature3);

                    if (feature1 is int)
                    {
                        return ((int)feature1 > 2 && (int)feature2 > 2 && (int)feature3 > 2);
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
