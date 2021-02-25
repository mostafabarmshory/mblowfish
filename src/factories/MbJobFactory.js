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

/**
 @ngdoc Factories
 @name MbJob
 @description A wrapper of Promise
 
@ngInject
 */
function MbJobFactory($mbJobs, $q, $injector, $mbCrypto) {

	STATE_WORKING = 'working';
	STATE_FAILED = 'failed';
	STATE_SUCCESS = 'success';

	function MbJob(configs) {
		_.assign(this, configs);
		this.id = $mbCrypto.uuid();
	};

	MbJob.prototype.then = function() {
		this.promise.then.apply(this.promise, arguments);
	};

	MbJob.prototype.finally = function() {
		this.promise.finally.apply(this.promise, arguments);
	};

	MbJob.prototype.catch = function() {
		this.promise.catch.apply(this.promise, arguments);
	};

	MbJob.prototype.schedule = function() {
		var job = this;
		$mbJobs.addJob(job);
		job.state = STATE_WORKING;
		return $q.when($injector.invoke(job.action, job))
			.then(function() {
				job.state = STATE_SUCCESS;
			}, function() {
				job.state = STATE_FAILED;
			})
			.finally(function() {
				$mbJobs.removeJob(job);
			});
	};

	MbJob.STATE_WORKING = STATE_WORKING;
	MbJob.STATE_FAILED = STATE_FAILED;
	MbJob.STATE_SUCCESS = STATE_SUCCESS;
	return MbJob;
}

export default MbJobFactory;
