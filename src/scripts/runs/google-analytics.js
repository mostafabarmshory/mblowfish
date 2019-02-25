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
'use strict';

angular.module('mblowfish-core')

.run(function($window, $rootScope, $location, $wbLibs) {
	var watcherIsLoaded = false;
	var googleValue;

	function loadScript(value){
		$wbLibs.load('https://www.googletagmanager.com/gtag/js')
		.then(function(){
			$window.dataLayer = $window.dataLayer || [];
			function gtag(){
				$window.dataLayer.push(arguments);
			};
			$window.gtag = gtag
			$window.gtag('js', new Date());
			$window.gtag('config', value);
		});
		$window.gtag('js', new Date());
		$window.gtag('config', value);
	}

	function loadWatchers() {
		if(watcherIsLoaded){
			return;
		}
		$rootScope.$on('$routeChangeStart', handleRouteChange);
		watcherIsLoaded = true;
	}

	function createEvent(){
		var event = {
//				page_title: 'homepage',
//				page_location: 'LOCATION',
				page_path: $location.path()
		};
		return event;
	}

	function handleRouteChange(){
		var event = createEvent();
		$window.gtag('config', googleValue, event);
	}

	// initialize google analytics
	$rootScope.$watch('app.config.googleAnalytic.property', function(value){
		if (!value) {
			return;
		}

		loadScript(value);
		loadWatchers();
	});
});