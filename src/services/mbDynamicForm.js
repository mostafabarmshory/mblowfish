
import dynamicFormTemplate from './mbDynamicForm.html';
//-----------------------------------------------------------------------------------
// Services and factories
//-----------------------------------------------------------------------------------
var service;
var provider;
var rootElement;
var mbDialog,
	sce,
	q;


var isFunction;
var isDefined;


//-----------------------------------------------------------------------------------
// Variables
//-----------------------------------------------------------------------------------


function mbDynamicForm() {



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
					templateUrl: dynamicFormTemplate,
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
		$get: function($mbDialog, $sce, $mbUtil, $q) {
			"ngInject";
			mbDialog = $mbDialog;
			sce = $sce;

			isDefined = $mbUtil.isDefined;
			isFunction = $mbUtil.isFunction;

			q = $q;

			return service;
		}
	}
	return provider;
}

export default mbDynamicForm;

