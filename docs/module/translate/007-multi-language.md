## Multi Language

In Variable replacement you've learned how to pass dynamic values through the different components, to make use of them within your translations. Since we've covered all the basic functionality these components provide (using the default interpolation service), we are now ready to get to the next level: Multi Language Support.

Of course, it's pretty cool to know how to use the components translate provides, but things are getting really interesting when it comes to teaching your apps more than just one language (which is actually what this module is for!). So let's get started by learning how to add different translation tables at a time!

## Teaching your app more languages

In Getting Started you've learned how to add a translation table to your app, using $mbTranslateProvider method translations(). The same method can be used to add more translation tables at a time. The given translation tables just have to come with a language key that translate is able to recognize, which translation table belongs to which language.

Adding a translation table with a corresponding language key is very simple. Instead of passing just the table as argument through translations(), you can pass the language key as first argument, whereas the translation table becomes the second argument. So adding translation table with a language key looks like this:

	// registers translation table with language key 'en'
	$mbTranslateProvider.translations('en', {
	  GREETING: 'Hello world!'
	});

Now, to add a second translation table for another language, let's say German, just do the same with a different language key:

	// registers translation table with language key 'de'
	$mbTranslateProvider.translations('de', {
	  GREETING: 'Hallo Welt!'
	});

Is that simple? Your app now knows about two different languages. You can add as many languages as needed, there's no limit. However, since there are now two languages available, which language should be used by an app? angular-translate doesn't prefer any language until you tell it to do so.

## Decide which language to use

Since you've now registered more than one translation table, angular-translate has to know which one to use. This is where a new method of $mbTranslateProvider comes in. preferredLanguage() tells angular-translate which of the registered languages is the one that should be used by default. It expects an argument with the value of the language key, which points to a certain translation table. So, to tell an app it should use German rather than English as first language, extend the code like this:

	// tells angular-translate to use the German language
	$mbTranslateProvider.preferredLanguage('de');

Note: Because the configuration is being applied as soon as possible, you should define the preferred language after the (initial) fallback languages .fallbackLanguage().

Note: It's actually also possible to use $mbTranslateProvider.use() for that, since it's setting the languages as well. However it turns out that this is a bad practice when using asynchronous loaders in combination with a storage. In some cases it can happen that angular-translate does two asynchronous calls. You'll learn more on that in detail later. To get around this, we introduced preferredLanguage(). You should always use preferredLanguage() instead of use() on $mbTranslateProvider.

## Determining preferred language automatically

The method determinePreferredLanguage() on the $mbTranslateProvider. This method tries to determine by itself what the preferred language would be. It searches for values in the window.navigator object in the following properties (also in this order):

	navigator.languages[0]
	navigator.language
	navigator.browserLanguage
	navigator.systemLanguage
	navigator.userLanguage

So instead of calling $mbTranslateProvider.preferredLanguage(langKey), you'd do something like this:

	// try to find out preferred language by yourself
	$mbTranslateProvider.determinePreferredLanguage();

Please use this method on your own risk! Be aware that each browser can return different values on these properties.

Another helping setting is $mbTranslateProvider.uniformLanguageTag(). With this you can decide into which language tag the resolved ones should be transformed.

	$mbTranslateProvider
	  .uniformLanguageTag('bcp47') // enable BCP-47, must be before determinePreferredLanguage!
	  .determinePreferredLanguage();
 
If this doesn't fit to your needs, you can also pass in a custom function, that determines the preferred language key for you.

	$mbTranslateProvider.determinePreferredLanguage(function () {
	  var preferredLangKey = '';
	  // some custom logic's going on in here
	  return preferredLangKey;
	});

## Switching the language at runtime

To switch the language at runtime, $mbTranslate service has a method use() which either returns the language key of the current used language, or, when passing a language key as argument, tells translate to use the corresponding language. $mbTranslate.use() also invokes asynchronous loaders internally when trying to use a language of which the translation table hasn't been loaded yet. But more on that in Asynchronous Loading.

A good usage of $mbTranslate.use() would be in a controller which controls the change of a language. You just have to implement a function on the scope to expect a language key and then use it to tell angular-translate to change the language.

	mblowfish.controller('Ctrl',  function ($mbTranslate, $scope) {
	  $scope.changeLanguage = function (langKey) {
	    $mbTranslate.use(langKey);
	  };
	});

To get a feeling for how it would work in a sample app, we update our app accordingly. First, we add another translation table for the German language and add two new translation IDs for buttons we want to add later:

	var translationsEN = {
	  HEADLINE: 'What an awesome module!',
	  PARAGRAPH: 'Srsly!',
	  PASSED_AS_TEXT: 'Hey there! I\'m passed as text value!',
	  PASSED_AS_ATTRIBUTE: 'I\'m passed as attribute value, cool ha?',
	  PASSED_AS_INTERPOLATION: 'Beginners! I\'m interpolated!',
	  VARIABLE_REPLACEMENT: 'Hi {{name}}',
	  BUTTON_LANG_DE: 'German',
	  BUTTON_LANG_EN: 'English'
	};
 
	var translationsDE= {
	  HEADLINE: 'Was für ein großartiges Modul!',
	  PARAGRAPH: 'Ernsthaft!',
	  PASSED_AS_TEXT: 'Hey! Ich wurde als text übergeben!',
	  PASSED_AS_ATTRIBUTE: 'Ich wurde als Attribut übergeben, cool oder?',
	  PASSED_AS_INTERPOLATION: 'Anfänger! Ich bin interpoliert!',
	  VARIABLE_REPLACEMENT: 'Hi {{name}}',
	  BUTTON_LANG_DE: 'Deutsch',
	  BUTTON_LANG_EN: 'Englisch'
	};

After that, we update the registration of the English translation table, that it has a corresponding language key and tell angular-translate to use English as default language:

	$mbTranslateProvider.translations('en', translationsEN);
	$mbTranslateProvider.translations('de', translationsDE);
	$mbTranslateProvider.preferredLanguage('en');

Now we need controls to change the language at runtime. We update our HTML and add a button for each language. We also setup an ng-click directive on each button which calls a function to change the language:

	<button ng-click="changeLanguage('de')" translate="BUTTON_LANG_DE"></button>
	<button ng-click="changeLanguage('en')" translate="BUTTON_LANG_EN"></button>

Last but not least, we have to implement a corresponding function in our controllers scope:

	mblowfish.controller('Ctrl', function ($mbTranslate, $scope) {
	  $scope.changeLanguage = function (langKey) {
	    $mbTranslate.use(langKey);
	  };
	});

