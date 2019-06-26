import { createEventClass } from 'seng-event';

/**
 * ### TransitionEvent
 * The transitionController uses the seng-event module to dispatch events to notify parent classes about
 * certain events. The following events can be listened to.
 */
export default class TransitionEvent extends createEventClass()(
  'TRANSITION_IN_START',
  'TRANSITION_IN_COMPLETE',
  'TRANSITION_OUT_START',
  'TRANSITION_OUT_COMPLETE',
) {}
