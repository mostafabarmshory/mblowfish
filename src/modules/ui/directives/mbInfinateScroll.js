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


/**

@ngInject
 */
export default  function ($parse, $q, $timeout) {
    // FIXME: maso, 2017: tipo in diractive name (infinite)
    function postLink(scope, elem, attrs) {
        var raw = elem[0];

        /*
         * Load next page
         */
        function loadNextPage() {
            // Call the callback for the first time:
            var value = $parse(attrs.mbInfinateScroll)(scope);
            return $q.when(value)//
            .then(function (value) {
                if (value) {
                    return $timeout(function () {
                        if (raw.scrollHeight <= raw.offsetHeight) {
                            return loadNextPage();
                        }
                    }, 100);
                }
            });
        }

        /*
         * Check scroll state and update list
         */
        function scrollChange() {
            if (raw.scrollTop + raw.offsetHeight + 5 >= raw.scrollHeight) {
                loadNextPage();
            }
        }

        // adding infinite scroll class
        elem.addClass('mb-infinate-scroll');
        elem.on('scroll', scrollChange);
        loadNextPage();
    }

    return {
        restrict : 'A',
        link : postLink
    };
}
