import ParentApi from './ParentApi';
import ChildApi from './ChildApi';
import {
	messageType
} from './Constants';
window.debug = false;

describe('ParentApi class', () => {

	it('should be ready to rock', () => {
		expect(typeof ParentApi !== 'undefined');
		expect(typeof ParentApi).toBe('function');
	})

	// test mocks
	// the tests below test the interworkings of Postmate methods
	it('should instantce', () => {
		const frame = ParentApi.createIframe({
			container: document.body,
			url: 'http://child.com/',
			model: { foo: 'bar' },
		});
		expect(typeof frame).toBe('object');
	})

	it('should support parent api', () => {
		const parentMock = new ParentApi(document.body, document.body, 'https://parent.com');
		expect(typeof parentMock).toBe('object');
	})



	it('should start with handshake', (done) => {
		const frame = document.createElement("iframe");
		document.body.appendChild(frame);

		let parent = window;
		let child = frame.contentWindow || frame.contentDocument.parentWindow;
		let parentOrigin = '*';
		let initModel = {};

		// Wait for hadshake
		child.addEventListener('message', (event) => {
			expect(event.data.command).toBe('handshake');
			parent.postMessage({
				command: 'handshake-reply',
				type: messageType,
				parentId: event.data.id,
			}, event.origin);
			done();
			// send handshake
		});

		ParentApi
			.connect(initModel, parent, child, parentOrigin)
			.then((parentApi) => {
				parentId = parentApi.id;
				expect(parentApi.id).not.toBe(undefined);
				expect(parentApi.id).not.toBe(null);
				expect(typeof parentApi).toBe('object');
			});
	})


	it('should create a parent api on handshake', (done) => {
		const frame = document.createElement("iframe");
		document.body.appendChild(frame);
	
		let parent = window;
		let child = frame.contentWindow || frame.contentDocument.parentWindow;
		let parentOrigin = '*';
		let initModel = {};

		// Wait for hadshake
		child.addEventListener('message', (event) => {
			expect(event.data.command).toBe('handshake');
			parent.postMessage({
				command: 'handshake-reply',
				type: messageType,
				parentApi: event.data.id,
			}, event.origin);
			// send handshake
		});

		ParentApi
			.connect(initModel, parent, child, parentOrigin)
			.then((parentApi) => {
				expect(typeof parentApi).toBe('object');
				done();
			});
	})



	it('should call function from child', (done) => {
		const frame = document.createElement("iframe");
		document.body.appendChild(frame);

		let data = Math.random();
		let parent = window;
		let child = frame.contentWindow || frame.contentDocument.parentWindow;
		let parentOrigin = '*';
		let initModel = {
			methodToCall: (inputData) => {
				expect(inputData).toBe(data);
				done();
			}
		};

		ChildApi
			.connect(initModel, child)
			.then((childApi) => {
				expect(childApi).not.toBe(undefined);
				expect(childApi).not.toBe(null);
			});

		ParentApi
			.connect({}, parent, child, parentOrigin)
			.then((parentApi) => {
				expect(parentApi).not.toBe(undefined);
				expect(parentApi).not.toBe(null);
				parentApi.call('methodToCall', data);
			});
	})



	it('should get property from child', (done) => {
		const frame = document.createElement("iframe");
		document.body.appendChild(frame);

		let data = Math.random();
		let parent = window;
		let child = frame.contentWindow || frame.contentDocument.parentWindow;
		let parentOrigin = '*';
		let initModel = {
			data: data
		};

		ChildApi
			.connect(initModel, child)
			.then((childApi) => {
				expect(childApi).not.toBe(undefined);
				expect(childApi).not.toBe(null);
			});

		ParentApi
			.connect({}, parent, child, parentOrigin)
			.then((parentApi) => {
				expect(parentApi).not.toBe(undefined);
				expect(parentApi).not.toBe(null);
				parentApi
					.get('data')
					.then(childData => {
						expect(childData).toBe(data);
						done();
					})
			});
	})
})