/*
 * Copyright (c) 2015 Phoenix Scholars Co. (http://dpq.co.ir)
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
@ngdoc directive
@name mb-toolbar-group
@description An ancher to load a list of toolbars

This is used to add a toolbar into the view.

It is not possible to add a toolbar with aa specific url into the view more than one time.

@example
	<mb-toolbar-group
		mb-urls="/app/main,/app/editor/save,/app/print">
	</mb-toolbar-group>


 */
angular.module('mblowfish-core').directive('mbToolbarGroup', function($mbToolbar) {


	function link($scope, $element, $attr, $ctrl) {
		// 1- load toolbars
//		var toolbarIds = $attr.mbUrls || '/app/toolbar';
		var toolbarIds = [];
		_.forEach(toolbarIds, function(toolbarId){
			var toolbar = $mbToolbar.getToolbar(toolbarId);
			if(toolbar){
				$ctrl.addToolbar(toolbar);
			} else {
				// TODO: maso, 2020: add a log to show the error
			}
		})
		
		// 2- register toolbar group
		$mbToolbar.addToolbarGroup($attr.mbUrl, $ctrl);
		if(!_.isUndefined($attr.mbDefault)){
			$mbToolbar.setMainToolbarGroup($ctrl);
		}
		
		$scope.$on('$destroy', function(){
			$ctrl.destroy();
		});
	}

	return {
		restrict: 'E',
		replace: false,
		priority: 400,
		require: 'mbToolbarGroup',
		/* @ngInject */
		controller: function($scope, $element) {
			this.handlers = {};
			
			this.addToolbar = function(toolbar){
				if(!_.isUndefined(this.handler[toolbar.url])){
					// FIXME: log and throw exception: the toolbar is added befor
					return;
				}
				var locals = {
					$rootScope: $scope,
					$parent: this
				};
				var handler = toolbar.render(locals);
				this.handlers.push(handler);
			};
			
			this.removeToolbar = function(toolbar){
				if(_.isUndefined(this.handler[toolbar.url])){
					// TODO: maso, 2020: toolbar not exist, add a warning log
					return;
				}
				var handler = this.handler[toolbar.url];
				delete this.handler[toolbar.url];
				handler.destroy();
			};
			
			this.destoy = function(){
				var handlers = this.handlers;
				_.forEach(handlers, function(handler){
					handler.destroy();
				});
				delete this.handler;
				$element.remove();
				// FIXME: maso, 2020: check if the scope is destroyed before
				$scope.$destroy();
			};
		},
		controllerAs: 'ctrl',
		link: link
	};
});
