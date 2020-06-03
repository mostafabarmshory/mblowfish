/*
 * Copyright (c) 2015-2025 Phoinex Scholars Co. http://dpq.co.ir
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */


/**
@ngdoc service
@name $mbLayout
@description A page management service

This service manage all visible ui components which are registered int the route 
service.

All components (view and editors) which is opened in the current session will be store
to show in the next sessions too.

 */
angular.module('mblowfish-core').provider('$mbLayout', function() {


	//-----------------------------------------------------------------------------------
	// Services and factories
	//-----------------------------------------------------------------------------------
	var service;
	var provider;
	var rootScope; // = $rootScope
	var compile; // = $compile
	var injector;// = $injector;
	var mbStorage; // = $mbStorage


	//-----------------------------------------------------------------------------------
	// Variables
	//-----------------------------------------------------------------------------------

	/*
	List of layouts which is loaded at run time by configurations. These are not
	editable
	*/
	var hardCodeLayout = {};

	var defaultLayoutName = 'default';
	var currentLayoutName;

	/*
	Default layout of the sysetm. If there is no layout then this one will be
	used as default layout.
	This field will be stored in local storage for farther usage.
	 */
	var layouts = {}

	// Root element of the layout system
	var rootElement;

	// layout mode
	var mode = 'docker';

	//-----------------------------------------------------------------------------------
	// Global functions
	//-----------------------------------------------------------------------------------
	function getLayout(name) {
		name = name || defaultLayoutName;
		var layout = layouts[name];
		if (!layout) {
			layout = _.cloneDeep(hardCodeLayout[name]);
			layouts[name] = layout;
		}
		return layout;
	}

	function setLayout(name, layout) {
		layouts[name] = layout;
	}

	/**
	@description Open a frame on the layout system and stores the configuration
	
	All frames will be stored and reopen with the layout system.
	
	The state of a frame will be stored by the layout system to be used later.
	
	The address of the frame will be used for the first time to put the frame. User may change the place
	dynamically at the runtime, so, the anchor may be changed with the firs one.
	
	@memberof $mbLayout
	@name open
	@param {MbFrame} frame A component to open in a place on the layout system
	@param {Object} state A list of configuration, parameters and settings to send to the container
	@param {string} anchor An address where the container must be placed for example 'editor' is a place to put all editors
	 */
	function open(frame, state, anchor) {
		var result;
		switch (mode) {
			case 'docker':
				result = openDockerContent(frame, state, anchor);
				break;
			default:
				result = openMobileView(frame, state, anchor);
				break;
		}
		return result;
	}

	function reload(element, layoutName) {
		rootElement = element;
		currentLayoutName = layoutName || defaultLayoutName;
		switch (mode) {
			case 'docker':
				loadDockerLayout();
				break;
			default:
				loadMobileView();
				break;
		}
	}

	function setFocus(frame) {
		// TODO:
	}

	function storeState() {
		// 1 - create new config
		storage = {};
		storage.layouts = layouts;
		storage.currentLayoutName = currentLayoutName;

		// 2- store
		mbStorage.mbLayout = storage;
	}

	function init() {
		// 1 - load layout from storage
		storage = mbStorage.mbLayout || {};
		layouts = storage.layouts || {};
		currentLayoutName = storage.currentLayoutName || defaultLayoutName;
	}

	//-----------------------------------------------------------------------------------
	// Mobile Layout
	//-----------------------------------------------------------------------------------
	function loadMobileView() { }
	function openMobileView(component, anchor) { }


	//-----------------------------------------------------------------------------------
	// Docker Layout
	//-----------------------------------------------------------------------------------
	var docker;
	var dockerBodyElement;
	var dockerPanelElement;
	var dockerViewElement;

	var DOCKER_COMPONENT_EDITOR_ID = 'editors';
	var DOCKER_COMPONENT_VIEW_CLASS = 'mb_docker_container_view';
	var DOCKER_COMPONENT_EDITOR_CLASS = 'mb_docker_container_editor';

	var DOCKER_BODY_CLASS = 'mb_docker_body';
	var DOCKER_PANEL_CLASS = 'mb_docker_panel';
	var DOCKER_VIEW_CLASS = 'mb_docker_view';



	function loadDockerLayout() {
		// load element
		var template = '<div id="mb_docker_panel"><div id="mb_docker_view"></div></div>';
		dockerBodyElement = rootElement;
		dockerPanelElement = angular.element(template);
		dockerViewElement = dockerPanelElement.find('#mb_docker_view')
		dockerBodyElement.append(dockerPanelElement);

		dockerBodyElement.addClass(DOCKER_BODY_CLASS);
		dockerPanelElement.addClass(DOCKER_PANEL_CLASS);
		dockerViewElement.addClass(DOCKER_VIEW_CLASS);

		// load docker view
		docker = new GoldenLayout(getLayout(currentLayoutName), dockerViewElement);
		docker.registerComponent('component', loadComponent);


		docker.on('stateChanged', function() {
			layouts[currentLayoutName] = docker.toConfig();
			storeState();
		});

		docker.on('selectionChanged', function() {
			// XXX: maso, 2020: change active view or editor
		});

		docker.on('initialised', function() {
			// link element
			var link = compile(dockerBodyElement.contents());
			link(rootScope);
		});
		docker.init();
	}
	/*
	 *  In docker view, this will create a new tap and add into the editor area
	 * based on Golden Layout Manager.
	 */
	function loadComponent(editor, state) {
		// Component is loaded before
		var component;
		if (state.isView) {
			var $mbView = injector.get('$mbView');
			component = $mbView.get(state.url);
		} else {
			var $mbEditor = injector.get('$mbEditor');
			component = $mbEditor.fetch(
				state.url, // path
				state);    // parameters
		}
		if (_.isUndefined(component)) {
			$mbEditor = injector.get('$mbEditor');
			component = $mbEditor.fetch(
				'/ui/notfound/' + state.url, // path
				state);                      // parameters
			// TODO: add the editor
			//		$mbEditor
			//			.add('/mb/notfound/:path*', {
			//				template: '<h1>Path not found</h1><p>path: {{:path}}</p>',
			//				anchore: 'editors',
			//				/* @ngInject */
			//				controller: function($scope, $state) {
			//					$scope.path = $state.params.path;
			//				},
			//			});
		}

		// discannect all resrouces
		if (component.isVisible()) {
			return component.setFocus();
		}

		// load element
		var element = editor.getElement();
		element.addClass(DOCKER_COMPONENT_VIEW_CLASS);
		editor.on('destroy', function() {
			component.destroy();
		});
		return component.render({
			$frame: editor,
			$element: element,
			$state: state
		});
		// TODO: maso,2020: dispatc view is loaded
	}

	function getDockerContentById(id) {
		var items = docker.root.getItemsById(id);
		return items[0];
	}

	function getDockerRootContent() {
		return docker.root;
	}

	function openDockerContent(component, state, anchor) {
		if (component.isEditor) {
			anchor = anchor || DOCKER_COMPONENT_EDITOR_ID;
		}


		if (component.isView) {
			var $mbView = injector.get('$mbView');
			component = $mbView.fetch(
				component.url,   // path
				state,           // state
				anchor);        // anchor
		} else {
			var $mbEditor = injector.get('$mbEditor');
			component = $mbEditor.fetch(
				component.url,    // path
				state,           // state
				anchor);        // anchor
		}

		if (_.isUndefined(component)) {
			// TODO: maso, 2020: support undefined view
			return;
		}
		// discannect all resrouces
		if (component.isVisible()) {
			return component.setFocus();
		}

		var anchorContent = getDockerContentById(anchor) || getDockerRootContent().contentItems[0];
		// TODO: maso, 2020: load component info to load later
		var contentConfig = {
			//Non ReactJS
			type: 'component',
			componentName: 'component',
			componentState: _.assign({}, state, {
				url: component.url,
				isEditor: component.isEditor,
				isView: component.isView,
			}),
			//General
			content: [],
			id: component.url,
			isClosable: true,
			title: component.title,
			activeItemIndex: 1
		};
		var ret = anchorContent.addChild(contentConfig);
		return ret;
	}


	/*
	Profider
	*/
	service = {
		// global api
		reload: reload,
		open: open,
		setFocus: setFocus,

		setLayout: setLayout,
		getLayout: getLayout,
	}
	provider = {
		setDefault: function(name) {
			defaultLayoutName = name;
			return provider;
		},
		addLayout: function(name, layout) {
			hardCodeLayout[name] = layout;
			return provider
		},
		getLayout: function(name) {
			return hardCodeLayout[name];
		},
		setMode: function(appMode) {
			mode = appMode;
			return;
		},
		/* @ngInject */
		$get: function(
			/* Angularjs */ $compile, $rootScope, $injector,
			/* MblowFish */ $mbStorage) {
			//
			// 1- Init layouts
			//
			rootScope = rootScope || $rootScope;
			compile = $compile;
			injector = $injector;

			mbStorage = $mbStorage;

			//
			// 3- Initialize the laytout
			//
			init();
			return service;
		}
	};
	return provider;
});

(function() {
	var mlModeule = angular.module('mblowfish-core');
	var mlDirectiveItems = [
		'lmGoldenlayout',
		'lmContent',
		'lmSplitter',
		'lmHeader',
		'lmControls',
		'lmMaximised',
		'lmTransitionIndicator'
	];
	_.forEach(mlDirectiveItems, function(directiveName) {
		mlModeule.directive(directiveName, function($mbTheming) {
			return {
				restrict: 'C',
				link: function($scope, $element) {
					$mbTheming($element);
				}
			};
		});
	});
})();

