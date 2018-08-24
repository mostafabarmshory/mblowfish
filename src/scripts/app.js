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

/**
 * @ngdoc action-group
 * @name User
 * @description Global user menu
 * 
 * There are several registred menu in the $actions service. Modules can contribute
 * to the dashbord by addin action into it.
 * 
 * - mb.user : All action related to the current user
 * - mb.toolbar.menu : All action related to the toolbar menu
 * 
 * - navigationPathMenu: All items related to navigation.
 * 
 */


angular.module('mblowfish-core', [ //
//	Angular
	'ngMaterial', 
	'ngAnimate', 
	'ngCookies',
	'ngSanitize', //
	'ngRoute', //
//	Seen
	'seen-core',
	'seen-tenant',
	'seen-cms',
//	AM-WB
	'am-wb-core', 
	'am-wb-common', //
//	'am-wb-seen-core',
//	'am-wb-seen-monitors',
//	Others
	'lfNgMdFileInput', // https://github.com/shuyu/angular-material-fileinput
	'ngStorage', // https://github.com/gsklee/ngStorage
	'vcRecaptcha', //https://github.com/VividCortex/angular-recaptcha
	'infinite-scroll', // https://github.com/sroze/ngInfiniteScroll
	'nvd3',//
	'ng-appcache',//
	'ngFileSaver',//
	'mdSteppers',//
	'angular-material-persian-datepicker'
]);
