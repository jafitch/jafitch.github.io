(async () => {
    const hours = new Date().getHours() // get the current hour

    const isMorning = hours >= 4 && hours < 12 // is it morning?
    const isAfternoon = hours >= 12 && hours < 17 // is it afternoon?
    const isEvening = hours >= 17 || hours < 4 // is it evening?

    const welcomeMessages = [
        'Guten Morgen! (Good Morning)',
        'Bon Après-midi! (Good Afternoon)',
        'Buenas Noches! (Good Evening)'
    ]
    const welcome = document.querySelector('#welcome')
    const marquee = document.createElement('marquee')

    welcome.append(marquee)
    marquee.style.fontSize = "40px"
    if (isMorning) {
        marquee.innerHTML = welcomeMessages[0]
    }
    if (isAfternoon) {
        marquee.innerHTML = welcomeMessages[1]
    }
    if (isEvening) {
        marquee.innerHTML = welcomeMessages[2]
    }
    const key = "It's a secret to everybody."
    const secret = 'Poor Dadanga, 1000 brownie points for you if you can connect your secret to mine'
    localStorage.setItem(key, secret)
    const urls = [
        'https://images.pexels.com/photos/1454360/pexels-photo-1454360.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        'https://images.pexels.com/photos/933964/pexels-photo-933964.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        'https://images.pexels.com/photos/267885/pexels-photo-267885.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        'https://images.pexels.com/photos/1251861/pexels-photo-1251861.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        'https://images.pexels.com/photos/1370296/pexels-photo-1370296.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
    ].map(url => { (new Image()).src = url; return url })

    const images = document.querySelectorAll('#carousel img')

    let currentImage = 0
    const showImages = () => {
        const offset = currentImage % urls.length
        images.forEach((image, index) => {
            const imageIndex = (index + offset + urls.length) % urls.length
            image.src = urls[imageIndex]
        })
    }
    showImages()
    const imageChange = () => {
        currentImage++
        showImages()
    }
    setInterval(() => { imageChange() }, 5000)
    const prev = document.querySelector('#prev')
    prev.addEventListener('click', () => {
        currentImage--
        showImages()
    })
    const next = document.querySelector('#next')
    next.addEventListener('click', () => {
        currentImage++
        showImages()
    })
    try {

        const getRandomPokemon = async () => {
            const randomPokemon = Math.floor(Math.random() * 150)
            const url = 'https://pokeapi.co/api/v2/pokemon/' + randomPokemon
            const response = await fetch(url)
            const json = await response.json()
            return json
        }
        const retrievedPokemon = getRandomPokemon()
        const renderPokemon = async pokemon => {
            pokemon = await retrievedPokemon
            const pokeSprite = await pokemon.sprites.front_default
            const img = document.createElement('img')
            img.src = pokeSprite.toString()
            img.alt = 'randompokemon'
            marquee.append(img)

        }
        renderPokemon()

    } catch (error) {
        console.log(error)
    }
})()

