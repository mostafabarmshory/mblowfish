# Custom Loaders

The translate wouldn't be angular-translate if it wouldn't provide you a way to build your custom asynchronous loaders. In Asynchronous loading you've learned how to use the provided loaders to load your translation data asynchronously from a service, using certain patterns.

However in some cases this isn't enough. Maybe you want to have a totally different place to store your translation data and don't even want to load them from a remote server. This is where custom loaders come in. You can build your own loaders very easily. This chapter shows you how to do it!

Building a custom loader service
If none of the provided loaders fits your needs, you can register a custom asynchronous loader as a factory. The factory has to return a function, which expects an object where at least the language key property exists. With this architecture you're as free as possible and have full control of how your asynchronous loader should behave.

A custom loader factory could look like this:

app.factory('customLoader', function ($http, $q) {
    // return loaderFn
    return function (options) {
        var deferred = $q.defer();
        // do something with $http, $q and key to load localization files
 
        var data = {
            'TEXT': 'Fooooo'
        };
 
        // resolve with translation data
        return deferred.resolve(data);
        // or reject with language key
        return deferred.reject(options.key);
    };
});
You have to make sure that your loader function returns a promise. It should either get resolved with your translation data, or rejected with the language key. As you can see, there's a key property on the options object. It has the value of the language key with which the asynchronous loader is invoked.

Make use of a custom loader
You know $translateProvider provides methods like useStaticFilesLoader() or useUrlLoader(). Both of them use useLoader() internally to register a loader factory which gets later invoked by $injector. You can use the same method for you custom service. So, to register the custom service simply do:

$translateProvider.useLoader('customLoader');
angular-translate access your custom loader factory with $injector service and does the rest for you.

Adding additional options
The options.key property indicates that options is just an object. You can extend it with additional properties to fit your own needs. For example you could expect a property foo on the options object, all you have to do is to provide the property when registering your custom loader factory.

So, if we need a property foo with a value bar we can pass it like this:

$translateProvider.useLoader('customLoader', { foo: 'bar'});
Then, in your loader factory, you can access the property via options.foo. You don't have to worry about options.key since it gets added by angular-translate internally before invoking the loader.

Let's make use of a custom loader in our sample app to show how things work! First, we build the loader like this:

app.factory('asyncLoader', function ($q, $timeout) {
 
  return function (options) {
    var deferred = $q.defer(),
        translations;
 
    if (options.key === 'en') {
      translations = {
        HEADLINE: 'What an awesome module!',
        PARAGRAPH: 'Srsly!',
        PASSED_AS_TEXT: 'Hey there! I\'m passed as text value!',
        PASSED_AS_ATTRIBUTE: 'I\'m passed as attribute value, cool ha?',
        PASSED_AS_INTERPOLATION: 'Beginners! I\'m interpolated!',
        VARIABLE_REPLACEMENT: 'Hi {{name}}',
        BUTTON_LANG_DE: 'German',
        BUTTON_LANG_EN: 'English'
      };
    } else {
      translations = {
        HEADLINE: 'Was für ein großartiges Modul!',
        PARAGRAPH: 'Ernsthaft!',
        PASSED_AS_TEXT: 'Hey! Ich wurde als text übergeben!',
        PASSED_AS_ATTRIBUTE: 'Ich wurde als Attribut übergeben, cool oder?',
        PASSED_AS_INTERPOLATION: 'Anfänger! Ich bin interpoliert!',
        VARIABLE_REPLACEMENT: 'Hi {{name}}',
        BUTTON_LANG_DE: 'Deutsch',
        BUTTON_LANG_EN: 'Englisch'
      };
    }
 
    $timeout(function () {
      deferred.resolve(translations);
    }, 2000);
 
    return deferred.promise;
  };
});
So what does it do? It uses $timeout service to wait two seconds and resolves our promise with either the English or the German translation table, depending on the language key. Now use $translateProvider.useLoader() to make use of it:

$translateProvider.useLoader('asyncLoader');
Easy! Here's our working app with a custom loader!