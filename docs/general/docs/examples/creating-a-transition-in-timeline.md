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

## Multiple timelines
Sometimes you want to define different transitions for different situations, for example a page transition where you might enter from the left or enter from the right.

### Defining multiple timelines
Defining multiple transitions can be as simple as putting a switch statement on based on the id that is provided when creating the timeline.

***Note:** If you have complex timelines with a lot of animations you might want to consider moving them to separate files and calling the individual setup methods instead of cluttering the setupTransitionInTimeline method.*

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
    switch(id) {     
      case 'transition-id-2'
        timeline.from(parent.$el, 1, { xPercent: -100 }) 
      break;
      case 'transition-id-1':
      default:
        timeline.from(parent.$el, 1, { yPercent: -100 })
      break;
    }	  
  }
...
```

### Updating the active timeline
Transition in timelines are created as soon as they are constructed so to updated the timeline after construction you will have to re-initialise the timeline with the new timeline-id. See the page on `re-initialising-timelines` to see some examples.



