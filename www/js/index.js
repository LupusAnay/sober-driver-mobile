$(document).ready(function () {
    var phone_number = $("#phone_number");
    var birthday = $("#birthday");
    phone_number.mask("+7(000)-000-00-00");
    birthday.mask("0000-00-00");
    var firstname = $("#first_name");
    var secondname = $("#second_name");
    var password = $("#password");
    var passport = $("#passport");
    var driverlicense = $("#driver_license");
    var test = true;

    phone_number.blur(function () {
        validate(this, /[0-9+\-)(]{17}$/, $("#phone_number_err"))
    });
    birthday.blur(function () {
        validate(this, /[0-9+\-]{10}$/, $("#birthday_err"))
    });
    firstname.blur(function () {
    validate(this, /^[a-zа-яё]+$/i, $("#first_name_err"))
    });
    secondname.blur(function () {
        validate(this, /^[a-zа-яё]+$/i, $("#second_name_err"))
    });
    password.blur(function () {
        validate(this, /(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z!@#$%^&*]{6,}/, $("#password_err"))
    });
    passport.blur(function () {
        validate(this, /\d{10}$/, $("#passport_err"))
    });
    driverlicense.blur(function () {
        validate(this, /\d{10}$/, $("#driver_license_err")) //При вызове ф-ии куда возвращает return???:??
    });


    function validate(object, pattern, errField) {
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
        }
        else {
            $(object).css({'border': '1px solid #ff0000'});
            $(errField).text('Поле не должно быть пустым');
        }
    }


    $("#reg_button").click(function () {
        var phonenumber_unmasked = phone_number.val().replace(/[()-]+/g, '');
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
                'first_name': firstname.val(),
                'second_name': secondname.val(),
                'birthday': birthday.val(),
                'passport': passport.val(),
                'driver_license': driverlicense.val(),
                'phone': phonenumber_unmasked,
                'password': password.val()
            };

            var string = JSON.stringify(jsonform);
            console.log(JSON.stringify(jsonform));
            var xhr = new XMLHttpRequest();
            xhr.open("POST", "http://lupusanay.speckod.ru/registration", true);
            xhr.send(string);
            alert(string);
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


