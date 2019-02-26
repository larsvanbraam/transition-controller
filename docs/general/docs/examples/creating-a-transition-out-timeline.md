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

## Multiple transition in timelines
Like the transition in timeline the transition out timeline can have multiple timelines. This works the same way, so view that section on how to do it! The only difference for transition out timelines is that they are not initialised until they are actually required.
So when you are about to leave the page and trigger the transitionOut method that is when the timeline get's initialised. This gives you the freedom to create different out animations for your component.
