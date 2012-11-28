using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

using System.Data;
using System.Data.SqlClient;
using System.Data.SqlTypes;

namespace ATUAV_Experiment
{
    public class Run
    {

        public static void Main(){

            //Basic INSERT method with Parameters
            String dbString = "Data Source=.\\SQLEXPRESS;AttachDbFilename=C:\\Documents and Settings\\Admin\\My Documents\\Visual Studio 2008\\Projects\\ATUAV_RT\\ATUAV_Experiment\\ATUAV_Experiment\\App_Data\\Experiment.mdf;Integrated Security=True;User Instance=True";
            SqlConnection sqlConn = new SqlConnection(dbString);
            SqlCommand sqlComm = new SqlCommand();

            sqlComm = sqlConn.CreateCommand();
            sqlComm.CommandText = @"INSERT INTO TaskConfiguration (TaskID, QuestionID, Question, QuestionType, InterventionType, InterventionTime, DataValues, ImportantValues) VALUES (@TaskID, @QuestionID, @Question, @QuestionType, @InterventionType, @InterventionTime, @DataValues, @ImportantValues)";

            sqlComm.Parameters.Add("@TaskID", SqlDbType.Int);
            sqlComm.Parameters.Add("@QuestionID", SqlDbType.Int);
            sqlComm.Parameters.Add("@Question", SqlDbType.VarChar);
            sqlComm.Parameters.Add("@QuestionType", SqlDbType.VarChar);
            sqlComm.Parameters.Add("@InterventionType", SqlDbType.VarChar);
            sqlComm.Parameters.Add("@InterventionTime", SqlDbType.VarChar);
            sqlComm.Parameters.Add("@DataValues", SqlDbType.VarChar);
            sqlComm.Parameters.Add("@ImportantValues", SqlDbType.VarChar);

            String[] interventions = new String[]  {"AvgReferenceLine", "Bolding", "DeEmphasis", "ConnectedArrow", "None"};

            int[] questionID_RV = new int[] { 1,1,2,2};

            String[] phrasingRV = new String[] { "Is SERIES's DOMAIN_KEYWORD1 in SAMPLE above the AVERAGE_KEYWORD1?",
                                                 "Is SERIES's DOMAIN_KEYWORD1 in SAMPLE above the AVERAGE_KEYWORD1?",
                                                 "Is SERIES's DOMAIN_KEYWORD1 in SAMPLE below the AVERAGE_KEYWORD1?",
                                                 "Is SERIES's DOMAIN_KEYWORD1 in SAMPLE below the AVERAGE_KEYWORD1?"};

            int[] questionID_CDV = new int[] { 3, 4, 5, 6 };

            String[] phrasingCDV = new String[] { "In how many DOMAIN_KEYWORD2 is SERIES1 above the AVERAGE_KEYWORD2 and SERIES2 is below it?", 
                                                  "In how many DOMAIN_KEYWORD2 is SERIES2 above the AVERAGE_KEYWORD2 and SERIES1 is below it?", 
                                                  "In how many DOMAIN_KEYWORD2 are both SERIES1 and SERIES2 above the AVERAGE_KEYWORD2?", 
                                                  "In how many DOMAIN_KEYWORD2 are both SERIES1 and SERIES2 below the AVERAGE_KEYWORD2?"};

            String[] interventionTime = new String[] { "T0", "TX"};

            String[] seriesNames = new String[] { };

            String[] sampleNames = new String[] { };

            String dataValues;

            String importantValues;

            int fullCounter;

            Random r = new Random();
            String condition = "";

            //RV Tasks
            int interventionsCounter = 0;

            while (interventionsCounter < 5)
            {
                int phrasingTypeCounter = 0;

                while(phrasingTypeCounter<4)
                {
                    int interventionTimeCounter = 0;

                    while (interventionTimeCounter < 2)
                    {
                        fullCounter = interventionTimeCounter + phrasingTypeCounter*2 + interventionsCounter*8 + 1;

                        condition = 1 + fullCounter + ", RV, ";
                        condition += questionID_RV[phrasingTypeCounter] + ", ";
                        condition += phrasingRV[phrasingTypeCounter] + ", ";
                        condition += interventions[interventionsCounter] + ", ";
                        condition += interventionTime[interventionTimeCounter] + ", ";

                        dataValues = "";

                        for(int i=0; i<48; i++)
                        {
                            dataValues += r.Next(40, 80) + " ";
                        }

                        importantValues = "";

                        for (int i = 0; i < 2; i++)
                        {
                            importantValues += r.Next(40, 80) + " ";
                        }

                        condition += dataValues;

                        sqlComm.Parameters["@TaskID"].Value = fullCounter;
                        sqlComm.Parameters["@QuestionID"].Value = questionID_RV[phrasingTypeCounter];
                        sqlComm.Parameters["@Question"].Value = phrasingRV[phrasingTypeCounter];
                        sqlComm.Parameters["@QuestionType"].Value = "RV";
                        sqlComm.Parameters["@InterventionType"].Value = interventions[interventionsCounter];
                        sqlComm.Parameters["@InterventionTime"].Value = interventionTime[interventionTimeCounter];
                        sqlComm.Parameters["@DataValues"].Value = dataValues;
                        sqlComm.Parameters["@ImportantValues"].Value = importantValues;

                        sqlConn.Open();
                        sqlComm.ExecuteNonQuery();
                        sqlConn.Close();


                        System.Console.WriteLine(condition);
                        interventionTimeCounter++;
                    }

                    phrasingTypeCounter++;
                }

                interventionsCounter++;
            }

            //CDV Tasks
            interventionsCounter = 0;

            while (interventionsCounter < 5)
            {
                int phrasingTypeCounter = 0;

                while (phrasingTypeCounter < 4)
                {
                    int interventionTimeCounter = 0;

                    while (interventionTimeCounter < 2)
                    {
                        fullCounter = interventionTimeCounter + phrasingTypeCounter * 2 + interventionsCounter * 8 + 41;

                        condition = fullCounter + ", CDV, ";

                        condition += questionID_CDV[phrasingTypeCounter] + ", ";
                        condition += phrasingCDV[phrasingTypeCounter] + ", ";
                        condition += interventions[interventionsCounter] + ", ";
                        condition += interventionTime[interventionTimeCounter] + ", ";

                        dataValues = "";

                        for (int i = 0; i < 48; i++)
                        {
                            dataValues += r.Next(60, 100) + " ";
                        }

                        importantValues = "";

                        for (int i = 0; i < 24; i++)
                        {
                            importantValues += r.Next(40, 80) + " ";
                        }

                        condition += dataValues;

                        sqlComm.Parameters["@TaskID"].Value = fullCounter;
                        sqlComm.Parameters["@QuestionID"].Value = questionID_CDV[phrasingTypeCounter];
                        sqlComm.Parameters["@Question"].Value = phrasingCDV[phrasingTypeCounter];
                        sqlComm.Parameters["@QuestionType"].Value = "CDV";
                        sqlComm.Parameters["@InterventionType"].Value = interventions[interventionsCounter];
                        sqlComm.Parameters["@InterventionTime"].Value = interventionTime[interventionTimeCounter];
                        sqlComm.Parameters["@DataValues"].Value = dataValues;
                        sqlComm.Parameters["@ImportantValues"].Value = importantValues;

                        sqlConn.Open();
                        sqlComm.ExecuteNonQuery();
                        sqlConn.Close();

                        System.Console.WriteLine(condition);
                        interventionTimeCounter++;
                    }

                    phrasingTypeCounter++;
                }

                interventionsCounter++;
            }

            //Random order for 80 tasks
            var randomNumbers = Enumerable.Range(1, 80).OrderBy(i => r.Next()).ToArray();
            //end random order
        }
        
    }
}