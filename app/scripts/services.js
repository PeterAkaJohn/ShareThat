/*services/factory used to serve data to your webpage,
  will need to serve data for:
  -author, -stories, -comments, -rating(author and stories), -postStories, -post feedback with admins.
*/
'use strict';

angular.module('shareApp')
  .constant("baseURL", "https://localhost:3443/") //update this link for an external server
  .service('fieldService', ['$resource', 'baseURL', function($resource, baseURL) {

    this.getFields = function(){
      return $resource(baseURL + "fields/:_id", null, {
        'update': {
          method: 'PUT'
        }
      });
    };

    this.getLimitedFields = function(){
      return $resource(baseURL + "fields/limitedFields/:_id", null, {
        'update': {
          method: 'PUT'
        }
      });
    };

  }])

  .service('searchService', ['$resource', 'baseURL', function($resource, baseURL) {

    var search = {
      content: ''
    };

    this.addSearch = function(newSearch) {
      search = newSearch;
    };

    this.getSearch = function(){
      return search;
    };
    this.retriveResultOfSearch = function(){
      return $resource(baseURL + "search/:search", null, {
        'save': {
          method: 'POST',
          isArray: true
        }
      });


    };
  }])

.factory('postsFactory', ['$resource','baseURL',function($resource, baseURL) {

  var postsfac = {};

  // Implement two functions, one named getLeaders,
  // the other named getLeader(index)
  // Remember this is a factory not a service
  postsfac.getPostsAndTutorial = function() {
    return $resource(baseURL + "posts/:_id",null,{
      'update':{
        method:'PUT'
      }
    });
  };

  postsfac.getPostsAndTutorialReplies = function(_id) {
    return $resource(baseURL + "posts/"+ _id + "/replies",null,{
      'update':{
        method:'PUT'
      }
    });
  };

  postsfac.deletePostOrTutorial = function(_id) {
    return $resource(baseURL + "posts/"+ _id,null,{
      'update':{
        method:'PUT'
      }
    });
  };

  postsfac.getLatestPosts = function() {
    return $resource(baseURL + "posts/latestPosts/:_id",null,{
      'update':{
        method:'PUT'
      }
    });
  };

  postsfac.getLatestTutorials = function() {
    return $resource(baseURL + "posts/latestTutorials/:_id",null,{
      'update':{
        method:'PUT'
      }
    });
  };

  postsfac.getPosts = function(){
    return $resource(baseURL + "postQ/:_id", null, {
      'update':{
        method:'PUT'
      }
    });
  };

  postsfac.getTutorials = function(){
    return $resource(baseURL + "postT/:_id", null, {
      'update':{
        method:'PUT'
      }
    });
  };


  return postsfac;

}])

.factory('feedbackFactory',['$resource','baseURL',function($resource,baseURL){
  var feedbackfac = {};
  //var feedbackArray = $resource(baseURL+"feedback/:id",null);

  //feedbackfac.feedbackLength = function(){ return feedbackArray.query().length;};

  feedbackfac.getFeedback = function(){
    return $resource(baseURL+"feedback/:id",null);
  };

  return feedbackfac;
}])

.service('userService', ['$resource', 'baseURL', function($resource, baseURL) {

  this.getUsers = function(){
    return $resource(baseURL + "users/loggeduser", null, {
      'update': {
        method: 'PUT'
      }
    });
  };

}])

.factory('$localStorage', ['$window', function($window) {
  return {
    store: function(key, value) {
      $window.localStorage[key] = value;
    },
    get: function(key, defaultValue) {
      return $window.localStorage[key] || defaultValue;
    },
    remove: function(key) {
      $window.localStorage.removeItem(key);
    },
    storeObject: function(key, value) {
      $window.localStorage[key] = JSON.stringify(value);
    },
    getObject: function(key, defaultValue) {
      return JSON.parse($window.localStorage[key] || defaultValue);
    }
  }
}])

.factory('AuthFactory', ['$resource', '$http', '$localStorage', '$rootScope', '$window', 'baseURL', 'ngDialog', function($resource, $http, $localStorage, $rootScope, $window, baseURL, ngDialog){
  var authFac = {};
  var TOKEN_KEY = 'Token';
  var isAuthenticated = false;
  var username = '';
  var authToken = undefined;

  function loadUserCredentials(){
    var credentials = $localStorage.getObject(TOKEN_KEY, '{}');
    if (credentials.username != undefined) {
      useCredentials(credentials);
    }
  };

  function storeUserCredentials(credentials) {
    $localStorage.storeObject(TOKEN_KEY, credentials);
    useCredentials(credentials);
  };

  function useCredentials(credentials) {
    isAuthenticated = true;
    username = credentials.username;
    authToken = credentials.token;

    //set the token as header for your requests!
    $http.defaults.headers.common['x-access-token'] = authToken;
  };

  function destroyUserCredentials() {
    authToken = undefined;
    username = '';
    isAuthenticated = false;
    $http.defaults.headers.common['x-access-token'] = authToken;
    $localStorage.remove(TOKEN_KEY);
  };

  authFac.login = function(loginData) {
    $resource(baseURL + "users/login")
    .save(loginData, function(response) {
      storeUserCredentials({username: loginData.username, token: response.token});
      $rootScope.$broadcast('login:Successful');
    },
    function(response){
      isAuthenticated = false;

      var message = '\
      <div class = "ngdialog-message">\
      <div><h3>Login Unsuccessful</h3></div>' +
      '<div><p>'+ response.data.err.message + '</p><p>'
      + response.data.err.name + '</p></div>' +
      '<div class = "ngdialog-button-primary"ng-click=confirm("OK")>OK</button>\
      </div>'

      ngDialog.openConfirm({template: message, plain: 'true'});
    });
  };

  authFac.logout = function() {
    $resource(baseURL + "users/logout").get(function(response){});
    destroyUserCredentials();
  };

  authFac.register = function(registerData) {
    $resource(baseURL + "users/register")
    .save(registerData,
      function(response){
        authFac.login({username: registerData.username,
        password: registerData.password});
        if (registerData.rememberMe) {
          $localStorage.storeObject('userinfo',
            {username: registerData.username,
            password: registerData.password});
        }

        $rootScope.$broadcast('registration:Successful');
      },
      function(response){
        var message = '\
        <div class = "ngdialog-message">\
        <div><h3>Registration Unsuccessful</h3></div>' +
        '<div><p>'+ response.data.err.message + '</p><p>'
        + response.data.err.name + '</p></div>' +
        '<div class = "ngdialog-button-primary"ng-click=confirm("OK")>OK</button>\
        </div>';
        ngDialog.openConfirm({template: message, plain: 'true'});
      });
  };

  authFac.isAuthenticated = function() {
    return isAuthenticated;
  };

  authFac.getUsername = function() {
    return username;
  };

  loadUserCredentials();

  return authFac;


}])

;
