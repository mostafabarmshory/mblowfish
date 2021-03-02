/*
 * angular-material-icons v0.7.1
 * (c) 2014 Klar Systems
 * License: MIT
 */

/**
 * @ngdoc Services
 * @name $mbSidenav
 * @description Manage sidenaves and drowver
 * 
 */
function mbSidenav() {
	var Sidenav;

	var provider;
	var service;

	var configs = {};
	var sidenavConfigs = {};
	var sidenavs = {};
	var rootElement = undefined,
		mdSidenav;

	function addSidenavConfig(sidenavId, config) {
		sidenavConfigs[sidenavId] = config;
		return provider;
	}

	function renderAllSidenavs() {
		if (_.isUndefined(rootElement)) {
			return;
		}
		_.forEach(sidenavs, function(sidenav, id) {
			if (!sidenav.isVisible()) {
				// XXX: maso, 2020: support left, right
				var element = angular.element('<md-sidenav class="md-sidenav-left" ' +
					' md-component-id="' + id + '"' +
					'md-is-locked-open="' + sidenav.locked + '"' +
					'md-whiteframe="4"></md-sidenav>');
				// rootElement.append(element);
				rootElement.prepend(element);
				sidenav.render({
					$element: element,
				});
			}
		});
	}

	function loadSidenavs() {
		_.forEach(sidenavConfigs, function(config, id) {
			config.url = id;
			var sidenav = new Sidenav(config);
			addSidenav(id, sidenav);
		});
	}

	function addSidenav(sidenavId, sidenav) {
		sidenavs[sidenavId] = sidenav;
		renderAllSidenavs();
		return service;
	}

	function getSidenav(sidenavId) {
		return sidenavs[sidenavId];
	}

	function removeSidenav(sidenavId) {
		var sidenav = sidenavs[sidenavId];
		if (sidenav) {
			sidenav.destroy();
		}
		delete sidenavs[sidenavId];
		return service;
	}

	provider = {
		/* @ngInject */
		$get: function($mdSidenav, MbSidenav) {
			mdSidenav = $mdSidenav;
			Sidenav = MbSidenav;

			loadSidenavs();

			this.addSidenav = addSidenav;
			this.getSidenav = getSidenav;
			this.removeSidenav = removeSidenav;
			this.setRootElement = function(element) {
				rootElement = element;
				renderAllSidenavs();
			};

			return this;
		},
		init: function(sidenavProvider) {
			configs = sidenavProvider;
			_.forEach(configs.items || {}, function(config, url) {
				addSidenavConfig(url, config);
			});
		},
		addSidenav: addSidenavConfig
	};
	return provider;
}

export default mbSidenav;
