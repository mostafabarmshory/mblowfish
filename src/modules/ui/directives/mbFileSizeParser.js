
/*
JEDEC Standard

SEE: https://en.wikipedia.org/wiki/JEDEC_memory_standards
*/
const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
const regex = /^(0[\.[0-9]]?[0-9]*|[1-9][0-9]*[\.[0-9]]?[0-9]*)\W*(Byte|KB|MB|GB|TB|PB|EB|ZB|YB)?$/gi;
const k = 1024;


function parse(value) {
	if (!value) {
		return 0;
	}
	const found = regex.exec(value.trim());
	if (!found) {
		return;
	}
	var i = 0;
	if (found[2]) {
		i = sizes.indexOf(found[2].toUpperCase());
	}
	return Number(found[1]) * Math.pow(k, i);
}

function format(bytes, decimalPoint) {
	if (!byte) {
		return '0 Bytes';
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