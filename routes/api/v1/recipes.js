const router = require('express').Router()
const { getCollection, ObjectId } = require('../../../dbconnect')

const fallbackRecipes = [
    {
        _id: 'fallback-1',
        name: 'Crispy Tofu Bowl',
        category: 'Dinner',
        description: 'A savory bowl with crispy tofu, rice, and vegetables.',
        ingredients: ['tofu', 'rice', 'broccoli', 'soy sauce', 'sesame seeds'],
        instructions: ['Press and cube the tofu.', 'Pan-sear until crispy.', 'Serve over rice with vegetables and sauce.'],
        image: 'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=800&q=80'
    },
    {
        _id: 'fallback-2',
        name: 'Garden Pasta',
        category: 'Dinner',
        description: 'Fresh pasta tossed with herbs, vegetables, and a light sauce.',
        ingredients: ['pasta', 'zucchini', 'tomatoes', 'basil', 'olive oil'],
        instructions: ['Cook pasta until al dente.', 'Sauté vegetables in olive oil.', 'Toss together with basil and serve.'],
        image: 'https://images.unsplash.com/photo-1555949258-eb67b1ef0ceb?auto=format&fit=crop&w=800&q=80'
    },
    {
        _id: 'fallback-3',
        name: 'Berry Oat Parfait',
        category: 'Breakfast',
        description: 'Layered oats, yogurt, berries, and honey for a simple breakfast.',
        ingredients: ['oats', 'yogurt', 'berries', 'honey'],
        instructions: ['Layer oats and yogurt.', 'Add berries between layers.', 'Finish with a drizzle of honey.'],
        image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=800&q=80'
    }
]

let collection = null
const getRecipes = async () => {
    if (!collection) collection = await getCollection('Fitch_Customs', 'Recipes')
    return collection
}

const normalizeList = (value, options = {}) => {
    const { splitOnCommas = true } = options

    if (Array.isArray(value)) {
        return value.map(item => String(item).trim()).filter(Boolean)
    }

    if (typeof value === 'string') {
        const normalized = value.trim()
        if (!normalized) return []

        if (normalized.includes('\n')) {
            return normalized
                .split(/\r?\n+/)
                .map(item => item.trim())
                .filter(Boolean)
        }

        if (splitOnCommas && normalized.includes(',')) {
            return normalized
                .split(',')
                .map(item => item.trim())
                .filter(Boolean)
        }

        return [normalized]
    }

    return []
}

const normalizeRecipe = recipe => {
    if (!recipe) return recipe

    return {
        ...recipe,
        _id: recipe._id && recipe._id.toString ? recipe._id.toString() : recipe._id,
        ingredients: normalizeList(recipe.ingredients),
        instructions: normalizeList(recipe.instructions)
    }
}

router.get('/', async (request, response) => {
    try {
        const collection = await getRecipes()
        const found = await collection.find().toArray()
        const normalized = found.map(normalizeRecipe)
        response.send(normalized)
    } catch (error) {
        console.error('MongoDB unavailable for recipe list:', error.message)
        response.send(fallbackRecipes.map(normalizeRecipe))
    }
})

router.get('/:id', async (request, response) => {
    const { id } = request.params

    try {
        const collection = await getRecipes()
        const found = await collection.findOne({ _id: new ObjectId(id) })
        if (found && found._id && found._id.toString) found._id = found._id.toString()
        response.send(found ? normalizeRecipe(found) : found)
    } catch (error) {
        console.error('MongoDB unavailable for single recipe lookup:', error.message)
        const recipe = fallbackRecipes.find(item => item._id === id || item._id.toString() === id)
        response.send(recipe ? normalizeRecipe(recipe) : null)
    }
})

router.post('/', async (request, response) => {
    const { name, category = 'General', description = '', price, image, ingredients, instructions } = request.body || {}

    const cleanedIngredients = normalizeList(ingredients, { splitOnCommas: true })
    const cleanedInstructions = normalizeList(instructions, { splitOnCommas: false })

    if (!name || !cleanedIngredients.length || !cleanedInstructions.length) {
        return response.status(400).send({ acknowledged: false, error: 'Recipe name, ingredients, and instructions are required.' })
    }

    try {
        const collection = await getRecipes()
        const payload = {
            name,
            category,
            description,
            price,
            image,
            ingredients: cleanedIngredients,
            instructions: cleanedInstructions
        }

        const { acknowledged, insertedId } = await collection.insertOne(payload)
        response.send({ acknowledged, insertedId })
    } catch (error) {
        console.error('MongoDB unavailable while inserting recipe:', error.message)
        response.status(503).send({ acknowledged: false, error: 'MongoDB unavailable; recipe could not be saved.' })
    }
})

router.delete('/:id', async (request, response) => {
    const { id } = request.params

    if (!id || !ObjectId.isValid(id)) {
        return response.status(400).send({ acknowledged: false, error: 'A valid recipe id is required.' })
    }

    try {
        const collection = await getRecipes()
        const result = await collection.deleteOne({ _id: new ObjectId(id) })

        if (result.deletedCount === 0) {
            return response.status(404).send({ acknowledged: true, deletedCount: 0, error: 'Recipe not found.' })
        }

        response.send({ acknowledged: result.acknowledged, deletedCount: result.deletedCount })
    } catch (error) {
        console.error('MongoDB unavailable while deleting recipe:', error.message)
        response.status(503).send({ acknowledged: false, error: 'MongoDB unavailable; recipe could not be deleted.' })
    }
})

module.exports = router