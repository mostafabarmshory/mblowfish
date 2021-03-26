import WorkbenchPart from './WorkbenchPart';

export default class EditorPart extends WorkbenchPart {
	
	/**
	
IEditorInput getEditorInput()
Returns the input for this editor. If this value changes the part must fire a property listener event with PROP_INPUT.
Returns:
the editor input
	
	
	 */


	/**
	IEditorSite getEditorSite()
Returns the site for this editor. This method is equivalent to (IEditorSite) getSite().
The site can be null while the editor is being initialized. After the initialization is complete, this value must be non-null for the remainder of the editor's life cycle.

Returns:
the editor site; this value may be null if the editor has not yet been initialized
	
	
	 */
	
	/**
	void init(IEditorSite site,
          IEditorInput input)
   throws PartInitException
Initializes this editor with the given editor site and input.
This method is automatically called shortly after the part is instantiated. It marks the start of the part's lifecycle. The IWorkbenchPart.dispose method will be called automically at the end of the lifecycle. Clients must not call this method.

Implementors of this method must examine the editor input object type to determine if it is understood. If not, the implementor must throw a PartInitException

Parameters:
site - the editor site
input - the editor input
Throws:
PartInitException - if this editor was not initialized successfully
	
	
	 */
	
	
	/**
	void doSave(IProgressMonitor monitor)
Saves the contents of this part.
If the save is successful, the part should fire a property changed event reflecting the new dirty state (PROP_DIRTY property).

If the save is cancelled through user action, or for any other reason, the part should invoke setCancelled on the IProgressMonitor to inform the caller.

This method is long-running; progress and cancellation are provided by the given progress monitor.

Parameters:
monitor - the progress monitor
	
	 */
	
	
	
	/**
	void doSaveAs()
Saves the contents of this part to another object.
Implementors are expected to open a "Save As" dialog where the user will be able to select a new name for the contents. After the selection is made, the contents should be saved to that new name. During this operation a IProgressMonitor should be used to indicate progress.

If the save is successful, the part fires a property changed event reflecting the new dirty state (PROP_DIRTY property).
	
	 */
	
	/**
	
	boolean isDirty()
Returns whether the contents of this part have changed since the last save operation. If this value changes the part must fire a property listener event with PROP_DIRTY.
Note: this method is called often on a part open or part activation switch, for example by actions to determine their enabled status.

Returns:
true if the contents have been modified and need saving, and false if they have not changed since the last save
	 */
	
	/**
	boolean isSaveAsAllowed()
Returns whether the "Save As" operation is supported by this part.
Returns:
true if "Save As" is supported, and false if not supported
	
	 */
	
	/**
	
boolean isSaveOnCloseNeeded()
Returns whether the contents of this part should be saved when the part is closed.
Returns:
true if the contents of the part should be saved on close, and false if the contents are expendable
	
	 */
	
}