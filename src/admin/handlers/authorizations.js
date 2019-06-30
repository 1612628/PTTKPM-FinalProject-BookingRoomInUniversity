const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const secretKey = process.env.SECRET_KEY || 'wtf'

const AuthorizationHandlers = adminRepo => {
    return [
        {
            method: 'get',
            path: '/login',
            handler: checkLogin
        },
        {
            method: 'post',
            path: '/login',
            insecure: true,
            handler: login(adminRepo)
        }
    ]
}

const checkLogin = (req, res) => {
    console.log('check login')
    const decoded = jwt.decode(req.headers.authorization.slice(7))
    res.json({
        isLogin: true,
        userInfo: {
            username: decoded.username,
            fullname: decoded.fullname,
            cmnd: decoded.cmnd,
            phone: decoded.phone,
            email: decoded.email
        }
    })
}

const login = adminRepo => (req, res) => {
    console.log('login')
    adminRepo.fetchOneByUsername(req.body.username)
        .then(result => {
            if (result.ok) {
                const admin = result.msg
                bcrypt.compare(req.body.password, admin.password, (err, bcryptRes) => {
                    if (err) {
                        return res.json({ isLogin: false })
                    }
                    jwt.sign({
                        username: admin.username,
                        fullname: admin.fullname,
                        cmnd: admin.cmnd,
                        phone: admin.phone,
                        email: admin.email
                    }, secretKey, {
                            expiresIn: "2h"
                        }, (err, token) => {
                            if (err) {
                                res.status(500).send('Something is broken')
                            } else {
                                res.json({
                                    isLogin: true,
                                    token: token,
                                    userInfo: {
                                        username: admin.username,
                                        fullname: admin.fullname,
                                        cmnd: admin.cmnd,
                                        phone: admin.phone,
                                        email: admin.email
                                    }
                                })
                            }
                        })
                })
            } else {
                console.log(result.msg)
                res.json({ isLogin: false })
            }
        })
}

module.exports = {
    AuthorizationHandlers
}