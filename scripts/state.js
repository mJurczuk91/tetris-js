import {Piece} from "./piece.js";

const GAME_HEIGHT = 16;
const GAME_WIDTH = 10;
const PX_SCALE = 40;

class State{
    constructor(grid, piece, status, timer = 0, score = 0){
        this.grid = grid;
        this.piece = piece;
        this.status = status;
        this.updateTimer = timer;
        this.score = score;
    }

    static start(){
        let grid = [];
        for(let y = 0; y < GAME_HEIGHT; y++){
            let row = [];
            for(let x = 0; x < GAME_WIDTH; x++){
                row.push(false);
            }
            grid.push(row);
        }
        let piece = new Piece(Math.floor(GAME_WIDTH / 2), 0);
        let status = "playing";
        return new State(grid, piece, status);
    }

    isPointColliding(state, y, x){
        if(x < 0 || x > GAME_WIDTH - 1 || y < 0 || y > GAME_HEIGHT - 1) return true;
        else return state.grid[y][x];
    }

    isPieceColliding(state, piece){
        for(let py = 0; py < 4; py++){
            for(let px = 0; px < 4; px++){
                if(piece.get(py, px) && this.isPointColliding(state, piece.py+py, piece.px+px)){
                    return true;
                }
            }
        }
        return false;
    }

    update(state, pressedKeys){
        let timer = state.updateTimer + 10;
        console.log(pressedKeys);
        state = this._rotatePiece(state, pressedKeys);

        state = this._updateHor(state, pressedKeys);

        if(timer >= 100){
            timer = 0;
            state = this._updateVert(state);
        } else if (pressedKeys["ArrowDown"]){
            state = this._updateVert(state);
        }

        let complete = this.getCompletedRows(state);
        for(let row of complete){
            state = this.removeRow(row, state);
        }

        let scoreGained = complete.length * 100 * complete.length;
        if(complete.length > 0){
            let p = document.getElementById("score");
            p.innerText = state.score + scoreGained;
        }
        return new State(state.grid, state.piece, state.status, timer, state.score + scoreGained);
    }

    _rotatePiece(state, pressedKeys){
        let piece = state.piece;
        if(pressedKeys["z"]){
            piece = this.isPieceColliding(state, state.piece.rotate(piece)) ? piece : state.piece.rotate(piece);
        }
        return new State(state.grid, piece, state.status, state.timer, state.score);
    }

    _updateHor(state, pressedKeys){
        let piece = state.piece;
        if(pressedKeys["ArrowLeft"]){
            piece = this.isPieceColliding(state, state.piece.moveLeft(state.piece)) ? piece : state.piece.moveLeft(state.piece);
        } else
        if(pressedKeys["ArrowRight"]){
            piece = this.isPieceColliding(state, state.piece.moveRight(state.piece)) ? piece : state.piece.moveRight(state.piece);
        }
        return new State(state.grid, piece, state.status, state.timer, state.score);
    }

    _updateVert(state){
        let piece = state.piece;
        let grid = state.grid;
        if(this.isPieceColliding(state, state.piece.moveDown(state.piece))){
            for(let y = 0; y < 4; y++){
                for(let x = 0; x < 4; x++){
                    if(state.piece.get(y, x)){
                        state.grid[state.piece.py+y][state.piece.px+x] = true;
                    }
                }
            }
            piece = new Piece();
        }
        else {
            piece = state.piece.moveDown(state.piece);
        }
        return new State(grid, piece, state.status, state.timer, state.score);
    }

    getCompletedRows(state){
        let finishedRows = [];
        for(let y = 0; y< GAME_HEIGHT; y++){
            if(!state.grid[y].includes(false)){
                finishedRows.push(y);
            }
        }
        return finishedRows;
    }

    shiftGridDownAtRow(row, gr){
        let grid = gr;
        for(let y = row-1; y >= 0; y--){
            for(let x = 0; x < GAME_WIDTH; x++){
                if(grid[y][x]){
                    grid[y][x] = false;
                    grid[y+1][x] = true;
                }
            }
        }
        return grid;
    }

    removeRow(row, state){
        let grid = state.grid;
        for(let i = 0; i<GAME_WIDTH; i++){
            grid[row][i]=false;
        }
        grid = this.shiftGridDownAtRow(row, grid);
        return new State(grid, state.piece, state.status, state.timer, state.score);
    }
}


export {
    State,
    GAME_HEIGHT,
    GAME_WIDTH, 
    PX_SCALE
};