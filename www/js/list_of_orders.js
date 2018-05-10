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
                    .appendTo(orders_list);
                let collapsed_order = $('<div/>')
                    .appendTo(li)
                    .addClass("collapsed_order");
                let address_wrapper = $('<div/>')
                    .addClass("address_wrapper")
                    .appendTo(collapsed_order);
                $("<div/>")
                    .text("Откуда: " + from)
                    .addClass("from")
                    .appendTo(address_wrapper);
                $("<div/>")
                    .text("Куда: " + to)
                    .addClass("to")
                    .appendTo(address_wrapper);
                $("<div/>")
                    .text(value + " RUB")
                    .addClass("value")
                    .appendTo(collapsed_order);
                let hidden = $('<div/>')
                    .appendTo(li)
                    .addClass('hidden');
                let text = $('<div/>')
                    .appendTo(hidden)
                    .addClass("text");
                $('<p/>')
                    .text(orders[i].date)
                    .appendTo(text);
                $('<p/>')
                    .text(orders[i].client_name)
                    .appendTo(text);
                $('<p/>')
                    .text(orders[i].client_number)
                    .appendTo(text);
                $('<button/>')
                    .text("Принять")
                    .appendTo(hidden)
                    .addClass("accept_button");
                li.click(function (e) {
                    let hidden = $(this).find('.hidden');
                    console.log('click');
                    hidden.css("display") === "none" ? hidden.css("display", "block") : hidden.css("display", "none");
                })
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
