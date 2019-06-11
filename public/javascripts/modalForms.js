$('#sign-up-now').click(function (e) {
    e.preventDefault();
    $('#loginModal').modal('toggle');
    $('#signupModal').modal('toggle');
});

$('#login-now').click(function (e) {
    e.preventDefault();
    $('#loginModal').modal('toggle');
    $('#signupModal').modal('toggle');
});

$('#forgot-pass').click(function (e) {
    e.preventDefault();
    $('#loginModal').modal('toggle');
    $('#forgotpassModal').modal('toggle');
});

const datePickerOption = {
    todayBtn: 'linked',
    clearBtn: true,
    language: 'vi',
    autoclose: true,
    orientation: 'bottom auto',
    todayHighlight: true
};

$(function () {
    $('#txtBirthday').datepicker(datePickerOption);

});