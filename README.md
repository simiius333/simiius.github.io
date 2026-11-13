# SIMIIUS — iOS Liquid Glass Landing & Bio Page

Animated 3D personal landing page in Apple iOS "Liquid Glass" light aesthetic with real-time Spotify streaming powered by Three.js and Lanyard API.

## Features

- **iOS Liquid Glass & Glassmorphism Aesthetic:** Translucent frosted panels (`backdrop-filter: blur(28px)`), iridescent specular borders, and interactive cursor glare.
- **3D WebGL Background Scene:** Three.js scene featuring floating liquid glass abstract sculptures (torus knot, refraction bubbles, and chromatic shifting point lights) that react to mouse parallax and page scroll.
- **Real-Time Spotify & Discord Sync (Lanyard API):**
  - Live album cover art, song title, artist, and album.
  - Smooth animated timecode progress bar / scrubber updating at 60 FPS.
  - **Listen Along Button:** Direct link to open track in Spotify at the exact moment.
  - **Mini Player:** In-place Spotify Embed player toggle.
  - Paused / Idle state when no music is playing.
  - Live Discord avatar & presence status indicator.
- **Prioritized Hero Links:**
  - **Telegram (Primary Contact):** [t.me/simiius](https://t.me/simiius)
  - **Spotify Profile:** [open.spotify.com/user/31jiqs7ntdo2d63m67nmknh5ul6q](https://open.spotify.com/user/31jiqs7ntdo2d63m67nmknh5ul6q)
  - **Lolzteam (Zelenka):** [zelenka.guru/members/8190065/](https://zelenka.guru/members/8190065/)
  - **Steam:** [steamcommunity.com/id/simiius](https://steamcommunity.com/id/simiius)
- **Haptic Audio Chimes:** Synthesized glass click feedback via Web Audio API.

## How to Run

1. Simply double-click **`index.html`** in your browser.
2. Or serve it via any static local server:
   ```bash
   npx serve .
   ```
   or with Python:
   ```bash
   python -m http.server 3000
   ```

## Deploying Online

You can host this for free in seconds on:
- **GitHub Pages:** Create a repository, push these files, and enable GitHub Pages in Settings -> Pages.
- **Vercel / Netlify:** Drag & drop the `simiius-landing` folder into the Netlify / Vercel dashboard.
