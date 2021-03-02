import _ from 'lodash';
import {RESOURCE_CHILDREN_AUNCHOR} from '../services/mbResource';


/**
@name ResourceDialogCtrl
@description
Manages resource dialog and allows internal containers to work.

Resources are free to set a process to performe before closing the dialog. It is common in
resources required process.

@example
	mblowfish.addResource('test',{
		tags:['image'],
		controller: function($resource){
			$resource.process = function(){
				return $http.get('resource/from/web')
					.then(function(value){
						$resources.setValue(value);
					});
			}
		}
	});

@ngInject
 */
export default function(
	$scope, $value, $element, $pages, $style, $options,
	$mbDialog, MbContainer) {

	var isFunction = _.isFunction;
	//-------------------------------------------------------------
	// Variables
	//-------------------------------------------------------------

	var value = angular.copy($value);
	var ctrl = this;
	var currentContainer;
	var currentPage;


	//-------------------------------------------------------------
	// functions
	//-------------------------------------------------------------
	function cancel() {
		return $mbDialog.cancel();
	}

	/**
	Answer the dialog
	
	If there is an answer function in the current page controller
	then the result of the answer function will be returned as 
	the main result.
	
	@memberof WbResourceCtrl
	 */
	function answer() {
		if (isFunction(ctrl.process)) {
			return ctrl.isBusy = ctrl.process()
				.then(function() {
					return $mbDialog.hide(value);
				})
				.finally(function() {
					delete ctrl.isBusy;
				});
		}
		return $mbDialog.hide(value);
	}

	function getValue() {
		return value;
	}

	function setValue(newValue) {
		value = newValue;
		return this;
	}

	/**
	 * تنظیمات را به عنوان تنظیم‌های جاری سیستم لود می‌کند.
	 * 
	 * @returns
	 */
	function loadPage(page) {
		// 1- Find element
		var target = $element.find('#' + RESOURCE_CHILDREN_AUNCHOR);

		// 2- Clear childrens
		if (currentContainer) {
			currentContainer.destroy();
			target.empty();
		}
		delete ctrl.process;

		currentPage = page;
		currentContainer = new MbContainer(page);
		return currentContainer.render(_.assign({}, $options, {
			$element: target,
			$scope: $scope.$new(false),
			$style: $style,
			$options: $options,
			$value: value,
			$resource: ctrl,
			$keepRootElement: true, // Do not remove element
		}));
	}

	function isPageVisible(page) {
		return page === currentPage;
	}

	//-------------------------------------------------------------
	// end
	//-------------------------------------------------------------
	_.assign(ctrl, {
		style: $style,
		pages: $pages,

		getValue: getValue,
		setValue: setValue,
		answer: answer,
		cancel: cancel,

		loadPage: loadPage,
		isPageVisible: isPageVisible,
	});

	if ($pages.length) {
		loadPage($pages[0]);
	}
}