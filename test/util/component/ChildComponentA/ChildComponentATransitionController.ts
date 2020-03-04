import { TimelineMax } from 'gsap';
import CustomTransitionController from '../CustomTransitionController';
import ChildComponentA from './ChildComponentA';
import TransitionDirection from '../../../../src/lib/enum/TransitionDirection';

export const TransitionId = {
  LOOP_1: 'loop-1',
  [TransitionDirection.IN]: {
    TRANSITION_ID_1: 'transition-id-1',
    TRANSITION_ID_2: 'transition-id-2',
  },
  [TransitionDirection.OUT]: {
    TRANSITION_ID_1: 'transition-id-1',
    TRANSITION_ID_2: 'transition-id-2',
  },
};

class ChildComponentATransitionController extends CustomTransitionController<ChildComponentA> {
  /**
   * @public
   * @method setupTransitionInTimeline
   * @description Use this method to setup your transition in timeline
   * */
  protected setupTransitionInTimeline(timeline: TimelineMax, parent: ChildComponentA, id: string): void {
    switch (id) {
      case TransitionId[TransitionDirection.IN].TRANSITION_ID_1:
        timeline.fromTo(parent.element, { opacity: 0, }, { opacity: 1, duration: 0.2 });
        break;
      case TransitionId[TransitionDirection.IN].TRANSITION_ID_2:
        timeline.fromTo(parent.element, { width: 0, }, { width: 100, duration: 0.2 });
        break;
      default:
        timeline.fromTo(parent.element, { left: 0, }, { left: 100, duration: 0.2 });
        break;
    }
  }

  /**
   * @public
   * @method setupTransitionOutTimeline
   * @description Use this method to setup your transition out timeline
   * */
  protected setupTransitionOutTimeline(timeline: TimelineMax, parent: ChildComponentA, id: string): void {
    switch (id) {
      case TransitionId[TransitionDirection.OUT].TRANSITION_ID_1:
        timeline.to(parent.element, { opacity: 0, duration: 0.2 });
        break;
      case TransitionId[TransitionDirection.OUT].TRANSITION_ID_2:
        timeline.to(parent.element, { width: 0, duration: 0.2 });
        break;
      default:
        timeline.to(parent.element, { left: 0, duration: 0.2 });
        break;
    }
  }

  /**
   * @protected
   * @method setupLoopingAnimationTimeline
   * @description Use this method to setup your looping animation timeline
   * */
  protected setupLoopingAnimationTimeline(timeline: TimelineMax, parent: ChildComponentA,  id: string): void {
    switch (id) {
      case TransitionId.LOOP_1:
        timeline.fromTo(parent.element, { opacity: 0, }, { opacity: 1, duration: 0.2 });
        break;
      default:
        timeline.fromTo(parent.element, { left: 0, }, { left: 100, duration: 0.2 });
        break;
    }
  }
}

export default ChildComponentATransitionController;
