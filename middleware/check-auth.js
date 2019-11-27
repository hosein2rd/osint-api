const jwt = require('jsonwebtoken')
require('dotenv').config()

module.exports = async(req, res, next) => {
    console.log(req.isAuthenticated())
    const token = req.get('token')
    if (!token && token === '') {
        req.isAuth = false
        return next()
    }
    var decodedToken
    try {
        decodedToken = await jwt.verify(token, process.env.JWT_SECRET_KEY)
    } catch (err) {
        console.log(err)
        req.isAuth = false
        return next()
    }
    if (!decodedToken) {
        req.isAuth = false
        return next()
    }
    req.isAuth = true
    var user = decodedToken.user
    req.user = {...user, password: null }
    return next()


    // req.isAuth = true
    // req.user.type = 'admin'
    // return next()
    // const token = req.get('token')
    // console.log(token)
    // if (req.user) {
    //     if (req.isAuthenticated()) {
    //         if (!token || token === '') {
    //             req.isAuth = false
    //             return next()
    //         }
    //         var decodedToken
    //         try {
    //             decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY)
    //         } catch (err) {
    //             console.log(err)
    //             req.isAuth = false
    //             return next()
    //         }
    //         if (!decodedToken) {
    //             req.isAuth = false
    //             return next()
    //         }
    //         req.isAuth = true
    //         var user = decodedToken.user
    //         req.user = {...user, password: null }
    //         return next()
    //     }
    // } else {
    //     req.isAuth = false
    //     return next()
    // }
}