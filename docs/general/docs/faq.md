# FAQ
A small collection of common questions, if you cannot find your answer here feel free to create a ticket on GitHub!

### Why javascript over css animations?
Compared to css animations GSAP offers a lot more features that will make your life a whole lot easier. To see more details check out a blog post they did on CSS Animations vs. GSAP.

### I’ve added my transition-contoller but it does not transition in?
Did you call transitionIn on your instance? Transition controllers do not start automatically.

### I’m trying to nest a timeline with a from but it throws an error, what do I do?
When timelines are nested you are forced to use a fromTo animation this is because timelines have to be cloned to be able to nest them within other timelines and still be able to use them separately.

### I’m calling getTimeline in the setupTransitionOutTimeline but the transitionInTimeline is added, how can I add the transitionOutTimeline?
The default direction for the getTimeline method is IN if you want to retrieve an out timeline you will have to define it as a second argument

### I’m using a from in my transition out timeline but it fails, wha do I do?
Transition out timelines require a to animation because the end state of the component can change after the timeline is created to make sure your out animation does not jump you only define the out state!
