const root = document.documentElement;
const changeThemeButton = document.querySelector('.header__change-theme-btn');
const changeThemeSunIcon = document.querySelector('.header__change-theme-sun-icon');
const changeThemeMoonIcon = document.querySelector('.header__change-theme-moon-icon');

/* Color scheme management */

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


/* Library management */

const addBookButton = document.querySelector('.library-body__add-book-btn');
const addBookForm = document.querySelector('.add-book-form');
const addBookFormWrapper = document.querySelector('.add-book-form-wrapper');
const newBookTitle = document.querySelector('.add-book-form__input[name="book-title"]');
const newBookAuthor = document.querySelector('.add-book-form__input[name="book-author"]');
const newBookPages = document.querySelector('.add-book-form__input[name="book-pages"]');
const newBookIsRead = document.querySelector('.add-book-form__checkbox[name="book-is-read"]');

const libraryTableBody = document.querySelector('.library-body__table>tbody');
const library = [];

addBookButton.addEventListener('click', () => {
  addBookFormWrapper.classList.remove('hidden');
});

addBookForm.addEventListener('submit', (e) => {
  e.preventDefault();

  let isRead = (newBookIsRead.checked) ? true : false;
  const newBook = new Book(newBookTitle.value, newBookAuthor.value, newBookPages.value, isRead);
  addBookToLibrary(newBook);

  updateLibraryDisplay();
  addBookFormWrapper.classList.add('hidden');
  addBookForm.reset();
});

addBookForm.addEventListener('reset', () => {
  addBookFormWrapper.classList.add('hidden');
});

function Book(title, author, pages, isRead) {
  this.title = title;
  this.author = author;
  this.pages = pages;
  this.isRead = isRead;
}

function addBookToLibrary(book) {
  library.push(book);
}

function clearLibraryTableBody() {
  libraryTableBody.innerHTML = '';
}

function createRemoveBookTableElement() {
  const tableElement = document.createElement('td');
  tableElement.classList.add('library-body__remove-book-btn');

  const removeButton = document.createElement('button');
  removeButton.classList.add('library-body__remove-book-btn');
  removeButton.setAttribute('type', 'button');

  const removeIcon = document.createElement('img');
  removeIcon.classList.add('library-body__remove-book-icon');
  removeIcon.setAttribute('src', './images/trash-can.svg');
  removeIcon.setAttribute('alt', 'Remove the book');

  removeButton.append(removeIcon);
  tableElement.append(removeButton);

  return tableElement;
}

function createTableElement(book, bookParameter) {
  let element = document.createElement('td');
  element.classList.add('library-body__table-element');

  if (bookParameter === 'isRead') {
    let isReadButton = document.createElement('button');
    isReadButton.classList.add('library-body__status-btn');
    isReadButton.setAttribute('type', 'button');
    isReadButton.textContent = book[bookParameter] ? 'Read' : 'Not read';
    element.append(isReadButton);
  } else {
    element.textContent = book[bookParameter];
  }

  return element;
}

function createTableRow(book) {
  const tableRow = document.createElement('tr');
  tableRow.classList.add('library-body__table-row');

  for (let bookParameter in book) {
    tableRow.append(createTableElement(book, bookParameter));
  }
  tableRow.append(createRemoveBookTableElement());

  return tableRow;
}

function updateLibraryDisplay() {
  clearLibraryTableBody();
  library.forEach((book) => {
    libraryTableBody.append(createTableRow(book));
  });
}