# Custom Error Handler

Of course you want to be able to use your own custom handler. Besides useMissingTranslationHandlerLog() there's another method called useMissingTranslationHandler() which expects the name of a factory which returns your custom handler. So how does that look like?

	mblowfish.config(function ($translateProvider) {
	  // tell angular-translate to use your custom handler
	  $translateProvider.useMissingTranslationHandler('myCustomHandlerFactory');
	});
 
	// define custom handler
	mblowfish.factory('myCustomHandlerFactory', function (dep1, dep2) {
	  // has to return a function which gets a tranlation ID
	  return function (translationID) {
	    // do something with dep1 and dep2
	  };
	});
	
## Using a default replacement text in case of errors

Sometimes, you want to provide a default replacement text (not key) for the frontend so that translators or even end users (bad idea though) can see where they need to do work though. This is now possible with a slightly modified Custom Error Handler. Just return a value to the angular-translate framework from within the error handler.

	mblowfish.factory('customTranslationHandler', function () {
	  return function (translationID, uses) {
	    // return the following text as a translation 'result' - this will be
	    // displayed instead of the language key.
	    return 'NO DEFAULT KEY';
	  };
	});

Sure, you can also add the translationID to the return value so that the person who is in charge of translations sees the originating key!