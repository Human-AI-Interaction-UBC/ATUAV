using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Text;

namespace ATUAV_RT
{
    /// <summary>
    /// Utility class for database writes.
    /// </summary>
    public class Database
    {
        private SqlConnection connection = new SqlConnection("Data Source=.\\SQLEXPRESS;AttachDbFilename=C:\\Documents and Settings\\Admin\\My Documents\\Visual Studio 2008\\Projects\\ATUAV_RT\\ATUAV_Experiment\\ATUAV_Experiment\\App_Data\\Experiment.mdf;Integrated Security=True;User Instance=True");
        private int runId;

        public Database()
        {
            connection.Open();
        }

        ~Database()
        {
            connection.Close();
        }

        public int RunId
        {
            get { return runId; }
            set { runId = value; }
        }

        public void InsertCondition(string condition)
        {
            string conditionParameter = "@condition";
            string runIdParameter = "@runID";

            SqlCommand command = connection.CreateCommand();
            command.CommandText = "INSERT INTO Conditions (Condition, RunID, Time) VALUES (" + conditionParameter + ", " + runIdParameter + ", GetDate())";
            command.Parameters.Add(conditionParameter, SqlDbType.VarChar);
            command.Parameters.Add(runIdParameter, SqlDbType.Int);
            command.Parameters[conditionParameter].Value = condition;
            command.Parameters[runIdParameter].Value = runId;
            command.ExecuteNonQuery();
        }
    }
}
