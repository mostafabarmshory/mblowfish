


/**

@name DispatcherUtils

Dispatcher Utils is a set of basic utility classes to help get you started with Flux. These base classes are a solid foundation for a simple Flux application, but they are not a feature-complete framework that will handle all use cases. There are many other great Flux frameworks out there if these utilities do not fulfill your needs.

# Usage

There are three main factory exposed in Dispatcher Utils:

- Store
- ReduceStore
- Container

These base factories can be imported from dispatcher utils like this:

@example
import { ReduceStore } from 'flux/utils';
class CounterStore extends ReduceStore<number> {
  getInitialState(): number {
    return 0;
  }
  reduce(state: number, action: Object): number {
    switch (action.type) {
      case 'increment':
        return state + 1;

      case 'square':
        return state * state;

      default:
        return state;
    }
  }
}

# Best practices

There are some best practices we try to follow when using these factories:

## Stores

- Cache data
- Expose public getters to access data (never have public setters)
- Respond to specific actions from the dispatcher
- Always emit a change when their data changes
- Only emit changes during a dispatch

## Actions

Describe a user's action, are not setters. (e.g. select-page not set-page-id)

## Containers

- Are React components that control a view
- Primary job is to gather information from stores and save it in their state
- Have no props and no UI logic

#Views

- Are React components that are controlled by a container
- Have all of the UI and rendering logic
- Receive all information and callbacks as props

 */