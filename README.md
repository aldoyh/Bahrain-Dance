# BAHRAIN Dancing Ballerinas

An animated 3D web experience featuring the word **BAHRAIN** brought to life with dancing letter tiles, glowing red neon effects, and particle animations.

🔴 **[Live Demo on GitHub Pages](https://aldoyh.github.io/Bahrain-Dance/)**

![BAHRAIN Dancing Ballerinas](https://github.com/user-attachments/assets/142ce6f6-bddf-4315-817c-6340d6108ea4)

## Overview

This project is a visually rich animated video built with React, Three.js, and GSAP. Each letter of "BAHRAIN" is rendered as a glowing 3D tile that animates and dances in a dark, atmospheric scene with floating particles and light effects.

## Tech Stack

- **React** + **TypeScript**
- **Three.js** / **@react-three/fiber** & **@react-three/drei** — 3D rendering
- **GSAP** — timeline-based animations
- **Framer Motion** — UI transitions
- **Tailwind CSS** — styling
- **Vite** — build tooling

## Project Structure

```
artifacts/bahrain-ballerinas/   # Main front-end app
lib/                            # Shared libraries
docs/                           # Built static files (deployed to GitHub Pages)
```

## Development

This project uses [pnpm](https://pnpm.io/) workspaces.

```bash
# Install dependencies
pnpm install

# Run dev server (requires PORT and BASE_PATH env vars)
PORT=3000 BASE_PATH=/ pnpm --filter @workspace/bahrain-ballerinas run dev

# Build for GitHub Pages (outputs to /docs)
NODE_ENV=production pnpm --filter @workspace/bahrain-ballerinas run build
```

## Deployment

The app is built into the `/docs` folder and deployed via **GitHub Pages** at:  
`https://aldoyh.github.io/Bahrain-Dance/`

The Vite build uses `/Bahrain-Dance/` as the base path to match the GitHub Pages URL structure.
