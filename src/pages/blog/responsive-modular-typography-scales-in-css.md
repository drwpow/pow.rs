---
title: responsive modular typography scales in css
description: a time-saving type system with little config and lots of flexibility
date: 2017-06-14
tags: ['design']
layout: ../../layouts/post.astro
---

<figure><img src="https://miro.medium.com/max/2000/1*x3U2FeqeJ0I9ZW41NV2sXQ.gif"></figure>

Be you, a graphic designer in the 1800s making some dope \_Wanted \_poster for the town vagrant. You
ain’t got DaFonts, dawg—can’t download that—so you gotta order some type from the foundry.

You open up their last catalog and see a whole mess of sizes: _6 • 8 •10 • 12 • 14 • 16 • 18 • 21 •
24 • 36 • 48 • 60 • 72_. “That’s right nice of ’em,” your 19th century-self says. “At least I don’t
gotta decide between 100 numbers.”

Fast-forward to today, where 21st-century you is making a modern-day _Wanted_ poster called a _web
site._ Only this time, you can pick out as many fonts and sizes as you want*.* So you start out
simple. `16px`. `12px`. `13px`. Then you realize you have to add responsive styles, so you add in
some media queries and throw more `15px`, `18px`, and even some `24px` at it. Then you read a blog
article about relative type sizes, and suddenly you’re in `em`-land. `1em`. `0.75em`. `0.875em`. No,
wait—`0.873em`— that 5 on the end felt a _little_ too big so you nudged it down.

“Oh, I forgot about responsive styles again,” you say.

For many, picking type sizes is a dark art—a “what feels right” approach. Deciding what’s big and
what’s small on the page is the easy part; it’s the _how big_ and _how small_ that requires thought.
Introducing _typographic scales_: a set-it-and-forget-it approach to managing font sizes.

A typographic scale is a small list of fixed sizes: 10 • 12 • 14 • 16 • 18 • 21 • 24 • 36 …. Any
list of sizes can make up a type scale, but **a good type scale is flexible enough to fit the
design, without allowing too many options that result in choice overload and inconsistency**.

## Responsive design is about relationships

A type scale is fixed numbers, sure. But how does a type scale apply to responsive design? It does
so in _relationships_.

<figure><img src="https://miro.medium.com/max/2000/1*RPezfmrzk8RalSUmeCVtew.png"><figcaption>Medium’s responsive typography mandates their subheadings and headings are always 2 steps apart, and scale with screen size.</figcaption></figure>

For a practical example of this done well, let’s use something convenient: the very article you’re
reading! On mobile screens, Medium’s heading and subheading font sizes are `28px` and `22px`,
respectively. On desktop, they all increase to `32px` and `24px`. When one font size increases, the
surrounding font sizes must, too, so that those typographic **relationships** are all preserved.

Let’s turn this into a type scale: 22 • 24 • 28 • 32. If a subheading is 22, and heading is 28 on
mobile, that means they’re _2 steps_ apart on that type scale (start at 22, and go up two steps to
arrive at 28). On desktop, both bump up one to become 24 and 32. How far apart are they? _Still two
steps apart on the type scale._ That’s their relationship: one is two steps up from the other.

When it comes to responsive design where size changes across devices, keeping track of only a couple
typographic relationships isn’t hard. But when there become thousands of relationships in a large
design system, it becomes impossible unless you have a system to manage it.

# Type Scales in CSS

_Full credit for this approach goes to Spencer Mortensen in this
_[_blog post on typographic scales_](http://spencermortensen.com/articles/typographic-scale/)_. This
post builds on his research and applies it in a more practical, modern front-end setup._

Consider the following CSS (using variables, which is now supported in every major browser):

```css
:root {
  --step-up-5: 2em;
  --step-up-4: 1.7511em;
  --step-up-3: 1.5157em;
  --step-up-2: 1.3195em;
  --step-up-1: 1.1487em;
  /* baseline: 1em */
  --step-down-1: 0.8706em;
  --step-down-2: 0.7579em;
  --step-down-3: 0.6599em;
  --step-down-4: 0.5745em;
  --step-down-5: 0.5em;
}
```

This is based on the _pentatonic scale_ from
[Spencer’s blog post](http://spencermortensen.com/articles/typographic-scale/). In other words,
every 5 “steps” up on the scale, the type size doubles. Every 5 steps down, the type size cuts in
half.

_But _`_em_`_s are so hard to use because they’re relative!_ You’re probably thinking. And you’re
right—there’s a lot of math you have to do when you’re nesting `em`s inside `em`s.

**Unless you’re using a special relative scale like the one above.** Believe it or not, you can nest
the numbers above infinitely, and still stick to the same type scale.

Don’t believe me? Try putting a `font-size: var(--step-up-1)` inside another element with
`font-size: var(--step-down-1)`. 1–1 = 0, right? Let’s look at what happens when we multiply
`1.1487em` × `0.8706em` (`--step-up-1`×`--step-down-1`): `1em`. In other words, 100%. Right back
where we started. Multiply any of the steps together— `--step-up-2` and `--step-down-2`, or even
`--step-up-4` and ` --step-``down``-3 `—and you’ll end up with the same step as if you added the
numbers together.

Even if you didn’t follow all the math, just know that **you can nest this responsive type scale
infinitely, and it’ll still always be the same scale**.

<figure><img src="https://miro.medium.com/max/2000/1*XAPJIb6u7E2mcWdkq7pcZg.png"><figcaption>Relative type sizes can be a pain as soon as you nest them. But using this type scale, even nested sizes still stick to the scale.</figcaption></figure>

Say you had this structure:

```html
<h1>
  I’m a heading!
  <small>I’m a normal text size</small>
</h1>
```

If you wanted the `<small>;` to be `1em`, but it’s in a header which needs to be 2 steps up the
typographic scale, all you’d need is the following:

```css
h1 {
  font-size: var(--step-up-2);
}
small {
  font-size: var(--step-down-2);
}
```

All you have to worry about is _going up_, or _going down \_the ladder. And let the math figure
itself out. Essentially, no matter how deeply-nested your elements are, \_they’ll still stick to the
same scale._

# Component Design ❤️s Relative Type Scales

Approaching this from a
[component design oriented perspective](https://medium.com/goabstract/a-component-based-workflow-for-sketch-6d3556b18d4c)
where our user interface is made of reusable components—you know: _cards, modals, headers, footers,
scrollspys_…—is the perfect fit for this kind of typographic scale.

For example, if you have a `.card`:

```css
.card {
  font-size: 16px;
}
```

You can either set the base font sizing to `1rem` (default size), or declare `16px` or some other
absolute value. From there, use things like:

```css
.card-heading {
  font-size: var(--step-up-2);
}
.card-subheading {
  font-size: var(--step-down-1);
}
.card-body {
  font-size: 1em;
}
.card-footnote {
  font-size: var(--step-down-2);
}
```

And you’ll have a wonderfully self-contained typographic system on each component. Then, if you need
to adjust the base size responsively, it’s a cinch:

```css
.card {
  font-size: 18px; /* Bigger on mobile */

  @media (min-width: 600px) {
    font-size: 16px; /* Smaller on tablet & desktop */
  }

  @media (min-width: 1800px) {
    font-size: 18px; /* Big again on huge displays */
  }
}
```

_Note: nested selectors are currently unsupported without something like
_[_cssnext_](http://cssnext.io/)_._

In this process, you reduced managing **12 font sizes** (4 sizes over 3 breakpoints) into **1 font
size per breakpoint**. The amount of time you’ll spend managing responsive sizes is reduced
significantly across the app, and your font sizes are all consistent, to boot!

<figure><img src="https://miro.medium.com/max/2000/1*QAD2RSU__9oJOCm1gmHWeg.png"><figcaption>This is all one type scale: 12 • 14 • 16 • 18 • 24 • 28, however, there are 8 font sizes to manage across devices for one component! But, if we turned this into a relative typographic scale, then all we’d have to adjust would be the base size, going from mobile to desktop.</figcaption></figure>

This operates off a simple but basic theory: _your app should respond and rearrange based off
content and devices sizes, but your typographic relationships should not_.

# A note on different fonts

It probably goes without saying that the relationships afforded by a typographic scale only apply to
scaling the same font up or down. Comparing one typeface to another is usually an apples-to-oranges
situation, and _technically_ speaking, a proper typographer would recommend you develop **one scale
per typeface**.

I’ll confess I’m lazy, and I typically use 1 type scale even on a multi-font website. It’s just
simpler, and the converse of setting _font family ratios_ to one another is a hurdle I haven’t found
a sane way of tackling without mixins or some other method that becomes a hot mess down the line.

Regardless, this article is just a primer to type scales, and I do encourage you to employ as many
type scales as your design needs, so long as it improves the typography and doesn’t put you into
developer debt in the future.

# Building your own type scale

These examples used the pentatonic scale, but maybe you’ve tried it and decided it wasn’t delicate
enough for your app. Here’s how to calculate your own typographic scale. **You only have to
calculate this once at the start of your project,** and from there it’s plug-and-play.

_Tip: if you’re on a Mac, you can calculate these quickly with Spotlight (⌘+Space)_

## Pentatonic Scale (doubles every fifth step)

_Enter in the formulas to the left of the arrow in a calculator (_`_2^(5/5)_`_) to get the results
on the right-hand side._

```
2^(5/5)      ->  2
2^(4/5)      ->  1.7411
2^(3/5)      ->  1.51572
2^(2/5)      ->  1.31951
2^(1/5)      ->  1.14869
2^(-1/5)     ->  0.87055
2^(-2/5)     ->  0.75785
2^(-3/5)     ->  0.65975
2^(-4/5)     ->  0.57435
2^(-5/5)     ->  0.5
```

## Golden Ditonic Scale (every other step, increases by the golden ratio, 1.618)

```
1.618^(3/2)  ->  2.0581
1.618^(2/2)  ->  1.618
1.618^(1/2)  ->  1.272
1.618^(-1/2) ->  0.7861
1.618^(-2/2) ->  0.618
1.618^(-3/2) ->  0.4856
```

## The very, very subtle scale (doubles every eight steps)

```
2^(8/8)      ->  2
2^(7/8)      ->  1.834
2^(6/8)      ->  1.68179
2^(5/8)      ->  1.54221
2^(4/8)      ->  1.41421
2^(3/8)      ->  1.29684
2^(2/8)      ->  1.18920
2^(1/8)      ->  1.0905
2^(-1/8)     ->  0.917
2^(-2/8)     ->  0.8409
2^(-3/8)     ->  0.7711
2^(-4/8)     ->  0.7071
2^(-5/8)     ->  0.64841
2^(-6/8)     ->  0.5946
2^(-7/8)     ->  0.54525
2^(-8/8)     ->  0.5
```

## Common Formula

Using the above examples, by now you’ve probably gleaned the common formula:

```
multiplier ^ (step / interval)
```

Using this, you can calculate all your values and put them into CSS or Sass variables (I use
`--step-up-1`, `--step-up-2`, `--step-down-1`, `--step-down-2`, etc. because it’s easy for me to
remember, but you can name these whatever you want!). You can even extend the existing scales above
to go as far as you want in either direction.

## A warning against formulatizing this

Long-time Sass users might get the idea to turn the above into a formula (as I initially did).
However, I’d advise against that, and instead store these `em` values as hard variables like in the
examples. The reason is: **if you change your type scale, you’ll have to update every component in
your app** (which I also did, and regretted, and in response removed that formula from my app so no
one else could change it).

Changing the typographic scale changes _every_ typographic relationship in your app, which is the
equivalent of a redesign or design refresh. Everything will feel “off” if you built it on one scale,
but switched to another midway. That’s not the intent of typographic scales.

I prefer to have these values be statically-entered, as a reminder that this isn’t a mere “setting;”
it’s hard-baked into the design.

# Further Reading

- [webpack + PostCSS + cssnext](https://blog.madewithenvy.com/webpack-2-postcss-cssnext-fdcd2fd7d0bd)
- [How we’re using Component-based design](https://medium.com/@lewisplushumphreys/how-were-using-component-based-design-5f9e3176babb)
