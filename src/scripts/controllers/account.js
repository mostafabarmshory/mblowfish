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
 * @name MbAccountCtrl
 * @description Manages the current user.
 * 
 * Manages current user action
 */
.controller('MbAccountCtrl', function($scope, $app, $navigator, $usr, $window) {

    /*
     * Store controller state
     */
    var ctrl = {
            changingPassword: false
    };
    
    /**
     * Go to the default page
     * 
     * @name load
     * @memberof AmdAccountCtrl
     * @returns {promiss} to load user data
     */
    function goToDashboard() {
        // XXX: maso, 1395: ممکن هست این حالت وجود نداشته باشد
        $navigator.openPage('dashboard');
    }

    /**
     * Call login process for current user
     * 
     * @memberof AmdAccountCtrl
     * @name login
     * @param {object}
     *            cridet username and password
     * @param {string}
     *            cridet.login username
     * @param {stirng}
     *            cridig.password Password
     * @returns {promiss} to do the login
     */
    function login(cridet) {
        if(ctrl.loadUser){
            return;
        }
        ctrl.loadUser= true;
        return $app.login(cridet)//
        .catch(function(error) {
            ctrl.error = error;
        })//
        .finally(function(){
            ctrl.loadUser = false;
        });
    }


    /**
     * Loads user data
     * 
     * @name load
     * @memberof AmdAccountCtrl
     * @returns {promiss} to load user data
     */
    function loadUser(){
        if(ctrl.loadUser){
            return ctrl.loadUser;
        }
        ctrl.loadUser =  $usr.session()//
        .then(function(user){
        	ctrl.user = user;;
        }, function(error){
            ctrl.error = error;
        })//
        .finally(function(){
            ctrl .loadUser = false;
        });
        return ctrl.loadUser;
    }


    /**
     * Save current user
     * 
     * @name load
     * @memberof AmdAccountCtrl
     * @returns {promiss} to save
     */
    function saveUser(){
        if(ctrl.loadUser){
            return ctrl.loadUser;
        }
        ctrl.loadUser = ctrl.user.update()//
        .then(function(user){
        	ctrl.user = user;
        }, function(error){
            ctrl.error = error;
        })//
        .finally(function(){
        	ctrl.saveUser = false;
        });
        return ctrl.loadUser;
    }

    /**
     * Change password of the current user
     * 
     * @name load
     * @memberof AmdAccountCtrl
     * @returns {promiss} to change password
     */
    function changePassword(data) {
        if(ctrl.changingPassword){
            return;
        }
        ctrl.changingPassword = true;
        var param = {
                'old' : data.oldPass,
                'new' : data.newPass,
                'password': data.newPass,
        };
//      return $usr.resetPassword(param)//
        $scope.app.user.current.newPassword(param)
        .then(function(){
            $scope.logout();
        }, function(error){
            alert('Fail to update password:'+error.data.message);
        })//
        .finally(function(){
            ctrl.changingPassword = false;
        });
    }


    /**
     * Update avatar of the current user
     * 
     * @name load
     * @memberof AmdAccountCtrl
     * @returns {promiss} to update avatar
     */
    function updateAvatar(avatarFiles){
        // XXX: maso, 1395: reset avatar
        return ctrl.user.newAvatar(avatarFiles[0].lfFile)//
        .then(function(){
            $window.location.reload();
        }, function(error){
            alert('Fail to update avatar:' + error.data.message);
        });
    }


    // TODO: maso, 2017: getting from server
    // Account property descriptor
    $scope.apds = [ {
        key : 'first_name',
        title : 'First name',
        type : 'string'
    }, {
        key : 'last_name',
        title : 'Last name',
        type : 'string'
    }, {
        key : 'language',
        title : 'language',
        type : 'string'
    }, {
        key : 'timezone',
        title : 'timezone',
        type : 'string'
    } ];

    // Bind to scope
    $scope.ctrl = ctrl;
    $scope.login = login;
    $scope.logout = $app.logout;
    $scope.goToDashboard = goToDashboard;
    $scope.load = loadUser;
    $scope.reload = loadUser;
    $scope.saveUser = saveUser;
    $scope.changePassword = changePassword;
    $scope.updateAvatar = updateAvatar;
    
    loadUser();
});
