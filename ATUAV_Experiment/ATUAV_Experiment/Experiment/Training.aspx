<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="Training.aspx.cs" Inherits="ATUAV_Experiment.Experiment.Training" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<script runat="server">
    protected void Page_Load(object sender, EventArgs e)
    {
        int current_training = (int)Session["current_training"];
        String trainingHTML = "";
        
        if (current_training == 0)
        {
            trainingHTML += "<img src='TrainingImages/RV.JPG' /></br><br />";
            trainingHTML += "<b>Training:</b> Please point at the bar that shows Heather's grade in Biology</b>";
            
                
            current_training++;
            Session["current_training"] = current_training;
        }
        else if (current_training == 1)
        {
            trainingHTML += "<img src='TrainingImages/CDV.JPG' /></br><br />";
            trainingHTML += "<b>Training:</b> Please point at the bar that shows the average movie revenue in New York";
            
            current_training++;
            Session["current_training"] = current_training;
        }
        else if (current_training == 2)
        {
            trainingHTML += "<img src='TrainingImages/RV.JPG' /></br><br />";
            trainingHTML += "<b>Training:</b> Please answer the following question (note: this is the type of question you will be asked)<br/><br/>";
            trainingHTML += "<b>Is <i>Joshua</i>'s grade in <i>Chemistry</i> above the class average for that course?</b><br/><br/>";
            trainingHTML += "<input type='radio' name='training' value='yes'>yes <input type='radio' name='training' value='no'>no";
            
            current_training++;
            Session["current_training"] = current_training;
        }
        else if (current_training == 3)
        {
            trainingHTML += "<img src='TrainingImages/CDV.JPG' /></br><br />";
            trainingHTML += "<b>Training:</b> Please answer the following question (note: this is the type of question you will be asked)<br/><br/>";
            trainingHTML += "<b>In how many cities is <i>Bus Driver</i> above the average revenue and <i>Club Universe</i> is below it?</b><br/><br/>";
            for(int i=0; i<=8; i++)
            {
                trainingHTML += "<input type='radio' name='answer' value='"+i+"'>"+i+" ";
            }
            
            current_training++;
            Session["current_training"] = current_training;
        }
        else if (current_training == 4)
        {
            Random r = new Random();
            int interventionTraining = r.Next(1, 5);
            
            trainingHTML += "<img src='TrainingImages/"+interventionTraining+".JPG' /></br><br />";
            trainingHTML += "<b>Training:</b> Sometimes the graph will contain a small help for you to solve the task (called intervention).<br>";
            trainingHTML += "This is one type of such an intervention, can you spot it?</b>";


            current_training++;
            Session["current_training"] = current_training;
        }
        else if (current_training == 5)
        {
            trainingHTML += "<img id='animatedImage' border='2' src='TrainingImages/RV-Empty.JPG' /></br><br />";
            trainingHTML += "<b>Training:</b> Sometimes the graph and question text will appear in sequence.<br>";
            trainingHTML += "Please familiarize yourself with whatever is visible on the screen at any given time.<br />";
            trainingHTML += "The sequence is as follows: 1. Graph only, 2. Question Text only, 3. Graph & Text<br/>";
            trainingHTML += "<a href='#' onclick='play()'> See example</a>";
            
            current_training++;
            Session["current_training"] = current_training;
        }
        else if (current_training == 6)
        {
            trainingHTML += "<br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br />Do you have any further questions?<br/><br/>";


            current_training++;
            Session["current_training"] = current_training;
        }
        else if (current_training == 7)
        {
            Response.Redirect("CalibrationAfterTraining.aspx");
        }

        TrainingQuestion.InnerHtml = trainingHTML;
        
    }
</script>

<html xmlns="http://www.w3.org/1999/xhtml">
<head id="Head1" runat="server">
    <title>Training</title>
        <script type="text/javascript" src="jquery.min.js"></script>
        <script type="text/javascript">

            function play() {

                setTimeout(function ()
                {$("#animatedImage").attr("src", "TrainingImages/RV-Empty.JPG"); }, 2000);

                setTimeout(function ()
                {$("#animatedImage").attr("src", "TrainingImages/RV-Graph.JPG"); }, 4000);

                setTimeout(function ()
                { $("#animatedImage").attr("src", "TrainingImages/RV-Text.JPG"); }, 11000);

                setTimeout(function ()
                { $("#animatedImage").attr("src", "TrainingImages/RV-Full.JPG"); }, 17000);
           }

        </script>

        <style type="text/css">
            body {
                font-family:"Arial";  
            }
            .domain {
                fill: none; 
                stroke: black; 
                stroke-width: 1;
            }
            .arrow {
              stroke: #000;
              stroke-width: 1.5px;
            }
        </style>
</head>
<body>
    <form id="form1" runat="server">
    <div>
        <br /><br /><br /><br /><br /><br />
        <center>
        <div id='TrainingQuestion' runat="server"></div><br />
        <asp:Button ID="button1" runat="server" Text="continue" />
        </center>
    </div>
    </form>
</body>
</html>