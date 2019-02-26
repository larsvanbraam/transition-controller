When you’ve constructed your transition controller you get access to all the public methods, one of them is transitionOut. Triggering transition in will either reverse the transitionInTimeline or restart the transitionOutTimeline if it contains animations.

**Example**
```typescript
...
const transitionController = new FooTransitionController(this);
transitionController.transitionOut();
...
```

Like described in the creating a transition out timeline section the transition out timeline is not created until it's required. This allows you to call different transition timelines for certain situations. This could be really useful if your transition out is different based on the page you are navigating to.

**Example**
```typescript
...
const transitionController = new FooTransitionController(this);

transitionController.transitionOut(false, 'transition-out-id-1');
// Or
transitionController.transitionOut(false, 'transition-out-id-2');
...
```

# Queueing a transition out
The transition in method accepts one parameter which is forceTransition, by default this flag is set to false so note that when you trigger a transitionOut while a transition in of a component is still running it will first complete the transition in animation before starting the called transitionOut.

**Example**
```typescript
...
const transitionController = new FooTransitionController(this);
transitionController.transitionIn();
setTimeout(() => transitionController.transitionOut(), 10);
...
```

# Forcing a transition out
When you want to overwrite the running animation you can set the force flag to true.

**Example**
```typescript
...
const transitionController = new FooTransitionController(this);
transitionController.transitionIn();
setTimeout(() => transitionController.transitionOut(true), 10);
...
```
