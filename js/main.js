"use strict";

import { BlockGame } from "./blocks.js";

const game = new BlockGame("canvas");

document.addEventListener("keydown", (event) => {
    game.setKeydownKey(event.key);
});

document.addEventListener("keyup", (event => {
    game.setKeyupKey(event.key);
}));