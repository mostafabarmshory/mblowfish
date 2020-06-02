# Bootstrap

This page explains the MBlowfish initialization process and how you can manually initialize MBlowfish if necessary.

## AngularJS script Tag

This example shows the recommended path for integrating AngularJS with what we call automatic initialization.

	<!doctype html>
	<html xmlns:ng="http://angularjs.org" ng-app>
	  <body>
	    ...
	    <script src="angular.js"></script>
	  </body>
	</html>

1. Place the script tag at the bottom of the page. Placing script tags at the end of the page improves app load time because the HTML loading is not blocked by loading of the angular.js script. You can get the latest bits from http://code.angularjs.org. Please don't link your production code to this URL, as it will expose a security hole on your site. For experimental development linking to our site is fine.

- Choose: angular-[version].js for a human-readable file, suitable for development and debugging.
- Choose: angular-[version].min.js for a compressed and obfuscated file, suitable for use in production.

2. Place ng-app to the root of your application, typically on the <html> tag if you want AngularJS to auto-bootstrap your application.

3. If you choose to use the old style directive syntax ng: then include xml-namespace in html when running the page in the XHTML mode. (This is here for historical reasons, and we no longer recommend use of ng:.)


## Automatic Initialization

AngularJS initializes automatically upon DOMContentLoaded event or when the angular.js script is evaluated if at that time document.readyState is set to 'complete'. At this point AngularJS looks for the ngApp directive which designates your application root. If the ngApp directive is found then AngularJS will:

![Data flows](images/concepts-startup.png "concepts startup")

- load the module associated with the directive.
- create the application injector
- compile the DOM treating the ngApp directive as the root of the compilation. This allows you to tell it to treat only a portion of the DOM as an AngularJS application.

	<!doctype html>
	<html ng-app="optionalModuleName">
	  <body>
	    I can add: {{ 1+2 }}.
	    <script src="angular.js"></script>
	  </body>
	</html>

As a best practice, consider adding an ng-strict-di directive on the same element as ng-app:

	<!doctype html>
	<html ng-app="optionalModuleName" ng-strict-di>
	  <body>
	    I can add: {{ 1+2 }}.
	    <script src="angular.js"></script>
	  </body>
	</html>

This will ensure that all services in your application are properly annotated. See the dependency injection strict mode docs for more.


## Manual Initialization

If you need to have more control over the initialization process, you can use a manual bootstrapping method instead. Examples of when you'd need to do this include using script loaders or the need to perform an operation before MBlowfish compiles a page.

Here is an example of manually initializing MBlowfish:


	<!doctype html>
	<html>
	<body>
		<div ng-controller="MyController">
			Hello {{greetMe}}!
		</div>
		<script src="http://code.angularjs.org/snapshot/angular.js"></script>
	
		<script>
			mblowfish.element(function() {
				mblowfish.bootstrap(document);
			});
		</script>
	</body>
	</html>

Note that we provided the name of our application module to be loaded into the injector as the second parameter of the angular.bootstrap function. Notice that mblowfish.bootstrap will not create modules on the fly. You must create any custom modules before you pass them as a parameter.

You should call mblowfish.bootstrap() after you've loaded or defined your modules. You cannot add controllers, services, directives, etc after an application bootstraps.

Note: You should not use the ng-app directive when manually bootstrapping your app.
This is the sequence that your code should follow:

After the page and all of the code is loaded, find the root element of your MBlowfish application, which is typically the root of the document.

Call mblowfish.bootstrap to compile the element into an executable, bi-directionally bound application.


## Things to keep in mind

There are a few things to keep in mind regardless of automatic or manual bootstrapping:

While it's possible to bootstrap more than one AngularJS application per page, we don't actively test against this scenario. It's possible that you'll run into problems, especially with complex apps, so caution is advised.
Do not bootstrap your app on an element with a directive that uses transclusion, such as ngIf, ngInclude and ngView. Doing this misplaces the app $rootElement and the app's injector, causing animations to stop working and making the injector inaccessible from outside the app.

## Deferred Bootstrap

This feature enables tools like Batarang and test runners to hook into angular's bootstrap process and sneak in more modules into the DI registry which can replace or augment DI services for the purpose of instrumentation or mocking out heavy dependencies.

If window.name contains prefix NG_DEFER_BOOTSTRAP! when angular.bootstrap is called, the bootstrap process will be paused until angular.resumeBootstrap() is called.

angular.resumeBootstrap() takes an optional array of modules that should be added to the original list of modules that the app was about to be bootstrapped with.

