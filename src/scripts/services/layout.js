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
mblowfish.provider('$mbLayout', function() {


	//-----------------------------------------------------------------------------------
	// Services and factories
	//-----------------------------------------------------------------------------------
	var service,
		provider,
		rootScope, // = $rootScope
		compile, // = $compile
		injector,// = $injector;
		mbStorage, // = $mbStorage
		mbSettings,
		location;

	//-----------------------------------------------------------------------------------
	// Variables
	//-----------------------------------------------------------------------------------
	var layoutProviders = [],
		currentLayout,
		frames = [],
		defaultLayoutName,
		docker,
		dockerBodyElement,
		dockerPanelElement,
		dockerViewElement,
		rootElement,// Root element of the layout system
		mode = 'docker';// layout mode

	//-----------------------------------------------------------------------------------
	// Global functions
	//-----------------------------------------------------------------------------------


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

	function reload(element) {
		rootElement = element;
		switch (mode) {
			case 'docker':
				destroyDockerLayout();
				loadDockerLayout();
				break;
			default:
				destroyMobileView();
				loadMobileView();
				break;
		}
	}

	function setFocus(component) {
		//		setActiveContentItem
		var contentItem = component.$dockerContainer.parent;
		contentItem.parent.setActiveContentItem(contentItem);
	}

	function init() {
		switch (mode) {
			case 'docker':
				initDockerLayout();
				break;
			default:
				initMobileView();
				break;
		}
	}

	//-----------------------------------------------------------------------------------
	// Mobile Layout
	//-----------------------------------------------------------------------------------
	function initMobileView() { }
	function destroyMobileView() { }
	function loadMobileView() { }
	function openMobileView(/*component, anchor*/) { }


	//-----------------------------------------------------------------------------------
	// Docker Layout
	//-----------------------------------------------------------------------------------

	var DOCKER_COMPONENT_EDITOR_ID = 'editors';
	var DOCKER_COMPONENT_VIEW_CLASS = 'mb_docker_container_view';
	var DOCKER_COMPONENT_EDITOR_CLASS = 'mb_docker_container_editor';

	var DOCKER_BODY_CLASS = 'mb_docker_body';
	var DOCKER_PANEL_CLASS = 'mb_docker_panel';
	var DOCKER_VIEW_CLASS = 'mb_docker_view';

	function initDockerLayout() {
		restorDockerState();
		//loadDockerLayout();
	}

	function setLayout(name) {
		var layoutData = getDockerLayout(name);
		destroyDockerLayout();
		currentLayout = layoutData;
		loadDockerLayout();
		storeDockerState();
	}

	function getDockerLayout(name) {
		for (var i = 0; i < layoutProviders.length; i++) {
			var layoutProvider = layoutProviders[i];
			if (layoutProvider.has(name)) {
				return layoutProvider.get(name);
			}
		}
	}

	function storeDockerState() {
		mbStorage.mbLayout = currentLayout;
	}

	function restorDockerState() {
		currentLayout = mbStorage.mbLayout || getDockerLayout(defaultLayoutName);
	}

	function destroyDockerLayout() {
		// TODO:
		if (!docker) {
			return;
		}
		try {
			docker.off('initialised', onDockerInitialised);
			docker.off('stackCreated', dockerStackCreated);
			docker.off('componentCreated', dockerComponentCreate);
			docker.off('stateChanged', onDockerStateChanged);
			docker.off('activeContentItemChanged', dockerActiveContentItemChanged);
		} catch (ex) { }
		_.forEach(frames, function(frame) {
			frame.destroy();
		});
		frames = [];
		docker.destroy();
		dockerBodyElement.empty();
	}

	function onDockerStateChanged() {
		currentLayout = docker.toConfig();
		storeDockerState();
	}

	function dockerActiveContentItemChanged(e) {
		var frame = e.container.$frame;
		location.url(frame.url);
		try {
			if (rootScope.$$phase !== '$digest') {
				rootScope.$apply();
			}
		} catch (e) { }
	}

	function onDockerInitialised() {
		// link element
		var link = compile(dockerBodyElement.contents());
		link(rootScope);
	}

	function dockerStackCreated(stack) {
		// link element
		var link = compile(stack.element);
		link(rootScope);
	}

	function dockerComponentCreate(component) {
		// link element
		var link = compile(component.element);
		link(rootScope);
	}

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
		docker = new GoldenLayout(currentLayout, dockerViewElement);
		docker.registerComponent('component', loadComponent);

		docker.on('initialised', onDockerInitialised);
		docker.on('stackCreated', dockerStackCreated);
		docker.on('componentCreated', dockerComponentCreate);
		try {
			docker.init();
		} catch (e) {
			setLayout(defaultLayoutName);
		}
		docker.on('stateChanged', onDockerStateChanged);
		docker.on('activeContentItemChanged', dockerActiveContentItemChanged);
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
		}

		// discannect all resrouces
		if (component.isVisible()) {
			return component.setFocus();
		}

		// load element
		var element = editor.getElement();
		element
			.addClass(DOCKER_COMPONENT_VIEW_CLASS)
			.attr('dir', mbSettings.get(SETTING_LOCAL_DIRECTION, 'ltr'));
		editor.on('destroy', function() {
			component.destroy();
			var index = frames.indexOf(component);
			if (index) {
				frames.splice(index, 1);
			}
		});
		editor.$frame = component;
		editor.on('tab', function() {
			editor.tab.element.on('click', function() {
				location.url(component.url);
				try {
					if (rootScope.$$phase !== '$digest') {
						rootScope.$apply();
					}
				} catch (e) { }
			});
		});
		component.$dockerContainer = editor;
		return component.render({
			$dockerContainer: editor,
			$element: element,
			$state: state
		});
		// TODO: maso,2020: dispatc view is loaded
	}

	function getDockerContentById(id) {
		if (!docker.root) {
			setLayout(defaultLayoutName);
		}
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
		// TODO: support wizard
		if (component.isView) {
			var $mbView = injector.get('$mbView');
			component = $mbView.fetch(
				component.url,   // path
				state,           // state
				anchor);        // anchor
		} else {
			var $mbEditor = injector.get('$mbEditor');
			component = $mbEditor.fetch(
				component.url,
				state,
				anchor);
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
		getCurrentLayout: function() {
			return docker.toConfig();
		},
		getMode: function() {
			return mode;
		},
	}
	provider = {
		providers: [],
		setMode: function(appMode) {
			mode = appMode;
			return provider;
		},
		addProvider: function(providerFactoryName) {
			provider.providers.push(providerFactoryName);
			return provider;
		},
		setDefalutLayout: function(layoutName) {
			defaultLayoutName = layoutName;
			return provider;
		},
		/* @ngInject */
		$get: function(
			/* Angularjs */ $compile, $rootScope, $injector, $location,
			/* MblowFish */ $mbStorage, $mbSettings) {
			//
			// 1- Init layouts
			//
			location = $location;
			rootScope = rootScope || $rootScope;
			compile = $compile;
			injector = $injector;

			mbStorage = $mbStorage;
			mbSettings = $mbSettings;

			//
			// 3- Initialize the laytout
			//
			_.forEach(provider.providers, function(providerName) {
				var Provider = $injector.get(providerName);
				var pro = new Provider();
				layoutProviders.push(pro);
			});
			init();
			return service;
		}
	};
	return provider;
});

(function() {
	var mlDirectiveItems = [
		'lmGoldenlayout',
		'lmContent',
		'lmSplitter',
		'lmStack',
		'lmHeader',
		'lmControls',
		'lmMaximised',
		'lmTransitionIndicator'
	];
	_.forEach(mlDirectiveItems, function(directiveName) {
		mblowfish.directive(directiveName, function($mbTheming) {
			'ngInject';
			return {
				restrict: 'C',
				link: function($scope, $element) {
					$mbTheming($element);
				}
			};
		});
	});
})();

