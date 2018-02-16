import { TimelineLite, TimelineMax } from 'gsap';
import EventDispatcher from 'seng-event';
import TransitionEvent from './event/TransitionEvent';
import IAbstractTransitionControllerOptions from 'lib/interface/IAbstractTranstitionControllerOptions';
import { createTimeline, killAndClearTimeline } from 'lib/util/TimelineUtils';
import TransitionDirection from 'lib/enum/TransitionDirection';

/**
 * @class AbstractTransitionController
 * @description This class is used by all components that you want to be transition in/out
 *
 * When extending the AbstractTransitionController a transition out timeline is not required. If it's not provided it
 * will reverse the transition in timeline when transition out is triggered.
 */
export default abstract class AbstractTransitionController extends EventDispatcher {
  private static counter: number = 0;
  /**
   * @protected
   * @description The element on which the transition controller is applied
   */
  protected element: HTMLElement;

  /**
   * @property transitionInTimeline { TimelineLite }
   * @protected
   * @description The timeline that is used for transition in animations.
   */
  protected transitionInTimeline: TimelineLite | TimelineMax;

  /**
   * @property transitionOutTimeline { TimelineLite }
   * @protected
   * @description The timeline that is used for transition out animations. If no animations are added it will
   * automatically use the reversed version of the transition in timeline for the out animations
   */
  protected transitionOutTimeline: TimelineLite | TimelineMax;

  /**
   * @type {boolean}
   * @private
   * @description Check if the component is currently in the transitionedOut state, this is to avoid calling the
   * transition out method when it's already transitioned out.
   */
  private isHidden: boolean = true;

  /**
   * @private
   * @property transitionInResolveMethod
   * @type { ()=>void }
   * @description The resolve method used for resolving the transition in promise.
   */
  private transitionInResolveMethod: () => void = null;

  /**
   * @private
   * @property transitionOutResolveMethod
   * @type { ()=>void }
   * @description The resolve method used for resolving the transition out promise.
   */
  private transitionOutResolveMethod: () => void = null;

  /**
   * @private
   * @property transitionInRejectMethod
   * @type { ()=>void }
   * @description The reject method used for rejecting the transition in promise.
   */
  private transitionInRejectMethod: () => void = null;

  /**
   * @private
   * @property transitionOutRejectMethod
   * @type { ()=>void }
   * @description The resolve method used for rejecting the transition out promise.
   */
  private transitionOutRejectMethod: () => void = null;

  /**
   * @private
   * @property transitionInPromise
   * @type { Promise<void> }
   * @description The transition promise is used so we can wait for the transition in to be completed.
   */
  private transitionInPromise: Promise<void> = null;

  /**
   * @private
   * @property _transitionOutPromise
   * @type { Promise<void> }
   * @description The transition promise is used so we can wait for the transition out to be completed.
   */
  private _transitionOutPromise: Promise<void> = null;

  /**
   * @private
   * @property options
   * @description the options for the controller
   * @type {{}}
   * @private
   */
  private options: IAbstractTransitionControllerOptions = {
    name: `unnamed-component-${AbstractTransitionController.counter++}`,
    debug: false,
    useTimelineMax: false,
  };

  constructor(element: HTMLElement, options: IAbstractTransitionControllerOptions = {}) {
    super();
    // Store the element reference
    this.element = element;
    // Merge the options
    Object.assign(this.options, options);
    // Create the timelines
    this.createTransitionTimelines();
    // Initialize the transition controller
    this.init();
  }

  /**
   * @public
   * @method transitionIn
   * @param { boolean } forceTransition
   * @returns { Promise<any> }
   */
  public transitionIn(forceTransition: boolean = false): Promise<void> {
    let oldTransitionPromise = Promise.resolve();

    /**
     * Check if we already have a transition out going on, if so we finish it right away! and trigger a
     * transition complete.
     */
    if (this._transitionOutPromise !== null) {
      if (forceTransition) {
        if (this.transitionOutTimeline.getChildren().length > 0) {
          this.transitionOutTimeline.kill();
        } else {
          this.transitionInTimeline.kill();
        }
        this.handleTransitionComplete(TransitionDirection.OUT);

        if (this.options.debug) {
          console.info(`${this.options.name} Interrupted the transition out!`);
        }
      } else {
        oldTransitionPromise = this._transitionOutPromise;
      }
    }

    return oldTransitionPromise.then(() => {
      // Component is already transitioning out
      if (this.transitionInPromise !== null && forceTransition) {
        if (this.options.debug) {
          console.warn(`[TransitionController][${
            this.options.name
          }] Already transitioning in, so rejecting the original 
          transitionIn promise to clear any queued animations. We finish the current animation and return a resolved 
          promise right away`);
        }
        // TODO: should the forced out wait for the original animation to be completed??
        this.transitionInRejectMethod();
        this.transitionInPromise = null;
      }

      // Make sure the transitionOut is paused in case we clicked the transitionIn while
      // the transitionOut was not finished yet.
      this.transitionOutTimeline.paused(true);

      // Only allow the transition in if the element is hidden
      if (this.transitionInPromise === null && this.isHidden) {
        this.transitionInPromise = new Promise<void>((resolve: () => void) => {
          if (this.transitionInTimeline.getChildren().length === 0) {
            if (this.options.debug) {
              console.info(`${this.options.name}: This block has no transition in timeline`);
            }

            // Dispatch the events even though there is no time line
            if (!this.isDisposed()) {
              this.dispatchEvent(new TransitionEvent(TransitionEvent.TRANSITION_IN_START));
            }

            this.isHidden = false;

            if (!this.isDisposed()) {
              this.dispatchEvent(new TransitionEvent(TransitionEvent.TRANSITION_IN_COMPLETE));
            }

            resolve();
          } else {
            // Remove the paused state from transitionIn Timeline
            this.transitionInTimeline.paused(false);

            this.transitionInResolveMethod = resolve;
            this.transitionInRejectMethod = resolve;
            this.transitionInTimeline.restart();
          }
        });
      }

      if (this.transitionInPromise === null) {
        if (this.options.debug) {
          console.warn(`[TransitionController][${
            this.options.name
          }] Transition in triggered when it's already 
          visible, so we will do nothing and return a resolved promise!`);
        }
        return Promise.resolve();
      }

      return this.transitionInPromise;
    });
  }

  /**
   * @public
   * @method transitionOut
   * @oaran { boolean } forceTransition
   * @returns {Promise<any>}
   */
  public transitionOut(forceTransition: boolean = false): Promise<void> {
    let oldTransitionPromise = Promise.resolve();

    /**
     * Check if we already have a transition out going on, if so we finish it right away! and trigger a
     * transition complete.
     */
    if (this.transitionInPromise !== null) {
      if (forceTransition) {
        this.transitionInTimeline.kill();
        this.handleTransitionComplete(TransitionDirection.IN);

        if (this.options.debug) {
          console.warn(`${this.options.name} Interrupted the transition in!`);
        }
      } else {
        oldTransitionPromise = this.transitionInPromise;
      }
    }

    return oldTransitionPromise.then(() => {
      // Component is already transitioning out
      if (this._transitionOutPromise !== null && forceTransition) {
        if (this.options.debug) {
          console.warn(`[TransitionController][${
            this.options.name
          }] Already transitioning out, so rejecting the 
          original transitionOut promise to clear any queued animations. We finish the current animation and return 
          a resolved promise right away`);
        }
        // TODO: should the forced out wait for the original animation to be completed??
        this.transitionOutRejectMethod();
        this._transitionOutPromise = null;
      }
      // Only allow the transition out if the element is not hidden
      if (this._transitionOutPromise === null && !this.isHidden) {
        this.isHidden = true;

        // If we do have a transitionOut make sure the transitionIn is paused in case we clicked the
        // transitionOut while the transitionIn was not finished yet.
        if (this.transitionOutTimeline.getChildren().length > 0) {
          this.transitionOutTimeline.paused(false);
          this.transitionInTimeline.paused(true);
        } else {
          // We don't have a transitionOutTimeline, so we are reversing it, therefore removing the paused state.
          this.transitionInTimeline.paused(false);
        }

        this._transitionOutPromise = new Promise<void>(
          (resolve: () => void, reject: () => void) => {
            this.transitionOutResolveMethod = resolve;
            this.transitionOutRejectMethod = reject;
            if (this.transitionOutTimeline.getChildren().length > 0) {
              this.transitionOutTimeline.restart();
            } else {
              this.transitionInTimeline.reverse();
            }
          },
        );
      }

      if (this._transitionOutPromise !== null) {
        if (this.options.debug) {
          console.warn(`[TransitionController][${
            this.options.name
          }] Transition out triggered when it's already hidden, 
          so we will do nothing and return a resolved promise!`);
        }

        // Already hidden, so resolve it right away
        return Promise.resolve();
      }

      return this._transitionOutPromise;
    });
  }

  /**
   * @protected
   * @method init
   * @description This method will be used for setting up the timelines for the component
   */
  protected init(): void {
    this.setupTransitionInTimeline();
    this.setupTransitionOutTimeline();
  }

  /**
   * @public
   * @method setupTransitionOutTimeline
   * @description overwrite this method in the parent class
   */
  protected abstract setupTransitionOutTimeline(): void;

  /**
   * @public
   * @method setupTransitionInTimeline
   * @description overwrite this method in the parent class
   * */
  protected abstract setupTransitionInTimeline(): void;

  /**
   * @private
   * @method createTransitionTimelines
   * @description Setup the transition timelines
   */
  private createTransitionTimelines(): void {
    this.transitionInTimeline = createTimeline({
      useTimelineMax: this.options.useTimelineMax,
      onStart: () => this.handleTransitionStart(TransitionDirection.IN),
      onComplete: () => this.handleTransitionComplete(TransitionDirection.IN),
      onReverseStart: () => this.handleTransitionStart(TransitionDirection.OUT),
      onReverseComplete: () => this.handleTransitionComplete(TransitionDirection.OUT),
    });

    this.transitionOutTimeline = createTimeline({
      useTimelineMax: this.options.useTimelineMax,
      onStart: () => this.handleTransitionStart(TransitionDirection.OUT),
      onComplete: () => this.handleTransitionStart(TransitionDirection.OUT),
    });
  }

  /**
   * @private
   * @method handleTransitionStart
   */
  private handleTransitionStart(direction: TransitionDirection): void {
    switch (direction) {
      case TransitionDirection.IN:
        if (!this.isDisposed()) {
          this.dispatchEvent(new TransitionEvent(TransitionEvent.TRANSITION_IN_START));
        }
        this.isHidden = false;
        break;
      case TransitionDirection.OUT:
        if (!this.isDisposed()) {
          this.dispatchEvent(new TransitionEvent(TransitionEvent.TRANSITION_OUT_START));
        }
        this.isHidden = true;
        break;
      default:
      // No default statement
    }
  }

  /**
   * @private
   * @method handleTransitionComplete
   * @param { string } type
   */
  private handleTransitionComplete(direction: TransitionDirection): void {
    switch (direction) {
      case TransitionDirection.IN:
        this.transitionInPromise = null;
        if (this.transitionInResolveMethod !== null) {
          this.transitionInResolveMethod();
          this.transitionInResolveMethod = null;
        }
        if (!this.isDisposed()) {
          this.dispatchEvent(new TransitionEvent(TransitionEvent.TRANSITION_IN_COMPLETE));
        }
        break;
      case TransitionDirection.OUT: {
        this._transitionOutPromise = null;
        if (this.transitionOutResolveMethod !== null) {
          this.transitionOutResolveMethod();
          this.transitionOutResolveMethod = null;
        }

        if (!this.isDisposed()) {
          this.dispatchEvent(new TransitionEvent(TransitionEvent.TRANSITION_OUT_COMPLETE));
        }
        break;
      }
    }
  }

  /**
   * @private
   * @method clean
   * @description Clean all the timelines and the resolve method
   */
  private clean(): void {
    this.element = null;
    this.isHidden = null;

    if (this.transitionOutTimeline !== null) {
      killAndClearTimeline(this.transitionOutTimeline);
      this.transitionOutTimeline = null;
    }

    if (this.transitionInTimeline !== null) {
      killAndClearTimeline(this.transitionInTimeline);
      this.transitionInTimeline = null;
    }

    this.transitionOutResolveMethod = null;
    this.transitionInResolveMethod = null;

    this._transitionOutPromise = null;
    this.transitionInPromise = null;
  }

  /**
   * @public
   * @method destruct
   * @description Because Vue destructs the VM instance before it removes the DOM node we want to finish the
   * transition out before actually cleaning everything
   */
  public dispose(): void {
    if (this._transitionOutPromise !== null && this.transitionOutResolveMethod !== null) {
      this._transitionOutPromise.then(this.clean.bind(this));
    } else {
      this.clean();
    }
    super.dispose();
  }
}
