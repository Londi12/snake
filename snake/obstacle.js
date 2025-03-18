class Obstacle {
    constructor(position) {
        this.position = position;
        this.animationFrames = 0;
    }

    update(snake, food, otherObstacles) {
        let newPos;
        let attempts = 0;
        const maxAttempts = 50;

        do {
            newPos = {
                x: Math.floor(Math.random() * GRID_COUNT),
                y: Math.floor(Math.random() * GRID_COUNT)
            };
            attempts++;
        } while (
            attempts < maxAttempts && 
            this.isPositionOccupied(newPos, snake, food, otherObstacles)
        );

        this.position = newPos;
        this.animationFrames = 10;
    }

    isPositionOccupied(pos, snake, food, obstacles) {
        if (snake.positions.some(p => p.x === pos.x && p.y === pos.y)) {
            return true;
        }
        if (food.position.x === pos.x && food.position.y === pos.y) {
            return true;
        }
        return obstacles.some(obs => 
            obs !== this && obs.position.x === pos.x && obs.position.y === pos.y
        );
    }

    draw(ctx) {
        let color = Colors.WHITE;
        if (this.animationFrames > 0) {
            color = `rgb(255, ${Math.min(255, 100 + this.animationFrames * 15)}, 100)`;
            this.animationFrames--;
        }

        ctx.fillStyle = color;
        ctx.fillRect(
            this.position.x * GRID_SIZE,
            GAME_TOP + this.position.y * GRID_SIZE,
            GRID_SIZE - 1,
            GRID_SIZE - 1
        );
    }
} 