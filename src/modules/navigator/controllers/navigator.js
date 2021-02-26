export default function($scope, $mbView) {
	var groups = {
		'others': {
			title: 'Others',
			items: {}
		}
	};

	var items = $mbView.getViews();
	_.forEach(items, function(item, url) {
		var itmeGroups = item.groups || ['others'];
		_.forEach(itmeGroups, function(groupId) {
			if (_.isUndefined(groups[groupId])) {
				groups[groupId] = {
					title: groupId,
					items: {}
				};
			}
			groups[groupId].items[url] = item;
		});
	});

	$scope.groups = groups
}