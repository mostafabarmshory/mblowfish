# Material Blowfish

- Toolbars
- Sidenavs
- Actions
- Settings
- Preferences
- Pages (ngRoute)


## Toolbars

Each application using mblowfish could defines its own toolbars.

<code>

	$app.newToolbar({
		id: 'my-toolbar',
		templateUrl: 'views/my-toolbar.html',
		controller: 'MyToolbarCtrl',
		visible: function(){
			return ...;
		},
		raw: true // determines DOM element of this toolbar is a toolbar itself and should not be wrapped to toolbar
	});
	
</code>

Beside that, toolbars with following IDs are defined by default:

- dashboard

Toolbars will not show automatically.
To show one or more toolbar in all pages add it as default toolbars:

<code>

	$app.setDefaultToolbars(['dashboard', 'my-toolbar']);
	
</code

To show one or more toolbars in a page (path) add them to list of toolbars of that 
page while define page to ngRoute.

Note: Defining list of toolbars for a page overrides list of default toolbars for that page.


## Sidenavs

Each application using mblowfish could defines its own sidenavs.

<code>

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
	
</code>

Beside that, sidenavs with following IDs are defined by default:

- navigator (Optional)
- help (Auto loaded)
- setting (Auto loaded)

To show a sidenav in a page you should:

- add sidenav to your page.
- determine a mechanism to toggle sidenav (if your sidenav is 'locked: true' it will be shown automatically always).

### add sidenav to pages

To add one or more sidenav in all pages add it as default sidenavs:

<code>

	$app.setDefaultSidenavs(<array of id of your sidenavs>);
	
</code

To add one or more sidenavs in a page (path) add them to list of sidenavs of that 
page while define page to ngRoute.

Note: Defining list of sidenavs for a page overrides list of default sidenavs for that page.

Note: Sidenavs 'halp' and 'setting' are added automatically to all pages and could not be overrided.

### show/hide sidenav

To show/hide a sidenav it is sufficient to give id of that sidenav:

<code>

	$mdSidenav(<id of sidenave>).toggle();

</code>

Note: Sidenavs 'help' and 'setting' are defined and added automatically to all pages.
So following codes are valid in controller of all pages:

<code>

	$mdSidenav('help').toggle();
	$mdSidenav('setting').toggle();

</code>

## Menu

- user.current
- app




