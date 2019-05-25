var db = require('../utils/db');

module.exports = {
    all: () => {
        return db.load('select * from post_tag');
    },

    allTagByPost: (idpost) => {
        return db.load(`select * from post_tag pt, tag t where ${idpost} = idpost and t.id = pt.idtag`);
    },

    allPostByTag: (id) => {
        return db.load(`select * from post_tag where ${id} = idtag`);
    },

    pagePostByTag: (tagID, limit, offset) => {
        return db.load(`select * from post_tag as pt, post as p where pt.idtag = ${tagID} and pt.idpost = p.id limit ${limit} offset ${offset}`);
    },

    countPostByTag: tagID => {
        return db.load(`select count(*) as total from post_tag where ${tagID} = idtag`)
    },

    add: (entity) => {
        return db.add('post_tag', entity);
    },
    
    single: (id) => {
        return db.load(`select * from post_tag where id = ${id}`);
    },

    update: (entity) => {
        return db.update('post_tag', 'id', entity);
    },

    delete: (id) => {
        return db.delete('post_tag', 'id', id);
    }
}