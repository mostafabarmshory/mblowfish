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

/****************************************************************************
 * actions                                                                 *
 *                                                                          *
 *                                                                          *
 ****************************************************************************/
import openUrlAction from './actions/open-url';



/****************************************************************************
 * Directives                                                               *
 *                                                                          *
 *                                                                          *
 ****************************************************************************/
import mbColorPickerSpectrum from './directives/mbColorPickerSpectrum';
import mbCompareTo from './directives/mbCompareTo';
import mbContextMenu from './directives/mbContextMenu';
import mbDatepicker from './directives/mbDatepicker';
import mbDraggable from './directives/mbDraggable';
import mbDynamicForm from './directives/mbDynamicForm';
import mbDynamicTabs from './directives/mbDynamicTabs';
import mbErrorMessages from './directives/mbErrorMessages';
import mbFile from './directives/mbFile';
import mbFileInput from './directives/mbFileInput';
import mbFileMimetype from './directives/mbFileMimetype';
import mbFileSize from './directives/mbFileSize';
import mbFileSizeTotal from './directives/mbFileSizeTotal';
import mbInfinateScroll from './directives/mbInfinateScroll';
import mbInline from './directives/mbInline';
import mbLocal from './directives/mbLocal';
import mbMaxLength from './directives/mbMaxLength';
import mbMinLength from './directives/mbMinLength';
import mbNavigationBar from './directives/mbNavigationBar';
import mbOnDragstart from './directives/mbOnDragstart';
import mbOnEnter from './directives/mbOnEnter';
import mbOnError from './directives/mbOnError';
import mbOnEsc from './directives/mbOnEsc';
import mbOnLoad from './directives/mbOnLoad';
import mbBadge from './directives/mbBadge';
import mbButton from './directives/mbButton';
import mbCaptcha from './directives/mbCaptcha';
import mbColorPicker from './directives/mbColorPicker';
import mbColorPickerAlpha from './directives/mbColorPickerAlpha';
import mbColorPickerContainer from './directives/mbColorPickerContainer';
import mbColorPickerHue from './directives/mbColorPickerHue';
import mbColorsDirectives from './directives/mbColors';
import mbIconDirective from './directives/mbIcon';
import mbIconFloat from './directives/mbIconFloat';
import mbPreloading from './directives/mbPreloading';
import mbRequired from './directives/mbRequired';
import mbSidenavs from './directives/mbSidenavs';
import mbSrcError from './directives/mbSrcError';
import mbTable from './directives/mbTable';
import mbTitledBlock from './directives/mbTitledBlock';



/****************************************************************************
 * Editors                                                               *
 *                                                                          *
 *                                                                          *
 ****************************************************************************/
import browserEditor from './editors/browser';

import MbColorFactory from './factories/MbColor';
import MbColorGradientCanvasFactory from './factories/MbColorGradientCanvas';
import MbColorPickerFactory from './factories/MbColorPicker';
import MbColorPickerHistoryFactory from './factories/MbColorPickerHistory';


/****************************************************************************
 * Filters                                                               *
 *                                                                          *
 *                                                                          *
 ****************************************************************************/
import mbTrustedFilter from './filters/mbTrusted'

/****************************************************************************
 * Resources                                                               *
 *                                                                          *
 *                                                                          *
 ****************************************************************************/
import localFileResource from './resources/file';
import localFilesResource from './resources/files';
import webUrlResource from './resources/url';

/****************************************************************************
 * Services                                                                 *
 *                                                                          *
 *                                                                          *
 ****************************************************************************/
import mbIcon from './services/mbIcon';
import mbColorPalette from './services/mbColorPalette';
import mbColors from './services/mbColors';


mblowfish
	.addConstants({
		//------------------------------------------------------------
		// Resources Types
		//------------------------------------------------------------
		//	AMD_CMS_TERMTAXONOMIES_RT: '/cms/term-taxonomies',

		//------------------------------------------------------------
		// Stoer Paths
		//------------------------------------------------------------
		//	SDP_LINKS_SP: '/sdp/links',

		//------------------------------------------------------------
		// Views
		//------------------------------------------------------------
		//	SDP_VIEW_DRIVES_PATH: '/sdp/storages',

		//------------------------------------------------------------
		// ACTIONS
		//------------------------------------------------------------
		UI_URL_OPEN_ACTION: 'iframe.url.open',

		//------------------------------------------------------------
		// wizards
		//------------------------------------------------------------
		//	SDP_CATEGORY_CREATE_WIZARD: '/sdp/wizards/new-category',
	})
	// Directives
	.directive('mbColorPickerSpectrum', mbColorPickerSpectrum)
	.directive('mbCompareTo', mbCompareTo)
	.directive('mbContextMenu', mbContextMenu)
	.directive('mbDatepicker', mbDatepicker)
	.directive('mbDraggable', mbDraggable)
	.directive('mbDynamicForm', mbDynamicForm)
	.directive('mbDynamicTabs', mbDynamicTabs)
	.directive('mbErrorMessages', mbErrorMessages)
	.directive('mbFile', mbFile)
	.directive('mbFileInput', mbFileInput)
	.directive('mbFileMimetype', mbFileMimetype)
	.directive('mbFileSize', mbFileSize)
	.directive('mbFileSizeTotal', mbFileSizeTotal)
	.directive('mbInfinateScroll', mbInfinateScroll)
	.directive('mbInline', mbInline)
	.directive('mbLocal', mbLocal)
	.directive('mbMaxLength', mbMaxLength)
	.directive('mbMinLength', mbMinLength)
	.directive('mbNavigationBar', mbNavigationBar)
	.directive('mbOnDragstart', mbOnDragstart)
	.directive('mbOnEnter', mbOnEnter)
	.directive('mbOnError', mbOnError)
	.directive('mbOnEsc', mbOnEsc)
	.directive('mbOnLoad', mbOnLoad)
	.directive('mbBadge', mbBadge)
	.directive('mbButton', mbButton)
	.directive('mbCaptcha', mbCaptcha)
	.directive('mbColorPicker', mbColorPicker)
	.directive('mbColorPickerAlpha', mbColorPickerAlpha)
	.directive('mbColorPickerContainer', mbColorPickerContainer)
	.directive('mbColorPickerHue', mbColorPickerHue)
	.directive('mbColors', mbColorsDirectives)
	.directive('mbIcon', mbIconDirective)
	.directive('mbIconFloat', mbIconFloat)
	.directive('mbPreloading', mbPreloading)
	.directive('mbRequired', mbRequired)
	.directive('mbSidenavs', mbSidenavs)
	.directive('mbSrcError', mbSrcError)
	.directive('ngSrcError', mbSrcError) // Legecy support
	.directive('mbTable', mbTable)
	.directive('mbTitledBlock', mbTitledBlock)
	// actions
	.addAction(UI_URL_OPEN_ACTION, openUrlAction)
	// editors
	.editor('/mb/iframe/:url*', browserEditor)
	// factories
	.factory('MbColor', MbColorFactory)
	.factory('MbColorGradientCanvas', MbColorGradientCanvasFactory)
	.factory('MbColorPicker', MbColorPickerFactory)
	.factory('MbColorPickerHistory', MbColorPickerHistoryFactory)
	// filters
	.filter('mbTrusted', mbTrustedFilter)
	// resources
	.resource('local-file', localFileResource)
	.resource('local-files', localFilesResource)
	.resource('wb-url', webUrlResource)
	// Services
	.provider('$mbIcon', mbIcon)
	.provider('$mbColorPalette', mbColorPalette)
	.service('$mbColors', mbColors)
	//<< end
	;
