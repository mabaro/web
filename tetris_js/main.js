import './style.css'

const canvas = document.querySelector('canvas')
const context = canvas.getContext('2d')

const BLOCK_SIZE = 20
const BOARD_WIDTH = 14
const BOARD_HEIGHT = 30

canvas.width = BLOCK_SIZE * BOARD_WIDTH
canvas.height = BLOCK_SIZE * BOARD_HEIGHT

const solidStyle = 'yellow'

context.scale(BLOCK_SIZE, BLOCK_SIZE)

const board = [
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0]
]

const piece = {
  style: 'red',
  position: { x: 5, y: 5 },
  shape: [
    [1, 1],
    [1, 1]
  ]
}


function clearBoard() {
  board.forEach((row, y) => {
    row.forEach((value, x) => {
      board[y][x] = 0
    })
  })
}

let lastTime = 0
let dropAccumTime = 0
let paused = false

function update(time = 0) {
  const deltaTime = time - lastTime
  lastTime = time

  if (!paused)
  {
    draw()

    dropAccumTime += deltaTime
    if (dropAccumTime > 1000) {
      piece.position.y++
      if (checkCollision()) {
        piece.position--
      }
      dropAccumTime = 0
    }

    window.requestAnimationFrame(update)
  }
}

function draw() {
  context.fillStyle = '#000'
  context.fillRect(0, 0, canvas.width, canvas.height)

  board.forEach((row, y) => {
    row.forEach((value, x) => {
      if (value === 1) {
        context.fillStyle = 'yellow'
        context.fillRect(x, y, 1, 1)
      }
    })
  })

  piece.shape.forEach((row, y) => {
    row.forEach((value, x) => {
      if (value === 1) {
        context.fillStyle = piece.style
        context.fillRect(x + piece.position.x, y + piece.position.y, 1, 1)
      }
    })
  })
}

function checkCollision() {
  return piece.shape.find((row, y) => {
    return row.find((value, x) => {
      return (value !== 0
        && board[y + piece.position.y]?.[x + piece.position.x] !== 0)
    })
  })
}

function solidify() {
  piece.shape.forEach((row, y) => {
    row.forEach((value, x) => {
      if (value !== 0 && board[y + piece.position.y]) {
        board[y + piece.position.y][x + piece.position.x] = 1
      }
    })
  })

  if (piece.position.y == 0) {
    paused = true
    alert("You lose!")
    clearBoard();
  }

  piece.position = { x: 0, y: 0 }
}

document.addEventListener('keydown', event => {
  if (paused)
  {
    return;
  }

  const oldPosition = structuredClone(piece.position)
  let modified = false;

  if (event.key == 'ArrowLeft') {
    piece.position.x--
    modified = true
  }
  if (event.key == 'ArrowRight') {
    piece.position.x++
    modified = true
  }
  if (event.key == 'ArrowDown') {
    piece.position.y++
    modified = true
  }

  if (modified && checkCollision()) {
    piece.position = structuredClone(oldPosition)
    solidify()
  }
})

function startGame() {
  clearBoard()
  piece.position = { x: BOARD_WIDTH / 2 - (piece.shape[0].length / 2), y: 0 }
  paused = false
  update()
}

var button = document.getElementById("start_button");
button.addEventListener("click", function (event) {
  startGame()
});


startGame()