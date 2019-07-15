Creating a transition out timeline is just like creating a transition in timeline.

There are two differences though:

1. The transition out timeline is not initialised until you trigger the transition out method or until you request the child's transition out timeline from within a parents transitionController. This allows you to create multiple transition out timelines and switch them run time.
2. The transitionOut timeline must exist of to animations, this is because the end state of an element can change after the timeline was created so you only want to define the end state of the animation.

**Example**
```typescript
...
/**
 * Use this method to setup your transition out timeline
 * @public
 * @param {TimelineLite | TimelineMax} timeline
 * @param {T} parent The reference to your parent
 * @param {string} id The id of your timeline
 * @description
 */
  protected setupTransitionOutTimeline(timeline: TimelineMax, parent:T, id:string): void {
	  timeline.to(
		  parent.$el,
		  1,
		  {
			  autoAlpha: 0,
		  }
	  )
  }
...
```

## Multiple timelines
Like the transitionInTimeline the transitionOutTimeline can have multiple timelines. This works the same way, so view the `creating-a-transition-in-timeline` page on how to do it! 

***Note:** TransitionOutTimelines are not initialised until they are actually required. See the page on `re-initialising-timelines` to see some examples on re-initialising the transition out timeline!*  
