let popup_block = $("#popup_block");
let popup_content = $("#popup_content");
popup_block.hide();
popup_content.hide();
let order_from, order_to;

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

$(document).bind("backbutton", function () {
    navigator.notification.confirm("Ваш заказ будет отменен, все равно выйти?",  fuck_go_back, "Выйти?", "Да");

    function fuck_go_back(button) {
        if (button === 1) {
            del_order();
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
        }
    }).done(function (orders) {
        let last_element = orders[0]; //Change it in future
        let order_status = last_element.status;
        $("#order_status").text(order_status);

        if (order_from !== undefined && order_to !== undefined) {
            return true;
        }
        $("#cancel").click(function () {
            popup_block.show();
            popup_content.show();
        });
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


$("#delete").click(function () {
    del_order();
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