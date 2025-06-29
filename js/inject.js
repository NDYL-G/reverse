
window.addEventListener('DOMContentLoaded', () => {
  const root = location.pathname.includes('/html/') ? '../' : './';

  // Load header
  fetch(root + 'includes/header.html')
    .then(res => res.text())
    .then(data => {
      const header = document.getElementById('header');
      if (header) header.innerHTML = data;
    });

  // Load footer
  fetch(root + 'includes/footer.html')
    .then(res => res.text())
    .then(data => {
      const footer = document.getElementById('footer');
      if (footer) {
        footer.innerHTML = data;

        // Set current year after footer is injected
        const yearSpan = document.getElementById('year');
        if (yearSpan) {
          yearSpan.textContent = new Date().getFullYear();
        }
      }
    });
});