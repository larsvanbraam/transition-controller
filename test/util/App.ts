import CoreComponent from 'muban-core/lib/CoreComponent';
import AppTransitionController from './AppTransitionController';

export default class App extends CoreComponent{
  static displayName: string = 'app-root';
  public transitionController: AppTransitionController;

  constructor(element: HTMLElement) {
    super(element);
    this.transitionController = new AppTransitionController(this);

    // for generic app logic
  }

  public dispose() {
    super.dispose();
  }
}
