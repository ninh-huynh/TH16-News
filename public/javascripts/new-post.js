$(function () {
    $('#newPostForm').validate({
        rules: {
            title: {
                required: true,
                maxlength: 20,
                remote: {
                    url: '/check-title-available',
                    type: 'post',
                    data: {
                        title: function () {
                            return $('#inputTitle').val();
                        }
                    }
                }
            },

            category: {
                required: true
            },

            subCategory: {
                required: true
            },

            tag: {
                pattern: /[\w\s\d]+;/
            },

            inputAbstract: {
                required: true,
                maxlength: 50
            },

            editor: {
                required: true,
                maxlength: 1024
            }

        },
        messages: {
            title: {
                required: 'Thiếu tiêu đề',
                maxlength: 'Độ dài tiêu đề tối đa là 20 kí tự',
                remote: 'Đã có bài viết với tiêu đề này'
            },

            category: {
                required: 'Chưa chọn chuyên mục'
            },

            subCategory: {
                required: 'Chưa chọn chuyên mục con'
            },

            tag: {
                pattern: ''
            },

            inputAbstract: {
                required: 'Chưa có tóm tắt',
                maxlength: 'Nội dung vượt quá 50 kí tự'
            },

            editor: {
                required: 'Nội dung không được trống',
                maxlength: 'Nội dung không được vượt quá 1024 kí tự'
            }
        },
        errorClass: 'invalid',
        validClass: 'valid',
        highlight: function (element, errorClass, validClass) {
            $(element).addClass('is-invalid').removeClass('is-valid');
        },
        unhighlight: function (element, errorClass, validClass) {
            $(element).addClass('is-valid').removeClass('is-invalid');
        }
    });
});

$("#thumbnail").click(function () {
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
$('#selectCategory').change(function (event) {
    var values;

    switch ($(this).val()) {
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
$(window).on('load', function () {
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