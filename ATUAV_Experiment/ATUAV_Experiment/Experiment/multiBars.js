//var data=new array();
//    = [ [9.2, 12.1, 7.7, 9.5, 11.9, 11.5, 10, 11.3], 
//[11.1, 11, 14.45, 11.3, 10.3, 9.8, 9.1, 12.8],
//[8.6, 13.5, 13.5, 12, 14.3, 12.7, 11.9, 11.9],
////[8.6, 13.5, 13.5, 12, 14.3, 12.7, 11.9, 11.9], 
////[8.6, 13.5, 13.5, 12, 14.3, 12.7, 11.9, 11.9], 
////[8.6, 13.5, 13.5, 12, 14.3, 12.7, 11.9, 11.9], 
////[8.6, 13.5, 13.5, 12, 14.3, 12.7, 11.9, 11.9],
//];



var data = [];
var seriesName = [];

var colorFamily = [//["127, 201, 127","190, 174, 212","253, 192, 134","255, 255, 153","56, 108, 176","240, 2, 127"],
				  ["241,89,95", "121,195,106", "89,154,211", "249,166,90", "158,102,171"],
				  ["205,112,88", "89,154,211", "241,89,95", "215,127,179", "121,195,106", "230, 171, 2"],
                  //["166, 206, 227", "31, 120, 180", "178, 223, 138", "51, 160, 44", "251, 154, 153", "227, 26, 28"],
				  ["205,112,88", "89,154,211", "121,195,106", "158,102,171", "241,89,95"],
                  //["228, 26, 28", "55, 126, 184", "77, 175, 74", "152, 78, 163", "248,158,90", "255, 255, 51"], 
				  ["241, 89,95", "121,195,106", "249,166,90", "215,127,179", "205,112,88"],
				  ["249,166,90", "205,112,88", "89,154,211", "215,127,179", "121,195,106"],
                  //["141, 211, 199", "255, 255, 179", "190, 186, 218", "251, 128, 114", "128, 177, 211", "253, 180, 98"]
				  ["205,112,88", "121,195,106", "215,127,179", "89,154,211", "241, 89,95"]
				 ];
				 
// if a valid color family is provided use that, otherwise use the random color family				 
var randomFamily;
var family=$("#colorFamily").html();
var obj = JSON.parse(family);
if(obj.colorFamily<6 && obj.colorFamily>0) 
	randomFamily=obj.colorFamily;
else 
	randomFamily= Math.floor(Math.random()*6);

var subject = [];
//BEN: Added the series name


var barData = $("#data").html();
var interventionData = $("#intervention").html();//
//alert(interventionData);



// Loading data from XML
xmlDoc=loadXMLDoc(barData);
//alert("XML Root Tag Name: " + xmlDoc.documentElement.tagName);

// Populating XML data into Array
var M = xmlDoc.getElementsByTagName("series");

for (var i=0;i<M.length;i++) {
    data[i] = [];
}

for (i = 0; i < M.length; i++) {
    var currentSeries = xmlDoc.getElementsByTagName("series").item(i);
    seriesName[i] = currentSeries.attributes[0].nodeValue;

    var children = currentSeries.getElementsByTagName("sample");
    for (var j = 0; j < children.length; j++)
    {
        subject[j]=children[j].attributes[0].nodeValue;
        data[i][j] = children[j].attributes[1].nodeValue;
    };   
}

xAxisLabel = "";
yAxisLabel = "";
xAxisLabel = xmlDoc.getElementsByTagName("xaxis").item(0).attributes[0].nodeValue;
yAxisLabel = xmlDoc.getElementsByTagName("yaxis").item(0).attributes[0].nodeValue;

var numTicks = 5;
var n = data[0].length; // number of samples
m = data.length; // number of series


//BEN: Need this variable to be able to stop blinking
var timeOutHandle;

var grade = ["0","50",""];		
var stack = new Array;
var paper ;
var linePaper;
var barWidth;
			
				
var w = 800,
h = 580,
bodyW = 1100,
bodyH = 660,
strokeWidth=2,
chartPadding = 25;
y = d3.scale.linear().domain([0, 100]).range([ h,0]),
    y1 = d3.scale.linear().domain([0, 100]).range([ 0, h]),
    x0 = d3.scale.ordinal().domain(d3.range(n)).rangeBands([0, w], .3),
    x1 = d3.scale.ordinal().domain(d3.range(m)).rangeBands([0, x0.rangeBand()]),
    score = d3.scale.linear().domain([0,500]).range([0, 100]);
pix2Score = d3.scale.linear().domain([0,100]).range([0, 500]);

score2 = d3.scale.linear().domain([0,100]).range([0, 100]);
z = d3.scale.category20c();

var xAxis = d3.svg.axis()
.scale(x0)
.orient("bottom")
.ticks(m)
.tickFormat(function (i) {
    return subject[i].replace(/_/g,' ');
})
;



var yAxis = d3.svg.axis()
.scale(y)
.orient("left")
.ticks(numTicks)
.tickFormat(function(numTicks){
    return Math.floor(score2(numTicks));
});
				
var vis = d3.select("#infovis")
.append("svg:svg")
.attr("width", bodyW)
.attr("height", bodyH)
.append("svg:g")
.attr("transform", "translate(30,20)");

var g = vis.selectAll("g")
.data(data) 
.enter().append("svg:g") 
.attr("fill", function(d, i) {
	
	if(i==0) return  "rgb(0, 0, 0)";
	else return "rgb("+colorFamily[randomFamily][i-1] + ")";	  
})
//this transform works as spread out the coordinates of different series
.attr("transform", function(d, i) {
    return "translate(" + x1(i) + ",0)";
})
//BEN: added id to series (i.e. "Average", "Andrea", "Diana"  in our case)
.attr("id", function(d, i) {
    return seriesName[i];
});	
	
var rect = g.selectAll("rect")
//Object = the sec dimension in the two dimension array
.data(Object)
.enter().append("svg:rect")
//this transform spreads out the different group
.attr("transform", function(d, i) {
    return "translate(" + x0(i) + ", 0)";
})
.attr("width", x1.rangeBand())
.attr("height", y1)
.attr("y", function(d) {
    return h- y1(d) ;
})
//the x-coor for all bars    
.attr("x", 4)
//BEN: added id to individual bars (between 0-7 in our case)
.attr("id", function(d, i) {
    return 'value' + i;
});  

// Add axes
vis.append("g")
    .attr("class", "axis")
    .attr("transform", "translate(10,0)")
    .attr("font-size", "13px")
    .call(yAxis);

vis.append("g")
    .attr("class", "axis")
    .attr("id", "xaxis")
    .attr("transform", "translate( 4," + h + ")")
    .attr("font-size", "13px")
    .call(xAxis);

vis.append("text")
    .attr("class", "x label")
    .attr("text-anchor", "center")
    .attr("font-weight", "bold")
	.attr("font-style", "italic")
    .attr("font-size", "15px")
    .attr("x", bodyH / 2 + 30)
    .attr("y", h + 50)
    .text(xAxisLabel);

// Break long labels
var xaxiscontainer = $("#xaxis");
$("text", xaxiscontainer).each(function (index) {

    labelCheck = $(this).text().trim();

    if (labelCheck.indexOf(" ") >= 0 && labelCheck.length > 11) {
        yvalue = parseInt($(this).attr("y"));
        splitLabels = labelCheck.split(" ");
        $(this).text(splitLabels[0]);
        for (i = 1; i < splitLabels.length; i++) {
            yvalue = yvalue + 13;
            newLabel = $(this).clone();
            newLabel.attr("y", yvalue);
            newLabel.text(splitLabels[i]);
            $(this).parent().append(newLabel);

        }

    }
});

vis.append("text")
    .attr("class", "y label")
    .attr("text-anchor", "center")
    .attr("font-weight", "bold")
	.attr("font-style", "italic")
    .attr("font-size", "15px")
    .attr("transform", "rotate(270," + (155) + "," + (175) + ")")
    .text(yAxisLabel);

var legendNames = seriesName.slice();
$.each(legendNames, function (index, value) {
    legendNames[index] = value.replace(/_/g,' ');
});        
        
var legend = vis.selectAll("g.legend")
.data(legendNames)
.enter().append("svg:g")
.attr("class", "legend")
.attr("id", String)
.attr("transform", function(d, i) {
    return "translate(" + (bodyW-250) + "," + ((i * 22 )+bodyH-300) + ")";
});
       
legend.append("svg:rect")
    .attr("width", 10)
    .attr("height", 10)
    .style("fill",function(d, i) {
		if(i==0) return  "rgb(0, 0, 0)";
		else return "rgb("+colorFamily[randomFamily][i-1] + ")"; 
    } );
       
legend.append("svg:text")
    .attr("x", 12)
    .attr("dy", ".70em")
    .text(function(d) {
        return d;
    });

 
// Loading intervention and interventiontime from XML
xmlDoc=loadXMLDoc(interventionData);
var currentIntervention = xmlDoc.getElementsByTagName("intervention").item(0).attributes[0].nodeValue;
var currentInterventionTime = xmlDoc.getElementsByTagName("intervention").item(0).attributes[1].nodeValue;

// Populating data structure from XML and call the intervention function
    var groups = xmlDoc.getElementsByTagName("group");
    //alert(groups.length);
     var seriesValuePairGroups=[];

    for (i=0;i<groups.length;i++){
        seriesValuePairGroups[i] = [];
        var currentGroup=xmlDoc.getElementsByTagName("group").item(i);
            
        children = currentGroup.getElementsByTagName("bar");
        for (j = 0; j < children.length; j++)
        {
            seriesValuePairGroups[i][j]=[];
            seriesValuePairGroups[i][j][0]=children[j].attributes[0].nodeValue;            
            for(var k=0;k<subject.length;k++){ // need to do this since the intervention works with subject index and not the subject name
//                alert(children[j].attributes[1].nodeValue+" "+subject[k]+'');
                if (children[j].attributes[1].nodeValue == subject[k]) {
                    seriesValuePairGroups[i][j][1]=k;
                    break;
                }
            }
            if(k==subject.length) 
				alert("Error in converting sample name into subject index");
            //alert(seriesValuePairGroups[i][j][0]+','+seriesValuePairGroups[i][j][1]);
        };    
    }
    var countReq = 0;
    if (currentInterventionTime == 'T0')
    {
        setIntervention();
    }
    else if (currentInterventionTime == 'TX') {
        $('.phase2').css('visibility', 'hidden');
        var intervalID = setInterval(function () { checkForGraphCondition() }, 1000);
    }


    //Check if Graph has been looked at
    function checkForGraphCondition() {

        var eyeTrackerDivData = "";
        var objJason = null;

        $.getJSON("http://localhost:8080/atuav/condition?processorId=experiment-c&condition=showText&callback=?", function (data) {
            if (data == true) {
                $('.phase1').css('visibility', 'hidden');
                $('.phase2').css('visibility', 'visible');
                clearInterval(intervalID);
                countReq = 0;
                intervalID = setInterval(function () { checkForTextCondition() }, 1000);
            }
        });
        if (countReq == 2) {
            $('.phase1').css('visibility', 'hidden');
            $('.phase2').css('visibility', 'visible');
            clearInterval(intervalID);
            countReq = 0;
            intervalID = setInterval(function () { checkForTextCondition() }, 1000);
        }
        countReq++;
    }



//Check if Text has been looked at
    function checkForTextCondition() {

	    var eyeTrackerDivData = "";
        var objJason = null;

        $.getJSON("http://localhost:8080/atuav/condition?processorId=experiment-c&condition=showIntervention&callback=?", function (data) {
            if (data == true) {
                $('.phase1').css('visibility', 'visible');
                setIntervention();
                clearInterval(intervalID);
            }
        });
        if (countReq == 2) {
            $('.phase1').css('visibility', 'visible');
            setTimeout(setIntervention, 1000);
            clearInterval(intervalID);
        }
        countReq++;
    }

//Enamul: Set the intervention based on eye tracking data or time limit exit	
	function setIntervention(){	
		var id;
		var interventionStartTime=0;
		if(currentIntervention=="ConnectedArrow"){
			id=setTimeout(function(){triggerConnectedArrow(seriesValuePairGroups)},interventionStartTime);    
		}
		else if(currentIntervention=="DeEmphasis"){
			id=setTimeout(function(){triggerdeEmphRest(seriesValuePairGroups)},interventionStartTime);    
		}
		else if(currentIntervention=="Bolding"){
			id=setTimeout(function(){triggerBolding(seriesValuePairGroups)},interventionStartTime);    
		}
		else if(currentIntervention=="AvgReferenceLine"){
			id=setTimeout(function(){triggerAvgReferenceLine(seriesValuePairGroups)},interventionStartTime);
		}	
	}
	

//Enamul: Loading XML data    
function loadXMLDoc(xmlData){
    if (window.DOMParser)
      {
        parser=new DOMParser();
        xmlDoc=parser.parseFromString(xmlData,"text/xml");
      }
    else // Internet Explorer
      {
        xmlDoc=new ActiveXObject("Microsoft.XMLDOM");
        xmlDoc.async=false;
        xmlDoc.loadXML(xmlData);
      }
      return xmlDoc;
}

//BEN: Get multiple bars	
function getSelectedBars(seriesValuesPairs){
	
    selectedBars = new Array();
	
    for (var i=0; i<seriesValuesPairs.length; i++)
    {
        series = seriesValuesPairs[i][0];
        value = seriesValuesPairs[i][1];
        selectedBars[i] = d3.select('#'+series).select('#value'+value);
    }
	
    return selectedBars;
}
/**
  * ways to selected bars in jQuery
  * input: array of bars value pairs
  * return: 2D array of value, xCor, yCor
  */
function getSelectedJBars(seriesValuesPairs){
    // not sure if this is needed
    //	var selectedBars = new Array();
    var value = new Array;
    var xCor = new Array;
    var yCor = new Array;
    var intValue = new Array;

    for (var i = 0; i < seriesValuesPairs.length; i++) {
        value[i] = $("#"+ seriesValuesPairs[i][0]).children("#value"+ seriesValuesPairs[i][1]).attr("height");
        xCor[i] = $("#" + seriesValuesPairs[i][0]).children("#value" + seriesValuesPairs[i][1]).offset().left;
        yCor[i] = $("#" + seriesValuesPairs[i][0]).children("#value" + seriesValuesPairs[i][1]).offset().top;
    }
	
    barWidth = $("#"+ seriesValuesPairs[0][0]).children("#value"+ seriesValuesPairs[0][1]).attr("width");
	
    for (var i = 0; i<value.length; i++){
        intValue[i] = Math.floor(value[i])
    }

    var textData = new Array;
    for (var i = 0; i < xCor.length; i++) {
        textData[i] = [intValue[i], xCor[i], yCor[i]];
    }
	
    return textData;
} 
/**
 * param array of series, e.g. ["Average", "Diana"]
 */
function getSelectedJLegend(series){
	
    //TODO implementation, getting x, y coordinates of legend
    // return the x-Cor and y-Cor in a 2D array
	
    var empty = new Array;
    var xCor = new Array;
    var yCor = new Array;
	
    for (var i=0; i<series.length;i++){
        empty[i] = " ";
        xCor[i] = $(".legend#"+ series[i]).offset().left;
        yCor[i] = $(".legend#"+ series[i]).offset().top;
    }

    var textData = new Array;
    for(var i = 0; i<xCor.length; i++){
        textData[i] = [ empty[i], xCor[i], yCor[i]];
    }
	
    return textData;
}

function contain(obj, array){
    for(var i = 0; i<array.length; i++){
        if(array[i] == obj){
            return true;

        }
    }
    return false;
}

function drawColorChange(selectedBars){
    for (var i=0; i<selectedBars.length; i++)
    {
        selectedBars[i].style("fill", "yellow");
    }
    stack.push("drawColorChange");
}
 
function undoColorChange(selectedBars){
    for (var i=0; i<selectedBars.length; i++)
    {
        selectedBars[i].style("fill", null);
    }
    stack.pop();
}

function bolding(selectedBars){
    for (var i=0; i<selectedBars.length; i++)
    {
        selectedBars[i].style("stroke-width", strokeWidth)
        .style("stroke", "black");
    }
    stack.push("bolding");
}

function undoBolding(selectedBars){
	
    for (var i=0; i<selectedBars.length; i++)
    {
        selectedBars[i].style("stroke-width", 0)
        .style("stroke", null);
    }
    stack.pop();
}

//BEN: blink 1 (i.e. changing the colour, then calling blink 2)
function blink(selectedBars)
{
    for (var i=0; i<selectedBars.length; i++)
    {
        selectedBars[i].style("fill", "#ffff00");
    }
    stack.push("blink");
    timeOutHandle = setTimeout("blink2(selectedBars)",500)
}
//BEN: blink 2 (i.e. changing the colour back, then calling blink 1)
function blink2(selectedBars)
{
    for (var i=0; i<selectedBars.length; i++)
    {
        selectedBars[i].style("fill", null);
    }
	
    timeOutHandle = setTimeout("blink(selectedBars)",500)
}

//Enamul: I found bugs in the folloiwing deEmphRest function: can't select the right bars to be emphasized
/* function deEmphRest(selectedBars){
	
    var selectedId = new Array();
    var selectedHeight = new Array();
	
    for(var i = 0; i< selectedBars.length; i++){
        selectedId[i] = selectedBars[i].attr("id");
        selectedHeight[i] = selectedBars[i].attr("height");
	
    }
	
    rect.each(function(d,i) {		
        var thisRect = d3.select(this);	
        if (!contain(thisRect.attr("id"), selectedId) || !contain(thisRect.attr("height"),selectedHeight)) {
			
            thisRect.style("opacity", 0.2);	
        }
    });
    stack.push("deEmphRest");
} */

//Enamul: Corrected version of deemphasis
function deEmphRest(selectedBars){
	var deEmphBarList=[];
	var deEmphBarListCount = 0;

    for(var i = 0; i< seriesName.length; i++){
		for(var j = 0; j< subject.length; j++){
		 	for(var k = 0; k< selectedBars.length; k++){

				if(seriesValuePairGroups[0][k][0]== seriesName[i] && seriesValuePairGroups[0][k][1]== j)
					break;
			} 
			if(k==selectedBars.length) {
				deEmphBarList[deEmphBarListCount]=[];
				deEmphBarList[deEmphBarListCount][0]=seriesName[i];
				deEmphBarList[deEmphBarListCount][1]=j;
				deEmphBarListCount++;
			}
		}
	}
	
	var deemphBars= getSelectedBars(deEmphBarList);
	for(i = 0; i< deemphBars.length; i++){ 
        deemphBars[i].style("opacity", 0.2);	
	}


    stack.push("deEmphRest");
}
 
function undoDeEmph(selectedBars){
    var selectedId = new Array();
    var selectedHeight = new Array();
	
    for(var i = 0; i< selectedBars.length; i++){
        selectedId[i] = selectedBars[i].attr("id");
        selectedHeight[i] = selectedBars[i].attr("height");
	
    }
	
    rect.each(function(d,i) {		
        var thisRect = d3.select(this);	
        if (!contain(thisRect.attr("id"), selectedId) || !contain(thisRect.attr("height"),selectedHeight)) {
            thisRect.style("opacity", 1);	
        }
    });
    stack.pop();
}

function drawLine(value, colour, bool){
	
    vis.append("svg:line")
    .attr("x1", strokeWidth*2)
    .attr("y1", h-value)
    .attr("x2", w)
    .attr("y2", h-value)
    .style("stroke",colour)
    .style("stroke-width", strokeWidth);
							
    vis.append("svg:text")
    .attr("class", "refLineText")
    .attr("x",strokeWidth*2)
    .attr("y", h-value-strokeWidth)
    .style("fill",colour);
//TODO this boolean thing didn't work. why?		
//	if(bool==true)
//		vis.text("Score: "+ Math.floor(score(value)));
	
}

function referenceLine(selectedGroup){
	
    var rect = $(selectedGroup).children();
	
	
    var hArr = new Array;
    var colour;
    rect.each(function (i,d) {
        hArr[i] = $(this).attr("height")
        });
    colour = $(selectedGroup).attr("fill");
    var sum = 0;
	
    for(var i = 0; i<hArr.length; i++){
        sum += parseFloat(hArr[i]);
    }	
    var avg = sum/hArr.length;
								
    var	min=hArr[0];
    for(var i = 0; i<hArr.length; i++){
        if(hArr[i]<min)
            min=hArr[i];
    } 
	
    var max = hArr[0];
    for(var i = 0; i<hArr.length; i++){
        if(hArr[i]>max)
            max=hArr[i];
    }
	
    drawLine(avg, colour, true);
    drawLine(min, colour, false);		
    drawLine(max, colour,true);					

    stack.push("referenceLine");
}  

//Enamul: Draw average referenfe line for a sample
function drawReferenceLine(seriesSamplepair) {

    selectedBars = getSelectedJBars(seriesSamplepair);

    var xCor = new Array;
    var yCor=selectedBars[0][2]; //by default
    var corLin = new Array;
    linePaper = new Raphael(0,0,bodyW,bodyH);

    for (var i = 0; i < selectedBars.length; i++){
	
        xCor[i] = selectedBars[i][1];
        if(seriesSamplepair[i][0]=="Average")
            yCor = selectedBars[i][2];
 
        corLin[i] = xCor[i]+barWidth/2;

    }

    var	minXVal = d3.min(corLin)-barWidth/2;
    var maxXVal = d3.max(corLin)+barWidth/2;
    var maxYVal = yCor;

    var arrowXLin = linePaper.path("M" + minXVal+" "+ maxYVal +"L" + maxXVal + " " + maxYVal +"Z");

    stack.push("drawReferenceLine");
}

function undoRefLine(){
	
    d3.selectAll("line").remove();
    $(".refLineText").remove();
    stack.pop();
}

function drawBlock(min, max, colour){
	
    var refBlock = vis.append("svg:rect")
    .attr("x", strokeWidth*2)
    .attr("y", h-max)
    .attr("width", w)
    .attr("height", Math.abs(max-min))
    .style("fill",colour)
    .style("opacity", 0.2);
/**.attr("x", strokeWidth*2)
							.attr("y", min)
							.attr("width", w)
							.attr("height", max-min)
							.style("fill",colour)
							.style("opacity", 0.2);**/
}

function referenceGroupBlock(selectedGroup){
	
    var rect = $(selectedGroup).children();
	
	
    var hArr = new Array;
    var colour;
    rect.each(function (i,d) {
        hArr[i] = $(this).attr("height")
        });
    colour = $(selectedGroup).attr("fill");
    var sum = 0;
	
    for(var i = 0; i<hArr.length; i++){
        sum += parseFloat(hArr[i]);
    }	
    var avg = sum/hArr.length;
	
							
    var	min=hArr[0];
    for(var i = 0; i<hArr.length; i++){
        if(hArr[i]<min)
            min=hArr[i];
    } 

	
    var max = hArr[0];
    for(var i = 0; i<hArr.length; i++){
        if(hArr[i]>max)
            max=hArr[i];
    }
    drawBlock(min, max, colour);

    stack.push("referenceGroupBlock");
}  

function referenceIndiBlock(selectedBars){
    //TODO position of the block is wrong,,, Sept 4th still wrong...
    var xCor = new Array;
    var yCor = new Array;
    var corLin = new Array;
    //var colour = $(selectedBars[1]).attr("fill");

	
    for (var i = 0; i < selectedBars.length; i++){
	
        yCor[i] = selectedBars[i][2];
	 
    }
    var	minVal = d3.min(yCor);
    var maxVal = d3.max(yCor);
    maxVal = pix2Score(maxVal);
    minVal = pix2Score(minVal);

    drawBlock(maxVal, minVal, "grey");

    stack.push("referenceIndiBlock");
}

function showGroupValue(selectedGroup)
{
    var rect = $(selectedGroup).children();
    var value = new Array;
    var xCor = new Array;
    var yCor = new Array;
    var intValue = new Array;

    rect.each(function (i,d) {
        value[i] = $(this).attr("height")
        });
    rect.each(function(i,d) {
        xCor[i] = $(this).offset().left
        });
    rect.each(function(i,d) {
        yCor[i] = $(this).offset().top
        });
	

    for (var i = 0; i<value.length; i++){
        intValue[i] = Math.floor(value[i])
    }

    var textData = new Array;
    for(var i = 0; i<xCor.length; i++){
        textData[i] = [ intValue[i], xCor[i], yCor[i]];
    }

    d3.select(selectedGroup).selectAll("text")
    .data(textData)
    .enter().append("svg:text")
    .attr("x", function(d){
        return x0(d[1]) + 10 ;
    })
    .attr("y", function(d){
        return d[2] -35 ;
    } )
    .attr("dx", 3)
    .attr("dy", ".35em")
    .attr("font-family", "sans-serif")
    .attr("fill", "black")
    .attr("text-anchor", "middle")
    .attr("class", function(d, i) {
        return 'groupTextID';
    })

    //.attr("transform", function(d, i) { return "translate(" + x1(i) + "," + "0)"; })
    .text(function(d){
        return Math.floor(score(d[0]));
    });
    stack.push("showGroupValue");		
}

function undoGroupValue(){
    d3.select("g").selectAll(".groupTextID").remove();
    stack.pop();
}

function showIndiValue(selectedBars)
{
    var baseXCor = selectedBars[0][1];
    g.select("text") 			
    .data(selectedBars)
    .enter().append("svg:text")
    .attr("x", function(d){
        return d[1]  - 20;
    })
    .attr("y", function(d){
        return d[2] -35 ;
    } )
    .attr("dx", 3)
    .attr("dy", ".35em")
    .attr("font-family", "sans-serif")
    .attr("fill", "black")
    .attr("text-anchor", "middle")
    .attr("class", function(d, i) {
        return 'textID';
    })
    .text(function(d){
        return Math.floor(score(d[0]));
    });
    stack.push("showIndiValue");			
}

function undoIndiValue(){
    d3.select("g").selectAll(".textID").remove();
    stack.pop();
}

//arrow
Raphael.fn.arrow = function (x1, y1, x2, y2, size) {
    var angle = Math.atan2(x1-x2,y2-y1);
    angle = (angle / (2 * Math.PI)) * 360;
    var arrowPath = this.path("M" + x2 + " " + y2 + " L" + (x2  - size) + " " + (y2  - size) + " L" + (x2  - size)  + " " + (y2  + size) + " L" + x2 + " " + y2 )
    .attr("fill","black")
    .rotate((90+angle),x2,y2);
    var linePath = this.path("M" + x1 + " " + y1 + " L" + x2 + " " + y2);
    return [linePath,arrowPath];
};

function drawArrow(selectedBars){
	
    var xCor = new Array;
    var yCor = new Array;
    var arrow = new Array;
    paper = new Raphael(0,0,bodyW,bodyH);
	
    for (var i = 0; i < selectedBars.length; i++){
	
        xCor[i] = selectedBars[i][1];
        yCor[i] = selectedBars[i][2];
	
        arrow[i] = paper.arrow(xCor[i]-20,yCor[i]-20,xCor[i],yCor[i],10);
    }
    stack.push("drawArrow");



}

Raphael.fn.arrow = function (x1, y1, x2, y2, size) {
    var angle = Math.atan2(x1-x2,y2-y1);
    angle = (angle / (2 * Math.PI)) * 360;
    var arrowPath = this.path("M" + x2 + " " + y2 + " L" + (x2  - size) + " " + (y2  - size) + " L" + (x2  - size)  + " " + (y2  + size) + " L" + x2 + " " + y2 )
    .attr("fill","black")
    .rotate((90+angle),x2,y2);
    var linePath = this.path("M" + x1 + " " + y1 + " L" + x2 + " " + y2);
        
    return [linePath,arrowPath];
};


Raphael.fn.arrowLine = function(x1,y1,x2,y2){
    var lineConnect = this.path("M"+x1 + " "+ y1 +"L" +x2 +" " +y2);
        
    return [lineConnect];
}

function undoArrow(){
    paper.clear();
    stack.pop();
}



function drawArrowLine(selectedBars){
	
    var xCor = new Array;
    var yCor = new Array;
    var arrow = new Array;
    var corLin = new Array;
    linePaper = new Raphael(0,0,bodyW,bodyH);
	
    for (var i = 0; i < selectedBars.length; i++){
	
        xCor[i] = selectedBars[i][1];
        yCor[i] = selectedBars[i][2];
	
        arrow[i] = linePaper.arrow(xCor[i]+barWidth/2,25,xCor[i]+barWidth/2,yCor[i],10);
	 
        corLin[i] = xCor[i]+barWidth/2;
	 
    }
    var	minVal = d3.min(corLin);
    var maxVal = d3.max(corLin);
    var arrowLin = linePaper.path("M" + minVal+" "+ 25 +"L" + maxVal + " " + 25 +"Z");
    stack.push("drawArrowLine");
}

function drawArrowLineRelative(selectedBars){
	var xCor = new Array;
	var yCor = new Array;
	var arrow = new Array;
	var corLin = new Array;
	linePaper = new Raphael(0,0,bodyW,bodyH);
	
    for (var i = 0; i < selectedBars.length; i++){
	
	    xCor[i] = selectedBars[i][1];
	    yCor[i] = selectedBars[i][2];
	    corLin[i] = xCor[i]+barWidth/2;
    }
    var	minXVal = d3.min(corLin);
    var maxXVal = d3.max(corLin);
    var maxYVal = d3.min(yCor);
    maxYVal = maxYVal- 20;
    var arrowXLin = linePaper.path("M" + minXVal+" "+ maxYVal +"L" + maxXVal + " " + maxYVal +"Z");

    for (var i = 0; i < selectedBars.length; i++){
        arrow[i] = linePaper.arrow(xCor[i]+barWidth/2,maxYVal,xCor[i]+barWidth/2,yCor[i],10);
    }
    stack.push("drawArrowLineRelative");
}

function undoArrowLine(){
    linePaper.clear();
    stack.pop();

}

function compBars(){
    //TODO ABLE TO PICK BARS
	
    var gComp = vis.selectAll("g")
    .data(data) 
    .enter().append("svg:g") 
    //this transform works as spread out the coordinates of different series
    .attr("transform", function(d, i) {
        return "translate(" + x1(i) + ",0)";
    });



    var rectComp = g.selectAll("rectComp")
    //Object = the sec dimension in the two dimension array
    .data(Object)
    .enter().append("svg:rect")
    //this transform spreads out the different group
    .attr("transform", function(d, i) {
        return "translate(" + x0(i) + ", 0)";
    })
    .attr("width", x1.rangeBand())
    .attr("height", y)
    .attr("y", 0)
    //the x-coor for all bars    
    .attr("x", 4)
    .attr("fill", "#D0D0D0 ")
    //BEN: added id to individual bars (between 0-7 in our case)
    .attr("class", function(d, i) {
        return "compBars";
    });	
    
    stack.push("compBars");

}

function undoCompBars(){
    $(".compBars").remove();
    stack.pop();
}

function texture(selectedBars){
    for (var i=0; i<selectedBars.length; i++)
    {
        selectedBars[i].attr("background", "pattern.jpeg");
    }
    stack.push("texture");
}
 
function undoTexture(selectedBars){
    for (var i=0; i<selectedBars.length; i++)
    {
        selectedBars[i].style("fill", null);
    }
    stack.pop();
}

function hightLightLabel(label){
    //TODO Attribute is set, but change isn't shown on page?!
    $("text:contains('"+label+"')").css("background-color", "yellow");
}

function undoHighLightLabe(label){
    //TODO Attribute is set, but change isn't shown on page?!
    $("text:contains('"+label+"')").css("background-color", "white");

}

function trigger(){
	
    //BEN: EXAMPLE 5: Get the 2nd for Andrea and 3rd value for Diana and make selection blink
    //	selectedBars = getSelectedBars([["Andrea", "2"],["Average", "0"], ["Diana", "3"]]);
    //	blink(selectedBars);

    //	selectedJBars = getSelectedJBars([["Andrea", "1"],["Diana", "6"]]);

    //	lineComp(selectedJBars);
    //	showIndiValue(selectedJBars);
    //	drawArrow(selectedJBars);
    //	alert(stack);
    //	undoArrow()
    //	alert(stack);
	
	
    selectedJBars = getSelectedJBars([["Andrea", "1"],["Diana", "2"], ["Diana", "3"], ["Andrea", "0"]]);
    selectedBars = getSelectedBars([["Andrea", "1"],["Diana", "6"]]);

    selectedGroup = "#Diana";
    label="Painting";
    selectedJLegend = getSelectedJLegend(["Average", "Diana"]);
    //	drawArrow(selectedJLegend);
    //	deEmphRest(selectedBars);
    //referenceLine(selectedGroup);
    //referenceLine(selectedGroup);
    //highlight(selectedBars);
    //bolding(selectedBars)
    //	texture(selectedBars);
	

    showIndiValue(selectedJBars);
    //	compBars();
    //	drawArrow(selectedJBars);
    //	drawArrowLine(selectedJBars);
    /**	selectedJBars = getSelectedJBars([["Andrea", "0"],["Diana", "0"]]);
	drawArrowLine(selectedJBars);
	selectedJBars = getSelectedJBars([["Andrea", "1"],["Diana", "1"]]);
	drawArrowLine(selectedJBars);
	alert(stack);
	undoArrowLine();
	alert(stack);**/
	

    /**	setTimeout("bolding(selectedBars)", 1500);
 	setTimeout("highlight(selectedBars)", 2500);
 	setTimeout("deEmphRest(selectedBars)", 4500);
    setTimeout("showIndiValue(selectedJBars)", 5500);
	setTimeout("drawArrow(selectedJBars)", 6500);
	setTimeout("compBars()", 7500);
	setTimeout("drawArrowLine(selectedJBars)", 8500);
	
	setTimeout("undoArrowLine()", 9500);
	setTimeout("undoCompBars()", 10500);
	setTimeout("undoArrow()", 11500);
	setTimeout("undoIndiValue()",12500);
	setTimeout("undoDeEmph(selectedBars)", 13500);
	setTimeout("undoHighlight(selectedBars)", 14500);
	setTimeout("undoBolding(selectedBars)",15500);
//	setTimeout("referenceLine(selectedGroup)", 500);
	//setTimeout("undoRefLine()", 17500);
	setTimeout("referenceBlock(selectedGroup)", 500);
	//  	clearTimeout(timeOutHandle);**/
    //selectedJBars = getSelectedJBars([["Andrea", "0"],["Diana", "0"]]);
    //drawArrowLine(selectedJBars);
    //selectedJBars = getSelectedJBars([["Andrea", "1"],["Diana", "1"]]);
    //drawArrowLine(selectedJBars);
    referenceGroupBlock(selectedGroup);
    referenceIndiBlock(selectedJBars);
//hightLightLabel(label);

}

// show selected series label on the bar
function showSeriesLabelOnBar(selectedGroup)
{
    var rect = $(selectedGroup).children();
    var value = new Array;
    var xCor = new Array;
    var yCor = new Array;
    var intValue = new Array;

    rect.each(function (i,d) {
        value[i] = $(this).attr("height")
        });
    rect.each(function(i,d) {
        xCor[i] = $(this).offset().left
        });
    rect.each(function(i,d) {
        yCor[i] = $(this).offset().top
        });
	

    for (var i = 0; i<value.length; i++){
        intValue[i] = Math.floor(value[i])
    }

    var textData = new Array;
    for(var i = 0; i<xCor.length; i++){
        textData[i] = [ intValue[i], xCor[i], yCor[i]];
    }

    d3.select(selectedGroup).selectAll("text")
    .data(textData)
    .enter().append("svg:text")
    .attr("x", function(d){
        return x0(d[1]) + 10 ;
    })
    .attr("y", function(d){
        return d[2] -10 ;
    } )
    .attr("dx", 3)
    .attr("dy", ".35em")
    .attr("font-family", "arial")
    .attr("fill", "black")
    .attr("font-weight", "bold")    
    .attr("text-anchor", "middle")
    .attr("class", function(d, i) {
        return 'groupTextID';
    })
    .attr("transform",  function(d){
        return " rotate (270 "+(x0(d[1])+22)+" "+(d[2])+")";
    })
    //.attr("transform", function(d, i) { return "translate(" + x1(i) + "," + "0)"; })
    .text(function(){
        //return Math.floor(score(d[0]));
        var a= selectedGroup;
        b= a.substr(1, a.length);
        return b;
    });

    stack.push("showSeriesLabelOnBar");
}

 

// Enamul: Show sample labels on top of the bar
function showSampleLabel(seriesSamplepair)
{
     selectedBars = getSelectedJBars(seriesSamplepair);
    var textData = new Array;     
    for(var i = 0; i<selectedBars.length; i++){

        textData[i] = [ seriesSamplepair[i][1],selectedBars[i][1], selectedBars[i][2]];// taking sample index, and X,Y coord
    }     
    g.select("text") 			
    .data(textData)
    .enter().append("svg:text")
    .attr("x", function(d){
        return d[1]  - 20;
    })
    .attr("y", function(d){
        return d[2] -35 ;
    } )
    .attr("dx", 3)
    .attr("dy", ".35em")
    .attr("font-family", "sans-serif")
    .attr("fill", "black")
    .attr("text-anchor", "middle")
    .attr("class", function(d, i) {
        return 'textID';
    })
    .text(function(d,i){
        return subject[d[0]];
    });
    stack.push("showIndiValue");			
}

function triggerA1(){
    selectedGroup = "#Diana";
    selectedGroup2 = "#Average";
    selectedGroup3 = "#Andrea";
    showGroupValue(selectedGroup);
    showGroupValue(selectedGroup2);
    showGroupValue(selectedGroup3);
	
    setTimeout("undoGroupValue()", 5000);
}

function triggerA2(){
    //TODO implement undoRefBlock
    drawBlock(pix2Score(50),pix2Score(100),"grey");
	
}

function triggerB1(){
    //TODO select by series
    selectedBars = getSelectedBars([["Andrea", "0"],["Andrea", "1"],["Andrea", "2"], ["Andrea", "3"], ["Andrea", "4"],["Andrea", "5"], ["Andrea", "6"], ["Andrea", "7"]]);
    drawColorChange(selectedBars);
	
    setTimeout("undoColorChange(selectedBars)", 5000);
}

function triggerC1(){
    //TODO select by series
    selectedJBars = getSelectedJBars([["Andrea", "2"],["Average", "2"],["Diana", "2"],["Andrea", "5"],["Average", "5"],["Diana", "5"]]);
    drawArrow(selectedJBars);
	
    setTimeout("undoArrow()", 5000);
}

function triggerdeEmphRest(){
    for (i = 1; i < seriesValuePairGroups.length; i++) {  // merge all the groups into one group
        for (j = 0; j < seriesValuePairGroups[i].length; j++) {
            seriesValuePairGroups[0].push(seriesValuePairGroups[i][j]);
            k++;
        }
    }
    selectedBars = getSelectedBars(seriesValuePairGroups[0]);
    deEmphRest(selectedBars);   
}
function triggerBolding(){
    for (i = 0; i < seriesValuePairGroups.length; i++) {
        selectedBars = getSelectedBars(seriesValuePairGroups[i]);
        bolding(selectedBars);
    }  
}
function triggerE1(){
    selectedJBars = getSelectedJBars([["Andrea", "0"],["Andrea", "1"],["Andrea", "2"], ["Andrea", "3"], ["Andrea", "4"],["Andrea", "5"], ["Andrea", "6"], ["Andrea", "7"],
        ["Average", "0"],["Average", "1"],["Average", "2"], ["Average", "3"], ["Average", "4"],["Average", "5"], ["Average", "6"], ["Average", "7"],
        ["Diana", "0"],["Diana", "1"],["Diana", "2"], ["Diana", "3"], ["Diana", "4"],["Diana", "5"], ["Diana", "6"], ["Diana", "7"]]);
    drawArrowLine(selectedJBars);
    setTimeout("undoArrowLine()", 5000);
}

function triggerE2(){
    selectedJBars1 = getSelectedJBars([["Andrea", "0"],["Average", "0"],["Diana", "0"]]);
    selectedJBars2 = getSelectedJBars([["Andrea", "1"],["Average", "1"],["Diana", "1"]]);
    selectedJBars3 = getSelectedJBars([["Andrea", "2"],["Average", "2"],["Diana", "2"]]);
    selectedJBars4 = getSelectedJBars([["Andrea", "3"],["Average", "3"],["Diana", "3"]]);
    selectedJBars5 = getSelectedJBars([["Andrea", "4"],["Average", "4"],["Diana", "4"]]);
    selectedJBars6 = getSelectedJBars([["Andrea", "5"],["Average", "5"],["Diana", "5"]]);
    selectedJBars7 = getSelectedJBars([["Andrea", "6"],["Average", "6"],["Diana", "6"]]);
    selectedJBars8 = getSelectedJBars([["Andrea", "7"],["Average", "7"],["Diana", "7"]]);

    drawArrowLine(selectedJBars1);
    drawArrowLine(selectedJBars2);
    drawArrowLine(selectedJBars3);
    drawArrowLine(selectedJBars4);
    drawArrowLine(selectedJBars5);
    drawArrowLine(selectedJBars6);
    drawArrowLine(selectedJBars7);
    drawArrowLine(selectedJBars8);
	
/**setTimeout("undoArrowLine(selectedJBars1)", 5000);
	setTimeout("undoArrowLine(selectedJBars2)", 5000);
	setTimeout("undoArrowLine(selectedJBars3)", 5000);
	setTimeout("undoArrowLine(selectedJBars4)", 5000);
	setTimeout("undoArrowLine(selectedJBars5)", 5000);
	setTimeout("undoArrowLine(selectedJBars6)", 5000);
	setTimeout("undoArrowLine(selectedJBars7)", 5000);
	setTimeout("undoArrowLine(selectedJBars8)", 5000);*/

}

function triggerConnectedArrow(seriesValuePairGroups){

    for(i=0;i<seriesValuePairGroups.length;i++){
        selectedJBars1 = getSelectedJBars(seriesValuePairGroups[i]);  
        drawArrowLineRelative(selectedJBars1);
    }

}

function triggerF1(){
    selectedJBars1 = getSelectedJBars([["Andrea", "0"],["Diana", "0"]]);
    selectedJBars2 = getSelectedJBars([["Andrea", "1"],["Diana", "1"]]);
    selectedJBars3 = getSelectedJBars([["Andrea", "2"],["Diana", "2"]]);
    selectedJBars4 = getSelectedJBars([["Andrea", "3"],["Diana", "3"]]);
    selectedJBars5 = getSelectedJBars([["Andrea", "4"],["Diana", "4"]]);
    selectedJBars6 = getSelectedJBars([["Andrea", "5"],["Diana", "5"]]);
    selectedJBars7 = getSelectedJBars([["Andrea", "6"],["Diana", "6"]]);
    selectedJBars8 = getSelectedJBars([["Andrea", "7"],["Diana", "7"]]);

    drawArrowLineRelative(selectedJBars1);
    drawArrowLineRelative(selectedJBars2);
    drawArrowLineRelative(selectedJBars3);
    drawArrowLineRelative(selectedJBars4);
    drawArrowLineRelative(selectedJBars5);
    drawArrowLineRelative(selectedJBars6);
    drawArrowLineRelative(selectedJBars7);
    drawArrowLineRelative(selectedJBars8);
}

function triggerG1(){
    selectedJBars4 = getSelectedJBars([["Andrea", "4"],["Average", "4"],["Diana", "4"]]);
    selectedJBars6 = getSelectedJBars([["Andrea", "6"],["Average", "6"],["Diana", "6"]]);

    drawArrowLineRelative(selectedJBars4);
    drawArrowLineRelative(selectedJBars6);

}

function triggerH1(){
    selectedJBars1 = getSelectedJBars([["Andrea", "1"],["Diana", "1"]]);
    selectedJBars3 = getSelectedJBars([["Andrea", "3"],["Diana", "3"]]);

    drawArrowLineRelative(selectedJBars1);
    drawArrowLineRelative(selectedJBars3);

}
//Enamul Avg reference line
function triggerAvgReferenceLine(seriesValuePairGroups){

    for (i = 0; i < seriesValuePairGroups.length; i++)
    {
        selectedJBars1 = seriesValuePairGroups[i];
        drawReferenceLine(selectedJBars1);
    }
}
// Enamul: Gridline
function triggerGrid(){
    for(var i = 1; i*5<=100; i++){	
        drawLine(pix2Score(i*5),"grey",true);
    }
}
// Enamul: Intervention: Labelling bars with series name
function triggerSeriesLabels(){
    selectedGroup = "#Diana";    
    showSeriesLabelOnBar(selectedGroup);    
}

function triggerSamplesLabels(){
    
    var seriesSamplepair=[["Andrea", "2"],["Diana", "5"], ["Diana", "4"], ["Andrea", "0"]];
    
    //	drawArrow(selectedJLegend);
    //	deEmphRest(selectedBars);
    //referenceLine(selectedGroup);
    //referenceLine(selectedGroup);
    //highlight(selectedBars);
    //bolding(selectedBars)
    //	texture(selectedBars);

    showSampleLabel(seriesSamplepair);
}
//BEN: Stop Blinking
function stopBlinking(){
    clearTimeout(timeOutHandle);
    }