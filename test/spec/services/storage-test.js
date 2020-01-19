/* 
 * The MIT License (MIT)
 * 
 * Copyright (c) 2016 weburger
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

describe('Service $storage', function () {
    var $storage;

    // load the service's module
    beforeEach(module('mblowfish-core'));

    // instantiate service
    beforeEach(inject(function (_$storage_) {
        $storage = _$storage_;
    }));

    fit('must implements WB $storage API', function () {
        expect(angular.isFunction($storage.get)).toBe(true);
        expect(angular.isFunction($storage.put)).toBe(true);
        expect(angular.isFunction($storage.remove)).toBe(true);
        expect(angular.isFunction($storage.has)).toBe(true);
    });

    it('should be same the pushed and poped data in storage', function () {
        $storage.put('number' , 10);
        var data = $storage.get('number');
        expect(data).toBe(10);
    });

    it('should remove data with a spacial key', function () {
        $storage.put('number' , 10);
        $storage.remove('number');
        var data = $storage.get('number');
        expect(data).toBe(undefined);
    });

    it('should check the existense of a spacial item in storage', function () {
        $storage.put('number' , 10);
        var flag = $storage.has('number');
        expect(flag).toBe(true);
    });
});
