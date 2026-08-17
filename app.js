const express = require('express')
const colors = require('ansi-colors')
const app = express()
const port = 3000

app.use(express.json())
app.use(express.static('docs'))
app.use('/api/v1/recipes', require('./routes/api/v1/recipes.js'))
//app.use('/api/v1/events', require('./routes/api/v1/events.js'))
app.use(require('./routes/static'))
//app.listen(port, () => console.log(`Listening on port: ${port}`))

const url = colors.blue('http://localhost:3000/')
const message = `Server is running on port ${port}. Visit ${url} in your browser.`
app.listen(port, () => console.log(message))
