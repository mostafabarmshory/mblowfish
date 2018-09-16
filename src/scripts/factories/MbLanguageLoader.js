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
 * @ngdoc Factories
 * @name MbLanguageLoader
 * @description Language loader factory
 * 
 * Loads translation table of given language (if language is registered before). Then finds 
 * translation table from config (if exist) and merge this table with previouse table. If there
 * is no config
 * It loads languages and their translation tables from config. If it 
 * 
 * @param $q
 * @param $app
 * @param $http
 * @param $translate
 * @returns
 */
.factory('MbLanguageLoader', function ($q, $translate, $rootScope) {
    return function (option) {
        // Fetch translations from config of SPA.
        var spaTranslate = $translate.getTranslationTable(option.key);
        var translate = spaTranslate ? spaTranslate : {};
        // Fetch translations from config on server
        var langs = $rootScope.app.config.local.languages;
        if (langs) {
            angular.forEach(langs, function (lang) {
                if (lang.key === option.key) {
                    angular.forEach(lang.map, function (value, key) {
                        translate[key] = value;
                    });
                }
            });
            return $q.resolve(translate);
        } else {
            return $q.reject('Language not found');
        }
    };
});

