import jQuery from "jquery";

import angular from 'angular';
import storageSupported from './functionStorageSupported';

import 'angular-cookies';
import 'angular-messages';
import 'angular-sanitize';
import 'angular-material';
import 'angular-animate';


import 'angular-material/angular-material.css'


var MB_MODULE_SK = 'mbModules';

var actions = {},
	views = {},
	editors = {},
	resources = {},
	components = {},
	applicationProcesses = {},
	preferences = {},
	sidnavs = {},
	wizards = {},
	wizardPages = {};
var rootScopeConstants = {};

/**

@ngInject
*/
function configureMblowfish(
	$mbActionsProvider, $mbViewProvider,
	$mbEditorProvider, $mbResourceProvider, $mbComponentProvider, $mbApplicationProvider,
	$mbPreferencesProvider, $mbSidenavProvider, $mbWizardProvider
) {
	"ngInject";

	// Load actions
	_.forEach(actions, function(action, actionId) {
		$mbActionsProvider.addAction(actionId, action);
	});

	// Load views
	_.forEach(views, function(view, viewId) {
		$mbViewProvider.addView(viewId, view);
	});

	// Load editors
	_.forEach(editors, function(editor, editorId) {
		$mbEditorProvider.addEditor(editorId, editor);
	});

	// Load resources
	_.forEach(resources, function(config, id) {
		$mbResourceProvider.addPage(id, config);
	});

	// load components
	_.forEach(components, function(config, id) {
		$mbComponentProvider.addComponent(id, config);
	});

	// load processes
	_.forEach(applicationProcesses, function(processList, id) {
		_.forEach(processList, function(process) {
			$mbApplicationProvider.addAction(id, process);
		});
	});

	_.forEach(preferences, function(com, id) {
		$mbPreferencesProvider.addPage(id, com);
	});

	_.forEach(sidnavs, function(com, id) {
		$mbSidenavProvider.addSidenav(id, com);
	});

	_.forEach(wizardPages, function(wp, id) {
		$mbWizardProvider.addWizardPage(id, wp);
	});

	_.forEach(wizards, function(w, id) {
		$mbWizardProvider.addWizard(id, w);
	});
}

/**
@ngdoc action-group
@name User
@description Global user menu

There are several registred menu in the $actions service. Modules can contribute
to the dashbord by addin action into it.

- mb.user : All action related to the current user
- mb.toolbar.menu : All action related to the toolbar menu
- navigationPathMenu: All items related to navigation.

 */
var mbApplicationModule = angular
	.module('mblowfishApp', [ //
		//	Angular
		'ngAnimate',
		//				'ngAria',
		'ngCookies',
		'ngMessages',
		'ngSanitize',

		'ngMaterial',
		//		'ng-appcache',//
		//		'angular-material-persian-datepicker',
	])
	.config(configureMblowfish)
	.run(function instantiateRoute($rootScope, $injector, $mbEditor) {
		'ngInject';
		$mbEditor.registerEditor('/ui/notfound/:path*', {
			template: '<h1>Not found</h1>'
		});

		var extensions = mblowfish.extensions;
		mblowfish.extensions = [];

		/**
		 * Enable an extionsion
		 */
		mblowfish.addExtension = function(loader) {
			mblowfish.extensions.push(loader);
			$injector.invoke(loader);
		};

		angular.forEach(extensions, function(ext) {
			mblowfish.addExtension(ext);
		});

		_.forEach(rootScopeConstants, function(constant, id) {
			$rootScope[id] = constant;
		});
	});



/***************************************************************************
 * Mblowfish global service
 ***************************************************************************/
var mblowfish = {
	extensions: [],
	extension: function(loader) {
		this.extensions.push(loader);
		return mblowfish;
	},
	addExtension: function(loader) {
		this.extensions.push(loader);
		return mblowfish;
	},



	//-------------------------------------------------------------
	// Module
	//-------------------------------------------------------------
	controller: function() {
		mbApplicationModule.controller.apply(mbApplicationModule, arguments);
		return mblowfish;
	},
	service: function() {
		mbApplicationModule.service.apply(mbApplicationModule, arguments);
		return mblowfish;
	},
	directive: function() {
		mbApplicationModule.directive.apply(mbApplicationModule, arguments);
		return mblowfish;
	},
	filter: function() {
		mbApplicationModule.filter.apply(mbApplicationModule, arguments);
		return mblowfish;
	},
	run: function() {
		mbApplicationModule.run.apply(mbApplicationModule, arguments);
		return mblowfish;
	},
	config: function() {
		mbApplicationModule.config.apply(mbApplicationModule, arguments);
		return mblowfish;
	},
	provider: function() {
		mbApplicationModule.provider.apply(mbApplicationModule, arguments);
		return mblowfish;
	},
	factory: function() {
		mbApplicationModule.factory.apply(mbApplicationModule, arguments);
		return mblowfish;
	},

	//-------------------------------------------------------------
	// UI
	//-------------------------------------------------------------
	action: function(actionId, action) {
		actions[actionId] = action;
		return mblowfish;
	},
	editor: function(editorId, editor) {
		editors[editorId] = editor;
		return mblowfish;
	},
	view: function(viewId, view) {
		views[viewId] = view;
		return mblowfish;
	},
	/**
	Register a constant service with the $injector, such as a string, a number, 
	an array, an object or a function. Like the value, it is not possible to 
	inject other services into a constant.

	But unlike value, a constant can be injected into a module configuration 
	function and it cannot be overridden by an decorator.
	 */
	constant: function(name, object) {
		var values = {};
		if (_.isUndefined(object)) {
			values = name;
		} else {
			values[name] = object;
		}

		_.forEach(values, function(constant, constantId) {
			// for injection
			mbApplicationModule.constant(constantId, constant);

			// global access
			rootScopeConstants[constantId] = constant;
			window[constantId] = constant;
			mbApplicationModule.constant(constantId, constant);
		});
		return mblowfish;
	},
	resource: function(resourceId, resource) {
		resources[resourceId] = resource;
		return mblowfish;
	},
	component: function(componentId, component) {
		components[componentId] = component;
		return mblowfish;
	},
	preference: function(preferenceId, preference) {
		preferences[preferenceId] = preference;
		return mblowfish;
	},
	applicationProcess: function(state, process) {
		if (_.isUndefined(applicationProcesses[state])) {
			applicationProcesses[state] = [];
		}
		applicationProcesses[state].push(process);
		return mblowfish;
	},
	sidenav: function(componentId, component) {
		sidnavs[componentId] = component;
		return mblowfish;
	},

	wizard: function(wizardId, wizardConfig) {
		wizards[wizardId] = wizardConfig;
		return mblowfish;
	},
	wizardPage: function(wizardPageId, wizardPageConfig) {
		wizardPages[wizardPageId] = wizardPageConfig;
		return mblowfish;
	},

	//>> Legecy
	addAction: function(actionId, action) {
		actions[actionId] = action;
		return mblowfish;
	},
	addEditor: function(editorId, editor) {
		editors[editorId] = editor;
		return mblowfish;
	},
	addView: function(viewId, view) {
		views[viewId] = view;
		return mblowfish;
	},
	addConstants: function(constants) {
		_.forEach(constants, function(constant, constantId) {
			rootScopeConstants[constantId] = constant;
			window[constantId] = constant;
			mbApplicationModule.constant(constantId, constant);
		});
		return mblowfish;
	},
	addResource: function(resourceId, resource) {
		resources[resourceId] = resource;
		return mblowfish;
	},
	addComponent: function(componentId, component) {
		components[componentId] = component;
		return mblowfish;
	},
	addPreference: function(preferenceId, preference) {
		preferences[preferenceId] = preference;
		return mblowfish;
	},
	addApplicationProcess: function(state, process) {
		if (_.isUndefined(applicationProcesses[state])) {
			applicationProcesses[state] = [];
		}
		applicationProcesses[state].push(process);
		return mblowfish;
	},
	addSidenav: function(componentId, component) {
		sidnavs[componentId] = component;
		return mblowfish;
	},
	//-------------------------------------------------------------
	// Angular Map
	//-------------------------------------------------------------
	element: function() {
		return angular.element.apply(angular, arguments);
	},
	bootstrap: function(dom, modules, configs) {
		modules = modules || [];
		modules.push('mblowfishApp');
		configs = configs || {};
		angular.bootstrap(dom, modules, configs);
		return mblowfish;
	},
	loadModules: function(prefixKey) {
		var storage = storageSupported(window, 'localStorage');
		var moduleList = JSON.parse(storage.getItem(prefixKey + '.' + MB_MODULE_SK));
		var jobs = [];
		_.forEach(moduleList, function(module) {
			jobs.push(moduleLoad(module));
		});
		return jQuery.when.apply(jQuery, jobs);
	}
};



export default mblowfish;