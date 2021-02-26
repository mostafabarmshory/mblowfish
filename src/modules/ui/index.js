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
 * Services                                                                 *
 *                                                                          *
 *                                                                          *
 ****************************************************************************/
import mbIcon from './services/mbIcon';
import mbColorPalette from './services/mbColorPalette';
import mbColors from './services/mbColors';

/****************************************************************************
 * Directives                                                               *
 *                                                                          *
 *                                                                          *
 ****************************************************************************/
import mbIconDirective from './directives/mbIcon';
import mbIconFloatDirective from './directives/mbIconFloat';

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

	// Services
	.provider('$mbIcon', mbIcon)
	.provider('$mbColorPalette', mbColorPalette)
	.service('$mbColors', mbColors)

	// Directives
	.directive('mbIcon', mbIconDirective)
	.directive('mbIconFloat', mbIconFloatDirective)
	

	//<< end
	;
