
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

});
