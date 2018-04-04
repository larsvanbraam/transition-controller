import { TimelineLite, TimelineMax, Elastic } from 'gsap';
import AbstractVueTransitionController from '../AbstractVueTransitionController';

export default class DummyComponentTransitionController extends AbstractVueTransitionController {
  /**
   * @public
   * @method setupTransitionInTimeline
   * @param {gsap.TimelineLite | gsap.TimelineMax} timeline
   */
  public setupTransitionInTimeline(timeline: TimelineLite | TimelineMax): void {
    timeline.fromTo(
      this.parentController.$el,
      1,
      {
        xPercent: 100,
        autoAlpha: 0,
      },
      {
        xPercent: 0,
        autoAlpha: 1,
        ease: Elastic.easeOut,
      },
    );
  }

  /**
   * @public
   * @method setupTransitionOutTimeline
   * @param {gsap.TimelineLite | gsap.TimelineMax} timeline
   */
  public setupTransitionOutTimeline(timeline: TimelineLite | TimelineMax): void {
    timeline.to(this.parentController.$el, 1, {
      xPercent: -100,
      autoAlpha: 0,
      ease: Elastic.easeIn,
    });
  }
}
