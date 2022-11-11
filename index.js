

const generateModel = ({ dimension, clear }) => {
    model = []
    for (let i = 0; i < dimension.h; i++) {
        const row = []
        for (let j = 0; j < dimension.w; j++) {
            if (clear) {
                row.push({ id: `${i}-${j}`, value: 0 })
            } else {
                row.push({ id: `${i}-${j}`, value: Math.random() > 0.95 ? 1 : 0 })
            }
        }
        model.push(row)
    }
    initialModel = model
    return model
}

const getScreenDimensions = () => {
    return { w: window.innerWidth, h: window.innerHeight }
}

const render = ({ model, gameBoard, boardDimension }) => {
    const cellDimension = { w: boardDimension / model[0].length, h: boardDimension / model.length }
    gameBoard.innerHTML = ''
    for (let row of model) {
        for (let cell of row) {
            const cellElement = document.createElement('div')
            cellElement.style.width = `${cellDimension.w}px`
            cellElement.style.height = `${cellDimension.h}px`
            cellElement.classList.add("cell");
            cellElement.addEventListener("click", () => mark(cell))
            //cell.print = cell.print ? cell.print : '-'
            //cellElement.innerHTML = cell.print
            if (cell.value === 1) {
                cellElement.style.backgroundColor = '#fff'
            }
            gameBoard.append(cellElement)
        }
    }

    document.getElementById("generation").innerHTML = generation
}

const getNeighbors = ({ i, j, model }) => {
    let count = 0

    // i+1
    if (model[i + 1] && model[i + 1][j]?.value) {
        count++
    }
    if (model[i + 1] && model[i + 1][j + 1]?.value) {
        count++
    }
    if (model[i + 1] && model[i + 1][j - 1]?.value) {
        count++
    }

    // i-1
    if (model[i - 1] && model[i - 1][j]?.value) {
        count++
    }
    if (model[i - 1] && model[i - 1][j + 1]?.value) {
        count++
    }
    if (model[i - 1] && model[i - 1][j - 1]?.value) {
        count++
    }

    // j-1
    if (model[i][j + 1]?.value) {
        count++
    }
    if (model[i][j - 1]?.value) {
        count++
    }

    return count

}

const evolve = ({ model }) => {
    const newModel = JSON.parse(JSON.stringify(model))
    for (let i = 0; i < model.length; i++) {
        for (let j = 0; j < model.length; j++) {
            const n = getNeighbors({ i, j, model })
            const cell = newModel[i][j]
            cell.print = n
            if (n === 3) {
                cell.value = 1
            }
            if (n < 2 || n > 3) {
                cell.value = 0
            }
        }
    }
    generation++
    return newModel
}

const animate = ({ model, gameBoard, boardDimension }) => {
    model = evolve({ model })
    render({ model, gameBoard, boardDimension })
    window.requestAnimationFrame(animate)
}



let model = undefined
let initialModel = undefined
const gameBoard = document.getElementById("game-board")
const controlContainer = document.getElementById("control-container")
const screenDimensions = getScreenDimensions()
const boardDimension = Math.min(screenDimensions.w, screenDimensions.h)
let intervalHandle = undefined
let boardCells = { w: 50, h: 50 }
let generation = 0

const populateMenu = () => {
    for (let savedModel of savedInitialConfigurations) {
        const button = document.createElement('div')
        button.classList.add('button')
        button.innerHTML = savedModel.name
        button.addEventListener('click', () => setModel(savedModel))
        controlContainer.append(button)
    }
}

const main = () => {
    populateMenu()
    gameBoard.style.height = `${boardDimension}px`
    gameBoard.style.width = `${boardDimension}px`

    model = generateModel({ dimension: boardCells })

    render({ model, gameBoard, boardDimension })

}

const start = () => {
    if (intervalHandle) { return }

    intervalHandle = setInterval(() => {
        model = evolve({ model })
        render({ model, gameBoard, boardDimension })
    }, 100)
}

const stop = () => {
    clearInterval(intervalHandle)
    intervalHandle = undefined
    generation = 0
}

const restart = () => {
    stop()
    model = generateModel({ dimension: boardCells })

    render({ model, gameBoard, boardDimension })
}

const clearBoard = () => {
    stop()
    model = generateModel({ dimension: boardCells, clear: true })
    render({ model, gameBoard, boardDimension })
}

const mark = (cell) => {
    stop()
    cell.value = cell.value ? 0 : 1
    render({ model, gameBoard, boardDimension })
    initialModel = model
}

const save = () => {
    console.log(JSON.stringify({name: '', initialModel, boardCells}));
}

const setModel = (savedModel) => {
    stop()
    model = savedModel.initialModel
    boardCells = savedModel.boardCells
    render({ model, gameBoard, boardDimension })
}

main()