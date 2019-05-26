var $table = $('#table');
var tableData = [];
const mainCategories = ['thời sự', 'Thế giới', 'Kinh doanh', 'Công nghệ', 'Thể thao', 'Giải trí', 'Sức khỏe', 'Giáo dục'];
var categories = [
    ['Thời sự', 'Chính trị', 'Giao thông', 'Đô thị'],
    ['Thế giới', 'Quân sự', 'Tư liệu', 'Phân tích', 'Người Việt 4 phương'],
    ['kinh doanh', 'bất động sản', 'hàng không', 'tài chính', 'doanh nhân', 'tiêu dùng'],
    ['công nghệ', 'mobile', 'AI', 'smartHome', 'startup'],
    ['thể thao', 'thể thao Việt Nam', 'thể thao Thế giới', 'bóng đá Việt Nam'],
    ['sao Việt', 'sao châu Á', 'sao Hollywood'],
    ['sức khỏe', 'làm đẹp', 'khỏe đẹp mỗi ngày', 'giới tính'],
    ['giáo dục', 'tuyển sinh 2019', 'du học', 'chọn nghề', 'chọn trường']
];

$(function () {
    var html = [];
    // context menu
    $('#context-menu').hide();

    // side bar
    $('.sidenav-badge').hide();

    // get data from server
    
    //let promise = new Promise((resolve, reject) => {
    // $.get('/admin/categories/json', function(data, status) {
    //     console.log(data);
    // });
    //});



    // table
    // let count = 0;
    // for (var i = 0; i < categories.length; i++) {
    //     var parentCategory = categories[i][0];
    //     tableData.push({
    //         'id': count + 1,
    //         'parentCategory': '',
    //         'name': parentCategory
    //     });
    //     count++;
        
    //     // add sub-categories row
    //     for (var j = 1; j < categories[i].length; j++) {
    //         tableData.push({
    //             'id': count + 1,
    //             'parentCategory': parentCategory,
    //             'name': categories[i][j]
    //         });
    //         count++;
    //     }
    // }
    mounted();  
    $('#edit').prop('disabled', true);

    /* form validation */
    'use strict';
    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    var forms = document.getElementsByClassName('needs-validation');
    // Loop over them and prevent submission
    var validation = Array.prototype.filter.call(forms, function(form) {
        form.addEventListener('submit', function(event) {
            if (form.checkValidity() === false) {
                event.preventDefault();
                event.stopPropagation();
            }
            form.classList.add('was-validated');
        }, false);
    });

    // init modal form
    $('#selectParentCategory').append($('<option>', {value: '', text: ''}));
    $.each(mainCategories, function (i, category) {
        category = category.substr(0,1).toUpperCase()+category.substr(1);
        $('#selectParentCategory').append($('<option>', { 
            value: category.toLowerCase(),
            text : category,
        }));
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
        responseHandler: res => {
            const parentCategories = res.filter(category => category.parentID === null);
            const parentCategoryNames = parentCategories.reduce((o, category) => Object.assign(o, {[category.id]: category.name}), {});
            //group rows
            let categories = parentCategories
                .reduce((arr, parentCategory) => {
                    return arr.concat(res.filter(category => category.id === parentCategory.id || category.parentID === parentCategory.id));
                }, []);
            
            categories =  categories.map(category => 
                (Object.assign({'id': category.id, 'name': category.name, }, {'parentCategory': category.parentID === null ? '' : parentCategoryNames[category.parentID]})));
            console.log(categories);
            return categories;
        },

        columns: [{field: 'state', checkbox: true, align: 'center', valign: 'middle', width: '5%', }, 
            { field: 'id', title: 'ID', align: 'center', valign: 'middle', sortable: true,  width: '5%'}, 
            {  field: 'parentCategory', title: 'Chuyên mục lớn', align: 'center',  valign: 'middle', formatter: nameFormatter, sortable: true, width: '20%', filterControl: 'select', },
            {  field: 'name', title: 'Tên', align: 'center',  valign: 'middle', formatter: nameFormatter, sortable: true, }],
        //data: tableData,
    });
}

$table.on('check.bs.table uncheck.bs.table ' +
    'check-all.bs.table uncheck-all.bs.table',
function () {
    var selections = $table.bootstrapTable('getSelections');
    $('#remove').prop('disabled', !selections.length);
    $('#edit').prop('disabled', selections.length !== 1);

    // save your data, here just save the current page
    var idSelections = getIdSelections();
    // push or splice the selections if you want to save all data selections
});

$table.on('all.bs.table', function (e, name, args) {

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
    let row = $table.bootstrapTable('getRowByUniqueId', id);
    let options = $('#selectParentCategory option').toArray();

    $('#inputCategoryName').val(row.name);

    options.forEach((option, index, arr) => {
        if(option.selected === true) {
            arr[index].selected = false;
        }

        if (option.value === row.parentCategory.toLowerCase()) {
            arr[index].selected = true;
        }
    });

    $('#addOrEditCategoryForm').removeClass('was-validated').attr('novalidate', '');
    $('#addOrEditCategoryModal').modal('show');
}
'use strict';
$('#addOrEditCategoryForm').submit( function(e) {
    
    if(this.checkValidity()) {
        // Nếu hợp lệ thì để gọi submit mặc định
        if ($('#addOrEditCategoryForm').find('button').text().toUpperCase() === 'OK') {     // Cập nhật
            var ids = getIdSelections();
            var index = ids[0] - 1;
            let row = $table.bootstrapTable('getData', true)[index];
            row.name = $('#inputCategoryName').val();
            row.parentCategory = $('#selectParentCategory').find(':selected').text();
            $table.bootstrapTable('updateRow', {index: index, row: row});

            for (var i = 0; i < ids.length; i++) {
                $table.bootstrapTable('updateCellById', {id: ids[i], field: 'state', value: false});
            }
        }
        else {      // Thêm mới
            var row = {
                'id': $table.bootstrapTable('getData').length + 1,
                'parentCategory': $('#selectParentCategory').find(':selected').text(),
                'name': $('#inputCategoryName').val()
            };
            $table.bootstrapTable('append', [row]);
        }
        $('#addOrEditCategoryModal').modal('hide');
    } else {
        e.preventDefault();
        e.stopPropagation();
    }
});

function removeCategories(ids) {
    const url = 'delete';
    const data = $table.bootstrapTable('getData');
    
    ids = ids.reduce((new_ids, curId) => {
        if (data.filter(category => category.id === curId)[0].parentCategory.length > 0) {     // không là mục chính
            if (new_ids.filter(id => id === curId).length > 0);

            return new_ids;
        } else {        // là chuyên mục chính => thêm id các chuyên mục con vào danh sách xóa
            const parentCategory = data.filter(category => category.id === curId)[0].name;
            new_ids.push(...data.filter(category => category.parentCategory.toLowerCase() === parentCategory.toLowerCase()).map(category => category.id), curId);

            return new_ids;
        }
    }, []);

    $.ajax({
        url: url,
        type: 'delete',
        data: { ids: JSON.stringify(ids) },
        cache: false,
        error: e => console.log(e),
        success: () => {
            $table.bootstrapTable('remove', {
                field: 'id',
                values: ids
            });
            $('#remove').prop('disabled', true);
        }
    });
}