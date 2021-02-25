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
@name $mbUiUtil
@description Common function used in ui

@ngInject
 */
function mbUiUtil(
	/* MBlowfish */ $mbUtil,
	/* AngularJS */ $templateRequest, $sce) {


	/**
	@param {string} path - The path to parse. (It is assumed to have query and hash stripped off.)
	@param {Object} opts - Options.
	@return {Object} - An object containing an array of path parameter names (`keys`) and a regular
	    expression (`regexp`) that can be used to identify a matching URL and extract the path
	    parameter values.
	
	@description
	Parses the given path, extracting path parameter names and a regular expression to match URLs.
	
	Originally inspired by `pathRexp` in `visionmedia/express/lib/utils.js`.

	@memberof $mbUiUtil
	 */
	this.routeToRegExp = function(path, opts) {
		var keys = [];

		var pattern = path
			.replace(/([().])/g, '\\$1')
			.replace(/(\/)?:(\w+)(\*\?|[?*])?/g, function(_, slash, key, option) {
				var optional = option === '?' || option === '*?';
				var star = option === '*' || option === '*?';
				keys.push({ name: key, optional: optional });
				slash = slash || '';
				return (
					(optional ? '(?:' + slash : slash + '(?:') +
					(star ? '(.+?)' : '([^/]+)') +
					(optional ? '?)?' : ')')
				);
			})
			.replace(/([/$*])/g, '\\$1');

		if (opts.ignoreTrailingSlashes) {
			pattern = pattern.replace(/\/+$/, '') + '/*';
		}

		return {
			keys: keys,
			regexp: new RegExp(
				'^' + pattern + '(?:[?#]|$)',
				opts.caseInsensitiveMatch ? 'i' : ''
			)
		};
	};


	/**
	 @param on {string} current url
	 @param route {Object} route regexp to match the url against
	 @return {?Object}
	 
	 @description
	 Check if the route matches the current url.
	 
	 Inspired by match in
	 visionmedia/express/lib/router/router.js.

	 @memberof $mbUiUtil
	 */
	this.switchRouteMatcher = function(on, route) {
		var keys = route.keys,
			params = {};

		if (!route.regexp) return null;

		var m = route.regexp.exec(on);
		if (!m) return null;

		for (var i = 1, len = m.length; i < len; ++i) {
			var key = keys[i - 1];

			var val = m[i];

			if (key && val) {
				params[key.name] = val;
			}
		}
		return params;
	};

	this.inherit = function(parent, extra) {
		return angular.extend(Object.create(parent), extra);
	};

	this.getTemplateFor = function(route) {
		var template, templateUrl;
		if ($mbUtil.isDefined(template = route.template)) {
			if (angular.isFunction(template)) {
				template = template(route.params);
			}
		} else if ($mbUtil.isDefined(templateUrl = route.templateUrl)) {
			if (angular.isFunction(templateUrl)) {
				templateUrl = templateUrl(route.params);
			}
			if ($mbUtil.isDefined(templateUrl)) {
				route.loadedTemplateUrl = $sce.valueOf(templateUrl);
				template = $templateRequest(templateUrl);
			}
		}
		return template;
	};

	this.frameToUrl = function(frame) {
		return frame.url + '?' + $.param(frame.state);
	};

	return this;
}

export default mbUiUtil;


