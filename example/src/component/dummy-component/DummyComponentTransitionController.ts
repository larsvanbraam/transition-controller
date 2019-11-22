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

export default class DummyComponentTransitionController extends AbstractVueTransitionController {
  /**
   * @public
   * @method setupTransitionInTimeline
   * @param {GSAPStatic.Timeline} timeline
   * @param {Vue} parent
   * @param {string} id
   */
  public setupTransitionInTimeline(timeline: GSAPStatic.Timeline, parent: Vue, id: string ): void {
    switch (id) {
      case TransitionId[TransitionDirection.IN].RIGHT_TO_LEFT:
        timeline.fromTo(
          parent.$el,
          {
            xPercent: 100,
            autoAlpha: 0,
          },
          {
            xPercent: 0,
            autoAlpha: 1,
            ease: Elastic.easeOut,
            duration: 1,
          },
        );
        break;
      case TransitionId[TransitionDirection.IN].LEFT_TO_RIGHT:
        timeline.fromTo(
          parent.$el,
          {
            xPercent: -100,
            autoAlpha: 0,
          },
          {
            xPercent: 0,
            autoAlpha: 1,
            ease: Elastic.easeOut,
            duration: 1,
          },
        );
        break;
      default:
        timeline.fromTo(parent.$el, { autoAlpha: 0 }, { autoAlpha: 1, duration: 1 });
        break;
    }
  }

  /**
   * @public
   * @method setupTransitionOutTimeline
   * @param { GSAPStatic.Timeline } timeline
   * @param { Vue } parent
   * @param { string } id
   */
  public setupTransitionOutTimeline(timeline: GSAPStatic.Timeline, parent: Vue, id: string ): void {
    switch (id) {
      case TransitionId[TransitionDirection.OUT].TO_LEFT:
        timeline.to(parent.$el, {
          xPercent: -100,
          autoAlpha: 0,
          ease: Elastic.easeIn,
          duration: 1,
        });
        break;
      case TransitionId[TransitionDirection.OUT].TO_RIGHT:
        timeline.to(parent.$el, {
          xPercent: 100,
          autoAlpha: 0,
          ease: Elastic.easeIn,
          duration: 1,
        });
        break;
      default:
        timeline.to(parent.$el, { autoAlpha: 0, duration: 1 });
        break;
    }
  }

  /**
   * @public
   * @method setupLoopingAnimationTimeline
   * @param {GSAPStatic.Timeline} timeline
   * @param {Vue} parent
   * @param {string} id
   * @description overwrite this method in the parent class
   * */
  public setupLoopingAnimationTimeline(timeline: GSAPStatic.Timeline, parent: Vue,  id: string): void {
  }
}
