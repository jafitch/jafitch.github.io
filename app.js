const express = require('express')
const path = require('path')
const colors = require('ansi-colors')
const app = express()
const port = 3000
const root = path.join(__dirname, 'docs')

app.use(express.json())
app.use(express.static(root))
app.use('/api/v1/recipes', require('./routes/api/v1/recipes.js'))
//app.use('/api/v1/events', require('./routes/api/v1/events.js'))
app.use(require('./routes/static.js'))
//app.listen(port, () => console.log(`Listening on port: ${port}`))

const url = colors.blue('http://localhost:3000/')
const message = `Server is running on port ${port}. Visit ${url} in your browser.`
app.listen(port, () => console.log(message))
