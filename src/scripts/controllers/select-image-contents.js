///* 
// * The MIT License (MIT)
// * 
// * Copyright (c) 2016 weburger
// * 
// * Permission is hereby granted, free of charge, to any person obtaining a copy
// * of this software and associated documentation files (the "Software"), to deal
// * in the Software without restriction, including without limitation the rights
// * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// * copies of the Software, and to permit persons to whom the Software is
// * furnished to do so, subject to the following conditions:
// * 
// * The above copyright notice and this permission notice shall be included in all
// * copies or substantial portions of the Software.
// * 
// * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// * SOFTWARE.
// */
//'use strict';
//angular.module('am-wb-seen-core')
///*
// * 
// */
//.controller('AmWbSeenSelectImageContentsCtrl', function($scope, $cms, QueryParameter) {
//
//    var paginatorParameter = new QueryParameter();
//    paginatorParameter.setOrder('id', 'd');
//    paginatorParameter.setFilter('media_type', 'image');
//    var requests = null;
//
//    /**
//     * جستجوی درخواست‌ها
//     * 
//     * @param paginatorParameter
//     * @returns
//     */
//    function find(query) {
//        paginatorParameter.setQuery(query);
//        paginatorParameter.setPage(0);
//        reload();
//    }
//
//    /**
//     * لود کردن داده‌های صفحه بعد
//     * 
//     * @returns
//     */
//    function nextPage() {
//        if ($scope.loadingContents) {
//            return $scope.loadingContents;
//        }
//        if (requests) {
//            if (!requests.hasMore()) {
//                return false;
//            }
//            paginatorParameter.setPage(requests.next());
//        }
//        // start state (device list)
//        $scope.loadingContents = $cms.getContents(paginatorParameter)//
//        .then(function(items) {
//            requests = items;
//            $scope.items = $scope.items.concat(requests.items);
//        })//
//        .finally(function(){
//            $scope.loadingContents = false;
//        });
//    }
//
//
//    /**
//     * تمام حالت‌های کنترل ررا بدوباره مقدار دهی می‌کند.
//     * 
//     * @returns
//     */
//    function reload(){
//        requests = null;
//        $scope.items = [];
//        nextPage();
//    }
//
//
//    $scope.items = [];
//    $scope.reload = reload;
//    $scope.search = find;
//    $scope.nextPage = nextPage;
//
//    $scope.setValue = function(value){
//        $scope.value = value;
//        $scope.$parent.setValue(value);
//    };
//
//    $scope.select = function(item, index) {
//        $scope.setValue('/api/v2/cms/contents/'+item.id+'/content');
//        $scope._selectedIndex = index;
//    };
//
//    $scope.isSelected = function(index){
//        return $scope._selectedIndex === index;
//    };
//
//
//    // Pagination toolbar
//    $scope.paginatorParameter = paginatorParameter;
//    $scope.reload = reload;
//    $scope.sortKeys= [
//        'id', 
//        'name',
//        'description'
//        ];
//    $scope.moreActions=[{
//        title: 'Module/List view',
//        icon: 'view_list',
//        pin: true,
//        action: function(){
//            $scope.listViewMode = !$scope.listViewMode;
//            if($scope.listViewMode){
//                this.icon = 'view_list';
//            } else {
//                this.icon = 'view_module';
//            }
//        }
//    }];
//});