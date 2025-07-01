// js/menu-loader.js

window.addEventListener('DOMContentLoaded', async () => {
  const dropdownContainer = document.querySelector('.nav-dropdown-content');
  if (!dropdownContainer) return;

  const pages = [
    { title: '🎉 Celebrations', file: 'celebrations.html' },
    { title: '🎬 Movies', file: 'movies.html' },
    { title: '🐾 Animals', file: 'animals.html' },
    { title: '🧠 Brain Teasers', file: 'brain.html' }
    // Add more as needed
  ];

  pages.forEach(page => {
    const link = document.createElement('a');
    link.href = page.file;
    link.textContent = page.title;
    dropdownContainer.appendChild(link);
  });
});
