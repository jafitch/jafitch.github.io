//recipe elements
const recipesList = document.querySelector(".recipes")

//model elements
const modal = document.getElementById("recipesModal")
const closeButton = document.querySelector(".close-button")
const deleteRecipeButton = document.getElementById('deleteRecipeButton')
let currentRecipeId = null
const modalElements = {
    name: document.getElementById('recipesmodalName'),
    ingredients: document.getElementById('recipesmodalIngredients'),
    instructions: document.getElementById('recipesmodalInstructions'),
    image: document.getElementById('recipesmodalImage'),
    deleteButton: deleteRecipeButton
}

if (!modal) {
    console.warn('recipes.js: recipesModal element not found on this page.')
}

const missingModal = Object.keys(modalElements).filter(k => !modalElements[k])
if (missingModal.length) console.warn('recipes.js: missing modal element(s):', missingModal.join(','))

// simple HTML escape to avoid injection when using innerHTML
const escapeHTML = str => String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')

const normalizeList = value => {
    if (Array.isArray(value)) return value.map(item => String(item).trim()).filter(Boolean)
    if (typeof value === 'string') {
        return value
            .split(/\r?\n|,/)
            .map(item => item.trim())
            .filter(Boolean)
    }
    return []
}

const renderList = (element, value) => {
    if (!element) return
    const items = normalizeList(value)
    if (!items.length) {
        element.innerHTML = '<li>Not provided.</li>'
        return
    }

    element.innerHTML = items.map(item => `<li>${escapeHTML(item)}</li>`).join('')
}

const getRecipeItems = async () => {
    const response = await fetch('/api/v1/recipes')
    if (!response.ok) throw new Error(`Recipe list request failed: ${response.status}`)
    return await response.json()
}
const getRecipe = async id => {
    const response = await fetch(`/api/v1/recipes/${id}`)
    if (!response.ok) throw new Error(`Recipe request failed: ${response.status}`)
    return await response.json()
}

const deleteRecipe = async id => {
    if (!id) return

    const confirmed = window.confirm('Are you sure you want to delete this recipe?')
    if (!confirmed) return

    const response = await fetch(`/api/v1/recipes/${id}`, { method: 'DELETE' })
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || 'Recipe could not be deleted.')
    }

    modal.style.display = 'none'
    currentRecipeId = null

    if (recipesList) {
        recipesList.innerHTML = ''
        const recipes = await getRecipeItems()
        showRecipesList(recipes)
    }
}

const showRecipesList = recipes => {
    if (!Array.isArray(recipes) || recipes.length === 0) {
        if (recipesList) {
            recipesList.innerHTML = '<p class="empty-state">No recipes available right now.</p>'
        }
        return
    }

    recipes.forEach(({ _id, name, ingredients, instructions, image, }) => {
        if (!recipesList) return
        const recipeItem = document.createElement("div")
        const imageUrl = image
        recipeItem.className = "recipe-item"

        recipeItem.innerHTML = `
            <img src="${imageUrl}" alt="${name}" crossorigin="anonymous" style="width: 175px; height: 175px; object-fit: cover;">
            <div>
                <h3>${name}</h3>
            </div>
        `
        const idStr = _id && (typeof _id === 'string' ? _id : (_id.$oid || _id.toString && _id.toString()))
        recipeItem.onclick = () => showRecipeDetails(idStr)
        recipesList.appendChild(recipeItem)
    })
}
const showRecipeDetails = async id => {
    currentRecipeId = id || null

    const recipe = await getRecipe(id)
    console.debug('showRecipeDetails fetched recipe:', recipe)
    console.debug('showRecipeDetails modalElements:', modalElements)

    const { name, image, ingredients, instructions } = recipe || {}

    if (modalElements.name) {
        modalElements.name.textContent = name || ''
    } else console.warn('recipes.js: modalElements.name is null')

    if (modalElements.ingredients) {
        renderList(modalElements.ingredients, ingredients)
    } else console.warn('recipes.js: modalElements.ingredients is null')

    if (modalElements.instructions) {
        renderList(modalElements.instructions, instructions)
    } else console.warn('recipes.js: modalElements.instructions is null')

    if (modalElements.image) {
        modalElements.image.src = image || ''
    } else console.warn('recipes.js: modalElements.image is null')

    if (modalElements.deleteButton) {
        modalElements.deleteButton.disabled = !currentRecipeId
    }

    modal.style.display = 'flex'
}

if (modalElements.deleteButton) {
    modalElements.deleteButton.onclick = async () => {
        try {
            await deleteRecipe(currentRecipeId)
        } catch (error) {
            console.error('Failed to delete recipe:', error)
            window.alert(error.message || 'Recipe could not be deleted.')
        }
    }
}

if (closeButton && modal) {
    closeButton.onclick = () => modal.style.display = 'none'
}

if (modal) {
    window.onclick = event => {
        if (event.target === modal) modal.style.display = 'none'
    }
}

; (async () => {
    if (!recipesList) return

    try {
        const recipes = await getRecipeItems()
        showRecipesList(recipes)
    } catch (error) {
        console.error('Failed to load recipes:', error)
        recipesList.innerHTML = '<p class="empty-state">Recipes are unavailable right now.</p>'
    }
})()