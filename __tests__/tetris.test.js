/**
 * @jest-environment jsdom
 */
const State = require("../scripts/game.js");


test("isColliding method detects collision of piece with grid background", () => {
    let state = State.start();
    for(let i = 0; i < 12; i++){
        state.grid[15][i] = true;
    }

    expect(state.isColliding(state, state.piece.x, state.piece.y)).toBe(false);

    state.piece.y = 15;

    expect(state.isColliding(state, state.piece.x, state.piece.y)).toBe(true);
});