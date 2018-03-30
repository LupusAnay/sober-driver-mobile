$(document).ready(function () {
    var phone_number = $("#phone_number");
    var birthday = $("#birthday");
    phone_number.mask("+7(000)-000-00-00");
    birthday.mask("0000-00-00");
    var first_name = $("#first_name");
    var second_name = $("#second_name");
    var password = $("#password");
    var passport = $("#passport");
    var driver_license = $("#driver_license");
    phone_number.error_field = function (error_string) {$("#phone_number_err").text(error_string)};
    var test = true;

    phone_number.regx = 0;
    phone_number.blur(function () {
        validate(this, 0, $("#phone_number_err"), 17)
    });
    birthday.blur(function () {
        validate(this, 0, $("#birthday_err"), 10)
    });
    first_name.blur(function () {
        validate(this, /^[a-zа-яё]+$/i, $("#first_name_err"), 0)
    });
    second_name.blur(function () {
        validate(this, /^[a-zа-яё]+$/i, $("#second_name_err"), 0)
    });
    password.blur(function () {
        validate(this, /(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z!@#$%^&*]{6,}/, $("#password_err"), 0)
    });
    passport.blur(function () {
        validate(this, /\d{10}$/, $("#passport_err"), 0)
    });
    driver_license.blur(function () {
        validate(this, /\d{10}$/, $("#driver_license_err"), 0)
    });


    function validate(object, pattern, errField, fieldlenght) {
        if ($(object).val() !== '') {
            if (pattern !== 0) {
                {
                    if (pattern.test($(object).val())) {
                        $(object).css({'border': '1px solid #569b44'});
                        $(errField).text('<3'); // Здесь может быть ваша галочка, но нет
                    } else {
                        $(object).css({'border': '1px solid #ff0000'});
                        $(errField).text('Данные не соответствуют валидации');
                    }
                }
            }
            if (fieldlenght !== 0) {
                if ($(object).val().length === fieldlenght) {
                    $(errField).text('<3');
                    $(object).css({'border': '1px solid #569b44'});
                }
                else {
                    $(object).css({'border': '1px solid #ff0000'});
                    $(errField).text('Данные не соответствуют необходимой длине');
                }
            }
        }
        else {
            $(object).css({'border': '1px solid #ff0000'});
            $(errField).text('Поле не должно быть пустым');
        }
    }


    $("#reg_button").click(function () {
        var phone_number_unmasked = phone_number.val().replace(/[()-]+/g, '');
        console.log(phone_number_unmasked);
        $("#reg_block span").each(function () {
            if ($(this).text() !== '<3') {
                test = false;
                return false;
            }
            else {
                test = true;
            }
        });
        if (test === false) {
            console.log("Неверные данные");
            return false;
        } else {
            var jsonform = {
                'first_name': first_name.val(),
                'second_name': second_name.val(),
                'birthday': birthday.val(),
                'passport': passport.val(),
                'driver_license': driver_license.val(),
                'phone': phone_number_unmasked,
                'password': password.val()
            };

            var string = JSON.stringify(jsonform);
            console.log(JSON.stringify(jsonform));
            var xhr = new XMLHttpRequest();
            xhr.open("POST", "http://lupusanay.speckod.ru/registration", true);
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
            };

        }

    });

});


