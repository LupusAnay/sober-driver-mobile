let phone_number = $("#phone_number");
let password = $("#password");
phone_number.mask("+7(000)-000-00-00");
$("#log_block").keyup(function () {
    if (/[0-9+\-)(]{17}$/.test(phone_number.val()) === true && password.val() !== '') {
        $('#reg_button').prop('disabled', false);
    } else {
        $('#reg_button').prop('disabled', true);
    }
});
$("#gotoregbutton").click(function () {
    location.href = "registration.html";
});
$("#reg_button").click(function () {
    let json_form = {
        'phone': phone_number.val().replace(/[()-]+/g, ''),
        'password': password.val()
    };
    $.ajax({
        url: 'http://lupusanay.speckod.ru/login',
        type: 'POST',
        data: JSON.stringify(json_form),
        success: function () {
            location.href = 'index.html'
        },
        error: function (data) {
            console.log(data);
            navigator.notification.alert('Произошла ошибка: ' + data.responseJSON.what, null, 'Ошибка', 'Ясно');
        }
    });
});

//
// statusCode: {
//     200: function () {
//         location.href = 'list_of_orders.html';
//     },
//     422: function (data) {
//         navigator.notification.alert('Произошла ошибка: ' + data.responseJSON.what, null, 'Ошибка', 'Ясно')
//     },
// },