// app.js - Main application logic for UI integration

// Update date and time
function updateDateTime() {
    const now = new Date();
    const options = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric', 
        hour: '2-digit', 
        minute: '2-digit' 
    };
    const dateTimeElement = document.getElementById('dateTime');
    if (dateTimeElement) {
        dateTimeElement.textContent = now.toLocaleDateString('en-US', options);
    }
}

// Initialize date/time and update every minute
updateDateTime();
setInterval(updateDateTime, 60000);

// Slider element references.
// These are deliberately named differently from the variables used in the p5.js sketch
// to avoid redeclaration errors across scripts (sketch.js declares its own
// `motivationSlider`, `focusSlider`, and `stressSlider`). We initialise these
// later once the DOM is ready.
let motivationSliderEl = null;
let focusSliderEl = null;
let stressSliderEl = null;

// Update display values when sliders change
// This function is resilient to missing elements, since different UI layouts may
// omit or rename certain fields. Each element is checked for existence before
// being updated. The Calm value is derived from the Stress slider (100 - stress)
// if both the stress slider and calm element exist.
function updateDisplayValues() {
    // Parse numeric values from the sliders; guard against null references
    const motVal = motivationSliderEl ? parseInt(motivationSliderEl.value) : 0;
    const focVal = focusSliderEl ? parseInt(focusSliderEl.value) : 0;
    const strVal = stressSliderEl ? parseInt(stressSliderEl.value) : 0;

    // Update the numeric display in the Current Mood card
    const motDisplay = document.getElementById('motivationValue');
    if (motDisplay) motDisplay.textContent = motVal;
    const focDisplay = document.getElementById('focusValue');
    if (focDisplay) focDisplay.textContent = focVal;
    const calmDisplay = document.getElementById('calmValue');
    if (calmDisplay) calmDisplay.textContent = Math.max(0, 100 - strVal);

    // Update slider value labels next to each slider
    const motSliderValEl = document.getElementById('motivationSliderValue');
    if (motSliderValEl) motSliderValEl.textContent = motVal;
    const focSliderValEl = document.getElementById('focusSliderValue');
    if (focSliderValEl) focSliderValEl.textContent = focVal;
    const strSliderValEl = document.getElementById('stressSliderValue');
    if (strSliderValEl) strSliderValEl.textContent = strVal;

    // Optionally update the slider gradients for visual feedback, if CSS custom properties are used
    if (motivationSliderEl) {
        motivationSliderEl.style.setProperty('--value', `${motVal}%`);
    }
    if (focusSliderEl) {
        focusSliderEl.style.setProperty('--value', `${focVal}%`);
    }
    if (stressSliderEl) {
        stressSliderEl.style.setProperty('--value', `${strVal}%`);
    }
}

// Initialise sliders and attach listeners once the DOM is fully loaded.
function initSliders() {
    // Grab the slider elements now that the DOM is ready. Using unique names
    // prevents collisions with the variables in sketch.js.
    motivationSliderEl = document.getElementById('motivationSlider');
    focusSliderEl      = document.getElementById('focusSlider');
    stressSliderEl     = document.getElementById('stressSlider');

    // Attach 'input' listeners to update the display whenever a value changes.
    // Guard each attachment in case a slider is omitted in a simplified layout.
    if (motivationSliderEl) {
        motivationSliderEl.addEventListener('input', updateDisplayValues);
    }
    if (focusSliderEl) {
        focusSliderEl.addEventListener('input', updateDisplayValues);
    }
    if (stressSliderEl) {
        stressSliderEl.addEventListener('input', updateDisplayValues);
    }

    // Immediately sync display values with whatever the sliders start at.
    updateDisplayValues();
}

// Journal Modal functionality
// These elements may not exist if the UI has been simplified to log without a modal.
const journalOverlay = document.getElementById('journalOverlay');
const journalModal = document.getElementById('journalModal');
const journalText = document.getElementById('journalText');
const saveJournalBtn = document.getElementById('saveJournal');
const cancelJournalBtn = document.getElementById('cancelJournal');

/**
 * Open the journal modal if it exists. If no modal is present, log the mood
 * immediately using the current slider values and an empty note. This allows
 * the "Log Mood" button to work regardless of whether the reflection UI
 * (modal + overlay) is included in the page.
 */
function openJournalModal() {
    // If both overlay and modal exist, show them and focus the textarea
    if (journalOverlay && journalModal && journalText) {
        journalOverlay.classList.add('active');
        journalModal.classList.add('active');
        journalText.focus();
    } else {
        // No modal present — log the mood immediately without a note
        saveMoodWithJournal();
    }
}

/**
 * Close the journal modal if it exists. Clears the journal textarea when
 * closing. Safe to call even when the modal elements are missing.
 */
function closeJournalModal() {
    if (journalOverlay) journalOverlay.classList.remove('active');
    if (journalModal) journalModal.classList.remove('active');
    if (journalText) journalText.value = '';
}

// Save mood with journal entry
function saveMoodWithJournal() {
    // Gracefully handle the case where the journal textarea is absent
    const noteValue = journalText ? journalText.value : '';
    const now = Date.now();

    const moodData = {
        motivation: motivationSliderEl ? parseInt(motivationSliderEl.value) : 0,
        focus:      focusSliderEl ? parseInt(focusSliderEl.value) : 0,
        stress:     stressSliderEl ? parseInt(stressSliderEl.value) : 0,
        // Duplicate values for p5.js compatibility
        mot: motivationSliderEl ? parseInt(motivationSliderEl.value) : 0,
        foc: focusSliderEl ? parseInt(focusSliderEl.value) : 0,
        st:  stressSliderEl ? parseInt(stressSliderEl.value) : 0,
        note: noteValue,
        timestamp: now,
        t: now,
        createdAt: new Date(now).toISOString()
    };
    
    // Get existing history from localStorage
    let history = [];
    const savedHistory = localStorage.getItem('moodHistory');
    if (savedHistory) {
        try {
            history = JSON.parse(savedHistory);
        } catch (e) {
            console.error('Error parsing mood history:', e);
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
        historyContent.innerHTML = 'No mood logs yet';
        return;
    }
    
    try {
        const history = JSON.parse(savedHistory);
        if (history.length === 0) {
            historyContent.innerHTML = 'No mood logs yet';
            return;
        }
        
        // Show last 5 entries (most recent first)
        const recentEntries = history.slice(-5).reverse();
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
                        <span>😰 ${st}</span>
                    </div>
                    ${entry.note ? `<div class="history-item-note">"${entry.note.substring(0, 50)}${entry.note.length > 50 ? '...' : ''}"</div>` : ''}
                </div>
            `;
        });
        
        html += `<div style="margin-top: 1rem; font-size: 0.85rem; color: #999;">
                    Total logs: ${history.length}
                </div>`;
        
        historyContent.innerHTML = html;
        
    } catch (e) {
        console.error('Error displaying history:', e);
        historyContent.innerHTML = 'Error loading history';
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
    // If the toast element is missing from the page, fall back to a simple alert.
    if (!toast) {
        // Only use alert as a fallback; avoid errors when no toast container exists.
        alert(message);
        return;
    }
    toast.textContent = message;
    toast.classList.add('active');
    
    setTimeout(() => {
        toast.classList.remove('active');
    }, 3000);
}

// Button event handlers
// Attach handlers only if the elements exist. This prevents errors when the
// journal modal is not present in the DOM (e.g., simplified UI without reflection).
let logMoodBtnEl = document.getElementById('logMoodBtn');
// Fall back to a button whose text contains "log mood" if the expected ID isn't found.
if (!logMoodBtnEl) {
    const allButtons = Array.from(document.getElementsByTagName('button'));
    logMoodBtnEl = allButtons.find(btn => /log\s*mood/i.test(btn.textContent));
}
if (logMoodBtnEl) {
    logMoodBtnEl.addEventListener('click', openJournalModal);
}
let clearLogBtnEl = document.getElementById('clearLogBtn');
// Fall back to a button whose text contains "clear log" if the expected ID isn't found.
if (!clearLogBtnEl) {
    const allButtons = Array.from(document.getElementsByTagName('button'));
    clearLogBtnEl = allButtons.find(btn => /clear\s*log/i.test(btn.textContent));
}
if (clearLogBtnEl) {
    clearLogBtnEl.addEventListener('click', clearAllLogs);
}
if (saveJournalBtn) {
    saveJournalBtn.addEventListener('click', saveMoodWithJournal);
}
if (cancelJournalBtn) {
    cancelJournalBtn.addEventListener('click', closeJournalModal);
}

// Close modal with Escape key and save with Ctrl/Cmd + Enter when modal is active
document.addEventListener('keydown', (e) => {
    // Close only if journalModal exists and is active
    if (e.key === 'Escape' && journalModal && journalModal.classList.contains('active')) {
        closeJournalModal();
    }
    // Save with Ctrl/Cmd + Enter when modal is active
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter' && journalModal && journalModal.classList.contains('active')) {
        saveMoodWithJournal();
    }
});

// Close modal when clicking overlay (if overlay exists)
if (journalOverlay) {
    journalOverlay.addEventListener('click', closeJournalModal);
}

// Initialise sliders and history display once the DOM is ready. Without waiting
// for DOMContentLoaded the slider elements may be undefined, leading to
// listeners not attaching and the display not updating. We also refresh
// the history display immediately on load.
document.addEventListener('DOMContentLoaded', () => {
    initSliders();
    updateHistoryDisplay();
});

// Refresh the history display every 30 seconds to surface newly logged moods.
setInterval(updateHistoryDisplay, 30000);

/*
 * Strategy functionality
 *
 * The strategies feature allows users to select quick actions that
 * influence their mood levels. Each strategy belongs to one of three
 * types: motivation, focus, or stress. Completing a motivation or focus
 * strategy will increase the corresponding slider by 10 points (capped
 * at 100), while completing a stress strategy will decrease the stress
 * slider by 10 points (floored at 0). If strategy modal elements are
 * present in the DOM, the modal will display details and steps for
 * the selected strategy; otherwise, the effect is applied immediately.
 */

// Strategy definitions
const strategies = {
    motivation: {
        setGoal: {
            title: "📌 Set a Clear Goal",
            description: "Define an attainable goal to give yourself direction and purpose.",
            steps: [
                "Identify a meaningful goal",
                "Break it down into smaller milestones",
                "Write it down and keep it visible",
                "Set a timeline to reach it",
                "Take your first step now",
                "Celebrate progress"
            ]
        },
        smallTask: {
            title: "✅ Complete a Small Task",
            description: "Small wins build momentum and boost your confidence.",
            steps: [
                "Pick a quick, easy task",
                "Focus solely on completing it",
                "Finish within a short timeframe",
                "Acknowledge your accomplishment",
                "Use the momentum to tackle another task",
                "Celebrate each success"
            ]
        },
        rewardYourself: {
            title: "🎁 Reward Yourself",
            description: "Rewards can motivate you to continue working toward your goals.",
            steps: [
                "Choose a small, healthy reward",
                "Finish a task or goal",
                "Treat yourself to the reward",
                "Reflect on your achievement",
                "Plan your next goal",
                "Repeat"
            ]
        },
        motivateOthers: {
            title: "🤝 Motivated by Others",
            description: "Connecting with others can inspire you and keep you on track.",
            steps: [
                "Share your goals with a friend",
                "Ask for support and encouragement",
                "Discuss your progress regularly",
                "Celebrate successes together",
                "Offer support in return",
                "Stay accountable"
            ]
        }
    },
    focus: {
        eatHealthy: {
            title: "🥗 Eat Healthier",
            description: "Nutrition impacts your ability to concentrate and stay alert.",
            steps: [
                "Choose a healthy snack (fruit, nuts, yogurt)",
                "Drink a glass of water",
                "Avoid sugary or processed foods",
                "Plan meals with whole foods",
                "Notice how your energy improves",
                "Maintain hydration"
            ]
        },
        sleepBetter: {
            title: "🛌 Sleep Better",
            description: "Adequate sleep enhances focus and cognitive function.",
            steps: [
                "Set a consistent bedtime",
                "Turn off screens an hour before bed",
                "Relax with light stretching or reading",
                "Keep your bedroom cool and dark",
                "Wake up at the same time daily",
                "Notice improved focus"
            ]
        },
        cleanSpace: {
            title: "🧹 Clean Your Space",
            description: "A tidy environment helps clear your mind and improve concentration.",
            steps: [
                "Remove clutter from your workspace",
                "Put away unnecessary items",
                "Wipe surfaces",
                "Arrange supplies neatly",
                "Take a deep breath",
                "Start your task in a clean space"
            ]
        },
        focusMusic: {
            title: "🎧 Focus Music",
            description: "Calming background music can help you concentrate.",
            steps: [
                "Choose instrumental or ambient music",
                "Adjust volume to a comfortable level",
                "Eliminate other distractions",
                "Start your work",
                "Let the music keep you on track",
                "Take breaks as needed"
            ]
        }
    },
    stress: {
        takeWalk: {
            title: "🚶 Take a Walk",
            description: "Moving your body reduces tension and clears your mind.",
            steps: [
                "Stand up and stretch",
                "Step outside or around your space",
                "Walk at a gentle pace for 10 minutes",
                "Focus on your breath and surroundings",
                "Notice your stress decreasing",
                "Return refreshed"
            ]
        },
        deepBreath: {
            title: "🌬 Deep Breath",
            description: "Controlled breathing activates your body's relaxation response.",
            steps: [
                "Sit comfortably",
                "Inhale slowly through your nose for 4 counts",
                "Hold for 4 counts",
                "Exhale through your mouth for 6 counts",
                "Repeat 5–10 times",
                "Feel the tension leaving"
            ]
        },
        talkFriend: {
            title: "🗣 Talk with a Friend",
            description: "Sharing your feelings helps release stress and gain perspective.",
            steps: [
                "Call or message a trusted friend",
                "Express what's on your mind",
                "Listen to their responses",
                "Share a few laughs or positive thoughts",
                "Thank them for their support",
                "Continue your day with a lighter mood"
            ]
        }
    }
};

// Strategy modal element references (may be null in simplified layouts)
const strategyOverlay = document.getElementById('strategyOverlay');
const strategyModal = document.getElementById('strategyModal');
const strategyTitle = document.getElementById('strategyTitle');
const strategyDescription = document.getElementById('strategyDescription');
const strategySteps = document.getElementById('strategySteps');
const completeStrategyBtn = document.getElementById('completeStrategy');
const closeStrategyBtn = document.getElementById('closeStrategy');

// Track the current strategy selection
let currentStrategy = null;

/**
 * Open the strategy modal and populate it with the selected strategy's
 * details. If the modal does not exist, complete the strategy immediately.
 *
 * @param {string} type - The strategy type ('motivation', 'focus', 'stress').
 * @param {string} strategy - The strategy key within the type.
 */
function openStrategyModal(type, strategy) {
    const strategyData = strategies[type] && strategies[type][strategy];
    if (!strategyData) return;
    currentStrategy = { type, strategy };
    // If modal elements are present, show them; otherwise complete immediately
    if (strategyModal && strategyOverlay && strategyTitle && strategyDescription && strategySteps) {
        // Populate modal content
        strategyTitle.textContent = strategyData.title;
        strategyDescription.textContent = strategyData.description;
        let stepsHTML = '<ol style="margin: 0; padding-left: 1.5rem; color: #555;">';
        strategyData.steps.forEach(step => {
            stepsHTML += `<li style="margin-bottom: 0.8rem; line-height: 1.6;">${step}</li>`;
        });
        stepsHTML += '</ol>';
        strategySteps.innerHTML = stepsHTML;
        strategyOverlay.classList.add('active');
        strategyModal.classList.add('active');
    } else {
        // No modal; complete strategy immediately
        completeStrategy();
    }
}

/**
 * Close the strategy modal and reset the current strategy.
 */
function closeStrategyModal() {
    if (strategyOverlay) strategyOverlay.classList.remove('active');
    if (strategyModal) strategyModal.classList.remove('active');
    currentStrategy = null;
}

/**
 * Complete the current strategy by adjusting slider values and showing
 * a toast notification. Handles the absence of the modal gracefully.
 */
function completeStrategy() {
    if (!currentStrategy) return;
    const { type } = currentStrategy;
    if (type === 'motivation') {
        if (motivationSliderEl) {
            const newVal = Math.min(100, parseInt(motivationSliderEl.value || 0) + 10);
            motivationSliderEl.value = newVal;
        }
    } else if (type === 'focus') {
        if (focusSliderEl) {
            const newVal = Math.min(100, parseInt(focusSliderEl.value || 0) + 10);
            focusSliderEl.value = newVal;
        }
    } else if (type === 'stress') {
        if (stressSliderEl) {
            const newVal = Math.max(0, parseInt(stressSliderEl.value || 0) - 10);
            stressSliderEl.value = newVal;
        }
    }
    updateDisplayValues();
    showToast('🎉 Great job completing the strategy!');
    closeStrategyModal();
}

// Attach event listeners to strategy buttons if present
const strategyButtons = document.querySelectorAll('.strategy-btn');
if (strategyButtons) {
    strategyButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const type = e.currentTarget.dataset.type;
            const strat = e.currentTarget.dataset.strategy;
            openStrategyModal(type, strat);
        });
    });
}

// Attach modal control handlers if modal elements exist
if (completeStrategyBtn) {
    completeStrategyBtn.addEventListener('click', completeStrategy);
}
if (closeStrategyBtn) {
    closeStrategyBtn.addEventListener('click', closeStrategyModal);
}
if (strategyOverlay) {
    strategyOverlay.addEventListener('click', closeStrategyModal);
}

// Extend existing keydown handler to close strategy modal with Escape and handle modal save
document.addEventListener('keydown', (e) => {
    // Already handle journal modal in previous handler; add strategy modal check
    if (e.key === 'Escape' && strategyModal && strategyModal.classList.contains('active')) {
        closeStrategyModal();
    }
});
