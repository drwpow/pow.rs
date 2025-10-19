---
title: 3 Layers of UI Interaction
description: Every interactive UI element should consider all 3 layers; do yours?
pubDate: 2024-05-15
categories: ['design', 'dev']
---

It’s no surprise, dear reader, that most web interactions are lacking, and few interfaces have the [level of polish](https://matthewstrom.com/writing/the-polish-paradox/) they should. Part of that polish comes from being mindful of what I’ll refer to as <i>“The 3 Layers of UI Interaction:”</i>

1. **Render area**: where does this element appear?
2. **Hit area**: what is the shape/size/placement of the invisible interactive area?
3. **Focus area**: when <kbd>Tab</kbd>-ing, what is the focus ring shape/placement?

We’ll skip over the first layer—render area—because it’s a given (if it exists, it’s “rendered”). While there are deeper nuances like [affordances](https://lea.verou.me/blog/2023/minimalist-affordances/), that’s beyond the scope of this post. We only call out the first layer to point out that there are additional layers _beyond_ this one.

It’s only once you realize the 2 other layers exist and are distinct from the first that you’ll create UI so fluid and smooth it might as well [be invisible to the user](https://matthewstrom.com/writing/the-polish-paradox/). We can explore how all 3 layers diverge—and require separate decisions—in one simple example: <b>a dialog “close” button</b>.

<figure>
  <svg role="img" aria-label="A close button of a dialog, zoomed in" viewBox="0 0 400 200" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="400" height="200" fill="black"/><path d="M0 39H332C348.569 39 362 52.4315 362 69V200H0V39Z" fill="white" fill-opacity="0.25"/><path d="M261 142L309 94" stroke="white" stroke-width="4"/><path d="M261 94L309 142" stroke="white" stroke-width="4"/></svg>
</figure>

Nothing you haven’t seen before. But before we get further, ask yourself: <i>“How would I code this? What pixels count as part of the close button (and conversely, which pixels _don’t_)? What does the focus ring look like?”</i> In fact, this may be something you’ve built dozens of times without being aware of some of the decisions you _could_ make.

In practice, you’ve probably seen (or even built) naïve implementations such as…

## “Baby’s first button”

<figure>
  <svg role="img" aria-label="Same close button, but the “hit area” is as small as it can be (exact same size as the close icon)" viewBox="0 0 800 200" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="800" height="200" fill="black"/><path d="M0 39H332C348.569 39 362 52.4315 362 69V200H0V39Z" fill="white" fill-opacity="0.25"/><path d="M400 39H732C748.569 39 762 52.4315 762 69V200H400V39Z" fill="white" fill-opacity="0.25"/><rect x="659" y="91" width="52" height="52" stroke="#4A7CFF" fill="none" stroke-width="8"/><path d="M261 141L309 93" stroke="white" stroke-width="4"/><path d="M261 93L309 141" stroke="white" stroke-width="4"/><rect x="261" y="93" width="48" height="48" fill="#FF004D" fill-opacity="0.35" stroke="#FF004D" stroke-width="4"/><path d="M661 141L709 93" stroke="white" stroke-width="4"/><path d="M661 93L709 141" stroke="white" stroke-width="4"/></svg>
  <figcaption>The hit area (red) is too small! Making it the exact size and placement as the close icon gives the user little forgiveness in accuracy (which is an <a href="https://www.w3.org/WAI/WCAG21/Understanding/target-size.html" target="_blank" rel="noreferrer">accessibility concern</a>). If a user clicks in the corner above the close icon, nothing happens, which is almost certainly frustrating. The visible focus ring is <em>there</em>, but it’s pretty pathetic, and could be improved.</figcaption>
</figure>

This implementation flattens all 3 layers together, resulting in a frustrating user experience. This is a common trap that probably every frontend dev has fallen into at the start of their career (often because the rendering part proved such a challenge there’s no time or mental energy left for the deeper interactions).

## “The ableist”

<figure>
  <svg role="img" aria-label="The “hit area” and focus ring now reach into the corner, but may be too large" width="800" height="200" viewBox="0 0 800 200" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="800" height="200" fill="black"/><path d="M0 39H332C348.569 39 362 52.4315 362 69V200H0V39Z" fill="white" fill-opacity="0.25"/><path d="M400 39H732C748.569 39 762 52.4315 762 69V200H400V39Z" fill="white" fill-opacity="0.25"/><rect x="608" y="40" width="154" height="154" stroke="#4A7CFF" fill="none" stroke-width="8"/><path d="M261 141L309 93" stroke="white" stroke-width="4"/><path d="M261 93L309 141" stroke="white" stroke-width="4"/><rect x="208" y="40" width="154" height="154" fill="#FF004D" fill-opacity="0.35" stroke="#FF004D" stroke-width="4"/><path d="M661 141L709 93" stroke="white" stroke-width="4"/><path d="M661 93L709 141" stroke="white" stroke-width="4"/></svg>
  <figcaption>The hit area is much better, with corner clicks now triggering the expected action. But the focus ring is an afterthought (assuming it hasn’t been disabled outright) because it’s not as closely-scoped to the shape it’s meant to be highlighting.</figcaption>
</figure>

This second implementation correctly separates Layer 1 (rendering) from 2 (hit area), resulting in a pleasant interaction for mouse & touchscreen users. But it falls short of the ideal solution because it forgets about keyboard users that need Layer 3: focus area.

## Solution

<figure>
  <img src="/assets/posts/3-layers-of-ui-interaction/rocketman.jpg" alt="Screencap of the 1997 movie RocketMan starring Harland Williams" />
  <figcaption>“We’ll enter in the same calculations using what we like to call ‘The Right Way’” (RocketMan)</figcaption>
</figure>

While both of the previous implementations are functioning (barely), they’re not _ideal_, which is what we’re after. The best solution is a bit more complex:

<figure><svg role="img" aria-label="The “hit area” splits the difference where it extends out from the visible close icon by a generous amount of padding on all sides, but since the corner is further away it asymmetrically extends all the way to the edge. The visible focus ring is a circle and is smaller than the hit area." viewBox="0 0 800 200" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="800" height="200" fill="black"/><path d="M0 39H332C348.569 39 362 52.4315 362 69V200H0V39Z" fill="white" fill-opacity="0.25"/><path d="M400 39H732C748.569 39 762 52.4315 762 69V200H400V39Z" fill="white" fill-opacity="0.25"/><rect x="636" y="68" width="98" height="98" rx="49" fill="none" stroke="#4A7CFF" stroke-width="8"/><path d="M261 141L309 93" stroke="white" stroke-width="4"/><path d="M261 93L309 141" stroke="white" stroke-width="4"/><rect x="226" y="40" width="136" height="136" fill="#FF004D" fill-opacity="0.35" stroke="#FF004D" stroke-width="4"/><path d="M661 141L709 93" stroke="white" stroke-width="4"/><path d="M661 93L709 141" stroke="white" stroke-width="4"/><path d="M227 62H340V175" fill="none" stroke="#FF004D" stroke-width="4" stroke-dasharray="12 12"/></svg><figcaption>

The ideal solution involves <a href="https://www.w3.org/WAI/WCAG21/Understanding/target-size.html" target="_blank" rel="noreferrer">the correct hit area</a> around the close icon (shown as a dashed red line). We don’t want it to be _too_ large so it doesn’t overlap text content a user may want to highlight. But we also want to prevent dead space, so we asymmetrically extend the hit area into the corner because we can assume any interaction there is an intent to close.

The focus ring being a tighter circle around the icon shows this interaction got equal time and consideration as the others, and shows keyboard users you care about them (note the circle shape is a design choice that doesn’t matter, but the attention to detail here does).

</figcaption></figure>

This is particularly annoying to code, because it _will_ involve lots of tweaks to align everything properly:

```css
.close-btn {
  /* settings (adjust all to taste) */
  --icon-size: 1rem;
  --hit-area-ratio: 2;
  --hit-area-offset: 0.25;
  --focus-ring-ratio: 0.125;

  /* rendering: align icon to corner */
  display: flex;
  align-items: flex-end;
  justify-content: flex-start;
  position: absolute;
  right: 0;
  top: 0;

  /* hit area: oversize the interactive area (and offset the icon within) */
  height: calc(var(--hit-area-ratio) * var(--icon-size));
  padding-bottom: calc(var(--hit-area-offset) * var(--icon-size));
  padding-left: calc(var(--hit-area-offset) * var(--icon-size));
  width: calc(var(--hit-area-ratio) * var(--icon-size));

  /* focus ring: position & alignment */
  outline: none;

  &::after {
    border-radius: 50%;
    bottom: calc(var(--hit-area-offset) * var(--icon-size) + var(--icon-size));
    content: '';
    left: calc(var(--hit-area-offset) * var(--icon-size) + var(--icon-size));
    outline: 2px solid blue;
    opacity: 0;
    pointer-events: none;
    position: absolute;
    transform: translate3d(-50%, 50%, 0);
  }

  /* focus ring: visible on focus */
  &:focus-visible::after {
    opacity: 1;
  }
}
```

_Note: this is valid CSS now because [CSS nesting is now widely available](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_nesting)!_

And of course, this extra work in execution is exactly the reason why most things lack this level of polish: _time_. But once you start considering how a UI element’s interactive properties (hit area + focus area) can be separated from its basic rendering, you begin to unlock new levels of perfection in UI interactions, better accessibility, and new levels of delight.

## Further Reading

While this approach has been in my work for years, it didn’t occur to me to write it down until I read Matthew Ström’s post [The polish paradox: the more you polish, the less you see](https://matthewstrom.com/writing/the-polish-paradox/). While Matthew’s post is less pragmatic and more a general overview, it’s a fantastic, evergreen summary of the overarching principles of UI interaction I’ll be referring to and linking to for years. It’s a perfect example about the highest levels of thoughtful interactions that many people new to frontend don’t even realize happen even in websites they frequent weekly (with my favorite example being Amazon’s hover menu tunnel which is mentioned in the post).
