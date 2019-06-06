var db = require('../utils/db');
var knex = db.queryBuilder;
var moment = require('moment');

function searchArticleByDate(articleID, date) {
    return knex.queryBuilder()
        .select()
        .from('ARTICLE_VIEWS')
        .where('date', '=', date)
        .andWhere('articleId', '=', articleID)
        .then(rows => {
            if (rows.length === 0)
                return false;
            return true;
        });
}

module.exports = {
    increaseView: (artcile, date) => {
        return searchArticleByDate(artcile.id, date)
            .then(isExistInDay => {
                if (isExistInDay) {
                    console.log('is Exist In day');
                    
                    return knex('ARTICLE_VIEWS')
                        .where('date', '=', date)
                        .andWhere('articleId', '=', artcile.id)
                        .increment('total', 1);
                } else {
                    console.log('is not exist in day');
                    
                    var newEntity = {
                        articleID: artcile.id,
                        date: date,
                        total: 1
                    };

                    return knex.insert(newEntity)
                        .into('ARTICLE_VIEWS');
                }
            });
    },
};