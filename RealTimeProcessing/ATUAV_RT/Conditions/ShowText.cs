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
				// TODO
				return false;
			}
		}
	}
}
