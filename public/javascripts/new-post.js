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

            childCategory: {
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

            childCategory: {
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
        },
        submitHandler: (form) => {
            ajaxNewPostSubmitHandler(form);
        }
    });

    //fill category select
    $.ajax({
        url: '/writer/new-post/category',
        method: 'get',
        error: err => console.log(err),
        success: res => {
            console.log(res);

            let parentCategories = res;
            let $selectParentCategory = $('#selectCategory');
            parentCategories.forEach((parentCategory, index) => {
                parentCategory.name = parentCategory.name.substr(0,1).toUpperCase()+parentCategory.name.substr(1);
                $($selectParentCategory).append($('<option>', { 
                    value: parentCategory.id,
                    text : parentCategory.name,
                }));   
            });
        }
    });
});

$('#thumbnail').click(function () {
    $('#replaceThumbnailButton').click();
});

function readURL(input) {
    console.log(input);
    console.log($(input));
    if (($('#uploadThumbnailButton').is(input))) {

        $('#uploadThumbnailFormGroup').removeClass('d-flex').addClass('d-none');
        $('#displayThumbnailFormGroup').removeClass('d-none').addClass('d-flex');
    }

    if (input.files && input.files[0]) {
        let data = new FormData();
        data.append('file', input.files[0]);
        console.log(input.files[0]);
        $.ajax({
            url: '/writer/new-post/test',
            method: 'post',
            data: data,
            cache: false,
            contentType: false,
            processData: false,
            error: err => console.log(err),
            success: res => {
                console.log(res);
            }
        });
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
    console.log($(this).val());

    $.ajax({
        url: `/writer/new-post/category/${ $(this).val() }`,
        method: 'get',
        error: err => console.log(err),
        success: res => {
            let categories = res;
            let $selectChildCateogry = $('#selectChildCategory');

            $($selectChildCateogry).empty();
            categories.forEach(category => {
                category.name = category.name.substr(0,1).toUpperCase() + category.name.substr(1);
                $($selectChildCateogry).append($('<option>', { 
                    value: category.id,
                    text : category.name,
                }));   
            });
        }
    });
});

// make sure CKEditor toolbar could not be overlapped by navbar
var editor;
$(window).on('load', function () {
    var navbarHeight = $('#category-menu > .navbar').outerHeight();

    editor = ClassicEditor
        .create(document.querySelector('#editor'), {
            toolbar: {
                viewportTopOffset: navbarHeight, // category-menu height
            }
        })
        .catch(error => {
            console.error(error);
        });
});

function ajaxNewPostSubmitHandler(form) {
    
    // let file = $(form).find('#uploadThumbnailButton')[0].files[0];
    // var data = new FormData($('#newPostForm')[0]);
    // //data.append(file.name, file);
    // console.log(file);
    // console.log(data);

    // for(var pair of data.entries()) {
    //     console.log(pair[0]+', '+pair[1]);
    // }



}