/*
 * Copyright (c) 2015-2025 Phoinex Scholars Co. http://dpq.co.ir
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the 'Software'), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */
/**
 * @ngdoc directive
 * @name mbView
 * @restrict ECA
 *
 * @description
 * `mbView` is a directive that complements the {@link ngRoute.$route $route} service by
 * including the rendered template of the current route into the main layout (`index.html`) file.
 * Every time the current route changes, the included view changes with it according to the
 * configuration of the `$route` service.
 *
 *  Dependeing on the version of the MB, it may open the view in the main page or a tab wiht in
 * a docker layout.
 *
 * Requires the {@link ngRoute `ngRoute`} module to be installed.
 *
 * @animations
 * | Animation                        | Occurs                              |
 * |----------------------------------|-------------------------------------|
 * | {@link ng.$animate#enter enter}  | when the new element is inserted to the DOM |
 * | {@link ng.$animate#leave leave}  | when the old element is removed from to the DOM  |
 *
 * The enter and leave animation occur concurrently.
 *
 * @scope
 * @priority 400
 * @param {string=} onload Expression to evaluate whenever the view updates.
 *
 * @param {string=} autoscroll Whether `mbView` should call {@link ng.$anchorScroll
 *                  $anchorScroll} to scroll the viewport after the view is updated.
 *
 *                  - If the attribute is not set, disable scrolling.
 *                  - If the attribute is set without value, enable scrolling.
 *                  - Otherwise enable scrolling only if the `autoscroll` attribute value evaluated
 *                    as an expression yields a truthy value.
 * @example
    <example name="mbView-directive" module="mbViewExample"
             deps="angular-route.js;angular-animate.js"
             animations="true" fixBase="true">
      <file name="index.html">
        <div ng-controller="MainCtrl as main">
          Choose:
          <a href="Book/Moby">Moby</a> |
          <a href="Book/Moby/ch/1">Moby: Ch1</a> |
          <a href="Book/Gatsby">Gatsby</a> |
          <a href="Book/Gatsby/ch/4?key=value">Gatsby: Ch4</a> |
          <a href="Book/Scarlet">Scarlet Letter</a><br/>

          <div class="view-animate-container">
            <div ng-view class="view-animate"></div>
          </div>
          <hr />

          <pre>$location.path() = {{main.$location.path()}}</pre>
          <pre>$route.current.templateUrl = {{main.$route.current.templateUrl}}</pre>
          <pre>$route.current.params = {{main.$route.current.params}}</pre>
          <pre>$routeParams = {{main.$routeParams}}</pre>
        </div>
      </file>

      <file name="book.html">
        <div>
          controller: {{book.name}}<br />
          Book Id: {{book.params.bookId}}<br />
        </div>
      </file>

      <file name="chapter.html">
        <div>
          controller: {{chapter.name}}<br />
          Book Id: {{chapter.params.bookId}}<br />
          Chapter Id: {{chapter.params.chapterId}}
        </div>
      </file>

      <file name="animations.css">
        .view-animate-container {
          position:relative;
          height:100px!important;
          background:white;
          border:1px solid black;
          height:40px;
          overflow:hidden;
        }

        .view-animate {
          padding:10px;
        }

        .view-animate.ng-enter, .view-animate.ng-leave {
          transition:all cubic-bezier(0.250, 0.460, 0.450, 0.940) 1.5s;

          display:block;
          width:100%;
          border-left:1px solid black;

          position:absolute;
          top:0;
          left:0;
          right:0;
          bottom:0;
          padding:10px;
        }

        .view-animate.ng-enter {
          left:100%;
        }
        .view-animate.ng-enter.ng-enter-active {
          left:0;
        }
        .view-animate.ng-leave.ng-leave-active {
          left:-100%;
        }
      </file>

      <file name="script.js">
        angular.module('mbViewExample', ['ngRoute', 'ngAnimate'])
          .config(['$routeProvider', '$locationProvider',
            function($routeProvider, $locationProvider) {
              $routeProvider
                .when('/Book/:bookId', {
                  templateUrl: 'book.html',
                  controller: 'BookCtrl',
                  controllerAs: 'book'
                })
                .when('/Book/:bookId/ch/:chapterId', {
                  templateUrl: 'chapter.html',
                  controller: 'ChapterCtrl',
                  controllerAs: 'chapter'
                });

              $locationProvider.html5Mode(true);
          }])
          .controller('MainCtrl', ['$route', '$routeParams', '$location',
            function MainCtrl($route, $routeParams, $location) {
              this.$route = $route;
              this.$location = $location;
              this.$routeParams = $routeParams;
          }])
          .controller('BookCtrl', ['$routeParams', function BookCtrl($routeParams) {
            this.name = 'BookCtrl';
            this.params = $routeParams;
          }])
          .controller('ChapterCtrl', ['$routeParams', function ChapterCtrl($routeParams) {
            this.name = 'ChapterCtrl';
            this.params = $routeParams;
          }]);

      </file>

      <file name="protractor.js" type="protractor">
        it('should load and compile correct template', function() {
          element(by.linkText('Moby: Ch1')).click();
          var content = element(by.css('[ng-view]')).getText();
          expect(content).toMatch(/controller: ChapterCtrl/);
          expect(content).toMatch(/Book Id: Moby/);
          expect(content).toMatch(/Chapter Id: 1/);

          element(by.partialLinkText('Scarlet')).click();

          content = element(by.css('[ng-view]')).getText();
          expect(content).toMatch(/controller: BookCtrl/);
          expect(content).toMatch(/Book Id: Scarlet/);
        });
      </file>
    </example>
 */


/**
 * @ngdoc event
 * @name mbView#$viewContentLoaded
 * @eventType emit on the current mbView scope
 * @description
 * Emitted every time the mbView content is reloaded.
 */
angular.module('mblowfish-core').directive('mbView', function(
	/* amwb core */ $wbUtil,
	/* MB        */ $mbUi,
	/* AngularJS */ $location, $injector,
	$templateRequest, $compile, $controller, $rootScope,
	$route, $dispatcher, $app) {
	var myLayout;
	var editorStack;
	return {
		restrict: 'ECA',
		terminal: true,
		priority: 400,
		templateUrl: 'views/partials/mb-view-loading.html',
		link: function(scope, $element, attr) {
			// Variables
			var currentScope,
				onloadExp = attr.onload || '';

			// staso, 2019: fire the state is changed
			$dispatcher.on('/app/state', checkApp);
			scope.$on('$destroy', function() {
				$dispatcher.off('/app/state', update);
			});

			function canAccess(route) {
				if (_.isUndefined(route.protect)) {
					return true;
				}
				if (angular.isFunction(route.protect)) {
					return !$injector.invoke(route.protect, route);
				}
				return !$rootScope.__account.anonymous;
			}

			function checkApp() {
				if ($app.getState() === 'ready') {
					scope.$on('$routeChangeSuccess', update);
					loadMainView()
						.then(update);
				}
			}

			function loadMainView() {
				return $templateRequest('views/partials/mb-view-main.html')
					.then(function(template) {
						$element.html(template);
						var link = $compile($element.contents());
						link(scope);

						// load docker view
						myLayout = new GoldenLayout($mbUi.getLayout(), $element.find('#mb-view-main-anchor'));
						myLayout.on('stackCreated', function(stack) {
							if (stack.config.title === 'Editors') {
								editorStack = stack;
							}
						});
						myLayout.registerComponent('view', loadView);
						myLayout.registerComponent('editor', loadEditor);
						myLayout.init();
					});
			}

			function cleanupLastView() {
				//				if (currentScope) {
				//					currentScope.$destroy();
				//					currentScope = null;
				//				}
				//				$element.empty();
			}

			/*
			 *  If the path change, this function will update the view and add the request
			 * page into the view.
			 */
			function update() {
				if (!canAccess($route.current)) {
					return $location.path('users/login');
				}
				cleanupLastView();
				var locals = $route.current && $route.current.locals;
				var template = locals && locals.$template;
				if (angular.isDefined(template)) {
					var route = $route.current.$$route || {};
					var newItemConfig = {
						//					title: title,
						id: locals.path,
						type: 'component',
						componentName: 'editor',
						title: route.name,
						componentState: {
							locals: locals,
							template: template,
							route: route
						}
					};
					// TODO: maso, 2020: find the editor container and add the page
					editorStack.addChild(newItemConfig);
				}
			}

			/*
			 *  In docker view, this will create a new tap and add into the editor area
			 * based on Golden Layout Manager.
			 */
			function loadEditor(editor, state) {
				var newScope = scope.$new();
				var current = $route.current;
				var mainElement = editor.getElement();
				mainElement.html(state.template);
				mainElement.addClass('mb_ui_editor');
				var link = $compile(editor.getElement());
				if (current.controller) {
					state.locals.$scope = scope;
					var controller = $controller(current.controller, state.locals);
					if (current.controllerAs) {
						scope[current.controllerAs] = controller;
					}
					mainElement.data('$ngControllerController', controller);
					mainElement.children()
						.data('$ngControllerController', controller);
				}
				scope[current.resolveAs || '$resolve'] = state.locals;
				link(newScope);
				currentScope = current.scope = newScope;
				currentScope.$emit('$viewContentLoaded');
				currentScope.$eval(onloadExp);

				editor.on('destroy', function() {
					// release scope and other resources
					newScope.$destroy();
				});
			}

			/*
			 *  Loads view into the docker layout system.
			 */
			function loadView(view, state) {
				var relatedRoute = $route.routes[state.url];
				state.locals = state.locals || {};
				$wbUtil.getTemplateFor(relatedRoute).then(function(template) {
					var newScope = scope.$new();
					var mainElement = view.getElement();
					var relatedRoute = $route.routes[state.url];
					mainElement.html(template);
					mainElement.addClass('mb_ui_view');
					var link = $compile(view.getElement());
					if (relatedRoute.controller) {
						state.locals.$scope = scope;
						var controller = $controller(relatedRoute.controller, state.locals);
						if (relatedRoute.controllerAs) {
							scope[relatedRoute.controllerAs] = controller;
						}
						mainElement.data('$ngControllerController', controller);
						mainElement.children()
							.data('$ngControllerController', controller);
					}
					scope[relatedRoute.resolveAs || '$resolve'] = state.locals;
					link(newScope);
					currentScope = relatedRoute.scope = newScope;
					currentScope.$emit('$viewContentLoaded');
					currentScope.$eval(onloadExp);
				});

				// xxx: maso, 2020: load based on state
				view.on('destroy', function() {
					// release scope and other resources
				});
			}
		}
	};
});


