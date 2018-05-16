let popup_block = $("#popup_block");
let popup_content = $("#popup_content");
popup_block.hide();
popup_content.hide();

$.ajax({
    type: "GET",
    url: "http://lupusanay.speckod.ru/orders",
    xhrFields: {
        withCredentials: true
    }
}).done(function (orders) {
    let order = orders[0];
    $("#accept_order").click(function () {
        popup_block.show();
        popup_content.show();
    });
    $("#name").text(order.client_name);
    $("#number").text(order.client_number);
    $("#value").text(order.value);
    geoDecoder(order.to, order.from);
});


function geoDecoder(coordinates_from, coordinates_to) {
    $.get("https://geocode-maps.yandex.ru/1.x/", {format: "json", geocode: coordinates_from})
        .done(function (data_from) {
            let result_from = data_from.response.GeoObjectCollection.featureMember[0].GeoObject.description + ", ";
            result_from += data_from.response.GeoObjectCollection.featureMember[0].GeoObject.name;
            $("#from").text(result_from);
        });
    $.get("https://geocode-maps.yandex.ru/1.x/", {format: "json", geocode: coordinates_to})
        .done(function (data_to) {
            let result_to = data_to.response.GeoObjectCollection.featureMember[0].GeoObject.description + ", ";
            result_to += data_to.response.GeoObjectCollection.featureMember[0].GeoObject.name;
            $("#to").text(result_to);
        });
}

popup_block.click(function () {
    popup_block.hide();
    popup_content.hide();
});

$("#accept").click(function () {
    $.ajax({
        type: "GET",
        url: "http://lupusanay.speckod.ru/driver",
        xhrFields: {
            withCredentials: true
        },
    })
});


