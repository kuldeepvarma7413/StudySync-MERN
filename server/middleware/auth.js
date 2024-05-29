require('dotenv').config();
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

router.use((req, res, next) => {
    var token = req.headers['authorization'];
    token = token.replace('Bearer ', '')
    if(token){
        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if(err){
                res.json({status: 'ERROR', error: 'Unauthorized request'})
            }else{
                req.user = decoded
                next()
            }
        })
    }else{
        res.json({status: 'ERROR', error: 'Unauthorized request'})
    }
})

module.exports = router; // Export the router for use in the main app