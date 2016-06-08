'use strict';

angular.module('mailMergeApp')
  .directive('mailMerge', function () {
    return {
      templateUrl: 'app/mail-merge/mail-merge.html',
      restrict: 'EA',
      scope:{template:'=',labelButton:'=',labelButtonPopup:'=',dataid:'=?',tableid:'=?'},
      controller:['$scope','$http','$compile','$interpolate','MergeService',function($scope,$http,$compile,$interpolate,MergeService){
      	 $scope.popup = {
		    opened: false
		 };
		

		$scope.modalId = $scope.template.toLowerCase();

		$scope.showModal = function(id){
				//set component id and reset all variables
				$scope.myId = id;
				$scope.tableId = id+'_table';
				$scope.formId = id+'_form';
				$scope.htmlPreviewId = id+'_html_preview';
				$scope.textPreviewId = id+'_text_preview';
				$scope.docPreviewId = id+'_doc_preview';
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
				$('#'+$scope.tableId+'_filter .input-sm').val('');
				$('#'+$scope.tableId+'_filter .input-sm').trigger('input');
				$scope.csvData = null;
				$scope.currentIndex = 0;
				$scope.dataLength = 0;
				$scope.messageInterpolate = [];
		};

		$scope.$watch('myId',function(newVal){
		 	if(newVal){
		 		$http.get('/'+$scope.template+'.json').then(function(res){
		          		$scope.mailMerge = res.data;
					    $scope.attachpdf = $scope.mailMerge.doc.attachpdf;
				      	$scope.result = null;
				      	$scope.invalidTo = false;
						
						$scope.sendEmail = $scope.mailMerge.email.sendEmail;
				      	$scope.sendhtml = $scope.mailMerge.email.sendhtml;
				      	 

						setTimeout(function(){
								$('#'+$scope.formId).html($compile($scope.mailMerge.frm.markup)($scope));
							
								if($scope.sendEmail){
						      		if($scope.sendhtml){
							      		$('#'+$scope.htmlPreviewId).html($compile($scope.mailMerge.email.html)($scope));
							      		$scope.previewText = 'HTML Email Preview';
							      	}
							      	else{
							      		$('#'+$scope.textPreviewId).text($interpolate($scope.mailMerge.email.text)($scope));
							      		$scope.previewText = 'Email Preview';
							      	}
					      		}
						},100);

						if($scope.mailMerge.doc.outputpdf){
							setTimeout(function(){
					      		$('#'+$scope.docPreviewId).html($compile($scope.mailMerge.doc.markup)($scope));
					      	},10);
						}

						if($scope.tableid){
				      		setTimeout(function(){
				      			var table = $('#'+$scope.tableId).DataTable();
				      			var el = $('#'+$scope.tableId+'_filter .input-sm');
				      			prepareTableData(table);
				      			$(el).bind('input', function(){
									prepareTableData(table);
								});
				      		},10);   		
					    }        
			        });
		 		}
				
		   
		});
  

		var prepareTableData = function(table){
			var transformData = [];
			for(var i=0;i<table.rows( { search:'applied' } ).data().length;i++){
			  	transformData.push(table.rows( { search:'applied' } ).data()[i]);
			}

			$scope.result={
			  data:transformData
			};

			$scope.dataLength = $scope.result.data.length;
			transform();
			if($scope.dataLength>0){
				if($scope.currentIndex >= $scope.dataLength){
					$scope.currentIndex = $scope.dataLength- 1;
				}
				$scope.current = $scope.result.data[$scope.currentIndex];
				mapping();	
				$scope.$apply();	
			}
			if(!$scope.sendhtml){
				$('#text_preview').text($interpolate($scope.mailMerge.email.text)($scope));
			}

			
		};

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

      	$scope.fetchHistory = function(){
  			MergeService.getHistory({code:$scope.merge.code}).then(function(result){
  				$scope.mergeHistory = result.data;
  				for(var i in $scope.mergeHistory){
  					$scope.mergeHistory[i].email_date = new Date($scope.mergeHistory[i].email_date);
  				}
  			});
      	};

      	$scope.$watch('current',function(newVal){
      		if(newVal){
      		    $scope.fetchHistory();
      		}
      	});

      
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
      		$scope.merge = $scope.messageInterpolate[$scope.currentIndex];
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
	      	$scope.messageInterpolate.push(email);
      	};

      	var transform = function(){
      		$scope.messageInterpolate = [];
      		if($scope.dataid || $scope.tableid){
      			if(!$scope.result){
      				singleMsg();
      			}
      			else if($scope.result.data.length === 0){
      				//no csv value
      				singleMsg();
      			}else{
      				for(var i=0;i<$scope.result.data.length;i++){
		      			var data = $scope.result.data[i];
		      			var email ={};
		      			var index = 0;
		      			for(var key in $scope.merge){	
		      				if(key === 'date'){
		      					var date =  data[index].split('-');
		      					
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
	      			$scope.messageInterpolate.push(email);
	      			}
      			}
      		}else{
      			singleMsg();
      		}

      	};


      	$scope.update = function(){
      		$('#text_preview').text($interpolate($scope.mailMerge.email.text)($scope));
      	};
      	

      
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
      		$scope.invalidTo = false;
      		if($scope.sendEmail && !$scope.merge.email.to){
      			$scope.invalidTo = true;
      			return;
      		}

      		$scope.sending = true;
      		if(!$scope.dataid && !$scope.tableid || !$scope.result || $scope.result.data.length === 0 ){
      			transform();
      		}

      		if(!$scope.sendEmail){
      			return;
      		}
      		var template = angular.copy($scope.mailMerge);
      		console.log($scope.messageInterpolate)
  			for(var i=0;i<$scope.messageInterpolate.length;i++){
  				
	  			(function(i){
	  				delete template.frm;
	  			 	$scope.messages.push(template);
	  				var scope = $scope.$new();
	  			 	scope.merge = $scope.messageInterpolate[i];
	  			 	
	  			 	var email_el = $compile($scope.mailMerge.email.html)(scope);
	  			 	var doc_el = $compile($scope.mailMerge.doc.markup)(scope);
	  			 	var text = $interpolate($scope.mailMerge.email.text)(scope);
	  			 	
	  			 	setTimeout(function(){	 
	  			 		  var preview_email= $('#email-temp').html(email_el);		  
	  			 		  var preview_doc= $('#doc-temp').html(doc_el);		  
	  			 		  $scope.messageInterpolate[i].html = preview_email.html();
	  			 		  $scope.messageInterpolate[i].doc = preview_doc.html();  			 		 

	  			 		  var message = angular.copy($scope.messages[i]);
			  			  delete message.frm;
			  			  message.recipientcode = $scope.messageInterpolate[i].code;
			  			  message.status = 'kue';
			  			  message.email.to = $scope.messageInterpolate[i].email.to;
			  			  message.email.cc = $scope.messageInterpolate[i].email.cc;
			  			  message.email.bcc = $scope.messageInterpolate[i].email.bcc;
			  			  message.email.subject = $scope.messageInterpolate[i].email.subject;
			  			  message.email.html = $scope.messageInterpolate[i].html;
			  			  message.email.text = text;
			  			  message.doc.markup = $scope.messageInterpolate[i].doc;
			  			  message.doc.attachpdf = $scope.attachpdf;
			  			  $scope.messages[i] = message;
	  			 	 },200);
				})(i);
  			}
	

      		setTimeout(function(){
      			MergeService.create({merges:$scope.messages}).then(function(){
      				$scope.sending = false;
      				if($scope.dataid || $scope.tableid){
      					$scope.fetchHistory();
      				}
      		});
      		},200);
      		
      	};


      }]
    };
  });
