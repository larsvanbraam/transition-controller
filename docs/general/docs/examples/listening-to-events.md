Listening to events is useful in a lot of situations and the transition controller dispatches a couple of them.

## Transition in start
```typescript
...
import { TransitionEvent } from 'transition-controller';
...

...
const transitionController = new FooTransitionController(this);
transitionController.addEventListener(TransitionEvent.TRANSITION_IN_START, () => {
	console.log('Transition in started');
});
transitionController.transitionIn();
...
```

## Transition in complete
```typescript
...
import { TransitionEvent } from 'transition-controller';
...

...
const transitionController = new FooTransitionController(this);
transitionController.addEventListener(TransitionEvent.TRANSITION_IN_COMPLETE, () => {
	console.log('Transition in complete');
});
transitionController.transitionIn();
...
```

## Transition out start
```typescript
...
import { TransitionEvent } from 'transition-controller';
...

...
const transitionController = new FooTransitionController(this);
transitionController.addEventListener(TransitionEvent.TRANSITION_OUT_START, () => {
	console.log('Transition out start');
});
transitionController.transitionOut();
...
```

## Transition out complete
```typescript
...
import { TransitionEvent } from 'transition-controller';
...

...
const transitionController = new FooTransitionController(this);
transitionController.addEventListener(TransitionEvent.TRANSITION_OUT_COMPLETE, () => {
	console.log('Transition out complete);
});
transitionController.transitionOut();
...
```
