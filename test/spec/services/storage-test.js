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

describe('Service $mbStorage', function () {
    var $mbStorage;

    // load the service's module
    beforeEach(module('mblowfish-core'));

    // instantiate service
    beforeEach(inject(function (_$mbStorage_) {
        $mbStorage = _$mbStorage_;
    }));

    it('must implements WB $mbStorage API', function () {
        expect(angular.isFunction($mbStorage.get)).toBe(true);
        expect(angular.isFunction($mbStorage.put)).toBe(true);
        expect(angular.isFunction($mbStorage.remove)).toBe(true);
        expect(angular.isFunction($mbStorage.has)).toBe(true);
    });

    it('should be same the pushed and poped data in storage', function () {
        $mbStorage.put('number' , 10);
        var data = $mbStorage.get('number');
        expect(data).toBe(10);
    });

    it('should remove data with a spacial key', function () {
        $mbStorage.put('number' , 10);
        $mbStorage.remove('number');
        var data = $mbStorage.get('number');
        expect(data).toBe(undefined);
    });

    it('should check the existense of a spacial item in storage', function () {
        $mbStorage.put('number' , 10);
        var flag = $mbStorage.has('number');
        expect(flag).toBe(true);
    });
});
