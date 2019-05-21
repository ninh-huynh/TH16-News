var vnLanguageTool = require('./vnLanguageTool');

module.exports = {
    // generate link base on string element in array
    // Ex: ['category', 'Thế giới'] => '/category/the-gioi'
    concatToLink: (args) => {
        var link = '/';
        args.forEach(str => {
            link = link + str + '/';
        });
        link = link.toLowerCase();
        link = link.replace(/ /g, '-');
        link = vnLanguageTool.remove_tone(link);
        return link;
    }
};