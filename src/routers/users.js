const express = require('express');
const router = express.Router();
const prisma = require('../utils/prisma.js')

router.delete('/:id', async (req, res) => {    
    try {
        // If the user is an ADMIN they can go along with delete
        if (req.user.role === 'ADMIN') {
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
        res.status(400).json({ error: "Invalid attempt" })
    }
});

module.exports = router;
