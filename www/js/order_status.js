let order_from, order_to;

$(document).bind("backbutton", confirmation);

start();

function start() {
    //TODO Добавить обработку ошибки 404 на сервере, которая возникает в случае отмены заказа
    $.ajax({
        type: "GET",
        url: "http://lupusanay.speckod.ru/orders",
        xhrFields: {
            withCredentials: true
        }
    }).done(function (orders) {
        orders = orders[0]; //Change it in future
        $("#order_status").text(orders.status);

        if (order_from !== undefined && order_to !== undefined) {
            return true;
        }

        geoDecoder(function (data) {
            order_to = data;
            $("#to_status").text(data);
        }, orders.to);
        geoDecoder(function (data) {
            order_from = data;
            $("#from_status").text(data);
        }, orders.from);

        function geoDecoder(handler, coordinates) {
            $.get("https://geocode-maps.yandex.ru/1.x/", {format: "json", geocode: coordinates})
                .done(function (data) {
                    let result = data.response.GeoObjectCollection.featureMember[0].GeoObject.description + ", ";
                    result += data.response.GeoObjectCollection.featureMember[0].GeoObject.name;
                    handler(result);
                });
        }

    });
    setTimeout(function () {
        start();
    }, 10000);
}

$("#cancel").click(confirmation);

$("#delete").click(function () {
    del_order();
});


//TODO Обработать подтверждение заказа
$("#accept").click(function () {
    $.ajax({
        type: "GET",
        url: "http://lupusanay.speckod.ru/driver",
        xhrFields: {
            withCredentials: true
        },
    })
});

function confirmation() {
    navigator.notification.confirm("Ваш заказ будет отменен, все равно выйти?", pressed, "Выйти?", "Да");

    function pressed(button) {
        if (button === 1) {
            del_order();
        }
    }
}

function success_function() {
    $.ajax({
        type: "GET",
        url: "http://lupusanay.speckod.ru/kill",
        xhrFields: {
            withCredentials: true
        }, statusCode: {
            200: function () {
                location.href = "index.html";
            }
        }
    })
}

function del_order() {
    $.ajax({
        type: "DELETE",
        url: "http://lupusanay.speckod.ru/del_order",
        xhrFields: {
            withCredentials: true
        },
        statusCode: {
            200: function () {
                success_function();
            }
        }
    })
}
