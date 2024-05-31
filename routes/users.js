const { Router, response } = require('express')// here i use routes to my pages
const User = require('../models/User') // model for database
const Group = require('../models/Group') // model for database
const Task = require('../models/Task') // model for database



function isLatinLetterOrDigit(char) { // checking if that function is a char
    if (char.length !== 1) {
        throw new Error('Input must be a single character.');
    }

    const charCode = char.charCodeAt(0);

    // Проверка, является ли символ цифрой (0-9)
    const isDigit = charCode >= 48 && charCode <= 57;

    // Проверка, является ли символ латинской буквой (A-Z или a-z)
    const isUpperCaseLetter = charCode >= 65 && charCode <= 90;
    const isLowerCaseLetter = charCode >= 97 && charCode <= 122;

    return isDigit || isUpperCaseLetter || isLowerCaseLetter;
}



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
    let is_wrong_ch = false
    if (req.body.login < 1 || req.body.name < 1 || req.body.password < 1) {
        is_wrong_ch = true
    }
    for (let i = 0; i < req.body.login.length; i++) {
        if (!isLatinLetterOrDigit(req.body.login[i])) {
            is_wrong_ch = true
        }
        if (!isLatinLetterOrDigit(req.body.name[i])) {
            is_wrong_ch = true
        }
        if (!isLatinLetterOrDigit(req.body.password[i])) {
            is_wrong_ch = true
        }
    }
    if (req.body.login.length > 30 || req.body.name.length > 30 || req.body.password.length > 30) {
        is_wrong_ch = true
    }
    if (!is_wrong_ch) {
        const user = new User({
            login: req.body.login,
            name: req.body.name,
            password: req.body.password,
            ava: req.body.ava,
            satiety: 100,
            lastTODO: Date.now()
        })
        try {
            await user.save()//trying to save user
            res.render('sign_in', {
            })
        }
        catch {
            res.render('index', {
            })
        }
    }
    else {
        res.render('index', {
        })
    }

})


router.post('/sign_in', async (req, res) => { // User sing in
    console.log(req.body.name)
    const user = await User.findOne({ "login": req.body.login })
    if (user !== null && user.password === req.body.password) {
        const today = new Date(Date.now())
        //today.setTime(today.getTime() + (4*60*60*1000))
        let diff = (Math.floor((Math.abs(today.getTime() - user.lastTODO.getTime())) / 3600000)) // checking satiesity of user
        console.log((Math.floor((Math.abs(today.getTime() - user.lastTODO.getTime())) / 3600000)))
        user.satiety -= BigInt(diff)
        user.lastTODO = Date.now()
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
    const user = await User.findOne({ "_id": req.body.id })
    const all_groups_before = await Group.find({}).lean()
    if (req.body.new_group.length > 20) {
        res.render('main_page', {
            name: user.name,
            id: user._id,
            password: user.password,
            all_groups_before,
        })
    }
    else {
        const group = new Group({
            userId: req.body.id,
            group_name: req.body.new_group,
        })
        try {
            await group.save()
            const all_groups = await Group.find({}).lean()
            //console.log(all_groups.group_name)
            //console.log(req.body.id)
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
        }
        catch {
            res.render('main_page', {
                name: user.name,
                id: user._id,
                password: user.password,
                all_groups_before,
            })
        }

    }

})

router.post('/go_group', async (req, res) => { // Go to group
    const group = await Group.findOne({ "_id": req.body.id_group })
    const user = await User.findOne({ "name": req.body.name })
    const all_tasks = await Task.find({ "groupId": group._id }).lean()
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
    console.log(req.body, "\n", req.body.new_task.length)
    if (user.name !== null && user.password === req.body.password && group.userId.toString() === user._id.toString() && req.body.new_task.length < 20) {
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
            const all_tasks = await Task.find({ "groupId": group._id }).lean()
            res.render('my_group', {
                id_group: group._id,
                group_name: group.group_name,
                name: user.name,
                password: user.password,
                all_tasks
            })
        }
    }
})
router.post('/save_tasks', async (req, res) => { // Save completed user's tasks
    const group = await Group.findOne({ "_id": req.body.id_group })
    const task = await Task.findOne({ "_id": req.body.id_task })
    const user = await User.findOne({ "name": req.body.name })
    if (user.name !== null && user.password == req.body.password) {
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

router.post('/profile', async (req, res) => { // User sing in
    console.log(req.body.name)
    const user = await User.findOne({ "name": req.body.name })
    if (user !== null && user.password === req.body.password) {
        const today = new Date(Date.now())
        //today.setTime(today.getTime() + (4*60*60*1000))
        let diff = (Math.floor((Math.abs(today.getTime() - user.lastTODO.getTime())) / 3600000)) // checking satiesity of user
        console.log((Math.floor((Math.abs(today.getTime() - user.lastTODO.getTime())) / 3600000)))
        user.satiety -= BigInt(diff)
        user.lastTODO = Date.now()
        await user.save()
        res.render('profile', {
            name: user.name,
            id: user._id,
            password: user.password,
            satiety: user.satiety,
            ava: user.ava,
        })
    }
    else {
        res.render('sign_in', {
            name: "Wrong login or password",
        })
    }
})
module.exports = router