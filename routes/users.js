const {Router, response} = require('express')// here i use routes to my pages
const User = require('../models/User') // model for database

//const { readSync } = require('fs')
const router = Router()
router.get('/', async (req, res) => { //redirect to register page
    console.log('wow')
    res.render('index', {
        wow: 'Hello world'
    })
})


router.get('/sign_in', async (req, res) => { // redirect to sing in page
    console.log('wowreg')
    res.render('sign_in', {
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


router.post('/sign_in', async (req, res)=>{ // User sing in
    console.log(req.body.name)
    const user = await User.findOne({"login": req.body.login})
    if(user !== null && user.password === req.body.password){
        res.render('main_page', {
            name: user.name,
            id: user.id,
        })        
    }
    else{
        res.render('sign_in', {
            name: "Wrong login or password",
        })
    }
})


module.exports = router