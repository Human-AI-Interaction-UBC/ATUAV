<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="Break.aspx.cs" Inherits="ATUAV_Experiment.Experiment.Break" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title></title>
</head>
<body>
    <form id="form1" runat="server">
    <div>
        <br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br />
        <center>
        Time for a break!
        <asp:Button ID="continueButton" runat="server" Text="continue to calibration" PostBackUrl="CalibrationAfterBreak.aspx" />
        </center>
    </div>
    </form>
</body>
</html>
