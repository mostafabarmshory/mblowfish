# Material Blowfish

- Toolbars
- Sidenavs
- Actions
- Settings
- Preferences
- Pages (ngRoute)

- Services
- Filters
- Directives
- Factories


## Toolbars

Each application using mblowfish could defines its own toolbars.

```javascript
	$app.newToolbar({
		id: 'my-toolbar',
		templateUrl: 'views/my-toolbar.html',
		controller: 'MyToolbarCtrl',
		visible: function(){
			return ...;
		},
		raw: true // Optional. Determines DOM element of this toolbar is a toolbar itself and should not be wrapped to toolbar
	});
```

Beside that, toolbars with following IDs are defined by default:

- dashboard

Toolbars will not show automatically.
To show one or more toolbar in all pages add it as default toolbars:

```javascript
	$app.setDefaultToolbars(['dashboard', 'my-toolbar']);
```

To show one or more toolbars in a page (path) add them to list of toolbars of that 
page while define page to ngRoute.

Note: Defining list of toolbars for a page overrides list of default toolbars for that page.


## Sidenavs

Each application using mblowfish could defines its own sidenavs.

```javascript
	$app.newSidenav({
		id : 'my-sidenav',
		title : 'My Sidenav',
		description : 'Description for my sidenav',
		controller: 'MySidenavCtrl',
		templateUrl : 'views/my-sidenav.html',
		locked : false,
		visible: function(){
			return ...;
		},
		position : 'start', // valid values: 'start', 'end'
	});
```

Beside that, sidenavs with following IDs are defined by default:

- navigator (Optional)
- help (Auto loaded)
- setting (Auto loaded)

To show a sidenav in a page you should:

- add sidenav to your page.
- determine a mechanism to toggle sidenav (if your sidenav is 'locked: true' it will be shown automatically always).

### add sidenav to pages

To add one or more sidenav in all pages add it as default sidenavs:

```javascript
	$app.setDefaultSidenavs(<array of id of your sidenavs>);
```

To add one or more sidenavs in a page (path) add them to list of sidenavs of that 
page while define page to ngRoute.

Note: Defining list of sidenavs for a page overrides list of default sidenavs for that page.

Note: Sidenavs 'halp' and 'setting' are added automatically to all pages and could not be overrided.

### show/hide sidenav

To show/hide a sidenav it is sufficient to give id of that sidenav:

```javascript
	$mdSidenav(<id of sidenave>).toggle();
```

For sidenavs which 'locked' is true previous code does not work. This type of sidenavs always is shown.
If you want to hide such sidenav you should do some action such that 'visible' for that sidenav results in false value. 

Note: Sidenavs 'help' and 'setting' are defined and added automatically to all pages.
So following codes (to show/hide these sidenavs) are valid in controller of all pages:

```javascript
	// To toggle visibility of help sidenav
	$rootScope.showHelp = !$rootScope.showHelp;
	
	// To toggle visibility of setting sidenav
	$mdSidenav('setting').toggle();
```

## Actions

There is a simple mechanism to manage and organize different actions. Applications using mblowfish-core 
could define and add their own actions and organize them in different group. After, these actions and groups of actions could be accessed in difference places in application.

Service $actions is used to manage actions and action groups.

```javascript
	$actions.newAction({
		id: 'my-action',
		title: 'My Action',
		description: 'Description for action',
		type: 'action', // valid values: 'action', 'internal-link', 'link', 'divider'
		visible: function(){
			return ...;
		},
		enable: function(){
			return ...;
		},
		priority: 10, // Default value is 10
		groups: [], // list of action groups 
		scope: $scope, // if is set action will be removed when $scope is destroyed.
		accent: true, // Optional.
		primary: true // Optional. 
	});
```

Define action groups is as follow:

```javascript
	$actions.newGroup({
		id: 'my-action-group',
		title: 'My Action Group',
		description: 'Description for action group',
		priority: 10 // default value is 10
	});
```

## Settings

## Preferences

## Pages (ngRoute)

Different pages (or paths) could be defined as follow:

```javascript
	$routeProvider //
	.when('/my-path', {
		templateUrl : 'views/amh-content.html',
		controller : 'AmhContentCtrl',
		toolbars: [], // Optional. If set overrides default toolbars
		sidenavs: [], // Optional. If set overrides default sidenavs
		helpId: 'help-id', // Optional. This id will be used to find json document to show help about this page
	});
```


## Services

Here services defined in this module are described. 
Some of this services are in introduced in previous sections, such as $app and $action.

 - $app
 - $actions
 - $errorHandler
 - $export
 - $help
 - $navigator
 - $notification
 - $options
 - $preferences
 
 
## Filters

## Directives

## Factories

