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


/*
 * Init application resources
 */
mblowfish.config(function($mbResourceProvider) {

	$mbResourceProvider
		.addPage('wb-url', {
			title: 'URL',
			icon: 'link',
			templateUrl: 'views/resources/wb-url.html',
			/*@ngInject*/
			controller: function($scope, $resource, $style) {
				var ctrl = this;
				$scope.url = $resource.getValue();
				if (!_.isString($scope.url)) {
					$scope.url = '';
				}
				function setUrl(url) {
					$resource.setValue(url);
				}
				_.assign(ctrl, {
					$style: $style,
					setUrl: setUrl
				});
			},
			controllerAs: 'ctrl',
			tags: [
				'url',
				'image-url',
				'vedio-url',
				'audio-url',
				'page-url',
				'avatar-url',
				'thumbnail-url'
			]
		})
		.addPage('local-file', {
			icon: 'file_upload',
			label: 'Local file',
			templateUrl: 'views/resources/mb-local-file.html',
			/*@ngInject*/
			controller: function($scope, $resource, $style) {
				var ctrl = this;
				function setFile(files) {
					var val;
					if (angular.isArray(files) && files.length) {
						val = files[0].lfFile;
					}
					$resource.setValue(val);
				}
				$scope.files = [];
				$scope.$watch('files.length', function() {
					setFile($scope.files);
				});
				_.assign(ctrl, {
					$style: $style,
					setFile: setFile
				});
			},
			controllerAs: 'ctrl',
			priority: 1,
			tags: ['file']
		})
		.addPage('local-files', {
			icon: 'file_upload',
			label: 'Local files',
			templateUrl: 'views/resources/mb-local-files.html',
			/*@ngInject*/
			controller: function($scope, $resource, $style) {
				var ctrl = this;
				function setFiles(files) {
					var vals = [];
					_.forEach(files, function(file){
						vals.push(file.lfFile);
					});
					$resource.setValue(vals);
				}
				$scope.files = [];
				$scope.$watch('files.length', function() {
					setFiles($scope.files);
				});
				_.assign(ctrl, {
					$style: $style,
					setFiles: setFiles
				});
			},
			controllerAs: 'ctrl',
			priority: 1,
			tags: ['files']
		});
	//		.addPage({
	//			type: 'script',
	//			icon: 'script',
	//			label: 'Script',
	//			templateUrl: 'views/resources/wb-event-code-editor.html',
	//			/*
	//			 * @ngInject
	//			 */
	//			controller: function($scope, $window, $element) {
	//				var ctrl = this;
	//				this.value = $scope.value || {
	//					code: '',
	//					language: 'javascript',
	//					languages: [{
	//						text: 'HTML/XML',
	//						value: 'markup'
	//					},
	//					{
	//						text: 'JavaScript',
	//						value: 'javascript'
	//					},
	//					{
	//						text: 'CSS',
	//						value: 'css'
	//					}]
	//				};
	//				this.setCode = function(code) {
	//					this.value.code = code;
	//					$scope.$parent.setValue(this.value);
	//				};
	//
	//				this.setLanguage = function(language) {
	//					this.value.code = language;
	//					$scope.$parent.setValue(this.value);
	//				};
	//
	//				this.setEditor = function(editor) {
	//					this.editor = editor;
	//					editor.setOptions({
	//						enableBasicAutocompletion: true,
	//						enableLiveAutocompletion: true,
	//						showPrintMargin: false,
	//						maxLines: Infinity,
	//						fontSize: '100%'
	//					});
	//					$scope.editor = editor;
	//					//              editor.setTheme('resources/libs/ace/theme/chrome');
	//					//              editor.session.setMode('resources/libs/ace/mode/javascript');
	//					editor.setValue(ctrl.value.code || '');
	//					editor.on('change', function() {
	//						ctrl.setCode(editor.getValue());
	//					});
	//				};
	//
	//				//          var ctrl = this;
	//				$window.loadLibrary('//cdn.viraweb123.ir/api/v2/cdn/libs/ace@1.4.8/src-min/ace.js')
	//					.then(function() {
	//						ctrl.setEditor(ace.edit($element.find('div#am-wb-resources-script-editor')[0]));
	//					});
	//			},
	//			controllerAs: 'ctrl',
	//			tags: ['code', 'script']
	//		});

	//	function getDomain() {
	//		return $location.protocol() + //
	//			'://' + //
	//			$location.host() + //
	//			(($location.port() ? ':' + $location.port() : ''));
	//	}
	//
	//	//  TODO: maso, 2018: replace with class
	//	function getSelection() {
	//		if (!this.__selections) {
	//			this.__selections = angular.isArray(this.value) ? this.value : [];
	//		}
	//		return this.__selections;
	//	}
	//
	//	function getIndexOf(list, item) {
	//		if (!angular.isDefined(item.id)) {
	//			return list.indexOf(item);
	//		}
	//		for (var i = 0; i < list.length; i++) {
	//			if (list[i].id === item.id) {
	//				return i;
	//			}
	//		}
	//	}
	//
	//	function setSelected(item, selected) {
	//		var selectionList = this.getSelection();
	//		var index = getIndexOf(selectionList, item);
	//		if (selected) {
	//			// add to selection
	//			if (index >= 0) {
	//				return;
	//			}
	//			selectionList.push(item);
	//		} else {
	//			// remove from selection
	//			if (index > -1) {
	//				selectionList.splice(index, 1);
	//			}
	//		}
	//	}
	//
	//	function isSelected(item) {
	//		var selectionList = this.getSelection();
	//		return getIndexOf(selectionList, item) >= 0;
	//	}
	//
	//
	//	/**
	//	 * @ngdoc Resources
	//	 * @name Account
	//	 * @description Get an account from resource
	//	 *
	//	 * Enable user to select an account
	//	 */
	//	$mbResourceProvider
	//		.addPage({
	//			label: 'Account',
	//			type: 'account',
	//			templateUrl: 'views/resources/mb-accounts.html',
	//			/*
	//			 * @ngInject
	//			 */
	//			controller: function($scope) {
	//				// TODO: maso, 2018: load selected item
	//				$scope.multi = false;
	//				this.value = $scope.value;
	//				this.setSelected = function(item) {
	//					$scope.$parent.setValue(item);
	//					$scope.$parent.answer();
	//				};
	//				this.isSelected = function(item) {
	//					return item === this.value || item.id === this.value.id;
	//				};
	//			},
	//			controllerAs: 'resourceCtrl',
	//			priority: 8,
	//			tags: ['account']
	//		})
	//		.addPage({
	//			label: 'Account',
	//			type: 'account id',
	//			templateUrl: 'views/resources/mb-accounts.html',
	//			/*
	//			 * @ngInject
	//			 */
	//			controller: function($scope) {
	//				// TODO: maso, 2018: load selected item
	//				$scope.multi = false;
	//				this.value = $scope.value;
	//				this.setSelected = function(item) {
	//					$scope.$parent.setValue(item.id);
	//					$scope.$parent.answer();
	//				};
	//				this.isSelected = function(item) {
	//					return item.id === this.value;
	//				};
	//			},
	//			controllerAs: 'resourceCtrl',
	//			priority: 8,
	//			tags: ['account_id', 'owner_id']
	//		})
	//		.addPage({
	//			label: 'Accounts',
	//			type: 'account-list',
	//			templateUrl: 'views/resources/mb-accounts.html',
	//			/*
	//			 * @ngInject
	//			 */
	//			controller: function($scope) {
	//				// TODO: maso, 2018: load selected item
	//				$scope.multi = true;
	//				this.value = $scope.value;
	//				this.setSelected = function(item, selected) {
	//					this._setSelected(item, selected);
	//					$scope.$parent.setValue(this.getSelection());
	//				};
	//				this._setSelected = setSelected;
	//				this.isSelected = isSelected;
	//				this.getSelection = getSelection;
	//			},
	//			controllerAs: 'resourceCtrl',
	//			priority: 8,
	//			tags: ['accounts', '/user/accounts']
	//		})
	//		.addPage({
	//			label: 'Role List',
	//			type: 'role-list',
	//			templateUrl: 'views/resources/mb-roles.html',
	//			/*
	//			 * @ngInject
	//			 */
	//			controller: function($scope) {
	//				// TODO: maso, 2018: load selected item
	//				$scope.multi = true;
	//				this.value = $scope.value;
	//				this.setSelected = function(item, selected) {
	//					this._setSelected(item, selected);
	//					$scope.$parent.setValue(this.getSelection());
	//				};
	//				this._setSelected = setSelected;
	//				this.isSelected = isSelected;
	//				this.getSelection = getSelection;
	//			},
	//			controllerAs: 'resourceCtrl',
	//			priority: 8,
	//			tags: ['roles', '/user/roles']
	//		})
	//		.addPage({
	//		label: 'Group List',
	//		type: 'group-list',
	//		templateUrl: 'views/resources/mb-groups.html',
	//		/*
	//		 * @ngInject
	//		 */
	//		controller: function($scope) {
	//			// TODO: maso, 2018: load selected item
	//			$scope.multi = true;
	//			this.value = $scope.value;
	//			this.setSelected = function(item, selected) {
	//				this._setSelected(item, selected);
	//				$scope.$parent.setValue(this.getSelection());
	//			};
	//			this._setSelected = setSelected;
	//			this.isSelected = isSelected;
	//			this.getSelection = getSelection;
	//		},
	//		controllerAs: 'resourceCtrl',
	//		priority: 8,
	//		tags: ['groups']
	//	})
	//	.addPage({
	//		type: 'local-file',
	//		icon: 'file_upload',
	//		label: 'Local file',
	//		templateUrl: 'views/resources/mb-local-file.html',
	//		/*
	//		 * @ngInject
	//		 */
	//		controller: function($scope, $q, style) {
	//			var ctrl = this;
	//			$scope.style = style;
	//			$scope.answer = function() {
	//				if (angular.isArray(ctrl.files) && ctrl.files.length) {
	//					return $q.resolve(ctrl.files[0].lfFile);
	//				}
	//				return $q.reject('No file selected');
	//			};
	//		},
	//		controllerAs: 'resourceCtrl',
	//		priority: 1,
	//		tags: ['local-file']
	//	});
	//
	//
	//
	//	//-------------------------------------------------------------//
	//	// CMS:
	//	//
	//	// - Term Taxonomies
	//	//-------------------------------------------------------------//
	//	$mbResource.addPage({
	//		label: 'Term Taxonomies',
	//		type: '/cms/term-taxonomies',
	//		templateUrl: 'views/resources/mb-term-taxonomies.html',
	//		/*
	//		 * @ngInject
	//		 */
	//		controller: function($scope) {
	//			$scope.multi = true;
	//			this.value = $scope.value;
	//			this.setSelected = function(item, selected) {
	//				this._setSelected(item, selected);
	//				$scope.$parent.setValue(this.getSelection());
	//			};
	//			this._setSelected = setSelected;
	//			this.isSelected = isSelected;
	//			this.getSelection = getSelection;
	//		},
	//		controllerAs: 'resourceCtrl',
	//		priority: 8,
	//		tags: ['/cms/term-taxonomies']
	//	});
});
