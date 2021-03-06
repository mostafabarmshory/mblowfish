module.exports = (config) => {
	config.set({
		// ... normal karma configuration
		singleRun: true,
		failOnEmptyTestSuite: false,
		logLevel: config.LOG_WARN, //config.LOG_DISABLE, config.LOG_ERROR, config.LOG_INFO, config.LOG_DEBUG

		// make sure to include webpack as a framework
		frameworks: ['jasmine', 'webpack'],


		files: [
			// all files ending in ".test.js"
			// !!! use watched: false as we use webpacks watch
			{
				pattern: './src/**/*.spec.js',
				watched: true
			}
		],

		preprocessors: {
			// add webpack as preprocessor
			'./src/**/*.js': ['webpack']
		},

		webpack: {
			// karma watches the test entry points
			// Do NOT specify the entry option
			// webpack watches dependencies

			// webpack configuration
		},
		//list of browsers to launch and capture
		browsers: [
			//			'Chrome',
//			'Chromium',
						'ChromiumHeadless',
//						'FirefoxHeadless',
			//			'Edge',
			//			'ChromeCanary',
			//			'Opera',
			//			'IE',
			//			'Safari',
		],
		//list of reporters to use
		reporters: [
			//			'mocha',
			//			'kjhtml',
			//			'dots',
			'progress',
			//			'spec'
		],
	});
}

