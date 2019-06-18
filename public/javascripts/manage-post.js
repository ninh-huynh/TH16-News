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
};

var $table = $('#table');

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
        Swal.showLoading();
        let newStatus = $('tbody tr[data-index="' + index + '"]').find('select option:selected').text();
        
        $.ajax({
            url: '/admin/posts/update-status',
            method: 'put',
            data: { id: row.id, status: newStatus },
            error: err => {
                console.log(err);
                Swal.fire({
                    position: 'center',
                    type: 'error',
                    title: err,
                    showConfirmButton: false,
                    timer: 1500
                });
            },
            success: res => {
                Swal.fire({
                    position: 'center',
                    type: 'success',
                    title: 'Đã duyệt',
                    showConfirmButton: false,
                    timer: 1500
                });
                $table.bootstrapTable('refresh', { silent: true });
            }
        });
    }
};

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
        pageSize: 10,

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
});

$table.on('all.bs.table', function (e, name, args) {

});

$('#remove').click(function () {
    var ids = getIdSelections();
    
    removePost(ids);
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