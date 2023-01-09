const GAME_HEIGHT = 16;
const GAME_WIDTH = 12;
const PX_SCALE = 40;

class Piece{
    constructor(){
        this.x = GAME_WIDTH / 2;
        this.y = 0;
    }
}

class State{
    constructor(){
        let grid = new Array(16).fill(new Array(12).fill(false));
        this.grid = grid;
        this.currentPiece = new Piece();
    }
}

function draw(state){
    let cx = document.getElementById("display").getContext("2d");
    for(let y = 0; y < GAME_HEIGHT; y++){
        for(let x = 0; x < GAME_WIDTH; x++){
            state.grid[y][x] || (state.currentPiece.x == x && state.currentPiece.y == y) ? cx.fillStyle = "gray" : cx.fillStyle = "white";
            cx.fillRect(x * PX_SCALE, y * PX_SCALE, PX_SCALE, PX_SCALE); 
        }
    }
}

function init(){
    let cv = document.getElementsByClassName("display")[0];
    cv.setAttribute("height", GAME_HEIGHT * PX_SCALE);
    cv.setAttribute("width", GAME_WIDTH * PX_SCALE);
}

function game(){
    init();
    let state = new State();
    draw(state);
}