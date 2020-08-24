# Getting Start

Teaching your app a language with $mbTranslateProvider is very easy. First you have to inject the provider into your application configuration function (which is the only place where you can access it).

	mblowfish.config(function($mbTranslateProvider) {
	 
	});

Now, to add a language, you have to make $mbTranslateProvider know of a translation table. What does that mean? It's actually quite simple. translate expects translation tables as JSON objects. So all you have to do, is to represent your translation data as JavaScript hash object, or, when loading remotely, as a JSON object. This is how a translation table could look like:

	{
	  "TRANSLATION_ID": "This is a concrete translation for a specific language."
	}

Is that easy? The translation table above contains just one translation. As you can see, the key represents a translation ID, whereas the value represents the concrete translation for a certain language. You don't even have to provide any information in your translation table, to which language it corresponds. But more on that later.

You can also organize your translations by enclosing them inside namespaces. This is particularly interesting for big websites with many and/or long pages. All you have to do is to create nested JSON objects:

	{
	  "NAMESPACE": {
	    "SUB_NAMESPACE": {
	       "TRANSLATION_ID1": "This is a namespaced translation."
	    }
	  }
	}

This translation table only contains one translation, but you can extend it very easily. You can have various nesting levels in your translation table, and each namespace can contain as many subnamespace as you want making it very flexible for you to use!

## Shortcuts and Links

A very neat feature that is available is usage of Shortcuts and Links. Let's say you have a translation table that looks like this:

	{
	  "bar": {
	    "foo": {
	      "foo": "This is my text."
	    }
	  }
	}

You would later access the existing translation id actually via bar.foo.foo. So, this is pretty much okay, but we can do better. Translate is clever enought to recognize, if there's a translation id that has the same identifier as its corresponding namespace. If that is the case, you can access the translation id with a simple shortcut by just pointing to the regarding namespace rather than the translation id. This is possible, because there can only be one translation id with the same identifier under the same namespace.

So this basically means, you can access the translation id above with the shortcut bar.foo. 

Another feature that translate provides is the ability to link within your translation table from one translation id to another. Let's say we have the following translation table:

	{
	  "SOME_NAMESPACE": {
	    "OK_TEXT": "OK"
	  },
	  "ANOTHER_NAMESPACE": {
	    "OK_TEXT": "OK"
	  }
	}

So, as you can see, we have introduced two namespaces here, but both of them kind of need a text that probably just says "OK". This case isn't unusual if you just think about a confirmation button or similar in your app. However, it isn't hard to recognize that we have a redundancy here and we as developers don't like redundancy, right?

If there's a translation id that will always have the same concrete text as another one you can just link to it. To link to another translation id, all you have to do is to prefix its contents with an @: sign followed by the full name of the translation id including the namespace you want to link to. So the example above could look like this:

	{
	  "SOME_NAMESPACE": {
	    "OK_TEXT": "OK"
	  },
	  "ANOTHER_NAMESPACE": {
	    "OK_TEXT": "@:SOME_NAMESPACE.OK_TEXT"
	  }
	}

## Load Translation Table

Let's add a translation table to our app. $mbTranslateProvider provides a method called translations(), which takes care of that. Let's say we have a translation table like this:

	var translations = {
	  HEADLINE: 'What an awesome module!',
	  PARAGRAPH: 'Srsly!',
	  NAMESPACE: {
	    PARAGRAPH: 'And it comes with awesome features!'
	  }
	};

We can add this table with the use of $translateProvider.translations():

	mblowfish.config(function ($translateProvider) {
	  // add translation table
	  $translateProvider
	    .translations('en', translations)
	    .preferredLanguage('en');
	});

This is basically all you have to do. Simply specify a language key and add a translate table for it. After that tell angular-translate what the preferred language is. Since we're adding the translation tables at configuration time, $translate service is able to access it, once it is instantiated and used.



