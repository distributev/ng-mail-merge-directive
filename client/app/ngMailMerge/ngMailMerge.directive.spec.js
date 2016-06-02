'use strict';

describe('Directive: ngMailMerge', function () {

  // load the directive's module and view
  beforeEach(module('mailMergeApp.ngMailMerge'));
  beforeEach(module('app/ngMailMerge/ngMailMerge.html'));

  var element, scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<ng-mail-merge></ng-mail-merge>');
    element = $compile(element)(scope);
    scope.$apply();
    expect(element.text()).toBe('this is the ngMailMerge directive');
  }));
});
