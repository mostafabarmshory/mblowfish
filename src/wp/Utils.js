import {
	messageType,
	messageTypes
} from './Constants';
//
///**
//A unique message ID that is used to ensure responses are sent to the correct requests
//@type {Number}
// */
let $messageId = 0

/**
Increments and returns a message ID
@return {Number} A unique ID for a message
 */
export const generateNewMessageId = () => $messageId++



/**
Takes a URL and returns the origin
@param  {String} url The full URL being requested
@return {String}     The URLs origin
 */
export const resolveOrigin = (url) => {
	const a = document.createElement('a')
	a.href = url
	const protocol = a.protocol.length > 4 ? a.protocol : window.location.protocol
	const host = a.host.length ? ((a.port === '80' || a.port === '443') ? a.hostname : a.host) : window.location.host
	return a.origin || `${protocol}//${host}`
}

//Explanation code
export function matchWildcard(str, rule) {
	// for this solution to work on any string, no matter what characters it has
	var escapeRegex = (str) => str.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");

	// "."  => Find a single character, except newline or line terminator
	// ".*" => Matches any string that contains zero or more characters
	rule = rule.split("*").map(escapeRegex).join(".*");

	// "^"  => Matches any string with the following at the beginning of it
	// "$"  => Matches any string with that in front at the end of it
	rule = "^" + rule + "$"

	//Create a regular expression object for matching string
	var regex = new RegExp(rule);

	//Returns true if it finds a match, otherwise it returns false
	return regex.test(str);
}


/**
Logging function that enables/disables via config
@param  {Object} ...args Rest Arguments
 */
export const log = (...args) => {
	window.debug ? console.log(...args) : null;
	// eslint-disable-line no-console
}

/**
Ensures that a message is safe to interpret
@param  {Object} message The message being sent
@param  {String|Boolean} allowedOrigin The whitelisted origin or false to skip origin check
@return {Boolean}
 */
export const sanitize = (message, allowedOrigin) => {
	allowedOrigin = allowedOrigin || '*';
	// * origine match
	return matchWildcard(message.origin, allowedOrigin) &&
		// * data and command exist
		(typeof message.data === 'object') &&
		// * message command exist
		('command' in message.data) &&
		// * message command supported
		messageTypes[message.data.command] &&
		// * message data type match
		message.data.type === messageType
		;
}

/**
Takes a model, and searches for a value by the property
@param  {Object} model     The dictionary to search against
@param  {String} property  A path within a dictionary (i.e. 'window.location.href')
@param  {Object} data      Additional information from the get request that is
						   passed to functions in the child model
@return {Promise}
 */
export const resolveValue = (model, property) => {
	const unwrappedContext = typeof model[property] === 'function'
		? model[property]() : model[property]
	return Promise.resolve(unwrappedContext)
}