<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="default.aspx.cs" Inherits="ATUAV_Experiment.FormIndex" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<script runat="server">
    
    protected void Page_Load(object sender, EventArgs e)
    {
        String userID = Request.Form["userID"];

        if (userID != null)
        {
            int[] task_order = new int[80];

            for (int i = 0; i < 80; i++)
            {
                task_order[i] = i + 18;
            }

            Session["task_order"] = task_order;
            Session["current_task"] = 0;
            Session["userID"] = userID;
            
            Response.Redirect("Visualization.aspx");
        }
    }   
    
</script>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title>ATUAV-Experiment</title>
</head>
<body>
    <form id="form1" runat="server">
    <div>
    <br /><br /><br /><br /><br /><br /><br />
        <center>
        Please enter your User ID: <asp:TextBox ID="userID" runat="server" />
        <asp:Button ID="button1" runat="server" Text="submit" />
        </center>
    </div>
    </form>
</body>
</html>
