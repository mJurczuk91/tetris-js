import {State, GAME_HEIGHT, GAME_WIDTH, PX_SCALE} from "./state.js";

function draw(state) {
    let cx = document.getElementById("display").getContext("2d");
    cx.fillStyle = "white";
    cx.fillRect(0,0,PX_SCALE * GAME_WIDTH, PX_SCALE * GAME_HEIGHT);

    cx.fillStyle = "black";
    //draw grid
    for (let y = 0; y < GAME_HEIGHT; y++) {
        for (let x = 0; x < GAME_WIDTH; x++) {
            if(state.grid[y][x]){
                cx.fillRect(x * PX_SCALE, y * PX_SCALE, PX_SCALE, PX_SCALE);
            }
        }
    }

    //draw piece
    cx.fillStyle = "gray";
    for (let y = 0; y < 4; y++) {
        for (let x = 0; x < 4; x++) {
            if (state.piece.get(y, x)) {
                cx.fillRect((state.piece.px + x) * PX_SCALE, (state.piece.py + y) * PX_SCALE, PX_SCALE, PX_SCALE);
            }
        }
    }
};

function init() {
    let cv = document.getElementsByClassName("display")[0];
    cv.setAttribute("height", GAME_HEIGHT * PX_SCALE);
    cv.setAttribute("width", GAME_WIDTH * PX_SCALE);
    let p = document.getElementById("score");
    p.innerText = 0;
};

function trackKeys(keys) {
    let pressed = Object.create(null);
    function track(event) {
        if (keys.includes(event.key)) {
            pressed[event.key] = event.type == "keydown";
            event.preventDefault();
        }
    }

    window.addEventListener("keydown", track);
    window.addEventListener("keyup", track);

    return pressed;
};

let pressedKeys = trackKeys(["ArrowLeft", "ArrowRight", "ArrowDown", "z"]);

function game() {
    init();
    let state = State.start();
    draw(state);
    setInterval(() => {
        state = state.update(state, pressedKeys);
        draw(state);
    }, 50);
};

export {game};