const ARTICLE_STATUS = {
    published : {
        id: 2,
        label: 'đã xuất bản',
        color: 'limegreen',
    },
    pending_publish: {
        id: 1,
        label: 'đã được duyệt',
        color: 'orange',
    },
    refused: {
        id: 3,
        label: 'bị từ chối',
        color: 'red'
    },
    pending_approve: {
        id: 4,
        label: 'Chưa được duyệt',
        color: 'blue'
    }
}

var $table = $('#table');
// var tableData = [
//     {id: 1, title: {title: 'bài  viết 1', href: '#' }, author: 'tác giả 1', publish_date: "1-1-2019", status: 'Đã xuất bản'},
//     {id: 2, title: {title: 'bài  viết 2', href: '#' }, author: 'tác giả 2', publish_date: "", status: 'Đã được duyệt & chờ xuất bản'},
//     {id: 3, title: {title: 'bài  viết 3', href: 'https://mp3.zing.vn' }, author: 'tác giả 3', publish_date: "3-3-2019", status: 'Đã xuất bản'},
//     {id: 4, title: {title: 'bài  viết 4', href: 'https://mp3.zing.vn' }, author: 'tác giả 4', publish_date: "4-4-2019", status: 'Đã xuất bản'},
//     {id: 5, title: {title: 'bài  viết 5', href: 'https://mp3.zing.vn' }, author: 'tác giả 5', publish_date: "", status: 'Đã được duyệt & chờ xuất bản'},
//     {id: 6, title: {title: 'bài  viết 6', href: 'https://mp3.zing.vn' }, author: 'tác giả 6', publish_date: "", status: 'Đã được duyệt & chờ xuất bản'},
//     {id: 7, title: {title: 'bài  viết 7', href: 'https://mp3.zing.vn' }, author: 'tác giả 7', publish_date: "7-7-2019", status: 'Đã xuất bản'},
//     {id: 8, title: {title: 'bài  viết 8', href: 'https://mp3.zing.vn' }, author: 'tác giả 8', publish_date: "", status: 'Đã được duyệt & chờ xuất bản'},
//     {id: 9, title: {title: 'bài  viết 9', href: 'https://mp3.zing.vn' }, author: 'tác giả 9', publish_date: "9-9-2019", status: 'Đã xuất bản'},
//     {id: 10, title: {title: 'bài  viết 10', href: 'https://mp3.zing.vn' }, author: 'tác giả 10', publish_date: "10-10-2019", status: 'Đã xuất bản'}
// ];

// var statuses = ['đã xuất bản', 'đã được duyệt & chờ xuất bản'];

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

function titleFormatter(value, row, index) {
    if (row.status.toLowerCase() === ARTICLE_STATUS.published.label.toLowerCase()) {
        return `<a href="#" target=_"blank">${ value.substr(0, 1).toUpperCase() + value.substr(1) }</a>`;
    }
    
    return value;
}

function nameFormatter(value, row) {
    value = value.substr(0,1).toUpperCase() + value.substr(1);
    return value;
}

function statusFormatter(value, row, index) {
    if (value.toLowerCase() === ARTICLE_STATUS.pending_publish.label.toLowerCase()) {     // đã được duyệt và chờ xuất bản
        var html = `<select class="form-control status-dropdown-menu font-weight-bold" 
                    style="text-align: center; text-align-last: center; color: ${ ARTICLE_STATUS.pending_publish.color}; " >`;

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
        let newStatus = $('tbody tr[data-index="' + index + '"]').find('select option:selected').text();
        
        $.ajax({
            url: '/admin/posts/update-status',
            method: 'put',
            data: { id: row.id, status: newStatus },
            error: err => console.log(err),
            success: res => {
                $table.bootstrapTable('refresh', { silent: true });
            }
        });
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
        pageList: [5, 10, 20, 100],
        pageSize: 5,

        url: '/admin/posts/load',
        sidePagination: 'server',
        responseHandler: res => {
            console.log(res);
            let total = res.total;
            let rows = res.rows;

            let tags = rows.map((value, index, arr) => {
                let date = new Date(arr[index].publish_date);
                arr[index].publish_date = `${ date.getDate() } - ${ date.getMonth() } - ${ date.getFullYear() }`;
                return Object.assign(arr[index], { state: false });
            });
            return { total: total, rows: tags };
        },
        //filter

        columns: [{field: 'state', checkbox: true, align: 'center', valign: 'middle', width: '5%', }, 
            { field: 'id', title: 'ID', align: 'center', valign: 'middle', sortable: true,  width: '5%'}, 
            {  field: 'title', title: 'Tiêu đề', align: 'center',  valign: 'middle', formatter: titleFormatter, sortable: true, },
            {  field: 'author', title: 'Tác giả', align: 'center',  valign: 'middle', width: '20%', formatter: nameFormatter, sortable: true, },
            {  field: 'category', title: 'Thể loại', align: 'center',  valign: 'middle', width: '10%', formatter: nameFormatter, sortable: true, },
            {  field: 'publish_date', title: 'Ngày xuất bản', align: 'center',  valign: 'middle', width: '10%', sortable: true, },
            {  field: 'status', title: 'Trạng thái', align: 'center',  valign: 'middle', width: '20%', formatter: statusFormatter, events: window.operateEvents, sortable: true, }],
    });
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
    
    removePost(ids);
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
    $('#context-menu').offset({left:e.pageX, top:e.pageY});
    e.preventDefault();

    // item click handler
    // remove event handler
    $('#removeItem').click( function(e) {
        $table.bootstrapTable('remove', {
            field: 'id',
            values: ids
        });
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

function removePost(ids) {
    $.ajax({
        url: '/admin/posts',
        method: 'delete',
        data: {
            ids: JSON.stringify(ids)
        },
        error: err => console.log(err),
        success: res => {
            $table.bootstrapTable('refresh', { silent: true });
        }
    });
}