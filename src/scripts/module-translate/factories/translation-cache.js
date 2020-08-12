
/**
@ngdoc object
@name pascalprecht.translate.$translationCache
@requires $cacheFactory

@description
The first time a translation table is used, it is loaded in the translation cache for quick retrieval. You
can load translation tables directly into the cache by consuming the
`$translationCache` service directly.

@return {object} $cacheFactory object.
 */
mblowfish.factory('$translationCache', function($cacheFactory) {
	return $cacheFactory('translations');
});
