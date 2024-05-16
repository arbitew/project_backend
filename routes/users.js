const {Router, response} = require('express')// here i use routes to my pages
const User = require('../models/User') // model for database

//const { readSync } = require('fs')
const router = Router()
router.get('/', async (req, res) => {
    console.log('wow')
    res.render('index', {
        wow: 'Hello world'
    })
})
router.get('/sign_in', async (req, res) => {
    console.log('wow')
    res.render('index', {
        wow: 'Hello world'
    })
})


router.post('/', async (req, res)=>{ // User registration
    console.log(req.body.name)
    const user = new User({
        login: req.body.login,
        name: req.body.name,
        password: req.body.password,
        ava: req.body.ava
    })
    await user.save()
    const myname = await User.findOne({"name": req.body.name})
    res.render('index', {
        name: myname.name,
    })
})

module.exports = router