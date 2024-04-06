
const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const {v4 : uuidv4} = require('uuid')
const secretKey = uuidv4();

module.exports = {
    generateToken: (user) => {
        return jwt.sign({ id: user.id, username: user.username }, secretKey, { expiresIn: '1h' });
    },
    authenticateToken: (req, res, next) => {
        const token = req.headers['authorization'];
        if (!token) return res.status(401).send('Access Denied');

        jwt.verify(token, secretKey, (err, user) => {
            if (err) return res.status(403).send('Invalid Token');
            req.user = user;
            next();
        });
    },
    clearToken: (res) => {
        res.setHeader('Authorization', '');
    }
};
