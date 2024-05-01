"use strict";

export class Block {
    context;
    //X座標
    x;
    //y座標
    y;
    // 幅
    width;
    // 高さ
    height;
    // 表示フラグ
    status = true;
    // 得点
    static POINT = 100;

    constructor(context, x, y, width, height) {
        this.context = context;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }

    getPoint() {
        return Block.POINT;
    }

    draw() {
        if (this.status === true) {
            // ブロックを描画する
            this.context.fillStyle = "#a47f61";
            this.context.fillRect(this.x, this.y, this.width, this.height);
        }
    }
}

export class HardBlock extends Block {

    static POINT = 300;
    hp = 3;

    constructor(context, x, y, width, height) {
        super(context, x, y, width, height)
    }


    getPoint() {
        return HardBlock.POINT;
    }

    draw() {
        if (this.status === true) {
            // ブロックを描画する
            this.context.fillStyle = "#D2691E";
            this.context.fillRect(this.x, this.y, this.width, this.height);
        }
    }
}
