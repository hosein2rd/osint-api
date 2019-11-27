const mongoose = require('mongoose')

const Schema = mongoose.Schema

const externalLinkSchema = new Schema({
    name: {type: String, required: true},
    url: {type: String, required: true},
    target: String,
    item_type: {type: String, required: true},
    section_id: {type: Schema.Types.ObjectId, ref: 'Section'},
    category_id: {type: Schema.Types.ObjectId, ref: 'Category'}
})

module.exports = mongoose.model('External Link', externalLinkSchema)