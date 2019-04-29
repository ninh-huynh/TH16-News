$(function () {
    $('#header').load('./reuse-html/header.html');
    $('#category-menu').load('./reuse-html/menu-bar.html');
    $('#footer').load('./reuse-html/footer.html');

    $('table tbody').bind("contextmenu", 'tr', function(e) {
        $('#context-menu').show();
        $("#context-menu").offset({left:e.pageX, top:e.pageY});
        e.preventDefault();
    });

    $(document).bind("click", function(e) {
        $('#context-menu').hide();
    });
    $('#context-menu').bind("click", function(e) {
        $('#context-menu').hide();
    });

    loadTable();
});

function loadTable() {
    var article_list = [
        {name: 'bài  viết 1', author: 'tác giả 1', publish: "1-1-2001", status: 'Đã xuất bản'},
        {name: 'bài  viết 2', author: 'tác giả 2', publish: "2-2-2002", status: 'Chưa xuất bản'},
        {name: 'bài  viết 3', author: 'tác giả 3', publish: "3-3-2003", status: 'Đã xuất bản'},
        {name: 'bài  viết 4', author: 'tác giả 4', publish: "4-4-2004", status: 'Đã xuất bản'},
        {name: 'bài  viết 5', author: 'tác giả 5', publish: "5-5-2005", status: 'Đã xuất bản'},
        {name: 'bài  viết 6', author: 'tác giả 6', publish: "6-6-2006", status: 'Chưa xuất bản'},
        {name: 'bài  viết 7', author: 'tác giả 7', publish: "7-7-2007", status: 'Đã xuất bản'},
        {name: 'bài  viết 8', author: 'tác giả 8', publish: "8-8-2008", status: 'Đã xuất bản'},
        {name: 'bài  viết 9', author: 'tác giả 9', publish: "9-9-2009", status: 'Đã xuất bản'},
        {name: 'bài  viết 10', author: 'tác giả 10', publish: "10-10-2010", status: 'Đã xuất bản'}
    ]

    for (var i = 0; i < article_list.length; i++) {
        article = article_list[i];

        var row = $($('#table-row-template')[0].innerHTML);
        row.find('.article-name').text(article.name);
        row.find('.article-author').text(article.author);
        row.find('.article-publish').text(article.publish);
        row.find('.article-status').text(article.status);

        row.appendTo('tbody');
    }
}


$('table tbody').on('mouseover', 'tr', function(){
    $(this).find('.visible-on-hover').removeClass('d-none').addClass('d-block');
});

$('table tbody').on('mouseleave', 'tr', function(){
    $(this).find('.visible-on-hover').removeClass('d-block').addClass('d-none');
});