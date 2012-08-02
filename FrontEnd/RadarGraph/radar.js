var series, 
    subjects,
    minVal,
    maxVal,
    w = 400,
    h = 400,
    vizPadding = {
        top: 10,
        right: 0,
        bottom: 15,
        left: 0
    },
    radius,
    radiusLength,
    ruleColor = "#CCC";
 var circleAxes;
 var  lines;
    
var seriesName = ["Average", "Andrea", "Diana"];
var data = 
[ [9.2, 12.1, 7.7, 9.5, 11.9, 11.5, 10, 11.3], 
[11.1, 11, 14.45, 11.3, 10.3, 9.8, 9.1, 12.8],
[8.6, 13.5, 13.5, 12, 14.3, 12.7, 11.9, 11.9] ];
var subject = ["Physics", "Marine Biology", "Calculus", "Geometry", "Painting", "Phtography", 
					"English Literature", "Anthropology"];		
var r = d3.scale.linear().domain([0, 15]).range([ 0, h]);
var z = d3.scale.category10();
var score = d3.scale.linear().domain([0,15]).range([0, 100]);



var loadViz = function(){
  loadData();
  buildBase();
  setScales();
  addAxes();
  draw();
};

function loadData(){

    subjects = [];

    for (i = 0; i < 8; i += 1) {
        subjects[i] = i; //in case we want to do different formatting
    }

    allArr = data[0].concat(data[1],data[2]);

	//finding min and max in series
    minVal = d3.min(allArr);
    maxVal = d3.max(allArr);
    //give 25% of range as buffer to top
    maxVal = maxVal + ((maxVal - minVal) * 0.25);
    minVal = 0;
    
    for (i = 0; i < data.length; i += 1) {
        data[i].push(data[i][0]);
    }
}

function buildBase(){
    var viz = d3.select("#viz")
        .append('svg:svg')
        .attr('width', w)
        .attr('height', h)
        .attr('class', 'vizSvg');

    viz.append("svg:rect")
        .attr('id', 'axis-separator')
        .attr('x', 0)
        .attr('y', 0)
        .attr('height', 0)
        .attr('width', 0)
        .attr('height', 0);
    
    vizBody = viz.append("svg:g")
        .attr('id', 'body');
}

function setScales() {
  var heightCircleConstraint,
      widthCircleConstraint,
      circleConstraint,
      centerXPos,
      centerYPos;

  //need a circle so find constraining dimension
  heightCircleConstraint = h - vizPadding.top - vizPadding.bottom;
  widthCircleConstraint = w - vizPadding.left - vizPadding.right;
  circleConstraint = d3.min([
      heightCircleConstraint, widthCircleConstraint]);

  radius = d3.scale.linear().domain([minVal, maxVal])
      .range([0, (circleConstraint / 2)]);
  radiusLength = radius(maxVal);

  //attach everything to the group that is centered around middle
  centerXPos = widthCircleConstraint / 2 + vizPadding.left;
  centerYPos = heightCircleConstraint / 2 + vizPadding.top;

  vizBody.attr("transform",
      "translate(" + centerXPos + ", " + centerYPos + ")");
}

function addAxes() {
  var radialTicks = radius.ticks(5),
      i,
      lineAxes;

  vizBody.selectAll('.circle-ticks').remove();
  vizBody.selectAll('.line-ticks').remove();

  circleAxes = vizBody.selectAll('.circle-ticks')
      .data(radialTicks)
      .enter().append('svg:g')
      .attr("class", "circle-ticks");

//change string range to 0-100
  circleAxes.append("svg:text")
      .attr("text-anchor", "middle")
      .attr("dy", function (d) {
          return -1 * radius(d);
      })
      .text(String);

  lineAxes = vizBody.selectAll('.line-ticks')
      .data(subjects)
      .enter().append('svg:g')
      .attr("transform", function (d, i) {
          return "rotate(" + ((i / subjects.length * 360) - 90) +
              ")translate(" + radius(maxVal) + ")";
      })
      .attr("class", "line-ticks");

  lineAxes.append('svg:line')
      .attr("x2", -1 * radius(maxVal))
      .style("stroke", ruleColor)
      .style("fill", "none");

//change string to subject
  lineAxes.append('svg:text')
      .text(function(i){ return subject[i];})
      .attr("text-anchor", "middle")
      .attr("transform", function (d, i) {
          return (i / subjects.length * 360) < 180 ? null : "rotate(180)";
      });
}

function draw() {
  var groups;
      
  highlightedDotSize = 4;

  groups = vizBody.selectAll('.series')
      .data(data).enter().append("svg:g")
      .attr('class', 'series')
      .style('fill',function(d, i) { return z(i); })
      .style('stroke', function(d, i) { return z(i); })
      .attr("id", function(d, i) { return seriesName[i]; });

var line = d3.svg.line.radial()
    .interpolate("basis-closed")
    .radius(radius)
    .angle(function(d, i) { return angle(i); });

var area = d3.svg.area.radial()
    .interpolate(line.interpolate())
    .innerRadius(radius(0))
    .outerRadius(line.radius())
    .angle(line.angle());


  lines = groups.append('svg:path')
      .attr("class", "line")
      .attr("d", d3.svg.line.radial()
          .radius(function (d) {return 0;})
          //.angle(function (d, i) { return (i / 8) * 2 * Math.PI;}))
          .angle(function (d, i) {
              if (i === 8) {
                  i = 0;
              } //close the line
              return (i / 8) * 2 * Math.PI;
          }))
      .style("stroke-width", 3)
      .style("fill", "none");
      


  groups.selectAll(".curr-point")
      .data(function (d) {
          return [d[0]];
      })
      .enter().append("svg:circle")
      .attr("class", "curr-point")
      .attr("r", 0);
//.....x
  groups.selectAll(".clicked-point")
      .data(function (d) {
          return [d[0]];
      })
      .enter().append("svg:circle")
      .attr('r', 0)
      .attr("class", "clicked-point");

  lines.attr("d", d3.svg.line.radial()
      .radius(function (d) {
          return radius(d);
      })
      //this should close the line.. but it doesn't.
      .angle(function (d, i) {
          if (i === 8) {
              i = 0;
          } //close the line
          return (i / 8) * 2 * Math.PI;
      }));
}

function referenceLine(){
	circleAxes
  .append("svg:circle")
      .attr("r", function (d, i) {
          return radius(d);
      })
      .attr("class", "circle")
      .style("stroke", ruleColor)
      .style("fill", "none");
}

function undoRefLine(){
	
}

function colourFill(){
	      //colouring
      lines.style("fill", null);

}

function trigger(){
      
      referenceLine();
      //colourFill();
}