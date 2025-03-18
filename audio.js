class AudioManager {
    constructor() {
        this.sounds = {
            eat: new Audio('eat.wav'),
            bonus: new Audio('eat.wav'), // Use eat.wav as fallback if bonus.wav missing
            super: new Audio('eat.wav'), // Use eat.wav as fallback if super.wav missing
            gameOver: new Audio('game_over.wav')
        };
        
        // Initialize all sounds (helps with mobile browsers)
        for (const sound of Object.values(this.sounds)) {
            sound.load();
        }
    }
    
    playEatSound(foodType) {
        if (foodType === FoodType.REGULAR) {
            this.playSound('eat');
        } else {
            this.playSound('bonus');
        }
    }
    
    playGameOverSound() {
        this.playSound('gameOver');
    }
    
    playSound(soundName) {
        try {
            const sound = this.sounds[soundName];
            if (sound) {
                sound.currentTime = 0;
                sound.play().catch(e => console.log('Audio playback error:', e));
            }
        } catch (error) {
            console.log('Error playing sound:', error);
        }
    }
} 