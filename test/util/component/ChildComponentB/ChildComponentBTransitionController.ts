import CustomTransitionController from '../CustomTransitionController';
import ChildComponentB from './ChildComponentB';

class ChildComponentBTransitionController extends CustomTransitionController<ChildComponentB> {
  /**
   * @public
   * @method setupTransitionInTimeline
   * @description Use this method to setup your transition in timeline
   * */
  protected setupTransitionInTimeline(timeline: GSAPStatic.Timeline, parent: ChildComponentB): void {
    timeline.fromTo(parent.element, { opacity: 0, }, { opacity: 1, duration: 0.2});
  }

  /**
   * @public
   * @method setupTransitionOutTimeline
   * @description Use this method to setup your transition out timeline
   * */
  protected setupTransitionOutTimeline(timeline: GSAPStatic.Timeline, parent: ChildComponentB): void {
  }

  /**
   * @protected
   * @method setupLoopingAnimationTimeline
   * @description Use this method to setup your looping animation timeline
   * */
  protected setupLoopingAnimationTimeline(): void {

  }
}

export default ChildComponentBTransitionController;
