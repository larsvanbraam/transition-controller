import { Vue } from 'vue/types/vue';
import isElement from 'lodash/isElement';
import isString from 'lodash/isString';
import AbstractTransitionController from '../../../src/lib/AbstractTransitionController';

export default abstract class AbstractVueTransitionController extends AbstractTransitionController<Vue> {

  /**
   * @protected
   * @method getComponent
   * @description The method that finds the component based on a string, html element or instance
   * @param {string | HTMLElement | Vue} component
   * @returns {Vue}
   */
  protected getComponent( component: string | HTMLElement | Vue):Vue {
    let instance: Vue;

    if (isElement(component)) {
      instance = this.parentController.$children.find(child => child.$el === component);
    } else if (isString(component)) {
      const key = Object.keys(this.parentController.$refs).find(key => key === component);
      instance = <Vue>this.parentController.$refs[key];
    } else {
      instance = <Vue>component;
    }

    if (instance === undefined) {
      throw new Error(`The requested component [${component}] does not exist`);
    }

    return instance;
  }
}
