import { Piece } from "./piece.js";

const GAME_HEIGHT = 16;
const GAME_WIDTH = 10;
const PX_SCALE = 40;

class State {
    constructor(grid, piece, status, score = 0) {
        this.grid = grid;
        this.piece = piece;
        this.status = status;
        this.score = score;
    }

    static start() {
        let grid = [];
        for (let y = 0; y < GAME_HEIGHT; y++) {
            let row = [];
            for (let x = 0; x < GAME_WIDTH; x++) {
                row.push(false);
            }
            grid.push(row);
        }
        let piece = new Piece(0, (GAME_WIDTH / 2) - 2);
        let status = "playing";
        return new State(grid, piece, status);
    }

    isPointColliding({grid}, y, x) {
        if (x < 0 || x > GAME_WIDTH - 1 || y < 0 || y > GAME_HEIGHT - 1) return true;
        else return grid[y][x];
    }

    isPieceColliding(state, piece) {
        for (let py = 0; py < 4; py++) {
            for (let px = 0; px < 4; px++) {
                if (piece.get(py, px) && this.isPointColliding(state, piece.py + py, piece.px + px)) {
                    return true;
                }
            }
        }
        return false;
    }

    update(state, pressedKeys) {

        if (pressedKeys["z"]) {
            state = this._rotatePiece(state, pressedKeys);
        }
        if (pressedKeys["ArrowLeft"] || pressedKeys["ArrowRight"]) {
            state = this._updateHor(state, pressedKeys);
        }
        if (pressedKeys["ArrowDown"]) {
            state = this._updateVert(state);
        }

        let complete = this.getCompletedRows(state);
        for (let row of complete) {
            state = this.removeRow(row, state);
        }

        let scoreGained = complete.length * 100 * complete.length;
        return new State(state.grid, state.piece, state.status, state.score + scoreGained);
    }

    _rotatePiece(state) {
        let piece = this.isPieceColliding(state, state.piece.rotate(state.piece)) ? state.piece : state.piece.rotate(state.piece);
        return new State(state.grid, piece, state.status, state.score);
    }

    /**
     * since we dont have to add piece to background and generate a new one on horizontal movement
     * the update is broken down into separate horizontal and vertical functions
     */

    _updateHor(state, pressedKeys) {
        let piece = state.piece;
        if (pressedKeys["ArrowLeft"]) {
            piece = this.isPieceColliding(state, state.piece.moveLeft(state.piece)) ? piece : state.piece.moveLeft(state.piece);
        } else
            if (pressedKeys["ArrowRight"]) {
                piece = this.isPieceColliding(state, state.piece.moveRight(state.piece)) ? piece : state.piece.moveRight(state.piece);
            }
        return new State(state.grid, piece, state.status, state.score);
    }

    _updateVert(state) {
        let piece = state.piece;
        let grid = state.grid;
        let status = state.status;
        if (this.isPieceColliding(state, state.piece.moveDown(state.piece))) {
            for (let y = 0; y < 4; y++) {
                for (let x = 0; x < 4; x++) {
                    if (state.piece.get(y, x)) {
                        state.grid[state.piece.py + y][state.piece.px + x] = true;
                    }
                }
            }
            piece = new Piece(0, (GAME_WIDTH / 2) - 2);

            /* 
            if the new shape collides with background on creation the game is lost
             */

            if (this.isPieceColliding(state, piece.moveDown(piece)) && piece.py == 0) {
                status = "lost";
            }
        }
        else {
            piece = state.piece.moveDown(state.piece);
        }
        return new State(grid, piece, status, state.score);
    }



    getCompletedRows(state) {
        let finishedRows = [];
        for (let y = 0; y < GAME_HEIGHT; y++) {
            if (!state.grid[y].includes(false)) {
                finishedRows.push(y);
            }
        }
        return finishedRows;
    }

    shiftGridDownAtRow(row, gr) {
        let grid = gr;
        for (let y = row - 1; y >= 0; y--) {
            for (let x = 0; x < GAME_WIDTH; x++) {
                if (grid[y][x]) {
                    grid[y][x] = false;
                    grid[y + 1][x] = true;
                }
            }
        }
        return grid;
    }

    removeRow(row, state) {
        let grid = state.grid;
        for (let i = 0; i < GAME_WIDTH; i++) {
            grid[row][i] = false;
        }
        grid = this.shiftGridDownAtRow(row, grid);
        return new State(grid, state.piece, state.status, state.score);
    }
}


export {
    State,
    GAME_HEIGHT,
    GAME_WIDTH,
    PX_SCALE
};