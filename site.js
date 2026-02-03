const hours = new Date().getHours() // get the current hour

const isMorning = hours >= 4 && hours < 12 // is it morning?
const isAfternoon = hours >= 12 && hours < 17 // is it afternoon?
const isEvening = hours >= 17 || hours < 4 // is it evening?

const welcomeMessages=[
    'Guten Morgen! (Good Morning)',
    'Bon Après-midi! (Good Afternoon)',
    'Buenas Noches! (Good Evening)'
]
const welcome=document.querySelector('#welcome')
const marquee=document.createElement('marquee')

welcome.append(marquee)
marquee.style.fontSize="40px"
if(isMorning)
{
    marquee.innerHTML=welcomeMessages[0]
}
if(isAfternoon)
{
    marquee.innerHTML=welcomeMessages[1]
}
if(isMorning)
{
    marquee.innerHTML=welcomeMessages[2]
}
const key="It's a secret to everybody."
const secret='Poor Dadanga, 1000 brownie points for you if you can connect your secret to mine'
localStorage.setItem(key,secret)
