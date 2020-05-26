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
 * `mbView` is a directive that complements the {@link ngRoute.$mbRoute $mbRoute} service by
 * including the rendered template of the current route into the main layout (`index.html`) file.
 * Every time the current route changes, the included view changes with it according to the
 * configuration of the `$mbRoute` service.
 *
 *  Dependeing on the version of the MB, it may open the view in the main page or a tab wiht in
 * a docker layout.
 *
 * Requires the {@link mbRoute `mbRoute`} module to be installed.
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
            <div mb-view class="view-animate"></div>
          </div>
          <hr />

          <pre>$location.path() = {{main.$location.path()}}</pre>
          <pre>$mbRoute.current.templateUrl = {{main.$mbRoute.current.templateUrl}}</pre>
          <pre>$mbRoute.current.params = {{main.$mbRoute.current.params}}</pre>
          <pre>$mbRouteParams = {{main.$mbRouteParams}}</pre>
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
        angular.module('mbViewExample', ['mbRoute', 'ngAnimate'])
          .config(function($locationProvider){
              $locationProvider.html5Mode(true);
          })
          .run(function($mbRoute) {
              $mbRoute
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
          })
          .controller('MainCtrl', function MainCtrl($mbRoute, $mbRouteParams, $location) {
              this.$mbRoute = $mbRoute;
              this.$mbRouteParams = $mbRouteParams;
              this.$location = $location;
          })
          .controller('BookCtrl', function BookCtrl($mbRouteParams) {
            this.name = 'BookCtrl';
            this.params = $mbRouteParams;
          })
          .controller('ChapterCtrl', function ChapterCtrl($mbRouteParams) {
            this.name = 'ChapterCtrl';
            this.params = $mbRouteParams;
          });
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
	/* MB        */ $mbLayout, $mbRoute,
	/* AngularJS */ $location, $dispatcher, $app, $q) {


	function link(scope, $element, attr) {
		// Variables
		var onloadExp = attr.onload || '';
		var layout = attr.mbLayout || 'docker';

		// staso, 2019: fire the state is changed
		$dispatcher.on('/app/state', checkApp);
		scope.$on('$destroy', function() {
			$dispatcher.off('/app/state', update);
		});


		function checkApp() {
			scope.$on('$mbRouteChangeSuccess', update);
			if ($app.getState() === 'ready') {
				$q.when(loadMainView())
					.then(update());
			}
		}

		function loadMainView() {
			return $mbLayout.reload($element);
		}

		/*
		 *  If the path change, this function will update the view and add the request
		 * page into the view.
		 */
		function update() {
			if (!$mbRoute.current) {
				return;
			}
			var route = $mbRoute.current;
			var state = {
				params: route.params,
				pathParams: route.pathParams,
			};
			route.$route.url = $location.url();
			return $mbLayout.open(route.$route, state);
		}

	}

	return {
		restrict: 'AE',
		terminal: true,
		priority: 400,
		link: link
	};
});


