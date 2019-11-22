export interface ICreateTimelineOptions {
  /**
   * This should be the callback method that is triggered when the timeline in starts
   */
  onStart?: () => void;

  /**
   * This should be the callback method that is triggered when the timeline in completes
   */
  onComplete?: () => void;

  /**
   * This should be the callback method that is triggered when the timeline out starts
   */
  onReverseStart?: () => void;

  /**
   * This should be the callback method that is triggered when the timeline out completes
   */
  onReverseComplete?: () => void;
}
