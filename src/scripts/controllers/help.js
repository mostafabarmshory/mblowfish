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

/**
 * @ngdoc controller
 * @name MbHelpCtrl
 * @description Help page controller
 * 
 */
.controller('MbHelpCtrl', function($scope, $rootScope, $route, $http, $translate, $mdUtil, $mdSidenav, $help) {
	$rootScope.showHelp = false;


	function _getHelpId(item) {
        if(!item){
            // TODO: maso, 2018: what if current item is null
            return;
        }
        var id = item.helpId;
        
        if (angular.isFunction(id)) {
            id = id(item);
        }

        if (!angular.isDefined(id)) {
            id = 'not-found';
        }
        return id;
	}
	
	/**
	 * load help content for the item
	 * 
	 * @name loadHelpContent
	 * @memberof MbHelpCtrl
	 * @params item {object} an item to display help for
	 */
	function _loadHelpContent(item) {
	    if($scope.helpLoading){
	        // TODO: maso, 2018: cancle old loading
	    }
	    var myId = _getHelpId(item);
		var lang = $translate.use() === 'fa' ? 'fa' : 'en';
		
		// load content
		return $scope.helpLoading = $http.get('resources/helps/' + myId + '-' + lang + '.json') //
		.then(function(res) {
			$scope.helpContent = res.data;
			$scope.helpLoaded = true;
		})//
		.finally(function(){
		    $scope.helpLoading = false;
		});
	}

	$scope.closeHelp = function(){
		$rootScope.showHelp = false;
//		$mdSidenav('help').close();
	}

	function buildToggler() {
		var debounceFn =  $mdUtil.debounce(function(){
			$mdSidenav('help').toggle();
		},300);
		return debounceFn;
	}

	/*
	 * If user want to display help, content will be loaded.
	 */
	$scope.$watch('showHelp', function(){
	    if($scope.showHelp && !$scope.helpLoaded){
	        return _loadHelpContent();
	    }
	});

	/*
	 * Watch for current item in help service
	 */
	$scope.$watch(function(){
	        return $help.currentItem();
	}, function(newValue){
	    $scope.helpLoaded = false;
	    return _loadHelpContent(newValue);
	});
});