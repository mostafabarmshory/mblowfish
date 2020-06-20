# Expression-Based Access Control

Spring Security 3.0 introduced the ability to use Spring EL expressions as an authorization mechanism in addition to the simple use of configuration attributes and access-decision voters which have seen before. Expression-based access control is built on the same architecture but allows complicated boolean logic to be encapsulated in a single expression.

## Overview

Spring Security uses Spring EL for expression support and you should look at how that works if you are interested in understanding the topic in more depth. Expressions are evaluated with a “root object” as part of the evaluation context. Spring Security uses specific classes for web and method security as the root object, in order to provide built-in expressions and access to values such as the current principal.


### Common Built-In Expressions

The base class for expression root objects is SecurityExpressionRoot. This provides some common expressions which are available in both web and method security.



| Expression                    | Description                                                                                 |
|-------------------------------|---------------------------------------------------------------------------------------------|
| hasRole([role])               | Returns true if the current principal has the specified role.                               |
| hasAnyRole([role1,role2])     | Returns true if the current principal has any of the supplied roles                         |
| principal                     | Allows direct access to the principal object representing the current user                  |
| authentication                | Allows direct access to the current Authentication object obtained from the SecurityContext |
| permitAll                     | Always evaluates to true                                                                    |
| denyAll                       | Always evaluates to false                                                                   |
| isAnonymous()                 | Returns true if the current principal is an anonymous user                                  |
| isRememberMe()                | Returns true if the current principal is a remember-me user                                 |
| isAuthenticated()             | Returns true if the user is not anonymous                                                   |
| isFullyAuthenticated()        | Returns true if the user is not an anonymous or a remember-me user                          |

## UI Template Security Expressions

To use expressions to secure individual URLs, you would first need to set the use-expressions attribute in the <http> element to true. Spring Security will then expect the access attributes of the <intercept-url> elements to contain Spring EL expressions. The expressions should evaluate to a boolean, defining whether access should be allowed or not. For example:

	<http use-expressions="true">
	  <intercept-url pattern="/admin*"
	      access="hasRole('admin') and hasIpAddress('192.168.1.0/24')"/>
	  ...
	</http>
 
Here we have defined that the “admin” area of an application (defined by the URL pattern) should only be available to users who have the granted authority “admin” and whose IP address matches a local subnet. We've already seen the built-in hasRole expression in the previous section. The expression hasIpAddress is an additional built-in expression which is specific to web security. It is defined by the WebSecurityExpressionRoot class, an instance of which is used as the expression root object when evaluation web-access expressions. This object also directly exposed the HttpServletRequest object under the name request so you can invoke the request directly in an expression.

If expressions are being used, a WebExpressionVoter will be added to the AccessDecisionManager which is used by the namespace. So if you aren't using the namespace and want to use expressions, you will have to add one of these to your configuration.

## Frame Security Expressions

Method security is a bit more complicated than a simple allow or deny rule. Spring Security 3.0 introduced some new annotations in order to allow comprehensive support for the use of expressions.

### @Pre and @Post Annotations

There are four annotations which support expression attributes to allow pre and post-invocation authorization checks and also to support filtering of submitted collection arguments or return values. They are @PreAuthorize, @PreFilter, @PostAuthorize and @PostFilter. Their use is enabled through the global-method-security namespace element:

<global-method-security pre-post-annotations="enabled"/>
Access Control using @PreAuthorize and @PostAuthorize
The most obviously useful annotation is @PreAuthorize which decides whether a method can actually be invoked or not. For example (from the “Contacts” sample application)

  @PreAuthorize("hasRole('ROLE_USER')")
  public void create(Contact contact);
which means that access will only be allowed for users with the role "ROLE_USER". Obviously the same thing could easily be achieved using a traditional configuration and a simple configuration attribute for the required role. But what about:

  @PreAuthorize("hasPermission(#contact, 'admin')")
  public void deletePermission(Contact contact, Sid recipient, Permission permission);
Here we're actually using a method argument as part of the expression to decide whether the current user has the “admin”permission for the given contact. The built-in hasPermission() expression is linked into the Spring Security ACL module through the application context, as we'll see below. You can access any of the method arguments by name as expression variables, provided your code has debug information compiled in. Any Spring-EL functionality is available within the expression, so you can also access properties on the arguments. For example, if you wanted a particular method to only allow access to a user whose username matched that of the contact, you could write

  @PreAuthorize("#contact.name == authentication.name")
  public void doSomething(Contact contact);
Here we are accessing another built–in expression, authentication, which is the Authentication stored in the security context. You can also access its “principal” property directly, using the expression principal. The value will often be a UserDetails instance, so you might use an expression like principal.username or principal.enabled.

Less commonly, you may wish to perform an access-control check after the method has been invoked. This can be achieved using the @PostAuthorize annotation. To access the return value from a method, use the built–in name returnObject in the expression.

Filtering using @PreFilter and @PostFilter
As you may already be aware, Spring Security supports filtering of collections and arrays and this can now be achieved using expressions. This is most commonly performed on the return value of a method. For example:

  @PreAuthorize("hasRole('ROLE_USER')")
  @PostFilter("hasPermission(filterObject, 'read') or hasPermission(filterObject, 'admin')")
  public List<Contact> getAll();
When using the @PostFilter annotation, Spring Security iterates through the returned collection and removes any elements for which the supplied expression is false. The name filterObject refers to the current object in the collection. You can also filter before the method call, using @PreFilter, though this is a less common requirement. The syntax is just the same, but if there is more than one argument which is a collection type then you have to select one by name using the filterTarget property of this annotation.

Note that filtering is obviously not a substitute for tuning your data retrieval queries. If you are filtering large collections and removing many of the entries then this is likely to be inefficient.

## Built-In Expressions

There are some built-in expressions which are specific to method security, which we have already seen in use above. The filterTarget and returnValue values are simple enough, but the use of the hasPermission() expression warrants a closer look.

The PermissionEvaluator interface
hasPermission() expressions are delegated to an instance of PermissionEvaluator. It is intended to bridge between the expression system and Spring Security's ACL system, allowing you to specify authorization constraints on domain objects, based on abstract permissions. It has no explicit dependencies on the ACL module, so you could swap that out for an alternative implementation if required. The interface has two methods:

  boolean hasPermission(Authentication authentication, Object targetDomainObject, Object permission);

  boolean hasPermission(Authentication authentication, Serializable targetId, String targetType, Object permission);
which map directly to the available versions of the expression, with the exception that the first argument (the Authentication object) is not supplied. The first is used in situations where the domain object, to which access is being controlled, is already loaded. Then expression will return true if the current user has the given permission for that object. The second version is used in cases where the object is not loaded, but its identifier is known. An abstract “type” specifier for the domain object is also required, allowing the correct ACL permissions to be loaded. This has traditionally been the Java class of the object, but does not have to be as long as it is consistent with how the permissions are loaded.

To use hasPermission() expressions, you have to explicitly configure a PermissionEvaluator in your application context. This would look something like this:

  <security:global-method-security pre-post-annotations="enabled">
    <security:expression-handler ref="expressionHandler"/>
  </security:global-method-security>

  <bean id="expressionHandler"
      class="org.springframework.security.access.expression.method.DefaultMethodSecurityExpressionHandler">
        <property name="permissionEvaluator" ref="myPermissionEvaluator"/>
  </bean>
Where myPermissionEvaluator is the bean which implements PermissionEvaluator. Usually this will be the implementation from the ACL module which is called AclPermissionEvaluator. See the “Contacts” sample application configuration for more details.