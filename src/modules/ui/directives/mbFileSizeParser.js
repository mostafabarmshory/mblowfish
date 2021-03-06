import _ from 'lodash';
/*
JEDEC Standard

SEE: https://en.wikipedia.org/wiki/JEDEC_memory_standards
*/
const sizes = ['BYTE', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
const k = 1024;


export function parse(value) {
	const regex = /^(\d+\.?\d*)\W*(Byte|KB|MB|GB|TB|PB|EB|ZB|YB)?$/gi;
	if (!_.isInteger(value) && !_.isString(value)) {
		return;
	}
	if(Number.isInteger(value)){
		return value;
	}
	value = value.trim();
	const found = regex.exec(value);
	if (!found) {
		return;
	}
	var i = 0;
	if (found[2]) {
		i = sizes.indexOf(found[2].toUpperCase());
	}
	return Math.floor(Number(found[1]) * Math.pow(k, i));
}

export function format(bytes, decimalPoint) {
	if (!_.isInteger(value) || value < 0 ) {
		return;
	}
	var dm = decimalPoint || 2,
		i = Math.floor(Math.log(bytes) / Math.log(k));
	return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

/**

@ngInject
 */
export default function() {
	return {
		restrict: "A",
		require: "ngModel",
		link: function(scope, element, attrs, ngModel) {
			if (!ngModel) {
				return;
			}
			ngModel.$parsers.push(parse);
			ngModel.$formatters.push(format);
		}
	}
}