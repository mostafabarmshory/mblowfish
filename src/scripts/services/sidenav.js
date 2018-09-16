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
angular.module('mblowfish-core') //

/**
 * @ngdoc Services
 * @name $sidenav
 * @param {} $q
 * @description sidenavs manager
 * 
 */
.service('$sidenav', function ($q) {
    var _sidenavs = [];

    /**
     * Get list of all sidenavs
     * 
     * @memberof $sidenav
     * @return promiss
     */
    function sidenavs(){
        return $q.when({
            items: _sidenavs
        });
    }

    /**
     * Add new sidenav
     * 
     * @memberof $sidenav
     * @param {} sidenav
     * @return promiss
     */
    function newSidenav(sidenav){
        _sidenavs.push(sidenav);
    }

    /**
     * Get a sidnav by id
     * 
     * @memberof $sidenav
     * @param {} id
     * @return promiss
     */
    function sidenav(id){
        for(var i = 0; i < _sidenavs.length; i++){
            if(_sidenavs[i].id === id){
                return $q.when(_sidenavs[i]);
            }
        }
        return $q.reject('Sidenav not found');
    }

    var _defaultSidenavs = [];

    /**
     * Add new sidenav
     * 
     * @memberof $sidenav
     * @param {} defaultSidenavs
     * @return promiss
     */
    function setDefaultSidenavs(defaultSidenavs){
        _defaultSidenavs = defaultSidenavs || [];
        return this;
    }

    /**
     * Add new sidenav
     * 
     * @memberof $sidenav
     * @return promiss
     */
    function defaultSidenavs(){
        return _defaultSidenavs;
    }


    var apps = {};

    apps.sidenavs = sidenavs;
    apps.newSidenav = newSidenav;
    apps.sidenav = sidenav;
    apps.setDefaultSidenavs = setDefaultSidenavs;
    apps.defaultSidenavs = defaultSidenavs;

    return apps;
});


