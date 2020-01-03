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
 * @ngdoc Directives
 * @name mb-inline
 * @description Inline editing field
 */
.directive('mbInline', function($q, $parse, $resource) {

    /**
     * Link data and view
     */
    function postLink(scope, elem, attr, ctrls) {

        var ngModel = ctrls[1];
        var ctrl = ctrls[0];

        scope.myDataModel = {};
        scope.errorObject = {};
        
        scope.mbInlineType = attr.mbInlineType;
        scope.mbInlineLabel = attr.mbInlineLabel;
        scope.mbInlineDescription = attr.mbInlineDescription;
        
        scope.$watch(attr.mbInlineEnable, function(value){
            scope.mbInlineEnable = value;
        });
        scope.$watch(attr.mbInlineSaveButton, function(value){
            scope.mbInlineSaveButton = value;
        });
        scope.$watch(attr.mbInlineCancelButton, function(value){
            scope.mbInlineCancelButton = value;
        });

        ngModel.$render = function(){
            ctrl.model = ngModel.$viewValue;
        };

        ctrl.saveModel = function(d){
            ngModel.$setViewValue(d);
            if(attr.mbInlineOnSave){
                scope.$data = d;
                var value = $parse(attr.mbInlineOnSave)(scope);
                $q.when(value)//
                .then(function(){
                    scope.errorObject = {
                            'error': false,
                            'errorMessage' : null
                    };
                }, function(error){
                    scope.errorObject = {
                            'error': true,
                            'errorMessage': val
                    };
                });
            }
        };
    }

    return {
        restrict : 'E',
        transclude : true,
        replace: true,
        require: ['mbInline', '^ngModel'],
        scope: true,
        /*
         * @ngInject
         */
        controller: function($scope){
            this.edit = function(){
                this.editMode = true;
            };

            this.setEditMode = function(editMode){
                this.editMode = editMode;
            };

            this.getEditMode = function(){
                return this.editMode;
            };

            this.save = function(){
                this.saveModel(this.model);
                this.setEditMode(false);
            };

            this.cancel = function(){
                this.setEditMode(false);
            };


            /*
             * Select image url
             */
            this.updateImage = function(){
                if(!$scope.mbInlineEnable){
                    return;
                }
                var ctrl = this;
                return $resource.get('image', {
                    style : {
                        icon: 'image',
                        title : $scope.mbInlineLabel || 'Select image',
                        description: $scope.mbInlineDescription || 'Select a file from resources to change current image'
                    },
                    data : this.model
                }) //
                .then(function(url){
                    ctrl.model = url;
                    ctrl.save();
                });
            };
        },
        controllerAs: 'ctrlInline',
        templateUrl : 'views/directives/mb-inline.html',
        link: postLink
    };
});
