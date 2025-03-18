// Constants and Configuration
const WINDOW_WIDTH = 600;
const WINDOW_HEIGHT = 650;
const GRID_SIZE = 20;
const UI_HEIGHT = 50;
const GAME_TOP = UI_HEIGHT;
const GRID_COUNT = WINDOW_WIDTH / GRID_SIZE;

// Colors
const Colors = {
    BLACK: '#000000',
    GREEN: '#00FF00',
    RED: '#FF0000',
    WHITE: '#FFFFFF',
    BLUE: '#0000FF',
    YELLOW: '#FFFF00',
    PURPLE: '#800080',
    GRAY: '#646464'
};

// Game parameters
const OBSTACLE_COUNT = 5;
const BASE_SPEED = 10;
const MAX_SPEED = 30;
const COMBO_TIME_THRESHOLD = 2000;

// Enums
const Direction = {
    UP: { x: 0, y: -1 },
    DOWN: { x: 0, y: 1 },
    LEFT: { x: -1, y: 0 },
    RIGHT: { x: 1, y: 0 }
};

const FoodType = {
    REGULAR: { value: 1, color: 'red' },
    BONUS: { value: 3, color: 'yellow' },
    SUPER: { value: 5, color: 'purple' }
};

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

        // Check collisions
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

    checkCollision(position, obstacles) {
        // Check self collision
        for (let i = 1; i < this.positions.length; i++) {
            if (position.x === this.positions[i].x && 
                position.y === this.positions[i].y) {
                return true;
            }
        }

        // Check obstacle collision
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

            // Draw eyes on head
            if (i === 0) {
                ctx.fillStyle = 'white';
                // Eye positions based on direction...
                // (Similar to Python version)
            }
        });
    }
}

// Main game class
class Game {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.audioManager = new AudioManager();
        
        this.score = 0;
        this.highScore = parseInt(localStorage.getItem('highScore')) || 0;
        this.bonusMultiplier = 1;
        this.lastFoodTime = 0;
        this.paused = false;
        this.gameOver = false;
        this.lastUpdateTime = 0;
        
        this.snake = new Snake();
        this.food = new Food();
        this.obstacles = [];
        
        this.setupControls();
    }

    init(difficulty) {
        document.getElementById('difficultySelect').style.display = 'none';
        document.getElementById('gameContainer').style.display = 'block';
        
        // Lower values = slower speed
        this.gameSpeed = difficulty === 'easy' ? BASE_SPEED :
                        difficulty === 'medium' ? BASE_SPEED + 5 :
                        BASE_SPEED + 10;
        
        this.generateObstacles();
        this.lastUpdateTime = performance.now();
        this.gameLoop();
    }

    generateObstacles() {
        this.obstacles = [];
        for (let i = 0; i < OBSTACLE_COUNT; i++) {
            const position = {
                x: Math.floor(Math.random() * GRID_COUNT),
                y: Math.floor(Math.random() * GRID_COUNT)
            };
            this.obstacles.push(new Obstacle(position));
        }
    }

    setupControls() {
        document.addEventListener('keydown', (e) => {
            switch(e.key) {
                case 'ArrowUp':
                    this.snake.changeDirection(Direction.UP);
                    break;
                case 'ArrowDown':
                    this.snake.changeDirection(Direction.DOWN);
                    break;
                case 'ArrowLeft':
                    this.snake.changeDirection(Direction.LEFT);
                    break;
                case 'ArrowRight':
                    this.snake.changeDirection(Direction.RIGHT);
                    break;
                case 'p':
                case 'P':
                    this.togglePause();
                    break;
            }
        });
    }

    togglePause() {
        this.paused = !this.paused;
    }

    update() {
        if (this.paused) return;

        if (!this.snake.update(this.obstacles)) {
            this.gameOver();
            return;
        }

        this.checkFoodCollision();
        this.updateUI();
    }

    checkFoodCollision() {
        const head = this.snake.getHead();
        if (head.x === this.food.position.x && head.y === this.food.position.y) {
            const currentTime = performance.now();
            const timeDiff = currentTime - this.lastFoodTime;
            
            if (timeDiff < COMBO_TIME_THRESHOLD) {
                this.bonusMultiplier += 0.5;
            } else {
                this.bonusMultiplier = 1;
            }
            
            const points = this.food.type.value * Math.floor(this.bonusMultiplier);
            this.score += points;
            
            if (this.score > this.highScore) {
                this.highScore = this.score;
                localStorage.setItem('highScore', this.highScore);
            }
            
            this.snake.length += this.food.type.value;
            this.snake.growthPending += this.food.type.value - 1;
            
            this.audioManager.playSound(
                this.food.type === FoodType.REGULAR ? 'eat' : 'bonus'
            );
            
            this.food.randomize(this.snake, this.obstacles);
            this.obstacles.forEach(obs => 
                obs.update(this.snake, this.food, this.obstacles)
            );
            
            this.lastFoodTime = currentTime;
        }
    }

    gameOver() {
        this.gameOver = true;
        this.audioManager.playSound('gameOver');
        
        // Clear the canvas first
        this.ctx.fillStyle = Colors.BLACK;
        this.ctx.fillRect(0, 0, WINDOW_WIDTH, WINDOW_HEIGHT);
        
        // Draw the game over overlay
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
        this.ctx.fillRect(0, 0, WINDOW_WIDTH, WINDOW_HEIGHT);
        
        // Draw the game over text
        this.ctx.fillStyle = Colors.WHITE;
        this.ctx.font = 'bold 40px Arial';
        this.ctx.textAlign = 'center';
        
        const centerY = WINDOW_HEIGHT / 2;
        this.ctx.fillText('GAME OVER', WINDOW_WIDTH/2, centerY - 60);
        
        this.ctx.font = '30px Arial';
        this.ctx.fillText(`Score: ${this.score}`, WINDOW_WIDTH/2, centerY - 20);
        this.ctx.fillText(`High Score: ${this.highScore}`, WINDOW_WIDTH/2, centerY + 20);
        
        this.ctx.font = '24px Arial';
        this.ctx.fillText('Press R to Restart or Q to Quit', WINDOW_WIDTH/2, centerY + 60);
        
        document.addEventListener('keydown', this.handleGameOver);
    }

    handleGameOver = (e) => {
        if (e.key.toLowerCase() === 'r') {
            document.removeEventListener('keydown', this.handleGameOver);
            this.gameOver = false;
            this.reset();
        } else if (e.key.toLowerCase() === 'q') {
            location.reload();
        }
    }

    reset() {
        this.snake.reset();
        this.food.randomize();
        this.generateObstacles();
        this.score = 0;
        this.bonusMultiplier = 1;
        this.lastFoodTime = performance.now();
        this.lastUpdateTime = performance.now();
        this.paused = false;
    }

    updateUI() {
        document.getElementById('score').textContent = `Score: ${this.score}`;
        document.getElementById('highScore').textContent = `High: ${this.highScore}`;
        
        const comboElement = document.getElementById('combo');
        if (this.bonusMultiplier > 1) {
            comboElement.textContent = `Combo: x${this.bonusMultiplier.toFixed(1)}`;
        } else {
            comboElement.textContent = '';
        }
    }

    draw() {
        if (this.gameOver) {
            // Don't redraw anything when game is over
            return;
        }
        
        this.ctx.fillStyle = Colors.BLACK;
        this.ctx.fillRect(0, 0, WINDOW_WIDTH, WINDOW_HEIGHT);
        
        // Draw border
        this.ctx.strokeStyle = Colors.GRAY;
        this.ctx.strokeRect(0, GAME_TOP, WINDOW_WIDTH, WINDOW_WIDTH);
        
        this.obstacles.forEach(obs => obs.draw(this.ctx));
        this.snake.draw(this.ctx);
        this.food.draw(this.ctx);
        
        if (this.paused) {
            this.ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
            this.ctx.fillRect(0, 0, WINDOW_WIDTH, WINDOW_HEIGHT);
            
            this.ctx.fillStyle = Colors.WHITE;
            this.ctx.font = '30px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.fillText('PAUSED', WINDOW_WIDTH/2, WINDOW_HEIGHT/2);
        }
    }

    gameLoop = () => {
        if (!this.gameOver) {
            const currentTime = performance.now();
            const elapsed = currentTime - this.lastUpdateTime;
            
            // Convert gameSpeed to milliseconds between updates
            // Higher gameSpeed = smaller delay between updates
            const updateInterval = 1000 / this.gameSpeed;
            
            if (elapsed > updateInterval) {
                this.update();
                this.lastUpdateTime = currentTime;
            }
        }
        this.draw();
        requestAnimationFrame(this.gameLoop);
    }
}

function startGame(difficulty) {
    const game = new Game();
    game.init(difficulty);
}

// Start the game
window.onload = () => {
    new Game();
}; 