# Asynchronous Loading

Okay, different translations for different languages is pretty cool. But it's even better if you're able to load translations asynchronously right? the translate has some pretty cool extensions to support asynchronous and lazy loading of translation data. And it works like a charm.

## Asynchronous loaders

The translate provides a pretty clever way to tell $mbTranslate service to load data asynchronously. To load your data from a server you have to use an asynchronous loader, which gets invoked later at runtime when it's needed. translate comes with support for three different asynchronous loaders.

### Using urlLoader

This is possibly the simplest way of loading translation data asynchronously. Alright, the loader is available, we now have to tell translate to use it. $mbTranslateProvider provides a method called useUrlLoader(). Pretty straight forward, ha? useUrlLoader() expects an argument that describes the endpoint of a server that'll respond with translation data.

In addition, when using asynchronous loaders, we have to use $mbTranslateProvider.preferredLanguage(), to let translate know for which language it should load the translation data.

	$mbTranslateProvider.useUrlLoader('foo/bar.json');
	$mbTranslateProvider.preferredLanguage('en');

translate uses the extension to transform the given string, to a real loader function which can be invoked later at runtime, once $mbTranslate service is instantiated. In addition to that, telling translate to use the language key 'en', adds the language key as request parameter to the given loader string.

So, the example above actually requests foo/bar.json?lang=en. translate also notices that there isn't any translation data available at startup and will invoke the loader automatically as soon as possible.

### Using staticFilesLoader

In case you haven't got just a URL which expects a lang parameter to return a JSON that contains your translations, but several localization files which match a specific pattern, you probably want to use the translate-loader-static-files extension which describes the pattern of your localization files.

Once the package is installed and embedded, you can use $mbTranslateProvider method useStaticFilesLoader() to tell translate that it should use it. The static files loader works a bit differently. Instead of having a fixed url which just expects a lang parameter, you are now able to have different localization files that match a specific pattern.

How that kind of pattern looks like depends on your needs. To specify a pattern, the following information is required:

- prefix - specifies file prefix
- suffix - specifies file suffix

Let's say you have two localization files locale-de.json and locale-en.json. You can simply use the loader like this:

	$mbTranslateProvider.useStaticFilesLoader({
	    prefix: 'locale-',
	    suffix: '.json'
	});

	$mbTranslateProvider.preferredLanguage('en');

Alternatively, if you have multiple translation files in distinct locations, you may instead supply an array of files to the loader:

	$mbTranslateProvider.useStaticFilesLoader({
	    files: [{
	        prefix: 'locale-',
	        suffix: '.json'
	    }, {
	        prefix: '/absolute/path/to/locale-',
	        suffix: '.json'
	    }, {
	        prefix: 'another/path/to/locales/',
	        suffix: ''
	    }]
	});

	$mbTranslateProvider.preferredLanguage('en');

translate will concatenate the given information to {{prefix}}{{langKey}}{{suffix}}. So this will load locale-en.json. And again, since there isn't any translation data available yet, it'll load it as soon as possible automatically.

### Using partialLoader

When having a bigger complex app, you usually break your app down in several submodules. For example, you could have a module mainApp which depends on something like a home and a contact module. These are just two submodules but now imagine you have a really big app that depends on 10 or 20 submodules!

In such apps maybe 13 of the 20 submodules never get executed because the user just don't get there. However, when translating contents of such a big app where maybe about 50% of the app is not always executed, it's not very cool to load all the translation data for the whole app, just in a different language.

What we need, is a way to just load the translation data of a language for a specific module we're currently on. Which means, when accessing the home submodule, we just want to load the translation data for the home module. If we change the language, we also just want to load the translation for the chosen language for the home module.

In addition, when we've already loaded translation data for let's say three different modules, and change the language and then change the language again to the language we already had, we don't want to load the data again, because we already loaded it a little while ago.

Yea, these are all the things we have to care about when we wanna have partial loading. However, translate got your covered. This is where partialLoader comes in.

You can install it like every other loader by simply using Bower:

	$ bower install translate-loader-partial

When using partialLoader you have to think about which pattern translate should use to load your translation data. It's similar to staticFilesLoader but a bit more specifc. You have to specify a part and a lang property, where part is your specifc part of your app (maybe home) and lang is the lang key just as you know.

Let's say we've structured our translation files by module and the files look like this:

	/i18n/home/en.json
	/i18n/home/de.json
	/i18n/contact/en.json
	/i18n/contact/de.json

Pretty straight forward ha? Now that we know how our data is structured, we can configure $mbTranslateProvider to use the partial loader with this pattern:

	$mbTranslateProvider.useLoader('$mbTranslatePartialLoader', {
	  urlTemplate: '/i18n/{part}/{lang}.json'
	});

Almost done! Of course translate has to know which language to use, which is why we add the following:

	$mbTranslateProvider.preferredLanguage('en');

Okay, nothing new. Now it gets interesting. How does translate know which "part" to load? To make it short: it can't. You have to tell translate which part you want to load when.

partialLoader comes with a provider you can use to configure the inital state of the loader. So, to use this provider we have to inject it into our config function:

	angular.module('main')
	.config(function ($mbTranslateProvider, $mbTranslatePartialLoaderProvider) {
	 
	});

Allright. Now, to let translate know which part it should load, we use $mbTranslatePartialLoaderProvider's addPart() method. So we simply say something like:

	$mbTranslatePartialLoaderProvider.addPart('home');
	$mbTranslateProvider.useLoader('$mbTranslatePartialLoader', {
	  urlTemplate: '/i18n/{part}/{lang}.json'
	});
	$mbTranslateProvider.preferredLanguage('en');

As you can see, the whole functionality for partial loader sits in the provided loader, rather then translate itself. The pattern is now complete and translate will execute the loader as soon as possible.

Okay, so this is the inital process but what about runtime? What if a user comes accross the contact module and we only want to load the translation data for the current language for the contact module?

$mbTranslatePartialLoaderProvider configures $mbTranslatePartialLoader which means you're able to inject $mbTranslatePartialLoader into your controllers and services to make use of it. But why do you want to? As you can add a translation part to the loader via the provider, you can also do so with the provided service to manipulate loader state at runtime. So what does that mean? It means, you just have to inject the loader and use that one to add additional translation parts.

Let's say we have a ContactCtrl within our contact module, things could look like this:

	angular.module('contact')
	.controller('ContactCtrl', function ($scope, $mbTranslatePartialLoader) {
	  $mbTranslatePartialLoader.addPart('contact');
	});

That wasn't hard, right? So what happens here is we manipulate our loaders state during runtime. This makes sure that translate only loads specific translation data when we really want to. Once you added a new part, $mbTranslatePartialLoader fires an $mbTranslatePartialLoaderStructureChanged event.

Until now there's no additional data loaded! translate doesn't know about the loaders state so you have to tell translate to refresh the current translation tables. Refreshing translation tables drops (if no table is specified) and reloads them. So basically, to achieve partial loading, all you have to do is to manipulate the state of the loader by saying which parts to add and then refreshing the tables. Because, when changing the loaders state with new parts, they get loaded the next time the loader gets invoked.

So all we have to do is simply adding the following:

	angular.module('contact')
	.controller('ContactCtrl', function ($scope, $mbTranslatePartialLoader, $mbTranslate) {
	  $mbTranslatePartialLoader.addPart('contact');
	  $mbTranslate.refresh();
	});

You can also use the $mbTranslatePartialLoaderStructureChanged event to automate the process, by listening to that event with $rootScope and refreshing translation tables everytime it gets fired.

	app.run(function ($rootScope, $mbTranslate) {
	  $rootScope.$on('$mbTranslatePartialLoaderStructureChanged', function () {
	    $mbTranslate.refresh();
	  });
	});

Since $mbTranslate.refresh() returns a promise, it works beautifully together with either ngRoute module or UI Router.

An interesting question is how to deal with loading errors. By default the partial loader rejects a whole loading process if any of the parts was not loaded from the server. But you can change this behavior a bit. The loader provides an ability to specify an error handler - a service which will be called if some part can not be loaded. In this service you are able to do anything to handle such situations.

There are a few things you have to know before you'll be able to create your first error handler:

1) The partial loader expects the error handler to have the following signature function (part:String, langKey:String, response: Response):Promise 2) You have to either resolve the promise with a translation table for the given part and language or reject it 3) The partial loader will use the given translation table like it was successfully fetched from the server 4) If you reject the promise, then the loader will reject the whole loading process

Here is an example of a simple error handler:

	angular.module('translation')
	.factory('MyErrorHandler', function ($q, $log) {
	  return function (part, lang, response) {
	    $log.error('The "' + part + '/' + lang + '" part was not loaded.');
	    return $q.when({});
	  };
	});

So, now all we have to do is to tell the partial loader which service it has to use as an error handler:

	$mbTranslateProvider.useLoader('$mbTranslatePartialLoader', {
	  urlTemplate: '/i18n/{part}/{lang}.json',
	  loadFailureHandler: 'MyErrorHandler'
	});

## Lazy loading at runtime

Once your app bootstraps, it'll load needed translation data asynchronously as soon as possible. Okay, cool. But what if a user wants to change the language and the corresponding translation data isn't also loaded yet?

In Multi Language you've learned, how to change the language at runtime using $mbTranslate.use(). Know what? Nothing will change when dealing with asynchronous loaders. $mbTranslate.use() checks if a translation table for a given language key is present or not. And if not, it'll invoke the registered loader to get it down! Lazy loading at it best!

Note: Please notice that in case of using partialLoader you have to refresh translation tables first!

## Configuration of a loader

Each loader can be applied a dedicated configuration options, both for the common constructor useLoader() and useStaticFilesLoader(options):

	$mbTranslateProvider.useLoader('customLoader', {
	  settingA: 'foobar'
	});
	$mbTranslateProvider.useStaticFilesLoader({
	  $http: {
	    method: 'POST'
	  }
	});

The property $http will be used internally in the loaders, except attribute cache could be overridden (see next chapter)).

## Using a cache

In order to control the caching behavior of the existing loaders, you can use an cache instance. See more details about this at the Official AngularJS Docs.

In order to enable a standard cache, you can use following shortcut:

$mbTranslateProvider.useLoaderCache(true); // default is false which means disable
If you have already an instance (i.e. advanced configuration), you can bind this:

$mbTranslateProvider.useLoaderCache(yourSpecialCacheService);
translate also supports lazy binding for instances, so this will work, too:

$mbTranslateProvider.useLoaderCache('yourSpecialCacheService');
The instance named with ID yourspecialCacheService will be looked up on demand.

FOUC - Flash of untranslated content
There's one drawback when using asynchronous loaders to get your translation data into the app. There's a little amount of time when your app launches where you have this little kind of flickering, because your translation data isn't loaded yet. This is actually not a bug of translate, but a pretty logical behavior since we return executing stuff asynchronously.

To get around this, you could provide at least one language with your app without having to load it asynchronously. If your app then uses this provided language as default language, using $mbTranslateProvider.preferredLanguage(), you won't have this FOUC, because the language to use is already there.

Just use a combination of $mbTranslateProvider.translations() and $mbTranslateProvider.{{whatever}}Loader like this:

	$mbTranslateProvider.translations('en', {
	    'HELLO_TEXT': 'Hello World!'
	});
	$mbTranslateProvider.useStaticFilesLoader({
	    'prefix': 'locale-',
	    'suffix': '.json'
	});
	$mbTranslateProvider.preferredLanguage('en');

Note: An Angular Translate user has been posted a nice solution using Grunt. Another user has published a solution using Gulp.

If you use UI-Router, there is a simpler solution to avoid FOUC. Just add a new resolve to your global application state that returns a call to $mbTranslate.onReady, effectively blocking the rendering of the app until the first translation file is loaded:

	resolve: {
	  translateReady: ['$mbTranslate', function($mbTranslate) {
	    return $mbTranslate.onReady();
	  }]
	}

Let's update our sample app accordingly to use an asynchronous loader! We'll use the staticFilesLoader. First, we have to pull the translation tables out of the code and put them into separate locale files:

Note: The data is now provided as JSON so make sure to put everything in double quotes! Also make sure to NOT copy the comment and let your server send JSON as JSON not as plain text!

	// locale-en.json
	{
	  "HEADLINE": "What an awesome module!",
	  "PARAGRAPH": "Srsly!",
	  "PASSED_AS_TEXT": "Hey there! I'm passed as text value!",
	  "PASSED_AS_ATTRIBUTE": "I'm passed as attribute value, cool ha?",
	  "PASSED_AS_INTERPOLATION": "Beginners! I'm interpolated!",
	  "VARIABLE_REPLACEMENT": "Hi {{name}}",
	  "BUTTON_LANG_DE": "German",
	  "BUTTON_LANG_EN": "English"
	}
	// locale-de.json
	{
	  "HEADLINE": "Was für ein großartiges Modul!",
	  "PARAGRAPH": "Ernsthaft!",
	  "PASSED_AS_TEXT": "Hey! Ich wurde als text übergeben!",
	  "PASSED_AS_ATTRIBUTE": "Ich wurde als Attribut übergeben, cool oder?",
	  "PASSED_AS_INTERPOLATION": "Anfänger! Ich bin interpoliert!",
	  "VARIABLE_REPLACEMENT": "Hi {{name}}",
	  "BUTTON_LANG_DE": "deutsch",
	  "BUTTON_LANG_EN": "englisch"
	}

Next we setup $mbTranslate service using $mbTranslateProvider:

	// configures staticFilesLoader
	$mbTranslateProvider.useStaticFilesLoader({
	  prefix: 'data/locale-',
	  suffix: '.json'
	});
	// load 'en' table on startup
	$mbTranslateProvider.preferredLanguage('en');

## Force asynchronous reloading

When using a combination of $mbTranslateProvider.translations() and $mbTranslateProvider.{{whatever}}Loader, for each language keys declared using $mbTranslateProvider.translations(), the asynchronous loader will not be called.

To get around this, you can enable the $mbTranslateProvider.forceAsyncReload() like this:

	$mbTranslateProvider.translations('en', {
	    'HELLO_TEXT': 'Hello World!'
	});
	$mbTranslateProvider.useStaticFilesLoader({
	    'prefix': 'locale-',
	    'suffix': '.json'
	});
	$mbTranslateProvider.preferredLanguage('en');
	$mbTranslateProvider.forceAsyncReload(true);


This way, even if the language key is already declared using $mbTranslateProvider.translations() the asynchronous loader will be called and translations from both sources will be merged.

Note: If a same translation id is declared in both sources, the translation from the asynchronous loader will be used.

Since we don't have to make any changes in our controllers or HTML, we are done! Take a look at the working app: