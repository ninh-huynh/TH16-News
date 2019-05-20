var db = require('../utils/db');
var vnLanguageTool = require('../utils/vnLanguageTool');
const tableName = 'CATEGORY';

module.exports = {
    load: () => {
        return db.load(`SELECT * FROM ${tableName}`);
    },

    // Get all root category
    loadMain: () => {
        return db.load(`SELECT * FROM ${tableName} WHERE parentID IS NULL`);
    },

    // Get all child category of a specific parentId
    loadChild: (parentId) => {
        return db.load(`
WITH RECURSIVE cte(id, name, parentID) AS
(
	SELECT 	id,
			name,
			parentID
	FROM ${tableName}
    WHERE parentID = ${parentId}
    UNION ALL
    SELECT 	cat.id,
			cat.name,
			cat.parentID
    FROM ${tableName} cat
    INNER JOIN cte 
		ON cat.parentID = cte.id
)
SELECT *
FROM cte`);
    },

    add: (newCategory) => {
        return db.add(newCategory, tableName);
    },

    update: (category) => {
        return db.update(category, tableName);
    },

    remove: (category) => {
        return db.remove(category, tableName);
    },

    //TODO: Need to save the path to DB
    getLink: (categoryName) => {
        var categoryLink = '/category/';
        categoryName = categoryName.toLowerCase();
        categoryName = categoryName.replace(/ /g, '-');
        categoryName = vnLanguageTool.remove_tone(categoryName);
        return categoryLink + categoryName;
    }
};