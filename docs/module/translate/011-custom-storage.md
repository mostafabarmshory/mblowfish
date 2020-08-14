Custom Storages
If you've read Storages, you know how to use either cookiesStorage, or localStorage, to let your app remember the last chosen language over cross http requests. If neither localStorage nor cookieStorage fits your needs, you can simply build your own storage service and use that instead.

Building a custom storage service
If you want to use your own custom storage in your app, you have to build a service which has to implement some methods, so angular-translate can make use of them. The interface for a storage service is pretty straight forward. All you need is to provide a put() and a get() method on your custom storage service.

Let's say we want to use a custom storage service within our sample app. We can easily extend it with a new service. We just have to make sure that we return an object with a get() and a put() method. A custom service could look like this:

app.factory('customStorage', function () {
  return {
    put: function (name, value) {
      // store `value` under `name` somehow
    },
    get: function (name) {
      // request value of `name` somehow
    }
  };
});
Easy, right? As you can see, put() expects two arguments. A name and a value. So you work with simple key-value pairs. On the other side, get() just needs a name to request a value. Providing a custom storage as a separate service gives you high flexibility when it comes to using this service in a different place. In addition to that, testing this service is pretty easy, since it's isolated.

Using the custom storage service
Once you've build your custom storage service, you have to tell angular-translate to make use of it. $translateProvider methods useCookieStorage() and useLocalStorage() are actually shortcut methods. They both use a method useStorage() internally. You can also use this method to let angular-translate know of your custom storage service by simply doing:

$translateProvider.useStorage('customStorage');
angular-translate will use $injector to get an instance of the given factory name, which is in our case customStorage, and is then able to access its methods at runtime to save the last chosen language.