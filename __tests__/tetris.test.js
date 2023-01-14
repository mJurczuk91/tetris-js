/**
 * @jest-environment jsdom
 */
const State = require("../scripts/game.js");

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
    expect(state.piece.x).toBe(6);

    state = state.update(state, {"ArrowRight": true});
    expect(state.piece.x).toBe(7);

    state = state.update(state, {"ArrowLeft": true});
    expect(state.piece.x).toBe(6);

    state = state.update(state, {"ArrowDown": true});
    expect(state.piece.y).toBe(1);
    expect(state.piece.x).toBe(6);
});

test("state removeRow function removes a finished row and shifts the grid down 1 square", () => {
    let state = getStateWithOneLineFilled();
    state.grid[14][6] = true;
    state = state.removeRow(15, state);

    expect(state.grid[15][6]).toBe(true);
    expect(state.grid[15][7]).toBe(false);
})