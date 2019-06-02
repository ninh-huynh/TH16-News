$(function () {
    $('#signupForm').validate({
        rules: {
            fullName: 'required',
            email: {
                required: true,
                email: true,
                remote: {
                    url: 'check-email',
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
        errorClass: 'invalid',
        validClass: 'valid',
        highlight: function (element, errorClass, validClass) {
            $(element).addClass('is-invalid').removeClass('is-valid');
        },
        unhighlight: function (element, errorClass, validClass) {
            $(element).addClass('is-valid').removeClass('is-invalid');
        }
    });
    
    //TODO: loginForm, forgotPassForm
});