var invoice = {
		'template': 'Invoice',
		'filename': 'valid{{ng}file-name-template.pdf',
		'outputfolder': 'output/valid{{ng}}folder-name-template',
		'frm': {
			'markup': "<div>Recipent code<input type='text'  ng-model='user.code'> </div><div>Firstname<input type='text'  ng-model='user.firstName'> </div><div><span style='float:left'>Date</span><p  style='width:250px' class='input-group'><input type='text' id='datepicker' class='form-control' uib-datepicker-popup ng-model='user.date' is-open='popup.opened' datepicker-options='dateOptions' ng-required='true' close-text='Close' /><span class='input-group-btn'><button type='button' class='btn btn-default' ng-click='open()'><i class='glyphicon glyphicon-calendar'></i></button></span></p></div>"
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
			'text': 'Hello,how are you?',
			'sendhtml': true,
			'sendEmail':true,
			'html': "<div>Dear <span style='color:red'>{{user.firstName}}</span>:</div></br> <div>This is your recipient code  <span style='color:red'>{{user.code}}</span> and here is your invoice on  <span style='color:red'>{{user.date| date:'yyyy-MM-dd' }}</span></div>"
		},
		'doc': {
			'outputpdf': true,
			'attachpdf': true,
			'markup': '<h1>Hello</h1>'
		}
};