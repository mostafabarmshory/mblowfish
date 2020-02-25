# Modules

Add modules support inot the dashboard.

- Global modules
- Local modules

NOTE: some modules may conflicts with the framework itself.

## How to contribute


## Extensions

Extensions are responsible to add extra functionality to the framework.

### How to wirte a extension

Implement an extension loader function as follow

	/*
	 * Module loader
	 * @ngInject
	 */
	function extensionLoader($actions){
		// TODO run integeration
		$actions.addAction({..});
	}

Then load your extension:

	mblowfish.addExtension(extensionLoader);

There may be serveral extensions in a module.

If the module is enable, then all extensions will be loaded.
