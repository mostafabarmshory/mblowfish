#Language Negotiation

the translate supports a feature called "Language Negotiation". With this feature, you're able to declare relations between similar language keys.

So what does that mean? Let's say you have translation tables for the languages with the language keys en and de.

	$mbTranslateProvider
	  .translations('en', { /* ... */ })
	  .translations('de', { /* ... */ });

You also tell the translate, that it should try to determine the preferred language of your app by itself, by using the .determinePreferredLanguage() method.

	$mbTranslateProvider
	  .translations('en', { /* ... */ })
	  .translations('de', { /* ... */ })
	  .determinePreferredLanguage();

We learned in Determining preferred Language automatically that using this method without any arguments, will try to determine a language key by accessing browser properties.

Now what if your browser returns en_US instead of en? Normally, this would lead to an error, because en_US is, at a first glance, just another language key. So the translate would treat it as different language. This is not what you want. What you want, is that the translate is smart enough to recognise the relation between en_US and en, and it should then use en in that case.

The translate got you covered. You can use the language negotiation system by using the registerAvailableLanguageKeys() method. This method expects an array of language keys, that you support in your app. The second parameter is an object that maps related language keys with actual language keys. Once this is set up, the translate is able to map a language en_US that is returned by a browser, to the language key en that is actually used by your app.

Regarding our use case we discussed above, it'd look like this:

	$mbTranslateProvider
	  .translations('en', { /* ... */ })
	  .translations('de', { /* ... */ })
	  .registerAvailableLanguageKeys(['en', 'de'], {
	    'en_US': 'en',
	    'en_UK': 'en',
	    'de_DE': 'de',
	    'de_CH': 'de'
	  })
	  .determinePreferredLanguage();

If the browser now returns en_US or en_UK, the translate would set en as preferred language.

You can also use wildcards to cover every territory variation for a given language:

	$mbTranslateProvider
	  .translations('en', { /* ... */ })
	  .translations('de', { /* ... */ })
	  .registerAvailableLanguageKeys(['en', 'de'], {
	    'en_*': 'en',
	    'de_*': 'de'
	  })
	  .determinePreferredLanguage();

If you want to be sure, that "non mapped" translation files are fetched or tried to be fetched in conjunction with automatic language detection, add a

	'*': 'de'

at the end of your registerAvailableLanguageKeys - configuration. This will cause all other language keys to be mapped to your "de" language table.

We should also mention that this method only makes sense to use when determinePreferredLanguage() is also used.