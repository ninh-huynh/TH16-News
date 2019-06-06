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

    var postURL = window.location.pathname.concat('/comment');
    var comment = {
        readerName: txtName,
        content: txtComment,
        date: moment(currentDate).format('YYYY-MM-DD HH:mm:ss'),
        articleTitle: window.location.pathname.substr(1)
    };

    new Promise((resolve, reject) => {
        $.post(postURL, comment,
            function (data, textStatus, jqXHR) {
                if (textStatus === 'success')
                    resolve(textStatus);
                else
                    reject(data);
            }
        );
    })
        .then(result => {
            var div_name = $('<div></div>').text(txtName)
                .addClass('font-weight-bold');
            var div_opinion = $('<div></div>').text(txtComment);

            var div_time = $('<div></div>').text(moment(currentDate).format('HH:mm DD-MM-YYYY'))
                .addClass('float-right text-muted');

            var list_group_item = $('<li></li>').append(div_name, div_opinion, div_time)
                .addClass('list-group-item');
            $('#comment-ul').prepend(list_group_item);
        })
        .catch(err => {
            // err: MySQL error
            
            $('#my-alert').removeClass('d-none');
            $('#alert-message').text(err.code);
        });
}