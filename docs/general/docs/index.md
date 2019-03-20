![vue-transition-component](image/logo.png)

- ❤️ Great [GreenSock](https://greensock.com/) performance.
- 🎉 Easy to implement.
- 🎁 Be able to listen to transition-events.
- 🔁 Looping animations.
- ♻️ Re-usable transitions.
- 🤓 Multiple transitions per component.

## What does it do?
The AbstractTransitionController is a base class that you extend to provide all the necessary transition functionality to TransitionController that is aimed on your desired framework.
So for example if you have a [Vue.js](https://vuejs.org/) project you will create an AbstractVueTransitionController that extends the AbstractTransitionController. In your projects component folder you then create a TransitionController for your component for example a DummyTransitionController that extends the AbstractVueTransitionController.

## How does it do it?
The AbstractTransitionController relies upon TimelineLite and TimelineMax from [GSAP](https://greensock.com/). It creates timelines for your transitionIn, transitionOut an loopingAnimations. This gives you all the control that GreenSock has to offer, which is great because it’s a lot!

## TypeDoc documentation
If you want to see the [latest TypeDoc documentation](http://transition-controller.larsvanbraam.nl/typedoc) check it out!

## Live demo
If you want to see a working demo check out [GitHub](https://larsvanbraam.github.io/transition-controller/example)
