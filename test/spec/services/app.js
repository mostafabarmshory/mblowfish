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

describe('Application service', function() {

    // load the controller's module
    beforeEach(module('mblowfish-core'));

    var $app;
    var $rootScope;

    // Initialize the controller and a mock scope
    beforeEach(inject(function(_$app_, _$rootScope_) {
        $app = _$app_;			
        $rootScope = _$rootScope_;
    }));

    it('should add parse method in test mode ', function() {
        expect(angular.isFunction($app.__parsTenantConfiguration)).toBe(true);
    });

    it('should add parse module configurations', function() {
        $app.__parsTenantConfiguration([{
            key: 'module.Xxx.enable',
            value: '1'
        }, {
            key: 'module.yyy.enable',
            value: '0'
        }, {
            key: 'module.zZz.enable',
            value: ''
        }, {
            key: 'module.zzz.enable1',
            value: 'true'
        }]);

        expect($rootScope.__tenant.domains['xxx']).toBe(true);
        expect($rootScope.__tenant.domains['yyy']).toBe(false);
        expect($rootScope.__tenant.domains['zzz']).toBe(false);
    });

});
