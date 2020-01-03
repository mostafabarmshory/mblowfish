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


angular.module('mblowfish-core')

/**
 * @ngdoc Controllers
 * @name MbHelpCtrl
 * @description Help page controller
 * 
 * Watches total system and update help data.
 * 
 */
.controller('MbHelpCtrl', function($scope, $rootScope, $route, $http, $translate, $help, $wbUtil) {
    $rootScope.showHelp = false;
    var lastLoaded;


    /**
     * load help content for the item
     * 
     * @name loadHelpContent
     * @memberof MbHelpCtrl
     * @params item {object} an item to display help for
     */
    function _loadHelpContent(item) {
        if($scope.helpLoading){
            // maso, 2018: cancle old loading
            return $scope.helpLoading;
        }
        var path = $help.getHelpPath(item);
        // load content
        if(path && path !== lastLoaded){
            $scope.helpLoading = $http.get(path) //
            .then(function(res) {
                $scope.helpContent = $wbUtil.clean(res.data);
                lastLoaded = path;
            })//
            .finally(function(){
                $scope.helpLoading = false;
            });
        }
        return $scope.helpLoading;
    }

    $scope.closeHelp = function(){
        $rootScope.showHelp = false;
    };

    /*
     * If user want to display help, content will be loaded.
     */
    $scope.$watch('showHelp', function(value){
        if(value) {
            return _loadHelpContent();
        }
    });

    /*
     * Watch for current item in help service
     */
    $scope.$watch(function(){
        return $help.currentItem();
    }, function() {
        if ($rootScope.showHelp) {
            _loadHelpContent();
        }
    });
});