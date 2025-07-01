async function loadInclude(id, file, callback) {
  const el = document.getElementById(id);
  if (!el) return;

  try {
    const res = await fetch(file);
    if (!res.ok) throw new Error(`Failed to fetch ${file}: ${res.status}`);
    const html = await res.text();
    el.innerHTML = html;
    if (callback) callback();
  } catch (err) {
    el.innerHTML = `<p style="color:red;">Failed to load ${file}</p>`;
    console.error(err);
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

  // Load footer and inject year
  loadInclude('footer', `${prefix}footer.html`, () => {
    const yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();
  });
});
