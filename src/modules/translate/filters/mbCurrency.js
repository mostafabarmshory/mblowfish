
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
TODO: maso, 2019: add filter document

@ngInject
 */
export default function mbCurrency(numberFilter, translateFilter) {

	return function(price, unit) {

		if (!price) {
			return translateFilter('free');
		}
		// TODO: maso, 2019: set unit with system default currency if is null
		if (unit === 'iran-rial' || unit === 'iran-tooman') {
			return numberFilter(price) + ' '
				+ translateFilter(unit);
		} else if (unit === 'bahrain-dinar') {
			return numberFilter(price) + ' '
				+ translateFilter('bahrain-dinar');
		} else if (unit === 'euro') {
			return numberFilter(price) + ' '
				+ translateFilter('euro');
		} else if (unit === 'dollar') {
			return translateFilter('dollar') + ' '
				+ numberFilter(price);
		} else if (unit === 'pound') {
			return translateFilter('pound') + ' '
				+ numberFilter(price);
		} else if (unit === 'iraq-dinar') {
			return numberFilter(price) + ' '
				+ translateFilter('iraq-dinar');
		} else if (unit === 'kuwait-dinar') {
			return numberFilter(price) + ' '
				+ translateFilter('kuwait-dinar');
		} else if (unit === 'oman-rial') {
			return numberFilter(price) + ' '
				+ translateFilter('oman-rial');
		} else if (unit === 'turkish-lira') {
			return numberFilter(price) + ' '
				+ translateFilter('turkish-lira');
		} else if (unit === 'uae-dirham') {
			return numberFilter(price) + ' '
				+ translateFilter('uae-dirham');
		} else {
			return numberFilter(price) + ' ?';
		}
	};
}


