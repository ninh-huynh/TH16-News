const fChangePassValidateOption = {
    rules: {
        newPass: {
            required: true,
            minlength: 5,
        },
        retypeNewPass: {
            required: true,
            equalTo: '#fReset-newPass',
        },
    },
    messages: {
        newPass: {
            required: 'Mật khẩu mới không được trống',
            minlength: 'Mật khẩu phải có độ dài từ 5 kí tự',
        },
        retypeNewPass: {
            equalTo: 'Mật khẩu không trùng khớp',
        },
    },
    errorElement: 'em',

    errorPlacement: function (error, element) {
        // Add the `invalid-feedback` class to the error element
        error.addClass('invalid-feedback');
        if (element.prop('type') === 'checkbox') {
            error.insertAfter(element.next('label'));
        } else {
            error.insertAfter(element);
        }
    },
    highlight: function (element, errorClass, validClass) {
        $(element).addClass('is-invalid').removeClass('is-valid');
    },
    unhighlight: function (element, errorClass, validClass) {
        $(element).addClass('is-valid').removeClass('is-invalid');
    },
};

$(function () {
    $('#changePasswordForm').validate(fChangePassValidateOption);
});