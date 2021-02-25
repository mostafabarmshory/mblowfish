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
 * @ngdoc service
 * @name $mbRoute
 * @requires $location
 * @requires $mbRouteParams
 *
 * @property {Object} current Reference to the current route definition.
 * The route definition contains:
 *
 *   - `controller`: The controller constructor as defined in the route definition.
 *   - `locals`: A map of locals which is used by {@link ng.$controller $controller} service for
 *     controller instantiation. The `locals` contain
 *     the resolved values of the `resolve` map. Additionally the `locals` also contain:
 *
 *     - `$scope` - The current route scope.
 *     - `$template` - The current route template HTML.
 *
 *     The `locals` will be assigned to the route scope's `$resolve` property. You can override
 *     the property name, using `resolveAs` in the route definition. See
 *     {@link ngRoute.$mbRouteProvider $mbRouteProvider} for more info.
 *
 * @property {Object} routes Object with all route configuration Objects as its properties.
 *
 * @description
 * `$mbRoute` is used for deep-linking URLs to controllers and views (HTML partials).
 * It watches `$location.url()` and tries to map the path to an existing route definition.
 *
 * Requires the {@link ngRoute `ngRoute`} module to be installed.
 *
 * You can define routes through {@link ngRoute.$mbRouteProvider $mbRouteProvider}'s API.
 *
 * The `$mbRoute` service is typically used in conjunction with the
 * {@link ngRoute.directive:ngView `ngView`} directive and the
 * {@link ngRoute.$mbRouteParams `$mbRouteParams`} service.
 *
 * @example
 * This example shows how changing the URL hash causes the `$mbRoute` to match a route against the
 * URL, and the `ngView` pulls in the partial.
 *
 * <example name="$mbRoute-service" module="ngRouteExample"
 *          deps="angular-route.js" fixBase="true">
 *   <file name="index.html">
 *     <div ng-controller="MainController">
 *       Choose:
 *       <a href="Book/Moby">Moby</a> |
 *       <a href="Book/Moby/ch/1">Moby: Ch1</a> |
 *       <a href="Book/Gatsby">Gatsby</a> |
 *       <a href="Book/Gatsby/ch/4?key=value">Gatsby: Ch4</a> |
 *       <a href="Book/Scarlet">Scarlet Letter</a><br/>
 *
 *       <div ng-view></div>
 *
 *       <hr />
 *
 *       <pre>$location.path() = {{$location.path()}}</pre>
 *       <pre>$mbRoute.current.templateUrl = {{$mbRoute.current.templateUrl}}</pre>
 *       <pre>$mbRoute.current.params = {{$mbRoute.current.params}}</pre>
 *       <pre>$mbRoute.current.scope.name = {{$mbRoute.current.scope.name}}</pre>
 *       <pre>$mbRouteParams = {{$mbRouteParams}}</pre>
 *     </div>
 *   </file>
 *
 *   <file name="book.html">
 *     controller: {{name}}<br />
 *     Book Id: {{params.bookId}}<br />
 *   </file>
 *
 *   <file name="chapter.html">
 *     controller: {{name}}<br />
 *     Book Id: {{params.bookId}}<br />
 *     Chapter Id: {{params.chapterId}}
 *   </file>
 *
 *   <file name="script.js">
 *     angular.module('ngRouteExample', ['ngRoute'])
 *
 *      .controller('MainController', function($scope, $mbRoute, $mbRouteParams, $location) {
 *          $scope.$mbRoute = $mbRoute;
 *          $scope.$location = $location;
 *          $scope.$mbRouteParams = $mbRouteParams;
 *      })
 *
 *      .controller('BookController', function($scope, $mbRouteParams) {
 *          $scope.name = 'BookController';
 *          $scope.params = $mbRouteParams;
 *      })
 *
 *      .controller('ChapterController', function($scope, $mbRouteParams) {
 *          $scope.name = 'ChapterController';
 *          $scope.params = $mbRouteParams;
 *      })
 *
 *     .config(function($mbRouteProvider, $locationProvider) {
 *       $mbRouteProvider
 *        .when('/Book/:bookId', {
 *         templateUrl: 'book.html',
 *         controller: 'BookController',
 *         resolve: {
 *           // I will cause a 1 second delay
 *           delay: function($q, $timeout) {
 *             var delay = $q.defer();
 *             $timeout(delay.resolve, 1000);
 *             return delay.promise;
 *           }
 *         }
 *       })
 *       .when('/Book/:bookId/ch/:chapterId', {
 *         templateUrl: 'chapter.html',
 *         controller: 'ChapterController'
 *       });
 *
 *       // configure html5 to get links working on jsfiddle
 *       $locationProvider.html5Mode(true);
 *     });
 *
 *   </file>
 *
 *   <file name="protractor.js" type="protractor">
 *     it('should load and compile correct template', function() {
 *       element(by.linkText('Moby: Ch1')).click();
 *       var content = element(by.css('[ng-view]')).getText();
 *       expect(content).toMatch(/controller: ChapterController/);
 *       expect(content).toMatch(/Book Id: Moby/);
 *       expect(content).toMatch(/Chapter Id: 1/);
 *
 *       element(by.partialLinkText('Scarlet')).click();
 *
 *       content = element(by.css('[ng-view]')).getText();
 *       expect(content).toMatch(/controller: BookController/);
 *       expect(content).toMatch(/Book Id: Scarlet/);
 *     });
 *   </file>
 * </example>
 */


/**
 * @ngdoc event
 * @name $mbRoute#$mbRouteChangeStart
 * @eventType broadcast on root scope
 * @description
 * Broadcasted before a route change. At this  point the route services starts
 * resolving all of the dependencies needed for the route change to occur.
 * Typically this involves fetching the view template as well as any dependencies
 * defined in `resolve` route property. Once  all of the dependencies are resolved
 * `$mbRouteChangeSuccess` is fired.
 *
 * The route change (and the `$location` change that triggered it) can be prevented
 * by calling `preventDefault` method of the event. See {@link ng.$rootScope.Scope#$on}
 * for more details about event object.
 *
 * @param {Object} angularEvent Synthetic event object.
 * @param {Route} next Future route information.
 * @param {Route} current Current route information.
 */

/**
 * @ngdoc event
 * @name $mbRoute#$mbRouteChangeSuccess
 * @eventType broadcast on root scope
 * @description
 * Broadcasted after a route change has happened successfully.
 * The `resolve` dependencies are now available in the `current.locals` property.
 *
 * {@link ngRoute.directive:ngView ngView} listens for the directive
 * to instantiate the controller and render the view.
 *
 * @param {Object} angularEvent Synthetic event object.
 * @param {Route} current Current route information.
 * @param {Route|Undefined} previous Previous route information, or undefined if current is
 * first route entered.
 */

/**
 * @ngdoc event
 * @name $mbRoute#$mbRouteChangeError
 * @eventType broadcast on root scope
 * @description
 * Broadcasted if a redirection function fails or any redirection or resolve promises are
 * rejected.
 *
 * @param {Object} angularEvent Synthetic event object
 * @param {Route} current Current route information.
 * @param {Route} previous Previous route information.
 * @param {Route} rejection The thrown error or the rejection reason of the promise. Usually
 * the rejection reason is the error that caused the promise to get rejected.
 */

/**
 * @ngdoc event
 * @name $mbRoute#$mbRouteUpdate
 * @eventType broadcast on root scope
 * @description
 * Broadcasted if the same instance of a route (including template, controller instance,
 * resolved dependencies, etc.) is being reused. This can happen if either `reloadOnSearch` or
 * `reloadOnUrl` has been set to `false`.
 *
 * @param {Object} angularEvent Synthetic event object
 * @param {Route} current Current/previous route information.
 */
function mbRoute(
	/* angularjs */ $rootScope, $location, $q, $injector, $templateRequest, $sce, $browser,
	/* MBlowfish */ $mbRouteParams, $mbUtil, $mbUiUtil
) {

	/***********************************************************************************
	 * Variables
	 ***********************************************************************************/
	var $mbRoute = this;
	var routes = {};
	var forceReload = false;
	var preparedRoute;
	var preparedRouteIsUpdateOnly;
	/**
	 * @ngdoc method
	 * @name $mbRouteProvider#eagerInstantiationEnabled
	 * @kind function
	 *
	 * @description
	 * Call this method as a setter to enable/disable eager instantiation of the
	 * {@link ngRoute.$mbRoute $mbRoute} service upon application bootstrap. You can also call it as a
	 * getter (i.e. without any arguments) to get the current value of the
	 * `eagerInstantiationEnabled` flag.
	 *
	 * Instantiating `$mbRoute` early is necessary for capturing the initial
	 * {@link ng.$location#$locationChangeStart $locationChangeStart} event and navigating to the
	 * appropriate route. Usually, `$mbRoute` is instantiated in time by the
	 * {@link ngRoute.ngView ngView} directive. Yet, in cases where `ngView` is included in an
	 * asynchronously loaded template (e.g. in another directive's template), the directive factory
	 * might not be called soon enough for `$mbRoute` to be instantiated _before_ the initial
	 * `$locationChangeSuccess` event is fired. Eager instantiation ensures that `$mbRoute` is always
	 * instantiated in time, regardless of when `ngView` will be loaded.
	 *
	 * The default value is true.
	 *
	 * **Note**:<br />
	 * You may want to disable the default behavior when unit-testing modules that depend on
	 * `ngRoute`, in order to avoid an unexpected request for the default route's template.
	 *
	 * @param {boolean=} enabled - If provided, update the internal `eagerInstantiationEnabled` flag.
	 *
	 * @returns {*} The current value of the `eagerInstantiationEnabled` flag if used as a getter or
	 *     itself (for chaining) if used as a setter.
	 */
	isEagerInstantiationEnabled = true;


	/**
	 * @ngdoc property
	 * @name $mbRouteProvider#caseInsensitiveMatch
	 * @description
	 *
	 * A boolean property indicating if routes defined
	 * using this provider should be matched using a case insensitive
	 * algorithm. Defaults to `false`.
	 */
	this.caseInsensitiveMatch = false;


	/***********************************************************************************
	 * Utility
	 ***********************************************************************************/
	inherit = $mbUiUtil.inherit;
	switchRouteMatcher = $mbUiUtil.switchRouteMatcher;

	function prepareRoute($locationEvent) {
		var lastRoute = $mbRoute.current;

		preparedRoute = parseRoute();
		preparedRouteIsUpdateOnly = isNavigationUpdateOnly(preparedRoute, lastRoute);

		if (!preparedRouteIsUpdateOnly && (lastRoute || preparedRoute)) {
			if ($rootScope.$broadcast('$mbRouteChangeStart', preparedRoute, lastRoute).defaultPrevented) {
				if ($locationEvent) {
					$locationEvent.preventDefault();
				}
			}
		}
	}

	function commitRoute() {
		var lastRoute = $mbRoute.current;
		var nextRoute = preparedRoute;

		if (preparedRouteIsUpdateOnly) {
			lastRoute.params = nextRoute.params;
			angular.copy(lastRoute.params, $mbRouteParams);
			$rootScope.$broadcast('$mbRouteUpdate', lastRoute);
		} else if (nextRoute || lastRoute) {
			forceReload = false;
			$mbRoute.current = nextRoute;

			var nextRoutePromise = $q.resolve(nextRoute);

			$browser.$$incOutstandingRequestCount('$mbRoute');

			nextRoutePromise.
				then(getRedirectionData).
				then(handlePossibleRedirection).
				then(function(keepProcessingRoute) {
					return keepProcessingRoute && nextRoutePromise.
						then(resolveLocals).
						then(function(locals) {
							// after route change
							if (nextRoute === $mbRoute.current) {
								if (nextRoute) {
									nextRoute.locals = locals;
									angular.copy(nextRoute.params, $mbRouteParams);
								}
								$rootScope.$broadcast('$mbRouteChangeSuccess', nextRoute, lastRoute);
							}
						});
				}).catch(function(error) {
					if (nextRoute === $mbRoute.current) {
						$rootScope.$broadcast('$mbRouteChangeError', nextRoute, lastRoute, error);
					}
				}).finally(function() {
					// Because `commitRoute()` is called from a `$rootScope.$evalAsync` block (see
					// `$locationWatch`), this `$$completeOutstandingRequest()` call will not cause
					// `outstandingRequestCount` to hit zero.  This is important in case we are redirecting
					// to a new route which also requires some asynchronous work.

					$browser.$$completeOutstandingRequest($mbUtil.noop, '$mbRoute');
				});
		}
	}

	function getRedirectionData(route) {
		var data = {
			route: route,
			hasRedirection: false
		};

		if (route) {
			if (route.redirectTo) {
				if (angular.isString(route.redirectTo)) {
					data.path = interpolate(route.redirectTo, route.params);
					data.search = route.params;
					data.hasRedirection = true;
				} else {
					var oldPath = $location.path();
					var oldSearch = $location.search();
					var newUrl = route.redirectTo(route.pathParams, oldPath, oldSearch);

					if (angular.$mbUtil.isDefined(newUrl)) {
						data.url = newUrl;
						data.hasRedirection = true;
					}
				}
			} else if (route.resolveRedirectTo) {
				return $q.
					resolve($injector.invoke(route.resolveRedirectTo)).
					then(function(newUrl) {
						if ($mbUtil.isDefined(newUrl)) {
							data.url = newUrl;
							data.hasRedirection = true;
						}

						return data;
					});
			}
		}

		return data;
	}

	function handlePossibleRedirection(data) {
		var keepProcessingRoute = true;

		if (data.route !== $mbRoute.current) {
			keepProcessingRoute = false;
		} else if (data.hasRedirection) {
			var oldUrl = $location.url();
			var newUrl = data.url;

			if (newUrl) {
				$location.
					url(newUrl).
					replace();
			} else {
				newUrl = $location.
					path(data.path).
					search(data.search).
					replace().
					url();
			}

			if (newUrl !== oldUrl) {
				// Exit out and don't process current next value,
				// wait for next location change from redirect
				keepProcessingRoute = false;
			}
		}

		return keepProcessingRoute;
	}

	function resolveLocals(route) {
		if (route) {
			var locals = angular.extend({}, route.resolve);
			angular.forEach(locals, function(value, key) {
				locals[key] = angular.isString(value) ?
					$injector.get(value) :
					$injector.invoke(value, null, null, key);
			});
			var template = $mbUiUtil.getTemplateFor(route);
			if ($mbUtil.isDefined(template)) {
				locals['$template'] = template;
			}
			return $q.all(locals);
		}
	}

	/**
	 * @returns {Object} the current active route, by matching it against the URL
	 */
	function parseRoute() {
		// Match a route
		var params, match;
		_.forEach(routes, function(route, path) {
			if (!match && (params = switchRouteMatcher($location.path(), route))) {
				match = inherit(route, {
					params: angular.extend({}, $location.search(), params),
					pathParams: params
				});
				match.$route = route;
			}
		});
		// No route matched; fallback to "otherwise" route
		return match || routes[null] && inherit(routes[null], { params: {}, pathParams: {} });
	}

	/**
	 * @param {Object} newRoute - The new route configuration (as returned by `parseRoute()`).
	 * @param {Object} oldRoute - The previous route configuration (as returned by `parseRoute()`).
	 * @returns {boolean} Whether this is an "update-only" navigation, i.e. the URL maps to the same
	 *                    route and it can be reused (based on the config and the type of change).
	 */
	function isNavigationUpdateOnly(newRoute, oldRoute) {
		// IF this is not a forced reload
		return !forceReload
			// AND both `newRoute`/`oldRoute` are defined
			&& newRoute && oldRoute
			// AND they map to the same Route Definition Object
			&& (newRoute.$route === oldRoute.$route)
			// AND `reloadOnUrl` is disabled
			&& (!newRoute.reloadOnUrl
				// OR `reloadOnSearch` is disabled
				|| (!newRoute.reloadOnSearch
					// AND both routes have the same path params
					&& angular.equals(newRoute.pathParams, oldRoute.pathParams)
				)
			);
	}

	/**
	 * @returns {string} interpolation of the redirect path with the parameters
	 */
	function interpolate(string, params) {
		var result = [];
		angular.forEach((string || '').split(':'), function(segment, i) {
			if (i === 0) {
				result.push(segment);
			} else {
				var segmentMatch = segment.match(/(\w+)(?:[?*])?(.*)/);
				var key = segmentMatch[1];
				result.push(params[key]);
				result.push(segmentMatch[2] || '');
				delete params[key];
			}
		});
		return result.join('');
	}

	/***********************************************************************************
	 * Service
	 ***********************************************************************************/


	/**
	 * @ngdoc method
	 * @name $mbRoute#when
	 *
	 * @param {string} path Route path (matched against `$location.path`). If `$location.path`
	 *    contains redundant trailing slash or is missing one, the route will still match and the
	 *    `$location.path` will be updated to add or drop the trailing slash to exactly match the
	 *    route definition.
	 *
	 *    * `path` can contain named groups starting with a colon: e.g. `:name`. All characters up
	 *        to the next slash are matched and stored in `$mbRouteParams` under the given `name`
	 *        when the route matches.
	 *    * `path` can contain named groups starting with a colon and ending with a star:
	 *        e.g.`:name*`. All characters are eagerly stored in `$mbRouteParams` under the given `name`
	 *        when the route matches.
	 *    * `path` can contain optional named groups with a question mark: e.g.`:name?`.
	 *
	 *    For example, routes like `/color/:color/largecode/:largecode*\/edit` will match
	 *    `/color/brown/largecode/code/with/slashes/edit` and extract:
	 *
	 *    * `color: brown`
	 *    * `largecode: code/with/slashes`.
	 *
	 *
	 * @param {Object} route Mapping information to be assigned to `$mbRoute.current` on route
	 *    match.
	 *
	 *    Object properties:
	 *
	 *    - `controller` – `{(string|Function)=}` – Controller fn that should be associated with
	 *      newly created scope or the name of a {@link angular.Module#controller registered
	 *      controller} if passed as a string.
	 *    - `controllerAs` – `{string=}` – An identifier name for a reference to the controller.
	 *      If present, the controller will be published to scope under the `controllerAs` name.
	 *    - `template` – `{(string|Function)=}` – html template as a string or a function that
	 *      returns an html template as a string which should be used by {@link
	 *      ngRoute.directive:ngView ngView} or {@link ng.directive:ngInclude ngInclude} directives.
	 *      This property takes precedence over `templateUrl`.
	 *
	 *      If `template` is a function, it will be called with the following parameters:
	 *
	 *      - `{Array.<Object>}` - route parameters extracted from the current
	 *        `$location.path()` by applying the current route
	 *
	 *      One of `template` or `templateUrl` is required.
	 *
	 *    - `templateUrl` – `{(string|Function)=}` – path or function that returns a path to an html
	 *      template that should be used by {@link ngRoute.directive:ngView ngView}.
	 *
	 *      If `templateUrl` is a function, it will be called with the following parameters:
	 *
	 *      - `{Array.<Object>}` - route parameters extracted from the current
	 *        `$location.path()` by applying the current route
	 *
	 *      One of `templateUrl` or `template` is required.
	 *
	 *    - `resolve` - `{Object.<string, Function>=}` - An optional map of dependencies which should
	 *      be injected into the controller. If any of these dependencies are promises, the router
	 *      will wait for them all to be resolved or one to be rejected before the controller is
	 *      instantiated.
	 *      If all the promises are resolved successfully, the values of the resolved promises are
	 *      injected and {@link ngRoute.$mbRoute#$mbRouteChangeSuccess $mbRouteChangeSuccess} event is
	 *      fired. If any of the promises are rejected the
	 *      {@link ngRoute.$mbRoute#$mbRouteChangeError $mbRouteChangeError} event is fired.
	 *      For easier access to the resolved dependencies from the template, the `resolve` map will
	 *      be available on the scope of the route, under `$resolve` (by default) or a custom name
	 *      specified by the `resolveAs` property (see below). This can be particularly useful, when
	 *      working with {@link angular.Module#component components} as route templates.<br />
	 *      <div class="alert alert-warning">
	 *        **Note:** If your scope already contains a property with this name, it will be hidden
	 *        or overwritten. Make sure, you specify an appropriate name for this property, that
	 *        does not collide with other properties on the scope.
	 *      </div>
	 *      The map object is:
	 *
	 *      - `key` – `{string}`: a name of a dependency to be injected into the controller.
	 *      - `factory` - `{string|Function}`: If `string` then it is an alias for a service.
	 *        Otherwise if function, then it is {@link auto.$injector#invoke injected}
	 *        and the return value is treated as the dependency. If the result is a promise, it is
	 *        resolved before its value is injected into the controller. Be aware that
	 *        `ngRoute.$mbRouteParams` will still refer to the previous route within these resolve
	 *        functions.  Use `$mbRoute.current.params` to access the new route parameters, instead.
	 *
	 *    - `resolveAs` - `{string=}` - The name under which the `resolve` map will be available on
	 *      the scope of the route. If omitted, defaults to `$resolve`.
	 *
	 *    - `redirectTo` – `{(string|Function)=}` – value to update
	 *      {@link ng.$location $location} path with and trigger route redirection.
	 *
	 *      If `redirectTo` is a function, it will be called with the following parameters:
	 *
	 *      - `{Object.<string>}` - route parameters extracted from the current
	 *        `$location.path()` by applying the current route templateUrl.
	 *      - `{string}` - current `$location.path()`
	 *      - `{Object}` - current `$location.search()`
	 *
	 *      The custom `redirectTo` function is expected to return a string which will be used
	 *      to update `$location.url()`. If the function throws an error, no further processing will
	 *      take place and the {@link ngRoute.$mbRoute#$mbRouteChangeError $mbRouteChangeError} event will
	 *      be fired.
	 *
	 *      Routes that specify `redirectTo` will not have their controllers, template functions
	 *      or resolves called, the `$location` will be changed to the redirect url and route
	 *      processing will stop. The exception to this is if the `redirectTo` is a function that
	 *      returns `undefined`. In this case the route transition occurs as though there was no
	 *      redirection.
	 *
	 *    - `resolveRedirectTo` – `{Function=}` – a function that will (eventually) return the value
	 *      to update {@link ng.$location $location} URL with and trigger route redirection. In
	 *      contrast to `redirectTo`, dependencies can be injected into `resolveRedirectTo` and the
	 *      return value can be either a string or a promise that will be resolved to a string.
	 *
	 *      Similar to `redirectTo`, if the return value is `undefined` (or a promise that gets
	 *      resolved to `undefined`), no redirection takes place and the route transition occurs as
	 *      though there was no redirection.
	 *
	 *      If the function throws an error or the returned promise gets rejected, no further
	 *      processing will take place and the
	 *      {@link ngRoute.$mbRoute#$mbRouteChangeError $mbRouteChangeError} event will be fired.
	 *
	 *      `redirectTo` takes precedence over `resolveRedirectTo`, so specifying both on the same
	 *      route definition, will cause the latter to be ignored.
	 *
	 *    - `[reloadOnUrl=true]` - `{boolean=}` - reload route when any part of the URL changes
	 *      (including the path) even if the new URL maps to the same route.
	 *
	 *      If the option is set to `false` and the URL in the browser changes, but the new URL maps
	 *      to the same route, then a `$mbRouteUpdate` event is broadcasted on the root scope (without
	 *      reloading the route).
	 *
	 *    - `[reloadOnSearch=true]` - `{boolean=}` - reload route when only `$location.search()`
	 *      or `$location.hash()` changes.
	 *
	 *      If the option is set to `false` and the URL in the browser changes, then a `$mbRouteUpdate`
	 *      event is broadcasted on the root scope (without reloading the route).
	 *
	 *      <div class="alert alert-warning">
	 *        **Note:** This option has no effect if `reloadOnUrl` is set to `false`.
	 *      </div>
	 *
	 *    - `[caseInsensitiveMatch=false]` - `{boolean=}` - match routes without being case sensitive
	 *
	 *      If the option is set to `true`, then the particular route can be matched without being
	 *      case sensitive
	 *
	 * @returns {Object} self
	 *
	 * @description
	 * Adds a new route definition to the `$mbRoute` service.
	 */
	this.when = function(path, route) {
		//copy original route object to preserve params inherited from proto chain
		var routeCopy = $mbUtil.shallowCopy(route);
		if (angular.isUndefined(routeCopy.reloadOnUrl)) {
			routeCopy.reloadOnUrl = true;
		}
		if (angular.isUndefined(routeCopy.reloadOnSearch)) {
			routeCopy.reloadOnSearch = true;
		}
		if (angular.isUndefined(routeCopy.caseInsensitiveMatch)) {
			routeCopy.caseInsensitiveMatch = this.caseInsensitiveMatch;
		}
		routes[path] = angular.extend(
			routeCopy,
			{ originalPath: path },
			path && $mbUiUtil.routeToRegExp(path, routeCopy)
		);

		// create redirection for trailing slashes
		if (path) {
			var redirectPath = (path[path.length - 1] === '/')
				? path.substr(0, path.length - 1)
				: path + '/';

			routes[redirectPath] = angular.extend(
				{ originalPath: path, redirectTo: path },
				$mbUiUtil.routeToRegExp(redirectPath, routeCopy)
			);
		}

		return this;
	};


	/**
	 * @ngdoc method
	 * @name $mbRouteProvider#otherwise
	 *
	 * @description
	 * Sets route definition that will be used on route change when no other route definition
	 * is matched.
	 *
	 * @param {Object|string} params Mapping information to be assigned to `$mbRoute.current`.
	 * If called with a string, the value maps to `redirectTo`.
	 * @returns {Object} self
	 */
	this.otherwise = function(params) {
		if (typeof params === 'string') {
			params = { redirectTo: params };
		}
		this.when(null, params);
		return this;
	};

	this.eagerInstantiationEnabled = function eagerInstantiationEnabled(enabled) {
		if (isDefined(enabled)) {
			isEagerInstantiationEnabled = enabled;
			return this;
		}

		return isEagerInstantiationEnabled;
	};


	/**
	 * @ngdoc method
	 * @name $mbRoute#reload
	 *
	 * @description
	 * Causes `$mbRoute` service to reload the current route even if
	 * {@link ng.$location $location} hasn't changed.
	 *
	 * As a result of that, {@link ngRoute.directive:ngView ngView}
	 * creates new scope and reinstantiates the controller.
	 */
	this.reload = function() {
		forceReload = true;

		var fakeLocationEvent = {
			defaultPrevented: false,
			preventDefault: function fakePreventDefault() {
				this.defaultPrevented = true;
				forceReload = false;
			}
		};

		$rootScope.$evalAsync(function() {
			prepareRoute(fakeLocationEvent);
			if (!fakeLocationEvent.defaultPrevented) commitRoute();
		});
	};

	/**
	 * @ngdoc method
	 * @name $mbRoute#updateParams
	 *
	 * @description
	 * Causes `$mbRoute` service to update the current URL, replacing
	 * current route parameters with those specified in `newParams`.
	 * Provided property names that match the route's path segment
	 * definitions will be interpolated into the location's path, while
	 * remaining properties will be treated as query params.
	 *
	 * @param {!Object<string, string>} newParams mapping of URL parameter names to values
	 */
	this.updateParams = function(newParams) {
		if (this.current && this.current.$route) {
			newParams = angular.extend({}, this.current.params, newParams);
			$location.path(interpolate(this.current.$route.originalPath, newParams));
			// interpolate modifies newParams, only query params are left
			$location.search(newParams);
		} else {
			throw $mbRouteMinErr('norout', 'Tried updating route with no current route');
		}
	};
	
	this.getRoutes = function(path){
		// TODO: maso, 2020: check redirect
		return routes[path];
	}

	$rootScope.$on('$locationChangeStart', prepareRoute);
	$rootScope.$on('$locationChangeSuccess', commitRoute);
	return this;
}

export default mbRoute;



