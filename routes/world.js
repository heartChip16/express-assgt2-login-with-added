const { response } = require('express');
const express = require('express');
const router = express.Router();
const path = require('path');

module.exports = (params) => {
    router.get('/', async (req, res, next) => {
        try {
            return res.render('layout', { pageTitle: 'World', template: 'world' });
        }
        catch (err) {
            return next(err);
        }
    });
    return router;
}



