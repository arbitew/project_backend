const {Schema, model} = require('mongoose')

const schema = new Schema({ //Schema of group
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required:true,
    },
    name:{
        type: 'String',
        required: true,
    }
})
module.exports = model('Group', schema)
