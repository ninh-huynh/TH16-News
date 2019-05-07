const ARTICLE_STATUS = {
    published : {
        label: 'đã xuất bản',
        color: 'limegreen',
    },
    refused : {
        label: 'bị từ chối',
        color: 'red',
    },
    pending_approval: {
        label: 'đang chờ duyệt',
        color: 'gold',
    },
    pending_publish: {
        label: 'đã được duyệt & chờ xuất bản',
        color: 'orange',
    }
}

var $table = $('#table');
var tableData = [
    {id: 1, article: {title: 'Hot girl Trâm Anh tiếp tục bị cắt sóng khỏi game show trên VTV', 
        href: '../Hot-girl-Tram-Anh-tiep-tuc-bi-cat-song-khoi-game-show-tren-VTV.html' }, 
        category: 'Giải trí', publish_date: "1-1-2019", status: ARTICLE_STATUS.published.label},
    {id: 2, article: {title: 'Cãi nhau với vợ xong, con rể sang đốt nhà bố vợ cháy rụi', 
        href: '#' }, 
        category: 'Thể thao', publish_date: "", status: ARTICLE_STATUS.pending_publish.label},
    {id: 3, article: {title: 'Tuyển LMHT PVB của Việt Nam phải tranh vé vớt ngay trên sân nhà', 
        href: '../edit-post/' }, 
        category: 'Thể thao', publish_date: "", status: ARTICLE_STATUS.refused.label },
    {id: 4, article: {title: 'Sài Gòn nóng hầm hập đến 21h do đảo nhiệt đô thị', 
        href: '../sai-Gon-nong-ham-hap-den-21h-do-dao-nhiet-do-thi.html' }, 
        category: 'Thời sự', publish_date: "4-4-2019", status: ARTICLE_STATUS.published.label},
    {id: 5, article: {title: 'Tỷ phú Jeff Bezos đã giàu lại càng giàu hơn nhờ cổ phiếu Uber', 
        href: '#' }, 
        category: 'Kinh doanh  ', publish_date: "", status: ARTICLE_STATUS.pending_approval.label},
    {id: 6, article: {title: 'Triều Tiên thử tên lửa: Kịch bản cũ và bước ngoặt chiến lược', 
        href: '#' }, 
        category: 'Thế giới', publish_date: "", status: ARTICLE_STATUS.pending_publish.label},
    {id: 7, article: {title: 'Siêu anh hùng Marvel không viễn tưởng, họ chỉ đưa khoa học tiến xa hơn', 
        href: '../sieu-anh-hung-Marvel-khong-vien-tuong-ho-chi-dua-khoa-hoc-tien-xa-hon.html' }, 
        category: 'Giải trí', publish_date: "7-7-2019", status: ARTICLE_STATUS.published.label},
    {id: 8, article: {title: 'Huyền thoại MU chỉ ra sai lầm chuyển nhượng của đội nhà', 
        href: '#' }, 
        category: 'Thể thao', publish_date: "5-4-2019", status: ARTICLE_STATUS.published.label},
    {id: 9, article: {title: 'YouTube "nuôi" kênh bẩn nhờ dòng tiền từ doanh nghiệp Việt Nam', 
        href: '../edit-post/' }, 
        category: 'Giải trí', publish_date: "", status: ARTICLE_STATUS.refused.label},
    {id: 10, article: {title: 'Loạt smartphone giảm giá mạnh dịp 30/4', 
        href: '../Loat-smartphone-giam-gia-manh-dip-30-4.html' }, 
        category: 'Công nghệ', publish_date: "10-10-2019", status: ARTICLE_STATUS.published.label},
    {id: 11, article: {title: '13,3 tỷ năm lịch sử vũ trụ "thu bé" lại trong bức ảnh này', 
        href: '../13-3-ty-nam-lich-su-vu-tru-thu-be-lai-trong-buc-anh-nay.html' }, 
        category: 'Thời sự', publish_date: "10-10-2019", status: ARTICLE_STATUS.published.label},
    {id: 12, article: {title: 'Từ cậu bé mồ côi ốm yếu đến thiên tài Isaac Newton', 
        href: '../Tu-cau-be-mo-coi-om-yeu-den-thien-tai-Isaac-Newton.html' }, 
        category: 'Giáo dục', publish_date: "10-10-2019", status: ARTICLE_STATUS.published.label}
];

var statuses = ['đã xuất bản', 'đã được duyệt & chờ xuất bản'];

$(function () {
    var html = [];
    // context menu
    $('#context-menu').hide();

    // table
    mounted();  
});

function getIdSelections() {
    return $.map($table.bootstrapTable('getSelections'), function (row) {
        return row.id
    })
}

function articleFormatter(value, row, index) {
    var html;
    if (row.status.toLowerCase() === ARTICLE_STATUS.published.label.toLocaleLowerCase()) { // đã xuất bản
        html = '<a href="' + value.href + '" target="_blank">' + value.title.substr(0, 1).toUpperCase() + value.title.substr(1) + '</a>';
    } else {
        html = value.title;
    }

    return html;
}

function categoryFormatter(value, row) {
    value = value.substr(0,1).toUpperCase() + value.substr(1);
    return value;
}

function statusFormatter(value, row, index, field) {
    var color;
    value = value.toLowerCase();
    $.each(ARTICLE_STATUS, function(key, status) {
        if (status.label.toLowerCase() === value) {
            color = status.color;
            return;
        }
    });

    value = value.substr(0, 1).toUpperCase() + value.substr(1);

    return '<font class="font-weight-bold" color="' + color + '">' + value + '</font>';
}

function checkFormatter(value, row, index, field) {
    if (row.status.toLocaleLowerCase() !== ARTICLE_STATUS.refused.label.toLowerCase()) {
        return { disabled: true, };
    }

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
    checkboxHeader: false,
    // extension
    stickyHeader: true,
    stickyHeaderOffsetY: 56,
    showJumpto: true,
    searchAccentNeutralise: true,
    //filter
    filterControl: true,
    filterShowClear: true,

    columns: [{field: 'state', checkbox: true, align: 'center', valign: 'middle', width: '5%', formatter: checkFormatter, }, 
            { field: 'id', title: 'ID', align: 'center', valign: 'middle', sortable: true,  width: '5%'}, 
            {  field: 'article', title: 'Bài viết', align: 'left',  valign: 'middle', formatter: articleFormatter, sortable: true, },
            {  field: 'category', title: 'Chuyên mục', align: 'center',  valign: 'middle', width: '20%', formatter: categoryFormatter, sortable: true, filterControl: 'select', },
            {  field: 'publish_date', title: 'Ngày xuất bản', align: 'center',  valign: 'middle', width: '15%', sortable: true,},
            {  field: 'status', title: 'Trạng thái', align: 'center',  valign: 'middle', width: '20%', formatter: statusFormatter, sortable: true, filterControl: 'select'}],
    data: tableData,
        })
    }

    $table.on('check.bs.table uncheck.bs.table ' +
    'check-all.bs.table uncheck-all.bs.table',
    function () {
    var selections = $table.bootstrapTable('getSelections');
    $('#editBtn').prop('disabled', selections.length != 1);

    // save your data, here just save the current page
    var idSelections = getIdSelections()
    // push or splice the selections if you want to save all data selections
})

$table.on('all.bs.table', function (e, name, args) {

})

$table.on('click-row.bs.table', function(event, row, $element, field) {
    if (row.status.toLowerCase() !== 'bị từ chối'.toLowerCase()) {
        $('#editBtn').prop('disabled', true);
        $table.bootstrapTable('updateCellById', {id: row.id, field: row.state, value: false});
    }
});

$('#editBtn').on('click', function () {
    var row = $table.bootstrapTable('getRowByUniqueId', getIdSelections()[0]);
    win = window.open(row.article.href, '_blank');
})
          
function mounted() {
    initTable()
}

// context-menu event (row clicking)
$('#table').on('contextmenu', 'tr',  function(e) {
    
    let dataIndex = parseInt($(this).attr('data-index'), 10);
    let row = $table.bootstrapTable('getData', true)[dataIndex];

    if (row.status.toLowerCase() !== 'bị từ chối'.toLowerCase()) {
        return;
    }
    let ids;
    ids = getIdSelections();
    for (var i = 0; i < ids.length; i++) {
        $table.bootstrapTable('updateCellById', {id: ids[i], field: 'state', value: false});
    }
    $table.bootstrapTable('updateCellById', {id: row.id, field: 'state', value: true});

    $('#context-menu').show();
    $("#context-menu").offset({left:e.pageX, top:e.pageY});
    e.preventDefault();
});

// item click handler
// remove event handler
$('#editItem').on('click', function(e) {
    var row = $table.bootstrapTable('getRowByUniqueId', getIdSelections()[0]);
    if (row.status.toLowerCase() === 'bị từ chối'.toLowerCase()) {
        win = window.open(row.article.href, '_blank');
    }
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