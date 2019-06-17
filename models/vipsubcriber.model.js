var db = require('../utils/db');

module.exports = {
    all: () => {
        return db.load('select * from vipsubcriber');
    },

    add: (entity) => {
        return db.add('vipsubcriber', entity);
    },
    
    single: (iduser) => {
        return db.load(`select * from vipsubcriber where iduser = ${iduser}`);
    },

    update: (entity) => {
        return db.update('vipsubcriber', 'id', entity);
    },

    delete: (id) => {   
        return db.delete('vipsubcriber', 'id', id);
    }
}