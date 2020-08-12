## Variable replacement

Using $mbTranslate service, translate filter and translate directive is pretty neat! But what if your translations need variable values? Say you want to display a notification message with a text like 'You've received n mails', where _n_ is a placeholder for a variable value which could be any number?

Bringing variable values to translations using default interpolation services is pretty straight forward. Yeap you read it right. It depends on the used interpolation service, how variable values are managed within translations.

## Using variable values within translations

When using default interpolation service, you can simply rely on interpolation service syntax. So, to define a variable value within a translation, all you have to do is to use Angular's interpolate directive.

	{
	  "TRANSLATION_ID": "{{username}} is logged in."
	}

Whereas username is the identifier which you can pass a variable value through. So how is it possible to get these variable values passed through the components translate provides?

## Variable replacement in $mbTranslate service

You can pass variable values through $mbTranslate service by using its second argument. $mbTranslate service expects a JavaScript object hash as second argument which is used to interpolate translations against. So if we have a translation id like described above, passing a value for username would work as following:

	$mbTranslate('TRANSLATION_ID', { username: 'PascalPrecht' });

If there's a translation ID containing more variable values, simply extend the passed object hash with corresponding key-value pairs.

	$mbTranslate('TRANSLATION_ID', {
	  username: 'PascalPrecht',
	  lastLogin: '2013-07-21 6:50PM'
	});

## Variable replacement in translate filter

Since translate filter uses $mbTranslate service internally, we just need a way to pass dynamic values through the filter to make it available as object hash for the service. To achieve this, there is a specific syntax required, because filters in Angular are currently not able to have named parameters. So there are two ways to pass values through translate filter.

The first way is to pass an object literal as string. Afterwards it gets interpolated by $mbTranslate service.

	{{ 'TRANSLATION_ID' | translate:'{ username: "PascalPrecht" }' }}

Not that hard right? But what if username should not have a constant value and also has to be interpolated before getting passed? The only way to get this done is to pass a scope object as Angular expression through the filter. Which also means, you have to bind your variable values for the translations in the controller which exposes the values on the scope.

	mblowfish.controller('Ctrl', function ($scope) {
	  $scope.translationData = {
	    username: 'PascalPrecht'
	  };
	});

And then pass it as expression through the filter:

	{{ 'TRANSLATION_ID' | translate:translationData }}

## Variable replacement in translate directive

Of course, you can make the same possible with translate directive. translate directive expects an optional translate-values attribute you can use to pass some values through it. All you have to do is to combine the directive with the translate-values attribute.

You can pass either an object literal as string, expression, or, if the value is dynamic, an interpolation directive. Whatever you pass in, it gets internally evaluated and parsed by translate filter, so what comes out is a plain old JavaScript object which gets passed to $mbTranslate service.

	<ANY translate="TRANSLATION_ID"
	     translate-values='{ username: "PascalPrect"}'></ANY>

or

	<ANY translate="TRANSLATION_ID"
	     translate-values="{ username: someScopeObject.username }"></ANY>

or

	<ANY translate="TRANSLATION_ID"
	     translate-values="{{translationData}}"></ANY>

##Custom translate value attributes

The translate directive comes with another neat feature to pass values into your translations. We just learned how to use the translate-values attribute, which is nice, but what if we could in some cases be a bit more declarative in our code. What if we only want to pass in one or two values but declare these explicitly in our HTML?

{
  "GREETING": "Hi, my name is {{name}}"
}

And we wanna translate it with the awesome translate directive. We can do this, but this time, we use a custom translate-value-* attribute to get the value into our translation. So here's how it works:

	<p translate="GREETING" translate-value-name="Pascal"></p>

All you have to do is to use the translate-value- prefix and add the name of the identifier of the interpolate directive within your translation (in this case name).

Oh sure, you can use them with interpolated values too:

	<p translate="GREETING" translate-value-name="{{name}}"></p>

If that isn't a cool feature, I'm sold.

Awesome! We can now replace variable values within our translations! Let's update our example app. We extend the translation table like this:

	var translations = {
	  HEADLINE: 'What an awesome module!',
	  PARAGRAPH: 'Srsly!',
	  PASSED_AS_TEXT: 'Hey there! I\'m passed as text value!',
	  PASSED_AS_ATTRIBUTE: 'I\'m passed as attribute value, cool ha?',
	  PASSED_AS_INTERPOLATION: 'Beginners! I\'m interpolated!',
	  VARIABLE_REPLACEMENT: 'Hi, {{name}}'
	};

Next, we pass a name through a translate directive:

	<p
		translate="VARIABLE_REPLACEMENT" 
		translate-values="{ name: 'PascalPrecht' }"></p>
