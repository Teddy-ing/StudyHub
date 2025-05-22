import { login, logout, isLoggedIn } from '/js/auth.js';

window.addEventListener('DOMContentLoaded', () => {
  const btn = document.getElementById('authBtn');      // same ID on every page

  function paint() {
    btn.textContent = isLoggedIn() ? 'Log out' : 'Log in';
  }

  btn.onclick = () => {
    isLoggedIn() ? logout() : login();
  };

  paint();
});