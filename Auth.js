module.exports = {
    loginUser,
    logoutUser,
    getCurrentUser,
    signInUser
}

const User = require('../models/User')

const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const sha256 = require('sha256')

const verifyToken = require('../middleware/VerifyToken')

function loginUser(req, res){
    User.findOne({username: req.body.username}).then((user)=>{
        if(!user) return res.status(404).send('No user found')

        let passwordIsValid = bcrypt.compareSync(req.body.password, user.password)
        if(!passwordIsValid) return res.status(401).send({auth: false, message: 'Error password', token: null})

        let token = jwt.sign({id: user.id}, process.env.JWT_SECRET,{
            expiresIn: 864000
        })
        res.status(200).send({auth:true, token: token, username: user.username})
    })
    .catch((err)=>{
        console.log("Error on catch", err)
        res.status(500).sen({message: 'Error on server', error: err})
    })
}

function logoutUser(req, res){
    res.status(200).send({auth: false, token: null});
}

function getCurrentUser(req, res){
    let token = req.headers['x-access-token']

    if(!token) return res.status(401).send({auth: false, message: 'No token provided'})

    verifyToken(token)
    .then((decode)=> User.findOne({id: decoded.id}))
    .then((user)=>{
        if(!user) return res.status(401).send({auth: false, message: 'No user found'})
        res.status(200).send(user)
    })
    .catch((err)=> res.status(500).send({err}))
}

function signInUser(req, res){
    const user = new User({
        email: req.body.email,
        username: req.body.username,
        password: bcrypt.hashSync(req.body.password, 10),
        phone: req.body.phone,
        roles: req.body.roles
    })

    user.save((err)=>{
        let token = jwt.sign({id: user.id}, process.env.JWT_SECRET, {expiresIn: 86400})

        if(err) return res.status(500).send({message: `Problem creating new user ${err}`})

        return res.status(201).send({token: token, message: 'User Created'})
    })
}