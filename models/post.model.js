var db = require('../utils/db');

module.exports = {
    all: () => {
        return db.load('select * from post');
    },

    allByCat: (id) => {
        return db.load(`select * from post where ${id} = idcategory`);
    },

    pageByCat: (catID, limit, offset) => {
        return db.load(`select * from post where idcategory = ${catID} limit ${limit} offset ${offset}`);
    },

    countByCat: catID => {
        return db.load(`select count(*) as total from post where ${catID} = idcategory`)
    },
  
    add: (entity) => {
        return db.add('post', entity);
    },
    
    single: (id) => {
        return db.load(`select * from post where id = ${id}`);
    },

    update: (entity) => {
        return db.update('post', 'id', entity);
    },

    delete: (id) => {
        return db.delete('post', 'id', id);
    }
}