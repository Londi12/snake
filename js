class AudioManager {
    constructor() {
        this.context = new (window.AudioContext || window.webkitAudioContext)();
        this.sounds = {};
        this.loadSounds();
    }

    async loadSounds() {
        const soundFiles = {
            eat: 'short-beep.mp3',
            bonus: 'bonus-beep.mp3',
            gameOver: 'game-over.mp3'
        };

        for (const [name, file] of Object.entries(soundFiles)) {
            try {
                const response = await fetch(`sounds/${file}`);
                const arrayBuffer = await response.arrayBuffer();
                const audioBuffer = await this.context.decodeAudioData(arrayBuffer);
                this.sounds[name] = audioBuffer;
            } catch (error) {
                console.warn(`Failed to load sound: ${file}`);
            }
        }
    }

    playSound(name) {
        if (!this.sounds[name]) return;
        
        const source = this.context.createBufferSource();
        source.buffer = this.sounds[name];
        source.connect(this.context.destination);
        source.start(0);
    }
} 