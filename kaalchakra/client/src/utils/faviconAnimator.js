// client/src/utils/faviconAnimator.js
const frames = [
  'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="44" fill="none" stroke="#FFD700" strokeWidth="2.5"/><circle cx="50" cy="50" r="3" fill="#FFD700"/></svg>',
  'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="44" fill="none" stroke="#F5A623" strokeWidth="2.5"/><circle cx="50" cy="50" r="6" fill="#F5A623"/></svg>',
  'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="44" fill="none" stroke="#FFD700" strokeWidth="2.5"/><circle cx="50" cy="50" r="9" fill="#FFD700"/></svg>',
  'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="44" fill="none" stroke="#FF8C00" strokeWidth="2.5"/><circle cx="50" cy="50" r="12" fill="#FF8C00"/></svg>',
];

let frameIndex = 0;

export const startFaviconAnimation = () => {
  setInterval(() => {
    const link = document.querySelector("link[rel*='icon']") || document.createElement('link');
    link.type = 'image/x-icon';
    link.rel = 'shortcut icon';
    link.href = frames[frameIndex % frames.length];
    document.head.appendChild(link);
    frameIndex++;
  }, 200);
};