(function () {
  const html = document.documentElement;

  const btn = document.getElementById('btnTheme');
  const icon = document.getElementById('themeIcon');
  const text = document.getElementById('themeText');

  if (!btn) return;

  const setTheme = (isDark) => {
    html.classList.toggle('dark', isDark);
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    if (icon) icon.textContent = isDark ? 'light_mode' : 'dark_mode';
    if (text) text.textContent = isDark ? 'Claro' : 'Oscuro';
  };

  const initTheme = () => {
    const saved = localStorage.getItem('theme'); // 'dark' | 'light' | null
    if (saved === 'dark') setTheme(true);
    else setTheme(false); // ✅ siempre claro si no has elegido nada
  };

  initTheme();

  btn.addEventListener('click', () => {
    const isDark = html.classList.contains('dark');
    setTheme(!isDark);
  });
})();

