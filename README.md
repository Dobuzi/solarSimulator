# Solar Simulator

A lightweight, offline-friendly 3D solar system simulator built with Three.js. It renders planetary orbits, rotation, lighting highlights, labels, and key controls in a single static page that works on desktop and mobile.

## Features
- Realistic orbital elements (heliocentric orbits with inclination)
- Sun/planet/major moon rendering with highlights and labels
- Touch-friendly orbit, pan, and pinch-zoom camera controls
- Toggleable orbit trails and adjustable time/orbit scales
- Static assets for offline use and GitHub Pages deployment

## Project Structure
- `index.html`: App shell and UI panels
- `styles.css`: Glass UI styling and layout
- `app.js`: Rendering, physics, controls, and data
- `assets/`: Textures and images
- `vendor/`: Third-party libraries (Three.js)

## Getting Started
This is a static site. Run a local server to avoid CORS issues with textures.

```bash
# Python
python -m http.server 8080

# Node (if installed)
npx serve .
```

Then open `http://localhost:8080`.

## Live Demo
- https://dobuzi.github.io/solarSimulator/

## Controls
- Drag: orbit camera
- Right-drag / Shift-drag: pan
- Scroll or pinch: zoom
- Use the `Controls` panel to adjust time scale, orbit scale, and view presets
- Toggle `Labels` and `Orbits` from the mini bar

## Configuration Notes
- Textures live under `assets/` and are loaded at runtime; keep paths relative.
- Mobile performance is tuned via lower texture sizes and reduced geometry.
- The camera distance slider and +/- buttons are designed for touch.

## Deployment
This project is compatible with GitHub Pages as-is. Ensure all assets are committed and paths are relative.

## License
MIT License.
