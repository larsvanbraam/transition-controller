import getComponentForElement from 'muban-core/lib/utils/getComponentForElement';
import isElement from 'lodash/isElement';
import isString from 'lodash/isString';
import AbstractTransitionController from '../../../src/lib/AbstractTransitionController';
import CoreComponent from 'muban-core/lib/CoreComponent';

export default abstract class CustomTransitionController<
  T extends CoreComponent
  > extends AbstractTransitionController<T> {
  /**
   * This method finds a component based on a string, a html element or the instance.
   *
   * @protected
   * @param {string | HTMLElement | ICoreComponent} component
   * @returns {ICoreComponent}
   */
  protected getComponent(component: string | HTMLElement | T): T {
    let instance: T;

    if (isElement(component)) {
      instance = getComponentForElement<T>(<HTMLElement>component);
    } else if (isString(component)) {
      instance = getComponentForElement<T>(this.parentController.getElement(<string>component));
    } else {
      instance = <T>component;
    }

    if (instance === undefined) {
      throw new Error(`The requested component [${component}] does not exist`);
    }

    return instance;
  }
}
