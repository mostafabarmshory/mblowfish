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


import mblowfish from '../../mblowfish';
import moduleCreateAction from './actions/module-create';
import moduleDeleteAction from './actions/module-delete';
import moduleExportAction from './actions/module-export';
import moduleImportAction from './actions/module-import';

import manualModuleResource from './resources/module-manual';

import modulesView from './views/modules';

import * as Constants from './Constants';
/**
 * Manages system moduels
 */
mblowfish
	.constant(Constants)
	//>> action
	.action(Constants.MB_MODULE_CREATE_ACTION, moduleCreateAction)
	.action(Constants.MB_MODULE_DELETE_ACTION, moduleDeleteAction)
	.action(Constants.MB_MODULE_EXPORT_ACTION, moduleExportAction)
	.action(Constants.MB_MODULE_IMPORT_ACTION, moduleImportAction)
	//>> resource
	.resource('mb-module-manual', manualModuleResource)
	//>> View
	.view(Constants.MB_MODULE_MODULES_VIEW, modulesView)
	//>> runs
	.run(function($mbToolbar) {
		'ngInject';
		$mbToolbar
			.getToolbar(Constants.MB_MODULE_MODULES_VIEW)
			.addAction(Constants.MB_MODULE_CREATE_ACTION)
			.addAction(Constants.MB_MODULE_IMPORT_ACTION)
			.addAction(Constants.MB_MODULE_EXPORT_ACTION);
	});

