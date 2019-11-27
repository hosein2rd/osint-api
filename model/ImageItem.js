const mongoose = require('mongoose')

const Schema = mongoose.Schema

const imageItemSchema = new Schema({
    src: {type: String, required: true},
    item_type: {type: String, required: true},
    section_id: {type: Schema.Types.ObjectId, ref: 'Section'},
    category_id: {type: Schema.Types.ObjectId, ref: 'Category'}
})

module.exports = mongoose.model('Image Item', imageItemSchema)