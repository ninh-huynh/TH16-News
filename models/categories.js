var db = require('../utils/db');
const tableName = 'CATEGORY';

module.exports = {
    load: () => {
        return db.load(`SELECT * FROM ${tableName} GROUP BY name, parentID`);
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

};