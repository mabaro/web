import './style.css'

const canvas = document.querySelector('canvas')
const context = canvas.getContext('2d')

var backgroundMusic = new Audio('tetrisgameboy1-gameboy.mp3');

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
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
]

const piece = {
  style: 'red',
  position: { x: (BOARD_WIDTH / 2 - 4 / 2), y: 0 },
  shape: [
    [0, 0, 0, 0],
    [0, 1, 1, 0],
    [0, 1, 1, 0],
    [0, 0, 0, 0]
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
let paused = true

function update(time = 0) {
  const deltaTime = time - lastTime
  lastTime = time

  if (!paused) {
    draw()

    dropAccumTime += deltaTime
    if (dropAccumTime > 1000) {
      piece.position.y++
      if (checkCollision()) {
        piece.position.y--
        solidify()
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
      if (value != 0) {
        const row = board[y + piece.position.y]
        if (row == undefined) {
          return true;
        }
        let rowValue = row[x + piece.position.x]
        if (rowValue == undefined) {
          return true;
        }
        return rowValue != 0
      }
      return false;
      // return (value !== 0
      //   && board[y + piece.position.y]?.[x + piece.position.x] !== 0)
    })
  })
}

function piece_isHorizontal(x, y) {
  let value = 0
  if (x > 0) value += piece.shape[y][x - 1]
  if (x < piece.shape[0][0].length - 1) value += piece.shape[y][x + 1]
  return value;
}
function piece_isVertical(x, y) {
  let value = 0
  if (y > 0) value += piece.shape[y - 1][x]
  if (y < piece.shape[0].length - 1) value += piece.shape[y + 1][x]

  return value;
}

function generateShape() {
  let maxx = piece.shape[0].length;
  let maxy = piece.shape.length;
  let minx = Math.random() * maxx / 2;
  let miny = Math.random() * maxy / 2;

  piece.shape.forEach((row, y) => {
    if (y > miny && y < maxy) {
      row.forEach((value, x) => {
        if (x > minx && x < maxx) {
          piece.shape[y][x] = Math.random() > 0.5 ? 1 : 0
        }
      })
    }
  })
  piece.shape.forEach((row, y) => {
    row.forEach((value, x) => {
      if (piece_isHorizontal(x, y) && piece_isVertical(x, y)) {
        piece.shape[y][x] = 1
      }
    })
  })

  piece.position = { x: BOARD_WIDTH / 2 - (piece.shape[0].length / 2), y: 0 }
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
    pauseGame(true)
    alert("You lose!")
  }

  generateShape()
}

document.addEventListener('keydown', event => {
  if (paused) {
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

  if (modified) {
    let collisionRes = checkCollision();
    if (collisionRes) {
      // piece.position = structuredClone(oldPosition)
      piece.position = Object.assign(piece.position, oldPosition)

      if (event.key == 'ArrowDown') {
        solidify()
      }
    }
  }
})

function startGame() {
  clearBoard()
  piece.position = { x: BOARD_WIDTH / 2 - (piece.shape[0].length / 2), y: 0 }
  pauseGame(false)
}

function pauseGame(doPause) {
  paused = doPause
  if (doPause)
    backgroundMusic.pause()
  else
    backgroundMusic.play()
  update()
}

var button = document.getElementById("start_button");
button.addEventListener("click", function (event) {
  startGame()
});

generateShape()

draw()