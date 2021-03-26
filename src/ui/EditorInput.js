

/**

EditorInput is a light weight descriptor of editor input, like a file name but more abstract. 
It is not a model. It is a description of the model source for an EditorPart.

Clients should extend this class to declare new types of editor inputs.

An editor input is passed to an editor via the Editor.init method. Due to the wide range of valid editor 
inputs, it is not possible to define generic methods for getting and setting bytes. However, two 
subtypes of EditorInput have been defined for greater type clarity when Storage (StorageEditorInput) 
and Files (FileEditorInput) are used. Any editor which is file-oriented should handle these two types. 
The same pattern may be used to define other editor input types.

The StorageEditorInput call is used to wrap an Storage object. This may represent read-only data in a repository, 
external json, or file system. The editor should provide viewing (but not editing) functionality.

The FileEditorInput interface is used to wrap an file resource (File). The editor should provide read and write functionality.


 */

export default class EditorInput {

	/**
	Returns whether the editor input exists.
	
	This method is primarily used to determine if an editor input should appear in the "File Most Recently Used" menu. 
	An editor input will appear in the list until the return value of exists becomes false or it drops off the bottom of the list.
	
	
	@return boolean true if the editor input exists; false otherwise
	 */
	exists() {
		return false;
	}

	/**
	Returns the image address for this input.
	
	Note: although a null return value has never been permitted from this method, there are many known buggy implementations 
	that return null. 
	Implementors that have been returning null from this method should pick some other default return value 
	(such as 'resources/editor/default.png').

	@return string the image address for this input; may be null if there is no image.
	 */
	getImage() {
		return 'resources/editor/default.png';
	}

	/**
	Returns the name of this editor input for display purposes.
	
	For instance, when the input is from a file, the return value would ordinarily be just the file name.

	@return the name string; never null;
	 */
	getName() {
		return 'no name';
	}

	/**
	Returns the tool tip text for this editor input. This text is used to differentiate between two i
	nput with the same name. For instance, MyClass.java in folder X and MyClass.java in folder Y. The 
	format of the text varies between input types.
	
	@return string the tool tip text; never null.
	 */
	getDescription() {
		return 'no description';
	}

	/**
	Returns an object that can be used to save the state of this editor input.
	
	@return the persistable element, or null if this editor input cannot be persisted
	 */
	getPersistable() {
		return null;
	}
}