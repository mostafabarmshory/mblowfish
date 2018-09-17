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
.run(function($resource) {

//  TODO: maso, 2018: replace with class
    function getSelection(){
        if(!this.__selections){
            this.__selections = angular.isArray(this.value) ? this.value : [];
        }
        return this.__selections;
    }

    function getIndexOf(list, item) {
        if(!angular.isDefined(item.id)) {
            return list.indexOf(item);
        }
        for(var i = 0; i < list.length; i++){
            if(list[i].id === item.id){
                return i;
            }
        }
    }

    function setSelected(item, selected) {
        var selectionList = this.getSelection();
        var index = getIndexOf(selectionList,item);
        if(selected) {
            // add to selection
            if(index >= 0){
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

    function isSelected(item){
        var selectionList = this.getSelection();
        return getIndexOf(selectionList,item) >= 0;
    }




    /**
     * @ngdoc Resources
     * @name Account
     * @description Get an account from resource
     * 
     * Enable user to select an account
     */
    $resource.newPage({
        label : 'Account',
        type : 'account',
        templateUrl : 'views/resources/mb-accounts.html',
        /*
         * @ngInject
         */
        controller : function($scope) {
            // TODO: maso, 2018: load selected item
            $scope.multi = false;
            this.value = $scope.value;
            this.setSelected = function(item) {
                $scope.$parent.setValue(item);
            };
            this.isSelected = function(item){
                return item === this.value || item.id === this.value.id;
            };
        },
        controllerAs : 'resourceCtrl',
        priority : 8,
        tags : [ 'account' ]
    });

    /**
     * @ngdoc Resources
     * @name Accounts
     * @description Gets list of accounts
     * 
     * Display a list of accounts and allow user to select them.
     */
    $resource.newPage({
        label : 'Accounts',
        type : 'account-list',
        templateUrl : 'views/resources/mb-accounts.html',
        /*
         * @ngInject
         */
        controller : function($scope) {
            // TODO: maso, 2018: load selected item
            $scope.multi = true;
            this.value = $scope.value;
            this.setSelected = function(item, selected) {
                this._setSelected(item, selected);
                $scope.$parent.setValue(this.getSelection());
            };
            this._setSelected = setSelected;
            this.isSelected = isSelected;
            this.getSelection = getSelection;
        },
        controllerAs : 'resourceCtrl',
        priority : 8,
        tags : [ 'accounts' ]
    });

    // Resource for role-list
    $resource.newPage({
        label : 'Role List',
        type : 'role-list',
        templateUrl : 'views/resources/mb-roles.html',
        /*
         * @ngInject
         */
        controller : function($scope) {
            // TODO: maso, 2018: load selected item
            $scope.multi = true;
            this.value = $scope.value;
            this.setSelected = function(item, selected) {
                this._setSelected(item, selected);
                $scope.$parent.setValue(this.getSelection());
            };
            this._setSelected = setSelected;
            this.isSelected = isSelected;
            this.getSelection = getSelection;
        },
        controllerAs : 'resourceCtrl',
        priority : 8,
        tags : [ 'roles' ]
    });


    // Resource for group-list
    $resource.newPage({
        label : 'Group List',
        type : 'group-list',
        templateUrl : 'views/resources/mb-groups.html',
        /*
         * @ngInject
         */
        controller : function($scope) {
            // TODO: maso, 2018: load selected item
            $scope.multi = true;
            this.value = $scope.value;
            this.setSelected = function(item, selected) {
                this._setSelected(item, selected);
                $scope.$parent.setValue(this.getSelection());
            };
            this._setSelected = setSelected;
            this.isSelected = isSelected;
            this.getSelection = getSelection;
        },
        controllerAs : 'resourceCtrl',
        priority : 8,
        tags : [ 'groups' ]
    });

});