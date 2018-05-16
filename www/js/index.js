$(document).ready(function () {
    $("#user_button").click(function () {
        location.href = "add_order.html";
    });
    $("#driver_button").click(function () {
        location.href = "login.html";
    });
    $(document).bind("backbutton", function () {
        navigator.device.exitApp();
    });


    // $.get("http://lupusanay.speckod.ru/session")
    //     .done(function (data) {
    //         if(data.logged) {
    //             if(data.order_client) {
    //                 location.href = "add_order.html";
    //             } else if (data.order_id) {
    //                 location.href = "driver_order_status.html";
    //             } else {
    //                 location.href = "list_of_orders.html";
    //             }
    //         } else {
    //             $("#user_button").click(function () {
    //                 location.href = "add_order.html";
    //             });
    //             $("#driver_button").click(function () {
    //                 location.href = "login.html";
    //             });
    //         }
    //     });

});