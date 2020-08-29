# Expression-Based Access Control

Spring introduces Expression Based Access Controles which is a great idea to handle access in the server. However, on the client-side, access control helps UX to be simple and clear. By access control on the client-side, no more invalid request will send to the server.

MBlowfish introduced the ability to use expressions as an authorization mechanism in addition to the simple use of $mbAccount service and access-decision voters. Expression-based access control is built on the same architecture but allows complicated boolean logic to be encapsulated in a single expression.

## Overview

Mblowfish Security uses AngularJS for expression support and you should look at how that works if you are interested in understanding the topic in more depth. Expressions are evaluated with a “rootScope” as part of the evaluation context. MBlowfish Security uses specific classes for view and UI security as the rootScope, to provide built-in expressions and access to values such as the current principal.

### Common Built-In Expressions

The base class for expression root objects is $mbAccount service. This provides some common expressions which are available in both Routing and UI security.

| Expression                    | Description                                                                                  |
|-------------------------------|----------------------------------------------------------------------------------------------|
| hasRole([role])               | Returns true if the current principal has the specified role.                                |
| hasAnyRole([role1,role2])     | Returns true if the current principal has any of the supplied roles                          |
| principal                     | Allows direct access to the principal object representing the current user                   |
| authentication                | Allows direct access to the current Authentication object obtained from the Account Provider |
| permitAll                     | Always evaluates to true                                                                     |
| denyAll                       | Always evaluates to false                                                                    |
| isAnonymous()                 | Returns true if the current principal is an anonymous user                                   |
| isRememberMe()                | Returns true if the current principal is a remember-me user                                  |
| isAuthenticated()             | Returns true if the user is not anonymous                                                    |
| isFullyAuthenticated()        | Returns true if the user is not an anonymous or a remember-me user                           |

## Frame Security Expressions

To use expressions to secure individual URLs, you would first need to set the use-expressions attribute in the $mbAccountProvider to true. MBlowfish Security will then expect the access attributes of the frame elements to contain security expressions. The expressions should evaluate to a boolean, defining whether access should be allowed or not. For example:

	$mbAccountProvider
		.setUseExpression(true);

Enables the security expressions. And 

	$mblowfish.view('/user/accounts',{
		...
		access: 'hasRole("admin") && hasIpAddress("192.168.1.0/24")',
		...
	});
 
Here we have defined that the “admin” area of an application (defined by the URL pattern) should only be available to users who have the granted authority “admin” and whose IP address matches a local subnet. We've already seen the built-in hasRole expression in the previous section. The expression hasIpAddress is an additional built-in expression which is specific to security.


## Actions Security Expression

Action security is a bit more complicated than a simple allow or deny rule. MBlowfish Security introduced some new attributes in order to allow comprehensive support for the use of expressions.

### Pre and Post Attributes

There are four attribute which support expression attributes to allow pre and post-invocation authorization checks and also to support filtering of submitted collection arguments or return values. They are preAuthorize, preFilter, postAuthorize and postFilter. Their use is enabled through the $mbActionsProvider:

	$mbActionsProvider
		.setEnablePrePostAttributes(true)

The most obviously useful attribute is preAuthorize which decides whether an action can actually be invoked or not. For example (from the “Contacts” sample application)

	mblowfish.addAction('cms.content.new', {
		...
		preAuthorize: 'hasRole("cms.author")',
		...
	}

which means that access will only be allowed for users with the role "cms.author". Obviously the same thing could easily be achieved using a configuration and a simple configuration attribute for the required role. But what about:


	mblowfish.addAction('user.profile.save', {
		...
		preAuthorize: 'hasRole('admin') || authentication.id === $event.values[0].accountId',
		...
	})

Here we're actually using a editor argument as part of the expression to decide whether the current user has the “admin” permission for the given contact. The expression is linked into the MBlowfish Security module through the application context, as we'll see below. You can access any of the action arguments by name variables, provided your code has debug information compiled in. Any AngularJS functionality is available within the expression, so you can also access properties on the arguments. For example, if you wanted a particular frame to only allow access to a user whose username matched that of the contact, you could write


mblowfish.addAction('cms.content.new', {
	...
	preAuthorize: 'authentication.login === $event.values[0].contentName',
	...
})

Here we are accessing another built–in expression, authentication, which is the Authentication stored in the security context. You can also access its “principal” property directly, using the expression principal. The value will often be a UserDetails instance, so you might use an expression like principal.login or principal.active.

Less commonly, you may wish to perform an access-control check after the frame has been invoked. This can be achieved using the postAuthorize atribute. To access the return value from a method, use the built–in name $returnObject in the expression.

### Filtering using preFilter and postFilter

As you may already be aware, MBlowfish Security supports filtering of collections and arrays and this can now be achieved using expressions. This is most commonly performed on the return value of a method. For example:

	{
		preAuthorize: "hasRole('ROLE_USER')",
		postFilter: "hasPermission($filterObject, 'read') || hasPermission($filterObject, 'admin')",
	}
	
When using the postFilter attribute, MBlowfish Security iterates through the returned collection and removes any elements for which the supplied expression is false. The name $filterObject refers to the current object in the collection. You can also filter before the method call, using preFilter, though this is a less common requirement. The syntax is just the same, but if there is more than one argument which is a collection type then you have to select one by name using the filterTarget property of this annotation.

Note that filtering is obviously not a substitute for tuning your data retrieval queries. If you are filtering large collections and removing many of the entries then this is likely to be inefficient.


## Built-In Expressions

There are some built-in expressions which are specific to method security, which we have already seen in use above. The $filterTarget and $returnValue values are simple enough, but the use of the hasPermission() expression warrants a closer look.

### The Authentication Provider factory

It is intended to bridge between the expression system and MBlowfish Security's system, allowing you to specify authorization constraints on domain objects, based on abstract permissions. It has no explicit dependencies on the module, so you could swap that out for an alternative implementation if required. 

The interface has tree methods:

- support
- authenticate
- forget

#### Support

The core security service sends authentication to the interface to check if it is supported by the factory. 

#### Authenticate

The Mblowfish security use this function to login or check current user state.

#### Forget

Is used to logout and destroy current session or token.
