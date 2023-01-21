import {State, GAME_HEIGHT, GAME_WIDTH, PX_SCALE} from "./state.js";

function draw(state, cx) {
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

/**
 * initialises canvas and other html components needed for rendering the game
 * @returns CanvasRenderingContext2D
 */

function init() {
    let cv = document.getElementsByClassName("display")[0];
    cv.setAttribute("height", GAME_HEIGHT * PX_SCALE);
    cv.setAttribute("width", GAME_WIDTH * PX_SCALE);
    let p = document.getElementById("score");
    p.innerText = 0;
    let cx = document.getElementById("display").getContext("2d");
    return cx;
}

/**
 * since the inner function track(event) thats added as event listener is able to see surrounding scope through its closure
 * its able to return the 'pressed' keys object on each button press.
 */

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

/**
 * called through resolving the game() promise
 * runs a quick animation (color changing) for the piece that lost the game
 * returns a promise that resolves to final game score after the animation finishes
 */

function runLostAnimation(state, cx){
    let start = performance.now();

    return new Promise((resolve => {
        function animate(time){
            let step = time - start;
            for (let y = 0; y < 4; y++) {
                for (let x = 0; x < 4; x++) {
                    if (state.piece.get(y, x)) {

                        cx.fillStyle = `rgb(
                            ${Math.max(
                                100, 
                                Math.floor((step + (3 * x)) % 255))},
                            0,
                            0
                        )`;
                        cx.fillRect((state.piece.px + x) * PX_SCALE, (state.piece.py + y) * PX_SCALE, PX_SCALE, PX_SCALE);
                    }
                }
            }
            if(time - start < 3000){
                requestAnimationFrame(animate);
            }
            else resolve(state.score);
        }
        requestAnimationFrame(animate);
    }))
}

function game() {
    let cx = init();
    let state = State.start();
    draw(state, cx);

    const keys = ["ArrowLeft", "ArrowRight", "ArrowDown", "z"];
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

    return new Promise((resolve) => {
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
            
            if(state.status == "playing"){
                requestAnimationFrame(run);
            }
            else {
                lastStep = performance.now();
                resolve(runLostAnimation(state, cx));
            }
        }
        requestAnimationFrame(run);
    });
    
}

export {game};