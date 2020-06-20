

mblowfish.provider('$mbDynamicForm', function() {

	//-----------------------------------------------------------------------------------
	// Services and factories
	//-----------------------------------------------------------------------------------
	var service;
	var provider;
	var rootElement;
	var mbDialog;
	var sce;


	var isFunction;
	var isDefined;


	//-----------------------------------------------------------------------------------
	// Variables
	//-----------------------------------------------------------------------------------


	//-----------------------------------------------------------------------------------
	// Global functions
	//-----------------------------------------------------------------------------------

	function validateSchema(schema) {
		return schema;
	}

	function getSchemaFor(dynamicFormConfig) {
		var schema, schemaUrl;
		if (isDefined(schema = dynamicFormConfig.schema)) {
			if (isFunction(schema)) {
				scheam = scheam(dynamicFormConfig);
			}
		} else if (isDefined(schemaUrl = dynamicFormConfig.schemaUrl)) {
			if (isFunction(schemaUrl)) {
				templateUrl = schemaUrl(dynamicFormConfig);
			}
			if (isDefined(schemaUrl)) {
				sce.valueOf(schemaUrl);
				schema = $templateRequest(schemaUrl);
			}
		}
		return q.when(schema);
	}

	function openDialog(formConfig) {
		return getSchemaFor(formConfig)
			.then(function(schema) {
				return mbDialog.show({
					templateUrl: 'views/dialogs/mb-dynamic-form.html',
					controller: 'MbDynamicFormDialogCtrl',
					controllerAs: 'ctrl',
					parent: rootElement,
					clickOutsideToClose: false,
					fullscreen: true,
					multiple: true,
					locals: {
						$value: formConfig.value || formConfig.$value,
						$schema: validateSchema(schema),
						$style: {
							title: formConfig.title,
							description: formConfig.description,
							icon: formConfig.icon,
						}
					}
				});
			});
	}


	//-----------------------------------------------------------------------------------
	// end
	//-----------------------------------------------------------------------------------
	service = {
		openDialog: openDialog,
	};
	provider = {
		/* @ngInject */
		$get: function($mbDialog, $sce, $mbUtil) {
			mbDialog = $mbDialog;
			sce = $sce;

			isDefined = $mbUtil.isDefined;
			isFunction = $mbUtil.isFunction;

			return service;
		}
	}
	return provider;
});