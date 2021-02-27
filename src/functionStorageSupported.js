


/*
Checks if the storage type is supported

types:

- local
- cockie


@returns {map} Storage to use in application

 */
function storageSupported($window, storageType) {
	// Some installations of IE, for an unknown reason, throw "SCRIPT5: Error: Access is denied"
	// when accessing window.localStorage. This happens before you try to do anything with it. Catch
	// that error and allow execution to continue.

	// fix 'SecurityError: DOM Exception 18' exception in Desktop Safari, Mobile Safari
	// when "Block cookies": "Always block" is turned on
	var supported;
	try {
		supported = $window[storageType];
	} catch (err) {
		return;
	}
	// When Safari (OS X or iOS) is in private browsing mode, it appears as though localStorage and sessionStorage
	// is available, but trying to call .setItem throws an exception below:
	// "QUOTA_EXCEEDED_ERR: DOM Exception 22: An attempt was made to add something to storage that exceeded the quota."
	if (supported) {
		var key = '__' + Math.round(Math.random() * 1e7);
		try {
			supported.setItem(key, key);
			supported.removeItem(key, key);
		} catch (err) {
			return;
		}
	}
	return supported;
}



export default storageSupported;