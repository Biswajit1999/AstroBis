# AstroBis Educational Platform

An interactive astronomy and astrophysics educational website built with Astro, React, Three.js, and astronomy APIs.

## Features

- 🌌 **3D Celestial Visualizations** - Interactive 3D renders of planets, galaxies, and cosmic phenomena using Three.js
- 🚀 **React Components** - Dynamic, interactive UI elements for data exploration
- 🔭 **Astronomical Data Integration** - Real-time data from NASA APIs and public astronomical databases
- 📚 **Educational Content** - Comprehensive guides on astrophysics, planetary science, and cosmology
- 📱 **Responsive Design** - Beautiful, mobile-friendly interface with Tailwind CSS
- 🎨 **Modern Architecture** - Fast, optimized static site generation with Astro

## Tech Stack

- **Framework**: Astro 4.5+
- **UI Framework**: React 18
- **3D Graphics**: Three.js & @react-three/fiber
- **Styling**: Tailwind CSS
- **API Client**: Axios
- **Language**: JavaScript/TypeScript

## Project Structure

```
astro-astrophysics/
├── src/
│   ├── pages/              # Route pages
│   │   └── index.astro     # Home page
│   ├── components/         # React & Astro components
│   │   ├── CelestialViewer.jsx
│   │   ├── ExoplanetExplorer.jsx
│   │   └── ...
│   ├── layouts/            # Page layouts
│   │   └── Layout.astro
│   ├── lib/                # Utilities and helpers
│   │   └── astronomy-api.js
│   └── styles/             # Global styles
├── public/                 # Static assets
├── astro.config.mjs        # Astro configuration
└── package.json
```

## Getting Started

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Start development server**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

3. **Build for production**
   ```bash
   npm run build
   ```

4. **Preview production build**
   ```bash
   npm run preview
   ```

## Available Data Sources

- **NASA APIs**: Astronomy Picture of the Day, Exoplanet data
- **Astronomical Databases**: Exoplanet EU, Open Exoplanet Catalogue
- **Custom Datasets**: Stellar data, galaxy information, cosmic simulations

## Roadmap

- [ ] Interactive exoplanet explorer with orbital mechanics
- [ ] 3D solar system simulator
- [ ] Spectroscopy visualization tools
- [ ] Black hole visualization
- [ ] Stellar evolution simulator
- [ ] User-created observation logs
- [ ] API for custom astronomical calculations

## Author

Created by Biswajit Jana — astrophysics researcher and full-stack developer.

## License

MIT
