var invoice = {
		'template': 'Invoice',
		'filename': 'valid{{ng}file-name-template.pdf',
		'outputfolder': 'output/valid{{ng}}folder-name-template',
		'frm': {
			'markup': "<div>To <input type='text'  ng-model='merge.email.to'> </div><div>CC <input type='text'  ng-model='merge.email.cc'> </div><div>BCC <input type='text'  ng-model='merge.email.bcc'></div><div>Subject <input type='text' ng-model='merge.email.subject'> </div><div>Recipent code<input type='text'  ng-change='update()' ng-model='merge.code'> </div><div>Firstname<input type='text'  ng-change='update()' ng-model='merge.name'> </div><div><span style='float:left'>Date</span><p  style='width:250px' class='input-group'><input type='text' id='datepicker' class='form-control' uib-datepicker-popup ng-model='merge.date' ng-change='update()' is-open='popup.opened' datepicker-options='dateOptions' ng-required='true' close-text='Close' /><span class='input-group-btn'><button type='button' class='btn btn-default' ng-click='open()'><i class='glyphicon glyphicon-calendar'></i></button></span></p></div>"
		},
		'smtp': {
			'host': 'Email Server Host',
			'port': '25',
			'userid': 'From Email User ID',
			'userpassword': 'From Email Password',
			'usessl': false,
			'usetls': false,
			'debug': false,
			'fromaddress': 'from@emailaddress.com',
			'name': 'From Name'
		},
		'email': {
			'to': 'valid{{ng}template',
			'cc': '',
			'bcc': '',
			'subject': 'test',
			'text': "Hello,how are you{{merge.name}}, did you receive my invoice on {{merge.date| date:'yyyy-MM-dd' }}",
			'sendhtml': true,
			'sendEmail':true,
			'html': "<div>Dear <span style='color:red'>{{merge.name}}</span>:</div></br> <div>This is your recipient code  <span style='color:red'>{{merge.code}}</span> and here is your invoice on  <span style='color:red'>{{merge.date| date:'yyyy-MM-dd' }}</span></div>"
		},
		'doc': {
			'outputpdf': true,
			'attachpdf': true,
			'markup': "<div>Dear <span style='color:red'>{{merge.name}}</span>:</div></br> <div>recipient code <span style='color:red'>{{merge.code}}</span>invoice date <span style='color:red'>{{merge.date| date:'yyyy-MM-dd' }}</span></div>"
		}
};
