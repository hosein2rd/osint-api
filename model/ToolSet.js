const mongoose = require('mongoose')

const Schema = mongoose.Schema

const toolSetSchema = new Schema({
    title: {type: String, required: true},
    icon: {type:String, default: 'no-icon'},
    categories: [{
        type: Schema.Types.ObjectId,
        ref: 'Category'
    }]
})

module.exports = mongoose.model('Tool Set', toolSetSchema)