//add angular stateProvider with nested views and such
'use strict';
/*To use nested views, use the dot notation and inside the controller of the current
page declare the module $state and use $state.transitionTo('name of the state') or
$state.includes('name of the state')
$state.go('name of the state')*/
angular.module('shareApp', ['ui.router', 'ngResource', 'textAngular', 'ngDialog'])

.config(function($locationProvider, $stateProvider, $urlRouterProvider, $provide) {
    $stateProvider

    // route for the home page
        .state('app', {
        url: '/',
        views: {
            'header': {
                templateUrl: 'views/header.html',
                controller: 'NavController'
            },
            'content': {
                templateUrl: 'views/home.html',
                controller: 'IndexController'
            },
            'footer': {
                templateUrl: 'views/footer.html',
            }
        }

    })

    .state('app.header', {
      views:{
        'intro': {
            templateUrl: 'views/introduction.html'
        },
        'registerSection': {
          templateUrl:'views/registerSection.html'
        }
      }
    })

    .state('app.home', {
        views: {
          'intro': {
              templateUrl: 'views/introduction.html'
          },
          'registerSection': {
            templateUrl:'views/registerSection.html'
          },
            'fields': {
                templateUrl: 'views/fieldshome.html'
            },
            'latestPosts': {
                templateUrl: 'views/latestPostsHome.html'
            }
        }
    })

    .state('app.home.container', {
        views: {
            'fieldCard': {
                templateUrl: 'views/fieldCard.html'
            },
            'latestQuestions': {
                templateUrl: 'views/postsTemplate.html'
            }
        }
    })

    // route for the aboutus page
    .state('app.aboutus', {
        url: 'aboutus',
        views: {
            'content@': {
                templateUrl: 'views/aboutus.html',
                controller: 'AboutController'
            }
        }
    })

    // route for the menu page
    .state('app.browse', {
        url: 'browse',
        views: {
            'content@': {
                templateUrl: 'views/browseMenu.html',
                controller: 'BrowseMenuController'
            }
        }
    })


    .state('app.browse.fields', {
        views: {
            'fieldCard': {
                templateUrl: 'views/fieldCard.html'
            }
        }
    })

    .state('app.field', {
        url: 'browse/:id',
        views: {
            'content@': {
                templateUrl: 'views/browseField.html',
                controller: 'BrowseFieldController'
            }
        }
    })

    .state('app.field.container', {
        views: {
            'posts': {
                templateUrl: 'views/postsTemplate.html'
            },
            'tutorials': {
                templateUrl: 'views/tutorialTemplate.html'
            }
        }
    })


    .state('app.post', {
        url: 'browse/posts/:id',
        views: {
            'content@': {
                templateUrl: 'views/postsDetail.html',
                controller: 'PostsController'
            }
        }
    })

    .state('app.post.textAngular', {
        views: {
            'editor': {
                templateUrl: 'views/differentEditor.html',
                controller: 'EditorController'
            }
        }
    })

    .state('app.tutorial', {
        url: 'browse/tutorials/:id',
        views: {
            'content@': {
                templateUrl: 'views/tutorialsDetail.html',
                controller: 'TutorialsController'
            }
        }
    })

    .state('app.tutorial.textAngular', {
        views: {
            'editor': {
                templateUrl: 'views/differentEditor.html',
                controller: 'EditorController'
            }
        }
    })

    .state('app.search', {
        url: 'search/',
        views: {
            'content@': {
                templateUrl: 'views/searchMenu.html',
                controller: 'SearchMenuController'
            }
        }
    })

    .state('app.search.results', {
        views: {
            'posts': {
                templateUrl: 'views/postsTemplate.html'
            }
        }
    })

    .state('app.ask', {
        url: 'ask',
        views: {
            'content@': {
                templateUrl: 'views/ask.html',
                controller: 'AskController'
            }
        }
    })

    .state('app.ask.editor', {
        views: {
            'editor': {
                templateUrl: 'views/differentEditor.html',
                controller: 'EditorController'
            }
        }
    })

    .state('app.share', {
        url: 'share',
        views: {
            'content@': {
                templateUrl: 'views/share.html',
                controller: 'ShareController'
            }
        }
    })

    .state('app.share.editor', {
        views: {
            'editor': {
                templateUrl: 'views/differentEditor.html',
                controller: 'EditorController'
            }
        }
    })

    .state('app.userPage', {
        url: 'userpage',
        views: {
            'content@': {
                templateUrl: 'views/userPage.html',
                controller: 'UserPageController'
            }
        }
    })

    .state('app.userPage.container', {
        views: {
            'postsUser': {
                templateUrl: 'views/postsTemplate.html'
            },
            'repliesUser': {
                templateUrl: 'views/repliesTemplate.html'
            }
        }
    })

    ;

    $urlRouterProvider.otherwise('/');

    $provide.decorator('taOptions', ['taRegisterTool', '$delegate', 'taSelection', function(taRegisterTool, taOptions, taSelection) {
        // $delegate is the taOptions we are decorating
        // register the tool with textAngular
        taRegisterTool('code', {
            buttontext: 'code',
            action: function(deferred, restoreSelection){
                var txt= window.getSelection();
                var sel = angular.element(taSelection.getSelectionElement());

/*                alert(txt);
                alert(sel[0].tagName);*/
                console.log(sel);

                if(sel[0].tagName == 'CODE'){
                    sel.replaceWith(sel.html());
                }
                else{
                    this.$editor().wrapSelection('formatBlock', '<code>',true);
                }
            }

        });

        // add the button to the default toolbar definition
        taOptions.toolbar[1].push('code');
        return taOptions;
    }]);

})

.run(function($rootScope) {
    $rootScope.fromHome = true;
})
