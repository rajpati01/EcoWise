
const { token } = require('morgan');
const User = require('../models/User');
const jwt = require('jsonwebtoken');

const generateToken = (id) => {
    return jwt.sign({id}, process.env.JWT_SECRET, {expiresIn: '7d'})
}

exports.registerUser = async (req, res) => {
    const {name, email, password, confirmPassword, role} = req.body;
    try{
        const userExists = await User.findOne({email});

        // check if user already exist
        if(userExists) return res.status(400).json({message: "User already exists"})

        //create new user
        const user = await User.create({name, email, password, role})
        res.status(201).json({
            _id: user._id,
            name: User.name,
            email: User.email,
            role: User.role,
            token: generateToken(user._id)
        })

        if(password !== confirmPassword){
            return res.status(400).json({message: "Password do not match"})
        }
    } catch (err) {
        res.status(500).json({message: err.message});
    }
}

exports.loginUser = async (req, res) => {
    const {email, password } = req.body;

    try{
        const user = await User.findOne({email}).select('+password');

        if(user && await user.matchPassword(password)){
            res.status(200).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                tokenL: generateToken(user._id)
            })
        } else {
            res.status(401).json({message: 'Invalidcredentials'})
        }
    } catch(err) {
        res.status(500).json({message: err.message})
    }
}