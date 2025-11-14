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
}

// Add event listeners to sliders
motivationSlider.addEventListener('input', updateDisplayValues);
focusSlider.addEventListener('input', updateDisplayValues);
stressSlider.addEventListener('input', updateDisplayValues);

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

// Close modal with Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && journalModal.classList.contains('active')) {
        closeJournalModal();
    }
    // Save with Ctrl/Cmd + Enter
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter' && journalModal.classList.contains('active')) {
        saveMoodWithJournal();
    }
});

// Close modal when clicking overlay
journalOverlay.addEventListener('click', closeJournalModal);

// Initialize display
updateDisplayValues();
updateHistoryDisplay();

// Refresh history display every 30 seconds
setInterval(updateHistoryDisplay, 30000);