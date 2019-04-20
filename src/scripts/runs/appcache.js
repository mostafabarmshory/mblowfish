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
/*
 * دریچه‌های محاوره‌ای
 */
.run(function(appcache, $window, $rootScope) {

	var oldWatch;

	/*
	 * Reload the page
	 * 
	 * @deprecated use page service
	 */
	function reload() {
		$window.location.reload();
	}

	/*
	 * Reload the application
	 */
	function updateApplication() {
		var setting = $rootScope.app.config.update || {};
		if (setting.showMessage) {
			if(setting.autoReload) {
				alert('Application is update. Page will be reload automatically.')//
				.then(reload);
			} else {
				confirm('Application is update. Reload the page for new version?')//
				.then(reload);
			}
		} else {
			toast('Application is updated.');
		}
	}

	// Check update
	function doUpdate() {
		appcache.swapCache()//
		.then(updateApplication());
	}

	oldWatch = $rootScope.$watch('app.state.status', function(status) {
		if (status && status.startsWith('ready')) {
			// check for update
			return appcache//
			.checkUpdate()//
			.then(doUpdate);
			// Test
//			updateApplication();
			// Remove the watch
			oldWatch();
		}
	});
});