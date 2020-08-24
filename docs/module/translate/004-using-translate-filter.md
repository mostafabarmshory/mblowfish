# Using translate filter

Translate provides a filter component with which you are able to translate your translation IDs within the view layer, without letting any controller or service know of them. This means you can decouple the translate logic from any controller or service and make your view layer replaceable without touching business logic code.

## General usage

 We can update our example from Using $mbTranslate service just by transfering the controller logic to our view layer. Basically the translate filter works like this:

	<ANY>{{'TRANSLATION_ID' | translate}}</ANY>

So, to update our example, we remove the usage of $mbTranslate service within our controller and add the logic to our view layer by using translate filter, just like this:

	<h1>{{'HEADLINE' | translate}}</h1>
	<p>{{'PARAGRAPH' | translate}}</p>

