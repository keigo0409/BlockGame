"use strict";
import { View } from "./view.js";
import { Ball } from "./ball.js";
import { Paddle } from "./paddle.js";
import { Block, HardBlock } from "./block.js";
import { Bar } from "./bar.js";
import { Sound } from "./sound.js";

export class GameView extends View {
    #ball = null;
    #paddle = null;
    #blocks = [];
    #bar = null;
    // パドルとボールが衝突した時の効果音
    #paddleBallSound;
    // ブロックとボールが衝突した時の効果音
    #blockBallSound;
    // ゲーム結果
    resultMessage = "";

    constructor(context) {
        super(context);

        this.#ball = new Ball(context, 20, 440, 5, 2, 2);
        this.#paddle = new Paddle(context, 30, 460, 40, 4, 5);
        this.#blocks = [
            new Block(context, 72, 40, 52, 20),
            new Block(context, 10, 40, 52, 20),
            new Block(context, 135, 40, 52, 20),
            new HardBlock(context, 198, 40, 52, 20)
        ];
        this.#bar = new Bar(context);
        this.#paddleBallSound = new Sound("./sound/水滴2.mp3")
        this.#blockBallSound = new Sound("./sound/崖から石がパラパラ落ちる.mp3")
    }

    executePlayerAction(key) {
        if (key["ArrowLeft"] || key["Left"]) {
            this.#paddle.dx = -this.#paddle.speed;
        } else if (key["ArrowRight"] || key["Right"]) {
            this.#paddle.dx = this.#paddle.speed;
        } else {
            this.#paddle.dx = 0;
        }
    }

    #isGameClear() {
        const _isGameClear = this.#blocks.every((block) => block.status === false);
        if (_isGameClear) {
            this.resultMessage = "GAMECLEAR";
        }
        return _isGameClear;
    }

    // ゲームオーバーかどうか検証する
    #isGameOver() {
        const ballY = this.#ball.y;
        const ballRadius = this.#ball.radius;
        const ballDy = this.#ball.dy;
        // ボールが下の壁に衝突したか検証する
        const _isGameOver =
            this.context.canvas.height - ballRadius < ballY + ballDy;
        // ゲーム結果を設定する
        if (_isGameOver) {
            this.resultMessage = "GAMEOVER";
        }
        return _isGameOver;
    }
    // ボールと壁の衝突を確認する
    #checkCollisionBallAndWall() {
        const canvasWidth = this.context.canvas.width;
        const canvasHeight = this.context.canvas.height;
        const ballX = this.#ball.x;
        const ballY = this.#ball.y;
        const ballRadius = this.#ball.radius;
        const ballDx = this.#ball.dx;
        const ballDy = this.#ball.dy;

        if (
            ballX + ballDx < ballRadius ||
            canvasWidth - ballRadius < ballX + ballDx
        ) {
            this.#ball.dx *= -1;
            return;
        }

        if (ballY + ballDy < ballRadius + 20) {
            this.#ball.dy *= -1;
            return;
        }

        // ボールが下の壁と衝突したら
        // if (canvasHeight - ballRadius < ballY + ballDy) {
        //     this.#ball.dy *= -1;
        //     return;
        // }
    }


    #checkCollisionBallPaddle() {
        const ballX = this.#ball.x;
        const ballY = this.#ball.y;
        const ballRadius = this.#ball.radius;
        const ballDx = this.#ball.dx;
        const ballDy = this.#ball.dy;
        const paddleX = this.#paddle.x;
        const paddleY = this.#paddle.y;
        const paddleWidth = this.#paddle.width;
        const paddleHeight = this.#paddle.height;

        if (paddleX - ballRadius < ballX + ballDx &&
            ballX + ballDx < paddleX + paddleWidth + ballRadius &&
            paddleY - ballRadius < ballY + ballDy &&
            ballY + ballDy < paddleY + paddleHeight + ballRadius) {
            this.#ball.dy *= -1;
            this.#paddleBallSound.play();
        }
    }

    #checkCollisionPaddleAndWall() {
        const canvasWidth = this.context.canvas.width;
        const paddleX = this.#paddle.x;
        const paddleWidth = this.#paddle.width;
        const paddleDx = this.#paddle.dx;

        if (paddleX + paddleDx < 0) {
            this.#paddle.dx = 0;
            this.#paddle.x = 0;
            return;
        }

        if (canvasWidth - paddleWidth < paddleX + paddleDx) {
            this.#paddle.dx = 0;
            this.#paddle.x = canvasWidth - paddleWidth;
        }
    }

    // ボールとブロックの衝突を確認する
    #checkCollisionBallAndblock() {
        const ballX = this.#ball.x;
        const ballY = this.#ball.y;
        const ballRadius = this.#ball.radius;
        const ballDx = this.#ball.dx;
        const ballDy = this.#ball.dy;

        this.#blocks.forEach((block) => {
            const blockHeight = block.height;
            if (block.status === true) {
                const blockX = block.x;
                const blockY = block.y;
                const blockWidth = block.width;
                const blockHeight = block.height;

                if (blockX - ballRadius < ballX + ballDx &&
                    ballX + ballDx < blockX + blockWidth + ballRadius &&
                    blockY - ballRadius < ballY + ballDy &&
                    ballY + ballDy < blockY + blockHeight + ballRadius) {
                    this.#ball.dy *= -1;
                    if (block instanceof HardBlock) {
                        block.hp--;
                        if (block.hp === 0) {
                            block.status = false;
                            this.#bar.addScore(block.getPoint());
                        }
                    } else {
                        block.status = false;
                        this.#bar.addScore(block.getPoint());
                    }
                    // スコアを加算する
                    this.#blockBallSound.play();
                }
            }
        })
    }


    update() {
        // ボールと壁の衝突を確認する
        this.#checkCollisionBallAndWall();
        //ボールとパドルの衝突を確認する
        this.#checkCollisionBallPaddle();

        this.#checkCollisionBallAndblock();

        this.#checkCollisionPaddleAndWall();

        // ゲームオーバーまたはゲームクリアかどうか検証する
        if (this.#isGameOver() || this.#isGameClear()) {
            // ゲーム画面を非表示にする
            this.isVisible = false;
        }

        // ボールを移動する
        this.#ball.move();
        // パドルを移動する
        this.#paddle.move();
    };

    draw() {
        // ボールを描画する
        this.#ball.draw();
        // パドルを描画する
        this.#paddle.draw();
        // ブロックを描画する
        this.#blocks.forEach((block) => block.draw());
        // バーを描画する
        this.#bar.draw();
    }
}