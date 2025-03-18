const WINDOW_WIDTH = 600;
const WINDOW_HEIGHT = 650;
const GRID_SIZE = 20;
const UI_HEIGHT = 50;
const GAME_TOP = UI_HEIGHT;
const GRID_COUNT = WINDOW_WIDTH / GRID_SIZE;

const OBSTACLE_COUNT = 5;
const BASE_SPEED = 10;
const MAX_SPEED = 30;
const COMBO_TIME_THRESHOLD = 2000;

const Direction = {
    UP: { x: 0, y: -1 },
    DOWN: { x: 0, y: 1 },
    LEFT: { x: -1, y: 0 },
    RIGHT: { x: 1, y: 0 },
    isOpposite(dir1, dir2) {
        return dir1.x === -dir2.x && dir1.y === -dir2.y;
    }
};

const FoodType = {
    REGULAR: { value: 1, color: 'red', chance: 0.7 },
    BONUS: { value: 3, color: 'yellow', chance: 0.2 },
    SUPER: { value: 5, color: 'purple', chance: 0.1 }
};

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