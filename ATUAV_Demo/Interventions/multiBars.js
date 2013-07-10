// Possible color families
colorFamily = [
	["241,89,95", "121,195,106", "89,154,211", "249,166,90", "158,102,171"],
	["205,112,88", "89,154,211", "241,89,95", "215,127,179", "121,195,106", "230, 171, 2"],
	["205,112,88", "89,154,211", "121,195,106", "158,102,171", "241,89,95"],
	["241, 89,95", "121,195,106", "249,166,90", "215,127,179", "205,112,88"],
	["249,166,90", "205,112,88", "89,154,211", "215,127,179", "121,195,106"],
	["205,112,88", "121,195,106", "215,127,179", "89,154,211", "241, 89,95"]
]; 

// Create a graph object (represents the data for a single graph)
function DataGraph(dataID, infovisID, interventionID, colorFamilyID){
	this.data = [];
	this.seriesName = [];
	this.subject = [];
	var barData = $("#"+dataID).html();

	// LOAD DATA FROM XML EMBEDDED IN HTML	
	this.xmlDoc = this.loadXMLDoc(barData);
	var M = this.xmlDoc.getElementsByTagName("series");
	for (var i = 0; i < M.length; i++) {
		this.data[i] = [];
	}
	
	for (var i = 0; i < M.length; i++) {
		var currentSeries = this.xmlDoc.getElementsByTagName("series").item(i);
		this.seriesName[i] = currentSeries.attributes[0].nodeValue;
		
		var children = currentSeries.getElementsByTagName("sample");
		for (var j = 0; j < children.length; j++) {
			this.subject[j] = children[j].attributes[0].nodeValue;
			this.data[i][j] = children[j].attributes[1].nodeValue;
		}
	}
	
	// SET UP GRAPH
	this.family;
	var familyHTML = $("#"+colorFamilyID).html();
	var obj = JSON.parse(familyHTML);
	if (obj.colorFamily >= 0 && obj.colorFamily < colorFamily.length) {
		this.family = obj.colorFamily;
	} else {
		this.family = Math.floor(Math.random() * colorFamily.length);
	}
	
	// Set up labels
	this.xAxisLabel = "";
	this.yAxisLabel = "";
	this.xAxisLabel = this.xmlDoc.getElementsByTagName("xaxis").item(0).attributes[0].nodeValue;
	this.yAxisLabel = this.xmlDoc.getElementsByTagName("yaxis").item(0).attributes[0].nodeValue;

	// Set up graph
	var numTicks = 5;
	var n = this.data[0].length;	// number of samples
	var m = this.data.length;	// number of series
	
	var stack = new Array;
	var barWidth;
	
	var w = 800,
		h = 580,
		bodyW = 1100,
		bodyH = 660,
		strokeWidth = 2,
		chartPadding = 25;
		
	// resize graph if user has specified dimensions
	var userWidth = $("#"+infovisID).css("width");
	userWidth = Number(userWidth.substr(0, userWidth.length - 2));
	var userHeight = $("#"+infovisID).css("height");
	userHeight = Number(userHeight.substr(0, userHeight.length - 2));
	if (!isNaN(userWidth) && userWidth > 0) {
		bodyW = userWidth;
		w = bodyW - 300;
	}
	if (!isNaN(userHeight) && userHeight > 0) {
		bodyH = userHeight;
		h = bodyH - 80;
	}
	
	var y = d3.scale.linear().domain([0, 100]).range([h, 0]), y1 = d3.scale.linear().domain([0, 100]).range([0, h]), x0 = d3.scale.ordinal().domain(d3.range(n)).rangeBands([0, w], .3), x1 = d3.scale.ordinal().domain(d3.range(m)).rangeBands([0, x0.rangeBand()]), score = d3.scale.linear().domain([0, 500]).range([0, 100]);
	this.score2pix = d3.scale.linear().domain([0, 100]).range([0, h]);
	this.pix2score = d3.scale.linear().domain([0, h]).range([0, 100]);
	var z = d3.scale.category20c();
	
	var mySubject = this.subject;
	var xAxis = d3.svg.axis().scale(x0).orient("bottom").ticks(m).tickFormat(function(i) {
		return mySubject[i].replace(/_/g, ' ');
	});
	
	var yAxis = d3.svg.axis().scale(y).orient("left").ticks(numTicks);
	
	var vis = d3.select("#"+infovisID).append("svg:svg").attr("width", bodyW).attr("height", bodyH).append("svg:g").attr("transform", "translate(30,20)");
	
	// Create groups of series
	var myFamily = this.family;
	var mySeriesName = this.seriesName;
	var g = vis.selectAll("g").data(this.data).enter().append("svg:g").attr("fill", function(d, i) {
		if (i == 0) return "rgb(0, 0, 0)";
		else return "rgb(" + colorFamily[myFamily][i - 1] + ")";
		})
		
		//this transform spreads out the x-coordinates of different series
		.attr("transform", function(d, i) {
			return "translate(" + x1(i) + ",0)";
		})	
		
		//Add id to series (e.g. "Average", "Andrea", "Diana")
		.attr("id", function(d, i) {
			return mySeriesName[i];
		});
		
	// Create individual bars
	var rect = g.selectAll("rect")
		//Object = the sec dimension in the two dimension array
		.data(Object).enter().append("svg:rect")
		//this transform spreads out the different group
		.attr("transform", function(d, i) {
			return "translate(" + x0(i) + ", 0)";
		}).attr("width", x1.rangeBand()).attr("height", y1).attr("y", function(d) {
			return h - y1(d);
		})
		
		//the x-coor for all bars    
		.attr("x", 4)
		
		//Add id to individual bars
		.attr("id", function(d, i) {
			return 'value' + i;
		});

	// Add axes
	vis.append("g").attr("class", "axis").attr("transform", "translate(10,0)").attr("font-size", "13px").call(yAxis);
	vis.append("g").attr("class", "axis").attr("id", "xaxis").attr("transform", "translate( 4," + h + ")").attr("font-size", "13px").call(xAxis);
	vis.append("text").attr("class", "x label").attr("text-anchor", "center").attr("font-weight", "bold").attr("font-style", "italic").attr("font-size", "15px").attr("x", w/2).attr("y", h + 50).text(this.xAxisLabel);
	
	// Break long labels to two lines
	var xaxiscontainer = $("#"+dataID + " #xaxis");
	$("text", xaxiscontainer).each(function(index) {
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
	
	// Add label for y-axis
	vis.append("text").attr("class", "y label").attr("text-anchor", "center").attr("font-weight", "bold").attr("font-style", "italic").attr("font-size", "15px")
		.attr("transform", "translate(" + (-20) + "," + h/2 + ") rotate(270,0,0)").text(this.yAxisLabel);
	
	var legendNames = this.seriesName.slice();
	$.each(legendNames, function(index, value) {
		legendNames[index] = value.replace(/_/g, ' ');
	});
	
	var legend = vis.selectAll("g.legend").data(legendNames).enter().append("svg:g").attr("class", "legend").attr("id", function(String) {return String.replace(/ /g, '_');} ).attr("transform", function(d, i) {
		return "translate(" + (bodyW - 250) + "," + ((i * 22) + bodyH - 300) + ")";
	});
	
	var myFamily = this.family;
	legend.append("svg:rect").attr("width", 10).attr("height", 10).style("fill", function(d, i) {
		if (i == 0) return "rgb(0, 0, 0)";
		else return "rgb(" + colorFamily[myFamily][i - 1] + ")";
	});
	
	legend.append("svg:text").attr("x", 12).attr("dy", ".70em").text(function(d) {
		return d;
	});

	// LOAD INTERVENTION TYPE FROM XML (IF SPECIFIED)
	var interventionData = $("#"+interventionID).html();
	this.interventionDoc = this.loadXMLDoc(interventionData);
	this.currentIntervention = this.interventionDoc.getElementsByTagName("intervention").item(0).attributes[0].nodeValue;

	// LOAD INTERVENTION TARGETS FROM XML (IF SPECIFIED)
	var groups = this.interventionDoc.getElementsByTagName("group");
	this.seriesValuePairGroups = [];
	for (i = 0; i < groups.length; i++) {
		this.seriesValuePairGroups[i] = [];
		var currentGroup = groups.item(i);
	
		var children = currentGroup.getElementsByTagName("bar");
		for (j = 0; j < children.length; j++) {
			this.seriesValuePairGroups[i][j] = [];
			this.seriesValuePairGroups[i][j][0] = children[j].attributes.getNamedItem("series").nodeValue;
			for (var k = 0; k < this.subject.length; k++) { // need to do this since the intervention works with subject index and not the subject name
				if (children[j].attributes.getNamedItem("sample").nodeValue == this.subject[k]) {
					this.seriesValuePairGroups[i][j][1] = k;
					break;
				}
			}
			if (k == this.subject.length) {
				alert("Error in converting sample name into subject index");
			}
		};
	}
	
	// Save various member variables that are used by class functions
	this.vis = vis;
	this.strokeWidth = strokeWidth;
	this.infovisID = infovisID;
	this.h = h;
	this.w = w;
	this.g = g;
	
	// Return a copy of the graph object.
	return this;
}


// DATAGRAPH OBJECT FUNCTIONS 

// Parses the X-HTML tags representing data into an XML document.
DataGraph.prototype.loadXMLDoc = function(data) {
	var xmlDoc;
	if (window.DOMParser) {
		var parser = new DOMParser();
		xmlDoc = parser.parseFromString(data, "text/xml");
	} else // Internet Explorer
	{
		xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
		xmlDoc.async = false;
		xmlDoc.loadXML(xmlData);
	}
	return xmlDoc;
};

DataGraph.prototype.selectInverseBars = function selectInverseBars(seriesValuesPairs) {

	var selectedBars = new Array();
	var series = this.xmlDoc.getElementsByTagName("series");
	
	for (var i = 0; i < series.length; i++) {
		var seriesName = series[i].attributes.name.value;
		var numSamples = series[0].getElementsByTagName("sample").length;
		for (var j = 0; j < numSamples; j++){
			// Check whether this bar is in the set of series value pairs
			var selected = false;
			for (var k = 0; k < seriesValuesPairs.length; k++) {
				if (seriesValuesPairs[k][0] == seriesName && seriesValuesPairs[k][1] == j) {
					selected = true;
					break;
				}
			}
			if (!selected) {
				selectedBars.push(d3.select('#' + this.infovisID + " #" + seriesName).select('#value' + j));
			}
		}
	}
	
	return selectedBars;
}

DataGraph.prototype.deEmphRest = function deEmphRest(selectedBars) {
	for (var i = 0; i < selectedBars.length; i++) {
		selectedBars[i].style("opacity", 0.2)
	}
}

DataGraph.prototype.undoDeEmph = function undoDeEmph() {
	var rect = this.vis.selectAll("g").selectAll("rect");
	rect.each(function(d, i) {
		var thisRect = d3.select(this);
		thisRect.style("opacity", 1);
	});
}

DataGraph.prototype.bolding = function bolding(selectedBars) {
	for (var i = 0; i < selectedBars.length; i++) {
		selectedBars[i].style("stroke-width", this.strokeWidth).style("stroke", "black");	}
}

DataGraph.prototype.undoBolding = function undoBolding(selectedBars) {
	for (var i = 0; i < selectedBars.length; i++) {
		selectedBars[i].style("stroke-width", 0).style("stroke", null);
	}
}

DataGraph.prototype.drawArrowLineRelative = function(selectedBars, id){
	var xCor = new Array;
	var yCor = new Array;
	var arrow = new Array;
	var corLin = new Array;
	
	var leftOffset = $("#" + this.infovisID).offset().left+d3.transform(this.vis.attr("transform")).translate[0];
	var topOffset =  $("#" + this.infovisID).offset().top+d3.transform(this.vis.attr("transform")).translate[1];
	var arrowSize = Math.min(10, barWidth/2);
	var lineHeight = this.h;
	for (var i = 0; i < selectedBars.length; i++) {
		lineHeight = Math.max(-arrowSize-5, Math.min(lineHeight, selectedBars[i][2] - topOffset - 30));
	}

	for (var i = 0; i < selectedBars.length; i++) {

		xCor[i] = selectedBars[i][1] + barWidth/2 - leftOffset;
		yCor[i] = selectedBars[i][2] - topOffset;
		drawArrow(this.vis, xCor[i], lineHeight, xCor[i], yCor[i], arrowSize, id);

		corLin[i] = xCor[i];

	}
	var minVal = d3.min(corLin);
	var maxVal = d3.max(corLin);
	this.vis.append("svg:line")
		.attr("class", "arrow_"+id)
		.attr("x1", minVal).attr("y1", lineHeight)
		.attr("x2", maxVal).attr("y2", lineHeight)
		.style("stroke", "black")
		.style("stroke-width", this.strokeWidth)
}

DataGraph.prototype.undoArrows = function undoArrows(id) {
	$(".arrow_"+id).remove();
}

DataGraph.prototype.drawReferenceLine = function drawReferenceLine(seriesSamplePair) {
	selectedBars = getSelectedJBars(this.infovisID, seriesSamplePair);
	var xCor = new Array;
	var yCor = selectedBars[0][2]; // draws reference relative to first series
	var corLin = new Array;

	var leftOffset = $("#"+this.infovisID).offset().left+d3.transform(this.vis.attr("transform")).translate[0];
	var topOffset =  $("#"+this.infovisID).offset().top+d3.transform(this.vis.attr("transform")).translate[1];

	for (var i = 0; i < selectedBars.length; i++) {
		xCor[i] = selectedBars[i][1] - leftOffset;
		if (seriesSamplePair[i][0] == "Average") yCor = selectedBars[i][2];
		corLin[i] = xCor[i] + barWidth / 2;
	}

	var minXVal = d3.min(corLin) - barWidth / 2;
	var maxXVal = d3.max(corLin) + barWidth / 2;
	var maxYVal = yCor - topOffset;

	this.vis.append("svg:line")
		.attr("class", "referenceLine")
		.attr("x1", minXVal)
		.attr("y1", maxYVal)
		.attr("x2", maxXVal)
		.attr("y2", maxYVal)
		.style("stroke", "black")
		.style("stroke-width", this.strokeWidth);

}

DataGraph.prototype.undoReferenceLine = function undoReferenceLine() {
	$(".referenceLine").remove();
}

DataGraph.prototype.drawBlock = function drawBlock(min, max, colour) {
	var min = this.score2pix(min);
	var max = this.score2pix(max);
	this.refBlock = this.vis.append("svg:rect").attr("class", "refBlock")
						.attr("x", this.strokeWidth * 2)
						.attr("y", this.h - max)
						.attr("width", this.w)
						.attr("height", Math.abs(max - min))
						.style("fill", colour)
						.style("opacity", 0.2);
}

DataGraph.prototype.undoDrawBlock = function undoDrawBlock() {
	$(".refBlock").remove();
}

DataGraph.prototype.showValue = function showValue(selectedBars) {
	var dataArray = [];
	for (var i = 0; i < selectedBars.length; i++) {
		var bar = selectedBars[i];
		var value = this.pix2score(bar.attr("height"));
		var t = d3.transform(bar.attr("transform")).translate;
		// We need to find the parent of the bar to add the offset of the group
		var pt = d3.transform(bar.select(function() {return this.parentNode;}).attr("transform")).translate;
		var data = [value,
			Number(bar.attr("x"))+Number(t[0])+Number(pt[0]+1),
			Number(bar.attr("y"))+Number(t[1])+Number(pt[1])-5];
		dataArray[i] = data;
	}
	this.g.select("text").data(dataArray).enter().append("svg:text").attr("x", function(d) {
		return d[1];
	}).attr("y", function (d) {
		return d[2];
	}).text(function(d) {
		return Math.floor(d[0]);
	}).attr("class", "valueIntervention");
}

DataGraph.prototype.undoShowValue = function undoShowValue() {
	$(".valueIntervention").remove();
}

DataGraph.prototype.drawGrid = function drawGrid(spacing) {
	for (var i = 1; i * spacing <= 100; i++) {
		var value = this.score2pix(i * spacing);
		this.vis.append("svg:line")
			.attr("class", "gridline")
			.attr("x1", this.strokeWidth * 2)
			.attr("y1", this.h - value)
			.attr("x2", this.w)
			.attr("y2", this.h - value)
			.style("stroke", "grey")
			.style("stroke-width", this.strokeWidth);
	}
}

DataGraph.prototype.undoGrid = function undoGrid() {
	$(".gridline").remove();
}

DataGraph.prototype.boldLegend = function drawGrid(legendIDs) {
	for (var i = 0; i < legendIDs.length; i++){
		legendText = this.vis.select("g#" + legendIDs[i] + ".legend").selectAll("text").attr("font-weight", "bold");
	}
}

DataGraph.prototype.undoBoldLegend = function drawGrid(legendIDs) {
	for (var i = 0; i < legendIDs.length; i++){
		legendText = this.vis.select("g#" + legendIDs[i] + ".legend").selectAll("text").attr("font-weight", "normal");
	}
}


// GENERAL FUNCTIONS

//Get multiple bars	
function getSelectedBars(infovisID, seriesValuesPairs) {

	selectedBars = new Array();

	for (var i = 0; i < seriesValuesPairs.length; i++) {
		series = seriesValuesPairs[i][0];
		value = seriesValuesPairs[i][1];
		selectedBars[i] = d3.select('#' + infovisID + " #" + series).select('#value' + value);
	}

	return selectedBars;
}

//Get multiple bars using jQuery
//input: array of bars value pairs
//return: 2D array of value, xCor, yCor
function getSelectedJBars(infovisID, seriesValuesPairs) {
	var value = new Array;
	var xCor = new Array;
	var yCor = new Array;
	var intValue = new Array;

	for (var i = 0; i < seriesValuesPairs.length; i++) {
		value[i] = $("#" + infovisID + " #" + seriesValuesPairs[i][0]).children("#value" + seriesValuesPairs[i][1]).attr("height");
		xCor[i] = $("#" + infovisID + " #" + seriesValuesPairs[i][0]).children("#value" + seriesValuesPairs[i][1]).offset().left;
		yCor[i] = $("#" + infovisID + " #" + seriesValuesPairs[i][0]).children("#value" + seriesValuesPairs[i][1]).offset().top;
	}

	barWidth = $("#" + infovisID + " #" + seriesValuesPairs[0][0]).children("#value" + seriesValuesPairs[0][1]).attr("width");
	
	for (var i = 0; i < value.length; i++) {
		intValue[i] = Math.floor(value[i])
	}

	var textData = new Array;
	for (var i = 0; i < xCor.length; i++) {
		textData[i] = [intValue[i], xCor[i], yCor[i]];
	}

	return textData;
}

function drawArrow(svgElement, x1, y1, x2, y2, size, id) {
	var angle = Math.atan2(x1 - x2, y2 - y1);
	angle = (angle / (2 * Math.PI)) * 360;
	svgElement.append("path")
		.attr("class", "arrow_" + id)
		.attr("d", "M" + x2 + " " + y2 + " L" + (x2 - size) + " " + (y2 - size) + " L" + (x2 - size) + " " + (y2 + size) + " L" + x2 + " " + y2)
		.attr("fill", "black")
		.attr("transform", "rotate(" + (90 + angle)+ "," + x2 + "," + y2 +")");
	svgElement.append("svg:line")
		.attr("class", "arrow_"+id)
		.attr("x1", x1).attr("y1", y1)
		.attr("x2", x2).attr("y2", y2)
		.style("stroke", "black").style("stroke-width", this.strokeWidth);
}

