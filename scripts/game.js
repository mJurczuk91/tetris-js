import {State, GAME_HEIGHT, GAME_WIDTH, PX_SCALE} from "./state.js";

function draw(state, cx) {
/*     cx.fillStyle = "white";
    cx.fillRect(0,0,PX_SCALE * GAME_WIDTH, PX_SCALE * GAME_HEIGHT); */

    //draw grid
    for (let y = 0; y < GAME_HEIGHT; y++) {
        for (let x = 0; x < GAME_WIDTH; x++) {
            cx.fillStyle = state.grid[y][x] ? "black" : "white";
            cx.fillRect(x * PX_SCALE, y * PX_SCALE, PX_SCALE, PX_SCALE);
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
}

function init() {
    let cv = document.getElementsByClassName("display")[0];
    cv.setAttribute("height", GAME_HEIGHT * PX_SCALE);
    cv.setAttribute("width", GAME_WIDTH * PX_SCALE);
    let p = document.getElementById("score");
    p.innerText = 0;
    let cx = document.getElementById("display").getContext("2d");
    return cx;
}

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
}

function game() {
    let cx = init();
    let state = State.start();
    draw(state, cx);
    let keys = ["ArrowLeft", "ArrowRight", "ArrowDown", "z"];

    let pressedKeys = trackKeys(keys);
    let throttledKeys = Object.create(null);
    let throttleTiming = {
        "ArrowLeft": 100,
        "ArrowRight": 100,
        "ArrowDown": 100,
        "z": 200
    }

    for(let k of keys){
        throttledKeys[k] = performance.now();
    }

    let lastStep;
    function run(time){
        if(lastStep === undefined){
            lastStep = time;
        }

        let finalKeys = Object.create(null);

        for(let key of Object.keys(pressedKeys)){
            if(pressedKeys[key] && time - throttledKeys[key] > throttleTiming[key]){
                throttledKeys[key] = time;
                finalKeys[key] = true;
            }
        }

        if(Object.keys(finalKeys).length > 0){
            if(finalKeys["ArrowDown"]) {lastStep = time};
            state = state.update(state, finalKeys);
            draw(state, cx);
        }

        if(time - lastStep > 500){
            let pressedDown = Object.create(null);
            pressedDown["ArrowDown"] = true;
            lastStep = time;
            state = state.update(state, pressedDown);
            draw(state, cx);
        }
        requestAnimationFrame(run);
    }
    requestAnimationFrame(run);
}

export {game};