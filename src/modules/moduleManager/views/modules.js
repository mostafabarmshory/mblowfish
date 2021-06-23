/*
 * Copyright (c) 2015-2025 Phoinex Scholars Co. http://dpq.co.ir
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
import MbAbstractCtrl from '../../../controllers/MbAbstractCtrl';
import $mbActions from '../../../services/mbActions';
import templateUrl from './modules.html';
import {
	MB_MODULE_SP,
	MB_MODULE_CREATE_ACTION,
	MB_MODULE_DELETE_ACTION
} from '../Constants';


export class MbModulesCtrl extends MbAbstractCtrl {

	constractor($scope, $mbModules) {
		'ngInject';
		supser($scope);
		this.$mbModules = $mbModules;
		this.loadModules();
		this.addEventHandler(MB_MODULE_SP, () => this.loadModules());
	}

	loadModules() {
		this.modules = $mbModules.getModules();
	}

	addModule($event) {
		$mbActions.exec(MB_MODULE_CREATE_ACTION, $event);
	}

	deleteModule(item, $event) {
		$event.modules = [item];
		$mbActions.exec(MB_MODULE_DELETE_ACTION, $event);
	}

	openMenu($mdMenu, $event) {
		return $mdMenu.open($event);
	}
}



export default {
	title: 'Modules',
	icon: 'language',
	description: 'Manage global modules to enable for all users.',
	templateUrl: templateUrl,
	groups: ['Utilities'],
	controller: MbModulesCtrl
}




