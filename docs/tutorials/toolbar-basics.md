

## Toolbars

Each application using mblowfish could defines its own toolbars.

```javascript
	mblowfish.toolbar('myToolbar', {
		templateUrl: 'views/my-toolbar.html',
		controller: 'MyToolbarCtrl',
		visible: function(){
			return ...;
		},
		raw: true
	});
```

Toolbars will not show automatically.
To show one or more toolbar in all pages add it as default toolbars:

```javascript
	$app.setDefaultToolbars(['dashboard', 'my-toolbar']);
```

To show one or more toolbars in a page (path) add them to list of toolbars of that 
page while define page to ngRoute.

Note: Defining list of toolbars for a page overrides list of default toolbars for that page.
