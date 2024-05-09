require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const User = require('./models/user.model');
const jwt = require('jsonwebtoken');

const port = process.env.PORT || 5000;

// connect to MongoDB
mongoose.connect(process.env.MONGO_URL).then(()=>{console.log('Connected to MongoDB');
    app.listen(port, (err)=>{
        if(err) throw err;
        console.log(`Server is running on port ${port}}`);
    });
}).catch(err=>console.log(err));

const app = express();

// middleware
app.use(cors());
app.use(express.json());


// routes
// app.use('/auth', require('./routes/userRouter'));

app.post('/api/register', async (req, res)=>{
    const {name, email, password} = req.body;
    try{
        const user = await User.create({
            name: name,
            email: email,
            password: password
        })
        res.json({status: 'OK', message: "User registered successfully"});
    }catch(err){
        res.json({status: 'ERROR', error: 'Duplicate email found'})
    }
});

app.post('/api/login', async (req, res)=>{
    const {email, password} = req.body;
    try{
        const user = await User.findOne({
            email: email,
            password: password
        })

        if(user){
            const token = jwt.sign({
                name: user.name,
                email: user.email
            }, process.env.JWT_SECRET);
            res.json({status: 'OK', token: token ,message: "User logged in successfully"});
        }else{
            res.json({status: 'OK', token: false ,message: "User not found"});
        }
    }catch(err){
        res.json({status: 'ERROR', error: 'Duplicate email found'})
    }
});

app.get('/', (req, res)=>{
    res.send('Hello World');
});