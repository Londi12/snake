class Food {
    constructor() {
        this.position = { x: 0, y: 0 };
        this.type = FoodType.REGULAR;
        this.age = 0;
        this.randomize();
    }

    randomize(snake = null, obstacles = []) {
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
            this.isPositionOccupied(newPos, snake, obstacles)
        );

        this.position = newPos;
        this.determineType();
        this.age = 0;
    }

    isPositionOccupied(pos, snake, obstacles) {
        if (snake && snake.positions.some(p => p.x === pos.x && p.y === pos.y)) {
            return true;
        }
        return obstacles.some(obs => obs.position.x === pos.x && obs.position.y === pos.y);
    }

    determineType() {
        const rand = Math.random();
        if (rand < FoodType.SUPER.chance) {
            this.type = FoodType.SUPER;
        } else if (rand < FoodType.SUPER.chance + FoodType.BONUS.chance) {
            this.type = FoodType.BONUS;
        } else {
            this.type = FoodType.REGULAR;
        }
    }

    draw(ctx) {
        this.age++;
        const pulse = (Math.abs(this.age % 20 - 10) / 10) * 0.2 + 0.8;
        const size = Math.floor(GRID_SIZE * pulse) - 1;
        const offset = (GRID_SIZE - size) / 2;

        const x = this.position.x * GRID_SIZE + offset;
        const y = GAME_TOP + this.position.y * GRID_SIZE + offset;

        ctx.fillStyle = this.type.color;
        
        if (this.type === FoodType.BONUS) {
            ctx.beginPath();
            ctx.ellipse(
                x + size/2, y + size/2,
                size/2, size/2,
                0, 0, Math.PI * 2
            );
            ctx.fill();
        } else {
            ctx.fillRect(x, y, size, size);
            if (this.type === FoodType.SUPER) {
                ctx.strokeStyle = Colors.WHITE;
                ctx.strokeRect(x, y, size, size);
            }
        }
    }
} 