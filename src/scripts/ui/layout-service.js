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
	var defaultLayout = {
		settings: {
			hasHeaders: true,
			constrainDragToContainer: true,
			reorderEnabled: true,
			selectionEnabled: true,
			popoutWholeStack: false,
			blockedPopoutsThrowError: true,
			closePopoutsOnUnload: true,
			showPopoutIcon: false,
			showMaximiseIcon: true,
			showCloseIcon: true
		},
		dimensions: {
			borderWidth: 5,
			minItemHeight: 16,
			minItemWidth: 50,
			headerHeight: 20,
			dragProxyWidth: 300,
			dragProxyHeight: 200
		},
		content: []
	};

	var layouts = []

	// Root element of the layout system
	var rootElement;
	var rootScope;

	// layout mode
	var mode = 'docker';


	return {
		setDefault: function(userDefaultLayout) {
			defaultLayout = userDefaultLayout;
		},
		addLayout: function(name, layout) {
			layouts[name] = layout;
		},
		setMode: function(appMode) {
			mode = appMode;
		},
		$get: function(
			/* Angularjs */ $compile, $rootScope, $injector) {
			rootScope = rootScope || $rootScope;
			var $mbLayout = this;

			this.get = function(name) {
				var layout = null;
				return layout || defaultLayout;
			};

			this.set = function(name, layout) {
				layouts[name] = layout;
			};

			this.setDefault = function(layout) {
				defaultLayout = layout;
			};

			this.open = function(component, anchor) {
				var result;
				switch (mode) {
					case 'docker':
						result = openDockerContent(component, anchor);
						break;
					default:
						result = openMobileView(component, anchor);
						break;
				}
				return result;
			};

			this.reload = function(element) {
				rootElement = element;
				switch (mode) {
					case 'docker':
						loadDockerLayout();
						break;
					default:
						loadMobileView();
						break;
				}
			};

			this.setFocuse = function(component) {
				// TODO:
			};

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
			var DOCKER_COMPONENT_VIEW_CLASS = 'mb_docker_component_view';
			var DOCKER_COMPONENT_EDITOR_CLASS = 'mb_docker_component_editor';

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

				// link element
				var link = $compile(dockerBodyElement.contents());
				link(rootScope);

				// load docker view
				docker = new GoldenLayout($mbLayout.get(), dockerViewElement);
				docker.registerComponent('component', loadComponent);
				docker.init();
			}
			/*
			 *  In docker view, this will create a new tap and add into the editor area
			 * based on Golden Layout Manager.
			 */
			function loadComponent(editor, state) {
				// Component is loaded before
				var component;
				var $mbView = $injector.get('$mbView');
				var $mbEditor = $injector.get('$mbEditor');
				if (state.isView) {
					component = $mbView.get(state.url);
				} else {
					component = $mbEditor.get(state.url);
				}
				if (_.isUndefined(component)) {
					component = $mbEditor.get('/mb/core/ui/notfound/' + state.url);
				}

				// discannect all resrouces
				component.destroy();

				// load element
				var element = editor.getElement();
				element.addClass(DOCKER_COMPONENT_VIEW_CLASS);
				editor.on('destroy', function() {
					component.$destroy();
				});
				return component.load({
					$editor: editor,
					$element: element
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

			function openDockerContent(component, anchor) {
				if (component.isEditor) {
					anchor = anchor || DOCKER_COMPONENT_EDITOR_ID;
				}
				var anchorContent = getDockerContentById(anchor) || getDockerRootContent();
				// TODO: maso, 2020: load component info to load later
				var contentConfig = {
					//Non ReactJS
					type: 'component',
					componentName: 'component',
					componentState: {
						url: component.url,
						isEditor: component.isEditor,
						isView: component.isView,
					},
					//General
					content: [],
					id: component.url,
					//			width: 30,
					//			height: 30,
					isClosable: true,
					title: component.title,
					activeItemIndex: 1
				};
				var ret = anchorContent.addChild(contentConfig);
				return ret;
			}
			return this;
		}
	};
});
