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

import templateUrlDefault from './mbApplication-preloading-default.html';

/**
@ngdoc Services
@name $mbApplication
@description Application manager
	
The application service is responsible to:
	
- Loading Modules
- Loading Settings
- Loading locals
- Loading current user details
- Monitoring network state
- Monitoring current user state
	
These are required to load an applications.
*/
function mbApplicationProvider() {

	//-------------------------------------------------
	// Services
	//-------------------------------------------------
	var Job;
	var provider;
	var service;
	var q;
	var dispatcher,
		mbSettings;



	//-------------------------------------------------
	// Common jobs
	//-------------------------------------------------
	var loadSettingsJob = {
		title: 'Loading Application Settings',
		/* @ngInject */
		action: function($mbSettings) {
			return $mbSettings.load();
		}
	};

	var loadAccountDetail = {
		title: 'Loading Account Details',
		/* @ngInject */
		action: function($mbAccount) {
			return $mbAccount.reload();
		}
	};

	var forceAccountLogin = {
		title: 'Login',
		/* @ngInject */
		action: function(MbComponent, $rootElement, $mbAccount, $mbDispatcher) {
			loginComponent = new MbComponent(loginComponentConfig);
			var renderJob;
			function renderPanel() {
				var element = angular.element('<mb-login-panel></mb-login-panel>');
				$rootElement.append(element);
				return loginComponent
					.render({
						$element: element,
					})
					.finally(function() {
						renderJob = null;
					});
			}

			function destroy() {
				if (renderJob) {
					renderJob = renderJob
						.finally(function() {
							loginComponent.destroy();
						});
				} else {
					loginComponent.destroy();
				}
			}

			$mbDispatcher.on(MB_SECURITY_ACCOUNT_SP, function() {
				if ($mbAccount.isAnonymous()) {
					renderJob = renderPanel();
				} else {
					destroy();
				}
			});

			if ($mbAccount.isAnonymous()) {
				renderJob = renderPanel();
			}
			return renderJob;
		}
	};

	var loadPreloadingContainer = {
		title: 'Load Preloading View',
		/* @ngInject */
		action: function(MbComponent, $rootElement) {
			var element = angular.element('<mb-preloading-panel></mb-preloading-panel>');
			$rootElement.append(element);

			preloadingComponent = new MbComponent(preloadingComponentConfig);
			return preloadingComponent.render({
				$element: element
			});
		}
	};

	var removePreloadingContainer = {
		title: 'Remove Preloading View',
		/* @ngInject */
		action: function() {
			preloadingComponent.destroy();
		}
	};

	//-------------------------------------------------
	// Local Variables
	//-------------------------------------------------
	var key = 'mblowfish';
	var accountDetailRequired = false;
	var settingsRequired = true;
	var logingRequired = false;
	var loginComponentConfig = {
		template: '<h1>No login page</h1>',
	};
	var loginComponent;
	var settinsRequired = true;

	var STATE_INIT = 'init';
	var STATE_READY = 'ready';
	var state;
	/*
	List of actions must be run on the specific state.
	*/
	var actions = {
		init: [],
		ready: []
	}

	var preloadingEnabled = false;
	var preloadingComponent;
	var preloadingComponentConfig = {
		templateUrl: templateUrlDefault,
		controller: function() { },
		controllerAs: 'ctrl',
	};


	//---------------------------------------
	// Function
	//---------------------------------------
	function setKey(appkey) {
		key = appkey;
		return provider;
	}

	function getKey() {
		return key;
	}

	function setPreloadingEnabled(flag) {
		preloadingEnabled = flag;
		return provider;
	}

	function isPreloadingEnabled() {
		return preloadingEnabled;
	}

	function setPreloadingComponent(componentConfig) {
		preloadingComponentConfig = componentConfig;
		return provider;
	}

	function getPreloadingComponent() {
		return preloadingComponent;
	}

	function setLogingRequired(flag) {
		logingRequired = flag;
		return provider;
	}

	function isLoginRequired() {
		return logingRequired;
	}

	function setLoginComponent(componentConfig) {
		loginComponentConfig = componentConfig;
		return provider;
	}

	function setAccountDetailRequired(flag) {
		accountDetailRequired = flag;
		return provider;
	}

	function isAccountDetailRequired() {
		return accountDetailRequired;
	}

	function setSettingsRequired(flag) {
		settingsRequired = flag;
		return provider;
	}

	function isSettingsRequired() {
		return settingsRequired;
	}

	function addAction(state, action) {
		actions[state].push(action);
		return provider;
	}


	/**
	 * Gets the state of the application
	 * 
	 * @memberof $mbApplication
	 */
	function getState() {
		return state;
	}

	/**
	 * Sets state of the service
	 * 
	 * NOTE: must be used locally
	 */
	function setState(newState) {
		var oldState = state;
		state = newState;

		var stateActions = actions[state];
		var jobs = [];

		//>> Loading extra jobs
		_.forEach(stateActions, function(actionConfig) {
			var job = new Job(actionConfig);
			jobs.push(job.schedule());
		});

		//>> fire state changed
		var $event = {
			type: 'update',
			value: state,
			oldValue: oldState
		};
		dispatcher.dispatch('/app/state', $event);

		//>> Waiting for all job to done
		return q.all(jobs);
	}

	function load() {
		//>> Loading common jobs
		if (preloadingEnabled) {
			addAction(STATE_INIT, loadPreloadingContainer);
			addAction(STATE_READY, removePreloadingContainer);
		}
		if (settinsRequired) {
			addAction(STATE_INIT, loadSettingsJob);
		}
		if (accountDetailRequired || logingRequired) {
			addAction(STATE_INIT, loadAccountDetail);
		}
		if (logingRequired) {
			addAction(STATE_READY, forceAccountLogin);
		}
		return setState(STATE_INIT)
			.finally(function() {
				return setState(STATE_READY);
			});
	}


	//---------------------------------------
	// End
	//---------------------------------------
	service = {
		getKey: getKey,
		isPreloadingEnabled: isPreloadingEnabled,
		getPreloadingComponent: getPreloadingComponent,
		isLoginRequired: isLoginRequired,
		isAccountDetailRequired: isAccountDetailRequired,
		isSettingsRequired: isSettingsRequired,
		getState: getState,
	};
	provider = {
		/* @ngInject */
		$get: function($q, $mbSettings, MbJob, $mbDispatcher) {
			//>> Set services
			mbSettings = $mbSettings;
			q = $q;
			Job = MbJob;
			dispatcher = $mbDispatcher;

			//>> Load application
			load();

			//>> ENd
			return service;
		},
		setKey: setKey,
		addAction: addAction,
		setPreloadingEnabled: setPreloadingEnabled,
		setPreloadingComponent: setPreloadingComponent,
		setAccountDetailRequired: setAccountDetailRequired,
		setSettingsRequired: setSettingsRequired,
		setLogingRequired: setLogingRequired,
		setLoginComponent: setLoginComponent,
	};
	return provider;
};

export default mbApplicationProvider;
