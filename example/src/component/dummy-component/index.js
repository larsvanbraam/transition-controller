import DummyComponentTransitionController, {TransitionId} from './DummyComponentTransitionController';
import TransitionDirection from '../../../../src/lib/enum/TransitionDirection';

export default {
  name: 'DummyComponent',
  template: `<div class="panel panel-info">
                <div class="panel-heading">
                  <h3 class="panel-title">DummyComponent</h3>
                </div>
                <div class="panel-body">
                  Hi i'm a dummy component
                </div>
              </div>`,
  mounted() {
    this.transitionController = new DummyComponentTransitionController(this, {
      name: 'DummyComponent',
      transitionInId: TransitionId[TransitionDirection.IN].LEFT_TO_RIGHT,
      transitionOutId: TransitionId[TransitionDirection.OUT].TO_RIGHT,
    });
  },
};
