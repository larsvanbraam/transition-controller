import { expect } from 'chai';
import 'chai/register-should';
import { createTimeline, killAndClearTimeline, clearTimeline, cloneTimeline } from '../src/lib/util/TimelineUtils';
import { TimelineMax } from 'gsap';
import TransitionDirection from '../src/lib/enum/TransitionDirection';

describe('TimelineUtils.spec', () => {
  // killAndClearTimeline
  // clearTimeline
  // cloneTimeline


  let onStart = false;
  let onComplete = false;
  let onReverseStart = false;
  let onReverseComplete = false;

  const options = {
    onStart: () => {
      onStart = true;
    },
    onComplete: () => {
      onComplete = true;
    },
    onReverseStart: () => {
      onReverseStart = true;
    },
    onReverseComplete: () => {
      onReverseComplete = true;
    },
  };

  const demoDuration = 0.01;
  const demoTimeOut = demoDuration * 3000;
  const timeline = createTimeline(options);

  describe('createTimeline', () => {

    timeline.to({ test: 0 }, demoDuration, { test: 10 });


    it('should return a TimelineMax', () => {
      expect(timeline).to.be.instanceOf(TimelineMax);
    });

    it('should give onStart/onComplete callback', (done) => {
      timeline.play();
      setTimeout(() => {
        expect(onStart).to.be.true;
        expect(onComplete).to.be.true;
        done();
      }, demoTimeOut);
    });

    it('should give onReverseStart/onReverseComplete callback', (done) => {
      timeline.reverse();
      setTimeout(() => {
        expect(onReverseStart).to.be.true;
        expect(onReverseComplete).to.be.true;
        done();
      }, demoTimeOut);
    });
  });

  describe('killAndClearTimeline', () => {
    it('should clear and kill the timeline', () => {
      expect(killAndClearTimeline(timeline)).to.be.undefined;
    });
  });

  describe('clearTimeline', () => {
    it('should clear the timeline', () => {
      expect(clearTimeline(timeline)).to.be.undefined;
    });

    it('should clear the timeline with nested timeline', () => {
      timeline.add(cloneTimeline(timeline, TransitionDirection.IN))
      expect(clearTimeline(timeline)).to.be.undefined;
    });
  });

  describe('cloneTimeline', () => {
    it('should clone the timeline', () => {
      expect(cloneTimeline(timeline, TransitionDirection.OUT)).to.be.instanceOf(TimelineMax);
    })
  });

});
