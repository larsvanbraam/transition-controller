interface ICreateTimelineOptions {
  onStart?: () => void;
  onComplete?: () => void;
  onReverseComplete?: () => void;
  onReverseStart?: () => void;
  useTimelineMax?: boolean;
}

export default ICreateTimelineOptions;
