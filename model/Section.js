const mongoose = require('mongoose')

const Schema = mongoose.Schema

const sectionSchema = new Schema({
    title: {type: String, required: true},
    category_id: {type: Schema.Types.ObjectId, ref: 'Category'},
    has_populate: {type: Boolean, required: true},
    populate_item:{
        type: [{
            populate: {type: String, required: true}
        }],
        required: true
    },
    page_type: {type: String, required: true},
    items: [{
        type: Schema.Types.ObjectId,
        ref: 'Item'
    }],
    external_links: [{
        type: Schema.Types.ObjectId,
        ref: 'External Link'
    }],
    image_items: [{
        type: Schema.Types.ObjectId,
        ref: 'Image Item'
    }]
})

module.exports = mongoose.model('Section', sectionSchema)