$(function () {
    var keyword = $('#key-word').text();

    // currentContent là 1 string
    $('p.article-summary').html((index, currentContent) => {
        var regex = new RegExp(`${keyword}`);
        var newSubStr = `<em>${keyword}</em>`;
        var replacedHtml = currentContent.replace(regex, newSubStr);
        return replacedHtml;
    });

    $('a.article-title').html((index, currentContent) => {
        var regex = new RegExp(`${keyword}`);
        var newSubStr = `<em>${keyword}</em>`;
        var replacedHtml = currentContent.replace(regex, newSubStr);
        return replacedHtml;
    });

    $('#sort').change(function (e) {
        var sort = $(this).val();
        var oldHref = window.location.href;
        var newHref;
        if (oldHref.search(/&sort=\w+/g) !== -1)
            newHref = oldHref.replace(/&sort=\w+/g, '&sort='.concat(sort));
        else
            newHref = oldHref + '&sort=' + sort;
        
        window.location.href = newHref;
    });

    $('#category').change(function (e) {
        // e.preventDefault();
        var category = $(this).val();
        alert(category);
    });

    $(':radio[name=search-mode]').change(function (e) {
        var type = $(this).val();
        var oldHref = window.location.href;
        var newHref;
        if (oldHref.search(/&type=\w+/g) !== -1)
            newHref = oldHref.replace(/&type=\w+/g, '&type='.concat(type));
        else
            newHref = oldHref + '&type=' + type;
        window.location.href = newHref;
    });
});