var db = require('../utils/db');

module.exports = {
    all: () => {
        return db.load('select * from comment');
    },

    add: (entity) => {
        return db.add('comment', entity);
    },
    
    single: (idproduct) => {
        return db.load(`select * from comment where idproduct = ${idproduct}`);
    },

    update: (entity) => {
        return db.update('comment', 'id', entity);
    },

    delete: (id) => {   
        return db.delete('comment', 'id', id);
    },

    descComment: (idproduct)  => {
        return db.load(`select * from comment where idproduct = ${idproduct} order by idcomment desc`);
    },

    amountComment: () => {
        return db.load('select idproduct, count(*) as amount from comment group by idproduct');
    },

    amountCommentWidthId: (idproduct) => {
        return db.load(`select count(*) as amount from comment where idproduct = ${idproduct} group by idproduct`);
    }
}