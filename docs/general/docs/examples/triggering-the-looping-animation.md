When you’ve specified animations for your looping animation you might want to start it when the component enters the view and stops when it leaves the view.
Starting the looping animations
To start the looping animations simply call the method to start the them.
**Example**
```typescript
...
const transitionController = new FooTransitionController(this);
transitionController.startLoopingAnimation();
...
```

Like described in the creating a transition out timeline section the transition out timeline is not created until it's required. This allows you to call different transition timelines for certain situations. This could be really useful if your transition out is different based on the page you are navigating to.

**Example**
```typescript
...
const transitionController = new FooTransitionController(this);

transitionController.startLoopingAnimation('looping-id-1');
// Or
transitionController.startLoopingAnimation('looping-id-1');
...
```

## Stopping the looping animations
To stop the looping animations simpley call the method to stop them.

**Example**
```typescript
...
const transitionController = new FooTransitionController(this);
transitionController.stopLoopingAnimation();
...
```
