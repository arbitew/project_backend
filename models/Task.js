const {Schema, model} = require('mongoose')
const mongoose = require('mongoose') // for mongoDB

const schema = new Schema({ //Task schema
    groupId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Group',
        required:true,
    },
    task:{
        type: String,
        required: true,
    },
    completed:{
        type: Boolean,
        default: false,
        required: true,
    }
})
module.exports = model('Task', schema)
