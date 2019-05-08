var $table = $('#table');
var tableData = [
    {id: 1, article: {title: 'bài  viết 1', href: '#', category: 'tài chính', tags: ['giá vàng', 'tài chính'] }, author: 'tác giả 1', },
    {id: 2, article: {title: 'bài  viết 2', href: '#', category: 'giới tính', tags: ['giới tính', 'dậy thì'] }, author: 'tác giả 2', },
    {id: 3, article: {title: 'bài  viết 3', href: '#', category: 'du học', tags: ['du học', 'học tập'] }, author: 'tác giả 3', },
    {id: 4, article: {title: 'bài  viết 4', href: '#', category: 'mobile', tags: ['smartphone', 'di động'] }, author: 'tác giả 4', },
    {id: 5, article: {title: 'bài  viết 5', href: '#', category: 'phân tích', tags: ['phân tích', 'đánh giá'] }, author: 'tác giả 5', },
    {id: 6, article: {title: 'bài  viết 6', href: '#', category: 'hàng không', tags: ['hàng không', 'giao thông'] }, author: 'tác giả 6', },
    {id: 7, article: {title: 'bài  viết 7', href: '#', category: 'quân sự', tags: ['quân sự', 'hạt nhân', 'khủng bố'] }, author: 'tác giả 7', },
    {id: 8, article: {title: 'bài  viết 8', href: '#', category: 'tư liệu', tags: ['lịch sử', 'di tích'] }, author: 'tác giả 8', },
    {id: 9, article: {title: 'bài  viết 9', href: '#', category: 'giao thông', tags: ['giao thông', 'tai nạn', 'luật giao thông'] }, author: 'tác giả 9', },
    {id: 10, article: {title: 'bài  viết 10', href: '#', category: 'đô thị', tags: ['quy hoạch', 'đô thị'] }, author: 'tác giả 10', }
];

const statuses = ['đã xuất bản', 'đã được duyệt & chờ xuất bản'];

const categories = [
    ['Thời sự', 'Chính trị', 'Giao thông', 'Đô thị'],
    ['Thế giới', 'Quân sự', 'Tư liệu', 'Phân tích', 'Người Việt 4 phương'],
    ['kinh doanh', 'bất động sản', 'hàng không', 'tài chính', 'doanh nhân', 'tiêu dùng'],
    ['công nghệ', 'mobile', 'AI', 'smartHome', 'startup'],
    ['thể thao', 'thể thao Việt Nam', 'thể thao Thế giới', 'bóng đá Việt Nam'],
    ['sao Việt', 'sao châu Á', 'sao Hollywood'],
    ['sức khỏe', 'làm đẹp', 'khỏe đẹp mỗi ngày', 'giới tính'],
    ['giáo dục', 'tuyển sinh 2019', 'du học', 'chọn nghề', 'chọn trường']];

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

    // approve modal
    for (var i = 0; i < categories.length; i++) {
        $('#selectParentCategory').append($('<option>', {
            value: categories[i][0].toLowerCase(),
            text: categories[i][0].substr(0, 1).toUpperCase() + categories[i][0].substr(1),
        }));
    }

    $('#datetimePicker').datepicker({
        format: 'dd-mm-yyyy',
        startDate: new Date(),
        autoclose: true,
        clearBtn: true,
    });
});

function getIdSelections() {
    return $.map($table.bootstrapTable('getSelections'), function (row) {
        return row.id
    })
}

function articleFormatter(value, row, index) {
    return [
        '<a href="' + value.href + '" target="_blank">' + value.title.substr(0, 1).toUpperCase() + value.title.substr(1) + '</a>'
    ].join('');
}

function nameFormatter(value, row) {
    value = value.substr(0,1).toUpperCase() + value.substr(1);
    return value;
}

function statusFormatter(value, row, index) {
    if (value.toLowerCase() === 'đã được duyệt & chờ xuất bản'.toLowerCase()) {
        var html = [`
            <select class='form-control category-dropdown-menu' style='text-align: center; text-align-last: center;' >
        `];

        for (var i = 0; i < statuses.length; i++) {
            html += '<option value="' + statuses[i] + '"';
            if (value.toLowerCase() === statuses[i].toLowerCase()) {
                html += ' selected="selected" ';
            }
            html += '>' + statuses[i].substr(0, 1).toUpperCase() + statuses[i].substr(1) + '</option>';
        }
        html += '</select>';

        return html;
    }
    else {
        return value;
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
    //filter

    columns: [{field: 'state', checkbox: true, align: 'center', valign: 'middle', width: '5%', }, 
            { field: 'id', title: 'ID', align: 'center', valign: 'middle', sortable: true,  width: '5%'}, 
            {  field: 'article', title: 'Bài viết', align: 'center',  valign: 'middle', formatter: articleFormatter, sortable: true, },
            {  field: 'author', title: 'Tác giả', align: 'center',  valign: 'middle', width: '20%', formatter: nameFormatter, sortable: true, }],
    data: tableData,
        })
    }

    $table.on('check.bs.table uncheck.bs.table ' +
    'check-all.bs.table uncheck-all.bs.table',
    function () {
    var selections = $table.bootstrapTable('getSelections');
    $('#refuseBtn').prop('disabled', selections.length != 1);
    $('#approveBtn').prop('disabled', selections.length != 1);

    // save your data, here just save the current page
    var idSelections = getIdSelections()
    // push or splice the selections if you want to save all data selections
})

$table.on('all.bs.table', function (e, name, args) {

})

// refuse event
$('#refuseBtn').on('click', function () {

});

function refuse() {
    $("#refuseForm").removeClass('was-validated').attr('novalidate', '');
    $('#inputReason').val('');
    $('#refuseModal').modal('show');
}

// approve event
$('#approveBtn').on('click', function() {
    approve();
})

function approve() {
    let id = getIdSelections()[0];
    let row = $table.bootstrapTable('getRowByUniqueId', id);
    
    let article = row.article;
    let tags = article.tags;
    let filled = false;
    // fill category
    $('#selectCategory').empty();
    for (var i = 0; i < categories.length && !filled; i++) {
        for (var j = 0; j < categories[i].length && !filled; j++) {
            
            // set selected parent category
            if (categories[i][j].toLowerCase() === article.category.toLowerCase()) {
                console.log(categories[i][0]);
                $('#selectParentCategory option[selected="selected"]').attr('selected', '');
                $('#selectParentCategory option[value="' + categories[i][0].toLowerCase() + '"]').attr('selected', 'selected');

                // fill & set selected categoryy
                for (var index = 1; index < categories[i].length; index++) {
                    $('#selectCategory').append($('<option>', {
                        value: categories[i][index].toLowerCase(),
                        text: categories[i][index].substr(0, 1).toUpperCase() + categories[i][index].substr(1),
                    }));
                }

                $('#selectCategory option[selected="selected"]').attr('selected', '');
                $('#selectCategory option[value="' + article.category.toLowerCase() + '"]').attr('selected', 'selected');

                filled = true;
            }            
        }
    }
    
    // fill tag
    $('#editTags').empty();
    $.each(tags, function(index, value) {
        $('#editTags').append(value + '; ')
    })
    $("#approveForm").removeClass('was-validated').attr('novalidate', '');
    $('#approveModal').modal('show');
}
          
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
    $('#refuseItem').click( function(e) {
        var selectionIds = getIdSelections();

        if (selectionIds.length > 0) {
            for (var i = 0; i < selectionIds.length; i++) {
                $table.bootstrapTable('updateCellById', {id: selectionIds[i], field: 'state', value: false});
            }
        }
        
        $table.bootstrapTable('updateCellById', {id: dataIndex + 1, field: 'state', value: true});
        refuse();
    });

    $('#approveItem').click( function(e) {
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
$('#refuseForm').submit(function(e) {
    e.preventDefault();

    if (this.checkValidity()) {
        var ids = getIdSelections();

        $table.bootstrapTable('remove', {
            field: 'id',
            values: ids
        })
        $('#refuseBtn').prop('disabled', true);
        $('#approveBtn').prop('disabled', true);
        $('#refuseModal').modal('hide');
    } else {
        e.stopPropagation();
    }
})

$('#approveForm').submit(function(e) {
    e.preventDefault();

    if (this.checkValidity()) {
        var ids = getIdSelections();

        $table.bootstrapTable('remove', {
            field: 'id',
            values: ids
        })
        $('#refuseBtn').prop('disabled', true);
        $('#approveBtn').prop('disabled', true);
        $('#approveModal').modal('hide');
    } else {
        e.stopPropagation();
    }
})