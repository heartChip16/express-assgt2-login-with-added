const { response } = require('express');
const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const { check, validationResult } = require('express-validator');

const localStorage = require('../server');


const validations = [check('username').trim().isLength({ min: 3 }).escape().withMessage('A name is required'),
check('password').trim().isLength({ min: 8, max: 100 }).withMessage('Password must be at least 8 characters long')
];

module.exports = (params) => {

    router.get('/', async (req, res, next) => {
        try {
            const { loginService } = params;
            const users = await loginService.getUsersList();
            // console.log(users);
            const username = localStorage.getItem('username');
            const errors = req.session.users ? req.session.users.errors : false;
            const successMessage = req.session.users ? req.session.users.message : false;
            req.session.users = {};
            // console.log("get errors: ", errors);
            return res.render('layout', { pageTitle: 'Login', template: 'login', users, errors, successMessage, username });
        }
        catch (err) {
            return next(err);
        }
    });




    router.post('/', validations,
        async (req, res, next) => {
            // console.log("req.body", req.body);
            var { username, password, type } = req.body;
            if (type === "Login") {
                try {
                    const { loginService } = params;
                    const { username, password } = req.body;
                    const errors = validationResult(req);
                    // console.log("post errors: ", errors);
                    if ((!errors.isEmpty())) {
                        req.session.users = {
                            errors: errors.array(),
                        };
                        return res.redirect('/login');
                    }
                    // console.log(req.body);
                    // const newUser = await loginService.addUser(username, password);
                    var users = await loginService.getUsersList();
                    var matched;
                    for (let i = 0; i < users.length; i++) {
                        if (users[i].username === username && users[i].password === password) {
                            localStorage.setItem('username', username);

                            matched = true;
                            break;
                        }
                        matched = false;
                    };
                    if (matched) {
                        console.log("INSIDE login.js MATCHED");
                        // return res.redirect('/');
                        return res.redirect(`/${username}`);
                        // return res.render('layout', { pageTitle: 'User profile', template: username, username });
                    } else {
                        req.session.users = {
                            errors: [{ msg: 'Incorrect username or password!' }]
                        };
                        return res.redirect('/login');
                    }

                }
                catch (err) {
                    return next(err);
                }
            } else if (type === "Signup") {

                const { loginService } = params;
                const { username, password } = req.body;
                const errors = validationResult(req);
                // console.log("post errors: ", errors);
                if ((!errors.isEmpty())) {
                    req.session.users = {
                        errors: errors.array(),
                    };
                    return res.redirect('/login');
                }
                // console.log(req.body);
                // const newUser = await loginService.addUser(username, password);
                var users = await loginService.getUsersList();
                for (let i = 0; i < users.length; i++) {
                    if (users[i].username === username) {
                        matched = true;
                        break;
                    }
                    matched = false;
                };
                if (matched) {
                    req.session.users = {
                        errors: [{ msg: 'Error! User already exist.' }]
                    };
                    return res.redirect('/login');

                } else {
                    var user_saved = await loginService.addUser(username, password);
                    localStorage.setItem('username', username);
                    // return res.redirect('/');
                    const dirPath = path.join(__dirname, '../views/pages');
                    console.log("dirPath: ", dirPath);
                    fs.readFile(`${dirPath}/user.ejs`, (err, userPageContent) => {
                        if (err) {
                            console.log(`An error has occured: ${err.message}`);
                            process.exit();
                        }
                        fs.writeFile(`${dirPath}/${username}.ejs`, userPageContent, err => {
                            if (err) {
                                throw err;
                            }
                            console.log("file saved");
                            // res.render('layout', { pageTitle: 'Home', template: username, username });
                            return res.redirect(`/${username}`);
                        });

                    });

                }

            }
            else {  //Logout
                localStorage.setItem('username', "");
                req.session.users = {};
                const username = "";
                req.session.users = {};
                return res.redirect('/');
            }
        });

    router.post('/api', validations, async (req, res, next) => {
        var { username, password, type } = req.body;
        if (type === "Login") {
            try {
                const { loginService } = params;
                const { username, password } = req.body;
                const errors = validationResult(req);
                // console.log("post errors: ", errors);
                if ((!errors.isEmpty())) {
                    req.session.users = {
                        errors: errors.array(),
                    };
                    return res.json({ errors: errors.array() });
                }
                // console.log(req.body);
                // const newUser = await loginService.addUser(username, password);
                var users = await loginService.getUsersList();
                var matched;
                for (let i = 0; i < users.length; i++) {
                    if (users[i].username === username && users[i].password === password) {
                        localStorage.setItem('username', username);

                        matched = true;
                        break;
                    }
                    matched = false;
                };
                if (matched) {
                    console.log({ successMessage: `Successfull logged in with username: ${username}.` });
                    res.json({ successMessage: `Successfull logged in with username: ${username}.` });
                } else {
                    req.session.users = {
                        errors: [{ msg: 'Incorrect username or password!' }]
                    };
                    console.log(req.session.users.errors);
                    return res.json(req.session.users.errors);
                }

            }
            catch (err) {
                return next(err);
            }
        } else if (type === "Signup") {

            const { loginService } = params;
            const { username, password } = req.body;
            const errors = validationResult(req);
            if ((!errors.isEmpty())) {
                req.session.users = {
                    errors: errors.array(),
                };
                return res.json({ errors: errors.array() });
            }
            // console.log(req.body);
            // const newUser = await loginService.addUser(username, password);
            var users = await loginService.getUsersList();
            for (let i = 0; i < users.length; i++) {
                if (users[i].username === username) {
                    matched = true;
                    break;
                }
                matched = false;
            };
            if (matched) {
                req.session.users = {
                    errors: [{ msg: 'Error! User already exist.' }]
                };
                // console.log(res.json(req.session.users));
                return res.json(req.session.users.errors);
            } else {
                var user_saved = await loginService.addUser(username, password);
                localStorage.setItem('username', username);
                return res.json({ successMessage: `Successfull signed up new user: ${username}.` });
            }

        }

        else {  //Logout
            localStorage.setItem('username', "");
            req.session.users = {};
            const username = "";
            req.session.users = {};
            console.log({ successMessage: 'Successfull logged out.' });
            res.json({ successMessage: 'Successfull logged out.' });
        }
    });

    return router;
}



