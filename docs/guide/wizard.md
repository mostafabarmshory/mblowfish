# Creating MBlowfish Wizards

This article shows you how to implement a wizard using the MBlowfish and how to contribute your wizard to the workbench. A wizard whose page structure changes according to user input is implemented to demonstrate the flexibility of wizard support.

## Introduction

Wizards are used extensively throughout mblowfish. You can use wizards to create a new account or new resources like Page, Image or Files. A well designed wizard can considerably simplify user tasks and increase productivity.

Wizards are meant to take the hassle out of standard, repetitive, or tedious user tasks. For example, the New Page can collect enough information to generate a page, including page title, description, canonical link, and other details. Of course, as the wizard developer, you must implement the code that makes the wizard useful for your domain.

Not only does the platform contain many wizards, but there is a lot of support for writing your own. The MBlowfish wizard framework lets you concentrate on the specifics of your wizard implementation. You will need to use the mblowfish.wizard. It is very easy to get started while the support is flexible enough to allow you to add more complex logic to your wizards.

## Wizard sample

Our sample wizard will gather some holiday travel choices from the user and collect more information based on the user's initial choices. Information about the holiday is kept in a model data object which is manipulated by the wizard page. The user's holiday data will be displayed in an information dialog upon completion of the wizard.

### Running the Wizard

To run the sample or view its source, unzip the com.xyz.article.wizards.zip (updated July 2007 for Eclipse 3.3) into your eclipse root directory and restart the workbench. You can start the sample wizard from the New button or from File>New menu of the workbench (Figure 5). Alternatively, you can select the context menu of a folder (in any perspective) and start the wizard from there (Figure 6).

Let's look at our sample wizard in detail before diving into details of implementing it. On the first page the users can select the dates of travel, the type of transport for their holiday and enter the departure and destination locations:

Let's look at our sample wizard in detail before diving into details of implementing it. On the first page the users can select the dates of travel, the type of transport for their holiday and enter the departure and destination locations:

Figure 1. Starting page of the wizard

The next page to be shown depends on the selected mode of transport. If the user has selected travel by plane the following page is displayed which shows the available flights. To keep the example code simple this information will be hard coded, rather than obtained from some database. The user can select the type of seat they want and to ask for the ticket price by pushing the "Get price" button. The base price is hard-coded as well. A discount is offered in conditions explained below.

Figure 2. Page displayed when the user has selected the plane

When the user has selected a flight and a type of seat the wizard can be finished.

If the user has selected the car as mode of transport, a different page is shown. The user can select the name of a rental company. Based on the company name, the price of the rented car is displayed. Once again, the prices are hard-coded and depend only on the rental company selected but not on dates and destination. The user can select whether to buy insurance from the rental company.

Figure 3. Page displayed when the user has selected the car.

When the user clicks Finish a message dialog is displayed summarizing the holiday data collected from the user. The wizard responds to various events and reports user errors.

This article explains the following:

- how to create, add and initialize wizard pages
- how to listen for events and control errors
- how to change the page order
- what to do on completion of a wizard
- how to start a wizard

## Wizard Pages

Mblowfish provides the class MbWizard and MbWizardPage to describe wizards and corresponding implementation classes that handle many of the details of implementing wizards. Our wizard HolidayWizard is an instance of MbWizard. Its main responsibilities are to create the pages inside the wizard and perform the work when the wizard is completed.

### Adding Pages to a Wizard

Each page is instantiated and added to the wizard. The order in which we add the pages to the wizard is the default navigation order. The page which is added first will be the starting page when the wizard is opened. Later we will look at ways of changing these defaults. The corresponding method on the HolidayWizard class is shown below:

	mblowfish
		.wizardPage('holidayPage', {..})
		.wizardPage('planePage', {..})
		.wizardPage('carPage', {..})
		.wizard('holiday', {
			pages:[
				'holidayPage',
				'planePage',
				'carPage'
			]
		});


### Creating the view

Each page is a full UI component. 

	mblowfish
		.wizardPage('holidayPage', {
			templateUrl: 'app/holidayPage.html',
			controller: function($wizard, $wizardPage, $scope, ... ){..}
		});


### Events

To resive data change event in wizard:

	mblowfish
		.wizardPage('holidayPage', {
			...
			onChange: function($wizard){
				if(!$wizard.data.url){
					$wizard.setErrorMessage('URL is required');
				} else {
					$wizard.clearStatus();
				}
			}
		});


### Processing Errors

The data entered by the user on a wizard page can have a number of errors caused by wrong choices or invalid values. Where appropriate, we should disable the options which are not valid in order to prevent such errors. Where this is not possible, we need to inform the user of the error. When the user corrects it the error message needs to be cleared.

In the sample we disallow destinations to be the same as the departures (not much of a holiday, is it?). No travel back in time is allowed either, so the date of return needs to be after the date of travel. We won't check that the dates are correct. Hopefully you will not find any flight on the 30th of February anyway.

Figure 4. Reporting an error to the user.

You can use the setMessage and setErrorMessage methods to display information or error messages. The user can interact with the controls in any order and, consequently, produce or clear various errors. A common way to handle errors is to use a status variable for each possible type of event which can create an error, a warning or an information message.

The error handling for the first page is shown below. If the destination or departure fields have triggered the event , the the corresponding org.eclipse.core.runtime.IStatus variable, is either set with an error if the two are the same or cleared. If any of the date fields was modified , we set the timeStatus variable to the right value. At the end of each processing of an event , we update the page to display the most serious error message. This can be the first error or the first warning if there is no error or null if the page is correct. When the page is correct, we should see again the page description. This is how the sample code looks:

	mblowfish
		.wizardPage('holidayPage', {
			...
			onChange: function($wizard){
				if($wizard.data.from === $wizard.data.to){
					$wizard.setErrorMessage('Departure and destination cannot be the same');
				} else if(!isBefore($wizard.data.returnDate, $wizard.data.travelDate)) {
					$wizard.setErrorMessage('Return date cannot be before the travel date');
				} else {
					$wizard.setErrorMessage();
				}
			}
		});


### Navigation Buttons

Using the wizard support we can easily manage the navigation buttons on the wizard pages. These buttons can be Finish and Cancel if the wizard has one page, otherwise each wizard page has Back, Next, Finish and Cancel. By default, Next is enabled for all but the last page and Back for all pages but the first. .

For correct navigation we need to:

implement the canFlipToNextPage method on the page to return true when the user has selected/entered all the required information on the current page.
overwrite the canFinish method of of the wizard to return true when the wizard can be completed
ensure that the methods from above are called at the right moment to enable/disable the Next and Finish buttons

We look at each of these steps in a little more detail.

To implement the canFlipToNextPage method for the first page of our wizard, we first prevent the user from moving to the next page when the page has any errors. When there are no errors, the destination and departure fields are filled, the return date is set and a mode of transport is selected, the user can move to the next page.



	mblowfish
		.wizardPage('holidayPage', {
			...
			canFinish: function($wizard){
				'ngInject';
				if ($wizard.getErrorMessage()) {
					return false;
				}
				if ($wizard.data.from && 
					$wizard.data.to && 
					$wizard.data.plan &&
					$wizard.data.returnDate){
					return true;
				}
				return false;
			}
		});


Overwriting the canFinish method on the wizard class is useful when some fields or entire pages are optional. When we have all the required information for the current path through the wizard, canFinish should true and the wizard can be completed at any moment after this.

You can force the update of the navigation buttons. The right moment for this depends on your problem and the implementation of canFlipToNextPage and canFinish methods.


## Changing the Page Order

We can change the order of the wizard pages by adding the getNextPage method of wizard. Before leaving the page, we save in the model the values chosen by the user. In our example, depending on the choice of travel the user will next see either the page with flights or the page for travelling by car.



	mblowfish
		.wizard('holiday', {
			...
			getNextPage: function($wizard){
				switch($wizard.currentPage){
					case 'holidayPage': 
						return 'planePage';
					case 'planePage':
						if($wizard.data.plan === 'car'){
							 return 'carPage';
						}
						return 'finalPage';
				}
			}
		});


## Actions on Completion of the Wizard

To complete a wizard, the user can press either the Finish or the Cancel buttons. If the Cancel button is pressed, the performCancel method is called and you should overwrite this to cleanup any resources allocated while running the wizard. The real work is done in performFinish. In our case, this method is quite simple:

	mblowfish
		.wizard('holiday', {
			...
			performFinish: function($wizard){
				var summary = JSON.toString($wizard.data);
				alert(summary);
				return true;
			}
		});


The task to be completed at the end of the wizard could be a complex operation that modifies many workspace resources, files, classes or projects. This sort of operation could take a relatively long time. To keep the workbench responsive to user input or to give the user the possibility to cancel the operation we might want to run it in a different job. For more detail see Mblowfish job.

## Starting a Wizard

You can start a wizard either by defining a wizard contribution to the workbench or explicitly in your code. We will look at each of these methods in turn.

### Defining a wizard contribution

TODO: contribute wizard category and open a category as a wizard

## Starting the Wizard Explicitly

You may want to launch your wizard as a result of some action that you have defined.

The relevant code to start the wizard is:

	// Instantiates and initializes the wizard
	var holidayWizard = mblowfish.wizard('holidayWizard');
	holidayWizard.render({
		element: $element
	});
