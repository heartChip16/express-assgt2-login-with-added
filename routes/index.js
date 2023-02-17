const express = require('express');

const loginRoute = require('./login');
const worldRoute = require('./world');
const userRoute = require('./user');

const localStorage = require('../server');
// console.log("localstorage imported, called in index.js: ", localStorage);
const router = express.Router();

module.exports = (params) => {

    router.get('/', async (req, res, next) => {
        try {
            var username = localStorage.getItem('username');
            if (username === "" || username === null) {
                console.log("username in index.js is null, redirecting to login ", username);
                return res.redirect('/login');
            }
            else {
                console.log("USERNAME INSIDE index.js!!!!: ", username);
                return res.redirect(`/${username}`);
                // res.render('layout', { pageTitle: 'User Profile', template: username, username });

            }
        }
        catch (err) {
            return next(err);
        }
    });

    var username = localStorage.getItem('username');
    router.use('/login', loginRoute(params));
    router.use('/', userRoute(params));


    return router;
}


