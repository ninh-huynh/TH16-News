$(function () {
    var keyword = $('#key-word').text();

    // currentContent là 1 string
    $('p.article-summary').html((index, currentContent) => {
        var regex = new RegExp(`${keyword}`);
        var newSubStr = `<em>${keyword}</em>`;
        var replacedHtml = currentContent.replace(regex, newSubStr);
        return replacedHtml;
    });
});