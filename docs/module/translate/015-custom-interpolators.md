# Custom Interpolators

If you're smart enough to implement a smaller MessageFormat library, or if you just need another type of interpolation, you can simply build your own interpolation service and plug it into angular-translate. All you have to do is to follow a specific interface angular-translate expects from an interpolation service. Let's see how things work!

Building a custom interpolation service
When building a custom interpolation service, things should be pretty familiar if you've read Custom Storages and Custom Loaders. You start with building a factory that returns an object that implements a certain interface. The following methods have to be provided by a custom interpolation service:

setLocale(langKey) - sets the currently used language
getInterpolationIdentifier() - returns an identifier for interpolation
interpolate(string, interpolateParams, context, sanitizeStrategy, translationId) - interpolates strings against interpolate params
Let's see how it looks like when implementing a custom interpolation service. First, we implement the interface:

app.factory('customInterpolation', function () {
 
  return {
 
    setLocale: function (locale) {
 
    },
 
    getInterpolationIdentifier: function () {
 
    },
 
    interpolate: function (string, interpolateParams, context, sanitizeStrategy, translationId) {
 
    }
  };
});
Okay, this is the basic structure of an interpolation service. Now let's add some logic, so angular-translate can make use of it once our custom interpolation service comes in:

app.factory('customInterpolation', function ($interpolate, $translateSanitization) {
 
  var $locale;
 
  return {
 
    setLocale: function (locale) {
      $locale = locale;
    },
 
    getInterpolationIdentifier: function () {
      return 'custom';
    },
 
    interpolate: function (string, interpolateParams, context, sanitizeStrategy, translationId) {
      string = $translateSanitization.sanitize(string, 'text', sanitizeStrategy);
      if (interpolateParams) {
        interpolateParams = $translateSanitization.sanitize(interpolateParams, 'params', sanitizeStrategy);
      }
      return $locale + '_' + $interpolate(string)(interpolateParams) + '_' + $locale;
    }
  };
});
Alright. So what did we do here. setLocale() simply store the value of the current used language. getInterpolationIdentifier() returns a string custom. So what is it actually for? Remember how to temporarily override the interpolation type? Exactly. This is the identifier that is mapped to your service, so angular-translate knows which interpolation services to use, when you explicitly override interpolation service at runtime. interpolate() simply uses Angular's $interpolate service. In addition it prepends and appends the current locale to the given string.

It is important to remember about proper sanitazion before calling Angular's $interpolate function. For this purpose you can use $translateSanitization service, which utilizes the current sanitation strategy, that is set with $translateProvider.useSanitizeValueStrategy() function during config.

Using your custom interpolation service
Just like there's a method for Storages (useStorage()) and Loaders (useLoader()), there's also a method for custom interpolations. $translateProvider.useInterpolation() is your friend when it comes to integrate your custom interpolation service into your app.

$translateProvider.useInterpolation('customInterpolation');
You app now uses your custom interpolation as default. However, as you've learned in previous chapters, you can add your custom interpolation as optional interpolation, not to loose Angular's cool features:

$translateProvider.addInterpolation('customInterpolation');
Here' what it looks like: