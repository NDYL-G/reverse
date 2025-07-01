// js/header-footer-loader.js

async function loadInclude(id, file, callback) {
  const el = document.getElementById(id);
  if (!el) return;
  try {
    const res = await fetch(file);
    const html = await res.text();
    el.innerHTML = html;
    if (callback) callback(); // Run any follow-up logic
  } catch (err) {
    el.innerHTML = `<p style="color: red;">Failed to load ${file}</p>`;
    console.error(`Failed to load ${file}:`, err);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const prefix = window.location.pathname.includes('/html/') ? '' : 'html/';

  // Load header and then attach menu-loader.js
  loadInclude('header', `${prefix}header.html`, () => {
    const script = document.createElement('script');
    script.src = `${prefix}../js/menu-loader.js`;
    document.body.appendChild(script);
  });

  // Load footer and inject current year
  loadInclude('footer', `${prefix}footer.html`, () => {
  const yearSpan = document.getElementById('year');
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
    console.log("✅ Year inserted into footer.");
  } else {
    console.warn("⚠️ Year span not found.");
  }
});
