let to = $('#to');
let from = $('#from');
let input_fields = {
    first_name: $('#first_name'),
    phone_number: $('#phone_number'),
    value: $('#value')
};

input_fields.phone_number.mask('+7(000)-000-00-00');

input_fields.first_name.reg_exp = /^[A-zА-я\s]+$/;
input_fields.first_name.err_field = $('#first_name_err');

input_fields.phone_number.reg_exp = /[0-9+\-)(]{17}/;
input_fields.phone_number.err_field = $('#phone_number_err');

input_fields.value.reg_exp = /[0-9]/;
input_fields.value.err_field = $('#value_err');

$.each(input_fields, function (item) {
    input_fields[item].on('keyup', validate.bind(null, item));
    input_fields[item].on('blur', validate.bind(null, item));
});

$('#create_order').click(function () {
    let validated = true;
    $.each(input_fields, function (i) {
        if (!validate(i)) validated = false;
    });

    if (validated) {
        let event_counter = 2;
        let fromCords, toCords;
        geoDecoder(function (result) {
            fromCords = result;
            request_ready();
        }, from.val());
        geoDecoder(function (result) {
            toCords = result;
            request_ready();
        }, to.val());

        function request_ready() {
            if (--event_counter !== 0) return false;
            let json_form = {
                'from': fromCords.replace(' ', ', '),
                'to': toCords.replace(' ', ', '),
                'value': input_fields.value.val(),
                'client_name': input_fields.first_name.val(),
                'client_number': input_fields.phone_number.val().replace(/[()-]+/g, '')
            };
            $.ajax({
                url: 'http://lupusanay.speckod.ru/addOrder',
                type: 'POST',
                data: JSON.stringify(json_form),
                success: function () {
                    location.href = 'order_status.html'
                },
                error: function (data) {
                    navigator.notification.alert(data.responseJSON.what, null, 'Ошибка', 'Ясно');
                }
            });
        }
    }
});

function geoDecoder(handler, data) {
    $.get('https://geocode-maps.yandex.ru/1.x/', {format: 'json', geocode: data})
        .done(function (data) {
            let result = data.response.GeoObjectCollection.featureMember[0].GeoObject.Point.pos;
            handler(result);
        });
}

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
