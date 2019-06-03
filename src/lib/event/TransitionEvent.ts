import { AbstractEvent } from 'seng-event';

/**
 * ### TransitionEvent
 * The transitionController uses the seng-event module to dispatch events to notify parent classes about
 * certain events. The following events can be listened to.
 */
class TransitionEvent extends AbstractEvent {
  public static types = {
    TRANSITION_IN_START: 'TRANSITION_IN_START',
    TRANSITION_IN_COMPLETE: 'TRANSITION_IN_COMPLETE',
    TRANSITION_OUT_START: 'TRANSITION_OUT_START',
    TRANSITION_OUT_COMPLETE: 'TRANSITION_OUT_COMPLETE',
  };

  /**
   * The clone method returns a cloned instance of the original event.
   *
   * @public
   */
  public clone(): TransitionEvent {
    return new TransitionEvent(this.type);
  }
}

export default TransitionEvent;
