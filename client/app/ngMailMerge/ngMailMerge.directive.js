'use strict';

angular.module('mailMergeApp')
  .directive('ngMailMerge', function () {
    return {
      templateUrl: 'app/ngMailMerge/ngMailMerge.html',
      restrict: 'EA',
      scope:{template:'=',labelButton:'=',labelButtonPopup:'=',dataid:'=?',tableid:'=?'},
      link: function (scope, element, attrs) {
      },
      controller:['$scope','$compile',function($scope,$compile){
      	 $scope.popup = {
		    opened: false
		 };
		$scope.user = {
			code:null,
			firstName:null,
			date:null
		};

      	if($scope.template == 'invoice'){
      		$scope.mailMerge = invoice;
      	}else if($scope.template == 'reminder'){
      		$scope.mailMerge = reminder;
      	}else if($scope.template == "license"){
      		$scope.mailMerge = license;
      	}

      	$scope.attachpdf = $scope.mailMerge.doc.attachpdf;


		$scope.result = null;
		$scope.currentIndex = 0;
		$scope.dataLength = 0;
		$scope.message = [];
      	$scope.parseCSV = function(){
      		$scope.result = Papa.parse($scope.csvData);
			$scope.dataLength = $scope.result.data.length;
			transform();
			if($scope.dataLength>0){
				if($scope.currentIndex >= $scope.dataLength){
					$scope.currentIndex = $scope.dataLength- 1;
				}
				$scope.current = $scope.result.data[$scope.currentIndex];
				mapping();
				
				
			}
      	};

      	$scope.next = function(){
      		$scope.currentIndex++;
      		// $scope.user = $scope.message[$scope.currentIndex];
      		$scope.current = $scope.result.data[$scope.currentIndex];
      		mapping();
      	};

      	$scope.previous = function(){
      		$scope.currentIndex--;
      		$scope.current = $scope.result.data[$scope.currentIndex];
      		mapping();
      	};

      	var mapping = function(){
      		var index = 0;
      		$scope.user = $scope.message[$scope.currentIndex];
      	};

      	var singleMsg = function(){
      		var user ={};
      		for(var key in $scope.user){	
		      	user[key] = $scope.user[key];      				
		    }
	      	$scope.message.push(user);
      	};

      	var transform = function(){
      		$scope.message = [];
      		if($scope.dataid || $scope.tableid){
      			if(!$scope.result){
      				singleMsg();
      			}
      			else if($scope.result.data.length == 0){
      				//no csv value
      				singleMsg();
      			}else{
      				for(var i=0;i<$scope.result.data.length;i++){
		      			var data = $scope.result.data[i];
		      			var user ={};
		      			var index = 0;
		      			for(var key in $scope.user){	
		      				if(key == 'date'){
		      					var date =  data[index].split("-");
		      					
		      					user[key] = new Date(date[0],parseInt(date[1])-1,date[2]);
		      				}else{
		      					user[key] = data[index];
		      				}

		      				index++;

		      			}
	      			$scope.message.push(user);
	      			}
      			}
      		}else{
      			singleMsg();
      		}
	      		
      		console.log($scope.message);

      	};

      	$('#form').html($compile($scope.mailMerge.frm.markup)($scope));
      	// $scope.mailMerge.email.html.replace('{{user.firstName}}','asdfasdfasf')
      	$scope.sendEmail = $scope.mailMerge.email.sendEmail;
      	$scope.sendhtml = $scope.mailMerge.email.sendhtml;
      	if($scope.sendhtml){
      		$('#preview').html($compile($scope.mailMerge.email.html)($scope));
      		$scope.previewText = "HTML Email Preview";
      	}
      	else{
      		$scope.previewText = "Email Preview";
      	}

      	$('#doc_preview').html($compile($scope.mailMerge.doc.markup)($scope));

      	$scope.open = function(){
      		  $scope.popup.opened = true;
      	};

      	$scope.refresh = function(){
        	$('#preview').empty();
      		$('#preview').html($compile($scope.mailMerge.email.html)($scope));
      		$('#form').html($compile($scope.mailMerge.frm.markup)($scope));
      	};

      	$scope.sendEmail = function(){
      		if(!$scope.dataid && !$scope.tableid || !$scope.result || $scope.result.data.length == 0 ){
      			transform();
      		}
  			for(var i=0;i<$scope.message.length;i++){
  			
  			 (function(i){
  				var scope = $scope.$new();
  			 	scope.user = $scope.message[i];

  			 	// var el= $compile($scope.mailMerge.email.html)(scope);
  			 	
  			 	var el = $compile($scope.mailMerge.email.html)(scope);
  			 	
  			 	setTimeout(function(){	 
  			 		  var element= $('#preview-temp').html(el);		  
  			 		  $scope.message[i].email = element.html();
  			 	 },200)
			 })(i)


  			// $scope.message[i].email =  $('#preview').html($compile($scope.mailMerge.email.html)($scope))[0];
  			}	
      		
      		
      		console.log($scope.message);
      	};


      }]
    };
  });
