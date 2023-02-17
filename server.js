const express = require('express');
const path = require('path');
const cookieSession = require('cookie-session');
const createError = require('http-errors');

const bodyParser = require('body-parser');

var { LocalStorage } = require('node-localstorage');
var localStorage = new LocalStorage('./local_storage');
module.exports = localStorage;

const LoginService = require('./services/LoginService');

const loginService = new LoginService('./data/login.json');


const routes = require('./routes');
const { response } = require('express');

const app = express();
const port = 3000;

app.set('trust proxy', 1);

app.use(cookieSession({
    name: 'session',
    keys: ['dINqee89897w', 'eeefjkejejk1222'],
}));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, './views'));

app.use(express.static(path.join(__dirname, './static')));


app.use('/', routes({
    loginService
}));

app.use((req, res, next) => {
    return next(createError(404, 'File not found'));
})

app.use((err, req, res, next) => {
    res.locals.message = err.message;
    console.error(err);
    const status = err.status || 500;
    res.locals.status = status;
    res.status(status);
    res.render('error');
})

app.listen(port, () => {
    console.log(`Express server listening on port ${port}!`);
});

