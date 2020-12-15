angular.module('mblowfish-core').run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('views/dialogs/mb-alert.html',
    "<md-dialog mb-local layout=column ng-cloak> <md-toolbar> <div class=md-toolbar-tools> <mb-icon>error</mb-icon> <h2 mb-translate>{{app.title}}</h2> <span flex></span> <md-button class=md-icon-button ng-click=cancel() aria-label=close> <mb-icon aria-label=\"Close dialog\">close</mb-icon> </md-button> </div> </md-toolbar> <md-dialog-content layout=row layout-padding layout-align=\"center center\" flex> <p mb-translate>{{config.message}}</p> </md-dialog-content> </md-dialog>"
  );


  $templateCache.put('views/dialogs/mb-confirm.html',
    "<md-dialog mb-local layout=column ng-cloak> <md-toolbar> <div class=md-toolbar-tools> <mb-icon>warning</mb-icon> <h2 mb-translate>{{app.title}}</h2> <span flex></span> <md-button class=md-icon-button ng-click=answer(true) aria-label=done> <mb-icon aria-label=Done>done</mb-icon> </md-button> <md-button class=md-icon-button ng-click=cancel() aria-label=close> <mb-icon aria-label=\"Close dialog\">close</mb-icon> </md-button> </div> </md-toolbar> <md-dialog-content layout=row layout-padding layout-align=\"center center\" flex> <p mb-translate>{{config.message}}</p> </md-dialog-content> </md-dialog>"
  );


  $templateCache.put('views/dialogs/mb-dynamic-form.html',
    "<md-dialog mb-local layout=column ng-cloak flex=50> <md-toolbar> <div class=md-toolbar-tools> <h2 mb-translate=\"\">{{::style.title}}</h2> <span flex></span> <md-button class=md-icon-button ng-click=\"answer(data, $event)\" ng-disabled=myForm.$invalid> <mb-icon aria-label=\"Close dialog\">done</mb-icon> </md-button> <md-button class=md-icon-button ng-click=cancel($event)> <mb-icon aria-label=\"Close dialog\">close</mb-icon> </md-button> </div> </md-toolbar> <md-dialog-content layout-padding> <mb-dynamic-form ng-model=data mb-parameters=schema.children> </mb-dynamic-form> </md-dialog-content> </md-dialog>"
  );


  $templateCache.put('views/dialogs/mb-prompt.html',
    "<md-dialog mb-local layout=column ng-cloak> <md-toolbar> <div class=md-toolbar-tools> <mb-icon>input</mb-icon> <h2 mb-translate>{{app.title}}</h2> <span flex></span> <md-button class=md-icon-button ng-click=answer(config.model) aria-label=done> <mb-icon aria-label=Done>done</mb-icon> </md-button> <md-button class=md-icon-button ng-click=cancel() aria-label=close> <mb-icon aria-label=\"Close dialog\">close</mb-icon> </md-button> </div> </md-toolbar> <md-dialog-content layout=column layout-padding layout-align=\"center stretch\" flex> <p mb-translate>{{config.message}}</p> <md-input-container class=md-block> <label mb-translate>Input value</label> <input ng-model=config.model aria-label=\"input value\"> </md-input-container> </md-dialog-content> </md-dialog>"
  );


  $templateCache.put('views/dialogs/mbl-add-word.html',
    "<md-dialog mb-local ng-cloak> <md-toolbar> <div class=md-toolbar-tools> <h2 mb-translate>Add new word</h2> <span flex></span> <md-button class=md-icon-button ng-click=cancel()> <mb-icon aria-label=\"Close dialog\">close</mb-icon> </md-button> <md-button class=md-icon-button ng-click=answer(word)> <mb-icon aria-label=\"Close dialog\">done</mb-icon> </md-button> </div> </md-toolbar> <md-dialog-content layout=column layout-align=\"center stretch\" layout-padding flex> <span flex=10></span> <md-input-container class=md-block flex-gt-sm> <label mb-translate=\"\">Key</label> <input ng-model=word.key> </md-input-container> <md-input-container class=md-block flex-gt-sm> <label mb-translate=\"\">mb-translate</label> <input ng-model=word.mb-translate> </md-input-container> </md-dialog-content> </md-dialog>"
  );


  $templateCache.put('views/dialogs/mbl-update-language.html',
    "<md-dialog mb-local ng-cloak> <md-toolbar> <div class=md-toolbar-tools> <h2 mb-translate>{{::config.title}}</h2> <span flex></span> <md-button class=md-icon-button ng-click=cancel()> <mb-icon aria-label=\"Close dialog\">close</mb-icon> </md-button> <md-button class=md-icon-button ng-click=answer(config.language)> <mb-icon aria-label=\"Close dialog\">done</mb-icon> </md-button> </div> </md-toolbar> <md-dialog-content layout=column layout-align=\"center stretch\" layout-padding flex> <div layout=column> <md-input-container> <label mb-translate>Key</label> <input ng-model=config.language.key ng-readonly=true> </md-input-container> <md-input-container> <label mb-translate>Title</label> <input ng-model=config.language.title ng-readonly=true> </md-input-container> </div> </md-dialog-content> </md-dialog>"
  );


  $templateCache.put('views/dialogs/wb-select-resource-single-page.html',
    "<md-dialog mb-local aria-label=\"Select item/items\" style=\"width:50%; height:70%\"> <form ng-cloak layout=column flex>  <md-progress-linear ng-style=\"{'visibility': ctrl.isBusy?'visible':'hidden'}\" md-mode=indeterminate class=md-primary> </md-progress-linear> <md-dialog-content flex layout=row> <div layout=column flex> <div id=wb-select-resource-children style=\"margin: 0px; padding: 0px; overflow: auto\" layout=column flex> </div> </div> </md-dialog-content> <md-dialog-actions layout=row> <span flex></span> <md-button ng-click=ctrl.cancel() aria-label=Cancel> <span mb-translate=\"\">Close</span> </md-button> <md-button class=md-primary aria-label=Done ng-click=ctrl.answer()> <span mb-translate=\"\">Ok</span> </md-button> </md-dialog-actions> </form> </md-dialog>"
  );


  $templateCache.put('views/dialogs/wb-select-resource.html',
    "<md-dialog mb-local aria-label=\"Select item/items\" style=\"width:70%; height:70%\"> <form ng-cloak layout=column flex>  <md-progress-linear ng-style=\"{'visibility': ctrl.isBusy?'visible':'hidden'}\" md-mode=indeterminate class=md-primary> </md-progress-linear> <md-dialog-content flex layout=row> <md-sidenav class=md-sidenav-left md-component-id=left md-is-locked-open=true md-whiteframe=4 layout=column> <div style=\"text-align: center\"> <mb-icon size=64px ng-if=ctrl.style.icon>{{::ctrl.style.icon}}</mb-icon> <h2 style=\"text-align: center\" mb-translate>{{::ctrl.style.title}}</h2> <p style=\"text-align: center\" mb-translate>{{::ctrl.style.description}}</p> </div> <md-devider></md-devider> <md-content> <md-list style=\"padding:0px; margin: 0px\"> <md-list-item ng-repeat=\"page in ctrl.pages | orderBy:priority\" ng-click=\"ctrl.loadPage(page, $event);\" mb-colors=\"ctrl.isPageVisible(page) ? {background:'accent'} : {}\"> <mb-icon>{{::(page.icon || 'attachment')}}</mb-icon> <p mb-translate>{{::page.title}}</p> </md-list-item> </md-list> </md-content> </md-sidenav> <div layout=column flex> <div id=wb-select-resource-children style=\"margin: 0px; padding: 0px; overflow: auto\" layout=column flex> </div> </div> </md-dialog-content> <md-dialog-actions layout=row> <span flex></span> <md-button aria-label=Cancel ng-click=ctrl.cancel()> <span mb-translate=\"\">Close</span> </md-button> <md-button class=md-primary aria-label=Done ng-click=ctrl.answer()> <span mb-translate=\"\">Ok</span> </md-button> </md-dialog-actions> </form> </md-dialog>"
  );


  $templateCache.put('views/directives/mb-captcha.html',
    "<div>  <div vc-recaptcha ng-model=ctrl.captchaValue theme=\"app.captcha.theme || 'light'\" type=\"app.captcha.type || 'image'\" key=app.captcha.key lang=\"app.captcha.language || 'fa'\"> </div>  </div>"
  );


  $templateCache.put('views/directives/mb-dynamic-tabs.html',
    "<div layout=column> <md-tabs md-selected=pageIndex> <md-tab ng-repeat=\"tab in mbTabs\"> <span mb-translate>{{tab.title}}</span> </md-tab> </md-tabs> <div id=mb-dynamic-tabs-select-resource-children> </div> </div>"
  );


  $templateCache.put('views/directives/mb-inline.html',
    "<div style=\"cursor: pointer\" ng-switch=mbInlineType>  <div ng-switch-when=image class=overlay-parent ng-class=\"{'my-editable' : $parent.mbInlineEnable}\" mb-colors=\"::{borderColor: 'primary-100'}\" style=\"overflow: hidden\" ng-click=ctrlInline.updateImage($event) ng-transclude> <div ng-show=$parent.mbInlineEnable layout=row layout-align=\"center center\" class=overlay-bottom mb-colors=\"{backgroundColor: 'primary-700'}\"> <md-button class=md-icon-button aria-label=\"Change image\" ng-click=ctrlInline.updateImage($event)> <mb-icon>photo_camera </mb-icon></md-button> </div> </div>  <div ng-switch-when=file class=overlay-parent ng-class=\"{'my-editable' : $parent.mbInlineEnable}\" mb-colors=\"::{borderColor: 'primary-100'}\" style=\"overflow: hidden\" ng-click=ctrlInline.updateFile($event) ng-transclude> <div ng-show=$parent.mbInlineEnable layout=row layout-align=\"center center\" class=overlay-bottom mb-colors=\"{backgroundColor: 'primary-700'}\"> <md-button class=md-icon-button aria-label=\"Change image\" ng-click=ctrlInline.updateFile($event)> <mb-icon>file </mb-icon></md-button> </div> </div>  <div ng-switch-when=datetime> <mb-datepicker ng-show=ctrlInline.editMode ng-model=ctrlInline.model ng-change=ctrlInline.save($event) mb-placeholder=\"Click to set date\" mb-hide-icons=calendar> </mb-datepicker> <button ng-if=\"mbInlineCancelButton && ctrlInline.editMode\" ng-click=ctrlInline.cancel($event)>cancel</button> <button ng-if=\"mbInlineSaveButton && ctrlInline.editMode\" ng-click=ctrlInline.save($event)>save</button> <ng-transclude ng-hide=ctrlInline.editMode ng-click=ctrlInline.edit($event) flex></ng-transclude> </div> <div ng-switch-when=date> <mb-datepicker ng-show=ctrlInline.editMode ng-model=ctrlInline.model ng-change=ctrlInline.save($event) mb-date-format=YYYY-MM-DD mb-placeholder=\"Click to set date\" mb-hide-icons=calendar> </mb-datepicker> <button ng-if=\"mbInlineCancelButton && ctrlInline.editMode\" ng-click=ctrlInline.cancel($event)>cancel</button> <button ng-if=\"mbInlineSaveButton && ctrlInline.editMode\" ng-click=ctrlInline.save($event)>save</button> <ng-transclude ng-hide=ctrlInline.editMode ng-click=ctrlInline.edit($event) flex></ng-transclude> </div>                                                                                                                                           <div ng-switch-default> <input mb-on-enter=ctrlInline.save($event) mb-on-esc=ctrlInline.cancel($event) ng-model=ctrlInline.model ng-show=ctrlInline.editMode> <button ng-if=\"mbInlineCancelButton && ctrlInline.editMode\" ng-click=ctrlInline.cancel()>cancel</button> <button ng-if=\"mbInlineSaveButton && ctrlInline.editMode\" ng-click=ctrlInline.save()>save</button> <button ng-if=\"ctrlInline.editMode && ctrlInline.hasPageFor()\" ng-click=ctrlInline.setFromResource($event)>...</button> <ng-transclude ng-hide=ctrlInline.editMode ng-click=ctrlInline.edit() flex></ng-transclude> </div>  <div ng-messages=error.message> <div ng-message=error class=md-input-message-animation style=\"margin: 0px\">{{error.message}}</div> </div> </div>"
  );


  $templateCache.put('views/directives/mb-navigation-bar.html',
    "<div class=mb-navigation-path-bar mb-colors=\"{'background-color': 'primary'}\" layout=row> <div layout=row> <md-button ng-click=goToHome() aria-label=Home class=\"mb-navigation-path-bar-item mb-navigation-path-bar-item-home\"> <md-tooltip ng-if=menu.tooltip md-delay=1500> <span mb-translate>home</span> </md-tooltip> <mb-icon>home</mb-icon> </md-button> </div> <div layout=row data-ng-repeat=\"menu in pathMenu.items | orderBy:['-priority']\"> <mb-icon>{{app.dir==='rtl' ? 'chevron_left' : 'chevron_right'}}</mb-icon> <md-button ng-show=isVisible(menu) ng-href={{menu.url}} ng-click=menu.exec($event); class=mb-navigation-path-bar-item> <md-tooltip ng-if=menu.tooltip md-delay=1500>{{menu.description}}</md-tooltip> <mb-icon ng-if=menu.icon>{{menu.icon}}</mb-icon> <span mb-translate>{{::menu.title}} </span></md-button> </div> </div>"
  );


  $templateCache.put('views/directives/mb-preference-page.html',
    "<div id=mb-preference-body layout=row layout-margin flex> </div>"
  );


  $templateCache.put('views/mb-application-preloading.html',
    "<div> Loading ... </div>"
  );


  $templateCache.put('views/mb-error-messages.html',
    "<div ng-message=403 layout=column layout-align=\"center center\"> <mb-icon size=64px>do_not_disturb</mb-icon> <strong mb-translate>Access denied</strong> <p mb-translate>You are not allowed to access this item.</p> </div> <div ng-message=404 layout=column layout-align=\"center center\"> <mb-icon size=64px>visibility_off</mb-icon> <strong mb-translate>Not found</strong> <p mb-translate>Requested item not found.</p> </div> <div ng-message=500 layout=column layout-align=\"center center\"> <mb-icon size=64px>bug_report</mb-icon> <strong mb-translate>Server error</strong> <p mb-translate>An internal server error is occurred.</p> </div>"
  );


  $templateCache.put('views/mb-languages.html',
    "<div ng-controller=\"MbLanguagesCtrl as ctrl\" layout=row flex> <md-sidenav class=md-sidenav-left md-component-id=lanaguage-manager-left md-is-locked-open=true md-whiteframe=4> <md-content> <md-toolbar> <div class=md-toolbar-tools> <label flex mb-translate=\"\">Languages</label> <md-button ng-click=ctrl.addLanguage() class=md-icon-button aria-label=\"Add new language\"> <mb-icon>add</mb-icon> </md-button> <md-button class=md-icon-button aria-label=\"Upload a language\"> <mb-icon>more_vert</mb-icon> </md-button> </div> </md-toolbar> <div> <md-list> <md-list-item ng-repeat=\"lang in app.config.languages\" ng-click=ctrl.setLanguage(lang)> <p mb-translate=\"\">{{lang.title}}</p> <md-button class=md-icon-button ng-click=ctrl.saveAs(lang) aria-label=\"Save language as a file\"> <mb-icon>download</mb-icon> <md-tooltip md-direction=left md-delay=1500> <span mb-translate>Save language as a file</span> </md-tooltip> </md-button> <md-button class=md-icon-button ng-click=ctrl.deleteLanguage(lang) aria-label=\"Delete language\"> <mb-icon>delete</mb-icon> <md-tooltip md-direction=left md-delay=1500> <span mb-translate>Delete language</span> </md-tooltip> </md-button> </md-list-item> </md-list> </div> </md-content> </md-sidenav> <md-content flex mb-preloading=working layout-padding> <div ng-if=!ctrl.selectedLanguage layout-padding> <h3 mb-translate>Select a language to view/edit translations.</h3> </div> <fieldset ng-if=ctrl.selectedLanguage> <legend><span mb-translate=\"\">Selected Language</span></legend> <div layout=row layout-align=\"space-between center\"> <label>{{ctrl.selectedLanguage.title}} ({{ctrl.selectedLanguage.key}})</label>            </div> </fieldset> <fieldset ng-if=ctrl.selectedLanguage class=standard> <legend><span mb-translate=\"\">Language map</span></legend> <div layout=column layout-margin> <md-input-container class=\"md-icon-float md-block\" flex ng-repeat=\"(key, value) in ctrl.selectedLanguage.map\"> <label>{{key}}</label> <input ng-model=ctrl.selectedLanguage.map[key] ng-model-options=\"{ updateOn: 'blur', debounce: 3000 }\"> <mb-icon ng-click=ctrl.deleteWord(key)>delete</mb-icon> </md-input-container> </div> <md-button class=\"md-primary md-raised md-icon-button\" ng-click=ctrl.addWord() aria-label=\"Add word to language\"> <mb-icon>add</mb-icon> </md-button> </fieldset> </md-content> </div>"
  );


  $templateCache.put('views/mb-passowrd-recover.html',
    " <md-toolbar layout-padding>  <h3>Forget Your PassWord ?</h3> </md-toolbar>  <div layout=column layout-padding> <md-input-container> <label>Username or Email</label> <input ng-model=credit.login required> </md-input-container> </div> <div layout=column layout-align=none layout-gt-sm=row layout-align-gt-sm=\"space-between center\" layout-padding> <a ui-sref=login flex-order=1 flex-order-gt-sm=-1>Back To Login Page</a> <md-button flex-order=0 class=\"md-primary md-raised\" ng-click=login(credit)>Send</md-button> </div>"
  );


  $templateCache.put('views/mb-preference.html',
    "<md-content style=\"width: 100%; height: 100%; overflow: auto\"> <div id=page-panel></div> </md-content>"
  );


  $templateCache.put('views/mb-preferences.html',
    "<md-content style=\"width: 100%; height: 100%; overflow: auto\"> <md-list ng-cloak> <md-list-item ng-repeat=\"page in pages\" ng-href=preferences/{{::page.id}}> <mb-icon>{{::page.icon}}</mb-icon> <p mb-translate>{{::page.title}}</p> </md-list-item> </md-list> </md-content>"
  );


  $templateCache.put('views/mb-preloading-default.html',
    "<div class=mb-preloading-default> <div class=stage> <img src=resources/images/mb-preloading-blow.svg class=\"box bounce-7\"> </div> </div>"
  );


  $templateCache.put('views/options/mb-local.html',
    "<md-divider></md-divider> <md-input-container class=md-block> <label mb-translate>Language & Local</label> <md-select ng-model=app.setting.local> <md-option ng-repeat=\"lang in languages\" ng-value=lang.key mb-translate>{{lang.title}}</md-option> </md-select> </md-input-container> <md-input-container class=md-block> <label mb-translate>Direction</label> <md-select ng-model=app.setting.dir placeholder=Direction> <md-option value=rtl mb-translate>Right to left</md-option> <md-option value=ltr mb-translate>Left to right</md-option> </md-select> </md-input-container> <md-input-container class=md-block> <label mb-translate>Calendar</label> <md-select ng-model=app.setting.calendar placeholder=\"\"> <md-option value=Gregorian mb-translate>Gregorian</md-option> <md-option value=Jalaali mb-translate>Jalaali</md-option> </md-select> </md-input-container> <md-input-container class=md-block> <label mb-translate>Date format</label> <md-select ng-model=app.setting.dateFormat placeholder=\"\"> <md-option value=jMM-jDD-jYYYY mb-translate> {{'2018-01-01' | mbDate:'jMM-jDD-jYYYY'}} </md-option> <md-option value=jYYYY-jMM-jDD mb-translate> {{'2018-01-01' | mbDate:'jYYYY-jMM-jDD'}} </md-option> <md-option value=\"jYYYY jMMMM jDD\" mb-translate> {{'2018-01-01' | mbDate:'jYYYY jMMMM jDD'}} </md-option> </md-select> </md-input-container>"
  );


  $templateCache.put('views/options/mb-theme.html',
    "<md-input-container class=md-block> <label mb-translate>Theme</label> <md-select ng-model=app.setting.theme> <md-option ng-repeat=\"theme in themes\" value={{theme.id}} mb-translate>{{theme.label}}</md-option> </md-select> </md-input-container> <md-input-container class=md-block ng-init=\"app.setting.navigationPath = app.setting.navigationPath || true\"> <md-switch class=md-primary name=special ng-model=app.setting.navigationPath> <sapn flex mb-translate>Navigation path</sapn> </md-switch> </md-input-container>"
  );


  $templateCache.put('views/partials/mb-branding-header-toolbar.html',
    " <md-toolbar layout=row layout-padding mb-colors=\"{backgroundColor: 'primary-100'}\">  <img style=\"max-width: 50%\" height=160 ng-show=app.config.logo ng-src=\"{{app.config.logo}}\"> <div> <h3>{{app.config.title}}</h3> <p>{{ app.config.description | limitTo: 250 }}{{app.config.description.length > 250 ? '...' : ''}}</p> </div> </md-toolbar>"
  );


  $templateCache.put('views/partials/mb-view-access-denied.html',
    "<div id=mb-panel-root-access-denied ng-if=\"status === 'accessDenied'\" layout=column layout-fill> Access Denied </div>"
  );


  $templateCache.put('views/partials/mb-view-loading.html',
    "<div id=mb-view-loading layout=column layout-align=\"center center\" layout-fill> <img width=256px ng-src-error=images/logo.svg ng-src=\"/api/v2/cms/contents/mb-preloading-brand/content\"> <h3>Loading...</h3> <md-progress-linear style=\"width: 50%\" md-mode=indeterminate> </md-progress-linear> <md-button ng-if=\"app.state.status === 'fail'\" class=\"md-raised md-primary\" ng-click=restart() aria-label=Retry> <mb-icon>replay</mb-icon> retry </md-button> </div>"
  );


  $templateCache.put('views/partials/mb-view-login.html',
    "<div ng-if=\"status === 'login'\" layout=row layout-aligne=none layout-align-gt-sm=\"center center\" ng-controller=MbAccountCtrl flex> <div md-whiteframe=3 flex=100 flex-gt-sm=50 layout=column mb-preloading=ctrl.loadUser>  <ng-include src=\"'views/partials/mb-branding-header-toolbar.html'\"></ng-include> <md-progress-linear ng-disabled=\"!(ctrl.loginProcess || ctrl.logoutProcess)\" style=\"margin: 0px; padding: 0px\" md-mode=indeterminate class=md-primary mb-color> </md-progress-linear>  <div style=\"text-align: center\" layout-margin ng-show=\"!ctrl.loginProcess && ctrl.loginState === 'fail'\"> <p><span mb-colors=\"{color:'warn'}\" mb-translate>{{loginMessage}}</span></p> </div> <form name=ctrl.myForm ng-submit=login(credit) layout=column layout-padding> <md-input-container> <label mb-translate>Username</label> <input ng-model=credit.login name=username required> <div ng-messages=ctrl.myForm.username.$error> <div ng-message=required mb-translate>This field is required.</div> </div> </md-input-container> <md-input-container> <label mb-translate>Password</label> <input ng-model=credit.password type=password name=password required> <div ng-messages=ctrl.myForm.password.$error> <div ng-message=required mb-translate>This field is required.</div> </div> </md-input-container>  <div vc-recaptcha ng-if=\"__tenant.settings['captcha.engine'] === 'recaptcha'\" key=\"__tenant.settings['captcha.engine.recaptcha.key']\" ng-model=credit.g_recaptcha_response theme=\"__app.configs.captcha.theme || 'light'\" type=\"__app.configs.captcha.type || 'image'\" lang=\"__app.setting.local || __app.config.local || 'en'\"> </div> <input hide type=\"submit\"> <div layout=column layout-align=none layout-gt-xs=row layout-align-gt-xs=\"end center\" layout-margin> <a href=users/reset-password style=\"text-decoration: none\" ui-sref=forget flex-order=1 flex-order-gt-xs=-1>{{'forgot your password?'|translate}}</a> <md-button ng-disabled=ctrl.myForm.$invalid flex-order=-1 flex-order-gt-xs=1 class=\"md-primary md-raised\" ng-click=login(credit)>{{'login'|translate}}</md-button>      </div> </form> </div> </div>"
  );


  $templateCache.put('views/preferences/mb-brand.html',
    "<div layout=column layout-margin ng-cloak flex> <mb-titled-block mb-title=\"{{'Configurations' | translate}}\"> <md-input-container class=md-block> <label mb-translate>Title</label> <input required md-no-asterisk name=title ng-model=\"app.config.title\"> </md-input-container> <md-input-container class=md-block> <label mb-translate>Description</label> <input md-no-asterisk name=description ng-model=\"app.config.description\"> </md-input-container> </mb-titled-block> <div layout=row layout-wrap layout-margin> <mb-titled-block mb-title=\"{{'Brand' | translate}}\"> <mb-inline ng-model=app.config.logo mb-inline-type=image mb-inline-label=\"Application Logo\" mb-inline-enable=true> <img width=256px height=256px ng-src={{app.config.logo}}> </mb-inline> </mb-titled-block> <mb-titled-block mb-title=\"{{'Favicon' | translate }}\"> <mb-inline ng-model=app.config.favicon mb-inline-type=image mb-inline-label=\"Application Favicon\" mb-inline-enable=true> <img width=256px height=256px ng-src={{app.config.favicon}}> </mb-inline> </mb-titled-block> </div> </div>"
  );


  $templateCache.put('views/preferences/mb-language.html',
    " <div layout=column layout-align=\"center center\" layout-margin style=\"min-height: 300px\" flex> <div layout=column layout-align=\"center start\"> <p>{{'Select default language of site:' | translate}}</p> <md-checkbox ng-repeat=\"lang in languages\" style=\"margin: 8px\" ng-checked=\"myLanguage.key === lang.key\" ng-click=setLanguage(lang) aria-label={{lang.key}}> {{lang.title | translate}} </md-checkbox> </div> </div>"
  );


  $templateCache.put('views/preferences/mb-local.html',
    "<div layout=column layout-padding ng-cloak flex> <md-input-container class=\"md-icon-float md-block\"> <label mb-translate>Language</label> <md-select ng-model=config[SETTING_LOCAL_LANGUAGE]> <md-option ng-repeat=\"lang in [{\n" +
    "\t\t\t\t\ttitle: 'Persian',\n" +
    "\t\t\t\t\tkey: 'fa'\n" +
    "\t\t\t\t},{\n" +
    "\t\t\t\t\ttitle: 'English',\n" +
    "\t\t\t\t\tkey: 'en'\n" +
    "\t\t\t\t}]\" ng-value=lang.key>{{::(lang.title | translate)}}</md-option> </md-select> <mb-icon style=\"cursor: pointer\" ng-click=goToManage()>settings</mb-icon> </md-input-container> <md-input-container class=md-block> <label mb-translate>Direction</label> <md-select ng-model=config[SETTING_LOCAL_DIRECTION] placeholder=Direction> <md-option value=rtl mb-translate>Right to left</md-option> <md-option value=ltr mb-translate>Left to right</md-option> </md-select> </md-input-container> <md-input-container class=md-block> <label mb-translate>Calendar</label> <md-select ng-model=config[SETTING_LOCAL_CALENDAR] placeholder=\"\"> <md-option value=Gregorian mb-translate>Gregorian</md-option> <md-option value=Jalaali mb-translate>Jalaali</md-option> </md-select> </md-input-container> <md-input-container class=md-block> <label mb-translate>Date format</label> <md-select ng-model=config[SETTING_LOCAL_DATEFORMAT] placeholder=\"\"> <md-option value=jMM-jDD-jYYYY> <span mb-translate>Month Day Year, </span> <span>{{'2018-01-01 15:00:00' | mbDate:'jMM-jDD-jYYYY'}}</span> </md-option> <md-option value=jYYYY-jMM-jDD> <span mb-translate>Year Month Day, </span> <span>{{'2018-01-01 00:00:00' | mbDate:'jYYYY-jMM-jDD'}}</span> </md-option> <md-option value=\"jYYYY jMMMM jDD\"> <span mb-translate>Year Month Day, </span> <span>{{'2018-01-01 15:00:00' | mbDate:'jYYYY jMMMM jDD'}}</span> </md-option> </md-select> </md-input-container> <md-input-container class=md-block> <label mb-translate>Date Time format</label> <md-select ng-model=config[SETTING_LOCAL_DATETIMEFORMAT] placeholder=\"\"> <md-option value=\"jMM-jDD-jYYYY HH:mm:ss\"> <span mb-translate>Month Day Year ,</span> <span>{{'2018-01-01 15:00:00' | mbDate:'jMM-jDD-jYYYY HH:mm:ss'}}</span> </md-option> <md-option value=\"jYYYY-jMM-jDD HH:mm:ss\"> <span mb-translate>Year Month Day,</span> <span>{{'2018-01-01 15:00:00' | mbDateTime:'jYYYY-jMM-jDD HH:mm:ss'}}</span> </md-option> </md-select> </md-input-container> <div layout=row> <md-button ng-click=ctrl.save() translate>Save</md-button> </div> </div>"
  );


  $templateCache.put('views/preferences/mb-modules.html',
    "<div layout=column layout-padding ng-cloak flex> <md-switch class=md-secondary ng-model=app.config.update.showMessage aria-label=\"Show spa update message option\"> <p mb-translate=\"\">Show update message to customers</p> </md-switch> <md-switch class=md-secondary ng-model=app.config.update.autoReload ng-disabled=!app.config.update.showMessage aria-label=\"Automatically reload page option\"> <p mb-translate=\"\">Reload the page automatically on update</p> </md-switch> </div>"
  );


  $templateCache.put('views/preferences/mb-update.html',
    "<div layout=column layout-padding ng-cloak flex> <md-switch class=md-secondary ng-model=app.config.update.showMessage aria-label=\"Show spa update message option\"> <p mb-translate=\"\">Show update message to customers</p> </md-switch> <md-switch class=md-secondary ng-model=app.config.update.autoReload ng-disabled=!app.config.update.showMessage aria-label=\"Automatically reload page option\"> <p mb-translate=\"\">Reload the page automatically on update</p> </md-switch> </div>"
  );


  $templateCache.put('views/resources/mb-language-custome.html',
    "<form layout-margin layout=column ng-submit=$event.preventDefault() name=searchForm> <md-autocomplete flex required md-input-name=Language md-selected-item=language md-search-text=resourceCtrl.searchText md-items=\"item in resourceCtrl.querySearch(resourceCtrl.searchText)\" md-item-text=item.key md-require-match=\"\" md-floating-label=Key input-aria-describedby=\"Language Key\"> <md-item-template> <span md-highlight-text=resourceCtrl.searchText>{{item.title}} ({{item.key}})</span> </md-item-template> <div ng-messages=searchForm.autocompleteField.$error ng-if=searchForm.autocompleteField.$touched> <div ng-message=required>You <b>must</b> have a language key.</div> <div ng-message=md-require-match>Please select an existing language.</div> <div ng-message=minlength>Your entry is not long enough.</div> <div ng-message=maxlength>Your entry is too long.</div> </div> </md-autocomplete> <md-input-container> <label mb-translate>Title</label> <input ng-model=language.title> </md-input-container> </form>"
  );


  $templateCache.put('views/resources/mb-language-list.html',
    "<md-list flex> <md-list-item class=md-3-line ng-repeat=\"item in languages\" ng-click=resourceCtrl.setLanguage(item)> <mb-icon>language</mb-icon> <div class=md-list-item-text layout=column> <h3>{{ item.key }}</h3> <h4>{{ item.title }}</h4> <p>{{ item.description }}</p> </div> </md-list-item> </md-list>"
  );


  $templateCache.put('views/resources/mb-language-upload.html',
    "<form layout-margin layout=column ng-submit=$event.preventDefault() name=searchForm> <mb-file-input name=files ng-file=files mb-required mb-file-max=5 mb-file-min=1 mb-file-size=10MB mb-file-size-total=20MB mb-drag mb-preview> </mb-file-input> </form>"
  );


  $templateCache.put('views/resources/mb-sidenav.html',
    ""
  );


  $templateCache.put('views/resources/wb-event-code-editor.html',
    "<div layout=column layout-fill> <md-toolbar> <div class=md-toolbar-tools layout=row> <span flex></span> <md-select ng-model=value.language ng-change=ctrl.setLanguage(value.language) class=md-no-underline> <md-option ng-repeat=\"l in value.languages track by $index\" ng-value=l.value> {{l.text}} </md-option> </md-select> </div> </md-toolbar> <md-content flex> <div style=\"min-height: 100%; min-width: 100%\" index=0 id=am-wb-resources-script-editor> </div> </md-content> </div>"
  );


  $templateCache.put('views/toolbars/mb-dashboard.html',
    "<div layout=row layout-align=\"start center\" itemscope itemtype=http://schema.org/WPHeader> <md-button class=md-icon-button hide-gt-sm ng-click=toggleNavigationSidenav() aria-label=Menu> <mb-icon>menu</mb-icon> </md-button> <img hide-gt-sm height=32px ng-if=app.config.logo ng-src=\"{{app.config.logo}}\"> <strong hide-gt-sm style=\"padding: 0px 8px 0px 8px\"> {{app.config.title}} </strong> <mb-navigation-bar hide show-gt-sm ng-show=\"app.setting.navigationPath !== false\"> </mb-navigation-bar> </div> <div layout=row layout-align=\"end center\">  <md-button ng-repeat=\"menu in scopeMenu.items | orderBy:['-priority']\" ng-show=menu.visible() ng-href={{menu.url}} ng-click=menu.exec($event); class=md-icon-button> <md-tooltip ng-if=menu.tooltip md-delay=1500>{{menu.description}}</md-tooltip> <mb-icon ng-if=menu.icon>{{menu.icon}}</mb-icon> </md-button> <md-divider ng-if=scopeMenu.items.length></md-divider> <md-button ng-repeat=\"menu in toolbarMenu.items | orderBy:['-priority']\" ng-show=menu.visible() ng-href={{menu.url}} ng-click=menu.exec($event); class=md-icon-button> <md-tooltip ng-if=\"menu.tooltip || menu.description\" md-delay=1500>{{menu.description | translate}}</md-tooltip> <mb-icon ng-if=menu.icon>{{menu.icon}}</mb-icon> </md-button> <md-button ng-show=messageCount ng-click=toggleMessageSidenav() style=\"overflow: visible\" class=md-icon-button> <md-tooltip md-delay=1500> <span mb-translate=\"\">Display list of messages</span> </md-tooltip> <mb-icon mb-badge={{messageCount}} mb-badge-fill=accent>notifications</mb-icon> </md-button> <mb-user-menu></mb-user-menu> <md-button ng-repeat=\"menu in userMenu.items | orderBy:['-priority']\" ng-show=menu.visible() ng-click=menu.exec($event) class=md-icon-button> <md-tooltip ng-if=menu.tooltip md-delay=1500>{{menu.tooltip}}</md-tooltip> <mb-icon ng-if=menu.icon>{{menu.icon}}</mb-icon> </md-button> </div>"
  );


  $templateCache.put('views/ui/mb-view-main.html',
    "<body class=mb_body>  <div>  <div id=view></div> </div> </body>"
  );


  $templateCache.put('scripts/directives/mb-dynamic-form.html',
    "<div layout=column ng-repeat=\"prop in mbParameters track by $index\"> <md-input-container ng-if=\"getTypeOf(prop)==='input'\" ng-show=\"prop.visible && prop.editable\" class=\"md-icon-float md-icon-right md-block\"> <label>{{::prop.title}}</label> <input ng-required=\"{{prop.validators && prop.validators.indexOf('NotNull')>-1}}\" ng-model=values[prop.name] ng-change=\"modelChanged(prop.name, values[prop.name])\"> <mb-icon ng-show=hasResource(prop) ng-click=setValueFor(prop)>more_horiz</mb-icon>  </md-input-container> <md-input-container ng-if=\"getTypeOf(prop)==='textarea'\" ng-show=\"prop.visible && prop.editable\" class=\"md-icon-float md-icon-right md-block\"> <label>{{::prop.title}}</label> <textarea ng-required=\"{{prop.validators && prop.validators.indexOf('NotNull')>-1}}\" ng-model=values[prop.name] ng-change=\"modelChanged(prop.name, values[prop.name])\"></textarea> <mb-icon ng-show=hasResource(prop) ng-click=setValueFor(prop)>more_horiz</mb-icon>  </md-input-container> <mb-datepicker ng-if=\"getTypeOf(prop)==='datetime'\" placeholder={{::prop.title}} ng-required=\"{{prop.validators && prop.validators.indexOf('NotNull')>-1}}\" ng-model=values[prop.name] ng-change=\"modelChanged(prop.name, values[prop.name])\"></mb-datepicker> </div>"
  );


  $templateCache.put('scripts/factories/wizard.html',
    "<div class=mb-wizard> <div id=header> <div id=text> <h2 id=title>{{ctrl.title}}</h2> <p id=message>{{ctrl.description}}</p> <div id=error-message ng-if=ctrl.errorMessage mb-colors=\"{color: 'accent'}\"> <mb-icon>error</mb-icon> <span>{{ctrl.errorMessage}}</span> </div> </div> <img id=image ng-src=\"{{ctrl.image || 'images/logo.svg'}}\" ng-src-error=images/logo.svg> </div> <md-content id=body></md-content> <div id=actions> <md-button class=md-icon-button id=help ng-show=!ctrl.helpDisabled ng-click=ctrl.openHelp($event) aria-disabled=Help> <mb-icon>help</mb-icon> </md-button> <span id=spacer></span> <md-button class=md-raised id=back ng-show=\"ctrl.getPageCount() > 1\" ng-click=ctrl.backPage($event) ng-disabled=ctrl.backDisabled aria-label=Back> <span translate>Back</span> </md-button> <md-button class=md-raised id=next ng-show=\"ctrl.getPageCount() > 1\" ng-click=ctrl.nextPage($event) ng-disabled=ctrl.nextDisabled aria-label=Next> <span translate>Next</span> </md-button> <md-button class=\"md-raised md-accent\" id=cancel ng-click=ctrl.cancelWizard($event) aria-label=Cancel> <span translate>Cancel</span> </md-button> <md-button class=\"md-raised md-primary\" id=finish ng-click=ctrl.finishWizard($event) ng-disabled=ctrl.finishDisabled aria-label=Finish> <span translate>Finish</span> </md-button> </div> </div>"
  );


  $templateCache.put('scripts/module-help/sidenavs/help.html',
    "<md-toolbar class=md-hue-1 layout=column layout-align=center> <div layout=row layout-align=\"start center\"> <md-button class=md-icon-button aria-label=Close ng-click=closeHelp()> <mb-icon>close</mb-icon> </md-button> <span flex></span> <h4 mb-translate>Help</h4> </div> </md-toolbar> <md-content mb-preloading=helpLoading layout-padding flex> <wb-group ng-model=helpContent> </wb-group> </md-content>"
  );


  $templateCache.put('scripts/module-layouts/components/layouts-toolbar.html',
    "<md-menu class=amd-account-toolbar> <mb-icon class=anchor ng-click=\"ctrl.openMenu($mdMenu, $event)\" aria-label=\"Open menu\" size=16 style=\"padding: 4px\">dashboard</mb-icon> <md-menu-content width=3>  <md-menu-item> <md-button ng-click=ctrl.saveAs($event) mb-translate>Save Current Layout As</md-button> </md-menu-item> <md-menu-divider ng-if=ctrl.layouts.length></md-menu-divider>  <md-menu-item ng-repeat=\"layout in ctrl.layouts\"> <md-button ng-click=\"ctrl.loadLayout($event, layout)\" mb-translate>{{::layout}}</md-button> </md-menu-item> <md-menu-divider ng-if=ctrl.layouts.length></md-menu-divider> <md-menu-item> <md-button ng-click=ctrl.loadLayout($event) mb-translate>Load Layout</md-button> </md-menu-item> </md-menu-content> </md-menu>"
  );


  $templateCache.put('scripts/module-layouts/resources/layouts-local-storage.html',
    "<md-list ng-cloak> <md-list-item mb-colors=\"ctrl.isSelected(layoutName) ? {background:'accent'} : {}\" ng-repeat=\"layoutName in ctrl.layouts\" ng-click=ctrl.setSelected(layoutName)> <p> {{ ::layoutName }} </p> <mb-icon class=md-secondary ng-click=\"ctrl.deleteLayout(layoutName, $event)\" aria-label=\"Delete layout\">delete</mb-icon> </md-list-item> </md-list>"
  );


  $templateCache.put('scripts/module-moduleManager/resources/module-manual.html',
    "<md-content layout=column layout-padding flex> <md-input-container class=\"md-icon-float md-icon-right md-block\" required> <label mb-translate>Title</label> <input ng-model=module.title> </md-input-container> <md-input-container class=\"md-icon-float md-icon-right md-block\" required> <label mb-translate>URL</label> <input ng-model=module.url required> </md-input-container> <md-input-container class=\"md-icon-float md-icon-right md-block\" required> <label mb-translate>Type</label> <input ng-model=module.type required placeholder=\"js, css\"> </md-input-container> <md-input-container class=md-block> <label>Load type</label> <md-select ng-model=module.load> <md-option mb-translate=\"\">None</md-option> <md-option ng-value=\"'before'\" mb-translate=\"\">Before Page Load</md-option> <md-option ng-value=\"'lazy'\" mb-translate=\"\">Lazy Load</md-option> <md-option ng-value=\"'after'\" mb-translate=\"\">After Page Load</md-option> </md-select> </md-input-container> </md-content>"
  );


  $templateCache.put('scripts/module-moduleManager/views/modules.html',
    "<md-content> <md-list style=\"width: 100%\"> <md-list-item class=md-3-line ng-repeat=\"item in ctrl.modules track by $index\" ng-click=\"ctrl.editModule(item, $event)\"> <mb-icon ng-if=\"item.type == 'css'\">style</mb-icon> <mb-icon ng-if=\"item.type == 'js'\">tune</mb-icon> <div class=md-list-item-text layout=column> <h3>{{ item.title }}</h3> <h4>{{ item.url }}</h4> <p> Load: {{ item.load }}</p> </div> <md-menu> <md-button class=md-icon-button ng-click=\"ctrl.openMenu($mdMenu, $event);\" aria-label=\"remove attachment\"> <mb-icon>more_vert</mb-icon> </md-button> <md-menu-content width=4> <md-menu-item> <md-button ng-click=\"ctrl.deleteModule(item, $event)\" arial-lable=\"delete module\"> <mb-icon>delete</mb-icon> <span translate>Delete</span> </md-button> </md-menu-item> </md-menu-content> </md-menu> </md-list-item> </md-list> </md-content>"
  );


  $templateCache.put('scripts/module-navigator/actions/command-line-display.html',
    "<md-bottom-sheet class=\"md-list md-has-header\" layout=column style=\"max-height: 100vh\"> <div ng-cloak> <md-input-container class=\"md-icon-float md-icon-left md-block\"> <label mb-translate>Search</label> <mb-icon>search</mb-icon> <input ng-model=query ng-change=search(query) md-autofocus> </md-input-container> </div> <md-content flex> <md-list ng-cloak> <md-list-item ng-repeat=\"action in actions\" ng-click=\"runAction(action, $event)\" ng-show=!action.demon class=md-offset> <mb-icon ng-if=action.icon class=md-avatar-icon>{{::action.icon}}</mb-icon> <p md-highlight-text=query class=md-inline-list-icon-label>{{ ::action.title }}</p> </md-list-item> </md-list> </md-content> </md-bottom-sheet>"
  );


  $templateCache.put('scripts/module-navigator/views/navigator.html',
    "<md-content> <md-list> <md-subheader ng-repeat-start=\"group in groups\" class=md-no-sticky>{{::group.title}}</md-subheader> <md-list-item ng-repeat=\"(url, item) in group.items\" ng-href=./{{::url}}> <mb-icon>{{::(item.icon || 'layers')}}</mb-icon> <p mb-translate>{{::item.title}}</p> </md-list-item> <md-divider ng-repeat-end></md-divider> </md-list> </md-content>"
  );


  $templateCache.put('scripts/module-ui/directives/mb-color-picker-container.html',
    "<div class=\"mb-color-picker-container in\" layout=column> <div class=mb-color-picker-arrow ng-style=\"{'border-bottom-color': color.toRgbString() }\"></div> <div class=\"mb-color-picker-preview mb-color-picker-checkered-bg\" ng-class=\"{'dark': !color.isDark() || color.getAlpha() < .45}\" flex=1 layout=column> <div class=mb-color-picker-result ng-style=\"{'background': color.toRgbString()}\" flex=100 layout=column layout-fill layout-align=\"center center\" ng-click=\"focusPreviewInput( $event )\">  <div flex layout=row layout-align=\"center center\"> <input class=mb-color-picker-preview-input ng-model=value ng-focus=previewFocus($event); ng-blur=previewBlur() ng-change=changeValue() ng-keypress=previewKeyDown($event) layout-fill> </div> <div class=mb-color-picker-tabs style=\"width: 100%\"> <md-tabs md-selected=type md-stretch-tabs=always md-no-bar md-no-ink md-no-pagination=true> <md-tab ng-if=mbColorHex label=Hex ng-disabled=\"color.getAlpha() !== 1\" md-ink-ripple=#ffffff> </md-tab> <md-tab ng-if=mbColorRgb label=RGB></md-tab> <md-tab ng-if=mbColorHsl label=HSL></md-tab>  </md-tabs> </div> </div> </div> <div class=\"mb-color-picker-tabs mb-color-picker-colors\"> <md-tabs md-stretch-tabs=always md-align-tabs=bottom md-selected=whichPane md-no-pagination> <md-tab ng-if=mbColorSpectrum> <md-tab-label> <mb-icon>gradient</mb-icon> </md-tab-label> <md-tab-body> <div layout=row layout-align=space-between style=\"height: 255px\"> <div mb-color-picker-spectrum></div> <div mb-color-picker-hue ng-class=\"{'mb-color-picker-wide': !mbColorAlphaChannel}\"></div> <div mb-color-picker-alpha class=mb-color-picker-checkered-bg ng-if=mbColorAlphaChannel> </div> </div> </md-tab-body> </md-tab> <md-tab ng-if=mbColorSliders> <md-tab-label> <mb-icon>tune</mb-icon> </md-tab-label> <md-tab-body> <div layout=column flex=100 layout-fill layout-align=\"space-between start center\" class=mb-color-picker-sliders> <div layout=row layout-align=\"start center\" layout-wrap flex layout-fill> <div flex=10 layout layout-align=\"center center\"> <span class=md-body-1>R</span> </div> <md-slider flex=65 min=0 max=255 ng-model=color._r aria-label=red class=red-slider></md-slider> <span flex></span> <div flex=20 layout layout-align=\"center center\"> <input style=\"width: 100%\" min=0 max=255 type=number ng-model=color._r aria-label=red aria-controls=red-slider> </div> </div> <div layout=row layout-align=\"start center\" layout-wrap flex layout-fill> <div flex=10 layout layout-align=\"center center\"> <span class=md-body-1>G</span> </div> <md-slider flex=65 min=0 max=255 ng-model=color._g aria-label=green class=green-slider></md-slider> <span flex></span> <div flex=20 layout layout-align=\"center center\"> <input style=\"width: 100%\" min=0 max=255 type=number ng-model=color._g aria-label=green aria-controls=green-slider> </div> </div> <div layout=row layout-align=\"start center\" layout-wrap flex layout-fill> <div flex=10 layout layout-align=\"center center\"> <span class=md-body-1>B</span> </div> <md-slider flex=65 min=0 max=255 ng-model=color._b aria-label=blue class=blue-slider></md-slider> <span flex></span> <div flex=20 layout layout-align=\"center center\"> <input style=\"width: 100%\" min=0 max=255 type=number ng-model=color._b aria-label=blue aria-controls=blue-slider> </div> </div> <div layout=row layout-align=\"start center\" layout-wrap flex layout-fill ng-if=!mbColorAlphaChannel> <div flex=10 layout layout-align=\"center center\"> <span class=md-body-1>A</span> </div> <md-slider flex=65 min=0 max=1 step=.01 ng-model=color._a aria-label=alpha class=md-primary></md-slider> <span flex></span> <div flex=20 layout layout-align=\"center center\"> <input style=\"width: 100%\" min=0 max=1 step=.01 type=number ng-model=color._a aria-label=alpha aria-controls=alpha-slider> </div> </div> </div> </md-tab-body> </md-tab> <md-tab ng-if=mbColorGenericPalette> <md-tab-label> <mb-icon>view_module</mb-icon> </md-tab-label> <md-tab-body> <div layout=column layout-align=\"space-between start center\" flex class=mb-color-picker-palette> </div> </md-tab-body> </md-tab> <md-tab ng-if=mbColorMaterialPalette> <md-tab-label> <mb-icon>view_headline</mb-icon> </md-tab-label> <md-tab-body> <div layout=column layout-fill flex class=mb-color-picker-material-palette> </div> </md-tab-body> </md-tab> <md-tab ng-if=mbColorHistory> <md-tab-label> <mb-icon>history</mb-icon> </md-tab-label> <md-tab-body layout=row layout-fill> <div layout=column flex layout-align=\"space-between start\" layout-wrap layout-fill class=mb-color-picker-history> <div layout=row flex=80 layout-align=\"space-between start start\" layout-wrap layout-fill> <div flex=10 ng-repeat=\"historyColor in history.get() track by $index\"> <div ng-style=\"{'background': historyColor.toRgbString()}\" ng-click=setPaletteColor($event)></div> </div> </div> <md-button flex-end ng-click=history.reset() class=md-mini aria-label=\"Clear History\"> <mb-icon>clear_all</mb-icon> </md-button> </div> </md-tab-body> </md-tab> </md-tabs> </div> </div>"
  );


  $templateCache.put('scripts/module-ui/directives/mb-color-picker.html',
    "<div class=mb-color-picker-input-container layout=row> <div class=\"mb-color-picker-preview mb-color-picker-checkered-bg\" ng-click=showColorPicker($event) ng-if=mbColorPreview> <div class=mb-color-picker-result ng-style=\"{background: value}\"> </div> </div> <md-input-container flex> <label> <mb-icon ng-if=icon>{{icon}}</mb-icon> <span translate=\"\">{{label}}</span> </label> <input type=input ng-model=value class=mb-color-picker-input ng-mousedown=\"(openOnInput || !mbColorPreview) && showColorPicker($event)\"> </md-input-container> <mb-button class=\"mb-icon-button mb-color-picker-clear\" ng-if=\"mbColorClearButton && value\" ng-click=clearValue(); aria-label=\"Clear Color\"> <mb-icon>clear</mb-icon> </mb-button> </div>"
  );


  $templateCache.put('scripts/module-ui/directives/mb-file-input.html',
    "<div layout=column class=mb-file-input> <div layout=column class=mb-file-input-preview-container ng-class=\"{'disabled':isDisabled}\" ng-show=\"isDrag || (isPreview && mbFiles.length)\"> <div class=mb-file-input-drag> <div layout=row layout-align=\"center center\" class=mb-file-input-drag-text-container ng-show=\"(!mbFiles.length || !isPreview) && isDrag\"> <div class=mb-file-input-drag-text mb-translate>{{strCaptionDragAndDrop}}</div> </div> <div class=mb-file-input-thumbnails ng-if=isPreview> <div class=mb-file-input-frame ng-repeat=\"mbFile in mbFiles\" ng-click=onFileClick(mbFile)> <div class=mb-file-input-x aria-label=\"remove {{mbFile.mbFileName}}\" ng-click=removeFile(mbFile,$event)>&times;</div> <mb-file ng-model=mbFile mb-unknow-class=strUnknowIconCls> </mb-file> <div class=mb-file-input-frame-footer> <div class=mb-file-input-frame-caption mb-translate>{{::mbFile.mbFileName}}</div> </div> </div> </div> <div class=clearfix style=clear:both></div> </div> <div layout=row> <span flex></span> <md-button aria-label=browse class=md-icon-button ng-disabled=isDisabled ng-click=openDialog($event)> <mb-icon>add</mb-icon> </md-button> <md-button aria-label=\"remove all files\" class=md-icon-button ng-click=removeAllFiles($event) ng-hide=\"!mbFiles.length || !isPreview\"> <mb-icon>clear_all</mb-icon> </md-button> </div> </div> <div layout=row class=mb-file-input-container> <div class=mb-file-input-caption layout=row layout-align=\"start center\" flex ng-class=\"{'disabled':isDisabled}\"> <mb-icon></mb-icon> <div flex class=mb-file-input-caption-text-default ng-show=!mbFiles.length mb-translate>{{strCaptionPlaceholder}}</div> <div flex class=mb-file-input-caption-text ng-hide=!mbFiles.length> <span ng-if=isCustomCaption>{{strCaption}}</span> <span ng-if=!isCustomCaption>{{ mbFiles.length == 1 ? mbFiles[0].mbFileName : mbFiles.length+\" files selected\" }}</span> </div> <md-progress-linear md-mode=determinate value={{floatProgress}} ng-show=\"intLoading && isProgress\"> </md-progress-linear> </div> <md-button aria-label=\"remove all files\" ng-disabled=isDisabled ng-click=removeAllFiles() ng-hide=\"!mbFiles.length || intLoading\" class=\"md-raised mb-file-input-button mb-file-input-button-remove\" ng-class=strRemoveButtonCls> <mb-icon>delete</mb-icon>  </md-button> <md-button aria-label=submit ng-disabled=isDisabled class=\"md-raised md-warn mb-file-input-button mb-file-input-button-submit\" ng-click=onSubmitClick() ng-class=strSubmitButtonCls ng-show=\"mbFiles.length && !intLoading && isSubmit\"> <mb-icon>send</mb-icon>  </md-button> <md-button aria-label=browse class=\"md-raised mb-file-input-button mb-file-input-button-brower\" ng-disabled=isDisabled ng-click=openDialog($event) ng-class=strBrowseButtonCls> <mb-icon>more_horiz</mb-icon>  </md-button> </div> </div>"
  );


  $templateCache.put('scripts/module-ui/directives/mb-titled-block.html',
    "<div class=\"md-whiteframe-2dp mb-titled-block\"> <md-toolbar class=md-hue-1 layout=row style=\"border-top-left-radius: 5px; border-top-right-radius: 5px; margin: 0px; padding: 0px\"> <div layout=row layout-align=\"start center\" class=md-toolbar-tools> <mb-icon size=24px style=\"margin: 0;padding: 0px\" ng-if=mbIcon>{{::mbIcon}}</mb-icon> <h3 mb-translate=\"\" style=\"margin-left: 8px; margin-right: 8px\">{{::mbTitle}}</h3> </div> <md-menu layout-align=\"end center\" ng-show=mbMoreActions.length> <md-button class=mb-icon-button aria-label=Menu ng-click=$mdMenu.open($event)> <mb-icon>more_vert</mb-icon> </md-button> <md-menu-content width=4> <md-menu-item ng-repeat=\"item in mbMoreActions\"> <md-button ng-click=$evalAction(item) aria-label={{::item.title}}> <mb-icon ng-show=item.icon>{{::item.icon}}</mb-icon> <span mb-translate=\"\">{{::item.title}}</span> </md-button> </md-menu-item> </md-menu-content> </md-menu> </md-toolbar> <md-progress-linear ng-style=\"{'visibility': mbProgress?'visible':'hidden'}\" md-mode=indeterminate class=md-primary> </md-progress-linear> <div flex ng-transclude style=\"padding: 16px\"></div> </div>"
  );


  $templateCache.put('scripts/module-ui/factories/MbColorPicker.html',
    "<md-dialog class=mb-color-picker-dialog> <div mb-color-picker-container value=value default random={{random}} ok=ok mb-color-alpha-channel=mbColorAlphaChannel mb-color-spectrum=mbColorSpectrum mb-color-sliders=mbColorSliders mb-color-generic-palette=mbColorGenericPalette mb-color-material-palette=mbColorMaterialPalette mb-color-history=mbColorHistory mb-color-hex=mbColorHex mb-color-rgb=mbColorRgb mb-color-hsl=mbColorHsl mb-color-default-tab=mbColorDefaultTab></div> <md-actions layout=row> <md-button class=md-mini ng-click=close() style=\"width: 50%\">Cancel</md-button> <md-button class=md-mini ng-click=ok() style=\"width: 50%\">Select</md-button> </md-actions> </md-dialog>"
  );


  $templateCache.put('scripts/module-ui/resources/file.html',
    "<mb-file-input ng-model=files ng-change=ctrl.setFiles(files) aria-label=\"upload file\" mb-accept=\"{{ctrl.$style.accept || 'audio/*,video/*,image/*,text/*,application/*'}}\" mb-drag-and-drop-label=\"{{::(ctrl.$style.dragAndDropLabel || 'Drag and Drop file')}}\" mb-browse-label=\"{{::(ctrl.$style.browseLabel || 'Browse')}}\" mb-remove-label=\"{{::(ctrl.$style.removeLabel || 'Trash')}}\" mb-progress mb-preview mb-drag> </mb-file-input>"
  );


  $templateCache.put('scripts/module-ui/resources/files.html',
    "<mb-file-input ng-model=files ng-change=ctrl.setFiles(files) aria-label=\"upload file\" mb-accept=\"{{ctrl.$style.accept || 'audio/*,video/*,image/*,text/*,application/*'}}\" mb-drag-and-drop-label=\"{{::(ctrl.$style.dragAndDropLabel || 'Drag and Drop file')}}\" mb-browse-label=\"{{::(ctrl.$style.browseLabel || 'Browse')}}\" mb-remove-label=\"{{::(ctrl.$style.removeLabel || 'Trash')}}\" mb-progress mb-preview mb-drag mb-multiple> </mb-file-input>"
  );


  $templateCache.put('scripts/module-ui/resources/url.html',
    "<div layout=column layout-padding ng-init=\"value=ctrl.getValue()\" flex> <p mb-translate>Insert a valid URL, please.</p> <md-input-container class=\"md-icon-float md-block\"> <label mb-translate>URL</label> <input ng-model=url ng-change=ctrl.setUrl(url)> </md-input-container> </div>"
  );

}]);
