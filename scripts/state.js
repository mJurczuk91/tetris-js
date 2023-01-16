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

    isColliding(state, x, y){
        if(x < 0 || x > GAME_WIDTH - 1 || y < 0 || y > GAME_HEIGHT - 1) return true;
        else return state.grid[y][x];
    }

    update(state, pressedKeys){
        let timer = state.updateTimer + 10;
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

    _updateHor(state, pressedKeys){
        let piece = state.piece;
        if(pressedKeys["ArrowLeft"]){
            piece = this.isColliding(state, piece.x - 1, piece.y) ? piece : new Piece(piece.x - 1, piece.y);
        } else
        if(pressedKeys["ArrowRight"]){
            piece = this.isColliding(state, piece.x + 1, piece.y) ? piece : new Piece(piece.x + 1, piece.y);
        }
        return new State(state.grid, piece, state.status, state.timer, state.score);
    }

    _updateVert(state){
        let piece = state.piece;
        let grid = state.grid;
        if(this.isColliding(state, piece.x, piece.y + 1)){
            grid[piece.y][piece.x] = true;
            piece = new Piece();
        }
        else {
            piece = new Piece(piece.x, piece.y + 1);
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