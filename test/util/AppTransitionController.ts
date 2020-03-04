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
    timeline.fromTo(parent.element, { opacity: 0, }, { opacity: 1, duration: 0.2 });
  }

  /**
   * @public
   * @method setupTransitionOutTimeline
   * @description Use this method to setup your transition out timeline
   * */
  protected setupTransitionOutTimeline(timeline: TimelineMax, parent: App): void {
    timeline.to(parent.element, { opacity: 0, duration: 1 });
  }

  /**
   * @protected
   * @method setupLoopingAnimationTimeline
   * @description Use this method to setup your looping animation timeline
   * */
  protected setupLoopingAnimationTimeline(timeline: TimelineMax, parent: App): void {

  }
}

export default AppTransitionController;
