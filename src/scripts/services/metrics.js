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
 * @ngdoc Services
 * @name $metrics
 * @description collects and manages metrics from application and server
 * 
 * Metrics are stored in application space:
 * 
 * In view:
 * 
 * <code><pre>
 * 	<span>{{app.metrics['message.count']}}</span>
 * </pre></code>
 * 
 * In code:
 * 
 * <code><pre>
 * 	var messageCount = $rootScope.app.metrics['message.count'];
 * </pre></code>
 * 
 * Metrics must be tracked by the following 
 */
.service('$metrics', function($q, $timeout/*, $monitor*/) {
	/*
	 * store list of metrics
	 */
	var metrics = [];
	
	var remoteMetrics = []
	var localMetrics = []

	// XXX: maso, 1395: metric interval
	var defaultInterval = 60000;


	/**
	 * Reloads all metrics
	 * 
	 * @return promisse to load all metrics
	 */
	function reaload(){
		// reload all metrics
	};

	/**
	 * Add a monitor in track list
	 * 
	 * با این فراخوانی مانیتور معادل ایجاد شده و به عنوان نتیجه برگردانده
	 * می‌شود.
	 * 
	 * <pre><code>
	 * $metrics.trackMetric('message.count')//
	 * 		.then(function() {
	 * 				// Success
	 * 			}, function(){
	 * 				// error
	 * 			});
	 * </code></pre>
	 * 
	 * @memberof $monitor
	 * @param {string}
	 *            key to track
	 * @param {string}
	 *            $scope which is follower (may be null)
	 *            
	 * @return {promise(PMonitor)}
	 */
	function trackMetric(key, $scope) {
		// track metric with key
		return $q.resolve('hi');
	};


	/**
	 * Break a monitor
	 * 
	 * @param {Object}
	 *            monitor
	 */
	function breakMonitor(key) {
//		var def = $q.defer();
//		$timeout(function() {
//			// XXX: maso, 1395: remove monitor
//			def.resolve(monitor);
//		}, 1);
//		return def.promise;
	};


	this.breakMonitor = breakMonitor;
	this.trackMetric = trackMetric;
});
