/* global hljs */
import Vue from 'vue/dist/vue.esm';
import TransitionEvent from '../../src/lib/event/TransitionEvent';
import TimelineType from '../../src/lib/enum/TimelineType';
import DummyComponent from './component/dummy-component';
import NestedDummyComponent from './component/random-dummy-component';
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
    NestedDummyComponent,
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
      TransitionEvent.types.TRANSITION_IN_START,
      TransitionEvent.types.TRANSITION_IN_COMPLETE,
      TransitionEvent.types.TRANSITION_OUT_START,
      TransitionEvent.types.TRANSITION_OUT_COMPLETE,
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
    handleStartClick(type, component) {
      this.started = true;
      // Clear the events
      this.events = [];
      // Get the transition controller
      const { transitionController } = this.$refs[component];

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
    handleReset(type, component) {
      // Get the transition controller
      const { transitionController } = this.$refs[component];

      switch (type) {
        case 'in':
          transitionController.resetTimeline(TimelineType.IN, ['dummyComponent']);
          break;
        case 'out':
          transitionController.resetTimeline(TimelineType.OUT, ['dummyComponent']);
          break;
        default:
        // No default
      }

      //alert('Timeline has been reinitialized');
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
