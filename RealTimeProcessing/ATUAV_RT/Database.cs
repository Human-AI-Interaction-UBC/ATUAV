using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace ATUAV_RT
{
    public class Database
    {
        private static string userId;
        private static string taskId;

        public static string UserId
        {
            get { return Database.userId; }
            set { Database.userId = value; }
        }

        public static string TaskId
        {
            get { return Database.taskId; }
            set { Database.taskId = value; }
        }

        // TODO methods to record intervention info
    }
}
