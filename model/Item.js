const mongoose = require('mongoose')

const Schema = mongoose.Schema

const itemSchema = new Schema({
    input_item: [{
        name: {type: String, required: true},
        type: {type: String, required: true},
        is_populate: {type: Boolean, default: false},
        place_holder: String
    }],
    url: {type: String, required: true},
    submit_value: {type: String, required: true},
    item_type: {type: String, required: true},
    on_submit: {type:String, required: true},
    section_id: {type: Schema.Types.ObjectId, ref: 'Section', required: true},
    is_submit_all: {type: Boolean, required: true},
    description: String,
    lead: String,
    category_id: {type: Schema.Types.ObjectId, ref: 'Category', required: true}
})

module.exports = mongoose.model('Item', itemSchema)