const express = require('express');
const router = express.Router();
const User = require('../models/user.model');

router.post('/register' ,async (req, res)=>{
    const {name, email, password} = req.body;
    try {
        // const user = await User.create({name, email, password});
        console.log(name, email, password)
        return res.status(201).json("got the details");
    } catch (error) {
        return res.status(500).json(error);
    }
});