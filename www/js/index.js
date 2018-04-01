$(document).ready(function () {
    var input_fields = {
        first_name: $("#first_name"),
        second_name: $("#second_name"),
        driver_license: $("#driver_license"),
        phone_number: $("#phone_number"),
        birthday: $("#birthday"),
        passport: $("#passport"),
        password: $("#password")
    };
    input_fields.phone_number.mask("+7(000)-000-00-00");
    input_fields.birthday.mask("0000-00-00");

    input_fields.phone_number.reg_exp = /[0-9+\-)(]{17}/g;
    input_fields.phone_number.err_field = $("#phone_number_err");
    input_fields.birthday.reg_exp = /[0-9+\-]{10}/g;
    input_fields.birthday.err_field = $("#birthday_err");
    input_fields.first_name.reg_exp = /[A-zА-я]/g;
    input_fields.first_name.err_field = $("#first_name_err");
    input_fields.second_name.reg_exp = /[A-zА-я]/g;
    input_fields.second_name.err_field = $("#second_name_err");
    input_fields.password.reg_exp = /(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z!@#$%^&*]{6,}/g;
    input_fields.password.err_field = $("#password_err");
    input_fields.passport.reg_exp = /\d{10}/g;
    input_fields.passport.err_field = $("#passport_err");
    input_fields.driver_license.reg_exp = /\d{10}/g;
    input_fields.driver_license.err_field = $("#driver_license_err");

    // function validate(object, pattern, errField) {
    //     if ($(object).val() !== '') {
    //         if (pattern !== 0) {
    //             {
    //                 if (pattern.test($(object).val())) {
    //                     $(object).css({'border': '1px solid #569b44'});
    //                     return true;
    //                 } else {
    //                     $(object).css({'border': '1px solid #ff0000'});
    //                     $(errField).text('Данные не соответствуют валидации');
    //                     return false;
    //                 }
    //             }
    //         }
    //     }
    //     else {
    //         $(object).css({'border': '1px solid #ff0000'});
    //         $(errField).text('Поле не должно быть пустым');
    //         return false;
    //     }
    // }

    for (var item in input_fields) {
        var keyup_hanlder = {
            it: item,
            fields: input_fields,
            handler: function () {
                //console.log("handler");
                if (this.fields[this.it].val() !== '') {
                    console.log(this.fields[this.it].reg_exp.test(this.fields[this.it].val()));
                    console.log(this.fields[this.it].val());
                    console.log(this.fields[this.it].reg_exp);
                    if (this.fields[this.it].reg_exp.test(this.fields[this.it].val())) {
                        this.fields[this.it].css({'border': '1px solid #569b44'});
                        this.fields[this.it].err_field.text('');
                    }
                } else {
                    this.fields[this.it].css({'border': '1px solid #ff0000'});
                    this.fields[this.it].err_field.text('Поле не должно быть пустым');
                }
            }
        };
        input_fields[item].on("keyup", $.proxy(keyup_hanlder, "handler"));
    }

    $("#reg_button").click(function () {
        var phone_number_unmasked = input_fields.phone_number.val().replace(/[()-]+/g, '');
        console.log(input_fields);
        for (var item in input_fields) {
            if (input_fields[item].val() === '') {
                input_fields[item].css({'border': '1px solid #ff0000'});
                input_fields[item].err_field.text('Поле не должно быть пустым');
            } else if (input_fields[item].reg_exp.test(input_fields[item].val())) {
                input_fields[item].css({'border': '1px solid #569b44'});
            } else {
                input_fields[item].css({'border': '1px solid #ff0000'});
                input_fields[item].err_field.text('Данные не соответствуют валидации');
            }
        }
        // $("#reg_block input").each(function () {
        //     if(!this.val().match())
        //     console.log(this);
        //     console.log(validate(this, this.reg_exp, this.err_field));
        // var jsonform = {
        //     'first_name': first_name.val(),
        //     'second_name': second_name.val(),
        //     'birthday': birthday.val(),
        //     'passport': passport.val(),
        //     'driver_license': driver_license.val(),
        //     'phone': phone_number_unmasked,
        //     'password': password.val()
        // };
        //
        // var string = JSON.stringify(jsonform);
        // console.log(JSON.stringify(jsonform));
        // var xhr = new XMLHttpRequest();
        // xhr.open("POST", "http://lupusanay.speckod.ru/registration", true);
        // xhr.send(string);
        // alert(string);
        // xhr.onreadystatechange = function () {
        //     if (xhr.readyState !== 4) return;
        //     if (xhr.status === 200) {
        //         console.log("Вы успешно зарегестрировались")
        //     } else if (xhr.status === 422) {
        //         console.log("Введены неверные данные");
        //         console.log(xhr.responseText + xhr.status)
        //     } else {
        //         console.log("Ошибка");
        //         console.log(xhr.responseText + xhr.status)
        //     }
        // };

    });
});

