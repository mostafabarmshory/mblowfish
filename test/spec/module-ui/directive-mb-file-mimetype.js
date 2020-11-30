describe('Directive mb-file-mimetype ', function() {
	var $rootScope;
	var $compile;
	var scope;

	// instantiate service
	beforeEach(function() {
		// init application
		module('mblowfish-core');
		inject(function(_$rootScope_, _$compile_) {
			$rootScope = _$rootScope_;
			$compile = _$compile_;
		});

		// int data
		scope = $rootScope.$new();
	});

	function compileElemnt(text) {
		var $element = angular.element(text);
		var compiledElement = $compile($element)(scope);
		scope.$apply();
		return compiledElement;
	}

	it('must fail if the model is undefined', function() {
		scope.testFile = [{
			size: 1900,
			type: 'text/plain'
		}];
		compileElemnt('<form name="sampleForm"><input name="file" type="text" ng-model="testFile"  mb-file-mimetype="text/plain"/></form>');
		expect(scope.sampleForm.file.$error.filemimetype).toBe(undefined);


		scope.testFile = [{
			size: 1900,
			type: 'text/plain'
		}, {
			size: 1000,
			type: 'text/html'
		}];
		scope.$digest();
		expect(scope.sampleForm.file.$error.filemimetype).toBe(true);
	});

});
