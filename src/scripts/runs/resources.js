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
 * Init application resources
 */
.run(function ($resource, $location, $controller) {

	function getDomain() {
		return $location.protocol() + //
		'://' + //
		$location.host() + //
		(($location.port() ? ':' + $location.port() : ''));
	}

//	TODO: maso, 2018: replace with class
	function getSelection() {
		if (!this.__selections) {
			this.__selections = angular.isArray(this.value) ? this.value : [];
		}
		return this.__selections;
	}

	function getIndexOf(list, item) {
		if (!angular.isDefined(item.id)) {
			return list.indexOf(item);
		}
		for (var i = 0; i < list.length; i++) {
			if (list[i].id === item.id) {
				return i;
			}
		}
	}

	function setSelected(item, selected) {
		var selectionList = this.getSelection();
		var index = getIndexOf(selectionList, item);
		if (selected) {
			// add to selection
			if (index >= 0) {
				return;
			}
			selectionList.push(item);
		} else {
			// remove from selection
			if (index > -1) {
				selectionList.splice(index, 1);
			}
		}
	}

	function isSelected(item) {
		var selectionList = this.getSelection();
		return getIndexOf(selectionList, item) >= 0;
	}


	/**
	 * @ngdoc Resources
	 * @name Account
	 * @description Get an account from resource
	 *
	 * Enable user to select an account
	 */
	$resource.newPage({
		label: 'Account',
		type: 'account',
		templateUrl: 'views/resources/mb-accounts.html',
		/*
		 * @ngInject
		 */
		controller: function ($scope) {
			// TODO: maso, 2018: load selected item
			$scope.multi = false;
			this.value = $scope.value;
			this.setSelected = function (item) {
				$scope.$parent.setValue(item);
				$scope.$parent.answer();
			};
			this.isSelected = function (item) {
				return item === this.value || item.id === this.value.id;
			};
		},
		controllerAs: 'resourceCtrl',
		priority: 8,
		tags: ['account']
	});

	/**
	 * @ngdoc Resources
	 * @name Accounts
	 * @description Gets list of accounts
	 *
	 * Display a list of accounts and allow user to select them.
	 */
	$resource.newPage({
		label: 'Accounts',
		type: 'account-list',
		templateUrl: 'views/resources/mb-accounts.html',
		/*
		 * @ngInject
		 */
		controller: function ($scope) {
			// TODO: maso, 2018: load selected item
			$scope.multi = true;
			this.value = $scope.value;
			this.setSelected = function (item, selected) {
				this._setSelected(item, selected);
				$scope.$parent.setValue(this.getSelection());
			};
			this._setSelected = setSelected;
			this.isSelected = isSelected;
			this.getSelection = getSelection;
		},
		controllerAs: 'resourceCtrl',
		priority: 8,
		tags: ['accounts']
	});

	// Resource for role-list
	$resource.newPage({
		label: 'Role List',
		type: 'role-list',
		templateUrl: 'views/resources/mb-roles.html',
		/*
		 * @ngInject
		 */
		controller: function ($scope) {
			// TODO: maso, 2018: load selected item
			$scope.multi = true;
			this.value = $scope.value;
			this.setSelected = function (item, selected) {
				this._setSelected(item, selected);
				$scope.$parent.setValue(this.getSelection());
			};
			this._setSelected = setSelected;
			this.isSelected = isSelected;
			this.getSelection = getSelection;
		},
		controllerAs: 'resourceCtrl',
		priority: 8,
		tags: ['roles']
	});


	// Resource for group-list
	$resource.newPage({
		label: 'Group List',
		type: 'group-list',
		templateUrl: 'views/resources/mb-groups.html',
		/*
		 * @ngInject
		 */
		controller: function ($scope) {
			// TODO: maso, 2018: load selected item
			$scope.multi = true;
			this.value = $scope.value;
			this.setSelected = function (item, selected) {
				this._setSelected(item, selected);
				$scope.$parent.setValue(this.getSelection());
			};
			this._setSelected = setSelected;
			this.isSelected = isSelected;
			this.getSelection = getSelection;
		},
		controllerAs: 'resourceCtrl',
		priority: 8,
		tags: ['groups']
	});


	/**
	 * @ngdoc WB Resources
	 * @name cms-content-image
	 * @description Load an Image URL from contents
	 */
	$resource.newPage({
		type: 'cms-content-image',
		icon: 'image',
		label: 'Images',
		templateUrl: 'views/resources/mb-cms-images.html',
		/*
		 * @ngInject
		 */
		controller: function ($scope) {

			/*
			 * Extends collection controller
			 */
			angular.extend(this, $controller('AmWbSeenCmsContentsCtrl', {
				$scope: $scope
			}));

			/**
			 * Sets the absolute mode
			 *
			 * @param {boolean}
			 *            absolute mode of the controler
			 */
			this.setAbsolute = function (absolute) {
				this.absolute = absolute;
			}

			/**
			 * Checks if the mode is absolute
			 *
			 * @return absolute mode of the controller
			 */
			this.isAbsolute = function () {
				return this.absolute;
			}

			/*
			 * Sets value
			 */
			this.setSelected = function (content) {
				var path = '/api/v2/cms/contents/' + content.id + '/content';
				if (this.isAbsolute()) {
					path = getDomain() + path;
				}
				this.value = path;
				$scope.$parent.setValue(path);
			}

			// init the controller
			this.init()
		},
		controllerAs: 'ctrl',
		priority: 10,
		tags: ['image', 'url', 'image-url']
	});
	// TODO: maso, 2018: Add video resource
	// TODO: maso, 2018: Add audio resource

	/**
	 * @ngdoc WB Resources
	 * @name content-upload
	 * @description Upload a content and returns its URL
	 */
	$resource.newPage({
		type: 'content-upload',
		icon: 'file_upload',
		label: 'Upload',
		templateUrl: 'views/resources/mb-cms-content-upload.html',
		/*
		 * @ngInject
		 */
		controller: function ($scope, $cms, $translate, uuid4) {

			/*
			 * Extends collection controller
			 */
			angular.extend(this, $controller('AmWbSeenCmsContentsCtrl', {
				$scope: $scope
			}));

			this.absolute = false;
			this.files = [];

			/**
			 * Sets the absolute mode
			 *
			 * @param {boolean}
			 *            absolute mode of the controler
			 */
			this.setAbsolute = function (absolute) {
				this.absolute = absolute;
			}

			/**
			 * Checks if the mode is absolute
			 *
			 * @return absolute mode of the controller
			 */
			this.isAbsolute = function () {
				return this.absolute;
			}

			/*
			 * Add answer to controller
			 */
			var ctrl = this;
			$scope.answer = function () {
				// create data
				var data = {};
				data.name = this.name || uuid4.generate();
				data.description = this.description || 'Auto loaded content';
				var file = null;
				if (angular.isArray(ctrl.files) && ctrl.files.length) {
					file = ctrl.files[0].lfFile;
					data.title = file.name;
				}
				// upload data to server
				return ctrl.uploadFile(data, file)//
				.then(function (content) {
					var value = '/api/v2/cms/contents/' + content.id + '/content';
					if (ctrl.isAbsolute()) {
						value = getDomain() + value;
					}
					return value;
				})//
				.catch(function () {
					alert('Failed to create or upload content');
				});
			};
			// init the controller
			this.init();

			// re-labeling lf-ng-md-file component for multi languages support
			angular.element(function () {
				var elm = angular.element('.lf-ng-md-file-input-drag-text');
				if (elm[0]) {
					elm.text($translate.instant('Drag & Drop File Here'));
				}

				elm = angular.element('.lf-ng-md-file-input-button-brower');
				if (elm[0] && elm[0].childNodes[1] && elm[0].childNodes[1].data) {
					elm[0].childNodes[1].data = ' ' + $translate.instant('Browse');
				}

				elm = angular.element('.lf-ng-md-file-input-button-remove');
				if (elm[0] && elm[0].childNodes[1] && elm[0].childNodes[1].data) {
					elm[0].childNodes[1].data = $translate.instant('Remove');
				}

				elm = angular.element('.lf-ng-md-file-input-caption-text-default');
				if (elm[0]) {
					elm.text($translate.instant('Select File'));
				}
			});
		},
		controllerAs: 'ctrl',
		priority: 1,
		tags: ['image', 'audio', 'vedio', 'file', 'url', 'image-url']
	});




	/**
	 * @ngdoc WB Resources
	 * @name file-local
	 * @description Select a local file and return the object
	 * 
	 * This is used to select local file. It may be used in any part of the system. For example,
	 * to upload as content.
	 */
	$resource.newPage({
		type: 'local-file',
		icon: 'file_upload',
		label: 'Local file',
		templateUrl: 'views/resources/mb-local-file.html',
		/*
		 * @ngInject
		 */
		controller: function ($scope, $q, style) {
			var ctrl = this;
			$scope.style = style;
			$scope.answer = function () {
				if (angular.isArray(ctrl.files) && ctrl.files.length) {
					return $q.resolve(ctrl.files[0].lfFile);
				}
				return $q.reject('No file selected');
			};
		},
		controllerAs: 'resourceCtrl',
		priority: 1,
		tags: ['local-file']
	});



	//-------------------------------------------------------------//
	// CMS:
	//
	// - Term Taxonomies
	//-------------------------------------------------------------//
	$resource.newPage({
		label: 'Term Taxonomies',
		type: '/cms/term-taxonomies',
		templateUrl: 'views/resources/mb-term-taxonomies.html',
		/*
		 * @ngInject
		 */
		controller: function ($scope) {
			$scope.multi = true;
			this.value = $scope.value;
			this.setSelected = function (item, selected) {
				this._setSelected(item, selected);
				$scope.$parent.setValue(this.getSelection());
			};
			this._setSelected = setSelected;
			this.isSelected = isSelected;
			this.getSelection = getSelection;
		},
		controllerAs: 'resourceCtrl',
		priority: 8,
		tags: ['/cms/term-taxonomies']
	});

	//-------------------------------------------------------------//
	// Modules:
	//
	// - CMS module
	// - Manual module
	//-------------------------------------------------------------//
	$resource.newPage({
		label: 'Manual',
		type: 'mb-module-manual',
		templateUrl: 'views/resources/mb-module-manual.html',
		/*
		 * @ngInject
		 */
		controller: function ($scope) {
			$scope.$watch('module', function(value) {
				$scope.$parent.setValue([value]);
			}, true);
			$scope.module = _.isArray($scope.value) ? $scope.value[0] : $scope.value;
		},
		controllerAs: 'resourceCtrl',
		priority: 8,
		tags: ['/app/modules']
	});

	$resource.newPage({
		type: 'cms-content-module',
		icon: 'image',
		label: 'On Domain Modules',
		templateUrl: 'views/resources/mb-module-cms.html',
		/*
		 * @ngInject
		 */
		controller: function ($scope) {

			/*
			 * Extends collection controller
			 */
			angular.extend(this, $controller('AmWbSeenCmsContentsCtrl', {
				$scope: $scope
			}));

			/*
			 * Sets value
			 */
			this.setSelected = function (content) {
				var modules = [{
					title: content.title,
					url: '/api/v2/cms/contents/' + content.name + '/content',
					type: content.mime_type === 'application/javascript' ? 'js' : 'css',
					load: $scope.load
				}];
				this.value = modules;
				$scope.$parent.setValue(modules);
			}

			// init the controller
			this.init();
		},
		controllerAs: 'ctrl',
		priority: 7,
		tags: ['/app/modules']
	});
});
