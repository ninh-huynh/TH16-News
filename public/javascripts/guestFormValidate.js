$(function () {
    $('#signupForm').validate({
        rules: {
            fullName: 'required',
            email: {
                required: true,
                email: true,
                remote: {
                    url: 'check-email-available',
                    type: 'post',
                    data: {
                        email: function () {
                            return $('#signupEmail').val();
                        }
                    }
                }
            },
            newPass: {
                required: true
            }
        },
        messages: {
            fullName: 'Hãy nhập đầy đủ họ và tên',
            email: {
                required: 'Hãy nhập địa chỉ email của bạn',
                email: 'Email không hợp lệ',
                remote: 'Email đã được sử dụng'
            },
            newPass: {
                required: 'Nhập mật khẩu của bạn'
            }
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
    });
    
    //TODO: loginForm, forgotPassForm

    $('#loginForm').validate({
        rules: {
            email: {
                required: true,
                email: true
            },
            password: {
                required: true,
                minlength: 5
            }
        },
        messages: {
            email: {
                required: 'Hãy nhập địa chỉ email của bạn',
                email: 'Email không hợp lệ',
            },

            password: {
                required: 'Hãy nhập mật khẩu',
                minlength: 'Mật khẩu phải có độ dài từ 5 kí tự'
            }
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
        submitHandler: function(form) {
            var data = $(form).serialize();
            $.post('/account/login/', data, function (result) {
                $('#alert-container').append(result);
                setTimeout(() => $('.alert').alert('close'), 2000);
                if ($(result).hasClass('success')) {
                    $('#loginModal').modal('toggle');
                }
            });
        }
    });

    $('#forgotPassForm').validate({
        rules: {
            email: {
                required: true,
                email: true,
                remote: {
                    url: 'check-email-exists',
                    type: 'post',
                    data: {
                        email: function () {
                            return $('#resetAccEmail').val();
                        }
                    }
                }
            },
        },
        messages: {
            email: {
                required: 'Hãy nhập địa chỉ email của bạn',
                email: 'Email không hợp lệ',
                remote: 'Email không tồn tại'
            },
        },
        errorClass: 'invalid',
        validClass: 'valid',
        highlight: function (element, errorClass, validClass) {
            $(element).addClass('is-invalid').removeClass('is-valid');
        },
        unhighlight: function (element, errorClass, validClass) {
            $(element).addClass('is-valid').removeClass('is-invalid');
        }
    });
});