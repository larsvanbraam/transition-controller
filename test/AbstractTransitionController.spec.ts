import chai, { expect } from 'chai';
import sinon from 'sinon';
import 'chai/register-should';
import sinonChai from 'sinon-chai';
import { Animation, TimelineMax } from 'gsap';
import { render, getComponent, getApp } from './util/index.spec';
import { TransitionId } from '../test/util/component/ChildComponentA/ChildComponentATransitionController';
import TimelineType from '../src/lib/enum/TimelineType';
import TransitionDirection from '../src/lib/enum/TransitionDirection';
chai.use(sinonChai);

describe('#AbstractTransitionController.spec', () => {
  let component;
  let app;

  before(() => {
    render();
    app = getApp();
    component = getComponent('child-component-a');
  });

  describe('transitionIn', () => {
    it('should transition in the component', () => {
      return component.transitionController.transitionIn()
        .then(() => expect(component.transitionController.isHidden).to.be.false);
    });
  });

  describe('transitionOut', () => {
    it('should transition out the component', () => {
      return component.transitionController.transitionIn(true)
        .then(() => component.transitionController.transitionOut(true))
        .then(() => expect(component.transitionController.isHidden).to.be.true);
    });
  });

  describe('startLoopingAnimation', () => {
    it('should start the looping animation with exact parameters', () =>{
      const reset = false;
      const label = TransitionId.LOOP_1;

      const spy = sinon.spy(component.transitionController, 'setupTimeline');
      expect(component.transitionController.startLoopingAnimation(label, reset)).to.be.undefined;
      expect(spy).to.be.calledWithExactly(TimelineType.LOOPING, reset, label);
      spy.restore();
    });
  });

  describe('setupTimeline', () => {
    it('should setup looping timeline with label', () => {
      expect(component.transitionController.setupTimeline(TimelineType.LOOPING, false, TransitionId.LOOP_1)).to.be.undefined;
    });

    it('should setup looping timeline', () => {
      expect(component.transitionController.setupTimeline(TimelineType.LOOPING, false)).to.be.undefined;
    });

    it('should setup in timeline with label', () => {
      expect(component.transitionController.setupTimeline(TimelineType.IN, false, TransitionId[TransitionDirection.IN].TRANSITION_ID_1)).to.be.undefined;
    });

    it('should setup in timeline', () => {
      expect(component.transitionController.setupTimeline(TimelineType.IN, false)).to.be.undefined;
    });

    it('should setup out timeline with label', () => {
      expect(component.transitionController.setupTimeline(TimelineType.OUT, false, TransitionId[TransitionDirection.OUT].TRANSITION_ID_1)).to.be.undefined;
    });

    it('should setup out timeline', () => {
      expect(component.transitionController.setupTimeline(TimelineType.OUT, false)).to.be.undefined;
    });
  });


  describe('stopLoopingAnimation', () => {
    it('should stop looping animation', () => {
      expect(component.transitionController.stopLoopingAnimation()).to.be.undefined;
    });
  });


  describe('getComponent', () => {
    it('should try to get a component by string', () => {
      expect(app.transitionController.getComponent('[data-component="child-component-a"]')).to.be.a('object');
    });

    it('should try to get a  component by Component', () => {
      expect(component.transitionController.getComponent(component)).to.be.a('object');
    });

    it('should try to get a  component by Element', () => {
      expect(component.transitionController.getComponent(component.element)).to.be.a('object');
    });

    it('should trhow error for getComponent ', () => {
      expect(component.transitionController.getComponent.bind(component.transitionController)).to.throw('The requested component [undefined]' +
        ' does not exist');
    });
  });

  describe('getTimelineDurationForComponent', () => {
    it('should try to getTimelineDurationForComponent by string', () => {
      expect(app.transitionController.getTimelineDurationForComponent('[data-component="child-component-a"]')).to.be.a('number');
    });

    it('should try to getTimelineDurationForComponent by Component', () => {
      expect(component.transitionController.getTimelineDurationForComponent(component)).to.be.a('number');
    });

    it('should try to getTimelineDurationForComponent by Element', () => {
      expect(component.transitionController.getTimelineDurationForComponent(component.element)).to.be.a('number');
    });

    it('should try to getTimelineDurationForComponent with exact parameters', () => {
      const reset = false;
      const label = TransitionId[TransitionDirection.IN].TRANSITION_ID_1;
      const direction = TransitionDirection.IN;

      const spy = sinon.spy(component.transitionController, 'getTimelineInstance');
      expect(component.transitionController.getTimelineDurationForComponent(component, direction, reset, label)).to.be.a('number');
      expect(spy).to.be.calledWithExactly(component, direction, reset, label);
      spy.restore();
    });
  });

  describe('getTimelineInstance', () => {
    it('should getTimelineInstance', () => {
      const reset = false;
      const labelOUT = TransitionId[TransitionDirection.OUT].TRANSITION_ID_1;

      expect(component.transitionController.getTimelineInstance(component,  TransitionDirection.OUT, reset, labelOUT)).to.be.instanceOf(TimelineMax);
    });
  });


  describe('getTimeline', () => {
    it('should try to getTimeline by string', () => {
      expect(app.transitionController.getTimeline('[data-component="child-component-a"]')).to.be.instanceOf(TimelineMax);
    });

    it('should try to getTimeline by Component', () => {
      expect(component.transitionController.getTimeline(component)).to.be.instanceOf(TimelineMax);
    });

    it('should try to getTimeline by Element', () => {
      expect(component.transitionController.getTimeline(component.element)).to.be.instanceOf(TimelineMax);
    });

    it('should try to getTimeline with exact parameters', () => {
      const reset = false;
      const label = TransitionId[TransitionDirection.IN].TRANSITION_ID_1;
      const direction = TransitionDirection.IN;

      const spy = sinon.spy(component.transitionController, 'getTimelineInstance');
      expect(component.transitionController.getTimeline(component, direction, reset, label)).to.be.instanceOf(TimelineMax);
      expect(spy).to.be.calledWithExactly(component, direction, reset, label);
      spy.restore();
    });
  });

  describe('parentController', () => {
    it('should be the parent component', () => {
      expect(component.transitionController.parentController).to.deep.equal(component);
    });
  });

  describe('isHidden', () => {
    it('should be a boolean', () => {
      expect(component.transitionController.isHidden).to.be.a('boolean');
    });
  });

  describe('loopingAnimationStarted', () => {
    it('should be a boolean', () => {
      expect(component.transitionController.loopingAnimationStarted).to.be.a('boolean');
    });
  });

  describe('transitionInTimeline', () => {
    it('should be an instance of TimelineMax', () => {
      expect(component.transitionController.transitionInTimeline).to.be.instanceof(TimelineMax);
    });
  });

  describe('transitionOutTimeline', () => {
    it('should be an instance of TimelineMax', () => {
      expect(component.transitionController.transitionOutTimeline).to.be.instanceof(TimelineMax);
    });
  });

  describe('loopingAnimationTimeline', () => {
    it('should be an instance of TimelineMax', () => {
      expect(component.transitionController.loopingAnimationTimeline).to.be.instanceof(TimelineMax);
    });
  });

  describe('clean', () => {
    it('should clean the component', () => {
      expect(component.transitionController.clean()).to.be.undefined;
    });
  });

  describe('Dispose', () => {
    it('should dispose the component', () => {
      expect(component.transitionController.dispose()).to.be.undefined;
    });
  });
});
