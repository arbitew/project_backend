const { Router, response } = require('express')// here i use routes to my pages
const User = require('../models/User') // model for database
const Group = require('../models/Group') // model for database
const Task = require('../models/Task') // model for database

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


router.post('/', async (req, res) => { // User registration
    console.log(req.body.name)
    const user = new User({
        login: req.body.login,
        name: req.body.name,
        password: req.body.password,
        ava: req.body.ava,
        satiety: 100,
        lastTODO: Date.now()
    })
    await user.save()
    const myname = await User.findOne({ "name": req.body.name })
    res.render('index', {
        name: myname.name,
    })
})


router.post('/sign_in', async (req, res) => { // User sing in
    console.log(req.body.name)
    const user = await User.findOne({ "login": req.body.login })
    if (user !== null && user.password === req.body.password) {
        let diff = (Math.floor((Date.now() - user.lastTODO)/ 3600000)) // checking satiesity of user
        console.log((Math.floor((Date.now() - user.lastTODO)/ 3600000)))
        user.satiety -= BigInt(diff)
        //user.lastTODO = Date.now()
        await user.save()
        res.render('main_page', {
            name: user.name,
            id: user._id,
            password: user.password,
            all_groups: await Group.find({}).lean()
        })
    }
    else {
        res.render('sign_in', {
            name: "Wrong login or password",
        })
    }
})


router.post('/main_page', async (req, res) => { // New group
    //console.log(req.body.id[0])
    const group = new Group({
        userId: req.body.id,
        group_name: req.body.new_group,
    })
    await group.save()
    const all_groups = await Group.find({}).lean()
    //console.log(all_groups.group_name)
    //console.log(req.body.id)
    const user = await User.findOne({ "_id": req.body.id })
    if (user.name !== null && user.name == req.body.password) {
        res.render('main_page', {
            name: user.name,
            id: user._id,
            password: user.password,
            all_groups,
        })
    }
    else {
        res.render('main_page', {
            name: "Wrong login or password",
        })
    }
})

router.post('/go_group', async (req, res) => { // Go to group
    const group = await Group.findOne({ "_id": req.body.id_group})
    const user = await User.findOne({ "name": req.body.name })
    const all_tasks = await Task.find({ "groupId": group._id}).lean()
    if (user.name !== null && user.password == req.body.password && group.userId.toString() === user._id.toString()) {//Going to the group as a creator
        res.render('my_group', {
            id_group: group._id,
            group_name: group.group_name,
            name: user.name,
            password: user.password,
            all_tasks
        })
    }
    else {
        if (user.name !== null && user.password === req.body.password) {//Going to the group as a guest
            res.render('group', {
                id_group: group._id,
                group_name: group.group_name,
                name: user.name,
                password: user.password,
                all_tasks
            })
        }
    }
})
router.post('/new_task', async (req, res) => { // New task
    const group = await Group.findOne({ "_id": req.body.id_group })
    const user = await User.findOne({ "name": req.body.name })
    const task = new Task({
        groupId: req.body.id_group,
        task: req.body.new_task,
        completed: false
    })
    console.log(req.body)
    if (user.name !== null && user.password === req.body.password && group.userId.toString() === user._id.toString()) {
        await task.save()
        const all_tasks = await Task.find({ "groupId": group._id }).lean()
        res.render('my_group', {
            id_group: group._id,
            group_name: group.group_name,
            name: user.name,
            password: user.password,
            all_tasks
        })
    }
    else {
        if (user.name !== null && user.password === req.body.password) {
            await task.save()
            const all_tasks = await Task.find({ "groupId": group._id }).lean()
            res.render('group', {
                id_group: group._id,
                group_name: group.group_name,
                name: user.name,
                password: user.password,
                all_tasks
            })
        }
    }
})
router.post('/save_tasks', async (req, res) => { // Go to group
    const group = await Group.findOne({ "_id": req.body.id_group })
    const task = await Task.findOne({ "_id": req.body.id_task })
    const user = await User.findOne({ "name": req.body.name })
    if (user.name !== null && user.password == req.body.password) {//Going to the group as a creator
        console.log(req.body.id_task)
        task.completed = !!req.body.completed
        user.satiety += BigInt(10)
        user.lastTODO = Date.now()
        await task.save()
        await user.save()
        const all_tasks = await Task.find({ "groupId": group._id }).lean()
        res.render('group', {
            id_group: group._id,
            group_name: group.group_name,
            name: user.name,
            password: user.password,
            all_tasks
        })
    }
    else {
        const all_tasks = await Task.find({ "groupId": group._id }).lean()
        res.render('group', {
            id_group: group._id,
            group_name: group.group_name,
            name: user.name,
            password: user.password,
            all_tasks
        })
    }
})

module.exports = router