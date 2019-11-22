Creating a timeline for your component is just a matter of adding animations to the timeline that is provided in the arguments of the function.

**Example**
```typescript
...
  /**
   * Use this method to setup your looping timeline
   *
   * @public
   * @param {GSAPStatic.Timeline} timeline
   * @param {T} parent The reference to your parent
   * @param {string} id The id of your timeline
   */
  protected setupLoopingAnimationTimeline(timeline: GSAPStatic.Timeline, parent:T, id:string): void {
	timeline.to(
		parent.$el,
		1,
		{
			rotation: 360,
		},
	);
  }
...
```

## Multiple looping timelines
Like the transition in timeline the looping timeline can have multiple timelines. This works the same way, so view that section on how to do it! The only difference for transition out timelines is that they are not initialised until they are actually required.
So when you are about to start a looping animation, that is when the timeline get's initialised. This gives you the freedom to create different looping animations.
