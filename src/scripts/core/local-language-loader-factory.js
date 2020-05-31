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
/*
 * 
 */
angular.module('mblowfish-core').factory('MbLanguageLoader', function($q, $rootScope) {

	// load language
	function getLanguage(key) {
		var languages = $rootScope.__app.configs.languages || [];
		var lang = {
			map: []
		};
		angular.forEach(languages, function(item) {
			if (item.key === key) {
				lang = item;
			}
		});
		return lang.map;
	}

    /*
     * State machine to manage language configurations
     */
	var stateMachine = new machina.Fsm({
		namespace: 'mb-language-config-loader',
		initialState: 'loading',
		states: {
			loading: {
				appStateChange: function(state) {
					if (state === 'ready') {
						this.transition('ready');
					}
					// TODO: maso, 2018: not configured or fail
					if (state === 'ready_app_not_configured') {
						this.transition('fail');
					}
				}
			},
			ready: {
				appStateChange: function(state) {
					// TODO: maso, 2018: not configured or fail
					if (state === 'ready_app_not_configured') {
						this.transition('fail');
					}
				}
			},
			fail: {
				appStateChange: function(state) {
					if (state === 'ready') {
						this.transition('ready');
					}
				}
			}
		},

        /*
         * Handle application state change
         */
		appStateChange: function(state) {
			this.handle('appStateChange', state);
		}

	});

	$rootScope.$watch('__app.state', function(state) {
		stateMachine.appStateChange(state);
	});

	var jobs = [];
	// I'd like to know when the transition event occurs
	stateMachine.on('transition', function() {
		if (stateMachine.state === 'ready' || stateMachine.state === 'fail') {
			angular.forEach(jobs, function(job) {
				job();
			});
			jobs = [];
		}
	});

	return function(option) {
		if (stateMachine.state === 'fail') {
			return $q.reject(option.key);
		}
		if (stateMachine.state === 'ready') {
			return $q.when(getLanguage(option.key));
		}

		var deferred = $q.defer();
		jobs.push(function() {
			if (stateMachine.state === 'fail') {
				return deferred.reject(option.key);
			}
			deferred.resolve(getLanguage(option.key));
		});
		return deferred.promise;
	};
});