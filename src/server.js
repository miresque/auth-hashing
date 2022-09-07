const express = require('express');
require('express-async-errors');
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
const { JsonWebTokenError } = require('jsonwebtoken');
const { PrismaClientKnownRequestError } = require('@prisma/client/runtime');

app.use('/register', registrationsRouter);
app.use('/login', sessionsRouter);
app.use('/user', auth, usersRouter);

app.use((err, req, res, next) => {
    if (err instanceof JsonWebTokenError) {
        return res.status(400).json({ error: 'Invalid token.' })
    }
    if (err instanceof PrismaClientKnownRequestError) {
        console.log(err.code)
        if(err.code === 'P2025') {
            return res.status(400).json({ error: "User does not exist." })
        }
    }
    res.status(500).json({ error: 'Error handler hit!' })
})

module.exports = app
