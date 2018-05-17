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

/* @TODO Добавить обновление статуса заказа
 Добавить постоянное обновление статуса заказа, обработку изменения статуса
(добавить всплывающее окно с уведомлением "водитель отказался от вашего заказа)
*/

$.ajax({
    type: "GET",
    url: "http://lupusanay.speckod.ru/orders",
    xhrFields: {
        withCredentials: true
    }
}).done(function (orders) {
        let order = orders[0];

        $("#accept_order").click(function () {
            navigator.notification.confirm("Вы уверены, что хотите подтвердить выполнение заказа", exit, "Подтвердить?", "Подтвердить");
        });
        $("#name").text(order.client_name);
        $("#number").text(order.client_number);
        $("#value").text(order.value);

        geoDecoder(function (data) {
            $("#to").text(data);
        }, order.to);
        geoDecoder(function (data) {
            $("#from").text(data);
        }, order.from);

        function exit(button) {
            if (button === 1) {
                $.ajax({
                    type: "GET",
                    url: "http://lupusanay.speckod.ru/driver",
                    xhrFields: {
                        withCredentials: true
                    },
                }).done(function (e) {
                    //TODO Добавить обработку подтверждения заказа
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
    }
);







