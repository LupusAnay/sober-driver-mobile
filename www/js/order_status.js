let order_from, order_to, current_order_status;
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
        }, statusCode: {
            200: function (orders) {
                let order = orders[0];
                if (!current_order_status) { //Если поле пустое, то вводим статус и данные в поле
                    order_status_html.text(translate(order.status));
                    current_order_status = order.status;
                    geoDecoder(function (data) {
                        order_to = data;
                        $("#to_status").text(data);
                    }, order.to);
                    geoDecoder(function (data) {
                        order_from = data;
                        $("#from_status").text(data);
                    }, order.from);
                }

                else if (current_order_status !== order.status && order.status === "taken") { //Если статус изменился на taken
                    navigator.notification.alert("Водитель взял ваш заказ", function () {
                        order_status_html.text(translate(order.status));
                        current_order_status = order.status;
                    }, "Ожидайте", "Ясно");
                }

                else if (current_order_status !== order.status && order.status === "ready") { //Если статус изменился на ready
                    navigator.notification.alert("Водитель отказался от заказа", function () {
                        order_status_html.text(translate(order.status));
                        current_order_status = order.status;
                    }, "Отказ", "Ясно");
                }

                else if (order.driver_complete_check === "true" && order.client_complete_check === "false" && !showed) //Если водитель подтвердил заказ, а клиент нет
                {
                    navigator.notification.alert("Водитель подтвердил заказ", null, "Водитель подтвердил", "Ясно");
                    showed = true;
                }

                setTimeout(function () {
                    start();
                }, 10000);
            },
            403: function () {
                navigator.notification.alert("Заказ выпонен", function () {
                    kill()
                }, "Заказ выполнен", "Ясно");
            }
        }
    });
}


function accept(button) {
    if (button === 1) {
        $.ajax({
            type: "GET",
            url: "http://lupusanay.speckod.ru/orders",
            xhrFields: {
                withCredentials: true
            }
        }).done(function (orders) {
            $.ajax({
                type: "GET",
                url: "http://lupusanay.speckod.ru/client",
                xhrFields: {
                    withCredentials: true
                }
            }).done(function () {
                let order = orders[0];
                if (order.driver_complete_check === "false") {
                    navigator.notification.alert("Ожидайте подтверждения водителем", function () {
                        accept_order.prop('disabled', true);
                        accept_order.css('background', 'darkgray');
                        accept_order.val("Вы уже подтвердили выполнение");
                    }, "Ожидайте водителя", "Ясно");

                }
                if (order.driver_complete_check === "true") {
                    navigator.notification.alert("Заказ выполнен", function () {
                        kill();
                    }, "Заказ выполнен", "Ясно");
                }

            });
        })
    }
}


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


$("#cancel").click(confirmation);

function confirmation() {
    navigator.notification.confirm("Ваш заказ будет отменен, все равно выйти?", pressed, "Выйти?", "Да");

    function pressed(button) {
        if (button === 1) {
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
    }
}

function translate(status) //Перевод для полученных статусов
{
    if (status === "ready")
        return ("Ожидание");
    else if (status === "taken")
        return ("Взят водителем");
    else if (status === "complete")
        return ("Выполнен");
}
function kill() {
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