// config.js - Configuration settings for Bloom Mood Tracker

const CONFIG = {
    // Mood thresholds for weather effects
    weather: {
        rainStressThreshold: 70,      // Stress level to trigger rain
        petalMotivationThreshold: 80, // Motivation level for floating petals
        maxRaindrops: 200,
        maxPetals: 50
    },

    // Flower appearance settings
    flower: {
        minHeight: 80,
        maxHeight: 300,
        minBloomSize: 20,
        maxBloomSize: 60,
        petalCount: 8,
        stemMinThickness: 4,
        stemMaxThickness: 24
    },

    // Color schemes
    colors: {
        // Gradient colors for different moods
        happy: {
            hue: 50,
            saturation: 80,
            brightness: 95
        },
        stressed: {
            hue: 0,
            saturation: 0,
            brightness: 40
        },
        calm: {
            hue: 210,
            saturation: 40,
            brightness: 92
        }
    },

    // Data storage settings
    storage: {
        maxLogEntries: 120,           // Maximum mood logs to keep
        historyDisplayCount: 5,       // Number of recent entries to show
        autoSaveInterval: 30000       // Auto-save interval in milliseconds
    },

    // Animation settings
    animation: {
        swaySpeed: 0.02,              // Speed of flower swaying
        petalRotationSpeed: 0.05,     // Petal animation speed
        weatherSpeed: {
            rainFallSpeed: [5, 10],   // Min/max rain falling speed
            petalFloatSpeed: [0.3, 0.8] // Min/max petal floating speed
        }
    },

    // UI settings
    ui: {
        toastDuration: 3000,          // Toast notification duration
        modalTransitionDuration: 300, // Modal animation duration
        sliderUpdateDelay: 0,         // Delay for slider updates (0 for instant)
        enableSoundEffects: false,    // Future feature: sound effects
        enableNotifications: false     // Future feature: browser notifications
    },

    // Face expressions thresholds
    expressions: {
        happy: {
            maxStress: 30,
            emoji: '😊'
        },
        neutral: {
            maxStress: 60,
            emoji: '😐'
        },
        sad: {
            maxStress: 100,
            emoji: '😢'
        }
    },

    // Default mood values
    defaults: {
        motivation: 70,
        focus: 50,
        stress: 10
    },

    // Feature flags for future features
    features: {
        enableWeatherEffects: true,
        enableJournal: true,
        enableTimeline: true,
        enableExport: false,          // Future: Export data as CSV
        enableSharing: false,         // Future: Share mood reports
        enableReminders: false,       // Future: Reminder notifications
        enableAnalytics: false        // Future: Mood analytics
    }
};

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CONFIG;
}