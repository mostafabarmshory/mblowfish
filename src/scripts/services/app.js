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
angular.module('mblowfish-core') //

/**
 * @ngdoc Services
 * @name $app
 * @description Application manager
 * 
 * $app manage the application life-cycle. It gets all required information from
 * server and store those in rootScope. So, in the scope of application everyone
 * who wants something about this type of information it should get them from
 * rootScope. Also, $app watch the rootScope and do all required tasks(such as
 * updating config into the server and etc.) automatically.
 * 
 * That way, the $app service is separated from directly responding to others.
 * Important: In this version, 'start', 'login' and 'logout' are exceptions and
 * could access directly from outside.
 * 
 * The pseudo-code of all works that the service performs is as follows:
 * 
 * <ol>
 * <li>Getting required information from the server and store in rootScope.</li>
 * <li>Watching the rootScope and do all required works. (such as updating
 * config into the server and etc.) automatically.</li>
 * <li>Managing an internally Finite State Machine(FSM) to control the state of
 * the app.</li>
 * <li>Performing login and logout.</li>
 * </ol> ## user
 * 
 * User information will be loaded on the start up and tracked during the
 * application life time. ## settings
 * 
 * Settings are stored in the local storage and each user can edit it directly. ##
 * Options
 * 
 * There is list of Key-Value stored in the sever and control the server
 * behaviors. In the. $app are called options. Options are read only and allow
 * clients to adapt to the server.
 * 
 * All options can access from view as:
 * 
 * <code><pre>
 * 	&lt;span&gt;{{app.options['captcha.engine']}}&lt;/span&gt;
 * </pre></code>
 * 
 * In the code:
 * 
 * <code><pre>
 * var a = $rootScope.app.options['captcha.engine'];
 * </pre></code> ## configurations
 * 
 * Configuration is stored on server an owners are allowed to update. Do not
 * store secure properties on configuration.
 * 
 * Configuration is a CMS file.
 * 
 * 
 * @property {object} app - Application repository.
 * @property {string} app.dir - Application direction which is updated
 *           automatically baed on configuaration and setting.
 * @property {object} app.setting - Application setting.
 * @property {object} app.config - Application setting.
 * @property {object} app.user - Current user information
 * @property {object} app.user.profile - The first profile of current user
 */
.service('$app', function ($rootScope, $usr, $q, $cms, $translate, $http,
        $httpParamSerializerJQLike, $mdDateLocale, $localStorage, QueryParameter, $tenant) {

    var apps = this;

    // Constants
    var APP_PREFIX = 'angular-material-blowfish-';
    var APP_CNF_MIMETYPE = 'application/amd-cnf';
    var USER_DETAIL_GRAPHQL = '{id, login, profiles{first_name, last_name, language, timezone}, roles{id, application, code_name}, groups{id, name, roles{id, application, code_name}}}';
    var OPTIONS_GRAPHQL = '{items{id, key,value}}';

    // the state machine
    var stateMachine;

    // states
    var APP_STATE_WAITING = 'waiting';
    var APP_STATE_LOADING = 'loading';

    // final states
    var APP_STATE_READY = 'ready';
    var APP_STATE_READY_NOT_CONFIGURED = 'ready_not_configured';
    var APP_STATE_OFFLINE = 'offline';
    var APP_STATE_FAIL = 'fail';

    var APP_EVENT_LOADED = 'loaded';
    var APP_EVENT_START = 'start';
    var APP_EVENT_NOT_FOUND = 'resource_not_found';
    var APP_EVENT_SERVER_ERROR = 'server_error';
    var APP_EVENT_NET_ERROR = 'network_error';


    var optionsQuery = new QueryParameter()//
    .put('graphql', OPTIONS_GRAPHQL);
    // All the things that are set up by $app service
    var app = {
            state: {
                // all states: waiting, loading, offline, app_not_configured,
                // ready, fail
                status: 'loading',
                stage: 'starting',
                message: null
            },
            logs: [],
            user: {
                current: {},
                profile : {},
                anonymous: true,
                administrator: false,
                owner: false,
                member: false,
                authorized: false
            },
            config: {},
            setting: {},
            options: {}
    };
    $rootScope.app = app;

    /*
     * متغیرهای مدیریت تنظیم‌ها
     * 
     * زمانی که عملی روی تنظیم‌ها در جریان است قفل فعال می‌شود تا از انجام
     * کارهای تکراری جلوگیری کنیم.
     * 
     * در صورتی که یک پردازش متغیری را تغییر دهد پرچم داده‌های کثیف فعال می‌شود
     * تا پردازشی که در حال ذخیره سازی است ذخیره کردن داده‌های جدید را هم انجام
     * دهد.
     */
    var appConfigLock = false;
    var appConfigDirty = false;
    // Some controlling variables required in the state machine
    var ctrl = {
            user_loaded: false,
            options_loaded: false,
            configs_loaded: false
    };

    /*
     * Attaches loading logs
     */
    function _loadingLog(stage, message) {
        app.state.stage = stage;
        app.state.message = message;
        if (message) {
            app.logs.push(message);
        }
    }

    /*
     * Bind list of roles to app data
     */
    function _loadRolesOfUser(roles) {
        for (var i = 0; i < roles.length; i++) {
            var role = roles[i];
            app.user[role.application + '_' + role.code_name] = true;
        }
    }

    /**
     * تنظیم‌های نرم افزار را لود می‌کند.
     * 
     * @returns promiss
     */
    function loadApplicationConfig() {
        _loadingLog('loading configuration', 'fetch configuration document');

        ctrl.configs_loaded = false;
        ctrl.configs_fail = false;

        $cms.getContent(APP_PREFIX + app.key) //
        .then(function (content) {
            _loadingLog('loading configuration', 'fetch configuration content');
            app._acc = content;
            ctrl.configs_loaded = true;
            // load config file
            return app._acc.downloadValue();
        }, function(error){
            ctrl.configs_fail = true;
            stateMachine.error(error);
            // return empty config
            return {};
        })
        .then(function (appConfig) {
            app.config = appConfig;
        })
        .finally(function(){
            stateMachine.loaded();
        });
    }

    /*
     * Loads current user informations
     * 
     * اطلاعات کاربر جاری از سرور دریافت شده و بر اساس اطلاعات مورد نیاز در سطح
     * نرم افزار پر می‌شود.
     * 
     * If there is a role x.y (where x is application code and y is code name)
     * in role list then the following var is added in user:
     * 
     * app.user.x_y
     * 
     */
    function loadUserProperty() {
        _loadingLog('loading user info', 'fetch user information');
        return $usr.getAccount('current', {graphql: USER_DETAIL_GRAPHQL}) //
        .then(function (user) {
            // load user info
            ctrl.user_loaded = true;
            // app user data
            app.user = {
                    anonymous: !user.id || user.id === 0,
                    current: user
            };
            // load the first profile of user
            if(user.profiles.length > 0){
                app.user.profile = user.profiles[0];
            }
            // load user roles
            _loadingLog('loading user info', 'user information loaded successfully');
            _loadingLog('loading user info', 'check user permissions');
            if (!app.user.anonymous) {
                _loadRolesOfUser(user.roles);
                for (var i = 0; i < user.groups.length; i++) {
                    _loadRolesOfUser(user.groups[i].roles);
                }
                //
                if (!user.isAnonymous()) {
                    app.user.owner = app.user.tenant_owner || app.user.core_owner || app.user.Pluf_owner || app.user.Core_owner;
                    app.user.administrator = app.user.owner;
                } else {
                    app.user.anonymous = true;
                }
            }
            stateMachine.loaded();
        }, function(error){
            ctrl.user_loaded = false;
            stateMachine.error(error);
        });
    }

    /*
     * Loads options
     */
    function loadOptions() {
        // TODO: Masood, 2018: options should be get from server. Now, its api
        // doesn't exist.
        _loadingLog('loading options', 'fetch options document');
        // get the options from server and save in app.options.
        app.options = {};
        return $tenant.getSettings(optionsQuery)
        .then(function (res) {
            for (var i = 0; i < res.items.length; i++) {
                var item = res.items[i];
                app.options[item.key] = item.value;
            }
            ctrl.options_loaded = true;
            stateMachine.loaded();
        }, function(error){
            stateMachine.error(error);
        });
    }

    /*
     * Loads local storage
     */
    function loadSetting() {
        _loadingLog('loading setting from local storage', 'fetch settings');
        /*
         * TODO: masood, 2018: The lines below is an alternative for lines above
         * but not recommended.
         * 
         * TODO: 'key' of app should be used $localStorage.setPrefix(key);
         */
        app.setting = $localStorage.$default({
            dashboardModel: {}
        });
        _loadingLog('setting loaded', 'fetch settings');
    }


    /*
     * Stores app configuration on the back end
     */
    function storeApplicationConfig() {
        appConfigDirty = true;
        if(appConfigLock){
            return;
        }
        if (!(app.user.core_owner || app.user.Pluf_owner || app.user.tenant_owner)) {
            return $q.reject({
                data: {
                    message: 'fail'
                }
            });
        }
        appConfigLock = true;
        var promise;
        if (app._acc) { // content loaded
            appConfigDirty = false;
            promise = app._acc.uploadValue(app.config);
        } else { // create content
            promise = $cms.putContent({
                name: APP_PREFIX + app.key,
                mimetype: APP_CNF_MIMETYPE
            }).then(function (content) {
                appConfigDirty = false;
                app._acc = content;
                stateMachine.loaded();
                return app._acc.uploadValue(app.config);
            }, function (error) {
                stateMachine.error(error);
            });
        } //
        return promise //
        .finally(function () {
            appConfigLock = false;
            if (appConfigDirty) {
                return storeApplicationConfig();
            }
        });
    }

    /*
     * State machine to handle life cycle of the system.
     */
    stateMachine = new machina.Fsm({
        initialize: function (/* options */) {
            app.state.status = APP_STATE_WAITING;
        },
        namespace: 'webpich.$app',
        initialState: APP_STATE_WAITING,
        states: {
            // Before the 'start' event occurs via $app.start().
            waiting: {
                _onEnter: function(){
                    loadUserProperty(); 
                    loadOptions();
                },
                start: function () {
                    this.transition(APP_STATE_LOADING);
                },
                network_error: function () {
                    this.transition(APP_STATE_OFFLINE);
                },
                server_error: function(){
                    this.transition(APP_STATE_FAIL);
                }
            },
            // tries to load all part of system
            loading: {
                _onEnter: function () {
                    loadSetting(); 
                    loadApplicationConfig(); 
                },
                loaded: function () {
                    if (ctrl.user_loaded && ctrl.options_loaded && ctrl.configs_loaded) {
                        this.transition(APP_STATE_READY);
                    } else if (ctrl.user_loaded && ctrl.options_loaded && ctrl.configs_fail) {
                        this.transition(APP_STATE_READY_NOT_CONFIGURED);
                    }
                },
                server_error: function () {//
                    this.transition(APP_STATE_FAIL);
                },
                network_error: function () {
                    this.transition(APP_STATE_OFFLINE);
                }
            },
            // app is ready
            ready: {
                network_error: function () {
                    this.transition(APP_STATE_OFFLINE);
                }
            },
            // app is ready with no config
            ready_not_configured: {
                loaded: function () {
                    if(ctrl.configs_loaded){
                        this.transition(APP_STATE_READY);
                    }
                },
                network_error: function () {
                    this.transition(APP_STATE_OFFLINE);
                }
            },
            // server error
            fail: {},
            // net error
            offline: {}
        },

        /*
         * This handle load event of app
         * 
         * If a part of the app loaded then this handler fire an event and
         * update the app state.
         */
        loaded: function () {
            this.handle(APP_EVENT_LOADED);
        },

        /*
         * Fires start event
         */
        start: function () {
            this.handle(APP_EVENT_START);
        },

        /*
         * Handle HTTP response error.
         * 
         * If the is an error in loading and storing configuration then this
         * function checks and fire an event.
         */
        error: function ($error) {
            if ($error.status === 404) {
                this.handle(APP_EVENT_NOT_FOUND);
            } else if ($error.status === 500) {
                this.handle(APP_EVENT_SERVER_ERROR);
            } else if ($error.status === -1) {
                this.handle(APP_EVENT_NET_ERROR);
            }
        }
    });


    // I'd like to know when the transition event occurs
    stateMachine.on('transition', function () {
        _loadingLog('$app event handling', '$app state is changed from ' + app.state.status  + ' to '+ stateMachine.state);
        app.state.status = stateMachine.state;
    });

    /*
     * watch direction and update app.dir
     */
    $rootScope.$watch(function () {
        if (!app.config.local) {
            app.config.local = {};
        }
        return app.setting.dir || app.config.local.dir;
    }, function (value) {
        app.dir = value; // (app.setting.dir || app.config.local.dir)//old
        // version of app.js;
    });
    /*
     * watch local and update language
     */
    $rootScope.$watch(function () {
        // TODO: maso, 2018: remove this part in the next release
        if (!angular.isObject(app.config.local)) {
            app.config.local = {};
        }
        // Check language
        return app.setting.local || app.config.local.language || 'en';
    }, function (key) {
        // 0- set app local
        app.local = key;
        // 1- change language
        $translate.use(key);
        // 2- chnage date format
        // Change moment's locale so the 'L'-format is adjusted.
        // For example the 'L'-format is DD-MM-YYYY for Dutch
        moment.loadPersian();
        moment.locale(key);
        // Set month and week names for the general $mdDateLocale service
        var localeDate = moment.localeData();
        $mdDateLocale.months = localeDate._months;
        $mdDateLocale.shortMonths = localeDate._monthsShort;
        $mdDateLocale.days = localeDate._weekdays;
        $mdDateLocale.shortDays = localeDate._weekdaysMin;
        // Optionaly let the week start on the day as defined by moment's locale
        // data
        $mdDateLocale.firstDayOfWeek = localeDate._week.dow;
    });

    /*
     * watch calendar
     */
    $rootScope.$watch(function () {
        return app.setting.calendar || app.config.calendar || 'Gregorian';
    }, function (key) {
        // 0- set app local
        app.calendar = key;
    });

    /*
     * watch application configuration and update app state
     */
    $rootScope.$watch('app.config', function () {
        if (app.state.status === APP_STATE_READY || app.state.status === APP_STATE_READY_NOT_CONFIGURED) {
            // TODO: maso, 2018: delay to save
            storeApplicationConfig();
        }
    }, true);

    /**
     * Start the application
     * 
     * this function is called when the app get started.
     * 
     * @memberof $app
     */
    function start(key) {
        app.key = key;
        stateMachine.start();
    }

    /**
     * Logins into the backend
     * 
     * @memberof $app
     * @param {object}
     *            credential of the user
     */
    function login(credential) {
        if (!app.user.anonymous) {
            return $q.resolve(app.user.current);
        }
        return $http({
            method: 'POST',
            url: '/api/v2/user/login',
            data: $httpParamSerializerJQLike(credential),
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }).then(function () {
            loadUserProperty();
        });
    }

    /**
     * Application logout
     * 
     * Logout and clean user data, this will change state of the application.
     * 
     * @memberof $app
     */
    function logout() {
        var oldUser = $rootScope.app.user;
        if (oldUser.anonymous) {
            return $q.resolve(oldUser);
        }
        $rootScope.app.user = {};
        stateMachine.loaded();
        return $http({
            method: 'POST',
            url: '/api/v2/user/logout',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        })
        .then(function () {
            loadUserProperty();
        }, function () {
            // TODO: maso, 2018: fail to logout?!
            $rootScope.app.user = oldUser;
            stateMachine.loaded();
        });
    }

    // Init
    apps.start = start;
    apps.login = login;
    apps.logout = logout;
    return apps;
});