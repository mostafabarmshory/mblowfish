import './mbButton.css';

/**
 * @ngdoc directive
 * @name mbButton
 * @module material.components.button
 *
 * @restrict E
 *
 * @description
 * `<mb-button>` is a button directive with optional ink ripples (default enabled).
 *
 * If you supply a `href` or `ng-href` attribute, it will become an `<a>` element. Otherwise, it
 * will become a `<button>` element. As per the
 * [Material Design specifications](https://material.google.com/style/color.html#color-color-palette)
 * the FAB button background is filled with the accent color [by default]. The primary color palette
 * may be used with the `md-primary` class.
 *
 * Developers can also change the color palette of the button, by using the following classes
 * - `md-primary`
 * - `md-accent`
 * - `md-warn`
 *
 * See for example
 *
 * <hljs lang="html">
 *   <mb-button class="md-primary">Primary Button</mb-button>
 * </hljs>
 *
 * Button can be also raised, which means that they will use the current color palette to fill the button.
 *
 * <hljs lang="html">
 *   <mb-button class="md-accent md-raised">Raised and Accent Button</mb-button>
 * </hljs>
 *
 * It is also possible to disable the focus effect on the button, by using the following markup.
 *
 * <hljs lang="html">
 *   <mb-button class="md-no-focus">No Focus Style</mb-button>
 * </hljs>
 *
 * @param {string=} aria-label Adds alternative text to button for accessibility, useful for icon buttons.
 * If no default text is found, a warning will be logged.
 * @param {boolean=} md-no-ink If present, disable ink ripple effects.
 * @param {string=} md-ripple-size Overrides the default ripple size logic. Options: `full`, `partial`, `auto`.
 * @param {expression=} ng-disabled Disable the button when the expression is truthy.
 * @param {expression=} ng-blur Expression evaluated when focus is removed from the button.
 *
 * @usage
 *
 * Regular buttons:
 *
 * <hljs lang="html">
 *  <mb-button> Flat Button </mb-button>
 *  <mb-button href="http://google.com"> Flat link </mb-button>
 *  <mb-button class="md-raised"> Raised Button </mb-button>
 *  <mb-button ng-disabled="true"> Disabled Button </mb-button>
 *  <mb-button>
 *    <mb-icon mb-svg-src="your/icon.svg"></mb-icon>
 *    Register Now
 *  </mb-button>
 * </hljs>
 *
 * FAB buttons:
 *
 * <hljs lang="html">
 *  <mb-button class="md-fab" aria-label="FAB">
 *    <mb-icon mb-svg-src="your/icon.svg"></mb-icon>
 *  </mb-button>
 *  <!-- mini-FAB -->
 *  <mb-button class="md-fab md-mini" aria-label="Mini FAB">
 *    <mb-icon mb-svg-src="your/icon.svg"></mb-icon>
 *  </mb-button>
 *  <!-- Button with SVG Icon -->
 *  <mb-button class="mb-icon-button" aria-label="Custom Icon Button">
 *    <mb-icon mb-svg-icon="path/to/your.svg"></mb-icon>
 *  </mb-button>
 * </hljs>

@ngInject
 */
export default  function($mdButtonInkRipple, $mdTheming, $mdAria, $mdInteraction) {

	return {
		restrict: 'EA',
		replace: true,
		transclude: true,
		template: getTemplate,
		link: postLink
	};

	function isAnchor(attr) {
		return angular.isDefined(attr.href) || angular.isDefined(attr.ngHref) || angular.isDefined(attr.ngLink) || angular.isDefined(attr.uiSref);
	}

	function getTemplate(element, attr) {
		if (isAnchor(attr)) {
			return '<a class="mb-button" ng-transclude></a>';
		} else {
			// If buttons don't have type="button", they will submit forms automatically.
			var btnType = (typeof attr.type === 'undefined') ? 'button' : attr.type;
			return '<button class="mb-button" type="' + btnType + '" ng-transclude></button>';
		}
	}

	function postLink(scope, element, attr) {
		$mdTheming(element);
		$mdButtonInkRipple.attach(scope, element);

		// Use async expect to support possible bindings in the button label
		$mdAria.expectWithoutText(element, 'aria-label');

		// For anchor elements, we have to set tabindex manually when the element is disabled.
		// We don't do this for md-nav-bar anchors as the component manages its own tabindex values.
		if (isAnchor(attr) && angular.isDefined(attr.ngDisabled) &&
			!element.hasClass('_md-nav-button')) {
			scope.$watch(attr.ngDisabled, function(isDisabled) {
				element.attr('tabindex', isDisabled ? -1 : 0);
			});
		}

		// disabling click event when disabled is true
		element.on('click', function(e) {
			if (attr.disabled === true) {
				e.preventDefault();
				e.stopImmediatePropagation();
			}
		});

		if (!element.hasClass('md-no-focus')) {

			element.on('focus', function() {

				// Only show the focus effect when being focused through keyboard interaction or programmatically
				if (!$mdInteraction.isUserInvoked() || $mdInteraction.getLastInteractionType() === 'keyboard') {
					element.addClass('md-focused');
				}

			});

			element.on('blur', function() {
				element.removeClass('md-focused');
			});
		}

	}

}


/**
 * @private
 * @restrict E
 *
 * @description
 * `a` is an anchor directive used to inherit theme colors for md-primary, md-accent, etc.
 *
 * @usage
 *
 * <hljs lang="html">
 *  <md-content md-theme="myTheme">
 *    <a href="#chapter1" class="mb-accent"></a>
 *  </md-content>
 * </hljs>


TODO: maso, 2020: active when angular material is remvoed
mblowfish.directive('a', function($mdTheming) {
	return {
		restrict: 'E',
		link: function postLink(scope, element) {
			// Make sure to inherit theme so stand-alone anchors
			// support theme colors for md-primary, md-accent, etc.
			$mdTheming(element);
		}
	};
});

 */


