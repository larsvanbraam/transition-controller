Creating a timeline for your component is just a matter of adding animations to the timeline that is provided in the arguments of the function. In the example provided here we will assume that the transition controller is created for a Vue.js project. But if your using any other framework the parentController would be properly typed to match  the correct parent.

**Example**
```typescript
...
/**
 * Use this method to setup your transition in timeline
 *
 * @public
 * @method setupTransitionInTimeline
 * @param {TimelineLite | TimelineMax} timeline
 * @param {T} parent The reference to your parent
 * @param {string} id The id of your timeline
 */
  protected setupTransitionInTimeline(timeline: TimelineLite | TimelineMax, parent:T, id:string): void {
	  timeline.from(
		  parent.$el,
		  1,
		  {
			  autoAlpha: 0,
		  }
	  )
  }
...
```
