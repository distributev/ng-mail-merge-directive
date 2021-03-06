'use strict';

angular.module('mailMergeApp', ['mailMergeApp.auth', 'mailMergeApp.admin', 'mailMergeApp.constants',
    'ngCookies', 'ngResource', 'ngSanitize', 'ngRoute', 'validation.match','ngAnimate','ui.bootstrap','Menus','frapontillo.bootstrap-switch','formly', 'formlyBootstrap','angularUtils.directives.dirPagination'
  ])
  .config(function($routeProvider, $locationProvider) {
    $routeProvider.otherwise({
      redirectTo: '/'
    });

    $locationProvider.html5Mode(true);
  })
  
  .run(function(formlyConfig) {
  var attributes = [
    'date-disabled',
    'custom-class',
    'show-weeks',
    'starting-day',
    'init-date',
    'min-mode',
    'max-mode',
    'format-day',
    'format-month',
    'format-year',
    'format-day-header',
    'format-day-title',
    'format-month-title',
    'year-range',
    'shortcut-propagation',
    'datepicker-popup',
    'show-button-bar',
    'current-text',
    'clear-text',
    'close-text',
    'close-on-date-selection',
    'datepicker-append-to-body'
  ];

  var bindings = [
    'datepicker-mode',
    'min-date',
    'max-date'
  ];

  var ngModelAttrs = {};

  function camelize(string) {
    string = string.replace(/[\-_\s]+(.)?/g, function(match, chr) {
      return chr ? chr.toUpperCase() : '';
    });
    // Ensure 1st char is always lowercase
    return string.replace(/^([A-Z])/, function(match, chr) {
      return chr ? chr.toLowerCase() : '';
    });
  }


  angular.forEach(attributes, function(attr) {
    ngModelAttrs[camelize(attr)] = {attribute: attr};
  });

  angular.forEach(bindings, function(binding) {
    ngModelAttrs[camelize(binding)] = {bound: binding};
  });


  formlyConfig.setWrapper({
      name: 'horizontalBootstrapLabel',
      template: [
        '<label for="{{::id}}" class="col-sm-4 control-label">',
          '{{to.label}} {{to.required ? "*" : ""}}',
        '</label>',
        '<div class="col-sm-8">',
          '<formly-transclude></formly-transclude>',
        '</div>',
        '<div class="clearfix"></div>'
      ].join(' ')
    });

 formlyConfig.setType({
      name: 'horizontalInput',
      extends: 'input',
      wrapper: ['horizontalBootstrapLabel', 'bootstrapHasError']
    });

  formlyConfig.setType({
    name: 'datepicker',
    templateUrl:  'datepicker.html',
    wrapper: ['horizontalBootstrapLabel', 'bootstrapHasError'],
    defaultOptions: {
      ngModelAttrs: ngModelAttrs,
      templateOptions: {
        datepickerOptions: {
          format: 'yyyy-MM-dd',
          initDate: new Date()
        }
      }
    },
    controller: ['$scope', function ($scope) {
      $scope.datepicker = {};

      $scope.datepicker.opened = false;

      $scope.datepicker.open = function () {
        $scope.datepicker.opened = true;
      };
    }]
  });


});


