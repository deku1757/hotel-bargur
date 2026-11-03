# Restaurant Showcase — React + Vite

English-only responsive restaurant website. No food menu section.

## Run in VS Code on Windows
1. Extract this ZIP.
2. Open VS Code → File → Open Folder → select this project folder.
3. Open Terminal → New Terminal.
4. Run `npm install`, then `npm run dev`.
5. Open the localhost URL Vite prints (usually `http://localhost:5173`).

## Responsive food video
- `public/assets/biryani-desktop.mp4` — 16:9 video used on desktop/tablet layouts.
- `public/assets/biryani-mobile.mp4` — 9:16 video used on narrow/mobile layouts.
- Both videos are muted, looping, inline, and use metadata preload for a better loading experience.
- `public/assets/restaurant-front.png` is the poster/fallback image.

## Edit content
- `src/App.jsx` — sections, restaurant name, contact details, and links.
- `src/styles.css` — design and responsive layout.
- `index.html` — title and SEO metadata.

## Still needed
A vegetarian food video has not been supplied yet, so the vegetarian section currently uses a designed text panel rather than inventing a food clip. When you provide the vegetarian video(s), they can be added with the same desktop/mobile behavior.

Before publishing, replace `RESTAURANT NAME`, address, opening hours, phone/WhatsApp, and the Maps URL with verified details.
