import TransitionEvent from '../src/lib/event/TransitionEvent';
import { expect } from 'chai';

describe('TransitionEvent.spec', () => {

  describe('clone', () => {
    it('should clone itself', () => {
      const transitionEvent = new TransitionEvent(TransitionEvent.TRANSITION_IN_START);
      expect(transitionEvent.clone()).to.deep.equal(transitionEvent);
    });
  });
});
