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


/* Statistics management */

const totalBooks = document.querySelector('.library-header__statistics-total-books');
const readBooks = document.querySelector('.library-header__statistics-read-books');

function updateStatistics() {
  const total = library.length;
  const read = library.reduce((sum, book) => (book.isRead) ? sum + 1 : sum, 0);
  updateStatisticsDisplay(total, read);
}

function updateStatisticsDisplay(total, read) {
  switch (total) {
    case 1:
      totalBooks.textContent = 'Total: 1 book';
      break;
    default:
      totalBooks.textContent = `Total: ${total} book`;
      break;
  }

  switch (read) {
    case 1:
      readBooks.textContent = 'Read: 1 book';
      break;
    default:
      readBooks.textContent = `Read: ${read} book`;
      break;
  }
}

/* Library management */

const libraryTableBody = document.querySelector('.library-body__table>tbody');
const addBookButton = document.querySelector('.library-body__add-book-btn');
const addBookFormWrapper = document.querySelector('.add-book-form-wrapper');
const addBookForm = document.querySelector('.add-book-form');
let newBookTitle = document.querySelector('.add-book-form__book-title-input');
let newBookAuthor = document.querySelector('.add-book-form__book-author-input');
let newBookPages = document.querySelector('.add-book-form__book-pages-input');
let newBookIsRead = document.querySelector('.add-book-form__checkbox');

const library = [];
const toggleIsReadButtons = [];
const removeBookButtons = [];

addBookButton.addEventListener('click', () => {
  addBookFormWrapper.classList.remove('hidden');
});

addBookForm.addEventListener('submit', (e) => {
  e.preventDefault();

  library.push(createBook());
  updateDisplayAfterBookAddition();

  updateStatistics();
  addBookFormWrapper.classList.add('hidden');
  addBookForm.reset();
});

addBookForm.addEventListener('reset', () => {
  addBookFormWrapper.classList.add('hidden');
});

updateStatistics();

function Book(title, author, pages, isRead) {
  this.title = title;
  this.author = author;
  this.pages = pages;
  this.isRead = isRead;
}

function createBook() {
  let isRead = (newBookIsRead.checked) ? true : false;
  return new Book(newBookTitle.value, newBookAuthor.value, newBookPages.value, isRead);
}

function createBookTableRow(book) {
  const tableRow = document.createElement('tr');
  tableRow.classList.add('library-body__table-row');
  for (let bookProperty in book) {
    const tableData = createTableData(book, bookProperty);
    tableRow.append(tableData);
  }

  const removeBookTableData = createTableData(book, 'removeBookButton');
  tableRow.append(removeBookTableData);

  return tableRow;
}

function createRemoveBookButton() {
  const button = document.createElement('button');
  button.classList.add('library-body__remove-book-btn');
  button.setAttribute('type', 'button');

  const removeIcon = document.createElement('img');
  removeIcon.classList.add('library-body__remove-book-icon');
  removeIcon.setAttribute('src', './images/trash-can.svg');
  removeIcon.setAttribute('alt', 'Remove the book');

  button.append(removeIcon);

  saveRemoveBookButton(button);

  return button;
}

function createTableData(book, bookProperty) {
  const tableData = document.createElement('td');
  tableData.classList.add('library-body__table-element');
  if (bookProperty === 'isRead') {
    const toggleIsReadButton = createToggleIsReadButton(book[bookProperty]);
    tableData.append(toggleIsReadButton);
  } else if (bookProperty === 'removeBookButton') {
    const removeBookButton = createRemoveBookButton();
    tableData.append(removeBookButton);
  } else {
    tableData.textContent = book[bookProperty];
  }

  return tableData;
}

function createToggleIsReadButton(isRead) {
  const toggleIsReadButton = document.createElement('button');

  toggleIsReadButton.classList.add('library-body__status-btn');
  toggleIsReadButton.setAttribute('type', 'button');
  toggleIsReadButton.textContent = isRead ? 'Read' : 'Not read';

  saveToggleIsReadButton(toggleIsReadButton);

  return toggleIsReadButton;
}

function saveRemoveBookButton(button) {
  button.addEventListener('click', () => {
    const bookIndex = removeBookButtons.indexOf(button);
    library.splice(bookIndex, 1);
    toggleIsReadButtons.splice(bookIndex, 1);
    removeBookButtons.splice(bookIndex, 1);
    updateDisplayAfterBookRemoval(bookIndex);
    updateStatistics();
  });
  removeBookButtons.push(button);
}

function saveToggleIsReadButton(button) {
  button.addEventListener('click', () => {
    const bookIndex = toggleIsReadButtons.indexOf(button);
    if (library[bookIndex].isRead) {
      library[bookIndex].isRead = false;
      button.textContent = 'Not read';
    } else {
      library[bookIndex].isRead = true;
      button.textContent = 'Read';
    }
    updateStatistics();
  });
  toggleIsReadButtons.push(button);
}

function updateDisplayAfterBookAddition() {
  const bookTableRow = createBookTableRow(library[library.length - 1]);
  libraryTableBody.append(bookTableRow);
}

function updateDisplayAfterBookRemoval(bookIndex) {
  const removedBookRow = libraryTableBody.children[bookIndex];
  libraryTableBody.removeChild(removedBookRow);
}