var express = require('express');
var router = express.Router();

router.get('/editprofile', (req, res) => {

    res.render('subcriber/subcriber-editprofile');
});

module.exports = router;