interface IAbstractTransitionControllerOptions {
  /**
   * @description The name of the component that is used for logging, if no name is provided it uses a fallback name
   */
  name?: string;
  /**
   * @description When set to true we show logs in the flow
   */
  debug?: boolean;
  /**
   * @description When set to true the transition timelines use TimelineMax instead of TimelineLite
   */
  useTimelineMax?: boolean;
}

export default IAbstractTransitionControllerOptions;
