const express = require('express');
const router = express.Router();
require('dotenv').config()
const secretKey = process.env.JWT_SECRET

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const prisma = require('../utils/prisma.js')

router.post('/', async (req, res) => {
    // Get the username and password from the request body
    const { username, password } = req.body;

    // Check that a user with that username exists in the database
    // Use bcrypt to check that the provided password matches the hashed password on the user
    // If either of these checks fail, respond with a 401 "Invalid username or password" error
    const hasUser = await prisma.user.findUnique({
        where: {
            username
        }
    });
    
    if(!hasUser) {
        return res.status(401).json({ error: "Invalid username or password"})
    };

    const hashValid = await bcrypt.compare(password, hasUser.password);

    if(!hashValid) {
        return res.status(401).json({ error: "Invalid username or password"})
    };

    // If the user exists and the passwords match, create a JWT containing the username in the payload
    // Use the JWT_SECRET environment variable for the secret key
    const token = jwt.sign({ username }, secretKey );

    // Send a JSON object with a "token" key back to the client, the value is the JWT created
    res.status(200).json({ token });
});

module.exports = router;
