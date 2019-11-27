const jwt = require('jsonwebtoken')
require('dotenv').config()

module.exports = {
    refreshToken: async (args) => {
        try {
            var decodedToken = await jwt.verify(args.token, process.env.JWT_SECRET_KEY)
            var email = decodedToken.email
            var username = decodedToken.username
            var type = decodedToken.type
            var user = decodedToken.user
            var token = await jwt.sign({email: email, username: username, type: type, user: user}, process.env.JWT_SECRET_KEY, {expiresIn: '1h'})
            result = {token: token, user: user}
            return result 
        } catch(err) {
            throw err
        }
    }
}