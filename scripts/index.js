/* eslint-disable no-undef */
$(function () {
    $('#header').load('./reuse-html/header.html');
    $('#category-menu').load('./reuse-html/menu-bar.html', () => {
        $('#home').addClass('active');

        $('#search-btn').click(function () {

            if ($('#input-search').val() != '') {
                SendKeyWordToServer($('#input-search').val());
                $('#search-form').submit();
                return;
            }

            // jQuery ko hỗ trợ mặc định cho animate visibility <-> hidden
            // phải set thủ công property trong css
            const animateSpeed = 500;
            if ($('#input-search').css('visibility') === 'hidden') {
                $('#input-search').css('visibility', 'visible')
                    .animate({ opacity: 1}, animateSpeed)
                    .focus();
            } else {
                $('#input-search').animate({ opacity: 0 }, animateSpeed, () => {
                    $('#input-search').css('visibility', 'hidden');
                });
            }
        });

        $('#input-search').on('search', function () {
            SendKeyWordToServer($('#input-search').val());
        });
    });
    $('#footer').load('./reuse-html/footer.html');
});

function SendKeyWordToServer(keyword) { 
    alert('Đang tìm kiếm ' + keyword);
}
