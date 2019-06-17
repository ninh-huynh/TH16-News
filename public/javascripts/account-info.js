
const datePickerOption = {
    todayBtn: 'linked',
    clearBtn: true,
    language: 'vi',
    autoclose: true,
    orientation: 'bottom auto',
    todayHighlight: true
};

const fUpdateValidateOption = {
    rules: {
        name: 'required',
        email: {
            required: true,
            email: true,
            remote: {
                url: '/check-email-available',
                type: 'post',
                data: {
                    email: function () {
                        return $('#email').val();
                    }
                }
            }
        },
    },
    messages: {
        name: 'Hãy nhập đầy đủ họ và tên',
        email: {
            required: 'Hãy nhập địa chỉ email',
            email: 'Email không hợp lệ',
            remote: 'Email đã được sử dụng'
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

const fChangePassValidateOption = {
    rules: {
        password: {
            required: true,
            minlength: 5,
            remote: {
                url: '/check-password',
                type: 'post',
                data: {
                    password: function () {
                        return $('#currentPass').val();
                    }
                }
            }
        },
        newPass: {
            required: true,
            minlength: 5,
        },
        retypeNewPass: {
            required: true,
            equalTo: '#newPass',
        },
    },
    messages: {
        password: {
            required: 'Chưa nhập mật khẩu',
            minlength: 'Mật khẩu phải có độ dài từ 5 kí tự',
            remote: 'Mật khẩu không chính xác'
        },
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

$('#tab-button-list > button').click(function (e) { 
    $('#tab-button-list > button').toggleClass('active');
    $('#form-section > form').toggleClass('d-none');
});

$(function () {
    $('#txtBirthday').datepicker(datePickerOption);
    $('#accountForm').validate(fUpdateValidateOption);
    $('#changePasswordForm').validate(fChangePassValidateOption);
});