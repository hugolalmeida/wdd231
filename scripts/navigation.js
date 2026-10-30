const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#primary-navigation');
const menuIcon = menuButton.querySelector('.menu-icon');

function setMenu(isOpen) {
  navigation.classList.toggle('is-open', isOpen);
  menuButton.setAttribute('aria-expanded', String(isOpen));
  menuButton.setAttribute('aria-label', isOpen ? 'Close navigation' : 'Open navigation');
  menuIcon.textContent = isOpen ? '×' : '☰';
}

navigation.classList.add('menu-ready');
menuButton.addEventListener('click', () => {
  setMenu(menuButton.getAttribute('aria-expanded') !== 'true');
});
navigation.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    setMenu(false);
    menuButton.focus();
  }
});
window.matchMedia('(min-width: 640px)').addEventListener('change', () => setMenu(false));
