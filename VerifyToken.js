const jwt = require('jsonwebtoken')
function verifyToken(req, res, next){
    let token = req.headers['x-access-token']
    console.log(token)
    if(!token){
        return res.status(403).send({aut: false, message:'No token provided.'})
    }

    jwt.verify(token, process.env.JWT_SECRET, function(err, decoded){
        if(err)
            return res.status(500).send({aut: false, message:'Failede to authenticate token.'})

            req.userId = decoded.id
            
            next()
    })
}

module.exports = verifyToken
