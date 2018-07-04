import { TimelineLite, TimelineMax, Elastic } from 'gsap';
import Vue from 'vue';
import AbstractVueTransitionController from '../AbstractVueTransitionController';
import TransitionDirection from '../../../../src/lib/enum/TransitionDirection';

export const TransitionId = {
  [TransitionDirection.IN]: {},
  [TransitionDirection.OUT]: {},
  LOOP_1: 'loop-1',
  LOOP_2: 'loop-2',
};

export default class DummyComponentTransitionController extends AbstractVueTransitionController {
  /**
   * @public
   * @method setupTransitionInTimeline
   * @param {TimelineLite | TimelineMax} timeline
   * @param {Vue} parent
   * @param {string} id
   */
  public setupTransitionInTimeline(timeline: TimelineLite | TimelineMax, parent: Vue, id: string ): void {}

  /**
   * @public
   * @method setupTransitionOutTimeline
   * @param { TimelineMax } timeline
   * @param { Vue } parent
   * @param { string } id
   */
  public setupTransitionOutTimeline(timeline: TimelineLite | TimelineMax, parent: Vue, id: string ): void {}

  /**
   * @public
   * @method setupLoopingAnimationTimeline
   * @param {TimelineMax} timeline
   * @param {Vue} parent
   * @param {string} id
   * @description overwrite this method in the parent class
   * */
  public setupLoopingAnimationTimeline(timeline: TimelineLite | TimelineMax, parent: Vue,  id: string): void {
    const { button } = parent.$refs;

    switch (id) {
      case TransitionId.LOOP_1:
        timeline.fromTo(button, 2, {rotation: 0}, {rotation: 360, ease: Elastic.easeOut});
        break;
      case TransitionId.LOOP_2:
        timeline.fromTo(button, 1, {yPercent: 0}, {yPercent: 100, ease: Elastic.easeInOut});
        timeline.fromTo(button, 1, {yPercent: 100}, {yPercent: 0, ease: Elastic.easeInOut});
        break;
      default:
        timeline.fromTo(button, 1, {xPercent: 0}, {xPercent: 100, ease: Elastic.easeInOut});
        timeline.fromTo(button, 1, {xPercent: 100}, {xPercent: 0, ease: Elastic.easeInOut});
        break;
    }
  }
}
