/* eslint-disable no-undef */
$(function () {
    $('#header').load('./reuse-html/header.html');
    $('#category-menu').load('./reuse-html/menu-bar.html', () => {
        $('#home').addClass('active');
    });
    $('#footer').load('./reuse-html/footer.html');
});