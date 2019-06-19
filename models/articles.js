// External module
var moment = require('moment');

// Internal module
var db = require('../utils/db');
var knex = db.queryBuilder;
const th16_news = require('../utils/th16_news');

// Other model used
var tag = require('./tags');
var categories = require('./categories');
var comment = require('./comments');

// Database table name, column name (avoid typo)
const ARTICLE = th16_news.ARTICLE;
const ARTICLE_TAG = th16_news.ARTICLE_TAG;
const CATEGORY = th16_news.CATEGORY;
const ARTICLE_STATUS = th16_news.ARTICLE_STATUS;
const ARTICLE_VIEWS = th16_news.ARTICLE_VIEWS;

const sqlDateFormat = 'YYYY/MM/DD';

const queryGetPublicId = knex.queryBuilder()
    .select('id')
    .from(ARTICLE_STATUS._)
    .where('name', 'Đã xuất bản');

module.exports = {

    //TODO: add pagination
    load: () => {
        return knex.queryBuilder().select().from(ARTICLE._);
    },

    //TODO: add pagination
    loadByCategory: (id) => {
        return db.load(`
            SELECT  art.*
            FROM ${ARTICLE._} AS art
            WHERE art.categoryID = ${id} AND art.statusID = 4`);
    },

    //TODO: add pagination
    loadByTag: (id) => {
        return db.load(`
            SELECT  art.*, cat.name AS categoryName   
            FROM (( article_tag AS art_tag
            JOIN ${ARTICLE._} art ON art_tag.articleID = art.id)
            JOIN category AS cat ON art.categoryID = cat.id)
            WHERE tagID = ${id} AND statusID = 4`);
    },

    // Return article list (only public artcile, for guest, subscriber viewers)
    // Each article have default property as database column
    // and relation property like:
    // .category    : The category name of this article
    loadByTagName: (name, totalRow, rowBegin, isSubscriber) => {
        return tag.loadByName(name)
            .then(tagEntity => {
                // get all article id with this tagID from tagEntity

                var subQuery1 = knex.queryBuilder()
                    .select(ARTICLE_TAG.articleID)
                    .from(ARTICLE_TAG._)
                    .where(ARTICLE_TAG.tagID, tagEntity.id);

                var subQuery2 = knex.queryBuilder()
                    .select()
                    .from(ARTICLE._)
                    .whereIn(ARTICLE.id, subQuery1).as('art');

                var query = knex.queryBuilder()
                    .select(['art.*', { category: 'cat.name', categoryPath: 'cat.path' }]).from(subQuery2)
                    .innerJoin(`${CATEGORY._} as cat `, 'art.categoryID', 'cat.id')
                    .whereIn(ARTICLE.statusID, queryGetPublicId);

                if (isSubscriber) {
                    query = query.orderBy('isPremium', 'desc');
                }

                return query.limit(totalRow).offset(rowBegin);
            });
    },

    // return an article with default property as database column
    // and relation property like:
    // .comments    : The comments array
    // .tags        : The tags array
    // .category    : The category name of this article
    // .status      : The status name of this article
    loadById: (articleId) => {

        var subQuery1 = knex.queryBuilder()
            .select()
            .from(ARTICLE._)
            .where('id', articleId).as('art');

        return knex.queryBuilder()
            .select(['art.*', 'cat.name as category', 'sta.name as status'])
            .from(subQuery1)
            .innerJoin(`${CATEGORY._} as cat`, 'art.categoryID', 'cat.id')
            .innerJoin(`${ARTICLE_STATUS._} as sta`, 'art.statusID', 'sta.id')
            .then(rows => {
                var row = rows[0];

                if (row === undefined)
                    throw new Error(`Article id ${articleId} not found!`);

                return Promise.all([tag.loadByArticle(articleId), comment.loadByArticle(articleId)])
                    .then(([tags, comments]) => {
                        row.tags = tags;
                        row.comments = comments;
                        return row;
                    });
            });
    },

    loadNewest: (totalRow, rowBegin) => {
        var queryPublicArticle = knex.queryBuilder()
            .select()
            .from(ARTICLE._)
            .whereIn('statusID', queryGetPublicId)
            .as('art');

        return knex.queryBuilder()
            .select(['art.*', 'cat.name as category', 'cat.path as categoryPath'])
            .from(queryPublicArticle)
            .innerJoin(`${CATEGORY._} as cat`, 'art.categoryID', 'cat.id')
            .orderBy(ARTICLE.publicationDate, 'desc')
            .limit(totalRow).offset(rowBegin);
    },

    loadMostViewed: (totalRow, rowBegin) => {
        var queryMostView = knex.queryBuilder()
            .select('articleId', knex.raw('SUM(total) as total_view'))
            .from(ARTICLE_VIEWS._)
            .groupBy('articleId')
            .orderBy('total_view', 'desc').as('most_view')
            .limit(totalRow).offset(rowBegin);
            
        var query = knex.queryBuilder()
            .select(['art.*', 'cat.name as category', 'cat.path as categoryPath'])
            .from(queryMostView)
            .join(`${ARTICLE._} as art`, 'most_view.articleId', 'art.id')
            .join(`${CATEGORY._} as cat`, 'art.categoryID', 'cat.id')
            .whereIn(ARTICLE.statusID, queryGetPublicId)
            .orderBy('most_view.total_view', 'desc');
        
        return query;
    },


    loadTopCategory: (totalRow, rowBegin) => {
        var queryTopCatID = knex.queryBuilder()
            .select(knex.raw('MAX(publicationDate) as date'))
            .from(ARTICLE._)
            .whereIn(ARTICLE.statusID, queryGetPublicId)
            .groupBy('categoryID');

        var queryTopCat = knex.queryBuilder()
            .select()
            .from(ARTICLE._)
            .whereIn('publicationDate', queryTopCatID)
            .as('art');

        return knex.queryBuilder()
            .select(['art.*', 'cat.name as category', 'cat.path as categoryPath'])
            .from(queryTopCat)
            .join(`${CATEGORY._} as cat`, 'categoryID', 'cat.id')
            .limit(totalRow).offset(rowBegin);
    },

    loadWeeklyTrend: (totalRow, rowBegin) => {
        var end = moment();
        var begin = moment().subtract(7, 'days');

        var queryMostView = knex.queryBuilder()
            .select(['articleId', knex.raw('SUM(total) as total_view')])
            .from(ARTICLE_VIEWS._)
            .groupBy('articleId')
            .orderBy('total_view', 'desc')
            .as('most_view');        

        var queryWeekly = knex.queryBuilder()
            .select()
            .from(ARTICLE._)
            .whereBetween('publicationDate', [begin.format(sqlDateFormat), end.format(sqlDateFormat)])
            .as('art');

        var query = knex.queryBuilder()
            .select('art.*', 'cat.name as category', 'cat.path as categoryPath')
            .from(queryWeekly)
            .join(queryMostView, 'most_view.articleId', '=', 'art.id')
            .join(`${CATEGORY._} as cat`, 'art.categoryID', 'cat.id')
            .orderBy([{column: 'total_view', order: 'desc'}, {column: 'publicationDate', order: 'desc'}])
            .limit(totalRow).offset(rowBegin);
         
        return query;
    },

    add: (newArticle) => {
        return db.add(newArticle, ARTICLE._)
            .then(rows => rows[0]);
    },

    update: (article) => {
        return db.update(article, ARTICLE._);
    },

    remove: (article) => {
        return db.remove(article, ARTICLE._);
    },

    addTag: (tagID, articleID) => {
        return db.add({ tagID, articleID }, 'ARTICLE_TAG');
    },

    countTotalByTag_public: (tagName) => {
        return tag.loadByName(tagName)
            .then(tagEntity => {
                // get all article id with this tagID from tagEntity

                var subQuery1 = knex.queryBuilder()
                    .select(ARTICLE_TAG.articleID)
                    .from(ARTICLE_TAG._)
                    .where(ARTICLE_TAG.tagID, tagEntity.id);

                var subQuery2 = knex.queryBuilder()
                    .select()
                    .from(ARTICLE._)
                    .whereIn(ARTICLE.id, subQuery1).as('art');

                return knex.queryBuilder()
                    .select(knex.raw('COUNT(*) AS total')).from(subQuery2)
                    .whereIn(ARTICLE.statusID, queryGetPublicId)
                    .then(rows => {
                        return rows[0].total;
                    });
            });
    },

    checkTitleExits: (title) => {
        return knex.queryBuilder().select().from(ARTICLE._).where('title', title)
            .then(rows => {
                return rows.length === 1;
            });
    },

    searchByKeyword: (columnName, keyword, totalRow, rowBegin, sortOrder, isGuest) => {
        var query = knex.queryBuilder()
            .select()
            .from('ARTICLE')
            .whereIn(ARTICLE.statusID, queryGetPublicId)
            .andWhereRaw(`match(${columnName}) against('${keyword}')`);

        if (isGuest) {
            query = query.orderBy('publicationDate', sortOrder);
        }
        else {
            query = query.orderBy([{ column: 'isPremium', order: 'desc' },
                { column: 'publicationDate', order: sortOrder }]);
        }

        return query.limit(totalRow).offset(rowBegin);
    },

    countTotalByTitle: (columnName, title) => {
        return knex.queryBuilder()
            .select(knex.raw('COUNT(*) AS total'))
            .from('ARTICLE')
            .whereIn(ARTICLE.statusID, queryGetPublicId)
            .andWhereRaw(`match(${columnName}) against('${title}')`)
            .then(rows => {
                return rows[0].total;
            });
    },

    searchByTitle: (title) => {
        var articleEntity;
        
        return knex.queryBuilder()
            .select('a.*', 'u.nickName as writer')
            .from('ARTICLE as a')
            .whereIn(ARTICLE.statusID, queryGetPublicId).andWhere('title', 'like', `${title}%`)
            .join('USER as u', 'a.writerID', 'u.id')
            .then(rows => {
                if (rows.length === 0)
                    throw new Error(`${title} is not found`);
                articleEntity = rows[0];

                var pLoadCategory = categories.loadByIdIncludeParent(articleEntity.categoryID);
                var pLoadTags = tag.loadByArticle(articleEntity.id);
                var pLoadComments = comment.loadByArticle(articleEntity.id);
                return Promise.all([pLoadCategory, pLoadTags, pLoadComments]);
            })
            .then(([category, tags, comments]) => {
                articleEntity.category = category;
                articleEntity.tags = tags;
                articleEntity.comments = comments;
                return articleEntity;
            });
    },

    searchDraftByTitle: (title) => {
        var articleEntity;
        
        return knex.queryBuilder()
            .select('a.*', 'u.nickName as writer')
            .from('ARTICLE as a')
            .where('title', 'like', `${title}%`)
            .join('USER as u', 'a.writerID', 'u.id')
            .then(rows => {
                if (rows.length === 0)
                    throw new Error(`${title} is not found`);
                articleEntity = rows[0];

                var pLoadCategory = categories.loadByIdIncludeParent(articleEntity.categoryID);
                var pLoadTags = tag.loadByArticle(articleEntity.id);
                var pLoadComments = comment.loadByArticle(articleEntity.id);
                return Promise.all([pLoadCategory, pLoadTags, pLoadComments]);
            })
            .then(([category, tags, comments]) => {
                articleEntity.category = category;
                articleEntity.tags = tags;
                articleEntity.comments = comments;
                return articleEntity;
            });
    },

    loadBySameCategory: (articleEntity) => {
        var categoryID = articleEntity.categoryID;
        return knex.queryBuilder()
            .select()
            .from('ARTICLE')
            .whereIn(ARTICLE.statusID, queryGetPublicId)
            .andWhere('categoryID', categoryID)
            .andWhereNot('id', articleEntity.id);
    },

    countTotalByCategory: (entity) => {
        return knex.queryBuilder()
            .select(knex.raw('COUNT(*) AS total'))
            .from(ARTICLE._)
            .whereIn('statusID', queryGetPublicId)
            .andWhere(function () {
                var categoryIDs = [];
                categoryIDs.push(entity.id);
                entity.child.forEach(category => {
                    categoryIDs.push(category.id);
                });

                this.whereIn('categoryID', categoryIDs);
            })
            .then(rows => {
                return rows[0].total;
            });
    },

    loadByCategoryEntity: (entity, totalRow, rowBegin, isSubscriber) => {
        var articles;
        var query = knex.queryBuilder()
            .select()
            .from(ARTICLE._)
            .whereIn('statusID', queryGetPublicId)
            .andWhere(function () {
                var categoryIDs = [];
                categoryIDs.push(entity.id);
                entity.child.forEach(category => {
                    categoryIDs.push(category.id);
                });

                this.whereIn('categoryID', categoryIDs);
            });

        if (isSubscriber) {
            query = query.orderBy('isPremium', 'desc');
        }

        query = query.limit(totalRow).offset(rowBegin)
            .then(rows => {
                articles = rows;

                var promises = [];
                rows.forEach((row, index) => {
                    promises[index] = tag.loadByArticle(row.id);
                });

                return Promise.all(promises);
            })
            .then((tagRowsArr) => {
                articles.forEach((row, index) => {
                    row.tags = tagRowsArr[index];     // add tags property
                });

                // Final result: all article with the tags property included
                return articles;
            });

        return query;
    },

    countTotal: () => {
        return knex.queryBuilder()
            .select(knex.raw('COUNT(*) as total'))
            .from('ARTICLE')
            .then(rows => {
                return rows[0].total;
            });
    },

    getDraftsByEditorID: (id, limit, offset, search, sort, order) => {
        console.log(id, limit, offset, search, sort, order);
        const query = knex.queryBuilder()
            .from('ARTICLE as a')
            .innerJoin('CATEGORY as c', 'a.categoryID', 'c.id')
            .innerJoin('CATEGORY as p', 'p.id', 'c.parentID')
            .innerJoin('USER as e', 'e.categoryIdManaged', 'p.id')
            .innerJoin('USER as w', 'a.writerID', 'w.id')
            .innerJoin('ARTICLE_STATUS as s', 's.id', 'a.statusID')
            .where('e.id', id)
            .andWhere('s.id', 4)
            .modify(queryBuilder => {
                if (search) {
                    queryBuilder.whereRaw(`match(a.title) against('${ search }')`)
                        .orWhereRaw(`match(w.name) against('${ search }')`);
                }
            });

        return Promise.all([
            // get total row
            query
                .clone()
                .countDistinct('a.id as total')
                .first()
                .then(row => row.total),

            // get rows
            query
                .clone()
                .select('a.id', 'a.title', 'w.name as writerName', 'p.id as parentCategoryID', 'p.name as parentCategory', 'c.id as categoryID', 'c.name as category')
                .modify(queryBuilder => {
                    if (sort && order)
                        queryBuilder.orderBy(sort, order);
                })
                .limit(limit)
                .offset(offset)
        ]);
    },

    getDraftInfo: (draftID) => {
        return Promise.all([
            knex
                .queryBuilder()
                .from('ARTICLE as a')
                .innerJoin('CATEGORY as p', 'a.categoryID', 'p.id')
                .innerJoin('CATEGORY as c', 'c.parentID', 'p.parentID')
                .where('a.id', draftID)
                .select('c.id as id', 'c.name as name'),

            knex
                .queryBuilder()
                .from('ARTICLE as a')
                .innerJoin('ARTICLE_TAG as at', 'a.id', 'at.articleID')
                .innerJoin('TAG as t', 'at.tagID', 't.id')
                .where('a.id', draftID)
                .select('t.id as id', 't.name as name'),
        ]);
    },

    getArticleByWriterID: (writerID, limit, offset, search, sort, order, filter) => {
        const query = knex
            .queryBuilder()
            .from('ARTICLE as a')
            .innerJoin('CATEGORY as c', 'a.categoryID', 'c.id')
            .innerJoin('ARTICLE_STATUS as s', 'a.statusID', 's.id')
            .where('a.writerID', writerID)
            .modify(queryBuilder => {
                console.log(filter);
                if (filter)
                    queryBuilder.where('s.name', filter);
                if (search)
                    queryBuilder
                        .whereRaw(`match(a.title) against('${ search }')`)
                        .orWhereRaw(`match(c.name) against('${ search }')`);
            });

        return Promise.all([
            query
                .clone()
                .countDistinct('a.id as total')
                .first()
                .then(rows => rows.total),

            query
                .clone()
                .select('a.id as id', 'a.title as title', 'c.name as categoryName', 'a.publicationDate as publicationDate', 's.id as statusID', 's.name as statusName')
                .modify(queryBuilder => {
                    if (sort && order)
                        queryBuilder.orderBy(sort, order);
                })
                .limit(limit)
                .offset(offset)
        ]);
    },
};