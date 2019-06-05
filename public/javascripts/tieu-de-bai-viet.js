$(function () {
    var isGuest = true;
    $('#comment-btn').click(function () {
        addComment();
    });

    if (isGuest) {
        $('[data-toggle="tooltip"]').tooltip();
    }
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

    var div_time = $('<div></div>').text(moment(currentDate).format('HH:mm DD-MM-YYYY'))
        .addClass('float-right text-muted');

    var list_group_item = $('<li></li>').append(div_name, div_opinion, div_time)
        .addClass('list-group-item');
    $('#comment-ul').prepend(list_group_item);
}