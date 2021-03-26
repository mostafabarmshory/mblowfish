
import {
	messageType,
	maxHandshakeRequests
} from './Constants';
import {
	resolveOrigin,
	log,
	sanitize,
	generateNewMessageId,
} from './Utils';

/**
Composes an API to be used by the parent

@param {Object} info Information on the consumer
 */
export default class ParentApi {
	/**
	Creates new instance of parent
	
	 */
	constructor(parent, child, childOrigin, id) {
		this.parent = parent
		//		this.frame = frame
		this.child = child;
		this.childOrigin = childOrigin;
		this.id = id;
		this.events = {};

		log('Parent: Registering API', this.id);
		log('Parent: Awaiting messages...');

		this.listener = (event) => {
			if (!sanitize(event, this.childOrigin)){
				return false;
			} 
			var eventData = event.data;

			/**
			 * the assignments below ensures that e, data, and value are all defined
			 */
			const { data, name } = (((event || {}).data || {}).value || {})
			if(eventData.parentId !== this.id){
				log(`Parent: recived id is ${eventData.parentId} is not match with ${this.id}`);
				return false;
			}
			if (eventData.command === 'emit') {
				log(`Parent: Received event emission: ${name}`)

				if (name in this.events) {
					this.events[name].forEach(callback => {
						callback.call(this, data)
					})
				}
			}
		}

		this.parent.addEventListener('message', this.listener, false)
		log('Parent: Awaiting event emissions from Child')
	}

	get(property) {
		return new Promise((resolve) => {
			// Extract data from response and kill listeners
			const uid = generateNewMessageId()
			const transact = (e) => {
				if (e.data.uid === uid && e.data.command === 'reply') {
					this.parent.removeEventListener('message', transact, false)
					resolve(e.data.value)
				}
			}

			// Prepare for response from Child...
			this.parent.addEventListener('message', transact, false)

			// Then ask child for information
			this.child.postMessage({
				command: 'request',
				type: messageType,
				property,
				uid,
			}, this.childOrigin)
		})
	}

	call(property, data) {
		// Send information to the child
		this.child.postMessage({
			command: 'call',
			type: messageType,
			property,
			data,
		}, this.childOrigin);
		return this;
	}

	on(eventName, callback) {
		this.events[eventName] = this.events[eventName] || [];
		this.events[eventName].push(callback);
		return this;
	}

	destroy() {
		log('Parent: Destroying WP instance')
		window.removeEventListener('message', this.listener, false);
		//		this.frame.parentNode.removeChild(this.frame)
	}





	static connect(
		model,
		parent,
		child,
		childOrigin) {


		let attempt = 0;
		let responseInterval;
		let id = Math.random();
		return new Promise((resolve, reject) => {
			const reply = (event) => {
				if (!sanitize(event, childOrigin)) {
					return false;
				}
				if (event.data.command === 'handshake-reply') {
					clearInterval(responseInterval);
					log('Parent: Received handshake reply from Child');

					parent.removeEventListener('message', reply, false);
					childOrigin = event.origin;
					log('Parent: Saving Child origin', childOrigin);

					return resolve(new ParentApi(parent, child, childOrigin, id));
				}

				// Might need to remove since parent might be receiving different messages
				// from different hosts
				log('Parent: Invalid handshake reply')
				return reject('Failed handshake')
			}


			const doSend = () => {
				attempt++;
				log(`Parent: Sending handshake attempt ${attempt}`, { childOrigin });

				child.postMessage({
					command: 'handshake',
					type: messageType,
					id: id,
					model: model,
				}, childOrigin);

				if (attempt === maxHandshakeRequests) {
					clearInterval(responseInterval);
				}
			}

			parent.addEventListener('message', reply, false);

			doSend();
			responseInterval = setInterval(doSend, 500);
		});
	}

	/**
	Sets options related to the Parent
	
	Begins the handshake strategy
	 
	@param {Object} object The element to inject the frame into, and the url
	@return {Promise}
	 */
	static createIframe({
		container = typeof container !== 'undefined' ? container : document.body, // eslint-disable-line no-use-before-define
		model,
		url,
		name,
		classListArray = [],
	}) { // eslint-disable-line no-undef
		let parent = window

		let frame = document.createElement('iframe')
		frame.name = name || ''
		frame.classList.add.apply(frame.classList, classListArray)

		container.appendChild(frame)
		let child = frame.contentWindow || frame.contentDocument.parentWindow;
		model = model || {};
		const childOrigin = resolveOrigin(url);

		log('Parent: Loading frame', { url });
		frame.addEventListener('load', () => {
			ParentApi
				.connect(model, parent, child, childOrigin)
				.then(api => resolve(api), error => reject(error));
		});
		frame.addEventListener('error', () => {
			reject({
				message: 'Fail to load src'
			});
		});
		frame.src = url;
		return frame;
	}
}
