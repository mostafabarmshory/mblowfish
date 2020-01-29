/*!
 *  * machina - A library for creating powerful and flexible finite state machines. Loosely inspired by Erlang/OTP's gen_fsm behavior.
 *  * Author: Jim Cowart (http://ifandelse.com)
 *  * Version: v4.0.2
 *  * Url: http://machina-js.org/
 *  * License(s): 
 */
(function webpackUniversalModuleDefinition(root, factory) {
    if(typeof exports === 'object' && typeof module === 'object'){
        module.exports = factory(require("lodash"));
    } else if(typeof define === 'function' && define.amd){
        define(["lodash"], factory);
    }else if(typeof exports === 'object'){
        exports.machina = factory(require("lodash"));
    }else{
        root.machina = factory(root._);
    }
})(this, function(__WEBPACK_EXTERNAL_MODULE_1__) {
    return /******/ (function(modules) { // webpackBootstrap
        /******/ 	// The module cache
        /******/ 	var installedModules = {};
        /******/
        /******/ 	// The require function
        /******/ 	function __webpack_require__(moduleId) {
            /******/
            /******/ 		// Check if module is in cache
            /******/ 		if(installedModules[moduleId])
                /******/ 			return installedModules[moduleId].exports;
            /******/
            /******/ 		// Create a new module (and put it into the cache)
            /******/ 		var module = installedModules[moduleId] = {
                    /******/ 			exports: {},
                    /******/ 			id: moduleId,
                    /******/ 			loaded: false
            /******/ 		};
            /******/
            /******/ 		// Execute the module function
            /******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
            /******/
            /******/ 		// Flag the module as loaded
            /******/ 		module.loaded = true;
            /******/
            /******/ 		// Return the exports of the module
            /******/ 		return module.exports;
        /******/ 	}
        /******/
        /******/
        /******/ 	// expose the modules object (__webpack_modules__)
        /******/ 	__webpack_require__.m = modules;
        /******/
        /******/ 	// expose the module cache
        /******/ 	__webpack_require__.c = installedModules;
        /******/
        /******/ 	// __webpack_public_path__
        /******/ 	__webpack_require__.p = "";
        /******/
        /******/ 	// Load entry module and return exports
        /******/ 	return __webpack_require__(0);
    /******/ })
    /************************************************************************/
    /******/ ([
        /* 0 */
        /***/ (function(module, exports, __webpack_require__) {

            var _ = __webpack_require__( 1 );
            var emitter = __webpack_require__( 2 );

            module.exports = _.merge( emitter.instance, {
                Fsm: __webpack_require__( 5 ),
                BehavioralFsm: __webpack_require__( 6 ),
                utils: __webpack_require__( 3 ),
                eventListeners: {
                    newFsm: []
                }
            } );


        /***/ }),
        /* 1 */
        /***/ (function(module, exports) {

            module.exports = __WEBPACK_EXTERNAL_MODULE_1__;

        /***/ }),
        /* 2 */
        /***/ (function(module, exports, __webpack_require__) {

            var utils = __webpack_require__( 3 );
            var _ = __webpack_require__( 1 );

            function getInstance() {
                return {
                    emit: function( eventName ) {
                        var args = utils.getLeaklessArgs( arguments );
                        if ( this.eventListeners[ "*" ] ) {
                            _.each( this.eventListeners[ "*" ], function( callback ) {
                                if ( !this.useSafeEmit ) {
                                    callback.apply( this, args );
                                } else {
                                    try {
                                        callback.apply( this, args );
                                    } catch ( exception ) {
                                        /* istanbul ignore else  */
                                        if ( console && typeof console.log !== "undefined" ) {
                                            console.log( exception.stack );
                                        }
                                    }
                                }
                            }.bind( this ) );
                        }
                        if ( this.eventListeners[ eventName ] ) {
                            _.each( this.eventListeners[ eventName ], function( callback ) {
                                if ( !this.useSafeEmit ) {
                                    callback.apply( this, args.slice( 1 ) );
                                } else {
                                    try {
                                        callback.apply( this, args.slice( 1 ) );
                                    } catch ( exception ) {
                                        /* istanbul ignore else  */
                                        if ( console && typeof console.log !== "undefined" ) {
                                            console.log( exception.stack );
                                        }
                                    }
                                }
                            }.bind( this ) );
                        }
                    },

                    on: function( eventName, callback ) {
                        var self = this;
                        self.eventListeners = self.eventListeners || { "*": [] };
                        if ( !self.eventListeners[ eventName ] ) {
                            self.eventListeners[ eventName ] = [];
                        }
                        self.eventListeners[ eventName ].push( callback );
                        return {
                            eventName: eventName,
                            callback: callback,
                            off: function() {
                                self.off( eventName, callback );
                            }
                        };
                    },

                    off: function( eventName, callback ) {
                        this.eventListeners = this.eventListeners || { "*": [] };
                        if ( !eventName ) {
                            this.eventListeners = {};
                        } else {
                            if ( callback ) {
                                this.eventListeners[ eventName ] = _.without( this.eventListeners[ eventName ], callback );
                            } else {
                                this.eventListeners[ eventName ] = [];
                            }
                        }
                    }
                };
            }

            module.exports = {
                    getInstance: getInstance,
                    instance: getInstance()
            };


        /***/ }),
        /* 3 */
        /***/ (function(module, exports, __webpack_require__) {

            var slice = [].slice;
            var events = __webpack_require__( 4 );
            var _ = __webpack_require__( 1 );

            var makeFsmNamespace = ( function() {
                var machinaCount = 0;
                return function() {
                    return "fsm." + machinaCount++;
                };
            } )();

            function getDefaultBehavioralOptions() {
                return {
                    initialState: "uninitialized",
                    eventListeners: {
                        "*": []
                    },
                    states: {},
                    namespace: makeFsmNamespace(),
                    useSafeEmit: false,
                    hierarchy: {},
                    pendingDelegations: {}
                };
            }

            function getDefaultClientMeta() {
                return {
                    inputQueue: [],
                    targetReplayState: "",
                    state: undefined,
                    priorState: undefined,
                    priorAction: "",
                    currentAction: "",
                    currentActionArgs: undefined,
                    inExitHandler: false
                };
            }

            function getLeaklessArgs( args, startIdx ) {
                var result = [];
                for ( var i = ( startIdx || 0 ); i < args.length; i++ ) {
                    result[ i ] = args[ i ];
                }
                return result;
            }
            /*
		handle ->
			child = stateObj._child && stateObj._child.instance;

		transition ->
			newStateObj._child = getChildFsmInstance( newStateObj._child );
			child = newStateObj._child && newStateObj._child.instance;
             */
            function getChildFsmInstance( config ) {
                if ( !config ) {
                    return;
                }
                var childFsmDefinition = {};
                if ( typeof config === "object" ) {
                    // is this a config object with a factory?
                    if ( config.factory ) {
                        childFsmDefinition = config;
                        childFsmDefinition.instance = childFsmDefinition.factory();
                    } else {
                        // assuming this is a machina instance
                        childFsmDefinition.factory = function() {
                            return config;
                        };
                    }
                } else if ( typeof config === "function" ) {
                    childFsmDefinition.factory = config;
                }
                childFsmDefinition.instance = childFsmDefinition.factory();
                return childFsmDefinition;
            }

            function listenToChild( fsm, child ) {
                // Need to investigate potential for discarded event
                // listener memory leak in long-running, deeply-nested hierarchies.
                return child.on( "*", function( eventName, data ) {
                    switch ( eventName ) {
                    case events.NO_HANDLER:
                        if ( !data.ticket && !data.delegated && data.namespace !== fsm.namespace ) {
                            // Ok - we're dealing w/ a child handling input that should bubble up
                            data.args[ 1 ].bubbling = true;
                        }
                        // we do NOT bubble _reset inputs up to the parent
                        if ( data.inputType !== "_reset" ) {
                            fsm.handle.apply( fsm, data.args );
                        }
                        break;
                    case events.HANDLING :
                        var ticket = data.ticket;
                        if ( ticket && fsm.pendingDelegations[ ticket ] ) {
                            delete fsm.pendingDelegations[ ticket ];
                        }
                        fsm.emit( eventName, data ); // possibly transform payload?
                        break;
                    default:
                        fsm.emit( eventName, data ); // possibly transform payload?
                    break;
                    }
                } );
            }

            // _machKeys are members we want to track across the prototype chain of an extended FSM constructor
            // Since we want to eventually merge the aggregate of those values onto the instance so that FSMs
            // that share the same extended prototype won't share state *on* those prototypes.
            var _machKeys = [ "states", "initialState" ];
            var extend = function( protoProps, staticProps ) {
                var parent = this;
                var fsm; // placeholder for instance constructor
                var machObj = {}; // object used to hold initialState & states from prototype for instance-level merging
                var Ctor = function() {}; // placeholder ctor function used to insert level in prototype chain

                // The constructor function for the new subclass is either defined by you
                // (the "constructor" property in your `extend` definition), or defaulted
                // by us to simply call the parent's constructor.
                if ( protoProps && protoProps.hasOwnProperty( "constructor" ) ) {
                    fsm = protoProps.constructor;
                } else {
                    // The default machina constructor (when using inheritance) creates a
                    // deep copy of the states/initialState values from the prototype and
                    // extends them over the instance so that they'll be instance-level.
                    // If an options arg (args[0]) is passed in, a states or intialState
                    // value will be preferred over any data pulled up from the prototype.
                    fsm = function() {
                        var args = slice.call( arguments, 0 );
                        args[ 0 ] = args[ 0 ] || {};
                        var blendedState;
                        var instanceStates = args[ 0 ].states || {};
                        blendedState = _.merge( _.cloneDeep( machObj ), { states: instanceStates } );
                        blendedState.initialState = args[ 0 ].initialState || this.initialState;
                        _.extend( args[ 0 ], blendedState );
                        parent.apply( this, args );
                    };
                }

                // Inherit class (static) properties from parent.
                _.merge( fsm, parent );

                // Set the prototype chain to inherit from `parent`, without calling
                // `parent`'s constructor function.
                Ctor.prototype = parent.prototype;
                fsm.prototype = new Ctor();

                // Add prototype properties (instance properties) to the subclass,
                // if supplied.
                if ( protoProps ) {
                    _.extend( fsm.prototype, protoProps );
                    _.merge( machObj, _.transform( protoProps, function( accum, val, key ) {
                        if ( _machKeys.indexOf( key ) !== -1 ) {
                            accum[ key ] = val;
                        }
                    } ) );
                }

                // Add static properties to the constructor function, if supplied.
                if ( staticProps ) {
                    _.merge( fsm, staticProps );
                }

                // Correctly set child's `prototype.constructor`.
                fsm.prototype.constructor = fsm;

                // Set a convenience property in case the parent's prototype is needed later.
                fsm.__super__ = parent.prototype;
                return fsm;
            };

            function createUUID() {
                var s = [];
                var hexDigits = "0123456789abcdef";
                for ( var i = 0; i < 36; i++ ) {
                    s[ i ] = hexDigits.substr( Math.floor( Math.random() * 0x10 ), 1 );
                }
                s[ 14 ] = "4"; // bits 12-15 of the time_hi_and_version field to 0010
                /* jshint ignore:start */
                s[ 19 ] = hexDigits.substr( ( s[ 19 ] & 0x3 ) | 0x8, 1 ); // bits 6-7 of the clock_seq_hi_and_reserved to 01
                /* jshint ignore:end */
                s[ 8 ] = s[ 13 ] = s[ 18 ] = s[ 23 ] = "-";
                return s.join( "" );
            }

            module.exports = {
                    createUUID: createUUID,
                    extend: extend,
                    getDefaultBehavioralOptions: getDefaultBehavioralOptions,
                    getDefaultOptions: getDefaultBehavioralOptions,
                    getDefaultClientMeta: getDefaultClientMeta,
                    getChildFsmInstance: getChildFsmInstance,
                    getLeaklessArgs: getLeaklessArgs,
                    listenToChild: listenToChild,
                    makeFsmNamespace: makeFsmNamespace
            };


        /***/ }),
        /* 4 */
        /***/ (function(module, exports) {

            module.exports = {
                    NEXT_TRANSITION: "transition",
                    HANDLING: "handling",
                    HANDLED: "handled",
                    NO_HANDLER: "nohandler",
                    TRANSITION: "transition",
                    TRANSITIONED: "transitioned",
                    INVALID_STATE: "invalidstate",
                    DEFERRED: "deferred",
                    NEW_FSM: "newfsm"
            };


        /***/ }),
        /* 5 */
        /***/ (function(module, exports, __webpack_require__) {

            var BehavioralFsm = __webpack_require__( 6 );
            var utils = __webpack_require__( 3 );
            var _ = __webpack_require__( 1 );

            var Fsm = {
                    constructor: function() {
                        BehavioralFsm.apply( this, arguments );
                        this.ensureClientMeta();
                    },
                    initClient: function initClient() {
                        var initialState = this.initialState;
                        if ( !initialState ) {
                            throw new Error( "You must specify an initial state for this FSM" );
                        }
                        if ( !this.states[ initialState ] ) {
                            throw new Error( "The initial state specified does not exist in the states object." );
                        }
                        this.transition( initialState );
                    },
                    ensureClientMeta: function ensureClientMeta() {
                        if ( !this._stamped ) {
                            this._stamped = true;
                            _.defaults( this, _.cloneDeep( utils.getDefaultClientMeta() ) );
                            this.initClient();
                        }
                        return this;
                    },

                    ensureClientArg: function( args ) {
                        var _args = args;
                        // we need to test the args and verify that if a client arg has
                        // been passed, it must be this FSM instance (this isn't a behavioral FSM)
                        if ( typeof _args[ 0 ] === "object" && !( "inputType" in _args[ 0 ] ) && _args[ 0 ] !== this ) {
                            _args.splice( 0, 1, this );
                        } else if ( typeof _args[ 0 ] !== "object" || ( typeof _args[ 0 ] === "object" && ( "inputType" in _args[ 0 ] ) ) ) {
                            _args.unshift( this );
                        }
                        return _args;
                    },

                    getHandlerArgs: function( args, isCatchAll ) {
                        // index 0 is the client, index 1 is inputType
                        // if we're in a catch-all handler, input type needs to be included in the args
                        // inputType might be an object, so we need to just get the inputType string if so
                        var _args = args;
                        var input = _args[ 1 ];
                        if ( typeof inputType === "object" ) {
                            _args.splice( 1, 1, input.inputType );
                        }
                        return isCatchAll ?
                                _args.slice( 1 ) :
                                    _args.slice( 2 );
                    },

                    getSystemHandlerArgs: function( args, client ) {
                        return args;
                    },

                    // "classic" machina FSM do not emit the client property on events (which would be the FSM itself)
                    buildEventPayload: function() {
                        var args = this.ensureClientArg( utils.getLeaklessArgs( arguments ) );
                        var data = args[ 1 ];
                        if ( _.isPlainObject( data ) ) {
                            return _.extend( data, { namespace: this.namespace } );
                        } else {
                            return { data: data || null, namespace: this.namespace };
                        }
                    }
            };

            _.each( [
                "handle",
                "transition",
                "deferUntilTransition",
                "processQueue",
                "clearQueue"
                ], function( methodWithClientInjected ) {
                Fsm[ methodWithClientInjected ] = function() {
                    var args = this.ensureClientArg( utils.getLeaklessArgs( arguments ) );
                    return BehavioralFsm.prototype[ methodWithClientInjected ].apply( this, args );
                };
            } );

            Fsm = BehavioralFsm.extend( Fsm );

            module.exports = Fsm;


        /***/ }),
        /* 6 */
        /***/ (function(module, exports, __webpack_require__) {

            var _ = __webpack_require__( 1 );
            var utils = __webpack_require__( 3 );
            var emitter = __webpack_require__( 2 );
            var topLevelEmitter = emitter.instance;
            var events = __webpack_require__( 4 );

            var MACHINA_PROP = "__machina__";

            function BehavioralFsm( options ) {
                _.extend( this, options );
                _.defaults( this, utils.getDefaultBehavioralOptions() );
                this.initialize.apply( this, arguments );
                topLevelEmitter.emit( events.NEW_FSM, this );
            }

            _.extend( BehavioralFsm.prototype, {
                initialize: function() {},

                initClient: function initClient( client ) {
                    var initialState = this.initialState;
                    if ( !initialState ) {
                        throw new Error( "You must specify an initial state for this FSM" );
                    }
                    if ( !this.states[ initialState ] ) {
                        throw new Error( "The initial state specified does not exist in the states object." );
                    }
                    this.transition( client, initialState );
                },

                configForState: function configForState( newState ) {
                    var newStateObj = this.states[ newState ];
                    var child;
                    _.each( this.hierarchy, function( childListener, key ) {
                        if ( childListener && typeof childListener.off === "function" ) {
                            childListener.off();
                        }
                    } );

                    if ( newStateObj._child ) {
                        newStateObj._child = utils.getChildFsmInstance( newStateObj._child );
                        child = newStateObj._child && newStateObj._child.instance;
                        this.hierarchy[ child.namespace ] = utils.listenToChild( this, child );
                    }

                    return child;
                },

                ensureClientMeta: function ensureClientMeta( client ) {
                    if ( typeof client !== "object" ) {
                        throw new Error( "An FSM client must be an object." );
                    }
                    client[ MACHINA_PROP ] = client[ MACHINA_PROP ] || {};
                    if ( !client[ MACHINA_PROP ][ this.namespace ] ) {
                        client[ MACHINA_PROP ][ this.namespace ] = _.cloneDeep( utils.getDefaultClientMeta() );
                        this.initClient( client );
                    }
                    return client[ MACHINA_PROP ][ this.namespace ];
                },

                buildEventPayload: function( client, data ) {
                    if ( _.isPlainObject( data ) ) {
                        return _.extend( data, { client: client, namespace: this.namespace } );
                    } else {
                        return { client: client, data: data || null, namespace: this.namespace };
                    }
                },

                getHandlerArgs: function( args, isCatchAll ) {
                    // index 0 is the client, index 1 is inputType
                    // if we're in a catch-all handler, input type needs to be included in the args
                    // inputType might be an object, so we need to just get the inputType string if so
                    var _args = args.slice( 0 );
                    var input = _args[ 1 ];
                    if ( typeof input === "object" ) {
                        _args.splice( 1, 1, input.inputType );
                    }
                    return isCatchAll ?
                            _args :
                                [ _args[ 0 ] ].concat( _args.slice( 2 ) );
                },

                getSystemHandlerArgs: function( args, client ) {
                    return [ client ].concat( args );
                },

                handle: function( client, input ) {
                    var inputDef = input;
                    if ( typeof input === "undefined" ) {
                        throw new Error( "The input argument passed to the FSM's handle method is undefined. Did you forget to pass the input name?" );
                    }
                    if ( typeof input === "string" ) {
                        inputDef = { inputType: input, delegated: false, ticket: undefined };
                    }
                    var clientMeta = this.ensureClientMeta( client );
                    var args = utils.getLeaklessArgs( arguments );
                    if ( typeof input !== "object" ) {
                        args.splice( 1, 1, inputDef );
                    }
                    clientMeta.currentActionArgs = args.slice( 1 );
                    var currentState = clientMeta.state;
                    var stateObj = this.states[ currentState ];
                    var handlerName;
                    var handler;
                    var isCatchAll = false;
                    var child;
                    var result;
                    var action;
                    if ( !clientMeta.inExitHandler ) {
                        child = this.configForState( currentState );
                        if ( child && !this.pendingDelegations[ inputDef.ticket ] && !inputDef.bubbling ) {
                            inputDef.ticket = ( inputDef.ticket || utils.createUUID() );
                            inputDef.delegated = true;
                            this.pendingDelegations[ inputDef.ticket ] = { delegatedTo: child.namespace };
                            // WARNING - returning a value from `handle` on child FSMs is not really supported.
                            // If you need to return values from child FSM input handlers, use events instead.
                            result = child.handle.apply( child, args );
                        } else {
                            if ( inputDef.ticket && this.pendingDelegations[ inputDef.ticket ] ) {
                                delete this.pendingDelegations[ inputDef.ticket ];
                            }
                            handlerName = stateObj[ inputDef.inputType ] ? inputDef.inputType : "*";
                            isCatchAll = ( handlerName === "*" );
                            handler = ( stateObj[ handlerName ] || this[ handlerName ] ) || this[ "*" ];
                            action = clientMeta.state + "." + handlerName;
                            clientMeta.currentAction = action;
                            var eventPayload = this.buildEventPayload(
                                    client,
                                    { inputType: inputDef.inputType, delegated: inputDef.delegated, ticket: inputDef.ticket }
                            );
                            if ( !handler ) {
                                this.emit( events.NO_HANDLER, _.extend( { args: args }, eventPayload ) );
                            } else {
                                this.emit( events.HANDLING, eventPayload );
                                if ( typeof handler === "function" ) {
                                    result = handler.apply( this, this.getHandlerArgs( args, isCatchAll ) );
                                } else {
                                    result = handler;
                                    this.transition( client, handler );
                                }
                                this.emit( events.HANDLED, eventPayload );
                            }
                            clientMeta.priorAction = clientMeta.currentAction;
                            clientMeta.currentAction = "";
                            clientMeta.currentActionArgs = undefined;
                        }
                    }
                    return result;
                },

                transition: function( client, newState ) {
                    var clientMeta = this.ensureClientMeta( client );
                    var curState = clientMeta.state;
                    var curStateObj = this.states[ curState ];
                    var newStateObj = this.states[ newState ];
                    var child;
                    var args = utils.getLeaklessArgs( arguments ).slice( 2 );
                    if ( !clientMeta.inExitHandler && newState !== curState ) {
                        if ( newStateObj ) {
                            child = this.configForState( newState );
                            if ( curStateObj && curStateObj._onExit ) {
                                clientMeta.inExitHandler = true;
                                curStateObj._onExit.call( this, client );
                                clientMeta.inExitHandler = false;
                            }
                            clientMeta.targetReplayState = newState;
                            clientMeta.priorState = curState;
                            clientMeta.state = newState;
                            var eventPayload = this.buildEventPayload( client, {
                                fromState: clientMeta.priorState,
                                action: clientMeta.currentAction,
                                toState: newState
                            } );
                            this.emit( events.TRANSITION, eventPayload );
                            if ( newStateObj._onEnter ) {
                                newStateObj._onEnter.apply( this, this.getSystemHandlerArgs( args, client ) );
                            }
                            this.emit( events.TRANSITIONED, eventPayload );
                            if ( child ) {
                                child.handle( client, "_reset" );
                            }

                            if ( clientMeta.targetReplayState === newState ) {
                                this.processQueue( client, events.NEXT_TRANSITION );
                            }
                            return;
                        }
                        this.emit( events.INVALID_STATE, this.buildEventPayload( client, {
                            state: clientMeta.state,
                            attemptedState: newState
                        } ) );
                    }
                },

                deferUntilTransition: function( client, stateName ) {
                    var clientMeta = this.ensureClientMeta( client );
                    var stateList = _.isArray( stateName ) ? stateName : ( stateName ? [ stateName ] : undefined );
                    if ( clientMeta.currentActionArgs ) {
                        var queued = {
                                type: events.NEXT_TRANSITION,
                                untilState: stateList,
                                args: clientMeta.currentActionArgs
                        };
                        clientMeta.inputQueue.push( queued );
                        var eventPayload = this.buildEventPayload( client, {
                            state: clientMeta.state,
                            queuedArgs: queued
                        } );
                        this.emit( events.DEFERRED, eventPayload );
                    }
                },

                deferAndTransition: function( client, stateName ) {
                    this.deferUntilTransition( client, stateName );
                    this.transition( client, stateName );
                },

                processQueue: function( client ) {
                    var clientMeta = this.ensureClientMeta( client );
                    var filterFn = function( item ) {
                        return ( ( !item.untilState ) || ( _.includes( item.untilState, clientMeta.state ) ) );
                    };
                    var toProcess = _.filter( clientMeta.inputQueue, filterFn );
                    clientMeta.inputQueue = _.difference( clientMeta.inputQueue, toProcess );
                    _.each( toProcess, function( item ) {
                        this.handle.apply( this, [ client ].concat( item.args ) );
                    }.bind( this ) );
                },

                clearQueue: function( client, name ) {
                    var clientMeta = this.ensureClientMeta( client );
                    if ( !name ) {
                        clientMeta.inputQueue = [];
                    } else {
                        // first pass we remove the target state from any `untilState` array
                        _.each( clientMeta.inputQueue, function( item ) {
                            item.untilState = _.without( item.untilState, name );
                        } );
                        // second pass we clear out deferred events with empty untilState arrays
                        var filter = function( evnt ) {
                            return evnt.untilState.length !== 0;
                        };
                        clientMeta.inputQueue = _.filter( clientMeta.inputQueue, filter );
                    }
                },

                compositeState: function( client ) {
                    var clientMeta = this.ensureClientMeta( client );
                    var state = clientMeta.state;
                    var child = this.states[state]._child && this.states[state]._child.instance;
                    if ( child ) {
                        state += "." + child.compositeState( client );
                    }
                    return state;
                }
            }, emitter.getInstance() );

            BehavioralFsm.extend = utils.extend;

            module.exports = BehavioralFsm;


        /***/ })
        /******/ ])
});


;(function(){

/**
 * Require the module at `name`.
 *
 * @param {String} name
 * @return {Object} exports
 * @api public
 */

function require(name) {
  var module = require.modules[name];
  if (!module) throw new Error('failed to require "' + name + '"');

  if (!('exports' in module) && typeof module.definition === 'function') {
    module.client = module.component = true;
    module.definition.call(this, module.exports = {}, module);
    delete module.definition;
  }

  return module.exports;
}

/**
 * Registered modules.
 */

require.modules = {
  moment: { exports: moment }
};

/**
 * Register module at `name` with callback `definition`.
 *
 * @param {String} name
 * @param {Function} definition
 * @api private
 */

require.register = function (name, definition) {
  require.modules[name] = {
    definition: definition
  };
};

/**
 * Define a module's exports immediately with `exports`.
 *
 * @param {String} name
 * @param {Generic} exports
 * @api private
 */

require.define = function (name, exports) {
  require.modules[name] = {
    exports: exports
  };
};

require.register("jalaali-js", function (exports, module) {
/*
  Expose functions.
*/
module.exports =
  { toJalaali: toJalaali
  , toGregorian: toGregorian
  , isValidJalaaliDate: isValidJalaaliDate
  , isLeapJalaaliYear: isLeapJalaaliYear
  , jalaaliMonthLength: jalaaliMonthLength
  , jalCal: jalCal
  , j2d: j2d
  , d2j: d2j
  , g2d: g2d
  , d2g: d2g
  }

/*
  Converts a Gregorian date to Jalaali.
*/
function toJalaali(gy, gm, gd) {
  return d2j(g2d(gy, gm, gd))
}

/*
  Converts a Jalaali date to Gregorian.
*/
function toGregorian(jy, jm, jd) {
  return d2g(j2d(jy, jm, jd))
}

/*
  Checks whether a Jalaali date is valid or not.
*/
function isValidJalaaliDate(jy, jm, jd) {
  return  jy >= -61 && jy <= 3177 &&
          jm >= 1 && jm <= 12 &&
          jd >= 1 && jd <= jalaaliMonthLength(jy, jm)
}

/*
  Is this a leap year or not?
*/
function isLeapJalaaliYear(jy) {
  return jalCal(jy).leap === 0
}

/*
  Number of days in a given month in a Jalaali year.
*/
function jalaaliMonthLength(jy, jm) {
  if (jm <= 6) return 31
  if (jm <= 11) return 30
  if (isLeapJalaaliYear(jy)) return 30
  return 29
}

/*
  This function determines if the Jalaali (Persian) year is
  leap (366-day long) or is the common year (365 days), and
  finds the day in March (Gregorian calendar) of the first
  day of the Jalaali year (jy).

  @param jy Jalaali calendar year (-61 to 3177)
  @return
    leap: number of years since the last leap year (0 to 4)
    gy: Gregorian year of the beginning of Jalaali year
    march: the March day of Farvardin the 1st (1st day of jy)
  @see: http://www.astro.uni.torun.pl/~kb/Papers/EMP/PersianC-EMP.htm
  @see: http://www.fourmilab.ch/documents/calendar/
*/
function jalCal(jy) {
  // Jalaali years starting the 33-year rule.
  var breaks =  [ -61, 9, 38, 199, 426, 686, 756, 818, 1111, 1181, 1210
                , 1635, 2060, 2097, 2192, 2262, 2324, 2394, 2456, 3178
                ]
    , bl = breaks.length
    , gy = jy + 621
    , leapJ = -14
    , jp = breaks[0]
    , jm
    , jump
    , leap
    , leapG
    , march
    , n
    , i

  if (jy < jp || jy >= breaks[bl - 1])
    throw new Error('Invalid Jalaali year ' + jy)

  // Find the limiting years for the Jalaali year jy.
  for (i = 1; i < bl; i += 1) {
    jm = breaks[i]
    jump = jm - jp
    if (jy < jm)
      break
    leapJ = leapJ + div(jump, 33) * 8 + div(mod(jump, 33), 4)
    jp = jm
  }
  n = jy - jp

  // Find the number of leap years from AD 621 to the beginning
  // of the current Jalaali year in the Persian calendar.
  leapJ = leapJ + div(n, 33) * 8 + div(mod(n, 33) + 3, 4)
  if (mod(jump, 33) === 4 && jump - n === 4)
    leapJ += 1

  // And the same in the Gregorian calendar (until the year gy).
  leapG = div(gy, 4) - div((div(gy, 100) + 1) * 3, 4) - 150

  // Determine the Gregorian date of Farvardin the 1st.
  march = 20 + leapJ - leapG

  // Find how many years have passed since the last leap year.
  if (jump - n < 6)
    n = n - jump + div(jump + 4, 33) * 33
  leap = mod(mod(n + 1, 33) - 1, 4)
  if (leap === -1) {
    leap = 4
  }

  return  { leap: leap
          , gy: gy
          , march: march
          }
}

/*
  Converts a date of the Jalaali calendar to the Julian Day number.

  @param jy Jalaali year (1 to 3100)
  @param jm Jalaali month (1 to 12)
  @param jd Jalaali day (1 to 29/31)
  @return Julian Day number
*/
function j2d(jy, jm, jd) {
  var r = jalCal(jy)
  return g2d(r.gy, 3, r.march) + (jm - 1) * 31 - div(jm, 7) * (jm - 7) + jd - 1
}

/*
  Converts the Julian Day number to a date in the Jalaali calendar.

  @param jdn Julian Day number
  @return
    jy: Jalaali year (1 to 3100)
    jm: Jalaali month (1 to 12)
    jd: Jalaali day (1 to 29/31)
*/
function d2j(jdn) {
  var gy = d2g(jdn).gy // Calculate Gregorian year (gy).
    , jy = gy - 621
    , r = jalCal(jy)
    , jdn1f = g2d(gy, 3, r.march)
    , jd
    , jm
    , k

  // Find number of days that passed since 1 Farvardin.
  k = jdn - jdn1f
  if (k >= 0) {
    if (k <= 185) {
      // The first 6 months.
      jm = 1 + div(k, 31)
      jd = mod(k, 31) + 1
      return  { jy: jy
              , jm: jm
              , jd: jd
              }
    } else {
      // The remaining months.
      k -= 186
    }
  } else {
    // Previous Jalaali year.
    jy -= 1
    k += 179
    if (r.leap === 1)
      k += 1
  }
  jm = 7 + div(k, 30)
  jd = mod(k, 30) + 1
  return  { jy: jy
          , jm: jm
          , jd: jd
          }
}

/*
  Calculates the Julian Day number from Gregorian or Julian
  calendar dates. This integer number corresponds to the noon of
  the date (i.e. 12 hours of Universal Time).
  The procedure was tested to be good since 1 March, -100100 (of both
  calendars) up to a few million years into the future.

  @param gy Calendar year (years BC numbered 0, -1, -2, ...)
  @param gm Calendar month (1 to 12)
  @param gd Calendar day of the month (1 to 28/29/30/31)
  @return Julian Day number
*/
function g2d(gy, gm, gd) {
  var d = div((gy + div(gm - 8, 6) + 100100) * 1461, 4)
      + div(153 * mod(gm + 9, 12) + 2, 5)
      + gd - 34840408
  d = d - div(div(gy + 100100 + div(gm - 8, 6), 100) * 3, 4) + 752
  return d
}

/*
  Calculates Gregorian and Julian calendar dates from the Julian Day number
  (jdn) for the period since jdn=-34839655 (i.e. the year -100100 of both
  calendars) to some millions years ahead of the present.

  @param jdn Julian Day number
  @return
    gy: Calendar year (years BC numbered 0, -1, -2, ...)
    gm: Calendar month (1 to 12)
    gd: Calendar day of the month M (1 to 28/29/30/31)
*/
function d2g(jdn) {
  var j
    , i
    , gd
    , gm
    , gy
  j = 4 * jdn + 139361631
  j = j + div(div(4 * jdn + 183187720, 146097) * 3, 4) * 4 - 3908
  i = div(mod(j, 1461), 4) * 5 + 308
  gd = div(mod(i, 153), 5) + 1
  gm = mod(div(i, 153), 12) + 1
  gy = div(j, 1461) - 100100 + div(8 - gm, 6)
  return  { gy: gy
          , gm: gm
          , gd: gd
          }
}

/*
  Utility helper functions.
*/

function div(a, b) {
  return ~~(a / b)
}

function mod(a, b) {
  return a - ~~(a / b) * b
}
})
require.register("moment-jalaali", function (exports, module) {

module.exports = jMoment

var moment = require('moment')
  , jalaali = require('jalaali-js')

/************************************
    Constants
************************************/

var formattingTokens = /(\[[^\[]*\])|(\\)?j(Mo|MM?M?M?|Do|DDDo|DD?D?D?|w[o|w]?|YYYYY|YYYY|YY|gg(ggg?)?|)|(\\)?(Mo|MM?M?M?|Do|DDDo|DD?D?D?|ddd?d?|do?|w[o|w]?|W[o|W]?|YYYYY|YYYY|YY|gg(ggg?)?|GG(GGG?)?|e|E|a|A|hh?|HH?|mm?|ss?|SS?S?|X|zz?|ZZ?|.)/g
  , localFormattingTokens = /(\[[^\[]*\])|(\\)?(LTS?|LL?L?L?|l{1,4})/g

  , parseTokenOneOrTwoDigits = /\d\d?/
  , parseTokenOneToThreeDigits = /\d{1,3}/
  , parseTokenThreeDigits = /\d{3}/
  , parseTokenFourDigits = /\d{1,4}/
  , parseTokenSixDigits = /[+\-]?\d{1,6}/
  , parseTokenWord = /[0-9]*['a-z\u00A0-\u05FF\u0700-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+|[\u0600-\u06FF\/]+(\s*?[\u0600-\u06FF]+){1,2}/i
  , parseTokenTimezone = /Z|[\+\-]\d\d:?\d\d/i
  , parseTokenT = /T/i
  , parseTokenTimestampMs = /[\+\-]?\d+(\.\d{1,3})?/
  , symbolMap = {
    '1': '۱',
    '2': '۲',
    '3': '۳',
    '4': '۴',
    '5': '۵',
    '6': '۶',
    '7': '۷',
    '8': '۸',
    '9': '۹',
    '0': '۰'
  }
  , numberMap = {
    '۱': '1',
    '۲': '2',
    '۳': '3',
    '۴': '4',
    '۵': '5',
    '۶': '6',
    '۷': '7',
    '۸': '8',
    '۹': '9',
    '۰': '0'
  }


  , unitAliases =
    { jm: 'jmonth'
    , jmonths: 'jmonth'
    , jy: 'jyear'
    , jyears: 'jyear'
    }

  , formatFunctions = {}

  , ordinalizeTokens = 'DDD w M D'.split(' ')
  , paddedTokens = 'M D w'.split(' ')

  , formatTokenFunctions =
    { jM: function () {
        return this.jMonth() + 1
      }
    , jMMM: function (format) {
        return this.localeData().jMonthsShort(this, format)
      }
    , jMMMM: function (format) {
        return this.localeData().jMonths(this, format)
      }
    , jD: function () {
        return this.jDate()
      }
    , jDDD: function () {
        return this.jDayOfYear()
      }
    , jw: function () {
        return this.jWeek()
      }
    , jYY: function () {
        return leftZeroFill(this.jYear() % 100, 2)
      }
    , jYYYY: function () {
        return leftZeroFill(this.jYear(), 4)
      }
    , jYYYYY: function () {
        return leftZeroFill(this.jYear(), 5)
      }
    , jgg: function () {
        return leftZeroFill(this.jWeekYear() % 100, 2)
      }
    , jgggg: function () {
        return this.jWeekYear()
      }
    , jggggg: function () {
        return leftZeroFill(this.jWeekYear(), 5)
      }
    }

function padToken(func, count) {
  return function (a) {
    return leftZeroFill(func.call(this, a), count)
  }
}
function ordinalizeToken(func, period) {
  return function (a) {
    return this.localeData().ordinal(func.call(this, a), period)
  }
}

(function () {
  var i
  while (ordinalizeTokens.length) {
    i = ordinalizeTokens.pop()
    formatTokenFunctions['j' + i + 'o'] = ordinalizeToken(formatTokenFunctions['j' + i], i)
  }
  while (paddedTokens.length) {
    i = paddedTokens.pop()
    formatTokenFunctions['j' + i + i] = padToken(formatTokenFunctions['j' + i], 2)
  }
  formatTokenFunctions.jDDDD = padToken(formatTokenFunctions.jDDD, 3)
}())

/************************************
    Helpers
************************************/

function extend(a, b) {
  var key
  for (key in b)
    if (b.hasOwnProperty(key))
      a[key] = b[key]
  return a
}

function leftZeroFill(number, targetLength) {
  var output = number + ''
  while (output.length < targetLength)
    output = '0' + output
  return output
}

function isArray(input) {
  return Object.prototype.toString.call(input) === '[object Array]'
}

// function compareArrays(array1, array2) {
//   var len = Math.min(array1.length, array2.length)
//     , lengthDiff = Math.abs(array1.length - array2.length)
//     , diffs = 0
//     , i
//   for (i = 0; i < len; i += 1)
//     if (~~array1[i] !== ~~array2[i])
//       diffs += 1
//   return diffs + lengthDiff
// }

function normalizeUnits(units) {
  if (units) {
    var lowered = units.toLowerCase()
    units = unitAliases[lowered] || lowered
  }
  return units
}

function setDate(m, year, month, date) {
  var d = m._d
  if (m._isUTC) {
    /*eslint-disable new-cap*/
    m._d = new Date(Date.UTC(year, month, date,
        d.getUTCHours(), d.getUTCMinutes(), d.getUTCSeconds(), d.getUTCMilliseconds()))
    /*eslint-enable new-cap*/
  } else {
    m._d = new Date(year, month, date,
        d.getHours(), d.getMinutes(), d.getSeconds(), d.getMilliseconds())
  }
}

function objectCreate(parent) {
  function F() {}
  F.prototype = parent
  return new F()
}

function getPrototypeOf(object) {
  if (Object.getPrototypeOf)
    return Object.getPrototypeOf(object)
  else if (''.__proto__)
    return object.__proto__
  else
    return object.constructor.prototype
}

/************************************
    Languages
************************************/
extend(getPrototypeOf(moment.localeData()),
  { _jMonths: [ 'Farvardin'
              , 'Ordibehesht'
              , 'Khordaad'
              , 'Tir'
              , 'Amordaad'
              , 'Shahrivar'
              , 'Mehr'
              , 'Aabaan'
              , 'Aazar'
              , 'Dey'
              , 'Bahman'
              , 'Esfand'
              ]
  , jMonths: function (m) {
      return this._jMonths[m.jMonth()]
    }

  , _jMonthsShort:  [ 'Far'
                    , 'Ord'
                    , 'Kho'
                    , 'Tir'
                    , 'Amo'
                    , 'Sha'
                    , 'Meh'
                    , 'Aab'
                    , 'Aaz'
                    , 'Dey'
                    , 'Bah'
                    , 'Esf'
                    ]
  , jMonthsShort: function (m) {
      return this._jMonthsShort[m.jMonth()]
    }

  , jMonthsParse: function (monthName) {
      var i
        , mom
        , regex
      if (!this._jMonthsParse)
        this._jMonthsParse = []
      for (i = 0; i < 12; i += 1) {
        // Make the regex if we don't have it already.
        if (!this._jMonthsParse[i]) {
          mom = jMoment([2000, (2 + i) % 12, 25])
          regex = '^' + this.jMonths(mom, '') + '|^' + this.jMonthsShort(mom, '')
          this._jMonthsParse[i] = new RegExp(regex.replace('.', ''), 'i')
        }
        // Test the regex.
        if (this._jMonthsParse[i].test(monthName))
          return i
      }
    }
  }
)

/************************************
    Formatting
************************************/

function makeFormatFunction(format) {
  var array = format.match(formattingTokens)
    , length = array.length
    , i

  for (i = 0; i < length; i += 1)
    if (formatTokenFunctions[array[i]])
      array[i] = formatTokenFunctions[array[i]]

  return function (mom) {
    var output = ''
    for (i = 0; i < length; i += 1)
      output += array[i] instanceof Function ? '[' + array[i].call(mom, format) + ']' : array[i]
    return output
  }
}

/************************************
    Parsing
************************************/

function getParseRegexForToken(token, config) {
  switch (token) {
  case 'jDDDD':
    return parseTokenThreeDigits
  case 'jYYYY':
    return parseTokenFourDigits
  case 'jYYYYY':
    return parseTokenSixDigits
  case 'jDDD':
    return parseTokenOneToThreeDigits
  case 'jMMM':
  case 'jMMMM':
    return parseTokenWord
  case 'jMM':
  case 'jDD':
  case 'jYY':
  case 'jM':
  case 'jD':
    return parseTokenOneOrTwoDigits
  case 'DDDD':
    return parseTokenThreeDigits
  case 'YYYY':
    return parseTokenFourDigits
  case 'YYYYY':
    return parseTokenSixDigits
  case 'S':
  case 'SS':
  case 'SSS':
  case 'DDD':
    return parseTokenOneToThreeDigits
  case 'MMM':
  case 'MMMM':
  case 'dd':
  case 'ddd':
  case 'dddd':
    return parseTokenWord
  case 'a':
  case 'A':
    return moment.localeData(config._l)._meridiemParse
  case 'X':
    return parseTokenTimestampMs
  case 'Z':
  case 'ZZ':
    return parseTokenTimezone
  case 'T':
    return parseTokenT
  case 'MM':
  case 'DD':
  case 'YY':
  case 'HH':
  case 'hh':
  case 'mm':
  case 'ss':
  case 'M':
  case 'D':
  case 'd':
  case 'H':
  case 'h':
  case 'm':
  case 's':
    return parseTokenOneOrTwoDigits
  default:
    return new RegExp(token.replace('\\', ''))
  }
}

function addTimeToArrayFromToken(token, input, config) {
  var a
    , datePartArray = config._a

  switch (token) {
  case 'jM':
  case 'jMM':
    datePartArray[1] = input == null ? 0 : ~~input - 1
    break
  case 'jMMM':
  case 'jMMMM':
    a = moment.localeData(config._l).jMonthsParse(input)
    if (a != null)
      datePartArray[1] = a
    else
      config._isValid = false
    break
  case 'jD':
  case 'jDD':
  case 'jDDD':
  case 'jDDDD':
    if (input != null)
      datePartArray[2] = ~~input
    break
  case 'jYY':
    datePartArray[0] = ~~input + (~~input > 47 ? 1300 : 1400)
    break
  case 'jYYYY':
  case 'jYYYYY':
    datePartArray[0] = ~~input
  }
  if (input == null)
    config._isValid = false
}

function dateFromArray(config) {
  var g
    , j
    , jy = config._a[0]
    , jm = config._a[1]
    , jd = config._a[2]

  if ((jy == null) && (jm == null) && (jd == null))
    return [0, 0, 1]
  jy = jy != null ? jy : 0
  jm = jm != null ? jm : 0
  jd = jd != null ? jd : 1
  if (jd < 1 || jd > jMoment.jDaysInMonth(jy, jm) || jm < 0 || jm > 11)
    config._isValid = false
  g = toGregorian(jy, jm, jd)
  j = toJalaali(g.gy, g.gm, g.gd)
  config._jDiff = 0
  if (~~j.jy !== jy)
    config._jDiff += 1
  if (~~j.jm !== jm)
    config._jDiff += 1
  if (~~j.jd !== jd)
    config._jDiff += 1
  return [g.gy, g.gm, g.gd]
}

function makeDateFromStringAndFormat(config) {
  var tokens = config._f.match(formattingTokens)
    , string = config._i + ''
    , len = tokens.length
    , i
    , token
    , parsedInput

  config._a = []

  for (i = 0; i < len; i += 1) {
    token = tokens[i]
    parsedInput = (getParseRegexForToken(token, config).exec(string) || [])[0]
    if (parsedInput)
      string = string.slice(string.indexOf(parsedInput) + parsedInput.length)
    if (formatTokenFunctions[token])
      addTimeToArrayFromToken(token, parsedInput, config)
  }
  if (string)
    config._il = string
  return dateFromArray(config)
}

function makeDateFromStringAndArray(config, utc) {
  var len = config._f.length
    , i
    , format
    , tempMoment
    , bestMoment
    , currentScore
    , scoreToBeat

  if (len === 0) {
    return makeMoment(new Date(NaN))
  }

  for (i = 0; i < len; i += 1) {
    format = config._f[i]
    currentScore = 0
    tempMoment = makeMoment(config._i, format, config._l, config._strict, utc)

    if (!tempMoment.isValid()) continue

    // currentScore = compareArrays(tempMoment._a, tempMoment.toArray())
    currentScore += tempMoment._jDiff
    if (tempMoment._il)
      currentScore += tempMoment._il.length
    if (scoreToBeat == null || currentScore < scoreToBeat) {
      scoreToBeat = currentScore
      bestMoment = tempMoment
    }
  }

  return bestMoment
}

function removeParsedTokens(config) {
  var string = config._i + ''
    , input = ''
    , format = ''
    , array = config._f.match(formattingTokens)
    , len = array.length
    , i
    , match
    , parsed

  for (i = 0; i < len; i += 1) {
    match = array[i]
    parsed = (getParseRegexForToken(match, config).exec(string) || [])[0]
    if (parsed)
      string = string.slice(string.indexOf(parsed) + parsed.length)
    if (!(formatTokenFunctions[match] instanceof Function)) {
      format += match
      if (parsed)
        input += parsed
    }
  }
  config._i = input
  config._f = format
}

/************************************
    Week of Year
************************************/

function jWeekOfYear(mom, firstDayOfWeek, firstDayOfWeekOfYear) {
  var end = firstDayOfWeekOfYear - firstDayOfWeek
    , daysToDayOfWeek = firstDayOfWeekOfYear - mom.day()
    , adjustedMoment

  if (daysToDayOfWeek > end) {
    daysToDayOfWeek -= 7
  }
  if (daysToDayOfWeek < end - 7) {
    daysToDayOfWeek += 7
  }
  adjustedMoment = jMoment(mom).add(daysToDayOfWeek, 'd')
  return  { week: Math.ceil(adjustedMoment.jDayOfYear() / 7)
          , year: adjustedMoment.jYear()
          }
}

/************************************
    Top Level Functions
************************************/

function makeMoment(input, format, lang, strict, utc) {
  if (typeof lang === 'boolean') {
    utc = strict
    strict = lang
    lang = undefined
  }

  if (format && typeof format === 'string')
    format = fixFormat(format, moment)

  var config =
      { _i: input
      , _f: format
      , _l: lang
      , _strict: strict
      , _isUTC: utc
      }
    , date
    , m
    , jm
    , origInput = input
    , origFormat = format
  if (format) {
    if (isArray(format)) {
      return makeDateFromStringAndArray(config, utc)
    } else {
      date = makeDateFromStringAndFormat(config)
      removeParsedTokens(config)
      format = 'YYYY-MM-DD-' + config._f
      input = leftZeroFill(date[0], 4) + '-'
            + leftZeroFill(date[1] + 1, 2) + '-'
            + leftZeroFill(date[2], 2) + '-'
            + config._i
    }
  }
  if (utc)
    m = moment.utc(input, format, lang, strict)
  else
    m = moment(input, format, lang, strict)
  if (config._isValid === false)
    m._isValid = false
  m._jDiff = config._jDiff || 0
  jm = objectCreate(jMoment.fn)
  extend(jm, m)
  if (strict && jm.isValid()) {
    jm._isValid = jm.format(origFormat) === origInput
  }
  return jm
}

function jMoment(input, format, lang, strict) {
  return makeMoment(input, format, lang, strict, false)
}

extend(jMoment, moment)
jMoment.fn = objectCreate(moment.fn)

jMoment.utc = function (input, format, lang, strict) {
  return makeMoment(input, format, lang, strict, true)
}

jMoment.unix = function (input) {
  return makeMoment(input * 1000)
}

/************************************
    jMoment Prototype
************************************/

function fixFormat(format, _moment) {
  var i = 5
  var replace = function (input) {
    return _moment.localeData().longDateFormat(input) || input
  }
  while (i > 0 && localFormattingTokens.test(format)) {
    i -= 1
    format = format.replace(localFormattingTokens, replace)
  }
  return format
}

jMoment.fn.format = function (format) {

  if (format) {
    format = fixFormat(format, this)

    if (!formatFunctions[format]) {
      formatFunctions[format] = makeFormatFunction(format)
    }
    format = formatFunctions[format](this)
  }
  return moment.fn.format.call(this, format)
}

jMoment.fn.jYear = function (input) {
  var lastDay
    , j
    , g
  if (typeof input === 'number') {
    j = toJalaali(this.year(), this.month(), this.date())
    lastDay = Math.min(j.jd, jMoment.jDaysInMonth(input, j.jm))
    g = toGregorian(input, j.jm, lastDay)
    setDate(this, g.gy, g.gm, g.gd)
    moment.updateOffset(this)
    return this
  } else {
    return toJalaali(this.year(), this.month(), this.date()).jy
  }
}

jMoment.fn.jMonth = function (input) {
  var lastDay
    , j
    , g
  if (input != null) {
    if (typeof input === 'string') {
      input = this.lang().jMonthsParse(input)
      if (typeof input !== 'number')
        return this
    }
    j = toJalaali(this.year(), this.month(), this.date())
    lastDay = Math.min(j.jd, jMoment.jDaysInMonth(j.jy, input))
    this.jYear(j.jy + div(input, 12))
    input = mod(input, 12)
    if (input < 0) {
      input += 12
      this.jYear(this.jYear() - 1)
    }
    g = toGregorian(this.jYear(), input, lastDay)
    setDate(this, g.gy, g.gm, g.gd)
    moment.updateOffset(this)
    return this
  } else {
    return toJalaali(this.year(), this.month(), this.date()).jm
  }
}

jMoment.fn.jDate = function (input) {
  var j
    , g
  if (typeof input === 'number') {
    j = toJalaali(this.year(), this.month(), this.date())
    g = toGregorian(j.jy, j.jm, input)
    setDate(this, g.gy, g.gm, g.gd)
    moment.updateOffset(this)
    return this
  } else {
    return toJalaali(this.year(), this.month(), this.date()).jd
  }
}

jMoment.fn.jDayOfYear = function (input) {
  var dayOfYear = Math.round((jMoment(this).startOf('day') - jMoment(this).startOf('jYear')) / 864e5) + 1
  return input == null ? dayOfYear : this.add(input - dayOfYear, 'd')
}

jMoment.fn.jWeek = function (input) {
  var week = jWeekOfYear(this, this.localeData()._week.dow, this.localeData()._week.doy).week
  return input == null ? week : this.add((input - week) * 7, 'd')
}

jMoment.fn.jWeekYear = function (input) {
  var year = jWeekOfYear(this, this.localeData()._week.dow, this.localeData()._week.doy).year
  return input == null ? year : this.add(input - year, 'y')
}

jMoment.fn.add = function (val, units) {
  var temp
  if (units !== null && !isNaN(+units)) {
    temp = val
    val = units
    units = temp
  }
  units = normalizeUnits(units)
  if (units === 'jyear') {
    this.jYear(this.jYear() + val)
  } else if (units === 'jmonth') {
    this.jMonth(this.jMonth() + val)
  } else {
    moment.fn.add.call(this, val, units)
  }
  return this
}

jMoment.fn.subtract = function (val, units) {
  var temp
  if (units !== null && !isNaN(+units)) {
    temp = val
    val = units
    units = temp
  }
  units = normalizeUnits(units)
  if (units === 'jyear') {
    this.jYear(this.jYear() - val)
  } else if (units === 'jmonth') {
    this.jMonth(this.jMonth() - val)
  } else {
    moment.fn.subtract.call(this, val, units)
  }
  return this
}

jMoment.fn.startOf = function (units) {
  units = normalizeUnits(units)
  if (units === 'jyear' || units === 'jmonth') {
    if (units === 'jyear') {
      this.jMonth(0)
    }
    this.jDate(1)
    this.hours(0)
    this.minutes(0)
    this.seconds(0)
    this.milliseconds(0)
    return this
  } else {
    return moment.fn.startOf.call(this, units)
  }
}

jMoment.fn.endOf = function (units) {
  units = normalizeUnits(units)
  if (units === undefined || units === 'milisecond') {
    return this
  }
  return this.startOf(units).add(1, (units === 'isoweek' ? 'week' : units)).subtract(1, 'ms')
}

jMoment.fn.isSame = function (other, units) {
  units = normalizeUnits(units)
  if (units === 'jyear' || units === 'jmonth') {
    return moment.fn.isSame.call(this.startOf(units), other.startOf(units))
  }
  return moment.fn.isSame.call(this, other, units)
}

jMoment.fn.clone = function () {
  return jMoment(this)
}

jMoment.fn.jYears = jMoment.fn.jYear
jMoment.fn.jMonths = jMoment.fn.jMonth
jMoment.fn.jDates = jMoment.fn.jDate
jMoment.fn.jWeeks = jMoment.fn.jWeek

/************************************
    jMoment Statics
************************************/

jMoment.jDaysInMonth = function (year, month) {
  year += div(month, 12)
  month = mod(month, 12)
  if (month < 0) {
    month += 12
    year -= 1
  }
  if (month < 6) {
    return 31
  } else if (month < 11) {
    return 30
  } else if (jMoment.jIsLeapYear(year)) {
    return 30
  } else {
    return 29
  }
}

jMoment.jIsLeapYear = jalaali.isLeapJalaaliYear

jMoment.loadPersian = function (args) {
  var usePersianDigits =  args !== undefined && args.hasOwnProperty('usePersianDigits') ? args.usePersianDigits : false
  var dialect =  args !== undefined && args.hasOwnProperty('dialect') ? args.dialect : 'persian'
  moment.locale('fa')
  moment.updateLocale('fa'
  , { months: ('ژانویه_فوریه_مارس_آوریل_مه_ژوئن_ژوئیه_اوت_سپتامبر_اکتبر_نوامبر_دسامبر').split('_')
    , monthsShort: ('ژانویه_فوریه_مارس_آوریل_مه_ژوئن_ژوئیه_اوت_سپتامبر_اکتبر_نوامبر_دسامبر').split('_')
    , weekdays:
      {
        'persian': ('یک\u200cشنبه_دوشنبه_سه\u200cشنبه_چهارشنبه_پنج\u200cشنبه_آدینه_شنبه').split('_'),
        'persian-modern': ('یک\u200cشنبه_دوشنبه_سه\u200cشنبه_چهارشنبه_پنج\u200cشنبه_جمعه_شنبه').split('_')
      }[dialect]
    , weekdaysShort:
      {
        'persian': ('یک\u200cشنبه_دوشنبه_سه\u200cشنبه_چهارشنبه_پنج\u200cشنبه_آدینه_شنبه').split('_'),
        'persian-modern': ('یک\u200cشنبه_دوشنبه_سه\u200cشنبه_چهارشنبه_پنج\u200cشنبه_جمعه_شنبه').split('_')
      }[dialect]
    , weekdaysMin:
      {
        'persian': 'ی_د_س_چ_پ_آ_ش'.split('_'),
        'persian-modern': 'ی_د_س_چ_پ_ج_ش'.split('_')
      }[dialect]
    , longDateFormat:
      { LT: 'HH:mm'
      , L: 'jYYYY/jMM/jDD'
      , LL: 'jD jMMMM jYYYY'
      , LLL: 'jD jMMMM jYYYY LT'
      , LLLL: 'dddd، jD jMMMM jYYYY LT'
      }
    , calendar:
      { sameDay: '[امروز ساعت] LT'
      , nextDay: '[فردا ساعت] LT'
      , nextWeek: 'dddd [ساعت] LT'
      , lastDay: '[دیروز ساعت] LT'
      , lastWeek: 'dddd [ی پیش ساعت] LT'
      , sameElse: 'L'
      }
    , relativeTime:
      { future: 'در %s'
      , past: '%s پیش'
      , s: 'چند ثانیه'
      , m: '1 دقیقه'
      , mm: '%d دقیقه'
      , h: '1 ساعت'
      , hh: '%d ساعت'
      , d: '1 روز'
      , dd: '%d روز'
      , M: '1 ماه'
      , MM: '%d ماه'
      , y: '1 سال'
      , yy: '%d سال'
      }
    , preparse: function (string) {
        if (usePersianDigits) {
          return string.replace(/[۰-۹]/g, function (match) {
            return numberMap[match]
          }).replace(/،/g, ',')
        }
        return string
    }
    , postformat: function (string) {
        if (usePersianDigits) {
          return string.replace(/\d/g, function (match) {
            return symbolMap[match]
          }).replace(/,/g, '،')
        }
        return string
    }
    , ordinal: '%dم'
    , week:
      { dow: 6 // Saturday is the first day of the week.
      , doy: 12 // The week that contains Jan 1st is the first week of the year.
      }
    , meridiem: function (hour) {
        return hour < 12 ? 'ق.ظ' : 'ب.ظ'
      }
    , jMonths:
      {
        'persian': ('فروردین_اردیبهشت_خرداد_تیر_امرداد_شهریور_مهر_آبان_آذر_دی_بهمن_اسفند').split('_'),
        'persian-modern': ('فروردین_اردیبهشت_خرداد_تیر_مرداد_شهریور_مهر_آبان_آذر_دی_بهمن_اسفند').split('_')
      }[dialect]
    , jMonthsShort:
      {
        'persian': 'فرو_ارد_خرد_تیر_امر_شهر_مهر_آبا_آذر_دی_بهم_اسف'.split('_'),
        'persian-modern': 'فرو_ارد_خرد_تیر_مرد_شهر_مهر_آبا_آذر_دی_بهم_اسف'.split('_')
      }[dialect]
    }
  )
}

jMoment.jConvert =  { toJalaali: toJalaali
                    , toGregorian: toGregorian
                    }

/************************************
    Jalaali Conversion
************************************/

function toJalaali(gy, gm, gd) {
  var j = jalaali.toJalaali(gy, gm + 1, gd)
  j.jm -= 1
  return j
}

function toGregorian(jy, jm, jd) {
  var g = jalaali.toGregorian(jy, jm + 1, jd)
  g.gm -= 1
  return g
}

/*
  Utility helper functions.
*/

function div(a, b) {
  return ~~(a / b)
}

function mod(a, b) {
  return a - ~~(a / b) * b
}
});

if (typeof exports == "object") {
  module.exports = require("moment-jalaali");
} else if (typeof define == "function" && define.amd) {
  define([], function(){ return require("moment-jalaali"); });
} else {
  this["moment"] = require("moment-jalaali");
}
})();


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

/**
 * @ngdoc action-group
 * @name User
 * @description Global user menu
 * 
 * There are several registred menu in the $actions service. Modules can contribute
 * to the dashbord by addin action into it.
 * 
 * - mb.user : All action related to the current user
 * - mb.toolbar.menu : All action related to the toolbar menu
 * 
 * - navigationPathMenu: All items related to navigation.
 * 
 */


angular.module('mblowfish-core', [ //
//	Angular
	'ngMaterial', 
	'ngAnimate', 
	'ngCookies',
	'ngSanitize', //
	'ngRoute',
//	Seen
	'seen-core',
	'seen-user',
	'seen-tenant',
	'seen-cms',
	'seen-monitor',
//	AM-WB
	'am-wb-core', 
//	Others
	'lfNgMdFileInput', // https://github.com/shuyu/angular-material-fileinput
	'vcRecaptcha', //https://github.com/VividCortex/angular-recaptcha
	'ng-appcache',//
	'ngFileSaver',//
	'mdSteppers',//
	'angular-material-persian-datepicker',
	'ngStorage', // https://github.com/gsklee/ngStorage
	'pascalprecht.translate',
	'mdColorPicker',
])
.run(function instantiateRoute($widget, $routeParams) {
	$widget.setProvider('$routeParams', $routeParams);
})

/*******************************************************
 * Compatibility with old version
 *******************************************************/ 
.factory('Action', function (MbAction) {
	return MbAction;
})
.factory('ActionGroup', function (MbActionGroup) {
	return MbActionGroup;
})
.factory('httpRequestInterceptor', function (MbHttpRequestInterceptor) {
	return MbHttpRequestInterceptor;
})
.controller('MessagesCtrl', function ($scope, $controller) {
    angular.extend(this, $controller('MbSeenUserMessagesCtrl', {
        $scope : $scope
    }));
})
.controller('AmWbSeenCmsContentsCtrl', function ($scope, $controller) {
    angular.extend(this, $controller('MbSeenCmsContentsCtrl', {
        $scope : $scope
    }));
})

;

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


angular.module('mblowfish-core').config(function($httpProvider) {
	// An interceptor to handle errors of server response
	// All that the interceptor does is in 'httpRequestInterceptor' factory.
	$httpProvider.interceptors.push('MbHttpRequestInterceptor');

	/*
	 * Disabling AngularJS $http cache
	 * @see https://stackoverflow.com/questions/38196452/disabling-angularjs-http-cache
	 */
	//initialize get if not there
	if (!$httpProvider.defaults.headers.get) {
		$httpProvider.defaults.headers.get = {};
	}

	// Answer edited to include suggestions from comments
	// because previous version of code introduced browser-related errors

	//disable IE ajax request caching
	$httpProvider.defaults.headers.get['If-Modified-Since'] = 'Mon, 26 Jul 1997 05:00:00 GMT';
	// extra
	$httpProvider.defaults.headers.get['Cache-Control'] = 'no-cache';
	$httpProvider.defaults.headers.get['Pragma'] = 'no-cache';
});

/* 
 * The MIT License (MIT)
 * 
 * Copyright (c) 2016 weburger
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


/**
 * @ngdoc module
 * @name ngDonate
 * @description Defines icons to use every where.
 *
 */
angular.module('mblowfish-core')
.config(function(wbIconServiceProvider) {
	wbIconServiceProvider


	/*
	 * Material Design Icons
	 * (http://materialdesignicons.com)
	 */
	.addShapes({
		'amazon': '<path d="M13.23 10.56V10c-1.94 0-3.99.39-3.99 2.67 0 1.16.61 1.95 1.63 1.95.76 0 1.43-.47 1.86-1.22.52-.93.5-1.8.5-2.84m2.7 6.53c-.18.16-.43.17-.63.06-.89-.74-1.05-1.08-1.54-1.79-1.47 1.5-2.51 1.95-4.42 1.95-2.25 0-4.01-1.39-4.01-4.17 0-2.18 1.17-3.64 2.86-4.38 1.46-.64 3.49-.76 5.04-.93V7.5c0-.66.05-1.41-.33-1.96-.32-.49-.95-.7-1.5-.7-1.02 0-1.93.53-2.15 1.61-.05.24-.25.48-.47.49l-2.6-.28c-.22-.05-.46-.22-.4-.56.6-3.15 3.45-4.1 6-4.1 1.3 0 3 .35 4.03 1.33C17.11 4.55 17 6.18 17 7.95v4.17c0 1.25.5 1.81 1 2.48.17.25.21.54 0 .71l-2.06 1.78h-.01"/><path d="M20.16 19.54C18 21.14 14.82 22 12.1 22c-3.81 0-7.25-1.41-9.85-3.76-.2-.18-.02-.43.25-.29 2.78 1.63 6.25 2.61 9.83 2.61 2.41 0 5.07-.5 7.51-1.53.37-.16.66.24.32.51"/><path d="M21.07 18.5c-.28-.36-1.85-.17-2.57-.08-.19.02-.22-.16-.03-.3 1.24-.88 3.29-.62 3.53-.33.24.3-.07 2.35-1.24 3.32-.18.16-.35.07-.26-.11.26-.67.85-2.14.57-2.5z"/>',
		'apple': '<path d="M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83"/>',
		'facebook-box': '<path d="M19 4v3h-2a1 1 0 0 0-1 1v2h3v3h-3v7h-3v-7h-2v-3h2V7.5C13 5.56 14.57 4 16.5 4M20 2H4a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V4c0-1.11-.9-2-2-2z"/>',
		'facebook-messenger': '<path d="M12 2C6.5 2 2 6.14 2 11.25c0 2.88 1.42 5.45 3.65 7.15l.06 3.6 3.45-1.88-.03-.01c.91.25 1.87.39 2.87.39 5.5 0 10-4.14 10-9.25S17.5 2 12 2m1.03 12.41l-2.49-2.63-5.04 2.63 5.38-5.63 2.58 2.47 4.85-2.47-5.28 5.63z"/>',
		'facebook': '<path d="M17 2v4h-2c-.69 0-1 .81-1 1.5V10h3v4h-3v8h-4v-8H7v-4h3V6a4 4 0 0 1 4-4h3z"/>',
		'github-box': '<path d="M4 2h16a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2h-5.15c-.35-.08-.35-.76-.35-1v-2.74c0-.93-.33-1.54-.69-1.85 2.23-.25 4.57-1.09 4.57-4.91 0-1.11-.38-2-1.03-2.71.1-.25.45-1.29-.1-2.64 0 0-.84-.27-2.75 1.02-.79-.22-1.65-.33-2.5-.33-.85 0-1.71.11-2.5.33-1.91-1.29-2.75-1.02-2.75-1.02-.55 1.35-.2 2.39-.1 2.64-.65.71-1.03 1.6-1.03 2.71 0 3.81 2.33 4.67 4.55 4.92-.28.25-.54.69-.63 1.34-.57.24-2.04.69-2.91-.83 0 0-.53-.96-1.53-1.03 0 0-.98-.02-.1.6 0 0 .68.31 1.14 1.47 0 0 .59 1.94 3.36 1.34V21c0 .24 0 .92-.36 1H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z"/>',
		'github-circle': '<path d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2z"/>',
		'google-plus-box': '<path d="M20 2H4a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V4c0-1.11-.9-2-2-2M9.07 19.2C6.27 19.2 5 17.64 5 16.18c0-.45.14-1.59 1.5-2.38.75-.47 1.83-.8 3.12-.91-.19-.25-.34-.55-.34-.99 0-.15.02-.31.06-.46h-.39C7 11.44 5.8 9.89 5.8 8.39c0-1.73 1.29-3.59 4.11-3.59h4.22l-.34.34-.71.71-.08.06h-.7c.41.42.9 1.09.9 2.16 0 1.4-.74 2.09-1.56 2.73-.14.12-.42.38-.42.7 0 .32.24.5.39.64.13.11.29.22.47.36.81.55 1.92 1.33 1.92 2.86 0 1.77-1.29 3.84-4.93 3.84M19 12h-2v2h-1v-2h-2v-1h2V9h1v2h2"/><path d="M10.57 13.81c-.11-.01-.19-.01-.32-.01h-.02c-.26 0-1.15.05-1.82.27-.64.24-1.41.72-1.41 1.7C7 16.85 8.04 18 9.96 18c1.54 0 2.44-1 2.44-2 0-.75-.46-1.21-1.83-2.19"/><path d="M11.2 8.87c0-1.02-.63-3.02-2.08-3.02-.62 0-1.32.44-1.32 1.65 0 1.2.62 2.95 1.97 2.95.06 0 1.43-.01 1.43-1.58z"/>',
		'google-plus': '<path d="M13.3 13.45l-1.08-.85c-.36-.3-.82-.69-.82-1.42s.55-1.29.97-1.62c1.31-1.02 2.57-2.1 2.57-4.34 0-2.07-1.27-3.26-2.04-3.92h1.75L15.9.05H9.67c-4.36 0-6.6 2.71-6.6 5.72 0 2.33 1.79 4.83 4.98 4.83h.8c-.13.35-.35.84-.35 1.3 0 1.01.42 1.43.92 2-1.42.1-4.01.43-5.92 1.6-1.86 1.1-2.3 2.63-2.3 3.75 0 2.3 2.06 4.5 6.57 4.5 5.35 0 8.03-2.96 8.03-5.88 0-2.16-1.13-3.27-2.5-4.42M5.65 4.31c0-2.21 1.31-3.21 2.69-3.21 2.66 0 4.01 3.45 4.01 5.53 0 2.57-2.07 3.07-2.89 3.07C7 9.7 5.65 6.64 5.65 4.31M9.3 22.3c-3.33 0-5.45-1.49-5.45-3.7 0-2.2 1.96-2.91 2.65-3.16 1.3-.44 3-.49 3.27-.49.3 0 .46 0 .73.02 2.34 1.69 3.35 2.44 3.35 4.03 0 1.77-1.82 3.3-4.55 3.3"/><path d="M21 10V7h-2v3h-3v2h3v3h2v-3h3v-2h-3z"/>',
		'hangouts': '<path d="M15 11l-1 2h-1.5l1-2H12V8h3m-4 3l-1 2H8.5l1-2H8V8h3m.5-6A8.5 8.5 0 0 0 3 10.5a8.5 8.5 0 0 0 8.5 8.5h.5v3.5c4.86-2.35 8-7.5 8-12C20 5.8 16.19 2 11.5 2z"/>',
		'linkedin-box': '<path d="M19 19h-3v-5.3a1.5 1.5 0 0 0-1.5-1.5 1.5 1.5 0 0 0-1.5 1.5V19h-3v-9h3v1.2c.5-.84 1.59-1.4 2.5-1.4a3.5 3.5 0 0 1 3.5 3.5M6.5 8.31c-1 0-1.81-.81-1.81-1.81A1.81 1.81 0 0 1 6.5 4.69c1 0 1.81.81 1.81 1.81A1.81 1.81 0 0 1 6.5 8.31M8 19H5v-9h3m12-8H4c-1.11 0-2 .89-2 2v16a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V4c0-1.11-.9-2-2-2z"/>',
		'linkedin': '<path d="M21 21h-4v-6.75c0-1.06-1.19-1.94-2.25-1.94S13 13.19 13 14.25V21H9V9h4v2c.66-1.07 2.36-1.76 3.5-1.76 2.5 0 4.5 2.04 4.5 4.51V21"/><path d="M7 21H3V9h4v12"/><path d="M5 3a2 2 0 0 1 2 2 2 2 0 0 1-2 2 2 2 0 0 1-2-2 2 2 0 0 1 2-2z"/>',
		'login': '<path d="M10 17.25V14H3v-4h7V6.75L15.25 12 10 17.25"/><path d="M8 2h9a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2v-4h2v4h9V4H8v4H6V4a2 2 0 0 1 2-2z"/>',
		'logout': '<path d="M17 17.25V14h-7v-4h7V6.75L22.25 12 17 17.25"/><path d="M13 2a2 2 0 0 1 2 2v4h-2V4H4v16h9v-4h2v4a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9z"/>',
		'office': '<path d="M3 18l4-1.25V7l7-2v14.5L3.5 18.25 14 22l6-1.25V3.5L13.95 2 3 5.75V18z"/>',
		'twitter': '<path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21-.36.1-.74.15-1.13.15-.27 0-.54-.03-.8-.08.54 1.69 2.11 2.95 4 2.98-1.46 1.16-3.31 1.84-5.33 1.84-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z"/>',
		'whatsapp': '<path d="M16.75 13.96c.25.13.41.2.46.3.06.11.04.61-.21 1.18-.2.56-1.24 1.1-1.7 1.12-.46.02-.47.36-2.96-.73-2.49-1.09-3.99-3.75-4.11-3.92-.12-.17-.96-1.38-.92-2.61.05-1.22.69-1.8.95-2.04.24-.26.51-.29.68-.26h.47c.15 0 .36-.06.55.45l.69 1.87c.06.13.1.28.01.44l-.27.41-.39.42c-.12.12-.26.25-.12.5.12.26.62 1.09 1.32 1.78.91.88 1.71 1.17 1.95 1.3.24.14.39.12.54-.04l.81-.94c.19-.25.35-.19.58-.11l1.67.88"/><path d="M12 4a8 8 0 0 0-8 8c0 1.72.54 3.31 1.46 4.61L4.5 19.5l2.89-.96C8.69 19.46 10.28 20 12 20a8 8 0 0 0 8-8 8 8 0 0 0-8-8zm0-2a10 10 0 0 1 10 10 10 10 0 0 1-10 10c-1.97 0-3.8-.57-5.35-1.55L2 22l1.55-4.65C2.57 15.8 2 13.97 2 12A10 10 0 0 1 12 2"/>',
		'windows': '<path d="M3 12V6.75l6-1.32v6.48L3 12"/><path d="M20 3v8.75l-10 .15V5.21L20 3"/><path d="M3 13l6 .09v6.81l-6-1.15V13"/><path d="M20 13.25V22l-10-1.91V13.1l10 .15z"/>',
	})

	/*
	 * Google Material Design Icons
	 * (https://www.google.com/design/icons)
	 */
	.addShapes({
		//
		// action
		//
		'3d_rotation': '<path d="M7.52 21.48C4.25 19.94 1.91 16.76 1.55 13H.05C.56 19.16 5.71 24 12 24l.66-.03-3.81-3.81-1.33 1.32z"/><path d="M16.57 12.2c0 .42-.05.79-.14 1.13-.1.33-.24.62-.43.85-.19.23-.43.41-.71.53-.29.12-.62.18-.99.18h-.91V9.12h.97c.72 0 1.27.23 1.64.69.38.46.57 1.12.57 1.99v.4zm.39-3.16c-.32-.33-.7-.59-1.14-.77-.43-.18-.92-.27-1.46-.27H12v8h2.3c.55 0 1.06-.09 1.51-.27.45-.18.84-.43 1.16-.76.32-.33.57-.73.74-1.19.17-.47.26-.99.26-1.57v-.4c0-.58-.09-1.1-.26-1.57-.18-.47-.43-.87-.75-1.2zm-8.55 5.92c-.19 0-.37-.03-.52-.08-.16-.06-.29-.13-.4-.24-.11-.1-.2-.22-.26-.37-.06-.14-.09-.3-.09-.47h-1.3c0 .36.07.68.21.95.14.27.33.5.56.69.24.18.51.32.82.41.3.1.62.15.96.15.37 0 .72-.05 1.03-.15.32-.1.6-.25.83-.44.23-.19.42-.43.55-.72.13-.29.2-.61.2-.97 0-.19-.02-.38-.07-.56-.05-.18-.12-.35-.23-.51-.1-.16-.24-.3-.4-.43-.17-.13-.37-.23-.61-.31.2-.09.37-.2.52-.33.15-.13.27-.27.37-.42.1-.15.17-.3.22-.46.05-.16.07-.32.07-.48 0-.36-.06-.68-.18-.96-.12-.28-.29-.51-.51-.69-.2-.19-.47-.33-.77-.43C9.1 8.05 8.76 8 8.39 8c-.36 0-.69.05-1 .16-.3.11-.57.26-.79.45-.21.19-.38.41-.51.67-.12.26-.18.54-.18.85h1.3c0-.17.03-.32.09-.45s.14-.25.25-.34c.11-.09.23-.17.38-.22.15-.05.3-.08.48-.08.4 0 .7.1.89.31.19.2.29.49.29.86 0 .18-.03.34-.08.49-.05.15-.14.27-.25.37-.11.1-.25.18-.41.24-.16.06-.36.09-.58.09H7.5v1.03h.77c.22 0 .42.02.6.07s.33.13.45.23c.12.11.22.24.29.4.07.16.1.35.1.57 0 .41-.12.72-.35.93-.23.23-.55.33-.95.33z"/><path d="M12 0l-.66.03 3.81 3.81 1.33-1.33c3.27 1.55 5.61 4.72 5.96 8.48h1.5C23.44 4.84 18.29 0 12 0z"/>',
		'accessibility': '<path d="M12 2c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2z"/><path d="M21 9h-6v13h-2v-6h-2v6H9V9H3V7h18v2z"/>',
		'accessible': '<circle cx="12" cy="4" r="2"/><path d="M19 13v-2c-1.54.02-3.09-.75-4.07-1.83l-1.29-1.43c-.17-.19-.38-.34-.61-.45-.01 0-.01-.01-.02-.01H13c-.35-.2-.75-.3-1.19-.26C10.76 7.11 10 8.04 10 9.09V15c0 1.1.9 2 2 2h5v5h2v-5.5c0-1.1-.9-2-2-2h-3v-3.45c1.29 1.07 3.25 1.94 5 1.95zm-6.17 5c-.41 1.16-1.52 2-2.83 2-1.66 0-3-1.34-3-3 0-1.31.84-2.41 2-2.83V12.1c-2.28.46-4 2.48-4 4.9 0 2.76 2.24 5 5 5 2.42 0 4.44-1.72 4.9-4h-2.07z"/>',
		'account_balance': '<path d="M4 10v7h3v-7H4z"/><path d="M10 10v7h3v-7h-3z"/><path d="M2 22h19v-3H2v3z"/><path d="M16 10v7h3v-7h-3z"/><path d="M11.5 1L2 6v2h19V6l-9.5-5z"/>',
		'account_balance_wallet': '<path d="M21 18v1c0 1.1-.9 2-2 2H5c-1.11 0-2-.9-2-2V5c0-1.1.89-2 2-2h14c1.1 0 2 .9 2 2v1h-9c-1.11 0-2 .9-2 2v8c0 1.1.89 2 2 2h9z"/><path d="M16 13.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM12 16h10V8H12v8z"/>',
		'account_box': '<path d="M3 5v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2H5c-1.11 0-2 .9-2 2zm12 4c0 1.66-1.34 3-3 3s-3-1.34-3-3 1.34-3 3-3 3 1.34 3 3zm-9 8c0-2 4-3.1 6-3.1s6 1.1 6 3.1v1H6v-1z"/>',
		'account_circle': '<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/>',
		'add_shopping_cart': '<path d="M11 9h2V6h3V4h-3V1h-2v3H8v2h3v3z"/><path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2z"/><path d="M17 18c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z"/><path d="M7.17 14.75l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.86-7.01L19.42 4h-.01l-1.1 2-2.76 5H8.53l-.13-.27L6.16 6l-.95-2-.94-2H1v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.13 0-.25-.11-.25-.25z"/>',
		'alarm': '<path d="M22 5.72l-4.6-3.86-1.29 1.53 4.6 3.86L22 5.72z"/><path d="M7.88 3.39L6.6 1.86 2 5.71l1.29 1.53 4.59-3.85z"/><path d="M12.5 8H11v6l4.75 2.85.75-1.23-4-2.37V8z"/><path d="M12 20c-3.87 0-7-3.13-7-7s3.13-7 7-7 7 3.13 7 7-3.13 7-7 7zm0-16c-4.97 0-9 4.03-9 9s4.02 9 9 9c4.97 0 9-4.03 9-9s-4.03-9-9-9z"/>',
		'alarm_add': '<path d="M7.88 3.39L6.6 1.86 2 5.71l1.29 1.53 4.59-3.85z"/><path d="M22 5.72l-4.6-3.86-1.29 1.53 4.6 3.86L22 5.72z"/><path d="M12 20c-3.87 0-7-3.13-7-7s3.13-7 7-7 7 3.13 7 7-3.13 7-7 7zm0-16c-4.97 0-9 4.03-9 9s4.02 9 9 9c4.97 0 9-4.03 9-9s-4.03-9-9-9z"/><path d="M13 9h-2v3H8v2h3v3h2v-3h3v-2h-3V9z"/>',
		'alarm_off': '<path d="M12 6c3.87 0 7 3.13 7 7 0 .84-.16 1.65-.43 2.4l1.52 1.52c.58-1.19.91-2.51.91-3.92a9 9 0 0 0-9-9c-1.41 0-2.73.33-3.92.91L9.6 6.43C10.35 6.16 11.16 6 12 6z"/><path d="M22 5.72l-4.6-3.86-1.29 1.53 4.6 3.86L22 5.72z"/><path d="M16.47 18.39C15.26 19.39 13.7 20 12 20c-3.87 0-7-3.13-7-7 0-1.7.61-3.26 1.61-4.47l9.86 9.86zM2.92 2.29L1.65 3.57 2.98 4.9l-1.11.93 1.42 1.42 1.11-.94.8.8A8.964 8.964 0 0 0 3 13c0 4.97 4.02 9 9 9 2.25 0 4.31-.83 5.89-2.2l2.2 2.2 1.27-1.27L3.89 3.27l-.97-.98z"/><path d="M8.02 3.28L6.6 1.86l-.86.71 1.42 1.42.86-.71z"/>',
		'alarm_on': '<path d="M22 5.72l-4.6-3.86-1.29 1.53 4.6 3.86L22 5.72z"/><path d="M7.88 3.39L6.6 1.86 2 5.71l1.29 1.53 4.59-3.85z"/><path d="M12 20c-3.87 0-7-3.13-7-7s3.13-7 7-7 7 3.13 7 7-3.13 7-7 7zm0-16c-4.97 0-9 4.03-9 9s4.02 9 9 9c4.97 0 9-4.03 9-9s-4.03-9-9-9z"/><path d="M10.54 14.53L8.41 12.4l-1.06 1.06 3.18 3.18 6-6-1.06-1.06-4.93 4.95z"/>',
		'all_out': '<path d="M16.21 4.16l4 4v-4z"/><path d="M20.21 16.16l-4 4h4z"/><path d="M8.21 20.16l-4-4v4z"/><path d="M4.21 8.16l4-4h-4z"/><path d="M16.06 16.01a5.438 5.438 0 0 1-7.7 0 5.438 5.438 0 0 1 0-7.7 5.438 5.438 0 0 1 7.7 0 5.438 5.438 0 0 1 0 7.7zm1.1-8.8a7.007 7.007 0 0 0-9.9 0 7.007 7.007 0 0 0 0 9.9 7.007 7.007 0 0 0 9.9 0c2.73-2.73 2.73-7.16 0-9.9z"/>',
		'android': '<path d="M6 18c0 .55.45 1 1 1h1v3.5c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5V19h2v3.5c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5V19h1c.55 0 1-.45 1-1V8H6v10z"/><path d="M3.5 8C2.67 8 2 8.67 2 9.5v7c0 .83.67 1.5 1.5 1.5S5 17.33 5 16.5v-7C5 8.67 4.33 8 3.5 8z"/><path d="M20.5 8c-.83 0-1.5.67-1.5 1.5v7c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5v-7c0-.83-.67-1.5-1.5-1.5z"/><path d="M15 5h-1V4h1v1zm-5 0H9V4h1v1zm5.53-2.84l1.3-1.3c.2-.2.2-.51 0-.71-.2-.2-.51-.2-.71 0l-1.48 1.48C13.85 1.23 12.95 1 12 1c-.96 0-1.86.23-2.66.63L7.85.15c-.2-.2-.51-.2-.71 0-.2.2-.2.51 0 .71l1.31 1.31C6.97 3.26 6 5.01 6 7h12c0-1.99-.97-3.75-2.47-4.84z"/>',
		'announcement': '<path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-7 9h-2V5h2v6zm0 4h-2v-2h2v2z"/>',
		'aspect_ratio': '<path d="M19 12h-2v3h-3v2h5v-5z"/><path d="M7 9h3V7H5v5h2V9z"/><path d="M21 19.01H3V4.99h18v14.02zM21 3H3c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z"/>',
		'assessment': '<path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"/>',
		'assignment': '<path d="M19 3h-4.18C14.4 1.84 13.3 1 12 1c-1.3 0-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm2 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>',
		'assignment_ind': '<path d="M19 3h-4.18C14.4 1.84 13.3 1 12 1c-1.3 0-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm0 4c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm6 12H6v-1.4c0-2 4-3.1 6-3.1s6 1.1 6 3.1V19z"/>',
		'assignment_late': '<path d="M19 3h-4.18C14.4 1.84 13.3 1 12 1c-1.3 0-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-6 15h-2v-2h2v2zm0-4h-2V8h2v6zm-1-9c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1z"/>',
		'assignment_return': '<path d="M19 3h-4.18C14.4 1.84 13.3 1 12 1c-1.3 0-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm4 12h-4v3l-5-5 5-5v3h4v4z"/>',
		'assignment_returned': '<path d="M19 3h-4.18C14.4 1.84 13.3 1 12 1c-1.3 0-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm0 15l-5-5h3V9h4v4h3l-5 5z"/>',
		'assignment_turned_in': '<path d="M19 3h-4.18C14.4 1.84 13.3 1 12 1c-1.3 0-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm-2 14l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z"/>',
		'autorenew': '<path d="M12 6v3l4-4-4-4v3c-4.42 0-8 3.58-8 8 0 1.57.46 3.03 1.24 4.26L6.7 14.8c-.45-.83-.7-1.79-.7-2.8 0-3.31 2.69-6 6-6z"/><path d="M18.76 7.74L17.3 9.2c.44.84.7 1.79.7 2.8 0 3.31-2.69 6-6 6v-3l-4 4 4 4v-3c4.42 0 8-3.58 8-8 0-1.57-.46-3.03-1.24-4.26z"/>',
		'backup': '<path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM14 13v4h-4v-4H7l5-5 5 5h-3z"/>',
		'book': '<path d="M18 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 4h5v8l-2.5-1.5L6 12V4z"/>',
		'bookmark': '<path d="M17 3H7c-1.1 0-1.99.9-1.99 2L5 21l7-3 7 3V5c0-1.1-.9-2-2-2z"/>',
		'bookmark_outline': '<path d="M17 3H7c-1.1 0-1.99.9-1.99 2L5 21l7-3 7 3V5c0-1.1-.9-2-2-2zm0 15l-5-2.18L7 18V5h10v13z"/>',
		'bug_report': '<path d="M20 8h-2.81c-.45-.78-1.07-1.45-1.82-1.96L17 4.41 15.59 3l-2.17 2.17C12.96 5.06 12.49 5 12 5c-.49 0-.96.06-1.41.17L8.41 3 7 4.41l1.62 1.63C7.88 6.55 7.26 7.22 6.81 8H4v2h2.09c-.05.33-.09.66-.09 1v1H4v2h2v1c0 .34.04.67.09 1H4v2h2.81c1.04 1.79 2.97 3 5.19 3s4.15-1.21 5.19-3H20v-2h-2.09c.05-.33.09-.66.09-1v-1h2v-2h-2v-1c0-.34-.04-.67-.09-1H20V8zm-6 8h-4v-2h4v2zm0-4h-4v-2h4v2z"/>',
		'build': '<path d="M22.7 19l-9.1-9.1c.9-2.3.4-5-1.5-6.9-2-2-5-2.4-7.4-1.3L9 6 6 9 1.6 4.7C.4 7.1.9 10.1 2.9 12.1c1.9 1.9 4.6 2.4 6.9 1.5l9.1 9.1c.4.4 1 .4 1.4 0l2.3-2.3c.5-.4.5-1.1.1-1.4z"/>',
		'cached': '<path d="M19 8l-4 4h3c0 3.31-2.69 6-6 6-1.01 0-1.97-.25-2.8-.7l-1.46 1.46C8.97 19.54 10.43 20 12 20c4.42 0 8-3.58 8-8h3l-4-4z"/><path d="M6 12c0-3.31 2.69-6 6-6 1.01 0 1.97.25 2.8.7l1.46-1.46C15.03 4.46 13.57 4 12 4c-4.42 0-8 3.58-8 8H1l4 4 4-4H6z"/>',
		'camera_enhanced': '<path d="M9 3L7.17 5H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2h-3.17L15 3H9zm3 15c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5z"/> <path d="M12 17l1.25-2.75L16 13l-2.75-1.25L12 9l-1.25 2.75L8 13l2.75 1.25z"/>',
		'card_giftcard': '<path d="M20 6h-2.18c.11-.31.18-.65.18-1 0-1.66-1.34-3-3-3-1.05 0-1.96.54-2.5 1.35l-.5.67-.5-.68C10.96 2.54 10.05 2 9 2 7.34 2 6 3.34 6 5c0 .35.07.69.18 1H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-5-2c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zM9 4c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm11 15H4v-2h16v2zm0-5H4V8h5.08L7 10.83 8.62 12 11 8.76l1-1.36 1 1.36L15.38 12 17 10.83 14.92 8H20v6z"/>',
		'card_membership': '<path d="M20 2H4c-1.11 0-2 .89-2 2v11c0 1.11.89 2 2 2h4v5l4-2 4 2v-5h4c1.11 0 2-.89 2-2V4c0-1.11-.89-2-2-2zm0 13H4v-2h16v2zm0-5H4V4h16v6z"/>',
		'card_travel': '<path d="M20 6h-3V4c0-1.11-.89-2-2-2H9c-1.11 0-2 .89-2 2v2H4c-1.11 0-2 .89-2 2v11c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zM9 4h6v2H9V4zm11 15H4v-2h16v2zm0-5H4V8h3v2h2V8h6v2h2V8h3v6z"/>',
		'change_history': '<path d="M12 7.77L18.39 18H5.61L12 7.77M12 4L2 20h20L12 4z"/>',
		'check_circle': '<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>',
		'chrome_reader_mode': '<path d="M13 12h7v1.5h-7z"/><path d="M13 9.5h7V11h-7z"/><path d="M13 14.5h7V16h-7z"/><path d="M21 19h-9V6h9v13zm0-15H3c-1.1 0-2 .9-2 2v13c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2z"/>',
		'class': '<path d="M18 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 4h5v8l-2.5-1.5L6 12V4z"/>',
		'code': '<path d="M9.4 16.6L4.8 12l4.6-4.6L8 6l-6 6 6 6 1.4-1.4z"/><path d="M14.6 16.6l4.6-4.6-4.6-4.6L16 6l6 6-6 6-1.4-1.4z"/>',
		'compare_arrows': '<path d="M9.01 14H2v2h7.01v3L13 15l-3.99-4v3z"/><path d="M14.99 13v-3H22V8h-7.01V5L11 9l3.99 4z"/>',
		'copyright': '<path d="M10.08 10.86c.05-.33.16-.62.3-.87.14-.25.34-.46.59-.62.24-.15.54-.22.91-.23.23.01.44.05.63.13.2.09.38.21.52.36s.25.33.34.53c.09.2.13.42.14.64h1.79c-.02-.47-.11-.9-.28-1.29-.17-.39-.4-.73-.7-1.01-.3-.28-.66-.5-1.08-.66-.42-.16-.88-.23-1.39-.23-.65 0-1.22.11-1.7.34-.48.23-.88.53-1.2.92-.32.39-.56.84-.71 1.36-.15.52-.24 1.06-.24 1.64v.27c0 .58.08 1.12.23 1.64.15.52.39.97.71 1.35.32.38.72.69 1.2.91.48.22 1.05.34 1.7.34.47 0 .91-.08 1.32-.23.41-.15.77-.36 1.08-.63.31-.27.56-.58.74-.94.18-.36.29-.74.3-1.15h-1.79c-.01.21-.06.4-.15.58-.09.18-.21.33-.36.46s-.32.23-.52.3c-.19.07-.39.09-.6.1-.36-.01-.66-.08-.89-.23a1.75 1.75 0 0 1-.59-.62c-.14-.25-.25-.55-.3-.88a6.74 6.74 0 0 1-.08-1v-.27c0-.35.03-.68.08-1.01z"/><path d="M12 20c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm0-18C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"/>',
		'credit_card': '<path d="M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z"/>',
		'dashboard': '<path d="M3 13h8V3H3v10z"/><path d="M3 21h8v-6H3v6z"/><path d="M13 21h8V11h-8v10z"/><path d="M13 3v6h8V3h-8z"/>',
		'date_range': '<path d="M9 11H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2zm2-7h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V9h14v11z"/>',
		'delete': '<path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12z"/><path d="M19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>',
		'delete_forever': '<path d="M8.46 11.88l1.41-1.41L12 12.59l2.12-2.12 1.41 1.41L13.41 14l2.12 2.12-1.41 1.41L12 15.41l-2.12 2.12-1.41-1.41L10.59 14l-2.13-2.12zM6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12z"/><path d="M15.5 4l-1-1h-5l-1 1H5v2h14V4z"/>',
		'description': '<path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/>',
		'dns': '<path d="M7 19c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm13-6H4c-.55 0-1 .45-1 1v6c0 .55.45 1 1 1h16c.55 0 1-.45 1-1v-6c0-.55-.45-1-1-1z"/><path d="M7 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm13-6H4c-.55 0-1 .45-1 1v6c0 .55.45 1 1 1h16c.55 0 1-.45 1-1V4c0-.55-.45-1-1-1z"/>',
		'done': '<path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>',
		'done_all': '<path d="M18 7l-1.41-1.41-6.34 6.34 1.41 1.41L18 7z"/><path d="M22.24 5.59L11.66 16.17 7.48 12l-1.41 1.41L11.66 19l12-12-1.42-1.41z"/><path d="M.41 13.41L6 19l1.41-1.41L1.83 12 .41 13.41z"/>',
		'donut_large': '<path d="M11 5.08V2c-5 .5-9 4.81-9 10s4 9.5 9 10v-3.08c-3-.48-6-3.4-6-6.92s3-6.44 6-6.92z"/><path d="M18.97 11H22c-.47-5-4-8.53-9-9v3.08C16 5.51 18.54 8 18.97 11z"/><path d="M13 18.92V22c5-.47 8.53-4 9-9h-3.03c-.43 3-2.97 5.49-5.97 5.92z"/>',
		'donut_small': '<path d="M11 9.16V2c-5 .5-9 4.79-9 10s4 9.5 9 10v-7.16c-1-.41-2-1.52-2-2.84 0-1.32 1-2.43 2-2.84z"/><path d="M14.86 11H22c-.48-4.75-4-8.53-9-9v7.16c1 .3 1.52.98 1.86 1.84z"/><path d="M13 14.84V22c5-.47 8.52-4.25 9-9h-7.14c-.34.86-.86 1.54-1.86 1.84z"/>',
		'eject': '<path d="M5 17h14v2H5z"/><path d="M12 5L5.33 15h13.34z"/>',
		'euro_symbol': '<path d="M15 18.5c-2.51 0-4.68-1.42-5.76-3.5H15v-2H8.58c-.05-.33-.08-.66-.08-1s.03-.67.08-1H15V9H9.24C10.32 6.92 12.5 5.5 15 5.5c1.61 0 3.09.59 4.23 1.57L21 5.3C19.41 3.87 17.3 3 15 3c-3.92 0-7.24 2.51-8.48 6H3v2h3.06c-.04.33-.06.66-.06 1 0 .34.02.67.06 1H3v2h3.52c1.24 3.49 4.56 6 8.48 6 2.31 0 4.41-.87 6-2.3l-1.78-1.77c-1.13.98-2.6 1.57-4.22 1.57z"/>',
		'event': '<path d="M17 12h-5v5h5v-5z"/><path d="M19 19H5V8h14v11zM16 1v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2h-1V1h-2z"/>',
		'event_seat': '<path d="M4 18v3h3v-3h10v3h3v-6H4z"/><path d="M19 10h3v3h-3z"/><path d="M2 10h3v3H2z"/><path d="M17 13H7V5c0-1.1.9-2 2-2h6c1.1 0 2 .9 2 2v8z"/>',
		'exit_to_app': '<path d="M10.09 15.59L11.5 17l5-5-5-5-1.41 1.41L12.67 11H3v2h9.67l-2.58 2.59z"/><path d="M19 3H5c-1.11 0-2 .9-2 2v4h2V5h14v14H5v-4H3v4c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z"/>',
		'explore': '<path d="M12 10.9c-.61 0-1.1.49-1.1 1.1 0 .61.49 1.1 1.1 1.1.61 0 1.1-.49 1.1-1.1 0-.61-.49-1.1-1.1-1.1z"/><path d="M14.19 14.19L6 18l3.81-8.19L18 6l-3.81 8.19zM12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"/>',
		'extension': '<path d="M20.5 11H19V7c0-1.1-.9-2-2-2h-4V3.5C13 2.12 11.88 1 10.5 1S8 2.12 8 3.5V5H4c-1.1 0-1.99.9-1.99 2v3.8H3.5c1.49 0 2.7 1.21 2.7 2.7s-1.21 2.7-2.7 2.7H2V20c0 1.1.9 2 2 2h3.8v-1.5c0-1.49 1.21-2.7 2.7-2.7 1.49 0 2.7 1.21 2.7 2.7V22H17c1.1 0 2-.9 2-2v-4h1.5c1.38 0 2.5-1.12 2.5-2.5S21.88 11 20.5 11z"/>',
		'face': '<path d="M14.69 17.1c-.74.58-1.7.9-2.69.9s-1.95-.32-2.69-.9c-.22-.17-.53-.13-.7.09-.17.22-.13.53.09.7.91.72 2.09 1.11 3.3 1.11s2.39-.39 3.31-1.1c.22-.17.26-.48.09-.7-.17-.23-.49-.26-.71-.1z"/><path d="M19.96 14.82c-1.09 3.74-4.27 6.46-8.04 6.46-3.78 0-6.96-2.72-8.04-6.47-1.19-.11-2.13-1.18-2.13-2.52 0-1.27.85-2.31 1.97-2.5 2.09-1.46 3.8-3.49 4.09-5.05v-.01c1.35 2.63 6.3 5.19 11.83 5.06l.3-.03c1.28 0 2.31 1.14 2.31 2.54 0 1.38-1.02 2.51-2.29 2.52zM12 0C5.37 0 0 5.37 0 12s5.37 12 12 12 12-5.37 12-12S18.63 0 12 0z"/><path d="M16.5 12.5c0 .552-.448 1-1 1s-1-.448-1-1 .448-1 1-1 1 .448 1 1zm-7 0c0 .552-.448 1-1 1s-1-.448-1-1 .448-1 1-1 1 .448 1 1z"/>',
		'favorite': '<path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>',
		'favorite_border': '<path d="M16.5 3c-1.74 0-3.41.81-4.5 2.09C10.91 3.81 9.24 3 7.5 3 4.42 3 2 5.42 2 8.5c0 3.78 3.4 6.86 8.55 11.54L12 21.35l1.45-1.32C18.6 15.36 22 12.28 22 8.5 22 5.42 19.58 3 16.5 3zm-4.4 15.55l-.1.1-.1-.1C7.14 14.24 4 11.39 4 8.5 4 6.5 5.5 5 7.5 5c1.54 0 3.04.99 3.57 2.36h1.87C13.46 5.99 14.96 5 16.5 5c2 0 3.5 1.5 3.5 3.5 0 2.89-3.14 5.74-7.9 10.05z"/>',
		'feedback': '<path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-7 12h-2v-2h2v2zm0-4h-2V6h2v4z"/>',
		'find_in_page': '<path d="M20 19.59V8l-6-6H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c.45 0 .85-.15 1.19-.4l-4.43-4.43c-.8.52-1.74.83-2.76.83-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5c0 1.02-.31 1.96-.83 2.75L20 19.59z"/><path d="M9 13c0 1.66 1.34 3 3 3s3-1.34 3-3-1.34-3-3-3-3 1.34-3 3z"/>',
		'find_replace': '<path d="M11 6c1.38 0 2.63.56 3.54 1.46L12 10h6V4l-2.05 2.05C14.68 4.78 12.93 4 11 4c-3.53 0-6.43 2.61-6.92 6H6.1c.46-2.28 2.48-4 4.9-4z"/><path d="M16.64 15.14c.66-.9 1.12-1.97 1.28-3.14H15.9c-.46 2.28-2.48 4-4.9 4-1.38 0-2.63-.56-3.54-1.46L10 12H4v6l2.05-2.05C7.32 17.22 9.07 18 11 18c1.55 0 2.98-.51 4.14-1.36L20 21.49 21.49 20l-4.85-4.86z"/>',
		'fingerprint': '<path d="M17.81 4.47c-.08 0-.16-.02-.23-.06C15.66 3.42 14 3 12.01 3c-1.98 0-3.86.47-5.57 1.41-.24.13-.54.04-.68-.2a.506.506 0 0 1 .2-.68C7.82 2.52 9.86 2 12.01 2c2.13 0 3.99.47 6.03 1.52.25.13.34.43.21.67a.49.49 0 0 1-.44.28z"/><path d="M3.5 9.72a.499.499 0 0 1-.41-.79c.99-1.4 2.25-2.5 3.75-3.27C9.98 4.04 14 4.03 17.15 5.65c1.5.77 2.76 1.86 3.75 3.25a.5.5 0 0 1-.12.7c-.23.16-.54.11-.7-.12a9.388 9.388 0 0 0-3.39-2.94c-2.87-1.47-6.54-1.47-9.4.01-1.36.7-2.5 1.7-3.4 2.96-.08.14-.23.21-.39.21z"/><path d="M9.75 21.79a.47.47 0 0 1-.35-.15c-.87-.87-1.34-1.43-2.01-2.64-.69-1.23-1.05-2.73-1.05-4.34 0-2.97 2.54-5.39 5.66-5.39s5.66 2.42 5.66 5.39c0 .28-.22.5-.5.5s-.5-.22-.5-.5c0-2.42-2.09-4.39-4.66-4.39-2.57 0-4.66 1.97-4.66 4.39 0 1.44.32 2.77.93 3.85.64 1.15 1.08 1.64 1.85 2.42.19.2.19.51 0 .71-.11.1-.24.15-.37.15z"/><path d="M16.92 19.94c-1.19 0-2.24-.3-3.1-.89-1.49-1.01-2.38-2.65-2.38-4.39 0-.28.22-.5.5-.5s.5.22.5.5c0 1.41.72 2.74 1.94 3.56.71.48 1.54.71 2.54.71.24 0 .64-.03 1.04-.1.27-.05.53.13.58.41.05.27-.13.53-.41.58-.57.11-1.07.12-1.21.12z"/><path d="M14.91 22c-.04 0-.09-.01-.13-.02-1.59-.44-2.63-1.03-3.72-2.1a7.297 7.297 0 0 1-2.17-5.22c0-1.62 1.38-2.94 3.08-2.94 1.7 0 3.08 1.32 3.08 2.94 0 1.07.93 1.94 2.08 1.94s2.08-.87 2.08-1.94c0-3.77-3.25-6.83-7.25-6.83-2.84 0-5.44 1.58-6.61 4.03-.39.81-.59 1.76-.59 2.8 0 .78.07 2.01.67 3.61.1.26-.03.55-.29.64-.26.1-.55-.04-.64-.29a11.14 11.14 0 0 1-.73-3.96c0-1.2.23-2.29.68-3.24 1.33-2.79 4.28-4.6 7.51-4.6 4.55 0 8.25 3.51 8.25 7.83 0 1.62-1.38 2.94-3.08 2.94-1.7 0-3.08-1.32-3.08-2.94 0-1.07-.93-1.94-2.08-1.94s-2.08.87-2.08 1.94c0 1.71.66 3.31 1.87 4.51.95.94 1.86 1.46 3.27 1.85.27.07.42.35.35.61-.05.23-.26.38-.47.38z"/>',
		'flight_land': '<path d="M2.5 19h19v2h-19z"/><path d="M9.68 13.27l4.35 1.16 5.31 1.42c.8.21 1.62-.26 1.84-1.06.21-.8-.26-1.62-1.06-1.84l-5.31-1.42-2.76-9.02L10.12 2v8.28L5.15 8.95l-.93-2.32-1.45-.39v5.17l1.6.43 5.31 1.43z"/>',
		'flight_takeoff': '<path d="M2.5 19h19v2h-19z"/><path d="M22.07 9.64c-.21-.8-1.04-1.28-1.84-1.06L14.92 10l-6.9-6.43-1.93.51 4.14 7.17-4.97 1.33-1.97-1.54-1.45.39 1.82 3.16.77 1.33 1.6-.43 5.31-1.42 4.35-1.16L21 11.49c.81-.23 1.28-1.05 1.07-1.85z"/>',
		'flip_to_back': '<path d="M9 7H7v2h2V7z"/><path d="M9 11H7v2h2v-2z"/><path d="M9 3a2 2 0 0 0-2 2h2V3z"/><path d="M13 15h-2v2h2v-2z"/><path d="M19 3v2h2c0-1.1-.9-2-2-2z"/><path d="M13 3h-2v2h2V3z"/><path d="M9 17v-2H7a2 2 0 0 0 2 2z"/><path d="M19 13h2v-2h-2v2z"/><path d="M19 9h2V7h-2v2z"/><path d="M19 17c1.1 0 2-.9 2-2h-2v2z"/><path d="M5 7H3v12a2 2 0 0 0 2 2h12v-2H5V7z"/><path d="M15 5h2V3h-2v2z"/><path d="M15 17h2v-2h-2v2z"/>',
		'flip_to_front': '<path d="M3 13h2v-2H3v2z"/><path d="M3 17h2v-2H3v2z"/><path d="M5 21v-2H3a2 2 0 0 0 2 2z"/><path d="M3 9h2V7H3v2z"/><path d="M15 21h2v-2h-2v2z"/><path d="M19 15H9V5h10v10zm0-12H9a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h10c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z"/><path d="M11 21h2v-2h-2v2z"/><path d="M7 21h2v-2H7v2z"/>',
		'g_translate': '<path d="M20 5h-9.12L10 2H4c-1.1 0-2 .9-2 2v13c0 1.1.9 2 2 2h7l1 3h8c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zM7.17 14.59c-2.25 0-4.09-1.83-4.09-4.09s1.83-4.09 4.09-4.09c1.04 0 1.99.37 2.74 1.07l.07.06-1.23 1.18-.06-.05c-.29-.27-.78-.59-1.52-.59-1.31 0-2.38 1.09-2.38 2.42s1.07 2.42 2.38 2.42c1.37 0 1.96-.87 2.12-1.46H7.08V9.91h3.95l.01.07c.04.21.05.4.05.61 0 2.35-1.61 4-3.92 4zm6.03-1.71c.33.6.74 1.18 1.19 1.7l-.54.53-.65-2.23zm.77-.76h-.99l-.31-1.04h3.99s-.34 1.31-1.56 2.74c-.52-.62-.89-1.23-1.13-1.7zM21 20c0 .55-.45 1-1 1h-7l2-2-.81-2.77.92-.92L17.79 18l.73-.73-2.71-2.68c.9-1.03 1.6-2.25 1.92-3.51H19v-1.04h-3.64V9h-1.04v1.04h-1.96L11.18 6H20c.55 0 1 .45 1 1v13z"/>',
		'gavel': '<path d="M1 21h12v2H1z"/><path d="M5.245 8.07l2.83-2.827 14.14 14.142-2.828 2.828z"/><path d="M12.317 1l5.657 5.656-2.83 2.83-5.654-5.66z"/><path d="M3.825 9.485l5.657 5.657-2.828 2.828-5.657-5.657z"/>',
		'get_app': '<path d="M19 9h-4V3H9v6H5l7 7 7-7z"/><path d="M5 18v2h14v-2H5z"/>',
		'gif': '<path d="M11.5 9H13v6h-1.5z"/><path d="M9 9H6c-.6 0-1 .5-1 1v4c0 .5.4 1 1 1h3c.6 0 1-.5 1-1v-2H8.5v1.5h-2v-3H10V10c0-.5-.4-1-1-1z"/><path d="M19 10.5V9h-4.5v6H16v-2h2v-1.5h-2v-1z"/>',
		'grade': '<path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>',
		'group_work': '<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zM8 17.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5zM9.5 8c0-1.38 1.12-2.5 2.5-2.5s2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5S9.5 9.38 9.5 8zm6.5 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>',
		'help': '<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25z"/>',
		'help_outline': '<path d="M11 18h2v-2h-2v2z"/><path d="M12 20c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm0-18C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"/><path d="M12 6c-2.21 0-4 1.79-4 4h2c0-1.1.9-2 2-2s2 .9 2 2c0 2-3 1.75-3 5h2c0-2.25 3-2.5 3-5 0-2.21-1.79-4-4-4z"/>',
		'highlight_off': '<path d="M14.59 8L12 10.59 9.41 8 8 9.41 10.59 12 8 14.59 9.41 16 12 13.41 14.59 16 16 14.59 13.41 12 16 9.41 14.59 8z"/><path d="M12 20c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm0-18C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2z"/>',
		'history': '<path d="M13 3c-4.97 0-9 4.03-9 9H1l3.89 3.89.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42C8.27 19.99 10.51 21 13 21c4.97 0 9-4.03 9-9s-4.03-9-9-9z"/><path d="M12 8v5l4.28 2.54.72-1.21-3.5-2.08V8H12z"/>',
		'home': '<path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>',
		'hourglass_empty': '<path d="M6 2v6h.01L6 8.01 10 12l-4 4 .01.01H6V22h12v-5.99h-.01L18 16l-4-4 4-3.99-.01-.01H18V2H6zm10 14.5V20H8v-3.5l4-4 4 4zm-4-5l-4-4V4h8v3.5l-4 4z"/>',
		'hourglass_full': '<path d="M6 2v6h.01L6 8.01 10 12l-4 4 .01.01H6V22h12v-5.99h-.01L18 16l-4-4 4-3.99-.01-.01H18V2H6z"/>',
		'http': '<path d="M4.5 11h-2V9H1v6h1.5v-2.5h2V15H6V9H4.5v2z"/><path d="M7 10.5h1.5V15H10v-4.5h1.5V9H7v1.5z"/><path d="M12.5 10.5H14V15h1.5v-4.5H17V9h-4.5v1.5z"/><path d="M21.5 11.5h-2v-1h2v1zm0-2.5H18v6h1.5v-2h2c.8 0 1.5-.7 1.5-1.5v-1c0-.8-.7-1.5-1.5-1.5z"/>',
		'https': '<path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/>',
		'important_devices': '<path d="M23 20h-5v-7h5v7zm0-8.99L18 11c-.55 0-1 .45-1 1v9c0 .55.45 1 1 1h5c.55 0 1-.45 1-1v-9c0-.55-.45-.99-1-.99z"/><path d="M20 2H2C.89 2 0 2.89 0 4v12a2 2 0 0 0 2 2h7v2H7v2h8v-2h-2v-2h2v-2H2V4h18v5h2V4a2 2 0 0 0-2-2z"/><path d="M11.97 9L11 6l-.97 3H7l2.47 1.76-.94 2.91 2.47-1.8 2.47 1.8-.94-2.91L15 9h-3.03z"/>',
		'info': '<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>',
		'info_outline': '<path d="M12 20c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm0-18C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"/><path d="M11 9h2V7h-2v2zm0 8h2v-6h-2v6z"/>',
		'input': '<path d="M21 3.01H3c-1.1 0-2 .9-2 2V9h2V4.99h18v14.03H3V15H1v4.01c0 1.1.9 1.98 2 1.98h18c1.1 0 2-.88 2-1.98v-14c0-1.11-.9-2-2-2z"/><path d="M11 16l4-4-4-4v3H1v2h10v3z"/>',
		'invert_colors': '<path d="M17.66 7.93L12 2.27 6.34 7.93c-3.12 3.12-3.12 8.19 0 11.31C7.9 20.8 9.95 21.58 12 21.58c2.05 0 4.1-.78 5.66-2.34 3.12-3.12 3.12-8.19 0-11.31zM12 19.59c-1.6 0-3.11-.62-4.24-1.76C6.62 16.69 6 15.19 6 13.59s.62-3.11 1.76-4.24L12 5.1v14.49z"/>',
		'label': '<path d="M17.63 5.84C17.27 5.33 16.67 5 16 5L5 5.01C3.9 5.01 3 5.9 3 7v10c0 1.1.9 1.99 2 1.99L16 19c.67 0 1.27-.33 1.63-.84L22 12l-4.37-6.16z"/>',
		'label_outline': '<path d="M17.63 5.84C17.27 5.33 16.67 5 16 5L5 5.01C3.9 5.01 3 5.9 3 7v10c0 1.1.9 1.99 2 1.99L16 19c.67 0 1.27-.33 1.63-.84L22 12l-4.37-6.16zM16 17H5V7h11l3.55 5L16 17z"/>',
		'language': '<path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zm6.93 6h-2.95c-.32-1.25-.78-2.45-1.38-3.56 1.84.63 3.37 1.91 4.33 3.56zM12 4.04c.83 1.2 1.48 2.53 1.91 3.96h-3.82c.43-1.43 1.08-2.76 1.91-3.96zM4.26 14C4.1 13.36 4 12.69 4 12s.1-1.36.26-2h3.38c-.08.66-.14 1.32-.14 2 0 .68.06 1.34.14 2H4.26zm.82 2h2.95c.32 1.25.78 2.45 1.38 3.56-1.84-.63-3.37-1.9-4.33-3.56zm2.95-8H5.08c.96-1.66 2.49-2.93 4.33-3.56C8.81 5.55 8.35 6.75 8.03 8zM12 19.96c-.83-1.2-1.48-2.53-1.91-3.96h3.82c-.43 1.43-1.08 2.76-1.91 3.96zM14.34 14H9.66c-.09-.66-.16-1.32-.16-2 0-.68.07-1.35.16-2h4.68c.09.65.16 1.32.16 2 0 .68-.07 1.34-.16 2zm.25 5.56c.6-1.11 1.06-2.31 1.38-3.56h2.95c-.96 1.65-2.49 2.93-4.33 3.56zM16.36 14c.08-.66.14-1.32.14-2 0-.68-.06-1.34-.14-2h3.38c.16.64.26 1.31.26 2s-.1 1.36-.26 2h-3.38z"/>',
		'launch': '<path d="M19 19H5V5h7V3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2v-7h-2v7z"/><path d="M14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z"/>',
		'lightbulb_outline': '<path d="M9 21c0 .55.45 1 1 1h4c.55 0 1-.45 1-1v-1H9v1z"/><path d="M14.85 13.1l-.85.6V16h-4v-2.3l-.85-.6A4.997 4.997 0 0 1 7 9c0-2.76 2.24-5 5-5s5 2.24 5 5c0 1.63-.8 3.16-2.15 4.1zM12 2C8.14 2 5 5.14 5 9c0 2.38 1.19 4.47 3 5.74V17c0 .55.45 1 1 1h6c.55 0 1-.45 1-1v-2.26c1.81-1.27 3-3.36 3-5.74 0-3.86-3.14-7-7-7z"/>',
		'line_style': '<path d="M3 16h5v-2H3v2z"/><path d="M9.5 16h5v-2h-5v2z"/><path d="M16 16h5v-2h-5v2z"/><path d="M3 20h2v-2H3v2z"/><path d="M7 20h2v-2H7v2z"/><path d="M11 20h2v-2h-2v2z"/><path d="M15 20h2v-2h-2v2z"/><path d="M19 20h2v-2h-2v2z"/><path d="M3 12h8v-2H3v2z"/><path d="M13 12h8v-2h-8v2z"/><path d="M3 4v4h18V4H3z"/>',
		'line_weight': '<path d="M3 17h18v-2H3v2z"/><path d="M3 20h18v-1H3v1z"/><path d="M3 13h18v-3H3v3z"/><path d="M3 4v4h18V4H3z"/>',
		'list': '<path d="M3 9h2V7H3v2zm0 8h2v-2H3v2zm0-4h2v-2H3v2z"/><path d="M7 13h14v-2H7v2z"/><path d="M7 17h14v-2H7v2z"/><path d="M7 7v2h14V7H7z"/>',
		'lock': '<path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/>',
		'lock_open': '<path d="M12 17c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2z"/><path d="M18 20H6V10h12v10zm0-12h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6h1.9c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2z"/>',
		'lock_outline': '<path d="M18 20H6V10h12zM12 2.9c1.71 0 3.1 1.39 3.1 3.1v2H9V6l-.002-.008C8.998 4.282 10.29 2.9 12 2.9zM18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2z"/><path d="M12 17c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2z"/>',
		'loyalty': '<path d="M21.41 11.58l-9-9C12.05 2.22 11.55 2 11 2H4c-1.1 0-2 .9-2 2v7c0 .55.22 1.05.59 1.42l9 9c.36.36.86.58 1.41.58.55 0 1.05-.22 1.41-.59l7-7c.37-.36.59-.86.59-1.41 0-.55-.23-1.06-.59-1.42zM5.5 7C4.67 7 4 6.33 4 5.5S4.67 4 5.5 4 7 4.67 7 5.5 6.33 7 5.5 7zm11.77 8.27L13 19.54l-4.27-4.27C8.28 14.81 8 14.19 8 13.5c0-1.38 1.12-2.5 2.5-2.5.69 0 1.32.28 1.77.74l.73.72.73-.73c.45-.45 1.08-.73 1.77-.73 1.38 0 2.5 1.12 2.5 2.5 0 .69-.28 1.32-.73 1.77z"/>',
		'markunread_mailbox': '<path d="M20 6H10v6H8V4h6V0H6v6H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2z"/>',
		'motorcycle': '<path d="M19.44 9.03L15.41 5H11v2h3.59l2 2H5c-2.8 0-5 2.2-5 5s2.2 5 5 5c2.46 0 4.45-1.69 4.9-4h1.65l2.77-2.77c-.21.54-.32 1.14-.32 1.77 0 2.8 2.2 5 5 5s5-2.2 5-5c0-2.65-1.97-4.77-4.56-4.97zM7.82 15C7.4 16.15 6.28 17 5 17c-1.63 0-3-1.37-3-3s1.37-3 3-3c1.28 0 2.4.85 2.82 2H5v2h2.82zM19 17c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3z"/>',
		'note_add': '<path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 14h-3v3h-2v-3H8v-2h3v-3h2v3h3v2zm-3-7V3.5L18.5 9H13z"/>',
		'offline_pin': '<path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm5 16H7v-2h10v2zm-6.7-4L7 10.7l1.4-1.4 1.9 1.9 5.3-5.3L17 7.3 10.3 14z"/>',
		'opacity': '<path d="M17.66 8L12 2.35 6.34 8C4.78 9.56 4 11.64 4 13.64s.78 4.11 2.34 5.67 3.61 2.35 5.66 2.35 4.1-.79 5.66-2.35S20 15.64 20 13.64 19.22 9.56 17.66 8zM6 14c.01-2 .62-3.27 1.76-4.4L12 5.27l4.24 4.38C17.38 10.77 17.99 12 18 14H6z"/>',
		'open_in_browser': '<path d="M19 4H5c-1.11 0-2 .9-2 2v12c0 1.1.89 2 2 2h4v-2H5V8h14v10h-4v2h4c1.1 0 2-.9 2-2V6c0-1.1-.89-2-2-2z"/><path d="M12 10l-4 4h3v6h2v-6h3l-4-4z"/>',
		'open_in_new': '<path d="M19 19H5V5h7V3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2v-7h-2v7z"/><path d="M14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z"/>',
		'open_with': '<path d="M10 9h4V6h3l-5-5-5 5h3v3z"/><path d="M9 10H6V7l-5 5 5 5v-3h3v-4z"/><path d="M23 12l-5-5v3h-3v4h3v3l5-5z"/><path d="M14 15h-4v3H7l5 5 5-5h-3v-3z"/>',
		'pageview': '<path d="M11 8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/><path d="M17.59 19l-3.83-3.83c-.8.52-1.74.83-2.76.83-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5c0 1.02-.31 1.96-.83 2.75L19 17.59 17.59 19zM19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z"/>',
		'pan_tool': '<path d="M23 5.5V20c0 2.2-1.8 4-4 4h-7.3c-1.08 0-2.1-.43-2.85-1.19L1 14.83s1.26-1.23 1.3-1.25c.22-.19.49-.29.79-.29.22 0 .42.06.6.16.04.01 4.31 2.46 4.31 2.46V4c0-.83.67-1.5 1.5-1.5S11 3.17 11 4v7h1V1.5c0-.83.67-1.5 1.5-1.5S15 .67 15 1.5V11h1V2.5c0-.83.67-1.5 1.5-1.5s1.5.67 1.5 1.5V11h1V5.5c0-.83.67-1.5 1.5-1.5s1.5.67 1.5 1.5z"/>',
		'payment': '<path d="M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z"/>',
		'perm_camera_mic': '<path d="M20 5h-3.17L15 3H9L7.17 5H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h7v-2.09c-2.83-.48-5-2.94-5-5.91h2c0 2.21 1.79 4 4 4s4-1.79 4-4h2c0 2.97-2.17 5.43-5 5.91V21h7c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm-6 8c0 1.1-.9 2-2 2s-2-.9-2-2V9c0-1.1.9-2 2-2s2 .9 2 2v4z"/>',
		'perm_contact_calendar': '<path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm6 12H6v-1c0-2 4-3.1 6-3.1s6 1.1 6 3.1v1z"/>',
		'perm_data_setting': '<path d="M18.99 11.5c.34 0 .67.03 1 .07L20 0 0 20h11.56c-.04-.33-.07-.66-.07-1 0-4.14 3.36-7.5 7.5-7.5z"/><path d="M18.99 20.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm3.71-1.01c.02-.16.04-.32.04-.49 0-.17-.01-.33-.04-.49l1.06-.83c.09-.08.12-.21.06-.32l-1-1.73c-.06-.11-.19-.15-.31-.11l-1.24.5c-.26-.2-.54-.37-.85-.49l-.19-1.32c-.01-.12-.12-.21-.24-.21h-2c-.12 0-.23.09-.25.21l-.19 1.32c-.3.13-.59.29-.85.49l-1.24-.5c-.11-.04-.24 0-.31.11l-1 1.73c-.06.11-.04.24.06.32l1.06.83c-.02.16-.03.32-.03.49 0 .17.01.33.03.49l-1.06.83c-.09.08-.12.21-.06.32l1 1.73c.06.11.19.15.31.11l1.24-.5c.26.2.54.37.85.49l.19 1.32c.02.12.12.21.25.21h2c.12 0 .23-.09.25-.21l.19-1.32c.3-.13.59-.29.84-.49l1.25.5c.11.04.24 0 .31-.11l1-1.73c.06-.11.03-.24-.06-.32l-1.07-.83z"/>',
		'perm_device_information': '<path d="M13 11h-2v6h2v-6zm0-4h-2v2h2V7z"/><path d="M17 19H7V5h10v14zm0-17.99L7 1c-1.1 0-2 .9-2 2v18c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V3c0-1.1-.9-1.99-2-1.99z"/>',
		'perm_identity': '<path d="M12 4C9.79 4 8 5.79 8 8s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm0 1.9c1.16 0 2.1.94 2.1 2.1 0 1.16-.94 2.1-2.1 2.1-1.16 0-2.1-.94-2.1-2.1 0-1.16.94-2.1 2.1-2.1"/><path d="M12 13c-2.67 0-8 1.34-8 4v3h16v-3c0-2.66-5.33-4-8-4zm0 1.9c2.97 0 6.1 1.46 6.1 2.1v1.1H5.9V17c0-.64 3.13-2.1 6.1-2.1"/>',
		'perm_media': '<path d="M2 6H0v5h.01L0 20c0 1.1.9 2 2 2h18v-2H2V6z"/><path d="M7 15l4.5-6 3.5 4.51 2.5-3.01L21 15H7zM22 4h-8l-2-2H6c-1.1 0-1.99.9-1.99 2L4 16c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2z"/>',
		'perm_phone_msg': '<path d="M20 15.5c-1.25 0-2.45-.2-3.57-.57-.35-.11-.74-.03-1.02.24l-2.2 2.2c-2.83-1.44-5.15-3.75-6.59-6.58l2.2-2.21c.28-.27.36-.66.25-1.01C8.7 6.45 8.5 5.25 8.5 4c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1 0 9.39 7.61 17 17 17 .55 0 1-.45 1-1v-3.5c0-.55-.45-1-1-1z"/><path d="M12 3v10l3-3h6V3h-9z"/>',
		'perm_scan_wifi': '<path d="M12 3C6.95 3 3.15 4.85 0 7.23L12 22 24 7.25C20.85 4.87 17.05 3 12 3zm1 13h-2v-6h2v6zm-2-8V6h2v2h-2z"/>',
		'pets': '<circle cx="4.5" cy="9.5" r="2.5"/> <circle cx="9" cy="5.5" r="2.5"/> <circle cx="15" cy="5.5" r="2.5"/> <circle cx="19.5" cy="9.5" r="2.5"/> <path d="M17.34 14.86c-.87-1.02-1.6-1.89-2.48-2.91-.46-.54-1.05-1.08-1.75-1.32-.11-.04-.22-.07-.33-.09-.25-.04-.52-.04-.78-.04s-.53 0-.79.05c-.11.02-.22.05-.33.09-.7.24-1.28.78-1.75 1.32-.87 1.02-1.6 1.89-2.48 2.91-1.31 1.31-2.92 2.76-2.62 4.79.29 1.02 1.02 2.03 2.33 2.32.73.15 3.06-.44 5.54-.44h.18c2.48 0 4.81.58 5.54.44 1.31-.29 2.04-1.31 2.33-2.32.31-2.04-1.3-3.49-2.61-4.8z"/>',
		'picture_in_picture': '<path d="M19 7h-8v6h8V7z"/><path d="M21 19.01H3V4.98h18v14.03zM21 3H3c-1.1 0-2 .9-2 2v14c0 1.1.9 1.98 2 1.98h18c1.1 0 2-.88 2-1.98V5c0-1.1-.9-2-2-2z"/>',
		'picture_in_picture_alt': '<path d="M19 11h-8v6h8v-6z"/><path d="M21 19.02H3V4.97h18v14.05zm2-.02V4.98C23 3.88 22.1 3 21 3H3c-1.1 0-2 .88-2 1.98V19c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2z"/>',
		'play_for_work': '<path d="M11 5v5.59H7.5l4.5 4.5 4.5-4.5H13V5h-2z"/><path d="M6 14c0 3.31 2.69 6 6 6s6-2.69 6-6h-2c0 2.21-1.79 4-4 4s-4-1.79-4-4H6z"/>',
		'polymer': '<path d="M19 4h-4L7.11 16.63 4.5 12 9 4H5L.5 12 5 20h4l7.89-12.63L19.5 12 15 20h4l4.5-8z"/>',
		'power_settings_new': '<path d="M13 3h-2v10h2V3z"/><path d="M17.83 5.17l-1.42 1.42A6.92 6.92 0 0 1 19 12c0 3.87-3.13 7-7 7A6.995 6.995 0 0 1 7.58 6.58L6.17 5.17A8.932 8.932 0 0 0 3 12a9 9 0 0 0 18 0c0-2.74-1.23-5.18-3.17-6.83z"/>',
		'pregnant_woman': '<path d="M9 4c0-1.11.89-2 2-2s2 .89 2 2-.89 2-2 2-2-.89-2-2zm7 9c-.01-1.34-.83-2.51-2-3 0-1.66-1.34-3-3-3s-3 1.34-3 3v7h2v5h3v-5h3v-4z"/>',
		'print': '<path d="M19 12c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm-3 7H8v-5h8v5zm3-11H5c-1.66 0-3 1.34-3 3v6h4v4h12v-4h4v-6c0-1.66-1.34-3-3-3z"/><path d="M18 3H6v4h12V3z"/>',
		'query_builder': '<path d="M12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm-.01-18C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2z"/><path d="M12.5 7H11v6l5.25 3.15.75-1.23-4.5-2.67z"/>',
		'question_answer': '<path d="M21 6h-2v9H6v2c0 .55.45 1 1 1h11l4 4V7c0-.55-.45-1-1-1z"/><path d="M17 12V3c0-.55-.45-1-1-1H3c-.55 0-1 .45-1 1v14l4-4h10c.55 0 1-.45 1-1z"/>',
		'receipt': '<path d="M18 17H6v-2h12v2zm0-4H6v-2h12v2zm0-4H6V7h12v2zM3 22l1.5-1.5L6 22l1.5-1.5L9 22l1.5-1.5L12 22l1.5-1.5L15 22l1.5-1.5L18 22l1.5-1.5L21 22V2l-1.5 1.5L18 2l-1.5 1.5L15 2l-1.5 1.5L12 2l-1.5 1.5L9 2 7.5 3.5 6 2 4.5 3.5 3 2v20z"/>',
		'record_voice_over': '<circle cx="9" cy="9" r="4"/><path d="M9 15c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4zm7.76-9.64l-1.68 1.69c.84 1.18.84 2.71 0 3.89l1.68 1.69c2.02-2.02 2.02-5.07 0-7.27zM20.07 2l-1.63 1.63c2.77 3.02 2.77 7.56 0 10.74L20.07 16c3.9-3.89 3.91-9.95 0-14z"/>',
		'redeem': '<path d="M20 6h-2.18c.11-.31.18-.65.18-1 0-1.66-1.34-3-3-3-1.05 0-1.96.54-2.5 1.35l-.5.67-.5-.68C10.96 2.54 10.05 2 9 2 7.34 2 6 3.34 6 5c0 .35.07.69.18 1H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-5-2c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zM9 4c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm11 15H4v-2h16v2zm0-5H4V8h5.08L7 10.83 8.62 12 11 8.76l1-1.36 1 1.36L15.38 12 17 10.83 14.92 8H20v6z"/>',
		'remove_shopping_cart': '<path d="M7.42 15c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h2.36l2 2H7.42zm15.31 7.73L2.77 2.77 2 2l-.73-.73L0 2.54l4.39 4.39 2.21 4.66-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h7.46l1.38 1.38A1.997 1.997 0 0 0 17 22c.67 0 1.26-.33 1.62-.84L21.46 24l1.27-1.27z"/><path d="M15.55 13c.75 0 1.41-.41 1.75-1.03l3.58-6.49A1.003 1.003 0 0 0 20 4H6.54l9.01 9z"/><path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2z"/>',
		'reorder': '<path d="M3 15h18v-2H3v2z"/><path d="M3 19h18v-2H3v2z"/><path d="M3 11h18V9H3v2z"/><path d="M3 5v2h18V5H3z"/>',
		'report_problem': '<path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"/>',
		'restore': '<path d="M13 3c-4.97 0-9 4.03-9 9H1l3.89 3.89.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42C8.27 19.99 10.51 21 13 21c4.97 0 9-4.03 9-9s-4.03-9-9-9z"/><path d="M12 8v5l4.28 2.54.72-1.21-3.5-2.08V8H12z"/>',
		'restore_page': '<path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm-2 16c-2.05 0-3.81-1.24-4.58-3h1.71c.63.9 1.68 1.5 2.87 1.5 1.93 0 3.5-1.57 3.5-3.5S13.93 9.5 12 9.5c-1.35 0-2.52.78-3.1 1.9l1.6 1.6h-4V9l1.3 1.3C8.69 8.92 10.23 8 12 8c2.76 0 5 2.24 5 5s-2.24 5-5 5z"/>',
		'room': '<path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>',
		'rounded_corner': '<path d="M19 19h2v2h-2v-2z"/><path d="M19 17h2v-2h-2v2z"/><path d="M3 13h2v-2H3v2z"/><path d="M3 17h2v-2H3v2z"/><path d="M3 9h2V7H3v2z"/><path d="M3 5h2V3H3v2z"/><path d="M7 5h2V3H7v2z"/><path d="M15 21h2v-2h-2v2z"/><path d="M11 21h2v-2h-2v2z"/><path d="M15 21h2v-2h-2v2z"/><path d="M7 21h2v-2H7v2z"/><path d="M3 21h2v-2H3v2z"/><path d="M21 8c0-2.76-2.24-5-5-5h-5v2h5c1.65 0 3 1.35 3 3v5h2V8z"/>',
		'rowing': '<path d="M8.5 14.5L4 19l1.5 1.5L9 17h2l-2.5-2.5z"/><path d="M15 1c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/><path d="M21 21.01L18 24l-2.99-3.01V19.5l-7.1-7.09c-.31.05-.61.07-.91.07v-2.16c1.66.03 3.61-.87 4.67-2.04l1.4-1.55c.19-.21.43-.38.69-.5.29-.14.62-.23.96-.23h.03C15.99 6.01 17 7.02 17 8.26v5.75c0 .84-.35 1.61-.92 2.16l-3.58-3.58v-2.27c-.63.52-1.43 1.02-2.29 1.39L16.5 18H18l3 3.01z"/>',
		'schedule': '<path d="M12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm-.01-18C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2z"/><path d="M12.5 7H11v6l5.25 3.15.75-1.23-4.5-2.67z"/>',
		'search': '<path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>',
		'settings': '<path d="M19.43 12.98c.04-.32.07-.64.07-.98s-.03-.66-.07-.98l2.11-1.65c.19-.15.24-.42.12-.64l-2-3.46c-.12-.22-.39-.3-.61-.22l-2.49 1c-.52-.4-1.08-.73-1.69-.98l-.38-2.65C14.46 2.18 14.25 2 14 2h-4c-.25 0-.46.18-.49.42l-.38 2.65c-.61.25-1.17.59-1.69.98l-2.49-1c-.23-.09-.49 0-.61.22l-2 3.46c-.13.22-.07.49.12.64l2.11 1.65c-.04.32-.07.65-.07.98s.03.66.07.98l-2.11 1.65c-.19.15-.24.42-.12.64l2 3.46c.12.22.39.3.61.22l2.49-1c.52.4 1.08.73 1.69.98l.38 2.65c.03.24.24.42.49.42h4c.25 0 .46-.18.49-.42l.38-2.65c.61-.25 1.17-.59 1.69-.98l2.49 1c.23.09.49 0 .61-.22l2-3.46c.12-.22.07-.49-.12-.64l-2.11-1.65zM12 15.5c-1.93 0-3.5-1.57-3.5-3.5s1.57-3.5 3.5-3.5 3.5 1.57 3.5 3.5-1.57 3.5-3.5 3.5z"/>',
		'settings_applications': '<path d="M12 10c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/><path d="M17.25 12c0 .23-.02.46-.05.68l1.48 1.16c.13.11.17.3.08.45l-1.4 2.42c-.09.15-.27.21-.43.15l-1.74-.7c-.36.28-.76.51-1.18.69l-.26 1.85c-.03.17-.18.3-.35.3h-2.8c-.17 0-.32-.13-.35-.29l-.26-1.85c-.43-.18-.82-.41-1.18-.69l-1.74.7c-.16.06-.34 0-.43-.15l-1.4-2.42c-.09-.15-.05-.34.08-.45l1.48-1.16c-.03-.23-.05-.46-.05-.69 0-.23.02-.46.05-.68l-1.48-1.16c-.13-.11-.17-.3-.08-.45l1.4-2.42c.09-.15.27-.21.43-.15l1.74.7c.36-.28.76-.51 1.18-.69l.26-1.85c.03-.17.18-.3.35-.3h2.8c.17 0 .32.13.35.29l.26 1.85c.43.18.82.41 1.18.69l1.74-.7c.16-.06.34 0 .43.15l1.4 2.42c.09.15.05.34-.08.45l-1.48 1.16c.03.23.05.46.05.69zM19 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.11 0 2-.9 2-2V5c0-1.1-.89-2-2-2z"/>',
		'settings_backup_restore': '<path d="M14 12c0-1.1-.9-2-2-2s-2 .9-2 2 .9 2 2 2 2-.9 2-2z"/><path d="M12 3c-4.97 0-9 4.03-9 9H0l4 4 4-4H5c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.51 0-2.91-.49-4.06-1.3l-1.42 1.44C8.04 20.3 9.94 21 12 21c4.97 0 9-4.03 9-9s-4.03-9-9-9z"/>',
		'settings_bluetooth': '<path d="M15 24h2v-2h-2v2zm-8 0h2v-2H7v2zm4 0h2v-2h-2v2z"/><path d="M14.88 14.29L13 16.17v-3.76l1.88 1.88zM13 3.83l1.88 1.88L13 7.59V3.83zm4.71 1.88L12 0h-1v7.59L6.41 3 5 4.41 10.59 10 5 15.59 6.41 17 11 12.41V20h1l5.71-5.71-4.3-4.29 4.3-4.29z"/>',
		'settings_brightness': '<path d="M21 19.01H3V4.99h18v14.02zM21 3H3c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z"/><path d="M12 9c1.66 0 3 1.34 3 3s-1.34 3-3 3V9zm-4 7h2.5l1.5 1.5 1.5-1.5H16v-2.5l1.5-1.5-1.5-1.5V8h-2.5L12 6.5 10.5 8H8v2.5L6.5 12 8 13.5V16z"/>',
		'settings_cell': '<path d="M15 24h2v-2h-2v2zm-4 0h2v-2h-2v2zm-4 0h2v-2H7v2z"/><path d="M16 16H8V4h8v12zM16 .01L8 0C6.9 0 6 .9 6 2v16c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V2c0-1.1-.9-1.99-2-1.99z"/>',
		'settings_ethernet': '<path d="M7.77 6.76L6.23 5.48.82 12l5.41 6.52 1.54-1.28L3.42 12l4.35-5.24z"/><path d="M11 13h2v-2h-2v2zm6-2h-2v2h2v-2zM7 13h2v-2H7v2z"/><path d="M17.77 5.48l-1.54 1.28L20.58 12l-4.35 5.24 1.54 1.28L23.18 12l-5.41-6.52z"/>',
		'settings_input_antenna': '<path d="M12 5c-3.87 0-7 3.13-7 7h2c0-2.76 2.24-5 5-5s5 2.24 5 5h2c0-3.87-3.13-7-7-7z"/><path d="M13 14.29c.88-.39 1.5-1.26 1.5-2.29 0-1.38-1.12-2.5-2.5-2.5S9.5 10.62 9.5 12c0 1.02.62 1.9 1.5 2.29v3.3L7.59 21 9 22.41l3-3 3 3L16.41 21 13 17.59v-3.3z"/><path d="M12 1C5.93 1 1 5.93 1 12h2c0-4.97 4.03-9 9-9s9 4.03 9 9h2c0-6.07-4.93-11-11-11z"/>',
		'settings_input_component': '<path d="M1 16c0 1.3.84 2.4 2 2.82V23h2v-4.18C6.16 18.4 7 17.3 7 16v-2H1v2zM5 2c0-.55-.45-1-1-1s-1 .45-1 1v4H1v6h6V6H5V2z"/><path d="M13 2c0-.55-.45-1-1-1s-1 .45-1 1v4H9v6h6V6h-2V2zM9 16c0 1.3.84 2.4 2 2.82V23h2v-4.18c1.16-.41 2-1.51 2-2.82v-2H9v2z"/><path d="M17 16c0 1.3.84 2.4 2 2.82V23h2v-4.18c1.16-.41 2-1.51 2-2.82v-2h-6v2zm4-10V2c0-.55-.45-1-1-1s-1 .45-1 1v4h-2v6h6V6h-2z"/>',
		'settings_input_composite': '<path d="M1 16c0 1.3.84 2.4 2 2.82V23h2v-4.18C6.16 18.4 7 17.3 7 16v-2H1v2zM5 2c0-.55-.45-1-1-1s-1 .45-1 1v4H1v6h6V6H5V2z"/><path d="M13 2c0-.55-.45-1-1-1s-1 .45-1 1v4H9v6h6V6h-2V2zM9 16c0 1.3.84 2.4 2 2.82V23h2v-4.18c1.16-.41 2-1.51 2-2.82v-2H9v2z"/><path d="M17 16c0 1.3.84 2.4 2 2.82V23h2v-4.18c1.16-.41 2-1.51 2-2.82v-2h-6v2zm4-10V2c0-.55-.45-1-1-1s-1 .45-1 1v4h-2v6h6V6h-2z"/>',
		'settings_input_hdmi': '<path d="M18 7V4c0-1.1-.9-2-2-2H8c-1.1 0-2 .9-2 2v3H5v6l3 6v3h8v-3l3-6V7h-1zM8 4h8v3h-2V5h-1v2h-2V5h-1v2H8V4z"/>',
		'settings_input_svideo': '<path d="M15 6.5c0-.83-.67-1.5-1.5-1.5h-3C9.67 5 9 5.67 9 6.5S9.67 8 10.5 8h3c.83 0 1.5-.67 1.5-1.5z"/><path d="M8.5 15c-.83 0-1.5.67-1.5 1.5S7.67 18 8.5 18s1.5-.67 1.5-1.5S9.33 15 8.5 15zM8 11.5c0-.83-.67-1.5-1.5-1.5S5 10.67 5 11.5 5.67 13 6.5 13 8 12.33 8 11.5z"/><path d="M12 21c-4.96 0-9-4.04-9-9s4.04-9 9-9 9 4.04 9 9-4.04 9-9 9zm0-20C5.93 1 1 5.93 1 12s4.93 11 11 11 11-4.93 11-11S18.07 1 12 1z"/><path d="M15.5 15c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5 1.5-.67 1.5-1.5-.67-1.5-1.5-1.5zm2-5c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5 1.5-.67 1.5-1.5-.67-1.5-1.5-1.5z"/>',
		'settings_overscan': '<path d="M14 16h-4l2.01 2.5L14 16zm-8-6l-2.5 2.01L6 14v-4zm12 0v4l2.5-1.99L18 10zm-5.99-4.5L10 8h4l-1.99-2.5z"/><path d="M21 19.01H3V4.99h18v14.02zM21 3H3c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z"/>',
		'settings_phone': '<path d="M20 15.5c-1.25 0-2.45-.2-3.57-.57-.35-.11-.74-.03-1.02.24l-2.2 2.2c-2.83-1.44-5.15-3.75-6.59-6.58l2.2-2.21c.28-.27.36-.66.25-1.01C8.7 6.45 8.5 5.25 8.5 4c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1 0 9.39 7.61 17 17 17 .55 0 1-.45 1-1v-3.5c0-.55-.45-1-1-1z"/><path d="M19 9v2h2V9h-2zm-2 0h-2v2h2V9zm-4 0h-2v2h2V9z"/>',
		'settings_power': '<path d="M13 2h-2v10h2V2z"/><path d="M16.56 4.44l-1.45 1.45C16.84 6.94 18 8.83 18 11c0 3.31-2.69 6-6 6s-6-2.69-6-6c0-2.17 1.16-4.06 2.88-5.12L7.44 4.44C5.36 5.88 4 8.28 4 11c0 4.42 3.58 8 8 8s8-3.58 8-8c0-2.72-1.36-5.12-3.44-6.56z"/><path d="M15 24h2v-2h-2v2zm-4 0h2v-2h-2v2zm-4 0h2v-2H7v2z"/>',
		'settings_remote': '<path d="M12 15c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3-6H9c-.55 0-1 .45-1 1v12c0 .55.45 1 1 1h6c.55 0 1-.45 1-1V10c0-.55-.45-1-1-1z"/><path d="M7.05 6.05l1.41 1.41C9.37 6.56 10.62 6 12 6s2.63.56 3.54 1.46l1.41-1.41C15.68 4.78 13.93 4 12 4c-1.93 0-3.68.78-4.95 2.05z"/><path d="M12 0C8.96 0 6.21 1.23 4.22 3.22l1.41 1.41C7.26 3.01 9.51 2 12 2s4.74 1.01 6.36 2.64l1.41-1.41C17.79 1.23 15.04 0 12 0z"/>',
		'settings_voice': '<path d="M12 13c1.66 0 2.99-1.34 2.99-3L15 4c0-1.66-1.34-3-3-3S9 2.34 9 4v6c0 1.66 1.34 3 3 3z"/><path d="M15 24h2v-2h-2v2zm-4 0h2v-2h-2v2zm-4 0h2v-2H7v2z"/><path d="M19 10h-1.7c0 3-2.54 5.1-5.3 5.1S6.7 13 6.7 10H5c0 3.41 2.72 6.23 6 6.72V20h2v-3.28c3.28-.49 6-3.31 6-6.72z"/>',
		'shop': '<path d="M16 6V4c0-1.11-.89-2-2-2h-4c-1.11 0-2 .89-2 2v2H2v13c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6h-6zm-6-2h4v2h-4V4zM9 18V9l7.5 4L9 18z"/>',
		'shop_two': '<path d="M3 9H1v11c0 1.11.89 2 2 2h14c1.11 0 2-.89 2-2H3V9z"/><path d="M12 15V8l5.5 3-5.5 4zm0-12h4v2h-4V3zm6 2V3c0-1.11-.89-2-2-2h-4c-1.11 0-2 .89-2 2v2H5v11c0 1.11.89 2 2 2h14c1.11 0 2-.89 2-2V5h-5z"/>',
		'shopping_basket': '<path d="M17.21 9l-4.38-6.56c-.19-.28-.51-.42-.83-.42-.32 0-.64.14-.83.43L6.79 9H2c-.55 0-1 .45-1 1 0 .09.01.18.04.27l2.54 9.27c.23.84 1 1.46 1.92 1.46h13c.92 0 1.69-.62 1.93-1.46l2.54-9.27L23 10c0-.55-.45-1-1-1h-4.79zM9 9l3-4.4L15 9H9zm3 8c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z"/>',
		'shopping_cart': '<path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2z"/><path d="M1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1z"/><path d="M17 18c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z"/>',
		'speaker_notes': '<path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM8 14H6v-2h2v2zm0-3H6V9h2v2zm0-3H6V6h2v2zm7 6h-5v-2h5v2zm3-3h-8V9h8v2zm0-3h-8V6h8v2z"/>',
		'speaker_notes_off': '<path d="M6 11V9l2 2H6zm2 3H6v-2h2v2zm2.54-3l-.54-.54L7.54 8 6 6.46 2.38 2.84 1.27 1.73 0 3l2.01 2.01L2 22l4-4h9l5.73 5.73L22 22.46 17.54 18l-7-7z"/><path d="M20 2H4.08L10 7.92V6h8v2h-7.92l1 1H18v2h-4.92l6.99 6.99C21.14 17.95 22 17.08 22 16V4c0-1.1-.9-2-2-2z"/>',
		'spellcheck': '<path d="M6.43 11L8.5 5.48 10.57 11H6.43zm6.02 5h2.09L9.43 3H7.57L2.46 16h2.09l1.12-3h5.64l1.14 3z"/><path d="M21.59 11.59l-8.09 8.09L9.83 16l-1.41 1.41 5.09 5.09L23 13l-1.41-1.41z"/>',
		'star_rate': '<path d="M12 14.3l3.71 2.7-1.42-4.36L18 10h-4.55L12 5.5 10.55 10H6l3.71 2.64L8.29 17z"/>',
		'stars': '<path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zm4.24 16L12 15.45 7.77 18l1.12-4.81-3.73-3.23 4.92-.42L12 5l1.92 4.53 4.92.42-3.73 3.23L16.23 18z"/>',
		'store': '<path d="M20 4H4v2h16V4z"/><path d="M12 18H6v-4h6v4zm9-4v-2l-1-5H4l-1 5v2h1v6h10v-6h4v6h2v-6h1z"/>',
		'subject': '<path d="M14 17H4v2h10v-2z"/><path d="M20 9H4v2h16V9z"/><path d="M4 15h16v-2H4v2z"/><path d="M4 5v2h16V5H4z"/>',
		'supervisor_account': '<path d="M16.5 12c1.38 0 2.49-1.12 2.49-2.5S17.88 7 16.5 7C15.12 7 14 8.12 14 9.5s1.12 2.5 2.5 2.5z"/><path d="M9 11c1.66 0 2.99-1.34 2.99-3S10.66 5 9 5C7.34 5 6 6.34 6 8s1.34 3 3 3z"/><path d="M16.5 14c-1.83 0-5.5.92-5.5 2.75V19h11v-2.25c0-1.83-3.67-2.75-5.5-2.75z"/><path d="M9 13c-2.33 0-7 1.17-7 3.5V19h7v-2.25c0-.85.33-2.34 2.37-3.47C10.5 13.1 9.66 13 9 13z"/>',
		'swap_horiz': '<path d="M6.99 11L3 15l3.99 4v-3H14v-2H6.99v-3z"/><path d="M21 9l-3.99-4v3H10v2h7.01v3L21 9z"/>',
		'swap_vert': '<path d="M16 17.01V10h-2v7.01h-3L15 21l4-3.99h-3z"/><path d="M9 3L5 6.99h3V14h2V6.99h3L9 3z"/>',
		'swap_vertial_circle': '<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zM6.5 9L10 5.5 13.5 9H11v4H9V9H6.5zm11 6L14 18.5 10.5 15H13v-4h2v4h2.5z"/>',
		'system_update_alt': '<path d="M12 16.5l4-4h-3v-9h-2v9H8l4 4z"/><path d="M21 3.5h-6v1.99h6v14.03H3V5.49h6V3.5H3c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2v-14c0-1.1-.9-2-2-2z"/>',
		'tab': '<path d="M21 3H3c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H3V5h10v4h8v10z"/>',
		'tab_unselected': '<path d="M1 9h2V7H1v2z"/><path d="M1 13h2v-2H1v2z"/><path d="M1 5h2V3c-1.1 0-2 .9-2 2z"/><path d="M9 21h2v-2H9v2z"/><path d="M1 17h2v-2H1v2z"/><path d="M3 21v-2H1c0 1.1.9 2 2 2z"/><path d="M21 3h-8v6h10V5c0-1.1-.9-2-2-2z"/><path d="M21 17h2v-2h-2v2z"/><path d="M9 5h2V3H9v2z"/><path d="M5 21h2v-2H5v2z"/><path d="M5 5h2V3H5v2z"/><path d="M21 21c1.1 0 2-.9 2-2h-2v2z"/><path d="M21 13h2v-2h-2v2z"/><path d="M13 21h2v-2h-2v2z"/><path d="M17 21h2v-2h-2v2z"/>',
		'theaters': '<path d="M18 3v2h-2V3H8v2H6V3H4v18h2v-2h2v2h8v-2h2v2h2V3h-2zM8 17H6v-2h2v2zm0-4H6v-2h2v2zm0-4H6V7h2v2zm10 8h-2v-2h2v2zm0-4h-2v-2h2v2zm0-4h-2V7h2v2z"/>',
		'thumb_down': '<path d="M15 3H6c-.83 0-1.54.5-1.84 1.22l-3.02 7.05c-.09.23-.14.47-.14.73v1.91l.01.01L1 14c0 1.1.9 2 2 2h6.31l-.95 4.57-.03.32c0 .41.17.79.44 1.06L9.83 23l6.59-6.59c.36-.36.58-.86.58-1.41V5c0-1.1-.9-2-2-2z"/><path d="M19 3v12h4V3h-4z"/>',
		'thumb_up': '<path d="M1 21h4V9H1v12z"/><path d="M23 10c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 1 7.59 7.59C7.22 7.95 7 8.45 7 9v10c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-1.91l-.01-.01L23 10z"/>',
		'thumbs_up_down': '<path d="M12 6c0-.55-.45-1-1-1H5.82l.66-3.18.02-.23c0-.31-.13-.59-.33-.8L5.38 0 .44 4.94C.17 5.21 0 5.59 0 6v6.5c0 .83.67 1.5 1.5 1.5h6.75c.62 0 1.15-.38 1.38-.91l2.26-5.29c.07-.17.11-.36.11-.55V6z"/><path d="M22.5 10h-6.75c-.62 0-1.15.38-1.38.91l-2.26 5.29c-.07.17-.11.36-.11.55V18c0 .55.45 1 1 1h5.18l-.66 3.18-.02.24c0 .31.13.59.33.8l.79.78 4.94-4.94c.27-.27.44-.65.44-1.06v-6.5c0-.83-.67-1.5-1.5-1.5z"/>',
		'timeline': '<path d="M23 8c0 1.1-.9 2-2 2-.18 0-.35-.02-.51-.07l-3.56 3.55c.05.16.07.34.07.52 0 1.1-.9 2-2 2s-2-.9-2-2c0-.18.02-.36.07-.52l-2.55-2.55c-.16.05-.34.07-.52.07s-.36-.02-.52-.07l-4.55 4.56c.05.16.07.33.07.51 0 1.1-.9 2-2 2s-2-.9-2-2 .9-2 2-2c.18 0 .35.02.51.07l4.56-4.55C8.02 9.36 8 9.18 8 9c0-1.1.9-2 2-2s2 .9 2 2c0 .18-.02.36-.07.52l2.55 2.55c.16-.05.34-.07.52-.07s.36.02.52.07l3.55-3.56C19.02 8.35 19 8.18 19 8c0-1.1.9-2 2-2s2 .9 2 2z"/>',
		'toc': '<path d="M3 9h14V7H3v2z"/><path d="M3 13h14v-2H3v2z"/><path d="M3 17h14v-2H3v2z"/><path d="M19 13h2v-2h-2v2zm0-6v2h2V7h-2zm0 10h2v-2h-2v2z"/>',
		'today': '<path d="M19 19H5V8h14v11zm0-16h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z"/><path d="M7 10h5v5H7z"/>',
		'toll': '<path d="M3 12c0-2.61 1.67-4.83 4-5.65V4.26C3.55 5.15 1 8.27 1 12s2.55 6.85 6 7.74v-2.09c-2.33-.82-4-3.04-4-5.65z"/>',
		'touch_app': '<path d="M9 11.24V7.5a2.5 2.5 0 0 1 5 0v3.74c1.21-.81 2-2.18 2-3.74C16 5.01 13.99 3 11.5 3S7 5.01 7 7.5c0 1.56.79 2.93 2 3.74z"/><path d="M18.84 15.87l-4.54-2.26c-.17-.07-.35-.11-.54-.11H13v-6c0-.83-.67-1.5-1.5-1.5S10 6.67 10 7.5v10.74l-3.43-.72c-.08-.01-.15-.03-.24-.03-.31 0-.59.13-.79.33l-.79.8 4.94 4.94c.27.27.65.44 1.06.44h6.79c.75 0 1.33-.55 1.44-1.28l.75-5.27c.01-.07.02-.14.02-.2 0-.62-.38-1.16-.91-1.38z"/>',
		'track_changes': '<path d="M19.07 4.93l-1.41 1.41C19.1 7.79 20 9.79 20 12c0 4.42-3.58 8-8 8s-8-3.58-8-8c0-4.08 3.05-7.44 7-7.93v2.02C8.16 6.57 6 9.03 6 12c0 3.31 2.69 6 6 6s6-2.69 6-6c0-1.66-.67-3.16-1.76-4.24l-1.41 1.41C15.55 9.9 16 10.9 16 12c0 2.21-1.79 4-4 4s-4-1.79-4-4c0-1.86 1.28-3.41 3-3.86v2.14c-.6.35-1 .98-1 1.72 0 1.1.9 2 2 2s2-.9 2-2c0-.74-.4-1.38-1-1.72V2h-1C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10c0-2.76-1.12-5.26-2.93-7.07z"/>',
		'translate': '<path d="M12.87 15.07l-2.54-2.51.03-.03c1.74-1.94 2.98-4.17 3.71-6.53H17V4h-7V2H8v2H1v1.99h11.17C11.5 7.92 10.44 9.75 9 11.35 8.07 10.32 7.3 9.19 6.69 8h-2c.73 1.63 1.73 3.17 2.98 4.56l-5.09 5.02L4 19l5-5 3.11 3.11.76-2.04z"/><path d="M15.88 17l1.62-4.33L19.12 17h-3.24zm2.62-7h-2L12 22h2l1.12-3h4.75L21 22h2l-4.5-12z"/>',
		'trending_down': '<path d="M16 18l2.29-2.29-4.88-4.88-4 4L2 7.41 3.41 6l6 6 4-4 6.3 6.29L22 12v6z"/>',
		'trending_flat': '<path d="M22 12l-4-4v3H3v2h15v3z"/>',
		'trending_up': '<path d="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6z"/>',
		'turned_in': '<path d="M17 3H7c-1.1 0-1.99.9-1.99 2L5 21l7-3 7 3V5c0-1.1-.9-2-2-2z"/>',
		'turned_in_not': '<path d="M17 3H7c-1.1 0-1.99.9-1.99 2L5 21l7-3 7 3V5c0-1.1-.9-2-2-2zm0 15l-5-2.18L7 18V5h10v13z"/>',
		'update': '<path d="M21 10.12h-6.78l2.74-2.82c-2.73-2.7-7.15-2.8-9.88-.1a6.875 6.875 0 0 0 0 9.79 7.02 7.02 0 0 0 9.88 0C18.32 15.65 19 14.08 19 12.1h2c0 1.98-.88 4.55-2.64 6.29-3.51 3.48-9.21 3.48-12.72 0-3.5-3.47-3.53-9.11-.02-12.58a8.987 8.987 0 0 1 12.65 0L21 3v7.12z"/><path d="M12.5 8v4.25l3.5 2.08-.72 1.21L11 13V8h1.5z"/>',
		'verified_user': '<path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z"/>',
		'view_agenda': '<path d="M20 13H3c-.55 0-1 .45-1 1v6c0 .55.45 1 1 1h17c.55 0 1-.45 1-1v-6c0-.55-.45-1-1-1z"/><path d="M20 3H3c-.55 0-1 .45-1 1v6c0 .55.45 1 1 1h17c.55 0 1-.45 1-1V4c0-.55-.45-1-1-1z"/>',
		'view_array': '<path d="M4 18h3V5H4v13z"/><path d="M18 5v13h3V5h-3z"/><path d="M8 18h9V5H8v13z"/>',
		'view_carousel': '<path d="M7 19h10V4H7v15z"/><path d="M2 17h4V6H2v11z"/><path d="M18 6v11h4V6h-4z"/>',
		'view_column': '<path d="M10 18h5V5h-5v13z"/><path d="M4 18h5V5H4v13z"/><path d="M16 5v13h5V5h-5z"/>',
		'view_day': '<path d="M2 21h19v-3H2v3z"/><path d="M20 8H3c-.55 0-1 .45-1 1v6c0 .55.45 1 1 1h17c.55 0 1-.45 1-1V9c0-.55-.45-1-1-1z"/><path d="M2 3v3h19V3H2z"/>',
		'view_headline': '<path d="M4 15h17v-2H4v2z"/><path d="M4 19h17v-2H4v2z"/><path d="M4 11h17V9H4v2z"/><path d="M4 5v2h17V5H4z"/>',
		'view_list': '<path d="M4 14h4v-4H4v4z"/><path d="M4 19h4v-4H4v4z"/><path d="M4 9h4V5H4v4z"/><path d="M9 14h12v-4H9v4z"/><path d="M9 19h12v-4H9v4z"/><path d="M9 5v4h12V5H9z"/>',
		'view_module': '<path d="M4 11h5V5H4v6z"/><path d="M4 18h5v-6H4v6z"/><path d="M10 18h5v-6h-5v6z"/><path d="M16 18h5v-6h-5v6z"/><path d="M10 11h5V5h-5v6z"/><path d="M16 5v6h5V5h-5z"/>',
		'view_quilt': '<path d="M10 18h5v-6h-5v6z"/><path d="M4 18h5V5H4v13z"/><path d="M16 18h5v-6h-5v6z"/><path d="M10 5v6h11V5H10z"/>',
		'view_stream': '<path d="M4 18h17v-6H4v6z"/><path d="M4 5v6h17V5H4z"/>',
		'view_week': '<path d="M6 5H3c-.55 0-1 .45-1 1v12c0 .55.45 1 1 1h3c.55 0 1-.45 1-1V6c0-.55-.45-1-1-1z"/><path d="M20 5h-3c-.55 0-1 .45-1 1v12c0 .55.45 1 1 1h3c.55 0 1-.45 1-1V6c0-.55-.45-1-1-1z"/><path d="M13 5h-3c-.55 0-1 .45-1 1v12c0 .55.45 1 1 1h3c.55 0 1-.45 1-1V6c0-.55-.45-1-1-1z"/>',
		'visibility': '<path d="M12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-12.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5z"/><path d="M12 9c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>',
		'visibility_off': '<path d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7z"/><path d="M7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zM2 4.27l2.28 2.28.46.46A11.804 11.804 0 0 0 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27z"/><path d="M11.84 9.02l3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z"/>',
		'watch_later': '<path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm4.2 14.2L11 13V7h1.5v5.2l4.5 2.7-.8 1.3z"/>',
		'work': '<path d="M20 6h-4V4c0-1.11-.89-2-2-2h-4c-1.11 0-2 .89-2 2v2H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-6 0h-4V4h4v2z"/>',
		'youtube_searched_for': '<path d="M17.01 14h-.8l-.27-.27c.98-1.14 1.57-2.61 1.57-4.23 0-3.59-2.91-6.5-6.5-6.5s-6.5 3-6.5 6.5H2l3.84 4 4.16-4H6.51C6.51 7 8.53 5 11.01 5s4.5 2.01 4.5 4.5c0 2.48-2.02 4.5-4.5 4.5-.65 0-1.26-.14-1.82-.38L7.71 15.1c.97.57 2.09.9 3.3.9 1.61 0 3.08-.59 4.22-1.57l.27.27v.79l5.01 4.99L22 19l-4.99-5z"/>',
		'zoom_in': '<path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/><path d="M12 10h-2v2H9v-2H7V9h2V7h1v2h2v1z"/>',
		'zoom_out': '<path d="M9.5 14C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14zm6 0h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5z"/><path d="M7 9h5v1H7z"/>',
		//
		// alert
		//
		'add_alert':'<path d="M10.01 21.01c0 1.1.89 1.99 1.99 1.99s1.99-.89 1.99-1.99h-3.98zm8.87-4.19V11c0-3.25-2.25-5.97-5.29-6.69v-.72C13.59 2.71 12.88 2 12 2s-1.59.71-1.59 1.59v.72C7.37 5.03 5.12 7.75 5.12 11v5.82L3 18.94V20h18v-1.06l-2.12-2.12zM16 13.01h-3v3h-2v-3H8V11h3V8h2v3h3v2.01z"/>',
		'error': '<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>',
		'error_outline':'<path d="M11 15h2v2h-2zm0-8h2v6h-2zm.99-5C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z"/>',
		'warning': '<path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"/>',
		//
		// av
		//
		'add_to_queue': '<path d="M21 17H3V5h18v12zm0-14H3c-1.11 0-2 .89-2 2v12a2 2 0 0 0 2 2h5v2h8v-2h5c1.1 0 1.99-.9 1.99-2L23 5a2 2 0 0 0-2-2z"/><path d="M16 10v2h-3v3h-2v-3H8v-2h3V7h2v3h3z"/>',
		'airplay': '<path d="M6 22h12l-6-6z"/><path d="M21 3H3c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h4v-2H3V5h18v12h-4v2h4c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z"/>',
		'album': '<path d="M12 16.5c-2.49 0-4.5-2.01-4.5-4.5S9.51 7.5 12 7.5s4.5 2.01 4.5 4.5-2.01 4.5-4.5 4.5zM12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"/><path d="M12 11c-.55 0-1 .45-1 1s.45 1 1 1 1-.45 1-1-.45-1-1-1z"/>',
		'art_track': '<path d="M22 13h-8v-2h8v2z"/><path d="M22 7h-8v2h8V7z"/><path d="M14 17h8v-2h-8v2z"/><path d="M10.5 15l-2.25-3-1.75 2.26-1.25-1.51L3.5 15h7zM12 9v6c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V9c0-1.1.9-2 2-2h6c1.1 0 2 .9 2 2z"/>',
		'av_timer': '<path d="M11 17c0 .55.45 1 1 1s1-.45 1-1-.45-1-1-1-1 .45-1 1z"/><path d="M11 3v4h2V5.08c3.39.49 6 3.39 6 6.92 0 3.87-3.13 7-7 7s-7-3.13-7-7c0-1.68.59-3.22 1.58-4.42L12 13l1.41-1.41-6.8-6.8v.02C4.42 6.45 3 9.05 3 12c0 4.97 4.02 9 9 9 4.97 0 9-4.03 9-9s-4.03-9-9-9h-1z"/><path d="M18 12c0-.55-.45-1-1-1s-1 .45-1 1 .45 1 1 1 1-.45 1-1z"/><path d="M6 12c0 .55.45 1 1 1s1-.45 1-1-.45-1-1-1-1 .45-1 1z"/>',
		'branding_watermark': '<path d="M21 3H3c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16h-9v-6h9v6z"/>',
		'call_to_action': '<path d="M21 3H3c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H3v-3h18v3z"/>',
		'closed_caption': '<path d="M19 4H5c-1.11 0-2 .9-2 2v12c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm-8 7H9.5v-.5h-2v3h2V13H11v1c0 .55-.45 1-1 1H7c-.55 0-1-.45-1-1v-4c0-.55.45-1 1-1h3c.55 0 1 .45 1 1v1zm7 0h-1.5v-.5h-2v3h2V13H18v1c0 .55-.45 1-1 1h-3c-.55 0-1-.45-1-1v-4c0-.55.45-1 1-1h3c.55 0 1 .45 1 1v1z"/>',
		'equalizer': '<path d="M10 20h4V4h-4v16z"/><path d="M4 20h4v-8H4v8z"/><path d="M16 9v11h4V9h-4z"/>',
		'explicit': '<path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-4 6h-4v2h4v2h-4v2h4v2H9V7h6v2z"/>',
		'fast_forward': '<path d="M4 18l8.5-6L4 6v12z"/><path d="M13 6v12l8.5-6L13 6z"/>',
		'fast_rewind': '<path d="M11 18V6l-8.5 6 8.5 6z"/><path d="M11.5 12l8.5 6V6l-8.5 6z"/>',
		'featured_play_list': '<path d="M21 3H3c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-9 8H3V9h9v2zm0-4H3V5h9v2z"/>',
		'featured_video': '<path d="M21 3H3c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-9 9H3V5h9v7z"/>',
		'fibre_dvr': '<path d="M17.5 10.5h2v1h-2zm-13 0h2v3h-2zM21 3H3c-1.11 0-2 .89-2 2v14c0 1.1.89 2 2 2h18c1.11 0 2-.9 2-2V5c0-1.11-.89-2-2-2zM8 13.5c0 .85-.65 1.5-1.5 1.5H3V9h3.5c.85 0 1.5.65 1.5 1.5v3zm4.62 1.5h-1.5L9.37 9h1.5l1 3.43 1-3.43h1.5l-1.75 6zM21 11.5c0 .6-.4 1.15-.9 1.4L21 15h-1.5l-.85-2H17.5v2H16V9h3.5c.85 0 1.5.65 1.5 1.5v1z"/>',
		'fiber_manual_record': '<circle cx="12" cy="12" r="8"/>',
		'fibre_new': '<path d="M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zM8.5 15H7.3l-2.55-3.5V15H3.5V9h1.25l2.5 3.5V9H8.5v6zm5-4.74H11v1.12h2.5v1.26H11v1.11h2.5V15h-4V9h4v1.26zm7 3.74c0 .55-.45 1-1 1h-4c-.55 0-1-.45-1-1V9h1.25v4.51h1.13V9.99h1.25v3.51h1.12V9h1.25v5z"/>',
		'fibre_pin': '<path d="M5.5 10.5h2v1h-2zM20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zM9 11.5c0 .85-.65 1.5-1.5 1.5h-2v2H4V9h3.5c.85 0 1.5.65 1.5 1.5v1zm3.5 3.5H11V9h1.5v6zm7.5 0h-1.2l-2.55-3.5V15H15V9h1.25l2.5 3.5V9H20v6z"/>',
		'fibre_smart_record': '<path d="M17 4.26v2.09c2.33.82 4 3.04 4 5.65s-1.67 4.83-4 5.65v2.09c3.45-.89 6-4.01 6-7.74s-2.55-6.85-6-7.74z"/>',
		'forward_10': '<path d="M4 13c0 4.4 3.6 8 8 8s8-3.6 8-8h-2c0 3.3-2.7 6-6 6s-6-2.7-6-6 2.7-6 6-6v4l5-5-5-5v4c-4.4 0-8 3.6-8 8z"/><path d="M10.8 16H10v-3.3L9 13v-.7l1.8-.6h.1V16z"/><path d="M14.3 13.4v-.5s-.1-.2-.1-.3c0-.1-.1-.1-.2-.2s-.2-.1-.3-.1c-.1 0-.2 0-.3.1l-.2.2s-.1.2-.1.3v2s.1.2.1.3c0 .1.1.1.2.2s.2.1.3.1c.1 0 .2 0 .3-.1l.2-.2s.1-.2.1-.3v-1.5zm.8.8c0 .3 0 .6-.1.8l-.3.6s-.3.3-.5.3-.4.1-.6.1c-.2 0-.4 0-.6-.1-.2-.1-.3-.2-.5-.3-.2-.1-.2-.3-.3-.6-.1-.3-.1-.5-.1-.8v-.7c0-.3 0-.6.1-.8l.3-.6s.3-.3.5-.3.4-.1.6-.1c.2 0 .4 0 .6.1.2.1.3.2.5.3.2.1.2.3.3.6.1.3.1.5.1.8v.7z"/>',
		'forward_30': '<path d="M9.6 13.5h.4c.2 0 .4-.1.5-.2.1-.1.2-.2.2-.4v-.2s-.1-.1-.1-.2-.1-.1-.2-.1h-.5s-.1.1-.2.1-.1.1-.1.2v.2h-1c0-.2 0-.3.1-.5s.2-.3.3-.4c.1-.1.3-.2.4-.2.1 0 .4-.1.5-.1.2 0 .4 0 .6.1.2.1.3.1.5.2s.2.2.3.4c.1.2.1.3.1.5v.3s-.1.2-.1.3c0 .1-.1.2-.2.2s-.2.1-.3.2c.2.1.4.2.5.4.1.2.2.4.2.6 0 .2 0 .4-.1.5-.1.1-.2.3-.3.4-.1.1-.3.2-.5.2s-.4.1-.6.1c-.2 0-.4 0-.5-.1-.1-.1-.3-.1-.5-.2s-.2-.2-.3-.4c-.1-.2-.1-.4-.1-.6h.8v.2s.1.1.1.2.1.1.2.1h.5s.1-.1.2-.1.1-.1.1-.2v-.5s-.1-.1-.1-.2-.1-.1-.2-.1h-.6v-.7z"/><path d="M14.4 13.4v-.5s-.1-.2-.1-.3c0-.1-.1-.1-.2-.2s-.2-.1-.3-.1c-.1 0-.2 0-.3.1l-.2.2s-.1.2-.1.3v2s.1.2.1.3c0 .1.1.1.2.2s.2.1.3.1c.1 0 .2 0 .3-.1l.2-.2s.1-.2.1-.3v-1.5zm.9.8c0 .3 0 .6-.1.8l-.3.6s-.3.3-.5.3-.4.1-.6.1c-.2 0-.4 0-.6-.1-.2-.1-.3-.2-.5-.3-.2-.1-.2-.3-.3-.6-.1-.3-.1-.5-.1-.8v-.7c0-.3 0-.6.1-.8l.3-.6s.3-.3.5-.3.4-.1.6-.1c.2 0 .4 0 .6.1.2.1.3.2.5.3.2.1.2.3.3.6.1.3.1.5.1.8v.7z"/><path d="M4 13c0 4.4 3.6 8 8 8s8-3.6 8-8h-2c0 3.3-2.7 6-6 6s-6-2.7-6-6 2.7-6 6-6v4l5-5-5-5v4c-4.4 0-8 3.6-8 8z"/>',
		'forward_5': '<path d="M4 13c0 4.4 3.6 8 8 8s8-3.6 8-8h-2c0 3.3-2.7 6-6 6s-6-2.7-6-6 2.7-6 6-6v4l5-5-5-5v4c-4.4 0-8 3.6-8 8z"/><path d="M10.7 13.9l.2-2.2h2.4v.7h-1.7l-.1.9s.1 0 .1-.1.1 0 .1-.1.1 0 .2 0h.2c.2 0 .4 0 .5.1.1.1.3.2.4.3.1.1.2.3.3.5.1.2.1.4.1.6 0 .2 0 .4-.1.5-.1.1-.1.3-.3.5-.2.2-.3.2-.5.3-.2.1-.4.1-.6.1-.2 0-.4 0-.5-.1-.1-.1-.3-.1-.5-.2s-.2-.2-.3-.4c-.1-.2-.1-.3-.1-.5h.8c0 .2.1.3.2.4.1.1.2.1.4.1.1 0 .2 0 .3-.1l.2-.2s.1-.2.1-.3v-.6l-.1-.2-.2-.2s-.2-.1-.3-.1h-.2s-.1 0-.2.1-.1 0-.1.1-.1.1-.1.1h-.6z"/>',
		'games': '<path d="M15 7.5V2H9v5.5l3 3 3-3z"/><path d="M7.5 9H2v6h5.5l3-3-3-3z"/><path d="M9 16.5V22h6v-5.5l-3-3-3 3z"/><path d="M16.5 9l-3 3 3 3H22V9h-5.5z"/>',
		'hd': '<path d="M19 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-8 12H9.5v-2h-2v2H6V9h1.5v2.5h2V9H11v6zm2-6h4c.55 0 1 .45 1 1v4c0 .55-.45 1-1 1h-4V9zm1.5 4.5h2v-3h-2v3z"/>',
		'hearing': '<path d="M17 20c-.29 0-.56-.06-.76-.15-.71-.37-1.21-.88-1.71-2.38-.51-1.56-1.47-2.29-2.39-3-.79-.61-1.61-1.24-2.32-2.53C9.29 10.98 9 9.93 9 9c0-2.8 2.2-5 5-5s5 2.2 5 5h2c0-3.93-3.07-7-7-7S7 5.07 7 9c0 1.26.38 2.65 1.07 3.9.91 1.65 1.98 2.48 2.85 3.15.81.62 1.39 1.07 1.71 2.05.6 1.82 1.37 2.84 2.73 3.55.51.23 1.07.35 1.64.35 2.21 0 4-1.79 4-4h-2c0 1.1-.9 2-2 2z"/><path d="M7.64 2.64L6.22 1.22C4.23 3.21 3 5.96 3 9s1.23 5.79 3.22 7.78l1.41-1.41C6.01 13.74 5 11.49 5 9s1.01-4.74 2.64-6.36z"/><path d="M11.5 9c0 1.38 1.12 2.5 2.5 2.5s2.5-1.12 2.5-2.5-1.12-2.5-2.5-2.5-2.5 1.12-2.5 2.5z"/>',
		'high_quality': '<path d="M19 4H5c-1.11 0-2 .9-2 2v12c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm-8 11H9.5v-2h-2v2H6V9h1.5v2.5h2V9H11v6zm7-1c0 .55-.45 1-1 1h-.75v1.5h-1.5V15H14c-.55 0-1-.45-1-1v-4c0-.55.45-1 1-1h3c.55 0 1 .45 1 1v4zm-3.5-.5h2v-3h-2v3z"/>',
		'my_library_add': '<path d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6z"/><path d="M19 11h-4v4h-2v-4H9V9h4V5h2v4h4v2zm1-9H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/>',
		'my_library_books': '<path d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6z"/><path d="M19 7H9V5h10v2zm-4 8H9v-2h6v2zm4-4H9V9h10v2zm1-9H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/>',
		'my_library_music': '<path d="M18 7h-3v5.5a2.5 2.5 0 0 1-5 0 2.5 2.5 0 0 1 2.5-2.5c.57 0 1.08.19 1.5.51V5h4v2zm2-5H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/><path d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6z"/>',
		'loop': '<path d="M12 4V1L8 5l4 4V6c3.31 0 6 2.69 6 6 0 1.01-.25 1.97-.7 2.8l1.46 1.46C19.54 15.03 20 13.57 20 12c0-4.42-3.58-8-8-8z"/><path d="M12 18c-3.31 0-6-2.69-6-6 0-1.01.25-1.97.7-2.8L5.24 7.74C4.46 8.97 4 10.43 4 12c0 4.42 3.58 8 8 8v3l4-4-4-4v3z"/>',
		'mic': '<path d="M12 14c1.66 0 2.99-1.34 2.99-3L15 5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"/><path d="M17.3 11c0 3-2.54 5.1-5.3 5.1S6.7 14 6.7 11H5c0 3.41 2.72 6.23 6 6.72V21h2v-3.28c3.28-.48 6-3.3 6-6.72h-1.7z"/>',
		'mic_none': '<path d="M10.8 4.9c0-.66.54-1.2 1.2-1.2.66 0 1.2.54 1.2 1.2l-.01 6.2c0 .66-.53 1.2-1.19 1.2-.66 0-1.2-.54-1.2-1.2V4.9zM12 14c1.66 0 2.99-1.34 2.99-3L15 5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"/><path d="M17.3 11c0 3-2.54 5.1-5.3 5.1S6.7 14 6.7 11H5c0 3.41 2.72 6.23 6 6.72V21h2v-3.28c3.28-.48 6-3.3 6-6.72h-1.7z"/>',
		'mic_off': '<path d="M19 11h-1.7c0 .74-.16 1.43-.43 2.05l1.23 1.23c.56-.98.9-2.09.9-3.28z"/><path d="M14.98 11.17c0-.06.02-.11.02-.17V5c0-1.66-1.34-3-3-3S9 3.34 9 5v.18l5.98 5.99z"/><path d="M4.27 3L3 4.27l6.01 6.01V11c0 1.66 1.33 3 2.99 3 .22 0 .44-.03.65-.08l1.66 1.66c-.71.33-1.5.52-2.31.52-2.76 0-5.3-2.1-5.3-5.1H5c0 3.41 2.72 6.23 6 6.72V21h2v-3.28c.91-.13 1.77-.45 2.54-.9L19.73 21 21 19.73 4.27 3z"/>',
		'movie': '<path d="M18 4l2 4h-3l-2-4h-2l2 4h-3l-2-4H8l2 4H7L5 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V4h-4z"/>',
		'music_video': '<path d="M21 19H3V5h18v14zm0-16H3c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z"/><path d="M8 15c0-1.66 1.34-3 3-3 .35 0 .69.07 1 .18V6h5v2h-3v7.03A3.003 3.003 0 0 1 11 18c-1.66 0-3-1.34-3-3z"/>',
		'new_releases': '<path d="M23 12l-2.44-2.78.34-3.68-3.61-.82-1.89-3.18L12 3 8.6 1.54 6.71 4.72l-3.61.81.34 3.68L1 12l2.44 2.78-.34 3.69 3.61.82 1.89 3.18L12 21l3.4 1.46 1.89-3.18 3.61-.82-.34-3.68L23 12zm-10 5h-2v-2h2v2zm0-4h-2V7h2v6z"/>',
		'not_interested': '<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8 0-1.85.63-3.55 1.69-4.9L16.9 18.31C15.55 19.37 13.85 20 12 20zm6.31-3.1L7.1 5.69C8.45 4.63 10.15 4 12 4c4.42 0 8 3.58 8 8 0 1.85-.63 3.55-1.69 4.9z"/>',
		'note': '<path d="M22 10l-6-6H4c-1.1 0-2 .9-2 2v12.01c0 1.1.9 1.99 2 1.99l16-.01c1.1 0 2-.89 2-1.99v-8zm-7-4.5l5.5 5.5H15V5.5z"/>',
		'pause': '<path d="M6 19h4V5H6v14z"/><path d="M14 5v14h4V5h-4z"/>',
		'pause_circle_filled': '<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z"/>',
		'pause_circle_outline': '<path d="M9 16h2V8H9v8z"/><path d="M12 20c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm0-18C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"/><path d="M13 16h2V8h-2v8z"/>',
		'play_arrow': '<path d="M8 5v14l11-7z"/>',
		'play_circle_fill': '<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z"/>',
		'play_circle_outline': '<path d="M10 16.5l6-4.5-6-4.5v9z"/><path d="M12 20c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm0-18C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"/>',
		'playlist_add': '<path d="M14 10H2v2h12v-2z"/><path d="M14 6H2v2h12V6z"/><path d="M18 14v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4z"/><path d="M2 16h8v-2H2v2z"/>',
		'playlist_add_check': '<path d="M14 10H2v2h12v-2z"/><path d="M14 6H2v2h12V6z"/><path d="M2 16h8v-2H2v2z"/><path d="M21.5 11.5L23 13l-6.99 7-4.51-4.5L13 14l3.01 3 5.49-5.5z"/>',
		'playlist_play': '<path d="M19 9H2v2h17V9z"/><path d="M19 5H2v2h17V5z"/><path d="M2 15h13v-2H2v2z"/><path d="M17 13v6l5-3-5-3z"/>',
		'queue': '<path d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6z"/><path d="M19 11h-4v4h-2v-4H9V9h4V5h2v4h4v2zm1-9H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/>',
		'queue_music': '<path d="M15 6H3v2h12V6z"/><path d="M15 10H3v2h12v-2z"/><path d="M3 16h8v-2H3v2z"/><path d="M17 6v8.18c-.31-.11-.65-.18-1-.18-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3V8h3V6h-5z"/>',
		'queue_play_next': '<path d="M21 3H3c-1.11 0-2 .89-2 2v12a2 2 0 0 0 2 2h5v2h8v-2h2v-2H3V5h18v8h2V5a2 2 0 0 0-2-2z"/><path d="M13 10V7h-2v3H8v2h3v3h2v-3h3v-2h-3z"/><path d="M24 18l-4.5 4.5L18 21l3-3-3-3 1.5-1.5L24 18z"/>',
		'radio': '<path d="M3.24 6.15C2.51 6.43 2 7.17 2 8v12c0 1.1.89 2 2 2h16c1.11 0 2-.9 2-2V8c0-1.11-.89-2-2-2H8.3l8.26-3.34L15.88 1 3.24 6.15zM7 20c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm13-8h-2v-2h-2v2H4V8h16v4z"/>',
		'recent_actors': '<path d="M17 19h2V5h-2v14zm4-14v14h2V5h-2z"/><path d="M12.5 17h-9v-.75c0-1.5 3-2.25 4.5-2.25s4.5.75 4.5 2.25V17zM8 7.75c1.24 0 2.25 1.01 2.25 2.25S9.24 12.25 8 12.25 5.75 11.24 5.75 10 6.76 7.75 8 7.75zM14 5H2c-.55 0-1 .45-1 1v12c0 .55.45 1 1 1h12c.55 0 1-.45 1-1V6c0-.55-.45-1-1-1z"/>',
		'remove_from_queue': '<path d="M21 17H3V5h18v12zm0-14H3c-1.11 0-2 .89-2 2v12a2 2 0 0 0 2 2h5v2h8v-2h5c1.1 0 1.99-.9 1.99-2L23 5a2 2 0 0 0-2-2z"/><path d="M16 10v2H8v-2h8z"/>',
		'repeat': '<path d="M7 7h10v3l4-4-4-4v3H5v6h2V7z"/><path d="M17 17H7v-3l-4 4 4 4v-3h12v-6h-2v4z"/>',
		'repeat_one': '<path d="M7 7h10v3l4-4-4-4v3H5v6h2V7z"/><path d="M17 17H7v-3l-4 4 4 4v-3h12v-6h-2v4z"/><path d="M13 15V9h-1l-2 1v1h1.5v4H13z"/>',
		'replay': '<path d="M12 5V1L7 6l5 5V7c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6H4c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8z"/>',
		'replay_10': '<path d="M12 5V1L7 6l5 5V7c3.3 0 6 2.7 6 6s-2.7 6-6 6-6-2.7-6-6H4c0 4.4 3.6 8 8 8s8-3.6 8-8-3.6-8-8-8z"/><path d="M10.9 16H10v-3.3L9 13v-.7l1.8-.6h.1V16z"/><path d="M14.3 13.4v-.5s-.1-.2-.1-.3c0-.1-.1-.1-.2-.2s-.2-.1-.3-.1c-.1 0-.2 0-.3.1l-.2.2s-.1.2-.1.3v2s.1.2.1.3c0 .1.1.1.2.2s.2.1.3.1c.1 0 .2 0 .3-.1l.2-.2s.1-.2.1-.3v-1.5zm.9.8c0 .3 0 .6-.1.8l-.3.6s-.3.3-.5.3-.4.1-.6.1c-.2 0-.4 0-.6-.1-.2-.1-.3-.2-.5-.3-.2-.1-.2-.3-.3-.6-.1-.3-.1-.5-.1-.8v-.7c0-.3 0-.6.1-.8l.3-.6s.3-.3.5-.3.4-.1.6-.1c.2 0 .4 0 .6.1.2.1.3.2.5.3.2.1.2.3.3.6.1.3.1.5.1.8v.7z"/>',
		'replay_30': '<path d="M12 5V1L7 6l5 5V7c3.3 0 6 2.7 6 6s-2.7 6-6 6-6-2.7-6-6H4c0 4.4 3.6 8 8 8s8-3.6 8-8-3.6-8-8-8z"/><path d="M9.6 13.5h.4c.2 0 .4-.1.5-.2.1-.1.2-.2.2-.4v-.2s-.1-.1-.1-.2-.1-.1-.2-.1h-.5s-.1.1-.2.1-.1.1-.1.2v.2h-1c0-.2 0-.3.1-.5s.2-.3.3-.4c.1-.1.3-.2.4-.2.1 0 .4-.1.5-.1.2 0 .4 0 .6.1.2.1.3.1.5.2s.2.2.3.4c.1.2.1.3.1.5v.3s-.1.2-.1.3c0 .1-.1.2-.2.2s-.2.1-.3.2c.2.1.4.2.5.4.1.2.2.4.2.6 0 .2 0 .4-.1.5-.1.1-.2.3-.3.4-.1.1-.3.2-.5.2s-.4.1-.6.1c-.2 0-.4 0-.5-.1-.1-.1-.3-.1-.5-.2s-.2-.2-.3-.4c-.1-.2-.1-.4-.1-.6h.8v.2s.1.1.1.2.1.1.2.1h.5s.1-.1.2-.1.1-.1.1-.2v-.5s-.1-.1-.1-.2-.1-.1-.2-.1h-.6v-.7z"/><path d="M14.5 13.4v-.5c0-.1-.1-.2-.1-.3 0-.1-.1-.1-.2-.2s-.2-.1-.3-.1c-.1 0-.2 0-.3.1l-.2.2s-.1.2-.1.3v2s.1.2.1.3c0 .1.1.1.2.2s.2.1.3.1c.1 0 .2 0 .3-.1l.2-.2s.1-.2.1-.3v-1.5zm.8.8c0 .3 0 .6-.1.8l-.3.6s-.3.3-.5.3-.4.1-.6.1c-.2 0-.4 0-.6-.1-.2-.1-.3-.2-.5-.3-.2-.1-.2-.3-.3-.6-.1-.3-.1-.5-.1-.8v-.7c0-.3 0-.6.1-.8l.3-.6s.3-.3.5-.3.4-.1.6-.1c.2 0 .4 0 .6.1.2.1.3.2.5.3.2.1.2.3.3.6.1.3.1.5.1.8v.7z"/>',
		'replay_5': '<path d="M12 5V1L7 6l5 5V7c3.3 0 6 2.7 6 6s-2.7 6-6 6-6-2.7-6-6H4c0 4.4 3.6 8 8 8s8-3.6 8-8-3.6-8-8-8z"/><path d="M10.7 13.9l.2-2.2h2.4v.7h-1.7l-.1.9s.1 0 .1-.1.1 0 .1-.1.1 0 .2 0h.2c.2 0 .4 0 .5.1.1.1.3.2.4.3.1.1.2.3.3.5.1.2.1.4.1.6 0 .2 0 .4-.1.5-.1.1-.1.3-.3.5-.2.2-.3.2-.4.3-.1.1-.4.1-.6.1-.2 0-.4 0-.5-.1-.1-.1-.3-.1-.5-.2s-.2-.2-.3-.4c-.1-.2-.1-.3-.1-.5h.8c0 .2.1.3.2.4.1.1.2.1.4.1.1 0 .2 0 .3-.1l.2-.2s.1-.2.1-.3v-.6l-.1-.2-.2-.2s-.2-.1-.3-.1h-.2s-.1 0-.2.1-.1 0-.1.1-.1.1-.1.1h-.7z"/>',
		'shuffle': '<path d="M10.59 9.17L5.41 4 4 5.41l5.17 5.17 1.42-1.41z"/><path d="M14.5 4l2.04 2.04L4 18.59 5.41 20 17.96 7.46 20 9.5V4h-5.5z"/><path d="M14.83 13.41l-1.41 1.41 3.13 3.13L14.5 20H20v-5.5l-2.04 2.04-3.13-3.13z"/>',
		'skip_next': '<path d="M6 18l8.5-6L6 6v12z"/><path d="M16 6v12h2V6h-2z"/>',
		'skip_previous': '<path d="M6 6h2v12H6z"/><path d="M9.5 12l8.5 6V6z"/>',
		'slow_motion_video': '<path d="M13.05 9.79L10 7.5v9l3.05-2.29L16 12z"/><path d="M13.05 9.79L10 7.5v9l3.05-2.29L16 12z"/><path d="M13.05 9.79L10 7.5v9l3.05-2.29L16 12z"/><path d="M11 4.07V2.05c-2.01.2-3.84 1-5.32 2.21L7.1 5.69A7.941 7.941 0 0 1 11 4.07z"/><path d="M5.69 7.1L4.26 5.68A9.949 9.949 0 0 0 2.05 11h2.02c.18-1.46.76-2.79 1.62-3.9z"/><path d="M4.07 13H2.05c.2 2.01 1 3.84 2.21 5.32l1.43-1.43A7.868 7.868 0 0 1 4.07 13z"/><path d="M5.68 19.74A9.981 9.981 0 0 0 11 21.95v-2.02a7.941 7.941 0 0 1-3.9-1.62l-1.42 1.43z"/><path d="M22 12c0 5.16-3.92 9.42-8.95 9.95v-2.02C16.97 19.41 20 16.05 20 12s-3.03-7.41-6.95-7.93V2.05C18.08 2.58 22 6.84 22 12z"/>',
		'snooze': '<path d="M7.88 3.39L6.6 1.86 2 5.71l1.29 1.53 4.59-3.85z"/><path d="M22 5.72l-4.6-3.86-1.29 1.53 4.6 3.86L22 5.72z"/><path d="M12 20c-3.87 0-7-3.13-7-7s3.13-7 7-7 7 3.13 7 7-3.13 7-7 7zm0-16c-4.97 0-9 4.03-9 9s4.02 9 9 9c4.97 0 9-4.03 9-9s-4.03-9-9-9z"/><path d="M9 11h3.63L9 15.2V17h6v-2h-3.63L15 10.8V9H9v2z"/>',
		'sort_by_alpha': '<path d="M14.94 4.66h-4.72l2.36-2.36z"/><path d="M10.25 19.37h4.66l-2.33 2.33z"/><path d="M4.97 13.64l1.94-5.18 1.94 5.18H4.97zM6.1 6.27L1.6 17.73h1.84l.92-2.45h5.11l.92 2.45h1.84L7.74 6.27H6.1z"/><path d="M15.73 16.14h6.12v1.59h-8.53v-1.29l5.92-8.56h-5.88v-1.6h8.3v1.26l-5.93 8.6z"/>',
		'stop': '<path d="M6 6h12v12H6z"/>',
		'subscriptions': '<path d="M20 8H4V6h16v2z"/><path d="M18 2H6v2h12V2z"/><path d="M16 16l-6-3.27v6.53L16 16zm6-4v8c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2v-8c0-1.1.9-2 2-2h16c1.1 0 2 .9 2 2z"/>',
		'subtitles': '<path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zM4 12h4v2H4v-2zm10 6H4v-2h10v2zm6 0h-4v-2h4v2zm0-4H10v-2h10v2z"/>',
		'surround_sound': '<path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zM7.76 16.24l-1.41 1.41C4.78 16.1 4 14.05 4 12c0-2.05.78-4.1 2.34-5.66l1.41 1.41C6.59 8.93 6 10.46 6 12s.59 3.07 1.76 4.24zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm5.66 1.66l-1.41-1.41C17.41 15.07 18 13.54 18 12s-.59-3.07-1.76-4.24l1.41-1.41C19.22 7.9 20 9.95 20 12c0 2.05-.78 4.1-2.34 5.66zM12 10c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>',
		'video_call': ' <path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4zM14 13h-3v3H9v-3H6v-2h3V8h2v3h3v2z"/>',
		'video_label': '<path d="M21 3H3c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 13H3V5h18v11z"/>',
		'video_library': '<path d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6z"/><path d="M12 14.5v-9l6 4.5-6 4.5zM20 2H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/>',
		'videocam': '<path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z"/>',
		'videocam_off': '<path d="M21 6.5l-4 4V7c0-.55-.45-1-1-1H9.82L21 17.18V6.5z"/><path d="M3.27 2L2 3.27 4.73 6H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.21 0 .39-.08.54-.18L19.73 21 21 19.73 3.27 2z"/>',
		'volume_down': '<path d="M18.5 12A4.5 4.5 0 0 0 16 7.97v8.05c1.48-.73 2.5-2.25 2.5-4.02z"/><path d="M5 9v6h4l5 5V4L9 9H5z"/>',
		'volume_mute': '<path d="M7 9v6h4l5 5V4l-5 5H7z"/>',
		'volume_off': '<path d="M16.5 12A4.5 4.5 0 0 0 14 7.97v2.21l2.45 2.45c.03-.2.05-.41.05-.63z"/><path d="M19 12c0 .94-.2 1.82-.54 2.64l1.51 1.51A8.796 8.796 0 0 0 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71z"/><path d="M4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06a8.99 8.99 0 0 0 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3z"/><path d="M12 4L9.91 6.09 12 8.18V4z"/>',
		'volume_up': '<path d="M3 9v6h4l5 5V4L7 9H3z"/><path d="M16.5 12A4.5 4.5 0 0 0 14 7.97v8.05c1.48-.73 2.5-2.25 2.5-4.02z"/><path d="M14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77 0-4.28-2.99-7.86-7-8.77z"/>',
		'web': '<path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm-5 14H4v-4h11v4zm0-5H4V9h11v4zm5 5h-4V9h4v9z"/>',
		'web_asset': '<path d="M19 4H5c-1.11 0-2 .9-2 2v12c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.89-2-2-2zm0 14H5V8h14v10z" />',
		//
		// communication
		//
		'business': '<path d="M20 19h-8v-2h2v-2h-2v-2h2v-2h-2V9h8v10zM10 7H8V5h2v2zm0 4H8V9h2v2zm0 4H8v-2h2v2zm0 4H8v-2h2v2zM6 7H4V5h2v2zm0 4H4V9h2v2zm0 4H4v-2h2v2zm0 4H4v-2h2v2zm6-12V3H2v18h20V7H12z"/><path d="M18 11h-2v2h2v-2z"/><path d="M18 15h-2v2h2v-2z"/>',
		'call': '<path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>',
		'call_end': '<path d="M12 9c-1.6 0-3.15.25-4.6.72v3.1c0 .39-.23.74-.56.9-.98.49-1.87 1.12-2.66 1.85-.18.18-.43.28-.7.28-.28 0-.53-.11-.71-.29L.29 13.08c-.18-.17-.29-.42-.29-.7 0-.28.11-.53.29-.71C3.34 8.78 7.46 7 12 7s8.66 1.78 11.71 4.67c.18.18.29.43.29.71 0 .28-.11.53-.29.71l-2.48 2.48c-.18.18-.43.29-.71.29-.27 0-.52-.11-.7-.28-.79-.74-1.69-1.36-2.67-1.85-.33-.16-.56-.5-.56-.9v-3.1C15.15 9.25 13.6 9 12 9z"/>',
		'call_made': '<path d="M9 5v2h6.59L4 18.59 5.41 20 17 8.41V15h2V5z"/>',
		'call_merge': '<path d="M17 20.41L18.41 19 15 15.59 13.59 17 17 20.41z"/><path d="M7.5 8H11v5.59L5.59 19 7 20.41l6-6V8h3.5L12 3.5 7.5 8z"/>',
		'call_missed': '<path d="M19.59 7L12 14.59 6.41 9H11V7H3v8h2v-4.59l7 7 9-9z"/>',
		'call_missed_outgoing':'<path d="M3 8.41l9 9 7-7V15h2V7h-8v2h4.59L12 14.59 4.41 7 3 8.41z"/>',
		'call_received': '<path d="M20 5.41L18.59 4 7 15.59V9H5v10h10v-2H8.41z"/>',
		'call_split': '<path d="M14 4l2.29 2.29-2.88 2.88 1.42 1.42 2.88-2.88L20 10V4z"/><path d="M10 4H4v6l2.29-2.29 4.71 4.7V20h2v-8.41l-5.29-5.3z"/>',
		'chat': '<path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 9h12v2H6V9zm8 5H6v-2h8v2zm4-6H6V6h12v2z"/>',
		'chat_bubble': '<path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/>',
		'chat_bubble_outline': '<path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z"/>',
		'clear_all': '<path d="M5 13h14v-2H5v2z"/><path d="M3 17h14v-2H3v2z"/><path d="M7 7v2h14V7H7z"/>',
		'comment': '<path d="M21.99 4c0-1.1-.89-2-1.99-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14l4 4-.01-18zM18 14H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z"/>',
		'contact_mail':'<path d="M21 8V7l-3 2-3-2v1l3 2 3-2zm1-5H2C.9 3 0 3.9 0 5v14c0 1.1.9 2 2 2h20c1.1 0 1.99-.9 1.99-2L24 5c0-1.1-.9-2-2-2zM8 6c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm6 12H2v-1c0-2 4-3.1 6-3.1s6 1.1 6 3.1v1zm8-6h-8V6h8v6z"/>',
		'contact_phone':'<path d="M22 3H2C.9 3 0 3.9 0 5v14c0 1.1.9 2 2 2h20c1.1 0 1.99-.9 1.99-2L24 5c0-1.1-.9-2-2-2zM8 6c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm6 12H2v-1c0-2 4-3.1 6-3.1s6 1.1 6 3.1v1zm3.85-4h1.64L21 16l-1.99 1.99c-1.31-.98-2.28-2.38-2.73-3.99-.18-.64-.28-1.31-.28-2s.1-1.36.28-2c.45-1.62 1.42-3.01 2.73-3.99L21 8l-1.51 2h-1.64c-.22.63-.35 1.3-.35 2s.13 1.37.35 2z"/>',
		'contacts': '<path d="M20 0H4v2h16V0z"/><path d="M4 24h16v-2H4v2z"/><path d="M17 17H7v-1.5c0-1.67 3.33-2.5 5-2.5s5 .83 5 2.5V17zM12 6.75c1.24 0 2.25 1.01 2.25 2.25s-1.01 2.25-2.25 2.25S9.75 10.24 9.75 9 10.76 6.75 12 6.75zM20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2z"/>',
		'dialer_sip': '<path d="M20 5h-1V4h1v1zm-2-2v5h1V6h2V3h-3zm-3 2h-2V4h2V3h-3v3h2v1h-2v1h3V5zm2-2h-1v5h1V3z"/><path d="M20 15.5c-1.25 0-2.45-.2-3.57-.57-.35-.11-.74-.03-1.01.24l-2.2 2.2c-2.83-1.44-5.15-3.75-6.59-6.59l2.2-2.21c.27-.26.35-.65.24-1C8.7 6.45 8.5 5.25 8.5 4c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1 0 9.39 7.61 17 17 17 .55 0 1-.45 1-1v-3.5c0-.55-.45-1-1-1z"/>',
		'dialpad': '<path d="M12 19c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/><path d="M6 13c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0-6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0-6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/><path d="M18 7c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0-8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2z"/><path d="M12 1c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>',
		'email': '<path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>',
		'forum': '<path d="M21 6h-2v9H6v2c0 .55.45 1 1 1h11l4 4V7c0-.55-.45-1-1-1z"/><path d="M17 12V3c0-.55-.45-1-1-1H3c-.55 0-1 .45-1 1v14l4-4h10c.55 0 1-.45 1-1z"/>',
		'import_contacts': '<path d="M21 5c-1.11-.35-2.33-.5-3.5-.5-1.95 0-4.05.4-5.5 1.5-1.45-1.1-3.55-1.5-5.5-1.5S2.45 4.9 1 6v14.65c0 .25.25.5.5.5.1 0 .15-.05.25-.05C3.1 20.45 5.05 20 6.5 20c1.95 0 4.05.4 5.5 1.5 1.35-.85 3.8-1.5 5.5-1.5 1.65 0 3.35.3 4.75 1.05.1.05.15.05.25.05.25 0 .5-.25.5-.5V6c-.6-.45-1.25-.75-2-1zm0 13.5c-1.1-.35-2.3-.5-3.5-.5-1.7 0-4.15.65-5.5 1.5V8c1.35-.85 3.8-1.5 5.5-1.5 1.2 0 2.4.15 3.5.5v11.5z"/>',
		'import_export': '<path d="M9 3L5 6.99h3V14h2V6.99h3L9 3z"/><path d="M16 17.01V10h-2v7.01h-3L15 21l4-3.99h-3z"/>',
		'invert_colors_off': '<path d="M12 19.59c-1.6 0-3.11-.62-4.24-1.76A5.945 5.945 0 0 1 6 13.59c0-1.32.43-2.57 1.21-3.6L12 14.77v4.82zm8.65 1.28l-2.35-2.35-6.3-6.29-3.56-3.57-1.42-1.41L4.27 4.5 3 5.77l2.78 2.78a8.005 8.005 0 0 0 .56 10.69A7.98 7.98 0 0 0 12 21.58c1.79 0 3.57-.59 5.03-1.78l2.7 2.7L21 21.23l-.35-.36z"/><path d="M12 5.1v4.58l7.25 7.26c1.37-2.96.84-6.57-1.6-9.01L12 2.27l-3.7 3.7 1.41 1.41L12 5.1z"/>',
		'live_help': '<path d="M19 2H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h4l3 3 3-3h4c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-6 16h-2v-2h2v2zm2.07-7.75l-.9.92C13.45 11.9 13 12.5 13 14h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25z"/>',
		'location_off': '<path d="M12 6.5A2.5 2.5 0 0 1 14.5 9c0 .74-.33 1.39-.83 1.85l3.63 3.63c.98-1.86 1.7-3.8 1.7-5.48 0-3.87-3.13-7-7-7a7 7 0 0 0-5.04 2.15l3.19 3.19c.46-.52 1.11-.84 1.85-.84z"/><path d="M16.37 16.1l-4.63-4.63-.11-.11L3.27 3 2 4.27l3.18 3.18C5.07 7.95 5 8.47 5 9c0 5.25 7 13 7 13s1.67-1.85 3.38-4.35L18.73 21 20 19.73l-3.63-3.63z"/>',
		'location_on': '<path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>',
		'mail_outline': '<path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 14H4V8l8 5 8-5v10zm-8-7L4 6h16l-8 5z"/>',
		'message': '<path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z"/>',
		'no_sim': '<path d="M18.99 5c0-1.1-.89-2-1.99-2h-7L7.66 5.34 19 16.68 18.99 5z"/><path d="M3.65 3.88L2.38 5.15 5 7.77V19c0 1.1.9 2 2 2h10.01c.35 0 .67-.1.96-.26l1.88 1.88 1.27-1.27L3.65 3.88z"/>',
		'phone': '<path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>',
		'phonelink_erase':'<path d="M13 8.2l-1-1-4 4-4-4-1 1 4 4-4 4 1 1 4-4 4 4 1-1-4-4 4-4zM19 1H9c-1.1 0-2 .9-2 2v3h2V4h10v16H9v-2H7v3c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V3c0-1.1-.9-2-2-2z"/>',
		'phonelink_lock':'<path d="M19 1H9c-1.1 0-2 .9-2 2v3h2V4h10v16H9v-2H7v3c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V3c0-1.1-.9-2-2-2zm-8.2 10V9.5C10.8 8.1 9.4 7 8 7S5.2 8.1 5.2 9.5V11c-.6 0-1.2.6-1.2 1.2v3.5c0 .7.6 1.3 1.2 1.3h5.5c.7 0 1.3-.6 1.3-1.2v-3.5c0-.7-.6-1.3-1.2-1.3zm-1.3 0h-3V9.5c0-.8.7-1.3 1.5-1.3s1.5.5 1.5 1.3V11z"/>',
		'phonelink_ring':'<path d="M20.1 7.7l-1 1c1.8 1.8 1.8 4.6 0 6.5l1 1c2.5-2.3 2.5-6.1 0-8.5zM18 9.8l-1 1c.5.7.5 1.6 0 2.3l1 1c1.2-1.2 1.2-3 0-4.3zM14 1H4c-1.1 0-2 .9-2 2v18c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V3c0-1.1-.9-2-2-2zm0 19H4V4h10v16z"/>',
		'phonelink_setup':'<path d="M11.8 12.5v-1l1.1-.8c.1-.1.1-.2.1-.3l-1-1.7c-.1-.1-.2-.2-.3-.1l-1.3.4c-.3-.2-.6-.4-.9-.5l-.2-1.3c0-.1-.1-.2-.3-.2H7c-.1 0-.2.1-.3.2l-.2 1.3c-.3.1-.6.3-.9.5l-1.3-.5c-.1 0-.2 0-.3.1l-1 1.7c-.1.1 0 .2.1.3l1.1.8v1l-1.1.8c-.1.2-.1.3-.1.4l1 1.7c.1.1.2.2.3.1l1.4-.4c.3.2.6.4.9.5l.2 1.3c-.1.1.1.2.2.2h2c.1 0 .2-.1.3-.2l.2-1.3c.3-.1.6-.3.9-.5l1.3.5c.1 0 .2 0 .3-.1l1-1.7c.1-.1 0-.2-.1-.3l-1.1-.9zM8 14c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zM19 1H9c-1.1 0-2 .9-2 2v3h2V4h10v16H9v-2H7v3c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V3c0-1.1-.9-2-2-2z"/>',
		'portable_wifi_off': '<path d="M17.56 14.24c.28-.69.44-1.45.44-2.24 0-3.31-2.69-6-6-6-.79 0-1.55.16-2.24.44l1.62 1.62c.2-.03.41-.06.62-.06a3.999 3.999 0 0 1 3.95 4.63l1.61 1.61z"/><path d="M12 4c4.42 0 8 3.58 8 8 0 1.35-.35 2.62-.95 3.74l1.47 1.47A9.86 9.86 0 0 0 22 12c0-5.52-4.48-10-10-10-1.91 0-3.69.55-5.21 1.47l1.46 1.46C9.37 4.34 10.65 4 12 4z"/><path d="M3.27 2.5L2 3.77l2.1 2.1C2.79 7.57 2 9.69 2 12c0 3.7 2.01 6.92 4.99 8.65l1-1.73C5.61 17.53 4 14.96 4 12c0-1.76.57-3.38 1.53-4.69l1.43 1.44C6.36 9.68 6 10.8 6 12c0 2.22 1.21 4.15 3 5.19l1-1.74c-1.19-.7-2-1.97-2-3.45 0-.65.17-1.25.44-1.79l1.58 1.58L10 12c0 1.1.9 2 2 2l.21-.02.01.01 7.51 7.51L21 20.23 4.27 3.5l-1-1z"/>',
		'present_to_all': '<path d="M21 19.02H3V4.98h18v14.04zM21 3H3c-1.11 0-2 .89-2 2v14c0 1.11.89 2 2 2h18c1.11 0 2-.89 2-2V5c0-1.11-.89-2-2-2z"/><path d="M10 12H8l4-4 4 4h-2v4h-4v-4z"/>',
		'ring_volume': '<path d="M23.71 16.67C20.66 13.78 16.54 12 12 12 7.46 12 3.34 13.78.29 16.67c-.18.18-.29.43-.29.71 0 .28.11.53.29.71l2.48 2.48c.18.18.43.29.71.29.27 0 .52-.11.7-.28.79-.74 1.69-1.36 2.66-1.85.33-.16.56-.5.56-.9v-3.1c1.45-.48 3-.73 4.6-.73 1.6 0 3.15.25 4.6.72v3.1c0 .39.23.74.56.9.98.49 1.87 1.12 2.66 1.85.18.18.43.28.7.28.28 0 .53-.11.71-.29l2.48-2.48c.18-.18.29-.43.29-.71 0-.27-.11-.52-.29-.7z"/><path d="M21.16 6.26l-1.41-1.41-3.56 3.55 1.41 1.41s3.45-3.52 3.56-3.55z"/><path d="M13 2h-2v5h2V2z"/><path d="M6.4 9.81L7.81 8.4 4.26 4.84 2.84 6.26c.11.03 3.56 3.55 3.56 3.55z"/>',
		'rss_feed': '<path d="M4 4.44v2.83c7.03 0 12.73 5.7 12.73 12.73h2.83c0-8.59-6.97-15.56-15.56-15.56z"/><path d="M4 10.1v2.83c3.9 0 7.07 3.17 7.07 7.07h2.83c0-5.47-4.43-9.9-9.9-9.9z"/>',
		'screen_share': '<path d="M20 18c1.1 0 1.99-.9 1.99-2L22 6c0-1.11-.9-2-2-2H4c-1.11 0-2 .89-2 2v10c0 1.1.89 2 2 2H0v2h24v-2h-4zm-7-3.53v-2.19c-2.78 0-4.61.85-6 2.72.56-2.67 2.11-5.33 6-5.87V7l4 3.73-4 3.74z"/>',
		'stay_current_landscape': '<path d="M1.01 7L1 17c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2H3c-1.1 0-1.99.9-1.99 2zM19 7v10H5V7h14z"/>',
		'stay_current_portrait': '<path d="M17 1.01L7 1c-1.1 0-1.99.9-1.99 2v18c0 1.1.89 2 1.99 2h10c1.1 0 2-.9 2-2V3c0-1.1-.9-1.99-2-1.99zM17 19H7V5h10v14z"/>',
		'stay_primary_landscape': '<path d="M1.01 7L1 17c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2H3c-1.1 0-1.99.9-1.99 2zM19 7v10H5V7h14z"/>',
		'stay_primary_portrait': '<path d="M17 1.01L7 1c-1.1 0-1.99.9-1.99 2v18c0 1.1.89 2 1.99 2h10c1.1 0 2-.9 2-2V3c0-1.1-.9-1.99-2-1.99zM17 19H7V5h10v14z"/>',
		'stop_screen_share': '<path d="M21.22 18.02l2 2H24v-2h-2.78z"/><path d="M21.99 16.02l.01-10a2 2 0 0 0-2-2H7.22l5.23 5.23c.18-.04.36-.07.55-.1V7.02l4 3.73-1.58 1.47 5.54 5.54c.61-.33 1.03-.99 1.03-1.74z"/><path d="M7 15.02c.31-1.48.92-2.95 2.07-4.06l1.59 1.59c-1.54.38-2.7 1.18-3.66 2.47zM2.39 1.73L1.11 3l1.54 1.54c-.4.36-.65.89-.65 1.48v10a2 2 0 0 0 2 2H0v2h18.13l2.71 2.71 1.27-1.27L2.39 1.73z"/>',
		'swap_calls': '<path d="M18 4l-4 4h3v7c0 1.1-.9 2-2 2s-2-.9-2-2V8c0-2.21-1.79-4-4-4S5 5.79 5 8v7H2l4 4 4-4H7V8c0-1.1.9-2 2-2s2 .9 2 2v7c0 2.21 1.79 4 4 4s4-1.79 4-4V8h3l-4-4z"/>',
		'textsms': '<path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM9 11H7V9h2v2zm4 0h-2V9h2v2zm4 0h-2V9h2v2z"/>',
		'voicemail': '<path d="M18.5 6C15.46 6 13 8.46 13 11.5c0 1.33.47 2.55 1.26 3.5H9.74c.79-.95 1.26-2.17 1.26-3.5C11 8.46 8.54 6 5.5 6S0 8.46 0 11.5 2.46 17 5.5 17h13c3.04 0 5.5-2.46 5.5-5.5S21.54 6 18.5 6zm-13 9C3.57 15 2 13.43 2 11.5S3.57 8 5.5 8 9 9.57 9 11.5 7.43 15 5.5 15zm13 0c-1.93 0-3.5-1.57-3.5-3.5S16.57 8 18.5 8 22 9.57 22 11.5 20.43 15 18.5 15z"/>',
		'vpn_key': '<path d="M12.65 10C11.83 7.67 9.61 6 7 6c-3.31 0-6 2.69-6 6s2.69 6 6 6c2.61 0 4.83-1.67 5.65-4H17v4h4v-4h2v-4H12.65zM7 14c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z"/>',
		//
		// content
		//
		'add': '<path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>',
		'add_box': '<path d="M19 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-2 10h-4v4h-2v-4H7v-2h4V7h2v4h4v2z"/>',
		'add_circle': '<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 11h-4v4h-2v-4H7v-2h4V7h2v4h4v2z"/>',
		'add_circle_outline': '<path d="M13 7h-2v4H7v2h4v4h2v-4h4v-2h-4V7z"/><path d="M12 20c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm0-18C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"/>',
		'archive': '<path d="M20.54 5.23l-1.39-1.68C18.88 3.21 18.47 3 18 3H6c-.47 0-.88.21-1.16.55L3.46 5.23C3.17 5.57 3 6.02 3 6.5V19c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6.5c0-.48-.17-.93-.46-1.27zM12 17.5L6.5 12H10v-2h4v2h3.5L12 17.5zM5.12 5l.81-1h12l.94 1H5.12z"/>',
		'backspace': '<path d="M22 3H7c-.69 0-1.23.35-1.59.88L0 12l5.41 8.11c.36.53.9.89 1.59.89h15c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-3 12.59L17.59 17 14 13.41 10.41 17 9 15.59 12.59 12 9 8.41 10.41 7 14 10.59 17.59 7 19 8.41 15.41 12 19 15.59z"/>',
		'block': '<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zM4 12c0-4.42 3.58-8 8-8 1.85 0 3.55.63 4.9 1.69L5.69 16.9C4.63 15.55 4 13.85 4 12zm8 8c-1.85 0-3.55-.63-4.9-1.69L18.31 7.1C19.37 8.45 20 10.15 20 12c0 4.42-3.58 8-8 8z"/>',
		'clear': '<path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>',
		'content_copy': '<path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1z"/><path d="M19 21H8V7h11v14zm0-16H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2z"/>',
		'content_cut': '<path d="M12 12.5c-.28 0-.5-.22-.5-.5s.22-.5.5-.5.5.22.5.5-.22.5-.5.5zM6 20a2 2 0 1 1-.001-3.999A2 2 0 0 1 6 20zM6 8a2 2 0 1 1-.001-3.999A2 2 0 0 1 6 8zm3.64-.36c.23-.5.36-1.05.36-1.64 0-2.21-1.79-4-4-4S2 3.79 2 6s1.79 4 4 4c.59 0 1.14-.13 1.64-.36L10 12l-2.36 2.36C7.14 14.13 6.59 14 6 14c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4c0-.59-.13-1.14-.36-1.64L12 14l7 7h3v-1L9.64 7.64z"/><path d="M19 3l-6 6 2 2 7-7V3z"/>',
		'content_paste': '<path d="M19 2h-4.18C14.4.84 13.3 0 12 0c-1.3 0-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-7 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm7 18H5V4h2v3h10V4h2v16z"/>',
		'create': '<path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25z"/><path d="M20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>',
		'delete_sweep': '<path d="M15 16h4v2h-4z"/><path d="M15 8h7v2h-7z"/><path d="M15 12h6v2h-6z"/><path d="M3 18c0 1.1.9 2 2 2h6c1.1 0 2-.9 2-2V8H3v10z"/><path d="M14 5h-3l-1-1H6L5 5H2v2h12z"/>',
		'drafts': '<path d="M21.99 8c0-.72-.37-1.35-.94-1.7L12 1 2.95 6.3C2.38 6.65 2 7.28 2 8v10c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2l-.01-10zM12 13L3.74 7.84 12 3l8.26 4.84L12 13z"/>',
		'filter_list': '<path d="M10 18h4v-2h-4v2z"/><path d="M3 6v2h18V6H3z"/><path d="M6 13h12v-2H6v2z"/>',
		'flag': '<path d="M14.4 6L14 4H5v17h2v-7h5.6l.4 2h7V6z"/>',
		'font_download': '<path d="M9.93 13.5h4.14L12 7.98z"/><path d="M15.95 18.5l-1.14-3H9.17l-1.12 3H5.96l5.11-13h1.86l5.11 13h-2.09zM20 2H4c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/>',
		'forward': '<path d="M12 8V4l8 8-8 8v-4H4V8z"/>',
		'gesture': '<path d="M4.59 6.89c.7-.71 1.4-1.35 1.71-1.22.5.2 0 1.03-.3 1.52-.25.42-2.86 3.89-2.86 6.31 0 1.28.48 2.34 1.34 2.98.75.56 1.74.73 2.64.46 1.07-.31 1.95-1.4 3.06-2.77 1.21-1.49 2.83-3.44 4.08-3.44 1.63 0 1.65 1.01 1.76 1.79-3.78.64-5.38 3.67-5.38 5.37 0 1.7 1.44 3.09 3.21 3.09 1.63 0 4.29-1.33 4.69-6.1H21v-2.5h-2.47c-.15-1.65-1.09-4.2-4.03-4.2-2.25 0-4.18 1.91-4.94 2.84-.58.73-2.06 2.48-2.29 2.72-.25.3-.68.84-1.11.84-.45 0-.72-.83-.36-1.92.35-1.09 1.4-2.86 1.85-3.52.78-1.14 1.3-1.92 1.3-3.28C8.95 3.69 7.31 3 6.44 3 5.12 3 3.97 4 3.72 4.25c-.36.36-.66.66-.88.93l1.75 1.71zm9.29 11.66c-.31 0-.74-.26-.74-.72 0-.6.73-2.2 2.87-2.76-.3 2.69-1.43 3.48-2.13 3.48z"/>',
		'inbox': '<path d="M19 15h-4c0 1.66-1.34 3-3 3s-3-1.34-3-3H4.99V5H19v10zm0-12H4.99c-1.1 0-1.98.9-1.98 2L3 19c0 1.1.89 2 1.99 2H19c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z"/><path d="M16 10h-2V7h-4v3H8l4 4 4-4z"/>',
		'link': '<path d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1z"/><path d="M8 13h8v-2H8v2z"/><path d="M17 7h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1 0 1.71-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z"/>',
		'low_priority': '<path d="M14 5h8v2h-8z"/><path d="M14 10.5h8v2h-8z"/><path d="M14 16h8v2h-8z"/><path d="M2 11.5C2 15.08 4.92 18 8.5 18H9v2l3-3-3-3v2h-.5C6.02 16 4 13.98 4 11.5S6.02 7 8.5 7H12V5H8.5C4.92 5 2 7.92 2 11.5z"/>',
		'mail': '<path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>',
		'markunread': '<path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>',
		'move_to_inbox': '<path d="M19 15h-4c0 1.66-1.35 3-3 3s-3-1.34-3-3H4.99V5H19v10zm0-12H4.99c-1.11 0-1.98.9-1.98 2L3 19c0 1.1.88 2 1.99 2H19c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z"/><path d="M16 10h-2V7h-4v3H8l4 4 4-4z"/>',
		'next_week': '<path d="M20 7h-4V5c0-.55-.22-1.05-.59-1.41C15.05 3.22 14.55 3 14 3h-4c-1.1 0-2 .9-2 2v2H4c-1.1 0-2 .9-2 2v11c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V9c0-1.1-.9-2-2-2zM10 5h4v2h-4V5zm1 13.5l-1-1 3-3-3-3 1-1 4 4-4 4z"/>',
		'redo': '<path d="M18.4 10.6C16.55 8.99 14.15 8 11.5 8c-4.65 0-8.58 3.03-9.96 7.22L3.9 16c1.05-3.19 4.05-5.5 7.6-5.5 1.95 0 3.73.72 5.12 1.88L13 16h9V7l-3.6 3.6z"/>',
		'remove': '<path d="M19 13H5v-2h14v2z"/>',
		'remove_circle': '<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 11H7v-2h10v2z"/>',
		'remove_circle_outline': '<path d="M7 11v2h10v-2H7z"/><path d="M12 20c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm0-18C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"/>',
		'reply': '<path d="M10 9V5l-7 7 7 7v-4.1c5 0 8.5 1.6 11 5.1-1-5-4-10-11-11z"/>',
		'reply_all': '<path d="M7 8V5l-7 7 7 7v-3l-4-4 4-4z"/><path d="M13 9V5l-7 7 7 7v-4.1c5 0 8.5 1.6 11 5.1-1-5-4-10-11-11z"/>',
		'report': '<path d="M15.73 3H8.27L3 8.27v7.46L8.27 21h7.46L21 15.73V8.27L15.73 3zM12 17.3c-.72 0-1.3-.58-1.3-1.3 0-.72.58-1.3 1.3-1.3.72 0 1.3.58 1.3 1.3 0 .72-.58 1.3-1.3 1.3zm1-4.3h-2V7h2v6z"/>',
		'save': '<path d="M17 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V7l-4-4zm-5 16c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm3-10H5V5h10v4z"/>',
		'select_all': '<path d="M3 5h2V3c-1.1 0-2 .9-2 2z"/><path d="M3 13h2v-2H3v2z"/><path d="M7 21h2v-2H7v2z"/><path d="M3 9h2V7H3v2z"/><path d="M13 3h-2v2h2V3z"/><path d="M19 3v2h2c0-1.1-.9-2-2-2z"/><path d="M5 21v-2H3c0 1.1.9 2 2 2z"/><path d="M3 17h2v-2H3v2z"/><path d="M9 3H7v2h2V3z"/><path d="M11 21h2v-2h-2v2z"/><path d="M19 13h2v-2h-2v2z"/><path d="M19 21c1.1 0 2-.9 2-2h-2v2z"/><path d="M19 9h2V7h-2v2z"/><path d="M19 17h2v-2h-2v2z"/><path d="M15 21h2v-2h-2v2z"/><path d="M15 5h2V3h-2v2z"/><path d="M9 9h6v6H9V9zm-2 8h10V7H7v10z"/>',
		'send': '<path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>',
		'sort': '<path d="M3 18h6v-2H3v2z"/><path d="M3 6v2h18V6H3z"/><path d="M3 13h12v-2H3v2z"/>',
		'text_format': '<path d="M5 17v2h14v-2H5z"/><path d="M12 5.98L13.87 11h-3.74L12 5.98zM9.5 12.8h5l.9 2.2h2.1L12.75 4h-1.5L6.5 15h2.1l.9-2.2z"/>',
		'unarchive': '<path d="M20.55 5.22l-1.39-1.68C18.88 3.21 18.47 3 18 3H6c-.47 0-.88.21-1.15.55L3.46 5.22C3.17 5.57 3 6.01 3 6.5V19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6.5c0-.49-.17-.93-.45-1.28zM12 9.5l5.5 5.5H14v2h-4v-2H6.5L12 9.5zM5.12 5l.82-1h12l.93 1H5.12z"/>',
		'undo': '<path d="M12.5 8c-2.65 0-5.05.99-6.9 2.6L2 7v9h9l-3.62-3.62c1.39-1.16 3.16-1.88 5.12-1.88 3.54 0 6.55 2.31 7.6 5.5l2.37-.78C21.08 11.03 17.15 8 12.5 8z"/>',
		'weekend': '<path d="M21 10c-1.1 0-2 .9-2 2v3H5v-3c0-1.1-.9-2-2-2s-2 .9-2 2v5c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2v-5c0-1.1-.9-2-2-2z"/><path d="M18 5H6c-1.1 0-2 .9-2 2v2.15c1.16.41 2 1.51 2 2.82V14h12v-2.03c0-1.3.84-2.4 2-2.82V7c0-1.1-.9-2-2-2z"/>',
		//
		// device
		//
		'access_alarms': '<path d="M22 5.72l-4.6-3.86-1.29 1.53 4.6 3.86L22 5.72z"/><path d="M7.88 3.39L6.6 1.86 2 5.71l1.29 1.53 4.59-3.85z"/><path d="M12.5 8H11v6l4.75 2.85.75-1.23-4-2.37V8z"/><path d="M12 20c-3.87 0-7-3.13-7-7s3.13-7 7-7 7 3.13 7 7-3.13 7-7 7zm0-16c-4.97 0-9 4.03-9 9s4.02 9 9 9c4.97 0 9-4.03 9-9s-4.03-9-9-9z"/>',
		'access_alarm': '<path d="M22 5.72l-4.6-3.86-1.29 1.53 4.6 3.86L22 5.72z"/><path d="M7.88 3.39L6.6 1.86 2 5.71l1.29 1.53 4.59-3.85z"/><path d="M12.5 8H11v6l4.75 2.85.75-1.23-4-2.37V8z"/><path d="M12 20c-3.87 0-7-3.13-7-7s3.13-7 7-7 7 3.13 7 7-3.13 7-7 7zm0-16c-4.97 0-9 4.03-9 9s4.02 9 9 9c4.97 0 9-4.03 9-9s-4.03-9-9-9z"/>',
		'access_time': '<path d="M12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm-.01-18C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2z"/><path d="M12.5 7H11v6l5.25 3.15.75-1.23-4.5-2.67z"/>',
		'add_alarm': '<path d="M7.88 3.39L6.6 1.86 2 5.71l1.29 1.53 4.59-3.85z"/><path d="M22 5.72l-4.6-3.86-1.29 1.53 4.6 3.86L22 5.72z"/><path d="M12 20c-3.87 0-7-3.13-7-7s3.13-7 7-7 7 3.13 7 7-3.13 7-7 7zm0-16c-4.97 0-9 4.03-9 9s4.02 9 9 9c4.97 0 9-4.03 9-9s-4.03-9-9-9z"/><path d="M13 9h-2v3H8v2h3v3h2v-3h3v-2h-3V9z"/>',
		'airplanemode_on': '<path d="M10.18 9"/><path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/>',
		'airplanemode_inactive': '<path d="M13 9V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5v3.68l7.83 7.83L21 16v-2l-8-5z"/><path d="M3 5.27l4.99 4.99L2 14v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-3.73L18.73 21 20 19.73 4.27 4 3 5.27z"/>',
		'battery_charging_full': '<path d="M15.67 4H14V2h-4v2H8.33C7.6 4 7 4.6 7 5.33v15.33C7 21.4 7.6 22 8.33 22h7.33c.74 0 1.34-.6 1.34-1.33V5.33C17 4.6 16.4 4 15.67 4zM11 20v-5.5H9L13 7v5.5h2L11 20z"/>',
		'battery_full': '<path d="M15.67 4H14V2h-4v2H8.33C7.6 4 7 4.6 7 5.33v15.33C7 21.4 7.6 22 8.33 22h7.33c.74 0 1.34-.6 1.34-1.33V5.33C17 4.6 16.4 4 15.67 4z"/>',
		'battery_std': '<path d="M15.67 4H14V2h-4v2H8.33C7.6 4 7 4.6 7 5.33v15.33C7 21.4 7.6 22 8.33 22h7.33c.74 0 1.34-.6 1.34-1.33V5.33C17 4.6 16.4 4 15.67 4z"/>',
		'battery_unknown': '<path d="M15.67 4H14V2h-4v2H8.33C7.6 4 7 4.6 7 5.33v15.33C7 21.4 7.6 22 8.33 22h7.33c.74 0 1.34-.6 1.34-1.33V5.33C17 4.6 16.4 4 15.67 4zm-2.72 13.95h-1.9v-1.9h1.9v1.9zm1.35-5.26s-.38.42-.67.71c-.48.48-.83 1.15-.83 1.6h-1.6c0-.83.46-1.52.93-2l.93-.94c.27-.27.44-.65.44-1.06 0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5H9c0-1.66 1.34-3 3-3s3 1.34 3 3c0 .66-.27 1.26-.7 1.69z"/>',
		'bluetooth': '<path d="M17.71 7.71L12 2h-1v7.59L6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 11 14.41V22h1l5.71-5.71-4.3-4.29 4.3-4.29zM13 5.83l1.88 1.88L13 9.59V5.83zm1.88 10.46L13 18.17v-3.76l1.88 1.88z"/>',
		'bluetooth_connected': '<path d="M14.88 16.29L13 18.17v-3.76l1.88 1.88zM13 5.83l1.88 1.88L13 9.59V5.83zm4.71 1.88L12 2h-1v7.59L6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 11 14.41V22h1l5.71-5.71-4.3-4.29 4.3-4.29z"/><path d="M19 10l-2 2 2 2 2-2-2-2z"/><path d="M7 12l-2-2-2 2 2 2 2-2z"/>',
		'bluetooth_disabled': '<path d="M13 5.83l1.88 1.88-1.6 1.6 1.41 1.41 3.02-3.02L12 2h-1v5.03l2 2v-3.2z"/><path d="M13 18.17v-3.76l1.88 1.88L13 18.17zM5.41 4L4 5.41 10.59 12 5 17.59 6.41 19 11 14.41V22h1l4.29-4.29 2.3 2.29L20 18.59 5.41 4z"/>',
		'bluetooth_searching': '<path d="M14.24 12.01l2.32 2.32c.28-.72.44-1.51.44-2.33 0-.82-.16-1.59-.43-2.31l-2.33 2.32z"/><path d="M19.53 6.71l-1.26 1.26c.63 1.21.98 2.57.98 4.02 0 1.45-.36 2.82-.98 4.02l1.2 1.2c.97-1.54 1.54-3.36 1.54-5.31-.01-1.89-.55-3.67-1.48-5.19z"/><path d="M12.88 16.29L11 18.17v-3.76l1.88 1.88zM11 5.83l1.88 1.88L11 9.59V5.83zm4.71 1.88L10 2H9v7.59L4.41 5 3 6.41 8.59 12 3 17.59 4.41 19 9 14.41V22h1l5.71-5.71-4.3-4.29 4.3-4.29z"/>',
		'brightness_auto': '<path d="M10.85 12.65h2.3L12 9l-1.15 3.65zM20 8.69V4h-4.69L12 .69 8.69 4H4v4.69L.69 12 4 15.31V20h4.69L12 23.31 15.31 20H20v-4.69L23.31 12 20 8.69zM14.3 16l-.7-2h-3.2l-.7 2H7.8L11 7h2l3.2 9h-1.9z"/>',
		'brightness_high': '<path d="M12 18c-3.31 0-6-2.69-6-6s2.69-6 6-6 6 2.69 6 6-2.69 6-6 6zm8-9.31V4h-4.69L12 .69 8.69 4H4v4.69L.69 12 4 15.31V20h4.69L12 23.31 15.31 20H20v-4.69L23.31 12 20 8.69z"/><path d="M12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4z"/>',
		'brightness_low': '<path d="M20 15.31L23.31 12 20 8.69V4h-4.69L12 .69 8.69 4H4v4.69L.69 12 4 15.31V20h4.69L12 23.31 15.31 20H20v-4.69zM12 18c-3.31 0-6-2.69-6-6s2.69-6 6-6 6 2.69 6 6-2.69 6-6 6z"/>',
		'brightness_medium': '<path d="M20 15.31L23.31 12 20 8.69V4h-4.69L12 .69 8.69 4H4v4.69L.69 12 4 15.31V20h4.69L12 23.31 15.31 20H20v-4.69zM12 18V6c3.31 0 6 2.69 6 6s-2.69 6-6 6z"/>',
		'data_usage': '<path d="M13 2.05v3.03c3.39.49 6 3.39 6 6.92 0 .9-.18 1.75-.48 2.54l2.6 1.53c.56-1.24.88-2.62.88-4.07 0-5.18-3.95-9.45-9-9.95z"/><path d="M12 19c-3.87 0-7-3.13-7-7 0-3.53 2.61-6.43 6-6.92V2.05c-5.06.5-9 4.76-9 9.95 0 5.52 4.47 10 9.99 10 3.31 0 6.24-1.61 8.06-4.09l-2.6-1.53C16.17 17.98 14.21 19 12 19z"/>',
		'developer_mode': '<path d="M7 5h10v2h2V3c0-1.1-.9-1.99-2-1.99L7 1c-1.1 0-2 .9-2 2v4h2V5z"/><path d="M15.41 16.59L20 12l-4.59-4.59L14 8.83 17.17 12 14 15.17l1.41 1.42z"/><path d="M10 15.17L6.83 12 10 8.83 8.59 7.41 4 12l4.59 4.59L10 15.17z"/><path d="M17 19H7v-2H5v4c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2v-4h-2v2z"/>',
		'devices': '<path d="M4 6h18V4H4c-1.1 0-2 .9-2 2v11H0v3h14v-3H4V6z"/><path d="M22 17h-4v-7h4v7zm1-9h-6c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h6c.55 0 1-.45 1-1V9c0-.55-.45-1-1-1z"/>',
		'dvr': '<path d="M21 17H3V5h18v12zm0-14H3c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h5v2h8v-2h5c1.1 0 1.99-.9 1.99-2L23 5c0-1.1-.9-2-2-2z"/><path d="M7 8H5v2h2V8zm12 0H8v2h11V8z"/><path d="M7 12H5v2h2v-2zm12 0H8v2h11v-2z"/>',
		'gps_fixed': '<path d="M12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4z"/><path d="M12 19c-3.87 0-7-3.13-7-7s3.13-7 7-7 7 3.13 7 7-3.13 7-7 7zm8.94-8c-.46-4.17-3.77-7.48-7.94-7.94V1h-2v2.06C6.83 3.52 3.52 6.83 3.06 11H1v2h2.06c.46 4.17 3.77 7.48 7.94 7.94V23h2v-2.06c4.17-.46 7.48-3.77 7.94-7.94H23v-2h-2.06z"/>',
		'gps_not_fixed': '<path d="M20.94 11c-.46-4.17-3.77-7.48-7.94-7.94V1h-2v2.06C6.83 3.52 3.52 6.83 3.06 11H1v2h2.06c.46 4.17 3.77 7.48 7.94 7.94V23h2v-2.06c4.17-.46 7.48-3.77 7.94-7.94H23v-2h-2.06zM12 19c-3.87 0-7-3.13-7-7s3.13-7 7-7 7 3.13 7 7-3.13 7-7 7z"/>',
		'gps_off': '<path d="M20.94 11A8.994 8.994 0 0 0 13 3.06V1h-2v2.06c-1.13.12-2.19.46-3.16.97l1.5 1.5A6.995 6.995 0 0 1 19 12c0 .94-.19 1.84-.52 2.65l1.5 1.5c.5-.96.84-2.02.97-3.15H23v-2h-2.06z"/><path d="M16.27 17.54a6.995 6.995 0 0 1-9.81-9.81l9.81 9.81zM3 4.27l2.04 2.04A8.914 8.914 0 0 0 3.06 11H1v2h2.06A8.994 8.994 0 0 0 11 20.94V23h2v-2.06c1.77-.2 3.38-.91 4.69-1.98L19.73 21 21 19.73 4.27 3 3 4.27z"/>',
		'graphic_eq': '<path d="M7 18h2V6H7v12z"/><path d="M11 22h2V2h-2v20z"/><path d="M3 14h2v-4H3v4z"/><path d="M15 18h2V6h-2v12z"/><path d="M19 10v4h2v-4h-2z"/>',
		'location_disabled': '<path d="M20.94 11A8.994 8.994 0 0 0 13 3.06V1h-2v2.06c-1.13.12-2.19.46-3.16.97l1.5 1.5A6.995 6.995 0 0 1 19 12c0 .94-.19 1.84-.52 2.65l1.5 1.5c.5-.96.84-2.02.97-3.15H23v-2h-2.06z"/><path d="M16.27 17.54a6.995 6.995 0 0 1-9.81-9.81l9.81 9.81zM3 4.27l2.04 2.04A8.914 8.914 0 0 0 3.06 11H1v2h2.06A8.994 8.994 0 0 0 11 20.94V23h2v-2.06c1.77-.2 3.38-.91 4.69-1.98L19.73 21 21 19.73 4.27 3 3 4.27z"/>',
		'location_searching': '<path d="M20.94 11c-.46-4.17-3.77-7.48-7.94-7.94V1h-2v2.06C6.83 3.52 3.52 6.83 3.06 11H1v2h2.06c.46 4.17 3.77 7.48 7.94 7.94V23h2v-2.06c4.17-.46 7.48-3.77 7.94-7.94H23v-2h-2.06zM12 19c-3.87 0-7-3.13-7-7s3.13-7 7-7 7 3.13 7 7-3.13 7-7 7z"/>',
		'network_cell': '<path fill-opacity=".3" d="M2 22h20V2z"/><path d="M17 7L2 22h15z"/>',
		'network_wifi': '<path fill-opacity=".3" d="M12.01 21.49L23.64 7c-.45-.34-4.93-4-11.64-4C5.28 3 .81 6.66.36 7l11.63 14.49.01.01.01-.01z"/><path d="M3.53 10.95l8.46 10.54.01.01.01-.01 8.46-10.54C20.04 10.62 16.81 8 12 8c-4.81 0-8.04 2.62-8.47 2.95z"/>',
		'nfc': '<path d="M20 20H4V4h16v16zm0-18H4c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/><path d="M18 6h-5c-1.1 0-2 .9-2 2v2.28c-.6.35-1 .98-1 1.72 0 1.1.9 2 2 2s2-.9 2-2c0-.74-.4-1.38-1-1.72V8h3v8H8V8h2V6H6v12h12V6z"/>',
		'screen_lock_landscape': '<path d="M19 17H5V7h14v10zm2-12H3c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2z"/><path d="M10.8 10c0-.66.54-1.2 1.2-1.2.66 0 1.2.54 1.2 1.2v1h-2.4v-1zm-.8 6h4c.55 0 1-.45 1-1v-3c0-.55-.45-1-1-1v-1c0-1.11-.9-2-2-2-1.11 0-2 .9-2 2v1c-.55 0-1 .45-1 1v3c0 .55.45 1 1 1z"/>',
		'screen_lock_portrait': '<path d="M10.8 10c0-.66.54-1.2 1.2-1.2.66 0 1.2.54 1.2 1.2v1h-2.4v-1zm-.8 6h4c.55 0 1-.45 1-1v-3c0-.55-.45-1-1-1v-1c0-1.11-.9-2-2-2-1.11 0-2 .9-2 2v1c-.55 0-1 .45-1 1v3c0 .55.45 1 1 1z"/><path d="M17 19H7V5h10v14zm0-18H7c-1.1 0-2 .9-2 2v18c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V3c0-1.1-.9-2-2-2z"/>',
		'screen_lock_rotation': '<path d="M23.25 12.77l-2.57-2.57-1.41 1.41 2.22 2.22-5.66 5.66L4.51 8.17l5.66-5.66 2.1 2.1 1.41-1.41L11.23.75c-.59-.59-1.54-.59-2.12 0L2.75 7.11c-.59.59-.59 1.54 0 2.12l12.02 12.02c.59.59 1.54.59 2.12 0l6.36-6.36c.59-.59.59-1.54 0-2.12z"/><path d="M8.47 20.48C5.2 18.94 2.86 15.76 2.5 12H1c.51 6.16 5.66 11 11.95 11l.66-.03-3.81-3.82-1.33 1.33z"/><path d="M16.8 2.5c0-.94.76-1.7 1.7-1.7s1.7.76 1.7 1.7V3h-3.4v-.5zM16 9h5c.55 0 1-.45 1-1V4c0-.55-.45-1-1-1v-.5C21 1.12 19.88 0 18.5 0S16 1.12 16 2.5V3c-.55 0-1 .45-1 1v4c0 .55.45 1 1 1z"/>',
		'screen_rotation': '<path d="M16.48 2.52c3.27 1.55 5.61 4.72 5.97 8.48h1.5C23.44 4.84 18.29 0 12 0l-.66.03 3.81 3.81 1.33-1.32z"/><path d="M14.83 21.19L2.81 9.17l6.36-6.36 12.02 12.02-6.36 6.36zm-4.6-19.44c-.59-.59-1.54-.59-2.12 0L1.75 8.11c-.59.59-.59 1.54 0 2.12l12.02 12.02c.59.59 1.54.59 2.12 0l6.36-6.36c.59-.59.59-1.54 0-2.12L10.23 1.75z"/><path d="M7.52 21.48C4.25 19.94 1.91 16.76 1.55 13H.05C.56 19.16 5.71 24 12 24l.66-.03-3.81-3.81-1.33 1.32z"/>',
		'sd_storage': '<path d="M18 2h-8L4.02 8 4 20c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-6 6h-2V4h2v4zm3 0h-2V4h2v4zm3 0h-2V4h2v4z"/>',
		'settings_system_daydream': '<path d="M9 16h6.5c1.38 0 2.5-1.12 2.5-2.5S16.88 11 15.5 11h-.05c-.24-1.69-1.69-3-3.45-3-1.4 0-2.6.83-3.16 2.02h-.16C7.17 10.18 6 11.45 6 13c0 1.66 1.34 3 3 3z"/><path d="M21 19.01H3V4.99h18v14.02zM21 3H3c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z"/>',
		'signal_cellular_4_bar': '<path d="M2 22h20V2z"/>',
		'signal_cellular_connected_no_internet_4_bar': '<path d="M20 18h2v-8h-2v8z"/><path d="M20 22h2v-2h-2v2z"/><path d="M2 22h16V8h4V2L2 22z"/>',
		'signal_cellular_no_sim': '<path d="M18.99 5c0-1.1-.89-2-1.99-2h-7L7.66 5.34 19 16.68 18.99 5z"/><path d="M3.65 3.88L2.38 5.15 5 7.77V19c0 1.1.9 2 2 2h10.01c.35 0 .67-.1.96-.26l1.88 1.88 1.27-1.27L3.65 3.88z"/>',
		'signal_cellular_null': '<path d="M20 6.83V20H6.83L20 6.83M22 2L2 22h20V2z"/>',
		'signal_cellular_off': '<path d="M21 1l-8.59 8.59L21 18.18V1z"/><path d="M4.77 4.5L3.5 5.77l6.36 6.36L1 21h17.73l2 2L22 21.73 4.77 4.5z"/>',
		'signal_wifi_4_bar': '<path d="M12.01 21.49L23.64 7c-.45-.34-4.93-4-11.64-4C5.28 3 .81 6.66.36 7l11.63 14.49.01.01.01-.01z"/>',
		'signal_wifi_4_bar_lock': '<path d="M22 16h-3v-1.5c0-.8.7-1.5 1.5-1.5s1.5.7 1.5 1.5V16zm1 0v-1.5c0-1.4-1.1-2.5-2.5-2.5S18 13.1 18 14.5V16c-.5 0-1 .5-1 1v4c0 .5.5 1 1 1h5c.5 0 1-.5 1-1v-4c0-.5-.5-1-1-1z"/><path d="M15.5 14.5c0-2.8 2.2-5 5-5 .4 0 .7 0 1 .1L23.6 7c-.4-.3-4.9-4-11.6-4C5.3 3 .8 6.7.4 7L12 21.5l3.5-4.4v-2.6z"/>',
		'signal_wifi_off': '<path d="M23.64 7c-.45-.34-4.93-4-11.64-4-1.5 0-2.89.19-4.15.48L18.18 13.8 23.64 7z"/><path d="M17.04 15.22L3.27 1.44 2 2.72l2.05 2.06C1.91 5.76.59 6.82.36 7l11.63 14.49.01.01.01-.01 3.9-4.86 3.32 3.32 1.27-1.27-3.46-3.46z"/>',
		'storage': '<path d="M4 17h2v2H4v-2zm-2 3h20v-4H2v4z"/><path d="M6 7H4V5h2v2zM2 4v4h20V4H2z"/><path d="M4 11h2v2H4v-2zm-2 3h20v-4H2v4z"/>',
		'usb': '<path d="M15 7v4h1v2h-3V5h2l-3-4-3 4h2v8H8v-2.07c.7-.37 1.2-1.08 1.2-1.93 0-1.21-.99-2.2-2.2-2.2-1.21 0-2.2.99-2.2 2.2 0 .85.5 1.56 1.2 1.93V13c0 1.11.89 2 2 2h3v3.05c-.71.37-1.2 1.1-1.2 1.95 0 1.22.99 2.2 2.2 2.2 1.21 0 2.2-.98 2.2-2.2 0-.85-.49-1.58-1.2-1.95V15h3c1.11 0 2-.89 2-2v-2h1V7h-4z"/>',
		'wallpaper': '<path d="M4 4h7V2H4c-1.1 0-2 .9-2 2v7h2V4z"/><path d="M10 13l-4 5h12l-3-4-2.03 2.71L10 13z"/><path d="M17 8.5c0-.83-.67-1.5-1.5-1.5S14 7.67 14 8.5s.67 1.5 1.5 1.5S17 9.33 17 8.5z"/><path d="M20 2h-7v2h7v7h2V4c0-1.1-.9-2-2-2z"/><path d="M20 20h-7v2h7c1.1 0 2-.9 2-2v-7h-2v7z"/><path d="M4 13H2v7c0 1.1.9 2 2 2h7v-2H4v-7z"/>',
		'wifi_lock': '<path d="M20.5 9.5c.28 0 .55.04.81.08L24 6c-3.34-2.51-7.5-4-12-4S3.34 3.49 0 6l12 16 3.5-4.67V14.5c0-2.76 2.24-5 5-5z"/><path d="M22 16h-3v-1.5c0-.83.67-1.5 1.5-1.5s1.5.67 1.5 1.5V16zm1 0v-1.5c0-1.38-1.12-2.5-2.5-2.5S18 13.12 18 14.5V16c-.55 0-1 .45-1 1v4c0 .55.45 1 1 1h5c.55 0 1-.45 1-1v-4c0-.55-.45-1-1-1z"/>',
		'wifi_tethering': '<path d="M12 11c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/><path d="M18 13c0-3.31-2.69-6-6-6s-6 2.69-6 6c0 2.22 1.21 4.15 3 5.19l1-1.74c-1.19-.7-2-1.97-2-3.45 0-2.21 1.79-4 4-4s4 1.79 4 4c0 1.48-.81 2.75-2 3.45l1 1.74c1.79-1.04 3-2.97 3-5.19z"/><path d="M12 3C6.48 3 2 7.48 2 13c0 3.7 2.01 6.92 4.99 8.65l1-1.73C5.61 18.53 4 15.96 4 13c0-4.42 3.58-8 8-8s8 3.58 8 8c0 2.96-1.61 5.53-4 6.92l1 1.73c2.99-1.73 5-4.95 5-8.65 0-5.52-4.48-10-10-10z"/>',
		//
		// editor
		//
		'attach_file': '<path d="M16.5 6v11.5c0 2.21-1.79 4-4 4s-4-1.79-4-4V5c0-1.38 1.12-2.5 2.5-2.5s2.5 1.12 2.5 2.5v10.5c0 .55-.45 1-1 1s-1-.45-1-1V6H10v9.5c0 1.38 1.12 2.5 2.5 2.5s2.5-1.12 2.5-2.5V5c0-2.21-1.79-4-4-4S7 2.79 7 5v12.5c0 3.04 2.46 5.5 5.5 5.5s5.5-2.46 5.5-5.5V6h-1.5z"/>',
		'attach_money': '<path d="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z"/>',
		'border_all': '<path d="M3 3v18h18V3H3zm8 16H5v-6h6v6zm0-8H5V5h6v6zm8 8h-6v-6h6v6zm0-8h-6V5h6v6z"/>',
		'border_bottom': '<path d="M9 11H7v2h2v-2z"/><path d="M13 15h-2v2h2v-2z"/><path d="M9 3H7v2h2V3z"/><path d="M13 11h-2v2h2v-2z"/><path d="M5 3H3v2h2V3z"/><path d="M13 7h-2v2h2V7z"/><path d="M17 11h-2v2h2v-2z"/><path d="M13 3h-2v2h2V3z"/><path d="M17 3h-2v2h2V3z"/><path d="M19 13h2v-2h-2v2z"/><path d="M19 17h2v-2h-2v2z"/><path d="M5 7H3v2h2V7z"/><path d="M19 3v2h2V3h-2z"/><path d="M19 9h2V7h-2v2z"/><path d="M5 11H3v2h2v-2z"/><path d="M3 21h18v-2H3v2z"/><path d="M5 15H3v2h2v-2z"/>',
		'border_clear': '<path d="M7 5h2V3H7v2z"/><path d="M7 13h2v-2H7v2z"/><path d="M7 21h2v-2H7v2z"/><path d="M11 17h2v-2h-2v2z"/><path d="M11 21h2v-2h-2v2z"/><path d="M3 21h2v-2H3v2z"/><path d="M3 17h2v-2H3v2z"/><path d="M3 13h2v-2H3v2z"/><path d="M3 9h2V7H3v2z"/><path d="M3 5h2V3H3v2z"/><path d="M11 13h2v-2h-2v2z"/><path d="M19 17h2v-2h-2v2z"/><path d="M19 13h2v-2h-2v2z"/><path d="M19 21h2v-2h-2v2z"/><path d="M19 9h2V7h-2v2z"/><path d="M11 9h2V7h-2v2z"/><path d="M19 3v2h2V3h-2z"/><path d="M11 5h2V3h-2v2z"/><path d="M15 21h2v-2h-2v2z"/><path d="M15 13h2v-2h-2v2z"/><path d="M15 5h2V3h-2v2z"/>',
		'border_color': '<path d="M17.75 7L14 3.25l-10 10V17h3.75l10-10zm2.96-2.96c.39-.39.39-1.02 0-1.41L18.37.29c-.39-.39-1.02-.39-1.41 0L15 2.25 18.75 6l1.96-1.96z"/><path fill-opacity=".36" d="M0 20h24v4H0z"/>',
		'border_horizontal': '<path d="M3 21h2v-2H3v2z"/><path d="M5 7H3v2h2V7z"/><path d="M3 17h2v-2H3v2z"/><path d="M7 21h2v-2H7v2z"/><path d="M5 3H3v2h2V3z"/><path d="M9 3H7v2h2V3z"/><path d="M17 3h-2v2h2V3z"/><path d="M13 7h-2v2h2V7z"/><path d="M13 3h-2v2h2V3z"/><path d="M19 17h2v-2h-2v2z"/><path d="M11 21h2v-2h-2v2z"/><path d="M3 13h18v-2H3v2z"/><path d="M19 3v2h2V3h-2z"/><path d="M19 9h2V7h-2v2z"/><path d="M11 17h2v-2h-2v2z"/><path d="M15 21h2v-2h-2v2z"/><path d="M19 21h2v-2h-2v2z"/>',
		'border_inner': '<path d="M3 21h2v-2H3v2z"/><path d="M7 21h2v-2H7v2z"/><path d="M5 7H3v2h2V7z"/><path d="M3 17h2v-2H3v2z"/><path d="M9 3H7v2h2V3z"/><path d="M5 3H3v2h2V3z"/><path d="M17 3h-2v2h2V3z"/><path d="M19 9h2V7h-2v2z"/><path d="M19 3v2h2V3h-2z"/><path d="M15 21h2v-2h-2v2z"/><path d="M13 3h-2v8H3v2h8v8h2v-8h8v-2h-8V3z"/><path d="M19 21h2v-2h-2v2z"/><path d="M19 17h2v-2h-2v2z"/>',
		'border_left': '<path d="M11 21h2v-2h-2v2z"/><path d="M11 17h2v-2h-2v2z"/><path d="M11 5h2V3h-2v2z"/><path d="M11 9h2V7h-2v2z"/><path d="M11 13h2v-2h-2v2z"/><path d="M7 21h2v-2H7v2z"/><path d="M7 5h2V3H7v2z"/><path d="M7 13h2v-2H7v2z"/><path d="M3 21h2V3H3v18z"/><path d="M19 9h2V7h-2v2z"/><path d="M15 21h2v-2h-2v2z"/><path d="M19 17h2v-2h-2v2z"/><path d="M19 3v2h2V3h-2z"/><path d="M19 13h2v-2h-2v2z"/><path d="M19 21h2v-2h-2v2z"/><path d="M15 13h2v-2h-2v2z"/><path d="M15 5h2V3h-2v2z"/>',
		'border_outer': '<path d="M13 7h-2v2h2V7z"/><path d="M13 11h-2v2h2v-2z"/><path d="M17 11h-2v2h2v-2z"/><path d="M19 19H5V5h14v14zM3 3v18h18V3H3z"/><path d="M13 15h-2v2h2v-2z"/><path d="M9 11H7v2h2v-2z"/>',
		'border_right': '<path d="M7 21h2v-2H7v2z"/><path d="M3 5h2V3H3v2z"/><path d="M7 5h2V3H7v2z"/><path d="M7 13h2v-2H7v2z"/><path d="M3 21h2v-2H3v2z"/><path d="M11 21h2v-2h-2v2z"/><path d="M3 13h2v-2H3v2z"/><path d="M3 17h2v-2H3v2z"/><path d="M3 9h2V7H3v2z"/><path d="M11 17h2v-2h-2v2z"/><path d="M15 13h2v-2h-2v2z"/><path d="M19 3v18h2V3h-2z"/><path d="M15 21h2v-2h-2v2z"/><path d="M15 5h2V3h-2v2z"/><path d="M11 13h2v-2h-2v2z"/><path d="M11 5h2V3h-2v2z"/><path d="M11 9h2V7h-2v2z"/>',
		'border_style': '<path d="M15 21h2v-2h-2v2z"/><path d="M19 21h2v-2h-2v2z"/><path d="M7 21h2v-2H7v2z"/><path d="M11 21h2v-2h-2v2z"/><path d="M19 17h2v-2h-2v2z"/><path d="M19 13h2v-2h-2v2z"/><path d="M3 3v18h2V5h16V3H3z"/><path d="M19 9h2V7h-2v2z"/>',
		'border_top': '<path d="M7 21h2v-2H7v2z"/><path d="M7 13h2v-2H7v2z"/><path d="M11 13h2v-2h-2v2z"/><path d="M11 21h2v-2h-2v2z"/><path d="M3 17h2v-2H3v2z"/><path d="M3 21h2v-2H3v2z"/><path d="M3 13h2v-2H3v2z"/><path d="M3 9h2V7H3v2z"/><path d="M11 17h2v-2h-2v2z"/><path d="M19 9h2V7h-2v2z"/><path d="M19 13h2v-2h-2v2z"/><path d="M3 3v2h18V3H3z"/><path d="M19 17h2v-2h-2v2z"/><path d="M15 21h2v-2h-2v2z"/><path d="M11 9h2V7h-2v2z"/><path d="M19 21h2v-2h-2v2z"/><path d="M15 13h2v-2h-2v2z"/>',
		'border_vertical': '<path d="M3 9h2V7H3v2z"/><path d="M3 5h2V3H3v2z"/><path d="M7 21h2v-2H7v2z"/><path d="M7 13h2v-2H7v2z"/><path d="M3 13h2v-2H3v2z"/><path d="M3 21h2v-2H3v2z"/><path d="M3 17h2v-2H3v2z"/><path d="M7 5h2V3H7v2z"/><path d="M19 17h2v-2h-2v2z"/><path d="M11 21h2V3h-2v18z"/><path d="M19 21h2v-2h-2v2z"/><path d="M19 13h2v-2h-2v2z"/><path d="M19 3v2h2V3h-2z"/><path d="M19 9h2V7h-2v2z"/><path d="M15 5h2V3h-2v2z"/><path d="M15 21h2v-2h-2v2z"/><path d="M15 13h2v-2h-2v2z"/>',
		'bubble_chart': '<circle cx="7.2" cy="14.4" r="3.2"/><circle cx="14.8" cy="18" r="2"/><circle cx="15.2" cy="8.8" r="4.8"/>',
		'drag_handle': '<path d="M20 9H4v2h16V9z"/><path d="M4 15h16v-2H4v2z"/>',
		'format_align_center': '<path d="M7 15v2h10v-2H7z"/><path d="M3 21h18v-2H3v2z"/><path d="M3 13h18v-2H3v2z"/><path d="M7 7v2h10V7H7z"/><path d="M3 3v2h18V3H3z"/>',
		'format_align_justify': '<path d="M3 21h18v-2H3v2z"/><path d="M3 17h18v-2H3v2z"/><path d="M3 13h18v-2H3v2z"/><path d="M3 9h18V7H3v2z"/><path d="M3 3v2h18V3H3z"/>',
		'format_align_left': '<path d="M15 15H3v2h12v-2z"/><path d="M15 7H3v2h12V7z"/><path d="M3 13h18v-2H3v2z"/><path d="M3 21h18v-2H3v2z"/><path d="M3 3v2h18V3H3z"/>',
		'format_align_right': '<path d="M3 21h18v-2H3v2z"/><path d="M9 17h12v-2H9v2z"/><path d="M3 13h18v-2H3v2z"/><path d="M9 9h12V7H9v2z"/><path d="M3 3v2h18V3H3z"/>',
		'format_bold': '<path d="M15.6 10.79c.97-.67 1.65-1.77 1.65-2.79 0-2.26-1.75-4-4-4H7v14h7.04c2.09 0 3.71-1.7 3.71-3.79 0-1.52-.86-2.82-2.15-3.42zM10 6.5h3c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5h-3v-3zm3.5 9H10v-3h3.5c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5z"/>',
		'format_clear': '<path d="M3.27 5L2 6.27l6.97 6.97L6.5 19h3l1.57-3.66L16.73 21 18 19.73 3.55 5.27 3.27 5z"/><path d="M6 5v.18L8.82 8h2.4l-.72 1.68 2.1 2.1L14.21 8H20V5H6z"/>',
		'format_color_fill': '<path d="M16.56 8.94L7.62 0 6.21 1.41l2.38 2.38-5.15 5.15c-.59.59-.59 1.54 0 2.12l5.5 5.5c.29.29.68.44 1.06.44s.77-.15 1.06-.44l5.5-5.5c.59-.58.59-1.53 0-2.12zM5.21 10L10 5.21 14.79 10H5.21zM19 11.5s-2 2.17-2 3.5c0 1.1.9 2 2 2s2-.9 2-2c0-1.33-2-3.5-2-3.5z"/><path fill-opacity=".36" d="M0 20h24v4H0z"/>',
		'format_color_reset': '<path d="M18 14c0-4-6-10.8-6-10.8s-1.33 1.51-2.73 3.52l8.59 8.59c.09-.42.14-.86.14-1.31z"/><path d="M17.12 17.12L12.5 12.5 5.27 5.27 4 6.55l3.32 3.32C6.55 11.32 6 12.79 6 14c0 3.31 2.69 6 6 6 1.52 0 2.9-.57 3.96-1.5l2.63 2.63 1.27-1.27-2.74-2.74z"/>',
		'format_color_text': '<path fill-opacity=".36" d="M0 20h24v4H0z"/><path d="M11 3L5.5 17h2.25l1.12-3h6.25l1.12 3h2.25L13 3h-2zm-1.38 9L12 5.67 14.38 12H9.62z"/>',
		'format_indent_decrease': '<path d="M11 17h10v-2H11v2z"/><path d="M3 12l4 4V8l-4 4z"/><path d="M3 21h18v-2H3v2z"/><path d="M3 3v2h18V3H3z"/><path d="M11 9h10V7H11v2z"/><path d="M11 13h10v-2H11v2z"/>',
		'format_indent_increase': '<path d="M3 21h18v-2H3v2z"/><path d="M3 8v8l4-4-4-4z"/><path d="M11 17h10v-2H11v2z"/><path d="M3 3v2h18V3H3z"/><path d="M11 9h10V7H11v2z"/><path d="M11 13h10v-2H11v2z"/>',
		'format_italic': '<path d="M10 4v3h2.21l-3.42 8H6v3h8v-3h-2.21l3.42-8H18V4z"/>',
		'format_line_spacing': '<path d="M6 7h2.5L5 3.5 1.5 7H4v10H1.5L5 20.5 8.5 17H6V7z"/><path d="M10 5v2h12V5H10z"/><path d="M10 19h12v-2H10v2z"/><path d="M10 13h12v-2H10v2z"/>',
		'format_list_bulleted': '<path d="M4 10.5c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5 1.5-.67 1.5-1.5-.67-1.5-1.5-1.5z"/><path d="M4 4.5c-.83 0-1.5.67-1.5 1.5S3.17 7.5 4 7.5 5.5 6.83 5.5 6 4.83 4.5 4 4.5z"/><path d="M4 16.67c-.74 0-1.33.6-1.33 1.33 0 .73.6 1.33 1.33 1.33.73 0 1.33-.6 1.33-1.33 0-.73-.59-1.33-1.33-1.33z"/><path d="M7 19h14v-2H7v2z"/><path d="M7 13h14v-2H7v2z"/><path d="M7 5v2h14V5H7z"/>',
		'format_list_numbered': '<path d="M2 17h2v.5H3v1h1v.5H2v1h3v-4H2v1z"/><path d="M3 8h1V4H2v1h1v3z"/><path d="M2 11h1.8L2 13.1v.9h3v-1H3.2L5 10.9V10H2v1z"/><path d="M7 5v2h14V5H7z"/><path d="M7 19h14v-2H7v2z"/><path d="M7 13h14v-2H7v2z"/>',
		'format_paint': '<path d="M18 4V3c0-.55-.45-1-1-1H5c-.55 0-1 .45-1 1v4c0 .55.45 1 1 1h12c.55 0 1-.45 1-1V6h1v4H9v11c0 .55.45 1 1 1h2c.55 0 1-.45 1-1v-9h8V4h-3z"/>',
		'format_quote': '<path d="M6 17h3l2-4V7H5v6h3z"/><path d="M14 17h3l2-4V7h-6v6h3z"/>',
		'format_shapes': '<path d="M19 5V3h2v2h-2zm2 16h-2v-2h2v2zm-4-2H7v-2H5V7h2V5h10v2h2v10h-2v2zM5 21H3v-2h2v2zM3 3h2v2H3V3zm20 4V1h-6v2H7V1H1v6h2v10H1v6h6v-2h10v2h6v-6h-2V7h2z"/><path d="M10.69 12.74h2.61L12 8.91l-1.31 3.83zM13.73 14h-3.49l-.73 2H7.89l3.4-9h1.4l3.41 9h-1.63l-.74-2z"/>',
		'format_size': '<path d="M9 4v3h5v12h3V7h5V4H9z"/><path d="M3 12h3v7h3v-7h3V9H3v3z"/>',
		'format_strikethrough': '<path d="M10 19h4v-3h-4v3z"/><path d="M5 4v3h5v3h4V7h5V4H5z"/><path d="M3 14h18v-2H3v2z"/>',
		'format_textdirection_l_to_r': '<path d="M9 10v5h2V4h2v11h2V4h2V2H9C6.79 2 5 3.79 5 6s1.79 4 4 4z"/><path d="M21 18l-4-4v3H5v2h12v3l4-4z"/>',
		'format_textdirection_r_to_l': '<path d="M10 10v5h2V4h2v11h2V4h2V2h-8C7.79 2 6 3.79 6 6s1.79 4 4 4z"/><path d="M8 17v-3l-4 4 4 4v-3h12v-2H8z"/>',
		'format_underline': '<path d="M12 17c3.31 0 6-2.69 6-6V3h-2.5v8c0 1.93-1.57 3.5-3.5 3.5S8.5 12.93 8.5 11V3H6v8c0 3.31 2.69 6 6 6z"/><path d="M5 19v2h14v-2H5z"/>',
		'functions': '<path d="M18 4H6v2l6.5 6L6 18v2h12v-3h-7l5-5-5-5h7z"/>',
		'highlight': '<path d="M6 14l3 3v5h6v-5l3-3V9H6z"/><path d="M11 2h2v3h-2z"/><path d="M3.5 5.875L4.914 4.46l2.12 2.122L5.62 7.997z"/><path d="M16.96 6.585l2.123-2.12 1.414 1.414L18.375 8z"/>',
		'insert_chart': '<path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"/>',
		'insert_comment': '<path d="M20 2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14l4 4V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z"/>',
		'insert_drive_file': '<path d="M6 2c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6H6zm7 7V3.5L18.5 9H13z"/>',
		'insert_emoticon': '<path d="M12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm-.01-18C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2z"/><path d="M15.5 11c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5z"/><path d="M8.5 11c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11z"/><path d="M12 17.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z"/>',
		'insert_invitation': '<path d="M17 12h-5v5h5v-5z"/><path d="M19 19H5V8h14v11zM16 1v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2h-1V1h-2z"/>',
		'insert_link': '<path d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1z"/><path d="M8 13h8v-2H8v2z"/><path d="M17 7h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1 0 1.71-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z"/>',
		'insert_photo': '<path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>',
		'linear_scale': '<path d="M19.5 9.5c-1.03 0-1.9.62-2.29 1.5h-2.92c-.39-.88-1.26-1.5-2.29-1.5s-1.9.62-2.29 1.5H6.79c-.39-.88-1.26-1.5-2.29-1.5C3.12 9.5 2 10.62 2 12s1.12 2.5 2.5 2.5c1.03 0 1.9-.62 2.29-1.5h2.92c.39.88 1.26 1.5 2.29 1.5s1.9-.62 2.29-1.5h2.92c.39.88 1.26 1.5 2.29 1.5 1.38 0 2.5-1.12 2.5-2.5s-1.12-2.5-2.5-2.5z"/>',
		'merge_type': '<path d="M17 20.41L18.41 19 15 15.59 13.59 17 17 20.41z"/><path d="M7.5 8H11v5.59L5.59 19 7 20.41l6-6V8h3.5L12 3.5 7.5 8z"/>',
		'mode_comment': '<path d="M21.99 4c0-1.1-.89-2-1.99-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14l4 4-.01-18z"/>',
		'mode_edit': '<path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25z"/><path d="M20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>',
		'monetization_on': '<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1.41 16.09V20h-2.67v-1.93c-1.71-.36-3.16-1.46-3.27-3.4h1.96c.1 1.05.82 1.87 2.65 1.87 1.96 0 2.4-.98 2.4-1.59 0-.83-.44-1.61-2.67-2.14-2.48-.6-4.18-1.62-4.18-3.67 0-1.72 1.39-2.84 3.11-3.21V4h2.67v1.95c1.86.45 2.79 1.86 2.85 3.39H14.3c-.05-1.11-.64-1.87-2.22-1.87-1.5 0-2.4.68-2.4 1.64 0 .84.65 1.39 2.67 1.91s4.18 1.39 4.18 3.91c-.01 1.83-1.38 2.83-3.12 3.16z"/>',
		'money_off': '<path d="M12.5 6.9c1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-.53.12-1.03.3-1.48.54l1.47 1.47c.41-.17.91-.27 1.51-.27z"/><path d="M5.33 4.06L4.06 5.33 7.5 8.77c0 2.08 1.56 3.21 3.91 3.91l3.51 3.51c-.34.48-1.05.91-2.42.91-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c.96-.18 1.82-.55 2.45-1.12l2.22 2.22 1.27-1.27L5.33 4.06z"/>',
		'multiline_chart': '<path d="M22 6.92l-1.41-1.41-2.85 3.21C15.68 6.4 12.83 5 9.61 5 6.72 5 4.07 6.16 2 8l1.42 1.42C5.12 7.93 7.27 7 9.61 7c2.74 0 5.09 1.26 6.77 3.24l-2.88 3.24-4-4L2 16.99l1.5 1.5 6-6.01 4 4 4.05-4.55c.75 1.35 1.25 2.9 1.44 4.55H21c-.22-2.3-.95-4.39-2.04-6.14L22 6.92z"/>',
		'pie_chart': '<path d="M11 2v20c-5.07-.5-9-4.79-9-10s3.93-9.5 9-10z"/><path d="M13.03 2v8.99H22c-.47-4.74-4.24-8.52-8.97-8.99z"/><path d="M13.03 13.01V22c4.74-.47 8.5-4.25 8.97-8.99h-8.97z"/>',
		'pie_chart_outline': '<path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm1 2.07c3.61.45 6.48 3.33 6.93 6.93H13V4.07zM4 12c0-4.06 3.07-7.44 7-7.93v15.87c-3.93-.5-7-3.88-7-7.94zm9 7.93V13h6.93c-.45 3.61-3.32 6.48-6.93 6.93z"/>',
		'publish': '<path d="M5 4v2h14V4H5z"/><path d="M5 14h4v6h6v-6h4l-7-7-7 7z"/>',
		'short_text': '<path d="M4 9h16v2H4z"/><path d="M4 13h10v2H4z"/>',
		'show_chart': '<path d="M3.5 18.49l6-6.01 4 4L22 6.92l-1.41-1.41-7.09 7.97-4-4L2 16.99z"/>',
		'space_bar': '<path d="M18 9v4H6V9H4v6h16V9z"/>',
		'strikethrough_s': '<path d="M7.24 8.75c-.26-.48-.39-1.03-.39-1.67 0-.61.13-1.16.4-1.67.26-.5.63-.93 1.11-1.29a5.73 5.73 0 0 1 1.7-.83c.66-.19 1.39-.29 2.18-.29.81 0 1.54.11 2.21.34.66.22 1.23.54 1.69.94.47.4.83.88 1.08 1.43.25.55.38 1.15.38 1.81h-3.01c0-.31-.05-.59-.15-.85-.09-.27-.24-.49-.44-.68-.2-.19-.45-.33-.75-.44-.3-.1-.66-.16-1.06-.16-.39 0-.74.04-1.03.13-.29.09-.53.21-.72.36-.19.16-.34.34-.44.55-.1.21-.15.43-.15.66 0 .48.25.88.74 1.21.38.25.77.48 1.41.7H7.39c-.05-.08-.11-.17-.15-.25z"/><path d="M21 12v-2H3v2h9.62c.18.07.4.14.55.2.37.17.66.34.87.51.21.17.35.36.43.57.07.2.11.43.11.69 0 .23-.05.45-.14.66-.09.2-.23.38-.42.53-.19.15-.42.26-.71.35-.29.08-.63.13-1.01.13-.43 0-.83-.04-1.18-.13s-.66-.23-.91-.42c-.25-.19-.45-.44-.59-.75-.14-.31-.25-.76-.25-1.21H6.4c0 .55.08 1.13.24 1.58.16.45.37.85.65 1.21.28.35.6.66.98.92.37.26.78.48 1.22.65.44.17.9.3 1.38.39.48.08.96.13 1.44.13.8 0 1.53-.09 2.18-.28.65-.19 1.21-.45 1.67-.79.46-.34.82-.77 1.07-1.27.25-.5.38-1.07.38-1.71 0-.6-.1-1.14-.31-1.61-.05-.11-.11-.23-.17-.33H21z"/>',
		'text_fields': '<path d="M2.5 4v3h5v12h3V7h5V4h-13z"/><path d="M21.5 9h-9v3h3v7h3v-7h3V9z"/>',
		'title': '<path d="M5 4v3h5.5v12h3V7H19V4z"/>',
		'vertical_align_bottom': '<path d="M16 13h-3V3h-2v10H8l4 4 4-4z"/><path d="M4 19v2h16v-2H4z"/>',
		'vertical_align_center': '<path d="M8 19h3v4h2v-4h3l-4-4-4 4z"/><path d="M16 5h-3V1h-2v4H8l4 4 4-4z"/><path d="M4 11v2h16v-2H4z"/>',
		'vertical_align_top': '<path d="M8 11h3v10h2V11h3l-4-4-4 4z"/><path d="M4 3v2h16V3H4z"/>',
		'wrap_text': '<path d="M4 19h6v-2H4v2z"/><path d="M20 5H4v2h16V5z"/><path d="M17 11H4v2h13.25c1.1 0 2 .9 2 2s-.9 2-2 2H15v-2l-3 3 3 3v-2h2c2.21 0 4-1.79 4-4s-1.79-4-4-4z"/>',
		//
		// file
		//
		'attachment': '<path d="M7.5 18C4.46 18 2 15.54 2 12.5S4.46 7 7.5 7H18c2.21 0 4 1.79 4 4s-1.79 4-4 4H9.5C8.12 15 7 13.88 7 12.5S8.12 10 9.5 10H17v1.5H9.5c-.55 0-1 .45-1 1s.45 1 1 1H18c1.38 0 2.5-1.12 2.5-2.5S19.38 8.5 18 8.5H7.5c-2.21 0-4 1.79-4 4s1.79 4 4 4H17V18H7.5z"/>',
		'cloud': '<path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96z"/>',
		'cloud_circle': '<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.5 14H8c-1.66 0-3-1.34-3-3s1.34-3 3-3l.14.01C8.58 8.28 10.13 7 12 7c2.21 0 4 1.79 4 4h.5c1.38 0 2.5 1.12 2.5 2.5S17.88 16 16.5 16z"/>',
		'cloud_done': '<path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM10 17l-3.5-3.5 1.41-1.41L10 14.17 15.18 9l1.41 1.41L10 17z"/>',
		'cloud_download': '<path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM17 13l-5 5-5-5h3V9h4v4h3z"/>',
		'cloud_off': '<path d="M19.35 10.04A7.49 7.49 0 0 0 12 4c-1.48 0-2.85.43-4.01 1.17l1.46 1.46a5.497 5.497 0 0 1 8.05 4.87v.5H19c1.66 0 3 1.34 3 3 0 1.13-.64 2.11-1.56 2.62l1.45 1.45C23.16 18.16 24 16.68 24 15c0-2.64-2.05-4.78-4.65-4.96z"/><path d="M7.73 10l8 8H6c-2.21 0-4-1.79-4-4s1.79-4 4-4h1.73zM3 5.27l2.75 2.74C2.56 8.15 0 10.77 0 14c0 3.31 2.69 6 6 6h11.73l2 2L21 20.73 4.27 4 3 5.27z"/>',
		'cloud_queue': '<path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM19 18H6c-2.21 0-4-1.79-4-4s1.79-4 4-4h.71C7.37 7.69 9.48 6 12 6c3.04 0 5.5 2.46 5.5 5.5v.5H19c1.66 0 3 1.34 3 3s-1.34 3-3 3z"/>',
		'cloud_upload': '<path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM14 13v4h-4v-4H7l5-5 5 5h-3z"/>',
		'create_new_folder': '<path d="M20 6h-8l-2-2H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-1 8h-3v3h-2v-3h-3v-2h3V9h2v3h3v2z"/>',
		'file_download': '<path d="M19 9h-4V3H9v6H5l7 7 7-7z"/><path d="M5 18v2h14v-2H5z"/>',
		'file_upload': '<path d="M9 16h6v-6h4l-7-7-7 7h4z"/><path d="M5 18h14v2H5z"/>',
		'folder': '<path d="M10 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z"/>',
		'folder_open': '<path d="M20 6h-8l-2-2H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm0 12H4V8h16v10z"/>',
		'folder_shared': '<path d="M20 6h-8l-2-2H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-5 3c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zm4 8h-8v-1c0-1.33 2.67-2 4-2s4 .67 4 2v1z"/>',
		//
		// hardware
		//
		'cast': '<path d="M21 3H3c-1.1 0-2 .9-2 2v3h2V5h18v14h-7v2h7c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z"/><path d="M1 18v3h3c0-1.66-1.34-3-3-3z"/><path d="M1 14v2c2.76 0 5 2.24 5 5h2c0-3.87-3.13-7-7-7z"/><path d="M1 10v2c4.97 0 9 4.03 9 9h2c0-6.08-4.93-11-11-11z"/>',
		'cast_connected': '<path d="M1 18v3h3c0-1.66-1.34-3-3-3z"/><path d="M1 14v2c2.76 0 5 2.24 5 5h2c0-3.87-3.13-7-7-7z"/><path d="M19 7H5v1.63c3.96 1.28 7.09 4.41 8.37 8.37H19V7z"/><path d="M1 10v2c4.97 0 9 4.03 9 9h2c0-6.08-4.93-11-11-11z"/><path d="M21 3H3c-1.1 0-2 .9-2 2v3h2V5h18v14h-7v2h7c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z"/>',
		'computer': '<path d="M20 18c1.1 0 1.99-.9 1.99-2L22 6c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2H0v2h24v-2h-4zM4 6h16v10H4V6z"/>',
		'desktop_mac': '<path d="M21 2H3c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h7l-2 3v1h8v-1l-2-3h7c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 12H3V4h18v10z"/>',
		'desktop_windows': '<path d="M21 2H3c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h7v2H8v2h8v-2h-2v-2h7c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H3V4h18v12z"/>',
		'developer_dashboard': '<path d="M18 19H4V5h14v14zm4-10V7h-2V5c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2v-2h2v-2h-2v-2h2v-2h-2V9h2z"/><path d="M6 13h5v4H6z"/><path d="M12 7h4v3h-4z"/><path d="M6 7h5v5H6z"/><path d="M12 11h4v6h-4z"/>',
		'device_hub': '<path d="M17 16l-4-4V8.82C14.16 8.4 15 7.3 15 6c0-1.66-1.34-3-3-3S9 4.34 9 6c0 1.3.84 2.4 2 2.82V12l-4 4H3v5h5v-3.05l4-4.2 4 4.2V21h5v-5h-4z"/>',
		'devices_other': '<path d="M3 6h18V4H3c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h4v-2H3V6z"/><path d="M11 17.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm2-5.5H9v1.78c-.61.55-1 1.33-1 2.22 0 .89.39 1.67 1 2.22V20h4v-1.78c.61-.55 1-1.34 1-2.22 0-.88-.39-1.67-1-2.22V12z"/><path d="M21 18h-4v-8h4v8zm1-10h-6c-.5 0-1 .5-1 1v10c0 .5.5 1 1 1h6c.5 0 1-.5 1-1V9c0-.5-.5-1-1-1z"/>',
		'dock': '<path d="M8 23h8v-2H8v2z"/><path d="M16 15H8V5h8v10zm0-13.99L8 1c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V3c0-1.1-.9-1.99-2-1.99z"/>',
		'gamepad': '<path d="M15 7.5V2H9v5.5l3 3 3-3z"/><path d="M7.5 9H2v6h5.5l3-3-3-3z"/><path d="M9 16.5V22h6v-5.5l-3-3-3 3z"/><path d="M16.5 9l-3 3 3 3H22V9h-5.5z"/>',
		'headset': '<path d="M12 1c-4.97 0-9 4.03-9 9v7c0 1.66 1.34 3 3 3h3v-8H5v-2c0-3.87 3.13-7 7-7s7 3.13 7 7v2h-4v8h3c1.66 0 3-1.34 3-3v-7c0-4.97-4.03-9-9-9z"/>',
		'headset_mic': '<path d="M12 1c-4.97 0-9 4.03-9 9v7c0 1.66 1.34 3 3 3h3v-8H5v-2c0-3.87 3.13-7 7-7s7 3.13 7 7v2h-4v8h4v1h-7v2h6c1.66 0 3-1.34 3-3V10c0-4.97-4.03-9-9-9z"/>',
		'keyboard': '<path d="M20 5H4c-1.1 0-1.99.9-1.99 2L2 17c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm-9 3h2v2h-2V8zm0 3h2v2h-2v-2zM8 8h2v2H8V8zm0 3h2v2H8v-2zm-1 2H5v-2h2v2zm0-3H5V8h2v2zm9 7H8v-2h8v2zm0-4h-2v-2h2v2zm0-3h-2V8h2v2zm3 3h-2v-2h2v2zm0-3h-2V8h2v2z"/>',
		'keyboard_arrow_down': '<path d="M7.41 7.84L12 12.42l4.59-4.58L18 9.25l-6 6-6-6z"/>',
		'keyboard_arrow_left': '<path d="M15.41 16.09l-4.58-4.59 4.58-4.59L14 5.5l-6 6 6 6z"/>',
		'keyboard_arrow_right': '<path d="M8.59 16.34l4.58-4.59-4.58-4.59L10 5.75l6 6-6 6z"/>',
		'keyboard_arrow_up': '<path d="M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6-6 6z"/>',
		'keyboard_backspace': '<path d="M21 11H6.83l3.58-3.59L9 6l-6 6 6 6 1.41-1.41L6.83 13H21z"/>',
		'keyboard_capslock': '<path d="M12 8.41L16.59 13 18 11.59l-6-6-6 6L7.41 13 12 8.41z"/><path d="M6 18h12v-2H6v2z"/>',
		'keyboard_hide': '<path d="M19 8h-2V6h2v2zm0 3h-2V9h2v2zm-3-3h-2V6h2v2zm0 3h-2V9h2v2zm0 4H8v-2h8v2zM7 8H5V6h2v2zm0 3H5V9h2v2zm1-2h2v2H8V9zm0-3h2v2H8V6zm3 3h2v2h-2V9zm0-3h2v2h-2V6zm9-3H4c-1.1 0-1.99.9-1.99 2L2 15c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z"/><path d="M12 23l4-4H8l4 4z"/>',
		'keyboard_return': '<path d="M19 7v4H5.83l3.58-3.59L8 6l-6 6 6 6 1.41-1.41L5.83 13H21V7z"/>',
		'keyboard_tab': '<path d="M11.59 7.41L15.17 11H1v2h14.17l-3.59 3.59L13 18l6-6-6-6-1.41 1.41z"/><path d="M20 6v12h2V6h-2z"/>',
		'keyboard_voice': '<path d="M12 15c1.66 0 2.99-1.34 2.99-3L15 6c0-1.66-1.34-3-3-3S9 4.34 9 6v6c0 1.66 1.34 3 3 3z"/><path d="M17.3 12c0 3-2.54 5.1-5.3 5.1S6.7 15 6.7 12H5c0 3.42 2.72 6.23 6 6.72V22h2v-3.28c3.28-.48 6-3.3 6-6.72h-1.7z"/>',
		'laptop': '<path d="M20 18c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2H0v2h24v-2h-4zM4 6h16v10H4V6z"/>',
		'laptop_chromebook': '<path d="M22 18V3H2v15H0v2h24v-2h-2zm-8 0h-4v-1h4v1zm6-3H4V5h16v10z"/>',
		'laptop_mac': '<path d="M20 18c1.1 0 1.99-.9 1.99-2L22 5c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v11c0 1.1.9 2 2 2H0c0 1.1.9 2 2 2h20c1.1 0 2-.9 2-2h-4zM4 5h16v11H4V5zm8 14c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1z"/>',
		'laptop_windows': '<path d="M20 18v-1c1.1 0 1.99-.9 1.99-2L22 5c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2v1H0v2h24v-2h-4zM4 5h16v10H4V5z"/>',
		'memory': '<path d="M13 13h-2v-2h2v2zm2-4H9v6h6V9z"/><path d="M17 17H7V7h10v10zm4-6V9h-2V7c0-1.1-.9-2-2-2h-2V3h-2v2h-2V3H9v2H7c-1.1 0-2 .9-2 2v2H3v2h2v2H3v2h2v2c0 1.1.9 2 2 2h2v2h2v-2h2v2h2v-2h2c1.1 0 2-.9 2-2v-2h2v-2h-2v-2h2z"/>',
		'mouse': '<path d="M13 1.07V9h7c0-4.08-3.05-7.44-7-7.93z"/><path d="M4 15c0 4.42 3.58 8 8 8s8-3.58 8-8v-4H4v4z"/><path d="M11 1.07C7.05 1.56 4 4.92 4 9h7V1.07z"/>',
		'phone_android': '<path d="M16 1H8C6.34 1 5 2.34 5 4v16c0 1.66 1.34 3 3 3h8c1.66 0 3-1.34 3-3V4c0-1.66-1.34-3-3-3zm-2 20h-4v-1h4v1zm3.25-3H6.75V4h10.5v14z"/>',
		'phone_iphone': '<path d="M15.5 1h-8C6.12 1 5 2.12 5 3.5v17C5 21.88 6.12 23 7.5 23h8c1.38 0 2.5-1.12 2.5-2.5v-17C18 2.12 16.88 1 15.5 1zm-4 21c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm4.5-4H7V4h9v14z"/>',
		'phonelink': '<path d="M4 6h18V4H4c-1.1 0-2 .9-2 2v11H0v3h14v-3H4V6z"/><path d="M22 17h-4v-7h4v7zm1-9h-6c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h6c.55 0 1-.45 1-1V9c0-.55-.45-1-1-1z"/>',
		'phonelink_off': '<path d="M22 6V4H6.82l2 2H22z"/><path d="M4 6.27L14.73 17H4V6.27zM1.92 1.65L.65 2.92l1.82 1.82C2.18 5.08 2 5.52 2 6v11H0v3h17.73l2.35 2.35 1.27-1.27L3.89 3.62 1.92 1.65z"/><path d="M23 8h-6c-.55 0-1 .45-1 1v4.18l2 2V10h4v7h-2.18l3 3H23c.55 0 1-.45 1-1V9c0-.55-.45-1-1-1z"/>',
		'power_input': '<path d="M2 9v2h19V9H2z"/><path d="M2 15h5v-2H2v2z"/><path d="M9 15h5v-2H9v2z"/><path d="M16 15h5v-2h-5v2z"/>',
		'router': '<path d="M20.2 5.9l.8-.8C19.6 3.7 17.8 3 16 3c-1.8 0-3.6.7-5 2.1l.8.8C13 4.8 14.5 4.2 16 4.2s3 .6 4.2 1.7z"/><path d="M19.3 6.7c-.9-.9-2.1-1.4-3.3-1.4-1.2 0-2.4.5-3.3 1.4l.8.8c.7-.7 1.6-1 2.5-1 .9 0 1.8.3 2.5 1l.8-.8z"/><path d="M15 18h-2v-2h2v2zm-3.5 0h-2v-2h2v2zM8 18H6v-2h2v2zm11-5h-2V9h-2v4H5c-1.1 0-2 .9-2 2v4c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2v-4c0-1.1-.9-2-2-2z"/>',
		'scanner': '<path d="M19.8 10.7L4.2 5l-.7 1.9L17.6 12H5c-1.1 0-2 .9-2 2v4c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2v-5.5c0-.8-.5-1.6-1.2-1.8zM7 17H5v-2h2v2zm12 0H9v-2h10v2z"/>',
		'security': '<path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z"/>',
		'sim_card': '<path d="M19.99 4c0-1.1-.89-2-1.99-2h-8L4 8v12c0 1.1.9 2 2 2h12.01c1.1 0 1.99-.9 1.99-2l-.01-16zM9 19H7v-2h2v2zm8 0h-2v-2h2v2zm-8-4H7v-4h2v4zm4 4h-2v-4h2v4zm0-6h-2v-2h2v2zm4 2h-2v-4h2v4z"/>',
		'smartphone': '<path d="M17 1.01L7 1c-1.1 0-2 .9-2 2v18c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V3c0-1.1-.9-1.99-2-1.99zM17 19H7V5h10v14z"/>',
		'speaker': '<path d="M12 20c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-16c1.1 0 2 .9 2 2s-.9 2-2 2c-1.11 0-2-.9-2-2s.89-2 2-2zm5-2H7c-1.1 0-2 .9-2 2v16c0 1.1.9 1.99 2 1.99L17 22c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/><path d="M12 12c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>',
		'speaker_group': '<path d="M18.2 1H9.8C8.81 1 8 1.81 8 2.8v14.4c0 .99.81 1.79 1.8 1.79l8.4.01c.99 0 1.8-.81 1.8-1.8V2.8c0-.99-.81-1.8-1.8-1.8zM14 3c1.1 0 2 .89 2 2s-.9 2-2 2-2-.89-2-2 .9-2 2-2zm0 13.5c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4z"/> <circle cx="14" cy="12.5" r="2.5"/> <path d="M6 5H4v16c0 1.1.89 2 2 2h10v-2H6V5z"/>',
		'tablet': '<path d="M21 4H3c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h18c1.1 0 1.99-.9 1.99-2L23 6c0-1.1-.9-2-2-2zm-2 14H5V6h14v12z"/>',
		'tablet_android': '<path d="M18 0H6C4.34 0 3 1.34 3 3v18c0 1.66 1.34 3 3 3h12c1.66 0 3-1.34 3-3V3c0-1.66-1.34-3-3-3zm-4 22h-4v-1h4v1zm5.25-3H4.75V3h14.5v16z"/>',
		'tablet_mac': '<path d="M18.5 0h-14C3.12 0 2 1.12 2 2.5v19C2 22.88 3.12 24 4.5 24h14c1.38 0 2.5-1.12 2.5-2.5v-19C21 1.12 19.88 0 18.5 0zm-7 23c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm7.5-4H4V3h15v16z"/>',
		'toys': '<path d="M12 12c0-3 2.5-5.5 5.5-5.5S23 9 23 12H12z"/><path d="M12 12c0 3-2.5 5.5-5.5 5.5S1 15 1 12h11z"/><path d="M12 12c-3 0-5.5-2.5-5.5-5.5S9 1 12 1v11z"/><path d="M12 12c3 0 5.5 2.5 5.5 5.5S15 23 12 23V12z"/>',
		'tv': '<path d="M21 3H3c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h5v2h8v-2h5c1.1 0 1.99-.9 1.99-2L23 5c0-1.1-.9-2-2-2zm0 14H3V5h18v12z"/>',
		'vidiogame_asset': '<path d="M21 6H3c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-10 7H8v3H6v-3H3v-2h3V8h2v3h3v2zm4.5 2c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm4-3c-.83 0-1.5-.67-1.5-1.5S18.67 9 19.5 9s1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/>',
		'watch': '<path d="M20 12c0-2.54-1.19-4.81-3.04-6.27L16 0H8l-.95 5.73C5.19 7.19 4 9.45 4 12s1.19 4.81 3.05 6.27L8 24h8l.96-5.73C18.81 16.81 20 14.54 20 12zM6 12c0-3.31 2.69-6 6-6s6 2.69 6 6-2.69 6-6 6-6-2.69-6-6z"/>',
		//
		// image
		//
		'add_a_photo': '<path d="M3 4V1h2v3h3v2H5v3H3V6H0V4h3z"/><path d="M13 19c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-7-9V7h3V4h7l1.83 2H21c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H5c-1.1 0-2-.9-2-2V10h3z"/><path d="M9.8 14c0 1.77 1.43 3.2 3.2 3.2 1.77 0 3.2-1.43 3.2-3.2 0-1.77-1.43-3.2-3.2-3.2-1.77 0-3.2 1.43-3.2 3.2z"/>',
		'add_to_photos': '<path d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6z"/><path d="M19 11h-4v4h-2v-4H9V9h4V5h2v4h4v2zm1-9H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/>',
		'adjust': '<path d="M12 20c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm0-18C6.49 2 2 6.49 2 12s4.49 10 10 10 10-4.49 10-10S17.51 2 12 2z"/><path d="M15 12c0 1.66-1.34 3-3 3s-3-1.34-3-3 1.34-3 3-3 3 1.34 3 3z"/>',
		'assistant_photo': '<path d="M14.4 6L14 4H5v17h2v-7h5.6l.4 2h7V6z"/>',
		'audiotrack': '<path d="M12 3v9.28c-.47-.17-.97-.28-1.5-.28C8.01 12 6 14.01 6 16.5S8.01 21 10.5 21c2.31 0 4.2-1.75 4.45-4H15V6h4V3h-7z"/>',
		'blur_circular': '<path d="M10 9c-.55 0-1 .45-1 1s.45 1 1 1 1-.45 1-1-.45-1-1-1z"/><path d="M10 13c-.55 0-1 .45-1 1s.45 1 1 1 1-.45 1-1-.45-1-1-1z"/><path d="M7 9.5c-.28 0-.5.22-.5.5s.22.5.5.5.5-.22.5-.5-.22-.5-.5-.5z"/><path d="M10 16.5c-.28 0-.5.22-.5.5s.22.5.5.5.5-.22.5-.5-.22-.5-.5-.5z"/><path d="M7 13.5c-.28 0-.5.22-.5.5s.22.5.5.5.5-.22.5-.5-.22-.5-.5-.5z"/><path d="M10 7.5c.28 0 .5-.22.5-.5s-.22-.5-.5-.5-.5.22-.5.5.22.5.5.5z"/><path d="M14 9c-.55 0-1 .45-1 1s.45 1 1 1 1-.45 1-1-.45-1-1-1z"/><path d="M14 7.5c.28 0 .5-.22.5-.5s-.22-.5-.5-.5-.5.22-.5.5.22.5.5.5z"/><path d="M17 13.5c-.28 0-.5.22-.5.5s.22.5.5.5.5-.22.5-.5-.22-.5-.5-.5z"/><path d="M17 9.5c-.28 0-.5.22-.5.5s.22.5.5.5.5-.22.5-.5-.22-.5-.5-.5z"/><path d="M12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm0-18C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"/><path d="M14 16.5c-.28 0-.5.22-.5.5s.22.5.5.5.5-.22.5-.5-.22-.5-.5-.5z"/><path d="M14 13c-.55 0-1 .45-1 1s.45 1 1 1 1-.45 1-1-.45-1-1-1z"/>',
		'blur_linear': '<path d="M5 17.5c.83 0 1.5-.67 1.5-1.5s-.67-1.5-1.5-1.5-1.5.67-1.5 1.5.67 1.5 1.5 1.5z"/><path d="M9 13c.55 0 1-.45 1-1s-.45-1-1-1-1 .45-1 1 .45 1 1 1z"/><path d="M9 9c.55 0 1-.45 1-1s-.45-1-1-1-1 .45-1 1 .45 1 1 1z"/><path d="M3 21h18v-2H3v2z"/><path d="M5 9.5c.83 0 1.5-.67 1.5-1.5S5.83 6.5 5 6.5 3.5 7.17 3.5 8 4.17 9.5 5 9.5z"/><path d="M5 13.5c.83 0 1.5-.67 1.5-1.5s-.67-1.5-1.5-1.5-1.5.67-1.5 1.5.67 1.5 1.5 1.5z"/><path d="M9 17c.55 0 1-.45 1-1s-.45-1-1-1-1 .45-1 1 .45 1 1 1z"/><path d="M17 16.5c.28 0 .5-.22.5-.5s-.22-.5-.5-.5-.5.22-.5.5.22.5.5.5z"/><path d="M3 3v2h18V3H3z"/><path d="M17 8.5c.28 0 .5-.22.5-.5s-.22-.5-.5-.5-.5.22-.5.5.22.5.5.5z"/><path d="M17 12.5c.28 0 .5-.22.5-.5s-.22-.5-.5-.5-.5.22-.5.5.22.5.5.5z"/><path d="M13 9c.55 0 1-.45 1-1s-.45-1-1-1-1 .45-1 1 .45 1 1 1z"/><path d="M13 13c.55 0 1-.45 1-1s-.45-1-1-1-1 .45-1 1 .45 1 1 1z"/><path d="M13 17c.55 0 1-.45 1-1s-.45-1-1-1-1 .45-1 1 .45 1 1 1z"/>',
		'blur_off': '<path d="M14 7c.55 0 1-.45 1-1s-.45-1-1-1-1 .45-1 1 .45 1 1 1z"/><path d="M13.8 11.48l.2.02c.83 0 1.5-.67 1.5-1.5s-.67-1.5-1.5-1.5-1.5.67-1.5 1.5l.02.2c.09.67.61 1.19 1.28 1.28z"/><path d="M14 3.5c.28 0 .5-.22.5-.5s-.22-.5-.5-.5-.5.22-.5.5.22.5.5.5z"/><path d="M10 3.5c.28 0 .5-.22.5-.5s-.22-.5-.5-.5-.5.22-.5.5.22.5.5.5z"/><path d="M21 10.5c.28 0 .5-.22.5-.5s-.22-.5-.5-.5-.5.22-.5.5.22.5.5.5z"/><path d="M10 7c.55 0 1-.45 1-1s-.45-1-1-1-1 .45-1 1 .45 1 1 1z"/><path d="M18 15c.55 0 1-.45 1-1s-.45-1-1-1-1 .45-1 1 .45 1 1 1z"/><path d="M18 11c.55 0 1-.45 1-1s-.45-1-1-1-1 .45-1 1 .45 1 1 1z"/><path d="M18 7c.55 0 1-.45 1-1s-.45-1-1-1-1 .45-1 1 .45 1 1 1z"/><path d="M14 20.5c-.28 0-.5.22-.5.5s.22.5.5.5.5-.22.5-.5-.22-.5-.5-.5z"/><path d="M2.5 5.27l3.78 3.78L6 9c-.55 0-1 .45-1 1s.45 1 1 1 1-.45 1-1c0-.1-.03-.19-.06-.28l2.81 2.81c-.71.11-1.25.73-1.25 1.47 0 .83.67 1.5 1.5 1.5.74 0 1.36-.54 1.47-1.25l2.81 2.81c-.09-.03-.18-.06-.28-.06-.55 0-1 .45-1 1s.45 1 1 1 1-.45 1-1c0-.1-.03-.19-.06-.28l3.78 3.78L20 20.23 3.77 4 2.5 5.27z"/><path d="M10 17c-.55 0-1 .45-1 1s.45 1 1 1 1-.45 1-1-.45-1-1-1z"/><path d="M21 13.5c-.28 0-.5.22-.5.5s.22.5.5.5.5-.22.5-.5-.22-.5-.5-.5z"/><path d="M6 13c-.55 0-1 .45-1 1s.45 1 1 1 1-.45 1-1-.45-1-1-1z"/><path d="M3 9.5c-.28 0-.5.22-.5.5s.22.5.5.5.5-.22.5-.5-.22-.5-.5-.5z"/><path d="M10 20.5c-.28 0-.5.22-.5.5s.22.5.5.5.5-.22.5-.5-.22-.5-.5-.5z"/><path d="M6 17c-.55 0-1 .45-1 1s.45 1 1 1 1-.45 1-1-.45-1-1-1z"/><path d="M3 13.5c-.28 0-.5.22-.5.5s.22.5.5.5.5-.22.5-.5-.22-.5-.5-.5z"/>',
		'blur_on': '<path d="M6 13c-.55 0-1 .45-1 1s.45 1 1 1 1-.45 1-1-.45-1-1-1z"/><path d="M6 17c-.55 0-1 .45-1 1s.45 1 1 1 1-.45 1-1-.45-1-1-1z"/><path d="M6 9c-.55 0-1 .45-1 1s.45 1 1 1 1-.45 1-1-.45-1-1-1z"/><path d="M3 9.5c-.28 0-.5.22-.5.5s.22.5.5.5.5-.22.5-.5-.22-.5-.5-.5z"/><path d="M6 5c-.55 0-1 .45-1 1s.45 1 1 1 1-.45 1-1-.45-1-1-1z"/><path d="M21 10.5c.28 0 .5-.22.5-.5s-.22-.5-.5-.5-.5.22-.5.5.22.5.5.5z"/><path d="M14 7c.55 0 1-.45 1-1s-.45-1-1-1-1 .45-1 1 .45 1 1 1z"/><path d="M14 3.5c.28 0 .5-.22.5-.5s-.22-.5-.5-.5-.5.22-.5.5.22.5.5.5z"/><path d="M3 13.5c-.28 0-.5.22-.5.5s.22.5.5.5.5-.22.5-.5-.22-.5-.5-.5z"/><path d="M10 20.5c-.28 0-.5.22-.5.5s.22.5.5.5.5-.22.5-.5-.22-.5-.5-.5z"/><path d="M10 3.5c.28 0 .5-.22.5-.5s-.22-.5-.5-.5-.5.22-.5.5.22.5.5.5z"/><path d="M10 7c.55 0 1-.45 1-1s-.45-1-1-1-1 .45-1 1 .45 1 1 1z"/><path d="M10 12.5c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5 1.5-.67 1.5-1.5-.67-1.5-1.5-1.5z"/><path d="M18 13c-.55 0-1 .45-1 1s.45 1 1 1 1-.45 1-1-.45-1-1-1z"/><path d="M18 17c-.55 0-1 .45-1 1s.45 1 1 1 1-.45 1-1-.45-1-1-1z"/><path d="M18 9c-.55 0-1 .45-1 1s.45 1 1 1 1-.45 1-1-.45-1-1-1z"/><path d="M18 5c-.55 0-1 .45-1 1s.45 1 1 1 1-.45 1-1-.45-1-1-1z"/><path d="M21 13.5c-.28 0-.5.22-.5.5s.22.5.5.5.5-.22.5-.5-.22-.5-.5-.5z"/><path d="M14 17c-.55 0-1 .45-1 1s.45 1 1 1 1-.45 1-1-.45-1-1-1z"/><path d="M14 20.5c-.28 0-.5.22-.5.5s.22.5.5.5.5-.22.5-.5-.22-.5-.5-.5z"/><path d="M10 8.5c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5 1.5-.67 1.5-1.5-.67-1.5-1.5-1.5z"/><path d="M10 17c-.55 0-1 .45-1 1s.45 1 1 1 1-.45 1-1-.45-1-1-1z"/><path d="M14 12.5c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5 1.5-.67 1.5-1.5-.67-1.5-1.5-1.5z"/><path d="M14 8.5c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5 1.5-.67 1.5-1.5-.67-1.5-1.5-1.5z"/>',
		'brightness_1': '<circle cx="12" cy="12" r="10"/>',
		'brightness_2': '<path d="M10 2c-1.82 0-3.53.5-5 1.35C7.99 5.08 10 8.3 10 12s-2.01 6.92-5 8.65C6.47 21.5 8.18 22 10 22c5.52 0 10-4.48 10-10S15.52 2 10 2z"/>',
		'brightness_3': '<path d="M9 2c-1.05 0-2.05.16-3 .46 4.06 1.27 7 5.06 7 9.54 0 4.48-2.94 8.27-7 9.54.95.3 1.95.46 3 .46 5.52 0 10-4.48 10-10S14.52 2 9 2z"/>',
		'brightness_4': '<path d="M20 8.69V4h-4.69L12 .69 8.69 4H4v4.69L.69 12 4 15.31V20h4.69L12 23.31 15.31 20H20v-4.69L23.31 12 20 8.69zM12 18c-.89 0-1.74-.2-2.5-.55C11.56 16.5 13 14.42 13 12s-1.44-4.5-3.5-5.45C10.26 6.2 11.11 6 12 6c3.31 0 6 2.69 6 6s-2.69 6-6 6z"/>',
		'brightness_5': '<path d="M20 15.31L23.31 12 20 8.69V4h-4.69L12 .69 8.69 4H4v4.69L.69 12 4 15.31V20h4.69L12 23.31 15.31 20H20v-4.69zM12 18c-3.31 0-6-2.69-6-6s2.69-6 6-6 6 2.69 6 6-2.69 6-6 6z"/>',
		'brightness_6': '<path d="M20 15.31L23.31 12 20 8.69V4h-4.69L12 .69 8.69 4H4v4.69L.69 12 4 15.31V20h4.69L12 23.31 15.31 20H20v-4.69zM12 18V6c3.31 0 6 2.69 6 6s-2.69 6-6 6z"/>',
		'brightness_7': '<path d="M12 18c-3.31 0-6-2.69-6-6s2.69-6 6-6 6 2.69 6 6-2.69 6-6 6zm8-9.31V4h-4.69L12 .69 8.69 4H4v4.69L.69 12 4 15.31V20h4.69L12 23.31 15.31 20H20v-4.69L23.31 12 20 8.69z"/><path d="M12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4z"/>',
		'broken_image': '<path d="M21 5v6.59l-3-3.01-4 4.01-4-4-4 4-3-3.01V5c0-1.1.9-2 2-2h14c1.1 0 2 .9 2 2z"/><path d="M18 11.42l3 3.01V19c0 1.1-.9 2-2 2H5c-1.1 0-2-.9-2-2v-6.58l3 2.99 4-4 4 4 4-3.99z"/>',
		'brush': '<path d="M7 14c-1.66 0-3 1.34-3 3 0 1.31-1.16 2-2 2 .92 1.22 2.49 2 4 2 2.21 0 4-1.79 4-4 0-1.66-1.34-3-3-3z"/><path d="M20.71 4.63l-1.34-1.34c-.39-.39-1.02-.39-1.41 0L9 12.25 11.75 15l8.96-8.96c.39-.39.39-1.02 0-1.41z"/>',
		'burst_mode': '<path d="M1 5h2v14H1z"/><path d="M5 5h2v14H5z"/><path d="M11 17l2.5-3.15L15.29 16l2.5-3.22L21 17H11zM22 5H10c-.55 0-1 .45-1 1v12c0 .55.45 1 1 1h12c.55 0 1-.45 1-1V6c0-.55-.45-1-1-1z"/>',
		'camera': '<path d="M9.4 10.5l4.77-8.26C13.47 2.09 12.75 2 12 2c-2.4 0-4.6.85-6.32 2.25l3.66 6.35.06-.1z"/><path d="M21.54 9c-.92-2.92-3.15-5.26-6-6.34L11.88 9h9.66z"/><path d="M21.8 10h-7.49l.29.5 4.76 8.25C21 16.97 22 14.61 22 12c0-.69-.07-1.35-.2-2z"/><path d="M8.54 12l-3.9-6.75C3.01 7.03 2 9.39 2 12c0 .69.07 1.35.2 2h7.49l-1.15-2z"/><path d="M2.46 15c.92 2.92 3.15 5.26 6 6.34L12.12 15H2.46z"/><path d="M13.73 15l-3.9 6.76c.7.15 1.42.24 2.17.24 2.4 0 4.6-.85 6.32-2.25l-3.66-6.35-.93 1.6z"/>',
		'camera_alt': '<circle cx="12" cy="12" r="3.2"/><path d="M12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zM9 2L7.17 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2h-3.17L15 2H9z"/>',
		'camera_front': '<path d="M10 20H5v2h5v2l3-3-3-3v2z"/><path d="M14 20v2h5v-2h-5z"/><path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-1.99.9-1.99 2S10.9 8 12 8z"/><path d="M7 2h10v10.5c0-1.67-3.33-2.5-5-2.5s-5 .83-5 2.5V2zm10-2H7C5.9 0 5 .9 5 2v14c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V2c0-1.1-.9-2-2-2z"/>',
		'camera_rear': '<path d="M10 20H5v2h5v2l3-3-3-3v2z"/><path d="M14 20v2h5v-2h-5z"/><path d="M12 6c-1.11 0-2-.9-2-2s.89-2 1.99-2 2 .9 2 2C14 5.1 13.1 6 12 6zm5-6H7C5.9 0 5 .9 5 2v14c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V2c0-1.1-.9-2-2-2z"/>',
		'camera_roll': '<path d="M14 5c0-1.1-.9-2-2-2h-1V2c0-.55-.45-1-1-1H6c-.55 0-1 .45-1 1v1H4c-1.1 0-2 .9-2 2v15c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2h8V5h-8zm-2 13h-2v-2h2v2zm0-9h-2V7h2v2zm4 9h-2v-2h2v2zm0-9h-2V7h2v2zm4 9h-2v-2h2v2zm0-9h-2V7h2v2z"/>',
		'center_focus_strong': '<path d="M12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4z"/><path d="M5 15H3v4c0 1.1.9 2 2 2h4v-2H5v-4z"/><path d="M5 5h4V3H5c-1.1 0-2 .9-2 2v4h2V5z"/><path d="M19 3h-4v2h4v4h2V5c0-1.1-.9-2-2-2z"/><path d="M19 19h-4v2h4c1.1 0 2-.9 2-2v-4h-2v4z"/>',
		'center_focus_weak': '<path d="M5 15H3v4c0 1.1.9 2 2 2h4v-2H5v-4z"/><path d="M5 5h4V3H5c-1.1 0-2 .9-2 2v4h2V5z"/><path d="M19 3h-4v2h4v4h2V5c0-1.1-.9-2-2-2z"/><path d="M19 19h-4v2h4c1.1 0 2-.9 2-2v-4h-2v4z"/><path d="M12 14c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm0-6c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4z"/>',
		'collections': '<path d="M11 12l2.03 2.71L16 11l4 5H8l3-4zm11 4V4c0-1.1-.9-2-2-2H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2z"/><path d="M2 6v14c0 1.1.9 2 2 2h14v-2H4V6H2z"/>',
		'collections_bookmark': '<path d="M20 2H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 10l-2.5-1.5L15 12V4h5v8z"/>',
		'color_lens': '<path d="M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9c.83 0 1.5-.67 1.5-1.5 0-.39-.15-.74-.39-1.01-.23-.26-.38-.61-.38-.99 0-.83.67-1.5 1.5-1.5H16c2.76 0 5-2.24 5-5 0-4.42-4.03-8-9-8zm-5.5 9c-.83 0-1.5-.67-1.5-1.5S5.67 9 6.5 9 8 9.67 8 10.5 7.33 12 6.5 12zm3-4C8.67 8 8 7.33 8 6.5S8.67 5 9.5 5s1.5.67 1.5 1.5S10.33 8 9.5 8zm5 0c-.83 0-1.5-.67-1.5-1.5S13.67 5 14.5 5s1.5.67 1.5 1.5S15.33 8 14.5 8zm3 4c-.83 0-1.5-.67-1.5-1.5S16.67 9 17.5 9s1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/>',
		'colorize': '<path d="M20.71 5.63l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-3.12 3.12-1.93-1.91-1.41 1.41 1.42 1.42L3 16.25V21h4.75l8.92-8.92 1.42 1.42 1.41-1.41-1.92-1.92 3.12-3.12c.4-.4.4-1.03.01-1.42zM6.92 19L5 17.08l8.06-8.06 1.92 1.92L6.92 19z"/>',
		'compare': '<path d="M10 18H5l5-6v6zm0-15H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h5v2h2V1h-2v2z"/><path d="M19 3h-5v2h5v13l-5-6v9h5c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z"/>',
		'control_point': '<path d="M13 7h-2v4H7v2h4v4h2v-4h4v-2h-4V7z"/><path d="M12 20c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm0-18C6.49 2 2 6.49 2 12s4.49 10 10 10 10-4.49 10-10S17.51 2 12 2z"/>',
		'control_point_duplicate': '<path d="M16 8h-2v3h-3v2h3v3h2v-3h3v-2h-3z"/><path d="M2 12c0-2.79 1.64-5.2 4.01-6.32V3.52C2.52 4.76 0 8.09 0 12s2.52 7.24 6.01 8.48v-2.16C3.64 17.2 2 14.79 2 12z"/><path d="M15 19c-3.86 0-7-3.14-7-7s3.14-7 7-7 7 3.14 7 7-3.14 7-7 7zm0-16c-4.96 0-9 4.04-9 9s4.04 9 9 9 9-4.04 9-9-4.04-9-9-9z"/>',
		'crop': '<path d="M17 15h2V7c0-1.1-.9-2-2-2H9v2h8v8z"/><path d="M7 17V1H5v4H1v2h4v10c0 1.1.9 2 2 2h10v4h2v-4h4v-2H7z"/>',
		'crop_16_9': '<path d="M19 6H5c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm0 10H5V8h14v8z"/>',
		'crop_3_2': '<path d="M19 4H5c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 14H5V6h14v12z"/>',
		'crop_5_4': '<path d="M19 5H5c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 12H5V7h14v10z"/>',
		'crop_7_5': '<path d="M19 7H5c-1.1 0-2 .9-2 2v6c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V9c0-1.1-.9-2-2-2zm0 8H5V9h14v6z"/>',
		'crop_din': '<path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14z"/>',
		'crop_free': '<path d="M3 5v4h2V5h4V3H5c-1.1 0-2 .9-2 2z"/><path d="M5 15H3v4c0 1.1.9 2 2 2h4v-2H5v-4z"/><path d="M19 19h-4v2h4c1.1 0 2-.9 2-2v-4h-2v4z"/><path d="M19 3h-4v2h4v4h2V5c0-1.1-.9-2-2-2z"/>',
		'crop_landscape': '<path d="M19 5H5c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 12H5V7h14v10z"/>',
		'crop_original': '<path d="M19 19H5V5h14v14zm0-16H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z"/><path d="M13.96 12.29l-2.75 3.54-1.96-2.36L6.5 17h11l-3.54-4.71z"/>',
		'crop_portrait': '<path d="M17 3H7c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H7V5h10v14z"/>',
		'crop_rotate': '<path d="M7.47 21.49C4.2 19.93 1.86 16.76 1.5 13H0c.51 6.16 5.66 11 11.95 11 .23 0 .44-.02.66-.03L8.8 20.15l-1.33 1.34z"/><path d="M12.05 0c-.23 0-.44.02-.66.04l3.81 3.81 1.33-1.33C19.8 4.07 22.14 7.24 22.5 11H24c-.51-6.16-5.66-11-11.95-11z"/><path d="M16 14h2V8a2 2 0 0 0-2-2h-6v2h6v6z"/><path d="M8 16V4H6v2H4v2h2v8a2 2 0 0 0 2 2h8v2h2v-2h2v-2H8z"/>',
		'crop_square': '<path d="M18 4H6c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 14H6V6h12v12z"/>',
		'dehaze': '<path d="M2 15.5v2h20v-2H2z"/><path d="M2 10.5v2h20v-2H2z"/><path d="M2 5.5v2h20v-2H2z"/>',
		'details': '<path d="M3 4l9 16 9-16H3zm3.38 2h11.25L12 16 6.38 6z"/>',
		'edit': '<path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25z"/><path d="M20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>',
		'exposure': '<path d="M15 17v2h2v-2h2v-2h-2v-2h-2v2h-2v2h2z"/><path d="M20 20H4L20 4v16zM5 5h6v2H5V5zm15-3H4c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/>',
		'exposure_neg_1': '<path d="M4 11v2h8v-2H4z"/><path d="M19 18h-2V7.38L14 8.4V6.7L18.7 5h.3v13z"/>',
		'exposure_neg_2': '<path d="M15.05 16.29l2.86-3.07c.38-.39.72-.79 1.04-1.18.32-.39.59-.78.82-1.17.23-.39.41-.78.54-1.17.13-.39.19-.79.19-1.18 0-.53-.09-1.02-.27-1.46-.18-.44-.44-.81-.78-1.11-.34-.31-.77-.54-1.26-.71A5.72 5.72 0 0 0 16.47 5c-.69 0-1.31.11-1.85.32-.54.21-1 .51-1.36.88-.37.37-.65.8-.84 1.3-.18.47-.27.97-.28 1.5h2.14c.01-.31.05-.6.13-.87.09-.29.23-.54.4-.75.18-.21.41-.37.68-.49.27-.12.6-.18.96-.18.31 0 .58.05.81.15.23.1.43.25.59.43.16.18.28.4.37.65.08.25.13.52.13.81 0 .22-.03.43-.08.65-.06.22-.15.45-.29.7-.14.25-.32.53-.56.83-.23.3-.52.65-.88 1.03l-4.17 4.55V18H21v-1.71h-5.95z"/><path d="M2 11v2h8v-2H2z"/>',
		'exposure_plus_1': '<path d="M10 7H8v4H4v2h4v4h2v-4h4v-2h-4V7z"/><path d="M20 18h-2V7.38L15 8.4V6.7L19.7 5h.3v13z"/>',
		'exposure_plus_2': '<path d="M16.05 16.29l2.86-3.07c.38-.39.72-.79 1.04-1.18.32-.39.59-.78.82-1.17.23-.39.41-.78.54-1.17.13-.39.19-.79.19-1.18 0-.53-.09-1.02-.27-1.46-.18-.44-.44-.81-.78-1.11-.34-.31-.77-.54-1.26-.71A5.72 5.72 0 0 0 17.47 5c-.69 0-1.31.11-1.85.32-.54.21-1 .51-1.36.88-.37.37-.65.8-.84 1.3-.18.47-.27.97-.28 1.5h2.14c.01-.31.05-.6.13-.87.09-.29.23-.54.4-.75.18-.21.41-.37.68-.49.27-.12.6-.18.96-.18.31 0 .58.05.81.15.23.1.43.25.59.43.16.18.28.4.37.65.08.25.13.52.13.81 0 .22-.03.43-.08.65-.06.22-.15.45-.29.7-.14.25-.32.53-.56.83-.23.3-.52.65-.88 1.03l-4.17 4.55V18H22v-1.71h-5.95z"/><path d="M8 7H6v4H2v2h4v4h2v-4h4v-2H8V7z"/>',
		'exposure_zero': '<path d="M16.14 12.5c0 1-.1 1.85-.3 2.55-.2.7-.48 1.27-.83 1.7-.36.44-.79.75-1.3.95-.51.2-1.07.3-1.7.3-.62 0-1.18-.1-1.69-.3-.51-.2-.95-.51-1.31-.95-.36-.44-.65-1.01-.85-1.7-.2-.7-.3-1.55-.3-2.55v-2.04c0-1 .1-1.85.3-2.55.2-.7.48-1.26.84-1.69.36-.43.8-.74 1.31-.93C10.81 5.1 11.38 5 12 5c.63 0 1.19.1 1.7.29.51.19.95.5 1.31.93.36.43.64.99.84 1.69.2.7.3 1.54.3 2.55v2.04zm-2.11-2.36c0-.64-.05-1.18-.13-1.62-.09-.44-.22-.79-.4-1.06-.17-.27-.39-.46-.64-.58-.25-.13-.54-.19-.86-.19-.32 0-.61.06-.86.18s-.47.31-.64.58c-.17.27-.31.62-.4 1.06s-.13.98-.13 1.62v2.67c0 .64.05 1.18.14 1.62.09.45.23.81.4 1.09s.39.48.64.61.54.19.87.19c.33 0 .62-.06.87-.19s.46-.33.63-.61c.17-.28.3-.64.39-1.09.09-.45.13-.99.13-1.62v-2.66z"/>',
		'filter': '<path d="M15.96 10.29l-2.75 3.54-1.96-2.36L8.5 15h11l-3.54-4.71z"/><path d="M3 5H1v16c0 1.1.9 2 2 2h16v-2H3V5z"/><path d="M21 17H7V3h14v14zm0-16H7c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V3c0-1.1-.9-2-2-2z"/>',
		'filter_1': '<path d="M3 5H1v16c0 1.1.9 2 2 2h16v-2H3V5z"/><path d="M14 15h2V5h-4v2h2v8z"/><path d="M21 17H7V3h14v14zm0-16H7c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V3c0-1.1-.9-2-2-2z"/>',
		'filter_2': '<path d="M3 5H1v16c0 1.1.9 2 2 2h16v-2H3V5z"/><path d="M21 17H7V3h14v14zm0-16H7c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V3c0-1.1-.9-2-2-2z"/><path d="M17 13h-4v-2h2a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-4v2h4v2h-2a2 2 0 0 0-2 2v4h6v-2z"/>',
		'filter_3': '<path d="M21 17H7V3h14v14zm0-16H7c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V3c0-1.1-.9-2-2-2z"/><path d="M3 5H1v16c0 1.1.9 2 2 2h16v-2H3V5z"/><path d="M17 13v-1.5c0-.83-.67-1.5-1.5-1.5.83 0 1.5-.67 1.5-1.5V7a2 2 0 0 0-2-2h-4v2h4v2h-2v2h2v2h-4v2h4a2 2 0 0 0 2-2z"/>',
		'filter_4': '<path d="M3 5H1v16c0 1.1.9 2 2 2h16v-2H3V5z"/><path d="M15 15h2V5h-2v4h-2V5h-2v6h4v4z"/><path d="M21 17H7V3h14v14zm0-16H7c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V3c0-1.1-.9-2-2-2z"/>',
		'filter_5': '<path d="M21 17H7V3h14v14zm0-16H7c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V3c0-1.1-.9-2-2-2z"/><path d="M3 5H1v16c0 1.1.9 2 2 2h16v-2H3V5z"/><path d="M17 13v-2a2 2 0 0 0-2-2h-2V7h4V5h-6v6h4v2h-4v2h4a2 2 0 0 0 2-2z"/>',
		'filter_6': '<path d="M3 5H1v16c0 1.1.9 2 2 2h16v-2H3V5z"/><path d="M21 17H7V3h14v14zm0-16H7c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V3c0-1.1-.9-2-2-2z"/><path d="M13 11h2v2h-2v-2zm0 4h2a2 2 0 0 0 2-2v-2a2 2 0 0 0-2-2h-2V7h4V5h-4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2z"/>',
		'filter_7': '<path d="M3 5H1v16c0 1.1.9 2 2 2h16v-2H3V5z"/><path d="M21 17H7V3h14v14zm0-16H7c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V3c0-1.1-.9-2-2-2z"/><path d="M13 15l4-8V5h-6v2h4l-4 8h2z"/>',
		'filter_8': '<path d="M3 5H1v16c0 1.1.9 2 2 2h16v-2H3V5z"/><path d="M21 17H7V3h14v14zm0-16H7c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V3c0-1.1-.9-2-2-2z"/><path d="M13 11h2v2h-2v-2zm0-4h2v2h-2V7zm0 8h2a2 2 0 0 0 2-2v-1.5c0-.83-.67-1.5-1.5-1.5.83 0 1.5-.67 1.5-1.5V7a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v1.5c0 .83.67 1.5 1.5 1.5-.83 0-1.5.67-1.5 1.5V13a2 2 0 0 0 2 2z"/>',
		'filter_9': '<path d="M3 5H1v16c0 1.1.9 2 2 2h16v-2H3V5z"/><path d="M21 17H7V3h14v14zm0-16H7c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V3c0-1.1-.9-2-2-2z"/><path d="M15 9h-2V7h2v2zm0-4h-2a2 2 0 0 0-2 2v2a2 2 0 0 0 2 2h2v2h-4v2h4a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2z"/>',
		'filter_9_plus': '<path d="M3 5H1v16c0 1.1.9 2 2 2h16v-2H3V5z"/><path d="M11 9V8h1v1h-1zm3 3V8a2 2 0 0 0-2-2h-1a2 2 0 0 0-2 2v1a2 2 0 0 0 2 2h1v1H9v2h3a2 2 0 0 0 2-2z"/><path d="M21 9h-2V7h-2v2h-2v2h2v2h2v-2h2v6H7V3h14v6zm0-8H7c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V3c0-1.1-.9-2-2-2z"/>',
		'filter_b_and_w': '<path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16l-7-8v8H5l7-8V5h7v14z"/>',
		'filter_center_focus': '<path d="M5 15H3v4c0 1.1.9 2 2 2h4v-2H5v-4z"/><path d="M5 5h4V3H5c-1.1 0-2 .9-2 2v4h2V5z"/><path d="M19 3h-4v2h4v4h2V5c0-1.1-.9-2-2-2z"/><path d="M19 19h-4v2h4c1.1 0 2-.9 2-2v-4h-2v4z"/><path d="M12 9c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>',
		'filter_drama': '<path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.61 5.64 5.36 8.04 2.35 8.36 0 10.9 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM19 18H6c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4h2c0-2.76-1.86-5.08-4.4-5.78C8.61 6.88 10.2 6 12 6c3.03 0 5.5 2.47 5.5 5.5v.5H19c1.65 0 3 1.35 3 3s-1.35 3-3 3z"/>',
		'filter_frames': '<path d="M20 20H4V6h4.52l3.52-3.5L15.52 6H20v14zm0-16h-4l-4-4-4 4H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2z"/><path d="M18 8H6v10h12"/>',
		'filter_hdr': '<path d="M14 6l-3.75 5 2.85 3.8-1.6 1.2C9.81 13.75 7 10 7 10l-6 8h22L14 6z"/>',
		'filter_none': '<path d="M3 5H1v16c0 1.1.9 2 2 2h16v-2H3V5z"/><path d="M21 17H7V3h14v14zm0-16H7c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V3c0-1.1-.9-2-2-2z"/>',
		'filter_tilt_shift': '<path d="M11 4.07V2.05c-2.01.2-3.84 1-5.32 2.21L7.1 5.69A7.941 7.941 0 0 1 11 4.07z"/><path d="M18.32 4.26A9.949 9.949 0 0 0 13 2.05v2.02c1.46.18 2.79.76 3.9 1.62l1.42-1.43z"/><path d="M19.93 11h2.02c-.2-2.01-1-3.84-2.21-5.32L18.31 7.1a7.941 7.941 0 0 1 1.62 3.9z"/><path d="M5.69 7.1L4.26 5.68A9.949 9.949 0 0 0 2.05 11h2.02c.18-1.46.76-2.79 1.62-3.9z"/><path d="M4.07 13H2.05c.2 2.01 1 3.84 2.21 5.32l1.43-1.43A7.868 7.868 0 0 1 4.07 13z"/><path d="M15 12c0-1.66-1.34-3-3-3s-3 1.34-3 3 1.34 3 3 3 3-1.34 3-3z"/><path d="M18.31 16.9l1.43 1.43a9.981 9.981 0 0 0 2.21-5.32h-2.02a7.945 7.945 0 0 1-1.62 3.89z"/><path d="M13 19.93v2.02c2.01-.2 3.84-1 5.32-2.21l-1.43-1.43c-1.1.86-2.43 1.44-3.89 1.62z"/><path d="M5.68 19.74A9.981 9.981 0 0 0 11 21.95v-2.02a7.941 7.941 0 0 1-3.9-1.62l-1.42 1.43z"/>',
		'filter_vintage': '<path d="M18.7 12.4c-.28-.16-.57-.29-.86-.4.29-.11.58-.24.86-.4 1.92-1.11 2.99-3.12 3-5.19-1.79-1.03-4.07-1.11-6 0-.28.16-.54.35-.78.54.05-.31.08-.63.08-.95 0-2.22-1.21-4.15-3-5.19C10.21 1.85 9 3.78 9 6c0 .32.03.64.08.95-.24-.2-.5-.39-.78-.55-1.92-1.11-4.2-1.03-6 0 0 2.07 1.07 4.08 3 5.19.28.16.57.29.86.4-.29.11-.58.24-.86.4-1.92 1.11-2.99 3.12-3 5.19 1.79 1.03 4.07 1.11 6 0 .28-.16.54-.35.78-.54-.05.32-.08.64-.08.96 0 2.22 1.21 4.15 3 5.19 1.79-1.04 3-2.97 3-5.19 0-.32-.03-.64-.08-.95.24.2.5.38.78.54 1.92 1.11 4.2 1.03 6 0-.01-2.07-1.08-4.08-3-5.19zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4z"/>',
		'flare': '<path d="M7 11H1v2h6v-2z"/><path d="M9.17 7.76L7.05 5.64 5.64 7.05l2.12 2.12 1.41-1.41z"/><path d="M13 1h-2v6h2V1z"/><path d="M18.36 7.05l-1.41-1.41-2.12 2.12 1.41 1.41 2.12-2.12z"/><path d="M17 11v2h6v-2h-6z"/><path d="M12 9c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/><path d="M14.83 16.24l2.12 2.12 1.41-1.41-2.12-2.12-1.41 1.41z"/><path d="M5.64 16.95l1.41 1.41 2.12-2.12-1.41-1.41-2.12 2.12z"/><path d="M11 23h2v-6h-2v6z"/>',
		'flash_auto': '<path d="M3 2v12h3v9l7-12H9l4-9H3z"/><path d="M16.85 7.65L18 4l1.15 3.65h-2.3zM19 2h-2l-3.2 9h1.9l.7-2h3.2l.7 2h1.9L19 2z"/>',
		'flash_off': '<path d="M3.27 3L2 4.27l5 5V13h3v9l3.58-6.14L17.73 20 19 18.73 3.27 3z"/><path d="M17 10h-4l4-8H7v2.18l8.46 8.46L17 10z"/>',
		'flash_on': '<path d="M7 2v11h3v9l7-12h-4l4-8z"/>',
		'flip': '<path d="M15 21h2v-2h-2v2z"/><path d="M19 9h2V7h-2v2z"/><path d="M3 5v14c0 1.1.9 2 2 2h4v-2H5V5h4V3H5c-1.1 0-2 .9-2 2z"/><path d="M19 3v2h2c0-1.1-.9-2-2-2z"/><path d="M11 23h2V1h-2v22z"/><path d="M19 17h2v-2h-2v2z"/><path d="M15 5h2V3h-2v2z"/><path d="M19 13h2v-2h-2v2z"/><path d="M19 21c1.1 0 2-.9 2-2h-2v2z"/>',
		'gradient': '<path d="M11 9h2v2h-2zm-2 2h2v2H9zm4 0h2v2h-2zm2-2h2v2h-2zM7 9h2v2H7zm12-6H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 18H7v-2h2v2zm4 0h-2v-2h2v2zm4 0h-2v-2h2v2zm2-7h-2v2h2v2h-2v-2h-2v2h-2v-2h-2v2H9v-2H7v2H5v-2h2v-2H5V5h14v6z"/>',
		'grain': '<path d="M10 12c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/><path d="M6 8c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/><path d="M6 16c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/><path d="M18 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2z"/><path d="M14 16c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/><path d="M18 12c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/><path d="M14 8c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/><path d="M10 4c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>',
		'grid_off': '<path d="M16 4h4v4h-4V4zM8 4v1.45l2 2V4h4v4h-3.45l2 2H14v1.45l2 2V10h4v4h-3.45l2 2H20v1.45l2 2V4c0-1.1-.9-2-2-2H4.55l2 2H8z"/><path d="M16 20v-1.46L17.46 20H16zm-2 0h-4v-4h3.45l.55.54V20zm-6-6H4v-4h3.45l.55.55V14zm0 6H4v-4h4v4zM4 6.55L5.45 8H4V6.55zm6 6L11.45 14H10v-1.45zM1.27 1.27L0 2.55l2 2V20c0 1.1.9 2 2 2h15.46l2 2 1.27-1.27L1.27 1.27z"/>',
		'grid_on': '<path d="M20 2H4c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM8 20H4v-4h4v4zm0-6H4v-4h4v4zm0-6H4V4h4v4zm6 12h-4v-4h4v4zm0-6h-4v-4h4v4zm0-6h-4V4h4v4zm6 12h-4v-4h4v4zm0-6h-4v-4h4v4zm0-6h-4V4h4v4z"/>',
		'hdr_off': '<path d="M13 15h-2v-2.45l2 2V15zm5 2L3.27 2.27 2 3.55l4 4V11H4V7H2v10h2v-4h2v4h2V9.55l1 1V17h4c.67 0 1.26-.33 1.62-.84l6.34 6.34 1.27-1.27L18 17z"/><path d="M18 9h2v2h-2V9zm0 4h1l.82 3.27.73.73H22l-1.19-4.17c.7-.31 1.19-1.01 1.19-1.83V9c0-1.1-.9-2-2-2h-4v5.45l2 2V13z"/><path d="M15 11.45V9c0-1.1-.9-2-2-2h-2.45L15 11.45z"/>',
		'hdr_on': '<path d="M6 11H4V7H2v10h2v-4h2v4h2V7H6v4z"/><path d="M13 15h-2V9h2v6zm0-8H9v10h4c1.1 0 2-.9 2-2V9c0-1.1-.9-2-2-2z"/><path d="M20 11h-2V9h2v2zm2 0V9c0-1.1-.9-2-2-2h-4v10h2v-4h1l1 4h2l-1.19-4.17c.7-.31 1.19-1.01 1.19-1.83z"/>',
		'hdr_strong': '<path d="M17 6c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6z"/><path d="M5 14c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm0-6c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4z"/>',
		'hdr_weak': '<path d="M5 8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4z"/><path d="M17 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm0-10c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6z"/>',
		'healing': '<path d="M17.73 12.02l3.98-3.98c.39-.39.39-1.02 0-1.41l-4.34-4.34c-.39-.39-1.02-.39-1.41 0l-3.98 3.98L8 2.29C7.8 2.1 7.55 2 7.29 2c-.25 0-.51.1-.7.29L2.25 6.63c-.39.39-.39 1.02 0 1.41l3.98 3.98L2.25 16c-.39.39-.39 1.02 0 1.41l4.34 4.34c.39.39 1.02.39 1.41 0l3.98-3.98 3.98 3.98c.2.2.45.29.71.29.26 0 .51-.1.71-.29l4.34-4.34c.39-.39.39-1.02 0-1.41l-3.99-3.98zM12 9c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm-4.71 1.96L3.66 7.34l3.63-3.63 3.62 3.62-3.62 3.63zM10 13c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm2 2c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm2-4c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm2.66 9.34l-3.63-3.62 3.63-3.63 3.62 3.62-3.62 3.63z"/>',
		'image': '<path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>',
		'image_aspect_ratio': '<path d="M16 10h-2v2h2v-2z"/><path d="M16 14h-2v2h2v-2z"/><path d="M8 10H6v2h2v-2z"/><path d="M12 10h-2v2h2v-2z"/><path d="M20 18H4V6h16v12zm0-14H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2z"/>',
		'iso': '<path d="M19 19H5L19 5v14zM5.5 7.5h2v-2H9v2h2V9H9v2H7.5V9h-2V7.5zM19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z"/><path d="M17 17v-1.5h-5V17h5z"/>',
		'landscape': '<path d="M14 6l-3.75 5 2.85 3.8-1.6 1.2C9.81 13.75 7 10 7 10l-6 8h22L14 6z"/>',
		'leak_add': '<path d="M6 3H3v3c1.66 0 3-1.34 3-3z"/><path d="M14 3h-2a9 9 0 0 1-9 9v2c6.08 0 11-4.93 11-11z"/><path d="M10 3H8c0 2.76-2.24 5-5 5v2c3.87 0 7-3.13 7-7z"/><path d="M10 21h2a9 9 0 0 1 9-9v-2c-6.07 0-11 4.93-11 11z"/><path d="M18 21h3v-3c-1.66 0-3 1.34-3 3z"/><path d="M14 21h2c0-2.76 2.24-5 5-5v-2c-3.87 0-7 3.13-7 7z"/>',
		'leak_remove': '<path d="M10 3H8c0 .37-.04.72-.12 1.06l1.59 1.59C9.81 4.84 10 3.94 10 3z"/><path d="M3 4.27l2.84 2.84C5.03 7.67 4.06 8 3 8v2c1.61 0 3.09-.55 4.27-1.46L8.7 9.97A8.99 8.99 0 0 1 3 12v2c2.71 0 5.19-.99 7.11-2.62l2.5 2.5A11.044 11.044 0 0 0 10 21h2c0-2.16.76-4.14 2.03-5.69l1.43 1.43A6.922 6.922 0 0 0 14 21h2c0-1.06.33-2.03.89-2.84L19.73 21 21 19.73 4.27 3 3 4.27z"/><path d="M14 3h-2c0 1.5-.37 2.91-1.02 4.16l1.46 1.46C13.42 6.98 14 5.06 14 3z"/><path d="M19.94 16.12c.34-.08.69-.12 1.06-.12v-2c-.94 0-1.84.19-2.66.52l1.6 1.6z"/><path d="M15.38 11.56l1.46 1.46A8.98 8.98 0 0 1 21 12v-2c-2.06 0-3.98.58-5.62 1.56z"/>',
		'lens': '<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"/>',
		'linked_camera': '<circle cx="12" cy="14" r="3.2"/><path d="M16 3.33c2.58 0 4.67 2.09 4.67 4.67H22c0-3.31-2.69-6-6-6v1.33M16 6c1.11 0 2 .89 2 2h1.33c0-1.84-1.49-3.33-3.33-3.33V6"/><path d="M17 9c0-1.11-.89-2-2-2V4H9L7.17 6H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V9h-5zm-5 10c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5z"/>',
		'looks': '<path d="M12 10c-3.86 0-7 3.14-7 7h2c0-2.76 2.24-5 5-5s5 2.24 5 5h2c0-3.86-3.14-7-7-7z"/><path d="M12 6C5.93 6 1 10.93 1 17h2c0-4.96 4.04-9 9-9s9 4.04 9 9h2c0-6.07-4.93-11-11-11z"/>',
		'looks_3': '<path d="M19.01 3h-14c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-4 7.5c0 .83-.67 1.5-1.5 1.5.83 0 1.5.67 1.5 1.5V15c0 1.11-.9 2-2 2h-4v-2h4v-2h-2v-2h2V9h-4V7h4c1.1 0 2 .89 2 2v1.5z"/>',
		'looks_4': '<path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-4 14h-2v-4H9V7h2v4h2V7h2v10z"/>',
		'looks_5': '<path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-4 6h-4v2h2c1.1 0 2 .89 2 2v2c0 1.11-.9 2-2 2H9v-2h4v-2H9V7h6v2z"/>',
		'looks_6': '<path d="M11 15h2v-2h-2v2zm8-12H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-4 6h-4v2h2c1.1 0 2 .89 2 2v2c0 1.11-.9 2-2 2h-2c-1.1 0-2-.89-2-2V9c0-1.11.9-2 2-2h4v2z"/>',
		'looks_one': '<path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14h-2V9h-2V7h4v10z"/>',
		'looks_two': '<path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-4 8c0 1.11-.9 2-2 2h-2v2h4v2H9v-4c0-1.11.9-2 2-2h2V9H9V7h4c1.1 0 2 .89 2 2v2z"/>',
		'loupe': '<path d="M13 7h-2v4H7v2h4v4h2v-4h4v-2h-4V7z"/><path d="M12 20c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm0-18C6.49 2 2 6.49 2 12s4.49 10 10 10h8c1.1 0 2-.9 2-2v-8c0-5.51-4.49-10-10-10z"/>',
		'monochrome_photos': '<path d="M20 19h-8v-1c-2.8 0-5-2.2-5-5s2.2-5 5-5V7h8v12zm0-14h-3.2L15 3H9L7.2 5H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2z"/><path d="M17 13c0-2.8-2.2-5-5-5v1.8c1.8 0 3.2 1.4 3.2 3.2 0 1.8-1.4 3.2-3.2 3.2V18c2.8 0 5-2.2 5-5z"/><path d="M8.8 13c0 1.8 1.4 3.2 3.2 3.2V9.8c-1.8 0-3.2 1.4-3.2 3.2z"/>',
		'movie_creation': '<path d="M18 4l2 4h-3l-2-4h-2l2 4h-3l-2-4H8l2 4H7L5 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V4h-4z"/>',
		'movie_filter': '<path d="M18 4l2 4h-3l-2-4h-2l2 4h-3l-2-4H8l2 4H7L5 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V4h-4zm-6.58 11.68L10.37 18l-1.05-2.32L7 14.63l2.32-1.05 1.05-2.32 1.05 2.32 2.32 1.05-2.32 1.05zm3.69-3.47l-.53 1.16-.53-1.16-1.16-.53 1.16-.53.53-1.15.53 1.16 1.16.53-1.16.52z"/>',
		'music_note': '<path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>',
		'nature': '<path d="M13 16.12c3.47-.41 6.17-3.36 6.17-6.95 0-3.87-3.13-7-7-7s-7 3.13-7 7c0 3.47 2.52 6.34 5.83 6.89V20H5v2h14v-2h-6v-3.88z"/>',
		'nature_people': '<path d="M22.17 9.17c0-3.87-3.13-7-7-7s-7 3.13-7 7c0 3.47 2.52 6.34 5.83 6.89V20H6v-3h1v-4c0-.55-.45-1-1-1H3c-.55 0-1 .45-1 1v4h1v5h16v-2h-3v-3.88c3.47-.41 6.17-3.36 6.17-6.95zM4.5 11c.83 0 1.5-.67 1.5-1.5S5.33 8 4.5 8 3 8.67 3 9.5 3.67 11 4.5 11z"/>',
		'navigate_before': '<path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/>',
		'navigate_next': '<path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>',
		'palette': '<path d="M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9c.83 0 1.5-.67 1.5-1.5 0-.39-.15-.74-.39-1.01-.23-.26-.38-.61-.38-.99 0-.83.67-1.5 1.5-1.5H16c2.76 0 5-2.24 5-5 0-4.42-4.03-8-9-8zm-5.5 9c-.83 0-1.5-.67-1.5-1.5S5.67 9 6.5 9 8 9.67 8 10.5 7.33 12 6.5 12zm3-4C8.67 8 8 7.33 8 6.5S8.67 5 9.5 5s1.5.67 1.5 1.5S10.33 8 9.5 8zm5 0c-.83 0-1.5-.67-1.5-1.5S13.67 5 14.5 5s1.5.67 1.5 1.5S15.33 8 14.5 8zm3 4c-.83 0-1.5-.67-1.5-1.5S16.67 9 17.5 9s1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/>',
		'panorama': '<path d="M23 18V6c0-1.1-.9-2-2-2H3c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2zM8.5 12.5l2.5 3.01L14.5 11l4.5 6H5l3.5-4.5z"/>',
		'panorama_fisheye': '<path d="M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>',
		'panorama_horizontal': '<path d="M20 6.54v10.91c-2.6-.77-5.28-1.16-8-1.16-2.72 0-5.4.39-8 1.16V6.54c2.6.77 5.28 1.16 8 1.16 2.72.01 5.4-.38 8-1.16M21.43 4c-.1 0-.2.02-.31.06C18.18 5.16 15.09 5.7 12 5.7c-3.09 0-6.18-.55-9.12-1.64-.11-.04-.22-.06-.31-.06-.34 0-.57.23-.57.63v14.75c0 .39.23.62.57.62.1 0 .2-.02.31-.06 2.94-1.1 6.03-1.64 9.12-1.64 3.09 0 6.18.55 9.12 1.64.11.04.21.06.31.06.33 0 .57-.23.57-.63V4.63c0-.4-.24-.63-.57-.63z"/>',
		'panorama_vertical': '<path d="M19.94 21.12c-1.1-2.94-1.64-6.03-1.64-9.12 0-3.09.55-6.18 1.64-9.12.04-.11.06-.22.06-.31 0-.34-.23-.57-.63-.57H4.63c-.4 0-.63.23-.63.57 0 .1.02.2.06.31C5.16 5.82 5.71 8.91 5.71 12c0 3.09-.55 6.18-1.64 9.12-.05.11-.07.22-.07.31 0 .33.23.57.63.57h14.75c.39 0 .63-.24.63-.57-.01-.1-.03-.2-.07-.31zM6.54 20c.77-2.6 1.16-5.28 1.16-8 0-2.72-.39-5.4-1.16-8h10.91c-.77 2.6-1.16 5.28-1.16 8 0 2.72.39 5.4 1.16 8H6.54z"/>',
		'panorama_wide_angle': '<path d="M12 6c2.45 0 4.71.2 7.29.64.47 1.78.71 3.58.71 5.36 0 1.78-.24 3.58-.71 5.36-2.58.44-4.84.64-7.29.64s-4.71-.2-7.29-.64C4.24 15.58 4 13.78 4 12c0-1.78.24-3.58.71-5.36C7.29 6.2 9.55 6 12 6m0-2c-2.73 0-5.22.24-7.95.72l-.93.16-.25.9C2.29 7.85 2 9.93 2 12s.29 4.15.87 6.22l.25.89.93.16c2.73.49 5.22.73 7.95.73s5.22-.24 7.95-.72l.93-.16.25-.89c.58-2.08.87-4.16.87-6.23s-.29-4.15-.87-6.22l-.25-.89-.93-.16C17.22 4.24 14.73 4 12 4z"/>',
		'photo': '<path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>',
		'photo_album': '<path d="M18 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 4h5v8l-2.5-1.5L6 12V4zm0 15l3-3.86 2.14 2.58 3-3.86L18 19H6z"/>',
		'photo_camera': '<circle cx="12" cy="12" r="3.2"/><path d="M12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zM9 2L7.17 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2h-3.17L15 2H9z"/>',
		'photo_filter': '<path d="M17.13 8.9l.59-1.3 1.3-.6-1.3-.59-.59-1.3-.59 1.3-1.31.59 1.31.6z"/><path d="M12.39 6.53l-1.18 2.61-2.61 1.18 2.61 1.18 1.18 2.61 1.19-2.61 2.6-1.18-2.6-1.18z"/><path d="M19.02 10v9H5V5h9V3H5.02c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2v-9h-2z"/>',
		'photo_library': '<path d="M11 12l2.03 2.71L16 11l4 5H8l3-4zm11 4V4c0-1.1-.9-2-2-2H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2z"/><path d="M2 6v14c0 1.1.9 2 2 2h14v-2H4V6H2z"/>',
		'photo_size_select_actual': '<path d="M21 3H3C2 3 1 4 1 5v14c0 1.1.9 2 2 2h18c1 0 2-1 2-2V5c0-1-1-2-2-2zM5 17l3.5-4.5 2.5 3.01L14.5 11l4.5 6H5z"/>',
		'photo_size_select_large': '<path d="M21 15h2v2h-2v-2z"/><path d="M21 11h2v2h-2v-2z"/><path d="M23 19h-2v2c1 0 2-1 2-2z"/><path d="M13 3h2v2h-2V3z"/><path d="M21 7h2v2h-2V7z"/><path d="M21 3v2h2c0-1-1-2-2-2z"/><path d="M1 7h2v2H1V7z"/><path d="M17 3h2v2h-2V3z"/><path d="M17 19h2v2h-2v-2z"/><path d="M3 3C2 3 1 4 1 5h2V3z"/><path d="M9 3h2v2H9V3z"/><path d="M5 3h2v2H5V3z"/><path d="M3 19l2.5-3.21 1.79 2.15 2.5-3.22L13 19H3zm-2-8v8c0 1.1.9 2 2 2h12V11H1z"/>',
		'photo_size_select_small': '<path d="M23 15h-2v2h2v-2z"/><path d="M23 11h-2v2h2v-2z"/><path d="M23 19h-2v2c1 0 2-1 2-2z"/><path d="M15 3h-2v2h2V3z"/><path d="M23 7h-2v2h2V7z"/><path d="M21 3v2h2c0-1-1-2-2-2z"/><path d="M3 21h8v-6H1v4c0 1.1.9 2 2 2z"/><path d="M3 7H1v2h2V7z"/><path d="M15 19h-2v2h2v-2z"/><path d="M19 3h-2v2h2V3z"/><path d="M19 19h-2v2h2v-2z"/><path d="M3 3C2 3 1 4 1 5h2V3z"/><path d="M3 11H1v2h2v-2z"/><path d="M11 3H9v2h2V3z"/><path d="M7 3H5v2h2V3z"/>',
		'picture_as_pdf': '<path d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6z"/><path d="M14 11.5h1v-3h-1v3zm-5-2h1v-1H9v1zm11.5-1H19v1h1.5V11H19v2h-1.5V7h3v1.5zm-4 3c0 .83-.67 1.5-1.5 1.5h-2.5V7H15c.83 0 1.5.67 1.5 1.5v3zm-5-2c0 .83-.67 1.5-1.5 1.5H9v2H7.5V7H10c.83 0 1.5.67 1.5 1.5v1zM20 2H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/>',
		'portrait': '<path d="M16.5 16.25c0-1.5-3-2.25-4.5-2.25s-4.5.75-4.5 2.25V17h9v-.75zm-4.5-4c1.24 0 2.25-1.01 2.25-2.25S13.24 7.75 12 7.75 9.75 8.76 9.75 10s1.01 2.25 2.25 2.25z"/><path d="M19 19H5V5h14v14zm0-16H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z"/>',
		'remove_red_eye': '<path d="M12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-12.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5z"/><path d="M12 9c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>',
		'rotate_90_degrees_ccw': '<path d="M3.69 12.9l3.66-3.66L11 12.9l-3.66 3.66-3.65-3.66zm3.65-6.49L.86 12.9l6.49 6.48 6.49-6.48-6.5-6.49z"/><path d="M19.36 6.64A8.95 8.95 0 0 0 13 4V.76L8.76 5 13 9.24V6c1.79 0 3.58.68 4.95 2.05a7.007 7.007 0 0 1 0 9.9 6.973 6.973 0 0 1-7.79 1.44l-1.49 1.49C10.02 21.62 11.51 22 13 22c2.3 0 4.61-.88 6.36-2.64a8.98 8.98 0 0 0 0-12.72z"/>',
		'rotate_left': '<path d="M7.11 8.53L5.7 7.11C4.8 8.27 4.24 9.61 4.07 11h2.02c.14-.87.49-1.72 1.02-2.47z"/><path d="M6.09 13H4.07c.17 1.39.72 2.73 1.62 3.89l1.41-1.42c-.52-.75-.87-1.59-1.01-2.47z"/><path d="M7.1 18.32c1.16.9 2.51 1.44 3.9 1.61V17.9c-.87-.15-1.71-.49-2.46-1.03L7.1 18.32z"/><path d="M13 4.07V1L8.45 5.55 13 10V6.09c2.84.48 5 2.94 5 5.91s-2.16 5.43-5 5.91v2.02c3.95-.49 7-3.85 7-7.93s-3.05-7.44-7-7.93z"/>',
		'rotate_right': '<path d="M15.55 5.55L11 1v3.07C7.06 4.56 4 7.92 4 12s3.05 7.44 7 7.93v-2.02c-2.84-.48-5-2.94-5-5.91s2.16-5.43 5-5.91V10l4.55-4.45z"/><path d="M19.93 11c-.17-1.39-.72-2.73-1.62-3.89l-1.42 1.42c.54.75.88 1.6 1.02 2.47h2.02z"/><path d="M13 17.9v2.02c1.39-.17 2.74-.71 3.9-1.61l-1.44-1.44c-.75.54-1.59.89-2.46 1.03z"/><path d="M16.89 15.48l1.42 1.41c.9-1.16 1.45-2.5 1.62-3.89h-2.02c-.14.87-.48 1.72-1.02 2.48z"/>',
		'slideshow': '<path d="M10 8v8l5-4-5-4z"/><path d="M19 19H5V5h14v14zm0-16H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z"/>',
		'straighten': '<path d="M21 6H3c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm0 10H3V8h2v4h2V8h2v4h2V8h2v4h2V8h2v4h2V8h2v8z"/>',
		'style': '<path d="M2.53 19.65l1.34.56v-9.03l-2.43 5.86c-.41 1.02.08 2.19 1.09 2.61z"/><path d="M7.88 8.75c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm14.15 7.2L17.07 3.98a2.013 2.013 0 0 0-1.81-1.23c-.26 0-.53.04-.79.15L7.1 5.95a1.999 1.999 0 0 0-1.08 2.6l4.96 11.97a1.998 1.998 0 0 0 2.6 1.08l7.36-3.05a1.994 1.994 0 0 0 1.09-2.6z"/><path d="M5.88 19.75c0 1.1.9 2 2 2h1.45l-3.45-8.34v6.34z"/>',
		'switch_camera': '<path d="M20 4h-3.17L15 2H9L7.17 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm-5 11.5V13H9v2.5L5.5 12 9 8.5V11h6V8.5l3.5 3.5-3.5 3.5z"/>',
		'switch_video': '<path d="M18 9.5V6c0-.55-.45-1-1-1H3c-.55 0-1 .45-1 1v12c0 .55.45 1 1 1h14c.55 0 1-.45 1-1v-3.5l4 4v-13l-4 4zm-5 6V13H7v2.5L3.5 12 7 8.5V11h6V8.5l3.5 3.5-3.5 3.5z"/>',
		'tag_faces': '<path d="M12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm-.01-18C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2z"/><path d="M15.5 11c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5z"/><path d="M8.5 11c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11z"/><path d="M12 17.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z"/>',
		'texture': '<path d="M19.51 3.08L3.08 19.51c.09.34.27.65.51.9.25.24.56.42.9.51L20.93 4.49c-.19-.69-.73-1.23-1.42-1.41z"/><path d="M11.88 3L3 11.88v2.83L14.71 3h-2.83z"/><path d="M5 3c-1.1 0-2 .9-2 2v2l4-4H5z"/><path d="M19 21c.55 0 1.05-.22 1.41-.59.37-.36.59-.86.59-1.41v-2l-4 4h2z"/><path d="M9.29 21h2.83L21 12.12V9.29L9.29 21z"/>',
		'timelapse': '<path d="M16.24 7.76C15.07 6.59 13.54 6 12 6v6l-4.24 4.24c2.34 2.34 6.14 2.34 8.49 0 2.34-2.34 2.34-6.14-.01-8.48z"/><path d="M12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm0-18C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"/>',
		'timer': '<path d="M15 1H9v2h6V1z"/><path d="M11 14h2V8h-2v6z"/><path d="M12 20c-3.87 0-7-3.13-7-7s3.13-7 7-7 7 3.13 7 7-3.13 7-7 7zm7.03-12.61l1.42-1.42c-.43-.51-.9-.99-1.41-1.41l-1.42 1.42C16.07 4.74 14.12 4 12 4c-4.97 0-9 4.03-9 9s4.02 9 9 9 9-4.03 9-9c0-2.12-.74-4.07-1.97-5.61z"/>',
		'timer_10': '<path d="M0 7.72V9.4l3-1V18h2V6h-.25L0 7.72z"/><path d="M23.78 14.37c-.14-.28-.35-.53-.63-.74-.28-.21-.61-.39-1.01-.53s-.85-.27-1.35-.38a6.64 6.64 0 0 1-.87-.23 2.61 2.61 0 0 1-.55-.25.717.717 0 0 1-.28-.3.978.978 0 0 1 .01-.8c.06-.13.15-.25.27-.34.12-.1.27-.18.45-.24s.4-.09.64-.09c.25 0 .47.04.66.11.19.07.35.17.48.29.13.12.22.26.29.42.06.16.1.32.1.49h1.95a2.517 2.517 0 0 0-.93-1.97c-.3-.25-.66-.44-1.09-.59C21.49 9.07 21 9 20.46 9c-.51 0-.98.07-1.39.21-.41.14-.77.33-1.06.57-.29.24-.51.52-.67.84a2.2 2.2 0 0 0-.23 1.01c0 .36.08.69.23.96.15.28.36.52.64.73.27.21.6.38.98.53.38.14.81.26 1.27.36.39.08.71.17.95.26s.43.19.57.29c.13.1.22.22.27.34.05.12.07.25.07.39 0 .32-.13.57-.4.77-.27.2-.66.29-1.17.29-.22 0-.43-.02-.64-.08-.21-.05-.4-.13-.56-.24a1.333 1.333 0 0 1-.59-1.11h-1.89c0 .36.08.71.24 1.05.16.34.39.65.7.93.31.27.69.49 1.15.66.46.17.98.25 1.58.25.53 0 1.01-.06 1.44-.19.43-.13.8-.31 1.11-.54.31-.23.54-.51.71-.83.17-.32.25-.67.25-1.06-.02-.4-.09-.74-.24-1.02z"/><path d="M12.9 13.22c0 .6-.04 1.11-.12 1.53-.08.42-.2.76-.36 1.02-.16.26-.36.45-.59.57-.23.12-.51.18-.82.18-.3 0-.58-.06-.82-.18s-.44-.31-.6-.57c-.16-.26-.29-.6-.38-1.02-.09-.42-.13-.93-.13-1.53v-2.5c0-.6.04-1.11.13-1.52.09-.41.21-.74.38-1 .16-.25.36-.43.6-.55.24-.11.51-.17.81-.17.31 0 .58.06.81.17.24.11.44.29.6.55.16.25.29.58.37.99.08.41.13.92.13 1.52v2.51zm.92-6.17c-.34-.4-.75-.7-1.23-.88-.47-.18-1.01-.27-1.59-.27-.58 0-1.11.09-1.59.27-.48.18-.89.47-1.23.88-.34.41-.6.93-.79 1.59-.18.65-.28 1.45-.28 2.39v1.92c0 .94.09 1.74.28 2.39.19.66.45 1.19.8 1.6.34.41.75.71 1.23.89.48.18 1.01.28 1.59.28.59 0 1.12-.09 1.59-.28.48-.18.88-.48 1.22-.89.34-.41.6-.94.78-1.6.18-.65.28-1.45.28-2.39v-1.92c0-.94-.09-1.74-.28-2.39-.18-.66-.44-1.19-.78-1.59z"/>',
		'timer_3': '<path d="M11.61 12.97c-.16-.24-.36-.46-.62-.65a3.38 3.38 0 0 0-.93-.48c.3-.14.57-.3.8-.5.23-.2.42-.41.57-.64.15-.23.27-.46.34-.71.08-.24.11-.49.11-.73 0-.55-.09-1.04-.28-1.46-.18-.42-.44-.77-.78-1.06-.33-.28-.73-.5-1.2-.64-.45-.13-.97-.2-1.53-.2-.55 0-1.06.08-1.52.24-.47.17-.87.4-1.2.69-.33.29-.6.63-.78 1.03-.2.39-.29.83-.29 1.29h1.98c0-.26.05-.49.14-.69.09-.2.22-.38.38-.52.17-.14.36-.25.58-.33.22-.08.46-.12.73-.12.61 0 1.06.16 1.36.47.3.31.44.75.44 1.32 0 .27-.04.52-.12.74-.08.22-.21.41-.38.57-.17.16-.38.28-.63.37-.25.09-.55.13-.89.13H6.72v1.57H7.9c.34 0 .64.04.91.11.27.08.5.19.69.35.19.16.34.36.44.61.1.24.16.54.16.87 0 .62-.18 1.09-.53 1.42-.35.33-.84.49-1.45.49-.29 0-.56-.04-.8-.13-.24-.08-.44-.2-.61-.36-.17-.16-.3-.34-.39-.56-.09-.22-.14-.46-.14-.72H4.19c0 .55.11 1.03.32 1.45.21.42.5.77.86 1.05s.77.49 1.24.63.96.21 1.48.21c.57 0 1.09-.08 1.58-.23.49-.15.91-.38 1.26-.68.36-.3.64-.66.84-1.1.2-.43.3-.93.3-1.48 0-.29-.04-.58-.11-.86-.08-.25-.19-.51-.35-.76z"/><path d="M20.87 14.37c-.14-.28-.35-.53-.63-.74-.28-.21-.61-.39-1.01-.53s-.85-.27-1.35-.38a6.64 6.64 0 0 1-.87-.23 2.61 2.61 0 0 1-.55-.25.717.717 0 0 1-.28-.3.935.935 0 0 1-.08-.39.946.946 0 0 1 .36-.75c.12-.1.27-.18.45-.24s.4-.09.64-.09c.25 0 .47.04.66.11.19.07.35.17.48.29.13.12.22.26.29.42.06.16.1.32.1.49h1.95a2.517 2.517 0 0 0-.93-1.97c-.3-.25-.66-.44-1.09-.59-.43-.15-.92-.22-1.46-.22-.51 0-.98.07-1.39.21-.41.14-.77.33-1.06.57-.29.24-.51.52-.67.84a2.2 2.2 0 0 0-.23 1.01c0 .36.08.68.23.96.15.28.37.52.64.73.27.21.6.38.98.53.38.14.81.26 1.27.36.39.08.71.17.95.26s.43.19.57.29c.13.1.22.22.27.34.05.12.07.25.07.39 0 .32-.13.57-.4.77-.27.2-.66.29-1.17.29-.22 0-.43-.02-.64-.08-.21-.05-.4-.13-.56-.24a1.333 1.333 0 0 1-.59-1.11h-1.89c0 .36.08.71.24 1.05.16.34.39.65.7.93.31.27.69.49 1.15.66.46.17.98.25 1.58.25.53 0 1.01-.06 1.44-.19.43-.13.8-.31 1.11-.54.31-.23.54-.51.71-.83.17-.32.25-.67.25-1.06-.02-.4-.09-.74-.24-1.02z"/>',
		'timer_off': '<path d="M19.04 4.55l-1.42 1.42a9.012 9.012 0 0 0-10.57-.49l1.46 1.46C9.53 6.35 10.73 6 12 6c3.87 0 7 3.13 7 7 0 1.27-.35 2.47-.94 3.49l1.45 1.45A8.878 8.878 0 0 0 21 13c0-2.12-.74-4.07-1.97-5.61l1.42-1.42-1.41-1.42z"/><path d="M15 1H9v2h6V1z"/><path d="M11 9.44l2 2V8h-2v1.44z"/><path d="M12 20c-3.87 0-7-3.13-7-7 0-1.28.35-2.48.95-3.52l9.56 9.56c-1.03.61-2.23.96-3.51.96zM3.02 4L1.75 5.27 4.5 8.03A8.905 8.905 0 0 0 3 13c0 4.97 4.02 9 9 9 1.84 0 3.55-.55 4.98-1.5l2.5 2.5 1.27-1.27-7.71-7.71L3.02 4z"/>',
		'tonality': '<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.94-.49-7-3.85-7-7.93s3.05-7.44 7-7.93v15.86zm2-15.86c1.03.13 2 .45 2.87.93H13v-.93zM13 7h5.24c.25.31.48.65.68 1H13V7zm0 3h6.74c.08.33.15.66.19 1H13v-1zm0 9.93V19h2.87c-.87.48-1.84.8-2.87.93zM18.24 17H13v-1h5.92c-.2.35-.43.69-.68 1zm1.5-3H13v-1h6.93c-.04.34-.11.67-.19 1z"/>',
		'transform': '<path d="M22 18v-2H8V4h2L7 1 4 4h2v2H2v2h4v8c0 1.1.9 2 2 2h8v2h-2l3 3 3-3h-2v-2h4z"/><path d="M10 8h6v6h2V8c0-1.1-.9-2-2-2h-6v2z"/>',
		'tune': '<path d="M13 21v-2h8v-2h-8v-2h-2v6h2zM3 17v2h6v-2H3z"/><path d="M21 13v-2H11v2h10zM7 9v2H3v2h4v2h2V9H7z"/><path d="M15 9h2V7h4V5h-4V3h-2v6zM3 5v2h10V5H3z"/>',
		'view_comfy': '<path d="M3 9h4V5H3v4z"/><path d="M3 14h4v-4H3v4z"/><path d="M8 14h4v-4H8v4z"/><path d="M13 14h4v-4h-4v4z"/><path d="M8 9h4V5H8v4z"/><path d="M13 5v4h4V5h-4z"/><path d="M18 14h4v-4h-4v4z"/><path d="M3 19h4v-4H3v4z"/><path d="M8 19h4v-4H8v4z"/><path d="M13 19h4v-4h-4v4z"/><path d="M18 19h4v-4h-4v4z"/><path d="M18 5v4h4V5h-4z"/>',
		'view_compact': '<path d="M3 19h6v-7H3v7z"/><path d="M10 19h12v-7H10v7z"/><path d="M3 5v6h19V5H3z"/>',
		'vignette': '<path d="M21 3H3c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-9 15c-4.42 0-8-2.69-8-6s3.58-6 8-6 8 2.69 8 6-3.58 6-8 6z"/>',
		'wb_auto': '<path d="M6.85 12.65h2.3L8 9l-1.15 3.65zM22 7l-1.2 6.29L19.3 7h-1.6l-1.49 6.29L15 7h-.76C12.77 5.17 10.53 4 8 4c-4.42 0-8 3.58-8 8s3.58 8 8 8c3.13 0 5.84-1.81 7.15-4.43l.1.43H17l1.5-6.1L20 16h1.75l2.05-9H22zm-11.7 9l-.7-2H6.4l-.7 2H3.8L7 7h2l3.2 9h-1.9z"/>',
		'wb_cloudy': '<path d="M19.36 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.64-4.96z"/>',
		'wb_incandescent': '<path d="M3.55 18.54l1.41 1.41 1.79-1.8-1.41-1.41-1.79 1.8z"/><path d="M11 22.45h2V19.5h-2v2.95z"/><path d="M4 10.5H1v2h3v-2z"/><path d="M15 6.31V1.5H9v4.81C7.21 7.35 6 9.28 6 11.5c0 3.31 2.69 6 6 6s6-2.69 6-6c0-2.22-1.21-4.15-3-5.19z"/><path d="M20 10.5v2h3v-2h-3z"/><path d="M17.24 18.16l1.79 1.8 1.41-1.41-1.8-1.79-1.4 1.4z"/>',
		'wb_irradescent': '<path d="M5 14.5h14v-6H5v6z"/><path d="M11 .55V3.5h2V.55h-2z"/><path d="M19.04 3.05l-1.79 1.79 1.41 1.41 1.8-1.79-1.42-1.41z"/><path d="M13 22.45V19.5h-2v2.95h2z"/><path d="M20.45 18.54l-1.8-1.79-1.41 1.41 1.79 1.8 1.42-1.42z"/><path d="M3.55 4.46l1.79 1.79 1.41-1.41-1.79-1.79-1.41 1.41z"/><path d="M4.96 19.95l1.79-1.8-1.41-1.41-1.79 1.79 1.41 1.42z"/>',
		'wb_sunny': '<path d="M6.76 4.84l-1.8-1.79-1.41 1.41 1.79 1.79 1.42-1.41z"/><path d="M4 10.5H1v2h3v-2z"/><path d="M13 .55h-2V3.5h2V.55z"/><path d="M20.45 4.46l-1.41-1.41-1.79 1.79 1.41 1.41 1.79-1.79z"/><path d="M17.24 18.16l1.79 1.8 1.41-1.41-1.8-1.79-1.4 1.4z"/><path d="M20 10.5v2h3v-2h-3z"/><path d="M12 5.5c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6z"/><path d="M11 22.45h2V19.5h-2v2.95z"/><path d="M3.55 18.54l1.41 1.41 1.79-1.8-1.41-1.41-1.79 1.8z"/>',
		//
		// maps
		//
		'add_location': '<path d="M12 2C8.14 2 5 5.14 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.86-3.14-7-7-7zm4 8h-3v3h-2v-3H8V8h3V5h2v3h3v2z"/>',
		'beenhere': '<path d="M19 1H5c-1.1 0-1.99.9-1.99 2L3 15.93c0 .69.35 1.3.88 1.66L12 23l8.11-5.41c.53-.36.88-.97.88-1.66L21 3c0-1.1-.9-2-2-2zm-9 15l-5-5 1.41-1.41L10 13.17l7.59-7.59L19 7l-9 9z"/>',
		'directions': '<path d="M21.71 11.29l-9-9c-.39-.39-1.02-.39-1.41 0l-9 9c-.39.39-.39 1.02 0 1.41l9 9c.39.39 1.02.39 1.41 0l9-9c.39-.38.39-1.01 0-1.41zM14 14.5V12h-4v3H8v-4c0-.55.45-1 1-1h5V7.5l3.5 3.5-3.5 3.5z"/>',
		'directions_bike': '<path d="M16 4.8c.99 0 1.8-.81 1.8-1.8s-.81-1.8-1.8-1.8c-1 0-1.8.81-1.8 1.8S15 4.8 16 4.8z"/><path d="M19 20.5c-1.93 0-3.5-1.57-3.5-3.5s1.57-3.5 3.5-3.5 3.5 1.57 3.5 3.5-1.57 3.5-3.5 3.5zm0-8.5c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5z"/><path d="M14.8 10H19V8.2h-3.2l-1.93-3.27c-.3-.5-.84-.83-1.46-.83-.47 0-.89.19-1.2.5l-3.7 3.7c-.32.3-.51.73-.51 1.2 0 .63.33 1.16.85 1.47L11.2 13v5H13v-6.48l-2.25-1.67 2.32-2.33L14.8 10z"/><path d="M5 20.5c-1.93 0-3.5-1.57-3.5-3.5s1.57-3.5 3.5-3.5 3.5 1.57 3.5 3.5-1.57 3.5-3.5 3.5zM5 12c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5z"/>',
		'directions_bus': '<path d="M4 16c0 .88.39 1.67 1 2.22V20c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h8v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1.78c.61-.55 1-1.34 1-2.22V6c0-3.5-3.58-4-8-4s-8 .5-8 4v10zm3.5 1c-.83 0-1.5-.67-1.5-1.5S6.67 14 7.5 14s1.5.67 1.5 1.5S8.33 17 7.5 17zm9 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm1.5-6H6V6h12v5z"/>',
		'directions_car': '<path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z"/>',
		'directions_ferry': '<path d="M20 21c-1.39 0-2.78-.47-4-1.32-2.44 1.71-5.56 1.71-8 0C6.78 20.53 5.39 21 4 21H2v2h2c1.38 0 2.74-.35 4-.99 2.52 1.29 5.48 1.29 8 0 1.26.65 2.62.99 4 .99h2v-2h-2z"/><path d="M6 6h12v3.97L12 8 6 9.97V6zM3.95 19H4c1.6 0 3.02-.88 4-2 .98 1.12 2.4 2 4 2s3.02-.88 4-2c.98 1.12 2.4 2 4 2h.05l1.89-6.68c.08-.26.06-.54-.06-.78s-.34-.42-.6-.5L20 10.62V6c0-1.1-.9-2-2-2h-3V1H9v3H6c-1.1 0-2 .9-2 2v4.62l-1.29.42c-.26.08-.48.26-.6.5s-.15.52-.06.78L3.95 19z"/>',
		'directions_subway': '<path d="M12 2c-4.42 0-8 .5-8 4v9.5C4 17.43 5.57 19 7.5 19L6 20.5v.5h12v-.5L16.5 19c1.93 0 3.5-1.57 3.5-3.5V6c0-3.5-3.58-4-8-4zM7.5 17c-.83 0-1.5-.67-1.5-1.5S6.67 14 7.5 14s1.5.67 1.5 1.5S8.33 17 7.5 17zm3.5-6H6V6h5v5zm5.5 6c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm1.5-6h-5V6h5v5z"/>',
		'directions_train': '<path d="M4 15.5C4 17.43 5.57 19 7.5 19L6 20.5v.5h12v-.5L16.5 19c1.93 0 3.5-1.57 3.5-3.5V5c0-3.5-3.58-4-8-4s-8 .5-8 4v10.5zm8 1.5c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm6-7H6V5h12v5z"/>',
		'directions_transit': '<path d="M12 2c-4.42 0-8 .5-8 4v9.5C4 17.43 5.57 19 7.5 19L6 20.5v.5h12v-.5L16.5 19c1.93 0 3.5-1.57 3.5-3.5V6c0-3.5-3.58-4-8-4zM7.5 17c-.83 0-1.5-.67-1.5-1.5S6.67 14 7.5 14s1.5.67 1.5 1.5S8.33 17 7.5 17zm3.5-6H6V6h5v5zm5.5 6c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm1.5-6h-5V6h5v5z"/>',
		'directions_walk': '<path d="M14 3.8c.99 0 1.8-.81 1.8-1.8 0-1-.81-1.8-1.8-1.8-1 0-1.8.81-1.8 1.8S13 3.8 14 3.8z"/><path d="M14.12 10H19V8.2h-3.62l-2-3.33c-.3-.5-.84-.83-1.46-.83-.17 0-.34.03-.49.07L6 5.8V11h1.8V7.33l2.11-.66L6 22h1.8l2.87-8.11L13 17v5h1.8v-6.41l-2.49-4.54.73-2.87L14.12 10z"/>',
		'edit_location': '<path d="M12 2C8.14 2 5 5.14 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.86-3.14-7-7-7zm-1.56 10H9v-1.44l3.35-3.34 1.43 1.43L10.44 12zm4.45-4.45l-.7.7-1.44-1.44.7-.7c.15-.15.39-.15.54 0l.9.9c.15.15.15.39 0 .54z"/>',
		'ev_station': '<path d="M19.77 7.23l.01-.01-3.72-3.72L15 4.56l2.11 2.11c-.94.36-1.61 1.26-1.61 2.33 0 1.38 1.12 2.5 2.5 2.5.36 0 .69-.08 1-.21v7.21c0 .55-.45 1-1 1s-1-.45-1-1V14c0-1.1-.9-2-2-2h-1V5c0-1.1-.9-2-2-2H6c-1.1 0-2 .9-2 2v16h10v-7.5h1.5v5c0 1.38 1.12 2.5 2.5 2.5s2.5-1.12 2.5-2.5V9c0-.69-.28-1.32-.73-1.77zM18 10c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zM8 18v-4.5H6L10 6v5h2l-4 7z"/>',
		'flight': '<path d="M10.18 9"/><path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/>',
		'hotel': '<path d="M7 13c1.66 0 3-1.34 3-3S8.66 7 7 7s-3 1.34-3 3 1.34 3 3 3z"/><path d="M19 7h-8v7H3V5H1v15h2v-3h18v3h2v-9c0-2.21-1.79-4-4-4z"/>',
		'layers': '<path d="M11.99 18.54l-7.37-5.73L3 14.07l9 7 9-7-1.63-1.27-7.38 5.74z"/><path d="M12 16l7.36-5.73L21 9l-9-7-9 7 1.63 1.27L12 16z"/>',
		'layers_clear': '<path d="M19.81 14.99l1.19-.92-1.43-1.43-1.19.92 1.43 1.43z"/><path d="M19.36 10.27L21 9l-9-7-2.91 2.27 7.87 7.88 2.4-1.88z"/><path d="M3.27 1L2 2.27l4.22 4.22L3 9l1.63 1.27L12 16l2.1-1.63 1.43 1.43L12 18.54l-7.37-5.73L3 14.07l9 7 4.95-3.85L20.73 21 22 19.73 3.27 1z"/>',
		'local_activity': '<path d="M20 12c0-1.1.9-2 2-2V6c0-1.1-.9-2-2-2H4c-1.1 0-1.99.9-1.99 2v4c1.1 0 1.99.9 1.99 2s-.89 2-2 2v4c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2v-4c-1.1 0-2-.9-2-2zm-4.42 4.8L12 14.5l-3.58 2.3 1.08-4.12-3.29-2.69 4.24-.25L12 5.8l1.54 3.95 4.24.25-3.29 2.69 1.09 4.11z"/>',
		'local_airport': '<path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/>',
		'local_atm': '<path d="M11 17h2v-1h1c.55 0 1-.45 1-1v-3c0-.55-.45-1-1-1h-3v-1h4V8h-2V7h-2v1h-1c-.55 0-1 .45-1 1v3c0 .55.45 1 1 1h3v1H9v2h2v1z"/><path d="M20 18H4V6h16v12zm0-14H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2z"/>',
		'local_bar': '<path d="M11 13v6H6v2h12v-2h-5v-6l8-8V3H3v2l8 8zM7.5 7l-2-2h13l-2 2h-9z"/>',
		'local_cafe': '<path d="M20 8h-2V5h2v3zm0-5H4v10c0 2.21 1.79 4 4 4h6c2.21 0 4-1.79 4-4v-3h2c1.11 0 2-.89 2-2V5c0-1.11-.89-2-2-2z"/><path d="M2 21h18v-2H2v2z"/>',
		'local_car_wash': '<path d="M17 5c.83 0 1.5-.67 1.5-1.5 0-1-1.5-2.7-1.5-2.7s-1.5 1.7-1.5 2.7c0 .83.67 1.5 1.5 1.5z"/><path d="M12 5c.83 0 1.5-.67 1.5-1.5 0-1-1.5-2.7-1.5-2.7s-1.5 1.7-1.5 2.7c0 .83.67 1.5 1.5 1.5z"/><path d="M7 5c.83 0 1.5-.67 1.5-1.5C8.5 2.5 7 .8 7 .8S5.5 2.5 5.5 3.5C5.5 4.33 6.17 5 7 5z"/><path d="M5 13l1.5-4.5h11L19 13H5zm12.5 5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm-11 0c-.83 0-1.5-.67-1.5-1.5S5.67 15 6.5 15s1.5.67 1.5 1.5S7.33 18 6.5 18zm12.42-9.99C18.72 7.42 18.16 7 17.5 7h-11c-.66 0-1.21.42-1.42 1.01L3 14v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99z"/>',
		'local_convenience_store': '<path d="M19 7V4H5v3H2v13h8v-4h4v4h8V7h-3zm-8 3H9v1h2v1H8V9h2V8H8V7h3v3zm5 2h-1v-2h-2V7h1v2h1V7h1v5z"/>',
		'local_dining': '<path d="M8.1 13.34l2.83-2.83L3.91 3.5a4.008 4.008 0 0 0 0 5.66l4.19 4.18z"/><path d="M14.88 11.53c1.53.71 3.68.21 5.27-1.38 1.91-1.91 2.28-4.65.81-6.12-1.46-1.46-4.2-1.1-6.12.81-1.59 1.59-2.09 3.74-1.38 5.27L3.7 19.87l1.41 1.41L12 14.41l6.88 6.88 1.41-1.41L13.41 13l1.47-1.47z"/>',
		'local_drink': '<path d="M3 2l2.01 18.23C5.13 21.23 5.97 22 7 22h10c1.03 0 1.87-.77 1.99-1.77L21 2H3zm9 17c-1.66 0-3-1.34-3-3 0-2 3-5.4 3-5.4s3 3.4 3 5.4c0 1.66-1.34 3-3 3zm6.33-11H5.67l-.44-4h13.53l-.43 4z"/>',
		'local_florist': '<path d="M12 22c4.97 0 9-4.03 9-9-4.97 0-9 4.03-9 9z"/><path d="M12 5.5c1.38 0 2.5 1.12 2.5 2.5s-1.12 2.5-2.5 2.5S9.5 9.38 9.5 8s1.12-2.5 2.5-2.5zm-6.4 4.75c0 1.38 1.12 2.5 2.5 2.5.53 0 1.01-.16 1.42-.44l-.02.19c0 1.38 1.12 2.5 2.5 2.5s2.5-1.12 2.5-2.5l-.02-.19c.4.28.89.44 1.42.44 1.38 0 2.5-1.12 2.5-2.5 0-1-.59-1.85-1.43-2.25.84-.4 1.43-1.25 1.43-2.25 0-1.38-1.12-2.5-2.5-2.5-.53 0-1.01.16-1.42.44l.02-.19C14.5 2.12 13.38 1 12 1S9.5 2.12 9.5 3.5l.02.19c-.4-.28-.89-.44-1.42-.44-1.38 0-2.5 1.12-2.5 2.5 0 1 .59 1.85 1.43 2.25-.84.4-1.43 1.25-1.43 2.25z"/><path d="M3 13c0 4.97 4.03 9 9 9 0-4.97-4.03-9-9-9z"/>',
		'local_gas_station': '<path d="M19.77 7.23l.01-.01-3.72-3.72L15 4.56l2.11 2.11c-.94.36-1.61 1.26-1.61 2.33 0 1.38 1.12 2.5 2.5 2.5.36 0 .69-.08 1-.21v7.21c0 .55-.45 1-1 1s-1-.45-1-1V14c0-1.1-.9-2-2-2h-1V5c0-1.1-.9-2-2-2H6c-1.1 0-2 .9-2 2v16h10v-7.5h1.5v5c0 1.38 1.12 2.5 2.5 2.5s2.5-1.12 2.5-2.5V9c0-.69-.28-1.32-.73-1.77zM12 10H6V5h6v5zm6 0c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1z"/>',
		'local_grocery_store': '<path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2z"/><path d="M1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1z"/><path d="M17 18c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z"/>',
		'local_hospital': '<path d="M19 3H5c-1.1 0-1.99.9-1.99 2L3 19c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-1 11h-4v4h-4v-4H6v-4h4V6h4v4h4v4z"/>',
		'local_hotel': '<path d="M7 13c1.66 0 3-1.34 3-3S8.66 7 7 7s-3 1.34-3 3 1.34 3 3 3z"/><path d="M19 7h-8v7H3V5H1v15h2v-3h18v3h2v-9c0-2.21-1.79-4-4-4z"/>',
		'local_laundry_service': '<path d="M9.17 16.83a4.008 4.008 0 0 0 5.66 0 4.008 4.008 0 0 0 0-5.66l-5.66 5.66z"/><path d="M12 20c-3.31 0-6-2.69-6-6s2.69-6 6-6 6 2.69 6 6-2.69 6-6 6zM7 4c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm3 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm8-1.99L6 2c-1.11 0-2 .89-2 2v16c0 1.11.89 2 2 2h12c1.11 0 2-.89 2-2V4c0-1.11-.89-1.99-2-1.99z"/>',
		'local_library': '<path d="M12 8c1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3 1.34 3 3 3z"/><path d="M12 11.55C9.64 9.35 6.48 8 3 8v11c3.48 0 6.64 1.35 9 3.55 2.36-2.19 5.52-3.55 9-3.55V8c-3.48 0-6.64 1.35-9 3.55z"/>',
		'local_mall': '<path d="M19 6h-2c0-2.76-2.24-5-5-5S7 3.24 7 6H5c-1.1 0-1.99.9-1.99 2L3 20c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-7-3c1.66 0 3 1.34 3 3H9c0-1.66 1.34-3 3-3zm0 10c-2.76 0-5-2.24-5-5h2c0 1.66 1.34 3 3 3s3-1.34 3-3h2c0 2.76-2.24 5-5 5z"/>',
		'local_movies': '<path d="M18 3v2h-2V3H8v2H6V3H4v18h2v-2h2v2h8v-2h2v2h2V3h-2zM8 17H6v-2h2v2zm0-4H6v-2h2v2zm0-4H6V7h2v2zm10 8h-2v-2h2v2zm0-4h-2v-2h2v2zm0-4h-2V7h2v2z"/>',
		'local_offer': '<path d="M21.41 11.58l-9-9C12.05 2.22 11.55 2 11 2H4c-1.1 0-2 .9-2 2v7c0 .55.22 1.05.59 1.42l9 9c.36.36.86.58 1.41.58.55 0 1.05-.22 1.41-.59l7-7c.37-.36.59-.86.59-1.41 0-.55-.23-1.06-.59-1.42zM5.5 7C4.67 7 4 6.33 4 5.5S4.67 4 5.5 4 7 4.67 7 5.5 6.33 7 5.5 7z"/>',
		'local_parking': '<path d="M13 3H6v18h4v-6h3c3.31 0 6-2.69 6-6s-2.69-6-6-6zm.2 8H10V7h3.2c1.1 0 2 .9 2 2s-.9 2-2 2z"/>',
		'local_pharmacy': '<path d="M21 5h-2.64l1.14-3.14L17.15 1l-1.46 4H3v2l2 6-2 6v2h18v-2l-2-6 2-6V5zm-5 9h-3v3h-2v-3H8v-2h3V9h2v3h3v2z"/>',
		'local_phone': '<path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>',
		'local_pizza': '<path d="M12 2C8.43 2 5.23 3.54 3.01 6L12 22l8.99-16C18.78 3.55 15.57 2 12 2zM7 7c0-1.1.9-2 2-2s2 .9 2 2-.9 2-2 2-2-.9-2-2zm5 8c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z"/>',
		'local_play': '<path d="M20 12c0-1.1.9-2 2-2V6c0-1.1-.9-2-2-2H4c-1.1 0-1.99.9-1.99 2v4c1.1 0 1.99.9 1.99 2s-.89 2-2 2v4c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2v-4c-1.1 0-2-.9-2-2zm-4.42 4.8L12 14.5l-3.58 2.3 1.08-4.12-3.29-2.69 4.24-.25L12 5.8l1.54 3.95 4.24.25-3.29 2.69 1.09 4.11z"/>',
		'local_post_office': '<path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>',
		'local_print_shop': '<path d="M19 12c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm-3 7H8v-5h8v5zm3-11H5c-1.66 0-3 1.34-3 3v6h4v4h12v-4h4v-6c0-1.66-1.34-3-3-3z"/><path d="M18 3H6v4h12V3z"/>',
		'local_restaurant': '<path d="M8.1 13.34l2.83-2.83L3.91 3.5a4.008 4.008 0 0 0 0 5.66l4.19 4.18z"/><path d="M14.88 11.53c1.53.71 3.68.21 5.27-1.38 1.91-1.91 2.28-4.65.81-6.12-1.46-1.46-4.2-1.1-6.12.81-1.59 1.59-2.09 3.74-1.38 5.27L3.7 19.87l1.41 1.41L12 14.41l6.88 6.88 1.41-1.41L13.41 13l1.47-1.47z"/>',
		'local_see': '<circle cx="12" cy="12" r="3.2"/><path d="M12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zM9 2L7.17 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2h-3.17L15 2H9z"/>',
		'local_shipping': '<path d="M20 8h-3V4H3c-1.1 0-2 .9-2 2v11h2c0 1.66 1.34 3 3 3s3-1.34 3-3h6c0 1.66 1.34 3 3 3s3-1.34 3-3h2v-5l-3-4zM6 18.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm13.5-9l1.96 2.5H17V9.5h2.5zm-1.5 9c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/>',
		'local_taxi': '<path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5H15V3H9v2H6.5c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z"/>',
		'map': '<path d="M20.5 3l-.16.03L15 5.1 9 3 3.36 4.9c-.21.07-.36.25-.36.48V20.5c0 .28.22.5.5.5l.16-.03L9 18.9l6 2.1 5.64-1.9c.21-.07.36-.25.36-.48V3.5c0-.28-.22-.5-.5-.5zM15 19l-6-2.11V5l6 2.11V19z"/>',
		'my_location': '<path d="M12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4z"/><path d="M12 19c-3.87 0-7-3.13-7-7s3.13-7 7-7 7 3.13 7 7-3.13 7-7 7zm8.94-8c-.46-4.17-3.77-7.48-7.94-7.94V1h-2v2.06C6.83 3.52 3.52 6.83 3.06 11H1v2h2.06c.46 4.17 3.77 7.48 7.94 7.94V23h2v-2.06c4.17-.46 7.48-3.77 7.94-7.94H23v-2h-2.06z"/>',
		'navigation': '<path d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71z"/>',
		'near_me': '<path d="M21 3L3 10.53v.98l6.84 2.65L12.48 21h.98L21 3z"/>',
		'person_pin_circle': '<path d="M12 2C8.14 2 5 5.14 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.86-3.14-7-7-7zm0 2c1.1 0 2 .9 2 2 0 1.11-.9 2-2 2s-2-.89-2-2c0-1.1.9-2 2-2zm0 10c-1.67 0-3.14-.85-4-2.15.02-1.32 2.67-2.05 4-2.05s3.98.73 4 2.05c-.86 1.3-2.33 2.15-4 2.15z"/>',
		'person_pin': '<path d="M19 2H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h4l3 3 3-3h4c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-7 3.3c1.49 0 2.7 1.21 2.7 2.7 0 1.49-1.21 2.7-2.7 2.7-1.49 0-2.7-1.21-2.7-2.7 0-1.49 1.21-2.7 2.7-2.7zM18 16H6v-.9c0-2 4-3.1 6-3.1s6 1.1 6 3.1v.9z"/>',
		'pin_drop': '<path d="M10 8c0-1.1.9-2 2-2s2 .9 2 2-.89 2-2 2c-1.1 0-2-.9-2-2zm8 0c0-3.31-2.69-6-6-6S6 4.69 6 8c0 4.5 6 11 6 11s6-6.5 6-11z"/><path d="M5 20v2h14v-2H5z"/>',
		'place': '<path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>',
		'rate_review': '<path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 14v-2.47l6.88-6.88c.2-.2.51-.2.71 0l1.77 1.77c.2.2.2.51 0 .71L8.47 14H6zm12 0h-7.5l2-2H18v2z"/>',
		'restaurant': '<path d="M11 9H9V2H7v7H5V2H3v7c0 2.12 1.66 3.84 3.75 3.97V22h2.5v-9.03C11.34 12.84 13 11.12 13 9V2h-2v7z"/><path d="M16 6v8h2.5v8H21V2c-2.76 0-5 2.24-5 4z"/>',
		'restaurant_menu': '<path d="M8.1 13.34l2.83-2.83L3.91 3.5a4.008 4.008 0 0 0 0 5.66l4.19 4.18z"/><path d="M14.88 11.53c1.53.71 3.68.21 5.27-1.38 1.91-1.91 2.28-4.65.81-6.12-1.46-1.46-4.2-1.1-6.12.81-1.59 1.59-2.09 3.74-1.38 5.27L3.7 19.87l1.41 1.41L12 14.41l6.88 6.88 1.41-1.41L13.41 13l1.47-1.47z"/>',
		'satellite': '<path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM5 4.99h3C8 6.65 6.66 8 5 8V4.99zM5 12v-2c2.76 0 5-2.25 5-5.01h2C12 8.86 8.87 12 5 12zm0 6l3.5-4.5 2.5 3.01L14.5 12l4.5 6H5z"/>',
		'store_mall_directory': '<path d="M20 4H4v2h16V4z"/><path d="M12 18H6v-4h6v4zm9-4v-2l-1-5H4l-1 5v2h1v6h10v-6h4v6h2v-6h1z"/>',
		'streetview': '<path d="M12.56 14.33c-.34.27-.56.7-.56 1.17V21h7c1.1 0 2-.9 2-2v-5.98c-.94-.33-1.95-.52-3-.52-2.03 0-3.93.7-5.44 1.83z"/><circle cx="18" cy="6" r="5"/><path d="M11.5 6c0-1.08.27-2.1.74-3H5c-1.1 0-2 .9-2 2v14c0 .55.23 1.05.59 1.41l9.82-9.82C12.23 9.42 11.5 7.8 11.5 6z"/>',
		'subway': '<circle cx="15.5" cy="16" r="1"/><circle cx="8.5" cy="16" r="1"/><path d="M7.01 9h10v5h-10z"/><path d="M17.8 2.8C16 2.09 13.86 2 12 2c-1.86 0-4 .09-5.8.8C3.53 3.84 2 6.05 2 8.86V22h20V8.86c0-2.81-1.53-5.02-4.2-6.06zm.2 13.08c0 1.45-1.18 2.62-2.63 2.62l1.13 1.12V20H15l-1.5-1.5h-2.83L9.17 20H7.5v-.38l1.12-1.12C7.18 18.5 6 17.32 6 15.88V9c0-2.63 3-3 6-3 3.32 0 6 .38 6 3v6.88z"/>',
		'terrain': '<path d="M14 6l-3.75 5 2.85 3.8-1.6 1.2C9.81 13.75 7 10 7 10l-6 8h22L14 6z"/>',
		'traffic': '<path d="M20 10h-3V8.86c1.72-.45 3-2 3-3.86h-3V4c0-.55-.45-1-1-1H8c-.55 0-1 .45-1 1v1H4c0 1.86 1.28 3.41 3 3.86V10H4c0 1.86 1.28 3.41 3 3.86V15H4c0 1.86 1.28 3.41 3 3.86V20c0 .55.45 1 1 1h8c.55 0 1-.45 1-1v-1.14c1.72-.45 3-2 3-3.86h-3v-1.14c1.72-.45 3-2 3-3.86zm-8 9c-1.11 0-2-.9-2-2s.89-2 2-2c1.1 0 2 .9 2 2s-.89 2-2 2zm0-5c-1.11 0-2-.9-2-2s.89-2 2-2c1.1 0 2 .9 2 2s-.89 2-2 2zm0-5c-1.11 0-2-.9-2-2 0-1.11.89-2 2-2 1.1 0 2 .89 2 2 0 1.1-.89 2-2 2z"/>',
		'train': '<path d="M12 2c-4 0-8 .5-8 4v9.5C4 17.43 5.57 19 7.5 19L6 20.5v.5h2.23l2-2H14l2 2h2v-.5L16.5 19c1.93 0 3.5-1.57 3.5-3.5V6c0-3.5-3.58-4-8-4zM7.5 17c-.83 0-1.5-.67-1.5-1.5S6.67 14 7.5 14s1.5.67 1.5 1.5S8.33 17 7.5 17zm3.5-7H6V6h5v4zm2 0V6h5v4h-5zm3.5 7c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/>',
		'tram': '<path d="M19 16.94V8.5c0-2.79-2.61-3.4-6.01-3.49l.76-1.51H17V2H7v1.5h4.75l-.76 1.52C7.86 5.11 5 5.73 5 8.5v8.44c0 1.45 1.19 2.66 2.59 2.97L6 21.5v.5h2.23l2-2H14l2 2h2v-.5L16.5 20h-.08c1.69 0 2.58-1.37 2.58-3.06zm-7 1.56c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm5-4.5H7V9h10v5z"/>',
		'transfer_within_a_station': '<path d="M16.49 15.5v-1.75L14 16.25l2.49 2.5V17H22v-1.5z"/><path d="M19.51 19.75H14v1.5h5.51V23L22 20.5 19.51 18z"/><path d="M9.5 5.5c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zM5.75 8.9L3 23h2.1l1.75-8L9 17v6h2v-7.55L8.95 13.4l.6-3C10.85 12 12.8 13 15 13v-2c-1.85 0-3.45-1-4.35-2.45l-.95-1.6C9.35 6.35 8.7 6 8 6c-.25 0-.5.05-.75.15L2 8.3V13h2V9.65l1.75-.75"/>',
		'zoom_out_map': '<path d="M15 3l2.3 2.3-2.89 2.87 1.42 1.42L18.7 6.7 21 9V3z"/><path d="M3 9l2.3-2.3 2.87 2.89 1.42-1.42L6.7 5.3 9 3H3z"/><path d="M9 21l-2.3-2.3 2.89-2.87-1.42-1.42L5.3 17.3 3 15v6z"/><path d="M21 15l-2.3 2.3-2.87-2.89-1.42 1.42 2.89 2.87L15 21h6z"/>',
		//
		// navigation
		//
		'apps': '<path d="M4 8h4V4H4v4z"/><path d="M10 20h4v-4h-4v4z"/><path d="M4 20h4v-4H4v4z"/><path d="M4 14h4v-4H4v4z"/><path d="M10 14h4v-4h-4v4z"/><path d="M16 4v4h4V4h-4z"/><path d="M10 8h4V4h-4v4z"/><path d="M16 14h4v-4h-4v4z"/><path d="M16 20h4v-4h-4v4z"/>',
		'arrow_back': '<path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>',
		'arrow_downward': '<path d="M20 12l-1.41-1.41L13 16.17V4h-2v12.17l-5.58-5.59L4 12l8 8 8-8z"/>',
		'arrow_drop_down': '<path d="M7 10l5 5 5-5z"/>',
		'arrow_drop_down_circle': '<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 12l-4-4h8l-4 4z"/>',
		'arrow_drop_up': '<path d="M7 14l5-5 5 5z"/>',
		'arrow_forward': '<path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"/>',
		'arrow_upwards': '<path d="M4 12l1.41 1.41L11 7.83V20h2V7.83l5.58 5.59L20 12l-8-8-8 8z"/>',
		'cancel': '<path d="M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm5 13.59L15.59 17 12 13.41 8.41 17 7 15.59 10.59 12 7 8.41 8.41 7 12 10.59 15.59 7 17 8.41 13.41 12 17 15.59z"/>',
		'check': '<path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>',
		'chevron_left': '<path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/>',
		'chevron_right': '<path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>',
		'close': '<path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>',
		'expand_less': '<path d="M12 8l-6 6 1.41 1.41L12 10.83l4.59 4.58L18 14z"/>',
		'expand_more': '<path d="M16.59 8.59L12 13.17 7.41 8.59 6 10l6 6 6-6z"/>',
		'first_page': '<path d="M18.41 16.59L13.82 12l4.59-4.59L17 6l-6 6 6 6z"/><path d="M6 6h2v12H6z"/>',
		'fullscreen': '<path d="M7 14H5v5h5v-2H7v-3z"/><path d="M5 10h2V7h3V5H5v5z"/><path d="M17 17h-3v2h5v-5h-2v3z"/><path d="M14 5v2h3v3h2V5h-5z"/>',
		'fullscreen_exit': '<path d="M5 16h3v3h2v-5H5v2z"/><path d="M8 8H5v2h5V5H8v3z"/><path d="M14 19h2v-3h3v-2h-5v5z"/><path d="M16 8V5h-2v5h5V8h-3z"/>',
		'last_page': '<path d="M5.59 7.41L10.18 12l-4.59 4.59L7 18l6-6-6-6z"/><path d="M16 6h2v12h-2z"/>',
		'menu': '<path d="M3 18h18v-2H3v2z"/><path d="M3 13h18v-2H3v2z"/><path d="M3 6v2h18V6H3z"/>',
		'more_horiz': '<path d="M6 10c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/><path d="M18 10c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/><path d="M12 10c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>',
		'more_vert': '<path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2z"/><path d="M12 16c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/><path d="M12 10c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>',
		'refresh': '<path d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/>',
		'subdirectory_arrow_left': ' <path d="M11 9l1.42 1.42L8.83 14H18V4h2v12H8.83l3.59 3.58L11 21l-6-6 6-6z"/>',
		'subdirectory_arrow_right': '<path d="M19 15l-6 6-1.42-1.42L15.17 16H4V4h2v10h9.17l-3.59-3.58L13 9l6 6z"/>',
		//
		// notification
		//
		'adb': '<path d="M5 16c0 3.87 3.13 7 7 7s7-3.13 7-7v-4H5v4z"/><path d="M15 9c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zM9 9c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm7.12-4.63l2.1-2.1-.82-.83-2.3 2.31C14.16 3.28 13.12 3 12 3s-2.16.28-3.09.75L6.6 1.44l-.82.83 2.1 2.1C6.14 5.64 5 7.68 5 10v1h14v-1c0-2.32-1.14-4.36-2.88-5.63z"/>',
		'airline_seat_flat': '<path d="M22 11v2H9V7h9c2.21 0 4 1.79 4 4z"/><path d="M2 14v2h6v2h8v-2h6v-2H2z"/><path d="M7.14 12.1a3 3 0 0 0-.04-4.24 3 3 0 0 0-4.24.04 3 3 0 0 0 .04 4.24 3 3 0 0 0 4.24-.04z"/>',
		'airline_seat_angled': '<path d="M22.25 14.29l-.69 1.89L9.2 11.71l2.08-5.66 8.56 3.09a4 4 0 0 1 2.41 5.15z"/><path d="M1.5 12.14L8 14.48V19h8v-1.63L20.52 19l.69-1.89-19.02-6.86-.69 1.89z"/><path d="M7.3 10.2a3.01 3.01 0 0 0 1.41-4A3.005 3.005 0 0 0 4.7 4.8a2.99 2.99 0 0 0-1.4 4 2.99 2.99 0 0 0 4 1.4z"/>',
		'airline_seat_individual_suite': '<path d="M7 13c1.65 0 3-1.35 3-3S8.65 7 7 7s-3 1.35-3 3 1.35 3 3 3z"/><path d="M19 7h-8v7H3V7H1v10h22v-6c0-2.21-1.79-4-4-4z"/>',
		'airline_seat_legroom_extra': '<path d="M4 12V3H2v9c0 2.76 2.24 5 5 5h6v-2H7c-1.66 0-3-1.34-3-3z"/><path d="M22.83 17.24c-.38-.72-1.29-.97-2.03-.63l-1.09.5-3.41-6.98a2.01 2.01 0 0 0-1.79-1.12L11 9V3H5v8c0 1.66 1.34 3 3 3h7l3.41 7 3.72-1.7c.77-.36 1.1-1.3.7-2.06z"/>',
		'airline_seat_legroom_normal': '<path d="M5 12V3H3v9c0 2.76 2.24 5 5 5h6v-2H8c-1.66 0-3-1.34-3-3z"/><path d="M20.5 18H19v-7c0-1.1-.9-2-2-2h-5V3H6v8c0 1.65 1.35 3 3 3h7v7h4.5c.83 0 1.5-.67 1.5-1.5s-.67-1.5-1.5-1.5z"/>',
		'airline_seat_legroom_reduced': '<path d="M19.97 19.2c.18.96-.55 1.8-1.47 1.8H14v-3l1-4H9c-1.65 0-3-1.35-3-3V3h6v6h5c1.1 0 2 .9 2 2l-2 7h1.44c.73 0 1.39.49 1.53 1.2z"/><path d="M5 12V3H3v9c0 2.76 2.24 5 5 5h4v-2H8c-1.66 0-3-1.34-3-3z"/>',
		'airline_seat_recline_extra': '<path d="M5.35 5.64c-.9-.64-1.12-1.88-.49-2.79.63-.9 1.88-1.12 2.79-.49.9.64 1.12 1.88.49 2.79-.64.9-1.88 1.12-2.79.49z"/><path d="M16 19H8.93c-1.48 0-2.74-1.08-2.96-2.54L4 7H2l1.99 9.76A5.01 5.01 0 0 0 8.94 21H16v-2z"/><path d="M16.23 15h-4.88l-1.03-4.1c1.58.89 3.28 1.54 5.15 1.22V9.99c-1.63.31-3.44-.27-4.69-1.25L9.14 7.47c-.23-.18-.49-.3-.76-.38a2.21 2.21 0 0 0-.99-.06h-.02a2.268 2.268 0 0 0-1.84 2.61l1.35 5.92A3.008 3.008 0 0 0 9.83 18h6.85l3.82 3 1.5-1.5-5.77-4.5z"/>',
		'airline_seat_recline_normal': '<path d="M7.59 5.41c-.78-.78-.78-2.05 0-2.83.78-.78 2.05-.78 2.83 0 .78.78.78 2.05 0 2.83-.79.79-2.05.79-2.83 0z"/><path d="M6 16V7H4v9c0 2.76 2.24 5 5 5h6v-2H9c-1.66 0-3-1.34-3-3z"/><path d="M20 20.07L14.93 15H11.5v-3.68c1.4 1.15 3.6 2.16 5.5 2.16v-2.16c-1.66.02-3.61-.87-4.67-2.04l-1.4-1.55c-.19-.21-.43-.38-.69-.5-.29-.14-.62-.23-.96-.23h-.03C8.01 7 7 8.01 7 9.25V15c0 1.66 1.34 3 3 3h5.07l3.5 3.5L20 20.07z"/>',
		'bluetooth_audio': '<path d="M19.53 6.71l-1.26 1.26c.63 1.21.98 2.57.98 4.02 0 1.45-.36 2.82-.98 4.02l1.2 1.2c.97-1.54 1.54-3.36 1.54-5.31-.01-1.89-.55-3.67-1.48-5.19zm-5.29 5.3l2.32 2.32c.28-.72.44-1.51.44-2.33 0-.82-.16-1.59-.43-2.31l-2.33 2.32z"/><path d="M12.88 16.29L11 18.17v-3.76l1.88 1.88zM11 5.83l1.88 1.88L11 9.59V5.83zm4.71 1.88L10 2H9v7.59L4.41 5 3 6.41 8.59 12 3 17.59 4.41 19 9 14.41V22h1l5.71-5.71-4.3-4.29 4.3-4.29z"/>',
		'confirmation_number': '<path d="M22 10V6c0-1.11-.9-2-2-2H4c-1.1 0-1.99.89-1.99 2v4c1.1 0 1.99.9 1.99 2s-.89 2-2 2v4c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2v-4c-1.1 0-2-.9-2-2s.9-2 2-2zm-9 7.5h-2v-2h2v2zm0-4.5h-2v-2h2v2zm0-4.5h-2v-2h2v2z"/>',
		'disc_full': '<path d="M20 7v5h2V7h-2zm0 9h2v-2h-2v2z"/><path d="M10 14c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm0-10c-4.42 0-8 3.58-8 8s3.58 8 8 8 8-3.58 8-8-3.58-8-8-8z"/>',
		'do_not_disturb': '<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8 0-1.85.63-3.55 1.69-4.9L16.9 18.31C15.55 19.37 13.85 20 12 20zm6.31-3.1L7.1 5.69C8.45 4.63 10.15 4 12 4c4.42 0 8 3.58 8 8 0 1.85-.63 3.55-1.69 4.9z"/>',
		'do_not_disturb_alt': '<path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zM4 12c0-4.4 3.6-8 8-8 1.8 0 3.5.6 4.9 1.7L5.7 16.9C4.6 15.5 4 13.8 4 12zm8 8c-1.8 0-3.5-.6-4.9-1.7L18.3 7.1C19.4 8.5 20 10.2 20 12c0 4.4-3.6 8-8 8z"/>',
		'do_not_disturb_off': '<path d="M17 11v2h-1.46l4.68 4.68A9.92 9.92 0 0 0 22 12c0-5.52-4.48-10-10-10-2.11 0-4.07.66-5.68 1.78L13.54 11H17z"/><path d="M7 13v-2h1.46l2 2H7zM2.27 2.27L1 3.54l2.78 2.78A9.92 9.92 0 0 0 2 12c0 5.52 4.48 10 10 10 2.11 0 4.07-.66 5.68-1.78L20.46 23l1.27-1.27L11 11 2.27 2.27z"/>',
		'do_not_disturb_on': '<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 11H7v-2h10v2z"/>',
		'drive_eta': '<path d="M18.92 5.01C18.72 4.42 18.16 4 17.5 4h-11c-.66 0-1.21.42-1.42 1.01L3 11v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 15c-.83 0-1.5-.67-1.5-1.5S5.67 12 6.5 12s1.5.67 1.5 1.5S7.33 15 6.5 15zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 10l1.5-4.5h11L19 10H5z"/>',
		'enhanced_encryption': '<path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zM8.9 6c0-1.71 1.39-3.1 3.1-3.1s3.1 1.39 3.1 3.1v2H8.9V6zM16 16h-3v3h-2v-3H8v-2h3v-3h2v3h3v2z"/>',
		'event_available': '<path d="M16.53 11.06L15.47 10l-4.88 4.88-2.12-2.12-1.06 1.06L10.59 17l5.94-5.94z"/><path d="M19 19H5V8h14v11zm0-16h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z"/>',
		'event_busy': '<path d="M9.31 17l2.44-2.44L14.19 17l1.06-1.06-2.44-2.44 2.44-2.44L14.19 10l-2.44 2.44L9.31 10l-1.06 1.06 2.44 2.44-2.44 2.44L9.31 17z"/><path d="M19 19H5V8h14v11zm0-16h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z"/>',
		'event_note': '<path d="M19 19H5V8h14v11zm0-16h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z"/><path d="M14 14H7v2h7v-2zm3-4H7v2h10v-2z"/>',
		'folder_special': '<path d="M20 6h-8l-2-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-6.42 12L10 15.9 6.42 18l.95-4.07-3.16-2.74 4.16-.36L10 7l1.63 3.84 4.16.36-3.16 2.74.95 4.06z"/>',
		'live_tv': '<path d="M21 20H3V8h18v12zm0-14h-7.59l3.29-3.29L16 2l-4 4-4-4-.71.71L10.59 6H3a2 2 0 0 0-2 2v12c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V8a2 2 0 0 0-2-2z"/><path d="M9 10v8l7-4z"/>',
		'mms': '<path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM5 14l3.5-4.5 2.5 3.01L14.5 8l4.5 6H5z"/>',
		'more': '<path d="M22 3H7c-.69 0-1.23.35-1.59.88L0 12l5.41 8.11c.36.53.97.89 1.66.89H22c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 13.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm5 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm5 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/>',
		'network_check': '<path d="M15.9 5c-.17 0-.32.09-.41.23l-.07.15-5.18 11.65c-.16.29-.26.61-.26.96 0 1.11.9 2.01 2.01 2.01.96 0 1.77-.68 1.96-1.59l.01-.03L16.4 5.5c0-.28-.22-.5-.5-.5z"/><path d="M21 11l2-2a15.367 15.367 0 0 0-5.59-3.57l-.53 2.82c1.5.62 2.9 1.53 4.12 2.75zM1 9l2 2c2.88-2.88 6.79-4.08 10.53-3.62l1.19-2.68C9.89 3.84 4.74 5.27 1 9z"/><path d="M5 13l2 2a7.1 7.1 0 0 1 4.03-2l1.28-2.88c-2.63-.08-5.3.87-7.31 2.88zm12 2l2-2c-.8-.8-1.7-1.42-2.66-1.89l-.55 2.92c.42.27.83.59 1.21.97z"/>',
		'network_locked': '<path d="M19.5 10c.17 0 .33.03.5.05V1L1 20h13v-3c0-.89.39-1.68 1-2.23v-.27c0-2.48 2.02-4.5 4.5-4.5z"/><path d="M21 16h-3v-1.5c0-.83.67-1.5 1.5-1.5s1.5.67 1.5 1.5V16zm1 0v-1.5c0-1.38-1.12-2.5-2.5-2.5S17 13.12 17 14.5V16c-.55 0-1 .45-1 1v4c0 .55.45 1 1 1h5c.55 0 1-.45 1-1v-4c0-.55-.45-1-1-1z"/>',
		'no_encryption': '<path d="M21 21.78L4.22 5 3 6.22l2.04 2.04C4.42 8.6 4 9.25 4 10v10c0 1.1.9 2 2 2h12c.23 0 .45-.05.66-.12L19.78 23 21 21.78z"/><path d="M8.9 6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2H9.66L20 18.34V10c0-1.1-.9-2-2-2h-1V6c0-2.76-2.24-5-5-5-2.56 0-4.64 1.93-4.94 4.4L8.9 7.24V6z"/>',
		'ondemand_video': '<path d="M21 17H3V5h18v12zm0-14H3c-1.11 0-2 .89-2 2v12a2 2 0 0 0 2 2h5v2h8v-2h5c1.1 0 1.99-.9 1.99-2L23 5a2 2 0 0 0-2-2z"/><path d="M16 11l-7 4V7z"/>',
		'personal_video': '<path d="M21 3H3c-1.11 0-2 .89-2 2v12c0 1.1.89 2 2 2h5v2h8v-2h5c1.1 0 1.99-.9 1.99-2L23 5c0-1.11-.9-2-2-2zm0 14H3V5h18v12z"/>',
		'phone_bluetooth_speaker': '<path d="M18 7.21l.94.94-.94.94V7.21zm0-4.3l.94.94-.94.94V2.91zM14.71 9.5L17 7.21V11h.5l2.85-2.85L18.21 6l2.15-2.15L17.5 1H17v3.79L14.71 2.5l-.71.71L16.79 6 14 8.79l.71.71z"/><path d="M20 15.5c-1.25 0-2.45-.2-3.57-.57-.35-.11-.74-.03-1.02.24l-2.2 2.2c-2.83-1.44-5.15-3.75-6.59-6.59l2.2-2.21c.28-.26.36-.65.25-1C8.7 6.45 8.5 5.25 8.5 4c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1 0 9.39 7.61 17 17 17 .55 0 1-.45 1-1v-3.5c0-.55-.45-1-1-1z"/>',
		'phone_forwarded': '<path d="M18 11l5-5-5-5v3h-4v4h4v3z"/><path d="M20 15.5c-1.25 0-2.45-.2-3.57-.57-.35-.11-.74-.03-1.02.24l-2.2 2.2c-2.83-1.44-5.15-3.75-6.59-6.59l2.2-2.21c.28-.26.36-.65.25-1C8.7 6.45 8.5 5.25 8.5 4c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1 0 9.39 7.61 17 17 17 .55 0 1-.45 1-1v-3.5c0-.55-.45-1-1-1z"/>',
		'phone_in_talk': '<path d="M20 15.5c-1.25 0-2.45-.2-3.57-.57-.35-.11-.74-.03-1.02.24l-2.2 2.2c-2.83-1.44-5.15-3.75-6.59-6.59l2.2-2.21c.28-.26.36-.65.25-1C8.7 6.45 8.5 5.25 8.5 4c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1 0 9.39 7.61 17 17 17 .55 0 1-.45 1-1v-3.5c0-.55-.45-1-1-1z"/><path d="M19 12h2c0-4.97-4.03-9-9-9v2c3.87 0 7 3.13 7 7z"/><path d="M15 12h2c0-2.76-2.24-5-5-5v2c1.66 0 3 1.34 3 3z"/>',
		'phone_locked': '<path d="M20 15.5c-1.25 0-2.45-.2-3.57-.57-.35-.11-.74-.03-1.02.24l-2.2 2.2c-2.83-1.44-5.15-3.75-6.59-6.59l2.2-2.21c.28-.26.36-.65.25-1C8.7 6.45 8.5 5.25 8.5 4c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1 0 9.39 7.61 17 17 17 .55 0 1-.45 1-1v-3.5c0-.55-.45-1-1-1z"/><path d="M19.2 4h-3.4v-.5c0-.94.76-1.7 1.7-1.7s1.7.76 1.7 1.7V4zm.8 0v-.5C20 2.12 18.88 1 17.5 1S15 2.12 15 3.5V4c-.55 0-1 .45-1 1v4c0 .55.45 1 1 1h5c.55 0 1-.45 1-1V5c0-.55-.45-1-1-1z"/>',
		'phone_missed': '<path d="M6.5 5.5L12 11l7-7-1-1-6 6-4.5-4.5H11V3H5v6h1.5V5.5z"/><path d="M23.71 16.67C20.66 13.78 16.54 12 12 12 7.46 12 3.34 13.78.29 16.67c-.18.18-.29.43-.29.71 0 .28.11.53.29.71l2.48 2.48c.18.18.43.29.71.29.27 0 .52-.11.7-.28.79-.74 1.69-1.36 2.66-1.85.33-.16.56-.5.56-.9v-3.1c1.45-.48 3-.73 4.6-.73 1.6 0 3.15.25 4.6.72v3.1c0 .39.23.74.56.9.98.49 1.87 1.12 2.67 1.85.18.18.43.28.7.28.28 0 .53-.11.71-.29l2.48-2.48c.18-.18.29-.43.29-.71 0-.28-.12-.52-.3-.7z"/>',
		'phone_paused': '<path d="M17 3h-2v7h2V3z"/><path d="M20 15.5c-1.25 0-2.45-.2-3.57-.57-.35-.11-.74-.03-1.02.24l-2.2 2.2c-2.83-1.44-5.15-3.75-6.59-6.59l2.2-2.21c.28-.26.36-.65.25-1C8.7 6.45 8.5 5.25 8.5 4c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1 0 9.39 7.61 17 17 17 .55 0 1-.45 1-1v-3.5c0-.55-.45-1-1-1z"/><path d="M19 3v7h2V3h-2z"/>',
		'power': '<path d="M16.01 7L16 3h-2v4h-4V3H8v4h-.01C7 6.99 6 7.99 6 8.99v5.49L9.5 18v3h5v-3l3.5-3.51v-5.5c0-1-1-2-1.99-1.99z"/>',
		'priority_high': '<circle cx="12" cy="19" r="2"/><path d="M10 3h4v12h-4z"/>',
		'sd_card': '<path d="M18 2h-8L4.02 8 4 20c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-6 6h-2V4h2v4zm3 0h-2V4h2v4zm3 0h-2V4h2v4z"/>',
		'sim_card_alert': '<path d="M18 2h-8L4.02 8 4 20c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-5 15h-2v-2h2v2zm0-4h-2V8h2v5z"/>',
		'sms': '<path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM9 11H7V9h2v2zm4 0h-2V9h2v2zm4 0h-2V9h2v2z"/>',
		'sms_failed': '<path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-7 12h-2v-2h2v2zm0-4h-2V6h2v4z"/>',
		'sync': '<path d="M12 4V1L8 5l4 4V6c3.31 0 6 2.69 6 6 0 1.01-.25 1.97-.7 2.8l1.46 1.46C19.54 15.03 20 13.57 20 12c0-4.42-3.58-8-8-8z"/><path d="M12 18c-3.31 0-6-2.69-6-6 0-1.01.25-1.97.7-2.8L5.24 7.74C4.46 8.97 4 10.43 4 12c0 4.42 3.58 8 8 8v3l4-4-4-4v3z"/>',
		'sync_disabled': '<path d="M10 6.35V4.26c-.8.21-1.55.54-2.23.96l1.46 1.46c.25-.12.5-.24.77-.33z"/><path d="M2.86 5.41l2.36 2.36a7.925 7.925 0 0 0 1.14 9.87L4 20h6v-6l-2.24 2.24A6.003 6.003 0 0 1 6 12c0-1 .25-1.94.68-2.77l8.08 8.08c-.25.13-.5.25-.77.34v2.09c.8-.21 1.55-.54 2.23-.96l2.36 2.36 1.27-1.27L4.14 4.14 2.86 5.41z"/><path d="M20 4h-6v6l2.24-2.24A6.003 6.003 0 0 1 18 12c0 1-.25 1.94-.68 2.77l1.46 1.46a7.925 7.925 0 0 0-1.14-9.87L20 4z"/>',
		'sync_problem': '<path d="M3 12c0 2.21.91 4.2 2.36 5.64L3 20h6v-6l-2.24 2.24C5.68 15.15 5 13.66 5 12c0-2.61 1.67-4.83 4-5.65V4.26C5.55 5.15 3 8.27 3 12z"/><path d="M21 4h-6v6l2.24-2.24C18.32 8.85 19 10.34 19 12c0 2.61-1.67 4.83-4 5.65v2.09c3.45-.89 6-4.01 6-7.74 0-2.21-.91-4.2-2.36-5.64L21 4z"/><path d="M11 13h2V7h-2v6zm0 4h2v-2h-2v2z"/>',
		'system_update': '<path d="M17 19H7V5h10v14zm0-17.99L7 1c-1.1 0-2 .9-2 2v18c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V3c0-1.1-.9-1.99-2-1.99z"/><path d="M16 13h-3V8h-2v5H8l4 4 4-4z"/>',
		'tap_and_play': '<path d="M2 16v2c2.76 0 5 2.24 5 5h2c0-3.87-3.13-7-7-7z"/><path d="M2 20v3h3c0-1.66-1.34-3-3-3z"/><path d="M2 12v2a9 9 0 0 1 9 9h2c0-6.08-4.92-11-11-11z"/><path d="M17 1.01L7 1c-1.1 0-2 .9-2 2v7.37c.69.16 1.36.37 2 .64V5h10v13h-3.03c.52 1.25.84 2.59.95 4H17c1.1 0 2-.9 2-2V3c0-1.1-.9-1.99-2-1.99z"/>',
		'time_to_leave': '<path d="M18.92 5.01C18.72 4.42 18.16 4 17.5 4h-11c-.66 0-1.21.42-1.42 1.01L3 11v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 15c-.83 0-1.5-.67-1.5-1.5S5.67 12 6.5 12s1.5.67 1.5 1.5S7.33 15 6.5 15zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 10l1.5-4.5h11L19 10H5z"/>',
		'vibration': '<path d="M0 15h2V9H0v6z"/><path d="M3 17h2V7H3v10z"/><path d="M22 9v6h2V9h-2z"/><path d="M19 17h2V7h-2v10z"/><path d="M16 19H8V5h8v14zm.5-16h-9C6.67 3 6 3.67 6 4.5v15c0 .83.67 1.5 1.5 1.5h9c.83 0 1.5-.67 1.5-1.5v-15c0-.83-.67-1.5-1.5-1.5z"/>',
		'voice_chat': '<path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12l-4-3.2V14H6V6h8v3.2L18 6v8z"/>',
		'vpn_lock': '<path d="M21.2 4h-3.4v-.5c0-.94.76-1.7 1.7-1.7s1.7.76 1.7 1.7V4zm.8 0v-.5a2.5 2.5 0 0 0-5 0V4c-.55 0-1 .45-1 1v4c0 .55.45 1 1 1h5c.55 0 1-.45 1-1V5c0-.55-.45-1-1-1z"/><path d="M10 20.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L8 16v1c0 1.1.9 2 2 2v1.93zM18.92 12c.04.33.08.66.08 1 0 2.08-.8 3.97-2.1 5.39-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H7v-2h2c.55 0 1-.45 1-1V8h2c1.1 0 2-.9 2-2V3.46c-.95-.3-1.95-.46-3-.46C5.48 3 1 7.48 1 13s4.48 10 10 10 10-4.48 10-10c0-.34-.02-.67-.05-1h-2.03z"/>',
		'wc': '<path d="M5.5 22v-7.5H4V9c0-1.1.9-2 2-2h3c1.1 0 2 .9 2 2v5.5H9.5V22h-4z"/><path d="M18 22v-6h3l-2.54-7.63A2.01 2.01 0 0 0 16.56 7h-.12a2 2 0 0 0-1.9 1.37L12 16h3v6h3z"/><path d="M7.5 6c1.11 0 2-.89 2-2 0-1.11-.89-2-2-2-1.11 0-2 .89-2 2 0 1.11.89 2 2 2z"/><path d="M16.5 6c1.11 0 2-.89 2-2 0-1.11-.89-2-2-2-1.11 0-2 .89-2 2 0 1.11.89 2 2 2z"/>',
		'wifi': '<path d="M1 9l2 2c4.97-4.97 13.03-4.97 18 0l2-2C16.93 2.93 7.08 2.93 1 9z"/><path d="M9 17l3 3 3-3a4.237 4.237 0 0 0-6 0z"/><path d="M5 13l2 2a7.074 7.074 0 0 1 10 0l2-2C15.14 9.14 8.87 9.14 5 13z"/>',
		//
		// places
		//
		'ac_unit': '<path d="M22 11h-4.17l3.24-3.24-1.41-1.42L15 11h-2V9l4.66-4.66-1.42-1.41L13 6.17V2h-2v4.17L7.76 2.93 6.34 4.34 11 9v2H9L4.34 6.34 2.93 7.76 6.17 11H2v2h4.17l-3.24 3.24 1.41 1.42L9 13h2v2l-4.66 4.66 1.42 1.41L11 17.83V22h2v-4.17l3.24 3.24 1.42-1.41L13 15v-2h2l4.66 4.66 1.41-1.42L17.83 13H22z"/>',
		'airport_shuttle': '<path d="M17 5H3c-1.1 0-2 .89-2 2v9h2c0 1.65 1.34 3 3 3s3-1.35 3-3h5.5c0 1.65 1.34 3 3 3s3-1.35 3-3H23v-5l-6-6zM3 11V7h4v4H3zm3 6.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm7-6.5H9V7h4v4zm4.5 6.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM15 11V7h1l4 4h-5z"/>',
		'all_inclusive': '<path d="M18.6 6.62c-1.44 0-2.8.56-3.77 1.53L12 10.66 10.48 12h.01L7.8 14.39c-.64.64-1.49.99-2.4.99-1.87 0-3.39-1.51-3.39-3.38S3.53 8.62 5.4 8.62c.91 0 1.76.35 2.44 1.03l1.13 1 1.51-1.34L9.22 8.2C8.2 7.18 6.84 6.62 5.4 6.62 2.42 6.62 0 9.04 0 12s2.42 5.38 5.4 5.38c1.44 0 2.8-.56 3.77-1.53l2.83-2.5.01.01L13.52 12h-.01l2.69-2.39c.64-.64 1.49-.99 2.4-.99 1.87 0 3.39 1.51 3.39 3.38s-1.52 3.38-3.39 3.38c-.9 0-1.76-.35-2.44-1.03l-1.14-1.01-1.51 1.34 1.27 1.12c1.02 1.01 2.37 1.57 3.82 1.57 2.98 0 5.4-2.41 5.4-5.38s-2.42-5.37-5.4-5.37z"/>',
		'beach_access': '<path d="M13.127 14.56l1.43-1.43 6.44 6.443L19.57 21z"/><path d="M17.42 8.83l2.86-2.86c-3.95-3.95-10.35-3.96-14.3-.02 3.93-1.3 8.31-.25 11.44 2.88z"/><path d="M5.95 5.98c-3.94 3.95-3.93 10.35.02 14.3l2.86-2.86C5.7 14.29 4.65 9.91 5.95 5.98z"/><path d="M5.97 5.96l-.01.01c-.38 3.01 1.17 6.88 4.3 10.02l5.73-5.73c-3.13-3.13-7.01-4.68-10.02-4.3z"/>',
		'business_center': '<path d="M10 16v-1H3.01L3 19c0 1.11.89 2 2 2h14c1.11 0 2-.89 2-2v-4h-7v1h-4z"/><path d="M14 7h-4V5h4v2zm6 0h-4.01V5l-2-2h-4l-2 2v2H4c-1.1 0-2 .9-2 2v3c0 1.11.89 2 2 2h6v-2h4v2h6c1.1 0 2-.9 2-2V9c0-1.1-.9-2-2-2z"/>',
		'casino': '<path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM7.5 18c-.83 0-1.5-.67-1.5-1.5S6.67 15 7.5 15s1.5.67 1.5 1.5S8.33 18 7.5 18zm0-9C6.67 9 6 8.33 6 7.5S6.67 6 7.5 6 9 6.67 9 7.5 8.33 9 7.5 9zm4.5 4.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm4.5 4.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm0-9c-.83 0-1.5-.67-1.5-1.5S15.67 6 16.5 6s1.5.67 1.5 1.5S17.33 9 16.5 9z"/>',
		'child_care': '<circle cx="14.5" cy="10.5" r="1.25"/> <circle cx="9.5" cy="10.5" r="1.25"/> <path d="M22.94 12.66c.04-.21.06-.43.06-.66s-.02-.45-.06-.66c-.25-1.51-1.36-2.74-2.81-3.17-.53-1.12-1.28-2.1-2.19-2.91C16.36 3.85 14.28 3 12 3s-4.36.85-5.94 2.26c-.92.81-1.67 1.8-2.19 2.91-1.45.43-2.56 1.65-2.81 3.17-.04.21-.06.43-.06.66s.02.45.06.66c.25 1.51 1.36 2.74 2.81 3.17.52 1.11 1.27 2.09 2.17 2.89C7.62 20.14 9.71 21 12 21s4.38-.86 5.97-2.28c.9-.8 1.65-1.79 2.17-2.89 1.44-.43 2.55-1.65 2.8-3.17zM19 14c-.1 0-.19-.02-.29-.03-.2.67-.49 1.29-.86 1.86C16.6 17.74 14.45 19 12 19s-4.6-1.26-5.85-3.17c-.37-.57-.66-1.19-.86-1.86-.1.01-.19.03-.29.03-1.1 0-2-.9-2-2s.9-2 2-2c.1 0 .19.02.29.03.2-.67.49-1.29.86-1.86C7.4 6.26 9.55 5 12 5s4.6 1.26 5.85 3.17c.37.57.66 1.19.86 1.86.1-.01.19-.03.29-.03 1.1 0 2 .9 2 2s-.9 2-2 2zM7.5 14c.76 1.77 2.49 3 4.5 3s3.74-1.23 4.5-3h-9z"/>',
		'child_friedly': '<path d="M13 2v8h8c0-4.42-3.58-8-8-8z"/><path d="M17 20c-.83 0-1.5-.67-1.5-1.5S16.17 17 17 17s1.5.67 1.5 1.5S17.83 20 17 20zm-9 0c-.83 0-1.5-.67-1.5-1.5S7.17 17 8 17s1.5.67 1.5 1.5S8.83 20 8 20zm11.32-4.11A7.948 7.948 0 0 0 21 11H6.44l-.95-2H2v2h2.22s1.89 4.07 2.12 4.42c-1.1.59-1.84 1.75-1.84 3.08C4.5 20.43 6.07 22 8 22c1.76 0 3.22-1.3 3.46-3h2.08c.24 1.7 1.7 3 3.46 3 1.93 0 3.5-1.57 3.5-3.5 0-1.04-.46-1.97-1.18-2.61z"/>',
		'fitness_center': '<path d="M20.57 14.86L22 13.43 20.57 12 17 15.57 8.43 7 12 3.43 10.57 2 9.14 3.43 7.71 2 5.57 4.14 4.14 2.71 2.71 4.14l1.43 1.43L2 7.71l1.43 1.43L2 10.57 3.43 12 7 8.43 15.57 17 12 20.57 13.43 22l1.43-1.43L16.29 22l2.14-2.14 1.43 1.43 1.43-1.43-1.43-1.43L22 16.29z"/>',
		'free_breakfast': '<path d="M20 8h-2V5h2v3zm0-5H4v10c0 2.21 1.79 4 4 4h6c2.21 0 4-1.79 4-4v-3h2a2 2 0 0 0 2-2V5c0-1.11-.89-2-2-2z"/><path d="M4 19h16v2H4z"/>',
		'golf_course': '<circle cx="19.5" cy="19.5" r="1.5"/><path d="M17 5.92L9 2v18H7v-1.73c-1.79.35-3 .99-3 1.73 0 1.1 2.69 2 6 2s6-.9 6-2c0-.99-2.16-1.81-5-1.97V8.98l6-3.06z"/>',
		'hot_tub': '<circle cx="7" cy="6" r="2"/><path d="M11.15 12c-.31-.22-.59-.46-.82-.72l-1.4-1.55c-.19-.21-.43-.38-.69-.5-.29-.14-.62-.23-.96-.23h-.03C6.01 9 5 10.01 5 11.25V12H2v8c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2v-8H11.15zM7 20H5v-6h2v6zm4 0H9v-6h2v6zm4 0h-2v-6h2v6zm4 0h-2v-6h2v6zm-.35-14.14l-.07-.07c-.57-.62-.82-1.41-.67-2.2L18 3h-1.89l-.06.43c-.2 1.36.27 2.71 1.3 3.72l.07.06c.57.62.82 1.41.67 2.2l-.11.59h1.91l.06-.43c.21-1.36-.27-2.71-1.3-3.71zm-4 0l-.07-.07c-.57-.62-.82-1.41-.67-2.2L14 3h-1.89l-.06.43c-.2 1.36.27 2.71 1.3 3.72l.07.06c.57.62.82 1.41.67 2.2l-.11.59h1.91l.06-.43c.21-1.36-.27-2.71-1.3-3.71z"/>',
		'kitchen': '<path d="M18 9H6V4h12v5zm0 11H6v-9.02h12V20zm0-17.99L6 2a2 2 0 0 0-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.11-.9-1.99-2-1.99z"/><path d="M8 5h2v3H8z"/><path d="M8 12h2v5H8z"/>',
		'pool': '<path d="M22 21c-1.11 0-1.73-.37-2.18-.64-.37-.22-.6-.36-1.15-.36-.56 0-.78.13-1.15.36-.46.27-1.07.64-2.18.64s-1.73-.37-2.18-.64c-.37-.22-.6-.36-1.15-.36-.56 0-.78.13-1.15.36-.46.27-1.08.64-2.19.64-1.11 0-1.73-.37-2.18-.64-.37-.23-.6-.36-1.15-.36s-.78.13-1.15.36c-.46.27-1.08.64-2.19.64v-2c.56 0 .78-.13 1.15-.36.46-.27 1.08-.64 2.19-.64s1.73.37 2.18.64c.37.23.59.36 1.15.36.56 0 .78-.13 1.15-.36.46-.27 1.08-.64 2.19-.64 1.11 0 1.73.37 2.18.64.37.22.6.36 1.15.36s.78-.13 1.15-.36c.45-.27 1.07-.64 2.18-.64s1.73.37 2.18.64c.37.23.59.36 1.15.36v2zm0-4.5c-1.11 0-1.73-.37-2.18-.64-.37-.22-.6-.36-1.15-.36-.56 0-.78.13-1.15.36-.45.27-1.07.64-2.18.64s-1.73-.37-2.18-.64c-.37-.22-.6-.36-1.15-.36-.56 0-.78.13-1.15.36-.45.27-1.07.64-2.18.64s-1.73-.37-2.18-.64c-.37-.22-.6-.36-1.15-.36s-.78.13-1.15.36c-.47.27-1.09.64-2.2.64v-2c.56 0 .78-.13 1.15-.36.45-.27 1.07-.64 2.18-.64s1.73.37 2.18.64c.37.22.6.36 1.15.36.56 0 .78-.13 1.15-.36.45-.27 1.07-.64 2.18-.64s1.73.37 2.18.64c.37.22.6.36 1.15.36s.78-.13 1.15-.36c.45-.27 1.07-.64 2.18-.64s1.73.37 2.18.64c.37.22.6.36 1.15.36v2zM8.67 12c.56 0 .78-.13 1.15-.36.46-.27 1.08-.64 2.19-.64 1.11 0 1.73.37 2.18.64.37.22.6.36 1.15.36s.78-.13 1.15-.36c.12-.07.26-.15.41-.23L10.48 5C8.93 3.45 7.5 2.99 5 3v2.5c1.82-.01 2.89.39 4 1.5l1 1-3.25 3.25c.31.12.56.27.77.39.37.23.59.36 1.15.36z"/> <circle cx="16.5" cy="5.5" r="2.5"/>',
		'room_service': '<path d="M2 17h20v2H2z"/><path d="M13.84 7.79A2.006 2.006 0 0 0 12 5a2.006 2.006 0 0 0-1.84 2.79C6.25 8.6 3.27 11.93 3 16h18c-.27-4.07-3.25-7.4-7.16-8.21z"/>',
		'rv_hookup': '<path d="M18 14h-4v-3h4v3zm-7 6c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm9-3v-6c0-1.1-.9-2-2-2H7V7l-3 3 3 3v-2h4v3H4v3c0 1.1.9 2 2 2h2c0 1.66 1.34 3 3 3s3-1.34 3-3h8v-2h-2z"/><path d="M17 2v2H9v2h8v2l3-3z"/>',
		'smoke_free': '<path d="M2 6l6.99 7H2v3h9.99l7 7 1.26-1.25-17-17z"/><path d="M20.5 13H22v3h-1.5z"/><path d="M18 13h1.5v3H18z"/><path d="M18.85 4.88c.62-.61 1-1.45 1-2.38h-1.5c0 1.02-.83 1.85-1.85 1.85v1.5c2.24 0 4 1.83 4 4.07V12H22V9.92c0-2.23-1.28-4.15-3.15-5.04z"/><path d="M14.5 8.7h1.53c1.05 0 1.97.74 1.97 2.05V12h1.5v-1.59c0-1.8-1.6-3.16-3.47-3.16H14.5c-1.02 0-1.85-.98-1.85-2s.83-1.75 1.85-1.75V2a3.35 3.35 0 0 0 0 6.7z"/><path d="M17 15.93V13h-2.93z"/>',
		'smoke_rooms': '<path d="M2 16h15v3H2z"/><path d="M20.5 16H22v3h-1.5z"/><path d="M18 16h1.5v3H18z"/><path d="M18.85 7.73c.62-.61 1-1.45 1-2.38C19.85 3.5 18.35 2 16.5 2v1.5c1.02 0 1.85.83 1.85 1.85S17.52 7.2 16.5 7.2v1.5c2.24 0 4 1.83 4 4.07V15H22v-2.24c0-2.22-1.28-4.14-3.15-5.03z"/><path d="M16.03 10.2H14.5c-1.02 0-1.85-.98-1.85-2s.83-1.75 1.85-1.75v-1.5a3.35 3.35 0 0 0 0 6.7h1.53c1.05 0 1.97.74 1.97 2.05V15h1.5v-1.64c0-1.81-1.6-3.16-3.47-3.16z"/>',
		'spa': '<path d="M8.55 12c-1.07-.71-2.25-1.27-3.53-1.61 1.28.34 2.46.9 3.53 1.61zm10.43-1.61c-1.29.34-2.49.91-3.57 1.64 1.08-.73 2.28-1.3 3.57-1.64z"/> <path d="M15.49 9.63c-.18-2.79-1.31-5.51-3.43-7.63-2.14 2.14-3.32 4.86-3.55 7.63 1.28.68 2.46 1.56 3.49 2.63 1.03-1.06 2.21-1.94 3.49-2.63zm-6.5 2.65c-.14-.1-.3-.19-.45-.29.15.11.31.19.45.29zm6.42-.25c-.13.09-.27.16-.4.26.13-.1.27-.17.4-.26zM12 15.45C9.85 12.17 6.18 10 2 10c0 5.32 3.36 9.82 8.03 11.49.63.23 1.29.4 1.97.51.68-.12 1.33-.29 1.97-.51C18.64 19.82 22 15.32 22 10c-4.18 0-7.85 2.17-10 5.45z"/>',
		//
		// social
		//
		'cake': '<path d="M12 6c1.11 0 2-.9 2-2 0-.38-.1-.73-.29-1.03L12 0l-1.71 2.97c-.19.3-.29.65-.29 1.03 0 1.1.9 2 2 2z"/><path d="M16.6 15.99l-1.07-1.07-1.08 1.07c-1.3 1.3-3.58 1.31-4.89 0l-1.07-1.07-1.09 1.07C6.75 16.64 5.88 17 4.96 17c-.73 0-1.4-.23-1.96-.61V21c0 .55.45 1 1 1h16c.55 0 1-.45 1-1v-4.61c-.56.38-1.23.61-1.96.61-.92 0-1.79-.36-2.44-1.01z"/><path d="M18 9h-5V7h-2v2H6c-1.66 0-3 1.34-3 3v1.54c0 1.08.88 1.96 1.96 1.96.52 0 1.02-.2 1.38-.57l2.14-2.13 2.13 2.13c.74.74 2.03.74 2.77 0l2.14-2.13 2.13 2.13c.37.37.86.57 1.38.57 1.08 0 1.96-.88 1.96-1.96V12C21 10.34 19.66 9 18 9z"/>',
		'domain': '<path d="M20 19h-8v-2h2v-2h-2v-2h2v-2h-2V9h8v10zM10 7H8V5h2v2zm0 4H8V9h2v2zm0 4H8v-2h2v2zm0 4H8v-2h2v2zM6 7H4V5h2v2zm0 4H4V9h2v2zm0 4H4v-2h2v2zm0 4H4v-2h2v2zm6-12V3H2v18h20V7H12z"/><path d="M18 11h-2v2h2v-2z"/><path d="M18 15h-2v2h2v-2z"/>',
		'group': '<path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3z"/><path d="M8 11c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3z"/><path d="M8 13c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5z"/><path d="M16 13c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/>',
		'group_add': '<path d="M8 10H5V7H3v3H0v2h3v3h2v-3h3v-2z"/><path d="M18 11c1.66 0 2.99-1.34 2.99-3S19.66 5 18 5c-.32 0-.63.05-.91.14.57.81.9 1.79.9 2.86 0 1.07-.34 2.04-.9 2.86.28.09.59.14.91.14z"/><path d="M13 11c1.66 0 2.99-1.34 2.99-3S14.66 5 13 5c-1.66 0-3 1.34-3 3s1.34 3 3 3z"/><path d="M19.62 13.16c.83.73 1.38 1.66 1.38 2.84v2h3v-2c0-1.54-2.37-2.49-4.38-2.84z"/><path d="M13 13c-2 0-6 1-6 3v2h12v-2c0-2-4-3-6-3z"/>',
		'location_city': '<path d="M15 11V5l-3-3-3 3v2H3v14h18V11h-6zm-8 8H5v-2h2v2zm0-4H5v-2h2v2zm0-4H5V9h2v2zm6 8h-2v-2h2v2zm0-4h-2v-2h2v2zm0-4h-2V9h2v2zm0-4h-2V5h2v2zm6 12h-2v-2h2v2zm0-4h-2v-2h2v2z"/>',
		'mood': '<path d="M12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm-.01-18C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2z"/><path d="M15.5 11c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5z"/><path d="M8.5 11c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11z"/><path d="M12 17.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z"/>',
		'mood_bad': '<path d="M12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm-.01-18C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2z"/><path d="M15.5 11c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5z"/><path d="M8.5 11c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11z"/><path d="M12 14c-2.33 0-4.31 1.46-5.11 3.5h10.22c-.8-2.04-2.78-3.5-5.11-3.5z"/>',
		'notifications': '<path d="M11.5 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2z"/><path d="M18 16v-5.5c0-3.07-2.13-5.64-5-6.32V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5v.68c-2.87.68-5 3.25-5 6.32V16l-2 2v1h17v-1l-2-2z"/>',
		'notifications_none': '<path d="M11.5 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2z"/><path d="M16 17H7v-6.5C7 8.01 9.01 6 11.5 6S16 8.01 16 10.5V17zm2-1v-5.5c0-3.07-2.13-5.64-5-6.32V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5v.68c-2.87.68-5 3.25-5 6.32V16l-2 2v1h17v-1l-2-2z"/>',
		'notifications_off': '<path d="M11.5 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2z"/><path d="M18 10.5c0-3.07-2.13-5.64-5-6.32V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5v.68c-.51.12-.99.32-1.45.56L18 14.18V10.5z"/><path d="M17.73 19l2 2L21 19.73 4.27 3 3 4.27l2.92 2.92C5.34 8.16 5 9.29 5 10.5V16l-2 2v1h14.73z"/>',
		'notifications_active': '<path d="M6.58 3.58L5.15 2.15C2.76 3.97 1.18 6.8 1.03 10h2c.15-2.65 1.51-4.97 3.55-6.42z"/><path d="M19.97 10h2c-.15-3.2-1.73-6.03-4.13-7.85l-1.43 1.43c2.05 1.45 3.41 3.77 3.56 6.42z"/><path d="M18 10.5c0-3.07-2.13-5.64-5-6.32V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5v.68c-2.87.68-5 3.25-5 6.32V16l-2 2v1h17v-1l-2-2v-5.5z"/><path d="M11.5 22c.14 0 .27-.01.4-.04.65-.13 1.19-.58 1.44-1.18.1-.24.16-.5.16-.78h-4c0 1.1.9 2 2 2z"/>',
		'notifications_paused': '<path d="M11.5 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2z"/><path d="M14 9.8l-2.8 3.4H14V15H9v-1.8l2.8-3.4H9V8h5v1.8zm4 6.2v-5.5c0-3.07-2.13-5.64-5-6.32V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5v.68c-2.87.68-5 3.25-5 6.32V16l-2 2v1h17v-1l-2-2z"/>',
		'pages': '<path d="M3 5v6h5L7 7l4 1V3H5c-1.1 0-2 .9-2 2z"/><path d="M8 13H3v6c0 1.1.9 2 2 2h6v-5l-4 1 1-4z"/><path d="M17 17l-4-1v5h6c1.1 0 2-.9 2-2v-6h-5l1 4z"/><path d="M19 3h-6v5l4-1-1 4h5V5c0-1.1-.9-2-2-2z"/>',
		'party_mode': '<path d="M20 4h-3.17L15 2H9L7.17 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm-8 3c1.63 0 3.06.79 3.98 2H12c-1.66 0-3 1.34-3 3 0 .35.07.69.18 1H7.1c-.06-.32-.1-.66-.1-1 0-2.76 2.24-5 5-5zm0 10c-1.63 0-3.06-.79-3.98-2H12c1.66 0 3-1.34 3-3 0-.35-.07-.69-.18-1h2.08c.07.32.1.66.1 1 0 2.76-2.24 5-5 5z"/>',
		'people': '<path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3z"/><path d="M8 11c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3z"/><path d="M8 13c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5z"/><path d="M16 13c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/>',
		'people_outline': '<path d="M21.5 17.5H14v-1.25c0-.46-.2-.86-.52-1.22.88-.3 1.96-.53 3.02-.53 2.44 0 5 1.21 5 1.75v1.25zm-9 0h-10v-1.25c0-.54 2.56-1.75 5-1.75s5 1.21 5 1.75v1.25zm4-4.5c-1.2 0-3.07.34-4.5 1-1.43-.67-3.3-1-4.5-1C5.33 13 1 14.08 1 16.25V19h22v-2.75c0-2.17-4.33-3.25-6.5-3.25z"/><path d="M7.5 6.5c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zm0 5.5c1.93 0 3.5-1.57 3.5-3.5S9.43 5 7.5 5 4 6.57 4 8.5 5.57 12 7.5 12z"/><path d="M16.5 6.5c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zm0 5.5c1.93 0 3.5-1.57 3.5-3.5S18.43 5 16.5 5 13 6.57 13 8.5s1.57 3.5 3.5 3.5z"/>',
		'person': '<path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4z"/><path d="M12 14c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>',
		'person_add': '<path d="M15 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4z"/><path d="M6 10V7H4v3H1v2h3v3h2v-3h3v-2H6z"/><path d="M15 14c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>',
		'person_outline': '<path d="M12 4C9.79 4 8 5.79 8 8s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm0 1.9c1.16 0 2.1.94 2.1 2.1 0 1.16-.94 2.1-2.1 2.1-1.16 0-2.1-.94-2.1-2.1 0-1.16.94-2.1 2.1-2.1"/><path d="M12 13c-2.67 0-8 1.34-8 4v3h16v-3c0-2.66-5.33-4-8-4zm0 1.9c2.97 0 6.1 1.46 6.1 2.1v1.1H5.9V17c0-.64 3.13-2.1 6.1-2.1"/>',
		'plus_one': '<path d="M10 8H8v4H4v2h4v4h2v-4h4v-2h-4z"/><path d="M14.5 6.08V7.9l2.5-.5V18h2V5z"/>',
		'poll': '<path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"/>',
		'public': '<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>',
		'school': '<path d="M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82z"/><path d="M12 3L1 9l11 6 9-4.91V17h2V9L12 3z"/>',
		'sentiment_dissatisfied': '<circle cx="15.5" cy="9.5" r="1.5"/><circle cx="8.5" cy="9.5" r="1.5"/><path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm0-6c-2.33 0-4.32 1.45-5.12 3.5h1.67c.69-1.19 1.97-2 3.45-2s2.75.81 3.45 2h1.67c-.8-2.05-2.79-3.5-5.12-3.5z"/>',
		'sentiment_neutral': '<path d="M9 14h6v1.5H9z"/><circle cx="15.5" cy="9.5" r="1.5"/><circle cx="8.5" cy="9.5" r="1.5"/><path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z"/>',
		'sentiment_satisfied': '<circle cx="15.5" cy="9.5" r="1.5"/><circle cx="8.5" cy="9.5" r="1.5"/><path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm0-4c-1.48 0-2.75-.81-3.45-2H6.88c.8 2.05 2.79 3.5 5.12 3.5s4.32-1.45 5.12-3.5h-1.67c-.7 1.19-1.97 2-3.45 2z"/>',
		'sentiment_very_dissatisfied': '<path d="M12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm-.01-18C6.47 2 2 6.47 2 12s4.47 10 9.99 10C17.51 22 22 17.53 22 12S17.52 2 11.99 2z"/><path d="M16.18 7.76l-1.06 1.06-1.06-1.06L13 8.82l1.06 1.06L13 10.94 14.06 12l1.06-1.06L16.18 12l1.06-1.06-1.06-1.06 1.06-1.06z"/><path d="M7.82 12l1.06-1.06L9.94 12 11 10.94 9.94 9.88 11 8.82 9.94 7.76 8.88 8.82 7.82 7.76 6.76 8.82l1.06 1.06-1.06 1.06z"/><path d="M12 14c-2.33 0-4.31 1.46-5.11 3.5h10.22c-.8-2.04-2.78-3.5-5.11-3.5z"/>',
		'sentiment_very_satisfied': '<path d="M12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm-.01-18C6.47 2 2 6.47 2 12s4.47 10 9.99 10C17.51 22 22 17.53 22 12S17.52 2 11.99 2z"/><path d="M13 9.94L14.06 11l1.06-1.06L16.18 11l1.06-1.06-2.12-2.12z"/><path d="M8.88 9.94L9.94 11 11 9.94 8.88 7.82 6.76 9.94 7.82 11z"/><path d="M12 17.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z"/>',
		'share': '<path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92 1.61 0 2.92-1.31 2.92-2.92s-1.31-2.92-2.92-2.92z"/>',
		'whatshot': '<path d="M13.5.67s.74 2.65.74 4.8c0 2.06-1.35 3.73-3.41 3.73-2.07 0-3.63-1.67-3.63-3.73l.03-.36C5.21 7.51 4 10.62 4 14c0 4.42 3.58 8 8 8s8-3.58 8-8C20 8.61 17.41 3.8 13.5.67zM11.71 19c-1.78 0-3.22-1.4-3.22-3.14 0-1.62 1.05-2.76 2.81-3.12 1.77-.36 3.6-1.21 4.62-2.58.39 1.29.59 2.65.59 4.04 0 2.65-2.15 4.8-4.8 4.8z"/>',
		//
		// toggle
		//
		'check_box': '<path d="M19 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.11 0 2-.9 2-2V5c0-1.1-.89-2-2-2zm-9 14l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>',
		'check_box_outline_blank': '<path d="M19 5v14H5V5h14m0-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z"/>',
		'indeterminate_check_box': '<path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-2 10H7v-2h10v2z"/>',
		'radio_button_unchecked': '<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z"/>',
		'radio_button_checked': '<path d="M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5z"/><path d="M12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm0-18C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"/>',
		'star': '<path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>',
		'star_half': '<path d="M22 9.74l-7.19-.62L12 2.5 9.19 9.13 2 9.74l5.46 4.73-1.64 7.03L12 17.77l6.18 3.73-1.63-7.03L22 9.74zM12 15.9V6.6l1.71 4.04 4.38.38-3.32 2.88 1 4.28L12 15.9z"/>',
		'star_border': '<path d="M22 9.24l-7.19-.62L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21 12 17.27 18.18 21l-1.63-7.03L22 9.24zM12 15.4l-3.76 2.27 1-4.28-3.32-2.88 4.38-.38L12 6.1l1.71 4.04 4.38.38-3.32 2.88 1 4.28L12 15.4z"/>'
	})

	/*
	 * custom icons
	 */
	.addShapes({
		// Add single icon
		'standby': '<path d="M13 3.5h-2v10h2v-10z"/><path d="M16.56 5.94l-1.45 1.45C16.84 8.44 18 10.33 18 12.5c0 3.31-2.69 6-6 6s-6-2.69-6-6c0-2.17 1.16-4.06 2.88-5.12L7.44 5.94C5.36 7.38 4 9.78 4 12.5c0 4.42 3.58 8 8 8s8-3.58 8-8c0-2.72-1.36-5.12-3.44-6.56z"/>',
		'custom-delete': wbIconServiceProvider.getShape('delete'),
		'vertical': wbIconServiceProvider.getShape('view_sequential'),

		'corner_bottom_left': '<path d="M 5,5 H 3 V 3 H 5 Z M 5,7 H 3 v 2 h 2 z m 16,4 h -2 v 2 h 2 z m 0,-4 h -2 v 2 h 2 z m 0,8 h -2 v 2 h 2 z m 0,4 h -2 v 2 h 2 z m -4,0 h -2 v 2 h 2 z M 9,3 H 7 v 2 h 2 z m 4,0 h -2 v 2 h 2 z M 9,3 H 7 v 2 h 2 z m 8,0 h -2 v 2 h 2 z m 4,0 h -2 v 2 h 2 z M 3,16 c 0,2.76 2.24,5 5,5 h 5 V 19 H 8 C 6.35,19 5,17.65 5,16 V 11 H 3 Z" />',
		'corner_bottom_right': '<path d="m 5,19 v 2 H 3 v -2 z m 2,0 v 2 h 2 v -2 z m 4,-16 0,2 2,0 0,-2 z M 7,3 V 5 L 9,5 9,3 Z m 8,0 0,2 2,0 V 3 Z m 4,0 v 2 h 2 V 3 Z m 0,4 v 2 l 2,0 V 7 Z M 3,15 v 2 h 2 v -2 z m 0,-4 v 2 h 2 v -2 z m 0,4 v 2 H 5 V 15 Z M 3,7 V 9 H 5 V 7 Z M 3,3 V 5 H 5 V 3 Z m 13,18 c 2.76,0 5,-2.24 5,-5 v -5 l -2,0 0,5 c 0,1.65 -1.35,3 -3,3 l -5,0 v 2 z" />',
		'corner_top_left': '<path d="M 19,5 V 3 h 2 V 5 Z M 17,5 V 3 h -2 v 2 z m -4,16 v -2 h -2 v 2 z m 4,0 v -2 h -2 v 2 z M 9,21 V 19 H 7 v 2 z M 5,21 V 19 H 3 l 0,2 z M 5,17 5,15 H 3 v 2 z M 21,9 V 7 h -2 v 2 z m 0,4 v -2 h -2 v 2 z M 21,9 V 7 h -2 v 2 z m 0,8 v -2 h -2 v 2 z m 0,4 v -2 h -2 v 2 z M 8,3 C 5.24,3 3,5.24 3,8 v 5 H 5 V 8 C 5,6.35 6.35,5 8,5 h 5 V 3 Z" />',
		'corner_top_right': '<path d="m 19,19 h 2 v 2 h -2 z m 0,-2 h 2 V 15 H 19 Z M 3,13 H 5 V 11 H 3 Z m 0,4 H 5 V 15 H 3 Z M 3,9 H 5 V 7 H 3 Z M 3,5 H 5 V 3 H 3 Z M 7,5 H 9 V 3 H 7 Z m 8,16 h 2 v -2 h -2 z m -4,0 h 2 v -2 h -2 z m 4,0 h 2 V 19 H 15 Z M 7,21 H 9 V 19 H 7 Z M 3,21 H 5 V 19 H 3 Z M 21,8 C 21,5.24 18.76,3 16,3 h -5 v 2 h 5 c 1.65,0 3,1.35 3,3 v 5 h 2 z" />',
		'full_rounded': wbIconServiceProvider.getShape('crop_free'),

		'align_justify_vertical': '<path d="M 21,21 V 3 h -2 v 18 z m -4,0 V 3 h -2 l 0,18 z m -4,0 0,-18 h -2 l 0,18 z M 9,21 9,3 H 7 L 7,21 Z M 3,21 H 5 L 5,3 H 3 Z" />',
		'align_center_vertical': '<path d="m 15,17 h 2 V 7 h -2 z m 6,4 V 3 h -2 v 18 z m -8,0 0,-18 h -2 l 0,18 z M 7,17 H 9 L 9,7 H 7 Z M 3,21 H 5 L 5,3 H 3 Z" />',
		'align_end_vertical': '<path d="m 15,9 0,12 h 2 V 9 Z M 7,9 7,21 H 9 L 9,9 Z m 6,12 0,-18 h -2 l 0,18 z m 8,0 V 3 H 19 V 21 Z M 3,21 H 5 L 5,3 H 3 Z" />',
		'align_start_vertical': '<path d="M 21,21 V 3 H 19 V 21 Z M 17,15 V 3 h -2 l 0,12 z m -4,6 0,-18 h -2 l 0,18 z M 9,15 9,3 H 7 V 15 Z M 3,21 H 5 L 5,3 H 3 Z" />',

		'sort_space_between_horiz': '<path d="M 4.5710877,3 C 3.7069894,3 3,3.7007772 3,4.5572828 V 19.442717 C 3,20.299223 3.7069895,21 4.5710877,21 H 19.428912 C 20.293011,21 21,20.299223 21,19.442717 V 4.5572828 C 21,3.7007772 20.293011,3 19.428912,3 Z m 0,1.5496789 H 19.428912 V 19.451841 H 4.5710877 Z m 1.5373337,1.999831 c -0.4320491,0 -0.7855438,0.3503886 -0.7855438,0.7786414 v 9.3436967 c 0,0.428253 0.3534947,0.778642 0.7855438,0.778642 H 8.465053 c 0.4320489,0 0.7855436,-0.350389 0.7855436,-0.778642 V 7.3281513 c 0,-0.4282528 -0.3534947,-0.7786414 -0.7855436,-0.7786414 z m 9.4265256,0 c -0.432049,0 -0.785544,0.3503886 -0.785544,0.7786414 v 9.3436967 c 0,0.428253 0.353495,0.778642 0.785544,0.778642 h 2.356632 c 0.432049,0 0.785544,-0.350389 0.785544,-0.778642 V 7.3281513 c 0,-0.4282528 -0.353495,-0.7786414 -0.785544,-0.7786414 z" />',
		'sort_space_around_horiz': '<path d="M 4.5710877,3 C 3.7069894,3 3,3.7007773 3,4.5572829 V 19.442717 C 3,20.299223 3.7069894,21 4.5710877,21 H 19.428912 C 20.293011,21 21,20.299223 21,19.442717 V 4.5572829 C 21,3.7007773 20.293011,3 19.428912,3 Z m 0,1.549679 H 19.428912 V 19.451842 H 4.5710877 Z m 2.6757586,1.9602906 c -0.4320491,0 -0.7855438,0.3503886 -0.7855438,0.7786414 v 9.343697 c 0,0.428253 0.3534947,0.778642 0.7855438,0.778642 h 2.3566315 c 0.4320492,0 0.7855442,-0.350389 0.7855442,-0.778642 V 7.288611 c 0,-0.4282528 -0.353495,-0.7786414 -0.7855442,-0.7786414 z m 7.0698947,0 c -0.432049,0 -0.785544,0.3503886 -0.785544,0.7786414 v 9.343697 c 0,0.428253 0.353495,0.778642 0.785544,0.778642 h 2.356631 c 0.432049,0 0.785544,-0.350389 0.785544,-0.778642 V 7.288611 c 0,-0.4282528 -0.353495,-0.7786414 -0.785544,-0.7786414 z" />',
		'sort_center_horiz': '<path d="M 4.5710877,3 C 3.7069894,3 3,3.7007772 3,4.5572828 V 19.442717 C 3,20.299223 3.7069895,21 4.5710877,21 H 19.428912 C 20.293011,21 21,20.299223 21,19.442717 V 4.5572828 C 21,3.7007772 20.293011,3 19.428912,3 Z m 0,1.5496789 H 19.428912 V 19.451841 H 4.5710877 Z m 3.7344017,1.999831 c -0.4320492,0 -0.7855438,0.3503886 -0.7855438,0.7786414 v 9.3436967 c 0,0.428253 0.3534946,0.778642 0.7855438,0.778642 h 2.3566316 c 0.432049,0 0.785543,-0.350389 0.785543,-0.778642 V 7.3281513 c 0,-0.4282528 -0.353494,-0.7786414 -0.785543,-0.7786414 z m 5.4988066,0 c -0.432049,0 -0.785544,0.3503886 -0.785544,0.7786414 v 9.3436967 c 0,0.428253 0.353495,0.778642 0.785544,0.778642 h 2.356631 c 0.43205,0 0.785544,-0.350389 0.785544,-0.778642 V 7.3281513 c 0,-0.4282528 -0.353494,-0.7786414 -0.785544,-0.7786414 z" />',
		'sort_start_horiz': '<path d="M 4.5710877,3 C 3.7069894,3 3,3.7007772 3,4.5572828 V 19.442717 C 3,20.299223 3.7069895,21 4.5710877,21 H 19.428912 C 20.293011,21 21,20.299223 21,19.442717 V 4.5572828 C 21,3.7007772 20.293011,3 19.428912,3 Z m 0,1.5496789 H 19.428912 V 19.451841 H 4.5710877 Z m 1.5373337,1.999831 c -0.4320491,0 -0.7855438,0.3503886 -0.7855438,0.7786414 v 9.3436967 c 0,0.428253 0.3534947,0.778642 0.7855438,0.778642 H 8.465053 c 0.4320489,0 0.7855436,-0.350389 0.7855436,-0.778642 V 7.3281513 c 0,-0.4282528 -0.3534947,-0.7786414 -0.7855436,-0.7786414 z m 5.4988066,0 c -0.432049,0 -0.785544,0.3503886 -0.785544,0.7786414 v 9.3436967 c 0,0.428253 0.353495,0.778642 0.785544,0.778642 h 2.356632 c 0.432049,0 0.785543,-0.350389 0.785543,-0.778642 V 7.3281513 c 0,-0.4282528 -0.353494,-0.7786414 -0.785543,-0.7786414 z" />',
		'sort_end_horiz': '<path d="M 4.5710877,3 C 3.7069894,3 3,3.7007772 3,4.5572828 V 19.442717 C 3,20.299223 3.7069895,21 4.5710877,21 H 19.428912 C 20.293011,21 21,20.299223 21,19.442717 V 4.5572828 C 21,3.7007772 20.293011,3 19.428912,3 Z m 0,1.5496789 H 19.428912 V 19.451841 H 4.5710877 Z m 5.4650523,1.999831 c -0.4320487,0 -0.7855434,0.3503886 -0.7855434,0.7786414 v 9.3436967 c 0,0.428253 0.3534947,0.778642 0.7855434,0.778642 h 2.356632 c 0.432049,0 0.785544,-0.350389 0.785544,-0.778642 V 7.3281513 c 0,-0.4282528 -0.353495,-0.7786414 -0.785544,-0.7786414 z m 5.498807,0 c -0.432049,0 -0.785544,0.3503886 -0.785544,0.7786414 v 9.3436967 c 0,0.428253 0.353495,0.778642 0.785544,0.778642 h 2.356632 c 0.432049,0 0.785544,-0.350389 0.785544,-0.778642 V 7.3281513 c 0,-0.4282528 -0.353495,-0.7786414 -0.785544,-0.7786414 z" />',

		'sort_space_between_vert': '<path d="M 3,19.428912 C 3,20.293011 3.7007772,21 4.5572828,21 H 19.442717 C 20.299223,21 21,20.29301 21,19.428912 V 4.571088 C 21,3.706989 20.299223,3 19.442717,3 H 4.5572828 C 3.7007772,3 3,3.706989 3,4.571088 Z m 1.5496789,0 0,-14.857824 H 19.451841 v 14.857824 z m 1.999831,-1.537333 c 0,0.432049 0.3503886,0.785543 0.7786414,0.785543 h 9.3436967 c 0.428253,0 0.778642,-0.353494 0.778642,-0.785543 v -2.356632 c 0,-0.432049 -0.350389,-0.785544 -0.778642,-0.785544 l -9.3436967,0 c -0.4282528,0 -0.7786414,0.353495 -0.7786414,0.785544 z m 0,-9.426526 c 0,0.432049 0.3503886,0.785544 0.7786414,0.785544 l 9.3436967,0 c 0.428253,0 0.778642,-0.353495 0.778642,-0.785544 V 6.108421 c 0,-0.432049 -0.350389,-0.785544 -0.778642,-0.785544 H 7.3281513 c -0.4282528,0 -0.7786414,0.353495 -0.7786414,0.785544 z" />',
		'sort_space_around_vert': '<path d="M 3,19.428912 C 3,20.293011 3.7007773,21 4.5572829,21 H 19.442717 C 20.299223,21 21,20.293011 21,19.428912 V 4.571088 C 21,3.706989 20.299223,3 19.442717,3 H 4.5572829 C 3.7007773,3 3,3.706989 3,4.571088 Z m 1.549679,0 0,-14.857824 h 14.902163 v 14.857824 z m 1.9602906,-2.675758 c 0,0.432049 0.3503886,0.785544 0.7786414,0.785544 h 9.343697 c 0.428253,0 0.778642,-0.353495 0.778642,-0.785544 v -2.356632 c 0,-0.432049 -0.350389,-0.785544 -0.778642,-0.785544 l -9.343697,0 c -0.4282528,0 -0.7786414,0.353495 -0.7786414,0.785544 z m 0,-7.069895 c 0,0.432049 0.3503886,0.785544 0.7786414,0.785544 l 9.343697,0 c 0.428253,0 0.778642,-0.353495 0.778642,-0.785544 V 7.326628 c 0,-0.432049 -0.350389,-0.785544 -0.778642,-0.785544 H 7.288611 c -0.4282528,0 -0.7786414,0.353495 -0.7786414,0.785544 z" />',
		'sort_center_vert': '<path d="M 3,19.428912 C 3,20.293011 3.7007772,21 4.5572828,21 H 19.442717 C 20.299223,21 21,20.29301 21,19.428912 V 4.571088 C 21,3.706989 20.299223,3 19.442717,3 H 4.5572828 C 3.7007772,3 3,3.706989 3,4.571088 Z m 1.5496789,0 0,-14.857824 H 19.451841 v 14.857824 z m 1.999831,-3.734401 c 0,0.432049 0.3503886,0.785543 0.7786414,0.785543 h 9.3436967 c 0.428253,0 0.778642,-0.353494 0.778642,-0.785543 v -2.356632 c 0,-0.432049 -0.350389,-0.785543 -0.778642,-0.785543 l -9.3436967,0 c -0.4282528,0 -0.7786414,0.353494 -0.7786414,0.785543 z m 0,-5.498807 c 0,0.432049 0.3503886,0.785544 0.7786414,0.785544 l 9.3436967,0 c 0.428253,0 0.778642,-0.353495 0.778642,-0.785544 V 7.839073 c 0,-0.43205 -0.350389,-0.785544 -0.778642,-0.785544 H 7.3281513 c -0.4282528,0 -0.7786414,0.353494 -0.7786414,0.785544 z" />',
		'sort_start_vert': '<path d="M 3,19.428912 C 3,20.293011 3.7007772,21 4.5572828,21 H 19.442717 C 20.299223,21 21,20.29301 21,19.428912 V 4.571088 C 21,3.706989 20.299223,3 19.442717,3 H 4.5572828 C 3.7007772,3 3,3.706989 3,4.571088 Z m 1.5496789,0 0,-14.857824 H 19.451841 v 14.857824 z m 1.999831,-5.465052 c 0,0.432049 0.3503886,0.785543 0.7786414,0.785543 l 9.3436967,0 c 0.428253,0 0.778642,-0.353494 0.778642,-0.785543 v -2.356632 c 0,-0.432049 -0.350389,-0.785544 -0.778642,-0.785544 l -9.3436967,0 c -0.4282528,0 -0.7786414,0.353495 -0.7786414,0.785544 z m 0,-5.498807 c 0,0.432049 0.3503886,0.785544 0.7786414,0.785544 l 9.3436967,0 c 0.428253,0 0.778642,-0.353495 0.778642,-0.785544 V 6.108421 c 0,-0.432049 -0.350389,-0.785544 -0.778642,-0.785544 H 7.3281513 c -0.4282528,0 -0.7786414,0.353495 -0.7786414,0.785544 z" />',
		'sort_end_vert': '<path d="M 3,19.428912 C 3,20.293011 3.7007772,21 4.5572828,21 H 19.442717 C 20.299223,21 21,20.29301 21,19.428912 V 4.571088 C 21,3.706989 20.299223,3 19.442717,3 H 4.5572828 C 3.7007772,3 3,3.706989 3,4.571088 Z m 1.5496789,0 0,-14.857824 H 19.451841 v 14.857824 z m 1.999831,-1.537333 c 0,0.432049 0.3503886,0.785543 0.7786414,0.785543 h 9.3436967 c 0.428253,0 0.778642,-0.353494 0.778642,-0.785543 v -2.356632 c 0,-0.432049 -0.350389,-0.785544 -0.778642,-0.785544 l -9.3436967,0 c -0.4282528,0 -0.7786414,0.353495 -0.7786414,0.785544 z m 0,-5.498807 c 0,0.432049 0.3503886,0.785544 0.7786414,0.785544 l 9.3436967,0 c 0.428253,0 0.778642,-0.353495 0.778642,-0.785544 V 10.03614 c 0,-0.432049 -0.350389,-0.785543 -0.778642,-0.785543 l -9.3436967,0 c -0.4282528,0 -0.7786414,0.353494 -0.7786414,0.785543 z" />',
		'download': '<svg xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:cc="http://creativecommons.org/ns#" xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#" xmlns:svg="http://www.w3.org/2000/svg" xmlns="http://www.w3.org/2000/svg" xmlns:sodipodi="http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd" xmlns:inkscape="http://www.inkscape.org/namespaces/inkscape" version="1.1" id="Capa_1" x="0px" y="0px" width="18" height="18" viewBox="0 0 24 24" xml:space="preserve" sodipodi:docname="download11111.svg" inkscape:version="0.92.3(2405546, 2018-03-11)"><metadata id="metadata44"><rdf:RDF><cc:Work rdf:about=""><dc:format>image/svg+xml</dc:format><dc:type rdf:resource="http://purl.org/dc/dcmitype/StillImage" /><dc:title></dc:title></cc:Work></rdf:RDF></metadata><defs id="defs42" /><sodipodi:namedview pagecolor="#ffffff" bordercolor="#666666" borderopacity="1" objecttolerance="10" gridtolerance="10" guidetolerance="10" inkscape:pageopacity="0" inkscape:pageshadow="2" inkscape:window-width="1366" inkscape:window-height="706" id="namedview40" showgrid="false" inkscape:zoom="6.1592508" inkscape:cx="-15.061405" inkscape:cy="1.1743357" inkscape:window-x="-8" inkscape:window-y="-8" inkscape:window-maximized="1" inkscape:current-layer="Capa_1" /><g id="g135" transform="matrix(0.06722689,0,0,0.05536332,-2.5714288,-4.45e-6)"><g id="g78"><g id="file-download"><path id="path75" d="m 395.25,153 h -102 V 0 h -153 v 153 h -102 l 178.5,178.5 z m -357,229.5 v 51 h 357 v -51 z" inkscape:connector-curvature="0" /></g></g></g></svg>',
		'upload': '<svg xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:cc="http://creativecommons.org/ns#" xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#" xmlns:svg="http://www.w3.org/2000/svg" xmlns="http://www.w3.org/2000/svg" xmlns:sodipodi="http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd" xmlns:inkscape="http://www.inkscape.org/namespaces/inkscape" version="1.1" id="Capa_1" x="0px" y="0px" width="18" height="18" viewBox="0 0 24 24" xml:space="preserve" sodipodi:docname="upload-button.svg" inkscape:version="0.92.3 (2405546, 2018-03-11)"><metadata id="metadata44"><rdf:RDF><cc:Work rdf:about=""><dc:format>image/svg+xml</dc:format><dc:type rdf:resource="http://purl.org/dc/dcmitype/StillImage"/><dc:title /></cc:Work></rdf:RDF></metadata><defs id="defs42" /><sodipodi:namedview pagecolor="#ffffff" bordercolor="#666666" borderopacity="1" objecttolerance="10" gridtolerance="10"  guidetolerance="10" inkscape:pageopacity="0" inkscape:pageshadow="2" inkscape:window-width="1366" inkscape:window-height="706" id="namedview40" showgrid="false" inkscape:zoom="2.177624" inkscape:cx="-53.237791" inkscape:cy="29.341367" inkscape:window-x="-8" inkscape:window-y="-8" inkscape:window-maximized="1" inkscape:current-layer="Capa_1" /><g id="g73" transform="matrix(0.06722689,0,0,0.05536332,-2.5714288,-4.45e-6)"><g id="g15"><g   id="file-upload-8"><polygon id="polygon10" points="140.25,178.5 140.25,331.5 293.25,331.5 293.25,178.5 395.25,178.5 216.75,0 38.25,178.5 " /><rect id="rect12" height="51" width="357" y="382.5" x="38.25" /></g></g></g></svg>',

		'wb-opacity': '<path d="M3.55,18.54L4.96,19.95L6.76,18.16L5.34,16.74M11,22.45C11.32,22.45 13,22.45 13,22.45V19.5H11M12,5.5A6,6 0 0,0 6,11.5A6,6 0 0,0 12,17.5A6,6 0 0,0 18,11.5C18,8.18 15.31,5.5 12,5.5M20,12.5H23V10.5H20M17.24,18.16L19.04,19.95L20.45,18.54L18.66,16.74M20.45,4.46L19.04,3.05L17.24,4.84L18.66,6.26M13,0.55H11V3.5H13M4,10.5H1V12.5H4M6.76,4.84L4.96,3.05L3.55,4.46L5.34,6.26L6.76,4.84Z" />',
		'wb-vertical-boxes': '<path d="M4,21V3H8V21H4M10,21V3H14V21H10M16,21V3H20V21H16Z" />',
		'wb-horizontal-boxes': '<path d="M3,4H21V8H3V4M3,10H21V14H3V10M3,16H21V20H3V16Z" />',
		'wb-horizontal-arrows': '<path d="M12,18.17L8.83,15L7.42,16.41L12,21L16.59,16.41L15.17,15M12,5.83L15.17,9L16.58,7.59L12,3L7.41,7.59L8.83,9L12,5.83Z" />',
		'wb-vertical-arrows': '<path d="M18.17,12L15,8.83L16.41,7.41L21,12L16.41,16.58L15,15.17L18.17,12M5.83,12L9,15.17L7.59,16.59L3,12L7.59,7.42L9,8.83L5.83,12Z" />',
		'wb-direction':'<path d="M13,6V11H18V7.75L22.25,12L18,16.25V13H13V18H16.25L12,22.25L7.75,18H11V13H6V16.25L1.75,12L6,7.75V11H11V6H7.75L12,1.75L16.25,6H13Z" />',

		'list_tree': '<path d="m 3.0063556,9.3749998 2.3368645,-1.125 -2.3432204,-1.25 z M 11,13 H 21 V 11 H 11 Z m 0,4 H 21 V 15 H 11 Z M 6.9999997,6.9999998 v 2 H 21 v -2 z" />',

		'wb-object-video': wbIconServiceProvider.getShape('video_library'),
		'wb-object-audio':  wbIconServiceProvider.getShape('audiotrack'),
		'wb-object-data': wbIconServiceProvider.getShape('storage'),

		'wb-widget-group': wbIconServiceProvider.getShape('pages'),
		'wb-widget-html': wbIconServiceProvider.getShape('settings_ethernet'),
		'wb-widget-input': wbIconServiceProvider.getShape('settings_ethernet'),
		'wb-widget-textarea': wbIconServiceProvider.getShape('settings_ethernet'),
		'wb-widget-iframe': wbIconServiceProvider.getShape('settings_ethernet'),

		'wb-setting-iframe': wbIconServiceProvider.getShape('settings_ethernet'),
		'wb-setting-input': wbIconServiceProvider.getShape('settings_ethernet'),
		'wb-setting-textarea': wbIconServiceProvider.getShape('settings_ethernet'),
		/*
		 * Wifi
		 */
		'signal_wifi_0_bar': '<path fill-opacity=".3" d="M12.01 21.49L23.64 7c-.45-.34-4.93-4-11.64-4C5.28 3 .81 6.66.36 7l11.63 14.49.01.01.01-.01z"/>',
		'signal_wifi_1_bar': '<path fill-opacity=".3" d="M12.01 21.49L23.64 7c-.45-.34-4.93-4-11.64-4C5.28 3 .81 6.66.36 7l11.63 14.49.01.01.01-.01z"/><path d="M6.67 14.86L12 21.49v.01l.01-.01 5.33-6.63C17.06 14.65 15.03 13 12 13s-5.06 1.65-5.33 1.86z"/>',
		'signal_wifi_2_bar': '<path fill-opacity=".3" d="M12.01 21.49L23.64 7c-.45-.34-4.93-4-11.64-4C5.28 3 .81 6.66.36 7l11.63 14.49.01.01.01-.01z"/><path d="M4.79 12.52l7.2 8.98H12l.01-.01 7.2-8.98C18.85 12.24 16.1 10 12 10s-6.85 2.24-7.21 2.52z"/>',
		'signal_wifi_3_bar': '<path fill-opacity=".3" d="M12.01 21.49L23.64 7c-.45-.34-4.93-4-11.64-4C5.28 3 .81 6.66.36 7l11.63 14.49.01.01.01-.01z"/><path d="M3.53 10.95l8.46 10.54.01.01.01-.01 8.46-10.54C20.04 10.62 16.81 8 12 8c-4.81 0-8.04 2.62-8.47 2.95z"/>',
		'signal_cellular_connected_no_internet_0_bar': '<path fill-opacity=".3" d="M22 8V2L2 22h16V8z"/><path d="M20 22h2v-2h-2v2zm0-12v8h2v-8h-2z"/>',
		'signal_cellular_connected_no_internet_1_bar': '<path fill-opacity=".3" d="M22 8V2L2 22h16V8z"/><path d="M20 10v8h2v-8h-2zm-8 12V12L2 22h10zm8 0h2v-2h-2v2z"/>',
		'signal_cellular_connected_no_internet_2_bar': '<path fill-opacity=".3" d="M22 8V2L2 22h16V8z"/><path d="M14 22V10L2 22h12zm6-12v8h2v-8h-2zm0 12h2v-2h-2v2z"/>',
		'signal_cellular_connected_no_internet_3_bar': '<path fill-opacity=".3" d="M22 8V2L2 22h16V8z"/><path d="M17 22V7L2 22h15zm3-12v8h2v-8h-2zm0 12h2v-2h-2v2z"/>',
		'signal_cellular_0_bar': '<path fill-opacity=".3" d="M2 22h20V2z"/>',
		'signal_cellular_1_bar': '<path fill-opacity=".3" d="M2 22h20V2z"/><path d="M12 12L2 22h10z"/>',
		'signal_cellular_2_bar': '<path fill-opacity=".3" d="M2 22h20V2z"/><path d="M14 10L2 22h12z"/>',
		'signal_cellular_3_bar': '<path fill-opacity=".3" d="M2 22h20V2z"/><path d="M17 7L2 22h15z"/>',
		'now_wallpaper': '<path d="M4 4h7V2H4c-1.1 0-2 .9-2 2v7h2V4z"/><path d="M10 13l-4 5h12l-3-4-2.03 2.71L10 13z"/><path d="M17 8.5c0-.83-.67-1.5-1.5-1.5S14 7.67 14 8.5s.67 1.5 1.5 1.5S17 9.33 17 8.5z"/><path d="M20 2h-7v2h7v7h2V4c0-1.1-.9-2-2-2z"/><path d="M20 20h-7v2h7c1.1 0 2-.9 2-2v-7h-2v7z"/><path d="M4 13H2v7c0 1.1.9 2 2 2h7v-2H4v-7z"/>',
		'now_widgets': '<path d="M13 13v8h8v-8h-8z"/><path d="M3 21h8v-8H3v8z"/><path d="M3 3v8h8V3H3z"/><path d="M16.66 1.69L11 7.34 16.66 13l5.66-5.66-5.66-5.65z"/>',
		'battery_20': '<path d="M7 17v3.67C7 21.4 7.6 22 8.33 22h7.33c.74 0 1.34-.6 1.34-1.33V17H7z"/><path fill-opacity=".3" d="M17 5.33C17 4.6 16.4 4 15.67 4H14V2h-4v2H8.33C7.6 4 7 4.6 7 5.33V17h10V5.33z"/>',
		'battery_30': '<path fill-opacity=".3" d="M17 5.33C17 4.6 16.4 4 15.67 4H14V2h-4v2H8.33C7.6 4 7 4.6 7 5.33V15h10V5.33z"/><path d="M7 15v5.67C7 21.4 7.6 22 8.33 22h7.33c.74 0 1.34-.6 1.34-1.33V15H7z"/>',
		'battery_50': '<path fill-opacity=".3" d="M17 5.33C17 4.6 16.4 4 15.67 4H14V2h-4v2H8.33C7.6 4 7 4.6 7 5.33V13h10V5.33z"/><path d="M7 13v7.67C7 21.4 7.6 22 8.33 22h7.33c.74 0 1.34-.6 1.34-1.33V13H7z"/>',
		'battery_60': '<path fill-opacity=".3" d="M17 5.33C17 4.6 16.4 4 15.67 4H14V2h-4v2H8.33C7.6 4 7 4.6 7 5.33V11h10V5.33z"/><path d="M7 11v9.67C7 21.4 7.6 22 8.33 22h7.33c.74 0 1.34-.6 1.34-1.33V11H7z"/>',
		'battery_80': '<path fill-opacity=".3" d="M17 5.33C17 4.6 16.4 4 15.67 4H14V2h-4v2H8.33C7.6 4 7 4.6 7 5.33V9h10V5.33z"/><path d="M7 9v11.67C7 21.4 7.6 22 8.33 22h7.33c.74 0 1.34-.6 1.34-1.33V9H7z"/>',
		'battery_90': '<path fill-opacity=".3" d="M17 5.33C17 4.6 16.4 4 15.67 4H14V2h-4v2H8.33C7.6 4 7 4.6 7 5.33V8h10V5.33z"/><path d="M7 8v12.67C7 21.4 7.6 22 8.33 22h7.33c.74 0 1.34-.6 1.34-1.33V8H7z"/>',
		'battery_alert': '<path d="M15.67 4H14V2h-4v2H8.33C7.6 4 7 4.6 7 5.33v15.33C7 21.4 7.6 22 8.33 22h7.33c.74 0 1.34-.6 1.34-1.33V5.33C17 4.6 16.4 4 15.67 4zM13 18h-2v-2h2v2zm0-4h-2V9h2v5z"/>',
		'battery_charging_20': '<path d="M11 20v-3H7v3.67C7 21.4 7.6 22 8.33 22h7.33c.74 0 1.34-.6 1.34-1.33V17h-4.4L11 20z"/><path fill-opacity=".3" d="M15.67 4H14V2h-4v2H8.33C7.6 4 7 4.6 7 5.33V17h4v-2.5H9L13 7v5.5h2L12.6 17H17V5.33C17 4.6 16.4 4 15.67 4z"/>',
		'battery_charging_30': '<path fill-opacity=".3" d="M15.67 4H14V2h-4v2H8.33C7.6 4 7 4.6 7 5.33v9.17h2L13 7v5.5h2l-1.07 2H17V5.33C17 4.6 16.4 4 15.67 4z"/><path d="M11 20v-5.5H7v6.17C7 21.4 7.6 22 8.33 22h7.33c.74 0 1.34-.6 1.34-1.33V14.5h-3.07L11 20z"/>',
		'battery_charging_50': '<path d="M14.47 13.5L11 20v-5.5H9l.53-1H7v7.17C7 21.4 7.6 22 8.33 22h7.33c.74 0 1.34-.6 1.34-1.33V13.5h-2.53z"/><path fill-opacity=".3" d="M15.67 4H14V2h-4v2H8.33C7.6 4 7 4.6 7 5.33v8.17h2.53L13 7v5.5h2l-.53 1H17V5.33C17 4.6 16.4 4 15.67 4z"/>',
		'battery_charging_60': '<path fill-opacity=".3" d="M15.67 4H14V2h-4v2H8.33C7.6 4 7 4.6 7 5.33V11h3.87L13 7v4h4V5.33C17 4.6 16.4 4 15.67 4z"/><path d="M13 12.5h2L11 20v-5.5H9l1.87-3.5H7v9.67C7 21.4 7.6 22 8.33 22h7.33c.74 0 1.34-.6 1.34-1.33V11h-4v1.5z"/>',
		'battery_charging_80': '<path fill-opacity=".3" d="M15.67 4H14V2h-4v2H8.33C7.6 4 7 4.6 7 5.33V9h4.93L13 7v2h4V5.33C17 4.6 16.4 4 15.67 4z"/><path d="M13 12.5h2L11 20v-5.5H9L11.93 9H7v11.67C7 21.4 7.6 22 8.33 22h7.33c.74 0 1.34-.6 1.34-1.33V9h-4v3.5z"/>',
		'battery_charging_90': '<path fill-opacity=".3" d="M15.67 4H14V2h-4v2H8.33C7.6 4 7 4.6 7 5.33V8h5.47L13 7v1h4V5.33C17 4.6 16.4 4 15.67 4z"/><path d="M13 12.5h2L11 20v-5.5H9L12.47 8H7v12.67C7 21.4 7.6 22 8.33 22h7.33c.74 0 1.34-.6 1.34-1.33V8h-4v4.5z"/>',
		'account_child': '<circle cx="12" cy="13.49" r="1.5"/><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 2.5c1.24 0 2.25 1.01 2.25 2.25S13.24 9 12 9 9.75 7.99 9.75 6.75 10.76 4.5 12 4.5zm5 10.56v2.5c-.45.41-.96.77-1.5 1.05v-.68c0-.34-.17-.65-.46-.92-.65-.62-1.89-1.02-3.04-1.02-.96 0-1.96.28-2.65.73l-.17.12-.21.17c.78.47 1.63.72 2.54.82l1.33.15c.37.04.66.36.66.75 0 .29-.16.53-.4.66-.28.15-.64.09-.95.09-.35 0-.69-.01-1.03-.05-.5-.06-.99-.17-1.46-.33-.49-.16-.97-.38-1.42-.64-.22-.13-.44-.27-.65-.43l-.31-.24c-.04-.02-.28-.18-.28-.23v-4.28c0-1.58 2.63-2.78 5-2.78s5 1.2 5 2.78v1.78z"/>',
	});


});

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


angular.module('mblowfish-core').config(function($mdDateLocaleProvider) {
	// Change moment's locale so the 'L'-format is adjusted.
	// For example the 'L'-format is DD.MM.YYYY for German
	moment.locale('en');

	// Set month and week names for the general $mdDateLocale service
	var localeData = moment.localeData();
	$mdDateLocaleProvider.months = localeData._months;
	$mdDateLocaleProvider.shortMonths = moment.monthsShort();
	$mdDateLocaleProvider.days = localeData._weekdays;
	$mdDateLocaleProvider.shortDays = localeData._weekdaysMin;
	// Optionaly let the week start on the day as defined by moment's locale data
	$mdDateLocaleProvider.firstDayOfWeek = localeData._week.dow;

	// Format and parse dates based on moment's 'L'-format
	// 'L'-format may later be changed
	$mdDateLocaleProvider.parseDate = function(dateString) {
		var m = moment(dateString, 'L', true);
		return m.isValid() ? m.toDate() : new Date(NaN);
	};

	$mdDateLocaleProvider.formatDate = function(date) {
		var m = moment(date);
		return m.isValid() ? m.format('L') : '';
	};
});
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


angular.module('mblowfish-core')
/**
 * 
 */
.config(function($routeProvider, $locationProvider) {
    $routeProvider//

    // Preferences
    // /**
    //  * @ngdoc ngRoute
    //  * @name /initialization
    //  * @description Initial page
    //  */
    // .when('/initialization', {
    //     templateUrl : 'views/mb-initial.html',
    //     controller : 'MbInitialCtrl',
    //     controllerAs: 'ctrl',
    //     /*
    //      * @ngInject
    //      */
    //     protect : function($rootScope) {
    //         return !$rootScope.__account.permissions.tenant_owner;
    //     },
    //     sidenavs: [],
    //     toolbars: []
    // })
    /**
     * @ngdoc ngRoute
     * @name /preferences
     * @description preferences pages
     */
    .when('/preferences', {
        templateUrl : 'views/mb-preferences.html',
        controller : 'MbPreferencesCtrl',
        controllerAs: 'ctrl',
        helpId : 'preferences',
        /*
         * @ngInject
         */
        protect : function($rootScope) {
            return !$rootScope.__account.permissions.tenant_owner;
        }
    }) //
    /**
     * @ngdoc ngRoute
     * @name /preferences/:page
     * @description Preferences page
     * 
     * Display a preferences page to manage a part of settings. Here is list of
     * default pages: - google-analytic - brand - update - pageNotFound
     */
    .when('/preferences/:preferenceId', {
        templateUrl : 'views/mb-preference.html',
        controller : 'MbPreferenceCtrl',
        /*
         * @ngInject
         */
        helpId : function($routeParams) {
            return 'preferences-' + $routeParams.preferenceId;
        },
        /*
         * @ngInject
         */
        protect : function($rootScope) {
            return !$rootScope.__account.permissions.tenant_owner;
        }
    })

    // Users
    // Login
    .when('/users/login', {
        templateUrl : 'views/users/mb-login.html',
        controller : 'MbAccountCtrl',
        controllerAs: 'ctrl',
        sidenavs: [],
        toolbars: []
    })
    /**
     * @ngdoc ngRoute
     * @name /users/account
     * @description Details of the current account
     */
    .when('/users/account', {
        templateUrl : 'views/users/mb-account.html',
        controller : 'MbAccountCtrl',
        controllerAs: 'ctrl',
        protect: true,
        helpId: 'mb-account'
    })
    /**
     * @ngdoc ngRoute
     * @name /users/profile
     * @description Profile of the current account
     */
    .when('/users/profile', {
        templateUrl : 'views/users/mb-profile.html',
        controller : 'MbProfileCtrl',
        controllerAs: 'ctrl',
        protect: true,
        helpId: 'mb-profile'
    })
    /**
     * @ngdoc ngRoute
     * @name /users/password
     * @description Manage current password of the account
     * 
     * Change the password of the current account.
     */
    .when('/users/password', {
        templateUrl : 'views/users/mb-password.html',
        controller : 'MbAccountCtrl',
        controllerAs: 'ctrl',
        protect: true,
        helpId: 'mb-profile'
    })

    // Reset forgotten password
    .when('/users/reset-password', {
        templateUrl : 'views/users/mb-forgot-password.html',
        controller : 'MbAccountCtrl',
        controllerAs: 'ctrl',
        sidenavs: [],
        toolbars: []
    })//
    .when('/users/reset-password/token', {
        templateUrl : 'views/users/mb-recover-password.html',
        controller : 'MbAccountCtrl',
        controllerAs: 'ctrl',
        sidenavs: [],
        toolbars: []
    })//
    .when('/users/reset-password/token/:token', {
        templateUrl : 'views/users/mb-recover-password.html',
        controller : 'MbAccountCtrl',
        controllerAs: 'ctrl',
        sidenavs: [],
        toolbars: []
    })//
    ; //

    $locationProvider.html5Mode(true);
});

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


angular.module('mblowfish-core')
        /**
         * 
         */
        .config(function ($mdThemingProvider) {

            // AMD default palette
            $mdThemingProvider.definePalette('amdPrimaryPalette', {
                '50': '#FFFFFF',
                '100': 'rgb(255, 198, 197)',
                '200': '#E75753',
                '300': '#E75753',
                '400': '#E75753',
                '500': '#E75753',
                '600': '#E75753',
                '700': '#E75753',
                '800': '#E75753',
                '900': '#E75753',
                'A100': '#E75753',
                'A200': '#E75753',
                'A400': '#E75753',
                'A700': '#E75753'
            });

            // Dark theme
            $mdThemingProvider
                    .theme('dark')//
                    .primaryPalette('grey', {
                        'default': '900',
                        'hue-1': '700',
                        'hue-2': '600',
                        'hue-3': '500'
                    })//
                    .accentPalette('grey', {
                        'default': '700'
                    })//
                    .warnPalette('red')
                    .backgroundPalette('grey')

                    .dark();

            $mdThemingProvider.alwaysWatchTheme(true);
        });

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


/*
 * Add to angular
 */
angular.module('mblowfish-core')//

/**
 * @ngdoc Controllers
 * @name MbAbstractCtrl
 * @description Generic controller which is used as base in the platform
 * 
 */
.controller('MbAbstractCtrl', function($scope, $dispatcher, MbEvent) {
	

	this._hids = [];


	//--------------------------------------------------------
	// --Events--
	//--------------------------------------------------------
	var EventHandlerId = function(type, id, callback){
		this.type = type;
		this.id = id;
		this.callback = callback;
	};

	/**
	 * Add a callback for an specific type
	 * 
	 * @memberof MbAbstractCtrl
	 */
	this.addEventHandler = function(type, callback){
		var callbackId = $dispatcher.on(type, callback);
		this._hids.push(new EventHandlerId(type, callbackId, callback));
	};
	
	/**
	 * Remove a callback for an specific type
	 * 
	 * @memberof MbAbstractCtrl
	 */
	this.removeEventHandler = function(type, callback){
		// XXX: maso, 2019: remove handler
	};

	/**
	 * Fire an action is performed on items
	 * 
	 * Here is common list of action to dils with objects:
	 * 
	 * - created
	 * - read
	 * - updated
	 * - deleted
	 * 
	 * to fire an item is created:
	 * 
	 * this.fireEvent(type, 'created', item);
	 * 
	 * to fire items created:
	 * 
	 * this.fireEvent(type, 'created', item_1, item_2, .. , item_n);
	 * 
	 * to fire list of items created
	 * 
	 * var items = [];
	 * ...
	 * this.fireEvent(type, 'created', items);
	 * 
	 * @memberof MbAbstractCtrl
	 */
	this.fireEvent = function(type, action, items) {
		var values = angular.isArray(items) ? items : Array.prototype.slice.call(arguments, 2);
		var source = this;
		return $dispatcher.dispatch(type, new MbEvent({
			source: source,
			type: type,
			key: action,
			values: values
		}));
	};

	/**
	 * Fires items created
	 * 
	 * @see MbAbstractCtrl#fireEvent
	 * @memberof MbAbstractCtrl
	 */
	this.fireCreated = function(type, items){
		var values = angular.isArray(items) ? items : Array.prototype.slice.call(arguments, 1);
		return this.fireEvent(type, 'create', values);
	};

	/**
	 * Fires items read
	 * 
	 * @see MbAbstractCtrl#fireEvent
	 * @memberof MbAbstractCtrl
	 */
	this.fireRead = function(type, items){
		var values = angular.isArray(items) ? items : Array.prototype.slice.call(arguments, 1);
		return this.fireEvent(type, 'read', values);
	};

	/**
	 * Fires items updated
	 * 
	 * @see MbAbstractCtrl#fireEvent
	 * @memberof MbAbstractCtrl
	 */
	this.fireUpdated = function(type, items){
		var values = angular.isArray(items) ? items : Array.prototype.slice.call(arguments, 1);
		return this.fireEvent(type, 'update', values);
	};

	/**
	 * Fires items deleted
	 * 
	 * @see MbAbstractCtrl#fireEvent
	 * @memberof MbAbstractCtrl
	 */
	this.fireDeleted = function(type, items){
		var values = angular.isArray(items) ? items : Array.prototype.slice.call(arguments, 1);
		return this.fireEvent(type, 'delete', values);
	};


	//--------------------------------------------------------
	// --View--
	//--------------------------------------------------------
	/*
	 * Remove all resources
	 */
	var ctrl = this;
	$scope.$on('$destroy', function() {
		for(var i = 0; i < ctrl._hids.length; i++){
			var handlerId = ctrl._hids[i];
			$dispatcher.off(handlerId.type, handlerId.id);
		}
		ctrl._hids = [];
	});

});

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


angular.module('mblowfish-core')

/**
 * @ngdoc Controllers
 * @name MbAccountCtrl
 * @description Manages account of users.
 * 
 * Manages current user action:
 *  - login - logout - change password - recover password
 */
.controller('MbAccountCtrl', function($scope, $rootScope, $app, $translate, $window, $usr, $errorHandler) {

    this.loginProcess = false;
    this.loginState= null;
    this.logoutProcess= false;
    this.logoutState= null;
    this.changingPassword= false;
    this.changePassState= null;
    this.updatingAvatar= false;
    this.loadingUser= false;
    this.savingUser= false;
    
    /**
     * Call login process for current user
     * 
     * @memberof AmhUserAccountCtrl
     * @name login
     * @param {object}
     *            cridet username and password
     * @param {string}
     *            cridet.login username
     * @param {stirng}
     *            cridig.password Password
     * @returns {promiss} to do the login
     */
    this.login = function(cridet, form) {
        if(ctrl.loginProcess){
            return false;
        }
        ctrl.loginProcess= true;
        return $app.login(cridet)//
        .then(function(){
            ctrl.loginState = 'success';
            $scope.loginMessage = null;
        }, function(error){
            ctrl.loginState = 'fail';
            $scope.loginMessage = $errorHandler.handleError(error, form);
        })
        .finally(function(){
            ctrl.loginProcess = false;
        });
    }

    this.logout = function() {
        if(ctrl.logoutProcess){
            return false;
        }
        ctrl.logoutProcess= true;
        return $app.logout()//
        .then(function(){
            ctrl.logoutState = 'success';
        }, function(){
            ctrl.logoutState = 'fail';
        })
        .finally(function(){
            ctrl.logoutProcess = false;
        });
    }

    /**
     * Change password of the current user
     * 
     * @name load
     * @memberof MbAccountCtrl
     * @returns {promiss} to change password
     */
    this.changePassword = function(data, form) {
        if(ctrl.changingPassword){
            return;
        }
        ctrl.changingPassword = true;
        var param = {
                'old' : data.oldPass,
                'new' : data.newPass,
                'password': data.newPass
        };
// return $usr.resetPassword(param)//
        $usr.putCredential(param)
        .then(function(){
            $app.logout();
            ctrl.changePassState = 'success';
            $scope.changePassMessage = null;
            toast($translate.instant('Password is changed successfully. Login with new password.'));
        }, function(error){
            ctrl.changePassState = 'fail';
            $scope.changePassMessage = $errorHandler.handleError(error, form);
            alert($translate.instant('Failed to change the password.'));
        })//
        .finally(function(){
            ctrl.changingPassword = false;
        });
    }


    /**
     * Update avatar of the current user
     * 
     * @name load
     * @memberof MbAccountCtrl
     * @returns {promiss} to update avatar
     */
    this.updateAvatar = function(avatarFiles){
        // XXX: maso, 1395: reset avatar
        if(ctrl.updatingAvatar){
            return;
        }
        ctrl.updatingAvatar = true;
        return ctrl.user.uploadAvatar(avatarFiles[0].lfFile)//
        .then(function(){
            // TODO: hadi 1397-03-02: only reload avatar image by clear and set
            // (again) avatar address in view
            // clear address before upload and set it again after upload.
            $window.location.reload();
            toast($translate.instant('Your avatar updated successfully.'));
        }, function(){
            alert($translate.instant('Failed to update avatar'));
        })//
        .finally(function(){
            ctrl.updatingAvatar = false;
        });
    }

    this.back = function () {
        $window.history.back();
    }


    /**
     * Loads user data
     * 
     * @name load
     * @memberof MbAccountCtrl
     * @returns {promiss} to load user data
     */
    this.loadUser = function(){
        if(ctrl.loadingUser){
            return;
        }
        ctrl.loadingUser = true;
        return $usr.getAccount('current')//
        .then(function(user){
            ctrl.user = user;
        }, function(error){
            ctrl.error = error;
        })//
        .finally(function(){
            ctrl .loadingUser = false;
        });
    }


    /**
     * Save current user
     * 
     * @name load
     * @memberof MbAccountCtrl
     * @returns {promiss} to save
     */
    this.saveUser = function(form){
        if(ctrl.savingUser){
            return;
        }
        ctrl.savingUser = true;
        return ctrl.user.update()//
        .then(function(user){
            ctrl.user = user;
            $scope.saveUserMessage = null; 
            toast($translate.instant('Your information updated successfully.'));
        }, function(error){
            $scope.saveUserMessage = $errorHandler.handleError(error, form);
            alert($translate.instant('Failed to update.'));
        })//
        .finally(function(){
            ctrl.savingUser = false;
        });
    }

    // TODO: maso, 2017: getting from server
    // Account property descriptor
    $scope.apds = [ {
        key : 'first_name',
        title : 'First name',
        type : 'string'
    }, {
        key : 'last_name',
        title : 'Last name',
        type : 'string'
    }, {
        key : 'language',
        title : 'language',
        type : 'string'
    }, {
        key : 'timezone',
        title : 'timezone',
        type : 'string'
    } ];

    $scope.$watch(function(){
        return $rootScope.app.user;
    }, function(usrStruct){
        $scope.appUser = usrStruct;
    }, true);

    // support old systems
    var ctrl = this;
    $scope.login = function(cridet, form){
        ctrl.login(cridet, form);
    };
    $scope.logout = function(){
        ctrl.logout();
    };
    $scope.changePassword = function(){
        ctrl.changePassword();
    };
    $scope.updateAvatar = function(){
        ctrl.updateAvatar();
    };
    $scope.load = function(){
        ctrl.loadUser();
    };
    $scope.reload = function(){
        ctrl.loadUser();
    };
    $scope.saveUser = function(){
        ctrl.saveUser();
    };

    this.cancel = function(){
        ctrl.back();
    };

    this.loadUser();
});



//
//
//angular.module('mblowfish-core')
//
///**
// * @ngdoc Controllers
// * @name AmdDashboardCtrl
// * @description Dashboard
// * 
// */
//.controller('AmdDashboardCtrl', function($scope, /*$navigator,*/ $app) {
//    function toogleEditable(){
//        $scope.editable = !$scope.editable;
//    }
//
////    $navigator.scopePath($scope)//
////    .add({
////        title: 'Dashboard',
////        link: 'dashboard'
////    });
//
//    $app.scopeMenu($scope) //
//    .add({ // edit menu
//        priority : 15,
//        icon : 'edit',
//        label : 'Edit content',
//        tooltip : 'Toggle edit mode of the current contetn',
//        visible : function(){
//            return $scope.app.user.owner;
//        },
//        action : toogleEditable
//    });//
//
//});

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


angular.module('mblowfish-core')

/**
 * @ngdoc Controllers
 * @name MbHelpCtrl
 * @description Help page controller
 * 
 * Watches total system and update help data.
 * 
 */
.controller('MbHelpCtrl', function($scope, $rootScope, $route, $http, $translate, $help, $wbUtil) {
    $rootScope.showHelp = false;
    var lastLoaded;


    /**
     * load help content for the item
     * 
     * @name loadHelpContent
     * @memberof MbHelpCtrl
     * @params item {object} an item to display help for
     */
    function _loadHelpContent(item) {
        if($scope.helpLoading){
            // maso, 2018: cancle old loading
            return $scope.helpLoading;
        }
        var path = $help.getHelpPath(item);
        // load content
        if(path && path !== lastLoaded){
            $scope.helpLoading = $http.get(path) //
            .then(function(res) {
                $scope.helpContent = $wbUtil.clean(res.data);
                lastLoaded = path;
            })//
            .finally(function(){
                $scope.helpLoading = false;
            });
        }
        return $scope.helpLoading;
    }

    $scope.closeHelp = function(){
        $rootScope.showHelp = false;
    };

    /*
     * If user want to display help, content will be loaded.
     */
    $scope.$watch('showHelp', function(value){
        if(value) {
            return _loadHelpContent();
        }
    });

    /*
     * Watch for current item in help service
     */
    $scope.$watch(function(){
        return $help.currentItem();
    }, function() {
        if ($rootScope.showHelp) {
            _loadHelpContent();
        }
    });
});
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

angular.module('mblowfish-core')


/**
 * @ngdoc Controllers
 * @name MbThemesCtrl
 * @description Dashboard
 * 
 */
.controller('MbLanguageCtrl', function($scope, $app, $rootScope, $http, $language) {

	function init(){	
		$http.get('resources/languages.json')//
		.then(function(res){
			var data = res ? res.data : {};
			$scope.languages = data.languages;
//			$rootScope.app.config.languages = $scope.languages;
		})
//		$app.config('languages')//
//		.then(function(langs){
//			$scope.languages = langs;
//			return langs;
//		})//
//		.then(function(){
//			if(!$scope.languages){
//				$http.get('resources/languages.json')//
//				.then(function(res){
//					var data = res ? res.data : {};
//					$scope.languages = data.languages;
//					$rootScope.app.config.languages = $scope.languages;
//				});
//			}
//		})//
		.finally(function(){	
			var langKey =  $language.use();
			if($scope.languages){				
				for(var i=0 ; i<$scope.languages.length ; i++){				
					if($scope.languages[i].key === langKey){
						setLanguage($scope.languages[i]);
						return;
					}
				}
			}
		});
	}

	function setLanguage(lang){
		$scope.myLanguage = lang;
		// Load langauge
		$rootScope.app.config.languages = [];
		$rootScope.app.config.languages.push($scope.myLanguage);
		// Use langauge		
		$language.use($scope.myLanguage.key);
		// Set local
		$rootScope.app.config.local = $rootScope.app.config.local || {};
		if(!angular.isObject($rootScope.app.config.local)){
			$rootScope.app.config.local = {};
		}
		$rootScope.app.config.local.language = $scope.myLanguage.key;
		// if($scope.myLanguage.dir){
		// 	$rootScope.app.config.local.dir = $scope.myLanguage.dir;
		// }
	}

	$scope.setLanguage = setLanguage;

	init();
});

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

angular.module('mblowfish-core')


/**
 * @ngdoc Controllers
 * @name MbLocalCtrl
 * @description Controller to manage local settings
 * 
 */
.controller('MbLocalCtrl', function($scope, $language, $navigator) {

	function init(){		
		$language.languages()//
		.then(function(langs){
			$scope.languages = langs.items;
			return $scope.languages;
		});
	}

	$scope.goToManage = function(){
		// XXX: hadi, Following path exist in angular-material-home-language.
		// I think it should be moved to mblowfish or move multilanguage functionality to that module.
		$navigator.openPage('preferences/languages/manager');
	};
	
	$scope.languages = [];
	
	init();
});


angular.module('mblowfish-core')

/**
 * @ngdoc Controllers
 * @name AmdNavigatorDialogCtrl
 * @description # AccountCtrl Controller of the mblowfish-core
 */
.controller('AmdNavigatorDialogCtrl', function($scope, $mdDialog, config) {
	$scope.config = config;
	$scope.hide = function() {
		$mdDialog.cancel();
	};
	$scope.cancel = function() {
		$mdDialog.cancel();
	};
	$scope.answer = function(a) {
		$mdDialog.hide(a);
	};
});

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


angular.module('mblowfish-core')

/**
 * @ngdoc Controllers
 * @name AmdNavigatorCtrl
 * @description Navigator controller
 * 
 */
.controller('AmdNavigatorCtrl', function($scope, $navigator, $route) {


	// Get items from navigator
	function loadItems() {

		var _items = [];

		/* 
		 * Push navigation states
		 */
		angular.forEach($route.routes, function(config/*, route*/) {
			if (config.navigate) {
				// init conifg
				config.type = 'link';
				config.link = config.originalPath;
				config.title = config.title || config.name || 'no-name';
				config.priority = config.priority || 100;
				_items.push(config);
			}
		});
		
		angular.forEach($navigator.items(), function(item) {
			_items.push(item);
		});

		
		$scope.menuItems = {
				hiden : false,
				sections : []
		};
		// Sections
		var sections = [];
		angular.forEach(_items, function(item) {
			if (item.groups) {
				angular.forEach(item.groups, function(group) {
					var g = $navigator.group(group);
					if (!(g.id in sections)) {
						sections[g.id] = angular.extend({
							type : 'toggle',
							sections : []
						}, g);
						$scope.menuItems.sections.push(sections[g.id]);
					}
					sections[g.id].sections.push(item);
				});
			} else {
				$scope.menuItems.sections.push(item);
			}
		});
	}


	loadItems();

});
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

angular.module('mblowfish-core')

/**
 * @ngdoc Controllers
 * @name MbSettingsCtrl
 * @description Manages settings page
 * 
 * Manages settings pages.
 * 
 */
.controller('MbOptionsCtrl',function($scope, $options) {
	// Load settings.
	$options.pages()
	.then(function(pages){
		$scope.tabs = pages.items;
	});
});

///*
// * Copyright (c) 2015-2025 Phoinex Scholars Co. http://dpq.co.ir
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
//
//
//angular.module('mblowfish-core')
//
///**
// * @ngdoc Controllers
// * @name MbPasswordCtrl
// * @description Store user password
// * 
// * This controller is used to update password and email of the current account.
// * 
// */
//.controller('MbPasswordCtrl', function($scope, $usr, $location, $navigator, $routeParams, $window, $errorHandler) {
//
//    this.sendingToken = false;
//    this.sendTokenState = null;
//    this.changingPass = false;
//    this.changingPassState = null;
//
//    $scope.data = {};
//    $scope.data.token = $routeParams.token;
//
//    /**
//     * Send request to the server to recover new version
//     * 
//     */
//    this.sendToken = function(data, form) {
//        if(ctrl.sendingToken){
//            return false;
//        }
//        ctrl.sendingToken = true;
//        data.callback = $location.absUrl() + '/token/{{token}}';
//        return $usr.resetPassword(data)//
//        .then(function() {
//            ctrl.sendTokenState = 'success';
//            $scope.sendingTokenMessage = null;
//        }, function(error){
//            ctrl.sendTokenState = 'fail';
//            $scope.sendingTokenMessage = $errorHandler.handleError(error, form);
//        })//
//        .finally(function(){
//            ctrl.sendingToken = false;
//        });
//    }
//
//    /**
//     * Change password of the current user.
//     * 
//     */
//    this.changePassword = function(param, form) {
//        if(ctrl.changingPass){
//            return false;
//        }
//        ctrl.changingPass = true;
//        var data = {
//                'oldPass' : param.old,
//                'newPass' : param.newPass,
//                'token' : param.token,
//                'new' : param.password
//        };
//        return $usr.resetPassword(data)//
//        .then(function() {
//            ctrl.changePassState = 'success';
//            $scope.changePassMessage = null;
//            $navigator.openView('users/login');
//        }, function(error){
//            ctrl.changePassState = 'fail';
//            $scope.changePassMessage = $errorHandler.handleError(error, form);
//        })//
//        .finally(function(){
//            ctrl.changingPass = false;
//        });
//    }
//
//    this.back = function() {
//        $window.history.back();
//    }
//
//    /*
//     * Support old system
//     */
//    var ctrl = this;
//    $scope.sendToken = function(){
//        ctrl.sendToken();
//    };
//    $scope.changePassword = function(){
//        ctrl.changePassword();
//    };
//    $scope.cancel = function(){
//        ctrl.back();
//    };
//
//});
//

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

angular.module('mblowfish-core')

/**
 * @ngdoc Controllers
 * @name MbPreferenceCtrl
 * @description Show a preference page
 * 
 * Display preference view and load its controller.
 * 
 */
.controller('MbPreferenceCtrl', function($scope, $routeParams, $navigator, $preferences) {

	$preferences.page($routeParams.preferenceId)
	.then(function(preference) {
		$scope.preference = preference;
	}, function() {
		$navigator.openPage('preferences');
	});
	
	$scope.preferenceId = $routeParams.preferenceId;
});

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

angular.module('mblowfish-core')

/**
 * @ngdoc Controllers
 * @name MbPreferencesCtrl
 * @description Manages preferences page
 * 
 * In the preferences page, all configs of the system are displayed and
 * users are able to change them. These preferences pages are related to
 * the current SPA usually.
 * 
 */
.controller('MbPreferencesCtrl',function($scope, $preferences) {

	/**
	 * Open a preference page
	 * 
	 * @memberof MbPreferencesCtrl
	 */
	function openPreference(page) {
		$preferences.openPage(page);
	}

	// Load settings
	$preferences.pages()//
	.then(function(list) {
		$scope.preferenceTiles = [];
		$scope.pages = [];
		for (var i = 0; i < list.items.length; i++) {
			var page = list.items[i];
			if(!page.hidden){ // Filter hidden items
				$scope.preferenceTiles.push({
					colspan : 1,
					rowspan : 1,
					page : page
				});
				$scope.pages.push(page);
			}
		}
	});
	
	$scope.openPreference = openPreference;
});

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

angular.module('mblowfish-core')

/**
 * @ngdoc Controllers
 * @name MbProfileCtrl
 * @description Manages profile of a user
 *
 */
//TODO: maso, 2019: replace with MbSeenAccountCtrl
.controller('MbProfileCtrl', function ($scope, $rootScope, $translate, $window, UserProfile, $usr) {

    // set initial data
    this.user = null;
    this.profile = null;
    this.loadingProfile = false;
    this.savingProfile = false;

    /*
     * - normal
     * - edit
     */
    this.avatarState = 'normal';

    /**
     * Loads user data
     *
     * @returns
     */
    this.loadUser = function () {
        $usr.getAccount($rootScope.__account.id)
        .then(function(account){
            ctrl.user = account;
            return ctrl.loadProfile();
        });
    }

    this.loadProfile = function () {
        if (this.loadinProfile) {
            return;
        }
        this.loadingProfile = true;
        var ctrl = this;
        return this.user.getProfiles()//
        .then(function (profiles) {
            ctrl.profile = angular.isDefined(profiles.items[0]) ? profiles.items[0] : new UserProfile();
            return ctrl.profile;
        }, function () {
            alert($translate.instant('Fail to load profile.'));
        })//
        .finally(function () {
            ctrl.loadingProfile = false;
        });
    }

    /**
     * Save current user
     *
     * @returns
     */
    this.save = function () {
        if (this.savingProfile) {
            return;
        }
        this.savingProfile = true;
        var $promise = angular.isDefined(this.profile.id) ? this.profile.update() : this.user.putProfile(this.profile);
        var ctrl = this;
        return $promise//
        .then(function () {
            toast($translate.instant('Save is successfull.'));
        }, function () {
            alert($translate.instant('Fail to save item.'));
        })//
        .finally(function () {
            ctrl.savingProfile = false;
        });
    }

    this.back = function () {
        $window.history.back();
    }

    this.deleteAvatar = function () {
        var ctrl = this;
        confirm($translate.instant('Delete the avatar?'))
        .then(function () {
            ctrl.avatarState = 'working';
            return ctrl.user.deleteAvatar();
        })
        .finally(function () {
            ctrl.avatarState = 'normal';
        });
    }

    this.uploadAvatar = function (files) {
        if (!angular.isArray(files) || !files.length) {
        }
        var file = null;
        file = files[0].lfFile;
        this.avatarLoading = true;
        var ctrl = this;
        this.user.uploadAvatar(file)
        .then(function () {
            // TODO: reload the page
        })
        .finally(function () {
            ctrl.avatarLoading = false;
            ctrl.avatarState = 'normal';
        });
    }

    this.editAvatar = function () {
        this.avatarState = 'edit';
    }

    this.cancelEditAvatar = function () {
        this.avatarState = 'normal';
    }

    /*
     * To support old version of the controller
     */
    var ctrl = this;
    $scope.load = function () {
        ctrl.loadUser();
    };
    $scope.reload = function () {
        ctrl.loadUser();
    };
    $scope.save = function () {
        ctrl.save();
    };
    $scope.back = function () {
        ctrl.back();
    };
    $scope.cancel = function () {
        ctrl.back();
    };

    // Load account information
    this.loadUser();

    // re-labeling lf-ng-md-file component for multi languages support
    angular.element(function () {

        var elm = angular.element('.lf-ng-md-file-input-drag-text');
        if (elm[0]) {
            elm.text($translate.instant('Drag & Drop File Here'));
        }

        elm = angular.element('.lf-ng-md-file-input-button-brower');
        if (elm[0] && elm[0].childNodes[1] && elm[0].childNodes[1].data) {
            elm[0].childNodes[1].data=' '+$translate.instant('Browse');
        }

        elm = angular.element('.lf-ng-md-file-input-button-remove');
        if (elm[0] && elm[0].childNodes[1] && elm[0].childNodes[1].data) {
            elm[0].childNodes[1].data=$translate.instant('Remove');
        }

        elm = angular.element('.lf-ng-md-file-input-caption-text-default');
        if (elm[0]) {
            elm.text($translate.instant('Select File'));
        }

    });

});

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


/*
 * Add to angular
 */
angular.module('mblowfish-core')//

/**
 * @ngdoc Controllers
 * @name MbSeenAbstractBinaryItemCtrl
 * @description Generic controller of model binary of seen
 * 
 * There are three categories of actions;
 * 
 * - view
 * - model
 * - controller
 * 
 */
.controller('MbSeenAbstractBinaryItemCtrl', function($scope, $controller, $q, $navigator, $window, QueryParameter, Action) {
    

    /*
     * Extends collection controller from MbAbstractCtrl 
     */
    angular.extend(this, $controller('MbSeenAbstractItemCtrl', {
        $scope : $scope
    }));

	// Messages
    var DELETE_MODEL_BINARY_MESSAGE = 'Delete binary content?';
	var IMPLEMENT_BY_CHILDREN_ERROR = 'This method must be override in clild class';

	// -------------------------------------------------------------------------
	// Model
	//
	// We suppose that all model action be override by the new controllers.
	//
	//
	//
	//
	// -------------------------------------------------------------------------
	/**
	 * Deletes model binary
	 * 
	 * @param item
	 * @return promise to delete item
	 * @memberof SeenAbstractItemCtrl
	 */
	this.deleteModelBinary = function(item){
		return $q.reject(IMPLEMENT_BY_CHILDREN_ERROR);
	};
	
	/**
	 * Upload model binary
	 * 
	 * @param item
	 * @return promise to delete item
	 * @memberof SeenAbstractItemCtrl
	 */
	this.uploadModelBinary = function(item){
		return $q.reject(IMPLEMENT_BY_CHILDREN_ERROR);
	};
	
	/**
	 * Get model binary path
	 * 
	 * @param item
	 * @return promise to delete item
	 * @memberof SeenAbstractItemCtrl
	 */
	this.getModelBinaryUrl = function(item){
		return $q.reject(IMPLEMENT_BY_CHILDREN_ERROR);
	};
	
	
    
    // -------------------------------------------------------------------------
    // View
    //
    //
    //
    //
    //
    //
    // -------------------------------------------------------------------------
    this.itemUrl;

    /**
     * Sets itemUrl to view
     * 
     * @memberof SeenAbstractBinaryItemCtrl
     */
    this.setItemUrl = function(itemUrl) {
        this.itemUrl = itemUrl;
    };
    
    /**
     * Get view itemUrl
     * 
     * @memberof SeenAbstractBinaryItemCtrl
     */
    this.getItemUrl = function(){
    	return this.itemUrl;
    };

    /**
     * Deletes item binary file
     * 
     * @memberof SeenAbstractBinaryItemCtrl
     */
    this.deleteItemBinary = function(){
    	// prevent default event
		if($event){
			$event.preventDefault();
			$event.stopPropagation();
		}

		// update state
		var ctrl = this;
		var item = this.getItem();
		function _deleteInternal() {
			ctrl.busy = true;
			return ctrl.getModelBinaryUrl(item)
			.then(function(){
				ctrl.fireDeleted(ctrl.getModelBinaryUrl(item), item);
			}, function(){
				// XXX: maso, 2019: handle error
			})
			.finally(function(){
				ctrl.busy = false;
			});
		}
		
		// TODO: maso, 2018: get current promise
		// delete the item
		if(this.isConfirmationRequired()){
			$window.confirm(DELETE_MODEL_BINARY_MESSAGE)
			.then(function(){
				return _deleteInternal();
			});
		} else {
			return _deleteInternal();
		}
    };

    /*
     * Extends init method
     */
    this.supperInit = this.init;
    this.init = function(config){
		var ctrl = this;
		if(!angular.isDefined(configs)){
			return;
		}
		this.setItemUrl(config.url);
		this.supperInit(config);
    };
    
});

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


/*
 * Add to angular
 */
angular.module('mblowfish-core')//

/**
 * @ngdoc Controllers
 * @name MbSeenAbstractCollectionCtrl
 * @description Generic controller of model collection of seen
 * 
 * This controller is used manages a collection of a virtual items. it is the
 * base of all other collection controllers such as accounts, groups, etc.
 * 
 * There are two types of function in the controller: view and data related. All
 * data functions are considered to be override by extensions.
 * 
 * There are three categories of actions;
 * 
 * - view
 * - model
 * - controller
 * 
 * view actions are about to update view. For example adding an item into the view
 * or remove deleted item.
 * 
 * Model actions deal with model in the repository. These are equivalent to the view
 * actions but removes items from the storage.
 * 
 * However, controller function provide an interactive action to the user to performs
 * an action.
 * 
 * ## Add
 * 
 * - addItem: controller
 * - addModel: model
 * - addViewItem: view
 */
.controller('MbSeenAbstractCollectionCtrl', function($scope, $controller, $q, $navigator, $window, QueryParameter, Action) {
    

    /*
     * Extends collection controller from MbAbstractCtrl 
     */
    angular.extend(this, $controller('MbSeenGeneralAbstractCollectionCtrl', {
        $scope : $scope
    }));

    /*
     * util function
     */
    function differenceBy (source, filters, key) {
        var result = source;
        for(var i = 0; i < filters.length; i++){
            result = _.remove(result, function(item){
                return item[key] !== filters[i][key];
            });
        }
        return result;
    };

    var STATE_INIT = 'init';
    var STATE_BUSY = 'busy';
    var STATE_IDEAL = 'ideal';
    this.state = STATE_IDEAL;


    // Messages
    var ADD_ACTION_FAIL_MESSAGE = 'Fail to add new item';
    var DELETE_MODEL_MESSAGE = 'Delete item?';

    this.actions = [];


    /**
     * State of the controller
     * 
     * Controller may be in several state in the lifecycle. The state of the
     * controller will be stored in this variable.
     * 
     * <ul>
     * <li>init: the controller is not ready</li>
     * <li>busy: controller is busy to do something (e. loading list of data)</li>
     * <li>ideal: controller is ideal and wait for user </li>
     * </ul>
     * 
     * @type string
     * @memberof MbSeenAbstractCollectionCtrl
     */
    this.state = STATE_INIT;

    /**
     * Store last paginated response
     * 
     * This is a collection controller and suppose the result of query to be a
     * valid paginated collection. The last response from data layer will be
     * stored in this variable.
     * 
     * @type PaginatedCollection
     * @memberof MbSeenAbstractCollectionCtrl
     */
    this.lastResponse = null;

    /**
     * Query parameter
     * 
     * This is the query parameter which is used to query items from the data
     * layer.
     * 
     * @type QueryParameter
     * @memberof MbSeenAbstractCollectionCtrl
     */
    this.queryParameter = new QueryParameter();
    this.queryParameter.setOrder('id', 'd');

    // -------------------------------------------------------------------------
    // View
    //
    //
    //
    //
    //
    //
    // -------------------------------------------------------------------------
    /**
     * List of all loaded items
     * 
     * All loaded items will be stored into this variable for later usage. This
     * is related to view.
     * 
     * @type array
     * @memberof MbSeenAbstractCollectionCtrl
     */
    this.items = [];

    /**
     * Adds items to view
     * 
     * @memberof MbSeenAbstractCollectionCtrl
     */
    this.pushViewItems = function(items) {
        if(!angular.isDefined(items)){
            return;
        }
        // Push new items
        var deff = differenceBy(items, this.items, 'id');
        // TODO: maso, 2019: The current version (V3.x) of lodash dose not support concat
        // update the following part in the next version.
        // this.items = _.concat(items, deff);
        for(var i = 0; i < deff.length; i++){
            this.items.push(deff[i]);
        }
    };

    /**
     * Adds items to view
     * 
     * @memberof MbSeenAbstractCollectionCtrl
     */
    this.addViewItems = this.pushViewItems;

    /**
     * remove item from view
     * 
     * @memberof MbSeenAbstractCollectionCtrl
     */
    this.removeViewItems = function(items) {
        this.items = differenceBy(this.items, items, 'id');
    };

    /**
     * Updates an item in the view with the given one
     * 
     * @memberof MbSeenAbstractCollectionCtrl
     */
    this.updateViewItems = function(items) {
        // XXX: maso, 2019: update view items
    };

    /**
     * Returns list of all items in the view
     * 
     * NOTE: this is the main storage of the controller.
     * 
     * @memberof MbSeenAbstractCollectionCtrl
     */
    this.getViewItems = function(){
        return this.items;
    };

    /**
     * Removes all items from view
     * 
     * @memberof MbSeenAbstractCollectionCtrl
     */
    this.clearViewItems = function(){
        this.items = [];
    };


    // -------------------------------------------------------------------------
    // Model
    //
    // We suppose that all model action be overid by the new controllers.
    //
    //
    //
    //
    // -------------------------------------------------------------------------
    /**
     * Deletes model
     * 
     * @memberof SeenAbstractCollectionCtrl
     * @param item
     * @return promiss to delete item
     */
//  this.deleteModel = function(item){};

    /**
     * Gets object schema
     * 
     * @memberof SeenAbstractCollectionCtrl
     * @return promise to get schema
     */
//  this.getModelSchema = function(){};

    /**
     * Query and get items
     * 
     * @param queryParameter to apply search
     * @return promiss to get items
     */
//  this.getModels = function(queryParameter){};

    /**
     * Get item with id
     * 
     * @param id of the item
     * @return promiss to get item
     */
//  this.getModel = function(id){};

    /**
     * Adds new item
     * 
     * This is default implementation of the data access function. Controllers
     * are supposed to override the function
     * 
     * @memberof SeenAbstractCollectionCtrl
     * @return promiss to add and return an item
     */
//  this.addModel = function(model){};



    // -------------------------------------------------------------------------
    // Controller
    //
    //
    //
    //
    //
    //
    //
    // -------------------------------------------------------------------------

    /**
     * Creates new item with the createItemDialog
     * 
     * XXX: maso, 2019: handle state machine
     */
    this.addItem = function(){
        var ctrl = this;
        $navigator.openDialog({
            templateUrl: this._addDialog,
            config: {
                model:{}
            }
        })//
        .then(function(model){
            return ctrl.addModel(model);
        })//
        .then(function(item){
            ctrl.fireCreated(ctrl.eventType, item);
        }, function(){
            $window.alert(ADD_ACTION_FAIL_MESSAGE);
        });
    };

    /**
     * Creates new item with the createItemDialog
     */
    this.deleteItem = function(item, $event){
        // prevent default evetn
        if($event){
            $event.preventDefault();
            $event.stopPropagation();
        }
        // XXX: maso, 2019: update state
        var ctrl = this;
        var tempItem = _.clone(item);
        function _deleteInternal() {
            return ctrl.deleteModel(item)
            .then(function(){
                ctrl.fireDeleted(ctrl.eventType, tempItem);
            }, function(){
                // XXX: maso, 2019: handle error
            });
        }
        // delete the item
        if(this.deleteConfirm){
            $window.confirm(DELETE_MODEL_MESSAGE)
            .then(function(){
                return _deleteInternal();
            });
        } else {
            return _deleteInternal();
        }
    };

    /**
     * Reload the controller
     * 
     * Remove all old items and reload the controller state. If the controller
     * is in progress, then cancel the old promiss and start the new job.
     * 
     * @memberof SeenAbstractCollectionCtrl
     * @returns promiss to reload
     */
    this.reload = function(){
        // safe reload
        var ctrl = this;
        function safeReload(){
            delete ctrl.lastResponse;
            ctrl.clearViewItems();
            ctrl.queryParameter.setPage(1);
            return ctrl.loadNextPage();
        }

        // check states
        if(this.isBusy()){
            return this.getLastQeury()
            .then(safeReload);
        }
        return safeReload();
    };



    /**
     * Loads next page
     * 
     * Load next page and add to the current items.
     * 
     * @memberof SeenAbstractCollectionCtrl
     * @returns promiss to load next page
     */
    this.loadNextPage = function() {
        // Check functions
        if(!angular.isFunction(this.getModels)){
            throw 'The controller does not implement getModels function';
        }

        if (this.state === STATE_INIT) {
            throw 'this.init() function is not called in the controller';
        }

        // check state
        if (this.state !== STATE_IDEAL) {
            if(this.lastQuery){
                return this.lastQuery;
            }
            throw 'Models controller is not in ideal state';
        }

        // set next page
        if (this.lastResponse) {
            if(!this.lastResponse.hasMore()){
                return $q.resolve();
            }
            this.queryParameter.setPage(this.lastResponse.getNextPageIndex());
        }

        // Get new items
        this.state = STATE_BUSY;
        var ctrl = this;
        this.lastQuery = this.getModels(this.queryParameter)//
        .then(function(response) {
            ctrl.lastResponse = response;
            ctrl.addViewItems(response.items);
            // XXX: maso, 2019: handle error
            ctrl.error = null;
        }, function(error){
            ctrl.error = error;
        })//
        .finally(function(){
            ctrl.state = STATE_IDEAL;
            delete ctrl.lastQuery;
        });
        return this.lastQuery;
    };



    this.seen_abstract_collection_superInit = this.init;

    /**
     * Loads and init the controller
     * 
     * All children must call this function at the end of the cycle
     */
    this.init = function(configs){
        if(angular.isFunction(this.seen_abstract_collection_superInit)){
            this.seen_abstract_collection_superInit(configs);
        }
        var ctrl = this;
        this.state = STATE_IDEAL;
        if(!angular.isDefined(configs)){
            return;
        }

        // add actions
        if(angular.isArray(configs.actions)){
            this.addActions(configs.actions)
        }

        // DEPRECATED: enable create action
        if(configs.addAction && angular.isFunction(this.addItem)){
            var temp = configs.addAction;
            var createAction = {
                    title: temp.title || 'New item',
                    icon: temp.icocn || 'add',
                    action: temp.action,
            };
            if(!angular.isFunction(temp.action) && temp.dialog) {
                this._addDialog = temp.dialog;
                createAction.action = function(){
                    ctrl.addItem();
                };
            }
            if(angular.isFunction(createAction.action)) {
                this.addAction(createAction);
            }
        }

        // add path
        this._setEventType(configs.eventType);

        // confirm delete
        this.deleteConfirm = !angular.isDefined(configs.deleteConfirm) || configs.deleteConfirm;
    };

    /**
     * Returns last executed query
     */
    this.getLastQeury = function(){
        return this.lastQuery;
    };


    /**
     * Set a GraphQl format of data
     * 
     * By setting this the controller is not sync and you have to reload the
     * controller. It is better to set the data query at the start time.
     * 
     * @memberof SeenAbstractCollectionCtrl
     * @param graphql
     */
    this.setDataQuery = function(grqphql){
        this.queryParameter.put('graphql', '{page_number, current_page, items'+grqphql+'}');
        // TODO: maso, 2018: check if refresh is required
    };

    /**
     * Adding custom filter
     * 
     * Filters are used to select special types of the items.
     * 
     * @memberof SeenAbstractCollectionCtrl
     * @param key of the filter
     * @param value of the filter
     */
    this.addFilter = function(key, value){
        this.queryParameter.setFilter(key, value);
    };

    /**
     * Load controller actions
     * 
     * @return list of actions
     */
    this.getActions = function(){
        return this.actions;
    };

    /**
     * Adds new action into the controller
     * 
     * @param action to add to list
     */
    this.addAction = function(action) {
        if(!angular.isDefined(this.actions)){
            this.actions = [];
        }
        // TODO: maso, 2018: assert the action is MbAction
        if(!(action instanceof Action)){
            action = new Action(action);
        }
        this.actions.push(action);
        return this;
    };

    /**
     * Adds list of actions to the controller
     * 
     * @memberof SeenAbstractCollectionCtrl
     * @params array of actions
     */
    this.addActions = function(actions) {
        for(var i = 0; i < actions.length; i++){
            this.addAction(actions[i]);
        }
    };

    /**
     * Gets the query parameter
     * 
     * NOTE: if you change the query parameter then you are responsible to
     * call reload the controller too.
     * 
     * @memberof SeenAbstractCollectionCtrl
     * @returns QueryParameter
     */
    this.getQueryParameter = function(){
        return this.queryParameter;
    };

    /**
     * Checks if the state is busy
     * 
     * @memberof SeenAbstractCollectionCtrl
     * @returns true if the state is ideal
     */
    this.isBusy = function(){
        return this.state === STATE_BUSY;
    };

    /**
     * Checks if the state is ideal
     * 
     * @memberof SeenAbstractCollectionCtrl
     * @returns true if the state is ideal
     */
    this.isIdeal = function(){
        return this.state === STATE_IDEAL;
    };

    /**
     * Generate default event handler
     * 
     * If you are about to handle event with a custom function, please
     * overrid this function.
     * 
     * @memberof SeenAbstractCollectionCtrl
     */
    this.eventHandlerCallBack = function(){
        if(this._eventHandlerCallBack){
            return this._eventHandlerCallBack ;
        }
        var ctrl = this;
        this._eventHandlerCallBack = function($event){
            switch ($event.key) {
            case 'create':
                ctrl.pushViewItems($event.values);
                break;
            case 'update':
                ctrl.updateViewItems($event.values);
                break;
            case 'delete':
                ctrl.removeViewItems($event.values);
                break;
            default:
                break;
            }
        };
        return this._eventHandlerCallBack;
    };

    /*
     * Listen to dispatcher for new event
     */
    this._setEventType = function(eventType) {
        if(this.eventType === eventType){
            return;
        }
        var callback = this.eventHandlerCallBack();
        if(this.eventType){
            this.removeEventHandler(callback);
        }
        this.eventType = eventType;
        this.addEventHandler(this.eventType, callback);
    };

});

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


/*
 * Add to angular
 */
angular.module('mblowfish-core')//

/**
 * @ngdoc Controllers
 * @name MbSeenAbstractItemCtrl
 * @description Generic controller of item of seen
 * 
 * There are three categories of actions;
 * 
 * - view
 * - model
 * - controller
 * 
 */
.controller('MbSeenAbstractItemCtrl', function(
	/* AngularJS  */ $scope, $controller, $q, $window, 
	/* MBlowfish  */ $navigator, QueryParameter, Action,
	/* ngRoute    */ $routeParams) {
	

	/*
	 * Extends collection controller from MbAbstractCtrl 
	 */
	angular.extend(this, $controller('MbSeenGeneralAbstractCollectionCtrl', {
		$scope : $scope
	}));


	// Messages
	var DELETE_MODEL_MESSAGE = 'Delete the item?';
	var Load_ACTION_FAIL_MESSAGE = 'Fail to load item';
	var IMPLEMENT_BY_CHILDREN_ERROR = 'This method must be override in clild class';

	/*
	 * Extra actions
	 */
	this.actions = [];

	/**
	 * Is true if the controller is busy
	 * 
	 * @type boolean
	 * @memberof SeenAbstractItemCtrl
	 */
	this.busy = false;

	/**
	 * Is true if the controller is dirty
	 * 
	 * The controller is dirty if and only if a property of the item is changed by 
	 * the view.
	 * 
	 * @type boolean
	 * @memberof SeenAbstractItemCtrl
	 */
	this.dirty = false;

	// -------------------------------------------------------------------------
	// Model
	//
	// We suppose that all model action be override by the new controllers.
	//
	//
	//
	//
	// -------------------------------------------------------------------------
	/**
	 * Deletes model
	 * 
	 * @param item
	 * @return promiss to delete item
	 * @memberof SeenAbstractItemCtrl
	 */
	this.deleteModel = function(item){
		return $q.reject(IMPLEMENT_BY_CHILDREN_ERROR);
	};

	/**
	 * Gets item schema
	 * 
	 * @return promise to get schema
	 * @memberof SeenAbstractItemCtrl
	 */
	this.getModelSchema = function(){
		return $q.reject(IMPLEMENT_BY_CHILDREN_ERROR);
	};

	/**
	 * Query and get items
	 * 
	 * @param queryParameter to apply search
	 * @return promiss to get items
	 * @memberof SeenAbstractItemCtrl
	 */
	this.getModel = function(id){
		return $q.reject(IMPLEMENT_BY_CHILDREN_ERROR);
	};

	/**
	 * Update current model
	 * 
	 * @memberof SeenAbstractItemCtrl
	 * @return promiss to add and return an item
	 */
	this.updateModel = function(model){
		return $q.reject(IMPLEMENT_BY_CHILDREN_ERROR);
	};


	// -------------------------------------------------------------------------
	// View
	//
	//
	//
	//
	//
	//
	// -------------------------------------------------------------------------
	/**
	 * Current item 
	 * 
	 * @type Object
	 * @memberof SeenAbstractItemCtrl
	 */
	this.item;

	/**
	 * Sets item to view
	 * 
	 * @memberof SeenAbstractItemCtrl
	 */
	this.setItem = function(item) {
		this.item = item;
	};

	/**
	 * Get view item
	 * 
	 * @memberof SeenAbstractItemCtrl
	 */
	this.getItem = function(){
		return this.item;
	}

	/**
	 * Gets id of the view item
	 * 
	 * @memberof SeenAbstractItemCtrl
	 */
	this.getItemId = function(){
		return this.itemId;
	}

	/**
	 * Sets id of the view item
	 * 
	 * @memberof SeenAbstractItemCtrl
	 */
	this.setItemId = function(itemId){
		this.itemId = itemId;
	}

	this.loadItem = function(){
		var ctrl = this;
		var job = this.getModel(this.itemId)
		.then(function(item){
			ctrl.setItem(item);
		},function(error){
			$window.alert('Fail to load the item '+ ctrl.itemId);
		});
		// TODO: maso, 2020: add application job
		// $app.addJob('Loading itm' + this.itemId, job);
		return job;
	}

	this.setLastPromis = function(p){
		this.__lastPromis = p;
	}

	this.getLastPromis = function(){
		return this.__lastPromis;
	}

	/**
	 * Checks if the state of the controller is busy
	 * 
	 * @return {boolean} true if the controller is busy
	 * @memberof SeenAbstractItemCtrl
	 */
	this.isBusy = function() {
		return this.busy;
	}

	/**
	 * Checks if the state of the controller is dirty
	 * 
	 * @return {boolean} true if the controller is dirty
	 * @memberof SeenAbstractItemCtrl
	 */
	this.dirty = function(){
		return this.dirty;
	}

	/**
	 * Check if confirmation is required for critical tasks
	 * 
	 * @return {boolean} true if the confirmation is required
	 * @memberof SeenAbstractItemCtrl
	 */
	this.isConfirmationRequired = function(){
		return this.confirmationRequired;
	}

	/**
	 * Set confirmation
	 * 
	 * @params confirmationRequired {boolean}
	 * @memberof SeenAbstractItemCtrl
	 */
	this.setConfirmationRequired = function(confirmationRequired){
		this.confirmationRequired = confirmationRequired;
	}

	this.updateItem = function($event){
		// prevent default event
		if($event){
			$event.preventDefault();
			$event.stopPropagation();
		}

		// XXX: maso, 2019: update state
		var ctrl = this;

		var job = this.updateModel(ctrl.item);
		// TODO: maso, 2020: add job tos list
		return job;
	}

	/**
	 * Creates new item with the createItemDialog
	 */
	this.deleteItem = function($event){
		// prevent default event
		if($event){
			$event.preventDefault();
			$event.stopPropagation();
		}

		// XXX: maso, 2019: update state
		var ctrl = this;
		// var tempItem = _.clone(item);
		function _deleteInternal() {
			ctrl.busy = true;
			return ctrl.deleteModel(ctrl.item)
			.then(function(){
				ctrl.fireDeleted(ctrl.eventType, tempItem);
			}, function(){
				// XXX: maso, 2019: handle error
			})
			.finally(function(){
				ctrl.busy = false;
			});
		}
		// delete the item
		if(this.isConfirmationRequired()){
			$window.confirm(DELETE_MODEL_MESSAGE)
			.then(function(){
				return _deleteInternal();
			});
		} else {
			return _deleteInternal();
		}
	};

	/**
	 * Reload the controller
	 * 
	 * 
	 * @memberof SeenAbstractItemCtrl
	 * @returns promise to reload
	 */
	this.reload = function(){
		// safe reload
		var ctrl = this;
		function safeReload(){
			ctrl.setItem(null);
			return ctrl.loadItem(ctrl.getItemId());
		}

		// attache to old promise
		if(this.isBusy()){
			return this.getLastPromis()
			.then(safeReload);
		}
		
		// create new promise
		var promise = safeReload();
		this.setLastPromis(promise);
		return promise;
	};

	/**
	 * Set a GraphQl format of data
	 * 
	 * By setting this the controller is not sync and you have to reload the
	 * controller. It is better to set the data query at the start time.
	 * 
	 * @memberof SeenAbstractItemCtrl
	 * @param graphql
	 */
	this.setDataQuery = function(grqphql){
		this.queryParameter.put('graphql', grqphql);
		// TODO: maso, 2018: check if refresh is required
	};

	/**
	 * Generate default event handler
	 * 
	 * If you are about to handle event with a custom function, please
	 * override this function.
	 * 
	 * @memberof SeenAbstractItemCtrl
	 */
	this.eventHandlerCallBack = function(){
		if(this._eventHandlerCallBack){
			return this._eventHandlerCallBack ;
		}
		var ctrl = this;
		this._eventHandlerCallBack = function($event){
			switch ($event.key) {
			case 'updated':
				ctrl.updateViewItems($event.values);
				break;
			case 'removed':
				ctrl.removeViewItems($event.values);
				break;
			default:
				break;
			}
		};
		return this._eventHandlerCallBack;
	};

	/**
	 * Sets controller event type
	 * 
	 * @memberof SeenAbstractItemCtrl
	 */
	this.setEventType = function(eventType) {
		if(this.eventType === eventType){
			return;
		}
		var callback = this.eventHandlerCallBack();
		if(this.eventType){
			this.removeEventHandler(callback);
		}
		this.eventType = eventType;
		this.addEventHandler(this.eventType, callback);
	};
	
	
	this.seen_abstract_item_supperInit = this.init;
	/**
	 * Loads and init the controller
	 * 
	 * NOTE: All children must call this function at the end of the cycle
	 * 
	 * Properties:
	 * 
	 * - confirmation: show confirmation dialog
	 * - eventType: type of the events
	 * - dataQuery: a query to data
	 * - modelId:
	 * - model
	 * 
	 * @memberof SeenAbstractItemCtrl
	 */
	this.init = function(configs){
	    if(this.seen_abstract_item_supperInit){
		this.seen_abstract_item_supperInit(configs);
	    }
		var ctrl = this;
		if(!angular.isDefined(configs)){
			return;
		}

		// add path
		this.setEventType(configs.eventType);

		// confirm delete
		this.setConfirmationRequired(!angular.isDefined(configs.confirmation) || configs.confirmation);
		
		// data query
		if(configs.dataQuery) {
			this.setDataQuery(config.dataQuery);
		}
		
		// model id
		this.setItemId(configs.modelId || $routeParams.itemId);
		
		// Modl
		if(configs.model){
			// TODO: load model
		}

		this.reload();
	};

});

/* 
 * The MIT License (MIT)
 * 
 * Copyright (c) 2016 weburger
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

angular.module('mblowfish-core')
/*
 * 
 */
.controller('MbSeenCmsContentsCtrl',function ($scope, $cms, $q, $controller) {

    /*
     * Extends collection controller
     */
    angular.extend(this, $controller('MbSeenAbstractCollectionCtrl', {
        $scope : $scope
    }));

    // Override the schema function
    this.getModelSchema = function () {
        return $cms.contentSchema();
    };

    // get contents
    this.getModels = function (parameterQuery) {
        return $cms.getContents(parameterQuery);
    };

    // get a content
    this.getModel = function (id) {
        return $cms.getContent(id);
    };

    // delete account
    this.deleteModel = function (content) {
        return $cms.deleteContent(content.id);
    };

    /**
     * Uploads a file on the server.
     * 
     * To upload the file there are two actions:
     * 
     * <ul>
     * <li>create a new content</li>
     * <li>upload content value</li>
     * </ul>
     * 
     * This function change the state of the controller into the
     * working.
     */
    this.uploadFile = function (content, file) {
        /*
         * upload file
         */
        function uploadContentValue(newContent) {
            if (file) {
                return newContent.uploadValue(file)//
                .then(function () {
                    return newContent;
                });
            }
            return $q.resolve(newContent);
        }

        // XXX: maso, 2018: check content is not anonymous
        return $cms.putContent(content)//
        .then(uploadContentValue);
    }

    this.init({
        eventType: '/cms/contents'
    });
});
/* 
 * The MIT License (MIT)
 * 
 * Copyright (c) 2016 weburger
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

angular.module('mblowfish-core')
/*
 * 
 */
.controller('MbSeenCmsTermTaxonomiesCtrl',function ($scope, $cms, $controller) {

    /*
     * Extends collection controller
     */
    angular.extend(this, $controller('MbSeenAbstractCollectionCtrl', {
        $scope : $scope
    }));

    // Override the schema function
    this.getModelSchema = function () {
        return $cms.termTaxonomySchema();
    };

    // get contents
    this.getModels = function (parameterQuery) {
        return $cms.getTermTaxonomies(parameterQuery);
    };

    // get a content
    this.getModel = function (id) {
        return $cms.getTermTaxonomy(id);
    };

    // delete account
    this.deleteModel = function (content) {
        return $cms.deleteTermTaxonomy(content.id);
    };

    this.init({
        eventType: '/cms/term-taxonomies'
    });
});
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


/*
 * Add to angular
 */
angular.module('mblowfish-core')//

/**
 * @ngdoc Controllers
 * @name MbSeenAbstractCollectionCtrl
 * @description Generic controller of model collection of seen
 * 
 * This controller is used manages a collection of a virtual items. it is the
 * base of all other collection controllers such as accounts, groups, etc.
 * 
 * There are two types of function in the controller: view and data related. All
 * data functions are considered to be override by extensions.
 * 
 * There are three categories of actions;
 * 
 * - view
 * - model
 * - controller
 * 
 * view actions are about to update view. For example adding an item into the view
 * or remove deleted item.
 * 
 * Model actions deal with model in the repository. These are equivalent to the view
 * actions but removes items from the storage.
 * 
 * However, controller function provide an interactive action to the user to performs
 * an action.
 * 
 * ## Add
 * 
 * - addItem: controller
 * - addModel: model
 * - addViewItem: view
 */
.controller('MbSeenGeneralAbstractCollectionCtrl', function ($scope, $controller, $q) {
	

	/*
	 * Extends collection controller from MbAbstractCtrl 
	 */
	angular.extend(this, $controller('MbAbstractCtrl', {
		$scope: $scope
	}));

	this.getSchema = function () {
		if (!angular.isDefined(this.getModelSchema)) {
			return;
		}
		return this.getModelSchema()
		.then(function (schema) {
			return schema;
		});
	};

	//properties is the children of schema.
	this.getProperties = function () {
		if (angular.isDefined(this.properties)) {
			$q.resolve(this.properties);
		}
		var ctrl = this;
		if (angular.isDefined(ctrl.getModelSchema)) {
			return this.getSchema()
			.then(function (schema) {
				ctrl.properties = schema.children;
			});
		}
	};

	this.init = function () {
		this.getProperties();
	};
});

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

angular.module('mblowfish-core')

/**
 * @ngdoc Controllers
 * @name MbSeenUserAccountCtrl
 * @description Manages and display list of accounts
 * 
 * This controller is used in accounts list.
 * 
 */
.controller('MbSeenUserAccountCtrl', function ($scope, $usr, $controller) {
	angular.extend(this, $controller('MbSeenAbstractItemCtrl', {
		$scope: $scope
	}));

	// Override the function
	this.getModelSchema = function(){
		return $usr.accountSchema();
	};
	
	// get an account
	this.getModel = function(id){
		return $usr.getAccount(id);
	};
	
	// delete account
	this.deleteModel = function(model){
	    return $usr.deleteAccount(model.id);
	};

	// update account
	this.updateModel = function(model){
		return model.update();
	};

	this.init({
		eventType: '/user/accounts'
	});
});

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

angular.module('mblowfish-core')

/**
 * @ngdoc Controllers
 * @name MbSeenUserAccountsCtrl
 * @description Manages and display list of accounts
 * 
 * This controller is used in accounts list.
 * 
 */
.controller('MbSeenUserAccountsCtrl', function ($scope, $usr, $controller) {
    angular.extend(this, $controller('MbSeenAbstractCollectionCtrl', {
        $scope : $scope
    }));

    // Overried the function
    this.getModelSchema = function () {
        return $usr.accountSchema();
    };
    
    // get accounts
    this.getModels = function (parameterQuery) {
        return $usr.getAccounts(parameterQuery);
    };
    
    // get an account
    this.getModel = function (id) {
        return $usr.getAccount(id);
    };
    
    // add account
    this.addModel = function (model) {
        return $usr.putAccount(model);
    };
    
    // delete account
    this.deleteModel = function (model) {
        return $usr.deleteAccount(model.id);
    };

    this.init({
        eventType: '/user/account'
    });
});

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


angular.module('mblowfish-core')

/**
 * @ngdoc Controllers
 * @name MbSeenUserGroupsCtrl
 * @description Manages list of groups
 * 
 */
.controller('MbSeenUserGroupsCtrl', function ($scope, $usr, $controller) {
    angular.extend(this, $controller('MbSeenAbstractCollectionCtrl', {
        $scope : $scope
    }));

    // Overried the function
    this.getModelSchema = function () {
        return $usr.groupSchema();
    };
    
    // get groups
    this.getModels = function (parameterQuery) {
        return $usr.getGroups(parameterQuery);
    };
    
    // get a group
    this.getModel = function (id) {
        return $usr.getGroup(id);
    };
    
    // Add group
    this.addModel = function (model) {
        return $usr.putGroup(model);
    };
    
    // delete group
    this.deleteModel = function (model) {
        return $usr.deleteGroup(model.id);
    };

    this.init({
        eventType: '/user/groups'
    });
});


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
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */
angular.module('mblowfish-core')


/**
 * @ngdoc Controllers
 * @name MbSeenUserMessagesCtrl
 * @description Manages list of controllers
 * 
 */
.controller('MbSeenUserMessagesCtrl', function ($scope, $usr, $controller) {
    angular.extend(this, $controller('MbSeenAbstractCollectionCtrl', {
        $scope : $scope
    }));

    // Overried the function
    this.getModelSchema = function () {
        return $usr.messageSchema();
    };

    // get accounts
    this.getModels = function (parameterQuery) {
        return $usr.getMessages(parameterQuery);
    };

    // get an account
    this.getModel = function (id) {
        return $usr.getMessage(id);
    };

    // delete account
    this.deleteModel = function (item) {
        return item.delete();
    };

    this.init({
        eventType: '/user/messages',
        // do not show dialog on delete
        deleteConfirm: false,
    });
});

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

angular.module('mblowfish-core')

/**
 * @ngdoc Controllers
 * @name AmdAccountsCtrl
 * @description Manages and display list of accounts
 * 
 * This controller is used in accounts list.
 * 
 */
.controller('MbSeenUserProfilesCtrl', function ($scope, $usr, $controller) {
	angular.extend(this, $controller('MbSeenAbstractCollectionCtrl', {
		$scope: $scope
	}));

	// Override the function
	this.getModelSchema = function(){
		return $usr.profileSchema();
	};
	
	// get accounts
	this.getModels = function(parameterQuery){
		return $usr.getProfiles(parameterQuery);
	};
	
	// get an account
	this.getModel = function(id){
		return $usr.getProfile(id);
	};
	
	// add account profile
	this.addModel = function(model){
		return $usr.putProfile(model);
	};
	
	// delete account
	this.deleteModel = function(model){
	    return $usr.deleteProfile(model.id);
	};
    
    this.init();
});

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


angular.module('mblowfish-core')

/**
 * @ngdoc Controllers
 * @name MbSeenUserRolesCtrl
 * @description Manages list of roles
 * 
 * 
 */
.controller('MbSeenUserRolesCtrl', function ($scope, $usr, $q, $controller) {

    angular.extend(this, $controller('MbSeenAbstractCollectionCtrl', {
        $scope : $scope
    }));

    // Override the function
    this.getModelSchema = function () {
        return $usr.roleSchema();
    };

    // get accounts
    this.getModels = function (parameterQuery) {
        return $usr.getRoles(parameterQuery);
    };

    // get an account
    this.getModel = function (id) {
        return $usr.getRole(id);
    };

    // delete account
    this.deleteModel = function (model) {
        return $usr.deleteRole(model.id);
    };

    this.init();
});

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

angular.module('mblowfish-core')


/**
 * @ngdoc Controllers
 * @name MbThemesCtrl
 * @description Dashboard
 * 
 */
.controller('MbThemesCtrl', function($scope, $mdTheming) {
	$scope.themes =[];
	angular.forEach($mdTheming.THEMES, function(value, key){
		$scope.themes.push({
			'id': key,
			'label': value.name
		});
	});
});

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


angular.module('mblowfish-core')

/**
 * @ngdoc Controllers
 * @name AmdToolbarCtrl
 * @description Toolbar
 * 
 */
.controller('MbToolbarDashboardCtrl', function($scope, $actions, $mdSidenav, $monitor) {
	$scope.toolbarMenu = $actions.group('mb.toolbar.menu');
	
	function toggleNavigationSidenav(){
		$mdSidenav('navigator').toggle();
	}
	
	function toggleMessageSidenav(){
		$mdSidenav('messages').toggle();
	}
	
	$scope.toggleNavigationSidenav = toggleNavigationSidenav;
	$scope.toggleMessageSidenav = toggleMessageSidenav;
	
	
	function getMessageCount() {
	    $monitor.getMetric('message.count')
		    .then(function (metric) {
			$scope.messageCount = metric.value;
		    });
	}
	
	getMessageCount();
});
/* 
 * The MIT License (MIT)
 * 
 * Copyright (c) 2016 weburger
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


angular.module('mblowfish-core')
/**
 * @ngdoc Directives
 * @name compare-to
 * @description Compare two attributes.
 */
.directive('compareTo', function(){
	return {
		require: 'ngModel',
		scope: {
			otherModelValue: '=compareTo'
		},
		link: function(scope, element, attributes, ngModel){
			ngModel.$validators.compareTo = function(modelValue) {
				return modelValue === scope.otherModelValue;
			};

			scope.$watch('otherModelValue', function() {
				ngModel.$validate();
			});
		}
	};
});
/* 
 * The MIT License (MIT)
 * 
 * Copyright (c) 2016 weburger
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



angular.module('mblowfish-core')
/**
 * @ngdoc Directives
 * @name mb-badge
 * @description Display a badge on items
 * 
 */
.directive('mbBadge', function($mdTheming, $rootScope) {

	function __badge_toRGB(color){
		var split = (color || '').split('-');
		if (split.length < 2) {
			split.push('500');
		}

		var hueA = split[1] || '800'; // '800'
		var colorR = split[0] || 'primary'; // 'warn'

		var theme = $mdTheming.THEMES[$rootScope.app.setting.theme || $rootScope.app.config.theme || 'default'];
		if(typeof theme === 'undefined'){
			theme = $mdTheming.THEMES['default'];
		}
		var colorA = theme.colors[colorR] ?  theme.colors[colorR].name : colorR;
		var colorValue = $mdTheming.PALETTES[colorA][hueA] ? $mdTheming.PALETTES[colorA][hueA].value : $mdTheming.PALETTES[colorA]['500'].value;
		return 'rgb(' + colorValue.join(',') + ')';
	}

	function postLink(scope, element, attributes) {
		$mdTheming(element);

		function style(where, color) {
			if (color) {
				element.css(where, __badge_toRGB(color));
			}
		}
//		function getPosition(){
//		return {
//		top: element.prop('offsetTop'),
//		left: element.prop('offsetLeft'),
//		width: element.prop('offsetWidth'),
//		height: element.prop('offsetHeight')
//		};
//		}
		scope.$watch(function() {
			return attributes.mbBadgeColor;
		}, function(value){
			style('color', value);
		});
		scope.$watch(function() {
			return attributes.mbBadgeFill;
		}, function(value){
			style('background-color', value);
		});
	}

	return {
		restrict: 'E',
		replace: true,
		transclude: true,
		link: postLink,
		template: function(/*element, attributes*/) {
			return '<div class="mb-badge" ng-transclude></div>';
		}
	};
});

angular.module('mblowfish-core')
.directive('mbBadge', function($mdTheming, $mdColors, $timeout, $window, $compile, $rootScope) {


	function __badge_toRGB(color){
		var split = (color || '').split('-');
		if (split.length < 2) {
			split.push('500');
		}

		var hueA = split[1] || '800'; // '800'
		var colorR = split[0] || 'primary'; // 'warn'

		var theme = $mdTheming.THEMES[$rootScope.app.setting.theme || $rootScope.app.config.theme || 'default'];
		if(typeof theme === 'undefined'){
			theme = $mdTheming.THEMES['default'];
		}
		var colorA = theme.colors[colorR] ?  theme.colors[colorR].name : colorR;
		var colorValue = $mdTheming.PALETTES[colorA][hueA] ? $mdTheming.PALETTES[colorA][hueA].value : $mdTheming.PALETTES[colorA]['500'].value;
		return 'rgb(' + colorValue.join(',') + ')';
	}

	function postLink(scope, element, attributes) {
		$mdTheming(element);
		//
		var parent = element.parent();
		var bg = angular.element('<div></div>');
		var link = $compile(bg);
		var badge = link(scope);

		var offset = parseInt(attributes.mdBadgeOffset);
		if (isNaN(offset)) {
			offset = 10;
		}

		function style(where, color) {
			if (color) {
				badge.css(where, __badge_toRGB(color));
			}
		}
		function getPosition(){
			return {
				top: element.prop('offsetTop'),
				left: element.prop('offsetLeft'),
				width: element.prop('offsetWidth'),
				height: element.prop('offsetHeight')
			};
		}

		function position(value) {
			var top = element.prop('offsetTop');
			badge.css({
				'display' : attributes.mbBadge && top ? 'initial' : 'none',
						'left' : value.left + value.width - 20 + offset + 'px',
						'top' : value.top + value.height - 20 + offset + 'px'
			});
		}

//		function update () {
//		position(getPosition());
//		}

		badge.addClass('mb-badge');
		badge.css('position', 'absolute');
		parent.append(badge);
		scope.$watch(function() {
			return attributes.mbBadgeColor;
		}, function(value){
			style('color', value);
		});
		scope.$watch(function() {
			return attributes.mbBadgeFill;
		}, function(value){
			style('background-color', value);
		});
		scope.$watch(function() {
			return attributes.mbBadge;
		}, function(value){
			badge.text(value);
			badge.css('display', value ? 'initial' : 'none');
		});

		scope.$watch(getPosition, function(value) {
			position(value);
		}, true);

//		angular.element($window)
//		.bind('resize', function(){
//		update();
//		});
	}
	return {
		priority: 100,
		restrict: 'A',
		link: postLink
	};
});

/* 
 * The MIT License (MIT)
 * 
 * Copyright (c) 2016 weburger
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the 'Software'), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */


angular.module('mblowfish-core')
/**
 * @ngdoc Directives
 * @name mb-captcha
 * @description Adding captcha value
 * 
 * In some case, user must send captcha to the server fro auth. This a directive
 * to enablie captcha
 * 
 */
.directive('mbCaptcha', function() {

    /**
     * Adding preloader.
     * 
     * @param scope
     * @param element
     * @param attr
     * @returns
     */
    function postLink(scope, element, attrs, ctrls) {
        var form=ctrls[0];
//        var ngModel=ctrls[1];

        function validate(){
            if(form){
                form.$setValidity('captcha', scope.required === false ? null : Boolean(scope.response));
            }
        }

//        function destroy() {
//            if (form) {
//                // reset the validity of the form if we were removed
//                form.$setValidity('captcha', null);
//            }
//        }


        if(form && angular.isDefined(attrs.required)){
            scope.$watch('required', validate);
        }
        scope._response = null;
        scope.$watch('_response', function(){
            scope.response = scope._response;
        });
        scope.$watch('response', function(){
            scope._response = scope.response;
        });


    }

    return {
        restrict : 'E',
        require: ['?^^form'],
        templateUrl: 'views/directives/mb-captcha.html',
        scope: {
            response: '=?ngModel'
        },
        link: postLink
    };
});
/* 
 * The MIT License (MIT)
 * 
 * Copyright (c) 2016 weburger
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the 'Software'), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */


angular.module('mblowfish-core')

/**
 * @ngdoc Directives
 * @name mb-context-menu
 * @description Set internal md-menu as context menu
 * 
 */
.directive('mbContextMenu', function() {
	return {
		restrict : 'A',
		require : 'mdMenu',
		scope : true,
		link : function(scope, element, attrs, menu) {
			element.bind('contextmenu', function(event) {
	            scope.$apply(function() {
					menu.open(event);
	            });
	        });
		}
	};
});
/*
 * Copyright (c) 2015 Phoenix Scholars Co. (http://dpq.co.ir)
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


angular.module('mblowfish-core')


	/**
	 * @ngdoc Directives
	 * @name mb-datepicker
	 * @descritpion Date picker
	 * 
	 * Select a date based on local.
	 * 
	 */
	.directive('mbDatepicker', function($mdUtil, $rootScope) {

		// **********************************************************
		// Private Methods
		// **********************************************************
		function postLink(scope, element, attr, ctrls) {
			scope.app = $rootScope.app || {};
			var ngModelCtrl = ctrls[0] || $mdUtil.fakeNgModel();

			function render() {
				if (!ngModelCtrl.$modelValue) {
					return;
				}
				var date = moment //
					.utc(ngModelCtrl.$modelValue) //
					.local();
				if (date.isValid()) {
					scope.date = date;
					return;
				}
				// TODO: maso, 2018: handle invalid date
			}

			function setValue() {
				if (!scope.date) {
					ngModelCtrl.$setViewValue(scope.date);
					return;
				}
				var date = moment(scope.date) //
					.utc() //
					.format(scope.dateFormat || 'YYYY-MM-DD HH:mm:ss');
				ngModelCtrl.$setViewValue(date);
			}

			ngModelCtrl.$render = render;
			scope.$watch('date', setValue);
		}


		return {
			replace: false,
			template: function() {
				var app = $rootScope.app || {};
				if (app.calendar === 'Gregorian') {
					return '<md-datepicker ng-model="date" md-hide-icons="calendar" md-placeholder="{{placeholder || \'Enter date\'}}"></md-datepicker>';
				}
				return '<md-persian-datepicker ng-model="date" md-hide-icons="calendar" md-placeholder="{{placeholder || \'Enter date\'}}"></md-persian-datepicker>';
			},
			restrict: 'E',
			scope: {
				minDate: '=mbMinDate',
				maxDate: '=mbMaxDate',
				placeholder: '@mbPlaceholder',
				hideIcons: '@?mbHideIcons',
				dateFormat: '@?mbDateFormat'
				//		        currentView: '@mdCurrentView',
				//		        dateFilter: '=mdDateFilter',
				//		        isOpen: '=?mdIsOpen',
				//		        debounceInterval: '=mdDebounceInterval',
				//		        dateLocale: '=mdDateLocale'
			},
			require: ['ngModel'],
			priority: 210, // Run before ngAria
			link: postLink
		};
	});
/* 
 * The MIT License (MIT)
 * 
 * Copyright (c) 2016 weburger
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the 'Software'), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */


angular.module('mblowfish-core')
/**
 * @ngdoc Directives
 * @name mbDynamicForm
 * @description Get a list of properties and fill them
 * 
 * Each property will be managed by an indevisual property editor.
 */
.directive('mbDynamicForm', function ($resource) {

    /**
     * Adding preloader.
     * 
     * @param scope
     * @param element
     * @param attr
     * @param ctrls
     * @returns
     */
    function postLink(scope, element, attrs, ctrls) {
        // Load ngModel
        var ngModelCtrl = ctrls[0];
        scope.values = {};
        ngModelCtrl.$render = function () {
            scope.values = ngModelCtrl.$viewValue || {};
        };

        scope.modelChanged = function (key, value) {
            scope.values[key] = value;
            ngModelCtrl.$setViewValue(scope.values);
        };

        scope.hasResource = function(prop){
            return $resource.hasPeagFor(prop.name);
        };
        
        scope.setValueFor = function(prop){
            return $resource.get(prop.name, {
                data: prop.defaultValue
            })
            .then(function(value){
                scope.modelChanged(prop.name, value);
            });
        };
    }

    return {
        restrict: 'E',
        require: ['ngModel'],
        templateUrl: 'views/directives/mb-dynamic-form.html',
        scope: {
            mbParameters: '='
        },
        link: postLink
    };
});
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



angular.module('mblowfish-core')

/**
 * @ngdoc Directives
 * @name mb-dynamic-tabs
 * @description Display tabs dynamically
 * 
 * In some case, a dynamic tabs are required. This module add them dynamically.
 * 
 */
.directive('mbDynamicTabs', function($wbUtil, $q, $rootScope, $compile, $controller) {
	var CHILDREN_AUNCHOR = 'mb-dynamic-tabs-select-resource-children';


	/**
	 * encapsulate template srce with panel widget template.
	 * 
	 * @param page
	 *            setting page config
	 * @param tempateSrc
	 *            setting page html template
	 * @returns encapsulate html template
	 */
	function _encapsulatePanel(page, template) {
		// TODO: maso, 2017: pass all paramter to the setting
		// panel.
		return template;
	}


	function link($scope, $element) {
		// Load pages in scope
		function loadPage(index){
			var jobs = [];
			var pages2 = [];
			
			var mbTabs = $scope.mbTabs || [];
			if(index > mbTabs.length || index < 0 || mbTabs.length == 0){
				return;
			}
			var page = mbTabs[index];

			// 1- Find element
			var target = $element.find('#' + CHILDREN_AUNCHOR);

			// 2- Clear childrens
			target.empty();

			// 3- load pages
			var template = $wbUtil.getTemplateFor(page);
			if (angular.isDefined(template)) {
				jobs.push(template.then(function(templateSrc) {
					templateSrc = _encapsulatePanel(page, templateSrc);
					var element = angular.element(templateSrc);
					var scope = $rootScope.$new(false, $scope);
					scope.page = page;
					scope.value = $scope.value;
					if (angular .isDefined(page.controller)) {
						$controller(page.controller, {
							$scope : scope,
							$element : element
						});
					}
					$compile(element)(scope);
					pages2.push(element);
				}));
			}

			$q.all(jobs).then(function() {
				angular.forEach(pages2, function(element) {
					target.append(element);
				});
			});
		}
		
		// Index of selected page
		$scope.$watch('pageIndex', function(value){
			if(value >= 0){
				loadPage(value);
			}
		});
	}



	return {
		restrict: 'E',
		replace: true,
		scope: {
			mbTabs: '='
		},
		templateUrl: 'views/directives/mb-dynamic-tabs.html',
		link: link
	};
});

/*
 * Copyright (c) 2015 Phoenix Scholars Co. (http://dpq.co.ir)
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


angular.module('mblowfish-core')

/**
 * @ngdoc Directives
 * @name mb-error-messages
 * @description An error message display
 */
.directive('mbErrorMessages', function($compile) {

    /*
     * Link function
     */
    function postLink(scope, element){

        /**
         * Original element which replaced by this directive.
         */
        var origin = null;

        scope.errorMessages = function(err){
            if(!err) {
                return;
            }
            var message = {};
            message[err.status]= err.statusText;
            message[err.data.code]= err.data.message;
            return message;
        };

        scope.$watch(function(){
            return scope.mbErrorMessages;
        }, function(value){	
            if(value){
                var tmplStr = 
                    '<div ng-messages="errorMessages(mbErrorMessages)" role="alert" multiple>'+
                    '	<div ng-messages-include="views/mb-error-messages.html"></div>' +
                    '</div>';
                var el = angular.element(tmplStr);
                var cmplEl = $compile(el);
                var myEl = cmplEl(scope);
                origin = element.replaceWith(myEl);
            } else if(origin){
                element.replaceWith(origin);
                origin = null;
            }
        });
    }

    /*
     * Directive
     */
    return {
        restrict: 'A',
        scope:{
            mbErrorMessages : '='
        },
        link: postLink
    };
});
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


angular.module('mblowfish-core')

/**
 * @ngdoc Directives
 * @name mb-infinate-scroll
 * @description Infinet scroll
 * 
 * 
 * Manage scroll of list
 */
.directive('mbInfinateScroll', function ($parse, $q, $timeout) {
    // FIXME: maso, 2017: tipo in diractive name (infinite)
    function postLink(scope, elem, attrs) {
        var raw = elem[0];

        /*
         * Load next page
         */
        function loadNextPage() {
            // Call the callback for the first time:
            var value = $parse(attrs.mbInfinateScroll)(scope);
            return $q.when(value)//
            .then(function (value) {
                if (value) {
                    return $timeout(function () {
                        if (raw.scrollHeight <= raw.offsetHeight) {
                            return loadNextPage();
                        }
                    }, 100);
                }
            });
        }

        /*
         * Check scroll state and update list
         */
        function scrollChange() {
            if (raw.scrollTop + raw.offsetHeight + 5 >= raw.scrollHeight) {
                loadNextPage();
            }
        }

        // adding infinite scroll class
        elem.addClass('mb-infinate-scroll');
        elem.on('scroll', scrollChange);
        loadNextPage();
    }

    return {
        restrict : 'A',
        link : postLink
    };
});

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



/**
 * @ngdoc Directives
 * @name mb-inline
 * @description Inline editing field
 */
angular.module('mblowfish-core').directive('mbInline', function($q, $parse, $resource) {

    /**
     * Link data and view
     */
	function postLink(scope, elem, attr, ctrls) {

		var ngModel = ctrls[1];
		var ctrl = ctrls[0];

		scope.myDataModel = {};
		scope.errorObject = {};

		scope.mbInlineType = attr.mbInlineType;
		scope.mbInlineLabel = attr.mbInlineLabel;
		scope.mbInlineDescription = attr.mbInlineDescription;

		scope.$watch(attr.mbInlineEnable, function(value) {
			scope.mbInlineEnable = value;
		});
		scope.$watch(attr.mbInlineSaveButton, function(value) {
			scope.mbInlineSaveButton = value;
		});
		scope.$watch(attr.mbInlineCancelButton, function(value) {
			scope.mbInlineCancelButton = value;
		});

		ngModel.$render = function() {
			ctrl.model = ngModel.$viewValue;
		};

		/*
		 * @depricated use ngChange
		 */
		ctrl.saveModel = function(d) {
			ngModel.$setViewValue(d);
			if (attr.mbInlineOnSave) {
				scope.$data = d;
				var value = $parse(attr.mbInlineOnSave)(scope);
				$q.when(value)//
					.then(function() {
						delete scope.error;
					}, function(error) {
						scope.error = error;
					});
			}
		};
	}

	return {
		restrict: 'E',
		transclude: true,
		replace: true,
		require: ['mbInline', '^ngModel'],
		scope: true,
        /*
         * @ngInject
         */
		controller: function($scope) {
			this.edit = function() {
				this.editMode = true;
			};

			this.setEditMode = function(editMode) {
				this.editMode = editMode;
			};

			this.getEditMode = function() {
				return this.editMode;
			};

			this.save = function() {
				this.saveModel(this.model);
				this.setEditMode(false);
			};

			this.cancel = function() {
				this.setEditMode(false);
			};


            /*
             * Select image url
             */
			this.updateImage = function() {
//				if (!$scope.mbInlineEnable) {
//					return;
//				}
				var ctrl = this;
				return $resource.get('image', {
					style: {
						icon: 'image',
						title: $scope.mbInlineLabel || 'Select image',
						description: $scope.mbInlineDescription || 'Select a file from resources to change current image'
					},
					data: this.model
				}) //
					.then(function(url) {
						ctrl.model = url;
						ctrl.save();
					});
			};

			/*
             * Select image url
             */
			this.updateFile = function() {
//				if (!$scope.mbInlineEnable) {
//					return;
//				}
				var ctrl = this;
				return $resource.get('local-file', {
					style: {
						icon: 'file',
						title: $scope.mbInlineLabel || 'Select file',
						description: $scope.mbInlineDescription || 'Select a file from resources to change current data'
					},
					data: this.model
				}).then(function(file) {
					ctrl.model = file;
					ctrl.save();
				});
			};
		},
		controllerAs: 'ctrlInline',
		templateUrl: 'views/directives/mb-inline.html',
		link: postLink
	};
});

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



angular.module('mblowfish-core')

/**
 * @ngdoc Directives
 * @name mb-navigation-path
 * @description Display current navigation path of system
 * 
 * Navigation path is a menu which is updated by the $navigation service. This menu
 * show a chain of menu items to show the current path of the system. It is very
 * usefull to show current path to the users.
 * 
 * 
 */
.directive('mbNavigationBar' , function($actions, $navigator) {


	/**
	 * Init the bar
	 */
	function postLink(scope) {
		scope.isVisible = function(menu){
			// default value for visible is true
			if(angular.isUndefined(menu.visible)){
				return true;
			}
			if(angular.isFunction(menu.visible)){
				return menu.visible();
			}
			return menu.visible;
		};
		
		scope.goToHome = function(){
			$navigator.openPage('');
		};
		
		/*
		 * maso, 2017: Get navigation path menu. See $navigator.scpoePath for more info
		 */
		scope.pathMenu = $actions.group('navigationPathMenu');
	}
	
    return {
        restrict : 'E',
        replace: false,
        templateUrl: 'views/directives/mb-navigation-bar.html',
        link: postLink
    };
});

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


angular.module('mblowfish-core')

/**
 * @ngdoc Directives
 * @name mb-pagination-bar
 * @property {Object}    mb-model           -Data model
 * @property {function}  mb-reload          -Reload function
 * @property {Array}     mb-sort-keys       -Array
 * @property {Array}     mb-properties      -Array
 * @property {Array}     mb-more-actions    -Array
 * @property {string}    mb-title           -String
 * @property {string}    mb-icon            -String
 * @description Pagination bar
 *
 * Pagination parameters are a complex data structure and it is hard to manage
 * it. This is a toolbar to manage the pagination options. mb-reload get a function 
 * as reload. mb-sort-keys get an array of keys which is used in sort section of 
 * pagination bar and the sort could be done based on this keys. mb-properties get
 * an array of keys which is used in filter section of pagination bar. really mb-properties
 * gets children array of schema of a collection. The controller of collection is 
 * responsible to get the schema of a collection and pass it's children array to this 
 * attribute of directive. The directive itself do the required work to set the values
 * in filter section.
 * 
 */
.directive('mbPaginationBar', function ($window, $timeout, $mdMenu, $parse) {

    function postLink(scope, element, attrs) {

        var query = {
                sortDesc: true,
                sortBy: typeof scope.mbSortKeys === 'undefined' ? 'id' : scope.mbSortKeys[0],
                        searchTerm: null
        };
        /*
         * مرتب سازی مجدد داده‌ها بر اساس حالت فعلی
         */
        function __reload() {
            if (!angular.isDefined(attrs.mbReload)) {
                return;
            }
            $parse(attrs.mbReload)(scope.$parent);
        }
        /**
         * ذخیره اطلاعات آیتم‌ها بر اساس مدل صفحه بندی
         */
        function exportData() {
            if (!angular.isFunction(scope.mbExport)) {
                return;
            }
            scope.mbExport(scope.mbModel);
        }

        function searchQuery() {
            scope.mbModel.setQuery(scope.query.searchTerm);
            __reload();
        }

        function focusToElementById(id) {
            $timeout(function () {
                var searchControl;
                searchControl = $window.document.getElementById(id);
                searchControl.focus();
            }, 50);
        }

        function setSortOrder() {
            scope.mbModel.clearSorters();
            var key = scope.query.sortBy;
            var order = scope.query.sortDesc ? 'd' : 'a';
            scope.mbModel.addSorter(key, order);
            __reload();
        }

        /*
         * Add filter to the current filters
         */
        function addFilter() {
            if (!scope.filters) {
                scope.filters = [];
            }
            scope.filters.push({
                key: '',
                value: ''
            });
        }

        function putFilter(filter, index) {
            scope.filters[index] = {
                    key: filter.key,
                    value: filter.value
            };
        }

        function applyFilter() {
            scope.reload = false;
            scope.mbModel.clearFilters();
            if (scope.filters && scope.filters.length > 0) {
                scope.filters.forEach(function (filter) {
                    if (filter.key !== '' && filter.value && filter.value !== '') {
                        scope.mbModel.addFilter(filter.key, filter.value);
                        scope.reload = true;
                    }
                });
            }
            if (scope.reload) {
                __reload();
            }
        }

        /*
         * Remove filter to the current filters
         */
        function removeFilter(filter, index) {
            Object.keys(scope.mbModel.filterMap).forEach(function (key) {
                if (key === filter.key) {
                    scope.mbModel.removeFilter(scope.filters[index].key);
                }
            });
            scope.filters.splice(index, 1);
            if (scope.filters.length === 0) {
                __reload();
            }
        }

        function setFilterValue(value, index) {
            scope.filterValue = value;
            putFilter(index);
        }


        //Fetch filters from children array of collection schema
        function fetchFilterKeys() {
            scope.mbProperties.forEach(function (object) {
                scope.filterKeys.push(object.name);
            });
        }

        scope.showBoxOne = false;
        scope.focusToElement = focusToElementById;
        // configure scope:
        scope.searchQuery = searchQuery;
        scope.setSortOrder = setSortOrder;
        scope.addFilter = addFilter;
        scope.putFilter = putFilter;
        scope.applyFilter = applyFilter;
        scope.removeFilter = removeFilter;
        //scope.setFilterKey = setFilterKey;
        scope.setFilterValue = setFilterValue;
        scope.__reload = __reload;
        scope.query = query;
        if (angular.isFunction(scope.mbExport)) {
            scope.exportData = exportData;
        }
        if (typeof scope.mbEnableSearch === 'undefined') {
            scope.mbEnableSearch = true;
        }

        scope.$watch('mbProperties', function (mbProperties) {
            if (angular.isArray(mbProperties)) {
                scope.filterKeys = [];
                fetchFilterKeys();
            }
        });
    }

    return {
        restrict: 'E',
        templateUrl: 'views/directives/mb-pagination-bar.html',
        scope: {
            /*
             * مدل صفحه بندی را تعیین می‌کند که ما اینجا دستکاری می‌کنیم.
             */
            mbModel: '=',
            /*
             * تابعی را تعیین می‌کند که بعد از تغییرات باید برای مرتب سازی
             * فراخوانی شود. معمولا بعد تغییر مدل داده‌ای این تابع فراخوانی می‌شود.
             */
            mbReload: '@?',
            /*
             * تابعی را تعیین می‌کند که بعد از تغییرات باید برای ذخیره آیتم‌های موجود در لیست
             * فراخوانی شود. این تابع معمولا باید بر اساس تنظیمات تعیین شده در مدل داده‌ای کلیه آیتم‌های فهرست را ذخیره کند.
             */
            mbExport: '=',
            /*
             * یک آرایه هست که تعیین می‌که چه کلید‌هایی برای مرتب سازی باید استفاده
             * بشن.
             */
            mbSortKeys: '=',
            /*
             * آرایه ای از آبجکتها که بر اساس فیلدهای هر آبجکت کلیدهایی برای فیلتر کردن استخراج می شوند
             */
            mbProperties: '=?',

            /* titles corresponding to sort keys */
            mbSortKeysTitles: '=?',

            /*
             * فهرستی از عمل‌هایی که می‌خواهیم به این نوار ابزار اضافه کنیم
             */
            mbMoreActions: '=',

            mbTitle: '@?',
            mbIcon: '@?',

            mbEnableSearch: '=?'
        },
        link: postLink
    };
});

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


angular.module('mblowfish-core')

/**
 * @ngdoc Directives
 * @name mb-panel-sidenav-anchor
 * @description Display a sidenave anchor
 * 
 */
.directive('mbPanelSidenavAnchor', function ($route, $sidenav, $rootScope, $mdSidenav, $q,
        $wbUtil, $controller, $compile) {

    /*
     * Bank of sidnav elements.
     */
    var elementBank = angular.element('<div></div>');

    /*
     * Load page and create an element
     */
    function _loadPage($scope, page, prefix, postfix) {
        // 1- create scope
        var childScope = $scope.$new(false, $scope);
        childScope = Object.assign(childScope, {
            app : $rootScope.app,
            _page : page,
            _visible : function () {
                if (angular.isFunction(this._page.visible)) {
                    var v = this._page.visible(this);
                    if (v) {
                        $mdSidenav(this._page.id).open();
                    } else {
                        $mdSidenav(this._page.id).close();
                    }
                    return v;
                }
                return true;
            }
        });

        // 2- create element
        return $wbUtil
        .getTemplateFor(page)
        .then(
                function (template) {
                    var element = angular
                    .element(prefix + template + postfix);
                    elementBank.append(element);

                    // 3- bind controller
                    var link = $compile(element);
                    if (angular.isDefined(page.controller)) {
                        var locals = {
                                $scope : childScope,
                                $element : element
                        };
                        var controller = $controller(
                                page.controller, locals);
                        if (page.controllerAs) {
                            childScope[page.controllerAs] = controller;
                        }
                        element
                        .data(
                                '$ngControllerController',
                                controller);
                    }
                    return {
                        element : link(childScope),
                        page : page
                    };
                });
    }

    function postLink($scope, $element) {
        var _sidenaves = [];

        /*
         * Remove all sidenaves
         */
        function _removeElements(pages, elements) {
            var cache = [];
            for (var i = 0; i < elements.length; i++) {
                var flag = false;
                for (var j = 0; j < pages.length; j++) {
                    if (pages[j].id === elements[i].page.id) {
                        flag = true;
                        break;
                    }
                }
                if (flag) {
                    elements[i].element.detach();
                    elements[i].cached = true;
                    cache.push(elements[i]);
                } else {
                    elements[i].element.remove();
                }
            }
            return cache;
        }

        function _getSidenavElement(page) {
            for (var i = 0; i < _sidenaves.length; i++) {
                if (_sidenaves[i].page.id === page.id) {
                    return $q.when(_sidenaves[i]);
                }
            }
            return _loadPage(
                    $scope,
                    page,
                    '<md-sidenav md-theme="{{app.setting.theme || app.config.theme || \'default\'}}" md-theme-watch md-component-id="{{_page.id}}" md-is-locked-open="_visible() && (_page.locked && $mdMedia(\'gt-sm\'))" md-whiteframe="2" ng-class="{\'md-sidenav-right\': app.dir==\'rtl\',  \'md-sidenav-left\': app.dir!=\'rtl\', \'mb-sidenav-ontop\': !_page.locked}" class=" wb-layer-sidenav-top">',
            '</md-sidenav>').then(
                    function (pageElement) {
                        _sidenaves.push(pageElement);
                    });
        }

        /*
         * reload sidenav
         */
        function _reloadSidenavs(sidenavs) {
            _sidenaves = _removeElements(sidenavs, _sidenaves);
            var jobs = [];
            for (var i = 0; i < sidenavs.length; i++) {
                jobs.push(_getSidenavElement(sidenavs[i]));
            }
            $q
            .all(jobs)
            //
            .then(
                    function () {
                        // Get Anchor
                        var _anchor = $element;
                        // maso, 2018: sort
                        _sidenaves
                        .sort(function (a, b) {
                            return (a.page.priority || 10) > (b.page.priority || 10);
                        });
                        for (var i = 0; i < _sidenaves.length; i++) {
                            var ep = _sidenaves[i];
                            if (ep.chached) {
                                continue;
                            }
                            if (ep.page.position === 'start') {
                                _anchor
                                .prepend(ep.element);
                            } else {
                                _anchor
                                .append(ep.element);
                            }
                        }
                    });
        }

        /*
         * Reload UI
         * 
         * Get list of sidenavs for the current state and load
         * them.
         */
        function _reloadUi() {
            if (!angular.isDefined($route.current)) {
                return;
            }
            // Sidenavs
            var sdid = $route.current.sidenavs || $sidenav.defaultSidenavs();
            sdid = sdid.slice(0);
            sdid.push('settings');
            sdid.push('help');
            sdid.push('messages');
            var sidenavs = [];
            var jobs = [];
            angular.forEach(sdid, function (item) {
                jobs.push($sidenav.sidenav(item).then(
                        function (sidenav) {
                            sidenavs.push(sidenav);
                        }));
            });
            $q.all(jobs).then(function () {
                _reloadSidenavs(sidenavs);
            });
        }

        $scope.$watch(function () {
            return $route.current;
        }, _reloadUi);
    }

    return {
        restrict : 'A',
        priority : 601,
        link : postLink
    };
});
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



angular.module('mblowfish-core')

/**
 * @ngdoc Directives
 * @name mb-panel-toolbar-anchor
 * @description display a toolbar
 * 
 */
.directive('mbPanelToolbarAnchor', function($route, $toolbar, $rootScope, $q, $wbUtil, $controller, $compile) {

    /*
     * Load page and create an element
     */
    function _loadPage($scope, page, prefix, postfix) {
        // 1- create scope
        var childScope = $scope.$new(false, $scope);
        childScope = Object.assign(childScope, {
            app : $rootScope.app,
            _page : page,
            _visible : function() {
                if (angular.isFunction(this._page.visible)) {
                    var v = this._page.visible(this);
                    return v;
                }
                return true;
            }
        });

        // 2- create element
        return $wbUtil.getTemplateFor(page)
        .then(function(template) {
            var element = angular.element(prefix + template + postfix);

            // 3- bind controller
            var link = $compile(element);
            if (angular.isDefined(page.controller)) {
                var locals = {
                        $scope : childScope,
                        $element : element
                };
                var controller = $controller(page.controller, locals);
                if (page.controllerAs) {
                    childScope[page.controllerAs] = controller;
                }
                element.data('$ngControllerController', controller);
            }
            return {
                element : link(childScope),
                page : page
            };
        });
    }

    function postLink($scope, $element) {
        var _toolbars = [];

        /*
         * Remove all toolbars
         */
        function _removeElements(pages, elements) {
            var cache = [];
            for(var i = 0; i < elements.length; i++){
                var flag = false;
                for(var j = 0; j < pages.length; j++){
                    if(pages[j].id === elements[i].page.id) {
                        flag = true;
                        break;
                    }
                }
                if(flag){
                    elements[i].element.detach();
                    elements[i].cached = true;
                    cache.push(elements[i]);
                } else {
                    elements[i].element.remove();
                }
            }
            return cache;
        }


        function _getToolbarElement(page){
            for(var i = 0; i < _toolbars.length; i++){
                if(_toolbars[i].page.id === page.id){
                    return $q.when(_toolbars[i]);
                }
            }

            var prefix = page.raw ? '' : '<md-toolbar id="{{_page.id}}" ng-show="_visible()" md-theme="{{app.setting.theme || app.config.theme || \'default\'}}" md-theme-watch layout="column" layout-gt-xs="row" layout-align="space-between stretch" itemscope itemtype="http://schema.org/WPHeader">';
            var postfix = page.raw ? '' : '</md-toolbar>';
            return _loadPage($scope, page, prefix, postfix)
            .then(function(pageElement) {
                _toolbars.push(pageElement);
            });
        }

        /*
         * Reload toolbars
         */
        function _reloadToolbars(toolbars) {
            _toolbars = _removeElements(toolbars, _toolbars);
            var jobs = [];
            for (var i = 0; i < toolbars.length; i++) {
                jobs.push(_getToolbarElement(toolbars[i]));
            }
            $q.all(jobs) //
            .then(function() {
                // Get Anchor
                var _anchor = $element;
                // maso, 2018: sort
                _toolbars.sort(function(a, b){
                    return (a.page.priority || 10) > (b.page.priority || 10);
                });
                for (var i = 0; i < _toolbars.length; i++) {
                    var ep = _toolbars[i];
                    if(ep.chached){
                        continue;
                    }
                    _anchor.prepend(ep.element);
                }
            });
        }

        /*
         * Reload UI
         * 
         * - sidenav
         * - toolbar
         */
        function _reloadUi(){
            if(!$route.current){
                return;
            }
            // Toolbars
            var tids = $route.current.toolbars || $toolbar.defaultToolbars();
            if(angular.isArray(tids)){
                var ts = [];
                var jobs = [];
                angular.forEach(tids, function(item){
                    jobs.push($toolbar.toolbar(item)
                            .then(function(toolbar){
                                ts.push(toolbar);
                            }));
                });
                $q.all(jobs)
                .then(function(){
                    _reloadToolbars(ts);
                });
            }
        }

//        function _isVisible(item){
//            if (angular.isFunction(item.visible)) {
//                var v = item.visible(this);
//                return v;
//            }
//            if(angular.isDefined(item.visible)){
//                // item.visible is defined but is not a function
//                return item.visible;
//            }
//            return true;
//        }

        $scope.$watch(function(){
            return $route.current;
        },_reloadUi);
//      _reloadUi();
    }


    return {
        restrict : 'A',
//      replace : true,
//      templateUrl : 'views/directives/mb-panel.html',
        link : postLink
    };
});
/*
 * Copyright (c) 2015 Phoenix Scholars Co. (http://dpq.co.ir)
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


angular.module('mblowfish-core')

	/**
	 *
	 */
	.directive('mbPay', function ($bank, $parse, $location, $navigator, $translate, QueryParameter) {

	    var qp = new QueryParameter();

	    function postLink(scope, elem, attrs, ctrls) {
		var ngModelCtrl = ctrls[0];
		var ctrl = this;
		ngModelCtrl.$render = function () {
		    ctrl.currency = ngModelCtrl.$modelValue;
		    if (ctrl.currency) {
			ctrl.loadGates();
		    }
		};

		this.loadGates = function () {
		    if (this.loadingGates) {
			return;
		    }
		    this.loadingGates = true;
		    qp.setFilter('currency', this.currency);
		    var ctrl = this;
		    return $bank.getBackends(qp)//
			    .then(function (gatesPag) {
				ctrl.gates = gatesPag.items;
				return gatesPag;
			    })//
			    .finally(function () {
				ctrl.loadingGates = false;
			    });
		};

		//function pay(backend, discountCode){
		this.pay = function (backend, discountCode) {
		    if (this.paying) {
			return;
		    }
		    this.paying = true;
		    // create receipt and send to bank receipt page.
		    var data = {
			backend: backend.id,
			callback: attrs.mbCallbackUrl ? attrs.mbCallbackUrl : $location.absUrl()
		    };
		    if (typeof discountCode !== 'undefined' && discountCode !== null) {
			data.discount_code = discountCode;
		    }
		    var ctrl = this;
		    $parse(attrs.mbPay)(scope.$parent, {
			$backend: backend,
			$discount: discountCode,
			$callback: data.callback,
			$data: data
		    })//
			    .then(function (receipt) {
				ctrl.paying = false;
				$navigator.openPage('bank/receipts/' + receipt.id);
			    }, function (error) {
				ctrl.paying = false;
				alert($translate.instant(error.data.message));
			    });
		};

//		function checkDiscount(code){
//			$discount.discount(code)//
//			.then(function(discount){
//				if(typeof discount.validation_code === 'undefined' || discount.validation_code === 0){
//					$scope.discount_message = 'discount is valid';
//				}else{
//					switch(discount.validation_code){
//					case 1:
//						$scope.discount_message = 'discount is used before';
//						break;
//					case 2: 
//						$scope.discount_message = 'discount is expired';
//						break;
//					case 3: 
//						// discount is not owned by user.
//						$scope.discount_message = 'discount is not valid';
//						break;
//					}
//				}
//			}, function(error){
//				$scope.error = error.data.message;
//				if(error.status === 404){				
//					$scope.discount_message = 'discount is not found';
//				}else{
//					$scope.discount_message = 'unknown error while get discount info';
//				}
//			});
//		}

		

		scope.ctrl = this;
	    }

	    return {
		replace: true,
		restrict: 'E',
		templateUrl: 'views/directives/mb-pay.html',
		scope: {
		    mbCallbackUrl: '@?',
		    mbPay: '@',
		    mbDiscountEnable: '='
		},
		link: postLink,
		require: ['ngModel']
	    };
	});

/* 
 * The MIT License (MIT)
 * 
 * Copyright (c) 2016 weburger
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


angular
.module('mblowfish-core')
/**
 * @ngdoc Directives
 * @name mb-preference-page
 * @description Preference page
 * 
 * Preference page
 * 
 */
.directive('mbPreferencePage', function ($compile, $controller, $preferences, $wbUtil,
        $rootScope, $mdTheming) {

    var bodyElementSelector = 'div#mb-preference-body';
    var placeholderElementSelector = 'div#mb-preference-placeholder';
    /**
     * 
     */
    function loadPreference($scope, page, anchor) {
        // 1- create scope
        var childScope = $scope.$new(false, $scope);
        // legacy
        childScope.app = $rootScope.__app;
        // New
        childScope.__app = $rootScope.__app;
        childScope.__tenant = $rootScope.__tenant;
        childScope.__account = $rootScope.__account;
        // childScope.wbModel = model;

        // 2- create element
        $wbUtil.getTemplateFor(page)
        .then(function (template) {
            var element = angular.element(template);

            // 3- bind controller
            var link = $compile(element);
            if (angular.isDefined(page.controller)) {
                var locals = {
                        $scope: childScope,
                        $element: element
                        // TODO: maso, 2018:
                };
                var controller = $controller(
                        page.controller, locals);
                if (page.controllerAs) {
                    childScope[page.controllerAs] = controller;
                }
                element.data('$ngControllerController', controller);
            }

            // Load preferences
            anchor.empty();
            anchor.append(link(childScope));
            
            $mdTheming(element);
        });
    }

    /**
     * Adding preloader.
     * 
     * @param scope
     * @param element
     * @param attr
     * @returns
     */
    function postLink(scope, element) {
        // Get Anchor
        var _anchor = element; //
//      .children(bodyElementSelector) //
//      .children(placeholderElementSelector);
        // TODO: maso, 2018: check auncher exist
        scope.$watch('mbPreferenceId', function (id) {
            if (id) {
                $preferences.page(id)
                .then(function (page) {
                    loadPreference(scope, page, _anchor);
                }, function () {
                    // TODO: maso, 2017: handle errors
                });
            }
        });
    }

    return {
        restrict: 'E',
        templateUrl: 'views/directives/mb-preference-page.html',
        replace: true,
        scope: {
            mbPreferenceId: '='
        },
        link: postLink
    };
});
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


angular.module('mblowfish-core')

/**
 * @ngdoc Directives
 * @name mb-preloading
 * @description Show a preloading of a module
 * 
 * The mb-preload-animate is added to element automatically to add user
 * animation.
 * 
 * The class mb-preload is added if the value of the directive is true.
 * 
 * @example To add preload:
 * 
 * <pre><code>
 *  	&lt;div mb-preload=&quot;preloadState&quot;&gt; DIV content &lt;/div&gt;
 * </code></pre>
 * 
 * 
 * User can define a custom class to add at preload time.
 * 
 * @example Custom preload class
 * 
 * <pre><code>
 *  	&lt;div mb-preload=&quot;preloadState&quot; mb-preload-class=&quot;my-class&quot;&gt; DIV content &lt;/div&gt;
 * </code></pre>
 * 
 */
.directive('mbPreloading', function(/*$animate*/) {
	var PRELOAD_CLASS = 'mb-preload';
	var PRELOAD_ANIMATION_CLASS = 'mb-preload-animate';

	/*
	 * Init element for preloading
	 */
	function initPreloading(scope, element/*, attr*/) {
		element.addClass(PRELOAD_ANIMATION_CLASS);
	}

	/*
	 * Remove preloading
	 */
	function removePreloading(scope, element, attr) {
		if (attr.mbPreloadingClass) {
			element.addClass(attr.mbPreloadingClass);
		}
		element.removeClass(PRELOAD_CLASS);
	}

	/*
	 * Adding preloading
	 */
	function addPreloading(scope, element, attr) {
		if (attr.mbPreloadingClass) {
			element.addClass(attr.mbPreloadingClass);
		}
		element.addClass(PRELOAD_CLASS);
	}

	/*
	 * Post linking
	 */
	function postLink(scope, element, attr) {
		initPreloading(scope, element, attr);
		scope.$watch(function(){
			return scope.$eval(attr.mbPreloading);
		}, function(value) {
			if (!value) {
				removePreloading(scope, element, attr);
			} else {
				addPreloading(scope, element, attr);
			}
		});
	}

	return {
		restrict : 'A',
		link : postLink
	};
});

/*
 * Copyright (c) 2015 Phoenix Scholars Co. (http://dpq.co.ir)
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


/**
 * @ngdoc Directives
 * @name mb-titled-block
 * @descritpion Title block
 *
 *
 */
angular.module('mblowfish-core').directive('mbTitledBlock', function() {
	return {
		replace: true,
		restrict: 'E',
		transclude: true,
		scope: {
			mbTitle: '@?',
			mbIcon: '@?',
			mbProgress: '<?',
			mbMoreActions: '='
		},
		/*
		 * فهرستی از عمل‌هایی که می‌خواهیم به این نوار ابزار اضافه کنیم
		 */

		templateUrl: 'views/directives/mb-titled-block.html'
	};
});

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



angular.module('mblowfish-core')

/**
 * @ngdoc Directives
 * @name mb-tree-heading
 * @description Tree heading
 * 
 * Display tree heading
 * 
 */
.directive('mbTreeHeading', function(/*$animate*/) {
	return {
        restrict: 'E',
        replace: true,
        scope: {
            mbSection: '='
        },
		templateUrl: 'views/directives/mb-tree-heading.html'
	};
});

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



angular.module('mblowfish-core')

/**
 * @ngdoc Directives
 * @name mb-tree-link
 * @description Tree link
 * 
 * Display and link section item
 * 
 */
.directive('mbTreeLink', function() {
	return {
		restrict : 'E',
		scope: {
			mbSection: '='
		},
		templateUrl: 'views/directives/mb-tree-link.html',
		controller : function($scope, $navigator) {
			/**
			 * Check if page is selected.
			 * 
			 * Selection is implemented in the Tree, so if the item is not placed in
			 * a tree the result is false.
			 * 
			 * @return the selection state of the page
			 * @param page address for example /user/profile
			 */
			$scope.isSelected = function(section) {
				return section && $navigator.isPageSelected(section.link);
			};

			/**
			 * Run action of section
			 */
			$scope.focusSection = function(section) {
				// XXX: maso, 2017: check action call
				return $navigator.openPage(section.link);
			};
		}
	};
});

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



angular.module('mblowfish-core')

/**
 * @ngdoc Directives
 * @name mb-tree-toggle
 * @description Tree toggle
 * 
 * Display tree toggle
 * 
 */
.directive('mbTreeToggle', function($timeout, $animateCss, $mdSidenav, $mdMedia, $rootScope) {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            mbSection: '='
        },
        templateUrl: 'views/directives/mb-tree-toggle.html',
        link: function($scope, $element, $attr, $ctrl) {
            var _el_ul = $element.find('ul');

            var getTargetHeight = function() {
                var _targetHeight;

                _el_ul.addClass('no-transition');
                _el_ul.css('height', '');

                _targetHeight = _el_ul.prop('clientHeight');

                _el_ul.css('height', 0);
                _el_ul.removeClass('no-transition');

                return _targetHeight;
            };

            if (!_el_ul) {
//              return console.warn('mb-tree: `menuToggle` cannot find ul element');
                return;
            }



            function toggleMenu(open) {
//              if (!$mdMedia('gt-sm') && !$mdSidenav('left').isOpen() && open) {
//              return;
//              }
                $animateCss(_el_ul, {
                    from: {
                        height: open ? 0 : (getTargetHeight() + 'px')
                    },
                    to: {
                        height: open ? (getTargetHeight() + 'px') : 0
                    },
                    duration: 0.3
                }).start();
            }

            $scope.$watch(function() {
                return $ctrl.isOpen($scope.mbSection);
            }, function(open) {
                $timeout(function(){
                    toggleMenu(open);
                }, 0, false);
            });
        },
        controller : function($scope) {
            // Current section
            var openedSection = null;

            /**
             * Check if the opened section is the section.
             */
            function isOpen(section) {
                return openedSection === section;
            }

            /**
             * Toggle opened section
             * 
             * We just put the section in the tree openedSection and update all
             * UI.
             */
            function toggle(section) {
                openedSection = (openedSection === section) ? null : section;
            }

            /**
             * Checks if the section is visible
             */
            function isVisible(section){
                if(!section){
                    for(var i = 0; i < $scope.mbSection.sections.length; i++){
                        if(!$rootScope.$eval($scope.mbSection.sections[i].hidden)){
                            return true;
                        }
                    }
                    return false;
                }
                if(section.hidden){
                    return !$rootScope.$eval(section.hidden);
                }
                return true;
            }

            /*
             * Init scope
             */
            if(angular.isFunction($scope.$parent.isOpen)){
                $scope.isOpen = $scope.$parent.isOpen;
                $scope.toggle = $scope.$parent.toggle;
            } else {
                $scope.isOpen = isOpen;
                $scope.toggle = toggle;
            }

            this.isOpen = $scope.isOpen;

            $scope.isVisible = isVisible;

//          $scope.$on('SS_SIDENAV_FORCE_SELECTED_ITEM', function (event, args) {
//          if ($scope.section && $scope.section.pages) {
//          for (var i = $scope.section.pages.length - 1; i >= 0; i--) {
//          var _e = $scope.section.pages[i];
            //
//          if (args === _e.id) {
//          $scope.toggle($scope.section);
//          $state.go(_e.state);
//          }
//          };
//          }
//          });
        }
    };
});

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



angular.module('mblowfish-core')

/**
 * @ngdoc Directives
 * @name mb-tree
 * @description Tree
 * 
 * Display tree menu
 * 
 */
.directive('mbTree', function($animate, $rootScope) {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            mbSection: '='
        },
        templateUrl: 'views/directives/mb-tree.html',
        link: function($scope, $element) {
            // TODO: maso, 2017:
            /**
             * Checks if the section is visible
             */
            function isVisible(section){
                if(!$element.has('li').length){
                    return false;
                }
                if(section.hidden){
                    return !$rootScope.$eval(section.hidden);
                }
                return true;
            }
            $scope.isVisible = isVisible;
        },
        controller : function($scope) {
            // Current section
            var openedSection = null;


            /**
             * Check if the opened section is the section.
             */
            function isOpen(section) {
                return openedSection === section;
            }

            /**
             * Toggle opened section
             * 
             * We just put the section in the tree openedSection and update all
             * UI.
             */
            function toggle(section) {
                openedSection = (openedSection === section) ? null : section;
            }

            $scope.isOpen = isOpen;
            $scope.toggle = toggle;
        }
    };
});

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



angular.module('mblowfish-core')

/**
 * @ngdoc Directives
 * @name mb-user-menu
 * @restrict E
 * @description Display global user menu
 * 
 * Load current user action into the scope. It is used to show user menu
 * in several parts of the system.
 */
.directive('mbUserMenu', function($actions, $app, $mdSidenav) {
	/**
	 * Post link 
	 */
	function postLink($scope) {
		// maso, 2017: Get user menu
		$scope.menu = $actions.group('mb.user');
		$scope.logout = $app.logout;
		$scope.settings = function(){
			return $mdSidenav('settings').toggle();
		};
	}
	
	return {
		restrict: 'E',
		replace: true,
		scope: true,
		templateUrl: 'views/directives/mb-user-menu.html',
		link: postLink,
		controller : 'MbAccountCtrl'
	};
});

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



angular.module('mblowfish-core')

/**
 * @ngdoc Directives
 * @name mb-user-toolbar
 * @description User toolbar
 * 
 * Display tree menu
 * 
 */
.directive('mbUserToolbar', function($actions) {
	return {
		restrict: 'E',
		replace: true,
		templateUrl: 'views/directives/mb-user-toolbar.html',
		link: function($scope) {
			$scope.menu = $actions.group('mb.user');
		},
		controller : 'MbAccountCtrl'
	};
});

/*
 * Copyright (c) 2015-2025 Phoinex Scholars Co. http://dpq.co.ir
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the 'Software'), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */
/**
 * @ngdoc directive
 * @name mbView
 * @restrict ECA
 *
 * @description
 * `mbView` is a directive that complements the {@link ngRoute.$route $route} service by
 * including the rendered template of the current route into the main layout (`index.html`) file.
 * Every time the current route changes, the included view changes with it according to the
 * configuration of the `$route` service.
 *
 * Requires the {@link ngRoute `ngRoute`} module to be installed.
 *
 * @animations
 * | Animation                        | Occurs                              |
 * |----------------------------------|-------------------------------------|
 * | {@link ng.$animate#enter enter}  | when the new element is inserted to the DOM |
 * | {@link ng.$animate#leave leave}  | when the old element is removed from to the DOM  |
 *
 * The enter and leave animation occur concurrently.
 *
 * @scope
 * @priority 400
 * @param {string=} onload Expression to evaluate whenever the view updates.
 *
 * @param {string=} autoscroll Whether `mbView` should call {@link ng.$anchorScroll
 *                  $anchorScroll} to scroll the viewport after the view is updated.
 *
 *                  - If the attribute is not set, disable scrolling.
 *                  - If the attribute is set without value, enable scrolling.
 *                  - Otherwise enable scrolling only if the `autoscroll` attribute value evaluated
 *                    as an expression yields a truthy value.
 * @example
    <example name="mbView-directive" module="mbViewExample"
             deps="angular-route.js;angular-animate.js"
             animations="true" fixBase="true">
      <file name="index.html">
        <div ng-controller="MainCtrl as main">
          Choose:
          <a href="Book/Moby">Moby</a> |
          <a href="Book/Moby/ch/1">Moby: Ch1</a> |
          <a href="Book/Gatsby">Gatsby</a> |
          <a href="Book/Gatsby/ch/4?key=value">Gatsby: Ch4</a> |
          <a href="Book/Scarlet">Scarlet Letter</a><br/>

          <div class="view-animate-container">
            <div ng-view class="view-animate"></div>
          </div>
          <hr />

          <pre>$location.path() = {{main.$location.path()}}</pre>
          <pre>$route.current.templateUrl = {{main.$route.current.templateUrl}}</pre>
          <pre>$route.current.params = {{main.$route.current.params}}</pre>
          <pre>$routeParams = {{main.$routeParams}}</pre>
        </div>
      </file>

      <file name="book.html">
        <div>
          controller: {{book.name}}<br />
          Book Id: {{book.params.bookId}}<br />
        </div>
      </file>

      <file name="chapter.html">
        <div>
          controller: {{chapter.name}}<br />
          Book Id: {{chapter.params.bookId}}<br />
          Chapter Id: {{chapter.params.chapterId}}
        </div>
      </file>

      <file name="animations.css">
        .view-animate-container {
          position:relative;
          height:100px!important;
          background:white;
          border:1px solid black;
          height:40px;
          overflow:hidden;
        }

        .view-animate {
          padding:10px;
        }

        .view-animate.ng-enter, .view-animate.ng-leave {
          transition:all cubic-bezier(0.250, 0.460, 0.450, 0.940) 1.5s;

          display:block;
          width:100%;
          border-left:1px solid black;

          position:absolute;
          top:0;
          left:0;
          right:0;
          bottom:0;
          padding:10px;
        }

        .view-animate.ng-enter {
          left:100%;
        }
        .view-animate.ng-enter.ng-enter-active {
          left:0;
        }
        .view-animate.ng-leave.ng-leave-active {
          left:-100%;
        }
      </file>

      <file name="script.js">
        angular.module('mbViewExample', ['ngRoute', 'ngAnimate'])
          .config(['$routeProvider', '$locationProvider',
            function($routeProvider, $locationProvider) {
              $routeProvider
                .when('/Book/:bookId', {
                  templateUrl: 'book.html',
                  controller: 'BookCtrl',
                  controllerAs: 'book'
                })
                .when('/Book/:bookId/ch/:chapterId', {
                  templateUrl: 'chapter.html',
                  controller: 'ChapterCtrl',
                  controllerAs: 'chapter'
                });

              $locationProvider.html5Mode(true);
          }])
          .controller('MainCtrl', ['$route', '$routeParams', '$location',
            function MainCtrl($route, $routeParams, $location) {
              this.$route = $route;
              this.$location = $location;
              this.$routeParams = $routeParams;
          }])
          .controller('BookCtrl', ['$routeParams', function BookCtrl($routeParams) {
            this.name = 'BookCtrl';
            this.params = $routeParams;
          }])
          .controller('ChapterCtrl', ['$routeParams', function ChapterCtrl($routeParams) {
            this.name = 'ChapterCtrl';
            this.params = $routeParams;
          }]);

      </file>

      <file name="protractor.js" type="protractor">
        it('should load and compile correct template', function() {
          element(by.linkText('Moby: Ch1')).click();
          var content = element(by.css('[ng-view]')).getText();
          expect(content).toMatch(/controller: ChapterCtrl/);
          expect(content).toMatch(/Book Id: Moby/);
          expect(content).toMatch(/Chapter Id: 1/);

          element(by.partialLinkText('Scarlet')).click();

          content = element(by.css('[ng-view]')).getText();
          expect(content).toMatch(/controller: BookCtrl/);
          expect(content).toMatch(/Book Id: Scarlet/);
        });
      </file>
    </example>
 */


/**
 * @ngdoc event
 * @name mbView#$viewContentLoaded
 * @eventType emit on the current mbView scope
 * @description
 * Emitted every time the mbView content is reloaded.
 */
angular.module('mblowfish-core')
.directive('mbView', function (
		$templateRequest, $compile, $controller,
		$route, $dispatcher, $app) {
	return {
		restrict: 'ECA',
		terminal: true,
		priority: 400,
		templateUrl: 'views/partials/mb-view-loading.html',
		link: function(scope, $element, attr) {
			// Variables
			var currentScope,
			onloadExp = attr.onload || '',
			mainElement = null;;

			// staso, 2019: fire the state is changed
			$dispatcher.on('/app/state', checkApp);
			scope.$on('$destroy',function(){
				$dispatcher.off('/app/state', update);
			});
			
			function checkApp(){
				if($app.getState() === 'ready'){
					scope.$on('$routeChangeSuccess', update);
					loadMainView()
					.then(update);
				}
			}
			
			function loadMainView(){
				return $templateRequest('views/partials/mb-view-main.html')
				.then(function(template){
					$element.html(template);
					var link = $compile($element.contents());
					link(scope);
					mainElement = $element.find('#mb-view-main-anchor');
				});
			}

			function cleanupLastView() {
				if (currentScope) {
					currentScope.$destroy();
					currentScope = null;
				}
//				$element.empty();
			}

			function update() {
				var locals = $route.current && $route.current.locals,
				template = locals && locals.$template;

				cleanupLastView();
				if (angular.isDefined(template)) {
					var newScope = scope.$new();
					var current = $route.current;
					
					mainElement.html(template);
					var link = $compile(mainElement.contents());
					if (current.controller) {
						locals.$scope = scope;
						var controller = $controller(current.controller, locals);
						if (current.controllerAs) {
							scope[current.controllerAs] = controller;
						}
						mainElement.data('$ngControllerController', controller);
						mainElement.children()
							.data('$ngControllerController', controller);
					}
					scope[current.resolveAs || '$resolve'] = locals;
					link(newScope);
					
					currentScope = current.scope = newScope;
					currentScope.$emit('$viewContentLoaded');
					currentScope.$eval(onloadExp);
				}
			}
		}
	};
});



/* 
 * The MIT License (MIT)
 * 
 * Copyright (c) 2016 weburger
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


angular.module('mblowfish-core')
/**
 * @ngdoc Directives
 * @name ngSrcError
 * @description Handle ngSrc error
 * 
 * 
 * For example if you are about to set image of a user
 * 
 * @example
 * TO check if the directive works:
 ```html
 <img 
    alt="Test avatar" 
    ng-src="/this/path/dose/not/exist"
    ng-src-error="https://www.gravatar.com/avatar/{{ 'avatar id' | wbsha1}}?d=identicon&size=32">
 ```
 * @example
 * In this example we show an account avatar or a random from avatar generator
 ```html
  <img 
      ng-src="/api/v2/user/accounts/{{account.id}}/avatar"
      ng-src-error="https://www.gravatar.com/avatar/{{account.id}}?">
  ```
 */
.directive('ngSrcError', function () {
    return {
        link : function (scope, element, attrs) {
            element.bind('error', function () {
                if (attrs.src !== attrs.ngSrcError) {
                    attrs.$set('src', attrs.ngSrcError);
                }
            });
        }
    };
});
/* 
 * The MIT License (MIT)
 * 
 * Copyright (c) 2016 weburger
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


/**
 * @ngdoc Directives
 * @name wb-icon
 * @description Icon for WB
 */
angular.module('mblowfish-core').directive('wbIcon', function(wbIconService, $interpolate) {
	// FORMAT
	var template = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="{{icon.viewbox}}" width="{{icon.size}}" height="{{icon.size}}">{{{icon.shape}}}</svg>';
	// REPLACE FORMAT
	var replaceTemplate = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="{{icon.viewbox}}" width="{{icon.size}}" height="{{icon.size}}"><g id="{{icon.name}}" style="display:none">{{{icon.shape}}}</g><g id="{{old.name}}" style="display:none">{{{old.shape}}}</g></svg>';

	// optimize pars
	Mustache.parse(template);
	Mustache.parse(replaceTemplate);

	var shapes = wbIconService.getShapes();

	function postLink(scope, element, attr, ctrls, transclude) {
		// icon information
		var icon = {
			name: 'help',
			viewbox: '0 0 24 24',
			size: 24,
		};
		// Counter
		var renderCount = 0;


		/*
		 * Sets icon and render the shape
		 */
		function setIcon(iconName) {
			var tempIcon = _.clone(icon);
			// icon
			if (iconName !== undefined) {
				tempIcon.name = iconName;
				// Check for material-design-icons style name, and extract icon / size
				var ss = iconName.match(/ic_(.*)_([0-9]+)px.svg/m);
				if (ss !== null) {
					tempIcon.name = ss[1];
					tempIcon.size = ss[2];
				}
			}

			render(tempIcon);
		}

		//        function setViewBox(viewBox){
		//            // viewBox
		//            if (attr.viewBox !== undefined) {
		//                viewBox = attr.viewBox;
		//            } else {
		//                viewBox = wbIconService.getViewBox(icon) ? wbIconService.getViewBox(icon) : '0 0 24 24';
		//            }
		//            render();
		//            return viewBox;
		//        }

		function setSize(newsize) {
			if (newsize === icon.size) {
				return;
			}
			var tempIcon = _.clone(icon);
			tempIcon.size = newsize;
			render(tempIcon);
		}

		function render(newIcon) {
			// check for new changes
			if (renderCount && newIcon.name === icon.name &&
				newIcon.size === icon.size &&
				newIcon.viewbox === icon.viewbox) {
				return;
			}
			newIcon.shape = shapes[newIcon.name];
			if (renderCount && window.SVGMorpheus) {
				// this block will succeed if SVGMorpheus is available
				var options = JSON.parse(attr.options || '{}');
				element.html(Mustache.render(replaceTemplate, {
					icon: newIcon,
					old: icon
				}));
				new SVGMorpheus(element.children()[0]).to(newIcon, options);
			} else {
				element.html(Mustache.render(template, {
					icon: newIcon
				}));
			}

			icon = newIcon;
			renderCount++;
		}

		// watch for any changes
		if (attr.icon !== undefined) {
			attr.$observe('icon', setIcon);
		} else if (attr.wbIconName !== undefined) {
			attr.$observe('wbIconName', setIcon);
		} else {
			transclude(scope, function(clone) {
				var text = clone.text();
				if (text && text.trim()) {
					scope.$watch(function() {
						return $interpolate(text.trim())(scope);
					}, setIcon);
				}
			});
		}
		if (attr.size !== undefined) {
			attr.$observe('size', setSize);
		}
	}

	return {
		restrict: 'AE',
		transclude: true,
		link: postLink,
		replace: false
	};
});

angular.module('mblowfish-core').directive('mdIconFloat', function($mdTheming) {

	var INPUT_TAGS = ['INPUT', 'TEXTAREA', 'SELECT',
		'MD-SELECT'];

	var LEFT_SELECTORS = INPUT_TAGS.reduce(
		function(selectors, isel) {
			return selectors.concat(['wb-icon ~ ' + isel, '.wb-icon ~ ' + isel]);
		}, []).join(',');

	var RIGHT_SELECTORS = INPUT_TAGS.reduce(
		function(selectors, isel) {
			return selectors.concat([isel + ' ~ wb-icon', isel + ' ~ .wb-icon']);
		}, []).join(',');

	function compile(tElement) {
		// Check for both a left & right icon
		var leftIcon = tElement[0]
			.querySelector(LEFT_SELECTORS);
		var rightIcon = tElement[0]
			.querySelector(RIGHT_SELECTORS);

		if (leftIcon) {
			tElement.addClass('md-icon-left');
		}
		if (rightIcon) {
			tElement.addClass('md-icon-right');
		}

		return function postLink(scope, element) {
			$mdTheming(element);
		};
	}

	return {
		restrict: 'C',
		compile: compile
	};
});

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


angular.module('mblowfish-core')

/**
 * @ngdoc Directives
 * @name wb-on-dragstart
 * @description Call an action on dragstart
 * 
 */
.directive('wbOnDragstart', function() {
    return {
        restrict : 'A',
        link : function(scope, element, attrs) {
            element.bind('dragstart', function(event, data) {
                // call the function that was passed
                if (attrs.wbOnDragstart) {
                    scope.$eval(attrs.wbOnDragstart, {
                        $event: event,
                        $element: element,
                        $data: data
                    });
                }
            });
        }
    };
});

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


angular.module('mblowfish-core')

/**
 * @ngdoc Directives
 * @name wb-on-enter
 * @description Call an action on ENTER
 * 
 * ```
 * <input
 *  wb-on-enter="toast('ESC')">
 * ```
 */
.directive('wbOnEnter', function() {
    return function(scope, elm, attr) {
        elm.bind('keypress', function(e) {
            if (e.keyCode === 13) {
                scope.$apply(attr.wbOnEnter);
            }
        });
    };
});
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


angular.module('mblowfish-core')

/**
 * @ngdoc Directives
 * @name wb-on-error
 * @description Call an action on error
 * 
 * This directive is used to run an action on error of an element
 * 
 * ```
 * <img
 * 	wb-on-error="toast('image is not loaded')"
 * 	href="image/path">
 * ```
 */
.directive('wbOnError', function() {
    return {
        restrict : 'A',
        link : function(scope, element, attrs) {
            element.bind('error', function() {
                // call the function that was passed
                if (attrs.wbOnError) {
                    scope.$apply(attrs.wbOnError);
                }
            });
        }
    };
});

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


angular.module('mblowfish-core')

/**
 * @ngdoc Directives
 * @name wb-on-esc
 * @description Call an action on ESC
 * 
 * ```
 * <input
 *  wb-on-esc="toast('ESC')">
 * ```
 */
.directive('wbOnEsc', function() {
    return function(scope, elm, attr) {
        elm.bind('keydown', function(e) {
            if (e.keyCode === 27) {
                scope.$apply(attr.wbOnEsc);
            }
        });
    };
});


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


angular.module('mblowfish-core')

/**
 * @ngdoc Directives
 * @name wb-on-load
 * @description Call an action on load
 * 
 * This directive is used to run an action on load of an element. For exmaple
 * use to show alert on load of image:
 * 
 * ```
 * <img
 * 	wb-on-load="toast('image is loaded')"
 * 	href="image/path">
 * ```
 */
.directive('wbOnLoad', function() {
    return {
        restrict : 'A',
        link : function(scope, element, attrs) {
            element.bind('load', function(event, data) {
                // call the function that was passed
                if (attrs.wbOnLoad) {
                    scope.$eval(attrs.wbOnLoad, {
                        $event: event,
                        $element: element,
                        $data: data
                    });
                }
            });
        }
    };
});




angular.module('mblowfish-core')
/**
 * @ngdoc directive
 * @name mdExpansionPanelCollapsed
 * @module material.components.expansionPanels
 *
 * @restrict E
 *
 * @description
 * `mdExpansionPanelCollapsed` is used to contain content when the panel is collapsed
 **/
.directive('mdExpansionPanelCollapsed', function($animateCss, $timeout) {

	function link(scope, element, attrs, expansionPanelCtrl) {
		expansionPanelCtrl.registerCollapsed({
			show: show,
			hide: hide
		});


		element.on('click', function () {
			expansionPanelCtrl.expand();
		});


		function hide(options) {
			// set width to maintian demensions when element is set to postion: absolute
			element.css('width', element[0].offsetWidth + 'px');
			// set min height so the expansion panel does not shrink when collapsed element is set to position: absolute
			expansionPanelCtrl.$element.css('min-height', element[0].offsetHeight + 'px');

			var animationParams = {
					addClass: 'md-absolute md-hide',
					from: {opacity: 1},
					to: {opacity: 0}
			};
			if (options.animation === false) { animationParams.duration = 0; }
			$animateCss(element, animationParams)
			.start()
			.then(function () {
				element.removeClass('md-hide');
				element.css('display', 'none');
			});
		}


		function show(options) {
			element.css('display', '');
			// set width to maintian demensions when element is set to postion: absolute
			element.css('width', element[0].parentNode.offsetWidth + 'px');

			var animationParams = {
					addClass: 'md-show',
					from: {opacity: 0},
					to: {opacity: 1}
			};
			if (options.animation === false) { 
				animationParams.duration = 0; 
			
			}
			$animateCss(element, animationParams)
			.start()
			.then(function () {
				// safari will animate the min-height if transition is not set to 0
				expansionPanelCtrl.$element.css('transition', 'none');
				element.removeClass('md-absolute md-show');

				// remove width when element is no longer position: absolute
				element.css('width', '');


				// remove min height when element is no longer position: absolute
				expansionPanelCtrl.$element.css('min-height', '');
				// remove transition block on next digest
				$timeout(function () {
					expansionPanelCtrl.$element.css('transition', '');
				}, 0);
			});
		}
	}
	
	var directive = {
			restrict: 'E',
			require: '^^mdExpansionPanel',
			link: link
	};
	return directive;
});




angular.module('mblowfish-core')
/**
 * @ngdoc directive
 * @name mdExpansionPanel
 * @module material.components.expansionPanels
 *
 * @restrict E
 *
 * @description
 * `mdExpansionPanel` is the main container for panels
 *
 * @param {string=} md-component-id - add an id if you want to acces the panel via the `$mdExpansionPanel` service
 **/
.directive('mdExpansionPanel', function() {

    
    var ANIMATION_TIME = 180; //ms

    function compile(tElement, tAttrs) {
        var INVALID_PREFIX = 'Invalid HTML for md-expansion-panel: ';

        tElement.attr('tabindex', tAttrs.tabindex || '0');

        if (tElement[0].querySelector('md-expansion-panel-collapsed') === null) {
            throw Error(INVALID_PREFIX + 'Expected a child element of `md-epxansion-panel-collapsed`');
        }
        if (tElement[0].querySelector('md-expansion-panel-expanded') === null) {
            throw Error(INVALID_PREFIX + 'Expected a child element of `md-epxansion-panel-expanded`');
        }

        return function postLink(scope, element, attrs, ctrls) {
            var epxansionPanelCtrl = ctrls[0];
            var epxansionPanelGroupCtrl = ctrls[1];

            epxansionPanelCtrl.epxansionPanelGroupCtrl = epxansionPanelGroupCtrl || undefined;
            epxansionPanelCtrl.init();
        };
    }


    function controller($scope, $element, $attrs, $window, $$rAF, $mdConstant, $mdUtil, $mdComponentRegistry, $timeout, $q, $animate) {
        /* jshint validthis: true */
        var vm = this;

        var collapsedCtrl;
        var expandedCtrl;
        var headerCtrl;
        var footerCtrl;
        var deregister;
        var scrollContainer;
        var topKiller;
        var resizeKiller;
        var onRemoveCallback;
        var transformParent;
        var backdrop;
        var inited = false;
        var registerOnInit = false;
        var _isOpen = false;
        var isDisabled = false;
        var debouncedUpdateScroll = $$rAF.throttle(updateScroll);
        var debouncedUpdateResize = $$rAF.throttle(updateResize);

        vm.registerCollapsed = function (ctrl) {
            collapsedCtrl = ctrl;
        };
        vm.registerExpanded = function (ctrl) {
            expandedCtrl = ctrl;
        };
        vm.registerHeader = function (ctrl) {
            headerCtrl = ctrl;
        };
        vm.registerFooter = function (ctrl) {
            footerCtrl = ctrl;
        };



        if ($attrs.mdComponentId === undefined) {
            $attrs.$set('mdComponentId', '_expansion_panel_id_' + $mdUtil.nextUid());
            registerPanel();
        } else {
            $attrs.$observe('mdComponentId', function () {
                registerPanel();
            });
        }

        vm.$element = $element;
        vm.expand = expand;
        vm.collapse = collapse;
        vm.remove = remove;
        vm.destroy = destroy;
        vm.onRemove = onRemove;
        vm.init = init;

        if ($attrs.ngDisabled !== undefined) {
            $scope.$watch($attrs.ngDisabled, function (value) {
                isDisabled = value;
                $element.attr('tabindex', isDisabled ? -1 : 0);
            });
        } else if ($attrs.disabled !== undefined) {
            isDisabled = ($attrs.disabled !== undefined && $attrs.disabled !== 'false' && $attrs.disabled !== false);
            $element.attr('tabindex', isDisabled ? -1 : 0);
        }

        $element
        .on('focus', function (/*ev*/) {
            $element.on('keydown', handleKeypress);
        })
        .on('blur', function (/*ev*/) {
            $element.off('keydown', handleKeypress);
        });

        $element.addClass('md-whiteframe-1dp');

        function handleKeypress(ev) {
            var keyCodes = $mdConstant.KEY_CODE;
            switch (ev.keyCode) {
            case keyCodes.ENTER:
                expand();
                break;
            case keyCodes.ESCAPE:
                collapse();
                break;
            }
        }


        $scope.$panel = {
                collapse: collapse,
                expand: expand,
                remove: remove,
                isOpen: isOpen
        };

        $scope.$on('$destroy', function () {
            removeClickCatcher();

            // remove component from registry
            if (typeof deregister === 'function') {
                deregister();
                deregister = undefined;
            }
            killEvents();
        });





        function init() {
            inited = true;
            if (registerOnInit === true) {
                registerPanel();
            }
        }


        function registerPanel() {
            if (inited === false) {
                registerOnInit = true;
                return;
            }

            // deregister if component was already registered
            if (typeof deregister === 'function') {
                deregister();
                deregister = undefined;
            }
            // remove component from group ctrl if component was already added
            if (vm.componentId && vm.epxansionPanelGroupCtrl) {
                vm.epxansionPanelGroupCtrl.removePanel(vm.componentId);
            }

            // if componentId was removed then set one
            if ($attrs.mdComponentId === undefined) {
                $attrs.$set('mdComponentId', '_expansion_panel_id_' + $mdUtil.nextUid());
            }

            vm.componentId = $attrs.mdComponentId;
            deregister = $mdComponentRegistry.register({
                expand: expand,
                collapse: collapse,
                remove: remove,
                onRemove: onRemove,
                isOpen: isOpen,
                addClickCatcher: addClickCatcher,
                removeClickCatcher: removeClickCatcher,
                componentId: $attrs.mdComponentId
            }, $attrs.mdComponentId);

            if (vm.epxansionPanelGroupCtrl) {
                vm.epxansionPanelGroupCtrl.addPanel(vm.componentId, {
                    expand: expand,
                    collapse: collapse,
                    remove: remove,
                    onRemove: onRemove,
                    destroy: destroy,
                    isOpen: isOpen
                });
            }
        }


        function isOpen() {
            return _isOpen;
        }

        function expand(options) {
            if (_isOpen === true || isDisabled === true) {
                return;
            }
            _isOpen = true;
            options = options || {};

            var deferred = $q.defer();

            if (vm.epxansionPanelGroupCtrl) {
                vm.epxansionPanelGroupCtrl.expandPanel(vm.componentId);
            }

            $element.removeClass('md-close');
            $element.addClass('md-open');
            if (options.animation === false) {
                $element.addClass('md-no-animation');
            } else {
                $element.removeClass('md-no-animation');
            }

            initEvents();
            collapsedCtrl.hide(options);
            expandedCtrl.show(options);

            if (headerCtrl) {
                headerCtrl.show(options);
            }
            if (footerCtrl) {
                footerCtrl.show(options);
            }

            $timeout(function () {
                deferred.resolve();
            }, options.animation === false ? 0 : ANIMATION_TIME);
            return deferred.promise;
        }


        function collapse(options) {
            if (_isOpen === false) {
                return;
            }
            _isOpen = false;
            options = options || {};

            var deferred = $q.defer();

            $element.addClass('md-close');
            $element.removeClass('md-open');
            if (options.animation === false) {
                $element.addClass('md-no-animation');
            } else {
                $element.removeClass('md-no-animation');
            }

            killEvents();
            collapsedCtrl.show(options);
            expandedCtrl.hide(options);

            if (headerCtrl) {
                headerCtrl.hide(options);
            }
            if (footerCtrl) {
                footerCtrl.hide(options);
            }

            $timeout(function () {
                deferred.resolve();
            }, options.animation === false ? 0 : ANIMATION_TIME);
            return deferred.promise;
        }


        function remove(options) {
            options = options || {};
            var deferred = $q.defer();

            if (vm.epxansionPanelGroupCtrl) {
                vm.epxansionPanelGroupCtrl.removePanel(vm.componentId);
            }

            if (typeof deregister === 'function') {
                deregister();
                deregister = undefined;
            }

            if (options.animation === false || _isOpen === false) {
                $scope.$destroy();
                $element.remove();
                deferred.resolve();
                callbackRemove();
            } else {
                collapse();
                $timeout(function () {
                    $scope.$destroy();
                    $element.remove();
                    deferred.resolve();
                    callbackRemove();
                }, ANIMATION_TIME);
            }

            return deferred.promise;
        }

        function onRemove(callback) {
            onRemoveCallback = callback;
        }

        function callbackRemove() {
            if (typeof onRemoveCallback === 'function') {
                onRemoveCallback();
                onRemoveCallback = undefined;
            }
        }

        function destroy() {
            $scope.$destroy();
        }



        function initEvents() {
            if ((!footerCtrl || footerCtrl.noSticky === true) && (!headerCtrl || headerCtrl.noSticky === true)) {
                return;
            }

            // watch for panel position changes
            topKiller = $scope.$watch(function () {
                return $element[0].offsetTop;
            }, debouncedUpdateScroll, true);

            // watch for panel position changes
            resizeKiller = $scope.$watch(function () {
                return $element[0].offsetWidth;
            }, debouncedUpdateResize, true);

            // listen to md-content scroll events id we are nested in one
            scrollContainer = $mdUtil.getNearestContentElement($element);
            if (scrollContainer.nodeName === 'MD-CONTENT') {
                transformParent = getTransformParent(scrollContainer);
                angular.element(scrollContainer).on('scroll', debouncedUpdateScroll);
            } else {
                transformParent = undefined;
            }

            // listen to expanded content scroll if height is set
            if (expandedCtrl.setHeight === true) {
                expandedCtrl.$element.on('scroll', debouncedUpdateScroll);
            }

            // listen to window scroll events
            angular.element($window)
            .on('scroll', debouncedUpdateScroll)
            .on('resize', debouncedUpdateScroll)
            .on('resize', debouncedUpdateResize);
        }


        function killEvents() {
            if (typeof topKiller === 'function') {
                topKiller();
                topKiller = undefined;
            }

            if (typeof resizeKiller === 'function') {
                resizeKiller();
                resizeKiller = undefined;
            }

            if (scrollContainer && scrollContainer.nodeName === 'MD-CONTENT') {
                angular.element(scrollContainer).off('scroll', debouncedUpdateScroll);
            }

            if (expandedCtrl.setHeight === true) {
                expandedCtrl.$element.off('scroll', debouncedUpdateScroll);
            }

            angular.element($window)
            .off('scroll', debouncedUpdateScroll)
            .off('resize', debouncedUpdateScroll)
            .off('resize', debouncedUpdateResize);
        }



        function getTransformParent(el) {
            var parent = el.parentNode;

            while (parent && parent !== document) {
                if (hasComputedStyle(parent, 'transform')) {
                    return parent;
                }
                parent = parent.parentNode;
            }

            return undefined;
        }

        function hasComputedStyle(target, key) {
            var hasValue = false;

            if (target) {
                var computedStyles = $window.getComputedStyle(target);
                hasValue = computedStyles[key] !== undefined && computedStyles[key] !== 'none';
            }

            return hasValue;
        }


        function updateScroll(/*e*/) {
            var top;
            var bottom;
            var bounds;
            if (expandedCtrl.setHeight === true) {
                bounds = expandedCtrl.$element[0].getBoundingClientRect();
            } else {
                bounds = scrollContainer.getBoundingClientRect();
            }
            var transformTop = transformParent ? transformParent.getBoundingClientRect().top : 0;

            // we never want the header going post the top of the page. to prevent this don't allow top to go below 0
            top = Math.max(bounds.top, 0);
            bottom = top + bounds.height;

            if (footerCtrl && footerCtrl.noSticky === false) {
                footerCtrl.onScroll(top, bottom, transformTop);
            }
            if (headerCtrl && headerCtrl.noSticky === false) {
                headerCtrl.onScroll(top, bottom, transformTop);
            }
        }

        function updateResize() {
            var value = $element[0].offsetWidth;
            if (footerCtrl && footerCtrl.noSticky === false) {
                footerCtrl.onResize(value);
            }
            if (headerCtrl && headerCtrl.noSticky === false) {
                headerCtrl.onResize(value);
            }
        }

        function addClickCatcher(clickCallback) {
            backdrop = $mdUtil.createBackdrop($scope);
            backdrop[0].tabIndex = -1;

            if (typeof clickCallback === 'function') {
                backdrop.on('click', clickCallback);
            }

            $animate.enter(backdrop, $element.parent(), null, {duration: 0});
            $element.css('z-index', 60);
        }

        function removeClickCatcher() {
            if (backdrop) {
                backdrop.remove();
                backdrop.off('click');
                backdrop = undefined;
                $element.css('z-index', '');
            }
        }
    }



    return {
        restrict: 'E',
        require: ['mdExpansionPanel', '?^^mdExpansionPanelGroup'],
        scope: true,
        compile: compile,
        controller: ['$scope', '$element', '$attrs', '$window', '$$rAF', '$mdConstant', '$mdUtil', '$mdComponentRegistry', '$timeout', '$q', '$animate', '$parse', controller]
    };
});






angular.module('mblowfish-core')
/**
 * @ngdoc directive
 * @name mdExpansionPanelExpanded
 * @module material.components.expansionPanels
 *
 * @restrict E
 *
 * @description
 * `mdExpansionPanelExpanded` is used to contain content when the panel is expanded
 *
 * @param {number=} height - add this aatribute set the max height of the expanded content. The container will be set to scroll
 **/
.directive('mdExpansionPanelExpanded', function ($animateCss, $timeout) {
	var directive = {
			restrict: 'E',
			require: '^^mdExpansionPanel',
			link: link
	};
	return directive;


	function link(scope, element, attrs, expansionPanelCtrl) {
		var setHeight = attrs.height || undefined;
		if (setHeight !== undefined) { setHeight = setHeight.replace('px', '') + 'px'; }

		expansionPanelCtrl.registerExpanded({
			show: show,
			hide: hide,
			setHeight: setHeight !== undefined,
			$element: element
		});




		function hide(options) {
			var height = setHeight ? setHeight : element[0].scrollHeight + 'px';
			element.addClass('md-hide md-overflow');
			element.removeClass('md-show md-scroll-y');

			var animationParams = {
					from: {'max-height': height, opacity: 1},
					to: {'max-height': '48px', opacity: 0}
			};
			if (options.animation === false) { animationParams.duration = 0; }
			$animateCss(element, animationParams)
			.start()
			.then(function () {
				element.css('display', 'none');
				element.removeClass('md-hide');
			});
		}


		function show(options) {
			element.css('display', '');
			element.addClass('md-show md-overflow');
			// use passed in height or the contents height
			var height = setHeight ? setHeight : element[0].scrollHeight + 'px';

			var animationParams = {
					from: {'max-height': '48px', opacity: 0},
					to: {'max-height': height, opacity: 1}
			};
			if (options.animation === false) { animationParams.duration = 0; }
			$animateCss(element, animationParams)
			.start()
			.then(function () {

				// if height was passed in then set div to scroll
				if (setHeight !== undefined) {
					element.addClass('md-scroll-y');
				} else {
					// safari will animate the max-height if transition is not set to 0
					element.css('transition', 'none');
					element.css('max-height', 'none');
					// remove transition block on next digest
					$timeout(function () {
						element.css('transition', '');
					}, 0);
				}

				element.removeClass('md-overflow');
			});
		}
	}
});






angular.module('mblowfish-core')
/**
 * @ngdoc directive
 * @name mdExpansionPanelFooter
 * @module material.components.expansionPanels
 *
 * @restrict E
 *
 * @description
 * `mdExpansionPanelFooter` is nested inside of `mdExpansionPanelExpanded` and contains content you want at the bottom.
 * By default the Footer will stick to the bottom of the page if the panel expands past
 * this is optional
 *
 * @param {boolean=} md-no-sticky - add this aatribute to disable sticky
 **/
.directive('mdExpansionPanelFooter', function() {
	var directive = {
			restrict: 'E',
			transclude: true,
			template: '<div class="md-expansion-panel-footer-container" ng-transclude></div>',
			require: '^^mdExpansionPanel',
			link: link
	};
	return directive;



	function link(scope, element, attrs, expansionPanelCtrl) {
		var isStuck = false;
		var noSticky = attrs.mdNoSticky !== undefined;
		var container = angular.element(element[0].querySelector('.md-expansion-panel-footer-container'));

		expansionPanelCtrl.registerFooter({
			show: show,
			hide: hide,
			onScroll: onScroll,
			onResize: onResize,
			noSticky: noSticky
		});



		function show() {

		}
		function hide() {
			unstick();
		}

		function onScroll(top, bottom, transformTop) {
			var height;
			var footerBounds = element[0].getBoundingClientRect();
			var offset;

			if (footerBounds.bottom > bottom) {
				height = container[0].offsetHeight;
				offset = bottom - height - transformTop;
				if (offset < element[0].parentNode.getBoundingClientRect().top) {
					offset = element[0].parentNode.getBoundingClientRect().top;
				}

				// set container width because element becomes postion fixed
				container.css('width', expansionPanelCtrl.$element[0].offsetWidth + 'px');

				// set element height so it does not loose its height when container is position fixed
				element.css('height', height + 'px');
				container.css('top', offset + 'px');

				element.addClass('md-stick');
				isStuck = true;
			} else if (isStuck === true) {
				unstick();
			}
		}

		function onResize(width) {
			if (isStuck === false) { return; }
			container.css('width', width + 'px');
		}


		function unstick() {
			isStuck = false;
			container.css('width', '');
			container.css('top', '');
			element.css('height', '');
			element.removeClass('md-stick');
		}
	}
});







angular.module('mblowfish-core')
/**
 * @ngdoc directive
 * @name mdExpansionPanelGroup
 * @module material.components.expansionPanels
 *
 * @restrict E
 *
 * @description
 * `mdExpansionPanelGroup` is a container used to manage multiple expansion panels
 *
 * @param {string=} md-component-id - add an id if you want to acces the panel via the `$mdExpansionPanelGroup` service
 * @param {string=} auto-expand - panels expand when added to `<md-expansion-panel-group>`
 * @param {string=} multiple - allows for more than one panel to be expanded at a time
 **/
.directive('mdExpansionPanelGroup', function() {


	function controller($scope, $attrs, $element, $mdComponentRegistry) {
		/* jshint validthis: true */
		var vm = this;

		var deregister;
		var registered = {};
		var panels = {};
		var onChangeFuncs = [];
		var multipleExpand = $attrs.mdMultiple !== undefined || $attrs.multiple !== undefined;
		var autoExpand = $attrs.mdAutoExpand !== undefined || $attrs.autoExpand !== undefined;


		deregister = $mdComponentRegistry.register({
			$element: $element,
			register: register,
			getRegistered: getRegistered,
			getAll: getAll,
			getOpen: getOpen,
			remove: remove,
			removeAll: removeAll,
			collapseAll: collapseAll,
			onChange: onChange,
			count: panelCount
		}, $attrs.mdComponentId);

		vm.addPanel = addPanel;
		vm.expandPanel = expandPanel;
		vm.removePanel = removePanel;


		$scope.$on('$destroy', function () {
			if (typeof deregister === 'function') {
				deregister();
				deregister = undefined;
			}

			// destroy all panels
			// for some reason the child panels scopes are not getting destroyed
			Object.keys(panels).forEach(function (key) {
				panels[key].destroy();
			});
		});



		function onChange(callback) {
			onChangeFuncs.push(callback);

			return function () {
				onChangeFuncs.splice(onChangeFuncs.indexOf(callback), 1);
			};
		}

		function callOnChange() {
			var count = panelCount();
			onChangeFuncs.forEach(function (func) {
				func(count);
			});
		}


		function addPanel(componentId, panelCtrl) {
			panels[componentId] = panelCtrl;
			if (autoExpand === true) {
				panelCtrl.expand();
				closeOthers(componentId);
			}
			callOnChange();
		}

		function expandPanel(componentId) {
			closeOthers(componentId);
		}

		function remove(componentId, options) {
			return panels[componentId].remove(options);
		}

		function removeAll(options) {
			Object.keys(panels).forEach(function (panelId) {
				panels[panelId].remove(options);
			});
		}

		function removePanel(componentId) {
			delete panels[componentId];
			callOnChange();
		}

		function panelCount() {
			return Object.keys(panels).length;
		}

		function closeOthers(id) {
			if (multipleExpand === false) {
				Object.keys(panels).forEach(function (panelId) {
					if (panelId !== id) { panels[panelId].collapse(); }
				});
			}
		}


		function register(name, options) {
			if (registered[name] !== undefined) {
				throw Error('$mdExpansionPanelGroup.register() The name "' + name + '" has already been registered');
			}
			registered[name] = options;
		}


		function getRegistered(name) {
			if (registered[name] === undefined) {
				throw Error('$mdExpansionPanelGroup.addPanel() Cannot find Panel with name of "' + name + '"');
			}
			return registered[name];
		}


		function getAll() {
			return Object.keys(panels).map(function (panelId) {
				return panels[panelId];
			});
		}

		function getOpen() {
			return Object.keys(panels).map(function (panelId) {
				return panels[panelId];
			}).filter(function (instance) {
				return instance.isOpen();
			});
		}

		function collapseAll(noAnimation) {
			var animation = noAnimation === true ? false : true;
			Object.keys(panels).forEach(function (panelId) {
				panels[panelId].collapse({animation: animation});
			});
		}
	}
	

	return {
			restrict: 'E',
			controller: ['$scope', '$attrs', '$element', '$mdComponentRegistry', controller]
	};
});


angular.module('mblowfish-core')
/**
 * @ngdoc service
 * @name $mdExpansionPanelGroup
 * @module material.components.expansionPanels
 *
 * @description
 * Expand and collapse Expansion Panel using its `md-component-id`
 *
 * @example
 * $mdExpansionPanelGroup('comonentId').then(function (instance) {
 *  instance.register({
 *    componentId: 'cardComponentId',
 *    templateUrl: 'template.html',
 *    controller: 'Controller'
 *  });
 *  instance.add('cardComponentId', {local: localData});
 *  instance.remove('cardComponentId', {animation: false});
 *  instance.removeAll({animation: false});
 * });
 */
.factory('$mdExpansionPanelGroup', function ($mdComponentRegistry, $mdUtil, $mdExpansionPanel, $templateRequest, $rootScope, $compile, $controller, $q, $log) {
    var errorMsg = 'ExpansionPanelGroup "{0}" is not available! Did you use md-component-id="{0}"?';
    var service = {
            find: findInstance,
            waitFor: waitForInstance
    };

    return function (handle) {
        if (handle === undefined) { return service; }
        return findInstance(handle);
    };



    function findInstance(handle) {
        var instance = $mdComponentRegistry.get(handle);

        if (!instance) {
            // Report missing instance
            $log.error( $mdUtil.supplant(errorMsg, [handle || '']) );
            return undefined;
        }

        return createGroupInstance(instance);
    }

    function waitForInstance(handle) {
        var deffered = $q.defer();

        $mdComponentRegistry.when(handle).then(function (instance) {
            deffered.resolve(createGroupInstance(instance));
        }).catch(function (error) {
            deffered.reject();
            $log.error(error);
        });

        return deffered.promise;
    }





    // --- returned service for group instance ---

    function createGroupInstance(instance) {
        var service = {
                add: add,
                register: register,
                getAll: getAll,
                getOpen: getOpen,
                remove: remove,
                removeAll: removeAll,
                collapseAll: collapseAll,
                onChange: onChange,
                count: count
        };

        return service;


        function register(name, options) {
            if (typeof name !== 'string') {
                throw Error('$mdExpansionPanelGroup.register() Expects name to be a string');
            }

            validateOptions(options);
            instance.register(name, options);
        }

        function remove(componentId, options) {
            return instance.remove(componentId, options);
        }

        function removeAll(options) {
            instance.removeAll(options);
        }

        function onChange(callback) {
            return instance.onChange(callback);
        }

        function count() {
            return instance.count();
        }

        function getAll() {
            return instance.getAll();
        }

        function getOpen() {
            return instance.getOpen();
        }

        function collapseAll(noAnimation) {
            instance.collapseAll(noAnimation);
        }


        function add(options, locals) {
            locals = locals || {};
            // assume if options is a string then they are calling a registered card by its component id
            if (typeof options === 'string') {
                // call add panel with the stored options
                return add(instance.getRegistered(options), locals);
            }

            validateOptions(options);
            if (options.componentId && instance.isPanelActive(options.componentId)) {
                return $q.reject('panel with componentId "' + options.componentId + '" is currently active');
            }


            var deffered = $q.defer();
            var scope = $rootScope.$new();
            angular.extend(scope, options.scope);

            getTemplate(options, function (template) {
                var element = angular.element(template);
                var componentId = options.componentId || element.attr('md-component-id') || '_panelComponentId_' + $mdUtil.nextUid();
                var panelPromise = $mdExpansionPanel().waitFor(componentId);
                element.attr('md-component-id', componentId);

                var linkFunc = $compile(element);
                if (options.controller) {
                    angular.extend(locals, options.locals || {});
                    locals.$scope = scope;
                    locals.$panel = panelPromise;
                    var invokeCtrl = $controller(options.controller, locals, true);
                    var ctrl = invokeCtrl();
                    element.data('$ngControllerController', ctrl);
                    element.children().data('$ngControllerController', ctrl);
                    if (options.controllerAs) {
                        scope[options.controllerAs] = ctrl;
                    }
                }

                // link after the element is added so we can find card manager directive
                instance.$element.append(element);
                linkFunc(scope);

                panelPromise.then(function (instance) {
                    deffered.resolve(instance);
                });
            });

            return deffered.promise;
        }

        function validateOptions(options) {
            if (typeof options !== 'object' || options === null) {
                throw Error('$mdExapnsionPanelGroup.add()/.register() : Requires an options object to be passed in');
            }

            // if none of these exist then a dialog box cannot be created
            if (!options.template && !options.templateUrl) {
                throw Error('$mdExapnsionPanelGroup.add()/.register() : Is missing required paramters to create. Required One of the following: template, templateUrl');
            }
        }

        function getTemplate(options, callback) {
            if (options.templateUrl !== undefined) {
                $templateRequest(options.templateUrl)
                .then(function(response) {
                    callback(response);
                });
            } else {
                callback(options.template);
            }
        }
    }
});






angular.module('mblowfish-core')
/**
 * @ngdoc directive
 * @name mdExpansionPanelHeader
 * @module material.components.expansionPanels
 *
 * @restrict E
 *
 * @description
 * `mdExpansionPanelHeader` is nested inside of `mdExpansionPanelExpanded` and contains content you want in place of the collapsed content
 * this is optional
 *
 * @param {boolean=} md-no-sticky - add this aatribute to disable sticky
 **/
.directive('mdExpansionPanelHeader', function () {
	var directive = {
			restrict: 'E',
			transclude: true,
			template: '<div class="md-expansion-panel-header-container" ng-transclude></div>',
			require: '^^mdExpansionPanel',
			link: link
	};
	return directive;



	function link(scope, element, attrs, expansionPanelCtrl) {
		var isStuck = false;
		var noSticky = attrs.mdNoSticky !== undefined;
		var container = angular.element(element[0].querySelector('.md-expansion-panel-header-container'));

		expansionPanelCtrl.registerHeader({
			show: show,
			hide: hide,
			noSticky: noSticky,
			onScroll: onScroll,
			onResize: onResize
		});


		function show() {

		}
		function hide() {
			unstick();
		}


		function onScroll(top, bottom, transformTop) {
			var offset;
			var panelbottom;
			var bounds = element[0].getBoundingClientRect();


			if (bounds.top < top) {
				offset = top - transformTop;
				panelbottom = element[0].parentNode.getBoundingClientRect().bottom - top - bounds.height;
				if (panelbottom < 0) {
					offset += panelbottom;
				}

				// set container width because element becomes postion fixed
				container.css('width', element[0].offsetWidth + 'px');
				container.css('top', offset + 'px');

				// set element height so it does not shink when container is position fixed
				element.css('height', container[0].offsetHeight + 'px');

				element.removeClass('md-no-stick');
				element.addClass('md-stick');
				isStuck = true;
			} else if (isStuck === true) {
				unstick();
			}
		}

		function onResize(width) {
			if (isStuck === false) { return; }
			container.css('width', width + 'px');
		}


		function unstick() {
			isStuck = false;
			container.css('width', '');
			element.css('height', '');
			element.css('top', '');
			element.removeClass('md-stick');
			element.addClass('md-no-stick');
		}
	}
});






angular.module('mblowfish-core')
/**
 * @ngdoc service
 * @name $mdExpansionPanel
 * @module material.components.expansionPanels
 *
 * @description
 * Expand and collapse Expansion Panel using its `md-component-id`
 *
 * @example
 * $mdExpansionPanel('comonentId').then(function (instance) {
 *  instance.exapand();
 *  instance.collapse({animation: false});
 *  instance.remove({animation: false});
 *  instance.onRemove(function () {});
 * });
 */
.factory('$mdExpansionPanel', function ($mdComponentRegistry, $mdUtil, $log) {
	var errorMsg = 'ExpansionPanel "{0}" is not available! Did you use md-component-id="{0}"?';
	var service = {
			find: findInstance,
			waitFor: waitForInstance
	};

	return function (handle) {
		if (handle === undefined) { return service; }
		return findInstance(handle);
	};



	function findInstance(handle) {
		var instance = $mdComponentRegistry.get(handle);

		if (!instance) {
			// Report missing instance
			$log.error( $mdUtil.supplant(errorMsg, [handle || '']) );
			return undefined;
		}

		return instance;
	}

	function waitForInstance(handle) {
		return $mdComponentRegistry.when(handle).catch($log.error);
	}
});


/*
 * Copyright (c) 2015 Phoenix Scholars Co. (http://dpq.co.ir)
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



angular.module('mblowfish-core')
/**
 * @ngdoc Factories
 * @name MbAction
 * @description An action item
 * 
 */
.factory('MbAction', function ($injector, $navigator, $window) {

    function Action(data) {
        if (!angular.isDefined(data)) {
            data = {};
        }
        angular.extend(this, data, {
            priority: data.priority || 10
        });
        this.visible = this.visible || function () {
            return true;
        };
        return this;
    };

    Action.prototype.exec = function ($event) {
    	if ($event) {
    		$event.stopPropagation();
    		$event.preventDefault();
    	}
        if (this.action) {
            return $injector.invoke(this.action, this, {
            	$event: $event
            });
        } else if (this.url){
            return $navigator.openPage(this.url);
        }
        $window.alert('Action \'' + this.id + '\' is not executable!?')
    };

    return Action;
});

/*
 * Copyright (c) 2015 Phoenix Scholars Co. (http://dpq.co.ir)
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

angular.module('mblowfish-core')

/**
 * @ngdoc Factories
 * @name MbActionGroup
 * @description Groups of actions.
 * 
 */
.factory('MbActionGroup', function() {
	function ActionGroup(data) {
		if(!angular.isDefined(data)){
			data = {};
		}
		data.priority = data.priority || 10;
		angular.extend(this, data);
		this.items = [];
		this.isGroup = true;
	};

	/**
	 * Clear the items list from action group
	 * 
	 * @name clear
	 * @memberof ActionGroup
	 */
	ActionGroup.prototype.clear = function(){
		this.items = [];
	};
	
	ActionGroup.prototype.removeItem = function(action){
		var j = this.items.indexOf(action);
		if (j > -1) {
			this.items.splice(j, 1);
		}
	};
	
	ActionGroup.prototype.addItem = function(action){
		this.items.push(action);
	};

	return ActionGroup;
});

/*
 * Copyright (c) 2015 Phoenix Scholars Co. (http://dpq.co.ir)
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



angular.module('mblowfish-core')
/**
 * @ngdoc Factories
 * @name MbEvent
 * @description An event item
 * 
 * Events are used to propagate signals to the application. It is based on $dispatcher. 
 * 
 * NOTE: All platform events (from mb or children) are instance of this factory.
 * 
 */
.factory('MbEvent', function () {

    function mbEvent(data) {
        if (!angular.isDefined(data)) {
            data = {};
        }
        angular.extend(this, data);
    };

    mbEvent.prototype.getType = function () {
        return this.type || 'unknown';
    };

    mbEvent.prototype.getKey = function () {
        return this.key || 'unknown';
    };

    mbEvent.prototype.getValues = function () {
        return this.values || [];
    };

    mbEvent.prototype.isCreated = function () {
        return this.key === 'create';
    };

    mbEvent.prototype.isRead = function () {
        return this.key === 'read';
    };

    mbEvent.prototype.isUpdated = function () {
        return this.key === 'update';
    };

    mbEvent.prototype.isDeleted = function () {
        return this.key === 'delete';
    };

    return mbEvent;
});

/*
 * Copyright (c) 2015 Phoenix Scholars Co. (http://dpq.co.ir)
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


angular.module('mblowfish-core')
/**
 * @ngdoc Factories
 * @name httpRequestInterceptor
 * @description An interceptor to handle the error 401 of http response
 * @see https://docs.angularjs.org/api/ng/service/$http#interceptors
 */
.factory('MbHttpRequestInterceptor', function ($q, $injector) {
	
	var httpRequestInterceptor = function(){};
	httpRequestInterceptor.prototype.responseError = function (rejection) {
		var app = $injector.get('$app');
		// do something on error
		if (rejection.status === 401) {
			app.logout();
		}
		return $q.reject(rejection);
	};
	return httpRequestInterceptor;
});
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
//
//angular.module('mblowfish-core')
//.factory('WbDialogWindow', function($window, $document, $wbFloat) {
//    
//
//
//    // Utils
//    function covertToFloadConfig(dialogWindow) {
//        var options = {
//                closeOnEscape: dialogWindow.closeOnEscape,
//                header: dialogWindow.isTitleVisible(),
//                headerTitle: dialogWindow.getTitle(),
//                headerLogo: '',
//                headerControls: {
////                  close: 'remove',
////                  maximize: 'remove',
////                  normalize: 'remove',
////                  minimize: 'remove',
////                  smallify: 'remove',
////                  smallifyrev: 'remove',
//                }
//        };
//
//        if(angular.isDefined(dialogWindow.x)){
//            options.position = {
//                    type: 'fixed',
//                    my: 'left-top',
//                    at: 'left-top',
//                    of: 'body',
//                    container: 'body',
//                    offsetX: dialogWindow.x,
//                    offsetY: dialogWindow.y
//            };
//        }
//        if(angular.isDefined(dialogWindow.width)){
//            options.panelSize = {
//                    width: dialogWindow.width, 
//                    height: dialogWindow.width
//            };
//        }
//
//        return options;
//    }
//
//    /**
//     * @ngdoc Factory
//     * @name WbDialogWindow
//     * @description WbDialogWindow a dialog manager
//     * 
//     */
//    var wbWindow = function(parent){
//        this.parent = parent || $window;
//        this.floatDialogElement = null;
//        this.setTitleVisible(true);
//    };
//
//    /**
//     * Gets parent of the window
//     * 
//     * @memberof WbDialogWindow
//     */
//    wbWindow.prototype.getParent = function(){
//        return this.parent;
//    };
//
//    /**
//     * Sets title of the window
//     * 
//     * @memberof WbDialogWindow
//     * @params title {string} the window title
//     */
//    wbWindow.prototype.setTitle = function(title){
//        this.title = title;
//        if(this.isVisible()){
//            // TODO: maso, 2019: set title of the current dialog
//        }
//    };
//
//    /**
//     * Sets title of the window
//     * 
//     * @memberof WbDialogWindow
//     * @return {string} the window title
//     */
//    wbWindow.prototype.getTitle = function(){
//        return this.title;
//    };
//
//
//    /**
//     * Sets language of the window
//     * 
//     * @memberof WbDialogWindow
//     * @params language {string} the window language
//     */
//    wbWindow.prototype.setLanguage = function(language){
//        this.language = language;
//        if(this.isVisible()){
//            // TODO: maso, 2019: set title of the current dialog
//        }
//    };
//
//    /**
//     * Sets title of the window
//     * 
//     * @memberof WbDialogWindow
//     * @return {string} the window language
//     */
//    wbWindow.prototype.getLanguage = function(){
//        return this.language;
//    };
//
//    /**
//     * 
//     * The open() method opens a new browser window, or a new tab, depending 
//     * on your browser settings.
//     * 
//     * Tip: Use the close() method to close the window.
//     * 
//     * @memberof WbDialogWindow
//     * @return window object
//     */
//    wbWindow.prototype.open = function(url, name, options, replace){
//        return $window.open(url, name, options, replace);
//    };
//
//    /**
//     * Close current window
//     * 
//     * 
//     * @memberof WbDialogWindow
//     * @params visible {boolean} of the window
//     */
//    wbWindow.prototype.close = function(){
//        this.setVisible(false);
//        // TODO: maso, 2019: remove dome and destroy scope.
//    };
//
//    /**
//     * Sets visible of the window
//     * 
//     * 
//     * @memberof WbDialogWindow
//     * @params visible {boolean} of the window
//     */
//    wbWindow.prototype.setVisible = function(visible){
//        if(!this.floatDialogElement) {
//            this.floatDialogElement = $wbFloat.create(covertToFloadConfig(this));
//        } else if(this.floatDialogElement.isVisible() === visible) {
//            return;
//        }
//
//        this.floatDialogElement.setVisible(visible);
//    };
//
//    /**
//     * Gets visible of the window
//     * 
//     * 
//     * @memberof WbDialogWindow
//     * @returns true if the window is visible
//     */
//    wbWindow.prototype.isVisible = function(){
//        if(! this.floatDialogElement){
//            return false;
//        }
//        return this.floatDialogElement.isVisible();
//    };
//
//    /**
//     * Sets position of the window
//     * 
//     * 
//     * @memberof WbDialogWindow
//     * @params x {string|int} absolute position
//     * @params y {string|int} absolute position
//     */
//    wbWindow.prototype.setPosition = function(x, y) {
//        this.x = x;
//        this.y = y;
//        if(this.floatDialogElement){
//            // TODO: reload the window position
//        }
//    };
//
//    /**
//     * Gets current position of the window
//     * 
//     * @memberof WbDialogWindow
//     * @return position
//     */
//    wbWindow.prototype.getPosition = function() {
//        return {
//            x: this.x,
//            y:this.y,
//        };
//    };
//
//
//
//    /**
//     * Close window on Escape
//     * 
//     * @memberof WbDialogWindow
//     * @params x {string|int} absolute position
//     * @params y {string|int} absolute position
//     */
//    wbWindow.prototype.setCloseOnEscape = function(closeOnEscape) {
//        this.closeOnEscape = closeOnEscape;
//        if(this.floatDialogElement){
//            // TODO: reload the window close
//        }
//    };
//
//    /**
//     * Sets size of the window
//     * 
//     * @memberof WbDialogWindow
//     * @params width {string|int} absolute position
//     * @params height {string|int} absolute position
//     */
//    wbWindow.prototype.setSize = function(width, height) {
//        this.width = width;
//        this.height = height;
//        if(this.floatDialogElement){
//            // TODO: reload the window size
//        }
//    };
//
//    /**
//     * Loads a library
//     * 
//     * @memberof WbDialogWindow
//     * @path path of library
//     * @return promise to load the library
//     */
//    wbWindow.prototype.loadLibrary = function(path){
//        return $window.loadLibrary(path);
//    };
//
//    /**
//     * Check if the library is loaded
//     * 
//     * @memberof WbDialogWindow
//     * @return true if the library is loaded
//     */
//    wbWindow.prototype.isLibraryLoaded = function(path){
//        return $window.isLibraryLoaded(path);
//    };
//
//    /**
//     * Loads a library
//     * 
//     * @memberof WbDialogWindow
//     * @path path of library
//     * @return promise to load the library
//     */
//    wbWindow.prototype.loadStyle = function(path){
//        return $window.loadStyle(path);
//    };
//
//    /**
//     * Check if the library is loaded
//     * 
//     * @memberof WbDialogWindow
//     * @return true if the library is loaded
//     */
//    wbWindow.prototype.isStyleLoaded = function(path){
//        return $window.isStyleLoaded(path);
//    };
//
//
//    /**
//     * Set meta
//     * 
//     * @memberof WbDialogWindow
//     * @params key {string} the key of meta
//     * @params value {string} the value of meta
//     */
//    wbWindow.prototype.setMeta = function (key, value){
//        var parent = this.getParent();
//        if(parent) {
//            parent.setMeta(key, value);
//        }
//    };
//
//    /**
//     * Set link
//     * 
//     * @memberof WbDialogWindow
//     * @params key {string} the key of link
//     * @params data {string} the value of link
//     */
//    wbWindow.prototype.setLink = function (key, data){
//        var parent = this.getParent();
//        if(parent) {
//            parent.setLink(key, data);
//        }
//    };
//
//
//    /**
//     * Write the body
//     * 
//     * @memberof WbDialogWindow
//     * @params data {string} the value
//     */
//    wbWindow.prototype.write = function (data){
//        this.floatDialogElement.getElement()
//        .then(function(parentElement){
//            // string
//            var element = angular.element(data);
//            parentElement.empty();
//            parentElement.append(element);
//        });
//    };
//
//    /**
//     * Set view the body
//     * 
//     * @memberof WbDialogWindow
//     * @params data {Object} the view
//     */
//    wbWindow.prototype.setView = function (view){
//        return this.floatDialogElement.setView(view);
//    };
//
//    wbWindow.prototype.setWidth = function(width){
//        this.resizeTo(width, this.getHeight());
//    };
//
//    wbWindow.prototype.getWidth = function(){
//        return this.width;
//    };
//
//    wbWindow.prototype.setHeight = function(height){
//        this.resizeTo(this.getWidth(), height);
//    };
//
//    wbWindow.prototype.getHeight = function(){
//        return this.height;
//    };
//
//    wbWindow.prototype.resizeTo = function(width, height) {
//        this.width = width;
//        this.height = height;
//        if(this.floatDialogElement){
//            this.floatDialogElement.resize(width, height);
//        }
//    };
//
//    wbWindow.prototype.setTitleVisible = function(visible){
//        this._titleVisible = visible;
//        if(this.floatDialogElement){
//            // TODO: maso, 2019: Check if the JPanel supports title visibility online.
//        }
//    };
//
//    wbWindow.prototype.isTitleVisible = function(){
//        return this._titleVisible;
//    };
//
//    return wbWindow;
//});

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

angular.module('mblowfish-core')
/*
 * TODO: maso, 2019: add filter document
 */
.filter('currencyFilter', function (numberFilter, translateFilter) {
	

    return function (price, unit) {

        if (!price) {
            return translateFilter('free');
        }
        // TODO: maso, 2019: set unit with system default currency if is null
        if (unit === 'iran-rial' || unit === 'iran-tooman') {
            return numberFilter(price) + ' '
                    + translateFilter(unit);
        } else if (unit === 'bahrain-dinar') {
            return numberFilter(price) + ' '
                    + translateFilter('bahrain-dinar');
        } else if (unit === 'euro') {
            return numberFilter(price) + ' '
                    + translateFilter('euro');
        } else if (unit === 'dollar') {
            return translateFilter('dollar') + ' '
                    + numberFilter(price);
        } else if (unit === 'pound') {
            return translateFilter('pound') + ' '
                    + numberFilter(price);
        } else if (unit === 'iraq-dinar') {
            return numberFilter(price) + ' '
                    + translateFilter('iraq-dinar');
        } else if (unit === 'kuwait-dinar') {
            return numberFilter(price) + ' '
                    + translateFilter('kuwait-dinar');
        } else if (unit === 'oman-rial') {
            return numberFilter(price) + ' '
                    + translateFilter('oman-rial');
        } else if (unit === 'turkish-lira') {
            return numberFilter(price) + ' '
                    + translateFilter('turkish-lira');
        } else if (unit === 'uae-dirham') {
            return numberFilter(price) + ' '
                    + translateFilter('uae-dirham');
        } else {
            return numberFilter(price) + ' ?';
        }
    };
});




/*
 * Copyright (c) 2015 Phoenix Scholars Co. (http://dpq.co.ir)
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




/**
 * @ngdoc Filters
 * @name mbDate
 * @description # Format date
 */
angular.module('mblowfish-core').filter('mbDate', function($mbLocal) {
	return function(inputDate, format) {
		return $mbLocal.formatDate(inputDate, format);
	};
});

/**
 * @ngdoc Filters
 * @name mbDateTime
 * @description # Format date time
 */
angular.module('mblowfish-core').filter('mbDate', function($mbLocal) {
	return function(inputDate, format) {
		return $mbLocal.formatDateTime(inputDate, format);
	};
});
/* 
 * The MIT License (MIT)
 * 
 * Copyright (c) 2016 weburger
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


angular.module('mblowfish-core')

/**
 * @ngdoc Filters
 * @name wbmd5
 * @function
 * @description Hash the input
 * 
 * @example 
 ```html 
 <span>{{ 'text to hash' | wbmd5 }}</span> 
 ```
 */
.filter('wbmd5', function ($wbCrypto) {
    return function (val) {
        return $wbCrypto.md5(val+'');
    };
});

/* 
 * The MIT License (MIT)
 * 
 * Copyright (c) 2016 weburger
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


angular.module('mblowfish-core')

/**
 * @ngdoc Filters
 * @name wbunsafe
 * @description # unsafe Filter
 */
.filter('wbunsafe', function($sce) {
	return function(val) {
		return $sce.trustAsHtml(val);
	};
});

/*
 * angular-material-icons v0.7.1
 * (c) 2014 Klar Systems
 * License: MIT
 */

/* jshint -W097, -W101 */

angular.module('mblowfish-core')
.provider('wbIconService', function () {
	
	var provider, service;

	var shapes = {};
	var viewBoxes = {};
	var size = 24;

	service = {
			getShape : getShape,
			getShapes: getShapes,
			getViewBox : getViewBox,
			getViewBoxes: getViewBoxes,
			getSize: getSize,
			setShape : addShape,
			setShapes: addShapes,
			setViewBox : addViewBox,
			setViewBoxes: addViewBoxes,
			setSize: setSize,
			addShape : addShape,
			addShapes: addShapes,
			addViewBox : addViewBox,
			addViewBoxes: addViewBoxes
	};

	provider = {
			$get     : wbIconServiceFactory,
			getShape : getShape,
			getShapes: getShapes,
			getViewBox : getViewBox,
			getViewBoxes: getViewBoxes,
			getSize: getSize,
			setShape : addShape,
			setShapes: addShapes,
			setViewBox : addViewBox,
			setViewBoxes: addViewBoxes,
			setSize: setSize,
			addShape : addShape,
			addShapes: addShapes,
			addViewBox : addViewBox,
			addViewBoxes: addViewBoxes
	};

	return provider;

	function addShape(name, shape) {
		shapes[name] = shape;

		return provider; // chainable function
	}

	function addShapes(newShapes) {
		shapes = angular.extend(shapes, newShapes);

		return provider; // chainable function
	}

	function addViewBox(name, viewBox) {
		viewBoxes[name] = viewBox;

		return provider; // chainable function
	}

	function addViewBoxes(newViewBoxes) {
		viewBoxes = angular.extend(viewBoxes, newViewBoxes);

		return provider; // chainable function
	}

	function getShape(name) {
		return shapes[name] || shapes['help'];
	}

	function getShapes() {
		return shapes;
	}

	function getViewBox(name) {
		return viewBoxes[name] || '0 0 24 24';
	}

	function getViewBoxes() {
		return viewBoxes;
	}
	
	function setSize(newSize) {
		size = newSize || 24;
	}

	function getSize() {
		return size;
	}

	function wbIconServiceFactory() {
		return service;
	}
});

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


angular.module('mblowfish-core')
/*
 * Application extensions
 * 
 *  An extension is responsible to extends the state of the
 * application and add more functionality. For example auto save
 * configuration is one of the application extension
 */
.run(function ($app, $dispatcher) {
    
    /*
     * Store application config if there is change
     */
    function storeApplicationConfig(event){
        if(event.type === 'update' && $app.getState() === 'ready'){
            $app.storeApplicationConfig();
        }
    }

    // watch the configurations of the application
    $dispatcher.on('/app/configs', storeApplicationConfig);
});
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


angular.module('mblowfish-core')
	/**
	 * دریچه‌های محاوره‌ای
	 */
	.run(function ($toolbar, $sidenav, $rootScope, $navigator, $route, $actions, $help) {
		/***************************************************************************
		 * New app state
		 * 
		 * Application state is saved in the root scope
		 **************************************************************************/
		/*
		 * Store application state
		 */
		$rootScope.__app = {
			/******************************************************************
			 * New model
			 ******************************************************************/
			state: 'waiting',
			key: '',
			configs: {},
			settings: {},
			language: 'en',
			/******************************************************************
			 * Old model
			 ******************************************************************/
			logs: [],
			user: {
				current: {},
				profile: {},
				anonymous: true,
				administrator: false,
				owner: false,
				member: false,
				authorized: false
			},
			// application settings
			config: {},
			// user settings
			setting: {},
			/*
			 * NOTE: this part is deprecated use tenant
			 */
			// tenant settings
			options: {},
			local: 'en', // Default local and language
			dir: 'rtl'
		};
		$rootScope.app = $rootScope.__app;

		/*
		 * Store tenant sate
		 */
		$rootScope.__tenant = {
			id: 0,
			title: 'notitle',
			description: 'nodescription',
			configs: {},
			settings: {},
			domains: {}
		};

		/*
		 * Store account state
		 */
		$rootScope.__account = {
			anonymous: true,
			id: 0,
			login: '',
			profile: {},
			roles: {},
			groups: {},
			permissions: {},
			messages: []
		}


		/***************************************************************************
		 * Application actions
		 **************************************************************************/
		$actions.newAction({
			id: 'mb.preferences',
			priority: 15,
			icon: 'settings',
			title: 'Preferences',
			description: 'Open preferences panel',
			visible: function () {
				return $rootScope.__account.permissions.tenant_owner;
			},
			action: function () {
				return $navigator.openPage('preferences');
			},
			groups: ['mb.toolbar.menu']
		});
		$actions.newAction({// help
			id: 'mb.help',
			priority: 15,
			icon: 'help',
			title: 'Help',
			description: 'Display help in sidenav',
			visible: function () {
				return $help.hasHelp($route.current);
			},
			action: function () {
				$help.openHelp($route.current);
			},
			groups: ['mb.toolbar.menu']
		});
		$actions.newAction({
			icon: 'account_circle',
			title: 'Profile',
			description: 'User profile',
			groups: ['mb.user'],
			action: function () {
				return $navigator.openPage('users/profile');
			}
		});
		$actions.newAction({
			icon: 'account_box',
			title: 'Account',
			description: 'User account',
			groups: ['mb.user'],
			action: function () {
				return $navigator.openPage('users/account');
			}
		});
		$actions.newAction({
			icon: 'fingerprint',
			title: 'Password',
			description: 'Manage password',
			groups: ['mb.user'],
			action: function () {
				return $navigator.openPage('users/password');
			}
		});

		$toolbar.newToolbar({
			id: 'dashboard',
			title: 'Dashboard toolbar',
			description: 'Main dashboard toolbar',
			controller: 'MbToolbarDashboardCtrl',
			templateUrl: 'views/toolbars/mb-dashboard.html'
		});

		$sidenav.newSidenav({
			id: 'navigator',
			title: 'Navigator',
			description: 'Navigate all path and routs of the pandel',
			controller: 'AmdNavigatorCtrl',
			templateUrl: 'views/sidenavs/mb-navigator.html',
			locked: true,
			position: 'start'
		});
		$sidenav.newSidenav({
			id: 'help',
			title: 'Help',
			description: 'System online help',
			controller: 'MbHelpCtrl',
			templateUrl: 'views/sidenavs/mb-help.html',
			locked: true,
			visible: function () {
				return $rootScope.showHelp;
			},
			position: 'end'
		});
		$sidenav.newSidenav({
			id: 'settings',
			title: 'Options',
			description: 'User options',
			controller: 'MbOptionsCtrl',
			templateUrl: 'views/sidenavs/mb-options.html',
			locked: false,
			position: 'end'
		});
		$sidenav.newSidenav({
			id: 'messages',
			title: 'Messages',
			description: 'User message queue',
			controller: 'MessagesCtrl',
			controllerAs: 'ctrl',
			templateUrl: 'views/sidenavs/mb-messages.html',
			locked: false,
			position: 'start'
		});
	});
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


angular.module('mblowfish-core')
/*
 * دریچه‌های محاوره‌ای
 */
.run(function(appcache, $window, $rootScope) {

	var oldWatch;

	/*
	 * Reload the page
	 * 
	 * @deprecated use page service
	 */
	function reload() {
		$window.location.reload();
	}

	/*
	 * Reload the application
	 */
	function updateApplication() {
		var setting = $rootScope.app.config.update || {};
		if (setting.showMessage) {
			if(setting.autoReload) {
				alert('Application is update. Page will be reload automatically.')//
				.then(reload);
			} else {
				confirm('Application is update. Reload the page for new version?')//
				.then(reload);
			}
		} else {
			toast('Application is updated.');
		}
	}

	// Check update
	function doUpdate() {
		appcache.swapCache()//
		.then(updateApplication());
	}

	oldWatch = $rootScope.$watch('__app.state', function(status) {
		if (status && status.startsWith('ready')) {
			// check for update
			return appcache//
			.checkUpdate()//
			.then(doUpdate);
			// Test
//			updateApplication();
			// Remove the watch
			oldWatch();
		}
	});
});
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


angular.module('mblowfish-core')

.run(function($window, $rootScope, $location) {
	var watcherIsLoaded = false;
	var googleValue;

	function loadScript(value){
		$window.loadLibrary('https://www.googletagmanager.com/gtag/js')
		.then(function(){
			$window.dataLayer = $window.dataLayer || [];
			function gtag(){
				$window.dataLayer.push(arguments);
			};
			$window.gtag = gtag
			$window.gtag('js', new Date());
			$window.gtag('config', value);
		});
	}

	function loadWatchers() {
		if(watcherIsLoaded){
			return;
		}
		$rootScope.$on('$routeChangeStart', handleRouteChange);
		watcherIsLoaded = true;
	}

	function createEvent(){
		var event = {
				page_path: $location.path()
		};
		return event;
	}

	function handleRouteChange(){
		var event = createEvent();
		$window.gtag('config', googleValue, event);
	}

	// initialize google analytics
	$rootScope.$watch('app.config.googleAnalytic.property', function(value){
		if (!value) {
			return;
		}

		loadScript(value);
		loadWatchers();
	});
});
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

angular.module('mblowfish-core')
/**
 * دریچه‌های محاوره‌ای
 */
.run(function($notification, $help) {
	

    /*
     * Display help for an item
     */
    window.openHelp = function(item){
        return $help.openHelp(item);
    };

    // Hadi 1396-12-22: update alerts
    window.alert = $notification.alert;
    window.confirm = $notification.confirm;
    window.prompt = $notification.prompt;
    window.toast = $notification.toast;

});
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


angular.module('mblowfish-core')
/**
 * حالت امنیتی را بررسی می‌کند
 * 
 * در صورتی که یک حالت حالتی امن باشد، و کاربر وارد سیستم نشده باشد، حالت ماشین
 * را به حالت لاگین می‌برد.
 */
.run(function($rootScope, $page, $location) {

	/**
	 * Rests settings of page (title, description, keywords and favicon) to values defined in branding
	 */
	function _initBranding() {

		var app = $rootScope.app || {};
		if( app.config){			
			$page.setTitle(app.config.title);
			$page.setDescription(app.config.description);
			$page.setKeywords(app.config.keywords);
			$page.setFavicon(app.config.favicon || app.config.logo);
		}
	}

	/**
	 * If an item of settings of page does not set yet, sets it by value defined in branding
	 */
	function _fillUnsetFields() {
		var app = $rootScope.app || {};
		var config = app.config ? app.config : null;
		if(!config){
			return;
		}
		$page.setTitle($page.getTitle() || config.title);
		$page.setDescription($page.getDescription() || config.description);
		$page.setKeywords($page.getKeywords() || config.keywords);
		$page.setFavicon(config.favicon || config.logo);
		$page.setMeta('og:site_name', config.title);
	}
	/*
	 * Listen on change route
	 */
	$rootScope.$on('$routeChangeStart', function( /* event */ ) {
		_initBranding();
	});
	$rootScope.$on('$routeChangeSuccess', function( /*event, current*/ ) {
		var path = $location.absUrl();
		$page
		.setMeta('twitter:url', path) //
		.setMeta('og:url', path);
	});

	$rootScope.$watch(function(){
		var app = $rootScope.app || {};
		var conf = app.config;
		if(!conf){
			return conf;
		}
		return conf.title +'#'+ conf.description +'#'+ conf.keywords +'#'+ conf.logo +'#'+ conf.favicon;
	}, function() {
		_fillUnsetFields();
	});

	$page.setMeta('twitter:card', 'summary');
	$page.setMeta('og:type', 'object');
});
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


angular.module('mblowfish-core')
/**
 * دریچه‌های محاوره‌ای
 */
.run(function($options, $preferences) {
	// Pages
	$preferences
	.newPage({
		id : 'local',
		title : 'local',
		description : 'manage dashboard locality and language.',
		templateUrl : 'views/preferences/mb-local.html',
		controller: 'MbLocalCtrl',
		icon : 'language',
		tags : [ 'local', 'language' ]
	})//
	.newPage({
		id : 'brand',
		title : 'Branding',
		description : 'Manage application branding such as title, logo and descritpions.',
		templateUrl : 'views/preferences/mb-brand.html',
//		controller : 'settingsBrandCtrl',
		icon : 'copyright',
		priority: 2,
		required: true,
		tags : [ 'brand' ]
	})//
	.newPage({
		id : 'google-analytic',
		title : 'Google Analytic',
		templateUrl : 'views/preferences/mb-google-analytic.html',
		description : 'Enable google analytic for your application.',
		icon : 'timeline',
		tags : [ 'analysis' ]
	})
	.newPage({
		id: 'update',
		templateUrl : 'views/preferences/mb-update.html',
		title: 'Update application',
		description: 'Settings of updating process and how to update the application.',
		icon: 'autorenew'
	});
	
	// Settings
	$options.newPage({
		title: 'Local',
		templateUrl: 'views/options/mb-local.html',
		controller: 'MbLocalCtrl',
		tags: ['local']
	});
	$options.newPage({
		title: 'Theme',
		controller: 'MbThemesCtrl',
		templateUrl: 'views/options/mb-theme.html',
		tags: ['theme']
	});
});
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


angular.module('mblowfish-core')
/*
 * Help dialog 
 */
.run(function($help, $rootScope, $route) {
    // Watch current state
    $rootScope.$watch(function(){
        return $route.current;
    }, 
    function(val){
        // TODO: maso, 2018: Check protection of the current route
        
        // set help page
        $help.setCurrentItem(val);
    });
});
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


angular.module('mblowfish-core')
/*
 * Init application resources
 */
.run(function ($resource, $location, $controller) {

    $resource.newPage({
        type : 'wb-url',
        icon: 'link',
        label : 'URL',
        templateUrl : 'views/resources/wb-url.html',
        /*
         * @ngInject
         */
        controller : function($scope) {
            $scope.$watch('value', function(value) {
                $scope.$parent.setValue(value);
            });
        },
        controllerAs: 'ctrl',
        tags : [ 'file', 'image', 'vedio', 'audio', 'page', 'url', 'link',
            'avatar', 'thumbnail',
            // new models
            'image-url', 'vedio-url', 'audio-url', 'page-url']
    });

    $resource.newPage({
        type : 'script',
        icon : 'script',
        label : 'Script',
        templateUrl : 'views/resources/wb-event-code-editor.html',
        /*
         * @ngInject
         */
        controller : function($scope, $window, $element) {
            var ctrl = this;
            this.value = $scope.value || {
                code: '',
                language: 'javascript',
                languages: [{
                    text: 'HTML/XML',
                    value: 'markup'
                },
                {
                    text: 'JavaScript',
                    value: 'javascript'
                },
                {
                    text: 'CSS',
                    value: 'css'
                }]
            };
            this.setCode = function(code) {
                this.value.code = code;
                $scope.$parent.setValue(this.value);
            };

            this.setLanguage = function(language){
                this.value.code = language;
                $scope.$parent.setValue(this.value);
            };

            this.setEditor = function(editor) {
                this.editor = editor;
                editor.setOptions({
                    enableBasicAutocompletion: true, 
                    enableLiveAutocompletion: true, 
                    showPrintMargin: false, 
                    maxLines: Infinity,
                    fontSize: '100%'
                });
                $scope.editor = editor;
//              editor.setTheme('resources/libs/ace/theme/chrome');
//              editor.session.setMode('resources/libs/ace/mode/javascript');
                editor.setValue(ctrl.value.code || '');
                editor.on('change', function(){
                    ctrl.setCode(editor.getValue());
                });
            };

//          var ctrl = this;
            $window.loadLibrary('resources/libs/ace.js')
            .then(function(){
                ctrl.setEditor(ace.edit($element.find('div#am-wb-resources-script-editor')[0]));
            });
        },
        controllerAs: 'ctrl',
        tags : [ 'code', 'script']
    });

    function getDomain() {
        return $location.protocol() + //
        '://' + //
        $location.host() + //
        (($location.port() ? ':' + $location.port() : ''));
    }

//  TODO: maso, 2018: replace with class
    function getSelection() {
        if (!this.__selections) {
            this.__selections = angular.isArray(this.value) ? this.value : [];
        }
        return this.__selections;
    }

    function getIndexOf(list, item) {
        if (!angular.isDefined(item.id)) {
            return list.indexOf(item);
        }
        for (var i = 0; i < list.length; i++) {
            if (list[i].id === item.id) {
                return i;
            }
        }
    }

    function setSelected(item, selected) {
        var selectionList = this.getSelection();
        var index = getIndexOf(selectionList, item);
        if (selected) {
            // add to selection
            if (index >= 0) {
                return;
            }
            selectionList.push(item);
        } else {
            // remove from selection
            if (index > -1) {
                selectionList.splice(index, 1);
            }
        }
    }

    function isSelected(item) {
        var selectionList = this.getSelection();
        return getIndexOf(selectionList, item) >= 0;
    }


    /**
     * @ngdoc Resources
     * @name Account
     * @description Get an account from resource
     *
     * Enable user to select an account
     */
    $resource.newPage({
        label: 'Account',
        type: 'account',
        templateUrl: 'views/resources/mb-accounts.html',
        /*
         * @ngInject
         */
        controller: function ($scope) {
            // TODO: maso, 2018: load selected item
            $scope.multi = false;
            this.value = $scope.value;
            this.setSelected = function (item) {
                $scope.$parent.setValue(item);
                $scope.$parent.answer();
            };
            this.isSelected = function (item) {
                return item === this.value || item.id === this.value.id;
            };
        },
        controllerAs: 'resourceCtrl',
        priority: 8,
        tags: ['account']
    });

    $resource.newPage({
        label: 'Account',
        type: 'account id',
        templateUrl: 'views/resources/mb-accounts.html',
        /*
         * @ngInject
         */
        controller: function ($scope) {
            // TODO: maso, 2018: load selected item
            $scope.multi = false;
            this.value = $scope.value;
            this.setSelected = function (item) {
                $scope.$parent.setValue(item.id);
                $scope.$parent.answer();
            };
            this.isSelected = function (item) {
                return item.id === this.value;
            };
        },
        controllerAs: 'resourceCtrl',
        priority: 8,
        tags: ['account_id', 'owner_id']
    });

    /**
     * @ngdoc Resources
     * @name Accounts
     * @description Gets list of accounts
     *
     * Display a list of accounts and allow user to select them.
     */
    $resource.newPage({
        label: 'Accounts',
        type: 'account-list',
        templateUrl: 'views/resources/mb-accounts.html',
        /*
         * @ngInject
         */
        controller: function ($scope) {
            // TODO: maso, 2018: load selected item
            $scope.multi = true;
            this.value = $scope.value;
            this.setSelected = function (item, selected) {
                this._setSelected(item, selected);
                $scope.$parent.setValue(this.getSelection());
            };
            this._setSelected = setSelected;
            this.isSelected = isSelected;
            this.getSelection = getSelection;
        },
        controllerAs: 'resourceCtrl',
        priority: 8,
        tags: ['accounts', '/user/accounts']
    });

    // Resource for role-list
    $resource.newPage({
        label: 'Role List',
        type: 'role-list',
        templateUrl: 'views/resources/mb-roles.html',
        /*
         * @ngInject
         */
        controller: function ($scope) {
            // TODO: maso, 2018: load selected item
            $scope.multi = true;
            this.value = $scope.value;
            this.setSelected = function (item, selected) {
                this._setSelected(item, selected);
                $scope.$parent.setValue(this.getSelection());
            };
            this._setSelected = setSelected;
            this.isSelected = isSelected;
            this.getSelection = getSelection;
        },
        controllerAs: 'resourceCtrl',
        priority: 8,
        tags: ['roles', '/user/roles']
    });


    // Resource for group-list
    $resource.newPage({
        label: 'Group List',
        type: 'group-list',
        templateUrl: 'views/resources/mb-groups.html',
        /*
         * @ngInject
         */
        controller: function ($scope) {
            // TODO: maso, 2018: load selected item
            $scope.multi = true;
            this.value = $scope.value;
            this.setSelected = function (item, selected) {
                this._setSelected(item, selected);
                $scope.$parent.setValue(this.getSelection());
            };
            this._setSelected = setSelected;
            this.isSelected = isSelected;
            this.getSelection = getSelection;
        },
        controllerAs: 'resourceCtrl',
        priority: 8,
        tags: ['groups']
    });


    /**
     * @ngdoc WB Resources
     * @name cms-content-image
     * @description Load an Image URL from contents
     */
    $resource.newPage({
        type: 'cms-content-image',
        icon: 'image',
        label: 'Images',
        templateUrl: 'views/resources/mb-cms-images.html',
        /*
         * @ngInject
         */
        controller: function ($scope) {

            /*
             * Extends collection controller
             */
            angular.extend(this, $controller('AmWbSeenCmsContentsCtrl', {
                $scope: $scope
            }));

            /**
             * Sets the absolute mode
             *
             * @param {boolean}
             *            absolute mode of the controler
             */
            this.setAbsolute = function (absolute) {
                this.absolute = absolute;
            }

            /**
             * Checks if the mode is absolute
             *
             * @return absolute mode of the controller
             */
            this.isAbsolute = function () {
                return this.absolute;
            }

            /*
             * Sets value
             */
            this.setSelected = function (content) {
                var path = '/api/v2/cms/contents/' + content.id + '/content';
                if (this.isAbsolute()) {
                    path = getDomain() + path;
                }
                this.value = path;
                $scope.$parent.setValue(path);
            }

            // init the controller
            this.init()
        },
        controllerAs: 'ctrl',
        priority: 10,
        tags: ['image', 'url', 'image-url', 'avatar', 'thumbnail']
    });
    // TODO: maso, 2018: Add video resource
    // TODO: maso, 2018: Add audio resource

    /**
     * @ngdoc WB Resources
     * @name content-upload
     * @description Upload a content and returns its URL
     */
    $resource.newPage({
        type: 'content-upload',
        icon: 'file_upload',
        label: 'Upload',
        templateUrl: 'views/resources/mb-cms-content-upload.html',
        /*
         * @ngInject
         */
        controller: function ($scope, $cms, $translate, uuid4) {

            /*
             * Extends collection controller
             */
            angular.extend(this, $controller('AmWbSeenCmsContentsCtrl', {
                $scope: $scope
            }));

            this.absolute = false;
            this.files = [];

            /**
             * Sets the absolute mode
             *
             * @param {boolean}
             *            absolute mode of the controler
             */
            this.setAbsolute = function (absolute) {
                this.absolute = absolute;
            }

            /**
             * Checks if the mode is absolute
             *
             * @return absolute mode of the controller
             */
            this.isAbsolute = function () {
                return this.absolute;
            }

            /*
             * Add answer to controller
             */
            var ctrl = this;
            $scope.answer = function () {
                // create data
                var data = {};
                data.name = this.name || uuid4.generate();
                data.description = this.description || 'Auto loaded content';
                var file = null;
                if (angular.isArray(ctrl.files) && ctrl.files.length) {
                    file = ctrl.files[0].lfFile;
                    data.title = file.name;
                }
                // upload data to server
                return ctrl.uploadFile(data, file)//
                .then(function (content) {
                    var value = '/api/v2/cms/contents/' + content.id + '/content';
                    if (ctrl.isAbsolute()) {
                        value = getDomain() + value;
                    }
                    return value;
                })//
                .catch(function () {
                    alert('Failed to create or upload content');
                });
            };
            // init the controller
            this.init();

            // re-labeling lf-ng-md-file component for multi languages support
            angular.element(function () {
                var elm = angular.element('.lf-ng-md-file-input-drag-text');
                if (elm[0]) {
                    elm.text($translate.instant('Drag & Drop File Here'));
                }

                elm = angular.element('.lf-ng-md-file-input-button-brower');
                if (elm[0] && elm[0].childNodes[1] && elm[0].childNodes[1].data) {
                    elm[0].childNodes[1].data = ' ' + $translate.instant('Browse');
                }

                elm = angular.element('.lf-ng-md-file-input-button-remove');
                if (elm[0] && elm[0].childNodes[1] && elm[0].childNodes[1].data) {
                    elm[0].childNodes[1].data = $translate.instant('Remove');
                }

                elm = angular.element('.lf-ng-md-file-input-caption-text-default');
                if (elm[0]) {
                    elm.text($translate.instant('Select File'));
                }
            });
        },
        controllerAs: 'ctrl',
        priority: 1,
        tags: ['image', 'audio', 'vedio', 'file', 'url', 'image-url', 'avatar', 'thumbnail']
    });




    /**
     * @ngdoc WB Resources
     * @name file-local
     * @description Select a local file and return the object
     * 
     * This is used to select local file. It may be used in any part of the system. For example,
     * to upload as content.
     */
    $resource.newPage({
        type: 'local-file',
        icon: 'file_upload',
        label: 'Local file',
        templateUrl: 'views/resources/mb-local-file.html',
        /*
         * @ngInject
         */
        controller: function ($scope, $q, style) {
            var ctrl = this;
            $scope.style = style;
            $scope.answer = function () {
                if (angular.isArray(ctrl.files) && ctrl.files.length) {
                    return $q.resolve(ctrl.files[0].lfFile);
                }
                return $q.reject('No file selected');
            };
        },
        controllerAs: 'resourceCtrl',
        priority: 1,
        tags: ['local-file']
    });



    //-------------------------------------------------------------//
    // CMS:
    //
    // - Term Taxonomies
    //-------------------------------------------------------------//
    $resource.newPage({
        label: 'Term Taxonomies',
        type: '/cms/term-taxonomies',
        templateUrl: 'views/resources/mb-term-taxonomies.html',
        /*
         * @ngInject
         */
        controller: function ($scope) {
            $scope.multi = true;
            this.value = $scope.value;
            this.setSelected = function (item, selected) {
                this._setSelected(item, selected);
                $scope.$parent.setValue(this.getSelection());
            };
            this._setSelected = setSelected;
            this.isSelected = isSelected;
            this.getSelection = getSelection;
        },
        controllerAs: 'resourceCtrl',
        priority: 8,
        tags: ['/cms/term-taxonomies']
    });

    //-------------------------------------------------------------//
    // Modules:
    //
    // - CMS module
    // - Manual module
    //-------------------------------------------------------------//
    $resource.newPage({
        label: 'Manual',
        type: 'mb-module-manual',
        templateUrl: 'views/resources/mb-module-manual.html',
        /*
         * @ngInject
         */
        controller: function ($scope) {
            $scope.$watch('module', function(value) {
                $scope.$parent.setValue([value]);
            }, true);
            $scope.module = _.isArray($scope.value) ? $scope.value[0] : $scope.value;
        },
        controllerAs: 'resourceCtrl',
        priority: 8,
        tags: ['/app/modules']
    });

    $resource.newPage({
        type: 'cms-content-module',
        icon: 'image',
        label: 'On Domain Modules',
        templateUrl: 'views/resources/mb-module-cms.html',
        /*
         * @ngInject
         */
        controller: function ($scope) {

            /*
             * Extends collection controller
             */
            angular.extend(this, $controller('AmWbSeenCmsContentsCtrl', {
                $scope: $scope
            }));

            /*
             * Sets value
             */
            this.setSelected = function (content) {
                var modules = [{
                    title: content.title,
                    load: this.loadType,
                    url: '/api/v2/cms/contents/' + content.name + '/content',
                    type: content.mime_type === 'application/javascript' ? 'js' : 'css'
                }];
                this.value = modules;
                $scope.$parent.setValue(modules);
            };

            /*
             * Sets load type
             */
            this.setLoadType = function(loadType){
                this.loadType = loadType;
                _.forEach(this.value, function(module){
                    module.load = loadType;
                });
                $scope.$parent.setValue(this.value);
            };

            // init the controller
            this.loadType = 'lazy';
            this.init();
        },
        controllerAs: 'ctrl',
        priority: 7,
        tags: ['/app/modules']
    });
});

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

angular.module('mblowfish-core')

/**
 * @ngdoc Services
 * @name $actions
 * @description Manage application actions
 * 
 * Controllers and views can access actions which is registered by an
 * applications. This service is responsible to manage global actions.
 * 
 */
.service('$actions', function(
        /* angularjs */ $window,
        /* mb        */ Action, ActionGroup, WbObservableObject) {

    // extend from observable object
    angular.extend(this, WbObservableObject.prototype);
    WbObservableObject.apply(this);

    this.actionsList = [];
    this.actionsMap = {};

    this.groupsList = [];
    this.groupsMap = [];

    this.actions = function () {
        return {
            'items' : this.actionsList
        };
    }

    // TODO: maso, 2018: add document
    this.newAction = function (data) {
        // Add new action
        var action = new Action(data);
        // remove old one
        var oldaction = this.action(action.id);
        if(oldaction){
            this.removeAction(oldaction);
        }
        // add new one
        this.actionsMap[action.id] = action;
        this.actionsList.push(action);
        if (action.scope) {
            var service = this;
            action.scope.$on('$destroy', function() {
                service.removeAction(action);
            });
        }
        this.updateAddByItem(action);
        this.fire('actionsChanged', {
            value: action,
            oldValue: oldaction
        });
        return action;
    };

    /**
     * gets action with id
     */
    this.getAction = function (actionId) {
        var action = this.actionsMap[actionId];
        if (action) {
            return action;
        }
    };

    // TODO: maso, 2018: add document
    this.action = this.getAction;

    // TODO: maso, 2018: add document
    this.removeAction = function (action) {
        this.actionsMap[action.id] = null;
        var index = this.actionsList.indexOf(action);
        if (index > -1) {
            this.actionsList.splice(index, 1);
            this.updateRemoveByItem(action);
            this.fire('actionsChanged', {
                value: undefined,
                oldValue: action
            });
            return action;
        }
    };

    // TODO: maso, 2018: add document
    this.groups = function() {
        return {
            'items' : this.groupsList
        };
    };

    // TODO: maso, 2018: add document
    this.newGroup = function(groupData) {
        // TODO: maso, 2018: assert id
        return this.group(groupData.id, groupData);
    };

    // TODO: maso, 2018: add document
    this.group = function (groupId, groupData) {
        var group = this.groupsMap[groupId];
        if (!group) {
            group = new ActionGroup(groupData);
            group.id = groupId;
            // TODO: maso, 2019: just use group map and remove groupList
            this.groupsMap[group.id] = group;
            this.groupsList.push(group);
            this.updateAddByItem(group);
        }else if (groupData) {
            angular.extend(group, groupData);
        }
        this.fire('groupsChanged', {
            value: group
        });
        return group;
    };

    this.updateAddByItem = function(item){
        var groups = item.groups || [];
        for (var i = 0; i < groups.length; i++) {
            var group = this.group(groups[i]);
            group.addItem(item);
        }
    };

    this.updateRemoveByItem = function(item){
        var groups = item.groups || [];
        for (var i = 0; i < groups.length; i++) {
            var group = this.group(groups[i]);
            group.removeItem(item);
        }
    };

    this.exec = function(actionId, $event){
        $event = $event || {
            stopPropagation: function(){},
            preventDefault: function(){},
        }; // TODO: amso, 2020: crate an action event
        var action = this.getAction(actionId);
        if(!action){
            $window.alert('Action \''+actionId +'\' not found!');
            return;
        }
        return action.exec($event);
    };

});

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
 * NOTE: base application data is created in run/app.js
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
.service('$app', function (
		/* seen          */ $usr, $cms, $tenant, UserAccount, $translate, $localStorage, 
		/* am-wb-core    */ $dispatcher, $objectPath,
		/* material      */ $mdDateLocale,
		/* angularjs     */ $httpParamSerializerJQLike, $http, $q, $rootScope, $timeout
		) {
	
	
//	/*
//	 * Extends application to be observable
//	 */
//	angular.extend(this, new WbObservableObject());

	/***************************************************************************
	 * utils
	 **************************************************************************/
	/*
	 * Bind list of roles to app data
	 */
	function rolesToPermissions(roles) {
		var permissions = [];
		for (var i = 0; i < roles.length; i++) {
			var role = roles[i];
			permissions[role.application + '_' + role.code_name] = true;
		}
		return permissions;
	}

	function keyValueToMap(keyvals) {
		var map = [];
		for (var i = 0; i < keyvals.length; i++) {
			var keyval = keyvals[i];
			map[keyval.key] = keyval.value;
		}
		return map;
	}

	function parseBooleanValue(value) {
		value = value.toLowerCase();
		switch (value) {
		case true:
		case 'true':
		case '1':
		case 'on':
		case 'yes':
			return true;
		default:
			return false;
		}
	}

	/***************************************************************************
	 * applicaiton data
	 **************************************************************************/
	var appConfigurationContent = null;

	// the state machine
	var stateMachine;

	// Constants
	var APP_CNF_MIMETYPE = 'application/amd-cnf';
	var USER_DETAIL_GRAPHQL = '{id, login, profiles{first_name, last_name, language, timezone}, roles{id, application, code_name}, groups{id, name, roles{id, application, code_name}}}';
	var TENANT_GRAPHQL = '{id,title,description,'+
	'account'+USER_DETAIL_GRAPHQL +
	'configurations{key,value}' +
	'settings{key,value}' +
	'}';


	/**
	 * Handles internal service events
	 */
	function handleEvent(key, data){
		// update internal state machine
		stateMachine.handle(key, data);
	}

	/**
	 * Sets state of the service
	 * 
	 * NOTE: must be used locally
	 */
	function setApplicationState(state){
		// create event
		var $event = {
				type: 'update',
				value: state,
				oldValue: $rootScope.__app.state
		};
		$rootScope.__app.state = state;

		// staso, 2019: fire the state is changed
		$dispatcher.dispatch('/app/state', $event);

		// TODO: move to application extension
		_loadingLog('$app event handling', '$app state is changed from ' + $event.oldValue + ' to '+ state);
	}

	/**
	 * Gets the state of the application
	 * 
	 * @memberof $app
	 */
	this.getState = function(){
		return  $rootScope.__app.state;
	};

	function setApplicationDirection(dir) {
		$rootScope.__app.dir = dir;
	}

	function setApplicationLanguage(key) {
		if($rootScope.__app.state !== 'ready'){
			return;
		}
		// 0- set app local
		$rootScope.__app.language = key;
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
	}

	function setApplicationCalendar(key) {
		// 0- set app local
		$rootScope.__app.calendar = key;
	}

	function parsTenantConfiguration(configs){
		$rootScope.__tenant.configs = keyValueToMap(configs);
		var $event = {
				src: this,
				type: 'update',
				value: $rootScope.__tenant.configs
		};
		$dispatcher.dispatch('/tenant/configs', $event);

		// load domains
		var domains = {};
		var regex = new RegExp('^module\.(.*)\.enable$', 'i');
		for(var i = 0; i < configs.length; i++){
			var config = configs[i];
			var match = regex.exec(config.key);
			if(match) {
				var key = match[1].toLowerCase();
				domains[key] = parseBooleanValue(config.value);
			}
		}
		$rootScope.__tenant.domains = domains;
		// Flux: fire account change
		var $event = {
				src: this,
				type: 'update',
				value: $rootScope.__tenant.domains
		};
		$dispatcher.dispatch('/tenant/domains', $event);
	}

	function parsTenantSettings(settings){
		$rootScope.__tenant.settings = keyValueToMap(settings);
		$rootScope.__app.options = $rootScope.__tenant.settings;

		// Flux: fire setting change
		var $event = {
				src: this,
				type: 'update',
				value: $rootScope.__account
		};
		$dispatcher.dispatch('/tenant/settings', $event);
	}

	function parsAccount(account){
		var anonymous = !account.id || account.id == 0;

		// app user data
		$rootScope.__app.user = {
				anonymous: anonymous,
				current: new UserAccount(account)
		};
		// load basic information of account
		$rootScope.__account.anonymous = anonymous;
		$rootScope.__account.id = account.id;
		$rootScope.__account.login = account.login;
		$rootScope.__account.email = account.email;

		if(anonymous) {
			// legacy
			$rootScope.__app.user.profile = {};
			$rootScope.__app.user.roles = {};
			$rootScope.__app.user.groups = {};
			// update app
			$rootScope.__account.profile = {};
			$rootScope.__account.roles = {};
			$rootScope.__account.groups = {};
			return;
		}
		// load the first profile of user
		if(angular.isArray(account.profiles)){
			var profile = account.profiles.length? account.profiles[0] : {};
			$rootScope.__app.user.profile = profile;
			$rootScope.__account.profile = profile;
		}
		// load user roles, groups and permissions
		var permissions = rolesToPermissions(account.roles || []);
		var groupMap = {};
		var groups = account.groups || [];
		for (var i = 0; i < groups.length; i++) {
			var group = groups[i];
			groupMap[group.name] = true;
			_.assign(permissions, rolesToPermissions(group.roles || []));
		}
		_.assign($rootScope.__app.user, permissions);
		$rootScope.__account.permissions = permissions;
		$rootScope.__account.roles = account.roles || [];
		$rootScope.__account.groups = account.groups || [];

		// Flux: fire account change
		var $event = {
				src: this,
				type: 'update',
				value: $rootScope.__account
		};
		$dispatcher.dispatch('/account', $event);
	}

	/***********************************************************
	 * Application configuration
	 ***********************************************************/
	/*
	 * deprecated: watch application configuration
	 */
	var __configs_clean = false;
	$rootScope.$watch('__app.configs', function(newValue,oldValue){
		if(!__configs_clean){
			return;
		}
		$dispatcher.dispatch('/app/configs', {
			type: 'update',
			value: newValue,
			oldValue: oldValue
		});
	}, true);

	/**
	 * Load application configuration
	 */
	function parsAppConfiguration(config){
		if(angular.isString(config)){
			try{
				config = JSON.parse(config);
			}catch(ex){
			}
		}
		config = angular.isObject(config) ? config : {};
		$rootScope.__app.config = config;
		$rootScope.__app.configs = config;

		// Support old config
		if($rootScope.__app.configs.local){
			$rootScope.__app.configs.language = $rootScope.__app.configs.local.language;
			$rootScope.__app.configs.calendar = $rootScope.__app.configs.local.calendar;
			$rootScope.__app.configs.dir = $rootScope.__app.configs.local.dir;
			$rootScope.__app.configs.dateFormat = $rootScope.__app.configs.local.dateFormat;
			delete $rootScope.__app.configs.local;
		}

		// Flux: fire application config
		$dispatcher.dispatch('/app/configs', {
			src: this,
			type: 'load',
			value: $rootScope.__app.configs
		});
		// TODO: remove watch on configs
		$timeout(function(){
			__configs_clean = true;
		}, 1000);
	}

	this.getConfig = function(key){
		return objectPath.get($rootScope.__app.configs, key);
	};

	this.setConfig = function(key, value){
		var oldValue = this.getConfig(key);
		objectPath.set($rootScope.__app.configs, key, value);
		// Flux: fire application config
		$dispatcher.dispatch('/app/configs', {
			src: this,
			type: 'update',
			key: key,
			value: value,
			oldValue: oldValue
		});
	};

	function loadDefaultApplicationConfig(){
		// TODO: load last valid configuration from settings
	}

	/************************************************************
	 * Application stting
	 ************************************************************/

	function parsAppSettings(settings){
		$rootScope.__app.setting = settings;
		$rootScope.__app.settings = settings;


		// Flux: fire application settings
		var $event = {
				src: this,
				type: 'update',
				value: $rootScope.__app.settings
		};
		$dispatcher.dispatch('/app/settings', $event);
	}

	/*
	 * Loads current user informations
	 * 
	 * If there is a role x.y (where x is application code and y is code name)
	 * in role list then the following var is added in user:
	 * 
	 * $rootScope.__app.user.x_y
	 * 
	 */
	function loadUserProperty() {
		_loadingLog('loading user info', 'fetch user information');
		return $usr.getAccount('current', {
			graphql: USER_DETAIL_GRAPHQL
		}) //
		.then(parsAccount);
	}

	function loadRemoteData(){
		_loadingLog('loading', 'fetch remote storage');

		// application config
		var pLoadAppConfig = $cms.getContent($rootScope.__app.configs_key) //
		.then(function (content) {
			appConfigurationContent = content;
			return appConfigurationContent.downloadValue();
		})
		.then(parsAppConfiguration);

		// load current tenant
		var pCurrentTenant = $tenant.getTenant('current', {
			graphql: TENANT_GRAPHQL
		})
		.then(function(data){
			parsTenantConfiguration(data.configurations || []);
			parsTenantSettings(data.settings || []);
			parsAccount(data.account || []);
		});
		return $q.all([pLoadAppConfig, pCurrentTenant]);
	}

	function loadLocalData(){
		_loadingLog('loading setting from local storage', 'fetch settings');
		/*
		 * TODO: masood, 2018: The lines below is an alternative for lines above
		 * but not recommended.
		 * 
		 * TODO: 'key' of app should be used $localStorage.setPrefix(key);
		 */
		var settings = $localStorage.$default({
			dashboardModel: {}
		});
		return $q.resolve(settings)
		.then(parsAppSettings);
	}

	function loadApplication(){
		return $q.all([
			loadRemoteData(),
			loadLocalData()])
			.finally(function(){
				// TODO: maso, check if all things are ok
				if($rootScope.__app.isOffline){
					handleEvent(APP_EVENT_NET_ERROR);
					return;
				}
				if($rootScope.__app.isRemoteDataLoaded){
					handleEvent(APP_EVENT_SERVER_ERROR);
					return;
				}
				if($rootScope.__app.isApplicationConfigLoaded){
					handleEvent(APP_EVENT_APP_CONFIG_ERROR);
					return;
				}
				handleEvent(APP_EVENT_LOADED);
			});
	}

	/**
	 * Start the application
	 * 
	 * this function is called when the app get started.
	 * 
	 * @memberof $app
	 */
	function start(key) {
		$rootScope.__app.key = key;
		$rootScope.__app.configs_key = 'angular-material-blowfish-' + key;

		// handle internal events
		handleEvent(APP_EVENT_START);
	}

	/***************************************************************************
	 * 
	 **************************************************************************/

	// states
	var APP_STATE_WAITING = 'waiting';
	var APP_STATE_LOADING = 'loading';

	// final states
	var APP_STATE_READY = 'ready';
	var APP_STATE_OFFLINE = 'offline';
	var APP_STATE_FAIL = 'fail';

	var APP_EVENT_LOADED = 'loaded';
	var APP_EVENT_START = 'start';
	var APP_EVENT_SERVER_ERROR = 'server_error';
	var APP_EVENT_NET_ERROR = 'network_error';
	var APP_EVENT_APP_CONFIG_ERROR = 'config_error';

	/*
	 * Attaches loading logs
	 */
	function _loadingLog(stage, message) {
		$rootScope.__app.logs.push(stage + ':' + message);
	}

	/*
	 * Stores app configuration on the back end
	 */
	this.storeApplicationConfig = function() {
		if (!$rootScope.__account.permissions.tenant_owner) {
			return;
		}
		if (appConfigurationContent) { // content loaded
			return appConfigurationContent.uploadValue($rootScope.__app.configs);
		} 
		// create content
		promise = $cms.putContent({
			name: $rootScope.__app.configs_key,
			mimetype: APP_CNF_MIMETYPE
		})
		.then(function (content) {
			appConfigurationContent = content;
			return appConfigurationContent.uploadValue($rootScope.__app.configs);
		});
	};

	/*
	 * Check a module to see if it is enable or not
	 */
	// TODO: Masood, 2019: Improve the function to check based on tenant setting
	function isEnable (moduleName) {
		return $rootScope.__tenant.domains[moduleName];
	}

	/**
	 * Logins into the backend
	 * 
	 * @memberof $app
	 * @param {object}
	 *            credential of the user
	 */
	function login(credential) {
		if (!$rootScope.__account.anonymous) {
			return $q.resolve($rootScope.__account);
		}
		return $http({
			method: 'POST',
			url: '/api/v2/user/login',
			data: $httpParamSerializerJQLike(credential),
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			}
		})
		.then(loadUserProperty);
	}

	/**
	 * Application logout
	 * 
	 * Logout and clean user data, this will change state of the application.
	 * 
	 * @memberof $app
	 */
	function logout() {
		if ($rootScope.__account.anonymous) {
			return $q.resolve($rootScope.__account);
		}
		return $http({
			method: 'POST',
			url: '/api/v2/user/logout',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			}
		})
		.then(loadUserProperty);
	}


	/*
	 * State machine to handle life cycle of the system.
	 */
	stateMachine = new machina.Fsm({
		namespace: 'webpich.$app',
		initialState: APP_STATE_WAITING,
		states: {
			// Before the 'start' event occurs via $app.start().
			waiting: {
				start: APP_STATE_LOADING,
				network_error: APP_STATE_OFFLINE,
				server_error: APP_STATE_FAIL
			},
			// tries to load all part of system
			loading: {
				_onEnter: function () {
					loadApplication();
				},
				loaded: APP_STATE_READY,
				network_error: APP_STATE_OFFLINE,
				server_error: APP_STATE_FAIL,
				config_error: APP_STATE_READY,
			},
			// app is ready
			ready: {
				loaded: APP_STATE_READY,
				network_error: APP_STATE_OFFLINE,
				server_error: APP_STATE_FAIL,
				config_error: APP_STATE_READY,
			},
			// app is ready with no config
			ready_not_configured: {
				_onEnter: function () {
					loadDefaultApplicationConfig();
				},
				loaded: APP_STATE_READY,
				network_error: APP_STATE_OFFLINE,
				server_error: APP_STATE_FAIL,
				config_error: APP_STATE_READY,
			},
			// server error
			fail: {
				loaded: APP_STATE_READY,
				network_error: APP_STATE_OFFLINE,
				server_error: APP_STATE_FAIL,
				config_error: APP_STATE_READY,
			},
			// net error
			offline: {
				_onEnter: function () {
					offlineReloadDelay = 3000;
					$timeout(loadApplication, offlineReloadDelay);
				},
				loaded: APP_STATE_READY,
				network_error: APP_STATE_OFFLINE,
				server_error: APP_STATE_FAIL,
				config_error: APP_STATE_READY,
			}
		},
	});

	// I'd like to know when the transition event occurs
	stateMachine.on('transition', function () {
		setApplicationState(stateMachine.state);
	});

	/*
	 * watch direction and update app.dir
	 */
	$rootScope.$watch(function () {
		return $rootScope.__app.settings.dir || $rootScope.__app.configs.dir || 'ltr';
	}, setApplicationDirection);

	/*
	 * watch local and update language
	 */
	$rootScope.$watch(function () {
		// Check language
		return $rootScope.__app.settings.language || $rootScope.__app.configs.language || 'en';
	}, setApplicationLanguage);

	/*
	 * watch calendar
	 */
	$rootScope.$watch(function () {
		return $rootScope.__app.settings.calendar || $rootScope.__app.configs.calendar || 'Gregorian';
	}, setApplicationCalendar);

	// Init
	this.start = start;
	this.login = login;
	this.logout = logout;
	this.isEnable = isEnable;

	// test
	// TODO: remove in deploy
	this.__parsTenantConfiguration = parsTenantConfiguration;

	
	
	/**************************************************************************
	 * application properties
	 **************************************************************************/
	this.getProperty = function(key, defaultValue) {
		var tempObject = {
				app: $rootScope.__app,
				tenant: $rootScope.__tenant,
				account: $rootScope.__account,
		}
		return $objectPath.get(tempObject, key) || defaultValue;
	};

	this.setProperty = function(key, value){
		// TODO:
	};

	this.setProperties = function(map){
		// TODO:
	};
	
	
	/*
	 * Check if current account changed
	 */
	$dispatcher.on('/user/accounts/current', function(){
		loadUserProperty();
	});

	return this;
});
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
angular.module('mblowfish-core') //

.service('$clipboard', function () {
    
    this.copyTo = function (model) {
        /*
         * TODO: Masood, 2019: There is also another solution but now it doesn't
         * work because of browsers problem A detailed solution is presented in:
         * https://stackoverflow.com/questions/400212/how-do-i-copy-to-the-clipboard-in-javascript
         */
        var js = JSON.stringify(model);
        var fakeElement = document.createElement('textarea');
        fakeElement.value = js;
        document.body.appendChild(fakeElement);
        fakeElement.select();
        document.execCommand('copy');
        document.body.removeChild(fakeElement);
        return;
    };
});
/* 
 * The MIT License (MIT)
 * 
 * Copyright (c) 2016 weburger
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


/* eslint no-bitwise: 0 */
angular.module('mblowfish-core')
/**
 * @ngdoc Services
 * @name $$wbCrypto
 * @description Crypto services
 * 
 * 
 */
.service('$wbCrypto', function() {

    function md5cycle(x, k) {
        var a = x[0], b = x[1], c = x[2], d = x[3];

        a = ff(a, b, c, d, k[0], 7, -680876936);
        d = ff(d, a, b, c, k[1], 12, -389564586);
        c = ff(c, d, a, b, k[2], 17, 606105819);
        b = ff(b, c, d, a, k[3], 22, -1044525330);
        a = ff(a, b, c, d, k[4], 7, -176418897);
        d = ff(d, a, b, c, k[5], 12, 1200080426);
        c = ff(c, d, a, b, k[6], 17, -1473231341);
        b = ff(b, c, d, a, k[7], 22, -45705983);
        a = ff(a, b, c, d, k[8], 7, 1770035416);
        d = ff(d, a, b, c, k[9], 12, -1958414417);
        c = ff(c, d, a, b, k[10], 17, -42063);
        b = ff(b, c, d, a, k[11], 22, -1990404162);
        a = ff(a, b, c, d, k[12], 7, 1804603682);
        d = ff(d, a, b, c, k[13], 12, -40341101);
        c = ff(c, d, a, b, k[14], 17, -1502002290);
        b = ff(b, c, d, a, k[15], 22, 1236535329);

        a = gg(a, b, c, d, k[1], 5, -165796510);
        d = gg(d, a, b, c, k[6], 9, -1069501632);
        c = gg(c, d, a, b, k[11], 14, 643717713);
        b = gg(b, c, d, a, k[0], 20, -373897302);
        a = gg(a, b, c, d, k[5], 5, -701558691);
        d = gg(d, a, b, c, k[10], 9, 38016083);
        c = gg(c, d, a, b, k[15], 14, -660478335);
        b = gg(b, c, d, a, k[4], 20, -405537848);
        a = gg(a, b, c, d, k[9], 5, 568446438);
        d = gg(d, a, b, c, k[14], 9, -1019803690);
        c = gg(c, d, a, b, k[3], 14, -187363961);
        b = gg(b, c, d, a, k[8], 20, 1163531501);
        a = gg(a, b, c, d, k[13], 5, -1444681467);
        d = gg(d, a, b, c, k[2], 9, -51403784);
        c = gg(c, d, a, b, k[7], 14, 1735328473);
        b = gg(b, c, d, a, k[12], 20, -1926607734);

        a = hh(a, b, c, d, k[5], 4, -378558);
        d = hh(d, a, b, c, k[8], 11, -2022574463);
        c = hh(c, d, a, b, k[11], 16, 1839030562);
        b = hh(b, c, d, a, k[14], 23, -35309556);
        a = hh(a, b, c, d, k[1], 4, -1530992060);
        d = hh(d, a, b, c, k[4], 11, 1272893353);
        c = hh(c, d, a, b, k[7], 16, -155497632);
        b = hh(b, c, d, a, k[10], 23, -1094730640);
        a = hh(a, b, c, d, k[13], 4, 681279174);
        d = hh(d, a, b, c, k[0], 11, -358537222);
        c = hh(c, d, a, b, k[3], 16, -722521979);
        b = hh(b, c, d, a, k[6], 23, 76029189);
        a = hh(a, b, c, d, k[9], 4, -640364487);
        d = hh(d, a, b, c, k[12], 11, -421815835);
        c = hh(c, d, a, b, k[15], 16, 530742520);
        b = hh(b, c, d, a, k[2], 23, -995338651);

        a = ii(a, b, c, d, k[0], 6, -198630844);
        d = ii(d, a, b, c, k[7], 10, 1126891415);
        c = ii(c, d, a, b, k[14], 15, -1416354905);
        b = ii(b, c, d, a, k[5], 21, -57434055);
        a = ii(a, b, c, d, k[12], 6, 1700485571);
        d = ii(d, a, b, c, k[3], 10, -1894986606);
        c = ii(c, d, a, b, k[10], 15, -1051523);
        b = ii(b, c, d, a, k[1], 21, -2054922799);
        a = ii(a, b, c, d, k[8], 6, 1873313359);
        d = ii(d, a, b, c, k[15], 10, -30611744);
        c = ii(c, d, a, b, k[6], 15, -1560198380);
        b = ii(b, c, d, a, k[13], 21, 1309151649);
        a = ii(a, b, c, d, k[4], 6, -145523070);
        d = ii(d, a, b, c, k[11], 10, -1120210379);
        c = ii(c, d, a, b, k[2], 15, 718787259);
        b = ii(b, c, d, a, k[9], 21, -343485551);

        x[0] = add32(a, x[0]);
        x[1] = add32(b, x[1]);
        x[2] = add32(c, x[2]);
        x[3] = add32(d, x[3]);

    }

    function cmn(q, a, b, x, s, t) {
        a = add32(add32(a, q), add32(x, t));
        return add32((a << s) | (a >>> (32 - s)), b);
    }

    function ff(a, b, c, d, x, s, t) {
        return cmn((b & c) | ((~b) & d), a, b, x, s, t);
    }

    function gg(a, b, c, d, x, s, t) {
        return cmn((b & d) | (c & (~d)), a, b, x, s, t);
    }

    function hh(a, b, c, d, x, s, t) {
        return cmn(b ^ c ^ d, a, b, x, s, t);
    }

    function ii(a, b, c, d, x, s, t) {
        return cmn(c ^ (b | (~d)), a, b, x, s, t);
    }

    function md51(s) {
//        var txt = '';
        var n = s.length, state = [ 1732584193, -271733879,
            -1732584194, 271733878 ], i;
        for (i = 64; i <= s.length; i += 64) {
            md5cycle(state, md5blk(s.substring(i - 64, i)));
        }
        s = s.substring(i - 64);
        var tail = [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0 ];
        for (i = 0; i < s.length; i++)
            tail[i >> 2] |= s.charCodeAt(i) << ((i % 4) << 3);
        tail[i >> 2] |= 0x80 << ((i % 4) << 3);
        if (i > 55) {
            md5cycle(state, tail);
            for (i = 0; i < 16; i++)
                tail[i] = 0;
        }
        tail[14] = n * 8;
        md5cycle(state, tail);
        return state;
    }

    /*
     * there needs to be support for Unicode here, unless we
     * pretend that we can redefine the MD-5 algorithm for
     * multi-byte characters (perhaps by adding every four
     * 16-bit characters and shortening the sum to 32 bits).
     * Otherwise I suggest performing MD-5 as if every
     * character was two bytes--e.g., 0040 0025 = @%--but
     * then how will an ordinary MD-5 sum be matched? There
     * is no way to standardize text to something like UTF-8
     * before transformation; speed cost is utterly
     * prohibitive. The JavaScript standard itself needs to
     * look at this: it should start providing access to
     * strings as preformed UTF-8 8-bit unsigned value
     * arrays.
     */
    function md5blk(s) { /* I figured global was faster. */
        var md5blks = [], i;
        /*
         * Andy King said do it this
         * way.
         */
        for (i = 0; i < 64; i += 4) {
            md5blks[i >> 2] = s.charCodeAt(i)
            + (s.charCodeAt(i + 1) << 8)
            + (s.charCodeAt(i + 2) << 16)
            + (s.charCodeAt(i + 3) << 24);
        }
        return md5blks;
    }

    var hex_chr = '0123456789abcdef'.split('');

    function rhex(n) {
        var s = '', j = 0;
        for (; j < 4; j++)
            s += hex_chr[(n >> (j * 8 + 4)) & 0x0F]
        + hex_chr[(n >> (j * 8)) & 0x0F];
        return s;
    }

    function hex(x) {
        for (var i = 0; i < x.length; i++)
            x[i] = rhex(x[i]);
        return x.join('');
    }

    function md5(s) {
        return hex(md51(s));
    }

    /*
     * this function is much faster, so if possible we use
     * it. Some IEs are the only ones I know of that need
     * the idiotic second function, generated by an if
     * clause.
     */

    function add32(a, b) {
        return (a + b) & 0xFFFFFFFF;
    }

//    if (md5('hello') != '5d41402abc4b2a76b9719d911017c592') {
//        function add32(x, y) {
//            var lsw = (x & 0xFFFF) + (y & 0xFFFF), msw = (x >> 16)
//            + (y >> 16) + (lsw >> 16);
//            return (msw << 16) | (lsw & 0xFFFF);
//        }
//    }

    this.md5 = md5;
    return this;
});

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


angular.module('mblowfish-core')

/**
 * @ngdoc Services
 * @name $errorHandler
 * @description A service to handle errors in forms.
 * 
 * 
 * 
 */
.service('$errorHandler', function() {

	/**
	 * Checks status, message and data of the error. If given form is not null,
	 * it set related values in $error of fields in the form. It also returns a
	 * general message to show to the user.
	 */
	function handleError(error, form) {
		var message = null;
		if (error.status === 400 && form) { // Bad request
			message = 'Form is not valid. Fix errors and retry.';
			error.data.data.forEach(function(item) {
				form[item.name].$error = {};
				item.constraints.map(function(cons) {
					if (form[item.name]) {
						form[item.name].$error[cons.toLowerCase()] = true;
					}
				});
			});
		} else {
			message = error.data.message;
		}

		return message;
	}

	return {
		handleError : handleError
	};
});

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


angular.module('mblowfish-core')

/**
 * @ngdoc Services
 * @name $amdExport
 * @description Data model exporter
 * 
 * Export data model into a CSV file.
 * 
 */
.service('$amdExport', function(FileSaver, $q, QueryParameter) {

	/**
	 * 
	 * @param findMethod
	 * @param paginationParams
	 * @param type
	 * @param name
	 * @returns
	 */
	function exportList(objectRef, findMethod, QueryParameter, type, name) {
		var params = new QueryParameter();
		// TODO: maso, 2017: adding funnction to clone params
		//
		// Example: params = new QueryParameter(old);
		params.put('_px_q ', QueryParameter.get('_px_q'));
		params.put('_px_sk ', QueryParameter.get('_px_sk'));
		params.put('_px_so ', QueryParameter.get('_px_so'));
		params.put('_px_fk ', QueryParameter.get('_px_fk'));
		params.put('_px_fv ', QueryParameter.get('_px_fv'));
		params.setPage(0);

		var dataString = '';
		var attrs;

		function toString(response) {
			var str = '';
			angular.forEach(response.items, function(item) {
				var line = '';
				angular.forEach(attrs, function(key) {
					line = line + (item[key] || ' ') + ',';
				});
				str = str + line.slice(0, -1) + '\n';
			});
			return str;
		}

		/*
		 * Load page
		 */
		function storeData(response) {
			// save  result
			dataString = dataString + toString(response);
			if (!response.hasMore()) {
				var data = new Blob([ dataString ], {
					type : 'text/plain;charset=utf-8'
				});
				return FileSaver.saveAs(data, name + '.' + type);
			}
			params.setPage(response.next());
			return findMethod.apply(objectRef, [ params ]) //
			.then(storeData);
		}

		return findMethod.apply(objectRef, [ params ])
		.then(function(response) {
			// initial list of fields to save
			if (!attrs) {
				var keys = Object.keys(response.items[0]);
				attrs = [];
				angular.forEach(keys, function(key) {
					if (!(angular.isFunction(response.items[0][key]) || angular.isObject(response.items[0][key]))) {
						attrs.push(key);
					}
				});
			}
			// first line of result file (titles of columns)
			var keysStr = '';
			angular.forEach(attrs, function(key) {
				keysStr = keysStr + key + ',';
			});

			dataString = keysStr.slice(0, -1) + '\n';
			return storeData(response);
		});
	}

	return {
		'list' : exportList
	};
});
/* 
 * The MIT License (MIT)
 * 
 * Copyright (c) 2016 weburger
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

angular.module('mblowfish-core')

/**
 * @ngdoc Services
 * @name $wbFloat
 * @description Open and manage float panels
 * 
 * 
 * The base of this implementation is https://jspanel.de/api.html
 */
.service('$wbFloat', function($q, $wbUtil, $rootScope, $compile, $controller) {
	

	/**
	 * @ngdoc Factory
	 * @name InternalDialog
	 * @description The internal dialog
	 * 
	 * Manage an internal dialog
	 */
	function InternalDialog(optionsOrPreset){
		this.setUserOptions(optionsOrPreset);
		var dialog = this;
		this.callback = function() {
			var element = angular.element(this.content);
			dialog.setElement(element);
		};
		this.onclosed = function(){
			/*
			 * Remove scope
			 * 
			 * NOTE: if there is a $watch, then this return an error
			 */
			if(dialog.scope){
				dialog.scope.$destroy();
				delete dialog.scope;
			}
		};
	}

	InternalDialog.prototype.setUserOptions = function(optionsOrPreset) {
		this._userOptions = optionsOrPreset;
		this.theme = 'primary';

		this.closeOnEscape =  optionsOrPreset.closeOnEscape;

		this.header = optionsOrPreset.header;
		this.headerTitle = optionsOrPreset.headerTitle || 'my panel #1';
		this.headerControls = optionsOrPreset.headerControls || 'all';

		this.position = optionsOrPreset.position || 'center-top 0 0';
		this.panelSize = optionsOrPreset.panelSize || '400 400';
		this.contentSize = optionsOrPreset.contentSize || '450 250';
	};

	InternalDialog.prototype.getUserOptions = function() {
		return this._userOptions;
	};

	InternalDialog.prototype.setRootElement = function(element){
		this._rootElement = element;
		element.css('visibility', this._isVisible ? 'visible' : 'hidden');
	};

	InternalDialog.prototype.getRootElement = function(){
		return this._rootElement;
	};

	InternalDialog.prototype.setElement = function(element){
		this._element = element;
		if(this._element){
			if(this._elementPromise){
				this._elementPromise.resolve(element);
			}
		}
	};

	InternalDialog.prototype.getElement = function(){
		if(!this._element){
			if(!this._elementPromise){
				this._elementPromise = $q.defer();
			}
			return this._elementPromise.promise;
		}
		return $q.when(this._element);
	};

	InternalDialog.prototype.setScope = function(scope){
		this._scope = scope;
	};

	InternalDialog.prototype.getScope = function(){
		return this._scope;
	};

	InternalDialog.prototype.setVisible = function(flag){
		this._isVisible = flag;
		var element = this.getRootElement();
		if(element){
			element.css('visibility', this._isVisible ? 'visible' : 'hidden');
		}
	};
	
	InternalDialog.prototype.hide = function(){
		this.setVisible(false);
	};

	InternalDialog.prototype.isVisible = function(){
		return this._isVisible;
	};
	
	InternalDialog.prototype.setPanel = function(panel){
		this._panel = panel;
	};
	
	InternalDialog.prototype.getPanel = function(){
		return this._panel;
	};
	
	/**
	 * Changes size of the panel
	 * 
	 * @memberof InternalDialog
	 * @params w {String|Integer} the width of the panel
	 * @params h {String|Integer} the height of the panel
	 */
	InternalDialog.prototype.resize = function(w, h){
		var panel = this.getPanel();
		panel.resize({
			width: w,
			height: h
		});
	};
	
	InternalDialog.prototype.setView = function(optionsOrPreset){
		var dialog = this;
		var contentElement = null;
		var template = null;
		/*
		 * Create view
		 */
		function createView() {
			// TODO: maso, 2018: check contentElement
			// TODO: maso, 2019: check template
			var parenScope = optionsOrPreset.parent || $rootScope;
			var childScope = optionsOrPreset.scope || parenScope.$new(false, parenScope);

			// 3- bind controller
			var element = angular.element(template);
			var link = $compile(element);
			if (angular.isDefined(optionsOrPreset.controller)) {
				var controller = $controller(optionsOrPreset.controller, {
					$scope: childScope,
					$element: element,
					$wbFloat: dialog
				});
				if (optionsOrPreset.controllerAs) {
					childScope[optionsOrPreset.controllerAs] = controller;
				}
				element.data('$ngControllerController', controller);
			}
			link(childScope);

			contentElement.empty();
			contentElement.append(element);
		}

		// 2- create element
		return this.getElement()
		.then(function(element){
			contentElement = element;
			return $wbUtil.getTemplateFor(optionsOrPreset);
		})
		.then(function(templateL){
			template = templateL;
			return createView();
		});
	};
	
	

	/**
	 * Hide an existing float and resolve the promise returned from
	 * $wbFloat.show()
	 * 
	 * @name hide
	 * @memberof $wbFloat
	 * @param response
	 *            An argument for the resolved promise.
	 * @return promise A promise that is resolved when the float has been
	 *         closed.
	 */
	/**
	 * Hide an existing float and reject the promise returned from
	 * $wbFloat.show().
	 * 
	 * @name hide
	 * @memberof $wbFloat
	 * @param response
	 *            An argument for the rejected promise.
	 * @return promise A promise that is resolved when the float has been
	 *         closed.
	 */
	/**
	 * Display an element with a float dialog
	 * 
	 * @name show
	 * @memberof $wbFloat
	 * @param optionsOrPreset
	 *            {object}
	 *            <ul>
	 *            <li>title - {=string}: title of the float</li>
	 *            <li></li>
	 *            <li></li>
	 *            
	 *            
	 *            <li>templateUrl - {string=}: The URL of a template that will
	 *            be used as the content of the dialog.</li>
	 *            <li>template- {string=}: HTML template to show in the dialog.
	 *            This must be trusted HTML with respect to Angular's $sce
	 *            service. This template should never be constructed with any
	 *            kind of user input or user data.</li>
	 *            <li>contentElement:</li>
	 *            <li>scope - {object=}: the scope to link the template
	 *            controller to. If none is specified, it will create a new
	 *            isolate scope. This scope will be destroyed when the dialog is
	 *            removed unless preserveScope is set to true.</li>
	 *            <li>controller - {function|string=}: The controller to
	 *            associate with the dialog. The controller will be injected
	 *            with the local $mdDialog, which passes along a scope for the
	 *            dialog.</li>
	 *            <li>controllerAs - {string=}: An alias to assign the
	 *            controller to on the scope.</li>
	 *            <li>parent - {element=}: The element to append the dialog to.
	 *            Defaults to appending to the root element of the application.</li>
	 *            </ul>
	 * @return promise A promise that can be resolved with $mdFloat.hide() or
	 *         rejected with $mdFloat.cancel().
	 */
	this.show = function(optionsOrPreset) {
		return $q.resolve(this.create(optionsOrPreset))
		.then(function(dialog){
			dialog.setView(optionsOrPreset);
			return dialog;
		});
	};

	/**
	 * Creates and return a dialog
	 * 
	 * @memberof $wbFloat
	 */
	this.create = function(optionsOrPreset) {
		var dialog = new InternalDialog(optionsOrPreset);
		var panel = jsPanel.create(dialog);
		dialog.setPanel(panel);
		dialog.setRootElement(angular.element(panel));
		return dialog;
	};
});

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


angular.module('mblowfish-core')

/**
 * @ngdoc Services
 * @name $help
 * @description A help management service
 * 
 * Manage application help.
 * 
 * Set help id for an item:
 * 
 * <pre><code>
 * 	var item = {
 * 		...
 * 		helpId: 'help-id'
 * 	};
 * 	$help.openHelp(item);
 * </code></pre>
 * 
 * 
 * 
 * Open help for an item:
 * 
 * <pre><code>
 * $help.openHelp(item);
 * </code></pre>
 * 
 */
.service('$help', function ($q, $rootScope, $translate, $injector) {

    var _tips = [];
    var _currentItem = null;

    /*
     * Get help id
     */
    function _getHelpId(item) {
        if (!item) {
            return null;
        }
        var id = item.helpId;
        if (angular.isFunction(item.helpId)) {
            return $injector.invoke(item.helpId, item);
        }
        return id;
    }

    /**
     * Adds new tip
     * 
     * New tip is added into the tips list.
     * 
     * @memberof $help
     * @param {object}
     *            tipData - Data of a tipe
     */
    function tip(tipData) {
        _tips.push(tipData);
        return this;
    }

    /**
     * List of tips
     * 
     * @memberof $help
     * @return {promise<Array>} of tips
     */
    function tips() {
        return $q.resolve({
            items: _tips
        });
    }

    /**
     * Gets current item in help system
     * 
     * @memberof $help
     * @return {Object} current item
     */
    function currentItem() {
        return _currentItem;
    }

    /**
     * Sets current item in help system
     * 
     * @memberof $help
     * @params item {Object} target of the help system
     */
    function setCurrentItem(item) {
        _currentItem = item;
    }

    /**
     * Gets help path
     * 
     * @memberof $help
     * @params item {Object} an item to show help for
     * @return path of the help
     */
    function getHelpPath(item) {
        // Get from help id
        var myId = _getHelpId(item || _currentItem);
        if (myId) {
            var lang = $translate.use();
            // load content
            return 'resources/helps/' + myId + '-' + lang + '.json';
        }

        return null;
    }

    /**
     * Check if there exist a help on item
     * 
     * @memberof $help
     * @params item {Object} an item to show help for
     * @return path if the item if exist help or false
     */
    function hasHelp(item) {
        return !!_getHelpId(item);
    }

    /**
     * Display help for an item
     * 
     * This function change current item automatically and display help for it.
     * 
     * @memberof $help
     * @params item {Object} an item to show help for
     */
    function openHelp(item) {
        if (!hasHelp(item)) {
            return;
        }
        if (_currentItem === item) {
            $rootScope.showHelp = !$rootScope.showHelp;
            return;
        }
        setCurrentItem(item);
        $rootScope.showHelp = true;
    }

    /*
     * Service structure
     */
    return {
        tip: tip,
        tips: tips,

        currentItem: currentItem,
        setCurrentItem: setCurrentItem,
        openHelp: openHelp,
        hasHelp: hasHelp,
        getHelpPath: getHelpPath
    };
});

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


angular.module('mblowfish-core')

/**
 * @ngdoc Services
 * @name $language
 * @description 
 * Manages languages of the application.
 * This service provide functionality to switch between multiple languages.
 * Also provides functionlity to manage languages (add, remove or edit translations).
 * 
 */
.service('$language', function ($rootScope, $q, $translate) {

    /**
     * Returns language determined by given key.
     * 
     * @memberof $language
     * @param {string} language key - Key of the language
     * @return {object}  Returns language with given key. 
     * @Returns 'undefined' if language does not exist or is not loaded yet.
     */
    function language(key) {
        var languages = $rootScope.app.config.languages;
        if (!languages || !languages.length) {
            return undefined;
        }
        for (var i = 0; i < languages.length; i++) {
            if (languages[i].key === key) {
                return languages[i];
            }
        }
        return undefined;
    }

    /**
     * Returns list of defined and loaded languages.
     * 
     * @memberof $language
     * @return {promise<Array>} of languages
     */
    function languages() {
        var langs = $rootScope.app.config.languages;
        var res = {items: langs || []};
        return $q.when(res);


//      var deferred = $q.defer();
//deferred.resolve(res);
//      return deferred.promise;
    }

    /**
     * Adds a new language
     * 
     * @param {object} lang - Object contain information of a language.
     * 		A language object would contain following properties:
     * 
     * 		- key: a key to determin language (for example fa, en and so on)
     * 		- title: title for language (for example Persian, English, ...)
     * 		- dir: direction of language ('ltr' or 'rtl')
     * 		- map: translation table of language contains some key-values. 
     * 
     * @memberof $language
     */
    function newLanguage(lang) {
        if (!$rootScope.__account.permissions.tenant_owner) {
            return $q.reject('not allowed');
        }
        if (!$rootScope.app.config.languages) {
            $rootScope.app.config.languages = [];
        } else {
            var languages = $rootScope.app.config.languages;
            for (var i = 0; i < languages.length; i++) {
                if (lang.key === languages[i].key) {
                    return $q.reject('Sorry! Languages with the same key are not allowed.');
                }
            }
        }
        $rootScope.app.config.languages.push(lang);
        $translate.refresh(lang.key);
        return $q.resolve(lang);
    }

    /**
     * Delete a language
     * 
     * @memberof $language
     * @param {object|string} lang - The Language to delete or key of language to delete
     * @return {promise} promise of deleted language
     */
    function deleteLanguage(lang) {
        if (!$rootScope.__account.permissions.tenant_owner) {
            return $q.reject('not allowed');
        }
        var languages = $rootScope.app.config.languages;
        if (!languages || !languages.length) {
            return $q.reject('Not found');
        }
        var index = -1;
        if (angular.isString(lang)) {
            // lang is key of language
            for (var i = 0; i < languages.length; i++) {
                if (languages[i].key === lang) {
                    index = i;
                    break;
                }
            }
        } else {
            index = languages.indexOf(lang);
        }

        if (index !== -1) {
            languages.splice(index, 1);
            return $q.resolve(lang);
        }
        return $q.reject('Not found');
    }

    /**
     * Returns the language key of language that is currently loaded asynchronously.
     * 
     * @memberof $language
     * @return {string} language key
     */
    function proposedLanguage() {
        return $translate.proposedLanguage();
    }

    /**
     * Tells angular-translate which language to use by given language key. This 
     * method is used to change language at runtime. It also takes care of 
     * storing the language key in a configured store to let your app remember 
     * the choosed language.
     *
     * When trying to 'use' a language which isn't available it tries to load it 
     * asynchronously with registered loaders.
     * 
     * Returns promise object with loaded language file data or string of the 
     * currently used language.
     * 
     * If no or a falsy key is given it returns the currently used language key. 
     * The returned string will be undefined if setting up $translate hasn't 
     * finished.
     * 
     * @memberof $language
     * @param {string} key - Feature description.Language key
     * @return {Promise} Promise with loaded language data or the language key if a falsy param was given.
     * 
     */
    function use(key) {
        return $translate.use(key);
    }

    /**
     * Refreshes a translation table pointed by the given langKey. If langKey is not specified,
     * the module will drop all existent translation tables and load new version of those which
     * are currently in use.
     *
     * Refresh means that the module will drop target translation table and try to load it again.
     *
     * In case there are no loaders registered the refresh() method will throw an Error.
     *
     * If the module is able to refresh translation tables refresh() method will broadcast
     * $translateRefreshStart and $translateRefreshEnd events.
     *
     * @example
     * // this will drop all currently existent translation tables and reload those which are
     * // currently in use
     * $translate.refresh();
     * // this will refresh a translation table for the en_US language
     * $translate.refresh('en_US');
     *
     * @param {string} langKey A language key of the table, which has to be refreshed
     *
     * @return {promise} Promise, which will be resolved in case a translation tables refreshing
     * process is finished successfully, and reject if not.
     */
    function refresh(key) {
        return $translate.refresh(key);
    }

    /*
     * Service struct
     */
    return {
        language: language,
        languages: languages,
        newLanguage: newLanguage,
        deleteLanguage: deleteLanguage,
        proposedLanguage: proposedLanguage,
        refresh: refresh,
        use: use
    };
});

/* 
 * The MIT License (MIT)
 * 
 * Copyright (c) 2016 weburger
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

/**
 * @ngdoc Services
 * @name $mbLocal
 * @description manage localization of widgets
 * 
 * Deprecated : use $window
 */
angular.module('mblowfish-core').service('$mbLocal', function($rootScope) {
	var defaultDateFormat = 'jYYYY-jMM-jDD';
	var defaultDateTimeFormat = 'jYYYY-jMM-jDD hh:mm:ss';

	/**
	 * Gets current data of the system.
	 * 
	 * @memberof $mbLocal
	 */
	this.getDate = function() {
		return new Date();
	};


	function formatDateInternal(date, format) {
		if (!date) {
			return '';
		}
		try {
			if ($rootScope.app.calendar !== 'Jalaali') {
				format = format.replace('j', '');
			}
			var date = moment //
				.utc(inputDate) //
				.local();
			return date.format(format);
		} catch (ex) {
			return '-' + ex.message;
		}
	}
	/**
	 * Formats the input date based on the format
	 * 
	 * NOTE: default format is 'YYYY-MM-DD hh:mm:ss'
	 * 
	 * @params data {String | Date} to format
	 * @params format {String} of the output
	 * @memberof $mbLocal
	 */
	this.formatDate = function(inputDate, format) {
		return formatDateInternal(inputDate, format ||
			$rootScope.app.setting.dateFormat ||
			$rootScope.app.config.dateFormat ||
			defaultDateFormat);
	};

	/**
	 * Formats the input date based on the format
	 * 
	 * NOTE: default format is 'YYYY-MM-DD hh:mm:ss'
	 * 
	 * @params data {String | Date} to format
	 * @params format {String} of the output
	 * @memberof $mbLocal
	 */
	this.formatDateTime = function(inputDate, format) {
		return formatDateInternal(inputDate, format ||
			$rootScope.app.setting.dateFormatTime ||
			$rootScope.app.config.dateFormatTime ||
			defaultDateTimeFormat);
	};
	/**
	 * Get currency of the system
	 * 
	 * @return currency ISO code
	 * @memberof $mbLocal
	 */
	this.getCurrency = function() {
		return this.currency || 'USD';
	};

	/**
	 * Sets currency of the system
	 * 
	 * @param currency {String} ISO code
	 * @memberof $mbLocal
	 */
	this.setCurrency = function(currency) {
		this.currency = currency;
	};

	/**
	 * Get language of the system
	 * 
	 * @return language ISO code
	 * @memberof $mbLocal
	 */
	this.getLanguage = function() {
		return $rootScope.app.language;
	};

	/**
	 * Sets language of the system
	 * 
	 * @params language {String} ISO code
	 * @memberof $mbLocal
	 */
	this.setLanguage = function(language) {
		this.language = language;
	};


	return this;
});

/*
 * Copyright (c) 2015 Phoenix Scholars Co. (http://dpq.co.ir)
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


angular.module('mblowfish-core')

/**
 * @ngdoc Services
 * @name $metrics
 * @description collects and manages metrics from application and server
 * 
 * Metrics are stored in application space:
 * 
 * In view:
 * 
 * <code><pre>
 * 	<span>{{app.metrics['message.count']}}</span>
 * </pre></code>
 * 
 * In code:
 * 
 * <code><pre>
 * 	var messageCount = $rootScope.app.metrics['message.count'];
 * </pre></code>
 * 
 * Metrics must be tracked by the following 
 */
.service('$metrics', function($q/*, $timeout, $monitor*/) {
	/*
	 * store list of metrics
	 */
//	var metrics = [];
//	
//	var remoteMetrics = []
//	var localMetrics = []

	// XXX: maso, 1395: metric interval
//	var defaultInterval = 60000;


	/**
	 * Add a monitor in track list
	 * 
	 * با این فراخوانی مانیتور معادل ایجاد شده و به عنوان نتیجه برگردانده
	 * می‌شود.
	 * 
	 * <pre><code>
	 * $metrics.trackMetric('message.count')//
	 * 		.then(function() {
	 * 				// Success
	 * 			}, function(){
	 * 				// error
	 * 			});
	 * </code></pre>
	 * 
	 * @memberof $monitor
	 * @param {string}
	 *            key to track
	 * @param {string}
	 *            $scope which is follower (may be null)
	 *            
	 * @return {promise(PMonitor)}
	 */
	function trackMetric(/*key, $scope*/) {
		// track metric with key
		return $q.resolve('hi');
	}


	/**
	 * Break a monitor
	 * 
	 * @param {Object}
	 *            monitor
	 */
	function breakMonitor(/*key*/) {
//		var def = $q.defer();
//		$timeout(function() {
//			// XXX: maso, 1395: remove monitor
//			def.resolve(monitor);
//		}, 1);
//		return def.promise;
	}


	this.breakMonitor = breakMonitor;
	this.trackMetric = trackMetric;
});

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

angular.module('mblowfish-core')

/**
 * @ngdoc Services
 * @name $navigator
 * @description A default system navigator
 *
 * # Item
 *
 * An item is a single navigation part which may be a page, link, action, and etc.
 *
 */
.service('$navigator', function($q, $route, $mdDialog, $location, $window) {

    var _items = [];
    var _groups = [];

    /**
     * Gets list of all items in the navigation
     *
     * Returns all items added into the navigation list.
     *
     * Note: this is an unsynchronized function and the return value is a promiss
     */
    function items(pagination){
        var items = _items;
        if(pagination){
            // Filter items
            if(pagination.param._px_fk){
                items = [];
                // group
                if(pagination.param._px_fk === 'group'){
                    angular.forEach(_items, function(item){
                        if(item.groups &&
                                angular.isArray(item.groups) &&
                                item.groups.indexOf(pagination.param._px_fv) > -1){
                            items.push(item);
                        }
                    });
                }
                // TODO: maso, support others
            }
            // TODO: maso, support sort
        }
        return items;
    }

    /**
     * Adding the item into the navigation list
     *
     * Note: this is an unsynchronized function and the return value is a promiss
     */
    function newItem(item){
        item.priority = item.priority || 100;
        _items.push(item);
        return this;
    }

    /**
     * Remove the item from navigation list
     *
     * Note: this is an unsynchronized function and the return value is a promiss
     */
    function removeItem(item) {
        var index = _items.indexOf(item);
        if (index > -1) {
            _items.splice(index, 1);
        }
        return this;
    }

    /**
     * List all groups
     */
    function groups(/*paginationParam*/){
        return _groups;
    }

    /**
     * Create new group
     *
     * Note: if group with the same id exist, it will bet updated
     */
    function newGroup(group){
        if(!(group.id in _groups)){
            _groups[group.id] = {
                    id: group.id
            };
        }
        angular.merge(_groups[group.id], group);
    }

    /**
     * Getting the group
     *
     * If the group is not register before, new empty will be created.
     */
    function group(groupId){
        if(!(groupId in _groups)){
            _groups[groupId] = {
                    id: groupId
            };
        }
        return _groups[groupId];
    }


    /**
     * Open an dialog view
     *
     * A dialogs needs:
     *
     * <ul>
     * <li>templateUrl</li>
     * <li>config (optinal)</li>
     * </ul>
     *
     * templateUrl is an html template.
     *
     * the config element is bind into the scope of the template automatically.
     *
     * @param dialog
     * @returns promiss
     */
    function openDialog(dialog) {
        var dialogCnf = {};
        angular.extend(dialogCnf, {
            controller : dialog.controller || 'AmdNavigatorDialogCtrl',
            controllerAs: dialog.ctrl || 'ctrl',
            parent : angular.element(document.body),
            clickOutsideToClose : false,
            fullscreen: true,
            multiple:true
        }, dialog);
        if (!dialogCnf.config) {
            dialogCnf.config = {};
        }
        if(!dialogCnf.locals){
            dialogCnf.locals = {};
        }
        dialogCnf.locals.config = dialogCnf.config;
        return $mdDialog.show(dialogCnf);
    }

    /**
     * Open a page
     *
     * @param page
     */
    function openPage(page, params){
        //TODO: support page parameters
        if(page && page.toLowerCase().startsWith('http')){
            $window.open(page);
        }
        if(params){
            $location.path(page).search(params);
        }else{
            $location.path(page);
        }
    }

    /**
     * Check page is the current one
     *
     * If the input page is selected and loaded before return true;
     *
     * @param page String the page path
     * @return boolean true if page is selected.
     */
    function isPageSelected(/*page*/){
        // XXX: maso, 2017: check if page is the current one
        return false;
    }

    function loadAllItems(pagination) {
        $q.resolve(items(pagination));
    }

    return {
        loadAllItems : loadAllItems,
        openDialog : openDialog,
        openPage: openPage,
        isPageSelected: isPageSelected,
        // Itmes
        items : items,
        newItem: newItem,
        deleteItem: removeItem,
        // Group
        groups: groups,
        newGroup: newGroup,
        group: group
    };
});

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


angular.module('mblowfish-core')

/**
 * @ngdoc Services
 * @name $notification
 * @description A default system navigator
 * 
 * 
 * 
 */
.service('$notification', function($navigator, $mdToast) {

	/**
	 * The alert() method displays an alert box with a specified message and an
	 * OK button.
	 * 
	 * An alert box is often used if you want to make sure information comes
	 * through to the user.
	 * 
	 * Note: The alert box takes the focus away from the current window, and
	 * forces the browser to read the message. Do not overuse this method, as it
	 * prevents the user from accessing other parts of the page until the box is
	 * closed.
	 * 
	 * @param String
	 *                message Optional. Specifies the text to display in the
	 *                alert box, or an object converted into a string and
	 *                displayed
	 */
	function alert(message) {
		return $navigator.openDialog({
			templateUrl : 'views/dialogs/mb-alert.html',
			config : {
				message : message
			}
		})
		// return true even it the page is canceled
		.then(function(){
			return true;
		}, function(){
			return true;
		});
	}

	/**
	 * The confirm() method displays a dialog box with a specified message,
	 * along with an OK and a Cancel button.
	 * 
	 * A confirm box is often used if you want the user to verify or accept
	 * something.
	 * 
	 * Note: The confirm box takes the focus away from the current window, and
	 * forces the browser to read the message. Do not overuse this method, as it
	 * prevents the user from accessing other parts of the page until the box is
	 * closed.
	 * 
	 * The confirm() method returns true if the user clicked "OK", and false
	 * otherwise.
	 * 
	 * @param String
	 *                message Optional. Specifies the text to display in the
	 *                confirm box
	 */
	function confirm(message) {
		// XXX: maso, 1395: wait for response (sync method)
		return $navigator.openDialog({
			templateUrl : 'views/dialogs/mb-confirm.html',
			config : {
				message : message
			}
		});
	}

	/**
	 * The prompt() method displays a dialog box that prompts the visitor for
	 * input.
	 * 
	 * A prompt box is often used if you want the user to input a value before
	 * entering a page.
	 * 
	 * Note: When a prompt box pops up, the user will have to click either "OK"
	 * or "Cancel" to proceed after entering an input value. Do not overuse this
	 * method, as it prevent the user from accessing other parts of the page
	 * until the box is closed.
	 * 
	 * The prompt() method returns the input value if the user clicks "OK". If
	 * the user clicks "cancel" the method returns null.
	 * 
	 * @param String
	 *                text Required. The text to display in the dialog box
	 * @param String
	 *                defaultText Optional. The default input text
	 */
	function prompt(text, defaultText) {
		// XXX: maso, 1395: wait for response (sync method)
		return $navigator.openDialog({
			templateUrl : 'views/dialogs/mb-prompt.html',
			config : {
				message : text,
				model : defaultText
			}
		});
	}

	/**
	 * TODO: maso, 2017: document
	 * @param text
	 * @returns
	 */
	function toast(text) {
		return $mdToast.show(
				$mdToast.simple()
				.textContent(text)
				.hideDelay(3000)
		);
	}


	return {
		toast: toast,
		alert: alert,
		prompt: prompt,
		confirm: confirm
	};
});

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

angular.module('mblowfish-core')

/**
 * @ngdoc Services
 * @name $options
 * @description User option manager
 * 
 * Option is user configurations
 */
.service('$options', function($q) {
	var _pages = [ ];

	/**
	 * List all pages
	 */
	function pages() {
		return $q.when({
			'items' : _pages
		});
	}
	
	/**
	 * Gets a config page
	 * 
	 * @name config
	 * @param {string} pageId - Id of the config
	 * @return {promiss<config>} return config
	 */
	function getPage(pageId){
		for(var i = 0; i < _pages.length; i++){
			if(_pages[i].id === pageId){
				return $q.when(_pages[i]);
			}
		}
		return $q.reject({
			// TODO: maso, 2018: add reason
		});
	}


	/**
	 * Creates configuration/setting page.
	 */
	function newPage(page){
		_pages.push(page);
		return app;
	}
	
	var app = {
			pages : pages,
			page: getPage,
			newPage : newPage
	};
	return app;
});

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


// TODO: hadi: move it to new module angular-material-home-seo
angular.module('mblowfish-core')

/**
 * @ngdoc service
 * @name $page
 * @description A page management service
 */
.service('$page', function(
		/* angularjs */ $rootScope, $rootElement, 
		/* wb-core */ $window) {

	// ------------------------------------------------------------------
	// Utility function
	//
	//
	// ------------------------------------------------------------------
	/*
	 * <!-- OG -->
	 * <meta property="og:site_name" content="$title">
	 */
	
	$rootScope.page = {
			title: '',
			description: '',
			keywords: [],
			links:[]
	};
	var page = $rootScope.page;
	var headElement = $rootElement.find('head');
	var bodyElement = $rootElement.find('body');
	
	/*
	 * Get elements by name
	 */
	function getHeadElementByName(name){
		var elements = headElement.find(name);
		if(elements.length){
			return angular.element(elements[0]);
		}
		// title element not found
		var metaElement = angular.element('<' + name +'/>');
		headElement.append(metaElement);
		return metaElement;
	}

	// ------------------------------------------------------------------
	// Utility function
	//
	//
	// ------------------------------------------------------------------

	/**
	 * 
	 * @param title
	 * @returns
	 */
	this.setTitle = function(title){
		page.title = title;
		getHeadElementByName('title').text(title);
		this.setMeta('twitter:title', title);
		this.setMeta('og:title', title);
		return this;
	}

	/**
	 * Gets current page title
	 * 
	 * @returns
	 */
	this.getTitle = function (){
		return page.title;
	}

	/**
	 * Sets page description
	 * 
	 * @param description
	 * @returns
	 */
	this.setDescription = function (description){
		page.description = description;
		this.setMeta('description', description);
		this.setMeta('twitter:description', description);
		this.setMeta('og:description', description);
		return this;
	}

	/**
	 * 
	 * @returns
	 */
	this.getDescription = function (){
		return page.description;
	}

	/**
	 * 
	 * @param keywords
	 * @returns
	 */
	this.setKeywords = function (keywords){
		page.keywords = keywords;
		this.setMeta('keywords', keywords);
		return this;
	}

	/**
	 * Gets current keywords
	 * 
	 * @returns
	 */
	this.getKeywords = function (){
		return page.keywords;
	};
	
	/**
	 * Sets favicon
	 */
	this.setFavicon = function (favicon){
		this.updateLink('favicon-link', {
			href: favicon,
			rel: 'icon'
		});
		return this;
	};
	
	/**
	 * Sets page cover
	 */
	this.setCover = function(imageUrl) {
		this.setMeta('twitter:image', imageUrl);
		this.setMeta('og:image', imageUrl);
		return this;
	};
	
	this.setCanonicalLink = function(url) {
		this.setLink('canonical', {
			href: url,
			rel: 'canonical'
		});
		return this;
	};

	this.updateLink = function(key, data){
		$window.setLink(key, data);
		return this;
	};
	
	this.setLink = this.updateLink;

	this.setMeta = function (key, value){
		$window.setMeta(key, value);
		return this;
	};
	
	this.setLanguage = function(language){
		bodyElement.attr('lang', language);
		return this;
	};
	
	return this;
});

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

angular.module('mblowfish-core')

/**
 * @ngdoc Services
 * @name $preferences
 * @description System setting manager
 * 
 */
.service('$preferences', function($q, $navigator) {
	var preferences = [ ];

	/**
	 * Lists all created pages.
	 * 
	 * @returns
	 */
	function pages() {
		// SORT:
		preferences.sort(_pageComparator);
		// Return list
		return $q.when({
			'items' : preferences
		});
	}

	function _pageComparator(page1, page2){
		if(page1.priority === page2.priority){
			return 0;
		}
		if(page1.priority === 'first' || page2.priority === 'last'){
			return -1;
		}
		if(page1.priority === 'last' || page2.priority === 'first'){
			return +1;
		}
		if(typeof page1.priority === 'undefined'){
			return +1;
		}
		if(typeof page2.priority === 'undefined'){
			return -1;
		}
		return page1.priority - page2.priority;
	}
	
	/**
	 * Gets a preference page
	 * 
	 * @memberof $preferences
	 * @param id {string} Pereference page id
	 */
	function page(id){
		// get preferences
		for (var i = 0, len = preferences.length; i < len; i++) {
			if(preferences[i].id === id){
				return $q.when(preferences[i]);
			}
		}
		// not found
		return $q.reject({
			message: 'Not found'
		});
	}


	/**
	 * Opens a setting page
	 * 
	 * @param page
	 * @returns
	 */
	function open(page){
		return $navigator.openPage('/preferences/'+page.id);
	}

	/**
	 * Creates a new setting page.
	 * 
	 * @param page
	 * @returns
	 */
	function newPage(page){
		preferences.push(page);
		return this;
	}

	return  {
		'pages' : pages,
		'page': page,
		'newPage': newPage,
		'openPage' : open
	};
});

/* 
 * The MIT License (MIT)
 * 
 * Copyright (c) 2016 weburger
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


angular.module('mblowfish-core')

/**
 * @ngdoc Services
 * @name $resource
 * @description Resource management system
 * 
 * This is a service to get resources. 
 * 
 */
.service('$resource', function($mdDialog, $rootScope) {
    var CHILDREN_AUNCHOR = 'wb-select-resource-children';
    var resourcePages = {};
    /*
     * Manages resource dialog
     * @ngInject
     */
    function ResourceCtrl($scope,  $mdDialog, $wbUtil,
            $q, $controller, $compile, pages, style, data, $element, $window) {

        $scope.value = angular.copy(data);
        $scope.style = style;
        var currentScope = null;

        function hide() {
            $mdDialog.hide();
        }

        function cancel() {
            return $mdDialog.cancel();
        }

        /**
         * Answer the dialog
         * 
         * If there is an answer function in the current page controller
         * then the result of the answer function will be returned as 
         * the main result.
         * 
         * @memberof WbResourceCtrl
         */
        function answer() {
            $scope.loadingAnswer = true;
            var res = null;
            if(currentScope && angular.isFunction(currentScope.answer)){
                res =  $q.when(currentScope.answer())
                .then($mdDialog.hide);
            } else {
                res = $mdDialog.hide($scope.value);
            }
            return res.finally(function(){
                $scope.loadingAnswer = false;
            });
        }

        /*
         * Sets value to the real var
         */
        this.setValue = function(value){
            $scope.value = value;
        };

        /*
         * Gets current value
         */
        this.getValue = function(){
            return $scope.value;
        };

        /**
         * encapsulate template srce with panel widget template.
         * 
         * @param page
         *            setting page config
         * @param tempateSrc
         *            setting page html template
         * @returns encapsulate html template
         */
        function _encapsulatePanel(page, template) {
            // TODO: maso, 2017: pass all paramter to the setting
            // panel.
            return template;
        }

        /**
         * تنظیمات را به عنوان تنظیم‌های جاری سیستم لود می‌کند.
         * 
         * @returns
         */
        function loadPage(page) {
            var jobs = [];
            var pages2 = [];

            $scope._selectedIndex = pages.indexOf(page);

            // 1- Find element
            var target = $element.find('#' + CHILDREN_AUNCHOR);

            // 2- Clear childrens
            target.empty();
            currentScope = null;


            // 3- load pages
//          var page = pages[index];
            var template = $wbUtil.getTemplateFor(page);
            if (angular.isDefined(template)) {
                jobs.push($q.when(template).then(function(templateSrc) {
                    templateSrc = _encapsulatePanel(page, templateSrc);
                    var element = angular.element(templateSrc);
                    var scope = $rootScope.$new(false, $scope);
                    currentScope = scope;
                    scope.page = page;
                    scope.value = $scope.value;
                    if (angular.isDefined(page.controller)) {
                        var controller = $controller(page.controller, {
                            $scope : scope,
                            $element : element,
                            style: style,
                            data: data
                        });
                        if (page.controllerAs) {
                            scope[page.controllerAs] = controller;
                        }
                    }
                    $compile(element)(scope);
                    pages2.push(element);
                }));
            }

            $q.all(jobs).then(function() {
                angular.forEach(pages2, function(element) {
                    target.append(element);
                });
            });
        }

        if(angular.isFunction($window.openHelp)){
            $scope.openHelp = function($event){
                cancel().then(function(){
                    $window.openHelp(pages[$scope._selectedIndex], $event);
                });
            };
        }

        $scope.pages = pages;

        $scope.loadPage = loadPage;

        $scope.hide = hide;
        $scope.cancel = cancel;
        $scope.answer = answer;

        if(pages.length){
            loadPage(pages[0]);
        }

        var ctrl = this;
        $scope.setValue = function(value){
            return ctrl.setValue(value);
        };
    }


    /**
     * Fetches a page.
     * 
     * @param model
     * @returns
     */
    function page(type) {
        // TODO: maso, 2018: replace with not found resource
        var widget = null;
        if (type in resourcePages) {
            widget = resourcePages[type];
        }
        return widget;
    }

    /**
     * Adds new page.
     * 
     * @returns
     */
    function newPage(page) {
        resourcePages[page.type] = page;
    }

    /**
     * Finds and lists all pages.
     * 
     * @returns
     */
    function pages() {
        // TODO: maso, 1395:
    }

    function getPages(tag){
        var pages = [];
        angular.forEach(resourcePages, function(page) {
            if(angular.isArray(page.tags) && page.tags.includes(tag)){
                this.push(page);
            }
        }, pages);
        return pages;
    }

    /**
     * Get a resource 
     * 
     * - option.data: current value of the date
     * - option.style: style of the dialog (title, descritpion, image, ..)
     * 
     * @param tags
     * @returns
     */
    function get(tag, option){
        if(!option){
            option = {};
        }
        var pages = getPages(tag);
        var tmplUrl = pages.length > 1 ? 'views/dialogs/wb-select-resource.html' : 'views/dialogs/wb-select-resource-single-page.html';
        return $mdDialog.show({
            controller : ResourceCtrl,
            templateUrl : tmplUrl,
            parent : angular.element(document.body),
            clickOutsideToClose : false,
            fullscreen : true,
            multiple:true,
            locals : {
                'pages' : pages,
                'style' : option.style || {
                    title: tag
                },
                'data' : option.data || {}
            }
        });
    }

    this.hasPeagFor = function(tag){
        var pages = getPages(tag);
        return pages.length > 0;
    };


    this.get = get;
    this.newPage = newPage;
    this.page = page;
    this.pages = pages;
});

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

angular.module('mblowfish-core') //

/**
 * @ngdoc Services
 * @name $sidenav
 * @param {} $q
 * @description sidenavs manager
 * 
 */
.service('$sidenav', function ($q, $mdSidenav) {
    var _sidenavs = [];

    /**
     * Get list of all sidenavs
     * 
     * @memberof $sidenav
     * @return promiss
     */
    function sidenavs(){
        return $q.when({
            items: _sidenavs
        });
    }

    /**
     * Add new sidenav
     * 
     * @memberof $sidenav
     * @param {} sidenav
     * @return promiss
     */
    function newSidenav(sidenav){
        _sidenavs.push(sidenav);
    }

    /**
     * Get a sidnav by id
     * 
     * @memberof $sidenav
     * @param {} id
     * @return promiss
     */
    function sidenav(id){
        for(var i = 0; i < _sidenavs.length; i++){
            if(_sidenavs[i].id === id){
                return $q.when(_sidenavs[i]);
            }
        }
        return $q.reject('Sidenav not found');
    }
    
    /**
     * Find and return a sidenav
     */
    this.getSidenav = function(id){
    	return $mdSidenav(id);
    }
    
    var _defaultSidenavs = [];

    /**
     * Add new sidenav
     * 
     * @memberof $sidenav
     * @param {} defaultSidenavs
     * @return promiss
     */
    function setDefaultSidenavs(defaultSidenavs){
        _defaultSidenavs = defaultSidenavs || [];
        return this;
    }

    /**
     * Add new sidenav
     * 
     * @memberof $sidenav
     * @return promiss
     */
    function defaultSidenavs(){
        return _defaultSidenavs;
    }

    this.sidenavs = sidenavs;
    this.newSidenav = newSidenav;
    this.sidenav = sidenav;
    this.setDefaultSidenavs = setDefaultSidenavs;
    this.defaultSidenavs = defaultSidenavs;

    return this;
});



/* 
 * The MIT License (MIT)
 * 
 * Copyright (c) 2016 weburger
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


angular.module('mblowfish-core')

/**
 * @ngdoc Services
 * @name $storage
 * @description A service to work with storage of browser
 * 
 */
.service('$storage', function ($localStorage) {
    /*
     * @param 
     * @returns
     */
    function get(key) {
        return $localStorage[key];
    }
    /*
     * @param 
     * @returns
     */
    function put (key,value) {
        $localStorage[key] = value;
    }
    /*
     * @param 
     * @returns
     */
    function remove(key) {
        delete $localStorage[key];
    }
    /*
     * @param 
     * @returns
     */
    function has(key) {
        return ($localStorage[key]? true : false);
    }

    this.get = get;
    this.put = put;
    this.remove = remove;
    this.has = has;
});

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

angular.module('mblowfish-core') //

/**
 * @ngdoc Services
 * @name $toolbar
 * @description toolbars manager
 * 
 */
.service('$toolbar', function ($q) {

    var _toolbars = [];

    /**
     * Get list of all toolbars
     * 
     * @memberof $app
     * @return promiss
     */
    function toolbars() {
        return $q.when({
            items: _toolbars
        });
    }

    /**
     * Add new toolbar
     * 
     * @memberof $toolbar
     * @param {} toolbar
     * @return promise
     */
    function newToolbar(toolbar) {
        _toolbars.push(toolbar);
    }

    /**
     * Get a toolbar by id
     * 
     * @memberof $app
     * @param {} id
     * @return promise
     */
    function toolbar(id) {
        for (var i = 0; i < _toolbars.length; i++) {
            if (_toolbars[i].id === id) {
                return $q.when(_toolbars[i]);
            }
        }
        return $q.reject('Toolbar not found');
    }

    var _defaultToolbars = [];
    function setDefaultToolbars(defaultToolbars) {
        _defaultToolbars = defaultToolbars || [];
        return this;
    }

    function defaultToolbars() {
        return _defaultToolbars;
    }

    var apps = {};
    // toolbars
    apps.toolbars = toolbars;
    apps.newToolbar = newToolbar;
    apps.toolbar = toolbar;
    apps.setDefaultToolbars = setDefaultToolbars;
    apps.defaultToolbars = defaultToolbars;

    return apps;
});

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

angular.module('mblowfish-core') //
.service('uuid4', function() {
	/**! http://stackoverflow.com/a/2117523/377392 */
	var fmt = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx';
	this.generate = function() {
		return fmt.replace(/[xy]/g, function(c) {
			var r = Math.random()*16|0, v = c === 'x' ? r : (r&0x3|0x8);
			return v.toString(16);
		});
	};
}); 

angular.module('mblowfish-core').run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('views/dialogs/mb-alert.html',
    "<md-dialog layout=column ng-cloak> <md-toolbar> <div class=md-toolbar-tools> <wb-icon>error</wb-icon> <h2 translate>{{app.title}}</h2> <span flex></span> <md-button class=md-icon-button ng-click=cancel() aria-label=close> <wb-icon aria-label=\"Close dialog\">close</wb-icon> </md-button> </div> </md-toolbar> <md-dialog-content layout=row layout-padding layout-align=\"center center\" flex> <p translate>{{config.message}}</p> </md-dialog-content> </md-dialog>"
  );


  $templateCache.put('views/dialogs/mb-confirm.html',
    "<md-dialog layout=column ng-cloak> <md-toolbar> <div class=md-toolbar-tools> <wb-icon>warning</wb-icon> <h2 translate>{{app.title}}</h2> <span flex></span> <md-button class=md-icon-button ng-click=answer(true) aria-label=done> <wb-icon aria-label=Done>done</wb-icon> </md-button> <md-button class=md-icon-button ng-click=cancel() aria-label=close> <wb-icon aria-label=\"Close dialog\">close</wb-icon> </md-button> </div> </md-toolbar> <md-dialog-content layout=row layout-padding layout-align=\"center center\" flex> <p translate>{{config.message}}</p> </md-dialog-content> </md-dialog>"
  );


  $templateCache.put('views/dialogs/mb-prompt.html',
    "<md-dialog layout=column ng-cloak> <md-toolbar> <div class=md-toolbar-tools> <wb-icon>input</wb-icon> <h2 translate>{{app.title}}</h2> <span flex></span> <md-button class=md-icon-button ng-click=answer(config.model) aria-label=done> <wb-icon aria-label=Done>done</wb-icon> </md-button> <md-button class=md-icon-button ng-click=cancel() aria-label=close> <wb-icon aria-label=\"Close dialog\">close</wb-icon> </md-button> </div> </md-toolbar> <md-dialog-content layout=column layout-padding layout-align=\"center stretch\" flex> <p translate>{{config.message}}</p> <md-input-container class=md-block> <label translate>Input value</label> <input ng-model=config.model aria-label=\"input value\"> </md-input-container> </md-dialog-content> </md-dialog>"
  );


  $templateCache.put('views/dialogs/wb-select-resource-single-page.html',
    "<md-dialog aria-label=\"Select item/items\" style=\"width:50%; height:70%\"> <form ng-cloak layout=column flex> <md-dialog-content mb-preloading=loadingAnswer flex layout=row> <div layout=column flex> <div id=wb-select-resource-children style=\"margin: 0px; padding: 0px; overflow: auto\" layout=column flex> </div> </div> </md-dialog-content> <md-dialog-actions layout=row>       <span flex></span> <md-button ng-click=cancel() aria-label=Cancel> <span translate=\"\">Close</span> </md-button> <md-button class=md-primary aria-label=Done ng-click=answer()> <span translate=\"\">Ok</span> </md-button> </md-dialog-actions> </form> </md-dialog>"
  );


  $templateCache.put('views/dialogs/wb-select-resource.html',
    "<md-dialog aria-label=\"Select item/items\" style=\"width:70%; height:70%\"> <form ng-cloak layout=column flex> <md-dialog-content mb-preloading=loadingAnswer flex layout=row> <md-sidenav class=md-sidenav-left md-component-id=left md-is-locked-open=true md-whiteframe=4 layout=column ng-hide=\"pages.length === 1\"> <div style=\"text-align: center\"> <wb-icon size=64px ng-if=style.icon>{{style.icon}}</wb-icon> <h2 style=\"text-align: center\" translate>{{style.title}}</h2> <p style=\"text-align: center\" translate>{{style.description}}</p> </div> <md-devider></md-devider> <md-content> <md-list style=\"padding:0px; margin: 0px\"> <md-list-item ng-repeat=\"page in pages | orderBy:priority\" ng-click=\"loadPage(page, $event);\" md-colors=\"_selectedIndex===$index ? {background:'accent'} : {}\"> <wb-icon>{{page.icon || 'attachment'}}</wb-icon> <p>{{page.label | translate}}</p> </md-list-item> </md-list> </md-content> </md-sidenav> <div layout=column flex> <div id=wb-select-resource-children style=\"margin: 0px; padding: 0px; overflow: auto\" layout=column flex> </div> </div> </md-dialog-content> <md-dialog-actions layout=row> <span flex></span> <md-button aria-label=Cancel ng-click=cancel()> <span translate=\"\">Close</span> </md-button> <md-button class=md-primary aria-label=Done ng-click=answer()> <span translate=\"\">Ok</span> </md-button> </md-dialog-actions> </form> </md-dialog>"
  );


  $templateCache.put('views/directives/mb-captcha.html',
    "<div>  <div vc-recaptcha ng-model=ctrl.captchaValue theme=\"app.captcha.theme || 'light'\" type=\"app.captcha.type || 'image'\" key=app.captcha.key lang=\"app.captcha.language || 'fa'\"> </div>  </div>"
  );


  $templateCache.put('views/directives/mb-dynamic-form.html',
    "<div layout=column ng-repeat=\"prop in mbParameters track by $index\"> <md-input-container ng-show=\"prop.visible && prop.editable\" class=\"md-icon-float md-icon-right md-block\"> <label>{{prop.title}}</label> <input ng-required=\"{{prop.validators && prop.validators.indexOf('NotNull')>-1}}\" ng-model=values[prop.name] ng-change=\"modelChanged(prop.name, values[prop.name])\"> <wb-icon ng-show=hasResource(prop) ng-click=setValueFor(prop)>more_horiz</wb-icon>  </md-input-container> </div>"
  );


  $templateCache.put('views/directives/mb-dynamic-tabs.html',
    "<div layout=column> <md-tabs md-selected=pageIndex> <md-tab ng-repeat=\"tab in mbTabs\"> <span translate>{{tab.title}}</span> </md-tab> </md-tabs> <div id=mb-dynamic-tabs-select-resource-children> </div> </div>"
  );


  $templateCache.put('views/directives/mb-inline.html',
    "<div style=\"cursor: pointer\" ng-switch=mbInlineType>  <div ng-switch-when=image class=overlay-parent ng-class=\"{'my-editable' : $parent.mbInlineEnable}\" md-colors=\"::{borderColor: 'primary-100'}\" style=\"overflow: hidden\" ng-click=ctrlInline.updateImage() ng-transclude> <div ng-show=$parent.mbInlineEnable layout=row layout-align=\"center center\" class=overlay-bottom md-colors=\"{backgroundColor: 'primary-700'}\"> <md-button class=md-icon-button aria-label=\"Change image\" ng-click=ctrlInline.updateImage()> <wb-icon>photo_camera </wb-icon></md-button> </div> </div>  <div ng-switch-when=file class=overlay-parent ng-class=\"{'my-editable' : $parent.mbInlineEnable}\" md-colors=\"::{borderColor: 'primary-100'}\" style=\"overflow: hidden\" ng-click=ctrlInline.updateFile() ng-transclude> <div ng-show=$parent.mbInlineEnable layout=row layout-align=\"center center\" class=overlay-bottom md-colors=\"{backgroundColor: 'primary-700'}\"> <md-button class=md-icon-button aria-label=\"Change image\" ng-click=ctrlInline.updateFile()> <wb-icon>file </wb-icon></md-button> </div> </div>  <div ng-switch-when=datetime> <mb-datepicker ng-show=ctrlInline.editMode ng-model=ctrlInline.model ng-change=ctrlInline.save() mb-placeholder=\"Click to set date\" mb-hide-icons=calendar> </mb-datepicker> <button ng-if=\"mbInlineCancelButton && ctrlInline.editMode\" ng-click=ctrlInline.cancel()>cancel</button> <button ng-if=\"mbInlineSaveButton && ctrlInline.editMode\" ng-click=ctrlInline.save()>save</button> <ng-transclude ng-hide=ctrlInline.editMode ng-click=ctrlInline.edit() flex></ng-transclude> </div> <div ng-switch-when=date> <mb-datepicker ng-show=ctrlInline.editMode ng-model=ctrlInline.model ng-change=ctrlInline.save() mb-date-format=YYYY-MM-DD mb-placeholder=\"Click to set date\" mb-hide-icons=calendar> </mb-datepicker> <button ng-if=\"mbInlineCancelButton && ctrlInline.editMode\" ng-click=ctrlInline.cancel()>cancel</button> <button ng-if=\"mbInlineSaveButton && ctrlInline.editMode\" ng-click=ctrlInline.save()>save</button> <ng-transclude ng-hide=ctrlInline.editMode ng-click=ctrlInline.edit() flex></ng-transclude> </div>                                                                                                                                           <div ng-switch-default> <input wb-on-enter=ctrlInline.save() wb-on-esc=ctrlInline.cancel() ng-model=ctrlInline.model ng-show=ctrlInline.editMode> <button ng-if=\"mbInlineCancelButton && ctrlInline.editMode\" ng-click=ctrlInline.cancel()>cancel</button> <button ng-if=\"mbInlineSaveButton && ctrlInline.editMode\" ng-click=ctrlInline.save()>save</button> <ng-transclude ng-hide=ctrlInline.editMode ng-click=ctrlInline.edit() flex></ng-transclude> </div>  <div ng-messages=error.message> <div ng-message=error class=md-input-message-animation style=\"margin: 0px\">{{error.message}}</div> </div> </div>"
  );


  $templateCache.put('views/directives/mb-navigation-bar.html',
    "<div class=mb-navigation-path-bar md-colors=\"{'background-color': 'primary'}\" layout=row> <div layout=row> <md-button ng-click=goToHome() aria-label=Home class=\"mb-navigation-path-bar-item mb-navigation-path-bar-item-home\"> <md-tooltip ng-if=menu.tooltip md-delay=1500>{{'home' | translate}}</md-tooltip> <wb-icon>home</wb-icon> </md-button> </div> <div layout=row data-ng-repeat=\"menu in pathMenu.items | orderBy:['-priority']\"> <wb-icon>{{app.dir==='rtl' ? 'chevron_left' : 'chevron_right'}}</wb-icon> <md-button ng-show=isVisible(menu) ng-href={{menu.url}} ng-click=menu.exec($event); class=mb-navigation-path-bar-item> <md-tooltip ng-if=menu.tooltip md-delay=1500>{{menu.description}}</md-tooltip> <wb-icon ng-if=menu.icon>{{menu.icon}}</wb-icon> {{menu.title | translate}} </md-button>  </div> </div>"
  );


  $templateCache.put('views/directives/mb-pagination-bar.html',
    "<div layout=column> <div class=wrapper-stack-toolbar-container style=\"border-radius: 0px\">  <div md-colors=\"{background: 'primary-hue-1'}\"> <div class=md-toolbar-tools> <md-button ng-if=mbIcon md-no-ink class=md-icon-button aria-label={{::mbIcon}}> <wb-icon>{{::mbIcon}}</wb-icon> </md-button> <h2 flex md-truncate ng-if=mbTitle>{{::mbTitle}}</h2> <md-button ng-if=mbReload class=md-icon-button aria-label=Reload ng-click=__reload()> <wb-icon>repeat</wb-icon> </md-button> <md-button ng-show=mbSortKeys class=md-icon-button aria-label=Sort ng-click=\"showSort = !showSort\"> <wb-icon>sort</wb-icon> </md-button> <md-button ng-show=filterKeys class=md-icon-button aria-label=Sort ng-click=\"showFilter = !showFilter\"> <wb-icon>filter_list</wb-icon> </md-button> <md-button ng-show=mbEnableSearch class=md-icon-button aria-label=Search ng-click=\"showSearch = true; focusToElement('searchInput');\"> <wb-icon>search</wb-icon> </md-button> <md-button ng-if=exportData class=md-icon-button aria-label=Export ng-click=exportData()> <wb-icon>save</wb-icon> </md-button> <span flex ng-if=!mbTitle></span> <md-menu ng-show=mbMoreActions.length> <md-button class=md-icon-button aria-label=Menu ng-click=$mdOpenMenu($event)> <wb-icon>more_vert</wb-icon> </md-button> <md-menu-content width=4> <md-menu-item ng-repeat=\"item in mbMoreActions\"> <md-button ng-click=item.action() aria-label={{::item.title}}> <wb-icon ng-show=item.icon>{{::item.icon}}</wb-icon> <span translate=\"\">{{::item.title}}</span> </md-button> </md-menu-item> </md-menu-content> </md-menu> </div> </div>  <div class=\"stack-toolbar new-box-showing-animation\" md-colors=\"{background: 'primary-hue-2'}\" ng-show=showSearch> <div class=md-toolbar-tools> <md-button style=min-width:0px ng-click=\"showSearch = false\" aria-label=Back> <wb-icon class=icon-rotate-180-for-rtl>arrow_back</wb-icon> </md-button> <md-input-container flex md-theme=dark md-no-float class=\"md-block fit-input\"> <input id=searchInput placeholder=\"{{::'Search'|translate}}\" ng-model=query.searchTerm ng-change=searchQuery() ng-model-options=\"{debounce: 1000}\"> </md-input-container> </div> </div>  <div class=\"stack-toolbar new-box-showing-animation\" md-colors=\"{background: 'primary-hue-2'}\" ng-show=showSort> <div class=md-toolbar-tools> <md-button style=min-width:0px ng-click=\"showSort = false\" aria-label=Back> <wb-icon class=icon-rotate-180-for-rtl>arrow_back</wb-icon> </md-button> <h3 translate=\"\">Sort</h3> <span style=\"width: 10px\"></span>  <md-menu> <md-button layout=row style=\"text-transform: none\" ng-click=$mdMenu.open()> <h3>{{mbSortKeysTitles ? mbSortKeysTitles[mbSortKeys.indexOf(query.sortBy)] : query.sortBy | translate}}</h3> </md-button> <md-menu-content width=4> <md-menu-item ng-repeat=\"key in mbSortKeys\"> <md-button ng-click=\"query.sortBy = key; setSortOrder()\"> <wb-icon ng-if=\"query.sortBy === key\">check_circle</wb-icon> <wb-icon ng-if=\"query.sortBy !== key\">radio_button_unchecked</wb-icon> {{::mbSortKeysTitles ? mbSortKeysTitles[$index] : key|translate}} </md-button> </md-menu-item> </md-menu-content> </md-menu>  <md-menu> <md-button layout=row style=\"text-transform: none\" ng-click=$mdMenu.open()> <wb-icon ng-if=!query.sortDesc class=icon-rotate-180>filter_list</wb-icon> <wb-icon ng-if=query.sortDesc>filter_list</wb-icon> {{query.sortDesc ? 'Descending' : 'Ascending'|translate}} </md-button> <md-menu-content width=4> <md-menu-item> <md-button ng-click=\"query.sortDesc = false;setSortOrder()\"> <wb-icon ng-if=!query.sortDesc>check_circle</wb-icon> <wb-icon ng-if=query.sortDesc>radio_button_unchecked</wb-icon> {{::'Ascending'|translate}} </md-button> </md-menu-item> <md-menu-item> <md-button ng-click=\"query.sortDesc = true;setSortOrder()\"> <wb-icon ng-if=query.sortDesc>check_circle</wb-icon> <wb-icon ng-if=!query.sortDesc>radio_button_unchecked</wb-icon> {{::'Descending'|translate}} </md-button> </md-menu-item> </md-menu-content> </md-menu> </div> </div>  <div class=\"stack-toolbar new-box-showing-animation\" md-colors=\"{background: 'primary-hue-2'}\" ng-show=showFilter> <div layout=row layout-align=\"space-between center\" class=md-toolbar-tools> <div layout=row> <md-button style=min-width:0px ng-click=\"showFilter = false\" aria-label=Back> <wb-icon class=icon-rotate-180-for-rtl>arrow_back</wb-icon> </md-button> <h3 translate=\"\">Filters</h3> </div> <div layout=row> <md-button ng-if=\"filters && filters.length\" ng-click=applyFilter() class=md-icon-button> <wb-icon>done</wb-icon> </md-button> <md-button ng-click=addFilter() class=md-icon-button> <wb-icon>add</wb-icon> </md-button> </div> </div> </div> </div>  <div layout=column md-colors=\"{background: 'primary-hue-1'}\" ng-show=\"showFilter && filters.length>0\" layout-padding>  <div ng-repeat=\"filter in filters track by $index\" layout=row layout-align=\"space-between center\" style=\"padding-top: 0px;padding-bottom: 0px\"> <div layout=row style=\"width: 50%\"> <md-input-container style=\"padding: 0px;margin: 0px;width: 20%\"> <label translate=\"\">Key</label> <md-select name=filter ng-model=filter.key ng-change=\"showFilterValue=true;\" required> <md-option ng-repeat=\"key in filterKeys\" ng-value=key> <span translate=\"\">{{key}}</span> </md-option> </md-select> </md-input-container> <span flex=5></span> <md-input-container style=\"padding: 0px;margin: 0px\" ng-if=showFilterValue> <label translate=\"\">Value</label> <input ng-model=filter.value required> </md-input-container> </div> <md-button ng-if=showFilterValue ng-click=removeFilter(filter,$index) class=md-icon-button> <wb-icon>delete</wb-icon> </md-button> </div> </div> </div>"
  );


  $templateCache.put('views/directives/mb-pay.html',
    "<div layout=column>  <div layout=column> <md-progress-linear style=min-width:50px ng-if=\"ctrl.loadingGates || ctrl.paying\" md-mode=indeterminate class=md-accent md-color> </md-progress-linear> <div layout=column ng-if=\"!ctrl.loadingGates && ctrl.gates.length\"> <p translate>Select gate to pay</p> <div layout=row layout-align=\"center center\"> <md-button ng-repeat=\"gate in ctrl.gates\" ng-click=ctrl.pay(gate)> <img ng-src={{::gate.symbol}} style=\"max-height: 64px;border-radius: 4px\" alt={{::gate.title}}> </md-button> </div> </div> <div layout=row ng-if=\"!ctrl.loadingGates && ctrl.gates && !ctrl.gates.length\" layout-align=\"center center\"> <p style=\"color: red\"> <span translate>No gate is defined for the currency of the wallet.</span> </p> </div> </div> </div>"
  );


  $templateCache.put('views/directives/mb-preference-page.html',
    "<div id=mb-preference-body layout=row layout-margin flex> </div>"
  );


  $templateCache.put('views/directives/mb-titled-block.html',
    "<div layout=column style=\"border-radius: 5px; padding: 0px\" class=md-whiteframe-2dp> <md-toolbar class=md-hue-1 layout=row style=\"border-top-left-radius: 5px; border-top-right-radius: 5px; margin: 0px; padding: 0px\"> <div layout=row layout-align=\"start center\" class=md-toolbar-tools> <wb-icon size=24px style=\"margin: 0;padding: 0px\" ng-if=mbIcon>{{::mbIcon}}</wb-icon> <h3 translate=\"\" style=\"margin-left: 8px; margin-right: 8px\">{{::mbTitle}}</h3> </div> <md-menu layout-align=\"end center\" ng-show=mbMoreActions.length> <md-button class=md-icon-button aria-label=Menu ng-click=$mdOpenMenu($event)> <wb-icon>more_vert</wb-icon> </md-button> <md-menu-content width=4> <md-menu-item ng-repeat=\"item in mbMoreActions\"> <md-button ng-click=item.action() aria-label={{::item.title}}> <wb-icon ng-show=item.icon>{{::item.icon}}</wb-icon> <span translate=\"\">{{::item.title}}</span> </md-button> </md-menu-item> </md-menu-content> </md-menu> </md-toolbar> <md-progress-linear ng-style=\"{'visibility': mbProgress?'visible':'hidden'}\" md-mode=indeterminate class=md-primary> </md-progress-linear> <div flex ng-transclude style=\"padding: 16px\"></div> </div>"
  );


  $templateCache.put('views/directives/mb-tree-heading.html',
    "<h2 md-colors=\"{color: 'primary.A100'}\" class=\"mb-tree-heading md-subhead\"> <wb-icon ng-if=mbSection.icon>{{mbSection.icon}}</wb-icon> {{mbSection.title}} </h2>"
  );


  $templateCache.put('views/directives/mb-tree-link.html',
    "<md-button md-colors=\"{backgroundColor: (isSelected(mbSection.state) || $state.includes(mbSection.state)) ? 'primary.800': 'primary'}\" class=\"md-raised md-primary md-hue-1\" ng-click=focusSection(mbSection)> <wb-icon ng-if=mbSection.icon>{{mbSection.icon}}</wb-icon> <span translate>{{mbSection.title}}</span> <span class=md-visually-hidden ng-if=isSelected(mbSection)> current page </span> </md-button>"
  );


  $templateCache.put('views/directives/mb-tree-toggle.html',
    "<div ng-show=isVisible()> <md-button class=\"md-raised md-primary md-hue-1 md-button-toggle\" ng-click=toggle(mbSection) aria-controls=docs-menu-{{section.name}} aria-expanded={{isOpen(mbSection)}}> <div flex layout=row> <wb-icon ng-if=mbSection.icon>{{mbSection.icon}}</wb-icon> <span class=mb-toggle-title translate>{{mbSection.title}}</span> <span flex></span> <span aria-hidden=true class=md-toggle-icon ng-class=\"{toggled : isOpen(mbSection)}\"> <wb-icon>keyboard_arrow_up</wb-icon> </span> </div> <span class=md-visually-hidden> Toggle {{isOpen(mbSection)? expanded : collapsed}} </span> </md-button> <ul id=docs-menu-{{mbSection.title}} class=mb-tree-toggle-list> <li ng-repeat=\"section in mbSection.sections\" ng-if=isVisible(section)> <mb-tree-link mb-section=section ng-if=\"section.type === 'link'\"> </mb-tree-link> </li> </ul> </div>"
  );


  $templateCache.put('views/directives/mb-tree.html',
    "<ul id=mb-tree-root-element class=mb-tree> <li md-colors=\"{borderBottomColor: 'background-600'}\" ng-repeat=\"section in mbSection.sections | orderBy : 'priority'\" ng-show=isVisible(section)> <mb-tree-heading mb-section=section ng-if=\"section.type === 'heading'\"> </mb-tree-heading> <mb-tree-link mb-section=section ng-if=\"section.type === 'link'\"> </mb-tree-link> <mb-tree-toggle mb-section=section ng-if=\"section.type === 'toggle'\"> </mb-tree-toggle> </li> </ul>"
  );


  $templateCache.put('views/directives/mb-user-menu.html',
    "<div md-colors=\"{'background-color': 'primary-hue-1'}\" class=amd-user-menu> <md-menu md-offset=\"0 20\"> <md-button class=amd-user-menu-button ng-click=$mdOpenMenu() aria-label=\"Open menu\"> <img height=32px class=img-circle style=\"border-radius: 50%; vertical-align: middle\" ng-src=/api/v2/user/accounts/{{app.user.current.id}}/avatar ng-src-error=\"https://www.gravatar.com/avatar/{{app.user.current.id|wbmd5}}?d=identicon&size=32\"> <span>{{app.user.profile.first_name}} {{app.user.profile.last_name}}</span> <wb-icon class=material-icons>keyboard_arrow_down</wb-icon> </md-button> <md-menu-content width=3>  <md-menu-item ng-if=menu.items.length ng-repeat=\"item in menu.items| orderBy:['-priority']\"> <md-button ng-click=item.exec($event) translate=\"\"> <wb-icon ng-if=item.icon>{{item.icon}}</wb-icon> <span ng-if=item.title>{{item.title| translate}}</span> </md-button> </md-menu-item> <md-menu-divider ng-if=menu.items.length></md-menu-divider> <md-menu-item> <md-button ng-click=settings()> <span translate=\"\">Settings</span> </md-button> </md-menu-item> <md-menu-item ng-if=!app.user.anonymous> <md-button ng-click=logout()> <span translate=\"\">Logout</span> </md-button> </md-menu-item> <md-menu-item ng-if=app.user.anonymous> <md-button ng-href=users/login> <span translate=\"\">Login</span> </md-button> </md-menu-item> </md-menu-content> </md-menu> </div>"
  );


  $templateCache.put('views/directives/mb-user-toolbar.html',
    "<md-toolbar layout=row layout-align=\"center center\"> <img width=80px class=img-circle ng-src=/api/v2/user/accounts/{{app.user.current.id}}/avatar> <md-menu md-offset=\"0 20\"> <md-button class=capitalize ng-click=$mdOpenMenu() aria-label=\"Open menu\"> <span>{{app.user.profile.first_name}} {{app.user.profile.last_name}}</span> <wb-icon class=material-icons>keyboard_arrow_down</wb-icon> </md-button> <md-menu-content width=3>  <md-menu-item ng-if=menu.items.length ng-repeat=\"item in menu.items | orderBy:['-priority']\"> <md-button ng-click=item.exec($event) translate> <wb-icon ng-if=item.icon>{{item.icon}}</wb-icon> <span ng-if=item.title>{{item.title | translate}}</span> </md-button> </md-menu-item> <md-menu-divider></md-menu-divider> <md-menu-item> <md-button ng-click=toggleRightSidebar();logout();>{{'Logout' | translate}}</md-button> </md-menu-item> </md-menu-content> </md-menu> </md-toolbar>"
  );


  $templateCache.put('views/mb-error-messages.html',
    "<div ng-message=403 layout=column layout-align=\"center center\"> <wb-icon size=64px>do_not_disturb</wb-icon> <strong translate>Access denied</strong> <p translate>You are not allowed to access this item.</p> </div> <div ng-message=404 layout=column layout-align=\"center center\"> <wb-icon size=64px>visibility_off</wb-icon> <strong translate>Not found</strong> <p translate>Requested item not found.</p> </div> <div ng-message=500 layout=column layout-align=\"center center\"> <wb-icon size=64px>bug_report</wb-icon> <strong translate>Server error</strong> <p translate>An internal server error is occurred.</p> </div>"
  );


  $templateCache.put('views/mb-initial.html',
    "<div layout=column flex> <md-content layout=column flex> {{basePath}} <mb-preference-page mb-preference-id=currentStep.id> </mb-preference-page> </md-content> <md-stepper id=setting-stepper ng-show=steps.length md-mobile-step-text=false md-vertical=false md-linear=false md-alternative=true> <md-step ng-repeat=\"step in steps\" md-label=\"{{step.title | translate}}\"> </md-step> </md-stepper> </div>"
  );


  $templateCache.put('views/mb-passowrd-recover.html',
    " <md-toolbar layout-padding>  <h3>Forget Your PassWord ?</h3> </md-toolbar>  <div layout=column layout-padding> <md-input-container> <label>Username or Email</label> <input ng-model=credit.login required> </md-input-container> </div> <div layout=column layout-align=none layout-gt-sm=row layout-align-gt-sm=\"space-between center\" layout-padding> <a ui-sref=login flex-order=1 flex-order-gt-sm=-1>Back To Login Page</a> <md-button flex-order=0 class=\"md-primary md-raised\" ng-click=login(credit)>Send</md-button> </div>"
  );


  $templateCache.put('views/mb-preference.html',
    "<md-content ng-cloak flex> <div layout=row layout-align=\"start center\"> <wb-icon wb-icon-name={{::preference.icon}} size=128> </wb-icon> <div flex> <h1 translate>{{::preference.title}}</h1> <p translate>{{::preference.description}}</p> </div> </div> <mb-preference-page mb-preference-id=preference.id flex> </mb-preference-page> </md-content>"
  );


  $templateCache.put('views/mb-preferences.html',
    "<md-content ng-cloak layout-padding flex> <md-grid-list md-cols-gt-md=3 md-cols=3 md-cols-md=1 md-row-height=4:3 md-gutter-gt-md=16px md-gutter-md=8px md-gutter=4px> <md-grid-tile ng-repeat=\"tile in preferenceTiles\" md-colors=\"{backgroundColor: 'primary-300'}\" md-colspan-gt-sm={{tile.colspan}} md-rowspan-gt-sm={{tile.rowspan}} ng-click=openPreference(tile.page) style=\"cursor: pointer\"> <md-grid-tile-header> <h3 style=\"text-align: center;font-weight: bold\"> <wb-icon>{{tile.page.icon}}</wb-icon> <span translate=\"\">{{tile.page.title}}</span> </h3> </md-grid-tile-header> <p style=\"text-align: justify\" layout-padding translate=\"\">{{tile.page.description}}</p> </md-grid-tile> </md-grid-list> </md-content>"
  );


  $templateCache.put('views/options/mb-local.html',
    "<md-divider></md-divider> <md-input-container class=md-block> <label translate>Language & Local</label> <md-select ng-model=app.setting.local> <md-option ng-repeat=\"lang in languages\" ng-value=lang.key>{{lang.title | translate}}</md-option> </md-select> </md-input-container> <md-input-container class=md-block> <label translate>Direction</label> <md-select ng-model=app.setting.dir placeholder=Direction> <md-option value=rtl translate>Right to left</md-option> <md-option value=ltr translate>Left to right</md-option> </md-select> </md-input-container> <md-input-container class=md-block> <label translate>Calendar</label> <md-select ng-model=app.setting.calendar placeholder=\"\"> <md-option value=Gregorian translate>Gregorian</md-option> <md-option value=Jalaali translate>Jalaali</md-option> </md-select> </md-input-container> <md-input-container class=md-block> <label translate>Date format</label> <md-select ng-model=app.setting.dateFormat placeholder=\"\"> <md-option value=jMM-jDD-jYYYY translate> {{'2018-01-01' | mbDate:'jMM-jDD-jYYYY'}} </md-option> <md-option value=jYYYY-jMM-jDD translate> {{'2018-01-01' | mbDate:'jYYYY-jMM-jDD'}} </md-option> <md-option value=\"jYYYY jMMMM jDD\" translate> {{'2018-01-01' | mbDate:'jYYYY jMMMM jDD'}} </md-option> </md-select> </md-input-container>"
  );


  $templateCache.put('views/options/mb-theme.html',
    "<md-input-container class=md-block> <label translate>Theme</label> <md-select ng-model=app.setting.theme> <md-option ng-repeat=\"theme in themes\" value={{theme.id}} translate>{{theme.label}}</md-option> </md-select> </md-input-container> <md-input-container class=md-block ng-init=\"app.setting.navigationPath = app.setting.navigationPath || true\"> <md-switch class=md-primary name=special ng-model=app.setting.navigationPath> <sapn flex translate>Navigation path</sapn> </md-switch> </md-input-container>"
  );


  $templateCache.put('views/partials/mb-branding-header-toolbar.html',
    " <md-toolbar layout=row layout-padding md-colors=\"{backgroundColor: 'primary-100'}\">  <img style=\"max-width: 50%\" height=160 ng-show=app.config.logo ng-src=\"{{app.config.logo}}\"> <div> <h3>{{app.config.title}}</h3> <p>{{ app.config.description | limitTo: 250 }}{{app.config.description.length > 250 ? '...' : ''}}</p> </div> </md-toolbar>"
  );


  $templateCache.put('views/partials/mb-view-access-denied.html',
    "<div id=mb-panel-root-access-denied ng-if=\"status === 'accessDenied'\" layout=column layout-fill> Access Denied </div>"
  );


  $templateCache.put('views/partials/mb-view-loading.html',
    "<div id=mb-view-loading layout=column layout-align=\"center center\" layout-fill> <img width=256px ng-src-error=data:image/svg;base64,PHN2ZyB3aWR0aD0iOTI0IiBoZWlnaHQ9Ijg3MyIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIj4KIDxkZWZzPgogIDxmaWx0ZXIgaWQ9ImltYWdlYm90XzEwIiBjb2xvci1pbnRlcnBvbGF0aW9uLWZpbHRlcnM9InNSR0IiPgogICA8ZmVHYXVzc2lhbkJsdXIgc3RkRGV2aWF0aW9uPSIzLjY3ODQyIi8+CiAgPC9maWx0ZXI+CiAgPGZpbHRlciBpZD0iaW1hZ2Vib3RfNyIgeD0iLS4yMzAwNiIgeT0iLS4zMzU1IiB3aWR0aD0iMS40NjAxIiBoZWlnaHQ9IjEuNjcxIiBjb2xvci1pbnRlcnBvbGF0aW9uLWZpbHRlcnM9InNSR0IiPgogICA8ZmVHYXVzc2lhbkJsdXIgc3RkRGV2aWF0aW9uPSIzLjM4OTA2Ii8+CiAgPC9maWx0ZXI+CiAgPHJhZGlhbEdyYWRpZW50IGlkPSJpbWFnZWJvdF8xMDAiIGN4PSIyODEuODUiIGN5PSI3NTEuODQiIHI9IjQwNy4zNSIgZ3JhZGllbnRUcmFuc2Zvcm09Im1hdHJpeCgxLjgyOTkgLTEuMDcwMiAuODk2ODQgMS41MzM1IC05MDUuMTIgLTEzNC42NykiIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIj4KICAgPHN0b3Agc3RvcC1jb2xvcj0iI2ZmZiIgb2Zmc2V0PSIwIi8+CiAgIDxzdG9wIHN0b3AtY29sb3I9IiM1MGFkY2IiIG9mZnNldD0iMSIvPgogIDwvcmFkaWFsR3JhZGllbnQ+CiAgPGZpbHRlciBpZD0iaW1hZ2Vib3RfNTgiIGNvbG9yLWludGVycG9sYXRpb24tZmlsdGVycz0ic1JHQiI+CiAgIDxmZUdhdXNzaWFuQmx1ciBzdGREZXZpYXRpb249IjEuMDUwMDUiLz4KICA8L2ZpbHRlcj4KICA8ZmlsdGVyIGlkPSJpbWFnZWJvdF85OCIgY29sb3ItaW50ZXJwb2xhdGlvbi1maWx0ZXJzPSJzUkdCIj4KICAgPGZlR2F1c3NpYW5CbHVyIHN0ZERldmlhdGlvbj0iMS45ODgxNSIvPgogIDwvZmlsdGVyPgogIDxyYWRpYWxHcmFkaWVudCBpZD0iaW1hZ2Vib3RfMTI0IiBjeD0iMjI1LjQ5IiBjeT0iMzQ1LjgxIiByPSIzOC41NTMiIGdyYWRpZW50VHJhbnNmb3JtPSJ0cmFuc2xhdGUoNzUuNTI4IDE4LjA0KSIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPgogICA8c3RvcCBvZmZzZXQ9IjAiLz4KICAgPHN0b3Agb2Zmc2V0PSIxIi8+CiAgPC9yYWRpYWxHcmFkaWVudD4KICA8cmFkaWFsR3JhZGllbnQgaWQ9ImltYWdlYm90XzE1MyIgY3g9IjI1LjA1MyIgY3k9IjM5LjU5MyIgcj0iMTUuNzU3IiBncmFkaWVudFRyYW5zZm9ybT0ibWF0cml4KDEuNjYwMiAwIDAgLTIuMzQ4MyAtMTMuNTU2IDExMi41OSkiIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIj4KICAgPHN0b3Agc3RvcC1jb2xvcj0iIzc3NyIgb2Zmc2V0PSIwIi8+CiAgIDxzdG9wIG9mZnNldD0iMSIvPgogIDwvcmFkaWFsR3JhZGllbnQ+CiA8L2RlZnM+CiA8ZyBsYWJlbD0iRWJlbmUgMSI+CiAgPGcgc3Ryb2tlPSIjMTU0ZTczIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiPgogICA8cGF0aCB0cmFuc2Zvcm09InRyYW5zbGF0ZSgxLjI0NzQgLTEuODkxOCkgbWF0cml4KDEgMCAwIDEgMzkyLjU2IDI4Ny41MikiIGQ9Im0yNy4zNi0yNTEuMDVjMTExLjEzLTI3Ljg4NSA0NTEuMDQgMTA1LjAxIDQxNC4xNiA0NDAuNDItNDEuNTggMzQyLjkyLTI5Mi4xNiAzNTQuMzUtMzQxLjQzIDM2MS42NC00MzIuMjItMTMuNjItNDY1LjgyLTMzOC42My00NjIuNjUtMzc1Ljc4LTcuNDY1LTUwLjM3IDU5LjEyLTM1Ny40IDM4OS45Mi00MjYuMjh6IiBmaWxsPSJ1cmwoI2ltYWdlYm90XzEwMCkiIHN0cm9rZS13aWR0aD0iNy4zIiBsYWJlbD0iRWJlbmUgMSIvPgogICA8cGF0aCB0cmFuc2Zvcm09InRyYW5zbGF0ZSgxLjI0NzQgLTEuODkxOCkgbWF0cml4KDEgMCAwIDEgMzkyLjU2IDI4Ny41MikiIGQ9Im0zMjcuMzctNzUuMjg2YzQ5LjQyIDQ3LjA5NSA1NC44NzggMTE0LjA4IDUzLjUzOCAxNzkuODEiIGZpbGw9Im5vbmUiIGZpbHRlcj0idXJsKCNpbWFnZWJvdF85OCkiIHN0cm9rZS13aWR0aD0iNi44IiBsYWJlbD0iRWJlbmUgMSIvPgogICA8cGF0aCB0cmFuc2Zvcm09InRyYW5zbGF0ZSgxLjI0NzQgLTEuODkxOCkgbWF0cml4KDEgMCAwIDEgMzkyLjU2IDI4Ny41MikiIGQ9Im0tMTAwLjkzLTIxMC42NWMtOS42NjQxLTIyLjIzMS0zNS4xNzYtMzMuNDItNTkuNTk5LTM0LjM0NS0xMC41MjUtNy4xNjQzLTEzLjIxMyA2Ljg5MTctMTAuMjc1IDE0LjQzOC00LjU0NTggMS4xMTEtMjMuMTA1LTcuOTA2Ny05LjkyODIgMTIuODM2LTMuNTU4NSAwLjA1NjItMjYuNjY4LTMuOTAxMy03LjA3MTEgMTMuMTMyLTcuODM3MSAyLjkwNDktMTUuNjQ3IDUuODItMy4wMzA0IDE2LjE2Mi03Ljg4MTcgOS4zMjgzLTcuMzUyNiAxNC40NTEgMCAxNi4xNjItMy4yMDA0IDUuOTc3NS03LjgwMTEgMTIuNjU1IDAgMTMuMTMyLTcuMjk0NiA3LjE4MjgtMi43NzM1IDguNDU3OCAxLjAxMDIgMTAuMTAyIDI1LjEyNi0yMi41NDIgNDcuMzY0LTQ2LjM2OCA4OC44OTMtNjEuNjE5aDVlLTR6IiBmaWxsPSJub25lIiBzdHJva2Utd2lkdGg9IjcuMyIgbGFiZWw9IkViZW5lIDEiLz4KICAgPHBhdGggdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMS4yNDc0IC0xLjg5MTgpIG1hdHJpeCgxIDAgMCAxIDM5Mi41NiAyODcuNTIpIiBkPSJtLTI5MC40Ni00OS4yM2MtMTIuOTkgMi4wMTc2LTI1Ljg4IDUuMDAxMy0zOC42ODMgNy45OTExLTQuMTQ1MyAwLjU2Njk2LTUuNTY1NSA1LjMzNzYtMy4wODAxIDguNjAzNyA0LjY2NDMgMTEuMTM0IDguMTM2NiAyMi45MDUgMTMuNzk0IDMzLjUzOSA0Ljk5MjQgMy4zOTc3IDcuMjM5MS0zLjU1NzggOS4yODU3LTYuODk3MyA3LjA3NC0xMy4wNTUgMTQuODAyLTI1LjcxOSAyMi44NzktMzguMDU4IDEuMTkzNS0yLjczMTUtMS4yODI5LTUuNzI2NS00LjE5NjQtNS4xNzg2bDhlLTQgMWUtNHoiIGZpbGw9IiM2MThjYTgiIHN0cm9rZS13aWR0aD0iMi43MTQzIiBsYWJlbD0iRWJlbmUgMSIvPgogICA8cGF0aCB0cmFuc2Zvcm09InRyYW5zbGF0ZSgxLjI0NzQgLTEuODkxOCkgbWF0cml4KDEgMCAwIDEgMzkyLjU2IDI4Ny41MikiIGQ9Im0yMTEuMTctMjU0LjcyYy0xNS40NzggNC45MTktMzEuMzAyIDguOTAyNC00Ni41ODUgMTQuMzUzLTQuMTI4MyAxLjUwMjgtMy4xMDA3IDcuNDg5NSAxLjExNjEgOC4xNDczIDE4LjI5NyA3LjQ1NjYgMzYuNjM5IDE0Ljk3NCA1NC4yNjMgMjQuMDQgMy44NjM3IDIuMTgxOSA2Ljk2NDQtMi43NzIzIDUuMDExMi02LjA5NjItMy4yNDE5LTEyLjgzLTYuMDc5My0yNS44NzEtOS43ODA5LTM4LjUxNy0wLjU1NDg5LTEuNjI5Mi0yLjQ5MjUtMi4xOC00LjAyNS0xLjkyN2w2ZS00IC0xZS00eiIgZmlsbD0iIzYxOGNhOCIgc3Ryb2tlLXdpZHRoPSIyLjcxNDMiIGxhYmVsPSJFYmVuZSAxIi8+CiAgIDxnIHRyYW5zZm9ybT0idHJhbnNsYXRlKDEuMjQ3NCAtMS44OTE4KSBtYXRyaXgoMSAwIDAgMSAzOTIuNTYgMjg3LjUyKSIgZmlsbD0ibm9uZSIgZmlsdGVyPSJ1cmwoI2ltYWdlYm90XzU4KSIgc3Ryb2tlLXdpZHRoPSIzLjgiIGxhYmVsPSJFYmVuZSAxIj4KICAgIDxwYXRoIGQ9Im0xMy4yMi0xNzkuMzMtMy4wMzA1LTI4LjI4NCAzNy4zNzYgMjcuMjc0Ii8+CiAgICA8cGF0aCBkPSJtMTE3LjI2LTE2My4xNyAzMy4zMzUtOC4wODEyIDguMDgxMiAyMi4yMjMiLz4KICAgIDxwYXRoIGQ9Im0yMzAuNC0xNDkuMDMgNDUuNDU3LTIuMDIwM3YyOS4yOTQiLz4KICAgIDxwYXRoIGQ9Im00Ni45ODctMTM4Ljg5IDM2LjM2NS0xNy4xNzMgNi4wNjA5IDI1LjI1NCIvPgogICAgPHBhdGggZD0ibS04MC43My0yMy43Ny0xOS4xOTMtMTEuMTEyIDExLjExMiAyNi4yNjQiLz4KICAgIDxwYXRoIGQ9Im0tMTcwLjYzLTgxLjM1LTQ0LjQ0NyAzLjAzMDUgMjguMjg0IDM2LjM2NSIvPgogICAgPHBhdGggZD0ibS0yMTIuMDUtOS42My00MC40MDYtNC4wNDA2IDIwLjIwMyAzOC4zODYiLz4KICAgIDxwYXRoIGQ9Im0tMjY1LjU5IDgwLjI4LTMwLjMwNSAyNi4yNjQgMzIuMzI1IDkuMDkxNCIvPgogICAgPHBhdGggZD0ibS0xMzUuMjggMzAuNzgtMjguMjg0IDExLjExMiAzMS4zMTUgMTIuMTIyIi8+CiAgICA8cGF0aCBkPSJtLTc4LjcxIDY2LjE0LTE3LjE3MyAxNy4xNzMgMjYuMjY0IDExLjExMiIvPgogICAgPHBhdGggZD0ibS0xMzcuMyAxMTEuNTktNDkuNDk3IDkuMDkxNCAyOS4yOTQgMTYuMTYyIi8+CiAgICA8cGF0aCBkPSJtMTQ4LjU4IDExOC42NiA0My40MzcgNS4wNTA4LTIxLjIxMyAyMi4yMjMiLz4KICAgIDxwYXRoIGQ9Im0yNTYuNjYgNTcuMDQgMzQuMzQ1IDE0LjE0Mi0yMC4yMDMgMTcuMTczIi8+CiAgICA8cGF0aCBkPSJtMzc2Ljg3IDExNi42NCAyNS4yNTQgMjguMjg0LTIzLjIzNCAxNS4xNTIiLz4KICAgIDxwYXRoIGQ9Im0zMjQuMzQgMTYwLjA4IDI5LjI5NCAyMC4yMDMtMTkuMTkzIDEyLjEyMiIvPgogICAgPHBhdGggZD0ibTE2OS43OSAyMjUuNzQgMzEuMzE1IDE2LjE2Mi0yNC4yNDQgMTIuMTIyIi8+CiAgICA8cGF0aCBkPSJtNjUuNzQgMTEzLjYxIDI4LjI4NCAyMC4yMDMtMjguMjg0IDQuMDQwNiIvPgogICAgPHBhdGggZD0ibS02Ny42IDE1My4wMSAxMS4xMTIgMzQuMzQ1IDIzLjIzNC0yMi4yMjMiLz4KICAgIDxwYXRoIGQ9Im0zOC40NyAxOTUuNDQgMzEuMzE1IDMyLjMyNS0yLjAyMDMtMzkuMzk2Ii8+CiAgICA8cGF0aCBkPSJtLTI4MC43NCAxODIuMy0xNi4xNjIgNDEuNDE2IDM4LjM4Ni0xMS4xMTIiLz4KICAgIDxwYXRoIGQ9Im0tMTc4LjcxIDE5MS40LTEzLjEzMiAzMy4zMzUgMzYuMzY1LTE2LjE2MiIvPgogICAgPHBhdGggZD0ibS03NS42OCAyNzMuMjItMy4wMzA1IDM3LjM3NiAyNi4yNjQtMjYuMjY0Ii8+CiAgICA8cGF0aCBkPSJtLTUuOTggMjY1LjE0IDMzLjMzNSAzMy4zMzUgMTQuMTQyLTMxLjMxNSIvPgogICAgPHBhdGggZD0ibTYxLjcgMzIxLjcgMzcuMzc2IDMyLjMyNS0xLjAxMDItMzQuMzQ1Ii8+CiAgICA8cGF0aCBkPSJtMTE5LjI4IDI3NS4yNCAzNS4zNTUgMjYuMjY0IDEwLjEwMi0yMC4yMDMiLz4KICAgIDxwYXRoIGQ9Im0zMjQuMzQgMjYyLjExIDYuMDYwOSA0NS40NTctMzkuMzk2LTcuMDcxMSIvPgogICAgPHBhdGggZD0ibTM2OC43OSAyMzIuODEgMzYuMzY1IDMwLjMwNS0zMi4zMjUgMjIuMjIzIi8+CiAgICA8cGF0aCBkPSJtMzMyLjQyIDM1NS4wNCAyMi4yMjMgMjcuMjc0LTM5LjM5NiAyMS4yMTMiLz4KICAgIDxwYXRoIGQ9Im0yNTcuNjcgMzUzLjAyIDE4LjE4MyAyNi4yNjQtMzkuMzk2IDYuMDYwOSIvPgogICAgPHBhdGggZD0ibTIyNS4zNSA0MzMuODMgMTUuMTUyIDQ2LjQ2Ny0zNi4zNjUtMy4wMzA0Ii8+CiAgICA8cGF0aCBkPSJtMTYzLjczIDQ0My45My0zNC4zNSA0Ni40Ny0xNy4xNy0yNi4yNiIvPgogICAgPHBhdGggZD0ibTMxLjQgNDQ0Ljk0LTM5LjM5NiAzMy4zMzUtMTcuMTczLTM4LjM4NiIvPgogICAgPHBhdGggZD0ibS0zOC4zIDM1My4wMiAzMC4zMDUgNDEuNDE2IDguMDgxMi0yMS4yMTMiLz4KICAgIDxwYXRoIGQ9Im0tMTU0LjQ3IDM3OC4yNy0xNS4xNTIgMzkuMzk2aDUzLjUzOCIvPgogICAgPHBhdGggZD0ibS0yMzEuMjQgMjg3LjM2LTE5LjE5MyAzNC4zNDUgMzUuMzU1LTMuMDMwNCIvPgogICA8L2c+CiAgPC9nPgogIDxnIGZpbGw9IiM2MThjYTgiIHN0cm9rZT0iIzE1NGU3MyIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj4KICAgPGcgc3Ryb2tlLXdpZHRoPSIyLjcxNDMiPgogICAgPHBhdGggdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMS4yNDc0IC0xLjg5MTgpIG1hdHJpeCgxIDAgMCAxIDM5Mi41NiAyODcuNTIpIiBkPSJtLTE2Ni4xMS0yNDcuMzZjLTcuMTYwNiAxLjEzOC03LjIxNzEgMTAuMjU3LTUuODQ4MiAxNS44NDgtNC42MDM5IDAuMTk3NzMtMTEuMTMtMy4xNDM4LTEzLjcwNSAyLjUyMjMtMS4yNjE3IDMuNjQ2MSAyLjYwOTYgNy41MTI1IDIuODc5NSAxMC4yMDEtNC4yMTE5LTAuMzE1NTMtMTEuMzM1LTEuNDc1Ni0xMi4yNzcgNC4zNDk1LTAuOTMwNiA0LjEyNDQgMy42Njk4IDYuODI3MiA1LjI5MDYgOS42MjM3LTQuMjI4MiAxLjQ2MDktMTAuNTcxIDUuMTc0Ni03LjQ1NTQgMTAuNDQ2IDAuOTg3NDcgMi40MzggNC4xOTI1IDQuMjEzOSA0LjY4NzUgNi40Mjg2LTIuODYxNyA0LjA3LTcuNDYzNCAxMC40NDYtMi40NTU0IDE0Ljc1NCAwLjgyNDc5IDEuMTE1NiAzLjkxMDQgMC43NTk0NCAyLjEzMDQgMi42MTEzLTEuOTY1OCAzLjUwOTUtNC45MTAzIDkuMzI3NCAwLjE3NjIzIDExLjYyNyAyLjAyODcgMC45Njk1NiAxLjU1ODYgNC42OTE4IDQuMzgxMiA1LjAxMDEgNS4zMjE0IDIuMDM0MiA4Ljg2MTYtNC41MDI4IDEyLjk0Mi03LjA3OTIgMjAuNDQ5LTE4LjQgNDIuMjY3LTM2LjA3MiA2OC4xNi00Ni4xMiA0LjMxNDktMS4wNjc3IDcuMzc2Ni02LjIyNTQgNC4wMTc5LTkuOTEwNy03LjgyMjctMTIuNzg2LTIxLjUxMy0yMC42MTYtMzUuNDQ2LTI1LjA4OS02Ljk3OTgtMi4zMzYxLTE0LjMxOC0yLjkzMzYtMjEuNTE4LTMuOTI4Ni0xLjk0NDItMC41ODYwOS0zLjg1ODQtMS41NjMyLTUuOTU5OC0xLjI5NDZsLTUuM2UtNCA2ZS00eiIgbGFiZWw9IkViZW5lIDEiLz4KICAgIDxwYXRoIHRyYW5zZm9ybT0idHJhbnNsYXRlKDEuMjQ3NCAtMS44OTE4KSBtYXRyaXgoMSAwIDAgMSAzOTIuNTYgMjg3LjUyKSIgZD0ibS0zNTYuMjggODcuMTVjLTEwLjM0MiAwLjk3NDM1LTIwLjczNyAyLjM4OTMtMzEuMDQ5IDMuOTI4Ni01LjExOTIgMS44ODQ0LTEuNTk5IDcuMjU4NyAwLjI4MzYgMTAuMjIxIDYuNzYxOSAxMS4zOTQgMTIuNjk1IDIzLjM2OCAyMC4xODUgMzQuMjg4IDIuOTU0NyAzLjI2NzMgNy40MjY4LTAuMjc1MzQgNy4yOTkxLTMuOTUwOSAyLjQ0MTQtMTMuNjU0IDYuMTc2Mi0yNy4xMTMgOS41NzU5LTQwLjU4LTAuMDAxMS0zLjI3MzktMy41ODg0LTQuMzk4LTYuMjk0Ni0zLjkwNjJ2LTVlLTR6IiBsYWJlbD0iRWJlbmUgMSIvPgogICAgPHBhdGggdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMS4yNDc0IC0xLjg5MTgpIG1hdHJpeCgxIDAgMCAxIDM5Mi41NiAyODcuNTIpIiBkPSJtLTM2MC43MiAyMjguNjdjLTQuOTIxOSAwLjY0MjQ1LTQuNjI3MSA3LjU0MjYtNi42OTY0IDExLjExNi0zLjM1NTkgMTAuMzg5LTcuNDAzOSAyMC41NjMtOS43NTQ1IDMxLjIyOCAxLjI5MjMgNC45MTg2IDcuNzc5NCA1LjUxOTcgMTEuNDM1IDguMjggNi45MTIyIDMuMjk1OSAxMy40NzggNy43NyAyMC42NjMgMTAuMjc0IDQuNTU5OSAwLjgwMDUgNC43NDItNS4wNjI2IDMuMDgwOS03Ljg4NDEtNi4wMDAzLTE2LjE0MS0xMC4wNDEtMzIuODYxLTE0LjczMi00OS4zOTctMC40ODE4Mi0xLjg4NzktMS45MTg2LTMuNjE3NC0zLjk5NTUtMy42MTYxbC01ZS00IC04ZS00eiIgbGFiZWw9IkViZW5lIDEiLz4KICAgIDxwYXRoIHRyYW5zZm9ybT0idHJhbnNsYXRlKDEuMjQ3NCAtMS44OTE4KSBtYXRyaXgoMSAwIDAgMSAzOTIuNTYgMjg3LjUyKSIgZD0ibS01MC4xNS0yNzEuMzNjLTUuMTcxNCAxLjk4ODctMi41MTg5IDguOTg1MS0yLjc1MSAxMy4zNDQgMC44ODI2NiA4LjE1NyAwLjc2NDczIDE2LjUzNSAyLjEyNiAyNC41OCAzLjM5MDYgNC43ODU1IDkuNjIzMSAwLjI3MDIgMTMuOTE2LTAuNDY1ODkgNS45OTE4LTIuMjQxNSAxMi41MzItMy41MDk1IDE4LjA0OC02Ljc2NjIgMy4xOTIyLTQuOTQ5Mi0zLjc2NDMtNy44MjY2LTYuMzgzOS0xMS4wMDQtNy43MDY5LTYuNTA3OC0xNC43Mi0xNC4wODEtMjMuMTAzLTE5LjY2NS0wLjYxMTU3LTAuMTU1NzEtMS4yMzc3LTAuMTIyMjYtMS44NTI3LTAuMDIyMzJsNmUtNCAtNS45ZS00eiIgbGFiZWw9IkViZW5lIDEiLz4KICAgIDxwYXRoIHRyYW5zZm9ybT0idHJhbnNsYXRlKDEuMjQ3NCAtMS44OTE4KSBtYXRyaXgoMSAwIDAgMSAzOTIuNTYgMjg3LjUyKSIgZD0ibTkyLjY3LTI4My45MmMtMTEuNzcxIDcuNDMzNS0yNC4yMjQgMTQuNTM5LTM1LjYwMyAyMi43NjgtMi45ODg5IDMuOTY3MiAxLjU2MzggNy4wODIxIDUuNDkxMSA2LjU0MDIgMTQuNzYyIDAuMDI5NTQgMjkuMzk0IDEuNzYyMiA0My45MDYgNC4zMzA0IDQuNDY0NS0wLjE2NzE2IDQuNDIwNC01LjcwMjEgMi4zNjYxLTguNDgyMS0zLjk0ODktOC4xNjE1LTcuMTgyNi0xNi44NDUtMTIuMzQ0LTI0LjMzLTEuMTE1Ny0xLjE3NzUtMi4zNjY4LTAuODUxNjEtMy44MTctMC44MjU4OWw4ZS00IC02LjFlLTR6IiBsYWJlbD0iRWJlbmUgMSIvPgogICAgPHBhdGggdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMS4yNDc0IC0xLjg5MTgpIG1hdHJpeCgxIDAgMCAxIDM5Mi41NiAyODcuNTIpIiBkPSJtMzQ1LjMxLTE3Ni4xMWMtMTUuMzEyIDIuNTE0NC0zMC42NTQgNS4yNDk3LTQ1LjczNyA4LjgzOTMtNC42MzkyIDMuMDY3OCAwLjAyNTIgOC4wOTIgMy4xMjY3IDEwLjA5OSAxMS43MyA5LjU5MTIgMjIuNTUyIDIwLjIwNyAzMy44MzggMzAuMTkxIDMuMDMzOCAyLjYxMzYgNy4yNTkxLTAuNTU4MyA2Ljc2MzQtNC4xNTE4IDEuOTU1OC0xMy44MzkgNC40ODQ3LTI3LjYxMSA2LjA0OTEtNDEuNDk2LTAuMjgzNzEtMi4wNDkyLTEuOTExOS0zLjY5MzMtNC4wNDAyLTMuNDgyMXY2ZS00eiIgbGFiZWw9IkViZW5lIDEiLz4KICAgIDxwYXRoIHRyYW5zZm9ybT0idHJhbnNsYXRlKDEuMjQ3NCAtMS44OTE4KSBtYXRyaXgoMSAwIDAgMSAzOTIuNTYgMjg3LjUyKSIgZD0ibTQ0Ni41MSAxNDIuODdjLTMuMTgzIDQuNjE5Mi0xLjU2MzYgMTAuOTMtMi40OTgzIDE2LjIyNi0wLjM4ODg1IDEwLjQwNi0xLjc4ODYgMjAuODE4LTIuMSAzMS4xODQgMS40MzYgNC44MDI5IDcuMDc0NiAyLjYzODggOS42MTk1IDAuMjM5OTYgNy42NDM0LTUuMzU4OSAxNi4wMDYtMTAuMDU1IDIyLjk3OS0xNi4xNTMgMi4wMzI4LTQuNDk3NS00LjA1NzYtNy42Mi01Ljk2OTQtMTEuMjMtNS44Mjc2LTYuODg4LTExLjE5NC0xNC4yOTctMTcuNzY4LTIwLjQ2OS0xLjQxLTEuMDIzNi0yLjgzMjMtMC40MjgzNS00LjI2MzQgMC4yMDA4OWw2ZS00IDAuMDAxMTV6IiBsYWJlbD0iRWJlbmUgMSIvPgogICAgPHBhdGggdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMS4yNDc0IC0xLjg5MTgpIG1hdHJpeCgxIDAgMCAxIDM5Mi41NiAyODcuNTIpIiBkPSJtNDI4LjQzIDI3MS4xOWMtMy45OTI0IDMuNzA4LTQuMDY3NSA5Ljk2MDItNi4wNzQxIDE0LjgxNC0yLjExMyA4LjI5MDctNS41MDQ1IDE2LjIxNS03LjM0MTEgMjQuNTYxIDAuNzg2NTMgNS4yNjI2IDYuNDcxOCAzLjA1NTYgOS41NTk4IDEuNDQ4MiA1LjcxMjMtMi44NDYyIDEyLjQ3Ny00LjE3NzIgMTcuNDcxLTguMTY2OSAxLjU1My01LjM4MDQtMi4wNzE2LTEwLjc0Ny0zLjE3MTQtMTUuOTU1LTIuMjUzLTUuNDU1MS0yLjk5My0xMS45MTktNi44OTU1LTE2LjQ1Ni0wLjk3MTIzLTAuNDgyNDItMi41Mjg4LTAuNjg0NzYtMy41NDkxLTAuMjQ1NTNsNGUtNCAyLjNlLTR6IiBsYWJlbD0iRWJlbmUgMSIvPgogICAgPHBhdGggdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMS4yNDc0IC0xLjg5MTgpIG1hdHJpeCgxIDAgMCAxIDM5Mi41NiAyODcuNTIpIiBkPSJtMzk0LjQyIDM2My4yNWMtNS4xNDM1IDIuMTc2Mi01LjkyNjcgOC44Njc4LTkuMDk3MiAxMi45ODQtNS4zNjUgMTAuMTYzLTEyLjAxNyAxOS41ODQtMTcuNzMzIDI5LjUzOC0wLjY4OTUzIDUuMjQxMSA1LjQzMTcgNC45MjIyIDguOTI4NiA0LjU3NTkgMTEuMTkxLTAuOTk5NzkgMjIuNTk0LTAuNDI4NDcgMzMuNjYxLTIuMTIwNSA1LjMyNTUtMi4wNDU3IDEuMzgzNi04LjE2NjMgMC4yOTI0Ni0xMS43NjUtNC4yMjMyLTEwLjcyNy03LjU1ODQtMjEuOTYyLTEyLjc0OC0zMi4yMy0wLjg1OTE1LTAuODM5OTYtMi4xMzM0LTEuMTYzNi0zLjMwMzYtMC45ODIxNGwtMi42ZS00IC0yLjZlLTR6IiBsYWJlbD0iRWJlbmUgMSIvPgogICAgPHBhdGggdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMS4yNDc0IC0xLjg5MTgpIG1hdHJpeCgxIDAgMCAxIDM5Mi41NiAyODcuNTIpIiBkPSJtMzI4LjE3IDQ1NC4yN2MtNi45MzEyIDMuNTgwNy0xMS42MjQgMTAuMjk1LTE3Ljg2IDE0LjkzNC03LjQ3MyA3LjA2MzEtMTYuNTcxIDEyLjI3OC0yMy43NyAxOS42Mi0xLjk5NzQgMy40ODMzIDIuNTQ0MyA2Ljk0MjEgNi4wOTM4IDUuOTM3NSAxMS43MTktMC44OTUwMSAyMy40NjctMS43MDQxIDM1LjEzNC0zLjA4MDQgNC44MTgyLTIuMzQzOCAyLjU1LTguODU5NSAzLjYwMy0xMy4zNjYgMC4yNTYyNC02LjkyMjMgMS4zNTU3LTEzLjg1MiAxLjQ2NC0yMC43NDEtMC4zNTY0Mi0yLjE0OC0yLjUwNy0zLjcwNTItNC42NjUyLTMuMzAzNmw0ZS00IC01ZS00eiIgbGFiZWw9IkViZW5lIDEiLz4KICAgIDxwYXRoIHRyYW5zZm9ybT0idHJhbnNsYXRlKDEuMjQ3NCAtMS44OTE4KSBtYXRyaXgoMSAwIDAgMSAzOTIuNTYgMjg3LjUyKSIgZD0ibTE2NC42MiA1NDAuODNjLTE3Ljg2NCAzLjY1NDgtMzUuODY2IDYuNTMxNS01My44ODQgOS4yODU3LTMuOTU0NSAwLjA0Ni02LjEyNzIgNS40NTM3LTIuMzY2MSA3LjYxMTYgMTEuOTMxIDkuMzgyNyAyMy45ODUgMTkuMDAxIDM2Ljc2MyAyNy4yOTkgNS40MzQxIDEuMDY4OCA2LjMyNDktNi4xMjYgOC44MzAyLTkuMzYzNCA1LjE4ODctMTAuMTk2IDEwLjk2LTIwLjExOCAxNS4zNjYtMzAuNjU5IDAuMzg2ODMtMi42MzQ4LTIuMTc1LTQuNzc0My00LjcwOTgtNC4xNzQxbDdlLTQgMmUtNHoiIGxhYmVsPSJFYmVuZSAxIi8+CiAgICA8cGF0aCB0cmFuc2Zvcm09InRyYW5zbGF0ZSgxLjI0NzQgLTEuODkxOCkgbWF0cml4KDEgMCAwIDEgMzkyLjU2IDI4Ny41MikiIGQ9Im0tNzYuOTggNTI0LjI1Yy00LjE3MjggMC4xNjEwMi00LjUwMTQgNS42MzUxLTEuNTYyNSA3LjcyMzIgOS45MTA1IDEyLjUzNyAxOS43MDIgMjUuMjIxIDMwLjM1NyAzNy4wOTggNC44OTE3IDIuMzg4MiA3LjY3My0zLjk1OSAxMS4wNjYtNi4zMDYgNi40MjIzLTYuNTkyNSAxMy4zNjktMTIuNzgxIDE5LjE4LTE5Ljg5OSAxLjY1NzctNC40NjYxLTMuNzkwMS01LjUwMDItNi45NjQzLTUuODI1OS0xNy4xODUtMy41OTcyLTM0LjEwOS04LjQ5MzctNTEuMTM4LTEyLjc5bC0wLjI5MDE4LTAuMDIyMy0wLjY0NzMyIDAuMDIyMy03ZS00IC0zZS00eiIgbGFiZWw9IkViZW5lIDEiLz4KICAgIDxwYXRoIHRyYW5zZm9ybT0idHJhbnNsYXRlKDEuMjQ3NCAtMS44OTE4KSBtYXRyaXgoMSAwIDAgMSAzOTIuNTYgMjg3LjUyKSIgZD0ibS0yNzkuMDggMzk4LjYyYy0yLjgwMyA0LjI4MjktMC4zNzkwNCA5Ljg3MTUtMC44ODUzNCAxNC42ODcgMC42MTQzNiA4LjM0NDkgMC4yMzcwOCAxNi44ODYgMS41OTk2IDI1LjExMiAzLjE4ODIgNC4wNzE4IDkuMDc1MyAxLjE2OTkgMTMuNDEzIDEuNTc0MyA3LjAwMjgtMC42NDU4NCAxNC4wNTEtMS4wMzQ4IDIxLjAyOS0xLjgxOTkgNC43NDM5LTIuMzk1NSAxLjA0NS03LjE3NDEtMS41NTUzLTkuNTY1Ni05LjY5NDgtOS45NzI5LTE5LjMxNy0xOS45NjktMjguOTgtMjkuOTQzLTEuNDMxMy0xLjIzNTEtMy4wODcyLTAuODQ3NDMtNC42MjA1LTAuMDQ0NmwtNC42ZS00IC0yZS00eiIgbGFiZWw9IkViZW5lIDEiLz4KICAgPC9nPgogICA8cGF0aCB0cmFuc2Zvcm09InRyYW5zbGF0ZSgxLjI0NzQgLTEuODkxOCkgbWF0cml4KDEgMCAwIDEgMzkyLjU2IDI4Ny41MikiIGQ9Im00NDMtNjYuOTY2Yy0yNy45OSAwLjI4MTM5LTUzLjY1NCAxMi45NjUtNzcuNjM0IDI2LjEzOC00LjQzODMgMS45MzMxLTIuNTg2MiA3LjAyNzktMC44MjU4OSAxMC4yMjMgMTEuOTcyIDMxLjE5OCAxNi42MzcgNjQuNjU4IDE5LjY2NSA5Ny45MDIgMS4xMDA2IDguMDg2NyAxLjAxNSAxNi40MSAyLjk5MTEgMjQuMzMgMi42NzI2IDUuMDI1MyA4LjgzOSAwLjA1NyAxMi44NTItMS4xNDYyIDI1Ljg0OC0xMC42MjcgNTMuMTgzLTIyLjc3OCA4MS44MzUtMTguNDc0IDYuNDQyMiAwLjQ5NjYzIDEyLjU4NSAzLjQ5MzYgMTguOTk2IDMuMjU4OSA0Ljk1NDgtMy4yMjE2IDEyLjQ2OS00LjUxNjIgMTQuOTMzLTEwLjQ2OSAwLjMxODYxLTUuNDU3Ni02LjYxMzktNS42ODI2LTEwLjQyNC02Ljk0Mi0yLjkzNDYtMC44MDAxLTYuMzI4OC0wLjkyMjIyLTkuMDE3OS0xLjk4NjYgMy44NTc1LTIuMTE3NyAxMS4xOTQtMy4zMzk1IDEwLjI0Ni05LjI4NTctMS41MTIyLTQuOTYyLTguMTY4NC01Ljk2NjgtMTEuMDk0LTguOTczMiAzLjkyOTItMi4wNzc1IDEwLjg0MS00LjY5NjggOC43MDU0LTEwLjQyNC0xLjY4MzItNC4zNzU3LTYuNzI1My03LjIxOTItOC42MTYxLTEwLjg5MyAzLjUxMzUtMy4zOTY4IDEwLjIzMS02LjIwMDkgOS4zNzUtMTIuMDMxLTIuMjQ4OS01LjcxODktOC43MDkxLTguMTU1OS0xMi43MjMtMTIuMDk4IDAuNjM3NTYtNS4zNjM4IDYuODY3Mi04LjgzMDMgNi4yNzIzLTE0LjM1My0yLjM2NjYtNC45MzItOS43MjQtMi42NDc5LTEzLjEyNS01LjA0NDYgMS41NjkyLTQuNDMxOCA2LjgyMjUtOC4wODk1IDUuNDI0MS0xMy4xNy0zLjM1NTctNC4xNjg1LTkuNTc1LTEuODEyMy0xNC4xOTYtMi44MTI1IDUuOTAwOC0yLjc0MzcgMTMuNzg2LTMuODQyMiAxNy40MTEtOS44NjYxIDEuNzQwNC01Ljg4NjktNS41MzI5LTguMjg4NC05LjkzMy05LjIxODgtMTMuNDU0LTMuMDg3My0yNy4yODktNC45MjM0LTQxLjExNi00LjY2NTJsLTAuMDAxMDEgMWUtM3oiIHN0cm9rZS13aWR0aD0iMS45Mzg4IiBsYWJlbD0iRWJlbmUgMSIvPgogIDwvZz4KICA8cGF0aCB0cmFuc2Zvcm09InRyYW5zbGF0ZSgxLjI0NzQgLTEuODkxOCkgbWF0cml4KDEgMCAwIDEgMzkyLjU2IDI4Ny41MikiIGQ9Im0zNjIuODgtMzguMzQ0YzM4LjQwMy0yMC4yOTcgNjcuNDM3LTM2LjAwNiAxMTkuMi0yNC4yNDQgMTIuNjkzLTAuMTM5MDkgMjguMTQ1IDExLjY5OC00LjA0MDYgMjAuMjAzIDE4LjE4My0wLjY3MzQ0IDIwLjU0IDAuNjczNDQgOS4wOTE0IDE2LjE2MiAyNy4zNTQgMi41MDU1IDkuMDI0NiA5LjM2MDYgNy4wNzExIDE5LjE5MyAxOC4zMzQgMTEuMTggMTcuMDA0IDE1Ljc1NiAzLjAzMDUgMjQuMjQ0IDcuMTcxNyA1LjcyNDIgMTguNTE5IDE1LjQ4OSAwIDIxLjIxMyAxNi42NzIgNy40MjIyIDE2LjY2MiAxMy40NTQgMS4wMTAyIDE4LjE4MyAyOC40NjIgMy44NDQ3IDI1LjY5MiAxMC45NzcgMy4wMzA1IDIwLjIwMy00Mi45OTItMTMuODU5LTc2Ljg2NCA1LjcyMzgtMTEyLjEzIDIwLjIwM3YxLjAxMDJjLTQuOTYtNDUuNDU2LTUuOTktOTAuOTEzLTI2LjI2LTEzNi4zN2wtMC4wMDMxLTJlLTR6IiBmaWxsPSJub25lIiBzdHJva2U9IiMxNTRlNzMiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIgc3Ryb2tlLXdpZHRoPSI3LjMiIGxhYmVsPSJFYmVuZSAxIi8+CiAgPGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMS4yNDc0IC0xLjg5MTgpIG1hdHJpeCgxIDAgMCAxIDM5My4yNyAyODYuODEpIiBzdHJva2U9IiMxNTRlNzMiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIgbGFiZWw9IkViZW5lIDEiPgogICA8ZyBmaWxsPSJub25lIiBzdHJva2Utd2lkdGg9IjQuNyI+CiAgICA8cGF0aCBkPSJtLTUwLjAwOS0yMzMuNjMtMy4wMzA1LTQxLjQxNiAzNy4zNzYgMzMuMzM1Ii8+CiAgICA8cGF0aCBkPSJtNTAuMDk4LTI1Ni4xOCA0NS40NTctMjguMjg0IDE3LjE3MyAzNi4zNjUiLz4KICAgIDxwYXRoIGQ9Im0xNTYuMjQtMjM3LjY4IDYwLjYwOS0xOC4xODMgMTIuMTIyIDQ4LjQ4NyIvPgogICAgPHBhdGggZD0ibTI5NC40OC0xNjUuNzggNTQuNTQ4LTEwLjEwMi04LjA4MTIgNTIuNTI4Ii8+CiAgICA8cGF0aCBkPSJtLTI4Ni4yMS00OS40NC00Ny40NzcgMTAuMTAyIDE2LjE2MiA0MS40MTYiLz4KICAgIDxwYXRoIGQ9Im0tMzUxLjUyIDg3LjQyLTM5LjM5NiA1LjA1MDggMjcuMjc0IDQ3LjQ3NyIvPgogICAgPHBhdGggZD0ibTQ0NC40MyAxMzcuODljNS44MDM0IDMuMDI2MyAzMC43MzYgMzUuMzE1IDMwLjczNiAzNS4zMTVsLTMyLjQ5OSAyMi4xOTMiLz4KICAgIDxwYXRoIGQ9Im00MjkuNjcgMjYzLjg4IDEzLjEzMiAzOS4zOTYtMjkuMjk0IDEyLjEyMiIvPgogICAgPHBhdGggZD0ibTM5Ni40MSAzNjIuMTEgMTcuMTczIDQ1LjQ1Ny00Ni40NjcgMi4wMjAzIi8+CiAgICA8cGF0aCBkPSJtLTM2MS43MyAyMjQuNzMtMTUuMTUyIDQ3LjQ3NyAzNi4zNjUgMTkuMTkzIi8+CiAgICA8cGF0aCBkPSJtLTI3OS43MyAzOTYuNDYgMi4wMjAzIDQzLjQzNyAzOC4zODYtMy4wMzA1Ii8+CiAgICA8cGF0aCBkPSJtLTg0Ljc3MyA1MjIuODMgMzguMzg2IDQ3LjQ3NyAyOC4yODQtMjguMjg0Ii8+CiAgICA8cGF0aCBkPSJtMTAzLjEyIDU1Mi43OCA0NC40NDcgMzMuMzM1IDIzLjIzNC00NS40NTciLz4KICAgIDxwYXRoIGQ9Im0yNzkuODIgNDk0Ljc5IDQ5LjQ5Ny00LjA0MDYgMy4wMzA1LTM5LjM5NiIvPgogICA8L2c+CiAgIDxnIGZpbHRlcj0idXJsKCNpbWFnZWJvdF8xMCkiIG9wYWNpdHk9Ii44ODMzMyIgc3Ryb2tlLXdpZHRoPSIyLjkiPgogICAgPGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMTQ2KSIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjMTU0ZTczIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIHN0cm9rZS13aWR0aD0iMi45Ij4KICAgICA8cGF0aCBkPSJtMjI1Ljg0LTYuNTk1NmMyOC41OS0zMS43MiA2Ni40NjgtMzcuMDg1IDEwMC4wMS0zNi4zNjUiLz4KICAgICA8cGF0aCBkPSJtMjMwLjg5IDEzLjYwOGMyOS44MzMtMjkuNjM4IDY5LjY1Ni0zOC45MDEgMTA3LjA4LTMxLjMxNSIvPgogICAgIDxwYXRoIGQ9Im0yMzYuOTUgNDUuOTMyYzI5LjI4LTMwLjU2NSA2Ni45My0zMC40OCAxMDQuMDQtMzIuMzI0Ii8+CiAgICAgPHBhdGggZD0ibTIzNy45NiA2Ni4xMzVjMTcuNDUtOS45NjYgMTcuNTYtMzUuMjg2IDk1Ljk2LTIzLjIzMyIvPgogICAgIDxwYXRoIGQ9Im0yMjAuNzktMjcuODA5YzI1LjM4Mi0yMS40NiA2MS40My0zNC4xMTggMTAwLjAxLTM0LjM0NSIvPgogICAgPC9nPgogICA8L2c+CiAgPC9nPgogIDxwYXRoIHRyYW5zZm9ybT0idHJhbnNsYXRlKDEuMjQ3NCAtMS44OTE4KSBtYXRyaXgoMSAwIDAgMSAzOTIuNTYgMjg3LjUyKSIgZD0ibS0xNTQuMzUtMjMxLjI3YzEyLjkyNyA3LjIyNDYgMzIuMDkgOS43NzI5IDM1LjM1NSAyNC4yNDRtLTYwLjYwOS0xOS4xOTNjMTMuOTggOS43OTkyIDM1Ljk4MyA5LjU2OSA0MC40MDYgMzEuMzE1bS00OC40ODctMy4wMzA1YzguNjIxOCA2LjA2OTggMTUuMjU0IDIuMTkgMjYuMjY0IDIwLjIwM2wyLjAyMDMgMS4wMTAyIiBmaWxsPSJub25lIiBmaWx0ZXI9InVybCgjaW1hZ2Vib3RfNykiIHN0cm9rZT0iIzE1NGU3MyIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBzdHJva2Utd2lkdGg9IjMuNCIgbGFiZWw9IkViZW5lIDEiLz4KICA8dGl0bGU+RWJlbmUgMTwvdGl0bGU+CiAgPHBhdGggdHJhbnNmb3JtPSJtYXRyaXgoMS42MTA1IC41MzMwOSAtLjUzMzA5IDEuNjEwNSAyNDkuNTQgLTQ5Ny4zMikiIGQ9Im0yNDAuOSAzNjMuODVjMCAxOS43MTgtMTUuOTg1IDM1LjcwMy0zNS43MDMgMzUuNzAzLTE5LjcxOCAwLTM1LjcwMy0xNS45ODUtMzUuNzAzLTM1LjcwMyAwLTE5LjcxOCAxNS45ODUtMzUuNzAzIDM1LjcwMy0zNS43MDMgMTkuNzE4IDAgMzUuNzAzIDE1Ljk4NSAzNS43MDMgMzUuNzAzeiIgZmlsbD0iI2ZmZiIgc3Ryb2tlPSIjMDAwIiBzdHJva2Utb3BhY2l0eT0iLjYxNDk3IiBzdHJva2Utd2lkdGg9IjUuNyIgbGFiZWw9IkNhcGEgMSIvPgogIDxwYXRoIHRyYW5zZm9ybT0ibWF0cml4KDEuNjEwNSAuNTMzMDkgLS41MzMwOSAxLjYxMDUgMjQ5LjU0IC00OTcuMzIpIiBkPSJtMzM2LjczIDM2My44NWMwIDE5LjcxOC0xNS45ODUgMzUuNzAzLTM1LjcwMyAzNS43MDMtMTkuNzE4IDAtMzUuNzAzLTE1Ljk4NS0zNS43MDMtMzUuNzAzIDAtMTkuNzE4IDE1Ljk4NS0zNS43MDMgMzUuNzAzLTM1LjcwMyAxOS43MTggMCAzNS43MDMgMTUuOTg1IDM1LjcwMyAzNS43MDN6IiBmaWxsPSIjZmZmIiBzdHJva2U9InVybCgjaW1hZ2Vib3RfMTI0KSIgc3Ryb2tlLW9wYWNpdHk9Ii42MTQ5NyIgc3Ryb2tlLXdpZHRoPSI1LjciIGxhYmVsPSJDYXBhIDEiLz4KICA8cGF0aCB0cmFuc2Zvcm09Im1hdHJpeCgxLjYzMzkgLjU0MDgxIC0uNTQwODEgMS42MzM5IDE4Mi4xOSAtNDE0LjM5KSIgZD0ibTI0NC4yOSAzMDYuNTRjMCA2Ljc0NTgtNS44MDUxIDEyLjIxNC0xMi45NjYgMTIuMjE0cy0xMi45NjYtNS40Njg1LTEyLjk2Ni0xMi4yMTQgNS44MDUtMTIuMjE0IDEyLjk2Ni0xMi4yMTQgMTIuOTY2IDUuNDY4NSAxMi45NjYgMTIuMjE0eiIgb3BhY2l0eT0iLjgzODU3IiBsYWJlbD0iQ2FwYSAxIi8+CiAgPHBhdGggdHJhbnNmb3JtPSJtYXRyaXgoMS42MzM5IC41NDA4MSAtLjU0MDgxIDEuNjMzOSAzMzcuMTIgLTM2My4xMSkiIGQ9Im0yNDQuMjkgMzA2LjU0YzAgNi43NDU4LTUuODA1MSAxMi4yMTQtMTIuOTY2IDEyLjIxNHMtMTIuOTY2LTUuNDY4NS0xMi45NjYtMTIuMjE0IDUuODA1LTEyLjIxNCAxMi45NjYtMTIuMjE0IDEyLjk2NiA1LjQ2ODUgMTIuOTY2IDEyLjIxNHoiIG9wYWNpdHk9Ii44Mzg1NyIgbGFiZWw9IkNhcGEgMSIvPgogIDxwYXRoIHRyYW5zZm9ybT0icm90YXRlKDIxLjIwNiA0MjYuMTIgMzQyLjU0KSBtYXRyaXgoNi4wNjI1IDAgMCA2LjA2MjUgMjU4LjQ2IDE3Mi4xOSkiIGQ9Im00MC4yMjUgMzMuMDU1Yy00Ljk0NTQtNy44MjI3LTcuMzg3Ni0xMC41NzktMTIuNjg2LTEwLjU3OS01LjE4MTMgMC04LjYzMjQgMy4xNzEyLTEyLjQ1MSAxMS4yNDMgNC41NTk5LTQuNDEyNiA3LjA1MTktNi44NTYxIDEyLjA5OS02Ljg1NjEgNC45Mjk4IDAgNy42MzgxIDEuOTczOSAxMy4wMzggNi4xOTE5eiIgZmlsbD0idXJsKCNpbWFnZWJvdF8xNTMpIiBsYWJlbD0iTGF5ZXIgMSIvPgogPC9nPgo8L3N2Zz4K ng-src=\"/api/v2/cms/contents/mb-preloading-brand/content\"> <h3>Loading...</h3> <md-progress-linear style=\"width: 50%\" md-mode=indeterminate> </md-progress-linear> <md-button ng-if=\"app.state.status === 'fail'\" class=\"md-raised md-primary\" ng-click=restart() aria-label=Retry> <wb-icon>replay</wb-icon> retry </md-button> </div>"
  );


  $templateCache.put('views/partials/mb-view-login.html',
    "<div ng-if=\"status === 'login'\" layout=row layout-aligne=none layout-align-gt-sm=\"center center\" ng-controller=MbAccountCtrl flex> <div md-whiteframe=3 flex=100 flex-gt-sm=50 layout=column mb-preloading=ctrl.loadUser>  <ng-include src=\"'views/partials/mb-branding-header-toolbar.html'\"></ng-include> <md-progress-linear ng-disabled=\"!(ctrl.loginProcess || ctrl.logoutProcess)\" style=\"margin: 0px; padding: 0px\" md-mode=indeterminate class=md-primary md-color> </md-progress-linear>  <div style=\"text-align: center\" layout-margin ng-show=\"!ctrl.loginProcess && ctrl.loginState === 'fail'\"> <p><span md-colors=\"{color:'warn'}\" translate>{{loginMessage}}</span></p> </div> <form name=ctrl.myForm ng-submit=login(credit) layout=column layout-padding> <md-input-container> <label translate>Username</label> <input ng-model=credit.login name=username required> <div ng-messages=ctrl.myForm.username.$error> <div ng-message=required translate>This field is required.</div> </div> </md-input-container> <md-input-container> <label translate>Password</label> <input ng-model=credit.password type=password name=password required> <div ng-messages=ctrl.myForm.password.$error> <div ng-message=required translate>This field is required.</div> </div> </md-input-container>  <div vc-recaptcha ng-if=\"__tenant.settings['captcha.engine'] === 'recaptcha'\" key=\"__tenant.settings['captcha.engine.recaptcha.key']\" ng-model=credit.g_recaptcha_response theme=\"__app.configs.captcha.theme || 'light'\" type=\"__app.configs.captcha.type || 'image'\" lang=\"__app.setting.local || __app.config.local || 'en'\"> </div> <input hide type=\"submit\"> <div layout=column layout-align=none layout-gt-xs=row layout-align-gt-xs=\"end center\" layout-margin> <a href=users/reset-password style=\"text-decoration: none\" ui-sref=forget flex-order=1 flex-order-gt-xs=-1>{{'forgot your password?'| translate}}</a> <md-button ng-disabled=ctrl.myForm.$invalid flex-order=-1 flex-order-gt-xs=1 class=\"md-primary md-raised\" ng-click=login(credit)>{{'login'| translate}}</md-button>      </div> </form> </div> </div>"
  );


  $templateCache.put('views/partials/mb-view-main.html',
    "<div id=mb-view-main mb-panel-sidenav-anchor layout=row style=\"height: 100vh; width: 100vw\"> <div layout=column flex> <div mb-panel-toolbar-anchor></div> <div layout=row flex id=mb-view-main-anchor></div> </div> </div>"
  );


  $templateCache.put('views/preferences/mb-brand.html',
    "<div layout=column layout-margin ng-cloak flex> <mb-titled-block mb-title=\"{{'Configurations' | translate}}\"> <md-input-container class=md-block> <label translate>Title</label> <input required md-no-asterisk name=title ng-model=\"app.config.title\"> </md-input-container> <md-input-container class=md-block> <label translate>Description</label> <input md-no-asterisk name=description ng-model=\"app.config.description\"> </md-input-container> </mb-titled-block> <div layout=row layout-wrap layout-margin> <mb-titled-block mb-title=\"{{'Brand' | translate}}\"> <mb-inline ng-model=app.config.logo mb-inline-type=image mb-inline-label=\"Application Logo\" mb-inline-enable=true> <img width=256px height=256px ng-src={{app.config.logo}}> </mb-inline> </mb-titled-block> <mb-titled-block mb-title=\"{{'Favicon' | translate }}\"> <mb-inline ng-model=app.config.favicon mb-inline-type=image mb-inline-label=\"Application Favicon\" mb-inline-enable=true> <img width=256px height=256px ng-src={{app.config.favicon}}> </mb-inline> </mb-titled-block> </div> </div>"
  );


  $templateCache.put('views/preferences/mb-google-analytic.html',
    "<div layout=column layout-margin ng-cloak flex> <md-input-container class=md-block> <label>Google analytic property</label> <input required md-no-asterisk name=property ng-model=\"app.config.googleAnalytic.property\"> </md-input-container> </div>"
  );


  $templateCache.put('views/preferences/mb-language.html',
    " <div layout=column layout-align=\"center center\" layout-margin style=\"min-height: 300px\" flex> <div layout=column layout-align=\"center start\"> <p>{{'Select default language of site:' | translate}}</p> <md-checkbox ng-repeat=\"lang in languages\" style=\"margin: 8px\" ng-checked=\"myLanguage.key === lang.key\" ng-click=setLanguage(lang) aria-label={{lang.key}}> {{lang.title | translate}} </md-checkbox> </div> </div>"
  );


  $templateCache.put('views/preferences/mb-local.html',
    "<div layout=column layout-padding ng-cloak flex> <md-input-container class=\"md-icon-float md-block\"> <label translate>Language</label> <md-select ng-model=__app.configs.language> <md-option ng-repeat=\"lang in languages\" ng-value=lang.key>{{lang.title | translate}}</md-option> </md-select> <wb-icon style=\"cursor: pointer\" ng-click=goToManage()>settings</wb-icon> </md-input-container> <md-input-container class=md-block> <label translate>Direction</label> <md-select ng-model=__app.configs.dir placeholder=Direction> <md-option value=rtl translate>Right to left</md-option> <md-option value=ltr translate>Left to right</md-option> </md-select> </md-input-container> <md-input-container class=md-block> <label translate>Calendar</label> <md-select ng-model=__app.configs.calendar placeholder=\"\"> <md-option value=Gregorian translate>Gregorian</md-option> <md-option value=Jalaali translate>Jalaali</md-option> </md-select> </md-input-container> <md-input-container class=md-block> <label translate>Date format</label> <md-select ng-model=__app.configs.dateFormat placeholder=\"\"> <md-option value=jMM-jDD-jYYYY translate> <span translate>Month Day Year, </span> <span translate>Ex. </span> {{'2018-01-01' | mbDate:'jMM-jDD-jYYYY'}} </md-option> <md-option value=jYYYY-jMM-jDD translate> <span translate>Year Month Day, </span> <span translate>Ex. </span> {{'2018-01-01' | mbDate:'jYYYY-jMM-jDD'}} </md-option> <md-option value=\"jYYYY jMMMM jDD\" translate> <span translate>Year Month Day, </span> <span translate>Ex. </span> {{'2018-01-01' | mbDate:'jYYYY jMMMM jDD'}} </md-option> </md-select> </md-input-container> </div>"
  );


  $templateCache.put('views/preferences/mb-update.html',
    "<div layout=column layout-padding ng-cloak flex> <md-switch class=md-secondary ng-model=app.config.update.showMessage aria-label=\"Show spa update message option\"> <p translate=\"\">Show update message to customers</p> </md-switch> <md-switch class=md-secondary ng-model=app.config.update.autoReload ng-disabled=!app.config.update.showMessage aria-label=\"Automatically reload page option\"> <p translate=\"\">Reload the page automatically on update</p> </md-switch> </div>"
  );


  $templateCache.put('views/resources/mb-accounts.html',
    "<div ng-controller=\"MbSeenUserAccountsCtrl as ctrl\" ng-init=\"ctrl.setDataQuery('{id, login, is_active, date_joined, last_login, profiles{first_name,last_name}, avatars{id}}')\" mb-preloading=\"ctrl.state === 'busy'\" layout=column flex> <mb-pagination-bar mb-model=ctrl.queryParameter mb-properties=ctrl.properties mb-reload=ctrl.reload() mb-more-actions=ctrl.getActions()> </mb-pagination-bar> <md-content mb-infinate-scroll=ctrl.loadNextPage() layout=column flex> <md-list flex> <md-list-item ng-repeat=\"user in ctrl.items track by user.id\" ng-click=\"multi || resourceCtrl.setSelected(user)\" class=md-3-line> <img class=md-avatar ng-src=/api/v2/user/accounts/{{::user.id}}/avatar ng-src-error=\"https://www.gravatar.com/avatar/{{ ::user.id | wbmd5 }}?d=identicon&size=32\"> <div class=md-list-item-text layout=column> <h4>{{user.login}}</h4> <h3>{{user.profiles[0].first_name}} {{user.profiles[0].last_name}}</h3> </div> <md-checkbox ng-if=multi class=md-secondary ng-init=\"user.selected = resourceCtrl.isSelected(user)\" ng-model=user.selected ng-change=\"resourceCtrl.setSelected(user, user.selected)\"> </md-checkbox> <md-divider md-inset></md-divider> </md-list-item> </md-list> </md-content> </div>"
  );


  $templateCache.put('views/resources/mb-cms-content-upload.html',
    "<div layout=column flex> <lf-ng-md-file-input lf-files=ctrl.files accept=image/* progress preview drag flex> </lf-ng-md-file-input>  <md-content layout-padding> <div layout=row> <md-checkbox ng-model=_absolutPathFlag ng-change=ctrl.setAbsolute(_absolutPathFlag) aria-label=\"Absolute path of the image\"> <span translate>Absolute path</span> </md-checkbox> </div> </md-content> </div>"
  );


  $templateCache.put('views/resources/mb-cms-images.html',
    "<div layout=column mb-preloading=\"ctrl.state === 'busy'\" ng-init=\"ctrl.addFilter('media_type', 'image')\" flex> <mb-pagination-bar style=\"border-top-right-radius: 10px; border-bottom-left-radius: 10px\" mb-model=ctrl.queryParameter mb-properties=ctrl.properties mb-reload=ctrl.reload() mb-more-actions=ctrl.getActions()> </mb-pagination-bar> <md-content mb-infinate-scroll=ctrl.loadNextPage() layout=row layout-wrap layout-align=\"start start\" flex> <div ng-click=\"ctrl.setSelected(pobject, $index, $event);\" ng-repeat=\"pobject in ctrl.items track by pobject.id\" style=\"border: 16px; border-style: solid; border-width: 1px; margin: 8px\" md-colors=\"ctrl.isSelected($index) ? {borderColor:'accent'} : {}\" ng-if=!listViewMode> <img style=\"width: 128px; height: 128px\" ng-src=\"{{'/api/v2/cms/contents/'+pobject.id+'/thumbnail'}}\"> </div> <md-list ng-if=listViewMode> <md-list-item ng-repeat=\"pobject in items track by pobject.id\" ng-click=\"ctrl.setSelected(pobject, $index, $event);\" md-colors=\"ctrl.isSelected($index) ? {background:'accent'} : {}\" class=md-3-line> <img ng-if=\"pobject.mime_type.startsWith('image/')\" style=\"width: 128px; height: 128px\" ng-src=/api/v2/cms/contents/{{pobject.id}}/thumbnail> <wb-icon ng-if=\"!pobject.mime_type.startsWith('image/')\">insert_drive_file</wb-icon> <div class=md-list-item-text layout=column> <h3>{{pobject.title}}</h3> <h4>{{pobject.name}}</h4> <p>{{pobject.description}}</p> </div> <md-divider md-inset></md-divider> </md-list-item> </md-list>  <div layout=column layout-align=\"center center\"> <md-progress-circular ng-show=\"ctrl.status === 'working'\" md-diameter=96> Loading ... </md-progress-circular> </div> </md-content> <md-content>  <div layout-padding layout=row> <md-checkbox ng-model=_absolutPathFlag ng-change=ctrl.setAbsolute(absolutPathFlag) aria-label=\"Absolute path of the image\"> <span translate>Absolute path</span> </md-checkbox> </div> </md-content> </div>"
  );


  $templateCache.put('views/resources/mb-groups.html',
    "<div ng-controller=\"MbSeenUserGroupsCtrl as ctrl\" mb-preloading=\"ctrl.state === 'busy'\" layout=column flex> <mb-pagination-bar mb-model=ctrl.queryParameter mb-properties=ctrl.properties mb-reload=ctrl.reload() mb-more-actions=ctrl.getActions()> </mb-pagination-bar> <md-content mb-infinate-scroll=ctrl.loadNextPage() layout=column flex> <md-list flex> <md-list-item ng-repeat=\"group in ctrl.items track by group.id\" ng-click=\"multi || resourceCtrl.setSelected(group)\" class=md-3-line> <wb-icon>group</wb-icon> <div class=md-list-item-text layout=column> <h3>{{group.name}}</h3> <h4></h4> <p>{{group.description}}</p> </div> <md-checkbox ng-if=multi class=md-secondary ng-init=\"group.selected = resourceCtrl.isSelected(group)\" ng-model=group.selected ng-click=\"resourceCtrl.setSelected(group, group.selected)\"> </md-checkbox> <md-divider md-inset></md-divider> </md-list-item>  </md-list> </md-content> </div>"
  );


  $templateCache.put('views/resources/mb-local-file.html',
    "<div layout=column layout-padding flex> <lf-ng-md-file-input lf-files=resourceCtrl.files accept=\"{{style.accept || '*'}}\" progress preview drag flex> </lf-ng-md-file-input> </div>"
  );


  $templateCache.put('views/resources/mb-module-cms.html',
    "<div layout=column mb-preloading=\"ctrl.state === 'busy'\" ng-init=\"ctrl.addFilter('media_type', 'mb-module')\" flex> <mb-pagination-bar style=\"border-top-right-radius: 10px; border-bottom-left-radius: 10px\" mb-model=ctrl.queryParameter mb-properties=ctrl.properties mb-reload=ctrl.reload() mb-more-actions=ctrl.getActions()> </mb-pagination-bar> <md-content mb-infinate-scroll=ctrl.loadNextPage() flex> <md-list> <md-list-item ng-repeat=\"pobject in ctrl.items track by pobject.id\" ng-click=\"ctrl.setSelected(pobject, $index, $event);\" md-colors=\"ctrl.isSelected($index) ? {background:'accent'} : {}\" class=md-3-line> <img class=md-avatar style=\"width: 32px; height: 30px\" ng-src={{pobject.logo}}> <div class=md-list-item-text layout=column> <h3>{{pobject.title}}</h3> <h4>{{pobject.version}}</h4> <p>{{pobject.description}}</p> </div> <md-divider md-inset></md-divider> </md-list-item> </md-list> </md-content> <div id=extra-config> <md-input-container> <label translate=\"\">Load Type</label> <md-select ng-change=ctrl.setLoadType(ctrl.loadType) ng-model=ctrl.loadType> <md-option translate=\"\">None</md-option> <md-option ng-value=\"'before'\" translate=\"\">Before Page Load</md-option> <md-option ng-value=\"'lazy'\" translate=\"\">Lazy Load</md-option> <md-option ng-value=\"'after'\" translate=\"\">After Page Load</md-option> </md-select> </md-input-container> </div> </div>"
  );


  $templateCache.put('views/resources/mb-module-manual.html',
    "<md-content layout=column layout-padding flex> <md-input-container class=\"md-icon-float md-icon-right md-block\" required> <label translate>Title</label> <input ng-model=module.title> </md-input-container> <md-input-container class=\"md-icon-float md-icon-right md-block\" required> <label translate>URL</label> <input ng-model=module.url required> </md-input-container> <md-input-container class=\"md-icon-float md-icon-right md-block\" required> <label translate>Type</label> <input ng-model=module.type required placeholder=\"js, css\"> </md-input-container> <md-input-container class=md-block> <label>Load type</label> <md-select ng-model=module.load> <md-option translate=\"\">None</md-option> <md-option ng-value=\"'before'\" translate=\"\">Before Page Load</md-option> <md-option ng-value=\"'lazy'\" translate=\"\">Lazy Load</md-option> <md-option ng-value=\"'after'\" translate=\"\">After Page Load</md-option> </md-select> </md-input-container> </md-content>"
  );


  $templateCache.put('views/resources/mb-roles.html',
    "<div ng-controller=\"MbSeenUserRolesCtrl as ctrl\" mb-preloading=\"ctrl.state === 'busy'\" layout=column flex> <mb-pagination-bar mb-model=ctrl.queryParameter mb-properties=ctrl.properties mb-reload=ctrl.reload() mb-more-actions=ctrl.getActions()> </mb-pagination-bar> <md-content mb-infinate-scroll=ctrl.loadNextPage() layout=column flex> <md-list flex> <md-list-item ng-repeat=\"role in ctrl.items track by role.id\" ng-click=\"multi || resourceCtrl.selectRole(role)\" class=md-3-line> <wb-icon>accessibility</wb-icon> <div class=md-list-item-text layout=column> <h3>{{role.name}}</h3> <p>{{role.description}}</p> </div> <md-checkbox class=md-secondary ng-init=\"role.selected = resourceCtrl.isSelected(role)\" ng-model=role.selected ng-click=\"resourceCtrl.setSelected(role, role.selected)\"> </md-checkbox> <md-divider md-inset></md-divider> </md-list-item> </md-list> </md-content> </div>"
  );


  $templateCache.put('views/resources/mb-sidenav.html',
    ""
  );


  $templateCache.put('views/resources/mb-term-taxonomies.html',
    "<div ng-controller=\"MbSeenCmsTermTaxonomiesCtrl as ctrl\" ng-init=\"ctrl.setDataQuery('{id, taxonomy, term{id, name, metas{key,value}}}')\" mb-preloading=\"ctrl.state === 'busy'\" layout=column flex> <mb-pagination-bar mb-model=ctrl.queryParameter mb-properties=ctrl.properties mb-reload=ctrl.reload() mb-more-actions=ctrl.getActions()> </mb-pagination-bar> <md-content mb-infinate-scroll=ctrl.loadNextPage() layout=column flex> <md-list flex> <md-list-item ng-repeat=\"termTaxonomy in ctrl.items track by termTaxonomy.id\" ng-click=\"multi || resourceCtrl.selectRole(termTaxonomy)\" class=md-3-line> <wb-icon>label</wb-icon> <div class=md-list-item-text layout=column> <h3>{{termTaxonomy.term.name}}</h3> <p>{{termTaxonomy.description}}</p> <p>{{termTaxonomy.taxonomy}}</p> </div> <md-checkbox class=md-secondary ng-init=\"termTaxonomy.selected = resourceCtrl.isSelected(termTaxonomy)\" ng-model=termTaxonomy.selected ng-click=\"resourceCtrl.setSelected(termTaxonomy, termTaxonomy.selected)\"> </md-checkbox> <md-divider md-inset></md-divider> </md-list-item> </md-list> </md-content> </div>"
  );


  $templateCache.put('views/resources/wb-event-code-editor.html',
    "<div layout=column layout-fill> <md-toolbar> <div class=md-toolbar-tools layout=row> <span flex></span> <md-select ng-model=value.language ng-change=ctrl.setLanguage(value.language) class=md-no-underline> <md-option ng-repeat=\"l in value.languages track by $index\" ng-value=l.value> {{l.text}} </md-option> </md-select> </div> </md-toolbar> <md-content flex> <div style=\"min-height: 100%; min-width: 100%\" index=0 id=am-wb-resources-script-editor> </div> </md-content> </div>"
  );


  $templateCache.put('views/resources/wb-url.html',
    "<div layout=column layout-padding flex> <p translate>Insert a valid URL, please.</p> <md-input-container class=\"md-icon-float md-block\"> <label translate>URL</label> <input ng-model=value> </md-input-container> </div>"
  );


  $templateCache.put('views/sidenavs/mb-help.html',
    "<md-toolbar class=md-hue-1 layout=column layout-align=center> <div layout=row layout-align=\"start center\"> <md-button class=md-icon-button aria-label=Close ng-click=closeHelp()> <wb-icon>close</wb-icon> </md-button> <span flex></span> <h4 translate>Help</h4> </div> </md-toolbar> <md-content mb-preloading=helpLoading layout-padding flex> <wb-group ng-model=helpContent> </wb-group> </md-content>"
  );


  $templateCache.put('views/sidenavs/mb-messages.html',
    "<div mb-preloading=\"ctrl.state === 'busy'\" layout=column flex>  <mb-pagination-bar mb-title=Messages mb-model=ctrl.queryParameter mb-reload=ctrl.reload() mb-sort-keys=ctrl.getSortKeys() mb-more-actions=ctrl.getMoreActions()> </mb-pagination-bar> <md-content mb-infinate-scroll=ctrl.loadNextPage() layout=column flex> <md-list flex> <md-list-item ng-repeat=\"message in ctrl.items track by message.id\" class=md-3-line> <wb-icon ng-class=\"\">mail</wb-icon> <div class=md-list-item-text> <p>{{::message.message}}</p> </div> <md-button class=\"md-secondary md-icon-button\" ng-click=ctrl.deleteItem(message) aria-label=remove> <wb-icon>delete</wb-icon> </md-button> <md-divider md-inset></md-divider> </md-list-item> </md-list> </md-content> </div>"
  );


  $templateCache.put('views/sidenavs/mb-navigator.html',
    "<md-toolbar class=\"md-whiteframe-z2 mb-navigation-top-toolbar\" layout=column layout-align=\"start center\"> <img width=128px height=128px ng-show=app.config.logo ng-src={{app.config.logo}} style=\"min-height: 128px; min-width: 128px\"> <strong>{{app.config.title}}</strong> <p style=\"text-align: center\">{{ app.config.description | limitTo: 100 }}{{app.config.description.length > 150 ? '...' : ''}}</p> </md-toolbar> <md-content class=mb-sidenav-main-menu md-colors=\"{backgroundColor: 'primary'}\" flex> <mb-tree mb-section=menuItems> </mb-tree> </md-content>"
  );


  $templateCache.put('views/sidenavs/mb-options.html',
    " <mb-user-toolbar mb-actions=userActions> </mb-user-toolbar>  <md-content layout-padding> <mb-dynamic-tabs mb-tabs=tabs> </mb-dynamic-tabs> </md-content>"
  );


  $templateCache.put('views/toolbars/mb-dashboard.html',
    "<div layout=row layout-align=\"start center\" itemscope itemtype=http://schema.org/WPHeader> <md-button class=md-icon-button hide-gt-sm ng-click=toggleNavigationSidenav() aria-label=Menu> <wb-icon>menu</wb-icon> </md-button> <img hide-gt-sm height=32px ng-if=app.config.logo ng-src=\"{{app.config.logo}}\"> <strong hide-gt-sm style=\"padding: 0px 8px 0px 8px\"> {{app.config.title}} </strong> <mb-navigation-bar hide show-gt-sm ng-show=\"app.setting.navigationPath !== false\"> </mb-navigation-bar> </div> <div layout=row layout-align=\"end center\">  <md-button ng-repeat=\"menu in scopeMenu.items | orderBy:['-priority']\" ng-show=menu.visible() ng-href={{menu.url}} ng-click=menu.exec($event); class=md-icon-button> <md-tooltip ng-if=menu.tooltip md-delay=1500>{{menu.description}}</md-tooltip> <wb-icon ng-if=menu.icon>{{menu.icon}}</wb-icon> </md-button> <md-divider ng-if=scopeMenu.items.length></md-divider> <md-button ng-repeat=\"menu in toolbarMenu.items | orderBy:['-priority']\" ng-show=menu.visible() ng-href={{menu.url}} ng-click=menu.exec($event); class=md-icon-button> <md-tooltip ng-if=\"menu.tooltip || menu.description\" md-delay=1500>{{menu.description | translate}}</md-tooltip> <wb-icon ng-if=menu.icon>{{menu.icon}}</wb-icon> </md-button> <md-button ng-show=messageCount ng-click=toggleMessageSidenav() style=\"overflow: visible\" class=md-icon-button> <md-tooltip md-delay=1500> <span translate=\"\">Display list of messages</span> </md-tooltip> <wb-icon mb-badge={{messageCount}} mb-badge-fill=accent>notifications</wb-icon> </md-button> <mb-user-menu></mb-user-menu> <md-button ng-repeat=\"menu in userMenu.items | orderBy:['-priority']\" ng-show=menu.visible() ng-click=menu.exec($event) class=md-icon-button> <md-tooltip ng-if=menu.tooltip md-delay=1500>{{menu.tooltip}}</md-tooltip> <wb-icon ng-if=menu.icon>{{menu.icon}}</wb-icon> </md-button> </div>"
  );


  $templateCache.put('views/users/mb-account.html',
    "<md-content mb-preloading=ctrl.loadingUser class=md-padding layout-padding flex> <div layout-gt=row>  <mb-titled-block mb-title=Account mb-progress=ctrl.avatarLoading flex-gt-sm=50> <div layout=column> <md-input-container> <label translate>ID</label> <input ng-model=ctrl.user.id disabled> </md-input-container> <md-input-container> <label translate>Username</label> <input ng-model=ctrl.user.login disabled> </md-input-container> <md-input-container> <label translate>Email</label> <input ng-model=ctrl.user.email type=email disabled> </md-input-container> </div> </mb-titled-block> </div> </md-content>"
  );


  $templateCache.put('views/users/mb-forgot-password.html',
    " <md-content layout=row layout-align=none layout-align-gt-sm=\"center center\" flex> <div md-whiteframe=3 style=\"max-height: none\" flex=100 flex-gt-sm=50 layout=column>  <ng-include src=\"'views/partials/mb-branding-header-toolbar.html'\"></ng-include> <md-progress-linear ng-disabled=!ctrl.sendingToken style=\"margin: 0px; padding: 0px\" md-mode=indeterminate class=md-primary md-color> </md-progress-linear>  <div layout-margin> <h3 translate>recover password</h3> <p translate>recover password description</p> </div> <div style=\"text-align: center\" layout-margin ng-show=!ctrl.sendingToken> <span ng-show=\"ctrl.sendTokenState === 'fail'\" md-colors=\"{color:'warn'}\" translate>Failed to send token.</span> <span ng-show=\"ctrl.sendTokenState === 'success'\" md-colors=\"{color:'primary'}\" translate>Token is sent.</span> </div> <form name=ctrl.myForm ng-submit=sendToken(credit) layout=column layout-margin> <md-input-container> <label translate>Username</label> <input ng-model=credit.login name=username> </md-input-container> <md-input-container> <label translate>Email</label> <input ng-model=credit.email name=email type=email> <div ng-messages=ctrl.myForm.email.$error> <div ng-message=email translate>Email is not valid.</div> </div> </md-input-container>     <div ng-if=\"app.captcha.engine==='recaptcha'\" vc-recaptcha ng-model=credit.g_recaptcha_response theme=\"app.captcha.theme || 'light'\" type=\"app.captcha.type || 'image'\" key=app.captcha.recaptcha.key lang=\"app.captcha.language || 'fa'\"> </div> <input hide type=\"submit\"> </form> <div layout=column layout-align=\"center none\" layout-gt-xs=row layout-align-gt-xs=\"end center\" layout-margin> <md-button ng-disabled=\"(credit.email === undefined && credit.login === undefined) || ctrl.myForm.$invalid\" flex-order=0 flex-order-gt-xs=1 class=\"md-primary md-raised\" ng-click=sendToken(credit)>{{'send recover message' | translate}}</md-button>     <md-button ng-click=cancel() flex-order=0 flex-order-gt-xs=0 class=md-raised> {{'cancel' | translate}} </md-button> </div> </div> </md-content>"
  );


  $templateCache.put('views/users/mb-login.html',
    " <md-content layout=row layout-align=none layout-align-gt-sm=\"center center\" flex> <div md-whiteframe=3 style=\"max-height: none\" flex=100 flex-gt-sm=50 layout=column>  <ng-include src=\"'views/partials/mb-branding-header-toolbar.html'\"></ng-include> <md-progress-linear ng-disabled=\"!(ctrl.loginProcess || ctrl.logoutProcess)\" style=\"margin: 0px; padding: 0px\" md-mode=indeterminate class=md-primary md-color> </md-progress-linear>  <div style=\"text-align: center\" layout-margin ng-show=\"!ctrl.loginProcess && ctrl.loginState === 'fail'\"> <p><span md-colors=\"{color:'warn'}\" translate>{{loginMessage}}</span></p> </div> <form ng-show=app.user.anonymous name=ctrl.myForm ng-submit=ctrl.login(credit) layout=column layout-margin> <md-input-container> <label translate=\"\">Username</label> <input ng-model=credit.login name=username required> <div ng-messages=ctrl.myForm.username.$error> <div ng-message=required translate=\"\">This field is required.</div> </div> </md-input-container> <md-input-container> <label translate=\"\">Password</label> <input ng-model=credit.password type=password name=password required> <div ng-messages=ctrl.myForm.password.$error> <div ng-message=required translate>This field is required.</div> </div> </md-input-container>  <div vc-recaptcha ng-if=\"__tenant.settings['captcha.engine'] === 'recaptcha'\" key=\"__tenant.settings['captcha.engine.recaptcha.key']\" ng-model=credit.g_recaptcha_response theme=\"__app.configs.captcha.theme || 'light'\" type=\"__app.configs.captcha.type || 'image'\" lang=\"__app.setting.local || __app.config.local || 'en'\"> </div> <input hide type=\"submit\"> <div layout=column layout-align=\"center none\" layout-gt-xs=row layout-align-gt-xs=\"end center\" layout-margin> <a href=users/reset-password style=\"text-decoration: none\" ui-sref=forget flex-order=1 flex-order-gt-xs=-1> <span translate>Forgot your password?</span> </a> <md-button ng-disabled=ctrl.myForm.$invalid flex-order=-1 flex-order-gt-xs=1 class=\"md-primary md-raised\" ng-click=\"ctrl.login(credit, ctrl.myForm)\"> <span translate>Login</span> </md-button></div> </form> <div layout-margin ng-show=!app.user.anonymous layout=column layout-align=\"none center\"> <img width=150px height=150px ng-show=!uploadAvatar ng-src=\"{{app.user.current.avatar}}\"> <h3>{{app.user.current.login}}</h3> <p translate>you are logged in. go to one of the following options.</p> </div> <div ng-show=!app.user.anonymous layout=column layout-align=none layout-gt-xs=row layout-align-gt-xs=\"center center\" layout-margin> <md-button ng-click=ctrl.cancel() flex-order=0 flex-order-gt-xs=0 class=md-raised> <wb-icon>settings_backup_restore</wb-icon> <span translate>Back</span> </md-button> <md-button ng-href=users/account flex-order=1 flex-order-gt-xs=-1 class=md-raised> <wb-icon>account_circle</wb-icon> <span translate>Account</span> </md-button> </div> </div> </md-content>"
  );


  $templateCache.put('views/users/mb-password.html',
    "<md-content class=md-padding layout-padding flex>  <mb-titled-block mb-title=\"Change password\" mb-progress=ctrl.changingPassword flex-gt-sm=50> <p translate>Insert current password and new password to change it.</p> <form name=ctrl.passForm ng-submit=\"ctrl.changePassword(data, ctrl.passForm)\" layout=column layout-padding> <input hide type=\"submit\"> <div style=\"text-align: center\" layout-margin ng-show=\"!ctrl.changingPassword && changePassMessage\"> <p><span md-colors=\"{color:'warn'}\" translate>{{changePassMessage}}</span></p> </div> <md-input-container layout-fill> <label translate>current password</label> <input name=oldPass ng-model=data.oldPass type=password required> <div ng-messages=ctrl.passForm.oldPass.$error> <div ng-message=required translate>This field is required.</div> </div> </md-input-container> <md-input-container layout-fill> <label translate>new password</label> <input name=newPass ng-model=data.newPass type=password required> <div ng-messages=ctrl.passForm.newPass.$error> <div ng-message=required translate>This field is required.</div> </div> </md-input-container> <md-input-container layout-fill> <label translate>repeat new password</label> <input name=newPass2 ng-model=newPass2 type=password compare-to=data.newPass required> <div ng-messages=ctrl.passForm.newPass2.$error> <div ng-message=required translate>This field is required.</div> <div ng-message=compareTo translate>password is not match.</div> </div> </md-input-container> <div layout=column layout-align=\"center none\" layout-gt-xs=row layout-align-gt-xs=\"end center\"> <md-button class=\"md-raised md-primary\" ng-click=\"ctrl.changePassword(data, ctrl.passForm)\" ng-disabled=ctrl.passForm.$invalid> <span translate>Change password</span> </md-button> </div> </form> </mb-titled-block>  </md-content>"
  );


  $templateCache.put('views/users/mb-profile.html',
    "<div layout-gt-sm=row layout=column style=\"width: 100%; height: fit-content\">  <mb-titled-block flex-gt-sm=50 mb-title=Avatar mb-progress=ctrl.avatarLoading layout=column style=\"margin: 8px\"> <div flex layout=column layout-fill> <div layout=row style=\"flex-grow: 1; min-height: 100px\" layout-align=\"center center\"> <lf-ng-md-file-input style=\"flex-grow: 1; padding: 10px\" ng-show=\"ctrl.avatarState === 'edit'\" lf-files=ctrl.avatarFiles accept=image/* progress preview drag> </lf-ng-md-file-input> <img style=\"max-width: 300px; max-height: 300px; min-width: 24px; min-height: 24px\" ng-if=\"ctrl.avatarState === 'normal'\" ng-src=/api/v2/user/accounts/{{ctrl.user.id}}/avatar ng-src-error=\"https://www.gravatar.com/avatar/{{app.user.current.id|wbmd5}}?d=identicon&size=32\"> </div> <div style=\"flex-grow:0; min-height: 40px\"> <div layout=column layout-align=\"center none\" style=\"flex-grow: 0\" layout-gt-xs=row layout-align-gt-xs=\"end center\" ng-if=\"ctrl.avatarState === 'normal'\"> <md-button class=\"md-raised md-primary\" ng-click=ctrl.editAvatar()> <sapn translate=\"\">Edit</sapn> </md-button> <md-button class=\"md-raised md-accent\" ng-click=ctrl.deleteAvatar()> <sapn translate=\"\">Delete</sapn> </md-button> </div> <div style=\"flex-grow: 0\" layout=column layout-align=\"center none\" layout-gt-xs=row layout-align-gt-xs=\"end center\" ng-if=\"ctrl.avatarState === 'edit'\"> <md-button class=\"md-raised md-primary\" ng-click=ctrl.uploadAvatar(ctrl.avatarFiles)> <sapn translate=\"\">Save</sapn> </md-button> <md-button class=\"md-raised md-accent\" ng-click=ctrl.cancelEditAvatar()> <sapn translate=\"\">Cancel</sapn> </md-button> </div> </div> </div> </mb-titled-block>  <mb-titled-block flex-gt-sm=50 mb-title=\"Public Information\" mb-progress=\"ctrl.loadingProfile || ctrl.savingProfile\" layout=column style=\"margin: 8px\"> <form name=contactForm layout=column layout-padding> <md-input-container layout-fill> <label translate=\"\">First Name</label> <input ng-model=ctrl.profile.first_name> </md-input-container> <md-input-container layout-fill> <label translate=\"\">Last Name</label> <input ng-model=ctrl.profile.last_name> </md-input-container> <md-input-container layout-fill> <label translate=\"\">Public Email</label> <input name=email ng-model=ctrl.profile.public_email type=email> </md-input-container> <md-input-container layout-fill> <label translate=\"\">Language</label> <input ng-model=ctrl.profile.language> </md-input-container> <md-input-container layout-fill> <label translate=\"\">Timezone</label> <input ng-model=ctrl.profile.timezone> </md-input-container> </form> <div layout=column layout-align=\"center none\" layout-gt-xs=row layout-align-gt-xs=\"end center\"> <md-button class=\"md-raised md-primary\" ng-click=save()> <sapn translate=\"\">Update</sapn> </md-button> </div> </mb-titled-block> </div>"
  );


  $templateCache.put('views/users/mb-recover-password.html',
    " <md-content layout=row layout-align=none layout-align-gt-sm=\"center center\" flex> <div md-whiteframe=3 style=\"max-height: none\" flex=100 flex-gt-sm=50 layout=column>  <ng-include src=\"'views/partials/mb-branding-header-toolbar.html'\"></ng-include> <md-progress-linear ng-disabled=!ctrl.changingPass style=\"margin: 0px; padding: 0px\" md-mode=indeterminate class=md-primary md-color> </md-progress-linear>  <div layout-margin> <h3 translate>reset password</h3> <p translate>reset password description</p> </div> <div style=\"text-align: center\" layout-margin ng-show=!ctrl.changingPass> <span ng-show=\"ctrl.changePassState === 'fail'\" md-colors=\"{color:'warn'}\" translate>Failed to reset password.</span> <span ng-show=\"ctrl.changePassState === 'fail'\" md-colors=\"{color:'warn'}\" translate>{{$scope.changePassMessage}}</span> <span ng-show=\"ctrl.changePassState === 'success'\" md-colors=\"{color:'primary'}\" translate>Password is reset.</span> </div> <form name=ctrl.myForm ng-submit=changePassword(data) layout=column layout-margin> <md-input-container> <label translate>Token</label> <input ng-model=data.token name=token required> <div ng-messages=ctrl.myForm.token.$error> <div ng-message=required translate>This field is required.</div> </div> </md-input-container> <md-input-container> <label translate>New password</label> <input ng-model=data.password name=password type=password required> <div ng-messages=ctrl.myForm.password.$error> <div ng-message=required translate>This field is required.</div> </div> </md-input-container> <md-input-container> <label translate>Repeat new password</label> <input name=password2 ng-model=repeatPassword type=password compare-to=data.password required> <div ng-messages=ctrl.myForm.password2.$error> <div ng-message=required translate>This field is required.</div> <div ng-message=compareTo translate>Passwords is not match.</div> </div> </md-input-container> <input hide type=\"submit\"> </form> <div layout=column layout-align=\"center none\" layout-gt-xs=row layout-align-gt-xs=\"end center\"> <md-button ng-disabled=ctrl.myForm.$invalid flex-order=0 flex-order-gt-xs=1 class=\"md-primary md-raised\" ng-click=changePassword(data)>{{'change password' | translate}}</md-button>     <md-button ng-click=cancel() flex-order=0 flex-order-gt-xs=0 class=md-raised> {{'cancel' | translate}} </md-button> </div> </div> </md-content>"
  );

}]);
