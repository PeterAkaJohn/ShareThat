//add all the controllers of you website (later will be refactored for testing)
angular.module('shareApp')

.controller('IndexController', ['$scope', '$state', '$rootScope', 'fieldService', 'postsFactory', function($scope, $state, $rootScope, fieldService, postsFactory) {
    //$state.transitionTo('app.storyCards');
    $state.go('app.home.container');
    $rootScope.fromHome = true;
    $scope.fromHome = true;
    $scope.messageFields = "Loading...";
    $scope.messagePosts = "Loading...";
    $scope.messageTutorials = "Loading...";
    $scope.showTutorials = false;
    $scope.showPosts = false;
    $scope.showFields = false;
    $scope.sideToggle = true;
    $scope.toggleSide = function() {
        if ($scope.sideToggle) {
            $scope.sideToggle = false;
        } else $scope.sideToggle = true;
    }

    $scope.fields = fieldService.getLimitedFields().query(
        function(response) {
            $scope.fields = response;
            $scope.showFields = true;
        },
        function(response) {
            $scope.messageFields = "Error: " + response.status + " " + response.statusText;
        }
    );

    $scope.posts = postsFactory.getLatestPosts().query(
        function(response) {
            $scope.posts = response;
            $scope.showPosts = true;
        },
        function(response) {
            $scope.messagePosts = "Error: " + response.status + " " + response.statusText;
        }
    );

    $scope.tutorials = postsFactory.getLatestTutorials().query(
        function(response) {
            $scope.tutorials = response;
            $scope.showTutorials = true;
        },
        function(response) {
            $scope.messageTutorials = "Error: " + response.status + " " + response.statusText;
        }
    );

}])

.controller('HomeTopController', ['$scope', '$state', function($scope, $state) {
        //$state.transitionTo('app.home');
    }])
    /*.controller('storyCardsHome', ['$scope','$state', function($scope, $state){
    }])

    .controller('authorCardsHome', ['$scope','$state', function($scope, $state){
    }])*/

.controller('NavController', ['$state', '$scope', '$rootScope', 'userService', 'ngDialog','AuthFactory', function($state, $scope, $rootScope, userService, ngDialog, AuthFactory) {

  $scope.searchToggle = false;
  $scope.fromHome = $rootScope.fromHome;
  console.log($state.current.url);


  $scope.toggleSearch = function() {
      if ($scope.searchToggle) {
          $scope.searchToggle = false;
      } else $scope.searchToggle = true;

  }

  $scope.loggedIn = false;
  $scope.username = '';

  if (AuthFactory.isAuthenticated()) {
    $scope.loggedIn = true;
    $scope.username = AuthFactory.getUsername();
  }

  $scope.openLogin = function() {

  };

  $scope.logOut = function() {
    AuthFactory.logout();
    $scope.loggedIn = false;
    $scope.username = '';
  };

  $rootScope.$on('login:Successful', function() {
    $scope.loggedIn = AuthFactory.isAuthenticated();
    $scope.username = AuthFactory.getUsername();
  });

  $rootScope.$on('registration:Successful', function(){
    $scope.loggedIn = AuthFactory.isAuthenticated();
    $scope.username = AuthFactory.getUsername();
  });

}])

.controller('LoginController', ['$scope', '$rootScope', 'ngDialog', '$localStorage', 'AuthFactory', function($scope, $rootScope, ngDialog, $localStorage, AuthFactory){

  $scope.loginData = $localStorage.getObject('userinfo', '{}');

  $scope.doLogin = function() {
    if ($scope.rememberMe) {
      $localStorage.storeObject('userinfo', $scope.loginData);
    }
    AuthFactory.login($scope.loginData);

    $('#loginModal').modal('hide');
  };

  $scope.openRegister = function() {

  };


}])

.controller('RegisterController', ['$scope', 'ngDialog', '$localStorage', 'AuthFactory', function($scope, ngDialog, $localStorage, AuthFactory){

  $scope.registration = {};
  $scope.loginData = {};

  $scope.doRegister = function() {
    console.log('Doing registration', $scope.registration);

    AuthFactory.register($scope.registration);

    $('#registerModal').modal('hide');

  };


}])

.controller('SearchController', ['$state', '$scope', 'searchService', function($state, $scope, searchService) {

  $scope.newSearch = "";

  $scope.submitSearch = function(){
    $scope.search = {
      content: $scope.newSearch
    };
    console.log($scope.search);
    searchService.addSearch($scope.search);

    $state.go('app.search.results', {}, {reload:true});


  };


}])

.controller('SearchMenuController', ['$state', '$rootScope', '$scope', 'searchService', 'postsFactory', function($state, $rootScope, $scope, searchService, postsFactory) {
  $scope.newSearch = searchService.getSearch();
$rootScope.fromHome = false;
  /*$scope.posts = searchService.retriveResultOfSearch().query(
    function(response) {
      $scope.posts = response;
    },
    function(response) {
      console.log(response.status+" "+response.statusText);
    }
  );*/

  $scope.posts = searchService.retriveResultOfSearch().save($scope.newSearch);

}])

.controller('AboutController', ['$state', '$rootScope', '$scope', 'feedbackFactory', function($state, $rootScope, $scope, feedbackFactory) {
  $rootScope.fromHome = false;
}])

.controller('BrowseMenuController', ['$scope', '$rootScope', '$state', 'fieldService', function($scope, $rootScope, $state, fieldService) {
    $state.go('app.browse.fields');
    $rootScope.fromHome = false;
    $scope.showFields = false;
    $scope.messageFields = "Loading..."
    $scope.fields = fieldService.getFields().query(
        function(response) {
            $scope.fields = response;
            $scope.showFields = true;
        },
        function(response) {
            $scope.messageFields = "Error: " + response.status + " " + response.statusText;
        }
    );

}])

.controller('BrowseFieldController', ['$scope', '$rootScope', '$stateParams', '$state', 'fieldService', function($scope, $rootScope, $stateParams, $state, fieldService) {
    $state.go('app.field.container');
    $scope.fromHome = false;
    $rootScope.fromHome = false;
    //$state.go('app.field.tutorials');
    $scope.showRealField = false;
    $scope.messageField = "Loading...";

    $scope.switched = true;
    $scope.switchTabs = function() {
        if ($scope.switched) {
            $scope.switched = false;
        } else $scope.switched = true;
    };

    $scope.field = fieldService.getFields().get({
        _id: $stateParams.id
    }).$promise.then(
        function(response) {
            $scope.field = response;

            $scope.showRealField = true;
        },
        function(response) {
            $scope.messageField = "Error: " + response.status + " " + response.statusText;
        }
    );

}])

.controller('PostsController', ['$scope', '$rootScope', '$stateParams', '$state', 'postsFactory', 'AuthFactory', function($scope, $rootScope, $stateParams, $state, postsFactory, AuthFactory) {

    $state.go('app.post.textAngular');
    $scope.messagePost = "Loading...";
    $scope.showRealPost = false;
    $scope.sameUser = false;
    $rootScope.fromHome = false;

    $scope.post = postsFactory.getPostsAndTutorial().get({
        _id: $stateParams.id
    }).$promise.then(
        function(response) {
            $scope.post = response;
            $scope.showRealPost = true;
            if ($scope.post.user.username == AuthFactory.getUsername()) {
              $scope.sameUser = true;
            }
        },
        function(response) {
            $scope.messagePost = "Error: " + response.status + " " + response.statusText;
        }
    );

    $scope.deletePost = function(){
      postsFactory.deletePostOrTutorial($scope.post._id).remove();
    };


}])

.controller('CommentController', ['$scope', '$stateParams', '$state', 'postsFactory','AuthFactory', function($scope, $stateParams, $state, postsFactory, AuthFactory) {
    $scope.textAngular = "<h2>New Comment...</h2>";

    // i have to use .save()
    $scope.submitComment = function() {
      $scope.date = new Date().toISOString();
        $scope.comment = {
            content: $scope.textAngular,
            username: AuthFactory.getUsername(),
            date: $scope.date
        };
        $scope.post.replies.push($scope.comment);
        postsFactory.getPostsAndTutorialReplies($scope.post._id).save($scope.comment);
        console.log($scope.comment);
    }

}])

.controller('TutorialsController', ['$scope', '$rootScope', '$stateParams', '$state', 'postsFactory', 'AuthFactory', function($scope, $rootScope, $stateParams, $state, postsFactory, AuthFactory) {
    $state.go('app.tutorial.textAngular');

    $scope.messagePost = "Loading...";
    $scope.showRealPost = false;
    $scope.sameUser = false;
    $rootScope.fromHome = false;
    $scope.post = postsFactory.getPostsAndTutorial().get({
        _id: $stateParams.id
    }).$promise.then(
        function(response) {
            $scope.post = response;
            $scope.showRealPost = true;
            if ($scope.post.user.username == AuthFactory.getUsername()) {
              $scope.sameUser = true;
            }
        },
        function(response) {
            $scope.messagePost = "Error: " + response.status + " " + response.statusText;
        }
    );

    $scope.deletePost = function(){
      postsFactory.deletePostOrTutorial($scope.post._id).remove();
    };

}])

.controller('EditorController', ['$scope', '$state', function($scope, $state) {

    $scope.editorToggle = true;
    $scope.toggleEditor = function() {
        if ($scope.editorToggle) {
            $scope.editorToggle = false;
        } else $scope.editorToggle = true;

    }
}])

.controller('QuestionController', ['$scope', '$rootScope','$state', 'postsFactory', 'fieldService', function($scope, $rootScope, $state, postsFactory, fieldService) {
    $scope.textAngular = "<h2>New Stuff...</h2>";
    $scope.showFields = false;
    $rootScope.fromHome = false;
    $scope.messageFields = "Loading...";
    $scope.author = "TestUser";
    $scope.fields = fieldService.getFields().query(
        function(response) {
            $scope.fields = response;
            $scope.showFields = true;
        },
        function(response) {
            $scope.messageFields = "Error: " + response.status + " " + response.statusText;
        }
    );
    $scope.selectedField;

    $scope.submitQuestion = function() {
        $scope.question = {
            title: $scope.title,
            content: $scope.textAngular,
            field: $scope.selectedField.name,
            typeOfPost: 'Q'
        };
        postsFactory.getPostsAndTutorial().save($scope.question);
        console.log($scope.question);
    }

}])

.controller('NewTutorialController', ['$scope', '$rootScope','$state', 'postsFactory', 'fieldService', function($scope, $rootScope, $state, postsFactory, fieldService) {
    $scope.textAngular = "<h2>New Stuff...</h2>";
    $scope.title;
    $rootScope.fromHome = false;
    $scope.showFields = false;
    $scope.messageFields = "Loading...";
    $scope.author = "TestUser";
    $scope.fields = fieldService.getFields().query(
        function(response) {
            $scope.fields = response;
            $scope.showFields = true;
        },
        function(response) {
            $scope.messageFields = "Error: " + response.status + " " + response.statusText;
        }
    );
    $scope.selectedField;

    $scope.submitTutorial = function() {
        $scope.tutorial = {
            title: $scope.title,
            content: $scope.textAngular,
            field: $scope.selectedField.name,
            typeOfPost: 'T'
        };
        postsFactory.getPostsAndTutorial().save($scope.tutorial);
        console.log($scope.tutorial);
    }

}])

.controller('AskController', ['$scope', '$state', function($scope, $state) {
    $state.go('app.ask.editor');
    //$state.transitionTo('app.authors.cards');
}])

.controller('ShareController', ['$scope', '$state', function($scope, $state) {
    $state.go('app.share.editor');
    //$state.transitionTo('app.authors.cards');
}])

.controller('UserPageController', ['$scope', '$rootScope','$state', 'userService', function($scope, $rootScope,$state, userService) {
  $state.go('app.userPage.container');
  $rootScope.fromHome = false;
  $scope.user = userService.getUsers().get().$promise.then(
      function(response) {
          $scope.user = response;
          console.log($scope.user);
          $scope.showUser = true;
      },
      function(response) {
          $scope.messageUser = "Error: " + response.status + " " + response.statusText;
      }
  );
}])

;
