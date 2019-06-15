
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