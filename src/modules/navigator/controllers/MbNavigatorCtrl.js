/**
@ngdoc Controllers
@name MbNavigatorCtrl
@description # AccountCtrl Controller of the mblowfish

@ngInject
 */
export default function($scope, $mbView, $mbSecurity) {
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

	$scope.groups = groups;
	
	this.isItemVisible = function (item){
		return $mbSecurity.evaluate(item.access, $scope);	
	}
}