var $table = $('#table');
var validator;
const fInsertValidateOption = {
    rules: {
        name: {
            required: true,
            remote: {
                url: '/check-category-available',
                type: 'post',
                data: {
                    name: function () {
                        return $('#inputCategoryName').val();
                    }
                }
            }
        },
    },

    messages: {
        name: {
            required: 'Chưa nhập tên',
            remote: 'Đã tồn tại chuyên mục này'
        }
    },

    errorElement: 'em',

    errorPlacement: function (error, element) {
        // Add the `invalid-feedback` class to the error element
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

    submitHandler: (form) => {
        ajaxSubmit(form);
    },
};

const fUpdateValidateOption = {
    rules: {
        name: {
            required: true,
        },
    },

    messages: {
        name: {
            required: 'Tên không được bỏ trống',
        }
    },
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
    submitHandler: (form) => {
        ajaxSubmit(form);
    },
};

$(function () {
    // context menu
    $('#context-menu').hide();

    // side bar
    $('.sidenav-badge').hide();

    // init table
    mounted();  
    $('#edit').prop('disabled', true);
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

function parentNameFormatter(value, row) {
    if (value == null)
        return '';
    
    return value.substr(0, 1).toUpperCase() + value.substr(1);
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
        // editable
        sidePagination: 'server',
        url: 'load',
        queryParams: (params) => {
            params.load = 'all';
            
            return params;
        },
        responseHandler: res => {
            let total = res.total;
            let rows = res.rows;

            let categories = rows.map((value, index, arr) => {
                return Object.assign(arr[index], { state: false });
            });
            return { total: total, rows: categories };
        },

        columns: [{field: 'state', checkbox: true, align: 'center', valign: 'middle', width: '5%', }, 
            { field: 'id', title: 'ID', align: 'center', valign: 'middle', sortable: true,  width: '5%'}, 
            { field: 'parentID', visible: false }, 
            {  field: 'parentName', title: 'Chuyên mục lớn', align: 'center',  valign: 'middle', 
                formatter: parentNameFormatter, sortable: true, width: '20%', filterControl: 'select', filterData: 'url:/admin/categories/load?load=parent-name' },
            {  field: 'name', title: 'Tên', align: 'center',  valign: 'middle', formatter: nameFormatter, sortable: true, }],
    });
}

$table.on('check.bs.table uncheck.bs.table ' +
    'check-all.bs.table uncheck-all.bs.table',
function () {
    var selections = $table.bootstrapTable('getSelections');
    $('#remove').prop('disabled', !selections.length);
    $('#edit').prop('disabled', selections.length !== 1);
});

$table.on('page-change.bs.table', (number, size) => {
    $table.bootstrapTable('uncheckAll');
});

$('#remove').click(function () {
    removeCategories(getIdSelections());
});
          
function mounted() {
    initTable();
}

// context-menu event (row clicking)
$('#table').on('contextmenu', 'tr',  function(e) {
    let dataIndex = parseInt($(this).attr('data-index'), 10);
    let row = $table.bootstrapTable('getData')[dataIndex];
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
        removeCategories(ids);
    });

    $('#editItem').click(function(e) {
        var selectionIds = getIdSelections();

        // uncheck checked row
        if (selectionIds.length > 0) {
            for (var i = 0; i < selectionIds.length; i++) {
                $table.bootstrapTable('updateCellById', {id: selectionIds[i], field: 'state', value: false});
            }
        }
        
        $table.bootstrapTable('updateCellById', {id: row.id, field: 'state', value: true});
        editCategory(row.id);
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

// add category
$('#add').on('click',function() {
    initModalForm();

    $('#addOrEditCategoryForm').find('button').text('Thêm');

    $('#inputCategoryName').val('');
    $('#selectParentCategory option .selected').attr('selected', '');
    $('#selectParentCategory option:contains(""):first').attr('selected', 'selected');

    if (validator !== undefined)
        validator.destroy();
    validator = $('#addOrEditCategoryForm').validate(fInsertValidateOption);
});

// edit category
$('#edit').on('click', function() {
    var id = getIdSelections(); 
    
    editCategory(id[0]);
});

function editCategory(id) {
    initModalForm()
        .then(() => {
            $('#addOrEditCategoryForm').find('button').text('OK');

            let row = $table.bootstrapTable('getRowByUniqueId', id);
            let options = $('#selectParentCategory option').toArray();
        
            $('#inputCategoryName').val(row.name);
            options.forEach((option, index, arr) => {
                if(option.selected === true) {
                    arr[index].selected = false;
                }
        
                if (parseInt(option.value) === row.parentID) {
                    arr[index].selected = true;
                }
            });

            if (validator !== undefined)
                validator.destroy();
            validator = $('#addOrEditCategoryForm').validate(fUpdateValidateOption);
        })
        .catch(err => console.log(err));

}

function ajaxSubmit(form) {
    if ($(form).find('button').text().toUpperCase() === 'OK') {     // Cập nhật
        let ids = getIdSelections();
        let row = $table.bootstrapTable('getRowByUniqueId', ids[0]);
        const URL = 'update';

        row.name = $('#inputCategoryName').val();
        row.parentName = $('#selectParentCategory').find(':selected').text();
        row.parentID = parseInt($('#selectParentCategory').find(':selected').attr('value'));

        $.ajax({
            url: URL,
            method: 'put',
            data: { id: ids[0], name: row.name, parentID: row.parentID },
            error: err => console.log(err),
            success: () => {
                $table.bootstrapTable('refresh', { silent: true });
                // uncheck all checked rows
                $table.bootstrapTable('uncheckAll');
            }
        });
    }
    else {      // Thêm mới
        const URL = '/admin/categories';
        var parentCategoryOption = $('#selectParentCategory').find(':selected');
            
        var row = {
            parentName: parentCategoryOption.text(),
            parentID: parentCategoryOption.attr('value') === '' ? null : parseInt(parentCategoryOption.attr('value')),
            name: $('#inputCategoryName').val()
        };

        // send add request
        $.ajax({
            url: URL,
            method: 'post',
            data: { name: row.name, parentID: row.parentID },
            error: err => console.log(err),
            success: res => {
                $table.bootstrapTable('refresh', { silent: true });
            }
        });
    }
    $('#addOrEditCategoryModal').modal('hide');
}

function removeCategories(ids) {
    const url = 'delete';

    $.ajax({
        url: url,
        type: 'delete',
        data: { 
            ids: JSON.stringify(ids)
        },
        cache: false,
        error: err => console.log(err),
        success: () => {
            $table.bootstrapTable('refresh', { silent: true });
            //$('#remove').prop('disabled', true);
            $table.bootstrapTable('uncheckAll');
        }
    });
}

function initModalForm() {
    return $.ajax({
        url: '/admin/categories/load',
        method: 'get',
        data: {
            load: 'parent'
        },
        error: err => console.log(err),
        success: res => {
            let parentCategories = res;
            $('#selectParentCategory').empty();
            $('#selectParentCategory').append($('<option>', {value: '', text: ''}));
            $.each(parentCategories, function (i, category) {
                category.name = category.name.substr(0,1).toUpperCase()+category.name.substr(1);
                $('#selectParentCategory').append($('<option>', { 
                    value: category.id,
                    text : category.name,
                }));
            });
            $('#addOrEditCategoryModal').modal('show');
        }
    });
}