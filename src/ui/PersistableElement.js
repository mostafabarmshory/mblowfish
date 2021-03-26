import Persistable from './Persistable';

/**
Class for asking an object to store its state in key value format.

This class is typically included in class where persistance is required.

When the workbench is shutdown objects which extends this class will be persisted. 


 */
export default class PersistableElement extends Persistable {
	
	/**
	Returns the id of the element factory which should be used to re-create this object.
	
	Factory ids are declared in url.
	
	@returns the element factory id
	 */
	getFactoryId(){
		return null;
	}
	
}