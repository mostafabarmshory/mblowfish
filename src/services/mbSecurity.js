/**
@ngdoc Services
@name $mbSecurity



 */
//--------------------------------------------------------
// Services
//--------------------------------------------------------
var provider;
var service;

var rootScope;



//--------------------------------------------------------
// varialbes
//--------------------------------------------------------


//--------------------------------------------------------
// Functions
//--------------------------------------------------------

/**
Evaluate an security expression
 */
function evaluate(expression, scope) {
	expression = expression || 'permitAll';
	scope = scope || rootScope;
	return scope.$eval(expression, {
		permitAll: true,
		denyAll: false,
	});
}

//--------------------------------------------------------
// End
//--------------------------------------------------------
service = {
	evaluate: evaluate
};

provider = {
	$get: function($rootScope) {
		'ngInject';
		rootScope = $rootScope;
		return service;
	}
};


export default function() {
	return provider;
}



