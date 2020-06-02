/*
 * Copyright (c) 2015-2025 Phoinex Scholars Co. http://dpq.co.ir
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */
mblowfish.controller('SelectResourcesCtrl', function($scope, $resource) {

    this.selectResource = function(type){
        return $resource.get(type,{
            data: $scope.selectedFile,
            style:{
                title: 'Select type:'+type,
                description: 'Select a resource from the system',
                icon: 'file'
            }
        })//
        .then(function(item){
            $scope['selected'+type] = item;
        });
    };

    $scope.selectUserObject = function(){
        return $resource.get('account',{
            data: $scope.user,
            style:{
                title: 'Select account',
                description: 'Select a user',
                icon: 'account_circle'
            }
        })//
        .then(function(usr){
            $scope.user = usr;
        });
    };
    $scope.selectUserObjectList = function(){
        return $resource.get('accounts',{
            data: $scope.userList,
            style:{
                title: 'Select account list',
                description: 'Select one or more user',
                icon: 'account_circle'
            }
        })//
        .then(function(usrs){
            $scope.userList = usrs;
        });
    };




    $scope.selectGroups = function(){
        return $resource.get('groups',{
            data: $scope.groups,
            style:{
                title: 'Select group list',
                description: 'Select one or more group',
                icon: 'account_circle'
            }
        })//
        .then(function(groups){
            $scope.groups = groups;
        });
    };


    $scope.selectRoles = function(){
        return $resource.get('roles',{
            data: $scope.roles,
            style:{
                title: 'Select role list',
                description: 'Select one or more roles',
                icon: 'account_circle'
            }
        })//
        .then(function(roles){
            $scope.roles = roles;
        });
    };
    
    $scope.selectModules = function(){
    	return $resource.get('/app/modules',{
    		data: $scope.modules,
    		style:{
    			title: 'Select module list',
    			description: 'Select one or more module',
    			icon: 'package'
    		}
    	})//
    	.then(function(modules){
    		$scope.modules = modules;
    	});
    };
});
