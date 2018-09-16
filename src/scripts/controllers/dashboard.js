'use strict';

angular.module('mblowfish-core')

/**
 * @ngdoc Controllers
 * @name AmdDashboardCtrl
 * @description Dashboard
 * 
 */
.controller('AmdDashboardCtrl', function($scope, $navigator, $app) {
    function toogleEditable(){
        $scope.editable = !$scope.editable;
    }

    $navigator.scopePath($scope)//
    .add({
        title: 'Dashboard',
        link: 'dashboard'
    });

    $app.scopeMenu($scope) //
    .add({ // edit menu
        priority : 15,
        icon : 'edit',
        label : 'Edit content',
        tooltip : 'Toggle edit mode of the current contetn',
        visible : function(){
            return $scope.app.user.owner;
        },
        action : toogleEditable
    });//

});
