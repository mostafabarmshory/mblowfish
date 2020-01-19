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


angular.module('mblowfish-core')

/**
 * @ngdoc Services
 * @name $wbLocal
 * @description manage localization of widgets
 * 
 * Deprecated : use $wbWindow
 */
.service('$wbLocal', function() {
    var defaultDateFormat = 'YYYY-MM-DD hh:mm:ss';

    /**
     * Gets current data of the system.
     * 
     * @memberof $wbLocal
     */
    this.getDate = function(){
        return new Date();
    };

    /**
     * Formats the input date based on the format
     * 
     * NOTE: default format is 'YYYY-MM-DD hh:mm:ss'
     * 
     * @params data {String | Date} to format
     * @params format {String} of the output
     * @memberof $wbLocal
     */
    this.formatDate = function(date, format){
        try {
            var mf = format || defaultDateFormat;
            var localDate = moment //
            .utc(date) //
            .local();
            return localDate.format(mf);
        } catch (ex) {
            return '-' + ex.message;
        }
    };

    /**
     * Get currency of the system
     * 
     * @return currency ISO code
     * @memberof $wbLocal
     */
    this.getCurrency = function(){
        return this.currency || 'USD';
    };

    /**
     * Sets currency of the system
     * 
     * @param currency {String} ISO code
     * @memberof $wbLocal
     */
    this.setCurrency = function(currency){
        this.currency = currency;
    };

    /**
     * Get language of the system
     * 
     * @return language ISO code
     * @memberof $wbLocal
     */
    this.getLanguage = function(){
        return  this.language || 'en';
    };

    /**
     * Sets language of the system
     * 
     * @params language {String} ISO code
     * @memberof $wbLocal
     */
    this.setLanguage = function(language) {
        this.language = language;
    };


    return this;
});
