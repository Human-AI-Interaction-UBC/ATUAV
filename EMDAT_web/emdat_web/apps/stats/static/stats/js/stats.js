// ids
var idForm = '#stats-form';
var idSelectParticipants = '#select_participants';
var idSelectFeatures = '#select_features';
var idSelectAOIFeatures = '#select_aoi_features';
var classCloseChart = '.close';
var linkBackToTop = '.back-to-top';
var classSaveChart = '.save-chart';
var idPanel = '#charts_panel';

var thresholdParticipants = 12;
var messageNoData = 'No data to display';
var numSamples = 12;

var LineChart;

// Vars for functions
var loadMultiselects, loadTooltip;
var readyStats;
var closeChart;
var createBarChart, generateAllCharts, saveChart, draggableCharts;
var backToTop;
var chartColors = ['#FF7F0E', '#2CA02C', '#7b6888', '#d63e2f', '#ff99ff', '#ffff00', '#000000', '#663300', '#003300', '#9900cc', '#808080', '#4d0000'];

// Error messages
var errorMessageParticipants = 'Select at least one participant.';
var errorMessageFeatures = 'Select at least one feature.';

// Rules for the form
var allRules = {
    select_participants:{
        required: true
    },
    select_features:{
        select_one: [idSelectAOIFeatures, errorMessageFeatures]
    },
    select_aoi_features:{
        select_one: [idSelectFeatures, ''] // Empty message to avoid duplicate
    }
};

/**
 * Validate form.
 * plugin - Jquery validate (https://jqueryvalidation.org/)
 */
var validator = $(idForm).validate({
    rules: allRules,
    highlight: function(element) {
        $(element).closest('div').addClass('has-error');
    },
    unhighlight: function(element) {
        $(element).closest('div').removeClass('has-error');
    },
    errorElement: 'span',
    errorClass: 'help-block',
    errorPlacement: function(error, element) {
        $('.stats-errors').append(error)
    },
    messages: {
        select_participants: errorMessageParticipants
    }
});

// Custom rule: validation for select at least one feature from two combos
jQuery.validator.addMethod('select_one', function(value, element, params) {
    var value_pair = $(params[0]).val();
    return value !== null || value_pair !== null
}, jQuery.validator.format('{1}'));

/**
 * Load combos for participants, features and AOI features.
 * plugin - Bootstrap multiselect (https://github.com/davidstutz/bootstrap-multiselect)
 */
loadMultiselects = function(){
    $(idSelectParticipants).multiselect({
        enableFiltering: true,
        buttonWidth: '100%',
        // Threshold Participants
        onChange: function(option) {
            // Get selected options.

            var selectedOptions = $(idSelectParticipants + ' option:selected');

            if (selectedOptions.length > thresholdParticipants) {
                $(idSelectParticipants).multiselect('deselect', option[0].value);
            }

            if (selectedOptions.length >= thresholdParticipants) {
                // Disable all other checkboxes.
                var nonSelectedOptions = $(idSelectParticipants + ' option').filter(function() {
                    return !$(this).is(':selected');
                });

                nonSelectedOptions.each(function() {
                    var input = $('input[value="' + $(this).val() + '"]');
                    input.prop('disabled', true);
                    input.parent('li').addClass('disabled');
                });
            }
            else {
                // Enable all checkboxes.
                $(idSelectParticipants + ' option').each(function() {
                    var input = $('input[value="' + $(this).val() + '"]');
                    input.prop('disabled', false);
                    input.parent('li').addClass('disabled');
                });
            }
        }
    });

    $(idSelectFeatures).multiselect({
        enableClickableOptGroups: true,
        enableCollapsibleOptGroups: false,
        enableFiltering: true,
        enableCaseInsensitiveFiltering: true,
        includeSelectAllOption: true,
        selectAllJustVisible: true,
        buttonWidth: '100%',
        maxHeight: 400
    });

    $(idSelectAOIFeatures).multiselect({
        enableClickableOptGroups: true,
        enableCollapsibleOptGroups: false,
        enableFiltering: true,
        enableCaseInsensitiveFiltering: true,
        includeSelectAllOption: true,
        buttonWidth: '100%',
        maxHeight: 400
    });
};

/**
 * Load tooltip to close panels.
 * Bootstrao tooltips
 */
loadTooltip = function(){
    $('[data-toggle="tooltip"]').tooltip();
};

/**
 * Delete a panel.
 */
closeChart = function(){
    $(classCloseChart).on( 'click', function(){
        $(this).tooltip('hide');
        $(this).closest('.chart-emdat').fadeOut(500, function() { $(this).remove(); });

        feature = $(this).data('id');

        // Deselect feature from combo
        $(idSelectFeatures).multiselect('deselect', feature);

        // Remove listener for resize
        W.removeListener(feature);
    });
};

/**
 * Initialize all the plugins.
 * This is the first function that is executed when the DOM is fully loaded.
 */
readyStats = function() {
    loadMultiselects();
    loadTooltip();
    closeChart();
    backToTop();
    saveChart();
    draggableCharts();
};

/**
 * Create a bar chart.
 * plugin - d3.js & d3-tip.js
 * @param filename - The filename of the EMDAT output file
 * @param participantColumn - The name of the participant column
 * @param feature - The name of the feature that you want to plot
 * @param participantsIds - The list of participants ids
 * @param unit - The unit of the feature for the Y Axis
 */
createBarChart = function(filename, participantColumn, feature, participantsIds, unit){

    var margin = {}, width, height, xScale, yScale, xAxis, yAxis, tooltip, svg, colors, data;

    d3.tsv(filename, init);

    function init(csv) {
        margin = {top: 20, right: 20, bottom: 30, left: 50};

        // Get width established
        var width_auto = parseInt(d3.select('#barchart_'+feature).style('width'), 10);

        width = width_auto - margin.left - margin.right;
        height = 250 - margin.top - margin.bottom;

        // Initialize scales
        xScale = d3.scale.ordinal()
            .rangeRoundBands([0, width], .5);

        yScale = d3.scale.linear()
            .range([height, 0]);

        // Initialize axis
        xAxis = d3.svg.axis()
            .scale(xScale)
            .orient('bottom');


        yAxis = d3.svg.axis()
            .scale(yScale)
            .orient('left')
            .tickPadding(1);

        // Tooltip for values
        tooltip = d3.tip()
            .attr('class', 'd3-tip')
            .offset([-10, 0])
            .html(function(d) {
                return d3.round(d[feature], 4);
            });

        svg = d3.select('#barchart_'+feature)
            .append('svg')
            .attr('id', 'svg_'+feature)
            .attr('width', width + margin.left + margin.right)
            .attr('height', height + margin.top + margin.bottom)
            .append('g')
            .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

        svg.call(tooltip);

        // Set colors
        colors = d3.scale.ordinal()
            .range(chartColors);

        data = csv;

        render();

        // Make graphs responsive
        W.addListener(updateChart, feature);
    }

    function render() {

        // Convert string to integer
        data.forEach(function (d) {
            if (d[feature])
                d[feature] = +d[feature];
        });

        // Filter only data of each participant
        data = data.filter(function (data) {
            index_participant = participantsIds.indexOf(data[participantColumn]);
            return index_participant != -1;
        });

        // Average with all participants selected
        if (participantsIds.indexOf('P0') > -1) {

            // Get feature values
            var featureValues = [];
            $.each( data, function(index, value) {
                featureValues.push(value[feature])
            });

            // Average values
            var total = 0;
            for(var i = 0; i < featureValues.length; i++) {
                total += featureValues[i];
            }
            var avg = total / featureValues.length;

            // Append data to data object
            var averageColumn = {};
            averageColumn[participantColumn] = 'Average';
            averageColumn[feature] = avg;

            data.push(averageColumn);
        }

        // If data for participant exists and feature is in output file
        if (data[0] != null && feature in data[0]) {

            // Draw graph
            xScale.domain(data.map(function (d) {
                return d[participantColumn];
            }));

            yScale.domain([0, d3.max(data, function (d) {
                return d[feature];
            })]);

            svg.append('g')
                .attr('class', 'x axis')
                .style('font', '11px sans-serif')
                .attr('transform', 'translate(0,' + height + ')')
                .call(xAxis);


            svg.append('g')
                .attr('class', 'y axis')
                .style('font', '11px sans-serif')
                .call(yAxis)
                .append('text')
                .attr('transform', 'rotate(-90)')
                .attr('y', 6)
                .attr('dy', '.71em')
                .style('text-anchor', 'end')
                .text(unit);

            // Style inline to export chart
            svg.selectAll('.axis path').style({'fill':'none', 'stroke':'#000', 'shape-rendering':'crispEdges'});

            // Create bars
            updateBars();

            // Sort bars
            d3.select('#sort_' + feature).on('click', sortBars);
        }
        else {
            // Show message for no data
            showChartMessage();

            // Disable save and sort links
            $('#sort_'+feature).addClass('disabled');
            $('#save_'+feature).addClass('disabled');
        }

    }

    // Responsive charts
    function updateChart() {
        updateScales();
        updateAxes();
        updateBars();
    }

    function updateScales() {
        width_auto = parseInt(d3.select('#barchart_'+feature).style('width'), 10);
        width = width_auto - margin.left;
        xScale.rangeRoundBands([0, width],.5);

        d3.select('#barchart_'+feature + ' svg').attr('width', width + margin.right);
    }

    function updateAxes() {
        svg.select('.x.axis').call(xAxis);
    }

    function updateBars() {
        var bar = svg.selectAll('.bar')
            .data(data);

        bar.enter()
            .append('rect');

        bar.exit()
           .remove();

        bar.attr('class', 'bar')
            .attr('x', function (d) {
                return xScale(d[participantColumn]);
            })
            .attr('width', xScale.rangeBand())
            .attr('y', function (d) {
                if (isNaN(d[feature]))
                    return 0;
                return yScale(d[feature]);
            })
            .attr('height', function (d) {
                if (isNaN(d[feature]))
                    return 0;
                return height - yScale(d[feature]);
            })
            .style('fill', function (d) {
                return colors(d[participantColumn]);
            })
            .on('mouseover', tooltip.show)
            .on('mouseout', tooltip.hide);
    }

    function sortBars() {

        // Change sort icon
        var sort = 'asc';
        var sortIcon = $(this).find('i');

        if (sortIcon.hasClass('fa-sort-amount-asc')) {
            sort = 'desc';
            sortIcon.removeClass('fa-sort-amount-asc').addClass('fa-sort-amount-desc');
        } else {
            sort = 'asc';
            sortIcon.removeClass('fa-sort-amount-desc').addClass('fa-sort-amount-asc');
        }

        // Copy-on-write since tweens are evaluated after a delay.
        var x0 = xScale.domain(data.sort(function (a, b) {
            if (sort == 'desc')
                return d3.ascending(a[feature], b[feature]);

            return d3.descending(a[feature], b[feature]);
        })
            .map(function (d) {
                return d[participantColumn];
            }))
            .copy();

        svg.selectAll('.bar')
            .sort(function (a, b) {
                return x0(a[participantColumn]) - x0(b[participantColumn]);
            });

        var transition = svg.transition().duration(750),
            delay = function (d, i) {
                return i * 50;
            };

        transition.selectAll('.bar')
            .delay(delay)
            .attr('x', function (d) {
                return x0(d[participantColumn]);
            });

        transition.select('.x.axis')
            .call(xAxis)
            .selectAll('g')
            .delay(delay);
    }

    function showChartMessage(){

        $('#barchart_'+feature).empty()
            .html('<div class="msg-no-data"> <p>' + messageNoData + '</p> </div>');

    }

};

/**
 * Save bar chart to png.
 */
saveChart = function(){
    $(classSaveChart).click(function() {
        /*
            How to export charts:
            The trick is to draw a static parsed svg to hidden canvas and then take it as a url image and put inside <a> element. Then we click this element for example with jquery click().
         */

        var idSaveLink = $(this).attr('id');
        var feature = idSaveLink.split("_")[1];

        if ($('#svg_'+ feature).length) {
            var html = d3.select('#svg_' + feature)
                .attr('version', 1.1)
                .attr('xmlns', 'http://www.w3.org/2000/svg')
                .node().parentNode.innerHTML;

            var imgSrc = 'data:image/svg+xml;base64,' + btoa(html);


            var canvas = document.querySelector("#canvas_export");
            var context = canvas.getContext("2d");

            // Clear canvas
            context.clearRect(0, 0, canvas.width, canvas.height);

            var image = new Image;
            image.src = imgSrc;
            image.onload = function () {
                context.drawImage(image, 0, 0, canvas.width, canvas.height);

                var canvasData = canvas.toDataURL("image/png");

                var link = document.createElement("a");
                link.id = 'download_chart';
                link.download = feature + ".png";
                link.href = canvasData;
                link.setAttribute('target', '_blank');

                $('body').append(link);
                link.click();
                $('#download_chart').remove();
            };
        }

        return true;
    });
};

/**
 * Scroll up in screen.
 */
backToTop = function(){
    $(window).scroll(function() {
        if ( $(window).scrollTop() > 300 ) {
            $(linkBackToTop).fadeIn('slow');
        } else {
            $(linkBackToTop).fadeOut('slow');
        }
    });

    $(linkBackToTop).click(function() {
        $('html, body').animate({
            scrollTop: 0
        }, 700);
        return false;
    });
};

/**
 * Generate all the charts selected.
 * @param filename - The filename of the EMDAT output file
 * @param selectedParticipants - The list of selected participants ids
 * @param selectedFeatures - The list of selected features
 * @param columnIdParticipant - The name of the participant column
 */
generateAllCharts = function(filename, selectedParticipants, selectedFeatures, columnIdParticipant){
    var participantsIds = [];

    $.each(selectedParticipants, function( index, value ) {
        participantsIds.push('P'+value);
    });

    $.each(selectedFeatures, function( index, value ) {
        createBarChart(filename, columnIdParticipant, value['key'], participantsIds, value['unit']);
    });
};

/**
 * Drag and drop a panel.
 */
draggableCharts = function () {
    var panelList = $(idPanel);

    panelList.sortable({
        // Only make the .panel-heading child elements support dragging.
        // Omit this to make then entire body draggable.
        handle: '.panel-heading',
        update: function() {
            $('.panel', panelList).each(function(index, elem) {
                 var $listItem = $(elem),
                     newIndex = $listItem.index();
                 // Persist the new indices.
            });
        }
    });

    panelList.disableSelection();
};

/**
 * Object of a line charts.
 * @param feature - The name of the feature
 * @param minY - The minimum value of Y Axis
 * @param maxY - The maximum value of Y Axis
 * @returns {LineChart}
 * @constructor
 */
LineChart = function (feature, minY, maxY) {

    this.margin = {top: 20, right: 20, bottom: 30, left: 40};
    this.data = [];
    this.minY = minY;
    this.maxY = maxY;
    this.numSamples = numSamples;
    this.feature = feature;
    this.vis = d3.select('#linechart_'+feature);

    // Get width established
    var width_auto = parseInt(d3.select('#linechart_'+this.feature).style('width'), 10);

    this.width = width_auto - this.margin.left - this.margin.right;
    this.height = 250 - this.margin.top - this.margin.bottom;

    // offset the x-position of the line by the remaining window size
	var offset = numSamples - this.data.length;

	// create an SVG element inside the specified div that fully fills the div
	var svg = this.vis.append('svg')
            .attr('width', this.width + this.margin.left + this.margin.right)
            .attr('height', this.height + this.margin.top + this.margin.bottom)
            .append('g')
            .attr('transform', 'translate(' + this.margin.left + ',' + this.margin.top + ')');

    svg.append('defs').append('clipPath')
            .attr('id', 'clip')
            .append('rect')
            .attr('width', this.width)
            .attr('height', this.height);

    svg.append('g')
            .attr('class', 'y axis')
            .call(d3.svg.axis().scale(this.getScales()[1]).orient("left").innerTickSize(-this.width).outerTickSize(0).tickPadding(10));

	// create a line-drawing function to draw the SVG line chart
	this.line = (function (chart, offset) {
            var scale = chart.getScales();
			return d3.svg.line()
                    .x(function(d,i) { return scale[0](i+offset); })
                    .y(function(d) { return scale[1](chart.maxY-d); });
    });

    // display the line by appending an svg:path element with the data line we created above
    svg.append('g')
            .attr('clip-path', 'url(#clip)')
            .append('path')
            .attr('id', 'path_'+this.feature)
            .datum(this.data)
            .attr('class', 'line')
            .attr('d', this.line(this, offset)(this.data));

	return this;
};

// Scale from domain of values to pixel ranges
LineChart.prototype.getScales = function() {
	var x = d3.scale.linear().domain([0, this.numSamples-1]).range([0, this.width]);
	var y = d3.scale.linear().domain([0, this.maxY-this.minY]).range([this.height, 0]);
	return [x, y];
};

// Push the new data to the end of the line chart data
LineChart.prototype.addData = function (newData) {
    this.data.push.apply(this.data, newData);

    var offset = 0;

    // forget the beginning of the data array once it's length increases past the window size
    if (this.data.length > this.numSamples) {
        this.data = this.data.slice(-this.numSamples);
    } else {
        offset = this.numSamples - this.data.length;
    }

    // re-draw the line
    this.vis.select('#path_'+this.feature)
		.attr('d', this.line(this, offset)(this.data))
};

// Event that occurs after the document is ready
$(document).ready(readyStats());