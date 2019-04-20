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
/**
 * حالت امنیتی را بررسی می‌کند
 * 
 * در صورتی که یک حالت حالتی امن باشد، و کاربر وارد سیستم نشده باشد، حالت ماشین
 * را به حالت لاگین می‌برد.
 */
.run(function($rootScope, $page, $location) {

	/**
	 * Rests settings of page (title, description, keywords and favicon) to values defined in branding
	 */
	function _initBranding() {

		var app = $rootScope.app || {};
		if( app.config){			
			$page.setTitle(app.config.title);
			$page.setDescription(app.config.description);
			$page.setKeywords(app.config.keywords);
			$page.setFavicon(app.config.favicon || app.config.logo);
		}
	}

	/**
	 * If an item of settings of page does not set yet, sets it by value defined in branding
	 */
	function _fillUnsetFields() {
		var app = $rootScope.app || {};
		var config = app.config ? app.config : null;
		if(!config){
			return;
		}
		$page.setTitle($page.getTitle() || config.title);
		$page.setDescription($page.getDescription() || config.description);
		$page.setKeywords($page.getKeywords() || config.keywords);
		$page.setFavicon(config.favicon || config.logo);
		$page.setMeta('og:site_name', config.title);
	}
	/*
	 * Listen on change route
	 */
	$rootScope.$on('$routeChangeStart', function( /* event */ ) {
		_initBranding();
	});
	$rootScope.$on('$routeChangeSuccess', function( /*event, current*/ ) {
		var path = $location.absUrl();
		$page
		.setMeta('twitter:url', path) //
		.setMeta('og:url', path);
	});

	$rootScope.$watch(function(){
		var app = $rootScope.app || {};
		var conf = app.config;
		if(!conf){
			return conf;
		}
		return conf.title +'#'+ conf.description +'#'+ conf.keywords +'#'+ conf.logo +'#'+ conf.favicon;
	}, function() {
		_fillUnsetFields();
	});

	$page.setMeta('twitter:card', 'summary');
	$page.setMeta('og:type', 'object');
});