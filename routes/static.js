const path = require('path')
const router = require('express').Router()

const root = path.join(__dirname, '..', 'docs')

const servePage = (response, fileName) => {
    response.sendFile(fileName, { root })
}

router.get('/', (request, response) => {
    servePage(response, 'index.htm')
})
router.get('/index.htm', (request, response) => {
    servePage(response, 'index.htm')
})
router.get('/order', (request, response) => {
    servePage(response, 'order.htm')
})
router.get('/order.htm', (request, response) => {
    servePage(response, 'order.htm')
})
router.get('/recipes', (request, response) => {
    servePage(response, 'recipes.htm')
})
router.get('/recipes.htm', (request, response) => {
    servePage(response, 'recipes.htm')
})
router.get('/admin', (request, response) => {
    servePage(response, 'admin.htm')
})
router.get('/admin.htm', (request, response) => {
    servePage(response, 'admin.htm')
})

module.exports = router