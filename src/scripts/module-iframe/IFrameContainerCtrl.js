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
 @ngdoc Editor
 @name MbIFrameContainerCtrl
 @description A page preview editor
 
 */
angular.module('mblowfish-core').controller('MbIFrameContainerCtrl', function($scope, $mbView) {
	var groups = {
		'others': {
			title: 'Others',
			items: {}
		}
	};

	var items = $mbView.getViews();
	_.forEach(items, function(item, url) {
		var itmeGroups = item.groups || ['others'];
		_.forEach(itmeGroups, function(groupId) {
			if (_.isUndefined(groups[groupId])) {
				groups[groupId] = {
					title: groupId,
					items: {}
				};
			}
			groups[groupId].items[url] = item;
		});
	});

	$scope.groups = groups
});