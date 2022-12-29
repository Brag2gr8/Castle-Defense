import characterData from './data.js'
import Character from './Character.js'

let monstersArray = ["orc", "demon", "goblin"]
let isWaiting = false
const sound = new Audio("/dice.mp3")

function getNewMonster() {
    const nextMonsterData = characterData[monstersArray.shift()]
    return nextMonsterData ? new Character(nextMonsterData) : {}
}


function attack() {
    if(!isWaiting){
        wizard.setDiceHtml()
        monster.setDiceHtml()
        wizard.takeDamage(monster.currentDiceScore)
        monster.takeDamage(wizard.currentDiceScore)
        sound.play()
        render()
        
        if(wizard.dead){
            endGame()
        }
        else if(monster.dead){
            isWaiting = true
            if(monstersArray.length > 0){
                setTimeout(()=>{
                    monster = getNewMonster()
                    sound.play()
                    render()
                    isWaiting = false
                },1500)
            }
            else{
                endGame()
            }
        }    
    }
    
}

function endGame() {
    isWaiting = true
    const endMessage = wizard.health === 0 && monster.health === 0 ?
        "NO VICTORS - THE WIZARD AND THE MONSTERS DIED " :
        wizard.health > 0 ? "THE WIZARD WON THE CASTLE IS SAFE" :
            "THE MONSTERS DEFEATED THE WIZARD"

    const endEmoji = wizard.health > 0 ? "💚" : "☠️"
        setTimeout(()=>{
            document.body.innerHTML = `
                <div class="end-game">
                    <h2>Game Over</h2> 
                    <h3>${endMessage}</h3>
                    <p class="end-emoji">${endEmoji}</p>
                </div>
                <button id="new-game">New Game</button>
                `
        }, 1500)
}

document.getElementById("attack-button").addEventListener('click', attack)
document.body.addEventListener("click", (e) => {
    if (e.target.id === "new-game") {
        location.reload()
    }
})

function render() {
    document.getElementById('hero').innerHTML = wizard.getCharacterHtml()
    document.getElementById('monster').innerHTML = monster.getCharacterHtml()
}

document.getElementById("modal-btn").addEventListener('click',() => {
    document.getElementById("modal").classList.add("hide")
})

const wizard = new Character(characterData.hero)
let monster = getNewMonster()
render()
