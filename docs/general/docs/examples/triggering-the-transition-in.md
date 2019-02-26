When you’ve constructed your transition controller you get access to all the public methods, one of them is transitionIn. Triggering transition in will restart the transitionInTimeline and play your animation.

**Example**
```typescript
...
const transitionController = new FooTransitionController(this);
transitionController.transitionIn();
...
```

# Queueing a transition in
The transition in method accepts one parameter which is forceTransition, by default this flag is set to false so note that when you trigger a transitionIn while a transition out of a component is still running it will first complete the transition out animation before starting the called transitionIn.

**Example**
```typescript
...
const transitionController = new FooTransitionController(this);
transitionController.transitionOut();
setTimeout(() => transitionController.transitionIn(), 10);
...
```

# Forcing a transition in
When you want to overwrite the running animation you can set the force flag to true.

**Example**
```typescript
...
const transitionController = new FooTransitionController(this);
transitionController.transitionOut();
setTimeout(() => transitionController.transitionIn(true), 10);
...
```
