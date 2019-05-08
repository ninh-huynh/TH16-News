/* eslint-disable no-undef */
$(function () {
    $('#header').load('./reuse-html/header.html');
    $('#category-menu').load('./reuse-html/menu-bar.html', () => {

    });
    $('#footer').load('./reuse-html/footer.html');
    $('#comment-btn').click(function () {
        addComment();
    });
});

function addComment() {
    var txtName = $('#txtName').val();
    var txtComment = $('#txtComment').val();
    var currentDate = new Date();

    if (txtName === '') {
        $('#txtName').focus();
        return;
    }

    if (txtComment === '') {
        $('#txtComment').focus();
        return;
    }

    var div_name = $('<div></div>').text(txtName)
        .addClass('font-weight-bold');
    var div_opinion = $('<div></div>').text(txtComment);

    var div_time = $('<div></div>').text(currentDate.toLocaleString())
        .addClass('float-right text-muted');

    var list_group_item = $('<li></li>').append(div_name, div_opinion, div_time)
        .addClass('list-group-item');
    $('#comment-ul').prepend(list_group_item);
}