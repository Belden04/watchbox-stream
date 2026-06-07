// Inline SVG "SF" favicon — orange gradient square with white SF text.
const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#ea801e"/>
      <stop offset="60%" stop-color="#ff8a3d"/>
      <stop offset="100%" stop-color="#ffb066"/>
    </linearGradient>
  </defs>
  <rect width="64" height="64" rx="12" fill="url(#g)"/>
  <text x="50%" y="55%" text-anchor="middle" dominant-baseline="middle"
        font-family="Syne, Inter, Arial, sans-serif" font-weight="900"
        font-size="34" fill="#0a0a0a" letter-spacing="-2">SF</text>
</svg>`;
export const SF_FAVICON = `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
