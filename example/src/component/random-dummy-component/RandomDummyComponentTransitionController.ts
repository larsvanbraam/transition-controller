import { Elastic } from 'gsap/all';
import Vue from 'vue';
import AbstractVueTransitionController from '../AbstractVueTransitionController';
import TransitionDirection from '../../../../src/lib/enum/TransitionDirection';

export const TransitionId = {
  [TransitionDirection.IN]: {
    LEFT_TO_RIGHT: 'left-to-right',
    RIGHT_TO_LEFT: 'right-to-left',
  },
  [TransitionDirection.OUT]: {
    TO_RIGHT: 'to-right',
    TO_LEFT: 'to-left',
  },
};

export default class RandomDummyComponentTransitionController extends AbstractVueTransitionController {
  /**
   * @public
   * @method setupTransitionInTimeline
   * @param {GSAPStatic.Timeline} timeline
   * @param {Vue} parent
   * @param {string} id
   */
  public setupTransitionInTimeline(timeline: GSAPStatic.Timeline, parent: Vue, id: string): void {
    timeline.fromTo(
      parent.$el,
      {
        x: window.innerWidth * 0.25 * Math.random(),
        autoAlpha: 1,
        scale: 1,
      },
      {
        x: 0,
        autoAlpha: 1,
        scale: 1,
        ease: Elastic.easeOut,
        duration: 1,
      },
    );
    timeline.add(this.getTimeline('dummyComponent', TransitionDirection.IN));
  }

  /**
   * @public
   * @method setupTransitionOutTimeline
   * @param { GSAPStatic.Timeline } timeline
   * @param { Vue } parent
   * @param { string } id
   */
  public setupTransitionOutTimeline(timeline: GSAPStatic.Timeline, parent: Vue, id: string): void {
    timeline.to(parent.$el, {
      autoAlpha: 0,
      scale: 2,
      duration: 1,
    });
    timeline.add(this.getTimeline('dummyComponent', TransitionDirection.OUT));
  }

  /**
   * @public
   * @method setupLoopingAnimationTimeline
   * @param {GSAPStatic.Timeline} timeline
   * @param {Vue} parent
   * @param {string} id
   * @description overwrite this method in the parent class
   * */
  public setupLoopingAnimationTimeline(timeline: GSAPStatic.Timeline, parent: Vue, id: string): void {}
}
