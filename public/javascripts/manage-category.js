var $table = $('#table');
var parentCategories;

$(function () {
    // context menu
    $('#context-menu').hide();

    // side bar
    $('.sidenav-badge').hide();

    // init table
    mounted();  
    $('#edit').prop('disabled', true);

    // get parent categories
    $.ajax({
        url: '/admin/categories/load',
        method: 'get',
        data: {
            load: 'parent'
        },
        error: err => console.log(err),
        success: res => parentCategories = res
    });

    /* form validation */
    'use strict';
    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    var forms = document.getElementsByClassName('needs-validation');
    // Loop over them and prevent submission
    var validation = Array.prototype.filter.call(forms, function(form) {
        form.addEventListener('submit', function(event) {
            event.preventDefault();
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
        //filter
        filterControl: true,
        filterShowClear: true,
        // editable
        editable: true,
        url: 'load',
        queryParams: (params) => {
            params.load = 'all';
            
            return params;
        },
        responseHandler: res => {
            const parentCategories = res
                .filter(category => category.parentID === null)
                .reduce((o, category) => Object.assign(o, {[category.id]: category}), {});
            
            //group rows
            let categories = res.filter(category => category.parentID === null)
                .reduce((arr, parentCategory) => {
                    return arr.concat(res.filter(category => category.id === parentCategory.id || category.parentID === parentCategory.id));
                }, []);

            categories =  categories.map(category => {
                let parentCategory = category.parentID === null ? { id: null, name: '' } : { id: category.parentID, name: parentCategories[category.parentID].name };
                return Object.assign({ id: category.id, name: category.name, state: false, parentCategoryId: parentCategory.id, parentCategory: parentCategory.name });
            });

            return categories;
        },

        columns: [{field: 'state', checkbox: true, align: 'center', valign: 'middle', width: '5%', }, 
            { field: 'id', title: 'ID', align: 'center', valign: 'middle', sortable: true,  width: '5%'}, 
            { field: 'parentCategoryId', visible: false }, 
            {  field: 'parentCategory', title: 'Chuyên mục lớn', align: 'center',  valign: 'middle', 
                formatter: nameFormatter, sortable: true, width: '20%', filterControl: 'select', },
            {  field: 'name', title: 'Tên', align: 'center',  valign: 'middle', formatter: nameFormatter, sortable: true, }],
        //data: $table.bootstrapTable('getData'),
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
    updateModalForm();
    $('#addOrEditCategoryForm').find('button').text('Thêm');

    $('#inputCategoryName').val('');
    $('#selectParentCategory option .selected').attr('selected', '');
    $('#selectParentCategory option:contains(""):first').attr('selected', 'selected');

    $('#addOrEditCategoryForm').removeClass('was-validated').attr('novalidate', '');
    $('#addOrEditCategoryModal').modal('show');
});

// edit category
$('#edit').on('click', function() {
    var id = getIdSelections(); 
    
    editCategory(id[0]);
});

function editCategory(id) {
    updateModalForm();
    let row = $table.bootstrapTable('getRowByUniqueId', id);
    let options = $('#selectParentCategory option').toArray();
    let form = $('#addOrEditCategoryForm');

    $('#inputCategoryName').val(row.name);
    options.forEach((option, index, arr) => {
        if(option.selected === true) {
            arr[index].selected = false;
        }

        if (parseInt(option.value) === row.parentCategoryId) {
            arr[index].selected = true;
        }
    });

    $(form).removeClass('was-validated').attr('novalidate', '');
    $('#addOrEditCategoryModal').modal('show');
}
'use strict';
$('#addOrEditCategoryForm').submit( function(e) {
    let form = $('#addOrEditCategoryForm');

    if(this.checkValidity()) {
        // Nếu hợp lệ thì để gọi submit mặc định
        if ($(form).find('button').text().toUpperCase() === 'OK') {     // Cập nhật
            let ids = getIdSelections();
            let row = $table.bootstrapTable('getRowByUniqueId', ids[0]);
            const URL = 'update';

            row.name = $('#inputCategoryName').val();
            row.parentCategory = $('#selectParentCategory').find(':selected').text();
            row.parentCategoryId = parseInt($('#selectParentCategory').find(':selected').attr('value'));

            $.ajax({
                url: URL,
                method: 'put',
                data: { id: ids[0], name: row.name, parentID: row.parentCategoryId },
                error: err => console.log(err),
                success: () => {
                    $table.bootstrapTable('updateByUniqueId', { id: row.id, row: row });

                    if (row.parentCategoryId === null && parentCategories.some(category => category.id === ids[0])) {
                        parentCategories.filter(category => category.id === ids[0])[0] = { id: ids[0], name: row.name, parentID: null };
                    }
                }
            });

            // uncheck all checked rows
            for (var i = 0; i < ids.length; i++) {
                $table.bootstrapTable('updateCellById', { id: ids[i], field: 'state', value: false });
            }
            $table.bootstrapTable('uncheckAll');
        }
        else {      // Thêm mới
            const URL = '/admin/categories';
            var parentCategoryOption = $('#selectParentCategory').find(':selected');
            
            var row = {
                parentCategory: parentCategoryOption.text(),
                parentCategoryId: parentCategoryOption.attr('value') === '' ? null : parseInt(parentCategoryOption.attr('value')),
                name: $('#inputCategoryName').val()
            };

            // send add request
            $.ajax({
                url: URL,
                method: 'post',
                data: { name: row.name, parentID: row.parentCategoryId },
                error: err => console.log(err),
                success: res => {
                    row.id = res.insertedID;
                    $table.bootstrapTable('append', [row]);
                    if (row.parentCategoryId === null) {
                        parentCategories.push({ id: res.insertedID, name: row.name, parentID: row.parentCategoryId });
                    }
                }
            });
        }
        $('#addOrEditCategoryModal').modal('hide');
    } else {
        e.preventDefault();
        e.stopPropagation();
    }
});

function removeCategories(ids) {
    const url = 'delete';
    let data;
    let subCategoryIds = [];

    $.ajax({
        url: '/admin/categories/load',
        method: 'get',
        async: false,
        data: {
            load: 'all'
        },

        error: err => console.log(err),
        complete: res => data = res.responseJSON
    });

    let parentCategoryIds = ids
        .filter(id => parentCategories.some(parentCategory => parentCategory.id === id));

    // với mỗi chuyên mục chính, lấy danh sách các chuyên mục con
    if (parentCategoryIds.length > 0) {
        subCategoryIds = parentCategoryIds.reduce((arr, parentID) => {
            return arr.concat(data.filter(category => category.parentID === parentID).map(category => category.id));
        }, []);
    }

    subCategoryIds = subCategoryIds.concat(
        ids.reduce((arr, id) => {
            arr.concat(data.filter(category => category.id === id && category.parentID !== null && subCategoryIds.indexOf(id) < 0).map(category => category.id))

            return arr;
        }, [])
    );
    
    $.ajax({
        url: url,
        type: 'delete',
        data: { 
            parentCategoryIds: JSON.stringify(parentCategoryIds),
            subCategoryIds: JSON.stringify(subCategoryIds)
        },
        cache: false,
        error: err => console.log(err),
        success: () => {
            $table.bootstrapTable('remove', {
                field: 'id',
                values: parentCategoryIds.concat(subCategoryIds)
            });
            $('#remove').prop('disabled', true);
            parentCategories = parentCategories.filter(category => parentCategoryIds.indexOf(category.id) < 0);
        }
    });
}

function updateModalForm() {
    // init modal value
    $('#selectParentCategory').empty();
    $('#selectParentCategory').append($('<option>', {value: '', text: ''}));
    $.each(parentCategories, function (i, category) {
        category.name = category.name.substr(0,1).toUpperCase()+category.name.substr(1);
        $('#selectParentCategory').append($('<option>', { 
            value: category.id,
            text : category.name,
        }));
    });

    return true;
}