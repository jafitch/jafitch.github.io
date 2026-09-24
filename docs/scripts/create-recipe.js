const form = document.getElementById('recipeForm')
const status = document.getElementById('recipeStatus')

const setStatus = (message, isError = false) => {
    if (!status) return
    status.textContent = message
    status.style.color = isError ? '#ffb4b4' : '#d8f5d7'
}

form?.addEventListener('submit', async event => {
    event.preventDefault()

    const formData = new FormData(form)
    const payload = {
        name: (formData.get('name') || '').trim(),
        category: (formData.get('category') || '').trim(),
        description: (formData.get('description') || '').trim(),
        image: (formData.get('image') || '').trim(),
        ingredients: (formData.get('ingredients') || '').trim(),
        instructions: (formData.get('instructions') || '').trim()
    }

    if (!payload.name || !payload.ingredients || !payload.instructions) {
        setStatus('Please complete the name, ingredients, and instructions fields.', true)
        return
    }

    try {
        setStatus('Saving recipe...')
        const response = await fetch('/api/v1/recipes', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        })

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}))
            throw new Error(errorData.error || 'Unable to save recipe.')
        }

        form.reset()
        setStatus('Recipe saved successfully!')
        window.location.href = './recipes.htm'
    } catch (error) {
        setStatus(error.message || 'Something went wrong while saving the recipe.', true)
    }
})
