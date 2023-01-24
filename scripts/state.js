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

    isPointColliding(grid, y, x) {
        if (x < 0 || x > GAME_WIDTH - 1 || y < 0 || y > GAME_HEIGHT - 1) return true;
        else return grid[y][x];
    }

    isPieceColliding(grid, piece) {
        for (let py = 0; py < 4; py++) {
            for (let px = 0; px < 4; px++) {
                if (piece.get(py, px) && this.isPointColliding(grid, piece.py + py, piece.px + px)) {
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

    _rotatePiece({grid, piece, status, score}) {
        piece = this.isPieceColliding(grid, piece.rotate(piece)) ? piece : piece.rotate(piece);
        return new State(grid, piece, status, score);
    }

    /**
     * since we dont have to add piece to background and generate a new one on horizontal movement
     * the update is broken down into separate horizontal and vertical functions
     */

    _updateHor({grid, piece, status, score}, pressedKeys) {
        if (pressedKeys["ArrowLeft"]) {
            piece = this.isPieceColliding(grid, piece.moveLeft(piece)) ? piece : piece.moveLeft(piece);
        } else
            if (pressedKeys["ArrowRight"]) {
                piece = this.isPieceColliding(grid, piece.moveRight(piece)) ? piece : piece.moveRight(piece);
            }
        return new State(grid, piece, status, score);
    }

    _updateVert({piece, grid, status, score}) {
        if (this.isPieceColliding(grid, piece.moveDown(piece))) {
            for (let y = 0; y < 4; y++) {
                for (let x = 0; x < 4; x++) {
                    if (piece.get(y, x)) {
                        grid[piece.py + y][piece.px + x] = true;
                    }
                }
            }
            piece = new Piece(0, (GAME_WIDTH / 2) - 2);

            /** 
             * if the new shape collides with background on creation the game is lost
             */

            if (this.isPieceColliding(grid, piece.moveDown(piece)) && piece.py == 0) {
                status = "lost";
            }
        }
        else {
            piece = piece.moveDown(piece);
        }
        return new State(grid, piece, status, score);
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

    shiftGridDownAtRow(row, grid) {
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