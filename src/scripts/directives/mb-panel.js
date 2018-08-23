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
  'use strict';

  angular.module('mblowfish-core')

          /**
           * @ngdoc Directives
           * @name mb-panel
           * @restrict E
           * @scope true
           * @description A dynamic panel with toolbar and sidenav
           * 
           * Applications needs an area to show modules, navigator, message and the
           * other visual parts of the system. This is a general application panel
           * which must be placed to the index.html directly.
           * 
           * @usage To load the application add this directive to the index.html.
           *        All internal elements will be removed after the module loaded.
           *        <hljs lang="html"> <body> <amd-panel> <div
           *        class="amd-preloader"> Loading.... </div> </amd-panel> ....
           *        </body> </hljs>
           * 
           */
          .directive('mbPanel', function ($route, $rootScope, $actions,
                  $injector) {
              /*
               * evaluate protect function
               */
              function canAccess(route) {
                  if (!route.protect) {
                      return true;
                  }
                  if (angular.isFunction(route.protect)) {
                      return !$injector.invoke(route.protect, route);
                  }
                  return route.protect;
              }

              function postLink($scope, $element, $attr) {
                  // State machin to controlle the view
                  var stateMachine = new machina.Fsm({
                      /* 
                       * the initialize method is called right after the FSM
                       * instance is constructed, giving you a place for any
                       * setup behavior, etc. It receives the same
                       * arguments (options) as the constructor function.
                       */
                      initialize: function (options) {
                          // your setup code goes here...
                          $scope.status = this.initialState;
                      },
                      namespace: 'mb-panel-controller',
                      initialState: 'loading',
                      states: {
                          ready: {
                              routeChange: function (route) {
                                  if (route.protect && !canAccess(route)) {
                                      this.transition('accessDenied');
                                      return;
                                  }
                              },
                              appStateChange: function (state) {
                                  // return if state is ready
                                  if (state.startsWith('ready')) {
                                      return;
                                  } else {
                                      this.transition('loading');
                                  }
                              },
                              userStateChange: function (userIsAnonymous) {
                                  if (this.getRoute().protect && userIsAnonymous) {//user is anonymous
                                      this.transition('login');
                                  } else {
                                      this.transition('readyAnonymous');
                                  }
                              }
                          },
                          accessDenied: {
                              routeChange: function (route) {
                                  if (!route.protect || canAccess(route)) {
                                      this.transition('ready');
                                  }
                              },
                              appStateChange: function (state) {
                                  // return if state is ready
                                  if (state.startsWith('ready')) {
                                      return;
                                  } else {
                                      this.transition('loading');
                                  }
                              },
                              userStateChange: function (userIsAnonymous) {
                                  if (userIsAnonymous) {//user is anonymous
                                      this.transition('login');
                                  }
                              }
                          },
                          readyAnonymous: {
                              routeChange: function (route) {
                                  // TODO: maso, change to login page
                                  if (route.protect) {
                                      this.transition('login');
                                  }
                              },
                              appStateChange: function (state) {
                                  // return if state is ready
                                  if (state.startsWith('ready')) {
                                      return;
                                  } else {
                                      this.transition('loading');
                                  }
                              },
                              userStateChange: function () {//user is not anonymous
                                  this.transition('ready');
                              }
                          },
                          loading: {
                              // routeChange: function(route){},
                              appStateChange: function (state) {
                                  if (state.startsWith('ready')) {
                                      var route = this.getRoute();
                                      if ($rootScope.app.user.anonymous) {
                                          if (route.protect) {
                                              this.transition('login');
                                          } else {
                                              this.transition('readyAnonymous');
                                          }
                                      } else {
                                          if (!route.protect || canAccess(route)) {
                                              this.transition('ready');
                                          } else {
                                              this.transition('accessDenied');
                                          }
                                      }
                                  }
                              }
                          },
                          login: {
                              routeChange: function (route) {
                                  if (!route.protect) {
                                      this.transition('readyAnonymous');
                                  }
                              },
                              appStateChange: function (state) {
                                  // return if state is ready
                                  if (state.startsWith('ready')) {
                                      return;
                                  } else {
                                      this.transition('loading');
                                  }
                              },
                              userStateChange: function () {//user is not anonymous
                                  var route = this.getRoute();
                                  if (!canAccess(route)) {
                                      this.transition('accessDenied');
                                  } else {
                                      this.transition('ready');
                                  }
                              }
                          }
                      },
                      /*
                       * Handle route change event
                       */
                      routeChange: function (route) {
                          this.currentRoute = route;
                          if (!route) {
                              return;
                          }
                          this.handle("routeChange", route);
                      },
                      /*
                       * Handle application state change
                       */
                      appStateChange: function (state) {
                          this.handle("appStateChange", state);
                      },
                      /*
                       * Handle user state change
                       */
                      userStateChange: function (userIsAnonymous) {
                          this.userState = userIsAnonymous;
                          this.handle("userStateChange", userIsAnonymous);
                      },

                      /*
                       * Get current route
                       */
                      getRoute: function () {
                          return this.currentRoute
                                  || $route.current;
                      },

                      /*
                       * Get current status
                       */
                      getState: function () {
                          return this.appState
                                  || $rootScope.app.state.status;
                      }
                  });

                  // I'd like to know when the transition event occurs
                  stateMachine.on("transition", function () {
                      if (stateMachine.state.startsWith('ready')) {
                          $scope.status = 'ready';
                          return;
                      }
                      $scope.status = stateMachine.state;
                  });

                  $scope.$watch(function () {
                      return $route.current;
                  }, function (route) {
                      $actions.group('navigationPathMenu').clear();
                      if (route) {
                          stateMachine.routeChange(route.$$route);
                          // Run state integeration
                          if (route.$$route && angular.isFunction(route.$$route.integerate)) {
                              var value = $injector.invoke(route.$$route.integerate, route.$$route);
                          }
                      } else {
                          stateMachine.routeChange(route);
                      }
                  });

                  $rootScope.$watch('app.state.status', function (appState) {
                      stateMachine.appStateChange(appState);
                  });

                  $scope.$watch('app.user.anonymous', function (val) {
                      stateMachine.userStateChange(val);
                  });

              }

              return {
                  restrict: 'E',
                  replace: true,
                  templateUrl: 'views/directives/mb-panel.html',
                  link: postLink
              };
          });