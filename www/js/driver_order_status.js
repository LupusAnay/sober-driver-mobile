let to;
let client_order_check=false;
let showed = false;
let accept_order = $("#accept_order");
$(document).bind("backbutton", function () {
    navigator.notification.confirm("Ваш заказ будет отменен, все равно выйти?", fuck_go_back, "Выйти?", "Все равно выйти");

    function fuck_go_back(button) {
        if (button === 1) {
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
    }
});


start();

function start() {
    $.ajax({
        type: "GET",
        url: "http://lupusanay.speckod.ru/orders",
        xhrFields: {
            withCredentials: true
        },
        statusCode: {
            404:
                function () {
                    (navigator.notification.alert("Заказ удален", function () {
                        location.href = "list_of_orders.html";
                    }, "Заказ был удален", "Ясно"));
                },
            403:
                function () {
                    (navigator.notification.alert("Заказ выполнен", function () {
                        location.href = "list_of_orders.html";
                    }, "Заказ был выполнен", "Ясно"));
                }
        }
    }).done(function (orders) {
            let order = orders[0];
            if (order.status === "complete") {
                navigator.notification.confirm("Вы выполнили заказ", function () {
                    location.href = "list_of_orders.html";
                }, "Заказ выполнен", "Ясно");

            }
            if (order.client_complete_check === "true" && order.driver_complete_check === "false" && !showed) {
                (navigator.notification.alert("Клиент подтвердил заказ", null, "Клиент подтвердил", "Ясно"));
                showed = true;
                client_order_check=true;
            }

            function accept(button) {
                if (button === 1) {
                    $.ajax({
                        type: "GET",
                        url: "http://lupusanay.speckod.ru/driver",
                        xhrFields: {
                            withCredentials: true
                        },
                    }).done(function () {

                        if (!client_order_check) {
                            (navigator.notification.alert("Ожидайте пока клиент подтвердит заказ", function () {
                                accept_order.prop('disabled', true);
                                accept_order.css('background', 'darkgray');
                                accept_order.val("Вы уже подтвердили выполнение");
                            }, "Ожидайте", "Ясно"));
                        }


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

            if (to !== undefined) {
                return true;
            }
            $("#name").text(order.client_name);
            $("#number").text(order.client_number);
            $("#value").text(order.value);

            geoDecoder(function (data) {
                to = data;
                $("#to").text(data);
            }, order.to);
            geoDecoder(function (data) {
                $("#from").text(data);
            }, order.from);
            accept_order.click(function () {
                navigator.notification.confirm("Вы уверены, что хотите подтвердить выполнение заказа", accept, "Подтвердить?", "Подтвердить");
            });
            $("#navigator").click(function () {
                launchnavigator.navigate(order.to.split(", ").reverse().toString(), {
                    start: order.from.split(", ").reverse().toString()
                });
            })
        }
    );
    setTimeout(function () {
        start();
    }, 10000);
}







