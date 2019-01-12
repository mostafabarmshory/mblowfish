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
 * @ngdoc Controllers
 * @name AmdRolesCtrl
 * @description Manages list of roles
 * 
 * 
 */
.controller('MbRolesCtrl', function ($scope, $usr, $q, $controller) {
    angular.extend(this, $controller('MbItemsCtrl', {
        $scope : $scope
    }));

    // Override the function
    this.getSchema = function () {
        return $usr.roleSchema();
    };
    // get accounts
    this.getItems = function (parameterQuery) {
        return $usr.getRoles(parameterQuery);
    };
    // get an account
    this.getItem = function (id) {
        return $usr.getRole(id);
    };
    // Add item
    this.addItem = function () {
        return $usr.newRole(item);
    };
    // delete account
    this.deleteItem = function (item) {
        return $usr.deleteRole(item.id);
    };

    this.init();
});
