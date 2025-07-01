// js/menu-loader.js

window.addEventListener('DOMContentLoaded', () => {
  const dropdownContainer = document.querySelector('.nav-dropdown-content');
  if (!dropdownContainer) return;

  const pages = [
    { title: '🎉 Celebrations', category: 'celebrations' },
    { title: '🎬 Movies', category: 'movies' },
    { title: '🧠 Brain Teasers', category: 'brain' },
    { title: '🐾 Animals', category: 'animals' }
  ];

  // Determine relative path prefix
  const prefix = window.location.pathname.includes('/html/') ? '' : 'html/';

  pages.forEach(page => {
    const link = document.createElement('a');
    link.href = `${prefix}section.html?category=${page.category}`;
    link.textContent = page.title;
    dropdownContainer.appendChild(link);
  });
});
