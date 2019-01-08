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
 * @description Manages profile of a user
 * 
 */
.controller('MbProfileCtrl', function ($scope, $rootScope, $translate, $window, UserProfile) {
    
    // set initial data
    this.user = null;
    this.profile = null;
    this.loadingProfile = false;
    this.savingProfile = false;

    /*
     * - normal
     * - edit
     */
    this.avatarState = 'normal';

    /**
     * Loads user data
     * 
     * @returns
     */
    this.loadUser = function() {
        this.user = $rootScope.app.user.current;//
        if (!this.user) {
            alert($translate.instant('Fail to load user.'));
            return;
        }
        this.loadProfile();
    }

    this.loadProfile = function() {
        if (this.loadinProfile) {
            return;
        }
        this.loadingProfile = true;
        var ctrl = this;
        return this.user.getProfiles()//
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
    this.save = function() {
        if (this.savingProfile) {
            return;
        }
        this.savingProfile = true;
        var $promise = angular.isDefined(ctrl.profile.id) ? ctrl.profile.update() : ctrl.user.putProfile(ctrl.profile);
        var ctrl = this;
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

    this.back = function() {
        $window.history.back();
    }
    
    this.deleteAvatar = function(){
        var ctrl = this;
        confirm('Delete the avatar?')
        .then(function(){
            ctrl.avatarState = 'working';
            return ctrl.user.deleteAvatar();
        })
        .finally(function(){
            ctrl.avatarState = 'normal';
        });
    }
    
    this.uploadAvatar = function(files){
        if (!angular.isArray(files) || !files.length) {
        }
        var file = null;
        file = files[0].lfFile;
        this.avatarLoading = true;
        var ctrl = this;
        this.user.uploadAvatar(file)
        .then(function(){
            // TODO: reload the page
        })
        .finally(function(){
            ctrl.avatarLoading = false;
            ctrl.avatarState = 'normal';
        });
    }
    
    this.editAvatar = function(){
        this.avatarState = 'edit';
    }
    
    this.cancelEditAvatar = function(){
        this.avatarState = 'normal';
    }

    /*
     * To support old version of the controller
     */
    var ctrl = this;
    $scope.load = function(){
        ctrl.loadUser();
    };
    $scope.reload = function(){
        ctrl.loadUser();
    };
    $scope.save = function(){
        ctrl.save();
    };
    $scope.back = function(){
        ctrl.back();
    };
    $scope.cancel =  function(){
        ctrl.back();
    };
    
    // Load account information
    this.loadUser();
});
