const express = require('express');
const Model =require('../models/UserModel');
const jwt =require('jsonwebtoken');
const bcrypt = require('bcrypt');
require('dotenv').config();

const router = express.Router();

router.post('/add', async (req,res) => {
    try {
        console.log('Signup request received:', {name: req.body.name, email: req.body.email});
        
        // Hash the password
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        
        // Prepare user data without confirmPassword
        const userData = {
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword
        };
        
        const newUser = new Model(userData);
        const result = await newUser.save();
        
        res.status(200).json({message: 'User registered successfully', userId: result._id});
    } catch (err) {
        console.error('Signup error:', err.message, err);
        
        if (err?.code === 11000){
            res.status(400).json({message : 'Email already registered'});
        } else if (err.name === 'ValidationError') {
            res.status(400).json({message : 'Invalid data provided', details: err.message});
        } else {
            res.status(500).json({message : 'Internal Server Error', error: err.message});
        }
    }
});

router.get('/getall',(req,res) => {
    Model.find()
    .then((result) => {
        res.status(200).json(result);
    }).catch((err) => {
        res.status(500).json(err);
    });
});

router.get('/getbyid/:id', (req, res) => {
    Model.findById(req.params.id)
        .then((result) => {
            res.status(200).json(result);
        }).catch((err) => {
            res.status(500).json(err);
        });
});

// update
router.put('/update/:id', (req, res) => {

    Model.findByIdAndUpdate(req.params.id, req.body, { new: true })
        .then((result) => {
            res.status(200).json(result);
        }).catch((err) => {
            console.log(err);
            res.status(500).json(err);
        });
});


router.delete('/delete/:id',(req,res) => {
    Model.findByIdAndDelete(req.params.id)
    .then((result) => {
        res.status(200).json(result);
    }).catch((err) => {
        console.log(err);
        
        res.status(500).json(err);

    });

});


router.post('/authenticate', async (req, res) => {
    try {
        const user = await Model.findOne({email: req.body.email});
        
        if(!user) {
            return res.status(401).json({message: 'Invalid email or password'});
        }
        
        // Compare password with hashed password
        const isPasswordValid = await bcrypt.compare(req.body.password, user.password);
        
        if(!isPasswordValid) {
            return res.status(401).json({message: 'Invalid email or password'});
        }
        
        // Password matched, generate JWT
        const {_id, email} = user;
        const payload = {_id, email};
        
        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn:'6h' },
            (err, token) => {
                if(err){
                    console.error('JWT signing error:', err);
                    res.status(500).json({message: 'Token generation failed'});
                } else {
                    res.status(200).json({token});
                }
            }
        );
    } catch (err) {
        console.error('Authentication error:', err);
        res.status(500).json({message: 'Authentication error', error: err.message});
    }
});

module.exports = router;