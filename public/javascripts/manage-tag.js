var $table = $('#table');
var tableData = [];

$(function () {
    // context menu
    $('#context-menu').hide();

    // side bar
    $('.sidenav-badge').hide();

    // table
    mounted();  
    $('#edit').prop('disabled', true);

    /* form validation */
    'use strict';
    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    var forms = document.getElementsByClassName('needs-validation');
    // Loop over them and prevent submission
    var validation = Array.prototype.filter.call(forms, function(form) {
        console.log(form);
        form.addEventListener('submit', function(event) {
            if (form.checkValidity() === false) {
                event.preventDefault();
                event.stopPropagation();
            }
            form.classList.add('was-validated');
        }, false);
    });
});

function getIdSelections() {
    return $.map($table.bootstrapTable('getSelections'), function (row) {
        return row.id;
    });
}

function nameFormatter(value, row) {
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
        url: '/admin/tags/load',
        sidePagination: 'server',

        responseHandler: res => {
            console.log(res);
            let total = res.total;
            let rows = res.rows;

            let tags = rows.map((value, index, arr) => {
                return Object.assign(arr[index], { state: false });
            });
            return { total: total, rows: tags };
        },

        columns: [{field: 'state', checkbox: true, align: 'center', valign: 'middle', width: '5%', }, 
            { field: 'id', title: 'ID', align: 'center', valign: 'middle', sortable: true,  width: '5%'}, 
            {  field: 'name', title: 'Tên Nhãn', align: 'center',  valign: 'middle', formatter: nameFormatter, sortable: true, }],
        data: tableData,
    });
}

$table.on('check.bs.table uncheck.bs.table ' +
    'check-all.bs.table uncheck-all.bs.table',
function () {
    var selections = $table.bootstrapTable('getSelections');
    $('#remove').prop('disabled', !selections.length);
    $('#edit').prop('disabled', selections.length != 1);

    // save your data, here just save the current page
    // push or splice the selections if you want to save all data selections
});

$('#remove').click(function () {
    let ids = getIdSelections();
    removeTag(ids);
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

    $('#editItem').click(function(e) {
        var selectionIds = getIdSelections();

        if (selectionIds.length > 0) {
            for (var i = 0; i < selectionIds.length; i++) {
                $table.bootstrapTable('updateCellById', {id: selectionIds[i], field: 'state', value: false});
            }
        }
        
        $table.bootstrapTable('updateCellById', {id: dataIndex + 1, field: 'state', value: true});

        editTag(dataIndex);
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

// add tag
$('#add').on('click',function() {
    $('#inputTagNameAdd').val('');
    $('#addTagForm').removeClass('was-validated').attr('novalidate', '');
    $('#addTagModal').modal('show');
});

// edit tag
$('#edit').on('click', function() {
    let id = getIdSelections();
    if (id.length < 1)
        return;

    id = id[0];
    let row = $table.bootstrapTable('getRowByUniqueId', id);

    $('#inputTagNameUpdate').val(row.name);
    $('#editTagForm').removeClass('was-validated').attr('novalidate', '');
    $('#editTagModal').modal('show');
});

$('#addTagForm').submit( function(e) {
    if (this.checkValidity()) {
        e.preventDefault();

        let name = $('#inputTagNameAdd').val();
        $.ajax({
            url: '/admin/tags',
            method: 'post',
            data: {
                name: name
            },
            err: err => console.log(err),
            success: res => {
                console.log(res);
                $table.bootstrapTable('refresh', { silent: true });
            }
        });

        $('#addTagModal').modal('hide');
    } else {
        e.preventDefault();
        e.stopPropagation();
    }
});

$('#editTagForm').submit(function(e) {
    if (this.checkValidity()) {
        e.preventDefault();

        let data = { 
            id: getIdSelections()[0], 
            name: $('#inputTagNameUpdate').val()
        };

        console.log(data);

        $.ajax({
            url: '/admin/tags',
            method: 'put',
            data: { data: JSON.stringify(data) },
            error: err => console.log(err),
            success: res => {
                $table.bootstrapTable('refresh', { silent: true });
            }
        });
        $('#editTagModal').modal('hide');
    } else {
        e.preventDefault();
        e.stopPropagation();
    }
});

function removeTag(ids) {
    if (ids.length === 0)
        return;

    $.ajax({
        url: '/admin/tags',
        method: 'delete',
        data: { 
            ids: JSON.stringify(ids)
        },
        err: err => console.log(err),
        success: res => {
            $table.bootstrapTable('refresh', { silent: true });
        }
    });
}