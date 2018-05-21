let order_from, order_to, order_status;
let showed = false;
let order_status_html = $("#order_status");

let accept_order = $("#accept");

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
        let order = orders[0];
        if (order.client_complete_check === "false" && order.driver_complete_check === "true" && !showed) {
            navigator.notification.alert("Водитель подтвердил заказ", null, "Водитель подтвердил", "Ясно");
            showed = true;
        }
        else if (order_status !== undefined) {
            if (order_status !== order.status && order.status === "ready") {
                navigator.notification.alert("Водитель отказался от вашего заказа", function () {
                    order_status = order.status;
                    order_status_html.text("Ожидание");
                }, "Заказ отменен водителем", "Ясно");

            }
            if (order_status !== order.status && order.status === "taken") {
                navigator.notification.alert("Ваш заказ взял водитель", function () {
                    order_status = order.status;
                    order_status_html.text("Взят водителем");
                }, "Заказ был взят", "Ясно");

            }
        }
        else {
            if (order.status === "taken") {
                order_status_html.text("Взят водителем");
                order_status = "taken";
            }
            if (order.status === "ready") {
                order_status_html.text("Ожидание");
                order_status = "ready";
            }
        }
        if (order_from !== undefined && order_to !== undefined) {
            return true;
        }
        geoDecoder(function (data) {
            order_to = data;
            $("#to_status").text(data);
        }, order.to);
        geoDecoder(function (data) {
            order_from = data;
            $("#from_status").text(data);
        }, order.from);

        function geoDecoder(handler, coordinates) {
            $.get("https://geocode-maps.yandex.ru/1.x/", {format: "json", geocode: coordinates})
                .done(function (data) {
                    let result = data.response.GeoObjectCollection.featureMember[0].GeoObject.description + ", ";
                    result += data.response.GeoObjectCollection.featureMember[0].GeoObject.name;
                    handler(result);
                });
        }

        accept_order.click(function () {
            navigator.notification.confirm("Вы уверены, что хотите подтвердить выполнение заказа", accept, "Подтвердить?", "Подтвердить");
        });

        function accept(button) {
            if (button === 1) {
                $.ajax({
                    type: "GET",
                    url: "http://lupusanay.speckod.ru/client",
                    xhrFields: {
                        withCredentials: true
                    },
                }).done(function () {
                    if (order.driver_complete_check === "false") {
                        (navigator.notification.alert("Ожидайте пока водитель подтвердит заказ", function () {
                            accept_order.prop('disabled', true);
                            accept_order.css('background', 'darkgray');
                            accept_order.val("Вы уже подтвердили выполнение");
                        }, "Ожидайте", "Ясно"));
                    }
                    else {
                        navigator.notification.alert("Заказ выполнен", function () {
                            location.href="index.html";
                        }, "Готово", "Ясно")
                    }
                })
            }
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

function confirmation() {
    navigator.notification.confirm("Ваш заказ будет отменен, все равно выйти?", pressed, "Выйти?", "Да");

    function pressed(button) {
        if (button === 1) {
            del_order();
        }
    }
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
                location.href = "index.html";
            }
        }
    })
}
