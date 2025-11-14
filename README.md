# 🌻 Bloom - Interactive Mood Tracker

An interactive mood tracking application that visualizes your emotional state as a growing flower. Built with p5.js and modern web technologies.

## 🎨 Features

- **Interactive Flower Visualization**: Your mood is represented as a flower that responds in real-time
  - Motivation affects height, bloom size, and sun brightness
  - Focus influences stem steadiness and leaf size  
  - Stress controls flower droop, color saturation, and facial expression
- **Weather Effects**: 
  - Rain appears during high stress (>70)
  - Floating petals when motivation is high (>80)
- **Journal Integration**: Add notes about what's affecting your mood
- **Mood Timeline**: Visual history of past moods with hover tooltips
- **Data Persistence**: All mood logs saved in browser localStorage
- **Responsive Design**: Works on desktop, tablet, and mobile devices

## 🚀 Quick Start

### Option 1: GitHub Pages (Recommended)

1. Fork or download this repository
2. Upload all files to a new GitHub repository
3. Go to Settings → Pages
4. Set Source to "Deploy from a branch"
5. Select "main" branch and "/ (root)" folder
6. Click Save
7. Your site will be available at `https://[your-username].github.io/[repository-name]`

### Option 2: Local Development

1. Clone the repository:
```bash
git clone https://github.com/[your-username]/bloom-mood-tracker.git
cd bloom-mood-tracker
```

2. Open `index.html` in a web browser, or use a local server:
```bash
# Python 3
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000

# Node.js (if http-server is installed)
http-server
```

3. Navigate to `http://localhost:8000`

## 📁 Project Structure

```
bloom-mood-tracker/
│
├── index.html          # Main HTML file
├── styles.css          # CSS styling
├── sketch.js           # p5.js flower visualization
├── app.js             # UI integration and localStorage
└── README.md          # This file
```

## 🎮 How to Use

1. **Adjust Sliders**: 
   - **Motivation** (☀️): Controls flower height, bloom size, and sun brightness
   - **Focus** (🎯): Affects stem steadiness and overall plant stability
   - **Stress** (💨): Changes flower color, droop, and triggers weather effects

2. **Log Your Mood**: 
   - Click "📊 Log Mood" to open the journal
   - Add optional notes about what's affecting your mood
   - Press Save or use Ctrl/Cmd+Enter

3. **View History**: 
   - Hover over the timeline at the bottom of the canvas to see past moods
   - Recent logs are displayed in the sidebar

4. **Clear Logs**: 
   - Click "🔄 Clear Log" to reset all mood history

## 🛠️ Customization

### Modify Visual Effects

Edit `sketch.js` to customize:
- Weather trigger thresholds
- Color schemes
- Animation speeds
- Flower shapes and sizes

### Change UI Theme

Edit `styles.css` to modify:
- Color gradients
- Font styles
- Layout arrangements
- Animation effects

### Add Features

Some ideas for enhancement:
- Export mood data as CSV
- Add more weather effects
- Implement mood predictions
- Create shareable mood reports
- Add sound effects or music

## 📱 Mobile Support

The application is fully responsive and works on:
- Desktop browsers (Chrome, Firefox, Safari, Edge)
- Tablets (iPad, Android tablets)
- Mobile phones (iOS, Android)

## 🔧 Technical Details

- **Frontend Framework**: Vanilla JavaScript with p5.js for visualization
- **Data Storage**: Browser localStorage for persistence
- **Styling**: Modern CSS with gradients and glass-morphism effects
- **Animation**: CSS transitions and p5.js draw loop

## 📊 Data Privacy

All mood data is stored locally in your browser's localStorage. No data is sent to external servers. Your mood history remains completely private and under your control.

## 🐛 Troubleshooting

**Issue**: Flower doesn't appear
- **Solution**: Make sure JavaScript is enabled in your browser

**Issue**: Sliders not syncing with flower
- **Solution**: Refresh the page and check browser console for errors

**Issue**: Lost mood history
- **Solution**: Data is stored per-browser; check you're using the same browser

## 📄 License

This project is open source and available under the MIT License.

## 🤝 Contributing

Contributions are welcome! Feel free to:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 🙏 Credits

- p5.js library for creative coding
- Emoji icons for visual elements
- Inspired by wellness and mental health tracking apps

## 📧 Contact

For questions or suggestions, please open an issue on GitHub.

---

Made with 💜 for better mental health awareness and tracking