const { buildSchema } = require('graphql')
const typeSchema = require('./type')
const inputSchema = require('./input')
const querySchema = require('./query')
const mutationSchema = require('./mutation')

module.exports = buildSchema(
    typeSchema + '\n' +
    inputSchema + '\n' + 
    querySchema + '\n' +
    mutationSchema + '\n' +
    `
        schema {
            query: RootQuery
            mutation: RootMutation 
        }
    `
)