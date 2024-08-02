require('dotenv').config()
const express = require('express')
const app = express()
const mongoose = require('mongoose')
const MONGO_URI = process.env.MONGO_URI
const PORT = 3000
const Note = require('./models/note')
const logger = require('morgan')
const methodOverride = require('method-override')

app.use(express.json()) 
app.use(express.urlencoded({ extended: true }))
app.use(logger('tiny'))
app.use(methodOverride('_method'))
app.use('/assets', express.static('public'))

mongoose.connect(MONGO_URI)

mongoose.connection.once('open', () => {
    console.log('MongoDB is showing love')
})

mongoose.connection.on('error', () => {
    console.error('You know how MongoDB be trippin')
})

app.post('/fruits', async (req, res) => {
    req.body.readyToEat === 'on' || req.body.readyToEat === true?
    req.body.readyToEat = true :
    req.body.readyToEat = false
    try {
        const createdFruit = await Fruit.create(req.body)
        res.redirect(`/fruits/${createdFruit._id}`)
    } catch (error) {
        res.status(400).json({ message: error.message })
    }

})

app.get('/fruits/new', (req, res) => {
    res.render('new.ejs')
})

app.get('/fruits', async (req, res) => {
    try {
        const foundFruits = await Fruit.find({})
        res.render('index.ejs', {
            fruits: foundFruits
        })
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
})

app.get('/fruits/:id', async (req, res) => {
    try {
        const foundFruit = await Fruit.findOne({_id: req.params.id })
        res.render('show.ejs', {
            fruit: foundFruit
        })
    }catch (error) {
        res.status(400).json({ message: error.message })
    }
})