const path = require('path')
const express = require('express')
const hbs = require('hbs')
const geocode = require('./utils/geocode')
const forecast = require('./utils/forecast')

const app = express()
const port = process.env.PORT || 3000
// Define paths for express config
const publicDirPath = path.join(__dirname, '../public')
const viewsPath = path.join(__dirname, '../templates/views')
const partialPath = path.join(__dirname, '../templates/partials')

// Setup handelbars engine and views location
app.set('view engine', 'hbs')
app.set('views', viewsPath)
hbs.registerPartials(partialPath)

// Setuo static directory to serve
app.use(express.static(publicDirPath))


app.get('', (req,res) => {
    res.render('index',{
        title:'Weather',
        name:'Mahmoud'
    })
})

app.get('/about', (req,res) => {
    res.render('about',{
        title:'About Me',
        name:'Mahmoud'
    })
})

app.get('/help', (req, res) => {
    res.render('help',{
        help:'Help page',
        title:'Help',
        name:'Mahmoud'
    })
})

app.get('/weather', (req,res) => {
    if(!req.query.address){
        return res.send({
            error:'You must provide an address!'
        })
    }

    geocode(req.query.address,(error, {latitude,longitude,location} = {}) => {
        if(error){
            return res.send({error})
        }
        forecast(latitude,longitude, (error, forecastData) => {
            if(error){
                return res.send({error})
            }
            res.send({
                forecast:forecastData,
                location,
                address:req.query.address
            })
        })
    })
})

app.get('/products', (req,res) => {
    if(!req.query.search){
        return req.send({
            error:'you must provide search term'
        })
    }
    res.send({
        products:[]
    })
})

app.get('/help/*', (req,res) => {
    res.render('404',{
        title:'404 Page',
        message:'Help article not found',
        name:'Mahmoud'
    })
})

app.get('*', (req,res) => {
    res.render('404', {
        title:'404 Page',
        message:'Page not found',
        name:'Mahmoud'
    })
})

app.listen(port, () => {
    console.log('Server is up on port ' + port)
})