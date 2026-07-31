const path = require('path')
const router = require('express').Router()

const root = path.join(__dirname, '..', 'public')

router.get('/', (request, response) => {
    response.sendFile('index.htm', { root })
})
router.get('/recipes', (request, response) => {
    response.sendFile('index.htm', { root })
})

router.get('/calorie-tracker', (request, response) => {
    response.sendFile('index.htm', { root })
})

module.exports = router