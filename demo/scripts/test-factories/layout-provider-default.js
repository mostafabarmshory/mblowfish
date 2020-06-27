
mblowfish.factory('DemoLayoutProviderDefault', function(MbLayoutProvider) {

	DemoLayoutProviderDefault = function() {
		MbLayoutProvider.apply(this, arguments);
	}
	DemoLayoutProviderDefault.prototype = Object.create(MbLayoutProvider.prototype);

	DemoLayoutProviderDefault.prototype.list = function() {
		return ['default'];
	};
	DemoLayoutProviderDefault.prototype.has = function(name) {
		return name === 'default';
	};
	DemoLayoutProviderDefault.prototype.get = function(name) {
		if (!this.has(name)) {
			return;
		}
		return {
			settings: {
				hasHeaders: true,
				constrainDragToContainer: true,
				reorderEnabled: true,
				selectionEnabled: true,
				popoutWholeStack: false,
				blockedPopoutsThrowError: true,
				closePopoutsOnUnload: true,
				showPopoutIcon: false,
				showMaximiseIcon: true,
				showCloseIcon: true
			},
			dimensions: {
				borderWidth: 5,
				minItemHeight: 16,
				minItemWidth: 50,
				headerHeight: 20,
				dragProxyWidth: 300,
				dragProxyHeight: 200
			},
			content: [{
				id: 'main',
				type: 'row',
				isClosable: false,
				componentState: {},
				content: [{
					id: 'configs',
					type: 'stack',
					isClosable: false,
					width: 25,
					content: [{
						id: 'demo-pages',
						type: 'component',
						componentName: 'component',
						componentState: {
							url: '/demo',
							isView: true,
						}
					}]
				}, {
					type: 'column',
					isClosable: false,
					content: [{
						id: 'editors',
						type: 'stack',
						title: 'Editors',
						isClosable: false,
						componentState: {}
					}, {
						id: 'logs',
						type: 'stack',
						isClosable: false,
						height: 30,
					}]
				}]
			}]
		};
	};


	return DemoLayoutProviderDefault;
});