<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="Visualization.aspx.cs" Inherits="ATUAV_Experiment.WebForm2" %>
<%@ Import Namespace="System.Data" %>
<%@ Import Namespace="System.Data.SqlClient" %>
<%@ Import Namespace="System.Data.SqlTypes" %>

<script runat="server">
    
    protected void Page_Load(object sender, EventArgs e)
    {

        String dbString = "Data Source=.\\SQLEXPRESS;AttachDbFilename=C:\\Users\\Ben\\Documents\\atuav\\ATUAV_Experiment\\ATUAV_Experiment\\App_Data\\Experiment.mdf;Integrated Security=True;User Instance=True";
        
//Initial setting of username and task
        int userID = 0;
        int taskID = 0;
        
        try
        {
            String userID_string = Session["userID"].ToString();
            userID = Convert.ToInt32(Session["userID"]);
            int[] task_order = (int[])Session["task_order"];
            int current_task = (int)Session["current_task"];
            taskID = task_order[current_task];
            current_task++;
            Session["current_task"] = current_task;
        }
        catch (Exception ex)
        {
            Exception.InnerHtml = ex.ToString();
        }

//Setting up connection
        SqlConnection sqlConn = null;
        SqlCommand sqlComm = null;
        
//Getting previous runID and answer
        String previous_answer = Request.Form["Answer"];
        String runID = Request.Form["Run"];
        if (previous_answer != null && userID != null)
        {
            sqlConn = new SqlConnection(dbString);
            sqlComm = new SqlCommand("UPDATE Run SET FinishTime = GetDate(), Answer = @Answer WHERE runID = @runID;", sqlConn);

            sqlComm.Parameters.Add("@runID", SqlDbType.Int);
            sqlComm.Parameters["@runID"].Value = Convert.ToInt32(runID);

            sqlComm.Parameters.Add("@Answer", SqlDbType.VarChar);
            sqlComm.Parameters["@Answer"].Value = previous_answer;

            sqlConn.Open();
            sqlComm.ExecuteNonQuery();
            sqlConn.Close();

            
        }
        
//Retrieving next task       
        sqlConn = new SqlConnection(dbString);
        SqlDataReader myReader = null;
        sqlComm = sqlConn.CreateCommand();
        sqlComm.CommandText = @"Select * from TaskConfiguration where TaskID = @TaskID";
        sqlComm.Parameters.Add("@TaskID", SqlDbType.Int);
        sqlComm.Parameters["@TaskID"].Value = taskID;

        sqlConn.Open();
        myReader = sqlComm.ExecuteReader();
        myReader.Read();
        int QuestionID = int.Parse(myReader["QuestionID"].ToString());
        String question = myReader["Question"].ToString();
        String QuestionType = myReader["QuestionType"].ToString();
        String dataValuesString = myReader["DataValues"].ToString();
        String[] dataValues = dataValuesString.Split(' ');
        String importantValuesString = myReader["ImportantValues"].ToString();
        String[] importantValues = importantValuesString.Split(' ');
        String InterventionType = myReader["InterventionType"].ToString();
        String InterventionTime = myReader["InterventionTime"].ToString();
        sqlConn.Close();

//Choosing random domain, samples, series and color
        String[] series = {};
        String[] samples = {};
        String domain_keyword1 = "";
        String domain_keyword2 = "";
        
        Random r = new Random();
        
        int domain = r.Next(0,3);

        if (domain == 0)
        {
            series = new String[] { "Michael", "Christopher", "Matthew", "Joshua", "Andrew", "Daniel", "Ryan", "William", "Kyle", "Zachary", "Ashley", "Brittany", "Samantha", "Elizabeth", "Meghan", "Heather", "Victoria", "Lindsey", "Olivia", "Gabrielle" };
            samples = new String[] { "Chemistry", "Physics", "Biology", "Anthropology", "Photography", "English ", "Engineering", "History", "Forestry", "Latin", "Political Science", "Math" };
            domain_keyword1 = "grade";
            domain_keyword2 = "course";
        }
        else if (domain == 1)
        {
            series = new String[] { "Microfirm", "Logistix", "Info-Tek", "Metrocom", "Fabricare", "JL_Associates", "BioRestore_Inc", "WCC_Group", "Bluegem_Properties", "Talisco", "Davis_Holdings", "Benzad_International", "R_and_R_Foods", "Montco_Glocal", "Starshine_Entertainment", "DairyEmpire", "ChemCorp", "Fitzgerlad_Gold", "Uni-Sand_Ltd", "GT" };
            samples = new String[] { "Human_Resources", "Accounting", "Marketing", "Information_Technology", "Logistics", "Customer_Service", "Legal", "Research", "Retail", "Advertising", "Public_Relations", "Security" };
            domain_keyword1 = "growth";
            domain_keyword2 = "departments";
        }
        else if (domain == 2)
        {
            series = new String[] { "The_Haunting","Vampire_Attack","Love_and_Lovlier","A_Serious_Affair","Blades_of_Metal","The_Champ","Shark_Swamp_2","How_to_Date_Your_Friends","City_Lights_City_Life","The_Lost_Explorer","Zombiepocalyptica","Three_Chefs","Club_Universe","Blue_Mountain","Speed_Freak_3","Tea_and_Cigars","The_Four_Sided_Square","An_Unfinished_Life","Bus_Driver","The_Novice" };
            samples = new String[] { "Vancouver","Los_Angeles","New_York","Berlin","London","Rome","Moscow","Tokyo","Paris","Mexico_City","Auckland","Hong_Kong" };
            domain_keyword1 = "revenue";
            domain_keyword2 = "city";
        }

        
        //randomize full series
        
        
        var randomSeriesOrder = Enumerable.Range(0, 20).OrderBy(i => r.Next()).ToArray();
        var randomSamplesOrder = Enumerable.Range(0, 12).OrderBy(i => r.Next()).ToArray();
        String[] randomSeriesFull = new String[20];
        String[] randomSamplesFull = new String[12];

        for (int i = 0; i < 20; i++)
        {
            randomSeriesFull[i] = series[randomSeriesOrder[i]];
        }

        for (int i = 0; i < 12; i++)
        {
            randomSamplesFull[i] = samples[randomSamplesOrder[i]];
        }

        String[] randomSeries = new String[7];
        String[] randomSamples = new String[8];

        randomSeries[0] = "Average";
        
        for (int i = 1; i < 7; i++)
        {
            randomSeries[i] = randomSeriesFull[i];
        }

        for (int i = 0; i < 8; i++)
        {
            randomSamples[i] = randomSamplesFull[i];
        }
        
//Choose domain, series and sample focus
        String randomSingleSeries = "";
        String randomSingleSample = "";
        String randomSingleSeries1 = "";
        String randomSingleSeries2 = "";
        
        if(QuestionType=="RV")
        {
            randomSingleSeries = randomSeries[r.Next(1, 7)];
            randomSingleSample = randomSamples[r.Next(0, 8)];
        }
        else
        {
            while (randomSingleSeries1 == randomSingleSeries2)
            {
                randomSingleSeries1 = randomSeries[r.Next(1, 7)];
                randomSingleSeries2 = randomSeries[r.Next(1, 7)];
            }
        }
        


               
//Generating infovis output

        String data_string = "<data>";

        for (int i = 0; i < randomSeries.Length; i++)
        {
            data_string += "<series name=\"" + randomSeries[i] + "\">";

            for (int j = 0; j < randomSamples.Length; j++)
            {
                data_string += "<sample name=\"" + randomSamples[j] + "\" value=\"";
                
                if (QuestionType == "RV")
                {
                    if (randomSamples[j] == randomSingleSample && randomSeries[i] == "Average")
                    {
                        data_string += importantValues[0];
                    }
                    else if (randomSamples[j] == randomSingleSample && randomSeries[i] == randomSingleSeries)
                    {
                        data_string += importantValues[1];
                    }
                    else
                    {
                        data_string += dataValues[i * randomSamples.Length + j];
                    }
                }
                else if (QuestionType == "CDV")
                {
                    if (randomSeries[i] == "Average")
                    {
                        data_string += importantValues[j];
                    }
                    else if (randomSeries[i] == randomSingleSeries1)
                    {
                        data_string += importantValues[j+8];
                    }
                    else if (randomSeries[i] == randomSingleSeries2)
                    {
                        data_string += importantValues[j + 16];
                    }
                    else
                    {
                        data_string += dataValues[i * randomSamples.Length + j];
                    }
                }
                
                data_string += "\"></sample>";
            }
            
            data_string += "</series>";
        }
        
        data_string += "</data>";
        
        data.InnerHtml = data_string;

//Generating intervention output
        String intervention_string = "<intervention name=\""+InterventionType+"\" time=\""+InterventionTime+"\">";

        if (QuestionType == "RV")
        {
            intervention_string += "<group>";
            intervention_string += "<bar series=\"" + randomSingleSeries + "\" sample=\"" + randomSingleSample + "\"></bar>";
            intervention_string += "<bar series=\"Average\" sample=\"" + randomSingleSample + "\"></bar>";
            intervention_string += "</group>";
        }
        else if (QuestionType == "CDV")
        {
            for (int i = 0; i < 8; i++)
            {
                intervention_string += "<group>";
                intervention_string += "<bar series=\"" + randomSingleSeries1 + "\" sample=\"" + randomSamples[i] + "\"></bar>";
                intervention_string += "<bar series=\"" + randomSingleSeries2 + "\" sample=\"" + randomSamples[i] + "\"></bar>";
                intervention_string += "<bar series=\"Average\" sample=\"" + randomSamples[i] + "\"></bar>";
                intervention_string += "</group>";
            }
        }    
            
        intervention_string += "</intervention>";

        intervention.InnerHtml = intervention_string;

//Generating question output
        if(QuestionType == "RV")
        {
            question = question.Replace("SERIES", randomSingleSeries);
            question = question.Replace("SAMPLE", randomSingleSample);
            question = question.Replace("DOMAIN_KEYWORD1", domain_keyword1);
        }
        else if(QuestionType=="CDV")
        {
            question = question.Replace("SERIES1", randomSingleSeries1);
            question = question.Replace("SERIES2", randomSingleSeries2);
            question = question.Replace("DOMAIN_KEYWORD2", domain_keyword2);
        }
        
        QuestionText.InnerHtml = question;

        String answer_string = "";
        
        if (QuestionType=="RV")
        {
            answer_string += "<input type='radio' name='answer' value='true' checked>true ";
            answer_string += "<input type='radio' name='answer' value='false'>false ";
        }
        else
        {
            answer_string += "<input type='radio' name='answer' value='0' checked>0 ";
            answer_string += "<input type='radio' name='answer' value='1'>1 ";
            answer_string += "<input type='radio' name='answer' value='2'>2 ";
            answer_string += "<input type='radio' name='answer' value='3'>3 ";
            answer_string += "<input type='radio' name='answer' value='4'>4 ";
            answer_string += "<input type='radio' name='answer' value='5'>5 ";
            answer_string += "<input type='radio' name='answer' value='6'>6 ";
            answer_string += "<input type='radio' name='answer' value='7'>7 ";
            answer_string += "<input type='radio' name='answer' value='8'>8 ";
        }

        AnswerBox.InnerHtml = answer_string;
        
        
        
//Inserting new run

        String newRunID = "0";
        
        if (userID != null && taskID != null)
        {
            sqlConn = new SqlConnection(dbString);
            sqlComm = new SqlCommand("INSERT INTO Run (taskID, userID, StartTime) output inserted.RunID " +
                                  "VALUES (@taskID, @userID, GetDate());", sqlConn);

            sqlComm.Parameters.Add("@userID", SqlDbType.Int);
            sqlComm.Parameters["@userID"].Value = userID;

            sqlComm.Parameters.Add("@taskID", SqlDbType.Int);
            sqlComm.Parameters["@taskID"].Value = taskID;

            sqlConn.Open();
            Object result = sqlComm.ExecuteScalar();
            newRunID = result.ToString();
            sqlConn.Close();

            //Generating hidden variables
            String hidden_string = "<input type='hidden' name='Run' value='" + newRunID + "'/>";
            HiddenParameters.InnerHtml = hidden_string;
        }


        String debug_string = "*********************DEBUG*********************<br />";
        //debug_string += "User ID: " + userID + "<br />";
        //debug_string += "Run ID: " + newRunID + "<br />";
        debug_string += "Task: " + taskID + "out of 80<br />";
        debug_string += "Task ID/Type: " + taskID + "/" + QuestionType + "<br />";
        debug_string += "Intervention Type/Timing: " + InterventionType + "/" + InterventionTime + "<br />";
        if(QuestionType=="RV")
        {
            debug_string += "Intervention Target: "+randomSingleSample+" for Average and " + randomSingleSeries + "<br />";
        }
        else if(QuestionType == "CDV")
        {
            debug_string += "Intervention Target: Average, " + randomSingleSeries1 + " and " + randomSingleSeries2 + "<br />";
        }
        debug_string += "*********************DEBUG*********************<br />";


        Answer.InnerHtml = debug_string;

        int color = r.Next(0, 6);
        colorFamily.InnerHtml = "{\"colorFamily\":" + color + "}";
    }
</script>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title></title>
        <script type="text/javascript" src="http://github.com/mbostock/d3/raw/v1.8.2/d3.js"></script>
        <script type="text/javascript" src="http://mbostock.github.com/d3/d3.js?2.1.3"></script>
        <script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1.6.2/jquery.min.js"></script>
        <script type="text/javascript" src="raphael.js"></script>
</head>
<body>
    <form id="form1" runat="server">
    
    <div id='data' style='visibility:hidden;' runat="server"></div>
    <div id='intervention' style='visibility:hidden;' runat="server"></div>
    <div id='colorFamily'  style='visibility:hidden;' runat="server"></div>
    <center>
    <div id='infovis'></div>
    <br />
    <div id='QuestionText' runat="server"></div>
    <div id='AnswerBox' runat="server"></div>
    <div id='HiddenParameters' runat="server"></div>
    <asp:Button id="AnswerButton" Text="Submit" runat="server" />
    <div id='Exception' runat="server"></div>
    <script type="text/javascript" src="multiBars.js"></script>
    </center>
    <div id='Answer' runat="server"></div>
    </form>
</body>
</html>
