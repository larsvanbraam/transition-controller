import gsap from 'gsap';
import { ICreateTimelineOptions } from '../interface/ICreateTimelineOptions';
import TransitionDirection from '../enum/TransitionDirection';
import isFunction from 'lodash/isFunction';

/**
 * The create timeline method creates a new Timeline
 *
 * @param {ICreateTimelineOptions} options
 * @returns {GSAPStatic.Timeline}
 */
export function createTimeline(options: ICreateTimelineOptions): gsap.core.Timeline {
  let forward = true;
  let lastTime = 0;

  const timeline = gsap.timeline({
    paused: true,
    onUpdate: () => {
      // GreenSock does not support onReverseStart on a timeline therefore we have this little method
      // chat checks for the direction and if it's changed we handle it as if it's a reverse start
      const newTime = timeline.time();
      if ((forward && newTime < lastTime) || (!forward && newTime > lastTime)) {
        forward = !forward;
        if (!forward && isFunction(options.onReverseStart)) {
          options.onReverseStart();
        }
      }
      lastTime = newTime;
    },
    onStart: () => {
      // Reset the last time when we restart the timeline
      lastTime = 0;
      // Trigger the callback if needed
      if (isFunction(options.onStart)) {
        options.onStart();
      }
    },
    onComplete: isFunction(options.onComplete) ? options.onComplete : null,
    onReverseComplete: () => {
      // When the transition out is completed we have to reset the last
      // time otherwise the transition will no longer work.
      lastTime = 0;
      // Trigger the callback if needed
      if (isFunction(options.onReverseComplete)) {
        options.onReverseComplete();
      }
    },
  });

  return timeline;
}

/**
 * Sometimes you want to fully kill a timeline and strip all the added
 * inline styles. This method accepts a timeline and it will remove all
 * the inline styling and kill the timeline instance.
 *
 * @param {GSAPStatic.Timeline} timeline
 * @returns {void}
 */
export function killAndClearTimeline(timeline: gsap.core.Timeline): void {
  clearTimeline(timeline);
  timeline.kill();
}

/**
 * Sometimes you do not want to kill the timeline but only kill the inline
 * styling. This method accepts a timeline and it will remove all the inline styling.
 *
 * @param {GSAPStatic.Timeline} timeline
 * @returns {void}
 */
export function clearTimeline(timeline: gsap.core.Timeline | gsap.core.Tween): void {
  if (timeline && (<gsap.core.Timeline>timeline).getChildren) {
    (<gsap.core.Timeline>timeline).getChildren().forEach(target => {
      if (target.targets) {
        // Note: When resetting a timeline clearing just the css properties does not clear the properties like autoAlpha or scale
        gsap.set((<any>target).targets(), { clearProps: 'all' });
      } else {
        clearTimeline(<gsap.core.Timeline>target);
      }
    });
    (<gsap.core.Timeline>timeline).clear(true);
  } else {
    gsap.set((<any>timeline).targets(), { clearProps: 'all' });
  }
}

/**
 *  When you want to clone a timeline (for example when you want to nest it within
 *  another timeline but also still want to be able to play the original timeline
 *  this is the method you are looking for. It will create a new Timeline and
 *  re-add all the original animations and event listeners.
 *
 * @param {GSAPStatic.Timeline} source
 * @param {TransitionDirection} direction
 * @returns {GSAPStatic.Timeline}
 */
export function cloneTimeline(
  source: gsap.core.Timeline,
  direction: TransitionDirection,
): gsap.core.Timeline {
  const children = source.getChildren(false);
  const timeline = gsap.timeline(source.vars);

  const parseChild = (child, timeline) => {
    if (child.getChildren) {
      const children = child.getChildren(false);
      const subTimeline = gsap.timeline(child.vars);
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
        timeline.fromTo(child.targets(), child.duration(), from, to, child.startTime());
      } else {
        if (child.vars.runBackwards) {
          // When nesting timelines and the user defines a root timeline with a from the clone will
          // have incorrect styling because the base styling is off!
          // timeline.from(child.target, child._duration, child.vars, child._startTime);
          throw new Error(
            'Do not use from while nesting transitionInTimelines, use fromTo instead!',
          );
        } else {
          timeline.to(child.targets(), child.duration(), child.vars, child.startTime());
        }
      }
    }
  };

  children.forEach(child => parseChild(child, timeline));

  return timeline;
}
