import { TimelineMax } from 'gsap';
import CustomTransitionController from '../CustomTransitionController';
import ChildComponentB from './ChildComponentB';

class ChildComponentBTransitionController extends CustomTransitionController<ChildComponentB> {
  /**
   * @public
   * @method setupTransitionInTimeline
   * @description Use this method to setup your transition in timeline
   * */
  protected setupTransitionInTimeline(timeline: TimelineMax, parent: ChildComponentB): void {
    timeline.fromTo(parent.element, { opacity: 0, }, { opacity: 1, duration: 0.2});
  }

  /**
   * @public
   * @method setupTransitionOutTimeline
   * @description Use this method to setup your transition out timeline
   * */
  protected setupTransitionOutTimeline(timeline: TimelineMax, parent: ChildComponentB): void {
  }

  /**
   * @protected
   * @method setupLoopingAnimationTimeline
   * @description Use this method to setup your looping animation timeline
   * */
  protected setupLoopingAnimationTimeline(timeline: TimelineMax, parent: ChildComponentB): void {

  }
}

export default ChildComponentBTransitionController;
