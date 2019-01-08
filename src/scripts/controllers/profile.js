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
 * @name MbProfileCtrl
 * @description  Manages profile of a user
 * 
 */
.controller('MbProfileCtrl', function ($scope, $rootScope, $translate, $window, UserProfile) {

    var ctrl = {
            user: null,
            profile: null,
            loadingProfile: false,
            savingProfile: false
    };

    /**
     * Loads user data
     * @returns
     */
    function loadUser() {
        ctrl.user = $rootScope.app.user.current;//
        if (!ctrl.user) {
            alert($translate.instant('Fail to load user.'));
        } else {
            loadProfile(ctrl.user);
        }
    }

    function loadProfile(usr) {
        if (ctrl.loadinProfile) {
            return;
        }
        ctrl.loadingProfile = true;
        return usr.getProfiles()//
        .then(function (profiles) {
            ctrl.profile = angular.isDefined(profiles.items[0]) ? profiles.items[0] : new UserProfile();
            return ctrl.profile;
        }, function () {
            alert($translate.instant('Fial to load profile.'));
        })//
        .finally(function () {
            ctrl.loadingProfile = false;
        });
    }

    /**
     * Save current user
     * 
     * @returns
     */
    function save() {
        if (ctrl.savingProfile) {
            return;
        }
        ctrl.savingProfile = true;
        var $promise = angular.isDefined(ctrl.profile.id) ? ctrl.profile.update() : ctrl.user.putProfile(ctrl.profile);
        return $promise//
        .then(function () {
            toast($translate.instant('Save is successfull.'));
        }, function () {
            alert($translate.instant('Fail to save item.'));
        })//
        .finally(function () {
            ctrl.savingProfile = false;
        });
    }

    function back() {
        $window.history.back();
    }

    $scope.ctrl = ctrl;
    $scope.load = loadUser;
    $scope.reload = loadUser;
    $scope.save = save;
    $scope.back = back;
    $scope.cancel = back;

    loadUser();

});
