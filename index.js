const express = require('express') // server
const mongoose = require('mongoose') // for mongoDB
const exphbs = require('express-handlebars') // I need to learn more about hbs
const todoRoutes = require('./routes/users')
//const path = require('path')

const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access')
const PORT = 3000 //process.env.PORT || 3000

const app = express()
const hbs = exphbs.create({
    defaultLayout: "main",
    extname: "hbs"
})

app.engine('hbs', hbs.engine) // um... engine for hbs... as far as I understood it used to use hbs
app.set('view engine', 'hbs')
app.set('views', 'views') // main page

app.use(express.urlencoded({ extended: true })) // ?
//app.use(express.static(path.join(__dirname, 'public'))) // use it to go to out CSS, didn't understood absolutely

app.use(todoRoutes) // smth about our pages

async function start() { // DB connect
    try {
        await mongoose.connect('mongodb://127.0.0.1/users',
            {
                //useNewUrlParser: true,
            }
        )
        app.listen(PORT, () => {
            console.log('server has been started...')
        })
    }
    catch (e) {
        console.log(e)
    }
}



start() // server start