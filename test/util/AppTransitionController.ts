import { TimelineMax } from 'gsap';
import CustomTransitionController from './component/CustomTransitionController';
import App from './App';

class AppTransitionController extends CustomTransitionController<App> {
  /**
   * @public
   * @method setupTransitionInTimeline
   * @description Use this method to setup your transition in timeline
   * */
  protected setupTransitionInTimeline(timeline: TimelineMax, parent: App): void {
    timeline.fromTo(parent.element, 0.2, { opacity: 0, }, { opacity: 1});
  }

  /**
   * @public
   * @method setupTransitionOutTimeline
   * @description Use this method to setup your transition out timeline
   * */
  protected setupTransitionOutTimeline(timeline: TimelineMax, parent: App): void {
    timeline.to(parent.element, 1, { opacity: 0});
  }

  /**
   * @protected
   * @method setupLoopingAnimationTimeline
   * @description Use this method to setup your looping animation timeline
   * */
  protected setupLoopingAnimationTimeline(): void {

  }
}

export default AppTransitionController;
