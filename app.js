const express = require('express')
const bodyParser = require('body-parser')
const graphqlHttp = require('express-graphql')
const mongoose = require('mongoose')
const { graphqlUploadExpress } = require('graphql-upload')
const session = require('express-session')
const passport = require('passport')
require('dotenv').config()
const morgan = require('morgan')

const buildSchema = require('./graphql/schema/index')
const graphqlResolver = require('./graphql/resolver/index')

const app = express()
const auth = require('./middleware/check-auth')
const apiRouter = require('./api/get-db')

app.use(bodyParser.json())
app.use(express.static(__dirname + '/public'))
app.use(session({ secret: 'secret' }))
app.use(passport.initialize())
app.use(passport.session())
app.use(auth)
app.use(morgan('dev'))
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization, token");
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
        return res.status(200).json({});
    }
    next();
});

app.use('/graphql',
    graphqlUploadExpress({ maxFileSize: 10000000, maxFiles: 10 }),
    graphqlHttp({
        schema: buildSchema,
        rootValue: graphqlResolver,
        graphiql: true
    }))

app.use('/data', apiRouter)

var options = {
    socketTimeoutMS: 30000,
    keepAlive: true,
    useNewUrlParser: true,
    reconnectTries: 30000
};

mongoose.connect('mongodb://localhost:27017/osint', options).then(() => {
    app.listen(4000, () => {
        console.log('server connected to port 4000')
    })
}).catch(err => {
    console.log(err)
})