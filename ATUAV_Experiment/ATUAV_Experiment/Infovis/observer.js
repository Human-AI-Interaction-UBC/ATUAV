var address = "http://localhost:8080/atuav"
var id = "observer"

function pollFeatures() {
    $.getJSON(address + "/features?id=" + id + "&callback=?", null, function(data) {
        var features = "";
        for (var key in data) {
            if (data.hasOwnProperty(key)) {
                features += (key + ": " + data[key] + "<br/>");
            }
        }
        $("#features").html(features);
    });
}

setInterval(pollFeatures, 5000);