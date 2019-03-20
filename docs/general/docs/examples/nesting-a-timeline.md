GreenSock provides the option to add a timeline inside of another timeline. When creating complex timelines for your components you most likely want to re-use them. Your wrapping component’s timeline could then exist of other timelines. To achieve this you can add timelines as part of a parent timeline. You can still use the position parameter from GreenSock to time your animations to your own desire.

**Example**
```typescript
...
  /**
   * Use this method to setup your transition in timeline
   * @public
   * @param {TimelineLite | TimelineMax} timeline
   * @param {T} parent The reference to your parent
   * @param {string} id The id of your timeline
   */
  protected setupTransitionInTimeline(timeline: TimelineLite | TimelineMax, parent:T, id:string): void {
    timeline.add(this.getTimeline('BarComponent'));
    timeline.add(this.getTimeline('BarComponent'), '-=0.5');
  }
...
```
