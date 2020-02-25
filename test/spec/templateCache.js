angular.module('mblowfish-core').run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('views/dialogs/mb-alert.html',
    "<md-dialog layout=column ng-cloak> <md-toolbar> <div class=md-toolbar-tools> <wb-icon>error</wb-icon> <h2 translate>{{app.title}}</h2> <span flex></span> <md-button class=md-icon-button ng-click=cancel() aria-label=close> <wb-icon aria-label=\"Close dialog\">close</wb-icon> </md-button> </div> </md-toolbar> <md-dialog-content layout=row layout-padding layout-align=\"center center\" flex> <p translate>{{config.message}}</p> </md-dialog-content> </md-dialog>"
  );


  $templateCache.put('views/dialogs/mb-confirm.html',
    "<md-dialog layout=column ng-cloak> <md-toolbar> <div class=md-toolbar-tools> <wb-icon>warning</wb-icon> <h2 translate>{{app.title}}</h2> <span flex></span> <md-button class=md-icon-button ng-click=answer(true) aria-label=done> <wb-icon aria-label=Done>done</wb-icon> </md-button> <md-button class=md-icon-button ng-click=cancel() aria-label=close> <wb-icon aria-label=\"Close dialog\">close</wb-icon> </md-button> </div> </md-toolbar> <md-dialog-content layout=row layout-padding layout-align=\"center center\" flex> <p translate>{{config.message}}</p> </md-dialog-content> </md-dialog>"
  );


  $templateCache.put('views/dialogs/mb-prompt.html',
    "<md-dialog layout=column ng-cloak> <md-toolbar> <div class=md-toolbar-tools> <wb-icon>input</wb-icon> <h2 translate>{{app.title}}</h2> <span flex></span> <md-button class=md-icon-button ng-click=answer(config.model) aria-label=done> <wb-icon aria-label=Done>done</wb-icon> </md-button> <md-button class=md-icon-button ng-click=cancel() aria-label=close> <wb-icon aria-label=\"Close dialog\">close</wb-icon> </md-button> </div> </md-toolbar> <md-dialog-content layout=column layout-padding layout-align=\"center stretch\" flex> <p translate>{{config.message}}</p> <md-input-container class=md-block> <label translate>Input value</label> <input ng-model=config.model aria-label=\"input value\"> </md-input-container> </md-dialog-content> </md-dialog>"
  );


  $templateCache.put('views/dialogs/mbl-add-word.html',
    "<md-dialog ng-cloak> <md-toolbar> <div class=md-toolbar-tools> <h2 translate>Add new word</h2> <span flex></span> <md-button class=md-icon-button ng-click=cancel()> <wb-icon aria-label=\"Close dialog\">close</wb-icon> </md-button> <md-button class=md-icon-button ng-click=answer(word)> <wb-icon aria-label=\"Close dialog\">done</wb-icon> </md-button> </div> </md-toolbar> <md-dialog-content layout=column layout-align=\"center stretch\" layout-padding flex> <span flex=10></span> <md-input-container class=md-block flex-gt-sm> <label translate=\"\">Key</label> <input ng-model=word.key> </md-input-container> <md-input-container class=md-block flex-gt-sm> <label translate=\"\">Translate</label> <input ng-model=word.translate> </md-input-container> </md-dialog-content> </md-dialog>"
  );


  $templateCache.put('views/dialogs/mbl-update-language.html',
    "<md-dialog ng-cloak> <md-toolbar> <div class=md-toolbar-tools> <h2 translate>{{::config.title}}</h2> <span flex></span> <md-button class=md-icon-button ng-click=cancel()> <wb-icon aria-label=\"Close dialog\">close</wb-icon> </md-button> <md-button class=md-icon-button ng-click=answer(config.language)> <wb-icon aria-label=\"Close dialog\">done</wb-icon> </md-button> </div> </md-toolbar> <md-dialog-content layout=column layout-align=\"center stretch\" layout-padding flex> <div layout=column> <md-input-container> <label translate>Key</label> <input ng-model=config.language.key ng-readonly=true> </md-input-container> <md-input-container> <label translate>Title</label> <input ng-model=config.language.title ng-readonly=true> </md-input-container> </div> </md-dialog-content> </md-dialog>"
  );


  $templateCache.put('views/dialogs/wb-select-resource-single-page.html',
    "<md-dialog aria-label=\"Select item/items\" style=\"width:50%; height:70%\"> <form ng-cloak layout=column flex> <md-dialog-content mb-preloading=loadingAnswer flex layout=row> <div layout=column flex> <div id=wb-select-resource-children style=\"margin: 0px; padding: 0px; overflow: auto\" layout=column flex> </div> </div> </md-dialog-content> <md-dialog-actions layout=row>       <span flex></span> <md-button ng-click=cancel() aria-label=Cancel> <span translate=\"\">Close</span> </md-button> <md-button class=md-primary aria-label=Done ng-click=answer()> <span translate=\"\">Ok</span> </md-button> </md-dialog-actions> </form> </md-dialog>"
  );


  $templateCache.put('views/dialogs/wb-select-resource.html',
    "<md-dialog aria-label=\"Select item/items\" style=\"width:70%; height:70%\"> <form ng-cloak layout=column flex> <md-dialog-content mb-preloading=loadingAnswer flex layout=row> <md-sidenav class=md-sidenav-left md-component-id=left md-is-locked-open=true md-whiteframe=4 layout=column ng-hide=\"pages.length === 1\"> <div style=\"text-align: center\"> <wb-icon size=64px ng-if=style.icon>{{style.icon}}</wb-icon> <h2 style=\"text-align: center\" translate>{{style.title}}</h2> <p style=\"text-align: center\" translate>{{style.description}}</p> </div> <md-devider></md-devider> <md-content> <md-list style=\"padding:0px; margin: 0px\"> <md-list-item ng-repeat=\"page in pages | orderBy:priority\" ng-click=\"loadPage(page, $event);\" md-colors=\"_selectedIndex===$index ? {background:'accent'} : {}\"> <wb-icon>{{page.icon || 'attachment'}}</wb-icon> <p>{{page.label | translate}}</p> </md-list-item> </md-list> </md-content> </md-sidenav> <div layout=column flex> <div id=wb-select-resource-children style=\"margin: 0px; padding: 0px; overflow: auto\" layout=column flex> </div> </div> </md-dialog-content> <md-dialog-actions layout=row> <span flex></span> <md-button aria-label=Cancel ng-click=cancel()> <span translate=\"\">Close</span> </md-button> <md-button class=md-primary aria-label=Done ng-click=answer()> <span translate=\"\">Ok</span> </md-button> </md-dialog-actions> </form> </md-dialog>"
  );


  $templateCache.put('views/directives/mb-captcha.html',
    "<div>  <div vc-recaptcha ng-model=ctrl.captchaValue theme=\"app.captcha.theme || 'light'\" type=\"app.captcha.type || 'image'\" key=app.captcha.key lang=\"app.captcha.language || 'fa'\"> </div>  </div>"
  );


  $templateCache.put('views/directives/mb-dynamic-form.html',
    "<div layout=column ng-repeat=\"prop in mbParameters track by $index\"> <md-input-container ng-show=\"prop.visible && prop.editable\" class=\"md-icon-float md-icon-right md-block\"> <label>{{prop.title}}</label> <input ng-required=\"{{prop.validators && prop.validators.indexOf('NotNull')>-1}}\" ng-model=values[prop.name] ng-change=\"modelChanged(prop.name, values[prop.name])\"> <wb-icon ng-show=hasResource(prop) ng-click=setValueFor(prop)>more_horiz</wb-icon>  </md-input-container> </div>"
  );


  $templateCache.put('views/directives/mb-dynamic-tabs.html',
    "<div layout=column> <md-tabs md-selected=pageIndex> <md-tab ng-repeat=\"tab in mbTabs\"> <span translate>{{tab.title}}</span> </md-tab> </md-tabs> <div id=mb-dynamic-tabs-select-resource-children> </div> </div>"
  );


  $templateCache.put('views/directives/mb-inline.html',
    "<div style=\"cursor: pointer\" ng-switch=mbInlineType>  <div ng-switch-when=image class=overlay-parent ng-class=\"{'my-editable' : $parent.mbInlineEnable}\" md-colors=\"::{borderColor: 'primary-100'}\" style=\"overflow: hidden\" ng-click=ctrlInline.updateImage() ng-transclude> <div ng-show=$parent.mbInlineEnable layout=row layout-align=\"center center\" class=overlay-bottom md-colors=\"{backgroundColor: 'primary-700'}\"> <md-button class=md-icon-button aria-label=\"Change image\" ng-click=ctrlInline.updateImage()> <wb-icon>photo_camera </wb-icon></md-button> </div> </div>  <div ng-switch-when=file class=overlay-parent ng-class=\"{'my-editable' : $parent.mbInlineEnable}\" md-colors=\"::{borderColor: 'primary-100'}\" style=\"overflow: hidden\" ng-click=ctrlInline.updateFile() ng-transclude> <div ng-show=$parent.mbInlineEnable layout=row layout-align=\"center center\" class=overlay-bottom md-colors=\"{backgroundColor: 'primary-700'}\"> <md-button class=md-icon-button aria-label=\"Change image\" ng-click=ctrlInline.updateFile()> <wb-icon>file </wb-icon></md-button> </div> </div>  <div ng-switch-when=datetime> <mb-datepicker ng-show=ctrlInline.editMode ng-model=ctrlInline.model ng-change=ctrlInline.save() mb-placeholder=\"Click to set date\" mb-hide-icons=calendar> </mb-datepicker> <button ng-if=\"mbInlineCancelButton && ctrlInline.editMode\" ng-click=ctrlInline.cancel()>cancel</button> <button ng-if=\"mbInlineSaveButton && ctrlInline.editMode\" ng-click=ctrlInline.save()>save</button> <ng-transclude ng-hide=ctrlInline.editMode ng-click=ctrlInline.edit() flex></ng-transclude> </div> <div ng-switch-when=date> <mb-datepicker ng-show=ctrlInline.editMode ng-model=ctrlInline.model ng-change=ctrlInline.save() mb-date-format=YYYY-MM-DD mb-placeholder=\"Click to set date\" mb-hide-icons=calendar> </mb-datepicker> <button ng-if=\"mbInlineCancelButton && ctrlInline.editMode\" ng-click=ctrlInline.cancel()>cancel</button> <button ng-if=\"mbInlineSaveButton && ctrlInline.editMode\" ng-click=ctrlInline.save()>save</button> <ng-transclude ng-hide=ctrlInline.editMode ng-click=ctrlInline.edit() flex></ng-transclude> </div>                                                                                                                                           <div ng-switch-default> <input wb-on-enter=ctrlInline.save() wb-on-esc=ctrlInline.cancel() ng-model=ctrlInline.model ng-show=ctrlInline.editMode> <button ng-if=\"mbInlineCancelButton && ctrlInline.editMode\" ng-click=ctrlInline.cancel()>cancel</button> <button ng-if=\"mbInlineSaveButton && ctrlInline.editMode\" ng-click=ctrlInline.save()>save</button> <ng-transclude ng-hide=ctrlInline.editMode ng-click=ctrlInline.edit() flex></ng-transclude> </div>  <div ng-messages=error.message> <div ng-message=error class=md-input-message-animation style=\"margin: 0px\">{{error.message}}</div> </div> </div>"
  );


  $templateCache.put('views/directives/mb-navigation-bar.html',
    "<div class=mb-navigation-path-bar md-colors=\"{'background-color': 'primary'}\" layout=row> <div layout=row> <md-button ng-click=goToHome() aria-label=Home class=\"mb-navigation-path-bar-item mb-navigation-path-bar-item-home\"> <md-tooltip ng-if=menu.tooltip md-delay=1500>{{'home' | translate}}</md-tooltip> <wb-icon>home</wb-icon> </md-button> </div> <div layout=row data-ng-repeat=\"menu in pathMenu.items | orderBy:['-priority']\"> <wb-icon>{{app.dir==='rtl' ? 'chevron_left' : 'chevron_right'}}</wb-icon> <md-button ng-show=isVisible(menu) ng-href={{menu.url}} ng-click=menu.exec($event); class=mb-navigation-path-bar-item> <md-tooltip ng-if=menu.tooltip md-delay=1500>{{menu.description}}</md-tooltip> <wb-icon ng-if=menu.icon>{{menu.icon}}</wb-icon> {{menu.title | translate}} </md-button>  </div> </div>"
  );


  $templateCache.put('views/directives/mb-pagination-bar.html',
    "<div layout=column> <div class=wrapper-stack-toolbar-container style=\"border-radius: 0px\">  <div md-colors=\"{background: 'primary-hue-1'}\"> <div class=md-toolbar-tools> <md-button ng-if=mbIcon md-no-ink class=md-icon-button aria-label={{::mbIcon}}> <wb-icon>{{::mbIcon}}</wb-icon> </md-button> <h2 flex md-truncate ng-if=mbTitle>{{::mbTitle}}</h2> <md-button ng-if=mbReload class=md-icon-button aria-label=Reload ng-click=__reload()> <wb-icon>repeat</wb-icon> </md-button> <md-button ng-show=mbSortKeys class=md-icon-button aria-label=Sort ng-click=\"showSort = !showSort\"> <wb-icon>sort</wb-icon> </md-button> <md-button ng-show=filterKeys class=md-icon-button aria-label=Sort ng-click=\"showFilter = !showFilter\"> <wb-icon>filter_list</wb-icon> </md-button> <md-button ng-show=mbEnableSearch class=md-icon-button aria-label=Search ng-click=\"showSearch = true; focusToElement('searchInput');\"> <wb-icon>search</wb-icon> </md-button> <md-button ng-if=exportData class=md-icon-button aria-label=Export ng-click=exportData()> <wb-icon>save</wb-icon> </md-button> <span flex ng-if=!mbTitle></span> <md-menu ng-show=mbMoreActions.length> <md-button class=md-icon-button aria-label=Menu ng-click=$mdOpenMenu($event)> <wb-icon>more_vert</wb-icon> </md-button> <md-menu-content width=4> <md-menu-item ng-repeat=\"item in mbMoreActions\"> <md-button ng-click=\"runAction(item, $event)\" aria-label={{::item.title}}> <wb-icon ng-show=item.icon>{{::item.icon}}</wb-icon> <span translate=\"\">{{::item.title}}</span> </md-button> </md-menu-item> </md-menu-content> </md-menu> </div> </div>  <div class=\"stack-toolbar new-box-showing-animation\" md-colors=\"{background: 'primary-hue-2'}\" ng-show=showSearch> <div class=md-toolbar-tools> <md-button style=min-width:0px ng-click=\"showSearch = false\" aria-label=Back> <wb-icon class=icon-rotate-180-for-rtl>arrow_back</wb-icon> </md-button> <md-input-container flex md-theme=dark md-no-float class=\"md-block fit-input\"> <input id=searchInput placeholder=\"{{::'Search'|translate}}\" ng-model=query.searchTerm ng-change=searchQuery() ng-model-options=\"{debounce: 1000}\"> </md-input-container> </div> </div>  <div class=\"stack-toolbar new-box-showing-animation\" md-colors=\"{background: 'primary-hue-2'}\" ng-show=showSort> <div class=md-toolbar-tools> <md-button style=min-width:0px ng-click=\"showSort = false\" aria-label=Back> <wb-icon class=icon-rotate-180-for-rtl>arrow_back</wb-icon> </md-button> <h3 translate=\"\">Sort</h3> <span style=\"width: 10px\"></span>  <md-menu> <md-button layout=row style=\"text-transform: none\" ng-click=$mdMenu.open()> <h3>{{mbSortKeysTitles ? mbSortKeysTitles[mbSortKeys.indexOf(query.sortBy)] : query.sortBy | translate}}</h3> </md-button> <md-menu-content width=4> <md-menu-item ng-repeat=\"key in mbSortKeys\"> <md-button ng-click=\"query.sortBy = key; setSortOrder()\"> <wb-icon ng-if=\"query.sortBy === key\">check_circle</wb-icon> <wb-icon ng-if=\"query.sortBy !== key\">radio_button_unchecked</wb-icon> {{::mbSortKeysTitles ? mbSortKeysTitles[$index] : key|translate}} </md-button> </md-menu-item> </md-menu-content> </md-menu>  <md-menu> <md-button layout=row style=\"text-transform: none\" ng-click=$mdMenu.open()> <wb-icon ng-if=!query.sortDesc class=icon-rotate-180>filter_list</wb-icon> <wb-icon ng-if=query.sortDesc>filter_list</wb-icon> {{query.sortDesc ? 'Descending' : 'Ascending'|translate}} </md-button> <md-menu-content width=4> <md-menu-item> <md-button ng-click=\"query.sortDesc = false;setSortOrder()\"> <wb-icon ng-if=!query.sortDesc>check_circle</wb-icon> <wb-icon ng-if=query.sortDesc>radio_button_unchecked</wb-icon> {{::'Ascending'|translate}} </md-button> </md-menu-item> <md-menu-item> <md-button ng-click=\"query.sortDesc = true;setSortOrder()\"> <wb-icon ng-if=query.sortDesc>check_circle</wb-icon> <wb-icon ng-if=!query.sortDesc>radio_button_unchecked</wb-icon> {{::'Descending'|translate}} </md-button> </md-menu-item> </md-menu-content> </md-menu> </div> </div>  <div class=\"stack-toolbar new-box-showing-animation\" md-colors=\"{background: 'primary-hue-2'}\" ng-show=showFilter> <div layout=row layout-align=\"space-between center\" class=md-toolbar-tools> <div layout=row> <md-button style=min-width:0px ng-click=\"showFilter = false\" aria-label=Back> <wb-icon class=icon-rotate-180-for-rtl>arrow_back</wb-icon> </md-button> <h3 translate=\"\">Filters</h3> </div> <div layout=row> <md-button ng-if=\"filters && filters.length\" ng-click=applyFilter() class=md-icon-button> <wb-icon>done</wb-icon> </md-button> <md-button ng-click=addFilter() class=md-icon-button> <wb-icon>add</wb-icon> </md-button> </div> </div> </div> </div>  <div layout=column md-colors=\"{background: 'primary-hue-1'}\" ng-show=\"showFilter && filters.length>0\" layout-padding>  <div ng-repeat=\"filter in filters track by $index\" layout=row layout-align=\"space-between center\" style=\"padding-top: 0px;padding-bottom: 0px\"> <div layout=row style=\"width: 50%\"> <md-input-container style=\"padding: 0px;margin: 0px;width: 20%\"> <label translate=\"\">Key</label> <md-select name=filter ng-model=filter.key ng-change=\"showFilterValue=true;\" required> <md-option ng-repeat=\"key in filterKeys\" ng-value=key> <span translate=\"\">{{key}}</span> </md-option> </md-select> </md-input-container> <span flex=5></span> <md-input-container style=\"padding: 0px;margin: 0px\" ng-if=showFilterValue> <label translate=\"\">Value</label> <input ng-model=filter.value required> </md-input-container> </div> <md-button ng-if=showFilterValue ng-click=removeFilter(filter,$index) class=md-icon-button> <wb-icon>delete</wb-icon> </md-button> </div> </div> </div>"
  );


  $templateCache.put('views/directives/mb-pay.html',
    "<div layout=column>  <div layout=column> <md-progress-linear style=min-width:50px ng-if=\"ctrl.loadingGates || ctrl.paying\" md-mode=indeterminate class=md-accent md-color> </md-progress-linear> <div layout=column ng-if=\"!ctrl.loadingGates && ctrl.gates.length\"> <p translate>Select gate to pay</p> <div layout=row layout-align=\"center center\"> <md-button ng-repeat=\"gate in ctrl.gates\" ng-click=ctrl.pay(gate)> <img ng-src={{::gate.symbol}} style=\"max-height: 64px;border-radius: 4px\" alt={{::gate.title}}> </md-button> </div> </div> <div layout=row ng-if=\"!ctrl.loadingGates && ctrl.gates && !ctrl.gates.length\" layout-align=\"center center\"> <p style=\"color: red\"> <span translate>No gate is defined for the currency of the wallet.</span> </p> </div> </div> </div>"
  );


  $templateCache.put('views/directives/mb-preference-page.html',
    "<div id=mb-preference-body layout=row layout-margin flex> </div>"
  );


  $templateCache.put('views/directives/mb-titled-block.html',
    "<div layout=column style=\"border-radius: 5px; padding: 0px\" class=md-whiteframe-2dp> <md-toolbar class=md-hue-1 layout=row style=\"border-top-left-radius: 5px; border-top-right-radius: 5px; margin: 0px; padding: 0px\"> <div layout=row layout-align=\"start center\" class=md-toolbar-tools> <wb-icon size=24px style=\"margin: 0;padding: 0px\" ng-if=mbIcon>{{::mbIcon}}</wb-icon> <h3 translate=\"\" style=\"margin-left: 8px; margin-right: 8px\">{{::mbTitle}}</h3> </div> <md-menu layout-align=\"end center\" ng-show=mbMoreActions.length> <md-button class=md-icon-button aria-label=Menu ng-click=$mdOpenMenu($event)> <wb-icon>more_vert</wb-icon> </md-button> <md-menu-content width=4> <md-menu-item ng-repeat=\"item in mbMoreActions\"> <md-button ng-click=item.action() aria-label={{::item.title}}> <wb-icon ng-show=item.icon>{{::item.icon}}</wb-icon> <span translate=\"\">{{::item.title}}</span> </md-button> </md-menu-item> </md-menu-content> </md-menu> </md-toolbar> <md-progress-linear ng-style=\"{'visibility': mbProgress?'visible':'hidden'}\" md-mode=indeterminate class=md-primary> </md-progress-linear> <div flex ng-transclude style=\"padding: 16px\"></div> </div>"
  );


  $templateCache.put('views/directives/mb-tree-heading.html',
    "<h2 md-colors=\"{color: 'primary.A100'}\" class=\"mb-tree-heading md-subhead\"> <wb-icon ng-if=mbSection.icon>{{mbSection.icon}}</wb-icon> {{mbSection.title}} </h2>"
  );


  $templateCache.put('views/directives/mb-tree-link.html',
    "<md-button md-colors=\"{backgroundColor: (isSelected(mbSection.state) || $state.includes(mbSection.state)) ? 'primary.800': 'primary'}\" class=\"md-raised md-primary md-hue-1\" ng-click=focusSection(mbSection)> <wb-icon ng-if=mbSection.icon>{{mbSection.icon}}</wb-icon> <span translate>{{mbSection.title}}</span> <span class=md-visually-hidden ng-if=isSelected(mbSection)> current page </span> </md-button>"
  );


  $templateCache.put('views/directives/mb-tree-toggle.html',
    "<div ng-show=isVisible()> <md-button class=\"md-raised md-primary md-hue-1 md-button-toggle\" ng-click=toggle(mbSection) aria-controls=docs-menu-{{section.name}} aria-expanded={{isOpen(mbSection)}}> <div flex layout=row> <wb-icon ng-if=mbSection.icon>{{mbSection.icon}}</wb-icon> <span class=mb-toggle-title translate>{{mbSection.title}}</span> <span flex></span> <span aria-hidden=true class=md-toggle-icon ng-class=\"{toggled : isOpen(mbSection)}\"> <wb-icon>keyboard_arrow_up</wb-icon> </span> </div> <span class=md-visually-hidden> Toggle {{isOpen(mbSection)? expanded : collapsed}} </span> </md-button> <ul id=docs-menu-{{mbSection.title}} class=mb-tree-toggle-list> <li ng-repeat=\"section in mbSection.sections\" ng-if=isVisible(section)> <mb-tree-link mb-section=section ng-if=\"section.type === 'link'\"> </mb-tree-link> </li> </ul> </div>"
  );


  $templateCache.put('views/directives/mb-tree.html',
    "<ul id=mb-tree-root-element class=mb-tree> <li md-colors=\"{borderBottomColor: 'background-600'}\" ng-repeat=\"section in mbSection.sections | orderBy : 'priority'\" ng-show=isVisible(section)> <mb-tree-heading mb-section=section ng-if=\"section.type === 'heading'\"> </mb-tree-heading> <mb-tree-link mb-section=section ng-if=\"section.type === 'link'\"> </mb-tree-link> <mb-tree-toggle mb-section=section ng-if=\"section.type === 'toggle'\"> </mb-tree-toggle> </li> </ul>"
  );


  $templateCache.put('views/directives/mb-user-menu.html',
    "<div md-colors=\"{'background-color': 'primary-hue-1'}\" class=amd-user-menu> <md-menu md-offset=\"0 20\"> <md-button class=amd-user-menu-button ng-click=$mdOpenMenu() aria-label=\"Open menu\"> <img height=32px class=img-circle style=\"border-radius: 50%; vertical-align: middle\" ng-src=/api/v2/user/accounts/{{app.user.current.id}}/avatar ng-src-error=\"https://www.gravatar.com/avatar/{{app.user.current.id|wbmd5}}?d=identicon&size=32\"> <span>{{app.user.profile.first_name}} {{app.user.profile.last_name}}</span> <wb-icon class=material-icons>keyboard_arrow_down</wb-icon> </md-button> <md-menu-content width=3>  <md-menu-item ng-if=menu.items.length ng-repeat=\"item in menu.items| orderBy:['-priority']\"> <md-button ng-click=item.exec($event) translate=\"\"> <wb-icon ng-if=item.icon>{{item.icon}}</wb-icon> <span ng-if=item.title>{{item.title| translate}}</span> </md-button> </md-menu-item> <md-menu-divider ng-if=menu.items.length></md-menu-divider> <md-menu-item> <md-button ng-click=settings()> <span translate=\"\">Settings</span> </md-button> </md-menu-item> <md-menu-item ng-if=!app.user.anonymous> <md-button ng-click=logout()> <span translate=\"\">Logout</span> </md-button> </md-menu-item> <md-menu-item ng-if=app.user.anonymous> <md-button ng-href=users/login> <span translate=\"\">Login</span> </md-button> </md-menu-item> </md-menu-content> </md-menu> </div>"
  );


  $templateCache.put('views/directives/mb-user-toolbar.html',
    "<md-toolbar layout=row layout-align=\"center center\"> <img width=80px class=img-circle ng-src=/api/v2/user/accounts/{{app.user.current.id}}/avatar> <md-menu md-offset=\"0 20\"> <md-button class=capitalize ng-click=$mdOpenMenu() aria-label=\"Open menu\"> <span>{{app.user.profile.first_name}} {{app.user.profile.last_name}}</span> <wb-icon class=material-icons>keyboard_arrow_down</wb-icon> </md-button> <md-menu-content width=3>  <md-menu-item ng-if=menu.items.length ng-repeat=\"item in menu.items | orderBy:['-priority']\"> <md-button ng-click=item.exec($event) translate> <wb-icon ng-if=item.icon>{{item.icon}}</wb-icon> <span ng-if=item.title>{{item.title | translate}}</span> </md-button> </md-menu-item> <md-menu-divider></md-menu-divider> <md-menu-item> <md-button ng-click=toggleRightSidebar();logout();>{{'Logout' | translate}}</md-button> </md-menu-item> </md-menu-content> </md-menu> </md-toolbar>"
  );


  $templateCache.put('views/mb-error-messages.html',
    "<div ng-message=403 layout=column layout-align=\"center center\"> <wb-icon size=64px>do_not_disturb</wb-icon> <strong translate>Access denied</strong> <p translate>You are not allowed to access this item.</p> </div> <div ng-message=404 layout=column layout-align=\"center center\"> <wb-icon size=64px>visibility_off</wb-icon> <strong translate>Not found</strong> <p translate>Requested item not found.</p> </div> <div ng-message=500 layout=column layout-align=\"center center\"> <wb-icon size=64px>bug_report</wb-icon> <strong translate>Server error</strong> <p translate>An internal server error is occurred.</p> </div>"
  );


  $templateCache.put('views/mb-initial.html',
    "<div layout=column flex> <md-content layout=column flex> {{basePath}} <mb-preference-page mb-preference-id=currentStep.id> </mb-preference-page> </md-content> <md-stepper id=setting-stepper ng-show=steps.length md-mobile-step-text=false md-vertical=false md-linear=false md-alternative=true> <md-step ng-repeat=\"step in steps\" md-label=\"{{step.title | translate}}\"> </md-step> </md-stepper> </div>"
  );


  $templateCache.put('views/mb-languages.html',
    "<div ng-controller=\"MbLanguagesCtrl as ctrl\" layout=row flex> <md-sidenav class=md-sidenav-left md-component-id=lanaguage-manager-left md-is-locked-open=true md-whiteframe=4> <md-content> <md-toolbar> <div class=md-toolbar-tools> <label flex translate=\"\">Languages</label> <md-button ng-click=ctrl.addLanguage() class=md-icon-button aria-label=\"Add new language\"> <wb-icon>add</wb-icon> </md-button> <md-button class=md-icon-button aria-label=\"Upload a language\"> <wb-icon>more_vert</wb-icon> </md-button> </div> </md-toolbar> <div> <md-list> <md-list-item ng-repeat=\"lang in app.config.languages\" ng-click=ctrl.setLanguage(lang)> <p translate=\"\">{{lang.title}}</p> <md-button class=md-icon-button ng-click=ctrl.saveAs(lang) aria-label=\"Save language as a file\"> <wb-icon>download</wb-icon> <md-tooltip md-direction=left md-delay=1500> <span translate>Save language as a file</span> </md-tooltip> </md-button> <md-button class=md-icon-button ng-click=ctrl.deleteLanguage(lang) aria-label=\"Delete language\"> <wb-icon>delete</wb-icon> <md-tooltip md-direction=left md-delay=1500> <span translate>Delete language</span> </md-tooltip> </md-button> </md-list-item> </md-list> </div> </md-content> </md-sidenav> <md-content flex mb-preloading=working layout-padding> <div ng-if=!ctrl.selectedLanguage layout-padding> <h3 translate>Select a language to view/edit translations.</h3> </div> <fieldset ng-if=ctrl.selectedLanguage> <legend><span translate=\"\">Selected Language</span></legend> <div layout=row layout-align=\"space-between center\"> <label>{{ctrl.selectedLanguage.title}} ({{ctrl.selectedLanguage.key}})</label>            </div> </fieldset> <fieldset ng-if=ctrl.selectedLanguage class=standard> <legend><span translate=\"\">Language map</span></legend> <div layout=column layout-margin> <md-input-container class=\"md-icon-float md-block\" flex ng-repeat=\"(key, value) in ctrl.selectedLanguage.map\"> <label>{{key}}</label> <input ng-model=ctrl.selectedLanguage.map[key] ng-model-options=\"{ updateOn: 'blur', debounce: 3000 }\"> <wb-icon ng-click=ctrl.deleteWord(key)>delete</wb-icon> </md-input-container> </div> <md-button class=\"md-primary md-raised md-icon-button\" ng-click=ctrl.addWord() aria-label=\"Add word to language\"> <wb-icon>add</wb-icon> </md-button> </fieldset> </md-content> </div>"
  );


  $templateCache.put('views/mb-passowrd-recover.html',
    " <md-toolbar layout-padding>  <h3>Forget Your PassWord ?</h3> </md-toolbar>  <div layout=column layout-padding> <md-input-container> <label>Username or Email</label> <input ng-model=credit.login required> </md-input-container> </div> <div layout=column layout-align=none layout-gt-sm=row layout-align-gt-sm=\"space-between center\" layout-padding> <a ui-sref=login flex-order=1 flex-order-gt-sm=-1>Back To Login Page</a> <md-button flex-order=0 class=\"md-primary md-raised\" ng-click=login(credit)>Send</md-button> </div>"
  );


  $templateCache.put('views/mb-preference.html',
    "<md-content ng-cloak flex> <div layout=row layout-align=\"start center\"> <wb-icon wb-icon-name={{::preference.icon}} size=128> </wb-icon> <div flex> <h1 translate>{{::preference.title}}</h1> <p translate>{{::preference.description}}</p> </div> </div> <mb-preference-page mb-preference-id=preference.id flex> </mb-preference-page> </md-content>"
  );


  $templateCache.put('views/mb-preferences.html',
    "<md-content ng-cloak layout-padding flex> <md-grid-list md-cols-gt-md=3 md-cols=3 md-cols-md=1 md-row-height=4:3 md-gutter-gt-md=16px md-gutter-md=8px md-gutter=4px> <md-grid-tile ng-repeat=\"tile in preferenceTiles\" md-colors=\"{backgroundColor: 'primary-300'}\" md-colspan-gt-sm={{tile.colspan}} md-rowspan-gt-sm={{tile.rowspan}} ng-click=openPreference(tile.page) style=\"cursor: pointer\"> <md-grid-tile-header> <h3 style=\"text-align: center;font-weight: bold\"> <wb-icon>{{tile.page.icon}}</wb-icon> <span translate=\"\">{{tile.page.title}}</span> </h3> </md-grid-tile-header> <p style=\"text-align: justify\" layout-padding translate=\"\">{{tile.page.description}}</p> </md-grid-tile> </md-grid-list> </md-content>"
  );


  $templateCache.put('views/modules/mb-option.html',
    "<div> Module options </div>"
  );


  $templateCache.put('views/modules/mb-preference.html',
    "<div> Module options </div>"
  );


  $templateCache.put('views/modules/mb-resources-manual.html',
    "<md-content layout=column layout-padding flex> <md-input-container class=\"md-icon-float md-icon-right md-block\" required> <label translate>Title</label> <input ng-model=module.title> </md-input-container> <md-input-container class=\"md-icon-float md-icon-right md-block\" required> <label translate>URL</label> <input ng-model=module.url required> </md-input-container> <md-input-container class=\"md-icon-float md-icon-right md-block\" required> <label translate>Type</label> <input ng-model=module.type required placeholder=\"js, css\"> </md-input-container> <md-input-container class=md-block> <label>Load type</label> <md-select ng-model=module.load> <md-option translate=\"\">None</md-option> <md-option ng-value=\"'before'\" translate=\"\">Before Page Load</md-option> <md-option ng-value=\"'lazy'\" translate=\"\">Lazy Load</md-option> <md-option ng-value=\"'after'\" translate=\"\">After Page Load</md-option> </md-select> </md-input-container> </md-content>"
  );


  $templateCache.put('views/options/mb-local.html',
    "<md-divider></md-divider> <md-input-container class=md-block> <label translate>Language & Local</label> <md-select ng-model=app.setting.local> <md-option ng-repeat=\"lang in languages\" ng-value=lang.key>{{lang.title | translate}}</md-option> </md-select> </md-input-container> <md-input-container class=md-block> <label translate>Direction</label> <md-select ng-model=app.setting.dir placeholder=Direction> <md-option value=rtl translate>Right to left</md-option> <md-option value=ltr translate>Left to right</md-option> </md-select> </md-input-container> <md-input-container class=md-block> <label translate>Calendar</label> <md-select ng-model=app.setting.calendar placeholder=\"\"> <md-option value=Gregorian translate>Gregorian</md-option> <md-option value=Jalaali translate>Jalaali</md-option> </md-select> </md-input-container> <md-input-container class=md-block> <label translate>Date format</label> <md-select ng-model=app.setting.dateFormat placeholder=\"\"> <md-option value=jMM-jDD-jYYYY translate> {{'2018-01-01' | mbDate:'jMM-jDD-jYYYY'}} </md-option> <md-option value=jYYYY-jMM-jDD translate> {{'2018-01-01' | mbDate:'jYYYY-jMM-jDD'}} </md-option> <md-option value=\"jYYYY jMMMM jDD\" translate> {{'2018-01-01' | mbDate:'jYYYY jMMMM jDD'}} </md-option> </md-select> </md-input-container>"
  );


  $templateCache.put('views/options/mb-theme.html',
    "<md-input-container class=md-block> <label translate>Theme</label> <md-select ng-model=app.setting.theme> <md-option ng-repeat=\"theme in themes\" value={{theme.id}} translate>{{theme.label}}</md-option> </md-select> </md-input-container> <md-input-container class=md-block ng-init=\"app.setting.navigationPath = app.setting.navigationPath || true\"> <md-switch class=md-primary name=special ng-model=app.setting.navigationPath> <sapn flex translate>Navigation path</sapn> </md-switch> </md-input-container>"
  );


  $templateCache.put('views/partials/mb-branding-header-toolbar.html',
    " <md-toolbar layout=row layout-padding md-colors=\"{backgroundColor: 'primary-100'}\">  <img style=\"max-width: 50%\" height=160 ng-show=app.config.logo ng-src=\"{{app.config.logo}}\"> <div> <h3>{{app.config.title}}</h3> <p>{{ app.config.description | limitTo: 250 }}{{app.config.description.length > 250 ? '...' : ''}}</p> </div> </md-toolbar>"
  );


  $templateCache.put('views/partials/mb-view-access-denied.html',
    "<div id=mb-panel-root-access-denied ng-if=\"status === 'accessDenied'\" layout=column layout-fill> Access Denied </div>"
  );


  $templateCache.put('views/partials/mb-view-loading.html',
    "<div id=mb-view-loading layout=column layout-align=\"center center\" layout-fill> <img width=256px ng-src-error=images/logo.svg ng-src=\"/api/v2/cms/contents/mb-preloading-brand/content\"> <h3>Loading...</h3> <md-progress-linear style=\"width: 50%\" md-mode=indeterminate> </md-progress-linear> <md-button ng-if=\"app.state.status === 'fail'\" class=\"md-raised md-primary\" ng-click=restart() aria-label=Retry> <wb-icon>replay</wb-icon> retry </md-button> </div>"
  );


  $templateCache.put('views/partials/mb-view-login.html',
    "<div ng-if=\"status === 'login'\" layout=row layout-aligne=none layout-align-gt-sm=\"center center\" ng-controller=MbAccountCtrl flex> <div md-whiteframe=3 flex=100 flex-gt-sm=50 layout=column mb-preloading=ctrl.loadUser>  <ng-include src=\"'views/partials/mb-branding-header-toolbar.html'\"></ng-include> <md-progress-linear ng-disabled=\"!(ctrl.loginProcess || ctrl.logoutProcess)\" style=\"margin: 0px; padding: 0px\" md-mode=indeterminate class=md-primary md-color> </md-progress-linear>  <div style=\"text-align: center\" layout-margin ng-show=\"!ctrl.loginProcess && ctrl.loginState === 'fail'\"> <p><span md-colors=\"{color:'warn'}\" translate>{{loginMessage}}</span></p> </div> <form name=ctrl.myForm ng-submit=login(credit) layout=column layout-padding> <md-input-container> <label translate>Username</label> <input ng-model=credit.login name=username required> <div ng-messages=ctrl.myForm.username.$error> <div ng-message=required translate>This field is required.</div> </div> </md-input-container> <md-input-container> <label translate>Password</label> <input ng-model=credit.password type=password name=password required> <div ng-messages=ctrl.myForm.password.$error> <div ng-message=required translate>This field is required.</div> </div> </md-input-container>  <div vc-recaptcha ng-if=\"__tenant.settings['captcha.engine'] === 'recaptcha'\" key=\"__tenant.settings['captcha.engine.recaptcha.key']\" ng-model=credit.g_recaptcha_response theme=\"__app.configs.captcha.theme || 'light'\" type=\"__app.configs.captcha.type || 'image'\" lang=\"__app.setting.local || __app.config.local || 'en'\"> </div> <input hide type=\"submit\"> <div layout=column layout-align=none layout-gt-xs=row layout-align-gt-xs=\"end center\" layout-margin> <a href=users/reset-password style=\"text-decoration: none\" ui-sref=forget flex-order=1 flex-order-gt-xs=-1>{{'forgot your password?'| translate}}</a> <md-button ng-disabled=ctrl.myForm.$invalid flex-order=-1 flex-order-gt-xs=1 class=\"md-primary md-raised\" ng-click=login(credit)>{{'login'| translate}}</md-button>      </div> </form> </div> </div>"
  );


  $templateCache.put('views/partials/mb-view-main.html',
    "<div id=mb-view-main mb-panel-sidenav-anchor layout=row style=\"height: 100vh; width: 100vw\"> <div layout=column flex> <div mb-panel-toolbar-anchor></div> <div layout=row flex id=mb-view-main-anchor></div> </div> </div>"
  );


  $templateCache.put('views/preferences/mb-brand.html',
    "<div layout=column layout-margin ng-cloak flex> <mb-titled-block mb-title=\"{{'Configurations' | translate}}\"> <md-input-container class=md-block> <label translate>Title</label> <input required md-no-asterisk name=title ng-model=\"app.config.title\"> </md-input-container> <md-input-container class=md-block> <label translate>Description</label> <input md-no-asterisk name=description ng-model=\"app.config.description\"> </md-input-container> </mb-titled-block> <div layout=row layout-wrap layout-margin> <mb-titled-block mb-title=\"{{'Brand' | translate}}\"> <mb-inline ng-model=app.config.logo mb-inline-type=image mb-inline-label=\"Application Logo\" mb-inline-enable=true> <img width=256px height=256px ng-src={{app.config.logo}}> </mb-inline> </mb-titled-block> <mb-titled-block mb-title=\"{{'Favicon' | translate }}\"> <mb-inline ng-model=app.config.favicon mb-inline-type=image mb-inline-label=\"Application Favicon\" mb-inline-enable=true> <img width=256px height=256px ng-src={{app.config.favicon}}> </mb-inline> </mb-titled-block> </div> </div>"
  );


  $templateCache.put('views/preferences/mb-google-analytic.html',
    "<div layout=column layout-margin ng-cloak flex> <md-input-container class=md-block> <label>Google analytic property</label> <input required md-no-asterisk name=property ng-model=\"app.config.googleAnalytic.property\"> </md-input-container> </div>"
  );


  $templateCache.put('views/preferences/mb-language.html',
    " <div layout=column layout-align=\"center center\" layout-margin style=\"min-height: 300px\" flex> <div layout=column layout-align=\"center start\"> <p>{{'Select default language of site:' | translate}}</p> <md-checkbox ng-repeat=\"lang in languages\" style=\"margin: 8px\" ng-checked=\"myLanguage.key === lang.key\" ng-click=setLanguage(lang) aria-label={{lang.key}}> {{lang.title | translate}} </md-checkbox> </div> </div>"
  );


  $templateCache.put('views/preferences/mb-local.html',
    "<div layout=column layout-padding ng-cloak flex> <md-input-container class=\"md-icon-float md-block\"> <label translate>Language</label> <md-select ng-model=__app.configs.language> <md-option ng-repeat=\"lang in languages\" ng-value=lang.key>{{lang.title | translate}}</md-option> </md-select> <wb-icon style=\"cursor: pointer\" ng-click=goToManage()>settings</wb-icon> </md-input-container> <md-input-container class=md-block> <label translate>Direction</label> <md-select ng-model=__app.configs.dir placeholder=Direction> <md-option value=rtl translate>Right to left</md-option> <md-option value=ltr translate>Left to right</md-option> </md-select> </md-input-container> <md-input-container class=md-block> <label translate>Calendar</label> <md-select ng-model=__app.configs.calendar placeholder=\"\"> <md-option value=Gregorian translate>Gregorian</md-option> <md-option value=Jalaali translate>Jalaali</md-option> </md-select> </md-input-container> <md-input-container class=md-block> <label translate>Date format</label> <md-select ng-model=__app.configs.dateFormat placeholder=\"\"> <md-option value=jMM-jDD-jYYYY translate> <span translate>Month Day Year, </span> <span translate>Ex. </span> {{'2018-01-01' | mbDate:'jMM-jDD-jYYYY'}} </md-option> <md-option value=jYYYY-jMM-jDD translate> <span translate>Year Month Day, </span> <span translate>Ex. </span> {{'2018-01-01' | mbDate:'jYYYY-jMM-jDD'}} </md-option> <md-option value=\"jYYYY jMMMM jDD\" translate> <span translate>Year Month Day, </span> <span translate>Ex. </span> {{'2018-01-01' | mbDate:'jYYYY jMMMM jDD'}} </md-option> </md-select> </md-input-container> </div>"
  );


  $templateCache.put('views/preferences/mb-modules.html',
    "<div layout=column layout-padding ng-cloak flex> <md-switch class=md-secondary ng-model=app.config.update.showMessage aria-label=\"Show spa update message option\"> <p translate=\"\">Show update message to customers</p> </md-switch> <md-switch class=md-secondary ng-model=app.config.update.autoReload ng-disabled=!app.config.update.showMessage aria-label=\"Automatically reload page option\"> <p translate=\"\">Reload the page automatically on update</p> </md-switch> </div>"
  );


  $templateCache.put('views/preferences/mb-update.html',
    "<div layout=column layout-padding ng-cloak flex> <md-switch class=md-secondary ng-model=app.config.update.showMessage aria-label=\"Show spa update message option\"> <p translate=\"\">Show update message to customers</p> </md-switch> <md-switch class=md-secondary ng-model=app.config.update.autoReload ng-disabled=!app.config.update.showMessage aria-label=\"Automatically reload page option\"> <p translate=\"\">Reload the page automatically on update</p> </md-switch> </div>"
  );


  $templateCache.put('views/resources/mb-accounts.html',
    "<div ng-controller=\"MbSeenUserAccountsCtrl as ctrl\" ng-init=\"ctrl.setDataQuery('{id, login, is_active, date_joined, last_login, profiles{first_name,last_name}, avatars{id}}')\" mb-preloading=\"ctrl.state === 'busy'\" layout=column flex> <mb-pagination-bar mb-model=ctrl.queryParameter mb-properties=ctrl.properties mb-reload=ctrl.reload() mb-more-actions=ctrl.getActions()> </mb-pagination-bar> <md-content mb-infinate-scroll=ctrl.loadNextPage() layout=column flex> <md-list flex> <md-list-item ng-repeat=\"user in ctrl.items track by user.id\" ng-click=\"multi || resourceCtrl.setSelected(user)\" class=md-3-line> <img class=md-avatar ng-src=/api/v2/user/accounts/{{::user.id}}/avatar ng-src-error=\"https://www.gravatar.com/avatar/{{ ::user.id | wbmd5 }}?d=identicon&size=32\"> <div class=md-list-item-text layout=column> <h4>{{user.login}}</h4> <h3>{{user.profiles[0].first_name}} {{user.profiles[0].last_name}}</h3> </div> <md-checkbox ng-if=multi class=md-secondary ng-init=\"user.selected = resourceCtrl.isSelected(user)\" ng-model=user.selected ng-change=\"resourceCtrl.setSelected(user, user.selected)\"> </md-checkbox> <md-divider md-inset></md-divider> </md-list-item> </md-list> </md-content> </div>"
  );


  $templateCache.put('views/resources/mb-cms-content-upload.html',
    "<div layout=column flex> <lf-ng-md-file-input lf-files=ctrl.files accept=image/* progress preview drag flex> </lf-ng-md-file-input>  <md-content layout-padding> <div layout=row> <md-checkbox ng-model=_absolutPathFlag ng-change=ctrl.setAbsolute(_absolutPathFlag) aria-label=\"Absolute path of the image\"> <span translate>Absolute path</span> </md-checkbox> </div> </md-content> </div>"
  );


  $templateCache.put('views/resources/mb-cms-images.html',
    "<div layout=column mb-preloading=\"ctrl.state === 'busy'\" ng-init=\"ctrl.addFilter('media_type', 'image')\" flex> <mb-pagination-bar style=\"border-top-right-radius: 10px; border-bottom-left-radius: 10px\" mb-model=ctrl.queryParameter mb-properties=ctrl.properties mb-reload=ctrl.reload() mb-more-actions=ctrl.getActions()> </mb-pagination-bar> <md-content mb-infinate-scroll=ctrl.loadNextPage() layout=row layout-wrap layout-align=\"start start\" flex> <div ng-click=\"ctrl.setSelected(pobject, $index, $event);\" ng-repeat=\"pobject in ctrl.items track by pobject.id\" style=\"border: 16px; border-style: solid; border-width: 1px; margin: 8px\" md-colors=\"ctrl.isSelected($index) ? {borderColor:'accent'} : {}\" ng-if=!listViewMode> <img style=\"width: 128px; height: 128px\" ng-src=\"{{'/api/v2/cms/contents/'+pobject.id+'/thumbnail'}}\"> </div> <md-list ng-if=listViewMode> <md-list-item ng-repeat=\"pobject in items track by pobject.id\" ng-click=\"ctrl.setSelected(pobject, $index, $event);\" md-colors=\"ctrl.isSelected($index) ? {background:'accent'} : {}\" class=md-3-line> <img ng-if=\"pobject.mime_type.startsWith('image/')\" style=\"width: 128px; height: 128px\" ng-src=/api/v2/cms/contents/{{pobject.id}}/thumbnail> <wb-icon ng-if=\"!pobject.mime_type.startsWith('image/')\">insert_drive_file</wb-icon> <div class=md-list-item-text layout=column> <h3>{{pobject.title}}</h3> <h4>{{pobject.name}}</h4> <p>{{pobject.description}}</p> </div> <md-divider md-inset></md-divider> </md-list-item> </md-list>  <div layout=column layout-align=\"center center\"> <md-progress-circular ng-show=\"ctrl.status === 'working'\" md-diameter=96> Loading ... </md-progress-circular> </div> </md-content> <md-content>  <div layout-padding layout=row> <md-checkbox ng-model=_absolutPathFlag ng-change=ctrl.setAbsolute(absolutPathFlag) aria-label=\"Absolute path of the image\"> <span translate>Absolute path</span> </md-checkbox> </div> </md-content> </div>"
  );


  $templateCache.put('views/resources/mb-groups.html',
    "<div ng-controller=\"MbSeenUserGroupsCtrl as ctrl\" mb-preloading=\"ctrl.state === 'busy'\" layout=column flex> <mb-pagination-bar mb-model=ctrl.queryParameter mb-properties=ctrl.properties mb-reload=ctrl.reload() mb-more-actions=ctrl.getActions()> </mb-pagination-bar> <md-content mb-infinate-scroll=ctrl.loadNextPage() layout=column flex> <md-list flex> <md-list-item ng-repeat=\"group in ctrl.items track by group.id\" ng-click=\"multi || resourceCtrl.setSelected(group)\" class=md-3-line> <wb-icon>group</wb-icon> <div class=md-list-item-text layout=column> <h3>{{group.name}}</h3> <h4></h4> <p>{{group.description}}</p> </div> <md-checkbox ng-if=multi class=md-secondary ng-init=\"group.selected = resourceCtrl.isSelected(group)\" ng-model=group.selected ng-click=\"resourceCtrl.setSelected(group, group.selected)\"> </md-checkbox> <md-divider md-inset></md-divider> </md-list-item>  </md-list> </md-content> </div>"
  );


  $templateCache.put('views/resources/mb-language-custome.html',
    "<form layout-margin layout=column ng-submit=$event.preventDefault() name=searchForm> <md-autocomplete flex required md-input-name=Language md-selected-item=language md-search-text=resourceCtrl.searchText md-items=\"item in resourceCtrl.querySearch(resourceCtrl.searchText)\" md-item-text=item.key md-require-match=\"\" md-floating-label=Key input-aria-describedby=\"Language Key\"> <md-item-template> <span md-highlight-text=resourceCtrl.searchText>{{item.title}} ({{item.key}})</span> </md-item-template> <div ng-messages=searchForm.autocompleteField.$error ng-if=searchForm.autocompleteField.$touched> <div ng-message=required>You <b>must</b> have a language key.</div> <div ng-message=md-require-match>Please select an existing language.</div> <div ng-message=minlength>Your entry is not long enough.</div> <div ng-message=maxlength>Your entry is too long.</div> </div> </md-autocomplete> <md-input-container> <label translate>Title</label> <input ng-model=language.title> </md-input-container> </form>"
  );


  $templateCache.put('views/resources/mb-language-list.html',
    "<md-list flex> <md-list-item class=md-3-line ng-repeat=\"item in languages\" ng-click=resourceCtrl.setLanguage(item)> <wb-icon>language</wb-icon> <div class=md-list-item-text layout=column> <h3>{{ item.key }}</h3> <h4>{{ item.title }}</h4> <p>{{ item.description }}</p> </div> </md-list-item> </md-list>"
  );


  $templateCache.put('views/resources/mb-language-upload.html',
    "<form layout-margin layout=column ng-submit=$event.preventDefault() name=searchForm> <lf-ng-md-file-input name=files lf-files=files lf-required lf-maxcount=5 lf-filesize=10MB lf-totalsize=20MB drag preview> </lf-ng-md-file-input> </form>"
  );


  $templateCache.put('views/resources/mb-local-file.html',
    "<div layout=column layout-padding flex> <lf-ng-md-file-input lf-files=resourceCtrl.files accept=\"{{style.accept || '*'}}\" progress preview drag flex> </lf-ng-md-file-input> </div>"
  );


  $templateCache.put('views/resources/mb-roles.html',
    "<div ng-controller=\"MbSeenUserRolesCtrl as ctrl\" mb-preloading=\"ctrl.state === 'busy'\" layout=column flex> <mb-pagination-bar mb-model=ctrl.queryParameter mb-properties=ctrl.properties mb-reload=ctrl.reload() mb-more-actions=ctrl.getActions()> </mb-pagination-bar> <md-content mb-infinate-scroll=ctrl.loadNextPage() layout=column flex> <md-list flex> <md-list-item ng-repeat=\"role in ctrl.items track by role.id\" ng-click=\"multi || resourceCtrl.selectRole(role)\" class=md-3-line> <wb-icon>accessibility</wb-icon> <div class=md-list-item-text layout=column> <h3>{{role.name}}</h3> <p>{{role.description}}</p> </div> <md-checkbox class=md-secondary ng-init=\"role.selected = resourceCtrl.isSelected(role)\" ng-model=role.selected ng-click=\"resourceCtrl.setSelected(role, role.selected)\"> </md-checkbox> <md-divider md-inset></md-divider> </md-list-item> </md-list> </md-content> </div>"
  );


  $templateCache.put('views/resources/mb-sidenav.html',
    ""
  );


  $templateCache.put('views/resources/mb-term-taxonomies.html',
    "<div ng-controller=\"MbSeenCmsTermTaxonomiesCtrl as ctrl\" ng-init=\"ctrl.setDataQuery('{id, taxonomy, term{id, name, metas{key,value}}}')\" mb-preloading=\"ctrl.state === 'busy'\" layout=column flex> <mb-pagination-bar mb-model=ctrl.queryParameter mb-properties=ctrl.properties mb-reload=ctrl.reload() mb-more-actions=ctrl.getActions()> </mb-pagination-bar> <md-content mb-infinate-scroll=ctrl.loadNextPage() layout=column flex> <md-list flex> <md-list-item ng-repeat=\"termTaxonomy in ctrl.items track by termTaxonomy.id\" ng-click=\"multi || resourceCtrl.selectRole(termTaxonomy)\" class=md-3-line> <wb-icon>label</wb-icon> <div class=md-list-item-text layout=column> <h3>{{termTaxonomy.term.name}}</h3> <p>{{termTaxonomy.description}}</p> <p>{{termTaxonomy.taxonomy}}</p> </div> <md-checkbox class=md-secondary ng-init=\"termTaxonomy.selected = resourceCtrl.isSelected(termTaxonomy)\" ng-model=termTaxonomy.selected ng-click=\"resourceCtrl.setSelected(termTaxonomy, termTaxonomy.selected)\"> </md-checkbox> <md-divider md-inset></md-divider> </md-list-item> </md-list> </md-content> </div>"
  );


  $templateCache.put('views/resources/wb-event-code-editor.html',
    "<div layout=column layout-fill> <md-toolbar> <div class=md-toolbar-tools layout=row> <span flex></span> <md-select ng-model=value.language ng-change=ctrl.setLanguage(value.language) class=md-no-underline> <md-option ng-repeat=\"l in value.languages track by $index\" ng-value=l.value> {{l.text}} </md-option> </md-select> </div> </md-toolbar> <md-content flex> <div style=\"min-height: 100%; min-width: 100%\" index=0 id=am-wb-resources-script-editor> </div> </md-content> </div>"
  );


  $templateCache.put('views/resources/wb-url.html',
    "<div layout=column layout-padding flex> <p translate>Insert a valid URL, please.</p> <md-input-container class=\"md-icon-float md-block\"> <label translate>URL</label> <input ng-model=value> </md-input-container> </div>"
  );


  $templateCache.put('views/sidenavs/mb-help.html',
    "<md-toolbar class=md-hue-1 layout=column layout-align=center> <div layout=row layout-align=\"start center\"> <md-button class=md-icon-button aria-label=Close ng-click=closeHelp()> <wb-icon>close</wb-icon> </md-button> <span flex></span> <h4 translate>Help</h4> </div> </md-toolbar> <md-content mb-preloading=helpLoading layout-padding flex> <wb-group ng-model=helpContent> </wb-group> </md-content>"
  );


  $templateCache.put('views/sidenavs/mb-messages.html',
    "<div mb-preloading=\"ctrl.state === 'busy'\" layout=column flex>  <mb-pagination-bar mb-title=Messages mb-model=ctrl.queryParameter mb-reload=ctrl.reload() mb-sort-keys=ctrl.getSortKeys() mb-more-actions=ctrl.getMoreActions()> </mb-pagination-bar> <md-content mb-infinate-scroll=ctrl.loadNextPage() layout=column flex> <md-list flex> <md-list-item ng-repeat=\"message in ctrl.items track by message.id\" class=md-3-line> <wb-icon ng-class=\"\">mail</wb-icon> <div class=md-list-item-text> <p>{{::message.message}}</p> </div> <md-button class=\"md-secondary md-icon-button\" ng-click=ctrl.deleteItem(message) aria-label=remove> <wb-icon>delete</wb-icon> </md-button> <md-divider md-inset></md-divider> </md-list-item> </md-list> </md-content> </div>"
  );


  $templateCache.put('views/sidenavs/mb-navigator.html',
    "<md-toolbar class=\"md-whiteframe-z2 mb-navigation-top-toolbar\" layout=column layout-align=\"start center\"> <img width=128px height=128px ng-show=app.config.logo ng-src={{app.config.logo}} ng-src-error=images/logo.svg style=\"min-height: 128px; min-width: 128px\"> <strong>{{app.config.title}}</strong> <p style=\"text-align: center\">{{ app.config.description | limitTo: 100 }}{{app.config.description.length > 150 ? '...' : ''}}</p> </md-toolbar> <md-content class=mb-sidenav-main-menu md-colors=\"{backgroundColor: 'primary'}\" flex> <mb-tree mb-section=menuItems> </mb-tree> </md-content>"
  );


  $templateCache.put('views/sidenavs/mb-options.html',
    " <mb-user-toolbar mb-actions=userActions> </mb-user-toolbar>  <md-content layout-padding> <mb-dynamic-tabs mb-tabs=tabs> </mb-dynamic-tabs> </md-content>"
  );


  $templateCache.put('views/toolbars/mb-dashboard.html',
    "<div layout=row layout-align=\"start center\" itemscope itemtype=http://schema.org/WPHeader> <md-button class=md-icon-button hide-gt-sm ng-click=toggleNavigationSidenav() aria-label=Menu> <wb-icon>menu</wb-icon> </md-button> <img hide-gt-sm height=32px ng-if=app.config.logo ng-src=\"{{app.config.logo}}\"> <strong hide-gt-sm style=\"padding: 0px 8px 0px 8px\"> {{app.config.title}} </strong> <mb-navigation-bar hide show-gt-sm ng-show=\"app.setting.navigationPath !== false\"> </mb-navigation-bar> </div> <div layout=row layout-align=\"end center\">  <md-button ng-repeat=\"menu in scopeMenu.items | orderBy:['-priority']\" ng-show=menu.visible() ng-href={{menu.url}} ng-click=menu.exec($event); class=md-icon-button> <md-tooltip ng-if=menu.tooltip md-delay=1500>{{menu.description}}</md-tooltip> <wb-icon ng-if=menu.icon>{{menu.icon}}</wb-icon> </md-button> <md-divider ng-if=scopeMenu.items.length></md-divider> <md-button ng-repeat=\"menu in toolbarMenu.items | orderBy:['-priority']\" ng-show=menu.visible() ng-href={{menu.url}} ng-click=menu.exec($event); class=md-icon-button> <md-tooltip ng-if=\"menu.tooltip || menu.description\" md-delay=1500>{{menu.description | translate}}</md-tooltip> <wb-icon ng-if=menu.icon>{{menu.icon}}</wb-icon> </md-button> <md-button ng-show=messageCount ng-click=toggleMessageSidenav() style=\"overflow: visible\" class=md-icon-button> <md-tooltip md-delay=1500> <span translate=\"\">Display list of messages</span> </md-tooltip> <wb-icon mb-badge={{messageCount}} mb-badge-fill=accent>notifications</wb-icon> </md-button> <mb-user-menu></mb-user-menu> <md-button ng-repeat=\"menu in userMenu.items | orderBy:['-priority']\" ng-show=menu.visible() ng-click=menu.exec($event) class=md-icon-button> <md-tooltip ng-if=menu.tooltip md-delay=1500>{{menu.tooltip}}</md-tooltip> <wb-icon ng-if=menu.icon>{{menu.icon}}</wb-icon> </md-button> </div>"
  );


  $templateCache.put('views/users/mb-account.html',
    "<md-content mb-preloading=ctrl.loadingUser class=md-padding layout-padding flex> <div layout-gt=row>  <mb-titled-block mb-title=Account mb-progress=ctrl.avatarLoading flex-gt-sm=50> <div layout=column> <md-input-container> <label translate>ID</label> <input ng-model=ctrl.user.id disabled> </md-input-container> <md-input-container> <label translate>Username</label> <input ng-model=ctrl.user.login disabled> </md-input-container> <md-input-container> <label translate>Email</label> <input ng-model=ctrl.user.email type=email disabled> </md-input-container> </div> </mb-titled-block> </div> </md-content>"
  );


  $templateCache.put('views/users/mb-forgot-password.html',
    " <md-content layout=row layout-align=none layout-align-gt-sm=\"center center\" flex> <div md-whiteframe=3 style=\"max-height: none\" flex=100 flex-gt-sm=50 layout=column>  <ng-include src=\"'views/partials/mb-branding-header-toolbar.html'\"></ng-include> <md-progress-linear ng-disabled=!ctrl.sendingToken style=\"margin: 0px; padding: 0px\" md-mode=indeterminate class=md-primary md-color> </md-progress-linear>  <div layout-margin> <h3 translate>recover password</h3> <p translate>recover password description</p> </div> <div style=\"text-align: center\" layout-margin ng-show=!ctrl.sendingToken> <span ng-show=\"ctrl.sendTokenState === 'fail'\" md-colors=\"{color:'warn'}\" translate>Failed to send token.</span> <span ng-show=\"ctrl.sendTokenState === 'success'\" md-colors=\"{color:'primary'}\" translate>Token is sent.</span> </div> <form name=ctrl.myForm ng-submit=sendToken(credit) layout=column layout-margin> <md-input-container> <label translate>Username</label> <input ng-model=credit.login name=username> </md-input-container> <md-input-container> <label translate>Email</label> <input ng-model=credit.email name=email type=email> <div ng-messages=ctrl.myForm.email.$error> <div ng-message=email translate>Email is not valid.</div> </div> </md-input-container>     <div ng-if=\"app.captcha.engine==='recaptcha'\" vc-recaptcha ng-model=credit.g_recaptcha_response theme=\"app.captcha.theme || 'light'\" type=\"app.captcha.type || 'image'\" key=app.captcha.recaptcha.key lang=\"app.captcha.language || 'fa'\"> </div> <input hide type=\"submit\"> </form> <div layout=column layout-align=\"center none\" layout-gt-xs=row layout-align-gt-xs=\"end center\" layout-margin> <md-button ng-disabled=\"(credit.email === undefined && credit.login === undefined) || ctrl.myForm.$invalid\" flex-order=0 flex-order-gt-xs=1 class=\"md-primary md-raised\" ng-click=sendToken(credit)>{{'send recover message' | translate}}</md-button>     <md-button ng-click=cancel() flex-order=0 flex-order-gt-xs=0 class=md-raised> {{'cancel' | translate}} </md-button> </div> </div> </md-content>"
  );


  $templateCache.put('views/users/mb-login.html',
    " <md-content layout=row layout-align=none layout-align-gt-sm=\"center center\" flex> <div md-whiteframe=3 style=\"max-height: none\" flex=100 flex-gt-sm=50 layout=column>  <ng-include src=\"'views/partials/mb-branding-header-toolbar.html'\"></ng-include> <md-progress-linear ng-disabled=\"!(ctrl.loginProcess || ctrl.logoutProcess)\" style=\"margin: 0px; padding: 0px\" md-mode=indeterminate class=md-primary md-color> </md-progress-linear>  <div style=\"text-align: center\" layout-margin ng-show=\"!ctrl.loginProcess && ctrl.loginState === 'fail'\"> <p><span md-colors=\"{color:'warn'}\" translate>{{loginMessage}}</span></p> </div> <form ng-show=app.user.anonymous name=ctrl.myForm ng-submit=ctrl.login(credit) layout=column layout-margin> <md-input-container> <label translate=\"\">Username</label> <input ng-model=credit.login name=username required> <div ng-messages=ctrl.myForm.username.$error> <div ng-message=required translate=\"\">This field is required.</div> </div> </md-input-container> <md-input-container> <label translate=\"\">Password</label> <input ng-model=credit.password type=password name=password required> <div ng-messages=ctrl.myForm.password.$error> <div ng-message=required translate>This field is required.</div> </div> </md-input-container>  <div vc-recaptcha ng-if=\"__tenant.settings['captcha.engine'] === 'recaptcha'\" key=\"__tenant.settings['captcha.engine.recaptcha.key']\" ng-model=credit.g_recaptcha_response theme=\"__app.configs.captcha.theme || 'light'\" type=\"__app.configs.captcha.type || 'image'\" lang=\"__app.setting.local || __app.config.local || 'en'\"> </div> <input hide type=\"submit\"> <div layout=column layout-align=\"center none\" layout-gt-xs=row layout-align-gt-xs=\"end center\" layout-margin> <a href=users/reset-password style=\"text-decoration: none\" ui-sref=forget flex-order=1 flex-order-gt-xs=-1> <span translate>Forgot your password?</span> </a> <md-button ng-disabled=ctrl.myForm.$invalid flex-order=-1 flex-order-gt-xs=1 class=\"md-primary md-raised\" ng-click=\"ctrl.login(credit, ctrl.myForm)\"> <span translate>Login</span> </md-button></div> </form> <div layout-margin ng-show=!app.user.anonymous layout=column layout-align=\"none center\"> <img width=150px height=150px ng-show=!uploadAvatar ng-src=\"{{app.user.current.avatar}}\"> <h3>{{app.user.current.login}}</h3> <p translate>you are logged in. go to one of the following options.</p> </div> <div ng-show=!app.user.anonymous layout=column layout-align=none layout-gt-xs=row layout-align-gt-xs=\"center center\" layout-margin> <md-button ng-click=ctrl.cancel() flex-order=0 flex-order-gt-xs=0 class=md-raised> <wb-icon>settings_backup_restore</wb-icon> <span translate>Back</span> </md-button> <md-button ng-href=users/account flex-order=1 flex-order-gt-xs=-1 class=md-raised> <wb-icon>account_circle</wb-icon> <span translate>Account</span> </md-button> </div> </div> </md-content>"
  );


  $templateCache.put('views/users/mb-password.html',
    "<md-content class=md-padding layout-padding flex>  <mb-titled-block mb-title=\"Change password\" mb-progress=ctrl.changingPassword flex-gt-sm=50> <p translate>Insert current password and new password to change it.</p> <form name=ctrl.passForm ng-submit=\"ctrl.changePassword(data, ctrl.passForm)\" layout=column layout-padding> <input hide type=\"submit\"> <div style=\"text-align: center\" layout-margin ng-show=\"!ctrl.changingPassword && changePassMessage\"> <p><span md-colors=\"{color:'warn'}\" translate>{{changePassMessage}}</span></p> </div> <md-input-container layout-fill> <label translate>current password</label> <input name=oldPass ng-model=data.oldPass type=password required> <div ng-messages=ctrl.passForm.oldPass.$error> <div ng-message=required translate>This field is required.</div> </div> </md-input-container> <md-input-container layout-fill> <label translate>new password</label> <input name=newPass ng-model=data.newPass type=password required> <div ng-messages=ctrl.passForm.newPass.$error> <div ng-message=required translate>This field is required.</div> </div> </md-input-container> <md-input-container layout-fill> <label translate>repeat new password</label> <input name=newPass2 ng-model=newPass2 type=password compare-to=data.newPass required> <div ng-messages=ctrl.passForm.newPass2.$error> <div ng-message=required translate>This field is required.</div> <div ng-message=compareTo translate>password is not match.</div> </div> </md-input-container> <div layout=column layout-align=\"center none\" layout-gt-xs=row layout-align-gt-xs=\"end center\"> <md-button class=\"md-raised md-primary\" ng-click=\"ctrl.changePassword(data, ctrl.passForm)\" ng-disabled=ctrl.passForm.$invalid> <span translate>Change password</span> </md-button> </div> </form> </mb-titled-block>  </md-content>"
  );


  $templateCache.put('views/users/mb-profile.html',
    "<md-content layout-gt-sm=row layout=column style=\"width: 100%; height: fit-content\">  <mb-titled-block flex-gt-sm=50 mb-title=Avatar mb-progress=ctrl.avatarLoading layout=column style=\"margin: 8px\"> <div flex layout=column layout-fill> <div layout=row style=\"flex-grow: 1; min-height: 100px\" layout-align=\"center center\"> <lf-ng-md-file-input style=\"flex-grow: 1; padding: 10px\" ng-show=\"ctrl.avatarState === 'edit'\" lf-files=ctrl.avatarFiles accept=image/* progress preview drag> </lf-ng-md-file-input> <img style=\"max-width: 300px; max-height: 300px; min-width: 24px; min-height: 24px\" ng-if=\"ctrl.avatarState === 'normal'\" ng-src=/api/v2/user/accounts/{{ctrl.user.id}}/avatar ng-src-error=\"https://www.gravatar.com/avatar/{{app.user.current.id|wbmd5}}?d=identicon&size=32\"> </div> <div style=\"flex-grow:0; min-height: 40px\"> <div layout=column layout-align=\"center none\" style=\"flex-grow: 0\" layout-gt-xs=row layout-align-gt-xs=\"end center\" ng-if=\"ctrl.avatarState === 'normal'\"> <md-button class=\"md-raised md-primary\" ng-click=ctrl.editAvatar()> <sapn translate=\"\">Edit</sapn> </md-button> <md-button class=\"md-raised md-accent\" ng-click=ctrl.deleteAvatar()> <sapn translate=\"\">Delete</sapn> </md-button> </div> <div style=\"flex-grow: 0\" layout=column layout-align=\"center none\" layout-gt-xs=row layout-align-gt-xs=\"end center\" ng-if=\"ctrl.avatarState === 'edit'\"> <md-button class=\"md-raised md-primary\" ng-click=ctrl.uploadAvatar(ctrl.avatarFiles)> <sapn translate=\"\">Save</sapn> </md-button> <md-button class=\"md-raised md-accent\" ng-click=ctrl.cancelEditAvatar()> <sapn translate=\"\">Cancel</sapn> </md-button> </div> </div> </div> </mb-titled-block>  <mb-titled-block flex-gt-sm=50 mb-title=\"Public Information\" mb-progress=\"ctrl.loadingProfile || ctrl.savingProfile\" layout=column style=\"margin: 8px\"> <form name=contactForm layout=column layout-padding> <md-input-container layout-fill> <label translate=\"\">First Name</label> <input ng-model=ctrl.profile.first_name> </md-input-container> <md-input-container layout-fill> <label translate=\"\">Last Name</label> <input ng-model=ctrl.profile.last_name> </md-input-container> <md-input-container layout-fill> <label translate=\"\">Public Email</label> <input name=email ng-model=ctrl.profile.public_email type=email> </md-input-container> <md-input-container layout-fill> <label translate=\"\">Language</label> <input ng-model=ctrl.profile.language> </md-input-container> <md-input-container layout-fill> <label translate=\"\">Timezone</label> <input ng-model=ctrl.profile.timezone> </md-input-container> </form> <div layout=column layout-align=\"center none\" layout-gt-xs=row layout-align-gt-xs=\"end center\"> <md-button class=\"md-raised md-primary\" ng-click=save()> <sapn translate=\"\">Update</sapn> </md-button> </div> </mb-titled-block> </md-content>"
  );


  $templateCache.put('views/users/mb-recover-password.html',
    " <md-content layout=row layout-align=none layout-align-gt-sm=\"center center\" flex> <div md-whiteframe=3 style=\"max-height: none\" flex=100 flex-gt-sm=50 layout=column>  <ng-include src=\"'views/partials/mb-branding-header-toolbar.html'\"></ng-include> <md-progress-linear ng-disabled=!ctrl.changingPass style=\"margin: 0px; padding: 0px\" md-mode=indeterminate class=md-primary md-color> </md-progress-linear>  <div layout-margin> <h3 translate>reset password</h3> <p translate>reset password description</p> </div> <div style=\"text-align: center\" layout-margin ng-show=!ctrl.changingPass> <span ng-show=\"ctrl.changePassState === 'fail'\" md-colors=\"{color:'warn'}\" translate>Failed to reset password.</span> <span ng-show=\"ctrl.changePassState === 'fail'\" md-colors=\"{color:'warn'}\" translate>{{$scope.changePassMessage}}</span> <span ng-show=\"ctrl.changePassState === 'success'\" md-colors=\"{color:'primary'}\" translate>Password is reset.</span> </div> <form name=ctrl.myForm ng-submit=changePassword(data) layout=column layout-margin> <md-input-container> <label translate>Token</label> <input ng-model=data.token name=token required> <div ng-messages=ctrl.myForm.token.$error> <div ng-message=required translate>This field is required.</div> </div> </md-input-container> <md-input-container> <label translate>New password</label> <input ng-model=data.password name=password type=password required> <div ng-messages=ctrl.myForm.password.$error> <div ng-message=required translate>This field is required.</div> </div> </md-input-container> <md-input-container> <label translate>Repeat new password</label> <input name=password2 ng-model=repeatPassword type=password compare-to=data.password required> <div ng-messages=ctrl.myForm.password2.$error> <div ng-message=required translate>This field is required.</div> <div ng-message=compareTo translate>Passwords is not match.</div> </div> </md-input-container> <input hide type=\"submit\"> </form> <div layout=column layout-align=\"center none\" layout-gt-xs=row layout-align-gt-xs=\"end center\"> <md-button ng-disabled=ctrl.myForm.$invalid flex-order=0 flex-order-gt-xs=1 class=\"md-primary md-raised\" ng-click=changePassword(data)>{{'change password' | translate}}</md-button>     <md-button ng-click=cancel() flex-order=0 flex-order-gt-xs=0 class=md-raised> {{'cancel' | translate}} </md-button> </div> </div> </md-content>"
  );

}]);
