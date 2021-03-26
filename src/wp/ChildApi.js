import {
	messageType,
} from './Constants';
import {
	log,
	sanitize,
	resolveValue,
} from './Utils';

/**
Composes an API to be used by the child
@param {Object} info Information on the consumer
 */
export default class ChildApi {
	
	/**
	Creates new instance of ChildApi class
	
	@param {Object} model to use as the init model in the child
	@param {Window} child the current window which is the child in the connections
	@param {string} parentOrigin the parent origin path
	
	 */
	constructor(model, child, parent, parentOrigin, parentId) {
		this.model = model;
		this.child = child;
		this.parent = parent;
		this.parentId = parentId;
		this.parentOrigin = parentOrigin;

		log('Child: Registering API');
		log('Child: Awaiting messages...');

		this.child.addEventListener('message', (e) => {
			if (!sanitize(e, this.parentOrigin)){
				return;
			} 
			log('Child: Received request', e.data)

			const { property, uid, data } = e.data

			if (e.data.command === 'call') {
				if (property in this.model && typeof this.model[property] === 'function') {
					this.model[property](data)
				}
				return;
			}

			// Reply to Parent
			resolveValue(this.model, property)
				.then(value => e.source.postMessage({
					property,
					command: 'reply',
					type: messageType,
					uid,
					value,
				}, e.origin))
		})
	}

	emit(name, data) {
		log(`Child: Emitting Event "${name}"`, data)
		this.parent.postMessage({
			command: 'emit',
			type: messageType,
			parentId: this.parentId,
			value: {
				name,
				data,
			},
		}, this.parentOrigin)
	}




	/**
	Initializes the child, model, parent, and responds to the Parents handshake
	
	The entry point of the Child

	@param {Object} model Hash of values, functions, or promises
	@param {Object} childWindow The window of the iframe or child window to connect. It is used in tests
	@return {Promise}       The Promise that resolves when the handshake has been received
	 */
	static connect(model, childWindow) {
		let child = childWindow || window;
		let parent = child.parent;
		return new Promise((resolve, reject) => {
			const shake = (event) => {
				if (!event.data.command) {
					return
				}
				if (event.data.command === 'handshake') {
					log('Child: Received handshake from Parent')
					child.removeEventListener('message', shake, false)
					log('Child: Sending handshake reply to Parent')

					event.source.postMessage({
						command: 'handshake-reply',
						type: messageType,
					}, event.origin)
					let parentOrigin = event.origin

					// Extend model with the one provided by the parent
					const defaults = event.data.model;
					if (defaults) {
						Object.keys(defaults).forEach(key => {
							model[key] = defaults[key]
						})
						log('Child: Inherited and extended model from Parent')
					}

					log('Child: Saving Parent origin', parentOrigin)
					return resolve(new ChildApi(model, child, parent, parentOrigin, event.data.id));
				}
				return reject('Handshake Reply Failed')
			}
			child.addEventListener('message', shake, false)
		})
	}
}

