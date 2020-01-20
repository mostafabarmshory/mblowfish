


angular.module('mblowfish-core')
/**
 * @ngdoc service
 * @name $mdExpansionPanel
 * @module material.components.expansionPanels
 *
 * @description
 * Expand and collapse Expansion Panel using its `md-component-id`
 *
 * @example
 * $mdExpansionPanel('comonentId').then(function (instance) {
 *  instance.exapand();
 *  instance.collapse({animation: false});
 *  instance.remove({animation: false});
 *  instance.onRemove(function () {});
 * });
 */
.factory('$mdExpansionPanel', function ($mdComponentRegistry, $mdUtil, $log) {
	var errorMsg = 'ExpansionPanel "{0}" is not available! Did you use md-component-id="{0}"?';
	var service = {
			find: findInstance,
			waitFor: waitForInstance
	};

	return function (handle) {
		if (handle === undefined) { return service; }
		return findInstance(handle);
	};



	function findInstance(handle) {
		var instance = $mdComponentRegistry.get(handle);

		if (!instance) {
			// Report missing instance
			$log.error( $mdUtil.supplant(errorMsg, [handle || '']) );
			return undefined;
		}

		return instance;
	}

	function waitForInstance(handle) {
		return $mdComponentRegistry.when(handle).catch($log.error);
	}
});

