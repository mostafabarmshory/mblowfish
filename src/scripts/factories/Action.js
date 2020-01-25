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



angular.module('mblowfish-core')
/**
 * @ngdoc Factories
 * @name MbAction
 * @description An action item
 * 
 */
.factory('MbAction', function ($injector, $navigator, $window) {

    function Action(data) {
        if (!angular.isDefined(data)) {
            data = {};
        }
        angular.extend(this, data, {
            priority: data.priority || 10
        });
        this.visible = this.visible || function () {
            return true;
        };
        return this;
    };

    Action.prototype.exec = function ($event) {
    	if ($event) {
    		$event.stopPropagation();
    		$event.preventDefault();
    	}
        if (this.action) {
            return $injector.invoke(this.action, this, {
            	$event: $event
            });
        } else if (this.url){
            return $navigator.openPage(this.url);
        }
        $window.alert('Action \'' + this.id + '\' is not executable!?')
    };

    return Action;
});
