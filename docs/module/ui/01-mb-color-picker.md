# mb-color-picker

Mblowfish based color picker with no jQuery or other DOM/utility library dependencies.


## Usage

Place the directive wherever it is needed.  _note:_ this breaks the old version 0.1 as it now uses _ng-model_ instead of _value_

````html
<div mb-color-picker ng-model="valueObj"></div>
````

## Options

Options may be set either by an options object on the `mb-color-picker` attribute and/or using attributes.  If an option is present on both the options object and as an attribute, the attribute will take precedence.

**Setting options by scope object**
```js
// Controller
$scope.scopeVariable.options = {
    label: "Choose a color",
    icon: "brush",
    default: "#f00",
    genericPalette: false,
    history: false
};
```
```html
<div mb-color-picker="scopeVariable.options" ng-model="scopeVariable.color"></div>
```

**Setting options by attribute**
```html
<div
    mb-color-picker
    ng-model="scopeVariable.color"
    label="Choose a color"
    icon="brush"
    default="#f00"
    mb-color-generic-palette="false"
    mb-color-history="false"
></div>
```

| Option Object name  	| Attribute Option name     	| Type        	| Default            	| Description                                                                                                                                                                                                                                          	|
|---------------------	|---------------------------	|-------------	|--------------------	|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------	|
| type                	| type                      	| Int         	| 0                  	| Default output type. 0: hex, 1: rgb, 2: hsl                                                                                                                                                                                                          	|
| label               	| label                     	| String      	| ""                 	| The lable for the input.                                                                                                                                                                                                                             	|
| icon                	| icon                      	| String      	| ""                 	| Material Icon name. https://design.google.com/icons/                                                                                                                                                                                                 	|
| random              	| random                    	| Boolean     	| false              	| Select a random color on open                                                                                                                                                                                                                        	|
| default             	| default                   	| Color       	| "rgb(255,255,255)" 	| Default color                                                                                                                                                                                                                                        	|
| openOnInput         	| open-on-input             	| Boolean     	| true               	| Open color picker when user clicks on the input field. If disabled, color picker will only open when clicking on the preview.                                                                                                                        	|
| hasBackdrop         	| has-backdrop              	| Boolean     	| true               	| Dialog Backdrop. https://material.angularjs.org/latest/api/service/$mdDialog                                                                                                                                                                         	|
| clickOutsideToClose 	| click-outside-to-close    	| Boolean     	| true               	| Dialog click outside to close. https://material.angularjs.org/latest/api/service/$mdDialog                                                                                                                                                           	|
| skipHide            	| skip-hide                 	| Boolean     	| true               	| Allows for opening multiple dialogs. https://github.com/angular/material/issues/7262                                                                                                                                                                 	|
| preserveScope       	| preserve-scope            	| Boolean     	| true               	| Dialog preserveScope. https://material.angularjs.org/latest/api/service/$mdDialog                                                                                                                                                                    	|
| clearButton         	| mb-color-clear-button     	| Boolean     	| true               	| Show the "clear" button inside of the input.                                                                                                                                                                                                         	|
| preview             	| mb-color-preview          	| Boolean     	| true               	| Show the color preview circle next to the input.                                                                                                                                                                                                     	|
| alphaChannel        	| mb-color-alpha-channel    	| Boolean     	| true               	| Enable alpha channel.                                                                                                                                                                                                                                	|
| spectrum            	| mb-color-spectrum         	| Boolean     	| true               	| Show the spectrum tab.                                                                                                                                                                                                                               	|
| sliders             	| mb-color-sliders          	| Boolean     	| true               	| Show the sliders tab.                                                                                                                                                                                                                                	|
| genericPalette      	| mb-color-generic-palette  	| Boolean     	| true               	| Show the generic palette tab.                                                                                                                                                                                                                        	|
| materialPalette     	| mb-color-material-palette 	| Boolean     	| true               	| Show the material colors palette tab.                                                                                                                                                                                                                	|
| history             	| mb-color-history          	| Boolean     	| true               	| Show the history tab.                                                                                                                                                                                                                                	|
| hex             	| mb-color-hex          	| Boolean     	| true               	| Show the HEX values tab.                                                                                                                                                                                                                                	|
| rgb             	| mb-color-rgb          	| Boolean     	| true               	| Show the RGB values tab.                                                                                                                                                                                                                                	|
| hsl             	| mb-color-hsl          	| Boolean     	| true               	| Show the HSL values tab.                                                                                                                                                                                                                                	|
| defaultTab          	| mb-color-default-tab      	| String, Int 	| "spectrum"         	| Which tab should be selected when opening.  Can either be a string or index.  If the value is an index, do not count hidden/disabled tabs. <ul><li>spectrum</li><li>sliders</li><li>genericPalette</li><li>materialPalette</li><li>history</li></ul> 	|


