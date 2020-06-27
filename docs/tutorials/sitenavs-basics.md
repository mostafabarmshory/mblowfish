

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