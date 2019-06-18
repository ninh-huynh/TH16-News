// https://stackoverflow.com/questions/7131909/facebook-callback-appends-to-return-url
if (window.location.hash && (window.location.hash == '#_=_' || window.location.hash == '#')) {
    if (window.history && history.pushState) {
        window.history.pushState('', document.title, window.location.pathname);
    } else {
        // Prevent scrolling by storing the page's current scroll offset
        var scroll = {
            top: document.body.scrollTop,
            left: document.body.scrollLeft
        };
        window.location.hash = '';
        // Restore the scroll offset, should be flicker free
        document.body.scrollTop = scroll.top;
        document.body.scrollLeft = scroll.left;
    }
}

$('.page-item').click(function () {
    if (! $(this).hasClass('disabled'))
    {
        var direction = $(this).attr('data-direction');
        var parent = $(this).parent().parent().parent().parent();
        var parentID = parent.attr('id');

        //debug only
        console.log(parentID + ' ' + direction + ' clicked!');

        parent.find('.page-1').toggleClass('d-none');
        parent.find('.page-2').toggleClass('d-none');

        if ($(this).attr('data-direction') === 'prev') {
            $(this).addClass('disabled');
            $(this).next().removeClass('disabled');
        } else if ($(this).attr('data-direction') === 'next') {
            $(this).addClass('disabled');
            $(this).prev().removeClass('disabled');
        }
    }
});

$.fn.tagcloud.defaults = {
    size: { start: 0.9, end: 1.5, unit: 'em' },
    color: { start: '#343a40', end: '#343a40' }
};

$(function () {
    $('#tags-cloud-content a').tagcloud();
});