var $table = $('#table');
var tableData = [{ 'id': 1, 'name': 'Người dùng 1', 'date': '1-1-2019', 'role': 'đọc giả', },
    { 'id': 2, 'name': 'Người dùng 2', 'date': '1-1-2019', 'role': 'phóng viên', },
    { 'id': 3, 'name': 'Người dùng 3', 'date': '18-4-2019', 'role': 'đọc giả', },
    { 'id': 4, 'name': 'Người dùng 4',  'date': '13-7-2019', 'role': 'đọc giả', },
    { 'id': 5, 'name': 'Người dùng 5',  'date': '18-9-2018', 'role': 'biên tập viên', 'category': 'Công nghệ'},
    { 'id': 6, 'name': 'Người dùng 6',  'date': '15-2-2019', 'role': 'đọc giả', },
    { 'id': 7, 'name': 'Người dùng 7',  'date': '5-1-2019', 'role': 'đọc giả', },
    { 'id': 8, 'name': 'Người dùng 8',  'date': '1-2-2018', 'role': 'đọc giả', },
    { 'id': 9, 'name': 'Người dùng 9',  'date': '4-5-2019', 'role': 'biên tập viên', 'category': 'Thế giới'},
    { 'id': 10, 'name': 'Người dùng 10',  'date': '2-8-2019', 'role': 'đọc giả', },
    { 'id': 11, 'name': 'Người dùng 11',  'date': '1-1-2019', 'role': 'đọc giả', },
    { 'id': 12, 'name': 'Người dùng 12',  'date': '15-1-2018', 'role': 'phóng viên', },
    { 'id': 13, 'name': 'Người dùng 13',  'date': '1-52-2019', 'role': 'đọc giả', },
    { 'id': 14, 'name': 'Người dùng 14',  'date': '11-10-2019', 'role': 'phóng viên', },
    { 'id': 15, 'name': 'Người dùng 15',  'date': '25-1-2018', 'role': 'biên tập viên', 'category': 'Sức khỏe'},
    { 'id': 16, 'name': 'Người dùng 16',  'date': '7-3-2019', 'role': 'đọc giả', },
    { 'id': 17, 'name': 'Người dùng 17',  'date': '17-8-2019', 'role': 'đọc giả', },
    { 'id': 18, 'name': 'Người dùng 18',  'date': '2-5-2019', 'role': 'biên tập viên', 'category': 'Giáo dục'},
    { 'id': 19, 'name': 'Người dùng 19',  'date': '12-1-2019', 'role': 'đọc giả', },
    { 'id': 20, 'name': 'Nguyễn Văn A',  'date': '6-6-2019', 'role': 'đọc giả', },
    { 'id': 21, 'name': 'Người dùng 21',  'date': '11-12-2018', 'role': 'đọc giả', }];
const categories = ['thời sự', 'Thế giới', 'Kinh doanh', 'Công nghệ', 'Thể thao', 'Giải trí', 'Sức khỏe', 'Giáo dục'];


$(function () {
    // context menu
    $('#context-menu').hide();

    // side bar
    $('.sidenav-badge').hide();

    // table
    mounted();
});

function getIdSelections() {
    return $.map($table.bootstrapTable('getSelections'), function (row) {
        return row.id;
    });
} 

function categoryFormatter(value, row, index, field) {
    if (row.role.toUpperCase() === 'biên tập viên'.toUpperCase()) {
        var html = [`
            <select class='form-control category-dropdown-menu' style='text-align: center; text-align-last: center;' >
        `];

        for (var i = 0; i < categories.length; i++) {
            html += '<option class="text-capitalize" value=' + categories[i];
            if (value.toUpperCase() === categories[i].toUpperCase()) {
                html += ' selected="selected"';
            }
            html += '>' + categories[i] + '</option>';
        }
        html += '</select>';
        return html;
    }
}

$('.category-dropdown-menu').on('click', function() {
    console.log('test');
});

function initTable() {
    $table.bootstrapTable('destroy').bootstrapTable({
        height: 800,
        locale: 'vi-VN',
        toolbar: '#toolbar',
        pagination: true,
        search: true,
        showPaginationSwitch: true,
        showRefresh: true,
        showToggle: true,
        showColumns: true,
        showFullscreen: true,
        smartDisplay: true,
        clickToSelect: true,
        undefinedText: ' ',
        // extension
        stickyHeader: true,
        stickyHeaderOffsetY: 56,
        showJumpto: true,
        searchAccentNeutralise: true,
        //filter
        filterControl: true,
        filterShowClear: true,

        columns: [{field: 'state', checkbox: true, align: 'center', valign: 'middle', width: '5%', }, 
            { field: 'id', title: 'ID', align: 'center', valign: 'middle', sortable: true,  width: '5%'}, 
            {  field: 'name', title: 'Tên', align: 'center',  valign: 'middle', sortable: true, width: '40%', }, 
            { field: 'date', title: 'Ngày tạo', align: 'center', valign: 'middle', sortable: true, width: '20%', }, 
            { field: 'role', title: 'Vai trò', align: 'center', valign: 'center', sortable: true, width: '15%', filterControl: 'select'},
            { field: 'category', title: 'Chuyên mục', align: 'center', valign: 'center', filterControl: 'select', width: '15%', formatter: categoryFormatter}],
        //data: tableData,
        url: 'load',
        responseHandler: (rows) => {
            rows.forEach(row => {
                row.date = '18-09-2018';
                row.role = 'biên tập viên';
                row.category = 'Công nghệ';
            });

            return rows;
        }
    });
}

$table.on('check.bs.table uncheck.bs.table ' +
    'check-all.bs.table uncheck-all.bs.table',
function () {
    $('#remove').prop('disabled', !$table.bootstrapTable('getSelections').length);
    $('#edit').prop('disabled', $table.bootstrapTable('getSelections').length > 1);

    // save your data, here just save the current page
    var selections = getIdSelections();
    // push or splice the selections if you want to save all data selections
});

$table.on('all.bs.table', function (e, name, args) {
});

$('#remove').click(function () {
    var ids = getIdSelections();
    $table.bootstrapTable('remove', {
        field: 'id',
        values: ids
    });
    $('#remove').prop('disabled', true);
});

$('#add').click(function() {
});
          
function mounted() {
    initTable();
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
    case 'BIÊN TẬP VIÊN':
        $('#assign').show();
        break;

    case 'ĐỌC GIẢ':
        $('#renew').show();
        break;
    default:
    }

    $('#context-menu').show();
    $('#context-menu').offset({left:e.pageX, top:e.pageY});
    e.preventDefault();

    // item click handler
    // remove event handler
    $('#removeItem').click(function (e) {
        console.log('remove clicked');
        
        // $table.bootstrapTable('remove', {
        //     field: 'id',
        //     values: ids
        // });
    });
});

$(document).click( function() {
    $('#context-menu').hide();
});

$('#context-menu').click( function() {
    $('#context-menu').hide();
});

/* Sidebar */
$('#mySidenav a').mouseenter(function() {
    $(this).find('.sidenav-after-icon').hide();
    $(this).find('.sidenav-badge').show();
});

$('#mySidenav a').mouseleave(function() {
    $(this).find('.sidenav-after-icon').show();
    $(this).find('.sidenav-badge').hide();
});