// js/menu-loader.js

(function populateDropdown() {
  const dropdownContainer = document.querySelector('.nav-dropdown-content');
  if (!dropdownContainer) {
    console.warn("Dropdown container not found.");
    return;
  }

  const pages = [
    { title: '🎉 Celebrations', category: 'celebrations' },
    { title: '🎬 Movies', category: 'movies' },
    { title: '🧠 Brain Teasers', category: 'brain' },
    { title: '🐾 Animals', category: 'animals' }
  ];

  pages.forEach(page => {
    const link = document.createElement('a');
    link.href = `section.html?category=${page.category}`;
    link.textContent = page.title;
    dropdownContainer.appendChild(link);
  });
})();
