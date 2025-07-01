// js/menu-loader.js
// this script is called via header-footer-loader.js 

window.addEventListener('DOMContentLoaded', () => {
  const dropdownContainer = document.querySelector('.nav-dropdown-content');
  if (!dropdownContainer) return;

  const pages = [
    { title: '🎉 Celebrations', category: 'celebrations' },
    { title: '🎬 Movies', category: 'movies' },
    { title: '🧠 Brain Teasers', category: 'brain' },
    { title: '🐾 Animals', category: 'animals' }
    // Add more categories here
  ];

  pages.forEach(page => {
    const link = document.createElement('a');
    link.href = `section.html?category=${page.category}`;
    link.textContent = page.title;
    dropdownContainer.appendChild(link);
  });
});
