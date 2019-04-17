import LoopComponentTransitionController, {TransitionId} from './LoopComponentTransitionController';

export default {
  name: 'LoopComponent',
  template: `<div data-name="loopComponent">
    <section>
      <button ref="button" @click="handleButtonClick" class="btn btn-primary btn-lg">Large button</button>
    </section>
    <button @click="handleStartClick()" class="btn btn-success">Start Default</button>
    <button @click="handleStartClick(TransitionId.LOOP_1)" class="btn btn-success">Start variant 1</button>
    <button @click="handleStartClick(TransitionId.LOOP_2)" class="btn btn-success">Start variant 2</button>
    <button @click="handleStopClick" class="btn btn-warning">Stop</button>
  </div>`,
  mounted() {
    this.TransitionId = TransitionId;
    this.transitionController = new LoopComponentTransitionController(this, {
      name: 'LoopComponent',
      debug: true,
      useTweenMax: false,
    });
    this.transitionController.startLoopingAnimation();
  },
  methods: {
    handleButtonClick() {
      alert('Nothing here!');
    },
    handleStartClick(loop) {
      this.transitionController.startLoopingAnimation(loop, true);
    },
    handleStopClick() {
      this.transitionController.stopLoopingAnimation();
    },
  },
};
