const router = require('express').Router()
const { getCollection, ObjectId } = require('../../../dbconnect')
let collection = null
const getRecipes = async () => {
    if (!collection) collection = await getCollection('Fitch_Customs', 'Recipes')
    return collection
}
router.get('/', async (request, response) => {
    const collection = await getRecipes()
    const found = await collection.find().toArray()

    // convert ObjectId to string for client-side use
    const normalized = found.map(r => ({ ...r, _id: r._id && r._id.toString ? r._id.toString() : r._id }))
    response.send(normalized)
})

router.get('/:id', async (request, response) => {
    const { id } = request.params
    const collection = await getRecipes()
    const found = await collection.findOne({ _id: new ObjectId(id) })
    if (found && found._id && found._id.toString) found._id = found._id.toString()
    response.send(found)
})

router.post('/', async (request, response) => {
    const { name, category, description, price, image } = request.body
    const collection = await getRecipes()
    const { acknowledged, insertedId } = await collection.insertOne({ name, category, description, price, image })
    response.send({ acknowledged, insertedId })
})
module.exports = router