#Using translate directive

Another way to translate contents within the view layer is to use the translate directive. Using translate filter is great, but using translate directive is better. It turned out that having too many filters in a view sets up too many watch expressions, which is why translate also provides a directive to translate your contents in view layer.

## General usage

You can use translate directive in many different ways. This is how the general usage looks like:

	<ANY translate>TRANSLATION_ID</ANY>

You can also pass a translation ID as attribute value of the translate directive like this:

	<ANY translate="TRANSLATION_ID"></ANY>

Even if that's already a very flexible way of using a directive, translate offers another way of using it. Let's say a translation ID isn't available as a concrete identifier, because e.g. one is looping over a dataset which contains a translation ID in each iterator. In that case a translation ID is only dynamically available. You actually have to interpolate the ID itself first. 

	<ANY translate="{{toBeInterpolated}}"></ANY>
	<ANY translate>{{toBeInterpolated}}</ANY>


## Post compiling

The translation itself can be post processed in context of the current scope. This means any directive used in a translation value itself will now work as expected.

This behavior can be enabled per directive:

	<ANY translate="TRANSLATION_ID" translate-compile></ANY>

In addition to it, you can also enable the feature globally with...

	$mbTranslateProvider.usePostCompiling(true);

... and even then you can disable the feature again per directive:

	<ANY translate="TRANSLATION_ID" translate-compile="false"></ANY>

## Translate HTML Attributes

You can already translate any HTML element's attribute using the translate filter, but as mentioned above this can create a ton of unnecessary watches on your pages. Here's a better way to translate those attributes using the translate-attr directive.

	<ANY translate-attr="{ ATTRIBUTE_NAME: 'TRANSLATION_ID' }"></ANY>

Substitute the HTML element attribute's name for ATTRIBUTE_NAME and you will get all the benefits of the translate directive used for that attribute!

	<img src="mylogo.png" translate-attr="{ alt: 'LOGO' }"></img>

This attribute is parsed and watched, so you can also supply a controller-provided object, and you can use one-time binding by prefixing your statement with ::. Here's an example of both:

	// given a scope variable attrTranslations = { alt: 'LOGO', title: 'TITLE' }
	<img src="mylogo.png" translate-attr="::attrTranslations">
	<ANY translate translate-attr-ATTRIBUTE_NAME="TRANSLATION_ID"></ANY>

