const state = {
     numCells: (600/40) * (600/40),
     cells: [],
     shipPosition: 217,
     alienPositions: [
        3, 4, 5, 6, 7, 8, 9, 10,11,
        18,19,20,21,22,23,24,25,26,
        33,34,35,36,37,38,39,40,41,
        48,49,50,51,52,53,54,55,56,
    
     ],
     gameover: false,
     score: 0
}

const setupGame = (element) => {
    state.element = element
//draw grid
drawGrid()
//draw spaceship
//draw aliens
drawAliens()
//add the instructions and score area
drawShip()
drawScoreboard()
}

const drawGrid = () => {
    
    //create the containing element
    const grid = document.createElement("div")
    grid.classList.add("grid")
    //append cells to the containing element and containing element to the app
    state.element.append(grid)
    //store the cell in game state
    //creates a lot of cells - 15x15
    for (let i=0; i<state.numCells; i++) {
        const cell = document.createElement("div")

        grid.append(cell)
        state.cells.push(cell)

    }

}

const drawShip = () => {
    state.cells[state.shipPosition].classList.add("spaceship")
    //find bottom row, middle cell(from game state) and add a bg image
}

const controlShip = (event) => {
    if (state.gameover) {
        return
    }
    //if key pressed is left do something, right do something, space etc
if (event.code === "ArrowLeft") {
  moveShip("left")
} else if ((event.code === "ArrowRight")){
    moveShip("right")
} else if (event.code === "Space") {
  fire()
}
  
}

const moveShip = (direction) => {
    //so remove image from current position
    state.cells[state.shipPosition].classList.remove("spaceship")
    //how to move it left & right
    if (direction === "left" && state.shipPosition % 15 !== 0) {
        state.shipPosition--
    } else if (direction === "right" && state.shipPosition % 15 !== 14) {
        state.shipPosition++
    }
    
    // add image to new position
    state.cells[state.shipPosition].classList.add("spaceship")
}

const play = () => {
    //start the march of the aliens
    let interval
    let direction = "right"
    //starting direction above
    interval = setInterval(() => {
        //if right and at edge increase the position by 15, decrease by 1
        let movement
        if (direction === "right") {
            if (atEdge("right")) {
                movement = 15 - 1
                direction = "left"
            } else {
                movement = 1
                //if left, increase the position by 1
            }
        } else if (direction === "left") {
            if (atEdge("left")) {
                movement = 15 + 1
                direction = "right"
            } else {
                movement = - 1
            }  
        }
        //if going right and at edge, increase position by 15 to drop down and move left(-1)
        //if left, do inverse
        //update the alien positions
        state.alienPositions = state.alienPositions.map(position => position + movement)
        //redraw aliens on page
        drawAliens()
        checkGameState(interval)
    }, 400)
    //setup ship controls
    window.addEventListener("keydown", controlShip)
    //start the aliens moving!

}

const atEdge = (side) => {
  if (side === "left") {
    //are any aliens in left hand column
    return state.alienPositions.some(position => position % 15 === 0)
  } else if (side === "right") {
    return state.alienPositions.some(position => position % 15 === 14)
  }
}

const checkGameState = (interval) => {
    //have the aliens won?
    //have the aliens all died?
    if (state.alienPositions.length === 0) {
        //stop everything
        state.gameover = true
        //stop the interval
        clearInterval(interval)
        drawMessage("Humans Win!")
    } else if (state.alienPositions.some(position => position >= state.shipPosition)) {
        clearInterval(interval)
        state.gameover = true
        //explode the ship
        //remove the ship ig at the explosion
        state.cells[state.shipPosition].classList.remove("spaceship")
        state.cells[state.shipPosition].classList.add("hit")
        drawMessage("Aliens Win!")
    }
}

const drawMessage = (message) => {
    //create a msg
    const MessageElement = document.createElement("div")
    MessageElement.classList.add("message")
    //create a heading 
    const h1 = document.createElement("h1")
    h1.innerText = message
    MessageElement.append(h1)
    //append to the app
    state.element.append(MessageElement)
}

const drawScoreboard = () => {
    const heading = document.createElement("h1")
    heading.innerText = 'Space Invaders'
    const paragraph1 = document.createElement("p")
    paragraph1.innerText = 'Press SPACE to shoot.'
    const paragraph2 = document.createElement("p")
    paragraph2.innerText = 'Press ← and → to move'
    const scoreboard = document.createElement('div')
    scoreboard.classList.add('scoreboard')
    const scoreElement = document.createElement('span')
    scoreElement.innerText = state.score
    const heading3 = document.createElement('h3')
    heading3.innerText = 'Score: '
    heading3.append(scoreElement)
    scoreboard.append(heading, paragraph1, paragraph2, heading3)
  
    state.scoreElement = scoreElement
    state.element.append(scoreboard)
  }

const fire = () => {
    //use an interval: run some code repeatedly each time after a specific time
    let interval
    //laser starts at the ship position
    let laserPosition = state.shipPosition
    interval = setInterval(() => {
        //remove laser image
        state.cells[laserPosition].classList.remove("laser")
        //decrease (move up a row) the laser position
        laserPosition-=15
        //check were still inbound of the grid
        if (laserPosition < 0) {
            clearInterval(interval)
            return
        } 

        //if theres an alien...booom!...
        //so we clear the interval, remove the alien image, remove the alien from its position, then add the boom img, set a timeout to remove the boom image.
        if (state.alienPositions.includes(laserPosition)) {
            clearInterval(interval)
            state.alienPositions.splice(state.alienPositions.indexOf(laserPosition), 1)
            state.cells[laserPosition].classList.remove("alien", "laser")
            state.cells[laserPosition].classList.add("hit")
            state.score++
            state.scoreElement.innerText = state.score
            setTimeout(() => {
            state.cells[laserPosition].classList.remove("hit")
            }, 200)
            return
        }
        //add the laser image
        state.cells[laserPosition].classList.add("laser")
    }, 100)
}

const drawAliens = () => {
    //adding the aliens to the grid - means we need to store their positions in our game state
    state.cells.forEach((cell, index) => {
    //remove any alien imgs
    if (cell.classList.contains("alien")) {
        cell.classList.remove("alien")
    }
    // add the img to the cell if the index is in the set of alien positions
    if (state.alienPositions.includes(index)) {
        cell.classList.add("alien")
    }
    })
}
const appElement = document.querySelector(".app")
//do all things needed to draw game
setupGame(appElement)
//then play the fame - start being able to move the ship & aliens
play()