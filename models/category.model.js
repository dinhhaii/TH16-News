var db = require('../utils/db');

module.exports = {
    all: () => {
        return db.load('select * from category');
    },

    allWithDetail: () => {
        return db.load('select c.id, c.name, c.createddate, count(p.id) as totalpost from category c left join post p on c.id = p.idcategory group by c.id, c.name, c.createddate');
    },

    add: (entity) => {
        return db.add('category', entity);
    },
    
    single: (id) => {
        return db.load(`select * from category where id = ${id}`);
    },

    update: (entity) => {
        return db.update('category', 'id', entity);
    },

    delete: (id) => {
        return db.delete('category', 'id', id);
    },

    getIDCategory: (name) => {
        return db.load(`select id from category where name = ${name}`);
    }
}