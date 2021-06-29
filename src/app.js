const path = require('path')
const express = require('express')
const hbs = require('hbs')
const geocode = require('./utils/geocode')
const forecast = require('./utils/forecast')

const app = express()
const port = process.env.PORT || 3000

// Define paths for express config
const publicDirectoryPath = path.join(__dirname, '../public')
const viewsPath = path.join(__dirname, '../template/views')
const partialsPath = path.join(__dirname, '../template/partials')

// Setup handlebars engine and views location
app.set('view engine', 'hbs')
app.set('views', viewsPath)
hbs.registerPartials(partialsPath)

// Setup static directory to serve
app.use(express.static(publicDirectoryPath))

app.get('', (req, res) => {
  res.render('index', {
    title: 'Weather App',
    name: "Hussein"
  })
})

app.get('/about', (req, res) => {
  res.render('about', {
    title: "About",
    name: 'Tunz'
  })
})

app.get('/help', (req, res) => {
  res.render('help', {
    message: "This is a Help page",
    title: 'Help',
    name: 'suna'
  })
})

app.get('/weather', (req, res) => {
  const address = req.query.address
  if (!address) {
    return res.send({
      error: "You must provide an address"
    })
  }
  geocode(address, (error, { latitude, longitude, location } = {}) => {
    if (error) {
      return res.send({
        error
      })
    }

    forecast(longitude, latitude, (error, forecastData) => {
      if (error) {
        return res.send(error)
      }
      res.send({
        location: location,
        forecast: forecastData,
        address: address
      })
    })
  })

})

app.get('/help/*', (req, res) => {
  res.render('404', {
    title: '404',
    name: 'Hussein',
    message: 'help article not found'
  })
})

app.get('*', (req, res) => {
  res.render('404', {
    title: '404',
    name: "Hussein",
    message: 'Page not found'
  })
})

app.listen(port, () => {
  console.log("Server running on port " + port)
})