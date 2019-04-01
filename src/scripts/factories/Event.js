/*
 * Copyright (c) 2015 Phoenix Scholars Co. (http://dpq.co.ir)
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
 * @ngdoc Factories
 * @name MbEvent
 * @description An event item
 * 
 * Events are used to propagate signals to the application. It is based on $dispatcher. 
 * 
 * NOTE: All platform events (from mb or children) are instance of this factory.
 * 
 */
.factory('MbEvent', function () {

    var mbEvent = function (data) {
        if (!angular.isDefined(data)) {
            data = {};
        }
        return this;
    };

    mbEvent.prototype.getType = function () {
        return this.type || 'unknown';
    };
    
    mbEvent.prototype.getKey = function () {
    	return this.key || 'unknown';
    };
    
    mbEvent.prototype.getValues = function () {
    	return this.values || [];
    };
    
    mbEvent.prototype.isCreated = function () {
    	return this.key === 'created';
    };
    
    mbEvent.prototype.isRead = function () {
    	return this.key === 'read';
    };
    
    mbEvent.prototype.isUpdated = function () {
    	return this.key === 'updated';
    };
    
    mbEvent.prototype.isDeleted = function () {
    	return this.key === 'deleted';
    };

    return mbEvent;
});
