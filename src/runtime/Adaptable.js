

/**
An class for an adaptable object.

Adaptable objects can be dynamically extended to provide different classes (or "adapters"). 
Adapters are created by adapter class, which are in turn managed by type by adapter managers.

For example,

	 Adaptable a = [some adaptable];
	 Foo x = Adapters.getAdapter(a, 'Foo', true);
	 if (x != null)
		 [do Foo things with x]
 
This clas can be used without application running.


 */
export default class Adaptable {

	/**
	Returns an object which is an instance of the given class associated with this object. Returns null if no such object can be found.
	
	Clients may implement this method but should generally call Adapters.adapt(Object, Class, boolean) rather than invoking it directly.

	@param string adapter the adapter class to look up
	@return a object of the given class, or null if this object does not have an adapter for the given class
	 */
	getAdapter(adapter) {
		return null;
	}
}