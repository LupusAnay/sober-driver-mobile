$(document).ready(function () {
    var phone_number = $("#phone_number");
    var password = $("#password");
    phone_number.mask("+7(000)-000-00-00");
    $("#log_block").keyup(function () {
        if (/[0-9+\-)(]{17}$/.test(phone_number.val()) === true && password.val() !== '') {
            $('#reg_button').prop('disabled', false)
        }
        else {
            $('#reg_button').prop('disabled', true)
        }
    });
    $("#gotoregbutton").click(function () {
        location.href = "registration.html"//регистрация
    });
    $("#reg_button").click(function () {
        var phonenumber_unmasked = phone_number.val().replace(/[()-]+/g, '');
        var jsonform = {
            'phone': phonenumber_unmasked,
            'password': password.val()
        };
        var string = JSON.stringify(jsonform);
        console.log(JSON.stringify(jsonform));
        var xhr = new XMLHttpRequest();
        xhr.open("POST", "http://lupusanay.speckod.ru/login", true);
        xhr.send(string);
        xhr.onreadystatechange = function () {
            if (xhr.readyState !== 4) return;
            if (xhr.responseText === 'true') {
                console.log("Вы успешно вошли")
            } else if (xhr.responseText === 'false') {
                console.log("Введены неверные данные");
                console.log(xhr.responseText + xhr.status)
            } else {
                console.log("Ошибка");
                console.log(xhr.responseText + xhr.status)
            }
        };
    })
});

