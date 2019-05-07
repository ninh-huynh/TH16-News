$(function () {

});

$("#thumbnail").click(function() {
    $("#replaceThumbnailButton").click();
});

function readURL(input) {

    if (($('#uploadThumbnailButton').is(input))) {
        
        $('#uploadThumbnailFormGroup').removeClass('d-flex').addClass('d-none');
        $('#displayThumbnailFormGroup').removeClass('d-none').addClass('d-flex');
    }

    if (input.files && input.files[0]) {
        var reader = new FileReader();

        reader.onload = function (e) {
            $('#thumbnail')
                .attr('src', e.target.result);
        };

        reader.readAsDataURL(input.files[0]);
    }
}

/* fill select list */
$('#selectCategory').change(function(event) {
    var values;

    switch($(this).val()) {
        case 'Thời sự':
            values = ['Chính trị', 'Giao thông', 'Đô thị'];
            break;

        case 'Thế giới':
            values = ['Quân sự', 'Tư liệu', 'Phân tích', 'Người Việt 4 phương'];
            break;

        case 'Kinh doanh':
            values = ['Bất động sản', 'Hàng không', 'Tài chính', 'Doanh nhân', 'Tiêu dùng'];
            break;

        case 'Công nghệ':
            values = ['Mobile', 'AI', 'SmartHome', 'Startup'];
            break;

        case 'Thể thao':
            values = ['Thể thao Việt Nam', 'Thể thao Thế giới', 'Bóng đá Việt Nam'];
            break;

        case 'Giải trí':
            values = ['Sao Việt', 'Sao Châu Á', 'Sao Hollywood'];
            break;

        case 'Sức khỏe':
            values = ['Làm đẹp', 'Khỏe đẹp mỗi ngày', 'Giới tính'];
            break;

        case 'Giáo dục':
            values = ['Tuyển sinh 2019', 'Du học', 'Chọn nghề', 'Chọn trường'];
            break;

        default:

    }

    $("#selectSubCategory").html('');
    for (var i = 0; i < values.length; i++) {
        $('#selectSubCategory').append('<option>' + values[i] + '</option>');
    }
    
});



// make sure CKEditor toolbar could not be overlapped by navbar
var myEditor;
$(window).on('load', function(){ 
    var navbarHeight = $('#category-menu > .navbar').outerHeight();

    ClassicEditor
        .create(document.querySelector('#editor'), {
            toolbar: {
                viewportTopOffset: navbarHeight, // category-menu height
            }
        })
        .catch(error => {
            console.error(error);
        });
});