
export default function() {
	var
		provider,
		service,
		mbStorage,
		mbDispatcherUtil;

	function createLayout(layoutName, layoutData) {
		if (!_.isUndefined(mbStorage.mbLayouts[layoutName])) {
			return updateLayout(layoutName, layoutData);
		}
		mbStorage.mbLayouts[layoutName] = layoutData;
		mbDispatcherUtil.fireCreated(MB_LAYOUTS_LAYOUTS_SP, layoutData);
	}

	function updateLayout(layoutName, layoutData) {
		if (_.isUndefined(mbStorage.mbLayouts[layoutName])) {
			return createLayout(layoutName, layoutData);
		}
		mbStorage.mbLayouts[layoutName] = layoutData;
		mbDispatcherUtil.fireUpdated(MB_LAYOUTS_LAYOUTS_SP, layoutData);
	}

	function deleteLayout(layoutName) {
		var layoutData = mbStorage.mbLayouts[layoutName];
		delete mbStorage.mbLayouts[layoutName];
		mbDispatcherUtil.fireDeleted(MB_LAYOUTS_LAYOUTS_SP, layoutData);
	}

	function getLayout(layoutName) {
		return mbStorage.mbLayouts[layoutName];
	}

	function hasLayout(layoutName) {
		return !_.isUndefined(mbStorage.mbLayouts[layoutName]);
	}

	function getLayouts() {
		return Object.getOwnPropertyNames(mbStorage.mbLayouts);
	}



	service = {
		createLayout: createLayout,
		updateLayout: updateLayout,
		deleteLayout: deleteLayout,
		getLayout: getLayout,
		getLayouts: getLayouts,
		hasLayout: hasLayout,
	};
	provider = {
		$get: function($mbStorage, $mbDispatcherUtil) {
			'ngInject';
			mbStorage = $mbStorage;
			mbDispatcherUtil = $mbDispatcherUtil;

			// init
			if (_.isUndefined(mbStorage.mbLayouts)) {
				mbStorage.mbLayouts = {};
			}

			return service;
		}
	}
	return provider;
}

