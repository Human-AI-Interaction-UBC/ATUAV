﻿<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="Visualization.aspx.cs" Inherits="ATUAV_Experiment.WebForm2" %>
<%@ Import Namespace="System.Data" %>
<%@ Import Namespace="System.Data.SqlClient" %>
<%@ Import Namespace="System.Data.SqlTypes" %>
<%@ Import Namespace="System.Net" %>

<script runat="server">
    
    protected void Page_Load(object sender, EventArgs e)
    {

        int num_series = 6; //including average
        int num_samples = 8;
        
        String dbString = "Data Source=.\\SQLEXPRESS;AttachDbFilename=C:\\Documents and Settings\\Admin\\My Documents\\Visual Studio 2008\\Projects\\ATUAV_RT\\ATUAV_Experiment\\ATUAV_Experiment\\App_Data\\Experiment.mdf;Integrated Security=True;User Instance=True";
        
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
            
            try
            {
                // stop previous run
                WebRequest stopRequest = WebRequest.Create("http://localhost:8080/atuav/stop");
                stopRequest.GetResponse();
            }
            catch
            {
                //do nothing
            }
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
        String average_keyword1 = "";
        String average_keyword2 = "";
        
        Random r = new Random();
        
        int domain = r.Next(0,4);

        if (domain == 0)
        {
            series = new String[] { "Michael", "Christopher", "Matthew", "Joshua", "Andrew", "Daniel", "Ryan", "William", "Kyle", "Zachary", "Ashley", "Brittany", "Samantha", "Elizabeth", "Meghan", "Heather", "Victoria", "Lindsey", "Olivia", "Gabrielle" };
            samples = new String[] { "Chemistry", "Physics", "Biology", "Anthropology", "Photography", "English ", "Engineering", "History", "Forestry", "Latin", "Political Science", "Math" };
            domain_keyword1 = "grade";
            domain_keyword2 = "courses";
            average_keyword1 = "class average for that course";
            average_keyword2 = "class average";
        }
        else if (domain == 1)
        {
            series = new String[] { "Microfirm", "Logistix", "Info-Tek", "Metrocom", "Fabricare", "JL_Associates", "BioRestore_Inc", "WCC_Group", "Bluegem_Properties", "Talisco", "Davis_Holdings", "Benzad_International", "RR_Foods", "Montco_Glocal", "Starshine_Entertainment", "DairyEmpire", "ChemCorp", "Fitzgerlad_Gold", "Uni-Sand_Ltd", "GT" };
            samples = new String[] { "Human_Resources", "Accounting", "Marketing", "Information_Technology", "Logistics", "Customer_Service", "Legal", "Research", "Retail", "Advertising", "Public_Relations", "Security" };
            domain_keyword1 = "growth";
            domain_keyword2 = "departments";
            average_keyword1 = "average growth in that department";
            average_keyword2 = "average growth";
        }
        else if (domain == 2)
        {
            series = new String[] { "The_Haunting", "Vampire_Attack", "Love_and_Lovlier", "A_Serious_Affair", "Blades_of_Metal", "The_Champ", "Shark_Swamp_2", "How_to_Date_Your_Friends", "City_Lights_City_Life", "The_Lost_Explorer", "Zombiepocalyptica", "Three_Chefs", "Club_Universe", "Blue_Mountain", "Speed_Freak_3", "Tea_and_Cigars", "The_Four_Sided_Square", "An_Unfinished_Life", "Bus_Driver", "The_Novice" };
            samples = new String[] { "Vancouver", "Los_Angeles", "New_York", "Berlin", "London", "Rome", "Moscow", "Tokyo", "Paris", "Mexico_City", "Auckland", "Hong_Kong" };
            domain_keyword1 = "revenue";
            domain_keyword2 = "cities";
            average_keyword1 = "average movie revenue in that city";
            average_keyword2 = "average revenue";
        }
        else if (domain == 3)
        {
            series = new String[] { "Kitty_Kibble", "Feline_Time", "Blue_Horizon", "Meow_Meal", "Fresh_Feast", "Puppy_Chowder", "Hungry_Beast", "Fancy_Fur", "Yellow_Label", "Canine_Companion", "4-Star_Brand", "Prime_Choice", "Prized_Pooch", "Tender_Cutz", "Value_Pet", "Grade-A_Form", "Smart_Cat", "Organic_Valley", "Nutra-Pet", "Select_Prize" };
            samples = new String[] { "Vitamin_B12", "Iron", "Zinc", "Vitamin_E", "Vitamin_D", "Vitamin_A", "Folic_Acid", "Calcium", "Selenium", "DHA", "Riboflavin", "Potassium" };
            domain_keyword1 = "level";
            domain_keyword2 = "minerals/vitamins";
            average_keyword1 = "average level for that mineral/vitamin";
            average_keyword2 = "average level";
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

        String[] randomSeries = new String[num_series];
        String[] randomSamples = new String[num_samples];

        randomSeries[0] = "Average";
        
        for (int i = 1; i < num_series; i++)
        {
            randomSeries[i] = randomSeriesFull[i];
        }

        for (int i = 0; i < num_samples; i++)
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
            randomSingleSeries = randomSeries[r.Next(1, num_series)];
            randomSingleSample = randomSamples[r.Next(0, num_samples)];
        }
        else
        {
            while (randomSingleSeries1 == randomSingleSeries2)
            {
                randomSingleSeries1 = randomSeries[r.Next(1, num_series)];
                randomSingleSeries2 = randomSeries[r.Next(1, num_series)];
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
                        data_string += importantValues[j+num_samples];
                    }
                    else if (randomSeries[i] == randomSingleSeries2)
                    {
                        data_string += importantValues[j + num_samples*2];
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
            for (int i = 0; i < num_samples; i++)
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
            question = question.Replace("AVERAGE_KEYWORD1", average_keyword1);
        }
        else if(QuestionType=="CDV")
        {
            question = question.Replace("SERIES1", randomSingleSeries1);
            question = question.Replace("SERIES2", randomSingleSeries2);
            question = question.Replace("DOMAIN_KEYWORD2", domain_keyword2);
            question = question.Replace("AVERAGE_KEYWORD2", average_keyword2);

            if (domain == 3)
            {
                question = question.Replace("In how many", "For how many");
            }
        }
        
        QuestionText.InnerHtml = question.Replace("_"," ");

        String answer_string = "";
        
        if (QuestionType=="RV")
        {
            answer_string += "<input type='radio' name='answer' value='yes' checked>yes ";
            answer_string += "<input type='radio' name='answer' value='no'>no ";
        }
        else
        {
            answer_string += "<input type='radio' name='answer' value='0' checked>0 ";
            
            for(int i=1; i<=num_samples; i++)
            {
                answer_string += "<input type='radio' name='answer' value='"+i+"'>"+i+" ";
            }

        }

        AnswerBox.InnerHtml = answer_string;
        
        
        
//Inserting new run

        String newRunID = "0";
        
        if (userID != null && taskID != null)
        {
            sqlConn = new SqlConnection(dbString);
            sqlComm = new SqlCommand("INSERT INTO Run (taskID, userID, Question, StartTime) output inserted.RunID " +
                                  "VALUES (@taskID, @userID, @Question, GetDate());", sqlConn);

            sqlComm.Parameters.Add("@userID", SqlDbType.Int);
            sqlComm.Parameters["@userID"].Value = userID;

            sqlComm.Parameters.Add("@taskID", SqlDbType.Int);
            sqlComm.Parameters["@taskID"].Value = taskID;

            sqlComm.Parameters.Add("@Question", SqlDbType.VarChar);
            sqlComm.Parameters["@Question"].Value = question.Replace("_", " ");

            sqlConn.Open();
            Object result = sqlComm.ExecuteScalar();
            newRunID = result.ToString();
            sqlConn.Close();

            //Generating hidden variables
            String hidden_string = "<input type='hidden' name='Run' value='" + newRunID + "'/>";
            HiddenParameters.InnerHtml = hidden_string;
        }

        int color = r.Next(0, 6);
        colorFamily.InnerHtml = "{\"colorFamily\":" + color + "}";

        double text_box_length = question.Length * 7.1;
        double x1 = (1280-text_box_length)/2;
        double x2 = x1 + text_box_length/3;
        double x3 = x2 + text_box_length/3;
        double x4 = x1 + text_box_length;
        
        // start eye tracking
        string aois = "text1\\t"+x1+",720\\t"+x2+",720\\t"+x2+",750\\t"+x1+",750\\r\\n";
        aois += "text2\\t" + x2 + ",720\\t" + x3 + ",720\\t" + x3 + ",750\\t" + x2 + ",750\\r\\n";
        aois += "text3\\t" + x3 + ",720\\t" + x4 + ",720\\t" + x4 + ",750\\t" + x3 + ",750";
        
        try
        {
            WebRequest startRequest = WebRequest.Create("http://localhost:8080/atuav/start?runId=" + newRunID + "&aois=" + aois);
            startRequest.GetResponse();
        }
        catch
        {
            //do nothing
        }


        String debug_string = "<br /><br />-------------Task Info-----------<br />";
        //debug_string += "User ID: " + userID + "<br />";
        //debug_string += "Run ID: " + newRunID + "<br />";
        debug_string += "Task: " + taskID + " out of 80<br />";
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
        debug_string += "Question AOI: x1=" + x1 + ", x2=" + x2 + ", x3=" + x3 + ", x4=" + x4 + "<br />";
        debug_string += "<br />";


        Answer.InnerHtml = debug_string.Replace("_"," ");

        
        
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
        <style type="text/css">
            body {
                font-family:"Arial";  
            }
            .domain {
                fill: none; 
                stroke: black; 
                stroke-width: 1;
            }
        </style>
</head>
<body>
    <form id="form1" runat="server">
    
    <div id='data' style='visibility:hidden;' runat="server"></div>
    <div id='intervention' style='visibility:hidden;' runat="server"></div>
    <div id='colorFamily'  style='visibility:hidden;' runat="server"></div>
    <center>
    <div id='infovis' style="position:relative; top:20px; left:80px; right:0px; width:1100px;"></div>
    <br /><br />
    <div id='QuestionText' runat="server"></div>
    <br /><br />
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
