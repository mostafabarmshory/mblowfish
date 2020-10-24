
mblowfish.addAction(MB_MODULE_IMPORT_ACTION, {
	title: 'Import modules',
	icon: 'cloud_upload',
	action: function($mbModules, $mbDispatcher, $rootScope) {
		'ngInject';


		function clickElem(elem) {
			// Thx user1601638 on Stack Overflow (6/6/2018 - https://stackoverflow.com/questions/13405129/javascript-create-and-save-file )
			var eventMouse = document.createEvent('MouseEvents')
			eventMouse.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null)
			elem.dispatchEvent(eventMouse)
		}

		function readFile(e) {
			var file = e.target.files[0];
			if (!file) {
				return;
			}
			var reader = new FileReader();
			reader.onload = function(e) {
				var contents = e.target.result;
				document.body.removeChild(fileInput);

				var modules = JSON.parse(contents);
				_.forEach(modules, function(module) {
					$mbModules.addModule(module);
				});

				//>> fire changes
				$mbDispatcher.dispatch(MB_MODULE_SP, {
					type: 'create',
					items: modules
				});
				$rootScope.$digest();
			};
			reader.readAsText(file);
		}

		var fileInput = document.createElement('input');
		fileInput.type = 'file';
		fileInput.style.display = 'none';
		fileInput.onchange = readFile;
		document.body.appendChild(fileInput);
		clickElem(fileInput);
	}
});