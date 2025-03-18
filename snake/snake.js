class Snake {
    constructor() {
        this.reset();
    }

    reset() {
        this.positions = [{
            x: Math.floor(GRID_COUNT / 2),
            y: Math.floor(GRID_COUNT / 2)
        }];
        this.direction = Direction.RIGHT;
        this.length = 1;
        this.growthPending = 0;
    }

    getHead() {
        return this.positions[0];
    }

    update(obstacles) {
        const head = this.getHead();
        const newHead = {
            x: (head.x + this.direction.x + GRID_COUNT) % GRID_COUNT,
            y: (head.y + this.direction.y + GRID_COUNT) % GRID_COUNT
        };

        if (this.checkCollision(newHead, obstacles)) {
            return false;
        }

        this.positions.unshift(newHead);
        if (this.positions.length > this.length) {
            if (this.growthPending > 0) {
                this.growthPending--;
            } else {
                this.positions.pop();
            }
        }
        return true;
    }

    changeDirection(newDirection) {
        if (!Direction.isOpposite(this.direction, newDirection)) {
            this.direction = newDirection;
        }
    }

    checkCollision(position, obstacles) {
        // Self collision
        for (let i = 1; i < this.positions.length; i++) {
            if (position.x === this.positions[i].x && 
                position.y === this.positions[i].y) {
                return true;
            }
        }

        // Obstacle collision
        return obstacles.some(obs => 
            position.x === obs.position.x && position.y === obs.position.y
        );
    }

    draw(ctx) {
        this.positions.forEach((pos, i) => {
            const brightness = 255 - (i * 50 / Math.max(this.length, 1));
            ctx.fillStyle = `rgb(0, ${Math.max(brightness, 50)}, 0)`;
            ctx.fillRect(
                pos.x * GRID_SIZE,
                GAME_TOP + pos.y * GRID_SIZE,
                GRID_SIZE - 1,
                GRID_SIZE - 1
            );

            if (i === 0) {
                this.drawEyes(ctx, pos);
            }
        });
    }

    drawEyes(ctx, pos) {
        ctx.fillStyle = Colors.WHITE;
        const eyeSize = 3;
        const eyeOffset = GRID_SIZE * 0.3;
        
        let leftEye, rightEye;
        
        switch(this.direction) {
            case Direction.RIGHT:
                leftEye = { x: 0.7, y: 0.3 };
                rightEye = { x: 0.7, y: 0.7 };
                break;
            case Direction.LEFT:
                leftEye = { x: 0.3, y: 0.3 };
                rightEye = { x: 0.3, y: 0.7 };
                break;
            case Direction.UP:
                leftEye = { x: 0.3, y: 0.3 };
                rightEye = { x: 0.7, y: 0.3 };
                break;
            case Direction.DOWN:
                leftEye = { x: 0.3, y: 0.7 };
                rightEye = { x: 0.7, y: 0.7 };
                break;
        }

        ctx.beginPath();
        ctx.arc(
            pos.x * GRID_SIZE + GRID_SIZE * leftEye.x,
            GAME_TOP + pos.y * GRID_SIZE + GRID_SIZE * leftEye.y,
            eyeSize, 0, Math.PI * 2
        );
        ctx.arc(
            pos.x * GRID_SIZE + GRID_SIZE * rightEye.x,
            GAME_TOP + pos.y * GRID_SIZE + GRID_SIZE * rightEye.y,
            eyeSize, 0, Math.PI * 2
        );
        ctx.fill();
    }
} 