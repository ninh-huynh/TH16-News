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