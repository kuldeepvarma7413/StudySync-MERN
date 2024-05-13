const express = require('express');
const router = express.Router();

router.use((req, res, next) => {
    const token = req.headers['authorization'];
    if(token){
        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if(err){
                res.json({status: 'ERROR', error: 'Unauthorized request'})
            }else{
                console.log(decoded)
                next()
            }
        })
    }else{
        res.json({status: 'ERROR', error: 'Unauthorized request'})
    }
})

module.exports = router; // Export the router for use in the main app