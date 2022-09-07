const express = require('express');
const app = express();

const morgan = require('morgan')
const cors = require('cors');
const auth = require('./middleware/auth')

app.disable('x-powered-by');

app.use(morgan('dev'))
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const registrationsRouter = require('./routers/registrations.js');
const sessionsRouter = require('./routers/sessions.js');
const usersRouter = require('./routers/users.js');

app.use('/register', registrationsRouter);
app.use('/login', sessionsRouter);
app.use('/user', auth, usersRouter);

module.exports = app
