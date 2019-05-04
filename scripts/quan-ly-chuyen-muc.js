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
    $('#header').load('./reuse-html/header.html');
    $('#category-menu').load('./reuse-html/menu-bar.html');
    $('#footer').load('./reuse-html/footer.html');

    // context menu
    $('#context-menu').hide();

    // side bar
    $('.sidenav-badge').hide();

    // table
    let count = 0;
    for (var i = 0; i < categories.length; i++) {
        var parentCategory = categories[i][0];
        tableData.push({
            'id': count + 1,
            'parentCategory': '',
            'name': parentCategory
        });
        count++;
        
        // add sub-categories row
        for (var j = 1; j < categories[i].length; j++) {
            tableData.push({
                'id': count + 1,
                'parentCategory': parentCategory,
                'name': categories[i][j]
            });
            count++;
        }
    }
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
    $('#selectParentCategory').append($('<option>', {value: "", text: ""}));
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
        return row.id
    })
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

    columns: [{field: 'state', checkbox: true, align: 'center', valign: 'middle', width: '5%', }, 
            { field: 'id', title: 'ID', align: 'center', valign: 'middle', sortable: true,  width: '5%'}, 
            {  field: 'parentCategory', title: 'Chuyên mục lớn', align: 'center',  valign: 'middle', formatter: nameFormatter, sortable: true, width: '20%', filterControl: 'select', },
            {  field: 'name', title: 'Tên', align: 'center',  valign: 'middle', formatter: nameFormatter, sortable: true, }],
    data: tableData,
        })
    }

    $table.on('check.bs.table uncheck.bs.table ' +
    'check-all.bs.table uncheck-all.bs.table',
    function () {
    var selections = $table.bootstrapTable('getSelections');
    $('#remove').prop('disabled', !selections.length);
    $('#edit').prop('disabled', selections.length !== 1);

    // save your data, here just save the current page
    var idSelections = getIdSelections()
    // push or splice the selections if you want to save all data selections
})

$table.on('all.bs.table', function (e, name, args) {

})

$('#remove').click(function () {
    var ids = getIdSelections();
    var full_ids = ids;
    var data = $table.bootstrapTable('getData');

    $.each(ids, function(i, id) {
        if ($table.bootstrapTable('getRowByUniqueId', id).parentCategory < 1) {
            $.each(data, function(j, row) {
                if (row.parentCategory.length > 0) {
                    if (row.parentCategory.toLowerCase() === 
                    $table.bootstrapTable('getRowByUniqueId', id).name.toLowerCase()) {
                        full_ids.push(row.id);
                    }
                }
            });
        }
    });

    console.log(full_ids);

    $table.bootstrapTable('remove', {
        field: 'id',
        values: full_ids
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

    $('#editItem').click(function(e) {
        editCategory(dataIndex);
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

    $('#inputCategoryName').val("");
    $('#selectParentCategory option .selected').attr('selected', '');
    $('#selectParentCategory option:contains(""):first').attr('selected', 'selected');

    $("#addOrEditCategoryForm").removeClass('was-validated').attr('novalidate', '');
    $('#addOrEditCategoryModal').modal('show');
})

// edit category
$('#edit').on('click', function() {
    var id = getIdSelections();
    
    editCategory(id[0] - 1);
})

function editCategory(index) {
    let row = $table.bootstrapTable('getData', true)[index];
    var parentCategory = row.parentCategory.substr(0,1).toUpperCase() + row.parentCategory.substr(1);

    $('#inputCategoryName').val(row.name);
    $('#selectParentCategory option[selected="selected"]').attr('selected', '');
    $('#selectParentCategory option:contains("' + parentCategory +'")').attr('selected', 'selected');

    $("#addOrEditCategoryForm").removeClass('was-validated').attr('novalidate', '');
    $('#addOrEditCategoryModal').modal('show');
}
'use strict';
$("#addOrEditCategoryForm").submit( function(e) {
    e.preventDefault();    

    if($(this).valid()) {
        e.preventDefault();
        if ($('#addOrEditCategoryForm').find('button').text().toUpperCase() === 'OK') {     // Cập nhật
            var id = getIdSelections();
            var index = id[0] - 1;
            let row = $table.bootstrapTable('getData', true)[index];
            row.name = $('#inputCategoryName').val();
            row.parentCategory = $('#selectParentCategory').find(':selected').text();
            $table.bootstrapTable('updateRow', {index: index, row: row});
        }
        else {      // Thêm mới
            var row = {
                'id': $table.bootstrapTable('getData').length + 1,
                'parentCategory': $('#selectParentCategory').find(':selected').text(),
                'name': $('#inputCategoryName').val()
            }
            $table.bootstrapTable('append', [row]);
        }
       $('#addOrEditCategoryModal').modal('hide');
    } else {
        e.preventDefault();
        e.stopPropagation();
    }
});
