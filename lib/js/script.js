window.addEventListener("load", function() {

window.app = (function(window, document) {

  'use strict';

  /**
  * Library constructor
  */

function Library() {
  this.isLocalStorageAvailable = (function(){
    try {
      var str = '__test__';

      localStorage.setItem(str,str);
      localStorage.removeItem(str);

      return true;
    }
    catch (e) {
      return false;
    }
  })();

  this.init();
}

Library.prototype.init = function() {

  if (this.getFromLocalStorage().length) return;

  var
  titles = ['Marsless','The Journey Dragoon','Beyond the Flaming Daughter',
                'Man of Window','The Nothing-Room','The North','The GuardAir',
                'World Options','Great Damnations','Mysterious Childrens'],

  authors = ["Runny Snicker", "Buttercup Buffalo", "Dinky Gross",
                "P.G. Boss", "Crusty", "Greasy Potato",
                "Lemur", "Tofu", "Lumpy Hamster", "Wacky Rhino"],

  genres = ["Comedy","Drama","Non-fiction","Realistic fiction","Romance novel",
                  "Satire","Tragedy","Tragicomedy","Horror"],

  ISBNs = ['978-5-8459-2069-0', '978-5-496-01545-5', '978-5-8459-2081-2',
               '978-5-699-79119-4', '978-5-8459-1922-9', '978-5-699-67603-3',
               '978-1-449-32339-4', '978-5-8459-1937-3', '978-5-496-01592-9',
               '978-5-496-01441-0'],

  images = ['http://static.ozone.ru/multimedia/books_covers/1011125111.jpg',
            'http://static2.ozone.ru/multimedia/books_covers/1011362787.jpg',
            'http://static2.ozone.ru/multimedia/books_covers/1014275857.jpg',
            'http://static1.ozone.ru/multimedia/books_covers/1011071764.jpg',
            'http://static2.ozone.ru/multimedia/books_covers/1008879389.jpg',
            'http://static.ozone.ru/multimedia/books_covers/1010370201.jpg',
            'http://static2.ozone.ru/multimedia/books_covers/1008879298.jpg',
            'http://static1.ozone.ru/multimedia/books_covers/1014492964.jpg',
            'http://static.ozone.ru/multimedia/books_covers/1014478210.jpg',
            'http://static2.ozone.ru/multimedia/books_covers/1014478168.jpg'];

  var book = {} ,
      books = [],
      randGenre,
      randAuthor;

  for (var i = 0; i < titles.length; i++) {

    book = {};

    book.author = [];
    book.genre = [];

    book.title = titles[i];

    for (var j = 0, r = Math.floor(Math.random() * (4-1)) + 1; j < r; j++) {

      randAuthor = Math.floor(Math.random() * authors.length);
      randGenre = Math.floor(Math.random() * genres.length);

      if (book.genre.indexOf(genres[randGenre]) === -1){
        book.genre.push(genres[randGenre]);
      }

      if (book.author.indexOf(authors[randAuthor]) === -1) {
        book.author.push(authors[randAuthor]);
      }
    }

    book.year = Math.floor(Math.random() * (2017 - 1970)) + 1970;
    book.ISBN = ISBNs.splice(Math.floor(Math.random() * ISBNs.length), 1)[0];
    book.image = images.splice(Math.floor(Math.random() * images.length), 1)[0];
    book.views = 0;

    books.push(book);
  }

  this.setLibrarySettings({
    sorting : {
      type : 'title',
      reverse : false
    }
  });
  this.liveResultInit(books);
  this.setToLocalStorage(books);
};

Library.prototype.setToLocalStorage = function (data, key) {

  if (!this.isLocalStorageAvailable) return;

  data = data || [{}];
  key = key || 'books';

  localStorage.setItem(key, JSON.stringify(data));
};

Library.prototype.getFromLocalStorage = function (key) {

  if (!this.isLocalStorageAvailable) return;

  key = key || 'books';

  var data = localStorage.getItem(key);

  return JSON.parse(data) || [];
};

Library.prototype.newBook = function (book) {

  book = book || {};

  var books = this.getFromLocalStorage();

  if (this.isBookExist(book)) {
    this.editBookData(book.ISBN, book);
    console.log('Book is already exist');
    return;
  }

  book.title = book.title || 'Unknown';
  book.author = book.author || ['Unknown'];
  book.genre = book.genre || ['Unknown'];
  book.year = book.year || 'Unknown';
  book.ISBN = book.ISBN || 'Unknown';
  book.views = book.views || '0';

  books.push(book);

  this.setToLocalStorage(books);

  return book;
};

Library.prototype.isBookExist = function (newBook, books) {

  books = books || this.getFromLocalStorage();

  if (!books || books.length === 0) return;

  if (this.getBookByISBN(newBook.ISBN, books)) {
    return true;
  }

  return false;
};

Library.prototype.getBookByISBN = function(ISBN, books) {

  var book;

  books = books || this.getFromLocalStorage();

  if (books.length === 0) return;

  for (var i = 0, j = books.length; i < j; i++) {
    if (books[i].ISBN === ISBN) {
      return {
        book : books[i],
        id   : i
      };
    }
  }

  return false;
};

Library.prototype.editBookData = function (ISBN, data) {
  var element = this.getBookByISBN(ISBN),
      book = element.book || {},
      books = this.getFromLocalStorage(),
      oldISBN = book.ISBN;

  if (!element) return;

  for (var i in book) {
    if (book.hasOwnProperty(i)) {
      for (var j in data) {
        if (data.hasOwnProperty(j) && i === j) {
          book[i] = data[j];
        }
      }
    }
  }

  if (oldISBN !== book.ISBN && this.isBookExist(book, books)) return;

  books[element.id] = book;

  this.setToLocalStorage(books);
};

Library.prototype.removeBook = function (ISBN) {
  var element = this.getBookByISBN(ISBN) || {},
      books = this.getFromLocalStorage(),
      book = element.book;

  if (!this.isBookExist(book)) return;

  books.splice(element.id,1);

  this.setToLocalStorage(books);
};

Library.prototype.sortBy = function (target, key, reverse) {

  target = target || 'books';
  reverse = reverse || false;

  key = key || 'title';

  var elements = this.getFromLocalStorage(target);
  /*
http://stackoverflow.com/questions/8837454/sort-array-of-objects-by-single-key-with-date-value
  */

  elements.sort(function(a, b) {
    var x = a[key],
        y = b[key];

    return ((x < y) ? -1 : ((x > y) ? 1 : 0));
  });

  if (reverse) elements.reverse();

  return elements;
};

Library.prototype.setLibrarySettings = function(data) {
  var settings = this.getFromLocalStorage('librarySettings');
      settings = settings.length ? settings : {};

  for (var key in data) {
    if (data.hasOwnProperty(key)) {
      settings[key] = data[key];
    }
  }

  this.setToLocalStorage(settings, 'librarySettings');
};

/* TODO input validator */

Library.prototype.validate = function (param, data) {

  var valid = false;

  switch(param) {
    case 'title':
    case 'author': if (/^[a-zа-яё0-9 \, -]+$/gi.test(data)) valid = true;
      break;
    case 'genre': if (/^[a-zа-яё \, -]+$/gi.test(data)) valid = true;
      break;
    case 'year': if (/^(\d{0,4})$/.test(data)) valid = true;
      break;
    case 'ISBN': if (/(?=.{17}$)97(?:8|9)([ -])\d{1,5}\1\d{1,7}\1\d{1,6}\1\d$/gi.test(data)) valid = true;
      break;
    case 'image': if (/(http:||https:)\/\//gi.test(data)) valid = true;
      break;
  }

   return valid;
};

Library.prototype.liveResultInit = function(books) {

  var target = ['author', 'genre'],
      output = {};

  if (!books || !books.length) return;

  for (var i = 0; i < target.length; i++) {
    output[target[i]] = [];

    for (var j = 0; j < books.length; j++) {
      for (var k = 0; k < books[j][target[i]].length; k++) {
        if (output[target[i]].indexOf(books[j][target[i]][k]) === -1) {
          output[target[i]].push(books[j][target[i]][k]);
        }
      }
    }

    output[target[i]].sort(function(a, b) {
      return ((a < b) ? -1 : ((a > b) ? 1 : 0));
    });

    this.setToLocalStorage(output[target[i]], target[i]);
  }
};

Library.prototype.liveResultRemove = function(target, name) {
  var results = this.getFromLocalStorage(name),
      index = results.indexOf(target);

  results.splice(index, 1);

  this.setToLocalStorage(results, name);
};

Library.prototype.liveResultUpdate = function(target, oldTarget, name) {
  var results = this.getFromLocalStorage(name),
      index = results.indexOf(oldTarget);

  results[index] = target;

  this.setToLocalStorage(results, name);
};

/**
* UI constructor
*/

function UI() {
  this.body = document.body;
  this.content = document.getElementById('content');

  this.isTouch = 'ontouchstart' in window && false;
  this.startEvent = this.isTouch ? 'touchstart' : 'mousedown';
  this.moveEvent = this.isTouch ? 'touchmove' : 'mousemove';
  this.endEvent = this.isTouch ? 'touchend' : 'mouseup';

  this.fucusedInput = '';
  this.oldInput = '';

  this.cssAction = [
    {
      name    : 'sort_button',
      action  : function(el, ev){ui.toggleSortList(el, ev);}
    },
    {
      name    : 'sort_reverse',
      action   : function(el, ev){ui.sortReverse(el, ev);}
    },
    {
      name    : 'sort_list',
      action  :  function(el, ev){ui.selectSortType(el, ev);}
    },
    {
      name    : 'add_book',
      action  :  function(el, ev){ui.addNewBook(el, ev);}
    },
    {
      name    : 'popup_wrapper',
      action  :  function(el, ev){/*ui.checkBeforeClosePopup(el, ev);*/}
    },
    {
      name    : 'popup',
      action  :  function(el, ev){ui.looseFocusFromInput(el, ev);}
    },
    {
      name    : 'close',
      action  :  function(el, ev){ui.checkBeforeClosePopup(el, ev);}
    },
    {
      name    : 'cancel',
      action  :  function(el, ev){ui.clearBookPopup(el, ev);}
    },
    {
      name    : 'save',
      action  :  function(el, ev){ui.saveBookData(el, ev);}
    },
    {
      name    : 'form_input',
      action  :  function(el, ev){ui.focusOnInput(el, ev);}
    },
    {
      name    : 'live_result',
      action  : function(el, ev){/*ui.selectLiveResult(el, ev);*/}
    },
    {
      name     : 'edit_list',
      action  : function(el, ev){/*ui.editLiveResult(el, ev);*/}
    },
    {
      name    : 'remove_list',
      action  : function(el, ev){/*ui.removeLiveResult(el, ev);*/}
    }
  ];

  var i = 0,
      j = 0,
      list = [];

  for (i = 0; i < this.cssAction.length; i++) {
    list = this.body.querySelectorAll('.' + this.cssAction[i].name);

    for (j = 0; j < list.length; j++) {
      list[j].addEventListener(this.endEvent, this.handler);
    }
  }

  this.createLiveResults();
  this.setSorting();
}

UI.prototype = {

  newBook : function (book) {

    var authors = '',
        genres = '',
        i = 0;

        if (typeof book.author === 'object') {
          for (i = 0; i < book.author.length; i++) {
            authors += book.author[i] + (i + 1 === book.author.length ? '' : ', ');
          }
        }

        if (typeof book.genre === 'object') {
          for (i = 0; i < book.genre.length; i++) {
            genres += book.genre[i] + (i + 1 === book.genre.length ? '' : ', ');
          }
        }

        var editFunctionString = 'app.ui.editBookData(this)',
        removeFunctionString = 'app.ui.removeBook(this)';

        var card ='<div class="card_block"><div class="image_block">' +
              '<img src="'+ book.image + '" alt="' + book.title + '"></div>' +
              '<div class="info_block">' +
              '<div class="info"><span class="info_title">title</span>' +
              '<span class="info_data">' + book.title + '</span></div>' +
              '<div class="info"><span class="info_title">author</span>' +
              '<span class="info_data">' + authors + '</span></div>' +
              '<div class="info"><span class="info_title">genre</span>' +
              '<span class="info_data">' + genres + '</span></div>' +
              '<div class="info"><span class="info_title">year</span>' +
              '<span class="info_data">' + book.year + '</span></div>' +
              '<div class="info"><span class="info_title">ISBN</span>' +
              '<span class="info_data">' + book.ISBN + '</span></div>' +
              '<div class="info"><span class="info_title">views</span>' +
              '<span class="info_data">' + book.views + '</span></div>' +
              '</div><div class="action_block"><div class="edit_block">' +
              '<button name="'+ book.ISBN +'" class="edit" on'+ this.endEvent +'="'+
              editFunctionString +'">' +
              '<i class="material-icons">mode_edit</i></button>' +
              '</div><div class="remove_block"><button name="'+ book.ISBN +
              '" class="remove" ' +
              'on'+ this.endEvent +'="'+ removeFunctionString +'">' +
              '<i class="material-icons">delete_forever</i></button>' +
              '</div></div></div>';

              this.content.innerHTML += card;

      // TODO sort again after append
  },
  createLiveResults : function() {

    var target = ['author', 'genre'],
        liveResult = '',
        liveResultField,
        results,
        functionNameInput = 'app.ui.selectLiveResult(this);',
        functionNameEdit = 'app.ui.editLiveResult(this);',
        functionNameRemove = 'app.ui.removeLiveResult(this);';

        for (var i = 0; i < target.length; i++) {

          liveResultField = this.body.querySelector('.form_input[name="'+target[i]+'"]').nextSibling;
          results = library.getFromLocalStorage(target[i]);
          liveResult = '';

          for (var j = 0; j < results.length; j++) {
            liveResult += '<li><input value="'+ results[j] +'" readonly on'+this.endEvent+'="'+functionNameInput+'" '+
                      'class="live_result"><span class="edit"><button type="button" on'+this.endEvent+'="'+
                      functionNameEdit+'"class="edit_list">'+
                      '<i class="material-icons">mode_edit</i></button>'+
                      '<button type="button" on'+this.endEvent+'="'+functionNameRemove+'" class="remove_list">'+
                      '<i class="material-icons">'+
                      'delete_forever</i></button></span></li>';
          }

          liveResultField.innerHTML += liveResult;
        }
  },
  find : function(el) {
    return this.body.querySelector('.' + el);
  },
  findAll : function(el) {
    return this.body.querySelectorAll('.' + el);
  },
  findParent : function(el, clsName, callback) {
    var parent = el.parentNode;

    if (parent.classList.contains(clsName) || parent.tagName === 'BODY'){
      if (parent.tagName === 'BODY') return;
      callback(parent);
    } else {
      this.findParent(parent, clsName, callback);
    }
  },
  booksFromStorage : function(books){
    books = books || library.getFromLocalStorage();

    this.content.innerHTML = '';

    for (var i = 0; i < books.length; i++) {
      this.newBook(books[i]);
    }
  },
  addNewBook : function(el, ev) {
    this.find('form')
      .reset();

    this.showBookPopup();
  },
  showBookPopup : function(el) {
    this.find('popup_wrapper')
      .classList.add('open');

    this.find('popup')
      .classList.add('open');
  },
  checkBeforeClosePopup : function(el, ev) {
    var wrap = this.find('popup_wrapper');

    if (ev.target === wrap || el === 'close') {
      this.closeBookPopup();
      this.removeFocusOnInputs();
    }
  },
  closeBookPopup : function(el, ev) {
    this.find('popup_wrapper')
      .classList.remove('open');

    this.find('popup')
      .classList.remove('open');

    this.bookId = '';

    this.removeFocusOnInputs();
  },
  clearBookPopup : function(el, ev) {
    this.find('form')
      .reset();

    this.removeFocusOnInputs();
    this.closeBookPopup();
  },
  removeFocusOnInputs : function(el, ev) {
    var i,
        arr = this.findAll('form_input');

    for (i = 0; i < arr.length; i++) {
      arr[i]
        .classList.remove('focus');
      arr[i]
        .classList.remove('error');
    }

    this.fucusedInput = '';
  },
  focusOnInput : function(el, ev) {
    this.removeFocusOnInputs(el);

    ev.target
      .classList.add('focus');

    this.fucusedInput = ev.target;
  },
  looseFocusFromInput : function(el, ev) {
    var popup = this.find('popup');

    if (ev.target === popup) this.removeFocusOnInputs();
  },
  selectLiveResult : function(el) {

    var regexp = new RegExp('\\b' + el.value + '\\b', 'gi');

    if (regexp.test(this.fucusedInput.value) || !this.isReadonly(el)) return;

    if (this.fucusedInput.value) {
      this.fucusedInput.value += ', ' + el.value;
    } else {
      this.fucusedInput.value = el.value;
    }
  },
  isReadonly : function(el) {
    var readonly = el.getAttribute('readonly');

    if (readonly === null || readonly === undefined) {
      return false;
    } else {
      return true;
    }
  },
  editLiveResult : function(el) {
    var input = el.parentNode.previousSibling,
        parent = input.parentNode.parentNode.previousSibling;

    if (this.isReadonly(input)) {
      this.oldInput = input.value;
      input.removeAttribute('readonly');
      input.focus();

      el.classList.add('active');
    } else {
      input.setAttribute('readonly', true);

      library.liveResultUpdate(input.value, this.oldInput, parent.name);

      this.oldInput = '';

      el.classList.remove('active');
    }
  },
  removeLiveResult : function(el) {
    var child = el.parentNode.parentNode,
        parent = child.parentNode,
        target = child.firstChild.value,
        name = parent.parentNode.firstChild.name;

    library.liveResultRemove(target, name);

    parent.removeChild(child);

    if (!parent.children.length) this.removeFocusOnInputs();
  },
  setSorting : function () {
    var settings = library.getFromLocalStorage('librarySettings'),
        sortType = settings.sorting.type,
        sortReverse = settings.sorting.reverse,
        books = library.sortBy('books', sortType, sortReverse);

    this.find('sort_variant').innerHTML = sortType;

    if (sortReverse) {
      this.find('sort_reverse')
        .classList.toggle('active');
    }

    this.booksFromStorage(books);
  },
  toggleSortList : function(el, ev) {
    this.find('sort_button')
      .classList.toggle('active');

    this.find('sort_list')
      .classList.toggle('open');
  },
  selectSortType: function(el, ev) {

    if (ev.target.nodeName !== 'LI') return;

    var key = ev.target.innerHTML,
        settings = library.getFromLocalStorage('librarySettings'),
        sortReverse = settings.sorting.reverse,
        books;

    this.find('sort_variant').innerHTML = key;

    settings.sorting.type = key;

    library.setLibrarySettings(settings);

    books = library.sortBy('books', key, sortReverse);

    this.booksFromStorage(books);
    this.toggleSortList();
  },
  sortReverse : function(el, ev) {

    var books,
        settings = library.getFromLocalStorage('librarySettings'),
        sortType = settings.sorting.type;

    settings.sorting.reverse = !settings.sorting.reverse;

    library.setLibrarySettings(settings);

    books = library.sortBy('books', sortType, settings.sorting.reverse);

    this.booksFromStorage(books);

    this.find(el)
      .classList.toggle('active');
  },
  editBookData : function(el) {
    var inputs = this.findAll('form_input'),
        inputsKeys = {},
        books = library.getFromLocalStorage(),
        id;

    if (!books.length) return;

    id = library.getBookByISBN(el.name).id;

    for (var i = 0; i < inputs.length; i++) {

      inputsKeys[inputs[i].name] = inputs[i];
      inputsKeys[inputs[i].name].value = books[id][inputs[i].name];
    }

    this.showBookPopup();
  },
  /* TODO Question popup */
  removeBook : function(el) {
    var id,
        cardBlock = el.parentNode.parentNode.parentNode;

    cardBlock
      .classList.add('hide');

    library.removeBook(el.name);
  },
  saveBookData : function(el, ev){
    var inputs = this.findAll('form_input'),
        book = {},
        value = '',
        authors = [],
        genres = [];

    for (var i = 0; i < inputs.length; i++) {

      value = inputs[i].value;

      if (!this.validateBookData(inputs[i])) return;

      if (inputs[i].name === 'author' || inputs[i].name === 'genre') {

        book[inputs[i].name] = [];

        value = value.split(',');

        for (var j = 0; j < value.length; j++) {
          value[j] = value[j].trim();
          book[inputs[i].name].push(value[j]);
        }
      }

      book[inputs[i].name] = book[inputs[i].name] || value;
    }

    library.newBook(book);
    this.setSorting();

    this.closeBookPopup();
  },
  validateBookData : function(input) {

    var valid = library.validate(input.name, input.value);

    if (!valid) {
      input
        .classList.add('error');

      return false;
    } else {
      input
        .classList.remove('error');

      return true;
    }
  },
  handler : function (e) {

    for (var i = 0; i < ui.cssAction.length; i++) {
      if (this.classList.contains(ui.cssAction[i].name)){
        ui.cssAction[i].action(ui.cssAction[i].name, e);
        break;
      }
    }
  }
};


/**
* Initial load
*/

var library = new Library();
var ui = new UI();

return {
  library : library,
  ui : ui
};

})(window, document);

// TODO Keydown -> search -> keyup -> show result

// TODO Views count

});
