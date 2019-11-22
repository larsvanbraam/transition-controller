Before you can start to use the abstractTransitionController you first need to create your own abstract class for your specific framework. This is necessary because we need to write down how to get a timeline by a component. As you can see in the exaple below there are 3 ways of retrieving a component

1. **String**: this would be a unique string in which the component is registered to.
2. **HTMLElement**: This would be the reference to the HTML element
3. **T**: this would be the abstract typing of your desired framework. For example when using Vue.js T would be the typed version of  a vue component Vue.

**Example**
```javascript
import AbstractTransitionController, { TransitionDirection } from 'transition-controller';

abstract class AbstractDummyTransitionController extends AbstractTransitionController<T> {
 /**
   * @protected
   * @method getComponent
   * @param {string | HTMLElement | T} component
   * @returns {GSAPStatic.Timeline}
   */
  protected getComponent(component: string | HTMLElement | T, direction: TransitionDirection,): GSAPStatic.Timeline {
    const instance:T;

    // Add code that finds the instance based on the 3 provided types
    ...

    return instance;
  }
}
```
