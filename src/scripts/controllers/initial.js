// //TODO: should be moved to mblowfish-core

// /*
//  * Copyright (c) 2015-2025 Phoinex Scholars Co. http://dpq.co.ir
//  * 
//  * Permission is hereby granted, free of charge, to any person obtaining a copy
//  * of this software and associated documentation files (the 'Software'), to deal
//  * in the Software without restriction, including without limitation the rights
//  * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
//  * copies of the Software, and to permit persons to whom the Software is
//  * furnished to do so, subject to the following conditions:
//  * 
//  * The above copyright notice and this permission notice shall be included in all
//  * copies or substantial portions of the Software.
//  * 
//  * THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
//  * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
//  * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
//  * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
//  * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
//  * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
//  * SOFTWARE.
//  */

// angular.module('mblowfish-core')

// /**
//  * @ngdoc Controllers
//  * @name MbInitialCtrl
//  * @description Initializes the application
//  * 
//  * Manages and initializes the application.
//  * 
//  * This controller is used first time when the application is run.
//  * 
//  * The controller puts list of configuration pages in `settings` and current
//  * setting in `currentSetting`.
//  * 
//  * Settings is ordered list and the index of the item is unique.
//  * 
//  * Here is list of all data managed with controller
//  * 
//  * <ul>
//  * <li>steps: list of all settings</li>
//  * <li>currentStep: object (with id) points to the current setting page</li>
//  * </ul>
//  * 
//  * NOTE: the controller works with an stepper and $mdStepper (id:
//  * setting-stepper)
//  */
// .controller('MbInitialCtrl', function($scope, $rootScope, $preferences, $mdStepper, $window, $wbUtil, $routeParams) {

//     /*
//      * ID of the stepper
//      */
//     var _stepper_id = 'setting-stepper';

//     /**
//      * Loads settings with the index
//      * 
//      * @memberof MbInitialCtrl
//      * @param {integer}
//      *            index of the setting
//      */
//     function goToStep(index){
//         $mdStepper(_stepper_id)//
//         .goto(index);
//     }

//     /**
//      * Loads the next setting page
//      * 
//      * @memberof MbInitialCtrl
//      */
//     function nextStep(){
//         $mdStepper(_stepper_id)//
//         .next();
//     }

//     /**
//      * Loads the previous setting page
//      * 
//      * @memberof MbInitialCtrl
//      */
//     function prevStep(){			
//         $mdStepper(_stepper_id)//
//         .back();
//     }

//     /*
//      * Set application is initialized
//      */
//     function _setInitialized(/*flag*/){
//         $rootScope.app.config.is_initialized = true;
//     }

//     /*
//      * Checks if it is initialized
//      * 
//      * NOTE: maso, 2018: check runs/initial.js for changes
//      */
//     function _isInitialized(){
//         return !$routeParams.force && $rootScope.app.config.is_initialized;
//     }

//     /*
//      * Go to the main page
//      */
//     function _redirectToMain(){
//         $window.location =  $window.location.href.replace(/initialization$/mg, '');
//     }

//     /*
//      * Loads internal pages and settings
//      */
//     function _initialization(){
//         // Configure language page. It will be added as first page of setting
//         // stepper
//         var langPage = {
//                 id: 'initial-language',
//                 title: 'Language',
//                 templateUrl : 'views/preferences/mb-language.html',
//                 controller : 'MbLanguageCtrl',
//                 description: 'Select default language of web application.',
//                 icon: 'language',
//                 priority: 'first',
//                 required: true
//         };
//         // Configure welcome page. It will be added as one of the first pages of
//         // setting stepper
//         var inlineTemplate = '<wb-group ng-model=\'model\' flex style=\'overflow: auto;\' layout-fill></wb-group>';
//         var welcomePage = {
//                 id: 'welcome',
//                 title: 'Welcome',
//                 template : inlineTemplate,
//                 /*
//                  * @ngInject
//                  */
//                 controller : function($scope, $http, $translate) {
//                     // TODO: hadi: Use $language to get current Language
//                     $http.get('resources/welcome/'+$translate.use()+'.json')//
//                     .then(function(res){
//                         //TODO: Maso, 2018: $wbUtil must delete in next version. Here it comes for compatibility to previous versions.
//                         //$scope.model = $wbUtil.clean(res.data || {});
//                         $scope.model = $wbUtil.clean(res.data) || {};
//                     });
//                 },
//                 description: 'Welcome. Please login to continue.',
//                 icon: 'accessibility',
//                 priority: 'first',
//                 required: true
//         };
//         var congratulatePage = {
//                 id: 'congratulate',
//                 title: ':)',
//                 description: 'Congratulation. Your site is ready.',
//                 template : inlineTemplate,
//                 /*
//                  * @ngInject
//                  */
//                 controller : function($scope, $http, $translate) {
//                     // TODO: hadi: Use $language to get current Language
//                     $http.get('resources/congratulate/'+$translate.use()+'.json')//
//                     .then(function(res){
//                         //TODO: Maso, 2018: $wbUtil must delete in next version. Here it comes for compatibility to previous versions.
//                         $scope.model = $wbUtil.clean(res.data) || {};
//                     });
//                     _setInitialized(true);
//                 },
//                 icon: 'favorite',
//                 priority: 'last',
//                 required: true
//         };
//         $preferences.newPage(langPage);
//         $preferences.newPage(welcomePage);
//         $preferences.newPage(congratulatePage);
//         // Load settings
//         $preferences.pages()//
//         .then(function(settingItems) {
//             var steps = [];
//             settingItems.items.forEach(function(settingItem){
//                 if(settingItem.required){
//                     steps.push(settingItem);
//                 }
//             });
//             $scope.steps = steps;
//         });

//         // add watch on setting stepper current step.
//         $scope.$watch(function(){
//             var current = $mdStepper(_stepper_id);
//             if(current){
//                 return current.currentStep;
//             }
//             return -1;
//         }, function(index){
//             if(index >= 0 && $scope.steps && $scope.steps.length){
//                 $scope.currentStep = $scope.steps[index];
//             }
//         });
//     }

//     /*
//      * Watch application state
//      */
//     var removeApplicationStateWatch = $scope.$watch('__app.state', function(status){
//         switch (status) {
//         case 'loading':
//         case 'fail':
//         case 'error':
//             // Wait it for ready
//             break;
//         case 'ready':
//             // remove watch
//             removeApplicationStateWatch();
//             if(_isInitialized()){
//                 _redirectToMain();
//             } else {
//                 _initialization();
//             }
//             break;
//         default:
//             break;
//         }
//     });
    


//     this.goToStep = goToStep;
//     this.nextStep = nextStep;
//     this.nextStep = nextStep;
//     this.prevStep = prevStep;
// });
