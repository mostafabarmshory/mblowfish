
import mblowfish from '../../mblowfish';

import alertAction from './actions/alert';
import navigatorToggleAction from './actions/navigator-sidenav-toogle';
import travelCreateAction from './actions/travel-create';


import DemoLayoutProviderDefaultFactory from './factories/DemoLayoutProviderDefault';
import DemoMemoryAuthenticationProviderFactory from './factories/DemoMemoryAuthenticationProvider';



import explorerView from './views/explorer';
import uiView from './views/ui';
import componentsView from './views/components';
import uiColorView from './views/ui-color-view';
import uiFileView from './views/ui-file-view';



mblowfish
	.action('demo.alert', alertAction)
	.action('mb.app.navigator.toggle.demo', navigatorToggleAction)
	.action('demo.travel.create', travelCreateAction)


	.factory('DemoLayoutProviderDefault', DemoLayoutProviderDefaultFactory)
	.factory('DemoMemoryAuthenticationProvider', DemoMemoryAuthenticationProviderFactory)


	.view('/demo', explorerView)
	.view('/demo/components', componentsView)

	.view('/demo/ui', uiView)
	.view('/demo/ui/color-view', uiColorView)
	.view('/demo/ui/file-view', uiFileView)
	;






