/* 
 * The MIT License (MIT)
 * 
 * Copyright (c) 2016 weburger
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
@ngdoc Directives
@name mb-icon
@description Icon for MBlowfish

 */
mblowfish.directive('mbIcon', function($mbIcon, $interpolate) {
	// FORMAT
	var template = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="{{icon.viewbox}}" width="{{icon.size}}" height="{{icon.size}}">{{{icon.shape}}}</svg>';
	// REPLACE FORMAT
	var replaceTemplate = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="{{icon.viewbox}}" width="{{icon.size}}" height="{{icon.size}}"><g id="{{icon.name}}" style="display:none">{{{icon.shape}}}</g><g id="{{old.name}}" style="display:none">{{{old.shape}}}</g></svg>';

	// optimize pars
	Mustache.parse(template);
	Mustache.parse(replaceTemplate);

	var shapes = $mbIcon.getShapes();

	function postLink(scope, element, attr, ctrls, transclude) {
		// icon information
		var icon = {
			name: 'help',
			viewbox: '0 0 24 24',
			size: 24,
		};
		// Counter
		var renderCount = 0;


		/*
		 * Sets icon and render the shape
		 */
		function setIcon(iconName) {
			var tempIcon = _.clone(icon);
			// icon
			if (iconName !== undefined) {
				tempIcon.name = iconName;
				// Check for material-design-icons style name, and extract icon / size
				var ss = iconName.match(/ic_(.*)_([0-9]+)px.svg/m);
				if (ss !== null) {
					tempIcon.name = ss[1];
					tempIcon.size = ss[2];
				}
			}

			render(tempIcon);
		}

		//        function setViewBox(viewBox){
		//            // viewBox
		//            if (attr.viewBox !== undefined) {
		//                viewBox = attr.viewBox;
		//            } else {
		//                viewBox = $mbIcon.getViewBox(icon) ? $mbIcon.getViewBox(icon) : '0 0 24 24';
		//            }
		//            render();
		//            return viewBox;
		//        }

		function setSize(newsize) {
			if (newsize === icon.size) {
				return;
			}
			var tempIcon = _.clone(icon);
			tempIcon.size = newsize;
			render(tempIcon);
		}

		function render(newIcon) {
			// check for new changes
			if (renderCount && newIcon.name === icon.name &&
				newIcon.size === icon.size &&
				newIcon.viewbox === icon.viewbox) {
				return;
			}
			newIcon.shape = shapes[newIcon.name];
			if (renderCount && window.SVGMorpheus) {
				// this block will succeed if SVGMorpheus is available
				var options = JSON.parse(attr.options || '{}');
				element.html(Mustache.render(replaceTemplate, {
					icon: newIcon,
					old: icon
				}));
				new SVGMorpheus(element.children()[0]).to(newIcon, options);
			} else {
				element.html(Mustache.render(template, {
					icon: newIcon
				}));
			}

			icon = newIcon;
			renderCount++;
		}

		// watch for any changes
		if (attr.icon !== undefined) {
			attr.$observe('icon', setIcon);
		} else if (attr.mbIconName !== undefined) {
			attr.$observe('mbIconName', setIcon);
		} else {
			transclude(scope, function(clone) {
				var text = clone.text();
				if (text && text.trim()) {
					scope.$watch(function() {
						return $interpolate(text.trim())(scope);
					}, setIcon);
				}
			});
		}
		if (attr.size !== undefined) {
			attr.$observe('size', setSize);
		}
		if (attr.mbSize !== undefined) {
			attr.$observe('mbSize', setSize);
		}
	}

	return {
		restrict: 'E',
		transclude: true,
		link: postLink,
		replace: false
	};
});

mblowfish.directive('mdIconFloat', function($mdTheming) {

	var INPUT_TAGS = ['INPUT', 'TEXTAREA', 'SELECT',
		'MD-SELECT'];

	var LEFT_SELECTORS = INPUT_TAGS.reduce(
		function(selectors, isel) {
			return selectors.concat(['mb-icon ~ ' + isel, '.mb-icon ~ ' + isel]);
		}, []).join(',');

	var RIGHT_SELECTORS = INPUT_TAGS.reduce(
		function(selectors, isel) {
			return selectors.concat([isel + ' ~ mb-icon', isel + ' ~ .mb-icon']);
		}, []).join(',');

	function compile(tElement) {
		// Check for both a left & right icon
		var leftIcon = tElement[0]
			.querySelector(LEFT_SELECTORS);
		var rightIcon = tElement[0]
			.querySelector(RIGHT_SELECTORS);

		if (leftIcon) {
			tElement.addClass('mb-icon-left');
		}
		if (rightIcon) {
			tElement.addClass('mb-icon-right');
		}

		return function postLink(scope, element) {
			$mdTheming(element);
		};
	}

	return {
		restrict: 'C',
		compile: compile
	};
});
