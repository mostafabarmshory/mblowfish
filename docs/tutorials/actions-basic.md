

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