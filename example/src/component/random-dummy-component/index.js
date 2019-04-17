import DummyComponent from '../dummy-component';
import RandomDummyComponentTransitionController from './RandomDummyComponentTransitionController';

export default {
  name: 'RandomDummyComponent',
  components: {
    DummyComponent,
  },
  template: `<div class="panel panel-info" data-name="randomDummyComponent">
                <div class="panel-heading">
                  <h3 class="panel-title">RandomDummyComponent</h3>
                </div>
                <div class="panel-body">
                  <dummy-component ref="dummyComponent"/>
                </div>
              </div>`,
  mounted() {
    this.transitionController = new RandomDummyComponentTransitionController(this, {
      name: 'RandomDummyComponent',
    });
  },
};
