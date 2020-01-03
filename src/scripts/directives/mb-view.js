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

//
//angular.module('mblowfish-core')
//
///**
// * @ngdoc Directives
// * @name mb-panel
// * @restrict E
// * @scope true
// * @description A dynamic panel with toolbar and sidenav
// * 
// * Applications needs an area to show modules, navigator, message and the
// * other visual parts of the system. This is a general application panel
// * which must be placed to the index.html directly.
// * 
// * @usage To load the application add this directive to the index.html.
// *        All internal elements will be removed after the module loaded.
// *        <hljs lang='html'> <body> <amd-panel> <div
// *        class='amd-preloader'> Loading.... </div> </amd-panel> ....
// *        </body> </hljs>
// * 
// */
//.directive('mbPanel', function ($route, $rootScope, $actions, $injector) {
//	/*
//	 * evaluate protect function
//	 */
//	function canAccess(route) {
//		if (!route.protect) {
//			return true;
//		}
//		if (angular.isFunction(route.protect)) {
//			return !$injector.invoke(route.protect, route);
//		}
//		return route.protect;
//	}
//
//	function postLink($scope) {
//		// State machin to controlle the view
//		var stateMachine = new machina.Fsm({
//			/* 
//			 * the initialize method is called right after the FSM
//			 * instance is constructed, giving you a place for any
//			 * setup behavior, etc. It receives the same
//			 * arguments (options) as the constructor function.
//			 */
//			initialize: function (/*options*/) {
//				// your setup code goes here...
//				$scope.status = this.initialState;
//			},
//			namespace: 'mb-panel-controller',
//			initialState: 'loading',
//			states: {
//				ready: {
//					routeChange: function (route) {
//						if (route.protect && !canAccess(route)) {
//							this.transition('accessDenied');
//							return;
//						}
//					},
//					appStateChange: function (state) {
//						// return if state is ready
//						if (state.startsWith('ready')) {
//							return;
//						} else {
//							this.transition('loading');
//						}
//					},
//					userStateChange: function (userIsAnonymous) {
//						if(!userIsAnonymous){
//							return;
//						}
//						if (this.getRoute().protect && userIsAnonymous) {//user is anonymous
//							this.transition('login');
//						} else {
//							this.transition('readyAnonymous');
//						}
//					}
//				},
//				accessDenied: {
//					routeChange: function (route) {
//						if (!route.protect || canAccess(route)) {
//							this.transition('ready');
//						}
//					},
//					appStateChange: function (state) {
//						// return if state is ready
//						if (state.startsWith('ready')) {
//							return;
//						} else {
//							this.transition('loading');
//						}
//					},
//					userStateChange: function (userIsAnonymous) {
//						if (userIsAnonymous) {//user is anonymous
//							this.transition('login');
//						}
//					}
//				},
//				readyAnonymous: {
//					routeChange: function (route) {
//						// TODO: maso, change to login page
//						if (route.protect) {
//							this.transition('login');
//						}
//					},
//					appStateChange: function (state) {
//						// return if state is ready
//						if (state.startsWith('ready')) {
//							return;
//						} else {
//							this.transition('loading');
//						}
//					},
//					userStateChange: function () {//user is not anonymous
//						this.transition('ready');
//					}
//				},
//				loading: {
//					// routeChange: function(route){},
//					appStateChange: function (state) {
//						if (state.startsWith('ready')) {
//							var route = this.getRoute();
//							if ($rootScope.__account.anonymous) {
//								if (route.protect) {
//									this.transition('login');
//								} else {
//									this.transition('readyAnonymous');
//								}
//							} else {
//								if (!route.protect || canAccess(route)) {
//									this.transition('ready');
//								} else {
//									this.transition('accessDenied');
//								}
//							}
//						}
//					}
//				},
//				login: {
//					routeChange: function (route) {
//						if (!route.protect) {
//							this.transition('readyAnonymous');
//						}
//					},
//					appStateChange: function (state) {
//						// return if state is ready
//						if (state.startsWith('ready')) {
//							return;
//						} else {
//							this.transition('loading');
//						}
//					},
//					userStateChange: function () {//user is not anonymous
//						var route = this.getRoute();
//						if (!canAccess(route)) {
//							this.transition('accessDenied');
//						} else {
//							this.transition('ready');
//						}
//					}
//				}
//			},
//			/*
//			 * Handle route change event
//			 */
//			routeChange: function (route) {
//				this.currentRoute = route;
//				if (!route) {
//					return;
//				}
//				this.handle('routeChange', route);
//			},
//			/*
//			 * Handle application state change
//			 */
//			appStateChange: function (state) {
//				if(!state) {
//					return;
//				}
//				this.handle('appStateChange', state);
//			},
//			/*
//			 * Handle user state change
//			 */
//			userStateChange: function (userIsAnonymous) {
//				this.userState = userIsAnonymous;
//				this.handle('userStateChange', userIsAnonymous);
//			},
//
//			/*
//			 * Get current route
//			 */
//			getRoute: function () {
//				return this.currentRoute || $route.current;
//			},
//
//			/*
//			 * Get current status
//			 */
//			getState: function () {
//				return this.appState || $rootScope.__app.state;
//			}
//		});
//
//		// I'd like to know when the transition event occurs
//		stateMachine.on('transition', function () {
//			if (stateMachine.state.startsWith('ready')) {
//				$scope.status = 'ready';
//				return;
//			}
//			$scope.status = stateMachine.state;
//		});
//
//		$scope.$watch(function () {
//			return $route.current;
//		}, function (route) {
//			$actions.group('navigationPathMenu').clear();
//			if (route) {
//				stateMachine.routeChange(route.$$route);
//				// Run state integeration
//				if (route.$$route && angular.isFunction(route.$$route.integerate)) {
//					$injector.invoke(route.$$route.integerate, route.$$route);
//				}
//			} else {
//				stateMachine.routeChange(route);
//			}
//		});
//
//		$rootScope.$watch('__app.state', function (appState) {
//			stateMachine.appStateChange(appState);
//		});
//
//		$scope.$watch('__account.anonymous', function (val) {
//			stateMachine.userStateChange(val);
//		});
//
//	}
//
//	return {
//		restrict: 'E',
//		replace: true,
//		templateUrl: 'views/directives/mb-panel.html',
//		link: postLink
//	};
//});
//
//




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
angular.module('mblowfish-core')
.directive('mbView', function (
		$templateRequest, $compile, $controller,
		$route, $dispatcher, $app) {
	return {
		restrict: 'ECA',
		terminal: true,
		priority: 400,
		templateUrl: 'views/partials/mb-view-loading.html',
		link: function(scope, $element, attr) {
			// Variables
			var currentScope,
			onloadExp = attr.onload || '',
			mainElement = null;;

			// staso, 2019: fire the state is changed
			$dispatcher.on('/app/state', checkApp);
			scope.$on('$destroy',function(){
				$dispatcher.off('/app/state', update);
			});
			
			function checkApp(){
				if($app.getState() === 'ready'){
					scope.$on('$routeChangeSuccess', update);
					loadMainView()
					.then(update);
				}
			}
			
			function loadMainView(){
				return $templateRequest('views/partials/mb-view-main.html')
				.then(function(template){
					$element.html(template);
					var link = $compile($element.contents());
					link(scope);
					mainElement = $element.find('#mb-view-main-anchor');
				});
			}

			function cleanupLastView() {
				if (currentScope) {
					currentScope.$destroy();
					currentScope = null;
				}
//				$element.empty();
			}

			function update() {
				var locals = $route.current && $route.current.locals,
				template = locals && locals.$template;

				cleanupLastView();
				if (angular.isDefined(template)) {
					var newScope = scope.$new();
					var current = $route.current;
					
					mainElement.html(template);
					var link = $compile(mainElement.contents());
					if (current.controller) {
						locals.$scope = scope;
						var controller = $controller(current.controller, locals);
						if (current.controllerAs) {
							scope[current.controllerAs] = controller;
						}
						mainElement.data('$ngControllerController', controller);
						mainElement.children()
							.data('$ngControllerController', controller);
					}
					scope[current.resolveAs || '$resolve'] = locals;
					link(newScope);
					
					currentScope = current.scope = newScope;
					currentScope.$emit('$viewContentLoaded');
					currentScope.$eval(onloadExp);
				}
			}
		}
	};
});


