export default {
	group: 'Layout',
	title: 'Switch darck mode',
	description: 'Switch to the darck mode',
	icon: 'dark_mode',
	action: function($mbSettings) {
		'ngInject';
		var theme = $mbSettings.get('theme');
		if(theme === 'dark'){
			theme = 'default';
		} else {
			theme = 'dark';
		}
		$mbSettings.set('theme', theme);
	}
}