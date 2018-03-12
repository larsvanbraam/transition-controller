[![Travis](https://img.shields.io/travis/larsvanbraam/transition-controller.svg?maxAge=2592000)](https://travis-ci.org/larsvanbraam/transition-controller)
[![Code Climate](https://img.shields.io/codeclimate/github/larsvanbraam/transition-controller.svg?maxAge=2592000)](https://codeclimate.com/github/larsvanbraam/transition-controller)
[![npm](https://img.shields.io/npm/dm/transition-controller.svg?maxAge=2592000)](https://www.npmjs.com/package/transition-controller)
[![GitHub issues](https://img.shields.io/github/issues/larsvanbraam/transition-controller.svg?style=flat-square)](https://github.com/larsvanbraam/transition-controller/issues)

# AbstractTransitionController

An abstract transition controller that can be used for transitioning elements

## Installation

```sh
yarn add transition-controller
```

```sh
npm i -S transition-controller
```

## Demo
*TODO: Create a demo*

## Usage
The AbstractTransitionController is an abstract class that should be extended by another abstract class for your project
specific setup.

#### You can use this abstract class for the following:
 - Handling your components transitionIn and transitionOut method.
 - Create separate timelines for transition in and transition out.
 - Dispatch transition events to your parent class.
 - Force your component to transition in while it's still transitioning out and the other way around.
 - Retrieve cloned timelines so you can easily nest timelines within other timelines.
 - Setup a looping animation that can be started or stopped.

### Example extended class
Before you can use the class you need to create your own abstract class that implements the getSubTimelineByComponent method.

```typescript
abstract class AbstractDummyTransitionController<T> extends AbstractTransitionController<T> {
 /**
   * @protected
   * @method getSubTimelineByComponent
   * @param {string | HTMLElement | T} component
   * @param {TransitionDirection} direction
   * @returns {gsap.TimelineLite | gsap.TimelineMax}
   */
  protected getSubTimelineByComponent(component: string | HTMLElement | T, direction: TransitionDirection,): TimelineLite | TimelineMax {
    const instance:T;

    // Add code that finds the instance based on the 3 provided types
    ...

    // Return the correct timeline
    if (direction === TransitionDirection.IN) {
      return instance.transitionController.transitionInTimeline;
    }
    return instance.transitionController.transitionOutTimeline;
  }
}
```

#### Example
After you've created you own abstract class you can use the transition controller and start to do amazingly easy transitions

```typescript
const transitionController = new DummyTransitionController<ParentController>(this, {
  name: 'DummyController',
  debug: false,
  useTimelineMax: false,
});
transitionController.transitionIn();
```


## Building

In order to build transition-controller, ensure that you have [Git](http://git-scm.com/downloads) and [Node.js](http://nodejs.org/) installed.

Clone a copy of the repo:
```sh
git clone https://github.com/larsvanbraam/transition-controller.git
```

Change to the transition-controller directory:
```sh
cd transition-controller
```

Install dev dependencies:
```sh
yarn
```

Use one of the following main scripts:
```sh
yarn build            # build this project
yarn dev              # run compilers in watch mode, both for babel and typescript
yarn test             # run the unit tests incl coverage
yarn test:dev         # run the unit tests in watch mode
yarn lint             # run eslint and tslint on this project
yarn doc              # generate typedoc documentation
```

When installing this module, it adds a pre-commit hook, that runs lint and prettier commands
before committing, so you can be sure that everything checks out.

## Authors
View [AUTHORS.md](./AUTHORS.md)

## Contribute
View [CONTRIBUTING.md](./CONTRIBUTING.md)

## License
[MIT](./LICENSE) © Lars van Braam
