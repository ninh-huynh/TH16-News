var db = require('../utils/db');
var moment = require('moment');
const tableName = 'ARTICLE';
const sqlDateFormat = 'YYYY/MM/DD';
module.exports = {

    //TODO: add pagination
    load: () => {
        return db.load(`
            SELECT art.*
            FROM ${tableName} AS art
        `);
    },

    //TODO: add pagination
    loadByCategory: (id) => {
        return db.load(`
            SELECT  art.*
            FROM ${tableName} AS art
            WHERE art.categoryID = ${id} AND art.statusID = 4`);
    },

    //TODO: add pagination
    loadByTag: (id) => {
        return db.load(`
            SELECT  art.*, cat.name AS categoryName   
            FROM (( article_tag AS art_tag
            JOIN ${tableName} art ON art_tag.articleID = art.id)
            JOIN category AS cat ON art.categoryID = cat.id)
            WHERE tagID = ${id} AND statusID = 4`);
    },

    loadNewest: (totalRow, rowBegin) => {
        return db.load(`
            SELECT  art.title,
                    cat.name AS category,
                    art.publicationDate,
                    art.coverImageURL
            FROM ${tableName} AS art
            JOIN category AS cat ON categoryID = cat.id
            WHERE statusID = 4
            ORDER BY publicationDate DESC
            LIMIT ${totalRow} OFFSET ${rowBegin}`);
    },

    loadMostViewed: (totalRow, rowBegin) => {
        return db.load(`
            SELECT  art.title,
                    cat.name AS category,
                    art.publicationDate,
                    art.coverImageURL
            FROM ((
                (SELECT articleId, SUM(total) as total_view
                FROM article_views
                GROUP BY articleId
                ORDER BY total_view DESC
                LIMIT ${totalRow} OFFSET ${rowBegin}
                ) as most_view
            JOIN ${tableName} art ON most_view.articleId = art.id)
            JOIN category AS cat ON categoryID = cat.id)
            WHERE statusID = 4`);
    },


    loadTopCategory: (totalRow, rowBegin) => {
        return db.load(`
        SELECT  title,
                cat.name AS category 
                publicationDate, 
                coverImageURL
        FROM (( ${tableName}
        JOIN
                (SELECT max(publicationDate) as date
                FROM ${tableName}
                GROUP BY categoryID
                LIMIT ${totalRow} OFFSET ${rowBegin}
                ) as topCat
        ON publicationDate = topCat.date)
        JOIN category AS cat ON categoryID = cat.id)
        WHERE statusID = 4
        `);
    },

    loadWeeklyTrend: (totalRow, rowBegin) => {
        var end = moment();
        var begin = end.subtract(7, 'days');
        return db.load(`
            SELECT 	title, 
		            cat.name AS category, 
		            publicationDate, 
		            coverImageURL
            FROM	
            ((
            		(SELECT articleId, SUM(total) AS total_view
            		 FROM article_views
            		 GROUP BY articleId
            		 ORDER BY total_view DESC
            		) AS most_view
            JOIN
            	    (SELECT *
            	     FROM ${tableName}
            	     WHERE publicationDate 
            	    	BETWEEN ${begin.format(sqlDateFormat)} AND ${end.format(sqlDateFormat)}
            	    ) AS weekly_art
            ON most_view.articleId = weekly_art.id)
            JOIN category AS cat ON categoryID = cat.id)
            WHERE weekly_art.statusID = 4
            LIMIT ${totalRow} OFFSET ${rowBegin}
        `);
    },

    add: (newArticle) => {
        return db.add(newArticle, tableName);
    },

    update: (article) => {
        return db.update(article, tableName);
    },

    remove: (article) => {
        return db.remove(article, tableName);
    },

    addTag: (tagID, articleID) => {
        return db.add({ tagID, articleID }, 'article_tag');
    },
};