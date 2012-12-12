using System;
using System.Collections.Generic;

namespace ATUAV_RT
{
    /// <summary>
    /// Defines when the question text should be shown.
    /// </summary>
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
				return "showText";
			}
		}
		
		public bool Met
		{
			get
			{
                processor.ProcessWindow();
                try
                {
                    object feature1 = processor.Features["graph_numfixations"];
                    object feature2 = processor.Features["legend_numfixations"];
                    Console.WriteLine("Graph: "+feature1 + ", Legend: " + feature2);

                    if (feature1 is int)
                    {
                        return ((int)feature1 > 4 && (int)feature2 > 1);
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
