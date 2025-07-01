// js/header-footer-loader.js

/**
 * Loads an external HTML file into a container element (e.g., header or footer)
 * and runs an optional callback after loading is complete.
 */
async function loadInclude(id, file, callback) {
  const el = document.getElementById(id);
  if (!el) {
    console.warn(`Element with id '${id}' not found.`);
    return;
  }

  try {
    const res = await fetch(file);
    if (!res.ok) throw new Error(`HTTP ${res.status} - ${res.statusText}`);
    const html = await res.text();
    el.innerHTML = html;
    if (callback) callback();
  } catch (err) {
    el.innerHTML = `<p style="color: red;">Failed to load ${file}</p>`;
    console.error(`Failed to load ${file}:`, err);
  }
}

/**
 * On DOM ready, loads the header and footer from external files.
 * After loading the header, dynamically injects menu-loader.js.
 * After loading the footer, injects the current year into #year span.
 */
document.addEventListener('DOMContentLoaded', () => {
  // Determine relative path based on whether we're in /html/
  const prefix = window.location.pathname.includes('/html/') ? '' : 'html/';

  // Load header and then inject menu-loader.js
  loadInclude('header', `${prefix}header.html`, () => {
    const script = document.createElement('script');
    script.src = `${prefix}../js/menu-loader.js`;
    document.body.appendChild(script);
  });

  // Load footer and update the copyright year
  loadInclude('footer', `${prefix}footer.html`, () => {
    const yearSpan = document.getElementById('year');
    if (yearSpan) {
      const currentYear = new Date().getFullYear();
      yearSpan.textContent = currentYear;
      console.log(`✅ Footer loaded. Year set to ${currentYear}`);
    } else {
      console.warn("⚠️ No element with id='year' found in footer.");
    }
  });
});
