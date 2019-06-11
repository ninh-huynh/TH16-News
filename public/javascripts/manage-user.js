var $table = $('#table');
var validator;
const formValidateOption = {
    rules: {
        roleID: 'required',
        name: 'required',
        email: {
            required: true,
            email: true,
            remote: {
                url: '/check-email-available',
                type: 'post',
                data: {
                    email: function () {
                        return $('#email').val();
                    }
                }
            }
        },
        dayOfBirth: {
            required: true
        }
    },
    messages: {
        roleID: 'Chưa chọn chức vụ',
        name: 'Hãy nhập đầy đủ họ và tên',
        email: {
            required: 'Hãy nhập địa chỉ email',
            email: 'Email không hợp lệ',
            remote: 'Email đã được sử dụng'
        },
        dayOfBirth: {
            required: 'Hãy nhập ngày sinh'
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
        addUserFormHandler(form);
        $('#addUserModal').modal('hide');
    },
};

const datePickerOption = {
    todayBtn: 'linked',
    clearBtn: true,
    language: 'vi',
    autoclose: true,
    orientation: 'bottom auto',
    todayHighlight: true
};

$(function () {
    $('.sidenav-badge').hide();

    // init table, form validator, datepicker
    initTable();
    $('#dayOfBirth').datepicker(datePickerOption);
    validator = $('#addUserForm').validate(formValidateOption);
});

function getIdSelections() {
    return $.map($table.bootstrapTable('getSelections'), function (row) {
        return row.id;
    });
}

function categoryFormatter(value, row, index, field) {
    if (value == null && row.role.toUpperCase() === 'Biên tập viên'.toUpperCase())
        return 'Chưa được phân';
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
        undefinedText: 'N/A',
        // extension
        stickyHeader: true,
        stickyHeaderOffsetY: 56,
        showJumpto: true,
        searchAccentNeutralise: true,
        //filter
        filterControl: true,
        filterShowClear: true,

        columns: [{ field: 'state', checkbox: true, align: 'center', valign: 'middle', width: '5%', },
            { field: 'id', title: 'ID', align: 'center', valign: 'middle', sortable: true, width: '5%' },
            { field: 'name', title: 'Tên', align: 'center', valign: 'middle', sortable: true, width: '40%', },
            //{ field: 'date', title: 'Ngày tạo', align: 'center', valign: 'middle', sortable: true, width: '20%', }, 
            { field: 'role', title: 'Vai trò', align: 'center', valign: 'center', sortable: true, width: '15%', filterControl: 'select' },
            { field: 'categoryManaged', title: 'Chuyên mục quản lý', align: 'center', valign: 'center', width: '15%', formatter: categoryFormatter }],
        //data: tableData,
        pageSize: 5,
        sidePagination: 'server',
        url: '/admin/users/load',
    });
}

$table.on('check.bs.table uncheck.bs.table ' +
    'check-all.bs.table uncheck-all.bs.table',
function () {
    var totalSelected = $table.bootstrapTable('getSelections').length;
    $('#remove').prop('disabled', !totalSelected);
    $('#edit').prop('disabled', totalSelected != 1);
});

$('#remove').click(function () {
    var ids = getIdSelections();
    ajaxDeleteUser(ids);
});

$('#add').click(function () {
    //get the form html DOM element, then clear entry form content
    $('#addUserForm')[0].reset();

    // remove green high light and red high light
    $('input').removeClass('is-valid').removeClass('is-invalid');

    // reset form validator
    validator.resetForm();

    $('#addUserModal').modal('show');
});

$('#edit').click(function (e) {
    var id = getIdSelections()[0];
    ajaxLoadEditUserForm({ id });
});

$('#table').on('post-body.bs.table', function (e, data) {
    // init context menu when the table body is rendered
    initContextMenu();
});

// Config context menu: icon, event click,...
function initContextMenu() {
    $('tbody').addClass('context-menu-one');

    $('.context-menu-one').contextMenu({
        selector: 'tr',
        callback: function (key, options) {
            let dataIndex = parseInt($(this).attr('data-index'), 10);
            let row = $table.bootstrapTable('getData', true)[dataIndex];
            let ids;

            ids = getIdSelections();
            if (ids.length === 0) {
                ids = [row.id,];
            }

            switch (key) {
                case 'edit':
                    ajaxLoadEditUserForm(row);
                    break;

                case 'delete':
                    ajaxDeleteUser(ids);
                    break;

                case 'assign':
                    ajaxLoadEditUserForm({id: row.id});
                    break;

                case 'renew':
                    var userEntity = {
                        id: row.id,
                        expiryDate: row.expiryDate,
                    };
                    ajaxRenewSubcriber(userEntity);
                    break;

                default:
                    break;
            }
        },
        items: {
            'edit': { name: 'Chỉnh sửa', icon: 'edit' },
            'delete': { name: 'Xóa', icon: 'delete' },
            'assign': {
                name: 'Phân công',
                icon: 'fas fa-marker',
                disabled: function (key, opt) {
                    let dataIndex = parseInt(opt.$trigger.attr('data-index'), 10);
                    let row = $table.bootstrapTable('getData', true)[dataIndex];
                    return row.role.toUpperCase() !== 'BIÊN TẬP VIÊN';
                },
            },
            'renew': {
                name: 'Gia hạn',
                icon: 'fas fa-hourglass-start',
                disabled: function (key, opt) {
                    let dataIndex = parseInt(opt.$trigger.attr('data-index'), 10);
                    let row = $table.bootstrapTable('getData', true)[dataIndex];
                    return row.role.toUpperCase() !== 'ĐỘC GIẢ';
                },
            }
        }
    });
}

/* Sidebar */
$('#mySidenav a').mouseenter(function () {
    $(this).find('.sidenav-after-icon').hide();
    $(this).find('.sidenav-badge').show();
});

$('#mySidenav a').mouseleave(function () {
    $(this).find('.sidenav-after-icon').show();
    $(this).find('.sidenav-badge').hide();
});

function addUserFormHandler(form) {
    const actionURL = '/admin/users/add';
    $.ajax({
        url: actionURL,
        type: 'post',
        data: $(form).serialize(),
    })
        .done(htmlString => {
            $('#alert-container').append(htmlString);
            $table.bootstrapTable('refresh');
        });
}

function ajaxDeleteUser(ids) {
    const actionURL = '/admin/users/delete';
    $.ajax({
        type: 'delete',
        url: actionURL,
        data: { ids: JSON.stringify(ids) },
    })
        .done(htmlString => {
            $('#alert-container').append(htmlString);
            $('#remove').prop('disabled', true);
            $table.bootstrapTable('refresh');
        });
}

function ajaxUpdateUser(userEntityOrFormEncoded) {
    const actionURL = '/admin/users/update';
    $.ajax({
        url: actionURL,
        type: 'post',
        data: userEntityOrFormEncoded,
    })
        .done(htmlString => {
            $('#alert-container').append(htmlString);
            $table.bootstrapTable('refresh');
        });
}

function ajaxLoadEditUserForm(userEntity) {
    var id = userEntity.id;
    const actionURL = `/admin/users/update/${id}`;
    $.ajax({
        url: actionURL,
        type: 'get',
    })
        .done(htmlString => {
            $('#updateUserModal-content').html(htmlString);
            $('#updateUserModal').modal('show');

            $('#updateUserForm').submit(function (event) {
                event.preventDefault();
                var formEncoded = $(this).serialize();
                ajaxUpdateUser(formEncoded);
                $('#updateUserModal').modal('hide');
            });
        });
}

function ajaxRenewSubcriber(userEntity) {
    const actionURL = '/admin/users/renew';
    $.ajax({
        url: actionURL,
        type: 'post',
        data: userEntity,
    })
        .done(htmlString => {
            $('#alert-container').append(htmlString);
            $table.bootstrapTable('refresh');
        });
}