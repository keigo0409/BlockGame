"use strict";

export class Ball {
    context;
    // X座標
    x;
    // y座標
    y;
    // 半径
    redius;
    // x軸の移動速度
    dx;
    // y軸の移動速度
    dy;

    constructor(context, x, y, radius, dx, dy) {
        this.context = context;
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.dx = dx;
        this.dy = dy;
    }

    // 移動する
    move() {
        this.x += this.dx;
        this.y += this.dy;
    }

    // 描画する
    draw() {
        this.context.beginPath();
        this.context.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        this.context.fillStyle = "white";
        this.context.fill();
        this.context.closePath();

    }
}