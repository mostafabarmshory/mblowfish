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
import mblowfish from '../../mblowfish';

import mbTranslateDirective from './directives/mbTranslate';
import mbTranslateAttrDirective from './directives/mbTranslateAttr';
import mbTranslateCloakDirective from './directives/mbTranslateCloak';
import mbTranslateLanguageDirective from './directives/mbTranslateLanguage';
import mbTranslateNamespaceDirective from './directives/mbTranslateNamespace';

import mblowfishTranslateConfig from './mblowfishTranslateConfig';
import mblowfishPrepareTranslateRun from './mblowfishPrepareTranslateRun';

import mbTranslate from './services/mbTranslate';
import mbTranslateSanitization from './services/mbTranslateSanitization';

// TODO: maso, 2021: add currency
//import mbCurrencyFilter from './filters/mbCurrency';
import mbDateFilter from './filters/mbDate';
import mbDateTimeFilter from './filters/mbDateTime';
import mbTranslateFilter from './filters/mbTranslate';

import mbTranslateMissingTranslationHandlerLogFactory from './factories/mbTranslateMissingTranslationHandlerLog';
import mbTranslateMissingTranslationHandlerStorageFactory from './factories/mbTranslateMissingTranslationHandlerStorage';
import mbTranslateStaticFilesLoaderFactory from './factories/mbTranslateStaticFilesLoader';
import mbTranslateDefaultInterpolationFactory from './factories/mbTranslateDefaultInterpolation';
import translationCacheFactory from './factories/translationCache';

import localPreference from './preferences/local';

mblowfish
	// directives
	.directive('mbTranslate', mbTranslateDirective)
	.directive('mbTranslateAttr', mbTranslateAttrDirective)
	.directive('mbTranslateCloak', mbTranslateCloakDirective)
	.directive('mbTranslateLanguage', mbTranslateLanguageDirective)
	.directive('mbTranslateNamespace', mbTranslateNamespaceDirective)
	
	// factories
	.factory('$mbTranslateMissingTranslationHandlerLog', mbTranslateMissingTranslationHandlerLogFactory)
	.factory('$mbTranslateMissingTranslationHandlerStorage', mbTranslateMissingTranslationHandlerStorageFactory)
	.factory('$mbTranslateStaticFilesLoader', mbTranslateStaticFilesLoaderFactory)
	.factory('$mbTranslateDefaultInterpolation', mbTranslateDefaultInterpolationFactory)
	.factory('$translationCache', translationCacheFactory)
	
	// Filters
	.filter('mbDate', mbDateFilter)
	.filter('mbDateTime', mbDateTimeFilter)
	.filter('translate', mbTranslateFilter) // legecy
	.filter('mbTranslate', mbTranslateFilter)
	
	// Preferences
	.preference('local', localPreference)
	
	// services
	.provider('$mbTranslate', mbTranslate)
	.provider('$mbTranslateSanitization', mbTranslateSanitization)
	
	// Configurations
	.config(mblowfishTranslateConfig)
	.run(mblowfishPrepareTranslateRun);

