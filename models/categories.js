var db = require('../utils/db');
var knex = db.queryBuilder;
var linkHelper = require('../utils/linkHelper');
const tableName = 'CATEGORY';

// Get all root category
function loadMain() {
    //return db.load(`SELECT * FROM ${tableName} WHERE parentID IS NULL`);
    return knex(tableName).whereNull('parentID');
}

// Get all child category of a specific parentId
function loadChild(parentId) {
    var query = knex.withRecursive('cte', (qb) => {
        qb.select('*').from('CATEGORY').where('parentID', parentId).unionAll((qb) => {
            qb.select('cat.*').from('CATEGORY as cat').join('cte', 'cat.parentID', 'cte.id');
        });
    }).select('*').from('cte');
    //console.log(query.toString());  //debug
    return query;
}

module.exports = {
    load: () => knex.select().from(tableName).groupBy('name', 'parentID'),

    loadChild: (parentID) => loadChild(parentID),

    loadParent: () => loadMain(),

    add: (newCategory) => {
        return db.add(newCategory, tableName);
    },

    update: (category) => {
        return db.update(category, tableName);
    },

    // remove: (category) => {
    //     return db.remove(category, tableName);
    // },

    remove: (ids) => {
        return knex(tableName).whereIn('id', ids).delete();
    },

    // Get all root category, include these child
    loadMainIncludeChild: () => {
        return loadMain()
            .then(rows => {
                var promises = [];
                rows.forEach((row, index) => {
                    promises[index] = loadChild(row.id);
                });

                return Promise.all(promises)
                    .then(childArr => {
                        // childArr content all child of a main category after all promise is done
                        // [MainCategory1, MainCategory2,...] -> [child1, child2, ...]
                        rows.forEach((row, index) => {
                            row.child = childArr[index];
                        });
                        return rows;
                    });
            });
    },

    loadById: (categoryId) => {
        return knex(tableName).where('id', categoryId)
            .then(rows => {
                if (rows.length === 0)
                    throw new Error(`CategoryID not found: ${categoryId}`);
                return rows[0];
            });
    },

    loadByLink: (categoryLink) => {
        return knex.queryBuilder()
            .select()
            .from('CATEGORY')
            .where('path', categoryLink)
            .then(rows => {
                var category = rows[0];
                if (category === undefined)
                    throw new Error(`${categoryLink} not found!`);
                
                return loadChild(category.id)
                    .then(child => {
                        category.child = child;
                        return category;
                    });
            });
    },

    checkCategoryExits: (name) => {
        return knex.queryBuilder().select().from('CATEGORY').where('name', name)
            .then(rows => {
                return rows.length === 1;
            });
    }
};