/* global hljs */
import Vue from 'vue/dist/vue.esm';
import TransitionEvent from '../../src/lib/event/TransitionEvent';
import DummyComponent from './component/dummy-component';

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
        this.$refs.DummyComponent.transitionController.addEventListener(eventName, event =>
          this.handleEvent('DummyComponent', event),
        );
      });
    });
  },
  methods: {
    handleStartClick() {
      // Mark as started
      this.started = true;
      // Clear the events
      this.events = [];
      // Get the transition controller
      const { transitionController } = this.$refs.DummyComponent;
      // Transition in then out
      transitionController
        .transitionIn()
        .then(() => transitionController.transitionOut())
        .then(() => {
          this.started = false;
        });
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
