/**

@ngInject
 */
function mblowfishTranslateConfig($mbPreferencesProvider, $mdDateLocaleProvider, $mbResourceProvider) {
	// Format and parse dates based on moment's 'L'-format
	// 'L'-format may later be changed
	$mdDateLocaleProvider.parseDate = function(dateString) {
		var m = moment(dateString, 'L', true);
		return m.isValid() ? m.toDate() : new Date(NaN);
	};

	$mdDateLocaleProvider.formatDate = function(date) {
		var m = moment(date);
		return m.isValid() ? m.format('L') : '';
	};
	///*
	//		// Pages
	//		$mbPreferencesProvider
	//			.addPage('brand', {
	//				title: 'Branding',
	//				icon: 'copyright',
	//				templateUrl: 'views/preferences/mb-brand.html',
	//				// controller : 'settingsBrandCtrl',
	//				controllerAs: 'ctrl'
	//			});*/


	$mbResourceProvider
		.addPage('language', {
			label: 'Custom',
			templateUrl: 'views/resources/mb-language-custome.html',
			controller: 'MbLocalResourceLanguageCustomCtrl',
			controllerAs: 'resourceCtrl',
			tags: ['/app/languages', 'language']
		})
		.addPage('language.viraweb123', {
			label: 'Common',
			templateUrl: 'views/resources/mb-language-list.html',
			controller: 'MbLocalResourceLanguageCommonCtrl',
			controllerAs: 'resourceCtrl',
			tags: ['/app/languages', 'language']
		})
		.addPage('language.upload', {
			label: 'Upload',
			templateUrl: 'views/resources/mb-language-upload.html',
			controller: 'MbLocalResourceLanguageUploadCtrl',
			controllerAs: 'resourceCtrl',
			tags: ['/app/languages', 'language']
		});
}


export default mblowfishTranslateConfig;