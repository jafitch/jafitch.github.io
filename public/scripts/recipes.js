//recipe elements
const recipesList = document.querySelector(".recipes")

//model elements
const modal = document.getElementById("recipesModal")
const closeButton = document.querySelector(".close-button")
const modalElements = {
    name: document.getElementById('recipesmodalName'),
    ingredients: document.getElementById('recipesmodalIngredients'),
    instructions: document.getElementById('recipesmodalInstructions'),

    image: document.getElementById('recipesmodalImage')
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

const getRecipeItems = async () => {
    const response = await fetch('/api/v1/recipes')
    return await response.json()
}
const getRecipe = async id => {
    const response = await fetch(`/api/v1/recipes/${id}`)
    return await response.json()
}

const showRecipesList = recipes => {

    recipes?.forEach(({ _id, name, ingredients, instructions, image, }) => {
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

    const recipe = await getRecipe(id)
    console.debug('showRecipeDetails fetched recipe:', recipe)
    console.debug('showRecipeDetails modalElements:', modalElements)

    const { name, image, ingredients, instructions } = recipe || {}

    if (modalElements.name) {
        modalElements.name.textContent = name || ''
    } else console.warn('recipes.js: modalElements.name is null')

    if (modalElements.ingredients) {
        if (Array.isArray(ingredients)) {
            modalElements.ingredients.innerHTML = ingredients.map(i => escapeHTML(i)).join('<br>')
        } else {
            modalElements.ingredients.textContent = ingredients || ''
        }
    } else console.warn('recipes.js: modalElements.ingredients is null')

    if (modalElements.instructions) {
        if (Array.isArray(instructions)) {
            modalElements.instructions.innerHTML = instructions.map(i => escapeHTML(i)).join('<br>')
        } else {
            modalElements.instructions.textContent = instructions || ''
        }
    } else console.warn('recipes.js: modalElements.instructions is null')

    if (modalElements.image) {
        modalElements.image.src = image || ''
    } else console.warn('recipes.js: modalElements.image is null')



    modal.style.display = 'flex'
}

closeButton.onclick = () => modal.style.display = 'none'

window.onclick = event => {
    if (event.target === modal) modal.style.display = 'none'
}

    ; (async () => {
        const recipes = await getRecipeItems()
        showRecipesList(recipes)

    })()