
import mblowfish from '../../mblowfish';

import alertAction from './actions/alert';
import navigatorToggleAction from './actions/navigator-sidenav-toogle';
import travelCreateAction from './actions/travel-create';


import DemoLayoutProviderDefaultFactory from './factories/DemoLayoutProviderDefault';
import DemoMemoryAuthenticationProviderFactory from './factories/DemoMemoryAuthenticationProvider';

import iframeEditor from './editors/iframe';

import explorerView from './views/explorer';
import uiView from './views/ui';
import componentsView from './views/components';
import uiColorView from './views/ui-color-view';
import uiFileView from './views/ui-file-view';
import infinateItemsView from './views/infinate-items';
import dynamicFormView from './views/dynamic-form';
import dialogsView from './views/dialogs';
import resourcesView from './views/resources';
import tablesView from './views/tables';

import holidayCarPage from './wizards/holidayCarPage';
import holidayFinalPage from './wizards/holidayFinalPage';
import holidayLocationPage from './wizards/holidayLocationPage';
import holidayPlanePage from './wizards/holidayPlanePage';
import holidaySchedulePage from './wizards/holidaySchedulePage';
import holidayTrainPage from './wizards/holidayTrainPage';
import holidayTypePage from './wizards/holidayTypePage';

import holidayWizard from './wizards/holidayWizard';


mblowfish
	.action('demo.alert', alertAction)
	.action('mb.app.navigator.toggle.demo', navigatorToggleAction)
	.action('demo.travel.create', travelCreateAction)

	.factory('DemoLayoutProviderDefault', DemoLayoutProviderDefaultFactory)
	.factory('DemoMemoryAuthenticationProvider', DemoMemoryAuthenticationProviderFactory)

	.editor('/demo/editor/iframe', iframeEditor)

	.view('/demo', explorerView)
	.view('/demo/components', componentsView)

	.view('/demo/ui', uiView)
	.view('/demo/ui/color-view', uiColorView)
	.view('/demo/ui/file-view', uiFileView)
	.view('/demo/ui/infinate-items', infinateItemsView)
	.view('/demo/ui/dynamic-form', dynamicFormView)
	.view('/demo/ui/dialogs', dialogsView)
	.view('/demo/ui/resources', resourcesView)
	.view('/demo/ui/tables', tablesView)


	.wizardPage('holidayCarPage', holidayCarPage)
	.wizardPage('holidayFinalPage', holidayFinalPage)
	.wizardPage('holidayLocationPage', holidayLocationPage)
	.wizardPage('holidayPlanePage', holidayPlanePage)
	.wizardPage('holidaySchedulePage', holidaySchedulePage)
	.wizardPage('holidayTrainPage', holidayTrainPage)
	.wizardPage('holidayTypePage', holidayTypePage)
	.wizard('demo.travel.create', holidayWizard)
	;






