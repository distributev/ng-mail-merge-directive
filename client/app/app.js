'use strict';

angular.module('mailMergeApp', ['mailMergeApp.auth', 'mailMergeApp.admin', 'mailMergeApp.constants',
    'ngCookies', 'ngResource', 'ngSanitize', 'ngRoute', 'validation.match','ngAnimate','ui.bootstrap','Menus','frapontillo.bootstrap-switch','formly', 'formlyBootstrap'
  ])
  .config(function($routeProvider, $locationProvider) {
    $routeProvider.otherwise({
      redirectTo: '/'
    });

    $locationProvider.html5Mode(true);
  })
  .run(['menuService',
	  function(menuService) {
	    menuService.addMenu('Mail Merge', {
	      roles: ['user']
	    });

	    menuService.addMenuItem('Mail Merge', {
	      title: 'Mail Merge',
	      state:'merge',
	      type: 'dropdown',
	      roles: ['user']
	    });

	    menuService.addSubMenuItem('Mail Merge', 'merge', {
	    	title: 'reminder', 
	    	state: 'reminder'
	    });

	    menuService.addSubMenuItem('Mail Merge', 'merge', {
	    	title: 'invoice', 
	    	state: 'invoice'
	    });

	    menuService.addSubMenuItem('Mail Merge', 'merge', {
	    	title: 'license', 
	    	state: 'license'
	    });
  
  }])
  
