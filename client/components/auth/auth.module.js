'use strict';

angular.module('mailMergeApp.auth', ['mailMergeApp.constants', 'mailMergeApp.util', 'ngCookies',
    'ngRoute'
  ])
  .config(function($httpProvider) {
    $httpProvider.interceptors.push('authInterceptor');
  });
