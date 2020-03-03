import CustomTransitionController from '../CustomTransitionController';
import ChildComponentC from './ChildComponentC';

class ChildComponentCTransitionController extends CustomTransitionController<ChildComponentC> {
  /**
   * @public
   * @method setupTransitionInTimeline
   * @description Use this method to setup your transition in timeline
   * */
  protected setupTransitionInTimeline(timeline: gsap.core.Timeline, parent: ChildComponentC): void {
  }

  /**
   * @public
   * @method setupTransitionOutTimeline
   * @description Use this method to setup your transition out timeline
   * */
  protected setupTransitionOutTimeline(timeline: gsap.core.Timeline, parent: ChildComponentC): void {
  }

  /**
   * @protected
   * @method setupLoopingAnimationTimeline
   * @description Use this method to setup your looping animation timeline
   * */
  protected setupLoopingAnimationTimeline(timeline: gsap.core.Timeline, parent: ChildComponentC): void {

  }
}

export default ChildComponentCTransitionController;
