import CoreComponent from 'muban-core/lib/CoreComponent';
import ChildComponentCTransitionController from './ChildComponentCTransitionController';

export default class ChildComponentC extends CoreComponent {
  static displayName: string = 'child-component-c';
  public transitionController: ChildComponentCTransitionController;

  constructor(element: HTMLElement) {
    super(element);

    this.transitionController = new ChildComponentCTransitionController(this);
  }
}
