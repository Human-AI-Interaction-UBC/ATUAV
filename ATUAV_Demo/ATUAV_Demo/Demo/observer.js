var address = "http://localhost:8080/atuav";
var processorId = "experiment";
var trackedSumFeatures = []

var sparkline = [];

function startTask(runId, aois) {
    $.get(address + "/start?runId=" + runId + "&aois=" + aois);
    var maxLength = 12; // Number of samples to show in the sparklines
    sparkline["fixationrate"] = new Sparkline("fixationrate", [], 0, 0.02, maxLength);
    sparkline["meanfixationduration"] = new Sparkline("meanfixationduration", [], 0, 1000, maxLength);
    sparkline["meanrelpathangles"] = new Sparkline("meanrelpathangles", [], 0, 3, maxLength);
    sparkline["stddevpathdistance"] = new Sparkline("stddevpathdistance", [], 0, 500, maxLength);
}

function pollFeatures() {
    $.getJSON(address + "/features?processorId=" + processorId + "&callback=?", null, function (data) {
        var features = "";
        for (var key in data) {
            if (data.hasOwnProperty(key)) {
                if (key in sparkline && key != "length") {
                    sparkline[key].addData([Number(data[key])]);
                }
                features += (key + ": " + data[key] + "<br/>");
                if ($.inArray(key, trackedSumFeatures) >= 0) {
                    updateTrackedSumFeature(key, data[key]);
                }
            }
        }
        $("#features").html(features);
    });
}

function pollShowText() {
    $.getJSON(address + "/condition?processorId=" + processorId + "&condition=showText&callback=?", function (data) {
        $("#showtext").html("showtext: " + data);
    });
}

function addTrackedSumFeatures() {
    $(".sum").each(function (index, element) {
        trackedSumFeatures[index] = element.id;
    })
}

function updateTrackedSumFeature(feature, value) {
    $feature = $("#" + feature);
    if ($feature.text() != "") {
        value = (parseInt($feature.text().match(/\d+/)) + parseInt(value));
    }
    $feature.text("sum " + feature + ": " + value);
}

$(document).ready(function () {
    addTrackedSumFeatures();
    startTask(0, "left\\t0,0\\t640,0\\t640,1024\\t0,1024\\r\\nright\\t641,0\\t1280,0\\t1280,1024\\t641,1024")
    setInterval(pollFeatures, 1000);
    //setInterval(pollShowText, 1000);
});