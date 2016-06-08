'use strict';

angular.module('mailMergeApp').factory('MergeService',['$http',
        function($http){
          var baseUrl='/api/merges/';
          var mergeService = {
            create:function(data){
              var url = baseUrl;
              return $http({
                    method:'POST',
                    url:url,
                    data:data,
                    headers:{
                        'Content-type':'application/json'
                    }
                });
            },
            getHistory:function(data){
              var url = baseUrl+data.code+'/history';
              return $http({
                    method:'get',
                    url:url,
                    headers:{
                        'Content-type':'application/json'
                    }
                });
            }

          };
        
      return mergeService;

}]);