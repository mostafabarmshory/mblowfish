# Material Blowfish RCP


The MBlowfish version 4.0 started as a modular and extensible application framework. It means that the framework is used to create feature-rich stand-alone web applications.

The release of Mblowfish in version 4.x simplified and unified the MBlowfish programming model. It is based on state-of-the-art technologies, like dependency injection and declarative styling via CSS files.

The ViraWeb123 Dashboard can be viewed as a special Eclipse application with the focus on supporting software development. For example, the Contemtn Managemnt System (CMS) provide the functionality to manage site contents.

## Module Architecture

While the MBlowfish platform is designed to serve as an open tools platform, it is architected so that its components could be used to build just about any client application. The minimal set of modules needed to build a rich client application is collectively known as the Rich Client Platform.

Applications can be built using a subset of the platform. These rich applications are still based on AngularJS, and the UI is built using the Material Designed. The layout and function of the workbench is under fine-grained control of the Module developer in this case.


A web application consists of individual software components, called module. They can use and extend existing modules. The most important configuration file for module is the index.js script. It defines the basic data of the module, like its unique identifier.

## Installation

To install with bower:

	bower install https://github.com/viraweb123/mblowfish.git#4.0.0

## Basic Components

- Frame
- View
- Editor
- Toolbar
- Sidenavs
- Action

