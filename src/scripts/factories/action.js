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
mblowfish.factory('MbAction', function($injector, $location, MbComponent, $q) {

	var defaultActionController = function($element, $action) {
		'ngInject';
		$element.on('click', function($event) {
			$action.exec($event);
		});
	};


	function Action(data) {
		data = data || {};
		data.isAction = true;
		data.id = data.id || Math.random();
		MbComponent.call(this, data)
		this.controller = defaultActionController;
		this.visible = this.visible || function() {
			return true;
		};
		return this;
	};
	// Circle derives from Shape
	Action.prototype = Object.create(MbComponent.prototype);

	Action.prototype.exec = function($event) {
		if (this.alias || _.isString(this.actionId)) {
			var actionId = this.actionId || this.id;
			var $actions = $injector.get('$mbActions');
			return $actions.exec(actionId, $event);
		}
		if (this.action) {
			var result = $injector.invoke(this.action, this, {
				$event: $event
			});
			return $q.when(result);
		}
		if (this.url) {
			return $location.url(this.url);
		}
		// TODO: maso, 2020: log to show the error
		alert('Action \'' + this.id + '\' is not executable!?');
		return $q.reject();
	};


	/**
	Gets template of the component
	
	Template is a HTML text which is used to build a view of the component.
	
	@returns {promisse} To resolve the template value
	@memberof MbAction
	 */
	Action.prototype.getTemplate = function(locals) {
		// find parent type
		//		var parent;
		var parentType;
		if (locals.$toolbar) {
			parentType = 'toolbar';
			//			parent = locals.$toolbar;
		} else if (locals.$menu) {
			parentType = 'menu';
			//			parent = locals.$menu;
		}

		var html;

		switch (parentType) {
			case 'toolbar':
				html = '<md-tooltip md-delay="1000"><spam mb-translate>'+(this.description || this.title)+'</spam></md-tooltip>'+
					'<mb-icon size="16">' + (this.icon || 'close') + '</mb-icon>';
				break;
			case 'menu':
				// XXX
				break;
			default:
			// TODO: maso, 2020 log error
		}
		return html;
	}

	Action.prototype.render = function(locals) {
		locals.$element.addClass('mbAction');
		locals.$action = this;
		return MbComponent.prototype.render.call(this, locals);
	};

	return Action;
});
