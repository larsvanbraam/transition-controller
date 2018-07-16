/* global hljs */
import Vue from 'vue/dist/vue.esm';
import TransitionEvent from '../../src/lib/event/TransitionEvent';
import DummyComponent from './component/dummy-component';
import LoopComponent from './component/loop-component';

/* eslint-disable no-new */
new Vue({
  el: '#app',
  data: {
    started: false,
    events: [],
    activeTab: 0,
  },
  components: {
    DummyComponent,
    LoopComponent,
  },
  mounted() {
    // Highlight the code
    document.body.querySelectorAll('pre').forEach(element => {
      hljs.highlightBlock(element);
    });
    // Define which events will be logged
    const events = [
      TransitionEvent.TRANSITION_IN_START,
      TransitionEvent.TRANSITION_IN_COMPLETE,
      TransitionEvent.TRANSITION_OUT_START,
      TransitionEvent.TRANSITION_OUT_COMPLETE,
    ];
    // Bind the events
    this.$nextTick(() => {
      events.forEach(eventName => {
        this.$refs.dummyComponent.transitionController.addEventListener(eventName, event =>
          this.handleEvent('DummyComponent', event),
        );
      });
    });
  },
  methods: {
    handleStartClick(type) {
      this.started = true;
      // Clear the events
      this.events = [];
      // Get the transition controller
      const { transitionController } = this.$refs.dummyComponent;

      switch (type) {
        case 'in':
          if (!transitionController.isHidden) alert('component is already visible!');
          transitionController.transitionIn().then(() => {
            this.started = false;
          });
          break;
        case 'out':
          if (transitionController.isHidden) alert('component is already hidden!');
          transitionController.transitionOut().then(() => {
            this.started = false;
          });
          break;
        default:
        case 'queue':
          transitionController
            .transitionIn()
            .then(() => transitionController.transitionOut())
            .then(() => {
              this.started = false;
            });
          break;
      }
    },
    handleEvent(label, event) {
      this.events.push(
        Object.assign(
          {
            eventType: `<strong>${label}</strong> ${event.type}`,
            data: event.data,
          },
          {},
        ),
      );
    },
    handleTabClick(index) {
      this.activeTab = index;
    },
  },
});
