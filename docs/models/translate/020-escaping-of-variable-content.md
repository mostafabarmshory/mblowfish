Escaping of variable content
Speaking of regular output, AngularJS ensures the output will be escaped correctly. However, when using angular-translate and variable content, the result will not be escaped correctly. This means your app is vulnerable for serious attacks (see: OWASP).

General use
The method useSanitizeValueStrategy(strategy) defines which strategy for escaping will be used; this is global.

At the moment, following strategies are built-in:

sanitize: sanitizes HTML in the translation text using $sanitize
escape: escapes HTML in the translation
sanitizeParameters: sanitizes HTML in the values of the interpolation parameters using $sanitize
escapeParameters: escapes HTML in the values of the interpolation parameters
sce: wraps HTML in $sce.trustAsHtml(value)
sceParameters: wraps HTML in the values of the interpolation parameters in $sce.trustAsHtml(value)
Currently there is an issue with the sanitize mode, it will double encode UTF-8 characters or special characters. Recommendation: use the 'escape' strategy, until this is resolved.

Additionally, there are this defaults only valid for version 2:

null: nothing, unsecure default (will be removed in 3.0)
escaped: alias for 'escapeParameters' for backwards compatibility (since 2.7.0, will be removed in 3.0)
We enforce being completely backwards compatible, which means the escaping is disabled by default.

$translateProvider.useSanitizeValueStrategy(null);
However, we will enable the more secure variant sanitize in the future by default.

$translateProvider.useSanitizeValueStrategy('sanitize');
We strongly recommend a secure strategy. Therefore a warning will be displayed as long as no strategy has been chosen explicitly.