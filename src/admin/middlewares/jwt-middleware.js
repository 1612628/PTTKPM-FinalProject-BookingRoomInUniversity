const jwt = require('jsonwebtoken')
const secretKey = process.env.SECRET_KEY || 'wtf'
const tokenName = 'NIGAMON_JWT_TOKEN'

const JwtMiddleware = (req, res, next) => {
    if (req.headers.authorization) {
        jwt.verify(req.headers.authorization.slice(7), secretKey, (err, decoded) => {
            if (err) {
                console.log(err)
                res.status(401).send('Unauthorized Access')
            } else {
                jwt.sign({
                    username: decoded.username,
                    fullname: decoded.fullname,
                    cmnd: decoded.cmnd,
                    phone: decoded.phone,
                    email: decoded.email
                }, secretKey, {
                        expiresIn: "2h"
                    }, (err, token) => {
                        if (err) {
                            res.status(500).send('Something is broken')
                        } else {
                            res.set(tokenName, token)
                            res.status(200)
                            next()
                        }
                    })
            }
        })
    } else {
        res.status(401).send('Unauthorized Access')
    }
}

module.exports = {
    JwtMiddleware
}