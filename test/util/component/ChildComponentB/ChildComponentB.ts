import CoreComponent from 'muban-core/lib/CoreComponent';
import ChildComponentBTransitionController from './ChildComponentBTransitionController';

export default class ChildComponentB extends CoreComponent {
  static displayName: string = 'child-component-b';
  public transitionController: ChildComponentBTransitionController;

  constructor(element: HTMLElement) {
    super(element);

    this.transitionController = new ChildComponentBTransitionController(this);
  }
}
