/**
 * @jest-environment jsdom
 */
const GAME_STATE_CLASS = require("../scripts/game.js");
const State = GAME_STATE_CLASS.State;
const GAME_HEIGHT = GAME_STATE_CLASS.GAME_HEIGHT;
const GAME_WIDTH = GAME_STATE_CLASS.GAME_WIDTH;

function getStateWithOneLineFilled(line = 15){
    let state = State.start();

    for(let i = 0; i < 12; i++){
        state.grid[line][i] = true;
    }

    return state;
}


test("isColliding method detects collision of piece with grid background", () => {
    let state = getStateWithOneLineFilled();

    expect(state.isColliding(state, state.piece.x, state.piece.y)).toBe(false);

    state.piece.y = 15;

    expect(state.isColliding(state, state.piece.x, state.piece.y)).toBe(true);
});

test("state update moves the piece when arrow keys are pressed", () => {
    let state = State.start();
    expect(state.piece.x).toBe(GAME_WIDTH/2);

    state = state.update(state, {"ArrowRight": true});
    expect(state.piece.x).toBe(GAME_WIDTH / 2 + 1);

    state = state.update(state, {"ArrowLeft": true});
    expect(state.piece.x).toBe(GAME_WIDTH / 2);

    state = state.update(state, {"ArrowDown": true});
    expect(state.piece.y).toBe(1);
    expect(state.piece.x).toBe(GAME_WIDTH / 2);
});

test("state removeRow function removes a finished row and shifts the grid down 1 square", () => {
    let state = getStateWithOneLineFilled();
    state.grid[14][6] = true;
    state = state.removeRow(15, state);

    expect(state.grid[15][6]).toBe(true);
    expect(state.grid[15][7]).toBe(false);
})