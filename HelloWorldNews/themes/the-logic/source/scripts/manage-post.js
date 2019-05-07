const ARTICLE_STATUS = {
    published : {
        label: 'đã xuất bản',
        color: 'limegreen',
    },
    pending_publish: {
        label: 'đã được duyệt & chờ xuất bản',
        color: 'orange',
    }
}

var $table = $('#table');
var tableData = [
    {id: 1, article: {title: 'bài  viết 1', href: '#' }, author: 'tác giả 1', publish_date: "1-1-2019", status: 'Đã xuất bản'},
    {id: 2, article: {title: 'bài  viết 2', href: '#' }, author: 'tác giả 2', publish_date: "", status: 'Đã được duyệt & chờ xuất bản'},
    {id: 3, article: {title: 'bài  viết 3', href: 'https://mp3.zing.vn' }, author: 'tác giả 3', publish_date: "3-3-2019", status: 'Đã xuất bản'},
    {id: 4, article: {title: 'bài  viết 4', href: 'https://mp3.zing.vn' }, author: 'tác giả 4', publish_date: "4-4-2019", status: 'Đã xuất bản'},
    {id: 5, article: {title: 'bài  viết 5', href: 'https://mp3.zing.vn' }, author: 'tác giả 5', publish_date: "", status: 'Đã được duyệt & chờ xuất bản'},
    {id: 6, article: {title: 'bài  viết 6', href: 'https://mp3.zing.vn' }, author: 'tác giả 6', publish_date: "", status: 'Đã được duyệt & chờ xuất bản'},
    {id: 7, article: {title: 'bài  viết 7', href: 'https://mp3.zing.vn' }, author: 'tác giả 7', publish_date: "7-7-2019", status: 'Đã xuất bản'},
    {id: 8, article: {title: 'bài  viết 8', href: 'https://mp3.zing.vn' }, author: 'tác giả 8', publish_date: "", status: 'Đã được duyệt & chờ xuất bản'},
    {id: 9, article: {title: 'bài  viết 9', href: 'https://mp3.zing.vn' }, author: 'tác giả 9', publish_date: "9-9-2019", status: 'Đã xuất bản'},
    {id: 10, article: {title: 'bài  viết 10', href: 'https://mp3.zing.vn' }, author: 'tác giả 10', publish_date: "10-10-2019", status: 'Đã xuất bản'}
];

var statuses = ['đã xuất bản', 'đã được duyệt & chờ xuất bản'];

$(function () {
    var html = [];
    // context menu
    $('#context-menu').hide();

    // side bar
    $('.sidenav-badge').hide();

    // table
    mounted();  
});

function getIdSelections() {
    return $.map($table.bootstrapTable('getSelections'), function (row) {
        return row.id
    })
}

function articleFormatter(value, row, index) {

    if (row.status.toLowerCase() === ARTICLE_STATUS.published.label.toLowerCase()) {
        return '<a href="' + value.href + '" target="_blank">' + value.title.substr(0, 1).toUpperCase() + value.title.substr(1) + '</a>';
    }
    
    return value.title;
}

function nameFormatter(value, row) {
    value = value.substr(0,1).toUpperCase() + value.substr(1);
    return value;
}

function statusFormatter(value, row, index) {
    if (value.toLowerCase() === ARTICLE_STATUS.pending_publish.label.toLowerCase()) {     // đã được duyệt và chờ xuất bản
        var html = `<select class="form-control status-dropdown-menu font-weight-bold" 
                    style="text-align: center; text-align-last: center; color: ` + ARTICLE_STATUS.pending_publish.color + ` ; " >`

        $.each (ARTICLE_STATUS, function(key, status) {
            html += '<option value="' + status.label.toLowerCase() + '"';
            if (value.toLowerCase() === status.label.toLowerCase()) {
                html += ' selected="selected" ';
            }

            if (status.label.toLowerCase() !== ARTICLE_STATUS.published.label.toLowerCase()) {
                html += ' class="d-none" '
            }
            html += ' style="color: black; " >' + status.label.substr(0, 1).toUpperCase() + status.label.substr(1) + '</option>';
        })
        html += '</select>';


        return html;
    }
    else {
        return '<font class="font-weight-bold" color="limegreen">' + value + '</font>';
    }
}

window.operateEvents = {
    'change .status-dropdown-menu' : function (e, value, row, index) {
        var id = $table.bootstrapTable('getData', true)[index].id;
        var date = new Date();
        var publish_date = date.getDate() + '-' + date.getMonth() + '-' + date.getFullYear();
        $table.bootstrapTable('updateCellById', {id: id, field: 'status', value: $('tbody tr[data-index="' + index + '"]').find('select option:selected').text()});
        $table.bootstrapTable('updateCellById', {id: id, field: 'publish_date', value: publish_date});
    }
}

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
    uniqueId: 'id',
    // extension
    stickyHeader: true,
    stickyHeaderOffsetY: 56,
    showJumpto: true,
    searchAccentNeutralise: true,
    //filter

    columns: [{field: 'state', checkbox: true, align: 'center', valign: 'middle', width: '5%', }, 
            { field: 'id', title: 'ID', align: 'center', valign: 'middle', sortable: true,  width: '5%'}, 
            {  field: 'article', title: 'Bài viết', align: 'left',  valign: 'middle', formatter: articleFormatter, sortable: true, },
            {  field: 'author', title: 'Tác giả', align: 'center',  valign: 'middle', width: '20%', formatter: nameFormatter, sortable: true, },
            {  field: 'publish_date', title: 'Ngày xuất bản', align: 'center',  valign: 'middle', width: '15%', sortable: true, },
            {  field: 'status', title: 'Trạng thái', align: 'center',  valign: 'middle', width: '20%', formatter: statusFormatter, events: window.operateEvents, sortable: true, }],
    data: tableData,
        })
    }

    $table.on('check.bs.table uncheck.bs.table ' +
    'check-all.bs.table uncheck-all.bs.table',
    function () {
    var selections = $table.bootstrapTable('getSelections');
    $('#remove').prop('disabled', !selections.length);

    // save your data, here just save the current page
    var idSelections = getIdSelections()
    // push or splice the selections if you want to save all data selections
})

$table.on('all.bs.table', function (e, name, args) {

})

$('#remove').click(function () {
    var ids = getIdSelections();

    $table.bootstrapTable('remove', {
        field: 'id',
        values: ids
    })
    $('#remove').prop('disabled', true)
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

/* Sidebar */
$('#mySidenav a').mouseenter(function() {
    $(this).find('.sidenav-after-icon').hide();
    $(this).find('.sidenav-badge').show();
});

$('#mySidenav a').mouseleave(function() {
    $(this).find('.sidenav-after-icon').show();
    $(this).find('.sidenav-badge').hide();
});