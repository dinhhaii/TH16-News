var db = require('../utils/db');

module.exports = {
    all: () => {
        return db.load('select * from post');
    },

    allByCat: (id) => {
        return db.load(`select * from post where ${id} = idcategory`);
    },

    pageByCat: (catID, limit, offset) => {
        return db.load(`select * from post where status='Đã duyệt' and idcategory = ${catID} ORDER BY ispremium desc limit ${limit} offset ${offset}`);
    },

    countByCat: (catID) => {
        return db.load(`select count(*) as total from post where status='Đã duyệt' and ${catID} = idcategory`)
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
    },

    latestpost: (limit) => {
        return db.load(`select * from post as p1 where status = 'Đã duyệt' and createddate = (select max(createddate) from post as p2 where p1.id = p2.id) order by createddate desc limit ${limit} offset 0`);
    },

    latestpostIDCat: (limit, idcategory) => {
        return db.load(`select * from post as p1 where idcategory = ${idcategory} and createddate = (select max(createddate) from post as p2 where p1.id = p2.id) order by createddate desc limit ${limit} offset 0`);
    },
    latestpostByCat: ()=>{
        return db.load(`select p.* from (select max(createddate) as maxdate, idcategory from post group by idcategory) as t, post as p where p.status = 'Đã duyệt' and t.idcategory = p.idcategory and t.maxdate = p.createddate`);
    },
    descendingviews: (limit) => {
        return db.load(`SELECT * FROM post where status = 'Đã duyệt' order by views desc limit ${limit} offset 0`);
    },
    descendingviewsByWeek: (limit) => {
        return db.load(`select * , week(createddate) as week from post where status = 'Đã duyệt' ORDER BY week desc, views DESC limit ${limit} offset 0`);
    },
    findIdWriterAndStatus: (idwriter, status) => {
        return db.load(`SELECT * FROM post where idwriter = ${idwriter} and status = '${status}'`);
    },
    search: (content) => {
        return db.load(`SELECT *, MATCH (titlepost, content) AGAINST ('${content}' IN NATURAL LANGUAGE MODE) as score from post where 
        MATCH (titlepost, content) AGAINST ('${content}' IN NATURAL LANGUAGE MODE) > 0 ORDER BY ispremium desc, score desc`);
    },  
    pagingSearch: (content, limit, offset) => {
        return db.load(`SELECT *, MATCH (titlepost, content) AGAINST ('${content}' IN NATURAL LANGUAGE MODE) as score from post where 
        MATCH (titlepost, content) AGAINST ('${content}' IN NATURAL LANGUAGE MODE) > 0 ORDER BY ispremium desc, score desc limit ${limit} offset ${offset}`);
    },    
    countSearchResult: (content) => {
        return db.load(`select count(*) as total from post where MATCH (titlepost, content) AGAINST ('${content}' IN NATURAL LANGUAGE MODE) > 0`);
    }
}