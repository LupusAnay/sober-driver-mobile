$(document).ready(function () {
    let input_fields = {
        first_name: $("#first_name"),
        second_name: $("#second_name"),
        driver_license: $("#driver_license"),
        phone_number: $("#phone_number"),
        birthday: $("#birthday"),
        passport: $("#passport"),
        password: $("#password")
    };
    input_fields.driver_license.mask("0000000000");
    input_fields.passport.mask("0000000000");
    input_fields.birthday.mask("0000-00-00");
    input_fields.phone_number.mask("+7(000)-000-00-00");

    input_fields.first_name.reg_exp = /^[A-zА-я]+$/;
    input_fields.first_name.err_field = $("#first_name_err");

    input_fields.second_name.reg_exp = /^[A-zА-я]+$/;
    input_fields.second_name.err_field = $("#second_name_err");

    input_fields.phone_number.reg_exp = /[0-9+\-)(]{17}/;
    input_fields.phone_number.err_field = $("#phone_number_err");

    input_fields.birthday.reg_exp = /[0-9+\-]{10}/;
    input_fields.birthday.err_field = $("#birthday_err");

    input_fields.password.reg_exp = /(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z!@#$%^&*]{6,}/;
    input_fields.password.err_field = $("#password_err");

    input_fields.passport.reg_exp = /\d{10}/;
    input_fields.passport.err_field = $("#passport_err");

    input_fields.driver_license.reg_exp = /\d{10}/;
    input_fields.driver_license.err_field = $("#driver_license_err");

    for (let item in input_fields) {
        let keyup_hanlder = {
            it: item,
            fields: input_fields,
            handler: function () {
                //console.log("handler");
                if (this.fields[this.it].val() !== '') {
                    if (this.fields[this.it].reg_exp.test(this.fields[this.it].val())) {
                        this.fields[this.it].css({'border': '1px solid #569b44'});
                        this.fields[this.it].err_field.text('');
                    } else {
                        this.fields[this.it].css({'border': '1px solid #ff0000'});
                        this.fields[this.it].err_field.text('Данные не соответствуют валидации');
                    }
                } else {
                    this.fields[this.it].css({'border': '1px solid #ff0000'});
                    this.fields[this.it].err_field.text('Поле не должно быть пустым');
                }
            }
        };
        input_fields[item].on("keyup", $.proxy(keyup_hanlder, "handler"));
        input_fields[item].on("blur", $.proxy(keyup_hanlder, "handler"));
    }

    $("#reg_button").click(function () {
        let phone_number_unmasked = input_fields.phone_number.val().replace(/[()-]+/g, '');
        let is_validated = true;
        console.log("\nRegister was clicked, starting validation...");
        for (let item in input_fields) {
            if (!input_fields[item].reg_exp.test(input_fields[item].val())) {
                console.log(item, ": \"", input_fields[item].val(), "\" is incorrect");
                input_fields[item].css({'border': '1px solid #ff0000'});
                input_fields[item].err_field.text('Данные не соответствуют валидации');
                is_validated = false;
            } else if (input_fields[item].val() === '') {
                console.log(item, ": \"", input_fields[item].val(), "\" is empty");
                input_fields[item].css({'border': '1px solid #ff0000'});
                input_fields[item].err_field.text('Поле не должно быть пустым');
                is_validated = false
            } else {
                console.log(item, ": \"", input_fields[item].val(), "\" is okay");
                input_fields[item].css({'border': '1px solid #569b44'});
                input_fields[item].err_field.text('');
            }
        }
        if (is_validated) {
            let jsonform = {
                'first_name': input_fields.first_name.val(),
                'second_name': input_fields.second_name.val(),
                'birthday': input_fields.birthday.val(),
                'passport': input_fields.passport.val(),
                'driver_license': input_fields.driver_license.val(),
                'phone': phone_number_unmasked,
                'password': input_fields.password.val()
            };

            let string = JSON.stringify(jsonform);
            console.log(JSON.stringify(jsonform));
            let xhr = new XMLHttpRequest();
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

