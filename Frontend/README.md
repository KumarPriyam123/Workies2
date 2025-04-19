# WorkEase Dashboard

A sleek, dark-themed web dashboard with modern visual design featuring an animated particle background, glassmorphism cards, and responsive layout.

## Features

- **Animated Particle Background:** Interactive particle field that responds to mouse movement with parallax effects
- **Glassmorphism UI:** Semi-transparent cards with blurred backgrounds and subtle hover effects
- **Responsive Design:** Layout adapts to different screen sizes
- **Modern Aesthetics:** Dark theme with vibrant accent colors that maintain accessibility standards

## Technologies Used

- React
- Vite
- Tailwind CSS
- Framer Motion for animations
- tsParticles for the interactive background

## Getting Started

### Prerequisites

- Node.js (version 14.x or higher)
- npm or yarn

### Installation

1. Clone the repository
   ```
   git clone <repository-url>
   cd workease
   ```

2. Install dependencies
   ```
   npm install
   ```

3. Start the development server
   ```
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:5173`

## Build for Production

```
npm run build
```

This will generate optimized files in the `dist` directory that can be deployed to any static hosting service.

## Customization

- Colors and visual styles can be modified in `src/index.css`
- Particle animation settings can be adjusted in the `Particles` component in `src/App.jsx`
- The layout and component structure can be modified in `src/App.jsx` 