/* eslint-disable no-undef */
$(function () {
    $('#header').load('./reuse-html/header.html');
    $('#category-menu').load('./reuse-html/menu-bar.html', () => {
        $('#the-gioi').addClass('active');
    });
    $('#footer').load('./reuse-html/footer.html');
});