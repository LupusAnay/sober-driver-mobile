$(document).ready(function () {
    let to = $("#to");
    let from = $("#from");
    let input_fields = {
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

    $("#create_order").click(function () {
            let phone_number_unmasked = input_fields.phone_number.val().replace(/[()-]+/g, '');
            let is_validated = true;
            console.log("\nButton was clicked, starting validation...");
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

                let event_counter = 2;
                let xhrfrom = new XMLHttpRequest();
                xhrfrom.open("GET", "https://geocode-maps.yandex.ru/1.x/?format=json&geocode=" + from.val(), true);
                xhrfrom.send();
                let fromCords, toCords;
                xhrfrom.onreadystatechange = function () {
                    if (xhrfrom.readyState !== 4) return;
                    parsed = JSON.parse(xhrfrom.responseText);
                    console.warn(parsed);
                    fromCords = parsed.response.GeoObjectCollection.featureMember[0].GeoObject.Point.pos;
                    request_ready();
                };

                let xhrto = new XMLHttpRequest();
                xhrto.open("GET", "https://geocode-maps.yandex.ru/1.x/?format=json&geocode=" + to.val(), true);
                xhrto.send();
                xhrto.onreadystatechange = function () {
                    if (xhrto.readyState !== 4) return;
                    parsed = JSON.parse(xhrto.responseText);
                    toCords = parsed.response.GeoObjectCollection.featureMember[0].GeoObject.Point.pos;
                    request_ready();
                };

                function request_ready() {
                    if (--event_counter !== 0) return false;
                    console.log(fromCords, toCords);
                    let jsonform = {
                        'from': fromCords.replace(" ", ", "),
                        'to': toCords.replace(" ", ", "),
                        'value': input_fields.value.val(),
                        'client_name': input_fields.first_name.val(),
                        'client_number': phone_number_unmasked
                    };

                    let string = JSON.stringify(jsonform);
                    console.log(JSON.stringify(jsonform));
                    let xhr = new XMLHttpRequest();
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
                    };
                }
            }
        }
    );
});