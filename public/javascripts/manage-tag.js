var $table = $('#table');
var tableData = [];
var fAddTagValidator;
var fEditTagValidator;
const commonValidateOption = {
    errorElement: 'em',

    errorPlacement: function (error, element) {
        error.addClass('invalid-feedback');
        if (element.prop('type') === 'checkbox') {
            error.insertAfter(element.next('label'));
        } else {
            error.insertAfter(element);
        }
    },
    highlight: function (element, errorClass, validClass) {
        $(element).addClass('is-invalid').removeClass('is-valid');
    },
    unhighlight: function (element, errorClass, validClass) {
        $(element).addClass('is-valid').removeClass('is-invalid');
    },
};

var fAddTagValidateOption = {
    rules: {
        name: {
            required: true,
            remote: {
                url: '/check-tag-available',
                type: 'post',
                data: {
                    name: function () {
                        return $('#inputTagNameAdd').val();
                    }
                }
            }
        },
    },
    messages: {
        name: {
            required: 'Chưa nhập tên tag',
            remote: 'Tag đã tồn tại. Hãy đặt tên khác'
        },
    },
    submitHandler: (form) => {
        ajaxAddTagSubmitHandler(form);
        $('#addTagModal').modal('hide');
    },
};

var fEditTagValidateOption = {
    rules: {
        name: {
            required: true,
        },
    },
    messages: {
        name: {
            required: 'Tên tag không được bỏ trống',
        },
    },
    submitHandler: (form) => {
        ajaxEditTagSubmitHandler(form);
        $('#editTagModal').modal('hide');
    },
};

$(function () {
    // context menu
    $('#context-menu').hide();

    // side bar
    $('.sidenav-badge').hide();

    // table
    mounted();  
    $('#edit').prop('disabled', true);


    Object.assign(fAddTagValidateOption, commonValidateOption);
    Object.assign(fEditTagValidateOption, commonValidateOption);

    fAddTagValidator = $('#addTagForm').validate(fAddTagValidateOption);
    fEditTagValidator = $('#editTagForm').validate(fEditTagValidateOption);
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
$('#add').on('click', function () {
    fAddTagValidator.resetForm();
    $('#inputTagNameAdd').val('');
    $('input').removeClass('is-valid').removeClass('is-invalid');
    $('#addTagModal').modal('show');
});

// edit tag
$('#edit').on('click', function() {
    let id = getIdSelections();
    if (id.length < 1)
        return;

    id = id[0];
    let row = $table.bootstrapTable('getRowByUniqueId', id);

    fEditTagValidator.resetForm();
    $('#inputTagNameUpdate').val(row.name);
    $('input').removeClass('is-valid').removeClass('is-invalid');
    $('#editTagModal').modal('show');
});

function ajaxAddTagSubmitHandler(form) {
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
}

function ajaxEditTagSubmitHandler(form) {
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
}

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