var data = 
[ [9.2, 12.1, 7.7, 9.5, 11.9, 11.5, 10, 11.3], 
[11.1, 11, 14.45, 11.3, 10.3, 9.8, 9.1, 12.8],
[8.6, 13.5, 13.5, 12, 14.3, 12.7, 11.9, 11.9] ];
var numTicks = 3;
var n = 8, // number of samples
    m = data.length; // number of series

//BEN: Need this variable to be able to stop blinking
var timeOutHandle;

//BEN: Added the series name
var seriesName = ["Class_Average", "Andrea", "Diana"];

var subject = ["Physics", "Marine Biology", "Calculus", "Geometry", "Painting", "Phtography", 
					"English Literature", "Anthropology"];
var grade = ["0","50","100"];		
var stack = new Array;
var paper ;
var linePaper;
var barWidth;
			
				
var w = 975,
    h = 280,
    bodyW = 1200,
    bodyH = 330,
    strokeWidth=5,
    chartPadding = 25;
    y = d3.scale.linear().domain([0, 15]).range([ h,0]),
    y1 = d3.scale.linear().domain([0, 15]).range([ 0, h]),
    x0 = d3.scale.ordinal().domain(d3.range(n)).rangeBands([0, w], .3),
    x1 = d3.scale.ordinal().domain(d3.range(m)).rangeBands([0, x0.rangeBand()]),
    score = d3.scale.linear().domain([0,500]).range([0, 100]);
    pix2Score = d3.scale.linear().domain([0,100]).range([0, 500]);

    score2 = d3.scale.linear().domain([0,15]).range([0, 100]);
    z = d3.scale.category20c();   

var xAxis = d3.svg.axis()
					.scale(x0)
					.orient("bottom")
					.ticks(m)
					.tickFormat(function(i){ return subject[i];});

var yAxis = d3.svg.axis()
				.scale(y)
				.orient("left")
				.ticks(numTicks)
				//.tickFormat(function(numbTicks){ return grade[numTicks];});
				.tickFormat(function(numTicks){ return Math.floor(score2(numTicks)); });
				
var vis = d3.select("body")
  .append("svg:svg")
    .attr("width", bodyW)
    .attr("height", bodyH)
  .append("svg:g")
    .attr("transform", "translate(20,20)");



var g = vis.selectAll("g")
    .data(data) 
  .enter().append("svg:g") 
    .attr("fill", function(d, i) { return z(i); })
    //this transform works as spread out the coordinates of different series
    .attr("transform", function(d, i) { return "translate(" + x1(i) + ",0)"; })
//BEN: added id to series (i.e. "Average", "Andrea", "Diana"  in our case)
	.attr("id", function(d, i) { return seriesName[i]; });	
	
var rect = g.selectAll("rect")
//Object = the sec dimension in the two dimension array
    .data(Object)
  .enter().append("svg:rect")
  //this transform spreads out the different group
    .attr("transform", function(d, i) { return "translate(" + x0(i) + ", 0)"; })
    .attr("width", x1.rangeBand())
    .attr("height", y1)
    .attr("y", function(d) { return h- y1(d) ; })
//the x-coor for all bars    
    .attr("x", 4)
//BEN: added id to individual bars (between 0-7 in our case)
	.attr("id", function(d, i) {return 'value' + i;});  

// Add axes
vis.append("g")
	.attr("class", "axis")
   	.attr("transform", "translate(10,0)")
   	.attr("font-size", "11px")
   	.call(yAxis);

vis.append("g")
   	.attr("class", "axis")
   	.attr("transform", "translate( 4," + h + ")")
   	.attr("font-size", "11px")
   	.call(xAxis);
        
        
var legend = vis.selectAll("g.legend")
       .data(seriesName)
       .enter().append("svg:g")
       .attr("class", "legend")
       .attr("id", String)
       .attr("transform", function(d, i) { return "translate(" + (bodyW-200) + "," + ((i * 20 )+bodyH-300) + ")"; });
       
       legend.append("svg:circle")
       .attr("r", 3)
       .attr("fill",function(d, i) { return z(i); } );
       
       legend.append("svg:text")
       .attr("x", 12)
       .attr("dy", ".31em")
       .text(function(d) { return d; });
                  
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
	
	for (var i=0; i<seriesValuesPairs.length; i++)
	{
		value[i] = $("#"+ seriesValuesPairs[i][0]).children("#value"+ seriesValuesPairs[i][1]).attr("height");
		xCor[i] = $("#"+ seriesValuesPairs[i][0]).children("#value"+ seriesValuesPairs[i][1]).offset().left;
		yCor[i] = $("#"+ seriesValuesPairs[i][0]).children("#value"+ seriesValuesPairs[i][1]).offset().top;		
		
	}
	
	barWidth = $("#"+ seriesValuesPairs[0][0]).children("#value"+ seriesValuesPairs[0][1]).attr("width");
	
	for (var i = 0; i<value.length; i++){
		intValue[i] = Math.floor(value[i])
	}
	
	var textData = new Array;
	for(var i = 0; i<xCor.length; i++){
		textData[i] = [ intValue[i], xCor[i], yCor[i]];
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

function deEmphRest(selectedBars){
	
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
	rect.each(function (i,d) { hArr[i] = $(this).attr("height")});
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
	rect.each(function (i,d) { hArr[i] = $(this).attr("height")});
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

	rect.each(function (i,d) { value[i] = $(this).attr("height")});
	rect.each(function(i,d) {xCor[i] = $(this).offset().left});
	rect.each(function(i,d) {yCor[i] = $(this).offset().top});
	

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
 				.attr("x", function(d){	return x0(d[1]) + 10 ;})
 				.attr("y", function(d){	return d[2] -35 ; } )
 				.attr("dx", 3)
 				.attr("dy", ".35em")
 				.attr("font-family", "sans-serif")
 				.attr("fill", "black")
 				.attr("text-anchor", "middle")
 				.attr("class", function(d, i) {return 'groupTextID';})

 				//.attr("transform", function(d, i) { return "translate(" + x1(i) + "," + "0)"; })
 				.text(function(d){return Math.floor(score(d[0]));});
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
 				.attr("x", function(d){	return d[1]  - 20;})
 				.attr("y", function(d){	return d[2] -35 ; } )
 				.attr("dx", 3)
 				.attr("dy", ".35em")
 				.attr("font-family", "sans-serif")
 				.attr("fill", "black")
 				.attr("text-anchor", "middle")
 				.attr("class", function(d, i) {return 'textID';})
 				.text(function(d){return Math.floor(score(d[0]));});
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
	paper = new Raphael(0,0,625,500);
	
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
	linePaper = new Raphael(0,0,625,500);
	
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
	linePaper = new Raphael(0,0,625,500);
	
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
    .attr("transform", function(d, i) { return "translate(" + x1(i) + ",0)"; });



	var rectComp = g.selectAll("rectComp")
//Object = the sec dimension in the two dimension array
    .data(Object)
  .enter().append("svg:rect")
  //this transform spreads out the different group
    .attr("transform", function(d, i) { return "translate(" + x0(i) + ", 0)"; })
    .attr("width", x1.rangeBand())
    .attr("height", y)
    .attr("y", 0)
//the x-coor for all bars    
    .attr("x", 4)
    .attr("fill", "#D0D0D0 ")
//BEN: added id to individual bars (between 0-7 in our case)
    .attr("class", function(d, i) { return "compBars"; });	
    
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
	selectedJLegend = getSelectedJLegend(["Class_Average", "Diana"]);
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

function triggerA1(){
	selectedGroup = "#Diana";
	selectedGroup2 = "#Class_Average";
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
	selectedJBars = getSelectedJBars([["Andrea", "2"],["Class_Average", "2"],["Diana", "2"],["Andrea", "5"],["Class_Average", "5"],["Diana", "5"]]);
	drawArrow(selectedJBars);
	
	setTimeout("undoArrow()", 5000);
}

function triggerD1(){
	selectedBars = getSelectedBars([["Andrea", "1"],["Andrea", "6"]]);
	deEmphRest(selectedBars);
	setTimeout("undoDeEmph(selectedBars)", 5000);
}

function triggerE1(){
	selectedJBars = getSelectedJBars([["Andrea", "0"],["Andrea", "1"],["Andrea", "2"], ["Andrea", "3"], ["Andrea", "4"],["Andrea", "5"], ["Andrea", "6"], ["Andrea", "7"],
	["Class_Average", "0"],["Class_Average", "1"],["Class_Average", "2"], ["Class_Average", "3"], ["Class_Average", "4"],["Class_Average", "5"], ["Class_Average", "6"], ["Class_Average", "7"],
	["Diana", "0"],["Diana", "1"],["Diana", "2"], ["Diana", "3"], ["Diana", "4"],["Diana", "5"], ["Diana", "6"], ["Diana", "7"]]);
	drawArrowLine(selectedJBars);
	setTimeout("undoArrowLine()", 5000);
}

function triggerE2(){
	selectedJBars1 = getSelectedJBars([["Andrea", "0"],["Class_Average", "0"],["Diana", "0"]]);
	selectedJBars2 = getSelectedJBars([["Andrea", "1"],["Class_Average", "1"],["Diana", "1"]]);
	selectedJBars3 = getSelectedJBars([["Andrea", "2"],["Class_Average", "2"],["Diana", "2"]]);
	selectedJBars4 = getSelectedJBars([["Andrea", "3"],["Class_Average", "3"],["Diana", "3"]]);
	selectedJBars5 = getSelectedJBars([["Andrea", "4"],["Class_Average", "4"],["Diana", "4"]]);
	selectedJBars6 = getSelectedJBars([["Andrea", "5"],["Class_Average", "5"],["Diana", "5"]]);
	selectedJBars7 = getSelectedJBars([["Andrea", "6"],["Class_Average", "6"],["Diana", "6"]]);
	selectedJBars8 = getSelectedJBars([["Andrea", "7"],["Class_Average", "7"],["Diana", "7"]]);

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

function triggerE3(){

	selectedJBars1 = getSelectedJBars([["Andrea", "0"],["Class_Average", "0"],["Diana", "0"]]);
	selectedJBars2 = getSelectedJBars([["Andrea", "1"],["Class_Average", "1"],["Diana", "1"]]);
	selectedJBars3 = getSelectedJBars([["Andrea", "2"],["Class_Average", "2"],["Diana", "2"]]);
	selectedJBars4 = getSelectedJBars([["Andrea", "3"],["Class_Average", "3"],["Diana", "3"]]);
	selectedJBars5 = getSelectedJBars([["Andrea", "4"],["Class_Average", "4"],["Diana", "4"]]);
	selectedJBars6 = getSelectedJBars([["Andrea", "5"],["Class_Average", "5"],["Diana", "5"]]);
	selectedJBars7 = getSelectedJBars([["Andrea", "6"],["Class_Average", "6"],["Diana", "6"]]);
	selectedJBars8 = getSelectedJBars([["Andrea", "7"],["Class_Average", "7"],["Diana", "7"]]);

	drawArrowLineRelative(selectedJBars1);
	drawArrowLineRelative(selectedJBars2);
	drawArrowLineRelative(selectedJBars3);
	drawArrowLineRelative(selectedJBars4);
	drawArrowLineRelative(selectedJBars5);
	drawArrowLineRelative(selectedJBars6);
	drawArrowLineRelative(selectedJBars7);
	drawArrowLineRelative(selectedJBars8);
	
	/**setTimeout("undoArrowLine(selectedJBars1)", 5000);
	setTimeout("undoArrowLine(selectedJBars2)", 5000);
	setTimeout("undoArrowLine(selectedJBars3)", 5000);
	setTimeout("undoArrowLine(selectedJBars4)", 5000);
	setTimeout("undoArrowLine(selectedJBars5)", 5000);
	setTimeout("undoArrowLine(selectedJBars6)", 5000);
	setTimeout("undoArrowLine(selectedJBars7)", 5000);
	setTimeout("undoArrowLine(selectedJBars8)", 5000);*/

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
	selectedJBars4 = getSelectedJBars([["Andrea", "4"],["Class_Average", "4"],["Diana", "4"]]);
	selectedJBars6 = getSelectedJBars([["Andrea", "6"],["Class_Average", "6"],["Diana", "6"]]);

	drawArrowLineRelative(selectedJBars4);
	drawArrowLineRelative(selectedJBars6);

}

function triggerH1(){
	selectedJBars1 = getSelectedJBars([["Andrea", "1"],["Diana", "1"]]);
	selectedJBars3 = getSelectedJBars([["Andrea", "3"],["Diana", "3"]]);

	drawArrowLineRelative(selectedJBars1);
	drawArrowLineRelative(selectedJBars3);

}
//BEN: Stop Blinking
function stopBlinking(){
	clearTimeout(timeOutHandle);
}
