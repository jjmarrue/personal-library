const title = document.getElementById('book-title');
const pubYear = document.getElementById('pub-year');
const author = document.getElementById('book-author');
const pages = document.getElementById('book-pages');
const readCheckbox = document.getElementById('read');
const genre = document.getElementById('book-genre');
const selectedGenre = getSelectedText(genre);
const errors = document.querySelectorAll('.error');


let library = [
  {
    'title': 'Sea of Tranquility',
    'pubYear': '1958',
    'author': 'Emily St. John Mandel',
    'pages': '272',
    'readVal' : false,
    'genre': 'Romance',
  },
  {
    'title': 'Valor forrajero de la flora nativa de La Pampa',
    'pubYear': '2021',
    'author': 'Rabotnikof, Celia Mónica',
    'pages': '177',
    'readVal' : true,
    'genre': 'Science',
  },
];

function Book (title, pubYear, author, pages, readVal, genre) {
  this.title = title,
  this.pubYear = pubYear,
  this.author = author,
  this.pages = pages,
  this.readVal = readVal,
  this.genre = genre
}
const parsedArr = retrieveFromLocalStorage();
// Load on page load

window.addEventListener('load', () => {
  const filterForm = document.getElementById('filter');
  displayBooks(parsedArr);
  filterByReadStatus();
  document.querySelector('#add-book').addEventListener('click', addBookToLibrary);
  title.addEventListener('change', clearErrorMessages);
  pubYear.addEventListener('change', clearErrorMessages);
  author.addEventListener('change', clearErrorMessages);
  pages.addEventListener('change', clearErrorMessages);
  genre.addEventListener('change', clearErrorMessages);
  filterForm.reset();
});


function addArrToLocalStorage() {
  // Convert array to JSON string and save to localStorage
  const jsonArr = JSON.stringify(parsedArr);
  localStorage.setItem('parsedArr', jsonArr);
}

function retrieveFromLocalStorage() {
  // Get the string from localStorage and convert to valid object
  let str = '';
  if (localStorage.getItem('parsedArr') === null) {
    return library;
  } else {
    str = localStorage.getItem('parsedArr');
    console.log(JSON.parse(str));
    return JSON.parse(str);
  }
}

function clearErrorMessages() {
  errors.forEach(error => {
    error.innerHTML = '';
  });
}

function getSelectedText(el) {
  if (el.selectedIndex == "") {
    return 'none';
  }
  return el.options[el.selectedIndex].text;
}

function addBookToLibrary(e) {
  const form = document.getElementById('submission-form'); 
  if (!title.checkValidity()) {
    document.getElementById("title-error").innerHTML = 'Please enter a book title.';
    return;
  } else if (!pubYear.checkValidity()) {
    document.getElementById("pub-error").innerHTML = 'Please enter a number between 1 and 2022.';
  } else if (!author.checkValidity()) {
    document.getElementById("author-error").innerHTML = 'Please enter the author of the book.';
  } else if (!pages.checkValidity()) {
    document.getElementById("pages-error").innerHTML = 'Please enter a valid number of pages.';
  } else if (!genre.checkValidity()) {
    document.getElementById("genre-error").innerHTML = 'Please specify a valid genre.';
  }
  else {
    // create new object and add to library-storage
    let currentBook = new Book(title.value, pubYear.value, author.value, pages.value, readCheckbox.checked, selectedGenre);
    parsedArr.push(currentBook);
    displayBooks(parsedArr);
    form.reset();
  }
}

function displayBooks(bookArray) {
  const bookCatalog = document.querySelector('.book-catalog');
  let listOfBooks = '';  
  for (book of bookArray) {
    listOfBooks += 
      '<div class="catalogItem" draggable="true">' +
            '<h3 class="title">' + book.title + '</h3>' +
          '<div class="details">' +
            '<p class="book_info">' + '<span class="author">' + book.author + '</span>' + ' - ' + book.pubYear + ', ' + book.pages +' pages, ' +  '<span class="genre">' + book.genre + '</span>' + '</p>' +
            '<div>' + 
            '<p>I\'ve read it</p>' +
              '<label class="switch">' +
                '<input type="checkbox" class="readStatus">' +
                  '<div class="slider round">' +                
                    '<span class="vals">' + '</span>' +
                  '</div>' +
              '</label>' +
            '</div>' +           
          '</div>' +       
          '<button class="delBtn">' + "Remove" + '</button>' +
      '</div>';
    }
    bookCatalog.innerHTML = listOfBooks;
    addArrToLocalStorage();

  // Load the functions that allows us to manage the book read values and to delete books

  changeReadStatus();
  deleteBook();
}

function changeReadStatus() {
  // For each read status checkbox, determine if it's checked, assign that value to object property
  let readStatusSwitches = document.querySelectorAll(".readStatus");
  readStatusSwitches.forEach(currentStatus => {
    let selectedBook = currentStatus.closest('.catalogItem');
    let bookTitle = selectedBook.querySelector('.title').innerHTML;   
    let index = parsedArr.findIndex(book => book.title == bookTitle);
    currentStatus.checked = parsedArr[index]['readVal'];
    currentStatus.addEventListener('click', function(e) {         
      parsedArr[index].readVal = currentStatus.checked;   
      addArrToLocalStorage();
    });   
  }); 
} 

function deleteBook(){
  const deleteBtns = document.querySelectorAll('.delBtn');
  deleteBtns.forEach(btn => {
    btn.onclick = function(e) {    
      let selectedBook = this.closest('.catalogItem');
      let bookTitle = selectedBook.querySelector('.title').innerHTML;
      // use the title to find the book in the array
      let index = parsedArr.findIndex(book => book.title == bookTitle);
      parsedArr.splice(index,1);     
      displayBooks(parsedArr);
    }
  });
}

function filterByReadStatus() {
  const filterBooks = document.getElementById('book-filter');
  filterBooks.addEventListener('change', () => {
  let filterVal = '';
  if (filterBooks.value == 'read') {
    filterVal = true;
  } else if (filterBooks.value == 'unread') {
    filterVal = false;
  } else {
    displayBooks(parsedArr);
    return;
  }
  let filtered = parsedArr.filter(book => book.readVal == filterVal);
  displayBooks(filtered);
});
}