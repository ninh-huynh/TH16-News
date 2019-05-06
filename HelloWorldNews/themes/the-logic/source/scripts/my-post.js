var $table = $('#table');
var tableData = [
    {id: 1, article: {title: 'bài  viết 1', href: '#' }, category: 'Thời sự', publish_date: "1-1-2019", status: 'Đã xuất bản'},
    {id: 2, article: {title: 'bài  viết 2', href: '#' }, category: 'Thể thao', publish_date: "", status: 'Đã được duyệt & chờ xuất bản'},
    {id: 3, article: {title: 'bài  viết 3', href: '../edit-post/' }, category: 'Giải trí', publish_date: "", status: 'Bị từ chối' },
    {id: 4, article: {title: 'bài  viết 4', href: '#' }, category: 'Thời sự', publish_date: "4-4-2019", status: 'Đã xuất bản'},
    {id: 5, article: {title: 'bài  viết 5', href: '#' }, category: 'Sức khỏe  ', publish_date: "", status: 'chưa được duyệt'},
    {id: 6, article: {title: 'bài  viết 6', href: '#' }, category: 'Kinh doanh', publish_date: "", status: 'Đã được duyệt & chờ xuất bản'},
    {id: 7, article: {title: 'bài  viết 7', href: '#' }, category: 'Thế giới', publish_date: "7-7-2019", status: 'Đã xuất bản'},
    {id: 8, article: {title: 'bài  viết 8', href: '#' }, category: 'Thể thao', publish_date: "5-4-2019", status: 'Đã xuất bản'},
    {id: 9, article: {title: 'bài  viết 9', href: '../edit-post/' }, category: 'Giải trí', publish_date: "", status: 'Bị từ chối'},
    {id: 10, article: {title: 'bài  viết 10', href: '#' }, category: 'Thời sự', publish_date: "10-10-2019", status: 'Đã xuất bản'},
    {id: 11, article: {title: 'bài  viết 11', href: '#' }, category: 'Thời sự', publish_date: "10-10-2019", status: 'Đã xuất bản'},
    {id: 12, article: {title: 'bài  viết 12', href: '#' }, category: 'Thời sự', publish_date: "10-10-2019", status: 'Đã xuất bản'}
];

var statuses = ['đã xuất bản', 'đã được duyệt & chờ xuất bản'];

$(function () {
    var html = [];
    // context menu
    $('#context-menu').hide();

    // table
    mounted();  
});

function getIdSelections() {
    return $.map($table.bootstrapTable('getSelections'), function (row) {
        return row.id
    })
}

function articleFormatter(value, row, index) {
    return [
        '<a href="' + value.href + '" target="_blank">' + value.title.substr(0, 1).toUpperCase() + value.title.substr(1) + '</a>'
    ].join('');
}

function categoryFormatter(value, row) {
    value = value.substr(0,1).toUpperCase() + value.substr(1);
    return value;
}

function statusFormatter(value, row) {
    value = value.substr(0,1).toUpperCase() + value.substr(1);
    return value;
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
    filterControl: true,
    filterShowClear: true,

    columns: [{field: 'state', checkbox: true, align: 'center', valign: 'middle', width: '5%', }, 
            { field: 'id', title: 'ID', align: 'center', valign: 'middle', sortable: true,  width: '5%'}, 
            {  field: 'article', title: 'Bài viết', align: 'center',  valign: 'middle', formatter: articleFormatter, sortable: true, },
            {  field: 'category', title: 'Chuyên mục', align: 'center',  valign: 'middle', width: '20%', formatter: categoryFormatter, sortable: true, filterControl: 'select'},
            {  field: 'publish_date', title: 'Ngày xuất bản', align: 'center',  valign: 'middle', width: '15%', sortable: true,},
            {  field: 'status', title: 'Trạng thái', align: 'center',  valign: 'middle', width: '20%', formatter: statusFormatter, sortable: true, filterControl: 'select'}],
    data: tableData,
        })
    }

    $table.on('check.bs.table uncheck.bs.table ' +
    'check-all.bs.table uncheck-all.bs.table',
    function () {
    var selections = $table.bootstrapTable('getSelections');
    $('#editBtn').prop('disabled', selections.length != 1);

    // save your data, here just save the current page
    var idSelections = getIdSelections()
    // push or splice the selections if you want to save all data selections
})

$table.on('all.bs.table', function (e, name, args) {

})

$table.on('click-row.bs.table', function(event, row, $element, field) {
    if (row.status.toLowerCase() !== 'bị từ chối'.toLowerCase()) {
        $('#editBtn').prop('disabled', true);
        $table.bootstrapTable('updateCellById', {id: row.id, field: row.state, value: false});
    }
});

$('#editBtn').on('click', function () {
    var row = $table.bootstrapTable('getRowByUniqueId', getIdSelections()[0]);
    win = window.open(row.article.href, '_blank');
})
          
function mounted() {
    initTable()
}

// context-menu event (row clicking)
$('#table').on('contextmenu', 'tr',  function(e) {
    
    let dataIndex = parseInt($(this).attr('data-index'), 10);
    let row = $table.bootstrapTable('getData', true)[dataIndex];

    if (row.status.toLowerCase() !== 'bị từ chối'.toLowerCase()) {
        return;
    }
    let ids;
    ids = getIdSelections();
    for (var i = 0; i < ids.length; i++) {
        $table.bootstrapTable('updateCellById', {id: ids[i], field: 'state', value: false});
    }
    $table.bootstrapTable('updateCellById', {id: row.id, field: 'state', value: true});

    $('#context-menu').show();
    $("#context-menu").offset({left:e.pageX, top:e.pageY});
    e.preventDefault();
});

// item click handler
// remove event handler
$('#editItem').on('click', function(e) {
    var row = $table.bootstrapTable('getRowByUniqueId', getIdSelections()[0]);
    if (row.status.toLowerCase() === 'bị từ chối'.toLowerCase()) {
        win = window.open(row.article.href, '_blank');
    }
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