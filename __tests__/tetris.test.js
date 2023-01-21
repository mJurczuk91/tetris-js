/**
 * @jest-environment jsdom
 */
import {State, GAME_HEIGHT, GAME_WIDTH, PX_SCALE} from "../scripts/state.js";

function getStateWithFilledLines(lines){
    let state = State.start();

    for(let line of lines){
        for(let i = 0; i < GAME_WIDTH; i++){
            state.grid[line][i] = true;
        }
    }

    return state;
}


test("isColliding method detects collision of piece with grid background", () => {
    let state = getStateWithFilledLines([4,5]);

    expect(state.isPieceColliding(state, state.piece)).toBe(false);

    state.piece.py = 4;

    expect(state.isPieceColliding(state, state.piece)).toBe(true);
});

test("state update moves the piece when arrow keys are pressed", () => {
    let state = State.start();
    let pieceStartingX = state.piece.px;
    let pieceStartingY = state.piece.py;

    expect(pieceStartingX).toBe((GAME_WIDTH/2) - 2);

    state = state.update(state, {"ArrowRight": true});
    expect(state.piece.px).toBe(pieceStartingX + 1);

    state = state.update(state, {"ArrowLeft": true});
    expect(state.piece.px).toBe(pieceStartingX);

    state = state.update(state, {"ArrowDown": true});
    expect(state.piece.py).toBe(pieceStartingY + 1);
    expect(state.piece.px).toBe(pieceStartingX);
});

test("state removeRow function removes a finished row and shifts the grid down 1 square", () => {
    let state = getStateWithFilledLines([15]);
    state.grid[14][6] = true;
    state = state.removeRow(15, state);

    expect(state.grid[15][6]).toBe(true);
    expect(state.grid[15][7]).toBe(false);
})