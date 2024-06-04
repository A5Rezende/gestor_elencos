require('dotenv').config();

const express = require('express');
const app = express();

const mongoose = require('mongoose');
mongoose.connect(process.env.CONNECTIONSTRING)
    .then(() => {
        console.log('Conected')
        app.emit('pronto');
    })
    .catch(e => console.log(e));

const session = require('express-session');
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');

const port = 3000;
const routes = require('./routes');
const path = require('path');

const helmet = require('helmet');
app.use(helmet());

const csrf = require('csurf');

const { middlewareGlobal, checkCsrfError, CsrfMiddleware } = require('./src/middlewares/middleware');

const sessionOptions = session({
    secret: 'AntonioRezende',
    store: MongoStore.create({ mongoUrl: process.env.CONNECTIONSTRING }),
    resave: false,
    saveUnitialized: true,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7,
        httpOnly: true
    }
});

app.use(sessionOptions);

app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(express.static(path.resolve(__dirname, 'public')));

app.set('views', path.resolve(__dirname, 'src', 'views'));
app.set('view engine', 'ejs');

app.use(csrf());
app.use(flash());

app.use(checkCsrfError);
app.use(CsrfMiddleware);
app.use(middlewareGlobal);

app.use(routes);

app.on('pronto', () => {
    app.listen(port, () => {
        console.log(`Acessar http://localhost:${port}`);
    });
});