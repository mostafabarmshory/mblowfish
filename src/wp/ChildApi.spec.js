/* eslint-disable no-console */
import ChildApi from './ChildApi';
import ParentApi from './ParentApi';
import {
	messageType,
} from './Constants';
window.debug = false;

describe('ChildApi class', () => {

	it('should be ready to rock', () => {
		expect(typeof ChildApi !== 'undefined')
		expect(typeof ChildApi).toBe('function')
		expect(typeof ChildApi.emit !== 'undefined')
	});

	it('should create instance', () => {
		const childMock = new ChildApi({ foo: 'bar' }, document.body, parent, 'https://parent.com');
		expect(typeof childMock).toBe('object')
	});


	it("sould send handshake reply to parent", (done) => {
		const initModel = {
			xxx: Math.random(),
		};
		const iframe = document.createElement("iframe");
		document.body.appendChild(iframe);


		ChildApi.connect(initModel, iframe.contentWindow).then((childApi) => {
			expect(childApi.model.xxx).toBe(initModel.xxx);
			expect(typeof childApi).toBe('object');
			done();
		});

		// Sending handshake message
		iframe.contentWindow.postMessage({
			command: 'handshake',
			type: messageType,
			model: {},
			id: 1,
		}, "*");
	});



	it("sould not send handshake reply to non-supported command", (done) => {
		const initModel = {
			xxx: Math.random(),
		};
		const iframe = document.createElement("iframe");
		document.body.appendChild(iframe);


		ChildApi.connect(initModel, iframe.contentWindow).then(() => {
			// Do noting
		}, () => {
			// recive regect
			done();
		});

		// Sending handshake message
		iframe.contentWindow.postMessage({
			command: 'handshake-not support',
			type: messageType,
			model: {},
			id: 1
		}, "*");
	});


	it('should get emit event to parent', (done) => {
		const frame = document.createElement("iframe");
		document.body.appendChild(frame);

		let signal = 'xxx';
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
				childApi.emit(signal, data);
			});

		ParentApi
			.connect({}, parent, child, parentOrigin)
			.then((parentApi) => {
				expect(parentApi).not.toBe(undefined);
				expect(parentApi).not.toBe(null);
				parentApi
					.on(signal, (inputData) => {
						expect(inputData).toBe(data);
						done();
					})
			});
	})
});



