const {Schema, model} = require('mongoose')

const schema = new Schema({ //creating todo model with columns whick described below
    login: {//title(what to do) 
        type: String,
        unique: true,
        require:true
    },
    name: {//
        type: String,
        unique: true,
        require:true
    },
    password: {//
        type: String,
        require:true
    },
    ava: {//choose your ava
        type: BigInt,
        require:true
    }
})
module.exports = model('User', schema)
