const {Schema, model} = require('mongoose')
const mongoose = require('mongoose') // for mongoDB

const schema = new Schema({ //Schema of group
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required:true,
    },
    group_name:{
        type: String,
        required: true,
    }
})
module.exports = model('Group', schema)
