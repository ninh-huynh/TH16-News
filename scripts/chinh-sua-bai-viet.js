

$(function () {
    $('#header').load('./reuse-html/header.html');
    $('#category-menu').load('./reuse-html/menu-bar.html');
    $('#footer').load('./reuse-html/footer.html');
});

$("#thumbnail").click(function() {
    $("#replaceThumbnailButton").click();
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

var value;
$(function(){
    value = `<h2>The three greatest things you learn from traveling</h2>
    <p>Like all the great things on earth traveling teaches us by example. 
        Here are some of the most precious lessons I’ve learned over the years 
        of traveling.</p>
    <figure class="media ck-widget" contenteditable="false">
        <div class="ck-media__wrapper" 
        data-oembed-url="https://www.youtube.com/watch?v=BLJ4GKKaiXw">
            <div style="position: relative; padding-bottom: 100%; height: 0; 
                padding-bottom: 56.2493%;">
                <iframe src="./Đăng bài_files/BLJ4GKKaiXw.html" 
                    style="position: absolute; width: 100%; height: 100%; top: 0; left: 0;" 
                    frameborder="0" allow="autoplay; encrypted-media" allowfullscreen="">
                </iframe>
            </div>
        </div>
    </figure>

    <h3>Appreciation of diversity</h3>
    <p>Getting used to an entirely different culture can be challenging. 
        While it’s also nice to learn about cultures online or from books, nothing comes 
        close to experiencing cultural diversity in person. You learn to appreciate each 
        and every single one of the differences while you become more culturally fluid.</p>
    <blockquote><p>The real voyage of discovery consists not in seeking new landscapes, 
        but having new eyes.</p><p><strong>Marcel Proust</strong></p></blockquote>

        <h3>Improvisation</h3>
    <p>Life doesn't allow us to execute every single plan perfectly. This especially 
        seems to be the case when you travel. You plan it down to every minute with a b
        ig checklist; but when it comes to executing it, something always comes up and 
        you’re left with your improvising skills. You learn to adapt as you go. Here’s how 
        my travel checklist looks now:</p>
    <ul>
        <li>buy the ticket</li>
        <li>start your adventure</li>
    </ul>
    <figure class="image ck-widget image-style-side" contenteditable="false">
        <img src="https://ckeditor.com/assets/images/bg/umbrellas-e935d5c582.jpg" alt="Three Monks walking on ancient temple.">
        <figcaption class="ck-editor__editable ck-editor__nested-editable" 
            data-placeholder="Enter image caption" contenteditable="true">
            Leaving your comfort zone might lead you to such beautiful sceneries like this one.</figcaption>
    </figure>

    <h3>Confidence</h3>
    <p>Going to a new place can be quite terrifying. While change and uncertainty makes 
        us scared, traveling teaches us how ridiculous it is to be afraid of something 
        before it happens. The moment you face your fear and see there was nothing to be 
        afraid of, is the moment you discover bliss.</p>`
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
        .then(editor => {
            editor.setData(value);
        })
        .catch(error => {
            console.error(error);
        });
});