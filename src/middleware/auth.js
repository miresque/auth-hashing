const secretKey = process.env.JWT_SECRET
const jwt = require('jsonwebtoken');
const prisma = require('../utils/prisma.js')

const auth = async (req, res, next) => {
    // Grabbing the token
    const [_, token] = req.get('authorization').split(' ')

    try {
        // decoding the token and seeing who is trying to access this command
        const decodedToken = jwt.verify(token, secretKey)

        const user = await prisma.user.findFirst({
            where: {
                username: decodedToken.username
            }
        })
        req.user = user
    } catch (e) {
        return res.status(401).json({ error: "User not recognized" })
    }
    next()
}

module.exports = auth