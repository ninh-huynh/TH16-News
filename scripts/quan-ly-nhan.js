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
    var nTag = 15;

    for (var i = 0; i < nTag; i++) {
        
        var row = $($('#table-row-template')[0].innerHTML);
        row.find('.tag-name').text('tag ' + (i + 1));
        console.log(row.html());
        $('#table-content').append(row);
    }
}