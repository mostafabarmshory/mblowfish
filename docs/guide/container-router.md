# Container Router

## Container-based Applications

It is recommended to develop Mblowfish applications as a hierarchy of containers. Each container is an isolated part of the application, which is responsible for its own user interface and has a well defined programmatic interface to the Component that contains it. Take a look at the component guide for more information.

![Container Based Architecure](../images/component-based-architecture.svg "container based architecure")


## URLs and Navigation

In most applications, users navigate from one view to the next as they perform application tasks. The browser provides a familiar model of application navigation. We enter a URL in the address bar or click on a link and the browser navigates to a new page. We click the browser's back and forward buttons and the browser navigates backward and forward through the history of pages we've seen.

We understand that each view corresponds to a particular URL. In a Container-based application, each of these views is implemented by one or more Container.

## Container Routes

How do we choose which container to display given a particular URL?

When using the Container Router, each Container in the application can have a Router associated with it. This Router contains a mapping of URL segments to child Container.

The Container id is used as the URL. For example, by adding a new view (a special container) a new route will be added in the container route system:

	$mbViewProvider.addView('/a/b/c',{
		controller: 'ContainerCtr',
		controllerAs: 'ctrl',
		templateUlr: 'path/to/template.html',
	});

This means that for a given URL(ID) the Router will render an associated child Container.

Depending on the layout sysetm, one or more container may render on screen based on the current URL. For example the Docker layout loads each container in a area on the current screen while the Mobile layout remove all old containers and replace the new one.

