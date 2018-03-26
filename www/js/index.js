jQuery(document).ready(function () {
    $("#phoneNumber").mask("+7(000)-000-00-00");
    $("#birthday").mask("0000-00-00");

    $("#phoneNumber").blur(function () {

        if ($(this).val().length === 17) {
            $("#phoneNumberErr").text(' ');
            $(this).css({'border': '1px solid #569b44'});
        }
        else {
            $(this).css({'border': '1px solid #ff0000'});
            $("#phoneNumberErr").text('Введен не полный номер');
        }
    });

    $("#birthday").blur(function () {

        if ($(this).val().length === 10) {
            $("#birthdayErr").text(' ');
            $(this).css({'border': '1px solid #569b44'});
        }
        else {
            $(this).css({'border': '1px solid #ff0000'});
            $("#birthdayErr").text('Введена не полная дата');
        }
    });

    $("#firstname").blur(function () {
        if ($(this).val() !== '') {
            var pattern = /^[a-zа-яё]+$/i;
            if (pattern.test($(this).val())) {
                $(this).css({'border': '1px solid #569b44'});
                $("#firstnameErr").text(' ');
            } else {
                $(this).css({'border': '1px solid #ff0000'});
                $("#firstnameErr").text('Не верно');
            }
        }
        else {
            $(this).css({'border': '1px solid #ff0000'});
            $("#firstnameErr").text('Поле имени не должно быть пустым');
        }
    });
    $("#secondname").blur(function () {
        if ($(this).val() !== '') {
            var pattern = /^[a-zа-яё]+$/i;
            if (pattern.test($(this).val())) {
                $(this).css({'border': '1px solid #569b44'});
                $("#secondnameErr").text(' ');
            } else {
                $(this).css({'border': '1px solid #ff0000'});
                $("#secondnameErr").text('Не верно');
            }
        }
        else {
            $(this).css({'border': '1px solid #ff0000'});
            $("#secondnameErr").text('Поле фамилии не должно быть пустым');
        }

    });
    $("#password").blur(function () {
        if ($(this).val() !== '') {
            var pattern = /(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z!@#$%^&*]{6,}/;
            if (pattern.test($(this).val())) {
                $(this).css({'border': '1px solid #569b44'});
                $("#passwordErr").text(' ');
            } else {
                $(this).css({'border': '1px solid #ff0000'});
                $("#passwordErr").text('Не верно');
            }
        }
        else {
            $(this).css({'border': '1px solid #ff0000'});
            $("#passwordErr").text('Поле пароля не должно быть пустым');
        }
    });
    $("#passport").blur(function () {
        if ($(this).val() !== '') {
            var pattern = /\d{10}$/;
            if (pattern.test($(this).val())) {
                $(this).css({'border': '1px solid #569b44'});
                $("#passportErr").text(' ');
            } else {
                $(this).css({'border': '1px solid #ff0000'});
                $("#passportErr").text('Не верно');
            }
        }
        else {
            $(this).css({'border': '1px solid #ff0000'});
            $("#passportErr").text('Поле паспорта не должно быть пустым');
        }
    });
    $("#driverLicense").blur(function () {
        if ($(this).val() !== '') {
            var pattern = /\d{10}$/;
            if (pattern.test($(this).val())) {
                $(this).css({'border': '1px solid #569b44'});
                $("#driverLicenseErr").text(' ');
            } else {
                $(this).css({'border': '1px solid #ff0000'});
                $("#driverLicenseErr").text('Не верно');
            }
        }
        else {
            $(this).css({'border': '1px solid #ff0000'});
            $("#driverLicenseErr").text('Поле водительских прав не должно быть пустым');
        }
    });

});

$("#regButton").click(function () {
    $("#RegBlock span").each(function () {
        if ($(this).text() !== ' ') {
            alert("Неверные данные");
            return false;
        }
        else if (($(this).text() === '') || ($("input:empty").length === '')) {
            alert("Введите данные");
            return false;
        }

        else {
            $("#phoneNumber").unmask();

            var jsonform = {
                'first_name': $("#firstname").val(),
                'second_name': $("#secondname").val(),
                'birthday': $("#birthday").val(),
                'passport': $("#passport").val(),
                'driver_license': $("#driverLicense").val(),
                'phone': "+7"+$("#phoneNumber").val(),
                'password': $("#password").val()
            };
            //alert(JSON.stringify(jsonform)); //DEBUG
            var string = JSON.stringify(jsonform);
            console.log(JSON.stringify(jsonform));
            var xhr = new XMLHttpRequest();
            xhr.open("POST", "http://lupusanay.speckod.ru/registration", true);
            xhr.send(string);
            xhr.onreadystatechange = function () {
                if (xhr.readyState !== 4) return;
                if (xhr.status === 200) {
                    alert("Вы успешно зарегестрировались")
                } else if (xhr.status === 422) {
                    alert("Введены неверные данные");
                } else {
                    alert("Ошибка");
                    alert(xhr.responseText + xhr.status)
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

