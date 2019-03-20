After you’ve created an abstract transition controller for your specific framework you can start creating transition controllers for your individual components. This is very simple and requires very little code.

**Example**
```javascript
import { AbstractTransitionController } from 'vue-transition-component';
import { TimelineLite, TimelineMax } from 'gsap';

export default class FooTransitionController extends AbstractTransitionController {
  /**
   * Use this method to setup your transition in timeline
   *
   * @public
   * @param {TimelineLite | TimelineMax} timeline
   * @param {T} parent The reference to your parent
   * @param {string} id The id of your timeline
   */
  protected setupTransitionInTimeline(timeline: TimelineLite | TimelineMax, parent:T, id:string): void {

  }

  /**
   * Use this method to setup your transition out timeline
   *
   * @public
   * @param {TimelineLite | TimelineMax} timeline
   * @param {T} parent The reference to your parent
   * @param {string} id The id of your timeline
   */
  protected setupTransitionOutTimeline(timeline: TimelineLite | TimelineMax, parent:T, id:string): void {

  }

  /**
   * @public
   * @method setupLoopingAnimationTimeline
   * @param {TimelineMax} timeline
   * @param {T} parent The reference to your parent
   * @param {string} id The id of your timeline
   * @description Use this method to setup your looping timeline
   */
  protected setupLoopingAnimationTimeline(timeline: TimelineMax, parent:T, id:string): void {

  }
}
```

```javascript
After the transition controller class is created you can construct it:
...
const transitionController = new FooTransitionController(this, {
  name: 'FooTransitionController,
  debug: false,
  useTimelineMax: false,
});
...
```
