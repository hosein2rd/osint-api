const mongoose = require('mongoose')

const Schema = mongoose.Schema

const categorySchema = new Schema({
    title: {type: String, required: true},
    icon: {type: String, default: 'no-icon'},
    tool_set_id: {type: Schema.Types.ObjectId, ref: 'Tool Set'},
    sections: [
        {type: Schema.Types.ObjectId, ref: 'Section'}
    ]
})

module.exports = mongoose.model('Category', categorySchema)