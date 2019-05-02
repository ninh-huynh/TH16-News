var $table = $('#table');
var $remove = $('#remove');
var $add = $('#add');
var selections = [];

$(function () {
    $('#header').load('./reuse-html/header.html');
    $('#category-menu').load('./reuse-html/menu-bar.html');
    $('#footer').load('./reuse-html/footer.html');
    $('#context-menu').hide();

    $('.sidenav-badge').hide();

    mounted();
});

function getIdSelections() {
    return $.map($table.bootstrapTable('getSelections'), function (row) {
        return row.id
    })
} 

function detailFormatter(index, row) {
    var html = []
    var header = $table.find('thead');

    $.each(row, function (key, value) {
        if (key === 'state') {
            return true;
        }

      html.push('<p><b>' + header.find('[data-field=' + key + ']').text() + ':</b> ' + value + '</p>')
    })
    return html.join('')
  }

function initTable() {
    $table.bootstrapTable('destroy').bootstrapTable({
    height: 800,
    locale: 'vi-VN',
    pagination: true,
    search: true,
    showPaginationSwitch: true,
    showRefresh: true,
    showToggle: true,
    showColumns: true,
    showFullscreen: true,
    smartDisplay: true,
    detailView: true,
    detailFormatter: detailFormatter,

    clickToSelect: true,
    

    columns: [{field: 'state', checkbox: true, align: 'center', valign: 'middle', }, 
            { field: 'id', title: 'ID', align: 'center', valign: 'middle', sortable: true,  }, 
            {  field: 'name', title: 'Tên', align: 'center',  valign: 'middle', sortable: true, }, 
            { field: 'date', title: 'Ngày tạo', align: 'center', valign: 'middle', sortable: true,  }, 
            { field: 'role', title: 'Vai trò', align: 'center', valign: 'center', }],
        data: [{ "id": 1, "name": "Người dùng 1", "date": "1-1-2000", 'role': 'đọc giả',  },
            { "id": 2, "name": "Người dùng 2", "date": "1-1-1998", 'role': 'phóng viên', },
            { "id": 3, "name": "Người dùng 3", "date": "18-4-2015", 'role': 'đọc giả', },
            { "id": 4, "name": "Người dùng 4",  "date": "13-7-1986", 'role': 'đọc giả', },
            { "id": 5, "name": "Người dùng 5",  "date": "18-9-1985", 'role': 'biên tập viên', },
            { "id": 6, "name": "Người dùng 6",  "date": "15-2-2015", 'role': 'đọc giả', },
            { "id": 7, "name": "Người dùng 7",  "date": "5-1-1995", 'role': 'đọc giả', },
            { "id": 8, "name": "Người dùng 8",  "date": "1-2-1989", 'role': 'đọc giả', },
            { "id": 9, "name": "Người dùng 9",  "date": "1-1-1992", 'role': 'biên tập viên', },
            { "id": 10, "name": "Người dùng 10",  "date": "2-8-1970", 'role': 'đọc giả', },
            { "id": 11, "name": "Người dùng 11",  "date": "1-1-2000", 'role': 'đọc giả', },
            { "id": 12, "name": "Người dùng 12",  "date": "15-1-1999", 'role': 'phóng viên', },
            { "id": 13, "name": "Người dùng 13",  "date": "1-52-2000", 'role': 'đọc giả', },
            { "id": 14, "name": "Người dùng 14",  "date": "11-10-1988", 'role': 'phóng viên', },
            { "id": 15, "name": "Người dùng 15",  "date": "25-1-1991", 'role': 'biên tập viên', },
            { "id": 16, "name": "Người dùng 16",  "date": "7-3-1976", 'role': 'đọc giả', },
            { "id": 17, "name": "Người dùng 17",  "date": "17-8-2000", 'role': 'đọc giả', },
            { "id": 18, "name": "Người dùng 18",  "date": "2-5-2000", 'role': 'biên tập viên', },
            { "id": 19, "name": "Người dùng 19",  "date": "12-1-1998", 'role': 'đọc giả', },
            { "id": 20, "name": "Người dùng 20",  "date": "11-12-1999", 'role': 'đọc giả', }]

        })
    }

    $table.on('check.bs.table uncheck.bs.table ' +
    'check-all.bs.table uncheck-all.bs.table',
    function () {
    $remove.prop('disabled', !$table.bootstrapTable('getSelections').length);
    $add.prop('disabled', $table.bootstrapTable('getSelections').length > 1);

    // save your data, here just save the current page
    selections = getIdSelections()
    // push or splice the selections if you want to save all data selections
})

$table.on('all.bs.table', function (e, name, args) {
    //console.log(name, args)
})

$table.on('click-row.bs.table', function(e, row, $element, field) {
    var header = $table.find('thead');
    console.log(header.find('[data-field="date"'));
})

// $table.on('dbl-click-row.bs.table', function(e, row, $element, field) {

// });

$remove.click(function () {
    var ids = getIdSelections()
    $table.bootstrapTable('remove', {
        field: 'id',
        values: ids
    })
    $remove.prop('disabled', true)
})
          
function mounted() {
    initTable()
}

// context-menu event (row clicking)
$('#table').on('contextmenu', 'tr',  function(e) {
    let dataIndex = parseInt($(this).attr('data-index'), 10);
    let row = $table.bootstrapTable('getData', true)[dataIndex];
    let ids;

    ids = getIdSelections();
    if (ids.length === 0) {
        ids = [row.id, ];
    }

    $('#assign').hide();
    $('#renew').hide();
    switch(row.role.toUpperCase()) {
        case "BIÊN TẬP VIÊN":
            $('#assign').show();
            break;

        case "ĐỌC GIẢ":
            $('#renew').show();
            break;
        default:
    }

    $('#context-menu').show();
    $("#context-menu").offset({left:e.pageX, top:e.pageY});
    e.preventDefault();

    // item click handler

    // remove event handler
    $('#removeItem').click( function(e) {
        $table.bootstrapTable('remove', {
            field: 'id',
            values: ids
        })
    });
});

$(document).click( function() {
    $('#context-menu').hide();
});

$('#context-menu').click( function() {
    $('#context-menu').hide();
});

$('#mySidenav a').mouseenter(function() {
    $(this).find('.sidenav-after-icon').hide();
    $(this).find('.sidenav-badge').show();

    console.log($(this).find('i'));
    console.log($(this).find('span'));
});

$('#mySidenav a').mouseleave(function() {
    $(this).find('.sidenav-after-icon').show();
    $(this).find('.sidenav-badge').hide();

    console.log($(this).find('i'));
    console.log($(this).find('span'));
});