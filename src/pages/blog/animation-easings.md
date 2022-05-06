---
title: better animation easings
description: |
  If you’re going to bother to animate something, don’t use the default easing for pete’s sake.
date: 2022-05-06
tags: ['dev']
layout: ../../layouts/post.astro
---

<style>
  .ball {
    border: 2px solid var(--gray-80);
    border-radius: 50%;
    content: "";
    display: block;
    height: 2rem;
    left: 0;
    opacity: 0.3;
    position: absolute;
    transform: translateX(-50%);
    top: 0;
    width: 2rem;
  }

  .ball:first-of-type,
  .ball:last-of-type,
  .ball:nth-of-type(4n + 1) {
    opacity: 1;
  }

  .ball:first-of-type::after,
  .ball:last-of-type::after,
  .ball:nth-of-type(4n + 1)::after {
    width: 2px;
  }

  .ball::after {
    background: var(--gray-80);
    content: "";
    display: block;
    height: 0.75rem;
    left: 50%;
    position: absolute;
    top: 3rem;
    transform: translateX(-50%);
    width: 1px;
  }

  .ball--solo::after {
    display: none;
  }

  .ball--invisible {
    border: none;
  }

  .ball-stop-count {
    font-family: Arial;
    font-size: 14px;
    left: 50%;
    position: absolute;
    transform: translateX(-50%);
    top: calc(100% + 2.5rem);
  }

  .ball-example {
    margin-left: -1rem;
    overflow: hidden;
    padding-left: 1rem;
    padding-right: 1rem;
    width: calc(100% + 2rem);
  }

  .ball-pit {
    height: 6rem;
    margin: 1.25em 1rem;
    position: relative;
    width: calc(100% - 4rem);
  }

  .ball-pit--zero {
    height: 0;
  }

  .gradient {
    display: flex;
    height: 1.5rem;
    margin-top: 1.5rem;
    margin-bottom: 1.5rem;
  }

  .gradient-stop {
    flex: 1;
  }

  .graph {
    border-bottom: 1px solid var(--gray-80);
    border-left: 1px solid var(--gray-80);
    display: block;
    height: auto;
    margin-left: auto;
    margin-right: auto;
    max-width: 200px;
    width: 100%;
  }

  .graph-figure {
    flex: 1;
    margin: 0;
    padding: 0;
  }

  .figure-group {
    background: var(--gray-15);
    display: flex;
    padding: 2.5rem;
  }

  .spinner {
    animation: rotate 1s infinite;
    height: 4rem;
    position: relative;
    width: 4rem;
  }

  .spinner--stutter {
    animation-timing-function: ease;
  }

  .spinner--linear {
    animation-timing-function: linear
  }

  .spinner::before {
    border: 0.5rem solid var(--gray-20);
    border-radius: 50%;
    content: "";
    display: block;
    height: 100%;
    left: 50%;
    position: absolute;
    top: 50%;
    transform: translate(-50%, -50%);
    width: 100%;
  }

  .spinner::after {
    background: var(--gray-80);
    border-radius: 50%;
    content: "";
    display: block;
    height: 0.5rem;
    left: 50%;
    position: absolute;
    top: 100%;
    width: 0.5rem;
  }

  .hover {
    border: 1px solid currentColor;
    border-radius: 0.5rem;
    cursor: pointer;
    font-family: Arial;
    font-size: 14px;
    padding: 0.5rem 2rem;
    position: relative;
  }

  .hover-tooltip {
    background: var(--gray-30);
    bottom: calc(100% + 1rem);
    border-radius: 0.25rem;
    box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.2);
    color: var(--gray-80);
    font-size: 14px;
    left: 50%;
    opacity: 0;
    padding: 0.5rem 1rem;
    pointer-events: none;
    position: absolute;
    transform: translate(-50%, 1.5rem);
  }

  .hover:hover .hover-tooltip {
    opacity: 1;
    transform: translate(-50%, 0);
  }

  .hover--ease-in .hover-tooltip {
    --ease-in-sine: cubic-bezier(0.55, 0, 1, 0.55);
    transition: opacity 300ms var(--ease-in-sine), transform 300ms var(--ease-in-sine);
  }

  .hover--ease-out .hover-tooltip {
    --ease-out-cubic: cubic-bezier(0.33, 1, 0.68, 1);
    transition: opacity 300ms var(--ease-out-cubic), transform 300ms var(--ease-out-cubic);
  }

  .draggable {
    height: 5rem;
    margin: 2rem 0;
    position: relative;
  }

  .draggable::before {
    background: var(--gray-20);
    border-radius: 1rem;
    content: "";
    display: block;
    height: 3px;
    top: 50%;
    margin-top: -1px;
    position: absolute;
    width: 100%;
    z-index: 1;
  }

  .draggable-handle {
    background: var(--gray-00);
    border: 2px solid var(--gray-80);
    border-radius: 50%;
    cursor: grab;
    height: 3rem;
    left: 50%;
    margin-left: -1.5rem;
    margin-top: -1.5rem;
    position: absolute;
    top: 50%;
    touch-action: none;
    width: 3rem;
    z-index: 10;
  }

  .draggable--easing .draggable-handle {
    transition: transform 200ms cubic-bezier(0.65, 0, 0.35, 1);
  }

  .draggable-handle::after {
    background: linear-gradient(90deg,transparent 2px,var(--gray-80) 2px,var(--gray-80) 4px,transparent 4px,transparent 7px,var(--gray-80) 7px,var(--gray-80) 9px,transparent 9px,transparent 12px,var(--gray-80) 12px,var(--gray-80) 14px, transparent 14px, transparent 18px);
    background-size: 100% 100%;
    background-repeat: repeat-y;
    border-radius: 50%;
    content: "";
    display: block;
    height: 1rem;
    left: 50%;
    margin-left: -0.5rem;
    margin-top: -0.5rem;
    position: absolute;
    top: 50%;
    width: 1rem;
  }

  body.is-dragging,
  body.is-dragging .draggable-handle {
    cursor: grabbing !important;
  }

  .switch {
    cursor: pointer;
    display: block;
    height: 2rem;
    overflow: hidden;
    position: relative;
    width: 100%;
  }

  .switch-input::before {
    background: var(--gray-10);
    border: 1px solid var(--gray-80);
    border-radius: 1rem;
    content: "";
    display: block;
    height: 1.5rem;
    left: 50%;
    transform: translateX(-50%);
    position: absolute;
    width: 3rem;
    z-index: 2;
  }

  .switch-input::after {
    background: var(--gray-80);
    border-radius: 1rem;
    content: "";
    display: block;
    height: 1.125rem;
    left: 50%;
    top: 4px;
    transform: translateX(-117%);
    position: absolute;
    width: 1.125rem;
    z-index: 3;
  }

  .switch-input {
    -webkit-appearance: none;
    appearance: none;
    cursor: pointer;
    left: 50%;
    position: absolute;
    transform: translateX(-50%);
  }

  .switch-input:checked::after {
    transform: translateX(22%);
  }

  .switch--easing .switch-input::after {
    transition: transform 300ms cubic-bezier(0.33, 1, 0.68, 1);
  }

  .switch--quick .switch-input::after {
    transition: transform 300ms cubic-bezier(0.88, 0.09, 0.66, -0.11);
  }

  .switch--resistance-none .switch-input::after {
    transition: transform 75ms linear;
  }

  .switch--resistance-sm .switch-input::after {
    transition: transform 75ms cubic-bezier(0.4, 0, 0.5, -0.1);
  }

  .switch--resistance-lg .switch-input::after {
    transition: transform 75ms cubic-bezier(1, 0.12, 1, -0.16);
  }

  @keyframes move-right {
    from {
      transform: translateX(0);
    }
    to {
      transform: translateX(100%);
    }
  }

  @keyframes rotate {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
</style>

You’ve doubtless used CSS [transition](https://developer.mozilla.org/en-US/docs/Web/CSS/transition) or [animation](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Animations/Using_CSS_animations) a million times by now:

```css
a {
  transition: color 100ms;
}
```

Or, if you’ve gotten _really_ fancy, perhaps you’ve specified an easing curve:

```css
a {
  transition: color 100ms ease-in-out;
}
```

But have you ever stopped to consider if it’s the _right_ easing curve? After all, every animation has _some_ curve; that’s just one way of representing the motion taking place. Although there’s no “right” or “wrong” easing curves for every situation, each scenario will strongly lend itself toward a particular animation type for the most responsive, fluid-feeling result.

## what is an easing curve?

The “bible of animation,” [The Animator’s Survival Kit](https://bookshop.org/books/the-animator-s-survival-kit-a-manual-of-methods-principles-and-formulas-for-classical-computer-games-stop-motion-and-internet-animators-expanded/9780865478978), illustrates the concept of easing well (as would be expected from Richard Williams). This section is a cheap imitation of the lessons there. I can’t recommend buying it enough as it teaches the fundamentals to animation in all forms, including web.

Think about animating a ball from left to right across the screen. And just for visualization, we’ll break the animation down into **24 frames** (or steps).

<div class="ball-example">
  <div class="ball-pit">
    <div class="ball" style="left:0%;">
      <div class="ball-stop-count">0</div>
    </div>
    <div class="ball" style="left:100%;">
      <div class="ball-stop-count">24</div>
    </div>
  </div>
</div>

Now, before continuing further, where would you imagine the ball would be for all the in-between frames? Let’s start with the most “logical” approach of diving the space perfectly evenly:

<div class="ball-example">
  <div class="ball-pit">
    {[...new Array(25)].map((_, n) => (
      <div class="ball" style={`left:${100/24 * n}%;`}>
        {(n == 0 || n == 12 || n == 24) && <div class="ball-stop-count">{n}</div>}
      </div>
    ))}
  </div>
</div>

If we animate that, we see a robotic-looking animation that changes direction instantly and without any loss to momentum:

<div class="ball-example">
  <div class="ball-pit ball-pit--zero" style="animation:move-right 2s linear infinite alternate;">
    <div class="ball ball--solo" style="left:0%;"></div>
  </div>
  <div class="ball-pit">
    {[...new Array(25)].map((_, n) => (
      <div class="ball ball--invisible" style={`left:${100/24 * n}%;`}>
        {(n == 0 || n == 12 || n == 24) && <div class="ball-stop-count">{n}</div>}
      </div>
    ))}
  </div>
</div>

If we took that motion and plotted it on an 𝑥/𝑦 graph, with 𝑥 representing time and 𝑦 representing distance, we’d get the following:

<svg class="graph" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" aria-label="graph showing linear line starting at (0, 0) and terminating at (1, 1)">
  <rect x="-0.5" y="-0.5" width="1" height="1"/>
  <rect x="-0.5" y="49.5" width="1" height="1"/>
  <rect x="-0.5" y="99.5" width="1" height="1"/>
  <rect x="-0.5" y="199.5" width="1" height="1"/>
  <rect x="49.5" width="1" height="1"/>
  <rect x="49.5" y="49.5" width="1" height="1"/>
  <rect x="49.5" y="99.5" width="1" height="1"/>
  <rect x="49.5" y="149.5" width="1" height="1"/>
  <rect x="49.5" y="199.5" width="1" height="1"/>
  <rect x="99.5" width="1" height="1"/>
  <rect x="99.5" y="49.5" width="1" height="1"/>
  <rect x="99.5" y="99.5" width="1" height="1"/>
  <rect x="99.5" y="149.5" width="1" height="1"/>
  <rect x="99.5" y="199.5" width="1" height="1"/>
  <rect x="149.5" width="1" height="1"/>
  <rect x="149.5" y="49.5" width="1" height="1"/>
  <rect x="149.5" y="99.5" width="1" height="1"/>
  <rect x="149.5" y="149.5" width="1" height="1"/>
  <rect x="149.5" y="199.5" width="1" height="1"/>
  <rect x="199.5" width="1" height="1"/>
  <rect x="199.5" y="49.5" width="1" height="1"/>
  <rect x="199.5" y="99.5" width="1" height="1"/>
  <rect x="199.5" y="149.5" width="1" height="1"/>
  <rect x="199.5" y="199.5" width="1" height="1"/>
  <rect y="149.5" width="1" height="1"/>
  <line stroke="var(--gray-80)" stroke-width="2" x1="0" y1="200" x2="200" y2="1"/>
</svg>

Straight as an arrow. Because we divided the space evenly, at 25% of the time, the ball has covered 25% of the distance. At 50% of the time, 50% distance has been travelled, and so on, up to 100%.

This 𝑥/𝑦 representation of the animation is an **easing curve**. This is the only instance an easing “curve” will lack the curvy bits, and this is why dividing time/space evenly is called a **linear curve** (i.e. straight curve). This is simply the easiest to understand; in the next example we’ll see the “curve” part of it.

Now let’s try and animate the ball where the ball starts from 0 velocity, and ramps all the way up to maximum velocity by the end it reaches the right side. That causes the frames to cluster closer together when moving slowly, and space farther apart when speeding up, like so:

<div class="ball-example">
  <div class="ball-pit">
    {[...new Array(25)].map((_, n) => (
      <div class="ball" style={`left:${(1 - Math.cos(Math.PI/2 * n/24)) * 100}%;`}>
        {(n == 0 || n == 12 || n == 24) && <div class="ball-stop-count">{n}</div>}
      </div>
    ))}
  </div>
</div>

That, animated, produces the following “bouncy” animation:

<div class="ball-example">
  <div class="ball-pit ball-pit--zero" style="animation:move-right 2s cubic-bezier(0.552284749831, 0, 1, 0.552284749831) infinite alternate;">
    <div class="ball ball--solo" style="left:0%;"></div>
  </div>
  <div class="ball-pit">
    {[...new Array(25)].map((_, n) => (
      <div class="ball ball--invisible" style={`left:${(1 - Math.cos(Math.PI/2 * n/24)) * 100}%;`}>
        {(n == 0 || n == 12 || n == 24) && <div class="ball-stop-count">{n}</div>}
      </div>
    ))}
  </div>
</div>

And when plotted on 𝑥/𝑦 produces a sharp curve that starts at zero acceleration, and keeps accelerating all the way through the animation, reaching maximum velocity on the final frame:

<svg class="graph" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" aria-label="graph showing a “cosine” curve">
  <rect x="-0.5" y="-0.5" width="1" height="1"/>
  <rect x="-0.5" y="49.5" width="1" height="1"/>
  <rect x="-0.5" y="99.5" width="1" height="1"/>
  <rect x="-0.5" y="199.5" width="1" height="1"/>
  <rect x="49.5" width="1" height="1"/>
  <rect x="49.5" y="49.5" width="1" height="1"/>
  <rect x="49.5" y="99.5" width="1" height="1"/>
  <rect x="49.5" y="149.5" width="1" height="1"/>
  <rect x="49.5" y="199.5" width="1" height="1"/>
  <rect x="99.5" width="1" height="1"/>
  <rect x="99.5" y="49.5" width="1" height="1"/>
  <rect x="99.5" y="99.5" width="1" height="1"/>
  <rect x="99.5" y="149.5" width="1" height="1"/>
  <rect x="99.5" y="199.5" width="1" height="1"/>
  <rect x="149.5" width="1" height="1"/>
  <rect x="149.5" y="49.5" width="1" height="1"/>
  <rect x="149.5" y="99.5" width="1" height="1"/>
  <rect x="149.5" y="149.5" width="1" height="1"/>
  <rect x="149.5" y="199.5" width="1" height="1"/>
  <rect x="199.5" width="1" height="1"/>
  <rect x="199.5" y="49.5" width="1" height="1"/>
  <rect x="199.5" y="99.5" width="1" height="1"/>
  <rect x="199.5" y="149.5" width="1" height="1"/>
  <rect x="199.5" y="199.5" width="1" height="1"/>
  <rect y="149.5" width="1" height="1"/>
  <path fill="none" stroke="var(--gray-80)" stroke-width="2" d="M0,200c110.01,0.5,200.65-90.75,200.5-199"/>
</svg>

This type of accelerating curve is called an **ease-in curve** for obvious reasons: it is slowest at the beginning (the “in”) of the animation. If it did the opposite—started at maximum velocity and decelerated down to zero—that would be called an **ease-out curve**.

If you combined the two, and had an animation where it started and ended at slow velocity, and reached maximum velocity in the middle, that’s an **ease-in-out curve.** Compare the graphs of the three:

  <div class="figure-group">
    <figure class="graph-figure">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
        <rect x="-0.5" y="-0.5" width="1" height="1"/>
        <rect x="-0.5" y="49.5" width="1" height="1"/>
        <rect x="-0.5" y="99.5" width="1" height="1"/>
        <rect x="-0.5" y="199.5" width="1" height="1"/>
        <rect x="49.5" width="1" height="1"/>
        <rect x="49.5" y="49.5" width="1" height="1"/>
        <rect x="49.5" y="99.5" width="1" height="1"/>
        <rect x="49.5" y="149.5" width="1" height="1"/>
        <rect x="49.5" y="199.5" width="1" height="1"/>
        <rect x="99.5" width="1" height="1"/>
        <rect x="99.5" y="49.5" width="1" height="1"/>
        <rect x="99.5" y="99.5" width="1" height="1"/>
        <rect x="99.5" y="149.5" width="1" height="1"/>
        <rect x="99.5" y="199.5" width="1" height="1"/>
        <rect x="149.5" width="1" height="1"/>
        <rect x="149.5" y="49.5" width="1" height="1"/>
        <rect x="149.5" y="99.5" width="1" height="1"/>
        <rect x="149.5" y="149.5" width="1" height="1"/>
        <rect x="149.5" y="199.5" width="1" height="1"/>
        <rect x="199.5" width="1" height="1"/>
        <rect x="199.5" y="49.5" width="1" height="1"/>
        <rect x="199.5" y="99.5" width="1" height="1"/>
        <rect x="199.5" y="149.5" width="1" height="1"/>
        <rect x="199.5" y="199.5" width="1" height="1"/>
        <rect y="149.5" width="1" height="1"/>
        <path fill="none" stroke="var(--gray-80)" stroke-width="2" d="M0,200c110.01,0.5,200.65-90.75,200.5-199"/>
      </svg>
      <figcaption>ease-in</figcaption>
    </figure>
    <figure class="graph-figure">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
        <rect x="-0.5" y="-0.5" width="1" height="1"/>
        <rect x="-0.5" y="49.5" width="1" height="1"/>
        <rect x="-0.5" y="99.5" width="1" height="1"/>
        <rect x="-0.5" y="199.5" width="1" height="1"/>
        <rect x="49.5" width="1" height="1"/>
        <rect x="49.5" y="49.5" width="1" height="1"/>
        <rect x="49.5" y="99.5" width="1" height="1"/>
        <rect x="49.5" y="149.5" width="1" height="1"/>
        <rect x="49.5" y="199.5" width="1" height="1"/>
        <rect x="99.5" width="1" height="1"/>
        <rect x="99.5" y="49.5" width="1" height="1"/>
        <rect x="99.5" y="99.5" width="1" height="1"/>
        <rect x="99.5" y="149.5" width="1" height="1"/>
        <rect x="99.5" y="199.5" width="1" height="1"/>
        <rect x="149.5" width="1" height="1"/>
        <rect x="149.5" y="49.5" width="1" height="1"/>
        <rect x="149.5" y="99.5" width="1" height="1"/>
        <rect x="149.5" y="149.5" width="1" height="1"/>
        <rect x="149.5" y="199.5" width="1" height="1"/>
        <rect x="199.5" width="1" height="1"/>
        <rect x="199.5" y="49.5" width="1" height="1"/>
        <rect x="199.5" y="99.5" width="1" height="1"/>
        <rect x="199.5" y="149.5" width="1" height="1"/>
        <rect x="199.5" y="199.5" width="1" height="1"/>
        <rect y="149.5" width="1" height="1"/>
        <path fill="none" stroke="var(--gray-80)" stroke-width="2" d="M0,200C1,91,92.7,0,200.5,1"/>
    </svg>
    <figcaption>ease-out</figcaption>
  </figure>
  <figure class="graph-figure">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
     <rect x="-0.5" y="-0.5" width="1" height="1"/>
     <rect x="-0.5" y="49.5" width="1" height="1"/>
     <rect x="-0.5" y="99.5" width="1" height="1"/>
     <rect x="-0.5" y="199.5" width="1" height="1"/>
     <rect x="49.5" width="1" height="1"/>
     <rect x="49.5" y="49.5" width="1" height="1"/>
     <rect x="49.5" y="99.5" width="1" height="1"/>
     <rect x="49.5" y="149.5" width="1" height="1"/>
     <rect x="49.5" y="199.5" width="1" height="1"/>
     <rect x="99.5" width="1" height="1"/>
     <rect x="99.5" y="49.5" width="1" height="1"/>
     <rect x="99.5" y="99.5" width="1" height="1"/>
     <rect x="99.5" y="149.5" width="1" height="1"/>
     <rect x="99.5" y="199.5" width="1" height="1"/>
     <rect x="149.5" width="1" height="1"/>
     <rect x="149.5" y="49.5" width="1" height="1"/>
     <rect x="149.5" y="99.5" width="1" height="1"/>
     <rect x="149.5" y="149.5" width="1" height="1"/>
     <rect x="149.5" y="199.5" width="1" height="1"/>
     <rect x="199.5" width="1" height="1"/>
     <rect x="199.5" y="49.5" width="1" height="1"/>
     <rect x="199.5" y="99.5" width="1" height="1"/>
     <rect x="199.5" y="149.5" width="1" height="1"/>
     <rect x="199.5" y="199.5" width="1" height="1"/>
     <rect y="149.5" width="1" height="1"/>
     <path fill="none" stroke="var(--gray-80)" stroke-width="2" d="M0,200C110.1,200,92.7,0,200.5,1"/>
    </svg>
    <figcaption>ease-in-out</figcaption>
  </figure>
</div>

All together, these compose the four major types of easing curves—**linear**, **ease-in**, **ease-out**, and **ease-in-out**. Most animations use one of these four curves.

Of course, we’ve only scratched the surface. The ease-\* curves may be tweaked slightly to provide more nuance to the motion ([example](https://easings.net/)). And there are more advanced curves that don’t fit into one of these categories (such as springs). But you now understand the “bread and butter” of animation curves from these four types alone.

So with that out of the way, here’s how to apply those in practice.

## 1. light, color, brightness, and opacity

When animating any properties of light (color, brightness, opacity), you’ll always want to use the **linear easing curve.**

```css
a {
  transition: color 100ms linear;
}
```

A linear curve will always produce the most consistent blends of color because that’s how color is already optimized to work. Compare a linear transition (top) to an ease-out transition (middle) to an ease-in transition (bottom):

<div class="gradient">
  {[...new Array(100)].map((_, n) => {
    let progress = n/99;
    let r = Math.round(255 - 255 * progress).toString(16);
    let g = Math.round(255 * progress).toString(16);
    let b = 'ff';
    if (r.length == 1) r = `0${r}`;
    if (g.length == 1) g = `0${g}`;
    if (b.length == 1) b = `0${b}`;
    return (
      <div class="gradient-stop" style={`background:#${r}${g}${b};`}></div>
    );
  })}
</div>

<div class="gradient">
  {[...new Array(100)].map((_, n) => {
    let progress = Math.sin(Math.PI/2 * n/99);
    let r = Math.round(255 - 255 * progress).toString(16);
    let g = Math.round(255 * progress).toString(16);
    let b = 'ff';
    if (r.length == 1) r = `0${r}`;
    if (g.length == 1) g = `0${g}`;
    if (b.length == 1) b = `0${b}`;
    return (
      <div class="gradient-stop" style={`background:#${r}${g}${b};`}></div>
    );
  })}
</div>

<div class="gradient">
  {[...new Array(100)].map((_, n) => {
    let progress = 1 - Math.cos(Math.PI/2 * n/99);
    let r = Math.round(255 - 255 * progress).toString(16);
    let g = Math.round(255 * progress).toString(16);
    let b = 'ff';
    if (r.length == 1) r = `0${r}`;
    if (g.length == 1) g = `0${g}`;
    if (b.length == 1) b = `0${b}`;
    return (
      <div class="gradient-stop" style={`background:#${r}${g}${b};`}></div>
    );
  })}
</div>

Non-linear curves may be desirable with motion, with color it usually results in awkward transitions. You can see how a linear transition (top), for the most part\*, blends color A and color B evenly. But when using ease-out (middle), the midpoint gets shifted too far left, and ease-in (bottom) shifts the midpoint too far right. So in most cases, a **linear curve** is the best option. Sure, there may be a _super-specific_ usecase where you want to apply an easing curve to a color transition. But that will only ever work with a very specific curve and a very specific color transition—change one, and you must change the other (it will never be generally-applicable).

_\*If you think linear transitions don’t transition smoothly, congratulations! 🎉 You’ve [found a rabbit hole into color theory](https://observablehq.com/@sebastien/srgb-rgb-gamma). Good luck; have fun. But for your own sanity, just pretend that linear transitions are the smoothest among “dumb” non-color-aware easing curves. And pretend linear curves are good enough for animating (which, IMHO, they are)._

The example above shows transitioning between 2 saturated colors, but the exact same thing happens with brightness and opacity, too (same as before—linear, ease-out, ease-in in that order):

<div class="gradient">
  {[...new Array(100)].map((_, n) => {
    let progress = n/99;
    let r = Math.round(255 * progress).toString(16);
    let g = Math.round(255 * progress).toString(16);
    let b = Math.round(255 * progress).toString(16);
    if (r.length == 1) r = `0${r}`;
    if (g.length == 1) g = `0${g}`;
    if (b.length == 1) b = `0${b}`;
    return (
      <div class="gradient-stop" style={`background:#${r}${g}${b};`}></div>
    );
  })}
</div>

<div class="gradient">
  {[...new Array(100)].map((_, n) => {
    let progress = Math.sin(Math.PI/2 * n/99);
    let r = Math.round(255 * progress).toString(16);
    let g = Math.round(255 * progress).toString(16);
    let b = Math.round(255 * progress).toString(16);
    if (r.length == 1) r = `0${r}`;
    if (g.length == 1) g = `0${g}`;
    if (b.length == 1) b = `0${b}`;
    return (
      <div class="gradient-stop" style={`background:#${r}${g}${b};`}></div>
    );
  })}
</div>

<div class="gradient">
  {[...new Array(100)].map((_, n) => {
    let progress = 1 - Math.cos(Math.PI/2 * n/99);
    let r = Math.round(255 * progress).toString(16);
    let g = Math.round(255 * progress).toString(16);
    let b = Math.round(255 * progress).toString(16);
    if (r.length == 1) r = `0${r}`;
    if (g.length == 1) g = `0${g}`;
    if (b.length == 1) b = `0${b}`;
    return (
      <div class="gradient-stop" style={`background:#${r}${g}${b};`}></div>
    );
  })}
</div>

So for transitions of light (color / brightness / opacity) use a **linear curve**.

## 2. rotation

Rotation is another good general application for a **linear curve**, though there will be more exceptions here than among light transitions.

The chief offender I see is “stuttering spinners” (left) that are far more common than they should be:

<div class="figure-group">
  <figure style="align-items:center;display:flex;flex-direction:column;justify-content:center;width:50%">
    <div class="spinner spinner--stutter"></div>
    <figcaption>Default <code>ease</code></figcaption>
  </figure>
  <figure style="align-items:center;display:flex;flex-direction:column;justify-content:center;width:50%">
    <div class="spinner spinner--linear"></div>
    <figcaption>Linear curve</figcaption>
  </figure>
</div>

As you can see, the right linear animation is less distracting and moves more consistently. The poor excuse for a spinner on the left, bumping along almost like a flat tire, is what you get with the brower-default `ease` curve. Inspecting the code you’ll find the fix is as simple as a single CSS property:

```diff
 .spinner--stutter {
+  animation-timing-function: linear;
 }
```

_Note: [transition-timing-function](https://developer.mozilla.org/en-US/docs/Web/CSS/transition-timing-function) is the equivalent property for CSS transitions you may be looking for_

Rotation is a bit more nuanced than light, so a linear curve isn’t an “always” rule here (a good example is [Material Design’s progress indicator](https://material.io/components/progress-indicators#circular-progress-indicators), which is a multi-layered animation unifying several curves, but if you look closely, a linear rotation underpins the whole thing). But I’d still recommend **starting with a linear curve for rotation** and changing it if it’s not quite right.

## 3. interaction

Interactive elements is a broad category of animations, consisting of everything clickable, hoverable, draggable, etc. But despite its generality, here are 3 common mistakes that, if avoided, will probably take care of most animation issues in your UI:

### mistake 1: sluggish interactions

Humans think of an interaction as “instant” (i.e. _not slow_) if it happens within ~100ms ([source](https://www.nngroup.com/articles/response-times-3-important-limits/)). While [animation speed is important](https://material.io/design/motion/speed.html#controlling-speed), we’ll focus on the easing curve. Compare the two examples of hover, with one using **ease-in** and the other using **ease-out**. Which feels more “instant”?

<div class="figure-group">
  <figure style="align-items:center;display:flex;flex-direction:column;justify-content:center;width:50%">
    <div class="hover hover--ease-in">
      Hover me
      <div class="hover-tooltip">Hovered!</div>
    </div>
    <figcaption>ease in</figcaption>
  </figure>
  <figure style="align-items:center;display:flex;flex-direction:column;justify-content:center;width:50%">
    <div class="hover hover--ease-out">
      Hover me
      <div class="hover-tooltip">Hovered!</div>
    </div>
    <figcaption>ease out</figcaption>
  </figure>
</div>

It may be hard to believe, but the two animations above are identical other than the easing curve (inspect if you don’t believe me)! Both animations have the same duration, and neither have a delayed start. But you can see for yourself what a difference the curve makes in the interactive feel!

As a general rule, **ease-out curves are better for interactions because they respond quicker.** The user is able to notice the change more easily because most of the movement happens up-front (scroll back to the ease-out curve earlier in the article as proof).

And as it goes with any rule of thumb, this rule can be broken, sure, and there are dozens of scenarios where ease-in or ease-in-out make a better animation. But starting with an ease-out curve for interactions will feel “right” most of the time.

### mistake 2: easing drag events

Drag events should track 1:1 with the user’s mouse or touch input. Once you start animating _everything_, it’s easy to fall into the trap adding easing curves for things that shouldn’t be animated at all. Dragging is the chief offender.

Compare a draggable control with easing (above) vs. no easing (below):

<div class="draggable draggable--easing" data-drag>
  <div class="draggable-handle"></div>
</div>

<div class="draggable" data-drag>
  <div class="draggable-handle"></div>
</div>

<script>
  let dragEl = undefined;

  document.querySelectorAll('[data-drag]').forEach((el) => {
    el.addEventListener('mousedown', startDrag);
    document.addEventListener('mouseup', endDrag);
    document.addEventListener('mousemove', addDrag);
    el.addEventListener('touchstart', startDrag);
    document.addEventListener('touchend', endDrag);
    document.addEventListener('touchmove', addDrag);
  });

  function startDrag(evt) {
    if (!evt.target) return;
    document.body.classList.add('is-dragging');
    dragEl = evt.target.closest('[data-drag]');
  }

  function endDrag(evt) {
    document.body.classList.remove('is-dragging');
    dragEl = undefined;
  }

  function addDrag(evt) {
    if (!dragEl) return;

    const clientX = evt.touches ? evt.touches[0].clientX : evt.clientX;

    const { left, width, right } = dragEl.getBoundingClientRect();
    const centerX = left + width/2;
    const handle = dragEl.querySelector('.draggable-handle');

    const deltaX = Math.min(Math.max(clientX, left), right) - centerX;
    handle.style.transform = `translateX(${deltaX}px)`;
  }
</script>

Animating _everything_ isn’t always “delightful,” especially when they stand in the way of more direct feedback. So reserve easings for the interactions that truly benefit from them.

### 3. not matching real-world motion

Using **ease-out** as a default easing will be best _most_ of the time, but when is it not? If a component acts as a metaphor for a real-world item, that should cascade to animations, too.

A switch is a common example of this. Think about any light switch or device switch you’ve ever pressed. Of the two, which feels like it “clicks” like a switch would?

<div class="figure-group">
  <figure style="align-items:center;display:flex;flex-direction:column;justify-content:flex-start;width:50%">
    <label for="switch-01" class="switch switch--easing">
      <input type="checkbox" class="switch-input" id="switch-01">
    </label>
    <figcaption>smooth ease-out curve</figcaption>
  </figure>
  <figure style="align-items:center;display:flex;flex-direction:column;justify-content:flex-start;width:50%">
    <label for="switch-02" class="switch switch--quick">
      <input type="checkbox" class="switch-input" id="switch-02">
    </label>
    <figcaption>spring-loaded ease-in curve</figcaption>
  </figure>
</div>

The right behaves more like the real-world switch it represents—there’s a bit of resistance up front as you overcome the resistance of the internal spring, then the potential energy releases and the switch _snaps_ into its final resting position. You can almost “hear” the 2nd switch click into place! Once again, the duration of both switches are identical and the easing curve is responsible for the noticeable difference in feel.

However, by adding resistance up-front (ease-in), we’re also fighting against one of our earlier principles—showing more movement up front so the interaction doesn’t feel “laggy” or delayed. So we’ll toy with the precise easing curve as well as timing to get that balance right between real-world metaphor vs responsive UI.

<div class="figure-group">
  <figure style="align-items:center;display:flex;flex-direction:column;justify-content:flex-start;text-align:center;width:33.3333%">
    <label for="switch-04" class="switch switch--resistance-none">
      <input type="checkbox" class="switch-input" id="switch-04">
    </label>
    <figcaption>no resistance<br/>(linear)</figcaption>
  </figure>
  <figure style="align-items:center;display:flex;flex-direction:column;justify-content:flex-start;text-align:center;width:33.3333%">
    <label for="switch-05" class="switch switch--resistance-sm">
      <input type="checkbox" class="switch-input" id="switch-05">
    </label>
    <figcaption>some resistance<br/>(sharp ease-in)</figcaption>
  </figure>
  <figure style="align-items:center;display:flex;flex-direction:column;justify-content:flex-start;text-align:center;width:33.3333%">
    <label for="switch-06" class="switch switch--resistance-lg">
      <input type="checkbox" class="switch-input" id="switch-06">
    </label>
    <figcaption>too much resistance?<br/>(very sharp ease-in)</figcaption>
  </figure>
</div>

We’re now in the realm of subjective opinion where you, the implementer, have freedom to explore the nuances of movement and do what you feel is right. But no matter what you decide, you’re now animating things in a much more thoughtful (and realism-inspired) way.

### general recommendation

Again, since interactions are complex and very situational, it’s hard to develop blanket rules. But hopefully these 3 mistakes get you thinking about how to reason through what works and what doesn’t in animating each scenario. But when in doubt, defaulting to **ease-out** will be right for _most_ interactions. Change it if needed (especially if a real-world parallel behaves differently), and never forget that **no easing** is always an option (as in the dragging example).

## summary

Now that you’ve been made aware of the quick wins, you can apply the following today for a much-improved user experience:

- **light**: use linear easing
- **rotation**: start with linear easing by default, but adjust to taste
- **interactions**: start with ease-out by default, but adjust to taste, and also consider no easing as an option

But there are many more challenges beyond this! And there are more niche, contextual situations to encounter where easing may be more complex. For example, think back to the dragging example above. What if the handle needed to reset back to center after dragging (like a joystick)? You’d need to remove the easing curve while dragging, but re-apply it as it “slid” back to center position. Keep an eye out for multi-layered easings where one component may require different animations for different states.

In respect of that, some more nuanced, universal approaches to animation easings would be:

- easings help the human brain notice a change (e.g. an object animating across a screen will be better perceived than “teleporting” in one frame). use them to improve recognition of an action
- more movement & change up-front also help with this recognition (ease-out)
- make animations mimic the real world (e.g. all objects have momentum while moving and accelerate/decelerate appropriately; switches “flick” on-and-off and don’t smoothly glide, etc.)

Play around with your newfound skills and you’ll be making more sophisticated animations in no time. However, you’re also now cursed with noticing bad animation everywhere you look, so good luck with that, too.

![Hayao Mizazaki: “Anime was a mistake. It’s nothing but trash”](/assets/posts/easing-curves/miyazaki.gif)

### more reading / resources

- [Material Design’s approach to easing](https://material.io/design/motion/speed.html#easing)
- [Using Chrome’s built-in cubic-bezier editor](https://rempixels.blogspot.com/2015/04/cubic-bezier-chrome-devtools.html)
- [easings.net: easing functions cheat sheet](https://easings.net)
