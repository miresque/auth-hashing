const secretKey = process.env.JWT_SECRET
const jwt = require('jsonwebtoken');
const prisma = require('../utils/prisma.js')

const auth = async (req, res, next) => {
    // Grabbing the token
    const [_, token] = req.get('authorization').split(' ')

    // decoding the token and seeing who is trying to access this command
    const decodedToken = jwt.verify(token, secretKey)
    
    const user = await prisma.user.findFirst({
        where: {
            username: decodedToken.username
        }
    })
    req.user = user

    next()
}

module.exports = auth