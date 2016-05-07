var app = angular.module('library', []);

app.filter('capitalize', function() {
  return function(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };
});

app.controller("AppController", function ($scope, $http, $log) {

  $scope.inputs = {};
  $scope.dropdown = false;
  $scope.reverseSort = false;
  $scope.focus = false;
  $scope.sort = 'title';
  $scope.liveresults = {
    authors : [],
    genres : []
  };

  $scope.orderParams = [
    'title',
    'author',
    'genre',
    'year',
    'isbn',
    'views'
  ];

  $scope.initInputs = {
    'title' : {
      type : 'text',
      value : ''
    },
    'author' : {
      type : 'text',
      value : ''
    },
    'genre' : {
      type : 'text',
      value : ''
    },
    'year' : {
      type : 'number',
      value: '2016'
    },
    'ISBN' : {
      type : 'text',
      value : ''
    },
    'image' : {
      type : 'url',
      value: ''
    }
  };

  $scope.getBooks = function() {
    $http.get('books.json').success(function(data) {
      $scope.books = data;
      $scope.getLiveResults();
    });
  };

  $scope.getLiveResults = function() {
    angular.forEach($scope.books, function(book, i) {
      angular.forEach(book.author, function(author) {
        if ($scope.liveresults.authors.indexOf(author) === -1){
          $scope.liveresults.authors.push(author);
        }
      });
      $scope.liveresults.authors.sort(function(a, b) {
        return ((a < b) ? -1 : ((a > b) ? 1 : 0));
      });
      angular.forEach(book.genre, function(genre) {
        if ($scope.liveresults.genres.indexOf(genre) === -1){
          $scope.liveresults.genres.push(genre);
        }
      });
      $scope.liveresults.genres.sort(function(a, b) {
        return ((a < b) ? -1 : ((a > b) ? 1 : 0));
      });
    });
    $log.log($scope.liveresults);
  };

  $scope.newBook = function() {
    $('#popup')
      .find('form')
      .trigger('reset');

    $scope.openPopup();
  };

  $scope.openPopup = function() {
    $('#popup').openModal();
  };

  $scope.closePopup = function() {
    $('#popup')
      .find('form')
      .trigger('reset')
      .closest('#popup')
      .closeModal();
  };

  $scope.saveBook = function() {
    var isISBNExist = false,
        bookToEdit;

    angular.forEach($scope.books, function(val, key) {
        if ($scope.inputs.ISBN === $scope.books[key].ISBN) {
          isISBNExist = true;
          bookToEdit = key;
        }
    });

    if (isISBNExist) {
      angular.forEach($scope.inputs, function(val, key) {
        if (typeof val == 'string' && (key === 'author' || key === 'genre')) {
          $scope.inputs[key] = val.split(',');
        }
        $scope.books[bookToEdit][key] = $scope.inputs[key];
      });
    } else {
      $scope.inputs.author = $scope.inputs.author.split(',');
      $scope.inputs.genre = $scope.inputs.genre.split(',');
      $log.log($scope.inputs);
      $scope.books.push(angular.copy($scope.inputs));
    }

    $log.log($scope.inputs);
    $scope.closePopup();
  };

  $scope.toggleDropdown = function() {
    $scope.dropdown = !$scope.dropdown;
  };

  $scope.select = function(name) {
    $scope.sort = name;
    $scope.toggleDropdown();
  };

  $scope.editBook = function(card) {
    var index = $scope.books.indexOf(card);

    angular.forEach(card, function(val, key) {
      $scope.inputs[key] = val;
    });

    $log.log($scope.inputs);
    $scope.openPopup();
  };

  $scope.deleteBook = function(card) {
    $scope.books.splice($scope.books.indexOf(card), 1);
  };

  $scope.addItem = function(key, data) {

    var regex = new RegExp('\\b' + data + '\\b', 'gi');

    if (regex.test($scope.inputs[key])) return;

    if (!$scope.inputs[key]) {
      $scope.inputs[key] = data;
    } else {
      $scope.inputs[key] += ', ' + data;
    }
  };

  $scope.removeItem = function(key, item) {
    $scope.liveresults[key+'s'].splice($scope.liveresults[key+'s'].indexOf(item), 1);
  };

  $scope.books = $scope.getBooks();
});
