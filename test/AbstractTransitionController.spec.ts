import chai, { expect } from 'chai';
import sinon from 'sinon';
import 'chai/register-should';
import sinonChai from 'sinon-chai';
import { Animation, TimelineMax } from 'gsap';
import { render, getComponent, getApp } from './util/index';
import { TransitionId } from '../test/util/component/ChildComponentA/ChildComponentATransitionController';
import TimelineType from '../src/lib/enum/TimelineType';
import TransitionDirection from '../src/lib/enum/TransitionDirection';
chai.use(sinonChai);

describe('#AbstractTransitionController.spec', () => {
  let componentA;
  let componentB;
  let componentC;
  let app;

  beforeEach(() => {
    render();
    app = getApp();
    componentA = getComponent('child-component-a');
    componentB = getComponent('child-component-b');
    componentC = getComponent('child-component-c');
  });

  describe('Properties', () => {
    describe('parentController', () => {
      it('should be the parent component', () => {
        expect(componentA.transitionController.parentController).to.deep.equal(componentA);
      });
    });

    describe('isHidden', () => {
      it('should be a boolean', () => {
        expect(componentA.transitionController.isHidden).to.be.a('boolean');
      });
    });

    describe('loopingAnimationStarted', () => {
      it('should be a boolean', () => {
        expect(componentA.transitionController.loopingAnimationStarted).to.be.a('boolean');
      });
    });

    describe('transitionInTimeline', () => {
      it('should be an instance of TimelineMax', () => {
        expect(componentA.transitionController.transitionInTimeline).to.be.instanceof(TimelineMax);
      });
    });

    describe('transitionOutTimeline', () => {
      it('should be an instance of TimelineMax', () => {
        expect(componentA.transitionController.transitionOutTimeline).to.be.instanceof(TimelineMax);
      });
    });

    describe('loopingAnimationTimeline', () => {
      it('should be an instance of TimelineMax', () => {
        expect(componentA.transitionController.loopingAnimationTimeline).to.be.instanceof(
          TimelineMax,
        );
      });
    });
  });

  describe('transitionIn', () => {
    it('should transition in the component', () => {
      return componentA.transitionController
        .transitionIn()
        .then(() => expect(componentA.transitionController.isHidden).to.be.false);
    });

    it('should force the transition in wile the transition out is still running.', done => {
      componentA.transitionController.transitionIn().then(() => {
        componentA.transitionController.transitionOut();
        return setTimeout(() => {
          componentA.transitionController
            .transitionIn(true)
            .then(() => expect(componentA.transitionController.isHidden).to.be.false)
            .then(() => done());
        }, 100);
      });
    });

    it('should not force the transition in wile the transition out is still running.', done => {
      componentA.transitionController.transitionIn().then(() => {
        componentA.transitionController.transitionOut();
        return setTimeout(() => {
          componentA.transitionController
            .transitionIn()
            .then(() => expect(componentA.transitionController.isHidden).to.be.false)
            .then(() => done());
        }, 100);
      });
    });

    it('should force the transition in wile the custom transition out is still running', done => {
      componentB.transitionController.transitionIn().then(() => {
        componentB.transitionController.transitionOut();
        return setTimeout(() => {
          componentB.transitionController
            .transitionIn(true)
            .then(() => expect(componentB.transitionController.isHidden).to.be.false)
            .then(() => done());
        }, 100);
      });
    });

    it('should force the transition in wile a current transition in is already running.', done => {
      componentA.transitionController.transitionIn();
      setTimeout(() => {
        componentA.transitionController
          .transitionIn(true)
          .then(() => expect(componentA.transitionController.isHidden).to.be.false)
          .then(() => done());
      }, 100);
    });

    it('should transition in the component but with no timeline set', () => {
      return componentC.transitionController
        .transitionIn()
        .then(() => expect(componentC.transitionController.isHidden).to.be.false);
    });

    it('should transition in the component, but it is already visible', () => {
      return componentA.transitionController
        .transitionIn()
        .then(() => componentA.transitionController.transitionIn())
        .then(() => expect(componentA.transitionController.isHidden).to.be.false);
    });
  });

  describe('transitionOut', () => {
    it('should transition out the component', () => {
      return componentA.transitionController
        .transitionIn()
        .then(() => componentA.transitionController.transitionOut())
        .then(() => expect(componentA.transitionController.isHidden).to.be.true);
    });

    it('should transition out the component, but it is already hidden', () => {
      return componentA.transitionController
        .transitionOut()
        .then(() => expect(componentA.transitionController.isHidden).to.be.true);
    });

    it('should not force the transition out, with a custom out timeline', done => {
      componentA.transitionController.transitionIn();
      setTimeout(() => {
        componentA.transitionController
          .transitionOut()
          .then(() => expect(componentA.transitionController.isHidden).to.be.true)
          .then(() => done());
      }, 100);
    });

    it('should force the transition out, with a custom out timeline', done => {
      componentA.transitionController.transitionIn();
      setTimeout(() => {
        componentA.transitionController
          .transitionOut(true)
          .then(() => expect(componentA.transitionController.isHidden).to.be.true)
          .then(() => done());
      }, 100);
    });

    it('should force the transition out wile a current transition out is already running.', done => {
      componentA.transitionController.transitionIn().then(() => {
        componentA.transitionController.transitionOut().catch(() => done());
        setTimeout(() => {
          componentA.transitionController
            .transitionOut(true)
            .then(() => expect(componentA.transitionController.isHidden).to.be.true);
        }, 100);
      });
    });
  });

  describe('startLoopingAnimation', () => {
    it('should start the looping animation with exact parameters', () => {
      const reset = false;
      const label = TransitionId.LOOP_1;

      const spy = sinon.spy(componentA.transitionController, 'setupTimeline');
      expect(componentA.transitionController.startLoopingAnimation(label, reset)).to.be.undefined;
      expect(spy).to.be.calledWithExactly(TimelineType.LOOPING, reset, label);
      spy.restore();
    });
  });

  describe('stopLoopingAnimation', () => {
    it('should stop looping animation', () => {
      expect(componentA.transitionController.stopLoopingAnimation()).to.be.undefined;
    });
  });

  describe('setupTimeline', () => {
    it('should setup looping timeline with label', () => {
      expect(
        componentA.transitionController.setupTimeline(
          TimelineType.LOOPING,
          false,
          TransitionId.LOOP_1,
        ),
      ).to.be.undefined;
    });

    it('should setup looping timeline', () => {
      expect(componentA.transitionController.setupTimeline(TimelineType.LOOPING, false)).to.be
        .undefined;
    });

    it('should setup in timeline with label', () => {
      expect(
        componentA.transitionController.setupTimeline(
          TimelineType.IN,
          false,
          TransitionId[TransitionDirection.IN].TRANSITION_ID_1,
        ),
      ).to.be.undefined;
    });

    it('should setup in timeline', () => {
      expect(componentA.transitionController.setupTimeline(TimelineType.IN, false)).to.be.undefined;
    });

    it('should setup out timeline with label', () => {
      expect(
        componentA.transitionController.setupTimeline(
          TimelineType.OUT,
          false,
          TransitionId[TransitionDirection.OUT].TRANSITION_ID_1,
        ),
      ).to.be.undefined;
    });

    it('should setup out timeline', () => {
      expect(componentA.transitionController.setupTimeline(TimelineType.OUT, false)).to.be
        .undefined;
    });

    it('should try to setup a unknown timeline and throw an error', () => {
      expect(() => componentA.transitionController.setupTimeline()).to.throw(Error);
    });
  });

  describe('resetTimeline', () => {
    it('should reset the transition in timeline', () => {
      expect(componentA.transitionController.resetTimeline(TimelineType.IN)).to.be.undefined;
    });

    it('should reset the transition in timeline, including the child components', () => {
      expect(
        componentA.transitionController.resetTimeline(TimelineType.IN, [
          '[data-component="child-component-b"]',
          '[data-component="child-component-c"]',
        ]),
      ).to.be.undefined;
    });
  });

  describe('getComponent', () => {
    it('should try to get a component by string', () => {
      expect(app.transitionController.getComponent('[data-component="child-component-a"]')).to.be.a(
        'object',
      );
    });

    it('should try to get a  component by Component', () => {
      expect(componentA.transitionController.getComponent(componentA)).to.be.a('object');
    });

    it('should try to get a  component by Element', () => {
      expect(componentA.transitionController.getComponent(componentA.element)).to.be.a('object');
    });

    it('should throw error for getComponent ', () => {
      expect(
        componentA.transitionController.getComponent.bind(componentA.transitionController),
      ).to.throw('The requested component [undefined]' + ' does not exist');
    });
  });

  describe('getTimelineDurationForComponent', () => {
    it('should try to getTimelineDurationForComponent by string', () => {
      expect(
        app.transitionController.getTimelineDurationForComponent(
          '[data-component="child-component-a"]',
        ),
      ).to.be.a('number');
    });

    it('should try to getTimelineDurationForComponent by Component', () => {
      expect(componentA.transitionController.getTimelineDurationForComponent(componentA)).to.be.a(
        'number',
      );
    });

    it('should try to getTimelineDurationForComponent by Element', () => {
      expect(
        componentA.transitionController.getTimelineDurationForComponent(componentA.element),
      ).to.be.a('number');
    });

    it('should try to getTimelineDurationForComponent with exact parameters', () => {
      const reset = false;
      const label = TransitionId[TransitionDirection.IN].TRANSITION_ID_1;
      const direction = TransitionDirection.IN;

      const spy = sinon.spy(componentA.transitionController, 'getTimelineInstance');
      expect(
        componentA.transitionController.getTimelineDurationForComponent(
          componentA,
          direction,
          reset,
          label,
        ),
      ).to.be.a('number');
      expect(spy).to.be.calledWithExactly(componentA, direction, reset, label);
      spy.restore();
    });
  });

  describe('getTimelineInstance', () => {
    it('should getTimelineInstance', () => {
      const reset = false;
      const labelOUT = TransitionId[TransitionDirection.OUT].TRANSITION_ID_1;

      expect(
        componentA.transitionController.getTimelineInstance(
          componentA,
          TransitionDirection.OUT,
          reset,
          labelOUT,
        ),
      ).to.be.instanceOf(TimelineMax);
    });
  });

  describe('getTimeline', () => {
    it('should try to getTimeline by string', () => {
      expect(
        app.transitionController.getTimeline('[data-component="child-component-a"]'),
      ).to.be.instanceOf(TimelineMax);
    });

    it('should try to getTimeline by Component', () => {
      expect(componentA.transitionController.getTimeline(componentA)).to.be.instanceOf(TimelineMax);
    });

    it('should try to getTimeline by Element', () => {
      expect(componentA.transitionController.getTimeline(componentA.element)).to.be.instanceOf(
        TimelineMax,
      );
    });

    it('should try to getTimeline with exact parameters', () => {
      const reset = false;
      const label = TransitionId[TransitionDirection.IN].TRANSITION_ID_1;
      const direction = TransitionDirection.IN;

      const spy = sinon.spy(componentA.transitionController, 'getTimelineInstance');
      expect(
        componentA.transitionController.getTimeline(componentA, direction, reset, label),
      ).to.be.instanceOf(TimelineMax);
      expect(spy).to.be.calledWithExactly(componentA, direction, reset, label);
      spy.restore();
    });
  });

  describe('clean', () => {
    it('should clean the component', () => {
      expect(componentA.transitionController.clean()).to.be.undefined;
    });
  });

  describe('dispose', () => {
    it('should dispose the component', () => {
      expect(componentA.transitionController.dispose()).to.be.undefined;
    });

    it('should dispose the component while the transition out is still running', done => {
      componentA.transitionController.transitionIn().then(() => {
        componentA.transitionController.transitionOut().then(() => {
          expect(componentA.transitionController.dispose()).to.be.undefined;
          done();
        });
        setTimeout(() => {
          componentA.transitionController.dispose();
        }, 100);
      });
    });
  });
});
