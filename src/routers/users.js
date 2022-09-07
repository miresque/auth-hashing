const express = require('express');
const router = express.Router();
const secretKey = process.env.JWT_SECRET

const jwt = require('jsonwebtoken');
const prisma = require('../utils/prisma.js')

router.delete('/:id', async (req, res) => {
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

        // If the user is an ADMIN they can go along with delete
        if (user.role === 'ADMIN') {
            await prisma.user.delete({
                where: {
                    // id param is deleted, not the Admin's id and their records
                    id: Number(req.params.id)
                }
            })
            return res.status(201).json({ msg: "user deleted" })
        }

        res.status(401).json({ error: "Not Authorized, but nice try" })
    } catch (e) {
        res.status(401).json({ error: "Invalid attempt" })
    }
});

module.exports = router;
