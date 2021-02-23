mblowfish.addAction(MB_MODULE_EXPORT_ACTION, {
	group: 'Module',
	title: 'Export',
	descriptions: 'Export modules from the local',
	icon: 'cloud_download',
	action: function($mbModules) {
		'ngInject';

		var filename = 'modules.json';
		var modules = $mbModules.getModules();

		var element = document.createElement('a');
		element.setAttribute('href', 'data:application/json;charset=utf-8,' + JSON.stringify(modules));
		element.setAttribute('download', filename);

		element.style.display = 'none';
		document.body.appendChild(element);

		element.click();

		document.body.removeChild(element);
	}
});