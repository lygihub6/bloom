// sketch.js - Custom Canvas-based plant drawing for Bloom Mood Tracker
// This script removes the dependency on p5.js and instead uses the
// built-in Canvas 2D API. It renders a stylised flower with leaves
// whose appearance changes based on motivation, focus and stress values.
// The design is inspired by the provided reference image (yellow flower
// with detailed petals and leaves).

(() => {
  // Mood log (kept for compatibility with app.js)
  const MAX_LOG = 120;
  window.moodLog = window.moodLog || [];

  // Canvas dimensions and constants
  const CANVAS_W = 400;
  const CANVAS_H = 500;
  const GROUND_H = 60;

  // Animation timer
  let t = 0;
  let ctx;

  /**
   * Convert an HSB colour value to an RGB object. H is in [0, 360],
   * S and B are in [0,100]. Returns an object {r, g, b} with values
   * from 0–255. Based on processing.js conversion.
   */
  function hsbToRgb(h, s, b) {
    s /= 100;
    b /= 100;
    const k = (n) => (n + h / 60) % 6;
    const f = (n) => b * (1 - s * Math.max(0, Math.min(k(n), 4 - k(n), 1)));
    const r = Math.round(255 * f(5));
    const g = Math.round(255 * f(3));
    const bb = Math.round(255 * f(1));
    return { r, g, b: bb };
  }

  /**
   * Linearly interpolate between two numbers.
   */
  function lerp(a, b, t) {
    return a + (b - a) * t;
  }

  /**
   * Interpolate between two colours represented as {r,g,b}. t in [0,1].
   */
  function lerpColor(c1, c2, t) {
    return {
      r: Math.round(lerp(c1.r, c2.r, t)),
      g: Math.round(lerp(c1.g, c2.g, t)),
      b: Math.round(lerp(c1.b, c2.b, t))
    };
  }

  /**
   * Convert a colour object {r,g,b} to CSS rgb() string.
   */
  function toCss(color, alpha = 1) {
    return `rgba(${color.r}, ${color.g}, ${color.b}, ${alpha})`;
  }

  /**
   * Draw the background sky, ground and sun. Colours are derived from
   * motivation, focus and stress values similar to the original p5 sketch.
   */
  function drawBackground(motivation, focus, stress) {
    // Compute grey mix factor
    const grayMix = stress / 100;
    // Sky hue moves from 200 (low motivation) to 55 (high motivation)
    const skyHue = lerp(200, 55, motivation / 100);
    // Base brightness decreases with stress
    const baseSkyBri = lerp(90, 40, stress / 100);
    // Cleanliness adjustments based on focus
    const cleanSat = lerp(10, 25, focus / 100);
    let cleanBri = baseSkyBri + lerp(-10, 10, focus / 100);
    cleanBri = Math.max(20, Math.min(100, cleanBri));
    const skyCol = hsbToRgb(skyHue, cleanSat, cleanBri);
    ctx.fillStyle = toCss(skyCol);
    ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

    // Draw the ground layers
    const soilCol = hsbToRgb(100, 40, 40);
    ctx.fillStyle = toCss(soilCol);
    ctx.fillRect(0, CANVAS_H - GROUND_H, CANVAS_W, GROUND_H);
    const grassCol = hsbToRgb(100, 30, 60);
    ctx.fillStyle = toCss(grassCol);
    ctx.fillRect(0, CANVAS_H - GROUND_H, CANVAS_W, 20);

    // Sun parameters
    const sx = CANVAS_W * 0.12;
    const sy = CANVAS_H * 0.18;
    const coreSize = lerp(36, 140, motivation / 100);
    let coreBri = lerp(70, 100, motivation / 100) - lerp(0, 40, stress / 100);
    coreBri = Math.max(30, Math.min(100, coreBri));
    // Glow layers
    for (let i = 10; i > 0; i--) {
      const r = coreSize * (1 + i * 0.15);
      const alpha = (i / 10) * 0.3;
      const glowCol = hsbToRgb(55, 40, coreBri);
      ctx.fillStyle = toCss(glowCol, alpha);
      ctx.beginPath();
      ctx.ellipse(sx, sy, r / 2, r / 2, 0, 0, Math.PI * 2);
      ctx.fill();
    }
    // Rays
    const rayCount = 24;
    const rayLength = lerp(10, 130, (coreSize - 36) / (140 - 36));
    const rayThickness = lerp(1, 6, (coreSize - 36) / (140 - 36));
    const rayAlpha = lerp(0.2, 0.9, (coreSize - 36) / (140 - 36));
    ctx.strokeStyle = toCss(hsbToRgb(55, 50, coreBri), rayAlpha);
    ctx.lineWidth = rayThickness;
    for (let k = 0; k < rayCount; k++) {
      const a = (2 * Math.PI / rayCount) * k;
      const x1 = sx + Math.cos(a) * (coreSize * 0.55) / 2;
      const y1 = sy + Math.sin(a) * (coreSize * 0.55) / 2;
      const x2 = sx + Math.cos(a) * ((coreSize * 0.55 + rayLength)) / 2;
      const y2 = sy + Math.sin(a) * ((coreSize * 0.55 + rayLength)) / 2;
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
    }
    // Sun core
    const coreCol = hsbToRgb(55, 40, coreBri);
    ctx.fillStyle = toCss(coreCol, 0.95);
    ctx.beginPath();
    ctx.ellipse(sx, sy, coreSize / 2, coreSize / 2, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  /**
   * Draw a leaf on the given side (1 for right, -1 for left). The
   * appearance changes with the grayMix factor (stress) and focus value.
   */
  function drawLeaf(side, leafSize, grayMix, droopDeg) {
    ctx.save();
    // Position the leaf along the stem at 60% of plant height
    ctx.translate(0, -0.6 * currentPlantHeight);
    // Rotate leaf outward and droop
    ctx.rotate(((side === 1 ? -60 : 60) + droopDeg * (side === 1 ? 1 : -1)) * Math.PI / 180);
    // Compute colours
    const baseLeaf = hsbToRgb(lerp(110, 0, grayMix), lerp(50, 0, grayMix), lerp(60, 30, grayMix));
    const highlight = hsbToRgb(lerp(110, 0, grayMix), lerp(30, 0, grayMix), lerp(80, 40, grayMix));
    const veinCol = hsbToRgb(lerp(110, 0, grayMix), lerp(40, 0, grayMix), lerp(90, 50, grayMix));
    // Outer leaf
    ctx.fillStyle = toCss(baseLeaf);
    ctx.beginPath();
    ctx.ellipse(side * 0.6 * leafSize, 0, leafSize / 2, (leafSize * 0.5) / 2, 0, 0, Math.PI * 2);
    ctx.fill();
    // Inner highlight
    ctx.fillStyle = toCss(highlight);
    ctx.beginPath();
    ctx.ellipse(side * 0.6 * leafSize * 0.96, 0, (leafSize * 0.6) / 2, (leafSize * 0.25) / 2, 0, 0, Math.PI * 2);
    ctx.fill();
    // Central vein
    ctx.strokeStyle = toCss(veinCol);
    ctx.lineWidth = Math.max(1, leafSize * 0.02);
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(side * 0.6 * leafSize, 0);
    ctx.stroke();
    // Side veins
    ctx.lineWidth = Math.max(0.5, leafSize * 0.01);
    const veinSegments = 3;
    for (let v = 1; v <= veinSegments; v++) {
      const frac = v / (veinSegments + 1);
      const x0 = side * 0.6 * leafSize * frac;
      const yOff = leafSize * 0.12;
      ctx.beginPath();
      ctx.moveTo(x0, 0);
      ctx.lineTo(x0, yOff * side);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(x0, 0);
      ctx.lineTo(x0, -yOff * side);
      ctx.stroke();
    }
    ctx.restore();
  }

  /**
   * Draw the flower bloom: petals with highlights and veins around the
   * centre. The number of petals is fixed at 5 to match the reference
   * image. Colours are interpolated with grayMix to desaturate when
   * stress is high.
   */
  function drawBloom(bloomSize, grayMix) {
    ctx.save();
    // Move to the top of the stem
    ctx.translate(0, -currentPlantHeight);
    // Colour definitions
    const petalBase = hsbToRgb(lerp(50, 0, grayMix), lerp(90, 0, grayMix), lerp(95, 40, grayMix));
    const highlightCol = hsbToRgb(lerp(50, 0, grayMix), lerp(40, 0, grayMix), lerp(100, 50, grayMix));
    const veinCol = hsbToRgb(lerp(45, 0, grayMix), lerp(80, 0, grayMix), lerp(70, 40, grayMix));
    const petalCount = 5;
    // Draw petals
    for (let p = 0; p < petalCount; p++) {
      ctx.save();
      const angle = (2 * Math.PI / petalCount) * p + Math.sin(t * 2) * 0.05;
      ctx.rotate(angle);
      // Petal shape
      ctx.fillStyle = toCss(petalBase);
      ctx.beginPath();
      ctx.ellipse(bloomSize * 0.6, 0, (bloomSize * 1.2) / 2, (bloomSize * 0.8) / 2, 0, 0, Math.PI * 2);
      ctx.fill();
      // Highlight
      ctx.fillStyle = toCss(highlightCol);
      ctx.beginPath();
      ctx.ellipse(bloomSize * 0.6 * 1.02, 0, (bloomSize * 0.7) / 2, (bloomSize * 0.4) / 2, 0, 0, Math.PI * 2);
      ctx.fill();
      // Central vein
      ctx.strokeStyle = toCss(veinCol);
      ctx.lineWidth = Math.max(1, bloomSize * 0.02);
      ctx.beginPath();
      ctx.moveTo(bloomSize * 0.2, 0);
      ctx.lineTo(bloomSize * 1.0, 0);
      ctx.stroke();
      ctx.restore();
    }
    // Draw centre disk
    const faceSize = bloomSize * 0.7;
    const centerCol = hsbToRgb(lerp(50, 0, grayMix), lerp(70, 0, grayMix), lerp(90, 35, grayMix));
    ctx.fillStyle = toCss(centerCol);
    ctx.strokeStyle = toCss(centerCol);
    ctx.lineWidth = Math.max(1, bloomSize * 0.08);
    ctx.beginPath();
    ctx.ellipse(0, 0, faceSize / 2, faceSize / 2, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    // Face features
    drawFace(faceSize, currentStress);
    ctx.restore();
  }

  /**
   * Draw the face (eyes and mouth) based on stress level.
   */
  function drawFace(faceSize, stress) {
    const featureStroke = Math.max(1, faceSize * 0.06);
    const baseColVal = 20 + (stress / 100) * 40;
    const featureColour = { r: Math.round(baseColVal * 2.55), g: Math.round(baseColVal * 2.55), b: Math.round(baseColVal * 2.55) };
    ctx.strokeStyle = toCss(featureColour);
    ctx.lineWidth = featureStroke;
    ctx.fillStyle = toCss(featureColour, 0.7);
    const eyeY = -faceSize * 0.15;
    const eyeX = faceSize * 0.2;
    ctx.beginPath();
    if (stress <= 30) {
      // happy: arcs for eyes and smiling mouth
      ctx.arc(-eyeX, eyeY, faceSize * 0.075, 0, Math.PI, false);
      ctx.arc(eyeX, eyeY, faceSize * 0.075, 0, Math.PI, false);
      ctx.arc(0, faceSize * 0.05, faceSize * 0.15, 0, Math.PI, false);
      ctx.stroke();
    } else if (stress <= 60) {
      // neutral: flat eyes and mouth
      ctx.moveTo(-faceSize * 0.25, -faceSize * 0.15);
      ctx.lineTo(-faceSize * 0.1, -faceSize * 0.15);
      ctx.moveTo(faceSize * 0.1, -faceSize * 0.15);
      ctx.lineTo(faceSize * 0.25, -faceSize * 0.15);
      ctx.moveTo(-faceSize * 0.15, faceSize * 0.08);
      ctx.lineTo(faceSize * 0.15, faceSize * 0.08);
      ctx.stroke();
    } else {
      // crying: sad eyes, frown and tears
      ctx.arc(-eyeX, eyeY, faceSize * 0.075, Math.PI, Math.PI * 2, false);
      ctx.arc(eyeX, eyeY, faceSize * 0.075, Math.PI, Math.PI * 2, false);
      ctx.arc(0, faceSize * 0.10, faceSize * 0.17, Math.PI, Math.PI * 2, false);
      ctx.stroke();
      // tears as filled ellipses
      const tearColour = hsbToRgb(210, 20, 90);
      ctx.fillStyle = toCss(tearColour, 0.7);
      ctx.beginPath();
      ctx.ellipse(-eyeX, eyeY + faceSize * 0.16, faceSize * 0.035, faceSize * 0.06, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.ellipse(eyeX, eyeY + faceSize * 0.16, faceSize * 0.035, faceSize * 0.06, 0, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // Variables to be computed per frame (made global within module scope)
  let currentPlantHeight = 0;
  let currentStress = 0;

  /**
   * Main animation loop. Reads slider values, updates parameters and
   * renders the plant scene. Uses requestAnimationFrame for smooth
   * animation.
   */
  function draw() {
    const motivationSlider = document.getElementById('motivationSlider');
    const focusSlider = document.getElementById('focusSlider');
    const stressSlider = document.getElementById('stressSlider');
    const motivation = motivationSlider ? parseInt(motivationSlider.value) : 0;
    const focus = focusSlider ? parseInt(focusSlider.value) : 0;
    const stress = stressSlider ? parseInt(stressSlider.value) : 0;
    currentStress = stress;

    // Compute motion and plant parameters
    t += 0.02;
    const plantHeight = lerp(80, 300, motivation / 100);
    const bloomSize = lerp(20, 60, motivation / 100);
    const stemThickness = lerp(4, 24, focus / 100);
    const leafSize = lerp(20, 100, focus / 100);
    const swayAmount = lerp(15, 2, focus / 100);
    const droopDeg = lerp(0, 45, stress / 100);
    const grayMix = stress / 100;
    currentPlantHeight = plantHeight;

    // Clear the canvas
    ctx.clearRect(0, 0, CANVAS_W, CANVAS_H);
    // Draw background and sun
    drawBackground(motivation, focus, stress);

    // Draw stem and plant at centre bottom
    ctx.save();
    ctx.translate(CANVAS_W / 2, CANVAS_H - GROUND_H);
    // Apply sway animation
    ctx.rotate((Math.sin(t) * swayAmount) * Math.PI / 180);
    // Draw stem
    const stemHue = lerp(110, 0, grayMix);
    const stemSat = lerp(60, 0, grayMix);
    const stemBri = lerp(60, 30, grayMix);
    const stemCol = hsbToRgb(stemHue, stemSat, stemBri);
    ctx.strokeStyle = toCss(stemCol);
    ctx.lineWidth = stemThickness;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(0, -plantHeight);
    ctx.stroke();
    // Draw leaves
    drawLeaf(1, leafSize, grayMix, droopDeg);
    drawLeaf(-1, leafSize, grayMix, droopDeg);
    // Draw bloom
    drawBloom(bloomSize, grayMix);
    ctx.restore();

    // Schedule next frame
    requestAnimationFrame(draw);
  }

  /**
   * Initialise the canvas and start the animation once the DOM is ready.
   */
  function init() {
    const container = document.getElementById('p5-container');
    if (!container) return;
    // Create and insert canvas
    const canvas = document.createElement('canvas');
    canvas.width = CANVAS_W;
    canvas.height = CANVAS_H;
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    // Clear any existing children in container
    container.innerHTML = '';
    container.appendChild(canvas);
    ctx = canvas.getContext('2d');
    // Start animation
    requestAnimationFrame(draw);
  }

  // Start once DOM content is loaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();