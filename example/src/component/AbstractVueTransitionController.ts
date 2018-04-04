import { Vue } from 'vue/types/vue';
import isElement from 'lodash/isElement';
import isString from 'lodash/isString';
import { TimelineLite, TimelineMax } from 'gsap';
import AbstractTransitionController from '../../../src/lib/AbstractTransitionController';
import TransitionDirection from '../../../src/lib/enum/TransitionDirection';

export default abstract class AbstractVueTransitionController extends AbstractTransitionController<Vue> {
  /**
   * @public
   * @method getSubTimelineByComponent
   * @param {string | HTMLElement | Vue} component
   * @param {TransitionDirection} direction
   * @returns {TimelineLite | TimelineMax}
   */
  protected getSubTimelineByComponent(
    component: string | HTMLElement | Vue,
    direction: TransitionDirection,
  ): TimelineLite | TimelineMax {
    let instance: any;

    if (isElement(component)) {
      instance = this.parentController.$children.find(child => child.$el === component);
    } else if (isString(component)) {
      const key = Object.keys(this.parentController.$refs).find(key => key === component);
      instance = this.parentController.$refs[key];
    } else {
      instance = component;
    }

    if (instance === undefined) {
      throw new Error(`The requested component [${component}] does not exist`);
    }

    if (direction === TransitionDirection.IN) {
      return instance.transitionController.transitionInTimeline;
    }

    return instance.transitionController.transitionOutTimeline;
  }
}
