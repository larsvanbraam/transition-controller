import { TweenLite, TimelineLite, TimelineMax, Tween } from 'gsap';
import ICreateTimelineOptions from 'lib/interface/ICreateTimelineOptions';
import TransitionDirection from 'lib/enum/TransitionDirection';

/**
 * @method createTimeline
 * @description Method that creates a timeline and adds all the listeners
 * @param {ICreateTimelineOptions} options
 * @returns {TimelineLite | TimelineMax}
 */
export function createTimeline(options: ICreateTimelineOptions): TimelineLite | TimelineMax {
  let forward = true;
  let lastTime = 0;

  const timeline = new (options.useTimelineMax ? TimelineMax : TimelineLite)({
    paused: true,
    onUpdate: () => {
      // GreenSock does not support onReverseStart on a timeline therefore we have this little method
      // chat checks for the direction and if it's changed we handle it as if it's a reverse start
      const newTime = timeline.time();
      if ((forward && newTime < lastTime) || (!forward && newTime > lastTime)) {
        forward = !forward;
        if (!forward && options.onReverseStart !== null) {
          options.onReverseStart();
        }
      }
      lastTime = newTime;
    },
    onStart: options.onStart !== null ? options.onStart : null,
    onComplete: options.onComplete !== null ? options.onComplete : null,
    onReverseComplete: () => {
      // When the transition out is completed we have to reset the last
      // time otherwise the transition will no longer work.
      lastTime = 0;
      // Trigger the callback if needed
      if (options.onReverseComplete !== null) options.onReverseComplete();
    },
  });

  return timeline;
}

/**
 * @method killAndClearTimeline
 * @param {TimelineLite | TimelineMax} timeline
 */
export function killAndClearTimeline(timeline: TimelineLite | TimelineMax): void {
  clearTimeline(timeline);
  timeline.kill();
}

/**
 * @method clearTimeline
 * @description Method to clear a timeline and remove all the props that have been added
 * @param {TimelineLite | TimelineMax} timeline
 */
export function clearTimeline(timeline: TimelineLite | TimelineMax): void {
  timeline.getChildren().forEach(target => {
    if ((<Tween>target).target) {
      const vars = <any>target.vars;
      const clearProps = vars.css ? Object.keys(vars.css).join(',') : '';
      // Clear the css properties
      TweenLite.set((<Tween>target).target, { clearProps });
    } else {
      clearTimeline(<TimelineLite | TimelineMax>target);
    }
  });
  timeline.clear();
}

/**
 * @method cloneTimeline
 * @descriptionm Clone a timeline and return a new instance with the all the same vars
 * @param {gsap.TimelineLite | gsap.TimelineMax} source
 * @param {TransitionDirection} direction
 * @param {boolean} useTimelineMax
 * @returns {gsap.TimelineLite | gsap.TimelineMax}
 */
export function cloneTimeline(
  source: TimelineLite | TimelineMax,
  direction: TransitionDirection,
  useTimelineMax: boolean,
): TimelineLite | TimelineMax {
  const children = source.getChildren(false);
  const timeline = new (useTimelineMax ? TimelineMax : TimelineLite)(source.vars);

  const parseChild = (child, timeline) => {
    if (child.getChildren) {
      const children = child.getChildren(false);
      const subTimeline = new (useTimelineMax ? TimelineMax : TimelineLite)(child.vars);
      // Parse the child animations
      children.forEach(child => parseChild(child, subTimeline));
      // Add the timeline to the parent timeline
      timeline.add(subTimeline.restart(), child._startTime);
    } else {
      if (child.vars.startAt) {
        if (direction === TransitionDirection.OUT) {
          throw new Error('Do not use fromTo when nesting transitionOutTimelines, use to instead!');
        }
        const from = JSON.parse(JSON.stringify(child.vars.startAt));
        // Clone the vars
        const to = child.vars;
        // Create the fromTo tween
        timeline.fromTo(child.target, child._duration, from, to, child._startTime);
      } else {
        if (child.vars.runBackwards) {
          // When nesting timelines and the user defines a root timeline with a from the clone will
          // have incorrect styling because the base styling is off!
          // timeline.from(child.target, child._duration, child.vars, child._startTime);
          throw new Error(
            'Do not use from while nesting transitionInTimelines, use fromTo instead!',
          );
        } else {
          timeline.to(child.target, child._duration, child.vars, child._startTime);
        }
      }
    }
  };

  children.forEach(child => parseChild(child, timeline));

  return timeline;
}
