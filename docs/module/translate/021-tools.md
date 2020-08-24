# Tools

There isn't only the translate as an additional module you might wanna use. There's an entire angular-translate universe! This universe also covers additional things around the module itself. We're currently maintaining a few tools that you might be interested in when developing apps with the translate.

## grunt-angular-translate

## webpack-angular-translate

Webpack loader that extracts the translation ids (with the default text) from javascript and html files and creates a json-export. webpack-angular-translate on GitHub

## ngTranslateEditor

ngTranslateEditor

This handy tool reads and writes JSON files which the standard loader are capable to read. It can be used for managing translations of small or medium sized translation tables.

## grunt-po2json-angular-translate

This is a grunt task created to help you to convert your po-formatted strings into a format compatible with angular-translate. If you want deeper information, head over to the GitHub repo.

Briefly, to set it up, you need two steps:

1) Install it and enable it on your gruntfile

	npm install grunt-po2json-angular-translate --save-dev
	grunt.loadNpmTasks('grunt-po2json-angular-translate');

2) Add the configuration according to your needs, for example:

	grunt.initConfig({
	  po2json_angular_translate: {
	  options: {
	     pretty: false,
	     upperCaseId : false
	    },
	    your_target: {
	                 files: {
	                     // This will generate a single json file with all the specified strings
	                     'tmp/dest.json' : ['test/fixtures/*.po'],
	
	                     //this will create several json files, the names of them will be the same than in the .po files
	                     'tmp/dest' : ['test/fixtures/*.po']
	                  }
	    },
	  },
	});

Whether you need a single or multiple .json files, depends on your special case.

There are several options that could help you on the development/production environment, but the more important ones, are the next ones:

options.pretty

Type: Boolean Default value: false If you want to pretty print the result

options.cleanPrevStrings
Type: Boolean Default value: false It will remove all the previous generated files on the destination specified before creating the new ones.

There are other options to help you on the generation of the output .json file, for example, converting your gettext formatted pluralized strings, setting custom placeholders or converting the msgid to uppercase.

This is an example of configuration used in an actual project:

        'po2json_angular_translate': {
            dev: {
                options: {
                    pretty: false,
                    cleanPrevStrings: false
                },
                files: {
                    'app/i18n/en/' : ['po/en/dashboard/*.po'],
                    'app/i18n/en/common-strings.json' : ['po/en/dashboard/common/*.po'],

                    'app/i18n/de/' : ['po/de/dashboard/*.po'],
                    'app/i18n/de/common-strings.json' : ['po/de/dashboard/common/*.po']
                }
            },
            devOneFile: {
                options: {
                    pretty: false,
                    cleanPrevStrings: true
                },
                files: {
                    'app/i18n/en/strings.json' : ['po/en/dashboard/**/*.po'],
                    'app/i18n/de/strings.json' : ['po/de/dashboard/**/*.po']
                }
            },
            dist: {
                options: {
                    pretty: false,
                    cleanPrevStrings: true
                },
                files: {
                    'app/dist/i18n/en/' : ['po/en/dashboard/*.po'],
                    'app/dist/i18n/en/common-strings.json' : ['po/en/dashboard/common/*.po'],

                    'app/dist/i18n/de/' : ['po/de/dashboard/*.po'],
                    'app/dist/i18n/de/common-strings.json' : ['po/de/dashboard/common/*.po']
                }
            }
        },
