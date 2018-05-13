start();
let order_from, order_to;
function start(){
    $.get("http://lupusanay.speckod.ru/orders")
        .done(function (orders) {
            let last_element = orders[orders.length - 1]; //Change it in future
            let order_status= last_element.status;
            $("#order_status").text(order_status);
            if (order_from !== undefined && order_to!==undefined) {
                return true;
            }
            order_from = last_element.from;
            order_to = last_element.to;
            geoDecoder(order_from, order_to);
        });
    setTimeout(function () {
        start();
    }, 10000);
}
    function geoDecoder(coordinates_from, coordinates_to) {
        $.get("https://geocode-maps.yandex.ru/1.x/", {format: "json", geocode: coordinates_from})
            .done(function (data_from) {
                let result_from = data_from.response.GeoObjectCollection.featureMember[0].GeoObject.description;
                $("#from_status").append(result_from);
            });
        $.get("https://geocode-maps.yandex.ru/1.x/", {format: "json", geocode: coordinates_to})
            .done(function (data_to) {
                let result_to = data_to.response.GeoObjectCollection.featureMember[0].GeoObject.description;
                $("#to_status").append(result_to);
            });
    }



