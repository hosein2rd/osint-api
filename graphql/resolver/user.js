const User = require('../../model/User')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const passport = require('passport')
require('dotenv').config()

module.exports = {
    users: async(args, req) => {
        if (!req.isAuth) throw new Error('Unauthorization')
        var authUser = req.user
        if (authUser.type != 'admin' && authUser._id != args.id) throw new Error('Access denied')
        var users = await User.find()
        return users.map(user => {
            return {...user._doc, _id: user.id, password: null }
        })
    },
    getUser: async(args, req) => {
        if (!req.isAuth) throw new Error('Unauthorization')
        var authUser = req.user
        if (authUser.type != 'admin' && authUser._id != args.id) throw new Error('Access denied')
        try {
            var user = await User.findOne({ _id: args.id })
            if (!user) {
                throw new Error('User not found')
            }
            return user
        } catch (err) {
            throw err
        }
    },
    createUser: async(args, req) => {
        try {
            var username = args.userInput.username
            var email = args.userInput.email
            var userWithSameUsername = await User.findOne({ username: username })
            if (userWithSameUsername) {
                throw new Error('Username exist!')
            }
            var userWithSameEmail = await User.findOne({ email: email })
            if (userWithSameEmail) {
                throw new Error('Email exist!')
            }
            var hashedPassword = await bcrypt.hash(args.userInput.password, 12)
            var user = new User({
                firstname: args.userInput.firstname,
                lastname: args.userInput.lastname,
                type: 'admin',
                email: args.userInput.email,
                username: args.userInput.username,
                password: hashedPassword
            })
            var result = await user.save()
            var token = await jwt.sign({ type: user.type, user: user },
                    process.env.JWT_SECRET_KEY, { expiresIn: '1h' })
                //login for passport
            req.login(user, (err) => {
                if (err) throw err
            })
            return { user: result, token: token }
        } catch (err) {
            throw err
        }
    },
    deleteUser: async(args, req) => {
        if (!req.isAuth) throw new Error('UnAuthorization')
        var authUser = req.user
        if (authUser.type != 'admin' && authUser._id != args.id) throw new Error('Access denied')
        try {
            var result = await User.deleteOne({ _id: args.id })
            console.log(result)
            return { success: true }
        } catch (err) {
            throw err
        }
    },
    updateUser: async(args, req) => {
        if (!req.isAuth) throw new Error('UnAuthorization')
        var authUser = req.user
        if (authUser.type != 'admin' && authUser._id != args.id) throw new Error('Access denied')
        try {
            var id = args.input._id
            var user = await User.findOne({ _id: id })
            if (!user) throw new Error('User not found')
            var username = args.input.username
            var email = args.input.email
            var firstname = args.input.firstname
            var lastname = args.input.lastname
            var password = args.input.password
            if (username) {
                var userWithSameUsername = await User.findOne({ username: username })
                if (userWithSameUsername) {
                    throw new Error('Username exist')
                }
                user.username = username
            }
            if (email) {
                var userWithSameEMail = await User.findOne({ email: email })
                if (userWithSameEMail) {
                    throw new Error('Email exist')
                }
                user.email = email
            }
            if (firstname) { user.firstname = firstname }
            if (lastname) { user.lastname = lastname }
            if (password) {
                var hashedPassword = await bcrypt.hash(password, 12)
                user.password = hashedPassword
            }
            var savedUser = await user.save()
            return savedUser
        } catch (err) {
            throw err
        }
    },
    login: async(args, req) => {
        var email = args.input.email
        var username = args.input.username
        var password = args.input.password
        if (!email && !username) {
            throw new Error('Email or username is empty')
        }
        var user
        if (email) {
            try {
                user = await User.findOne({ email: email })
                if (!user) {
                    throw new Error('Email is not exist')
                }
                var passwordIsValid = await checkPassword(user, password)
                if (!passwordIsValid) throw new Error('Your password is incorrect')
            } catch (err) {
                throw err
            }
        }
        if (username) {
            try {
                user = await User.findOne({ username: username })
                if (!user) {
                    throw new Error('Username is not exist')
                }
                var passwordIsValid = await checkPassword(user, password)
                if (!passwordIsValid) throw new Error('Your password is incorrect')
            } catch (err) {
                throw err
            }
        }
        var token = await jwt.sign({ email: user.email, username: user.username, type: user.type, user: user }, process.env.JWT_SECRET_KEY, { expiresIn: '1h' })
        if (!token) throw new Error('Unauthorization')
            //login for passport
        req.login(user, (err) => {
            if (err) throw err
        })
        return { user: user, token: token }
    },
    logout: async(args, req) => {
        if (!req.isAuth) throw new Error('UnAuthorization')
        req.logOut()
        return { success: true }
    }
}

passport.serializeUser((user, done) => {
    done(null, user)
})

passport.deserializeUser((user, done) => {
    User.findById(user._id, (err, user) => {
        done(err, user)
    })
})

async function checkPassword(user, password) {
    try {
        var isSame = await bcrypt.compare(password, user.password)
        return isSame
    } catch (err) {
        throw err
    }
}