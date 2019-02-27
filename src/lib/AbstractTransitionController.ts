import { TimelineMax, Animation } from 'gsap';
import EventDispatcher from 'seng-event';
import TransitionEvent from './event/TransitionEvent';
import { IAbstractTransitionControllerOptions } from './interface/IAbstractTranstitionControllerOptions';
import { cloneTimeline, createTimeline, killAndClearTimeline } from './util/TimelineUtils';
import TransitionDirection from './enum/TransitionDirection';
import TimelineType from './enum/TimelineType';

/**
 * ### AbstractTransitionController
 * The AbstractTransitionController is the main class of the module. See the sub-pages for detailed information about the properties and methods.
 *
 * @param T This param defines the type of the parent controller, this is of course framework specific.
 */
export default abstract class AbstractTransitionController<T> extends EventDispatcher {
  /**
   * @private
   * @static counter
   * @description a namespace counter used for unique naming of components
   * @type {number}
   */
  private static counter: number = 0;

  /**
   * The parentController gives you access to the class that constructed the
   * transition controller. You might need this if you want to access elements
   * from the parentController. For example in a Vue.js project you might want
   * to access the **$refs** of you Vue.js component to setup your animations.
   *
   * @public
   */
  public parentController: T;

  /**
   * The isHidden property gives you the current transition state of the
   * component. A component is either hidden or not.
   *
   * @public
   */
  public isHidden: boolean = true;

  /**
   * The loopingAnimationStarted property gives you the current looping
   * transition state of the component a looping animation is either running or not.
   *
   * @public
   */
  public loopingAnimationStarted: boolean = false;

  /**
   * The transitionInTimeline property is the timeline that is used for the in animation
   * of the component.
   *
   * @public
   */
  public transitionInTimeline: TimelineMax;

  /**
   * The transitionOutTimeline property is the timeline that is used for the out
   * animation of the component.
   *
   * @public
   */
  public transitionOutTimeline: TimelineMax;

  /**
   * The loopingAnimationTimeline property is the timeline that is used for the looping
   * animations inside of a component. The timeline configuration is setup to loop until pause is called.
   *
   * @public
   */
  public loopingAnimationTimeline: TimelineMax;

  /**
   * The resolve method used for resolving the transition in promise.
   *
   * @private
   */
  private transitionInResolveMethod: () => void = null;

  /**
   * The resolve method used for resolving the transition out promise.
   *
   * @private
   */
  private transitionOutResolveMethod: () => void = null;

  /**
   * The reject method used for rejecting the transition in promise.
   *
   * @private
   */
  private transitionInRejectMethod: () => void = null;

  /**
   * The resolve method used for rejecting the transition out promise.
   *
   * @private
   */
  private transitionOutRejectMethod: () => void = null;

  /**
   * The transition promise is used so we can wait for the transition in to be completed.
   *
   * @private
   */
  private transitionInPromise: Promise<void> = null;

  /**
   * The transition promise is used so we can wait for the transition out to be completed.
   *
   * @private
   */
  private _transitionOutPromise: Promise<void> = null;

  /**
   * The options that were provided when constructing the class are stored on this property
   *
   * @private
   */
  private options: IAbstractTransitionControllerOptions = {
    name: `unnamed-component-${AbstractTransitionController.counter++}`,
    transitionController: 'transitionController',
    debug: false,
    transitionInId: null,
    transitionOutId: null,
    loopId: null,
  };

  /**
   * The constructor initiates the class, it merges the default options with the
   * provided options and creates the transition timelines.
   *
   * **Note:** Keep in mind that the moment the transition controller is constructed
   * it also calls the init method that triggers the methods to setup the timelines.
   * So always cconstruct the transition controller after your component is ready.
   *
   * @param {T} parent The reference to the parent instance
   * @param {IAbstractTransitionControllerOptions} options The configuration object for the transition controller
   */
  constructor(parent: T, options: IAbstractTransitionControllerOptions = {}) {
    super();
    // Store the parent reference
    this.parentController = parent;
    // Merge the options
    Object.assign(this.options, options);
    // Create the timelines
    this.createTransitionTimelines();
    // Initialize the transition controller
    this.init();
  }

  /**
   * The transitionIn method restarts the transitionInTimeline and returns
   * a promise to let you know that is is done with the animation. By default the
   * transition in will wait for any old transitionOut that is still running. If
   * you want to force your transition in and kill any running transitionOut animations
   * you should set the forceTransition flag to true when calling the transitionIn method.
   *
   * @public
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

            // Manually trigger handleTransitionStart because the timeline is empty.
            this.handleTransitionStart(TransitionDirection.IN);

            setTimeout(() => {
              // Manually trigger handleTransitionComplete because the timeline is empty
              this.handleTransitionComplete(TransitionDirection.IN);
              // Add a next tick between the events otherwise the events happen simultaneously.
              resolve();
            }, 0);
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

  /**
   * The transitionOut method will look if the transitionOutTimeline has any
   * animations added to it. If no animations were added it will reverse the
   * transitionInTimeline. Otherwise it will restart the transitionOutTimeline.
   *
   * @public
   * @param {boolean} forceTransition Forcing a transition means that the old transition out will be stopped!
   * @param {string} id This is the id of the transition out timeline that you want to trigger
   * @param {boolean} reset This means that the transition out timeline will be re-initialized.
   * @returns {Promise<void>}
   */
  public transitionOut(
    forceTransition: boolean = false,
    id: string = this.options.transitionOutId,
    reset: boolean = false,
  ): Promise<void> {
    let oldTransitionPromise = Promise.resolve();

    // The transition out timeline might not be created yet, so initialize it runtime.
    this.setupTimeline(TimelineType.OUT, reset, id);

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

      if (this._transitionOutPromise === null) {
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
   * This method is pretty straightforward will start the loopingAnimationTimeline.
   *
   * @param {string} id This is the id of the timeline that you want to start
   * @param {boolean} reset This means that the timeline will be re-initialized.
   */
  public startLoopingAnimation(id: string = this.options.loopId, reset: boolean = true): void {
    this.setupTimeline(TimelineType.LOOPING, reset, id);
    this.loopingAnimationTimeline.play();
    this.loopingAnimationStarted = true;
  }

  /**
   * This method is pretty straightforward will stop the loopingAnimationTimeline.
   *
   * @public
   */
  public stopLoopingAnimation(): void {
    this.loopingAnimationTimeline.pause();
    this.loopingAnimationStarted = false;
  }

  /**
   * When nesting transition components you might want to nest the timelines
   * as well, this makes it easier to time all the component transitions. Keep
   * in mind that the getTimeline method returns a clone of the original timeline.
   *
   * @public
   * @param {string | HTMLElement | T} component The selector for the component that you want the timeline for
   * @param {TransitionDirection} direction The direction of the timeline that you want
   * @param {boolean} reset This flag determines if we reset the existing timeline or re-create it from scratch
   * @param {boolean} id This is the id of the timeline that we are requesting
   * @returns { Animation } The timeline that is retrieved
   */
  public getTimeline(
    component: string | HTMLElement | T,
    direction: TransitionDirection = TransitionDirection.IN,
    reset: boolean = false,
    id?: string,
  ): Animation {
    const componentInstance = this.getComponent(component);
    const timelineInstance = this.getTimelineInstance(componentInstance, direction, reset, id);

    return cloneTimeline(timelineInstance, direction).restart();
  }

  /**
   * @public
   * @param {string | HTMLElement | T} component The selector for the component that you want to get the timeline for
   * @param {TransitionDirection} direction The direction that you want to check for
   * @param {boolean} reset This flag determines if we reset the existing timeline or re-create it from scratch
   * @param {boolean} id This is the id of the timeline that we are requesting
   * @returns {number} The duration of the timeline
   */
  public getTimelineDurationForComponent(
    component: string | HTMLElement | T,
    direction: TransitionDirection = TransitionDirection.IN,
    reset: boolean = false,
    id?: string,
  ): number {
    return this.getTimelineInstance(this.getComponent(component), direction, reset, id).duration();
  }

  /**
   * Setup timeline is a wrapper method that calls the correct setup methods and clears any old timelines if necessary
   *
   * @public
   * @param {Timeline} type This is the type of timeline that will be initialized.
   * @param {boolean} reset This means the timeline will be cleared before initializing
   * @param {string} id This is the id of the timeline that should be initialized.
   */
  public setupTimeline(type: TimelineType, reset: boolean = true, id?: string) {
    let timeline;
    let transitionId;
    let setupMethod;

    switch (type) {
      case TimelineType.IN:
        timeline = this.transitionInTimeline;
        transitionId = id === void 0 ? this.options.transitionInId : id;
        setupMethod = this.setupTransitionInTimeline.bind(this);
        break;
      case TimelineType.OUT:
        timeline = this.transitionOutTimeline;
        transitionId = id === void 0 ? this.options.transitionOutId : id;
        setupMethod = this.setupTransitionOutTimeline.bind(this);
        break;
      case TimelineType.LOOPING:
        timeline = this.loopingAnimationTimeline;
        transitionId = id === void 0 ? this.options.loopId : id;
        setupMethod = this.setupLoopingAnimationTimeline.bind(this);
        break;
      default:
        throw new Error(`Unsupported timeline type: ${type}`);
    }

    if (reset || id !== transitionId) killAndClearTimeline(timeline);

    if (timeline.getChildren() <= 0) {
      setupMethod(timeline, this.parentController, transitionId);
      timeline.pause();
    } else if (this.options.debug) {
      console.warn(`[TransitionController][timeline: ${timeline} id: ${transitionId}] Skipping setup method because 
      the timeline already has children!`);
    }
  }

  /**
   * This method will be used for setting up the timelines for the component
   *
   * @protected
   */
  protected init(): void {
    this.setupTimeline(TimelineType.IN, true, this.options.transitionInId);
  }

  /**
   * This method is actually set's up the transition out timeline. it should contain all
   * the animations that are required for the transition out to done.
   *
   * @protected
   * @param {TimelineMax} timeline The reference to the transition out timeline
   * @param {T} parent The reference to the parent instance
   * @param {string} id The id of the transition out timeline that should be initialized
   * @param {boolean} reset When this flag is set to true the old timeline will be cleared before calling the method
   */
  protected abstract setupTransitionOutTimeline(timeline: TimelineMax, parent: T, id: string): void;

  /**
   * This method is actually set's up the transition in timeline. it should contain all
   * the animations that are required for the transition in to done.
   *
   * @protected
   * @param {TimelineMax} timeline The reference to the transition in timeline
   * @param {T} parent The reference to the parent instance
   * @param {string} id The id of the transition in timeline that should be initialized
   */
  protected abstract setupTransitionInTimeline(timeline: TimelineMax, parent: T, id: string): void;
  /**
   * This method is actually set's up the looping timeline. it should contain all
   * the animations that are required for looping.
   *
   * @protected
   * @param {TimelineMax} timeline The reference to the looping timeline
   * @param {T} parent The reference to the parent instance
   * @param {string} id The id of the looping animation that should be initialized
   */
  protected abstract setupLoopingAnimationTimeline(
    timeline: TimelineMax,
    parent: T,
    id: string,
  ): void;

  /**

   *
   * @protected
   */
  /**
   * Method that should be created based on your framework. It retrieves a
   * component based on a string, HTMLElement or the generic
   *
   * @param
   * @param {string | HTMLElement | T} component The reference to the component
   * @returns {T} The instance of the component that is requested
   */
  protected abstract getComponent(component: string | HTMLElement | T): T;

  /**
   * Method that finds the correct timeline instance on the provided parent controller.
   *
   * @private
   * @param {T} component This is the component instance that will will get the timeline for
   * @param {TransitionDirection} direction This is the direction of the timeline.
   * @param {boolean} reset This flag determines if we reset the existing timeline or re-create it from scratch
   * @param {boolean} id This is the id of the timeline that we are requesting
   * @returns {TimelineMax} This is the timeline instance that you requested
   */
  private getTimelineInstance(
    component: T,
    direction: TransitionDirection = TransitionDirection.IN,
    reset: boolean = false,
    id?: string,
  ): TimelineMax {
    const transitionController = <AbstractTransitionController<T>>component[
      this.options.transitionController
    ];

    let timeline;

    if (direction === TransitionDirection.OUT) {
      transitionController.setupTimeline(TimelineType.OUT, reset, id);
      timeline = transitionController.transitionOutTimeline;
    } else {
      timeline = transitionController.transitionInTimeline;
    }

    return timeline;
  }

  /**
   * This method creates the actual empty GSAP timelines.
   *
   * @private
   */
  private createTransitionTimelines(): void {
    this.transitionInTimeline = createTimeline({
      onStart: () => this.handleTransitionStart(TransitionDirection.IN),
      onComplete: () => this.handleTransitionComplete(TransitionDirection.IN),
      onReverseStart: () => this.handleTransitionStart(TransitionDirection.OUT),
      onReverseComplete: () => this.handleTransitionComplete(TransitionDirection.OUT),
    });
    this.transitionOutTimeline = createTimeline({
      onStart: () => this.handleTransitionStart(TransitionDirection.OUT),
      onComplete: () => this.handleTransitionComplete(TransitionDirection.OUT),
    });
    this.loopingAnimationTimeline = new TimelineMax({
      repeat: -1,
    });
  }

  /**
   * Method that is triggered when the transition starts. It dispatches the correct
   * event that is linked to the type of transition.
   *
   * @param {TransitionDirection} direction The direction of the timeline that is started
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
   * Method that is triggered when the transition completes. It dispatches the correct
   * event that is linked to the type of transition.
   *
   * @private
   * @param { string } direction The direction the transition was completed in.
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
   * Method that cleans all the timelines and strips out all the resolve methods.
   *
   * @private
   */
  private clean(): void {
    this.parentController = null;
    this.isHidden = null;

    if (this.transitionOutTimeline !== null) {
      killAndClearTimeline(this.transitionOutTimeline);
      this.transitionOutTimeline = null;
    }

    if (this.transitionInTimeline !== null) {
      killAndClearTimeline(this.transitionInTimeline);
      this.transitionInTimeline = null;
    }

    if (this.loopingAnimationTimeline) {
      killAndClearTimeline(this.loopingAnimationTimeline);
      this.loopingAnimationTimeline = null;
    }

    this.transitionOutResolveMethod = null;
    this.transitionInResolveMethod = null;

    this._transitionOutPromise = null;
    this.transitionInPromise = null;
  }

  /**
   * Because Vue destructs the VM instance before it removes the DOM node we want to finish the
   * transition out before actually cleaning everything
   *
   * @public
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
