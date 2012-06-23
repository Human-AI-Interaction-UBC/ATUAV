var numTicks = 3;
var n = 8, // number of samples
    m = 3; // number of series

var data = [ [9.2, 12.1, 7.7, 9.5, 11.9, 11.5, 10, 11.3], 
[11.1, 11, 14.45, 11.3, 10.3, 9.8, 9.1, 12.8],//n
[8.6, 13.5, 13.5, 12, 14.3, 12.7, 11.9, 11.9] ];//m
var subject = ["Physics", "Marine Biology", "Calculus", "Geometry", "Painting", "Phtography", 
					"English Literature", "Anthropology"];
var w = 625,
    h = 500,
    chartPadding = 25;
    y = d3.scale.linear().domain([0, 15]).range([ h,0]),
    y1 = d3.scale.linear().domain([0, 15]).range([ 0, h]),
    x0 = d3.scale.ordinal().domain(d3.range(n)).rangeBands([0, w], .3),
    x1 = d3.scale.ordinal().domain(d3.range(m)).rangeBands([0, x0.rangeBand()]),
    z = d3.scale.category10();

var xAxis = d3. svg.axis()
					.scale(x0)
					.orient("bottom")
					.ticks(m);

var yAxis = d3.svg.axis()
				.scale(y)
				.orient("left")
				.ticks(numTicks);
				
var vis = d3.select("body")
  .append("svg:svg")
    .attr("width", w + 20)
    .attr("height", h + 40)
  .append("svg:g")
    .attr("transform", "translate(10,10)");

var g = vis.selectAll("g")
    .data(data) 
  .enter().append("svg:g") 
    .attr("fill", function(d, i) { return z(i); })
    //this transform works as spread out the coordinates of different series
    .attr("transform", function(d, i) { return "translate(" + x1(i) + ",0)"; });


var rect = g.selectAll("rect")
//Object = the sec dimension in the two dimension array
    .data(Object)
  .enter().append("svg:rect")
  //this transform spreads out the different group
    .attr("transform", function(d, i) { return "translate(" + x0(i) + ", 0)"; })
    .attr("width", x1.rangeBand())
    .attr("height", y1)
    .attr("y", function(d) { return h - y1(d); })
    .attr("x", 4);
    

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
    	/**vis.append("line")
    		.attr("transform", "translate( 4," + h + ")")
    		.style("stroke", "rgb(0, 0, 0)")
    		.style("strok-width", 2);**/
    	

 		
 		/**g.selectAll("text")
 				.data(data)
 				.enter().append("text")
 				.attr("x", 100)
 				.attr("y", function(d){return h-y(d);} )
 				.attr("dx", 3)
 				.attr("dy", ".35em")
 				.attr("text-anchor", "middle")
 				.attr("transform", function(d, i) { return "translate(" + x1(i) + ",0)"; })
 				.text(function(d){return d[0];});**/
 				
//d3.select("#2ca02c").style("fill", "red");
//var set = rect.clone();
//alert(rect);
var paper = Raphael(0, 0, '100%', '100%');

var set = paper.set();
set.push(rect.clone);
 	alert(set);
 	
function hightLight(){
 	d3.select(this)
 		.style("fill", "yellow");
 }
  	
function defaultColour(){
 	d3.select(this)
 		.style("fill", null);
 }
 

function avgLineDrawing(){
var sum = 0;

for(var i = 0; i<data[0].length; i++){
		sum += data[0][i];
	}	
var avg = sum/data[0].length;

	
	var avgLine = vis.append("svg:line")
						.attr("x1", 6)
						.attr("y1", h-y1(avg))
						.attr("x2", w)
						.attr("y2", h-y1(avg))
						.style("stroke", "rgb(330, 30, 70)")
						.style("stroke-width", 5);
var	min=data[0][0];
for(var i = 0; i<data[0].length; i++){
	if(data[0][i]<min)
	min=data[0][i];
} 
						
	var minLine = vis.append("svg:line")
						.attr("x1", 6)
						.attr("y1", h-y1(min))
						.attr("x2", w)
						.attr("y2", h-y1(min))
						.style("stroke", "rgb(220, 20, 60)")
						.style("stroke-width", 5); 
						

var max = data[0][0];
for(var i = 0; i<data[0].length; i++){
	if(data[0][i]>max)
	max=data[0][i];
}
						
	var maxLine = vis.append("svg:line")
						.attr("x1", 6)
						.attr("y1", h-y1(max))
						.attr("x2", w)
						.attr("y2", h-y1(max))
						.style("stroke", "rgb(110, 10, 50)")
						.style("stroke-width", 5); 
} 

function markLineDrawing(){
var sum = 0;

for(var i = 0; i<data[1].length; i++){
		sum += data[1][i];
	}	
var avg = sum/data[1].length;

	
	var avgLine = vis.append("svg:line")
						.attr("x1", 6)
						.attr("y1", h-y1(avg))
						.attr("x2", w)
						.attr("y2", h-y1(avg))
						.style("stroke", "rgb(330, 30, 70)")
						.style("stroke-width", 5);
var	min=data[1][0];
for(var i = 0; i<data[1].length; i++){
	if(data[1][i]<min)
	min=data[1][i];
} 
						
	var minLine = vis.append("svg:line")
						.attr("x1", 6)
						.attr("y1", h-y1(min))
						.attr("x2", w)
						.attr("y2", h-y1(min))
						.style("stroke", "rgb(220, 20, 60)")
						.style("stroke-width", 5); 
						

var max = data[1][0];
for(var i = 0; i<data[1].length; i++){
	if(data[1][i]>max)
	max=data[1][i];
}
						
	var maxLine = vis.append("svg:line")
						.attr("x1", 6)
						.attr("y1", h-y1(max))
						.attr("x2", w)
						.attr("y2", h-y1(max))
						.style("stroke", "rgb(110, 10, 50)")
						.style("stroke-width", 5); 
} 

function alexLineDrawing(){
	var sum = 0;

for(var i = 0; i<data[1].length; i++){
		sum += data[1][i];
	}	
var avg = sum/data[1].length;

	
	var avgLine = vis.append("svg:line")
						.attr("x1", 6)
						.attr("y1", h-y1(avg))
						.attr("x2", w)
						.attr("y2", h-y1(avg))
						.style("stroke", "rgb(330, 30, 70)")
						.style("stroke-width", 5);
var	min=data[1][0];
for(var i = 0; i<data[1].length; i++){
	if(data[1][i]<min)
	min=data[1][i];
} 
						
	var minLine = vis.append("svg:line")
						.attr("x1", 6)
						.attr("y1", h-y1(min))
						.attr("x2", w)
						.attr("y2", h-y1(min))
						.style("stroke", "rgb(220, 20, 60)")
						.style("stroke-width", 5); 
						

var max = data[2][0];
for(var i = 0; i<data[2].length; i++){
	if(data[2][i]>max)
	max=data[2][i];
}
						
	var maxLine = vis.append("svg:line")
						.attr("x1", 6)
						.attr("y1", h-y1(max))
						.attr("x2", w)
						.attr("y2", h-y1(max))
						.style("stroke", "rgb(110, 10, 50)")
						.style("stroke-width", 5); 
}

function bolding(){
	var bolding = rect.on("mousemove", boldRect)
 		//.on("mouseout", function(d, i) { return z(i); });
 		.on("mouseout", defaultRect)
 		.on("mousedown", animate);
 		//.on("mouseup", showAvgValue);

}    

function boldRect(){
	d3.select(this)
 		.style("stroke-width", 3)
 		.style("stroke", "red");
}
function defaultRect(){
	d3.select(this)
	.style("stroke-width", null)
	.style("stroke", null);
}

function showAvgValue(){
	var avgValue = rect.on("mousemove", showValue)
 		//.on("mouseout", function(d, i) { return z(i); });
 		.on("mouseout", defaultValue)
 		.on("mousedown", animate);
}

function showValue(){
	d3.select(this)
 		.style("stroke-width", 3)
 		.style("stroke", "red");
}

function highlight(){
	var highlight = rect.on("mousemove", hightLight)
 		.on("mouseout", defaultColour);

}    
	
function animate() {
    d3.select(this).transition()
        .duration(500)
        .attr("height", 5)
      .transition()
        .delay(500)
        .attr("height", y1);

};

function blink(){
	var blink = rect
 		.on("mousedown", setInterval(animate, 300));
 		//.on("mousedown", blinkAnimate)
 		//.on("mousedown", animate);

}    
	
function blinkAnimate() {
   setInterval(animate, 30);

};
/**function showAvgValue(){
 	
 	var text = g.selectAll("text")
			    .data(data[0])
			  .enter().append("svg:text")
			    .attr("class", "group")
			    //.attr("transform", function(d, i) { return "translate(" + x1(i) + ",0)"; })
			    .attr("x", function(i){return x0(x0.rangeBand() / 2 + i*x0.rangeBand());})
			    .attr("y",function(d){return  h-y1(d); })
			    .attr("dy", ".71em")
			    .attr("text-anchor", "middle")
			    .attr("fill", "black") 
			    .attr("font-size", "11px")
			    .text(function(d){return d;});
 }**/
