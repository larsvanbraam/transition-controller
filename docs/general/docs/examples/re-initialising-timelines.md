## Re-initialise the transitionInTimeline
The transitionInTimeline is initialized when the component is constructed. This is because we need the the initial state to be set when the instance is constructed. If you still want to reset the transitioninTimeline you can call the setupTimeline with the TimelineType set to IN.

**Example with setupTimeline**
```typescript
...
// Provide the default label when constructing the transition controller
const transitionController = new DummyTransitionController(this, {
  transitionInId: 'transition-in-id-1',
})

// Re-initialize the transitionInTimeline with another id
transitionController.setupTimeline(TimelineType.IN, 'timeline-in-id-2');
...
```

## Re-initialise the transitionOutTimeline
Even though the transition out timeline is not initialised until it's requested,  you still might want to be able to re-initialise it. This can be done by calling the transitionOut method with the reset flag set to true or re-calling the setupTimeline with the Type set to OUT

**Example with setupTimeline**

```typescript
...
// Provide the default label when constructing the transition controller
const transitionController = new DummyTransitionController(this, {
  transitionInId: 'transition-in-id-1',
  transitionOutId: 'transition-out-id-1',
});

transitionController.transitionIn()
  // Call the transitionOutTimeline for the first time, this will initialise it.
  .then(() => transitionController.transitionOut()
  // Call the transition in so we hide it again afterwards
  .then(() => transitionController.transitionIn())
  // Re-call the transition out method but this time with another id and the reset flag to tru
  .then(() => {
    // Call the setup to change the out timeline
    transitionController.setupTimeline(TimelineType.OUT, 'transition-out-id-2');
  });
...
```

**Example with transitionOut**
```typescript
...
// Provide the default label when constructing the transition controller
const transitionController = new DummyTransitionController(this, {
  transitionInId: 'transition-in-id-1',
  transitionOutId: 'transition-out-id-1',
})

transitionController.transitionIn()
  // Call the transitionOutTimeline for the first time, this will initialise it.
  .then(() => transitionController.transitionOut()
  // Call the transition in so we hide it again afterwards
  .then(() => transitionController.transitionIn())
  // Re-call the transition out method but this time with another id and the reset flag to tru
  .then(() => transitionController.transitionOut(false, 'transition-out-id-2', true));
...
```

## Re-initialise the loopingAnimationTimeline
The looping animation timeline always uses a new timeline when it's started. So every time you call the startLoopingAnimation it will reset the old timeline. You can also reset it using the setupTimeline method.

**Example with setupTimeline**
```typescript
...
// Provide the default label when constructing the transition controller
const transitionController = new DummyTransitionController(this)

// Calling the start method will initialise the looping timeline
transitionController.startLoopingAnimation('loop-id-1');

// Re-calling the start method will re-initialise the looping timeline
setTimeout(() => {
    transitionController.setupTimeline(TimelineType.LOOPING, 'loop-id-2');
}, 1000);
...
```

**Example with startLoopingAnimation**
```typescript
...
// Provide the default label when constructing the transition controller
const transitionController = new DummyTransitionController(this)

// Calling the start method will initialise the looping timeline
transitionController.startLoopingAnimation('loop-id-1');

// Re-calling the start method will re-initialise the looping timeline
setTimeout(() => {
    transitionController.startLoopingAnimation('loop-id-2');
}, 1000);
...
```
