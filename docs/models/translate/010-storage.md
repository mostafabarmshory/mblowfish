Storages
We learned much about angular-translate in the last chapters. We know how we can dynamize our translations. We also learned how to add more than one language. But there's still a thing which feels kinda silly when opening our web app. Everytime we launch our app, we have to click that 'German' button again and again and again (of course only if you are a German user - I am!).

So the problem is that our app just can't remember which language you've chosen the last time you opened it. This chapter shows you how to teach your app to remember the language users choose.

Let your app remember the language
To let your app remember the language users choose, angular-translate comes with a support for Storages. What ever storage you use, angular-translate will save a language key with a specific identifier in it, so it can ask for it next time the user launches the app.

angular-translate has built-in support for two storages. localStorage and cookieStorage. Whereas localStorage falls back to cookieStorage if it isn't supported by the browser the user currently uses. To use one of those storages, you have to install the corresponding extension package.

Also remember to include angular-cookies.min.js file in your HTML and to add 'ngCookies' as dependency.

var module = angular.module('AppService', ['pascalprecht.translate','ngCookies']);
Using cookieStorage
If you want to use the cookieStorage to store the language over cross http requests, simply install the cookie storage extension via bower:

$ bower install angular-translate-storage-cookie
After that make sure you've embeded it in your HTML document. Once it's embeded you can use $translateProvider method useCookieStorage() and angular-translate takes care of the rest.

$translateProvider.useCookieStorage();
Is that easy? angular-translate will now store the initial language key in that storage and will update it accordingly once a user switches the language.

Using localStorage
In case you don't want to use cookieStorage for several reasons, you can use localStorage to make the same possible. The flow is basically the same. You install the corresponding extension package and tell $translateProvider to use the localStorage via useLocalStorage(). And again, angular-translate takes care of the rest.

Keep in mind that localStorage will fallback to cookieStorage if the browser doesn't support localStorage. Therefore you have to provide the cookieStorage extension as well.

You can install the extension package like this:

$ bower install angular-translate-storage-local
Now, inform $translateProvider that you want to use it:

$translateProvider.useLocalStorage();
That's all. Your app now uses a localStorage to remember the user's language. Let's update our app to use localStorage as well!

