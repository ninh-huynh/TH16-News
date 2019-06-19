var $table = $('#table');
var parentCategories;
$(function () {
    // context menu
    $('#context-menu').hide();

    // side bar
    $('.sidenav-badge').hide();

    // table
    mounted();  

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

    $('#datetimePicker').datepicker({
        format: 'dd-mm-yyyy',
        startDate: new Date(),
        autoclose: true,
        clearBtn: true,
    });

    // $('#inputTag').tagsinput({
    //     itemValue: 'id',
    //     itemText: 'name',
    // });
});

function getIdSelections() {
    return $.map($table.bootstrapTable('getSelections'), function (row) {
        return row.id;
    });
}

function titleFormatter(title, row, index) {
    return `<a href='${ row.href }' target='_blank'>${ title }</a>`;
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
        singleSelect: true,
        uniqueId: 'id',
        // extension
        stickyHeader: true,
        stickyHeaderOffsetY: 56,
        showJumpto: true,
        searchAccentNeutralise: true,
        sortName: 'id',
        url: '/editor/approve-draft/load',
        sidePagination: 'server',
        responseHandler: res => {
            console.log(res);
            let total = res.total;
            let rows = res.rows.map(row => {
                return {
                    state: false,
                    id: row.id,
                    parentCategory: { id: row.parentCategoryID, name: row.parentCategory },
                    category: { id: row.categoryID, name: row.category },
                    title: row.title,
                    writerName: row.writerName,
                    href: row.href
                };
            });
            return { total: total, rows: rows };
        },

        //filter

        columns: [{field: 'state', checkbox: true, align: 'center', valign: 'middle', width: '5%', }, 
            { field: 'id', title: 'ID', align: 'center', valign: 'middle', sortable: true,  width: '5%'}, 
            { field: 'parentCategoy', visible: false },
            { field: 'category', visible: false },
            { field: 'href', visible: false },
            {  field: 'title', title: 'Bài viết', align: 'left',  valign: 'middle', formatter: titleFormatter, sortable: true, },
            {  field: 'writerName', title: 'Tác giả', align: 'center',  valign: 'middle', width: '20%', formatter: nameFormatter, sortable: true, }],
    });
}

$table.on('check.bs.table uncheck.bs.table ' +
    'check-all.bs.table uncheck-all.bs.table',
function () {
    var selections = $table.bootstrapTable('getSelections');
    $('#rejectBtn').prop('disabled', selections.length != 1);
    $('#approveBtn').prop('disabled', selections.length != 1);
});

$table.on('load-success.bs.table', (data) => {
    $.ajax({
        url: '/editor/approve-draft/category/parent/',
        method: 'get',
        error: err => {
            console.log(err);
        },
        success: rows => {
            parentCategories = rows;
        }
    });
});

// reject event
$('#rejectBtn').on('click', function () {
    reject();
});

function reject() {
    $('#rejectForm').removeClass('was-validated').attr('novalidate', '');
    $('#inputReason').val('');
    $('#rejectModal').modal('show');
}

// approve event
$('#approveBtn').on('click', function() {
    approve();
});

function approve() {
    let id = getIdSelections()[0];
    let row = $table.bootstrapTable('getRowByUniqueId', id);
    let categories;
    let tags;

    if (!id)
        return;

    Swal.enableLoading();

    $.ajax({
        url: `/editor/approve-draft/${ row.id }`,
        method: 'get',
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
            categories = res.categories;
            tags = res.tags;

            // parent category
            let $selectParentCateogry = $('#selectParentCategory');
            parentCategories.forEach(category => {
                $selectParentCateogry.append($('<option>', {
                    value: category.id,
                    text: category.name
                }));
            });
            $($selectParentCateogry).find(`option[value=${ row.parentCategory.id }]`).attr('selected', 'selected');
            
            // child cateogry
            let $selectCategory = $('#selectCategory');
            categories.forEach(category => {
                $($selectCategory).append($('<option>', {
                    value: category.id,
                    text: category.name
                }));
            });
            $($selectCategory).find(`option[value=${ row.category.id }]`).attr('selected', 'selected');

            // tags
            let $inputTag = $('#inputTag');
            $($inputTag).tagsinput('removeAll');
            tags.forEach(tag => {
                console.log(tag);
                $($inputTag).tagsinput('add', tag.name);
            });

            Swal.close();
            $('#approveForm').removeClass('was-validated').attr('novalidate', '');
            $('#approveModal').modal('show');
        }
    });
}
          
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
    $('#rejectItem').on('click', function(e) {
        var selectionIds = getIdSelections();
    
        if (selectionIds.length > 0) {
            for (var i = 0; i < selectionIds.length; i++) {
                $table.bootstrapTable('updateCellById', {id: selectionIds[i], field: 'state', value: false});
            }
        }
        
        $table.bootstrapTable('updateCellById', {id: dataIndex + 1, field: 'state', value: true});
        reject();
    });
    
    $('#approveItem').on('click', function(e) {
        var selectionIds = getIdSelections();
    
        if (selectionIds.length > 0) {
            for (var i = 0; i < selectionIds.length; i++) {
                $table.bootstrapTable('updateCellById', {id: selectionIds[i], field: 'state', value: false});
            }
        }
        
        $table.bootstrapTable('updateCellById', {id: dataIndex + 1, field: 'state', value: true});
        approve();
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

/* form submit */
$('#rejectForm').submit(function(e) {
    e.preventDefault();

    if (this.checkValidity()) {
        e.preventDefault();
        Swal.showLoading();

        const reason = $('#inputReason').val();
        const id = getIdSelections()[0];
        $.ajax({
            url: '/editor/approve-draft/reject',
            method: 'post',
            data: { 
                articleID: id,
                reason: reason 
            },
            error: err => {
                Swal.fire({
                    position: 'center',
                    type: 'error',
                    title: err,
                    showConfirmButton: false,
                    timer: 1500
                });
            },
            success: res => {
                $('#rejectModal').modal('hide');
                Swal.fire({
                    position: 'center',
                    type: 'success',
                    title: 'Đã từ chối',
                    showConfirmButton: false,
                    timer: 1500
                });

                $table.bootstrapTable('refresh', { silent: true });
            }
        });
    } else {
        e.stopPropagation();
    }
});

$('#approveForm').submit(function(e) {
    e.preventDefault();

    if (this.checkValidity()) {
        e.preventDefault();
        
        Swal.showLoading();

        let id = getIdSelections()[0];
        let tags = $('#inputTag').tagsinput('items');
        let date = new Date($('#datetimePicker').datepicker('getDate'));
        let data = {
            draftID: id,
            categoryID: $('#selectCategory option:selected').val(),
            tags: JSON.stringify(tags),
            publicationDate: date
        };
        console.log(data);
    
        $.ajax({
            url: '/editor/approve-draft/approve',
            method: 'post',
            data: data,
            error: err => {
                console.log(err);
                Swal.fire({
                    position: 'center',
                    type: 'error',
                    title: 'Lỗi',
                    showConfirmButton: false,
                    timer: 1500
                });
            },
            success: res => {
                $('#approveModal').modal('hide');
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
    } else {
        e.stopPropagation();
    }
});

function formatDate(date) {
    var day = date.getDate().toString();
    day = day.length > 1 ? day : '0' + day;

    var month = (1 + date.getMonth()).toString();
    month = month.length > 1 ? month : '0' + month;
  
    var year = date.getFullYear();
    
    return day + '-' + month + '-' + year;
}