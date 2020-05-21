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
@name MbAction
@description An action item

Action is a named function which can be executed with its command id and parameters
from every where.

In the other word, MbAction divides defineition and usage of a function in a complex
system.


@tutorial core-action-callById
 */
angular.module('mblowfish-core').factory('MbAction', function($injector, $navigator, $window, MbComponent) {

	function Action(data) {
		data = data || {};
		data.isAction = true;
		MbComponent.call(this, data)
		this.visible = this.visible || function() {
			return true;
		};
		return this;
	};
	// Circle derives from Shape
	Action.prototype = Object.create(MbComponent.prototype);

	Action.prototype.exec = function($event) {
		//		if ($event) {
		//			$event.stopPropagation();
		//			$event.preventDefault();
		//		}
		if (this.alias) {
			var actionId = this.actionId || this.id;
			var $actions = $injector.get('$actions');
			return $actions.exec(actionId, $event);
		}
		if (this.action) {
			return $injector.invoke(this.action, this, {
				$event: $event
			});
		} else if (this.url) {
			return $navigator.openPage(this.url);
		}
		$window.alert('Action \'' + this.id + '\' is not executable!?')
	};

	Action.prototype.render = function(locals) {
		// find parent type
		var parent;
		var parentType;
		if (locals.$toolbar) {
			parentType = 'toolbar';
			parent = locals.$toolbar;
		} else if (locals.$menu) {
			parentType = 'menu';
			parent = locals.$menu;
		}

		var html;

		switch (parentType) {
			case 'toolbar':
				html = '<wb-icon>' + (this.icon || 'close') + '</wb-icon>';
				break;
			case 'menu':
				// XXX
				break;
			default:
			// TODO: maso, 2020 log error
		}

		var element = locals.$element;
		element.html(html);
		return MbComponent.prototype.render.call(this, locals);
	};

	return Action;
});
