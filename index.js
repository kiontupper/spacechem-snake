/** @type {HTMLAudioElement} */
var audio
/** @type {HTMLImageElement} */
var tex
var rtex

var canvas = document.getElementById("game")

/** @type {CanvasRenderingContext2D} */
var context = canvas.getContext("2d")

const SPRITE_SIZE = 28

document.getElementById("upload-button").addEventListener("click", () => {
	/** @type {HTMLInputElement} */
	let texel = document.getElementById("texupload")
	tex = new Image(1024, 1024)
	tex.onload = init
	tex.src = URL.createObjectURL(texel.files[0])
	window.tex = tex

	let audioel = document.getElementById("audioupload")
	audio = new Audio(URL.createObjectURL(audioel.files[0]))
	window.audio = audio
})

// let pipes = {
// 	bend_bottom_left: [830, 486, 32, 41],
// 	bend_bottom_right: [830, 486, -32, 41],
// 	bend_top_left: [904, 486, 32, 36],
// 	bend_top_right: [904, 486, -32, 36],
// 	middle_h: [842, 453, 33, 28],
// 	middle_v: [793, 486, 32, 50],
// 	end_right: [681, 486, 33, 28],
// 	end_left: [681, 486, -33, 28],
// 	end_up: [756, 486, 32, 50],
// 	end_down: [719, 486, 32, 50],
// 	null: [0, 0, 0, 0],
// 	fruit: [742, 568, 31, 31]
// }

let pipes = {
	bend_bottom_left: [false, 830, 486, 32, 41, 0],
	bend_bottom_right: [true, 162, 486, 32, 41, 0],
	bend_top_left: [false, 904, 486, 32, 36, 8],
	bend_top_right: [true, 88, 486, 32, 36, 8],
	middle_h: [false, 842, 453, 33, 28, 0],
	middle_v: [false, 793, 486, 32, 50, 8],
	end_right: [false, 681, 486, 33, 28, 0],
	end_left: [true, 310, 486, 33, 28, 0],
	end_up: [false, 756, 486, 32, 50, 8],
	end_down: [false, 719, 486, 32, 50, 8],
	null: [false, 0, 0, 0, 0, 0],
	fruit: [false, 742, 568, 31, 31, 0]
}

let pipeIDs = [
	[
		"null",
		"end_down",
		"end_left",
		"end_up",
		"end_right"
	],
	[
		"end_down",
		"end_down",
		"bend_top_right",
		"middle_v",
		"bend_top_left"
	],
	[
		"end_left",
		"bend_top_right",
		"end_left",
		"bend_bottom_right",
		"middle_h"
	],
	[
		"end_up",
		"middle_v",
		"bend_bottom_right",
		"end_up",
		"bend_bottom_left"
	],
	[
		"end_right",
		"bend_top_left",
		"middle_h",
		"bend_bottom_left",
		"end_right"
	]
]

/**
 *
 * @param {CanvasRenderingContext2D} context
 * @param {Number} x
 * @param {Number} y
 * @param {Number[]} pipe
 */
function draw(context, x, y, pipe) {
	context.drawImage(pipe[0] ? rtex : tex, pipe[1], pipe[2], pipe[3], pipe[4], x * SPRITE_SIZE, canvas.height - y * SPRITE_SIZE - pipe[5], pipe[3], pipe[4])
}

/** board[x][y] = [sourceDir, nextDir] || []
 * direction: 0 = none (head or tail), 1 = up, 2 = right, 3 = down, 4 = left
 * @type {[Number, Number][][]} */
let board = []
let headX = 0
let headY = 0
let tailX = 0
let tailY = 0
let length = 2
let nextDir = 2
let facing = 2
let opposites = [0, 3, 4, 1, 2]
let dx = [0, 0, 1, 0, -1]
let dy = [0, 1, 0, -1, 0]
let maxX = 0
let maxY = 0

function init() {

	/** @type {HTMLCanvasElement} */
	let rcanvas = document.getElementById("hidden-canvas")
	let rcontext = rcanvas.getContext("2d")
	rcontext.save()
	rcontext.scale(-1, 1)
	rcontext.drawImage(tex, -1024, 0)
	rcontext.restore()
	rtex = rcanvas

	let width = Math.floor(canvas.width / SPRITE_SIZE)
	let height = Math.floor(canvas.height / SPRITE_SIZE)
	for (let i = 0; i < width; i++) {
		board[i] = []
		for (let j = 0; j < height; j++) {
			board[i][j] = []
		}
	}
	headX = Math.ceil(width / 2)
	headY = Math.ceil(height / 2)
	tailX = headX - 1
	tailY = headY
	board[headX][headY] = [4, 0]
	board[tailX][tailY] = [0, 2]
	maxX = width - 1
	maxY = height - 1
	setFruit()
	redraw()
	document.getElementsByTagName("body")[0].classList.add("ready")
	setTimeout(tick, 1000)
}

function redraw() {
	context.clearRect(0, 0, canvas.width, canvas.height)
	for (let y = maxY; y >= 0; y--) {
		for (let x = 0; x <= maxX; x++) {
			if (board[x][y] == "f") {
				draw(context, x, y, pipes.fruit)
			} else if (board[x][y].length > 0) {
				draw(context, x, y, pipes[pipeIDs[board[x][y][0]][board[x][y][1]]])
			}
		}
	}
}

function tick() {
	if (nextDir != facing && nextDir != opposites[facing]) {
		facing = nextDir
	}
	let nextX = headX + dx[facing]
	let nextY = headY + dy[facing]
	if (nextX < 0 || nextY < 0 || nextX > maxX || nextY > maxY || (board[nextX][nextY] !== "f" && board[nextX][nextY].length > 0)) {
		alert("Game over!")
		return
	}
	if (board[nextX][nextY] === "f") {
		length++
		setFruit()
		audio.play()
	} else {
		let taildir = board[tailX][tailY][1]
		board[tailX][tailY] = []
		tailX += dx[taildir]
		tailY += dy[taildir]
		board[tailX][tailY][0] = 0
	}
	board[headX][headY][1] = facing
	headX = nextX
	headY = nextY
	board[headX][headY] = [opposites[facing], 0]
	redraw()
	setTimeout(tick, Math.max(Math.min(500, 5000 / length), 100))
}

function randomRange(min, max) {
	return Math.floor(Math.random() * (max + 1 - min)) + min;
}

function setFruit() {
	let x = randomRange(0, maxX)
	let y = randomRange(0, maxY)
	if (board[x][y].length !== 0) setFruit()
	else board[x][y] = "f"
}


onkeyup = event => {
	switch (event.key) {
		case "ArrowUp":
		case "W":
			nextDir = 1
			break
		case "ArrowRight":
		case "D":
			nextDir = 2
			break
		case "ArrowDown":
		case "S":
			nextDir = 3
			break
		case "ArrowLeft":
		case "A":
			nextDir = 4
			break
	}
}
