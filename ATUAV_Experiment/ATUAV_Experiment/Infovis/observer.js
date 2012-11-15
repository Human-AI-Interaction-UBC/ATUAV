var address = "http://localhost:8080/atuav";
var processorId = "experiment-c";
var trackedSumFeatures = []

function startTask(runId, aois) {
    $.get(address + "/start?runId=" + runId + "&aois=" + aois)
}

function pollFeatures() {
    $.getJSON(address + "/features?processorId=" + processorId + "&callback=?", null, function(data) {
        var features = "";
        for (var key in data) {
            if (data.hasOwnProperty(key)) {
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
    $.getJSON(address + "/condition?processorId=" + processorId + "&condition=showtext&callback=?", function (data) {
        $("#showtext").html("showtext:" + data);
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
    setInterval(pollFeatures, 5000);
    setInterval(pollShowText, 1000);
});