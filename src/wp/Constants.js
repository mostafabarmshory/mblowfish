
/**
The type of messages our frames our sending
@type {String}
 */
export const messageType = 'application/x-mblowfish-v1+json'

/**
The maximum number of attempts to send a handshake request to the parent
@type {Number}
 */
export const maxHandshakeRequests = 5


/**
All supported message types

 */
export const messageTypes = {
	handshake: 1,
	'handshake-reply': 1,
	call: 1,
	emit: 1,
	reply: 1,
	request: 1,
}