import CoreComponent from 'muban-core/lib/CoreComponent';
import ChildComponentATransitionController, { TransitionId } from './ChildComponentATransitionController';
import TransitionDirection from '../../../../src/lib/enum/TransitionDirection';

export default class ChildComponentA extends CoreComponent  {
  static displayName: string = 'child-component-a';
  public transitionController: ChildComponentATransitionController;

  constructor(element: HTMLElement) {
    super(element);

    this.transitionController = new ChildComponentATransitionController(this, {
      transitionInId: TransitionId[TransitionDirection.IN].TRANSITION_ID_1,
      transitionOutId: TransitionId[TransitionDirection.OUT].TRANSITION_ID_1,
      loopId: TransitionId.LOOP_1,
    });
  }
}
