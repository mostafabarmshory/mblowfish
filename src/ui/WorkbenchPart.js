import Adaptable from '../runtime/Adaptable';


/**
A workbench part is a visual component within a workbench page.  There are two subtypes: view and editor, as defined by ViewPart and EditorPart.


A view is typically used to navigate a hierarchy of information (like the workspace), 
open an editor, or display properties for the active editor. Modifications made in a 
view are saved immediately.

An editor is typically used to edit or browse a document or input object. The input 
is identified using an IEditorInput. Modifications made in an editor part follow an 
open-save-close lifecycle model.

This interface may be implemented directly. For convenience, a base implementation is 
defined in WorkbenchPart.

The lifecycle of a workbench part is as follows:

When a part extension is created:

instantiate the part
create a part site
call part.init(site)
When a part becomes visible in the workbench:
add part to presentation by calling part.createPartControl(parent) to create actual widgets
fire partOpened event to all listeners
When a part is activated or gets focus:
call part.setFocus()
fire partActivated event to all listeners
When a part is closed:
if save is needed, do save; if it fails or is canceled return
if part is active, deactivate part
fire partClosed event to all listeners
remove part from presentation; part controls are disposed as part of the SWT widget tree
call part.dispose()


After createPartControl has been called, the implementor may safely reference the controls 
created. When the part is closed these controls will be disposed as part of an SWT composite. 
This occurs before the IWorkbenchPart.dispose method is called. If there is a need to 
free SWT resources the part should define a dispose listener for its own control and free 
those resources from the dispose listener. If the part invokes any method on the disposed 
SWT controls after this point an SWTError will be thrown.

The last method called on IWorkbenchPart is dispose. This signals the end of the part lifecycle.

An important point to note about this lifecycle is that following a call to init, 
createPartControl may never be called. Thus in the dispose method, implementors must not 
assume controls were created.

Workbench parts implement the IAdaptable interface; extensions are managed by the platform's 
adapter manager.

 */
export default class WorkbenchPart extends Adaptable {


/**
void addPropertyListener(IPropertyListener listener)
Adds a listener for changes to properties of this workbench part. Has no effect if an identical listener is already registered.
The property ids are defined in IWorkbenchPartConstants.

Parameters:
listener - a property listener	


 */



/**
void createPartControl(Composite parent)
Creates the SWT controls for this workbench part.
Clients should not call this method (the workbench calls this method when it needs to, which may be never).

For implementors this is a multi-step process:

Create one or more controls within the parent.
Set the parent layout as needed.
Register any global actions with the site's IActionBars.
Register any context menus with the site.
Register a selection provider with the site, to make it available to the workbench's ISelectionService (optional).
Parameters:
parent - the parent control


 */


/**
void dispose()
Disposes of this workbench part.
This is the last method called on the IWorkbenchPart. At this point the part controls (if they were ever created) have been disposed as part of an SWT composite. There is no guarantee that createPartControl() has been called, so the part controls may never have been created.

Within this method a part may release any resources, fonts, images, etc.  held by this part. It is also very important to deregister all listeners from the workbench.

Clients should not call this method (the workbench calls this method at appropriate times).


 */

/**
IWorkbenchPartSite getSite()
Returns the site for this workbench part. The site can be null while the workbench part is being initialized. After the initialization is complete, this value must be non-null for the remainder of the part's life cycle.
Returns:
The part site; this value may be null if the part has not yet been initialized


 */


/**
String getTitle()
Returns the title of this workbench part. If this value changes the part must fire a property listener event with PROP_TITLE.
The title is used to populate the title bar of this part's visual container.

Returns:
the workbench part title (not null)

 */


/**
Image getTitleImage()
Returns the title image of this workbench part. If this value changes the part must fire a property listener event with PROP_TITLE.
The title image is usually used to populate the title bar of this part's visual container. Since this image is managed by the part itself, callers must not dispose the returned image.

Returns:
the title image


 */


/**
String getTitleToolTip()
Returns the title tool tip text of this workbench part. An empty string result indicates no tool tip. If this value changes the part must fire a property listener event with PROP_TITLE.
The tool tip text is used to populate the title bar of this part's visual container.

Returns:
the workbench part title tool tip (not null)

 */

/**
void removePropertyListener(IPropertyListener listener)
Removes the given property listener from this workbench part. Has no effect if an identical listener is not registered.
Parameters:
listener - a property listener

 */

/**

void setFocus()
Asks this part to take focus within the workbench. Parts must assign focus to one of the controls contained in the part's parent composite.
Clients should not call this method (the workbench calls this method at appropriate times). To have the workbench activate a part, use IWorkbenchPage.activate(IWorkbenchPart) instead.
 */

}