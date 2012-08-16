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
var seriesName = ["Average", "Andrea", "Diana"];

var subject = ["Physics", "Marine Biology", "Calculus", "Geometry", "Painting", "Phtography", 
					"English Literature", "Anthropology"];				
var stack = new Array;
var paper ;
var linePaper;
var barWidth;
			
				
var w = 625,
    h = 500,
    bodyW = 875,
    bodyH = 700,
    strokeWidth=5,
    chartPadding = 25;
    y = d3.scale.linear().domain([0, 15]).range([ h,0]),
    y1 = d3.scale.linear().domain([0, 15]).range([ 0, h]),
    x0 = d3.scale.ordinal().domain(d3.range(n)).rangeBands([0, w], .3),
    x1 = d3.scale.ordinal().domain(d3.range(m)).rangeBands([0, x0.rangeBand()]),
    score = d3.scale.linear().domain([0,500]).range([0, 100]);
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
				.tickFormat(function(numTicks){ return score(numTicks); });
				
var vis = d3.select("body")
  .append("svg:svg")
    .attr("width", bodyW)
    .attr("height", bodyH)
  .append("svg:g")
    .attr("transform", "translate(10,10)");



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
       .attr("transform", function(d, i) { return "translate(" + h + "," + (i * 20 ) + ")"; });
       
       legend.append("svg:circle")
       .attr("class", String)
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
	
	var selectedBars = new Array();
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
 
function contain(obj, array){
	for(var i = 0; i<array.length; i++){
		if(array[i] == obj){
				return true;

		}
	}
	return false;
}


//BEN: highlight selection
function highlight(selectedBars){
	for (var i=0; i<selectedBars.length; i++)
	{
		selectedBars[i].style("fill", "yellow");
	}
	stack.push("highlight");
 }
 
function undoHighlight(selectedBars){
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

function drawLine(value, colour){
	
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
		.style("fill",colour)
		.text("Score: "+ Math.floor(score(value)));
	
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
	
	drawLine(avg, colour);
	drawLine(min, colour);		
	drawLine(max, colour);					

	stack.push("referenceLine");
}  

function undoRefLine(){
	
	d3.selectAll("line").remove();
	$(".refLineText").remove();
	stack.pop();
}

function referenceBlock(selectedGroup){
	
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
							
		var refBlock = vis.append("svg:rect")
							.attr("x", strokeWidth*2)
							.attr("y", h-max)
							.attr("width", w)
							.attr("height", max-min)
							.style("fill",colour)
							.style("opacity", 0.2);

	stack.push("referenceBlock");
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
 				.attr("y", function(d){	return d[2] -25 ; } )
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

function undogGroupValue(){
	d3.select("g").selectAll(".groupTextID").remove();
	stack.pop();
}

function showIndiValue(selectedBars)
{
			var baseXCor = selectedBars[0][1];
	 		g.select("text") 			
 				.data(selectedBars)
 				.enter().append("svg:text")
 				.attr("x", function(d){	return d[1]  - 13;})
 				.attr("y", function(d){	return d[2] -25 ; } )
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

function undoArrowLine(){
	linePaper.clear();
	stack.pop();

}

function compBars(){
	
	
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

//function d3Legend() {
  var margin = {top: 5, right: 0, bottom: 5, left: 10},
      height = 20,
      dispatch = d3.dispatch('legendClick', 'legendMouseover', 'legendMouseout');


  function chart(selection) {
    selection.each(function(data) {
      /**
      *    Legend curently is setup to automaticaly expand vertically based on a max width.
      *    Should implement legend where EITHER a maxWidth or a maxHeight is defined, then
      *    the other dimension will automatically expand to fit, and anything that exceeds
      *    that will automatically be clipped.
      **/

      var wrap = d3.select(this).selectAll('g.legend').data([data]);
      var gEnter = wrap.enter().append('g').attr('class', 'legend').append('g');


      var g = wrap.select('g')
          .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');


      var series = g.selectAll('.series')
          .data(function(d) { return d });
      var seriesEnter = series.enter().append('g').attr('class', 'series')
          .on('click', function(d, i) {
            dispatch.legendClick(d, i);
          })
          .on('mouseover', function(d, i) {
            dispatch.legendMouseover(d, i);
          })
          .on('mouseout', function(d, i) {
            dispatch.legendMouseout(d, i);
          });
      seriesEnter.append('circle')
          .style('fill', function(d, i){ return d.z || z[i % 10] })
          .style('stroke', function(d, i){ return d.z || z[i % 10] })
          .attr('r', 5);
      seriesEnter.append('text')
          .text(function(d) { return d.label })
          .attr('text-anchor', 'start')
          .attr('dy', '.32em')
          .attr('dx', '8');
      series.classed('disabled', function(d) { return d.disabled });
      series.exit().remove();


      var ypos = 5,
          newxpos = 5,
          maxwidth = 0,
          xpos;
      series
          .attr('transform', function(d, i) {
             var length = d3.select(this).select('text').node().getComputedTextLength() + 28;
             xpos = newxpos;

             //TODO: 1) Make sure dot + text of every series fits horizontally, or clip text to fix
             //      2) Consider making columns in line so dots line up
             //         --all labels same width? or just all in the same column?
             //         --optional, or forced always?
             if (w < margin.left + margin.right + xpos + length) {
               newxpos = xpos = 5;
               ypos += 20;
             }

             newxpos += length;
             if (newxpos > maxwidth) maxwidth = newxpos;

             return 'translate(' + xpos + ',' + ypos + ')';
          });

      //position legend as far right as possible within the total width
      g.attr('transform', 'translate(' + (w - margin.right - maxwidth) + ',' + margin.top + ')');

      height = margin.top + margin.bottom + ypos + 15;
    });

    return chart;
  }

  chart.dispatch = dispatch;

  chart.margin = function(_) {
    if (!arguments.length) return margin;
    margin = _;
    return chart;
  };

  chart.width = function(_) {
    if (!arguments.length) return width;
    width = _;
    return chart;
  };

  chart.height = function(_) {
    if (!arguments.length) return height;
    height = _;
    return chart;
  };

  chart.z = function(_) {
    if (!arguments.length) return z;
    z = _;
    return chart;
  };

//  return chart;
//}

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
/**	drawArrowLine(selectedJBars);
	alert(stack);
	undoArrowLine();
	alert(stack);**/
	

/** 	setTimeout("bolding(selectedBars)", 1500);
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
	setTimeout("undoBolding(selectedBars)",15500);**/
//	setTimeout("referenceLine(selectedGroup)", 500);
	//setTimeout("undoRefLine()", 17500);
	setTimeout("referenceBlock(selectedGroup)", 500);
	//  	clearTimeout(timeOutHandle);


}

//BEN: Stop Blinking
function stopBlinking(){
	clearTimeout(timeOutHandle);
}
