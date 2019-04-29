$(function () {
    $('#header').load('./reuse-html/header.html');
    $('#category-menu').load('./reuse-html/menu-bar.html');
    $('#footer').load('./reuse-html/footer.html');

    $('#context-menu').hide();

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
    var users = [
        {id: '1', name: 'nguyễn văn a', date_created: '1-1-2001', role: 'đọc giả'},
        {id: '2', name: 'nguyễn văn b', date_created: '1-1-2001', role: 'phóng viên'},
        {id: '3', name: 'nguyễn văn c', date_created: '1-1-2001', role: 'đọc giả'},
        {id: '4', name: 'nguyễn văn e', date_created: '1-1-2001', role: 'đọc giả'},
        {id: '5', name: 'nguyễn văn f', date_created: '1-1-2001', role: 'biên tập viên'},
        {id: '6', name: 'nguyễn văn g', date_created: '1-1-2001', role: 'đọc giả'},
        {id: '7', name: 'nguyễn văn h', date_created: '1-1-2001', role: 'đọc giả'},
        {id: '8', name: 'nguyễn văn i', date_created: '1-1-2001', role: 'đọc phóng viên'},
        {id: '9', name: 'nguyễn văn j', date_created: '1-1-2001', role: 'đọc giả'},
        {id: '10', name: 'nguyễn văn k', date_created: '1-1-2001', role: 'phóng viên'},
        {id: '11', name: 'nguyễn văn l', date_created: '1-1-2001', role: 'đọc giả'},
        {id: '12', name: 'nguyễn văn m', date_created: '1-1-2001', role: 'biên tập viên'},
    ];

    for (var i = 0; i < users.length; i++) {
        var user = users[i];
        
        var row = $($('#table-row-template')[0].innerHTML);
        row.find('.user-id').text(user.id);
        row.find('.user-name').text(user.name);
        row.find('.date-created').text(user.date_created);
        row.find('.user-role').text(user.role);
        console.log(row.html());
        
        $('#table-content').append(row);
    }
}