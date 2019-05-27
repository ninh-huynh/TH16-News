var vnLanguageTool = require('./vnLanguageTool');

module.exports = {
    // generate link base on string element in array
    // Ex: ['category', 'Thế giới'] => '/category/the-gioi'
    concatToLink: (args) => {
        var link = '/';
        var i = 0;
        for (i = 0; i < args.length - 1; i++) {
            link = link + args[i] + '/';
        }
        link = link + args[i];

        link = link.toLowerCase();
        link = link.replace(/ /g, '-');
        link = vnLanguageTool.remove_tone(link);
        return link;
    }
};