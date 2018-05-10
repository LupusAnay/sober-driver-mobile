$.get("http://lupusanay.speckod.ru/orders")
    .done(function (orders) {
        let orders_list = $("#orders_list");
        $.each(orders, function (i) {
            let event_counter = 2;
            let to;
            let from;
            let value = orders[i].value;
            geoDecoder(function (data) {
                to = data;
                ready();
            }, orders[i].to);
            geoDecoder(function (data) {
                from = data;
                ready();
            }, orders[i].from);

            function ready() {
                if (--event_counter !== 0) return false;
                let li = $('<li/>')
                    .appendTo(orders_list)
                    .addClass("collapsed_order");
                $("<div/>")
                    .text("Откуда: " + from)
                    .addClass("from")
                    .appendTo(li);
                $("<div/>")
                    .text("Куда: " + to)
                    .addClass("to")
                    .appendTo(li);
                $("<div/>")
                    .text("Стоимость: " + value)
                    .addClass("to")
                    .appendTo(li)

            }
        });
    });

function geoDecoder(handler, coordinates) {
    $.get("https://geocode-maps.yandex.ru/1.x/", {format: "json", geocode: coordinates})
        .done(function (data) {
            let result = data.response.GeoObjectCollection.featureMember[0].GeoObject.description;
            handler(result);
        });
}