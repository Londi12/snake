# Snake Game

A modern implementation of the classic Snake game using Python and Pygame.

## Features
- Multiple difficulty levels (Easy, Medium, Hard)
- Different types of food with varying point values:
  - Regular (red) - 1 point
  - Bonus (yellow) - 3 points
  - Super (purple) - 5 points
- Dynamic obstacles that move when food is eaten
- Combo system that rewards quick consecutive catches
- Sound effects for eating food and game over events
- Visual enhancements including snake gradient, pulsating food, and obstacle animations
- Persistent high score tracking between game sessions

## Controls
- Arrow Keys: Control the snake
- P: Pause/Resume game
- R: Restart after game over
- Q: Quit after game over
- 1, 2, 3: Select difficulty level at the start screen

## Requirements
- Python 3.x
- Pygame

## Installation
1. Clone this repository:
```
git clone https://github.com/Londi12/snake-game.git
cd snake-game
```

2. Install Pygame if you don't have it already:
```
pip install pygame
```

3. Run the game:
```
python snake
```

## Sound Credits
To enable sound effects, place the following WAV files in the same directory as the snake file:
- eat.wav - For when the snake eats regular food
- bonus.wav - For when the snake eats bonus or super food
- game_over.wav - For when the game ends

## Future Enhancements
- Power-ups with special abilities
- Level progression with different layouts
- Multiplayer mode
- Mobile support with touch controls

## License
[MIT License](LICENSE) 