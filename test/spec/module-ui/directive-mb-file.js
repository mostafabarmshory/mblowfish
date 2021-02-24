describe('Directive mb-file ', function() {
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

	it('file must be modifiable', function() {
		var file = new File(['foo'], 'foo.txt', {
			type: 'text/plain',
		});
		file.media = 'text';
		scope.file = file;
		var element = compileElemnt('<div><mb-file ng-model="file" mb-unknow-class="unknown"></mb-file></div>');

		expect(element[0].children[0].tagName).toMatch(/object/i);
	});


	it('file must support audio media', function() {
		var file = new File(['foo'], 'foo.txt', {
			type: 'text/plain',
		});
		file.media = 'audio';
		scope.file = file;
		var element = compileElemnt('<div><mb-file ng-model="file" mb-unknow-class="unknown"></mb-file></div>');

		expect(element[0].children[0].tagName).toMatch(/audio/i);
	});

	it('file must support video media', function() {
		var file = new File(['foo'], 'foo.txt', {
			type: 'text/plain',
		});
		file.media = 'video';
		scope.file = file;
		var element = compileElemnt('<div><mb-file ng-model="file" mb-unknow-class="unknown"></mb-file></div>');

		expect(element[0].children[0].tagName).toMatch(/video/i);
	});



	it('file must support image media', function() {
		var file = new File(['foo'], 'foo.txt', {
			type: 'text/plain',
		});
		file.media = 'image';
		scope.file = file;
		var element = compileElemnt('<div><mb-file ng-model="file" mb-unknow-class="unknown"></mb-file></div>');

		expect(element[0].children[0].tagName).toMatch(/img/i);
	});
});
