'use strict';

angular.module('mailMergeApp')
  .directive('ngMailMerge', function () {
    return {
      templateUrl: 'app/ngMailMerge/ngMailMerge.html',
      restrict: 'EA',
      scope:{template:'=',labelButton:'=',labelButtonPopup:'=',dataid:'=?',tableid:'=?'},
      link: function (scope, element, attrs) {
      },
      controller:['$scope','$compile','$interpolate',function($scope,$compile,$interpolate){
      	 $scope.popup = {
		    opened: false
		 };
		$scope.merge = {
			email:{
				to:null,
				cc:null,
				bcc:null,
				subject:null
			},
			code:null,
			name:null,
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
		$scope.message_interpolate = [];

		var prepareTableData = function(table){
			var transform_data = [];
			for(var i=0;i<table.rows( { search:'applied' } ).data().length;i++){
			  	transform_data.push(table.rows( { search:'applied' } ).data()[i]);
			}

			$scope.result={
			  data:transform_data
			};

			$scope.dataLength = $scope.result.data.length;
			transform();
			if($scope.dataLength>0){
				if($scope.currentIndex >= $scope.dataLength){
					$scope.currentIndex = $scope.dataLength- 1;
				}
				$scope.current = $scope.result.data[$scope.currentIndex];
				mapping();		
			}
			if(!$scope.sendhtml){
				$('#text_preview').text($interpolate($scope.mailMerge.email.text)($scope));
			}

			$scope.$apply();
		};

      	if($scope.tableid){
      		setTimeout(function(){
      			var table = $('#'+$scope.tableid).DataTable();
      			var el = $('.input-sm')[1];
      			prepareTableData(table)
      			$(el).bind('input', function(){
					prepareTableData(table)
				});
      		},200)     		
      	}
		
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
      		// $scope.email = $scope.message[$scope.currentIndex];
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
      		$scope.merge = $scope.message_interpolate[$scope.currentIndex];
      		// console.log($scope.merge)
      	};

      	var singleMsg = function(){
      		var email ={};
      		for(var key in $scope.merge){
      			if($scope.merge[key] !== null && typeof $scope.merge[key] === 'object'){
      				for(var subkey in $scope.merge[key]){
      					if(!email[key]){
		      				email[key]={};
		      			}
		      			email[key][subkey] = $scope.merge[key][subkey];
      				}
      			}else{
      				email[key] = $scope.merge[key];  
      			}	
		      	    				
		    }
	      	$scope.message_interpolate.push(email);
      	};

      	var transform = function(){
      		$scope.message_interpolate = [];
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
		      			var email ={};
		      			var index = 0;
		      			for(var key in $scope.merge){	
		      				if(key == 'date'){
		      					var date =  data[index].split("-");
		      					
		      					email[key] = new Date(date[0],parseInt(date[1])-1,date[2]);
		      					index++;
		      				}else if($scope.merge[key] !== null && typeof $scope.merge[key] === 'object'){
		      					for(var subkey in $scope.merge[key]){
		      						if(!email[key]){
		      							email[key]={};
		      						}
		      						email[key][subkey] = data[index];
		      						index++;
		      					}
		      					
		      				}
		      				else{
		      					email[key] = data[index];
		      					index++;
		      				}

		      			}
	      			$scope.message_interpolate.push(email);
	      			}
      			}
      		}else{
      			singleMsg();
      		}
	      		
      		console.log($scope.message_interpolate);

      	};

      	$('#form').html($compile($scope.mailMerge.frm.markup)($scope));
      	// $scope.mailMerge.email.html.replace('{{user.firstName}}','asdfasdfasf')
      	$scope.sendEmail = $scope.mailMerge.email.sendEmail;
      	$scope.sendhtml = $scope.mailMerge.email.sendhtml;

      	if($scope.sendEmail){
      		if($scope.sendhtml){
	      		$('#html_preview').html($compile($scope.mailMerge.email.html)($scope));
	      		$scope.previewText = "HTML Email Preview";
	      	}
	      	else{
	      		$('#text_preview').text($interpolate($scope.mailMerge.email.text)($scope));
	      		$scope.previewText = "Email Preview";
	      	}
      	}

      	$scope.update = function(){
      		$('#text_preview').text($interpolate($scope.mailMerge.email.text)($scope));
      	};
      	

      	if($scope.mailMerge.doc.outputpdf){
      		$('#doc_preview').html($compile($scope.mailMerge.doc.markup)($scope));
      	}

      	$scope.open = function(){
      		  $scope.popup.opened = true;
      	};

      	$scope.refresh = function(){
        	$('#html_preview').empty();
      		$('#html_preview').html($compile($scope.mailMerge.email.html)($scope));
      		$('#form').html($compile($scope.mailMerge.frm.markup)($scope));
      	};

      	$scope.sendMessage = function(){
      		$scope.messages = [];
      		if(!$scope.dataid && !$scope.tableid || !$scope.result || $scope.result.data.length == 0 ){
      			transform();
      		}

      		if(!$scope.sendEmail){
      			return;
      		}

  			for(var i=0;i<$scope.message_interpolate.length;i++){
  				
	  			(function(i){
	  			 	$scope.messages.push($scope.mailMerge);
	  				var scope = $scope.$new();
	  			 	scope.merge = $scope.message_interpolate[i];
	  			 	
	  			 	var email_el = $compile($scope.mailMerge.email.html)(scope);
	  			 	var doc_el = $compile($scope.mailMerge.doc.markup)(scope);
	  			 	var text = $interpolate($scope.mailMerge.email.text)(scope);
	  			 	
	  			 	setTimeout(function(){	 
	  			 		  var preview_email= $('#email-temp').html(email_el);		  
	  			 		  var preview_doc= $('#doc-temp').html(doc_el);		  
	  			 		  $scope.message_interpolate[i].html = preview_email.html();
	  			 		  $scope.message_interpolate[i].doc = preview_doc.html();
	  			 		  // $scope.message_interpolate[i].doc = preview_doc.html();

	  			 		  var message = angular.copy($scope.messages[i]);
			  			  delete message.frm;
			  			  message.email.to = $scope.message_interpolate[i].email.to;
			  			  message.email.cc = $scope.message_interpolate[i].email.cc;
			  			  message.email.bcc = $scope.message_interpolate[i].email.bcc;
			  			  message.email.subject = $scope.message_interpolate[i].email.subject;
			  			  message.email.html = $scope.message_interpolate[i].html;
			  			  message.email.text = text;
			  			  message.doc.markup = $scope.message_interpolate[i].doc;
			  			  message.doc.attachpdf = $scope.attachpdf;
			  			  $scope.messages[i] = message;
	  			 	 },300)
				})(i)
  			}
	
      		console.log($scope.message_interpolate);
      		console.log($scope.messages);
      	};


      }]
    };
  });
