let old_orders = [];
let order_id;
$.ajax({
    type: "GET", //kostil
    url: "http://lupusanay.speckod.ru/orders",
    xhrFields: {
        withCredentials: true
    }
}).done(function (orders) {});
function toJSON(array) {
    let arr = [];
    for (let i in array) {
        if (array.hasOwnProperty(i))
            arr.push(JSON.stringify(array[i]));
    }
    return arr;
}

function fromJSON(array) {
    let arr = [];
    for (let i in array) {
        if (array.hasOwnProperty(i))
            arr.push(JSON.parse(array[i]));
    }
    return arr;
}

function start() {
    $.ajax({
        type: "GET",
        url: "http://lupusanay.speckod.ru/orders",
        xhrFields: {
            withCredentials: true
        }
    }).done(function (orders) {

        let arr1 = toJSON(old_orders);
        let arr2 = toJSON(orders);
        let to_add = fromJSON(arr2.filter(x => !arr1.includes(x)));
        let to_delete = fromJSON(arr1.filter(x => !arr2.includes(x)));

        $.each(to_add, function (i) {
            draw_order(to_add[i])
        });
        $.each(to_delete, function (i) {
            delete_order(to_delete[i]);
        });
        old_orders = orders;
    });
    setTimeout(function () {
        start();
    }, 30000);
}

function geoDecoder(handler, coordinates) {
    $.get("https://geocode-maps.yandex.ru/1.x/", {format: "json", geocode: coordinates})
        .done(function (data) {
            let result = data.response.GeoObjectCollection.featureMember[0].GeoObject.description + ", ";
            result += data.response.GeoObjectCollection.featureMember[0].GeoObject.name;
            handler(result);
        });
}

function delete_order(order) {
    $("#" + order.id).remove();
}

function draw_order(order) {
    let event_counter = 2;
    let to;
    let from;
    let orders_list = $("#orders_list");

    geoDecoder(function (data) {
        to = data;
        ready();
    }, order.to);
    geoDecoder(function (data) {
        from = data;
        ready();
    }, order.from);

    function ready() {
        if (--event_counter !== 0) return false;
        let li = $('<li/>')
            .appendTo(orders_list)
            .attr('id', order.id);
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
            .text(order.value + " RUB")
            .addClass("value")
            .appendTo(collapsed_order);
        let hidden = $('<div/>')
            .appendTo(li)
            .addClass('hidden');
        let text = $('<div/>')
            .appendTo(hidden)
            .addClass("text");
        $('<p/>')
            .text(order.date)
            .appendTo(text);
        $('<p/>')
            .text(order.client_name)
            .appendTo(text);
        $('<p/>')
            .text(order.client_number)
            .appendTo(text);
        $('<button/>')
            .text("Принять")
            .appendTo(hidden)
            .addClass("button")
            .click(function () {
                order_id = li.attr('id');
                navigator.notification.confirm("Принять этот заказ?", accept, "Принятие заказа", "Да, Нет");
            });
        collapsed_order.click(function (e) {
            let hidden = $(this).parent().find('.hidden');
            hidden.css("display") === "none" ? hidden.css("display", "block") : hidden.css("display", "none");
        })
    }
}


start();
function accept(button) {
    if (button === 1) {
        let url = "http://lupusanay.speckod.ru/take_order/" + order_id;
        $.ajax({
            type: "PUT",
            url: url,
            xhrFields: {
                withCredentials: true
            },
            statusCode: {
                200: function () {
                    location.href = "driver_order_status.html";
                }
            }
        });
    }
}

$(document).bind("backbutton", function () {
    navigator.notification.confirm("Выйти из аккаунта?", go_back, "Выйти?", "Все равно выйти");

    function go_back(button) {
        if (button === 1)
        $.ajax({
            type: "GET",
            url: "http://lupusanay.speckod.ru/kill",
            xhrFields: {
                withCredentials: true
            },
            statusCode: {
                200: function () {
                    location.href = "index.html";
                }
            }
        })
    }
});