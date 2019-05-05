var $table = $('#table');
var tableData = [];

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
    const nData = 30;
    for (var i = 0; i < nData; i++) {
        tableData.push({
            'id': i + 1,
            'name': 'Nhãn ' + (i + 1)
        });
    }
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

    columns: [{field: 'state', checkbox: true, align: 'center', valign: 'middle', width: '5%', }, 
            { field: 'id', title: 'ID', align: 'center', valign: 'middle', sortable: true,  width: '5%'}, 
            {  field: 'name', title: 'Tên Nhãn', align: 'center',  valign: 'middle', formatter: nameFormatter, sortable: true, }],
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

    $table.bootstrapTable('remove', {
        field: 'id',
        values: ids
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
    $('#addOrEditTagForm').find('button').text('Thêm');
    $('#inputTagName').val("");
    $("#addOrEditTagForm").removeClass('was-validated').attr('novalidate', '');
    $('#addOrEditTagModal').modal('show');
})

// edit tag
$('#edit').on('click', function() {
    var id = getIdSelections();
    editTag(id[0] - 1);
})

function editTag(index) {
    let row = $table.bootstrapTable('getData', true)[index];
    $('#inputTagName').val(row.name);
    $("#addOrEditTagForm").removeClass('was-validated').attr('novalidate', '');
    $('#addOrEditTagModal').modal('show');
}

$("#addOrEditTagForm").submit( function(e) {
    e.preventDefault();    

    //if($(this).valid()) {
    if (this.checkValidity()) {
        e.preventDefault();
        if ($('#addOrEditTagForm').find('button').text().toUpperCase() === 'OK') {     // Cập nhật
            var ids = getIdSelections();
            var index = ids[0] - 1;
            let row = $table.bootstrapTable('getData', true)[index];
            row.name = $('#inputTagName').val();
            $table.bootstrapTable('updateRow', {index: index, row: row});

            for (var i = 0; i < ids.length; i++) {
                $table.bootstrapTable('updateCellById', {id: ids[i], field: 'state', value: false});
            }
        }
        else {      // Thêm mới
            var row = {
                'id': $table.bootstrapTable('getData').length + 1,
                'name': $('#inputTagName').val()
            }
            $table.bootstrapTable('append', [row]);
            tableData.push(row);
        }
       $('#addOrEditTagModal').modal('hide');
    } else {
        e.preventDefault();
        e.stopPropagation();
    }
});
