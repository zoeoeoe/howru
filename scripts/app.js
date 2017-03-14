/// <reference path="typings/cordova/cordova.d.ts"/>
/// <reference path="typings/angularjs/angular.d.ts"/>
// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'


// angular.module('starter', ['ionic', 'starter.controllers','ngCordova'])

// .run(function($ionicPlatform) {
//   $ionicPlatform.ready(function() {
//     // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
//     // for form inputs)
//     if(window.cordova && window.cordova.plugins.Keyboard) {
//       cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
//     }
//     if(window.StatusBar) {
//       StatusBar.styleDefault();
//     }
//   });
// })
var serv_address="http://104.236.218.214:6010"

function site_join(path){
	return serv_address+path;
}


var app=angular.module('ionicApp', ['ionic','ngStorage','services','ngMap', 'ngCordova','ngCordova.plugins.fileTransfer','ngProgress', 'ionicLazyLoad']);


app.config(['$httpProvider', function($httpProvider) {
    // setup CSRF support
    $httpProvider.defaults.xsrfCookieName = 'csrftoken';
    $httpProvider.defaults.xsrfHeaderName = 'X-CSRFToken';
    // http://victorblog.com/2012/12/20/make-angularjs-http-service-behave-like-jquery-ajax/
    // Rewrite POST body data
    $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';
    $httpProvider.defaults.withCredentials = true;
    // Override $http service's default transformRequest
    $httpProvider.defaults.transformRequest = [function(data)
    {
      /**
       * The workhorse; converts an object to x-www-form-urlencoded serialization.
       * @param {Object} obj
       * @return {String}
       */ 
      var param = function(obj)
      {
        var query = '';
        var name, value, fullSubName, subName, subValue, innerObj, i;
        
        for(name in obj)
        {
          value = obj[name];
          
          if(value instanceof Array)
          {
            for(i=0; i<value.length; ++i)
            {
              subValue = value[i];
              fullSubName = name + '[' + i + ']';
              innerObj = {};
              innerObj[fullSubName] = subValue;
              query += param(innerObj) + '&';
            }
          }
          else if(value instanceof Object)
          {
            for(subName in value)
            {
              subValue = value[subName];
              fullSubName = name + '[' + subName + ']';
              innerObj = {};
              innerObj[fullSubName] = subValue;
              query += param(innerObj) + '&';
            }
          }
          else if(value !== undefined && value !== null)
          {
            query += encodeURIComponent(name) + '=' + encodeURIComponent(value) + '&';
          }
        }
        
        return query.length ? query.substr(0, query.length - 1) : query;
      };
      
      return angular.isObject(data) && String(data) !== '[object File]' ? param(data) : data;
    }];
  }
]);


app.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider
   .state('nav', {
    url: '/nav',
     abstract: true,
     templateUrl: 'index.html',
     controller: 'MainCtrl'
   })

  .state('nav-e', {
    url: '/nav-e',
    views: {
      'nav-e': {
    templateUrl: 'pages/nav-e.html'
       }
    }
  })

  .state('nav-c', {
    url: '/nav-c',
      views: {
      'nav-c': {
    templateUrl: 'pages/nav-c.html'
       }
    }
  })
  
  //chats
  .state('nav.chat-detail', {
    url: '/chats/:chatId',
    views: {
      'chat-detail': {
        templateUrl: 'pages/chat-detail.html',
        controller: 'ChatDetailCtrl'
      }
    }
  })

  .state('nav-f', {
    url: '/nav-f',
    views: {
    'nav-f': {
    templateUrl: 'pages/nav-f.html'
      }
    }
  })

  .state('login',{
  	url:'/login',
  	views:{
  		'login-form':{
  			templateUrl:'pages/login.html',
  			controller:'loginCtrl'
  		}
  	}
  })

  .state('forgotten',{
    views:{
      'login-form':{
        templateUrl:'pages/forgotten.html',
        controller:' '
      }
    }
  })



  $urlRouterProvider.otherwise('/nav')

});



app.run(function($cordovaSplashscreen) {
  setTimeout(function() {
    $cordovaSplashscreen.hide()
  }, 20000)
})

app.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {

    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if(window.StatusBar) {
      // Set the statusbar to use the default style, tweak this to
      // remove the status bar on iOS or change it to use white instead of dark colors.
      StatusBar.styleDefault();
    }
  });
})
