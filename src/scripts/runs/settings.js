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
 * دریچه‌های محاوره‌ای
 */
.run(function($settings) {
	// Pages
	$settings
	.newConfig({
		id : 'local',
		title : 'local',
		description : 'manage dashboard locality and language.',
		templateUrl : 'views/amd-configs/local.html',
		controller : 'settingsLocalCtrl',
		icon : 'language',
		tags : [ 'local', 'language' ],
	})//
	.newConfig({
		id : 'brand',
		title : 'Branding',
		description : 'Manage application branding such as title, logo and descritpions.',
		templateUrl : 'views/amd-configs/brand.html',
		controller : 'settingsBrandCtrl',
		icon : 'copyright',
		tags : [ 'brand' ],
	})//
	.newConfig({
		id : 'google-analytic',
		title : 'Google Analytic',
		templateUrl : 'views/amd-configs/google-analytic.html',
		description : 'Enable google analytic for your application.',
		icon : 'timeline',
		tags : [ 'analysis' ],
	});
	
	// Settings
	$settings//
	.newSetting({
		title: 'Settings',
		templateUrl: 'views/amd-settings/general.html',
		tags: ['theme', 'local']
	});
});