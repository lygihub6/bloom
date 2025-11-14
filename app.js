// app.js - Enhanced application logic with strategy guidance

// Strategy definitions
const strategies = {
    motivation: {
        exercise: {
            title: "🏃 Take a Walk",
            description: "Physical movement is one of the quickest ways to boost your motivation and energy levels.",
            steps: [
                "Stand up and stretch for 30 seconds",
                "Put on comfortable shoes",
                "Step outside or find a walking path",
                "Walk briskly for 10-15 minutes",
                "Focus on your breathing and surroundings",
                "Notice how your body feels energized"
            ]
        },
        music: {
            title: "🎵 Play Energizing Music",
            description: "Music can instantly shift your mood and boost motivation.",
            steps: [
                "Choose upbeat, positive music you enjoy",
                "Set volume to a comfortable level",
                "Close your eyes and listen for 1-2 songs",
                "Move your body to the rhythm if you feel like it",
                "Sing along if you know the words",
                "Feel the energy flowing through you"
            ]
        },
        reward: {
            title: "🎯 Set a Small Goal",
            description: "Achieving small wins builds momentum for bigger accomplishments.",
            steps: [
                "Choose one simple task (5-10 minutes)",
                "Write it down clearly",
                "Break it into 3 tiny steps",
                "Complete step 1 right now",
                "Celebrate this small win",
                "Use the momentum to continue"
            ]
        },
        social: {
            title: "💬 Connect with Someone",
            description: "Social connection can provide instant motivation and support.",
            steps: [
                "Think of someone who energizes you",
                "Send them a quick message or call",
                "Share one positive thing from today",
                "Ask them about their day",
                "Plan something fun together",
                "Thank them for their time"
            ]
        }
    },
    focus: {
        pomodoro: {
            title: "⏰ Start a Focus Session",
            description: "The Pomodoro Technique helps maintain concentration through structured work periods.",
            steps: [
                "Choose one specific task to focus on",
                "Set a timer for 25 minutes",
                "Work on only this task",
                "When timer rings, take a 5-minute break",
                "Stretch, breathe, or get water",
                "Repeat for another session if needed"
            ]
        },
        clean: {
            title: "🧹 Clear Your Space",
            description: "A tidy environment promotes a clear, focused mind.",
            steps: [
                "Look at your immediate workspace",
                "Remove any trash or dishes",
                "Organize papers and supplies",
                "Wipe down surfaces",
                "Put away 3 distracting items",
                "Take a deep breath in your clean space"
            ]
        },
        break: {
            title: "☕ Take a Mindful Break",
            description: "Strategic breaks actually improve focus when you return to work.",
            steps: [
                "Step away from your current task",
                "Make a warm beverage or get water",
                "Look out a window for 60 seconds",
                "Do 5 shoulder rolls backward",
                "Take 5 deep, slow breaths",
                "Return to work with fresh perspective"
            ]
        },
        list: {
            title: "📝 Create a Priority List",
            description: "Writing down tasks clears mental clutter and improves focus.",
            steps: [
                "Get a piece of paper or open notes app",
                "Brain dump all tasks on your mind",
                "Circle the 3 most important ones",
                "Number them in priority order",
                "Put the list where you can see it",
                "Focus only on item #1 for now"
            ]
        }
    },
    stress: {
        breathe: {
            title: "🌬️ Practice Deep Breathing",
            description: "Controlled breathing activates your body's relaxation response.",
            steps: [
                "Sit comfortably with feet flat on floor",
                "Place one hand on chest, one on belly",
                "Inhale slowly through nose for 4 counts",
                "Hold breath gently for 4 counts",
                "Exhale through mouth for 6 counts",
                "Repeat this cycle 5-10 times"
            ]
        },
        meditate: {
            title: "🧘 Quick Meditation",
            description: "Even brief meditation can significantly reduce stress levels.",
            steps: [
                "Find a quiet spot and sit comfortably",
                "Close your eyes or soften your gaze",
                "Notice your natural breathing",
                "When thoughts arise, acknowledge them",
                "Gently return focus to your breath",
                "Continue for 5-10 minutes"
            ]
        },
        journal: {
            title: "📖 Express Your Feelings",
            description: "Writing helps process emotions and reduce stress.",
            steps: [
                "Get paper or open a notes app",
                "Write 'I feel...' and complete the sentence",
                "Don't judge, just let words flow",
                "Describe what triggered these feelings",
                "Write one thing you're grateful for",
                "Close with one kind message to yourself"
            ]
        },
        nature: {
            title: "🌿 Connect with Nature",
            description: "Nature exposure quickly reduces cortisol and stress levels.",
            steps: [
                "Step outside or find a window",
                "Look at something green or natural",
                "Take 10 slow, deep breaths of fresh air",
                "Notice 3 things you can see in nature",
                "Listen for natural sounds",
                "Feel the air or sun on your skin"
            ]
        }
    }
};

// Slider event handlers
const motivationSlider = document.getElementById('motivationSlider');
const focusSlider = document.getElementById('focusSlider');
const stressSlider = document.getElementById('stressSlider');

// Update display values when sliders change
function updateDisplayValues() {
    const motivation = parseInt(motivationSlider.value);
    const focus = parseInt(focusSlider.value);
    const stress = parseInt(stressSlider.value);
    
    // Update stat display
    document.getElementById('motivationValue').textContent = motivation;
    document.getElementById('focusValue').textContent = focus;
    document.getElementById('calmValue').textContent = 100 - stress;
    
    // Update slider labels
    document.getElementById('motivationSliderValue').textContent = motivation;
    document.getElementById('focusSliderValue').textContent = focus;
    document.getElementById('stressSliderValue').textContent = stress;
    
    // Update slider gradients
    motivationSlider.style.setProperty('--value', `${motivation}%`);
    focusSlider.style.setProperty('--value', `${focus}%`);
    stressSlider.style.setProperty('--value', `${stress}%`);
}

// Initialize slider gradients
function initSliderGradients() {
    motivationSlider.style.background = `linear-gradient(to right, #e5e7eb 0%, #e5e7eb ${motivationSlider.value}%, #fbbf24 ${motivationSlider.value}%, #fbbf24 100%)`;
    focusSlider.style.background = `linear-gradient(to right, #e5e7eb 0%, #e5e7eb ${focusSlider.value}%, #10b981 ${focusSlider.value}%, #10b981 100%)`;
    stressSlider.style.background = `linear-gradient(to right, #10b981 0%, #10b981 ${100 - stressSlider.value}%, #e5e7eb ${100 - stressSlider.value}%, #ef4444 ${stressSlider.value}%, #ef4444 100%)`;
}

// Update slider gradients on input
motivationSlider.addEventListener('input', function() {
    this.style.background = `linear-gradient(to right, #e5e7eb 0%, #e5e7eb ${this.value}%, #fbbf24 ${this.value}%, #fbbf24 100%)`;
    updateDisplayValues();
});

focusSlider.addEventListener('input', function() {
    this.style.background = `linear-gradient(to right, #e5e7eb 0%, #e5e7eb ${this.value}%, #10b981 ${this.value}%, #10b981 100%)`;
    updateDisplayValues();
});

stressSlider.addEventListener('input', function() {
    const val = this.value;
    if (val <= 30) {
        this.style.background = `linear-gradient(to right, #10b981 0%, #10b981 ${100 - val}%, #e5e7eb ${100 - val}%, #fbbf24 ${val}%, #fbbf24 100%)`;
    } else {
        this.style.background = `linear-gradient(to right, #10b981 0%, #10b981 ${100 - val}%, #e5e7eb ${100 - val}%, #ef4444 ${val}%, #ef4444 100%)`;
    }
    updateDisplayValues();
});

// Journal Modal functionality
const journalOverlay = document.getElementById('journalOverlay');
const journalModal = document.getElementById('journalModal');
const journalText = document.getElementById('journalText');
const saveJournalBtn = document.getElementById('saveJournal');
const cancelJournalBtn = document.getElementById('cancelJournal');

function openJournalModal() {
    journalOverlay.classList.add('active');
    journalModal.classList.add('active');
    journalText.focus();
}

function closeJournalModal() {
    journalOverlay.classList.remove('active');
    journalModal.classList.remove('active');
    journalText.value = '';
}

// Strategy Modal functionality
const strategyOverlay = document.getElementById('strategyOverlay');
const strategyModal = document.getElementById('strategyModal');
const strategyTitle = document.getElementById('strategyTitle');
const strategyDescription = document.getElementById('strategyDescription');
const strategySteps = document.getElementById('strategySteps');
const completeStrategyBtn = document.getElementById('completeStrategy');
const closeStrategyBtn = document.getElementById('closeStrategy');

let currentStrategy = null;

function openStrategyModal(type, strategy) {
    const strategyData = strategies[type][strategy];
    if (!strategyData) return;

    currentStrategy = { type, strategy };
    
    strategyTitle.textContent = strategyData.title;
    strategyDescription.textContent = strategyData.description;
    
    // Create steps list
    let stepsHTML = '<ol style="margin: 0; padding-left: 1.5rem; color: #555;">';
    strategyData.steps.forEach(step => {
        stepsHTML += `<li style="margin-bottom: 0.8rem; line-height: 1.6;">${step}</li>`;
    });
    stepsHTML += '</ol>';
    strategySteps.innerHTML = stepsHTML;
    
    strategyOverlay.classList.add('active');
    strategyModal.classList.add('active');
}

function closeStrategyModal() {
    strategyOverlay.classList.remove('active');
    strategyModal.classList.remove('active');
    currentStrategy = null;
}

// Handle strategy completion
function completeStrategy() {
    if (currentStrategy) {
        // Adjust mood based on strategy type
        if (currentStrategy.type === 'motivation') {
            motivationSlider.value = Math.min(100, parseInt(motivationSlider.value) + 10);
        } else if (currentStrategy.type === 'focus') {
            focusSlider.value = Math.min(100, parseInt(focusSlider.value) + 10);
        } else if (currentStrategy.type === 'stress') {
            stressSlider.value = Math.max(0, parseInt(stressSlider.value) - 10);
        }
        
        updateDisplayValues();
        showToast('🎉 Great job completing the strategy!');
    }
    closeStrategyModal();
}

// Save mood with journal entry
function saveMoodWithJournal() {
    const moodData = {
        motivation: parseInt(motivationSlider.value),
        focus: parseInt(focusSlider.value),
        stress: parseInt(stressSlider.value),
        mot: parseInt(motivationSlider.value), // for p5.js compatibility
        foc: parseInt(focusSlider.value),
        st: parseInt(stressSlider.value),
        note: journalText.value,
        timestamp: Date.now(),
        t: Date.now(),
        createdAt: new Date().toISOString()
    };
    
    // Get existing history or create new array
    let history = [];
    const savedHistory = localStorage.getItem('moodHistory');
    if (savedHistory) {
        try {
            history = JSON.parse(savedHistory);
        } catch (e) {
            console.error('Error parsing saved history:', e);
        }
    }
    
    // Add new mood data
    history.push(moodData);
    
    // Keep only recent entries (max 120)
    if (history.length > 120) {
        history = history.slice(-120);
    }
    
    // Save to localStorage
    localStorage.setItem('moodHistory', JSON.stringify(history));
    
    // Update the mood log for p5.js sketch
    if (typeof moodLog !== 'undefined') {
        moodLog.push(moodData);
        if (moodLog.length > 120) {
            moodLog.shift();
        }
    }
    
    // Update history display
    updateHistoryDisplay();
    
    // Close modal and show toast
    closeJournalModal();
    showToast('✅ Mood logged successfully!');
}

// Update history display
function updateHistoryDisplay() {
    const historyContent = document.getElementById('historyContent');
    const savedHistory = localStorage.getItem('moodHistory');
    
    if (!savedHistory) {
        historyContent.innerHTML = '<p class="no-logs">No mood logs yet</p>';
        return;
    }
    
    try {
        const history = JSON.parse(savedHistory);
        if (history.length === 0) {
            historyContent.innerHTML = '<p class="no-logs">No mood logs yet</p>';
            return;
        }
        
        // Show last 3 entries (most recent first)
        const recentEntries = history.slice(-3).reverse();
        let html = '';
        
        recentEntries.forEach((entry, index) => {
            const date = new Date(entry.createdAt || entry.timestamp);
            const timeStr = date.toLocaleString('en-US', { 
                month: 'short', 
                day: 'numeric', 
                hour: '2-digit', 
                minute: '2-digit' 
            });
            
            const mot = entry.motivation || entry.mot || 0;
            const foc = entry.focus || entry.foc || 0;
            const st = entry.stress || entry.st || 0;
            
            html += `
                <div class="history-item">
                    <div class="history-item-time">${timeStr}</div>
                    <div class="history-item-mood">
                        <span>💪 ${mot}</span>
                        <span>🎯 ${foc}</span>
                        <span>🔥 ${st}</span>
                    </div>
                    ${entry.note ? `<div class="history-item-note">"${entry.note.substring(0, 50)}${entry.note.length > 50 ? '...' : ''}"</div>` : ''}
                </div>
            `;
        });
        
        historyContent.innerHTML = html;
        
    } catch (e) {
        console.error('Error displaying history:', e);
        historyContent.innerHTML = '<p class="no-logs">Error loading history</p>';
    }
}

// Clear all logs
function clearAllLogs() {
    if (confirm('Are you sure you want to clear all mood logs? This cannot be undone.')) {
        localStorage.removeItem('moodHistory');
        
        // Clear p5.js mood log
        if (typeof moodLog !== 'undefined') {
            moodLog.length = 0;
        }
        
        updateHistoryDisplay();
        showToast('🧹 All logs cleared!');
    }
}

// Toast notification
function showToast(message) {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.classList.add('active');
    
    setTimeout(() => {
        toast.classList.remove('active');
    }, 3000);
}

// Button event handlers
document.getElementById('logMoodBtn').addEventListener('click', openJournalModal);
document.getElementById('clearLogBtn').addEventListener('click', clearAllLogs);
saveJournalBtn.addEventListener('click', saveMoodWithJournal);
cancelJournalBtn.addEventListener('click', closeJournalModal);
completeStrategyBtn.addEventListener('click', completeStrategy);
closeStrategyBtn.addEventListener('click', closeStrategyModal);

// Strategy button event handlers
document.querySelectorAll('.strategy-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        const type = e.currentTarget.dataset.type;
        const strategy = e.currentTarget.dataset.strategy;
        openStrategyModal(type, strategy);
    });
});

// Close modals with Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        if (journalModal.classList.contains('active')) {
            closeJournalModal();
        }
        if (strategyModal.classList.contains('active')) {
            closeStrategyModal();
        }
    }
    // Save journal with Ctrl/Cmd + Enter
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter' && journalModal.classList.contains('active')) {
        saveMoodWithJournal();
    }
});

// Close modals when clicking overlay
journalOverlay.addEventListener('click', closeJournalModal);
strategyOverlay.addEventListener('click', closeStrategyModal);

// Initialize display
updateDisplayValues();
updateHistoryDisplay();
initSliderGradients();

// Refresh history display every 30 seconds
setInterval(updateHistoryDisplay, 30000);