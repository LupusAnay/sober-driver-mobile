$(document).ready(function () {
    var phone_number = $("#phone_number");
    var birthday = $("#birthday");
    phone_number.mask("+7(000)-000-00-00");
    birthday.mask("0000-00-00");

    phone_number.blur(function () {

        if ($(this).val().length === 17) {
            $("#phone_number_err").text(' ');
            $(this).css({'border': '1px solid #569b44'});
        }
        else {
            $(this).css({'border': '1px solid #ff0000'});
            $("#phone_number_err").text('Введен не полный номер');
        }
    });

    birthday.blur(function () {

        if ($(this).val().length === 10) {
            $("#birthday_err").text(' ');
            $(this).css({'border': '1px solid #569b44'});
        }
        else {
            $(this).css({'border': '1px solid #ff0000'});
            $("#birthday_err").text('Введена не полная дата');
        }
    });

    $("#first_name").blur(function () {
        if ($(this).val() !== '') {
            var pattern = /^[a-zа-яё]+$/i;
            if (pattern.test($(this).val())) {
                $(this).css({'border': '1px solid #569b44'});
                $("#first_name_err").text(' ');
            } else {
                $(this).css({'border': '1px solid #ff0000'});
                $("#first_name_err").text('Не верно');
            }
        }
        else {
            $(this).css({'border': '1px solid #ff0000'});
            $("#first_name_err").text('Поле имени не должно быть пустым');
        }
    });
    $("#second_name").blur(function () {
        if ($(this).val() !== '') {
            var pattern = /^[a-zа-яё]+$/i;
            if (pattern.test($(this).val())) {
                $(this).css({'border': '1px solid #569b44'});
                $("#second_name_err").text(' ');
            } else {
                $(this).css({'border': '1px solid #ff0000'});
                $("#second_name_err").text('Не верно');
            }
        }
        else {
            $(this).css({'border': '1px solid #ff0000'});
            $("#second_name_err").text('Поле фамилии не должно быть пустым');
        }

    });
    $("#password").blur(function () {
        if ($(this).val() !== '') {
            var pattern = /(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z!@#$%^&*]{6,}/;
            if (pattern.test($(this).val())) {
                $(this).css({'border': '1px solid #569b44'});
                $("#password_err").text(' ');
            } else {
                $(this).css({'border': '1px solid #ff0000'});
                $("#password_err").text('Не верно');
            }
        }
        else {
            $(this).css({'border': '1px solid #ff0000'});
            $("#password_err").text('Поле пароля не должно быть пустым');
        }
    });
    $("#passport").blur(function () {
        if ($(this).val() !== '') {
            var pattern = /\d{10}$/;
            if (pattern.test($(this).val())) {
                $(this).css({'border': '1px solid #569b44'});
                $("#passport_err").text(' ');
            } else {
                $(this).css({'border': '1px solid #ff0000'});
                $("#passport_err").text('Не верно');
            }
        }
        else {
            $(this).css({'border': '1px solid #ff0000'});
            $("#passport_err").text('Поле паспорта не должно быть пустым');
        }
    });
    $("#driver_license").blur(function () {
        if ($(this).val() !== '') {
            var pattern = /\d{10}$/;
            if (pattern.test($(this).val())) {
                $(this).css({'border': '1px solid #569b44'});
                $("#driver_license_err").text(' ');
            } else {
                $(this).css({'border': '1px solid #ff0000'});
                $("#driver_license_err").text('Не верно');
            }
        }
        else {
            $(this).css({'border': '1px solid #ff0000'});
            $("#driver_license_err").text('Поле водительских прав не должно быть пустым');
        }
    });

});

$("#reg_button").click(function () {
    $("#reg_block span").each(function () {
        if ($(this).text() !== ' ') {
            console.log("Неверные данные");
            return false;
        } else if (($(this).text() === '') || ($("input:empty").length === '')) {
            console.log("Введите данные");
            return false;
        } else {
            var phone_number = $("#phone_number");
            phone_number.unmask();

            var jsonform = {
                'first_name': $("#first_name").val(),
                'second_name': $("#second_name").val(),
                'birthday': $("#birthday").val(),
                'passport': $("#passport").val(),
                'driver_license': $("#driver_license").val(),
                'phone': "+7" + phone_number.val(),
                'password': $("#password").val()
            };
            var string = JSON.stringify(jsonform);
            console.log(JSON.stringify(jsonform));
            var xhr = new XMLHttpRequest();
            xhr.open("POST", "http://lupusanay.speckod.ru/registration", true);
            console.log(string);
            xhr.send(string);
            xhr.onreadystatechange = function () {
                if (xhr.readyState !== 4) return;
                if (xhr.status === 200) {
                    console.log("Вы успешно зарегестрировались")
                } else if (xhr.status === 422) {
                    console.log("Введены неверные данные");
                    console.log(xhr.responseText + xhr.status)
                } else {
                    console.log("Ошибка");
                    console.log(xhr.responseText + xhr.status)
                }
            }
        }
    });
});


var app = {
    // Application Constructor
    initialize: function () {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    },

    onDeviceReady: function () {
        this.receivedEvent('deviceready');
    },

    // Update DOM on a Received Event
    receivedEvent: function (id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');
        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');
        console.log('Received Event: ' + id);
    }
};

app.initialize();

