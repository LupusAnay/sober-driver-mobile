let popup_block = $("#popup_block");
let popup_content = $("#popup_content");
popup_block.hide();
popup_content.hide();
start();
let name, number, order_from, order_to, value;

function start() {
    $.ajax({
        type: "GET",
        url: "http://lupusanay.speckod.ru/orders",
        xhrFields: {
            withCredentials: true
        }
    }).done(function (orders) {
        if(orders[0]) {
            let last_element = orders[0]; //Change it in future
            if (name !== undefined) {
                return true;
            }
            $("#accept_order").click(function () {
                popup_block.show();
                popup_content.show();
            });
            name = last_element.client_name;
            number = last_element.client_name;
            value = last_element.value;
            order_from = last_element.from;
            order_to = last_element.to;
            geoDecoder(order_from, order_to);
        }
    });
    setTimeout(function () {
        start();
    }, 10000);
}

function geoDecoder(coordinates_from, coordinates_to) {
    $.get("https://geocode-maps.yandex.ru/1.x/", {format: "json", geocode: coordinates_from})
        .done(function (data_from) {
            let result_from = data_from.response.GeoObjectCollection.featureMember[0].GeoObject.description + ", ";
            result_from += data_from.response.GeoObjectCollection.featureMember[0].GeoObject.name;
            $("#from_status").append(result_from);
        });
    $.get("https://geocode-maps.yandex.ru/1.x/", {format: "json", geocode: coordinates_to})
        .done(function (data_to) {
            let result_to = data_to.response.GeoObjectCollection.featureMember[0].GeoObject.description + ", ";
            result_to += data_to.response.GeoObjectCollection.featureMember[0].GeoObject.name;
            $("#to_status").append(result_to);
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


