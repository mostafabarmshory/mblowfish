# Using $mbTranslate service

Translate provides several ways to translate the contents of your app. One way is to use the provided $mbTranslate service directly. You actually wouldn't use this approach, because you don't want to bind your apps controllers and services too hard to your translated content. However it turned out that there are indeed cases where you need to translate contents with $mbTranslate service.

Just imagine the case, where you want to translate the content of your HTML documents <title> tag. The <title> will never ever be inside of your application, which means it is always outside of an Angular world. So, to achieve this, you actually have to manipulate your apps title once your app is running through controller or service logic.

## General usage

This is where $mbTranslate service comes in. Using $mbTranslate service is very easy. First of all, you have to inject it per dependency injection (like every service you want to use within your Angular code). Let's say we want to extend the app we started building in Getting Started.

Our code would look something like this:

	mblowfish.view({
		controller: function ($mbTranslate) {
			// TODO
		}
	});

Now to translate your contents with $mbTranslate service, all you have to do is to pass a translation ID which was registered with $mbTranslateProvider before. Since it could be that there's some asynchronous loading going on (we'll get into this later), $mbTranslate service behaves asynchronously too and returns a promise, that either gets resolved with the translation of the given translation ID, or rejected with the translation ID as the error info. So the basic usage of $mbTranslate service on a controller (or service) level, would look like this:

	mblowfish.view('/view/url', {
		controller: function ($view, $mbTranslate) {
			$mbTranslate('HEADLINE').then(function (headline) {
				$view.setTitle(headline);
			}, function (translationId) {
				$view.setTitle(translationId);
			});
	}]);


Note: Namespaced translations are accessed as JSON properties.

That's all. Now when you think about translating the contents of a <title> you can do so within your controller.

## Multiple translation IDs

The translation service is also aware of requesting multiple translation at once.

	app.controller('Ctrl', function ($scope, $mbTranslate) {
	  $mbTranslate(['HEADLINE', 'PARAGRAPH', 'NAMESPACE.PARAGRAPH'])
	  .then(function (translations) {
	    $scope.headline = translations.HEADLINE;
	    $scope.paragraph = translations.PARAGRAPH;
	    $scope.namespaced_paragraph = translations['NAMESPACE.PARAGRAPH'];
	  }, function (translationIds) {
	    $scope.headline = translationIds.headline;
	    $scope.paragraph = translationIds.paragraph;
	    $scope.namespaced_paragraph = translationIds.namespaced_paragraph;
	  });
	});

However, the service will always return a Promise containing translations -- regardless whether a translation (or even all of them) has failed. When requesting multiple translations in one request, it is up to you to deal with the result.

## The non-asynchronous way without promises

Ideally the service should always be used with $mbTranslate(…) which returns a promise. This variant should be preferred always as possible, because the specific code mostly cannot be sure that no loader will intercept the request, no additional waits have to be awared of, and so on.

However, sometimes a instant and synchronous response is required. Best example is the filter: The filter in AngularJS is a pure function only and have to return with the result. No promise, no callback or something else in the future. Because of that, there exists a synchronous variant calling $mbTranslate.instant(…). It has a similiar request interface, but will return always the result directly without wrapped into a promise.

But that also means that $mbTranslate.instant() comes with some disadvantages compared with $mbTranslate:

- no error/missing information: Because the result is only a string, there is no difference between "found" and "not found".
- no await, non deterministic: Because the result is instant, there is no guarantee the result is correct. Maybe the loader is still loading or processing the translations. The asynchronous $mbTranslate() would wait instead.


## Things to keep in mind

Please keep in mind that the usage of the $mbTranslate service doesn't provide a two-way data binding default! $mbTranslate service works asynchronously, which means it returns the translation for the given translation id, as soon as it could determine it. If it doesn't exist the promise will fail with the translation id.

However, this doesn't mean that it knows when a languages has been changed. And because of that, translations translated through a directive $mbTranslate call, don't get updated when changing the language at runtime.

You can fix that by simply wrapping your $mbTranslate call into a $mbTranslateChangeSuccess callback on $rootScope, which gets fired every time a translation change was successful. Once it's changed, you can simply re-execute the code, that gives you your needed translations.

Here's how it could look like:

	mblowfish.controller(function ($scope, $mbTranslate, $rootScope) {
	  $rootScope.$on('$mbTranslateChangeSuccess', function () {
	    $mbTranslate('HEADLINE').then(function (translation) {
	      $scope.headline = translation;
	    }, function (translationId) {
	      $scope.headline = translationId;
	    });
	  });
	});

Why on $rootScope instead of just $scope you wonder? angular-translate only $emit's on $rootScope level because of performance reasons. See this StackOverflow post for more info.
