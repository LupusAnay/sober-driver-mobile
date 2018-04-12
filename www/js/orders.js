$(document).ready(function () {
    var to = $("#to");
    var from = $("#from");
    var input_fields = {
        first_name: $("#first_name"),
        phone_number: $("#phone_number"),
        value: $("#value")
    };
    input_fields.phone_number.mask("+7(000)-000-00-00");

    input_fields.first_name.reg_exp = /^[A-zА-я\s]+$/;
    input_fields.first_name.err_field = $("#first_name_err");

    input_fields.phone_number.reg_exp = /[0-9+\-)(]{17}/;
    input_fields.phone_number.err_field = $("#phone_number_err");

    input_fields.value.reg_exp = /[0-9]/;
    input_fields.value.err_field = $("#value_err");

    for (var item in input_fields) {
        var keyup_hanlder = {
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

    $("#create_order").click(function () {
            var phone_number_unmasked = input_fields.phone_number.val().replace(/[()-]+/g, '');
            var is_validated = true;
            console.log("\nButton was clicked, starting validation...");
            for (var item in input_fields) {
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

                var xhr = new XMLHttpRequest();
                xhr.open("GET", "https://geocode-maps.yandex.ru/1.x/?format=json&geocode=%D0%9C%D0%BE%D1%81%D0%BA%D0%B2%D0%B0,+%D0%A2%D0%B2%D0%B5%D1%80%D1%81%D0%BA%D0%B0%D1%8F+%D1%83%D0%BB%D0%B8%D1%86%D0%B0,+%D0%B4%D0%BE%D0%BC+7", true);
                xhr.send();
                xhr.onreadystatechange = function () {
                    parsed=xhr.responseText;
                    console.warn(parsed);
                    console.log(parsed.response.GeoObjectCollection.featureMember[0].GeoObject.Point.pos);
                };
                var jsonform = {
                    'from': '1',
                    'to': '1',
                    'value': input_fields.value.val(),
                    'client_name': input_fields.first_name.val(),
                    'client_number': phone_number_unmasked
                };

                var string = JSON.stringify(jsonform);
                console.log(JSON.stringify(jsonform));
                var xhr = new XMLHttpRequest();
                xhr.open("POST", "http://lupusanay.speckod.ru/addOrder", true);
                xhr.send(string);
                xhr.onreadystatechange = function () {
                    if (xhr.readyState !== 4) return;
                    if (xhr.status === 200) {
                        console.log("Вы успешно добавили заказ")
                    } else if (xhr.status === 422) {
                        console.log("Введены неверные данные");
                        console.log(xhr.responseText + xhr.status)
                    } else {
                        console.log("Ошибка");
                        console.log(xhr.responseText + xhr.status)
                    }

                }

            }
        }
    );
});