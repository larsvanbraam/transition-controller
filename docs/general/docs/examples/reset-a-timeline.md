Sometimes a timeline or any of the sub-timelines is created using dynamic values and these values can change over time. This might lead to a timeline that is no longer up to date. This is where the reset method comes in place.
   
### Resetting the root timeline
The most basic version of the reset is to simply call `restTimeline` on the root transitionController and provide which timeline that you want to reset. 

```typescript
transitionController.resetTimeline(TimelineType.IN);
```

### Also reset child components.
If you also want to reset a child timeline you can provide the componentId, the HTMLElement or the component instance in an array.

```typescript
transitionController.resetTimeline(TimelineType.IN, ['childComponentA', 'childComponentB']);
```

### Reset nested child components
If you want to reset child timelines of child components you could also provide an object in containing the reference to the component including the children that you want to reset.

```typescript
transitionController.resetTimeline(TimelineType.IN, [{component: 'childComponentA', children: ['childComponentB']}]);
```

***Note:**The nesting of timelines can go on indefinitely.*
   
