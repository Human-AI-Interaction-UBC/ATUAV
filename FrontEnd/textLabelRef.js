
  
	function formatAsNumbers (amount) {
		var neg = false;
		// return a 0 dollar value if amount is not valid  
		// (you may optionally want to return an empty string)  
		if (isNaN(amount)) {   return "$0.00";  }   
		// round the amount to the nearest 100th  
		amount = Math.round(amount*100)/100;   
		// checks to see if number is negative to correctly format result ie -1375 -->  -$1,375.00
		if(amount < 0){neg = true; amount = Math.abs(amount);}		
		// convert the number to a string 
		var amount_str = String(amount);   
		// split the string by the decimal point, separating the  
		// whole dollar value from the cents. Dollars are in  
		// amount_array[0], cents in amount_array[1]  
		var amount_array = amount_str.split(".");   
		// if there are no cents, add them using "00"  
	//	if (amount_array[1] == undefined) {   amount_array[1] = "00";  }   
		// if the cents are too short, add necessary "0"  
	//	if (amount_array[1].length == 1) {   amount_array[1] += "0";  }   
		// add the dollars portion of the amount to an  
		// array in sections of 3 to separate with commas  
		var dollar_array = new Array();  
		var start;  
		var end = amount_array[0].length;  
		while (end > 0) {   
			start = Math.max(end - 3, 0);   
			dollar_array.unshift(amount_array[0].slice(start, end));   
			end = start;  
		}   
		// assign dollar value back in amount_array with  
		// the a comma delimited value from dollar_array  
		amount_array[0] = dollar_array.join(",");   
		// finally construct the return string joining  
		// dollars with cents in amount_array 
		if(!neg){
			return ("" + amount_array.join("."));
		}else{
			return ("-" + amount_array.join("."));
		}			 
	} 
  
  var payments =[
    {date: "2011-11-04T16:17:54Z", quantity: 2, total: 190, tip: 100, type: 1, user: 1},
    {date: "2011-11-05T16:20:19Z", quantity: 2, total: 190, tip: 100, type: 1, user: 2},
    {date: "2011-11-09T16:28:54Z", quantity: 1, total: -300, tip: 200, type: 3, user: 3},
    {date: "2011-11-09T16:30:43Z", quantity: 2, total: 90, tip: 0, type: 1, user: 1},
    {date: "2011-11-11T16:48:46Z", quantity: 2, total: 90, tip: 0, type: 1, user: 1},
    {date: "2011-11-14T16:53:41Z", quantity: 2, total: 90, tip: 0, type: 1, user: 1},
    {date: "2011-11-14T16:54:06Z", quantity: 1, total: -100, tip: 0, type: 2, user: 3},
    {date: "2011-11-14T16:58:03Z", quantity: 2, total: 90, tip: 0, type: 1, user: 3},
    {date: "2011-11-14T17:07:21Z", quantity: 2, total: 90, tip: 0, type: 2, user: 1},
    {date: "2011-11-26T17:22:59Z", quantity: 2, total: 90, tip: 0, type: 1, user: 2},
    {date: "2011-11-26T17:25:45Z", quantity: 2, total: 200, tip: 0, type: 1, user: 1},
    {date: "2011-11-29T17:29:52Z", quantity: 1, total: -300, tip: 100, type: 3, user: 1}
  ];
  
   // A little coercion, since the CSV is untyped.
  payments.forEach(function(d, i) {
    d.key = i;
    d.date = parseDate(d.date);
    d.total = +d.total;
    d.quantity = +d.quantity;
    d.tip = +d.tip;
    d.type = +d.type;
    d.user = +d.user;
  });  

  // Various formatters.
  var formatNumber = d3.format(",d"),
      formatChange = d3.format("+,d"),
      formatDate = d3.time.format("%B %d, %Y"),
      formatTime = d3.time.format("%I:%M %p");
	  
  // A nest operator, for grouping the flight list.
  var nestByDate = d3.nest()
      .key(function(d) { return d3.time.day(d.date); });  
  
  var payment = crossfilter(payments),
      all = payment.groupAll(),
      date = payment.dimension(function(d) { return d3.time.day(d.date); }),
      dates = date.group(),
      hour = payment.dimension(function(d) { return d.date.getHours() + d.date.getMinutes() / 60; }),
      hours = hour.group(Math.floor),
	  quantity = payment.dimension(function(d) { return Math.max(0, Math.min(5, d.quantity)); }),
      quantities = quantity.group(function(d) { return Math.floor(d / 1) * 1; }),
      total = payment.dimension(function(d) { return Math.max(-350, Math.min(350, d.total)); }),
      totals = total.group(function(d) { return Math.floor(d / 15) * 15; }),
      tip = payment.dimension(function(d) { return Math.min(250, d.tip); }),
      tips = tip.group(function(d) { return Math.floor(d / 50) * 50; });
	  type = payment.dimension(function(d) { return parseInt(d.type); }),
      types = type.group(),
	  user = payment.dimension(function(d) { return parseInt(d.user); }),
	  users = user.group(),
	  user2 = payment.dimension(function(d) { return parseInt(d.user); }),
      users2 = user2.group(),
      
	  plVolumeType = payment.dimension(function(d) { return parseInt(d.type); }), 
	  plVolumeByType = plVolumeType.group().reduceRunning(function(d) { return (d.total); }),  
	  plVolumeByUser = user.group().reduceSum(function(d) { return (d.total); }),

	  datePercent = payment.dimension(function(d) { return d3.time.day(d.date); }),
      dateByPercent = datePercent.group().reduceSum(function(d) { return (d.total); });	  
	  
	  var volKey = payment.dimension(function(d) { return d.key });
	  var groupVolume = volKey.group().order(function(d) {return Math.abs(d) });
      groupVolume.reduceSum(function(d) { return d.total });
      groupVolume.top(2);


  var paymentsByTotal = payment.dimension(function(d) { return d.total; });  
  var allPayments = paymentsByTotal.top(Infinity);  
  var paymentGroupsByTotal = paymentsByTotal.group(function(total) { return Math.floor(total / 100); });
  
  // --------------------
   
   var n = 10,
        values = new Array(n),
        objects = new Array(n),
        tests = new Array(n);
    
    for (var i = 0; i < n; i++) {
      objects[i] = {value: values[i] = Math.random()*10, key: i};
      tests[i] = i;
    }    
	
    objects.sort(function(a, b) { return a.value - b.value; });
    values.sort(function(a, b) { return a - b; });
	 
  
  var m = [10, 10, 20, 10],
  w = 960 - m[1] - m[3],
  h = 930 - m[0] - m[2];  

  var charts = [    	

  
	barChart()
        .dimension(volKey)
        .group(groupVolume)	
	 .axis(d3.svg.axis()
		.orient("bottom")
		.tickArguments_([10]))
		
	 .x(d3.scale.linear()
        .domain([0,15])
        .rangeRound([0, 10 *45])),
  
	barChart()
        .dimension(total)
        .group(totals)

	 .axis(d3.svg.axis()
		.orient("bottom")
		.tickArguments_([10]))

	 .x(d3.scale.linear()
        .domain([-350,250])
        .rangeRound([0, 10 *45])),
		
	barChart()
        .dimension(datePercent)
        .group(dateByPercent)
        .round(d3.time.day.round)
	  .axis(d3.svg.axis()
		.orient("bottom")
		.tickArguments_([10]))
      .x(d3.time.scale()
        .domain([new Date(2011, 10, 1), new Date(2011, 11, 1)])
        .rangeRound([0, 10 * 90]))
 //       .filter([new Date(2001, 1, 1), new Date(2001, 2, 1)])

];

  // Given our array of charts, which we assume are in the same order as the
  // .chart elements in the DOM, bind the charts to the DOM and render them.
  // We also listen to the chart's brush events to update the display.
  var chart = d3.selectAll(".chart")
      .data(charts)
      .each(function(chart) { chart.on("brush", renderAll).on("brushend", renderAll); });

  // Render the initial lists.
  var list = d3.selectAll(".list")
      .data([flightList]);

  // Render the total.
  d3.selectAll("#total")
      .text(formatNumber(payment.size()));

  renderAll();

  // Renders the specified chart or list.
  function render(method) {
    d3.select(this).call(method);
  }

  // Whenever the brush moves, re-rendering everything.
  function renderAll() {
    chart.each(render);
    list.each(render);
    d3.select("#active").text(formatNumber(all.value()));
  }

  // Like d3.time.format, but faster.
  function parseDate(d) {
    return new Date(d);
  }

  function unique(arr) { 
    var a = []; 
    var l = arr.length; 
    for(var i=0; i<l; i++) { 
	  for(var j=i+1; j<l; j++) { 
	    // If a[i] is found later in the array 
		if (arr[i] === arr[j]) 
		  j = ++i; 
	  } 
	  a.push(arr[i]); 
	} 
	return a; 
  };
  
  
  window.filter = function(filters) {
    filters.forEach(function(d, i) { charts[i].filter(d); });
    renderAll();
  };

  window.reset = function(i) {
    charts[i].filter(null);
    renderAll();
  };  

  function flightList(div) {
/*    var flightsByDate = nestByDate.entries(date.top(40));

    div.each(function() {
      var date = d3.select(this).selectAll(".date")
          .data(flightsByDate, function(d) { return d.key; });

      date.enter().append("div")
          .attr("class", "date")
        .append("div")
          .attr("class", "day")
          .text(function(d) { return d.values[0].id; });

      date.exit().remove();

      var flight = date.order().selectAll(".flight")
          .data(function(d) { return d.values; }, function(d) { return d.index; });

      var flightEnter = flight.enter().append("div")
          .attr("class", "flight");

      flightEnter.append("div")
          .attr("class", "date")
          .text(function(d) { return formatDate(d.date); });
		  
	  flightEnter.append("div")
          .attr("class", "time")
          .text(function(d) { return formatTime(d.date); });	  
		  
      flightEnter.append("div")
          .attr("class", "quantity")
          .text(function(d) { return d.quantity; });     
		  
	 flightEnter.append("div")
          .attr("class", "total")
          .text(function(d) { return d.total; });	  
		  
     flightEnter.append("div")
          .attr("class", "tip")
          .text(function(d) { return d.tip; });	  
	
	 flightEnter.append("div")
          .attr("class", "type")
          .text(function(d) { return d.type; });	  

      flight.exit().remove();

      flight.order();
    });
*/
  }
  
  function value(d) {
	if(d == undefined){
	  return '';
	}else{
	  return d.value;
	}
  }
  
  function getNearestNumber(a, n){
    if((l = a.length) < 2)
        return l - 1;
    for(var l, p = Math.abs(a[--l] - n); l--;)
        if(p < (p = Math.abs(a[l] - n)))
            break;
    return l + 1;
  }
		
  function getXYValue(f) {
    return function(a, x, lo, hi) {
		var xNum;
		var xx;
		var arr = new Array();
		var arrVal = new Array();
		var maparr;
		for(var i = 0; i < a.length; i++){
			arr.push(a[i].key);
			arrVal.push(a[i].key);
		}
		
		if(x instanceof Date){
			xx = x;
		}else{
			xx = Math.round(x-0.2);
		}
		//xNum = d3.bisect(arr, xx);
	  xNum = getNearestNumber(arr, xx);	
	  return [arrVal[xNum],f.call(a, a[xNum], xNum)];    
    };
  }
  
  
  function barChart() {
    if (!barChart.id) barChart.id = 0;

    var margin = {top: 10, right: 10, bottom: 20, left: 10},
        x,
//		y,
        y = d3.scale.linear().range([100, 0]),
        id = barChart.id++,
		axis,
//       axis = d3.svg.axis().orient("bottom"),
        brush = d3.svg.brush(),
        brushDirty,
        dimension,
        group,
        round,
		get_XYValue = getXYValue(value);
    

		

    function chart(div) {	
      var width = x.range()[x.range().length-1],
          height = y.range()[0];
	  var yarr = group.all();
	  
      y.domain([0, Math.abs(group.topAbs(1)[0].value)]);
	 // console.log(group.top(1)[0]);	

	  
      div.each(function() {
	  
		var synchronizedMouseMove = function() {
			var g = d3.select(this);
			var p = d3.svg.mouse(g[0][0]),					
			downx 	= x.invert(p[0]),
			downy 	= y.invert(p[1]),
			groupAll	= group.all(),
			xyvar	= get_XYValue(groupAll, downx),
			xvar	= xyvar[0],
			yvar	= xyvar[1],
			yvarb	= 0,
			n   	= groupAll.length,
			barwidth = 9,
			barcolor,
			yvalue   = y(Math.abs(Math.round(yvar))),
			xvalue   = x(xvar);		
			
			if(yvar < 0){
				barcolor = '#FF9292';
			}else{
				barcolor = '#87D55F';
			}					
			
			if(yvar != ''){
				div.select(".tooltip")
				  .text(formatAsNumbers(yvar))
				  .style("display", "block")
				  .style("border-color", barcolor)
				  .style("margin-left", xvalue+20+"px")
				  .style("margin-top", yvalue-30+"px");						  
			}else{
				div.select(".tooltip")
				  .text(formatAsNumbers(yvar))
				  .style("display", "none");
			}					
		/*	g.select(".crosshair")				
			  .style("visibility", "visible")
			  .style("stroke", "#C0C0C0")
			  .style("stroke-width", 1)
			  .style("zIndex", 2)				
			  .attr("d", "M "+xvalue+" 0 L "+xvalue+" 96");
		*/	  
			g.select(".hoverselect")				
			  .style("visibility", "visible")								  
			  .attr("x", xvalue-1)
			  .attr("y", yvalue)
			  .attr("width", barwidth+1)
			  .attr("height", 100-yvalue)
			  .attr("fill", "#FFFFFF")
			  .attr("opacity", 0.4);				 
			 
		};	
		  
		var synchronizedMouseOut = function() {
			var g = d3.select(this);
			div.select(".tooltip")
			  .text('')
			  .style("display", "none");
		/*	g.select(".crosshair")				
			  .style("visibility", "hidden");	
		*/
			g.select(".hoverselect")				
			  .style("visibility", "hidden")	
		};

	
	  
	  
        var div = d3.select(this),
            g = div.select("g");	

        // Create the skeletal chart.
        if (g.empty()) {
          div.select(".title").append("a")
              .attr("href", "javascript:reset(" + id + ")")
              .attr("class", "reset")
              .text("reset")
              .style("display", "none");
		
		  div.append("div")
			  .attr("class", "tooltip")
			  .style("display", "none");			  
		
          g = div.append("svg")
              .attr("width", width + margin.left + margin.right)
              .attr("height", height + margin.top + margin.bottom)
            .append("g")
              .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
			  .on('mousemove', synchronizedMouseMove)
		      .on("mouseout", synchronizedMouseOut);

          g.append("clipPath")
              .attr("id", "clip-" + id + "a")
            .append("rect")
              .attr("width", width)
              .attr("height", height);
			  
		  g.append("clipPath")
              .attr("id", "clip-" + id + "b")
            .append("rect")
              .attr("width", width)
              .attr("height", height);	
		
          g.selectAll(".bar")		       
            .data(["background", "positive", "negative"])
            .enter().append("path")			  
              .attr("class", function(d) {return d + " bar"; })	
              .datum(group.all());		
			  
          g.selectAll(".positive.bar")
              .attr("clip-path", "url(#clip-" + id + "a)");
		  
		  g.selectAll(".negative.bar")
              .attr("clip-path", "url(#clip-" + id + "b)");	  
				  
          g.append("rect")
			  .attr("class", "hoverselect");	

          g.append("g")
              .attr("class", "axis")
              .attr("transform", "translate(0," + height + ")")
              .call(axis);
			  
		  g.append("g")	
		      .attr("class", "label_text");	
			
          // Initialize the brush component with pretty resize handles.
          var gBrush = g.append("g").attr("class", "brush").call(brush);
          gBrush.selectAll("rect").attr("height", height);
          gBrush.selectAll(".resize").append("path").attr("d", resizePath);
        }

        // Only redraw the brush if set externally.
        if (brushDirty) {
          brushDirty = false;
          g.selectAll(".brush").call(brush);
          div.select(".title a").style("display", brush.empty() ? "none" : null);
          if (brush.empty()) {
            g.selectAll("#clip-" + id + " rect")
                .attr("x", 0)
                .attr("width", width);
          } else {
            var extent = brush.extent();
            g.selectAll("#clip-" + id + " rect")
                .attr("x", x(extent[0]))
                .attr("width", x(extent[1]) - x(extent[0]));
          }
        }		
		
		g.selectAll(".positive.bar").attr("d", function(d) {return barPath(d)[0]; }); 
		g.selectAll(".negative.bar").attr("d", function(d) {return barPath(d)[1]; });
		g.selectAll(".background.bar").attr("d", function(d) {return barPath(d)[2]; }); 
				
		// Create label key...

	/*	var label = g.select('.label_text');
			label.selectAll('.label_t')
		      .data(group.all()) // Instruct to bind dataSet to text elements
			  .enter().append("text") // Append legend elements		   
				.attr("dx", 0)
                .attr("dy", "1em") // Controls padding to place text above bars
                .text(function(d) { return d.key;})
                .style("fill", "Blue")                    
                .on('mouseover', synchronizedMouseMove)
			    .on("mouseout", synchronizedMouseOut);   
	*/

      });

      function barPath(groups) {
        var path = [],
            pathPositive = [],
            pathNegative = [],
            pathBoth = [],
            i = -1,
            n = groups.length,
            d;
        while (++i < n) {
          d = groups[i];
		  
		  if(d.value < 0 || d.key < 0){	
			pathNegative.push("M", x(d.key), ",", height, "V", y(Math.abs(d.value)), "h9V", height);			
		  }else{
		    pathPositive.push("M", x(d.key), ",", height, "V", y(Math.abs(d.value)), "h9V", height);
		  }
		  pathBoth.push("M", x(d.key), ",", height, "V", y(Math.abs(d.value)), "h9V", height);	 
		//  console.log("key:["+d.key+"] value:["+d.value+"] height:["+y(Math.abs(d.value))+"]");  
        }
		path[0] = pathPositive.join("")
        path[1] = pathNegative.join("")
        path[2] = pathBoth.join("")
        return path;
      }	  
	 
      function resizePath(d) {
        var e = +(d == "e"),
            x = e ? 1 : -1,
            y = height / 3;
        return "M" + (.5 * x) + "," + y
            + "A6,6 0 0 " + e + " " + (6.5 * x) + "," + (y + 6)
            + "V" + (2 * y - 6)
            + "A6,6 0 0 " + e + " " + (.5 * x) + "," + (2 * y)
            + "Z"
            + "M" + (2.5 * x) + "," + (y + 8)
            + "V" + (2 * y - 8)
            + "M" + (4.5 * x) + "," + (y + 8)
            + "V" + (2 * y - 8);
      }
    }

    brush.on("brushstart.chart", function() {
      var div = d3.select(this.parentNode.parentNode.parentNode);
      div.select(".title a").style("display", null);
    });

    brush.on("brush.chart", function() {
      var g = d3.select(this.parentNode),
          extent = brush.extent();
       if (round) g.select(".brush")
          .call(brush.extent(extent = extent.map(round)))
        .selectAll(".resize")
          .style("display", null);
       g.select("#clip-" + id + "a rect")
          .attr("x", x(extent[0]))
          .attr("width", x(extent[1]) - x(extent[0]));		

      g.select("#clip-" + id + "b rect")
          .attr("x", x(extent[0]))
          .attr("width", x(extent[1]) - x(extent[0]));		 	  
       dimension.filterRange(extent);
    });

    brush.on("brushend.chart", function() {
      if (brush.empty()) {
        var div = d3.select(this.parentNode.parentNode.parentNode);
        div.select(".title a").style("display", "none");
        div.select("#clip-" + id + "a rect").attr("x", null).attr("width", "100%");
        div.select("#clip-" + id + "b rect").attr("x", null).attr("width", "100%");
        dimension.filterAll();
      }
    });

    chart.margin = function(_) {
      if (!arguments.length) return margin;
      margin = _;
      return chart;
    };
	
	chart.axis = function(_) {
      if (!arguments.length) return axis;
      axis = _;
      return chart;
    };

    chart.x = function(_) {
      if (!arguments.length) return x;
      x = _;
	  axis.scale(x);
      brush.x(x);
      return chart;
    };

    chart.y = function(_) {
      if (!arguments.length) return y;
      y = _;
      return chart;
    };

    chart.dimension = function(_) {
      if (!arguments.length) return dimension;
      dimension = _;
      return chart;
    };

    chart.filter = function(_) {
      if (_) {
        brush.extent(_);
        dimension.filterRange(_);
      } else {
        brush.clear();
        dimension.filterAll();
      }
      brushDirty = true;
      return chart;
    };

    chart.group = function(_) {
      if (!arguments.length) return group;
      group = _;
      return chart;
    };

    chart.round = function(_) {
      if (!arguments.length) return round;
      round = _;
      return chart;
    };

    return d3.rebind(chart, brush, "on");
  }


