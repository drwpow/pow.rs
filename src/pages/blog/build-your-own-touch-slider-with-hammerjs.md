---
title: build your own touch slider with hammer.js
description: high-performance touch events for demanding jobs
date: 2016-04-25
tags: ['dev']
layout: ../../layouts/post.astro
---

There are countless pre-built libraries for sliders, carousels, and everything in-between, and it
seems like a major one comes out every other year or so. While most of those work fine in a vacuum,
your choices quickly narrow when you need to add part or a whole slider in the middle of an existing
mobile app without invasive JavaScript, CSS, and bloated markup. In these scenarios,
[HammerJS](http://hammerjs.github.io/) comes to the rescue by making it easier and more
time-effective to build one from scratch than you may have thought.

## Real-world Example

<figure><img src="https://miro.medium.com/max/60/0*WcPkZD1dANWCRuDv.jpg?q=20"><figcaption>Mobile interface for Real Thread: a deceptive amount of JavaScript</figcaption></figure>

I ran into this problem developing [Real Thread](https://www.realthread.com/)’s mobile interface.
Within that box where the shirt image sits, you’ll find:

- Angular code that swaps background images out with the shirt color you’ve selected
- A file uploader handled by [DropzoneJS](http://www.dropzonejs.com/)
- Touch events that allow you to move, pinch–scale, and delete the artwork you’ve uploaded

The designs called for a way to swipe left and right between the front and the back of the shirt —
in other words: _a slider_. But with everything else going on in this markup, this isn’t a typical
use case for the normal slider libraries meant for marketing pages. So for my own sanity — and to
keep the app running lean — I made my own with only a little bit of vanilla JavaScript and HammerJS.

## Is HammerJS right for me?

HammerJS is a 7kb multi-touch library that mimics vanilla JavaScript mouse and touch events. You
still get the expected stuff like `clientX` and `clientY` to track current position, but you get
access to new events like `swipe`, `pinch`, and `rotate`, along with new properties like `deltaX`,
`deltaY`, `distance`, `direction`, `rotation`, and `scale`, to name a few.

Before I waste any more of your time, ask yourself: _which sounds more like me?_

1. **I want to copy &amp; paste stuff and just have it work.** Sorry; HammerJS is only a minimal
   event library and has nothing to do with the DOM. You’ll have to write some JavaScript to make it
   work, or find a slider that works out-of-box.
1. **I need to incorporate touch or gestures into my app, but it’s a weird interaction and I’m
   thinking about just writing it from scratch.** HammerJS may be what you need — it not only
   provides a versatile set of events and event properties, but also allows you to register custom
   touch events as well. Anyone with basic JavaScript experience can pick it up because it behaves
   like a normal event callback.

Check out their [examples](http://hammerjs.github.io/examples/) to play around with it.

## The Markup

<figure><img src="https://miro.medium.com/max/60/0*6MHUaE0Nim9R56oz.png?q=20"></figure>

It’s a basic requirement of sliders to actually _slide_ (i.e., not be stacked layers that simply
fade opacity). The easiest way to accomplish this is to have one container that is as wide as all
the slides, side-by-side (`.slider`), within a container that crops everything to `width: 100%`
(`.has-slider`) so no scrolling happens. The markup should be something similar to:

```html
<div class="has-slider">
  <div class="slider">
    <div class="slider-panel"></div>
    <div class="slider-panel"></div>
    <div class="slider-panel"></div>
  </div>
</div>
```

And the important CSS looks like (Sass notation):

```sass
.has-slider
  overflow: hidden
  width: 100%
.slider
  width: 300% // 100% * 3 slides
```

Since
[CSS transforms](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Transforms/Using_CSS_transforms)
are our most performant way to move something around the page, we’ll take advantage of
`transform: translateX()` to do the heavy lifting for us. Since `.slider` is the entire width of all
3 slides (`300%`), we’ll apply `translateX()` to that container with JavaScript to move the proper
`.slider-panel` we want to show within the viewport.

Of course we’ll need more CSS than this to style it properly, but I’ll skip explaining the rest of
it. Now we need is a little bit of JavaScript to get it working.

## Working with Hammer

I prefer working with [managers](http://hammerjs.github.io/api/#hammer-manager). Compared to the
standalone `new Hammer()` syntax, managers give you the flexibility of tying multiple events
together (such as `pinch` and `pan`) on the same element. For example, if you wanted to recreate the
pinch + rotate gesture in the latest iOS Photos app, you could do that in HammerJS using a manager.
Managers don’t have any advantages if you’re only listening for one event (like in our example), but
I do this by default because it allows me to track additional events later if I need to without
rearranging my code.

### Step 1: Adding the listener

If we add the following code to our project:

<script src="https://gist.github.com/drwpow/61e4f6f63aad1c64b6ef18bed0d44218.js"></script>

We don’t have a working slider yet, but in your console you’ll get an object with lots of useful
things like `deltaX`, `deltaY`, `rotation`, `scale`, etc. One way to visualize that output is like
this:

<iframe src="https://cdn.embedly.com/widgets/media.html?src=https%3A%2F%2Fcodepen.io%2Fdangodev%2Fembed%2Fpreview%2FMyBGav%3Fheight%3D600%26amp%3Bslug-hash%3DMyBGav%26amp%3Bdefault-tabs%3Djs%2Cresult%26amp%3Bhost%3Dhttp%253A%252F%252Fcodepen.io%26amp%3Bembed-version%3D2&amp;url=https%3A%2F%2Fcodepen.io%2Fdangodev%2Fpen%2FMyBGav%2F&amp;image=https%3A%2F%2Fs3-us-west-2.amazonaws.com%2Fi.cdpn.io%2F40288.MyBGav.small.359afcbf-8977-467d-b8ab-8a5fc686ac64.png&amp;key=d04bfffea46d4aeda930ec88cc64b87c&amp;type=text%2Fhtml&amp;schema=codepen" allowfullscreen="" title="Touch Slider (Part 1)" class="t u v jx aj" scrolling="auto" width="800" height="600" frameborder="0"></iframe>

Since we’re building a horizontal slider, `deltaX` will be the most useful. This tracks the net
horizontal distance between where the gesture started and where the last registered touch event was.
To illustrate how handy this is, let’s compare what we’d have to do without HammerJS:

**Without HammerJS**

1. Set up different event listeners for `touchstart`, `touchmove`, `touchend`, and `touchcancel`
1. Store the values for the initial `clientX` and `clientY` for the first pointer in `touchstart` in
   a variable outside the scope of your event listeners
1. Every `touchmove` event, calculate the stored values minus the current `clientX` and `clientY` to
   get the net distance
1. Find a workaround for IE &amp; Edge (OSX Safari and Firefox don’t support it either, but
   effectively none of your users will need touch support for those browsers)

**With HammerJS**

1. Make one `pan` event listener
1. Net distance already done for you with `deltaX` and `deltaY`

It’s your choice, but I’m sticking with HammerJS.

### Step 2: Applying the transform

Pressing forward, let’s apply a CSS transform to our element (and save it in a variable so we don’t
repeat ourselves #DRYlife):

<script src="https://gist.github.com/drwpow/fca03dbd26c95a1123783817b7072cda.js"></script>

<iframe scrolling="no" id="player" src="https://codepen.io/dangodev/embed/preview/jqpxaL?default-tabs=html" allowfullscreen="true" frameborder="0"></iframe>

Now we have the slider moving 1:1 with our finger, but it’s not “snapping” into place yet, and it
seems to always be stuck on the first slide. But we’re getting there, and it only took us 7 lines of
JavaScript!

### Step 3: Keeping track of which slide we’re on

Things will get a little more complicated here, but this is the last major addition. Let’s add an
`activeSlide` variable to keep track of which slide we’re on, and then have it snap into place when
we’re done with the event with a new function:

<script src="https://gist.github.com/drwpow/f5b05f46399182383a16ff9207dbfbc4.js"></script>

<iframe scrolling="no" id="player" src="https://codepen.io/dangodev/embed/preview/NNBMyj?default-tabs=js" allowfullscreen="true" frameborder="0"></iframe>

Now this changes slides on release, but it has 2 key problems: it jumps between slides rather than
animating smoothly, and it’s also too sensitive — it changes slides if you drag it even `1` pixel in
either direction.

## Wrapping Up

The only things remaining for this to be a full-fledged slider are adding pagination, and applying a
CSS transition at just the right time to animate smoothly when snapping to a slide. The reason you
**don’t** want to have a transition applied all the time is this will really make your touch events
feel sluggish when dragging:

<iframe scrolling="no" id="player" src="https://codepen.io/dangodev/embed/preview/PNBeez?amp%3Bdefault-tabs=js" allowfullscreen="true" frameborder="0"></iframe>

Instead, we’ll stick the transition on an `.is-animating` state class in our CSS rather than
`.slider`. And we’ll let JavaScript add and remove the class at the appropriate times (i.e., only
between touch events). The final result, with pagination, looks like this:

<iframe scrolling="no" id="player" src="https://codepen.io/dangodev/embed/preview/bpjrRg?amp%3Bdefault-tabs=js" allowfullscreen="true" frameborder="0"></iframe>

If you inspect the JS for this last CodePen, it’s a little more object-oriented but is still the
same code we’ve been working with all along. The only thing remaining would be to add a “flick”
listener to the slider, in case a user swiped their finger quickly. `velocityX` helps us out here.
This can be added by modifying the `.isFinal` conditional since we only want to register a flick at
the end of a gesture:

This is all merely proof of concept, and needs refactoring to fit into your setup. But anyways,
there you have it: a fairly decent slider that doesn’t get in the way of your application.
