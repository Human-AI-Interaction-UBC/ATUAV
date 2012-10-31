var address = "http://localhost:8080/atuav"

function pollFeatures() {
    $.getJSON(address + "/features?id=observer&callback=?", null, function (data) {
        var value_string = "";
        for (var key in data) {
            if (data.hasOwnProperty(key)) {
                value_string += (key + ":" + data[key] + "<br/>");
            }
        }
        $("#features").html(value_string);
    });
}

setInterval(pollFeatures, 5000);