import './MbActionFactory.css';

/**
@ngdoc Factories
@name MbAction
@description An action item

Action is a named function which can be executed with its command id and parameters
from every where.

In the other word, MbAction divides defineition and usage of a function in a complex
system.


@tutorial core-action-callById
@ngInject
 */
function MbActionFactory($injector, MbComponent, $q) {

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

	/**
	Executes the action
	 */
	Action.prototype.exec = function($event) {
		var $actions = $injector.get('$mbActions');
		return $actions.exec(this, $event);
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
				html = '<md-tooltip md-delay="1000"><spam mb-translate>' + 
				(this.description || this.title) + 
				(this.hotkey? ' ('+this.hotkey+')' : '') +
				'</spam></md-tooltip>' +
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
}

export default MbActionFactory;
