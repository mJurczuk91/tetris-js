import { State, GAME_HEIGHT, GAME_WIDTH, PX_SCALE } from "./state.js";

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

function flushDisplayContainer() {
    let dispCont = document.getElementById("display-container");
    while (dispCont.children.length > 0) {
        dispCont.children[0].remove();
    }
    return dispCont;
}

function menu(score = null) {
    let displayContainer = flushDisplayContainer();

    let menuContainer = document.createElement("div");
    menuContainer.setAttribute("id", "menu-container");
    menuContainer.style.height = `${GAME_HEIGHT * PX_SCALE}px`;
    menuContainer.style.width = `${GAME_WIDTH * PX_SCALE}px`;

    let button = document.createElement("button");
    button.setAttribute("id", "button-start");

    if (score === null) {
        let title = document.createElement("p");
        title.setAttribute("id", "title");
        title.innerText = "TETRIS";

        button.innerText = "Start game";

        menuContainer.appendChild(title);
        menuContainer.appendChild(button);

        displayContainer.appendChild(menuContainer);
        button.addEventListener("click", game);
    }
    else {
        let title = document.createElement("p");
        title.setAttribute("id", "title");
        title.innerText = `Last Score: ${score}`;

        button.innerText = "Play again?";

        menuContainer.appendChild(title);
        menuContainer.appendChild(button);

        displayContainer.appendChild(menuContainer);
        button.addEventListener("click", game);
    }
}

/**
 * initialises canvas and other html components needed for rendering the game
 * @returns CanvasRenderingContext2D
 */

function initGameDisplay() {
    let dispCont = flushDisplayContainer();

    let gameContainer = document.createElement("div");
    let canvas = document.createElement("canvas");
    canvas.setAttribute("height", GAME_HEIGHT * PX_SCALE);
    canvas.setAttribute("width", GAME_WIDTH * PX_SCALE);

    let scoreDisp = document.createElement("div");
    scoreDisp.setAttribute("id", "score-display");

    let score = document.createElement("p");
    score.setAttribute("id", "score");
    score.innerText = 0;
    scoreDisp.appendChild(score);

    gameContainer.appendChild(scoreDisp);
    gameContainer.appendChild(canvas);

    dispCont.appendChild(gameContainer)

    return canvas.getContext("2d");
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
 * called after game is lost
 * runs a quick animation (color changing) for the piece that lost the game
 * calls the menu function after animation is finished with final score as parameter
 */

function runLostAnimation(state, cx) {
    let start = performance.now();

    function animate(time) {
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
        if (time - start < 3000) {
            requestAnimationFrame(animate);
        }
        else menu(state.score);
    }
    requestAnimationFrame(animate);
}


function game() {
    let cx = initGameDisplay();
    let score = document.getElementById("score");
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

    for (let k of keys) {
        throttledKeys[k] = performance.now();
    }

    let lastStep;
    function run(time) {
        if (lastStep === undefined) {
            lastStep = time;
        }

        score = state.score;
        let finalKeys = Object.create(null);

        for (let key of Object.keys(pressedKeys)) {
            if (pressedKeys[key] && time - throttledKeys[key] > throttleTiming[key]) {
                throttledKeys[key] = time;
                finalKeys[key] = true;
            }
        }

        if (Object.keys(finalKeys).length > 0) {
            if (finalKeys["ArrowDown"]) { lastStep = time };
            state = state.update(state, finalKeys);
            draw(state, cx);
        }

        if (time - lastStep > 500) {
            let pressedDown = Object.create(null);
            pressedDown["ArrowDown"] = true;
            lastStep = time;
            state = state.update(state, pressedDown);
            draw(state, cx);
        }

        if (state.status == "playing") {
            requestAnimationFrame(run);
        }
        else {
            runLostAnimation(state, cx);
        }
    }
    requestAnimationFrame(run);
}

export { menu };