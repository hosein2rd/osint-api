const userResolver = require('./user')
const toolSetResolver = require('./toolSet')
const categoryResolver = require('./category')
const sectionResolver = require('./section')
const externalLinkResolver = require('./externalLink')
const itemResolver = require('./item')
const imageItemResolver = require('./imageItem')
const tokenResolver = require('./token')

const RootResolver = {
    ...userResolver,
    ...toolSetResolver,
    ...categoryResolver,
    ...sectionResolver,
    ...externalLinkResolver,
    ...itemResolver,
    ...imageItemResolver,
    ...tokenResolver
}

module.exports = RootResolver