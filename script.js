const root = document.documentElement;
const changeThemeButton = document.querySelector('.header__change-theme-btn');
const changeThemeSunIcon = document.querySelector('.header__change-theme-sun-icon');
const changeThemeMoonIcon = document.querySelector('.header__change-theme-moon-icon');

setInitialColorScheme();

changeThemeButton.addEventListener('click', () => {
  if (root.classList.contains('dark-mode')) {
    setChosenColorScheme('light');
  } else {
    setChosenColorScheme('dark');
  }
});

function getDefaultColorScheme() {
  const storedColorScheme = localStorage.getItem('colorScheme');
  if (storedColorScheme) {
    return storedColorScheme;
  }

  if (window.matchMedia) {
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    } else {
      return 'light';
    }
  }

  return 'dark';
}

function setChosenColorScheme(colorSchemeName) {
  if (colorSchemeName === 'dark') {
    root.classList.replace('light-mode', 'dark-mode');
    changeThemeSunIcon.classList.add('hidden');
    changeThemeMoonIcon.classList.remove('hidden');
  } else {
    root.classList.replace('dark-mode', 'light-mode');
    changeThemeMoonIcon.classList.add('hidden');
    changeThemeSunIcon.classList.remove('hidden');
  }

  localStorage.setItem('colorScheme', `${colorSchemeName}`);
}

function setInitialColorScheme() {
  const colorSchemeName = getDefaultColorScheme();
  if (colorSchemeName === 'dark') {
    root.classList.add('dark-mode');
    changeThemeMoonIcon.classList.remove('hidden');
  } else {
    root.classList.add('light-mode');
    changeThemeSunIcon.classList.remove('hidden');
  }

  localStorage.setItem('colorScheme', colorSchemeName);
}