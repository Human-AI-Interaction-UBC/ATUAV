var address = "http://localhost:8080/atuav";
var id = "observer";
var trackedSumFeatures = []

function pollFeatures() {
    $.getJSON(address + "/features?id=" + id + "&callback=?", null, function (data) {
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

setInterval(pollFeatures, 5000);
$(document).ready(function () {
    addTrackedSumFeatures();
});