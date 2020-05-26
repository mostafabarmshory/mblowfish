/*
 * Copyright (c) 2015 Phoenix Scholars Co. (http://dpq.co.ir)
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */


/**
@ngdoc Factories
@name MbFrame
@description A container which is managed with layout manager to display

 */
angular.module('mblowfish-core').factory('MbFrame', function($mbUiUtil, MbContainer, $mbLayout, MbToolbar, $mbToolbar) {

	function MbFrame(configs) {
		// 1- create and register frame toolbar
		var toolbar = new MbToolbar({
			url: configs.url,
			//isToolbar: false,
			//isView: false,
			//isEditor: false,
			//isMenu: false,
			controller: function() { },
			controllerAs: 'toolbarCtrl'
		});
		$mbToolbar.addToolbar(configs.url, toolbar);
		this.toolbar = toolbar;

		// 2- create and register frame menu
		this.menu = undefined;

		// 3- call container initialization
		configs.state = configs.state || {};
		MbContainer.call(this, configs);
		return this;
	};

	// Circle derives from Shape
	MbFrame.prototype = Object.create(MbContainer.prototype);

	MbFrame.prototype.getToolbar = function() {
		return this.toolbar;
	};

	MbFrame.prototype.getMenu = function() {
		return this.menu;
	};

	MbFrame.prototype.setTitle = function() { };
	MbFrame.prototype.close = function() { };

	MbFrame.prototype.setFocus = function() {
		$mbLayout.setFocus(this);
	};

	MbFrame.prototype.render = function(locals) {
		locals.$toolbar = this.getToolbar();
		locals.$menu = this.getMenu();
		locals.$frame = this;


		var toolbar = locals.$toolbar;
		var toolbarElement = angular.element('<mb-toolbar></mb-toolbar>');
		toolbarElement.attr('id', this.url);

		// store criticla services
		this.state = locals.$state;


		return MbContainer.prototype.render.call(this, locals)
			.then(function(handler) {
				handler.$element.children().addClass('mb-container-content');
				handler.$element.prepend(toolbarElement);
				toolbar.render({
					$element: toolbarElement,
				});
			});
	};


	/**
	Destroy all visible parts and free all resources
	
	@memberof MbFrame
	 */
	MbFrame.prototype.destroy = function() {
		if (this.toolbar) {
			this.toolbar.destroy();
		}
		if (this.menu) {
			this.menu.destroy();
		}
		this.state = {};
		return MbContainer.prototype.destroy.call(this);
	};


	/**
	Set visible or un visible the frame
	
	@name setVisible
	@memberof MbFrame
	@param {boolean} visible If true, the frame will be show or it will be removed from the layout system
	 */
	MbFrame.prototype.setVisible = function(visible) {
		if (visible) {
			$location.url($mbUiUtil.frameToUrl(this));
			return this;
		}
		return this.destroy();
	};

	/**
	Set the place where the frame will be display
	
	@name setAnchor
	@memberof MbFrame
	 */
	MbFrame.prototype.setAnchor = function(anchor) {
		this.anchor = anchor;
		return this;
	};

	// TODO: maso, 2020: send new params to editor
	MbFrame.prototype.setState = function(state) {
		this.state = _.assign(this.state, state);
		// TOOD: fire params changed
		return this;
	};


	return MbFrame;
});
