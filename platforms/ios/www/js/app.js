// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
var app = angular.module('starter', ['ionic','controladors']);

app.run(function($ionicPlatform, $window, $state) {

  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

      // Don't remove this line unless you know what you are doing. It stops the viewport
      // from snapping when text inputs are focused. Ionic handles this internally for
      // a much nicer keyboard experience.
      cordova.plugins.Keyboard.disableScroll(true);
    }

    if(window.StatusBar) {
      StatusBar.hide();
    }
  });

    if($window.localStorage['username'] != null && $window.localStorage['password']!= null){
      $state.go('app.tabs.individual');
    }
    else {
      $state.go('login');
    }


});

app.constant("variables", {
        "url": "https://sprintgame.ga/sprint/index.php",
        "token":"657a6b24e9392ea41f5b0eca995ba67c"
});


app.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider) {
  $ionicConfigProvider.tabs.position("top");
  $ionicConfigProvider.navBar.alignTitle('center');
  $ionicConfigProvider.views.maxCache(0);
  $stateProvider

    .state('login', {
      url: '/login',
      templateUrl: 'templates/login.html',
      controller: 'LoginController'
    })
    .state('app', {
      url: '/app',
      abstract: true,
      templateUrl: 'templates/menu.html',
      controller: 'MenuController'
    })
    .state('app.tabs', {
      url: '/tabs',
	  	views: {
	      'menuContent': {
	        templateUrl: 'templates/menuTabs.html',
          controller: 'TabsController'
	      } 
	    }
  	})
  	.state('app.tabs.perfil', {
      url: '/perfil',
	  	views: {
	      'tabsContingutPerfil': {
	        templateUrl: 'templates/perfil.html',
	        controller: 'PerfilController'
	      } 
	    }
  	}).state('app.tabs.individual', {
      url: '/individual',
	  	views: {
	      'tabsContingutIndividual': {
	        templateUrl: 'templates/individual.html',
	        controller: 'IndividualController'
	      } 
	    }
  	}).state('app.tabs.multijugador', {
      url: '/multijugador',
	  	views: {
	      'tabsContingutMultijugador': {
	        templateUrl: 'templates/multijugador.html',
	        controller: 'MultijugadorController'
	      } 
	    }
  	})
    .state('juego', {
      url: '/juego/:juegoId',
      templateUrl: 'templates/juego.html',
      controller: 'JuegoController'
    })
    .state('juegoIndividual', {
      url: '/juegoIndividual/{dis}/{tiem}',
      templateUrl: 'templates/juegoIndividual.html',
      controller: 'JuegoIndividualController'
    });  
});

