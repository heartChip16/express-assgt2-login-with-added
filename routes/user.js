const { response } = require('express');
const express = require('express');
const router = express.Router();
const path = require('path');

const localStorage = require('../server');

module.exports = (params) => {
    router.get('/:username', async (req, res, next) => {
        try {
            // console.log("params ", params);
            // console.log("username is: ", username);
            const { loginService } = params;
            const users = await loginService.getUsersList();
            // console.log(users);
            const username = localStorage.getItem('username');
            const errors = req.session.users ? req.session.users.errors : false;
            const successMessage = req.session.users ? req.session.users.message : false;
            req.session.users = {};
            // console.log("get errors: ", errors);
            // res.render('layout', { pageTitle: 'Home', template: username, username });

            if (!(username === "")) {
                console.log("username for render, inside user.js : ", username);
                return res.render('layout', { pageTitle: 'User profile', template: username, username });
                // const dirPath = path.join(__dirname, '../static/ingrid_ibe.html');
                // res.sendFile(`${dirPath}`, function (err) {
                //     if (err) {
                //         next(err);
                //     } else {
                //         console.log('Sent: ', dirPath);
                //     }
                // });
            } else {
                // console.log("params username", params.username);
                console.log("username is: ", username);
                return res.redirect('/login');
            }
        }
        catch (err) {
            return next(err);
        }
    });

    return router;
}



