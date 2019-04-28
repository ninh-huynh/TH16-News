$(function () {
    $('#header').load('./reuse-html/header.html');
    $('#category-menu').load('./reuse-html/menu-bar.html');
    $('#footer').load('./reuse-html/footer.html');
    $('#context-menu').hide();

    $('table tbody').bind("contextmenu", 'tr', function(e) {
        $('#context-menu').show();
        $("#context-menu").offset({left:e.pageX, top:e.pageY});
        e.preventDefault();
    });

    $(document).bind("click", function(e) {
        $('#context-menu').hide();
    });
    $('#context-menu').bind("click", function(e) {
        $('#context-menu').hide();
    });

    loadTable();
});

function loadTable() {
    var categories = [
        ['Thời sự', 'Chính trị', 'Giao thông', 'Đô thị'],
        ['Thế giới', 'Quân sự', 'Tư liệu', 'Phân tích', 'Người Việt 4 phương'],
        ['kinh doanh', 'bất động sản', 'hàng không', 'tài chính', 'doanh nhân', 'tiêu dùng'],
        ['công nghệ', 'mobile', 'AI', 'smartHome', 'startup'],
        ['thể thao', 'thể thao Việt Nam', 'thể thao Thế giới', 'bóng đá Việt Nam'],
        ['sao Việt', 'sao châu Á', 'sao Hollywood'],
        ['sức khỏe', 'làm đẹp', 'khỏe đẹp mỗi ngày', 'giới tính'],
        ['giáo dục', 'tuyển sinh 2019', 'du học', 'chọn nghề', 'chọn trường']
    ]

    for (var i = 0; i < categories.length; i++) {
        var category = categories[i][0];
        
        var row = $($('#table-row-template')[0].innerHTML);
        row.attr("id", "row-" + (i + 1));
        row.attr('data-target', '.child-row-' + (i + 1));
        row.find('.category-name').text(category);

        $('#table-content').append(row);
        
        // add sub-categories row
        for (var j = 1; j < categories[i].length; j++) {
            var subCategory = categories[i][j];
                
            var childRow = $($('#table-child-row-template')[0].innerHTML);
            childRow.addClass("child-row-" + (i + 1));
            childRow.find('.category-name').text(subCategory);

            $('#table-content').append(childRow);
        }

    }
}

// $('.table-hover tbody tr td').hover(function() {
//     $(this).find('.item .visible-on-hover').removeClass('d-none').addClass('d-block');
// }, function() {
//     $('.visible-on-hover').removeClass('d-block').addClass('d-none');
// });
