import { AbstractEvent } from 'seng-event';
import { generateEventTypes, EVENT_TYPE_PLACEHOLDER } from 'seng-event/lib/util/eventTypeUtils';

/**
 * ### TransitionEvent
 * The transitionController uses the seng-event module to dispatch events to notify parent classes about
 * certain events. The following events can be listened to.
 */
class TransitionEvent extends AbstractEvent {
  /**
   * The transition in start event is dispatched when the transition in starts
   *
   * @public
   */
  public static TRANSITION_IN_START: string = EVENT_TYPE_PLACEHOLDER;

  /**
   * The transition in complete event is dispatched when the transition in completes
   *
   * @public
   */
  public static TRANSITION_IN_COMPLETE: string = EVENT_TYPE_PLACEHOLDER;

  /**
   * The transition out start event is dispatched when the transition out starts
   *
   * @public
   */
  public static TRANSITION_OUT_START: string = EVENT_TYPE_PLACEHOLDER;

  /**
   * The transition out complete event is dispatched when the transition out completes
   *
   * @public
   */
  public static TRANSITION_OUT_COMPLETE: string = EVENT_TYPE_PLACEHOLDER;

  /**
   * The clone method returns a cloned instance of the original event.
   *
   * @public
   */
  public clone(): TransitionEvent {
    return new TransitionEvent(this.type, this.bubbles, this.cancelable);
  }
}

generateEventTypes({ TransitionEvent });

export default TransitionEvent;
