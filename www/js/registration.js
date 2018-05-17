//TODO сделать рефакторинг кода
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

$.each(input_fields, function (item) {
    input_fields[item].on('keyup', validate.bind(null, item));
    input_fields[item].on('blur', validate.bind(null, item));
});

$('#reg_button').click(function () {
    let validated = true;
    $.each(input_fields, function (i) {
        if (!validate(i)) validated = false;
    });

    if (validated) {
        let json_form = {
            'first_name': input_fields.first_name.val(),
            'second_name': input_fields.second_name.val(),
            'birthday': input_fields.birthday.val(),
            'passport': input_fields.passport.val(),
            'driver_license': input_fields.driver_license.val(),
            'phone': input_fields.phone_number.val().replace(/[()-]+/g, ''),
            'password': input_fields.password.val()
        };
        $.ajax({
            url: 'http://lupusanay.speckod.ru/registration',
            type: 'POST',
            data: JSON.stringify(json_form),
            success: function () {
                location.href = 'list_of_orders.html'
            },
            error: function (data) {
                navigator.notification.alert(data.responseJSON.what, null, 'Ошибка', 'Ясно');
            }
        });
    }
});

function validate(item) {
    let is_validated = true;

    if (!input_fields[item].reg_exp.test(input_fields[item].val())) {
        input_fields[item].css({'border': '1px solid #ff0000'});
        input_fields[item].err_field.text('Данные не соответствуют валидации');
        is_validated = false;
    } else if (input_fields[item].val() === '') {
        input_fields[item].css({'border': '1px solid #ff0000'});
        input_fields[item].err_field.text('Поле не должно быть пустым');
        is_validated = false
    } else {
        input_fields[item].css({'border': '1px solid #569b44'});
        input_fields[item].err_field.text('');
    }

    return is_validated;
}
