import './style.css'

const canvas = document.querySelector('canvas')
const context = canvas.getContext('2d')

var backgroundMusic = new Audio('tetrisgameboy1-gameboy.mp3');

const BLOCK_SIZE = 20
const BOARD_WIDTH = 10
const BOARD_HEIGHT = 20

const boardSolidStyle = 'gray'

canvas.width = BLOCK_SIZE * BOARD_WIDTH
canvas.height = BLOCK_SIZE * BOARD_HEIGHT

context.scale(BLOCK_SIZE, BLOCK_SIZE)

let keysPressed = {}
const DEFAULT_KEY_DELAY = 100

let board = []

const shapeStyles = ["red", "yellow", "green", "blue", "cyan", "violet"]
const shapes = [
  [[0, 0, 0, 0],
  [0, 1, 1, 0],
  [0, 1, 1, 0],
  [0, 0, 0, 0]],
  //
  [[0, 1, 0, 0],
  [0, 1, 0, 0],
  [0, 1, 0, 0],
  [0, 1, 0, 0]],
  //
  [[0, 0, 0, 0],
  [0, 1, 0, 0],
  [0, 1, 0, 0],
  [0, 1, 1, 0]],
  //
  [[0, 0, 0, 0],
  [0, 0, 1, 0],
  [0, 0, 1, 0],
  [0, 1, 1, 0]],
  //
  [[0, 0, 0, 0],
  [0, 1, 0, 0],
  [0, 1, 1, 0],
  [0, 1, 0, 0]],
  //
  [[0, 0, 0, 0],
  [0, 0, 0, 0],
  [1, 1, 0, 0],
  [0, 1, 1, 0]],
  //
  [[0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 1, 1, 0],
  [1, 1, 0, 0]],
  // //
  // [[0, 0, 0, 0],
  // [1, 1, 0, 0],
  // [0, 1, 0, 0],
  // [0, 1, 1, 0]],
]

const piece = {
  style: 'red',
  position: { x: (BOARD_WIDTH / 2 - 4 / 2), y: 0 },
  shape: shapes[0]
}


function clearBoard() {
  board = new Array(BOARD_HEIGHT)
  for (let y = 0; y < BOARD_HEIGHT; ++y)
  {
    let row = new Array(BOARD_WIDTH)
    board[y] = row
    for (let x = 0; x < BOARD_WIDTH; ++x) {
      row[x] = 0
    }
  }
}

let lastUpdateTime = 0
let dropAccumTime = 0
let paused = true

let lastKeyTime = 0
let keyDelay = 0

function update(time = 0) {
  const deltaTime = time - lastUpdateTime
  lastUpdateTime = time

  if (!paused) {
    if (time - lastKeyTime > keyDelay + 1000 / 60) {
      processKeysRepeat()
      keyDelay = 0
    }

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

    // setTimeout(function () { update() }, 1000 / 60)
    window.requestAnimationFrame(update)
  }
}

function draw() {
  context.fillStyle = '#000'
  context.fillRect(0, 0, canvas.width, canvas.height)

  let width = board[0]?.length
  let height = board.length
  for (let y = 0; y < height; ++y) {
    for (let x = 0; x < width; ++x) {
      let value = board[y][x]
      if (value === 1) {
        context.fillStyle = boardSolidStyle
        context.fillRect(x, y, 1, 1)
      }
    }
  }

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

function newShape() {
  /*
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
  */

  const shapeIndex = Math.floor(Math.random() * shapes.length)
  const newShape = shapes[shapeIndex]
  piece.shape.forEach((row, y) => {
    row.forEach((value, x) => {
      piece.shape[y][x] = newShape[y][x]
    })
  })

  const rotateCount = Math.floor(Math.random() * 4)
  for (let i = 0; i < rotateCount; ++i) {
    rotateShape()
  }

  piece.position = { x: BOARD_WIDTH / 2 - (piece.shape[0].length / 2), y: 0 }
  piece.style = shapeStyles[Math.floor(Math.random() * shapeStyles.length)]
}

function rotateShape(clockwise) {
  if (clockwise) {
    piece.shape = piece.shape[0].map((_, index) => piece.shape.map(row => row[index]).reverse());
  } else {
    piece.shape = piece.shape[0].map((_, index) => piece.shape.map(row => row[row.length - 1 - index]));
  }
}

function compact() {
  let collapse0 = -1
  let collapseF = -1
  for (let y = board.length - 1; y > 0; --y) {
    if (!board[y].includes(0)) {
      if (collapse0 != -1) {
        collapseF = y
      }
      else {
        collapse0 = y
        collapseF = y
      }
    }
  }

  let sourceY = collapseF - 1
  const remaining = collapseF - collapse0
  for (let y = collapse0; y > 0 && sourceY > 0; --y, sourceY--) {
    let row = board[y];
    const newRow = board[sourceY]
    for (let x = 0; x < row.length; x++) {
      row[x] = newRow[x]
    }
  }

  for (let y = remaining; y > 0; --y) {
    let row = board[y];
    row.forEach((value, x) => { row[x] = 0 })
  }
}

function solidify() {
  piece.shape.forEach((row, y) => {
    row.forEach((value, x) => {
      if (value !== 0 && board[y + piece.position.y]) {
        board[y + piece.position.y][x + piece.position.x] = 1
      }
    })
  })

  compact()

  if (piece.position.y == 0) {
    pauseGame(true)
    alert("You lose!")
  }

  newShape()
}

/////////////////////////////////////////

// document.addEventListener('touchstart', event => {
//   keysPressed['arrowDown'] = true
// })
// document.addEventListener('touchend', event => {
//   keysPressed['arrowDown'] = false
// })
// document.addEventListener('move', event => {
//   evt.preventDefault();
//   const touches = evt.changedTouches;

//   if (touches[0].pageX) { }
// })

document.addEventListener('keyup', event => {
  keysPressed[event.key] = false
})

document.addEventListener('keydown', event => {
  keysPressed[event.key] = true
  processKeysSingle()
  processKeysRepeat()
})

function processKeysSingle() {
  if (keysPressed['ArrowUp']) {
    rotateShape(true)
    if (checkCollision()) {
      rotateShape(false)
    }
  }
}

function processKeysRepeat() {
  const oldPosition = structuredClone(piece.position)
  let shouldCheckCollision = false
  let shouldSolidify = false

  lastKeyTime = lastUpdateTime

  if (keysPressed['ArrowLeft']) {
    piece.position.x--
    shouldCheckCollision = true
    keyDelay = DEFAULT_KEY_DELAY
  }
  else if (keysPressed['ArrowRight']) {
    piece.position.x++
    shouldCheckCollision = true
    keyDelay = DEFAULT_KEY_DELAY
  }
  else if (keysPressed['ArrowDown']) {
    piece.position.y++
    shouldCheckCollision = true
  }

  if (shouldCheckCollision && checkCollision()) {
    Object.assign(piece.position, oldPosition)

    if (shouldSolidify) {
      solidify()
    }
  }
}

function startGame() {
  clearBoard()
  newShape()
  pauseGame(false)
}

function pauseGame(doPause) {
  paused = doPause
  if (doPause)
    backgroundMusic.pause()
  else
  {
    backgroundMusic.loop = true
    backgroundMusic.play()
  }
  update()
}

var button = document.getElementById("start_button");
button.addEventListener("click", function (event) {
  startGame()
});

newShape()

draw()