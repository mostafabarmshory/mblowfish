# Error Handling

Sometimes you have a complex app, where you don't really know how many translations you have. You're not sure if there's a missing translation for a specific translation ID either. This is where missing translation handlers come in.

Using log handler extension for missing translations
There is an extension for angular-translate which logs warnings into the console if you try to translate a translation ID which doesn't exist. Like all extensions, you can install it via Bower like this:

$ bower install angular-translate-handler-log
To use this handler, all you have to do is to call useMissingTranslationHandlerLog() on $translateProvider. angular-translate does the rest for you.

$translateProvider.useMissingTranslationHandlerLog();