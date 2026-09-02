(() => {
  const root = document.documentElement;
  const themeButtons = document.querySelectorAll('.theme-toggle');
  const storedTheme = localStorage.getItem('aiueo-theme');
  const initialDark = storedTheme === 'dark' || (!storedTheme && matchMedia('(prefers-color-scheme: dark)').matches);

  function applyTheme(dark) {
    root.classList.toggle('dark-theme', dark);
    root.style.colorScheme = dark ? 'dark' : 'light';
    themeButtons.forEach((button) => {
      button.setAttribute('aria-pressed', String(dark));
      button.setAttribute('aria-label', dark ? 'Switch to light mode' : 'Switch to dark mode');
    });
  }
  applyTheme(initialDark);
  themeButtons.forEach((button) => button.addEventListener('click', () => {
    const dark = !root.classList.contains('dark-theme');
    applyTheme(dark);
    localStorage.setItem('aiueo-theme', dark ? 'dark' : 'light');
  }));

})();
