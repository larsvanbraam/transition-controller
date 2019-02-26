Components can exist of other components and those other components can have animations of their own. To access a timeline of a child component within your transition controller you can use the provided functionality. The default behaviour is to retrieve the in timeline of the component

**Note:** When requesting a timeline of a child component you will receive a clone of the original timeline. This is to make sure the original animation stays intact and you can still use that animation like expected. Keep in mind that event listeners are also cloned.

**Example**
```typescript
...
import { TransitionDirection } from 'transition-controller';
...

...
const a = this.getTimeline('BarComponent')
const b = this.getTimeline('BarComponent', TransitionDirection.IN);
const c = this.getTimeline('BarComponent', TransitionDirection.OUT);
```
