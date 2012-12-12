<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="CalibrationAfterTraining.aspx.cs" Inherits="ATUAV_Experiment.Experiment.CalibrationAfterTraining" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<script runat="server">
    
    protected void Page_Load(object sender, EventArgs e)
    {
        String go = Request.Form["Go"];

        if (go != null)
        {
            Response.Redirect("Visualization.aspx");
        }
    }

</script>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title></title>
</head>
<body>
    <form id="form1" runat="server">
    <input type='hidden' name='Go' value='Go'/>
    <div>
        <br /><br /><br /><br /><br /><br /><br /></br><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br />
        <center>
        Time for calibration. <br /><br />
        Done? Ready, Set, <asp:Button ID="button1" runat="server" Text="Go" />
        </center>
    </div>
    </form>
</body>
</html>
