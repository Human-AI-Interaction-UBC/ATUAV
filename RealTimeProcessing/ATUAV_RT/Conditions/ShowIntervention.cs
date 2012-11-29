using System;
using System.Collections.Generic;

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
				return "showIntervention";
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
                    Console.WriteLine("Text1: " + feature1 + ", Text2: " + feature2 + ", Text3: " + feature3);

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
