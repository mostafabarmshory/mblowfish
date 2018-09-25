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
 * @name $toolbar
 * @description toolbars manager
 * 
 */
.service('$toolbar', function ($q) {

    var _toolbars = [];

    /**
     * Get list of all toolbars
     * 
     * @memberof $app
     * @return promiss
     */
    function toolbars() {
        return $q.when({
            items: _toolbars
        });
    }

    /**
     * Add new toolbar
     * 
     * @memberof $toolbar
     * @param {} toolbar
     * @return promise
     */
    function newToolbar(toolbar) {
        _toolbars.push(toolbar);
    }

    /**
     * Get a toolbar by id
     * 
     * @memberof $app
     * @param {} id
     * @return promise
     */
    function toolbar(id) {
        for (var i = 0; i < _toolbars.length; i++) {
            if (_toolbars[i].id === id) {
                return $q.when(_toolbars[i]);
            }
        }
        return $q.reject('Toolbar not found');
    }

    var _defaultToolbars = [];
    function setDefaultToolbars(defaultToolbars) {
        _defaultToolbars = defaultToolbars || [];
        return this;
    }

    function defaultToolbars() {
        return _defaultToolbars;
    }

    var apps = {};
    // toolbars
    apps.toolbars = toolbars;
    apps.newToolbar = newToolbar;
    apps.toolbar = toolbar;
    apps.setDefaultToolbars = setDefaultToolbars;
    apps.defaultToolbars = defaultToolbars;

    return apps;
});
