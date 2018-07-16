export interface IAbstractTransitionControllerOptions {
  /**
   * The name of the component that is used for logging, if no name is provided it uses a fallback name
   */
  name?: string;

  /**
   * When set to true we show logs in the flow
   */
  debug?: boolean;

  /**
   * The active transition in id that is used when creating the transition in timeline.
   */
  transitionInId?: string;

  /**
   * The active transition in id that is used when creating the transition out timeline.
   */
  transitionOutId?: string;

  /**
   * The active looping id that is used when creating the transition controller
   */
  loopId?: string;

  /**
   * The reference to the transition controller instance on your parent controller
   */
  transitionController?: string;
}
