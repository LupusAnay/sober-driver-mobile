$(document).ready(function () {
    $("#user_button").click(function () {
        location.href = "add_order.html";
    });
    $("#driver_button").click(function () {
        location.href = "login.html";
    });
    $(document).bind("backbutton", function () {
        navigator.app.exitApp();
        window.close();
    });
    $.get("http://lupusanay.speckod.ru/session")
        .done(function (session) {
            if (session.session_type === 'client') {
                if (session.order_id !== null) {
                    location.href = "order_status.html";
                } else {
                    location.href = "add_order.html";
                }
            } else if (session.session_type === 'driver') {
                if (session.order_id !== null) {
                    location.href = "driver_order_status.html"
                } else {
                    location.href = "list_of_orders.html";
                }
            }
        });

});
