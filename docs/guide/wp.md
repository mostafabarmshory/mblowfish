# Inner Web Application communication protocol


_WP_ is a promise-based API built on `postMessage`. It allows a parent page to speak 
with a child `iFrame` across origins with minimal effort.

## Features

* Promise-based API for elegant and simple communication.
* Secure two-way parent <-> child handshake, with message validation.
* Child exposes a retrievable `model` object that the parent can access.
* Child emits events that the parent can listen to.
* Parent can `call` functions within a `child`
* *Zero* dependencies. Provide your own polyfill or abstraction for the `Promise` API if needed.

NOTE: While the underlying mechanism is [window.postMessage()](https://developer.mozilla.org/en-US/docs/Web/API/Window/postMessage), only iFrame is supported.

## Installing

_WP_ can be installed via NPM.

```bash
# Install via Yarn
$ yarn add @mblowfish/wp
```

```bash
# Install via NPM
$ npm i @mblowfish/wp --save 
```

## Glossary

* **`wp`**: The **top level** page that will embed an `iFrame`, creating a `Child`.
* **`Child`**: The **bottom level** page loaded within the `iFrame`.
* **`Model`**: The object that the `Child` exposes to the `Parent`.
* **`Handshake`**: The process by which the parent frame identifies itself to the child, and vice versa. 

When a handshake is complete, the two contexts have bound their event listeners and identified one another.

## Usage

1. The `WP` begins communication with the `Child`. A handshake is sent, the `Child` responds with a 
handshake reply, finishing `Parent`/`Child` initialization. The two are bound and ready to 
communicate securely.

2. The `Parent` fetches values from the `Child` by property name. The `Child` can emit messages 
to the parent. The `Parent` can `call` functions in the `Child` `Model`.

### Example

**parent.com**
```javascript
import ParentApi from 'mblowfish/wb/ParentApi';
// Kick off the handshake with the iFrame
ParentApi
	.createIframe({
		container: document.getElementById('some-div'), // Element to inject frame into
		url: 'http://child.com/page.html', // Page to load, must have postmate.js. This will also be the origin used for communication.
		name: 'my-iframe-name', // Set Iframe name attribute. Useful to get `window.name` in the child.
		classListArray: ["myClass"] //Classes to add to the iframe via classList, useful for styling.
	})
	.then(child => {
		// When parent <-> child handshake is complete, data may be requested from the child
		// Fetch the height property in child.html and set it to the iFrames height
		child
			.get('height')
			.then(height => child.frame.style.height = `${height}px`);
		// Listen to a particular event from the child
		child.on('some-event', data => console.log(data)); // Logs "Hello, World!"
	});
```

**child.com/page.html**
```javascript
import ClientApi from 'mblowfish/wb/ClientApi';
ClientApi
	.connect({
		// Expose your model to the Parent. Property values may be functions, promises, or regular values
		height: () => document.height || document.body.offsetHeight
	});
	.then(parent => {
		// When parent <-> child handshake is complete, events may be emitted to the parent
		parent.emit('some-event', 'Hello, World!');
	});
```

## Enable Debug

By enabling debug mode all logs will be printed console

```javascript
// Enable debug to print logs
window.debug = true;
// ...
```

## Troubleshooting/FAQ

### Why use Promises for an evented API?

_WP_ provide a clear API for fetching data. 
Using an evented approach often starts backwards. 
if the parent wants to know the childs height, the child would need to alert the parent, 
whereas with Postmate, the Parent will request that information from the child in a 
synchronous-like manner. The child can emit events to the parent as well, for those 
other use-cases that still need to be handled.

### I've enabled logging but the parent or child is not logging everything.

_WP_ needs to be set in both the parent and child for each of them to log their respective information.

### The child does not respond to communication from the Parent

Sure that you have create ChildApi in your child page.

### I want to retrieve information from the parent by the child

_WP_ (by design) is restrictive in its modes of communication. 
This enforces a simplistic approach: 
The parent is responsible for logic contained within the parent, 
and the child is responsible for logic contained within the child. 
If you need to retrieve information from parent -> child, consider setting a default `model` in the parent that the child may extend.

### I want to send messages to the child from the parent

This is specifically what the `call` function is for.

### What is the Handshake and why do I need one?

By default, all `message` events received by any (parent) page can come from any (child) location.
This means that the `Parent` must always enforce security within its message event, ensuring that 
the `child` (origin) is who we expect them to be, that the message is a response from an original 
request, and that our message is valid. The handshake routine solves this by saving the identities 
of the child and parent and ensuring that no changes are made to either.

### How are messages validated?

The origin of the request, the message type, the postMessage mime-type, and in some cases the message
response, are all verified against the original data made when the handshake was completed.

