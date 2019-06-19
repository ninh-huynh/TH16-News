var ARTICLE_ID;

$('#thumbnail').click(function() {
    $('#replaceThumbnailButton').click();
});

function readURL(input) {
    
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
    let categories;
    let id = $('#selectCategory option:selected').val();

    $.ajax({
        url: '/writer/edit-post/category/' + id,
        method: 'get',
        error: err => {
            console.log(err);
        },
        success: res => {
            categories = res;
            let $selectCateogry = $('#selectSubCategory');
            $($selectCateogry).empty();
            categories.forEach(category => {
                $selectCateogry.append($('<option>', {
                    value: category.id,
                    text: category.name
                }));
            });
        }
    });
  
});


$(function() {

    'use strict';
    
    window.addEventListener('load', function() {
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
    }, false);
});

// make sure CKEditor toolbar could not be overlapped by navbar
var editor;
$(window).on('load', function(){ 
    Swal.showLoading();

    $.ajax({
        url: window.location.href + '/load',
        method: 'get',
        error: err => {
            console.log(err);
            Swal.close();
        },
        success: res => {
            console.log(res);
            let article = res.article;
            let parentCategories = res.parentCategories;
            let categories = res.categories;
            let tags = article.tags;
            ARTICLE_ID = article.id;

            // title
            $('#inputTitle').val(article.title);

            // tag
            tags.forEach(tag => {
                console.log(tag);
                $('#inputTag').tagsinput('add', tag.name);
            });

            // parent category
            let $selectParentCateogry = $('#selectCategory');
            parentCategories.forEach(category => {
                $selectParentCateogry.append($('<option>', {
                    value: category.id,
                    text: category.name
                }));
            });
            $($selectParentCateogry).find(`option[value=${ article.category.parent.id }]`).attr('selected', 'selected');

            // child category
            let $selectCateogry = $('#selectSubCategory');
            categories.forEach(category => {
                console.log(category);
                $selectCateogry.append($('<option>', {
                    value: category.id,
                    text: category.name
                }));
            });
            $($selectCateogry).find(`option[value=${ article.category.id }]`).attr('selected', 'selected');

            // cover image
            $('#thumbnail').attr('src', article.coverImageURL);
            $('#uploadThumbnailFormGroup').removeClass('d-flex').addClass('d-none');
            $('#displayThumbnailFormGroup').removeClass('d-none').addClass('d-flex');

            // summary
            $('#inputAbstract').val(article.summary);


            // content
            var navbarHeight = $('#category-menu > .navbar').outerHeight();

            ClassicEditor
                .create(document.querySelector('#editor'), {
                    toolbar: {
                        viewportTopOffset: navbarHeight, // category-menu height
                    }
                })
                .then(e => {
                    e.setData(article.content);
                    editor = e; 
                })
                .catch(error => {
                    console.error(error);
                });

            Swal.close();
        }
    });
});

$('#editPostForm').submit(function (e) {
    if (this.checkValidity()) {
        e.preventDefault();
        Swal.showLoading();
        let tags = $('#inputTag').tagsinput('items');
        var data = new FormData(this);
        data.set('tags', JSON.stringify(tags));
        data.set('content', editor.getData());
        data.set('summary', $('#inputAbstract').val());
        data.set('id', ARTICLE_ID);
        if ($('#inputAbstract').val() && $('#inputAbstract').val().indexOf('https') !== -1) {
            console.log('no file');
            data.append('thumbnail', $('#thumbnail').attr('src'));
        } else {
            console.log('file');
            data.append('thumbnail', $('#replaceThumbnailButton')[0].files[0]);
        }
        
        for (var pair of data.entries()) {
            console.log(pair[0]+ ': ' + pair[1]); 
        }
        $.ajax({
            url: '/writer/edit-post',
            method: 'post',
            data: data,
            cache: false,
            contentType: false,
            processData: false,
            error: err => {
                Swal.fire({
                    position: 'center',
                    type: 'error',
                    title: 'err',
                    showConfirmButton: false,
                    timer: 1500
                });

                
            },
            success: res => {
                Swal.fire({
                    position: 'center',
                    type: 'success',
                    title: 'Cập nhật thành công',
                    showConfirmButton: false,
                    timer: 1500
                });

            }
        });
    } else {
        console.log('false');
    }
});