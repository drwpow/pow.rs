---
title: don’t use hsl for anything
description: HSL is great in theory, but worse than you realize in practice
date: 2021-11-14
updated_at: 2022-02-02
tags: [design, dev]
layout: ../../layouts/post.astro
---

<p>Making websites usually involves <em><span
style="color:#f00">C</span><span style="color:#f80">O</span><span
style="color:#ff0">L</span><span style="color:#0f0">O</span><span
style="color:#0ff">R</span><span style="color:#f0f">S</span></em> (they’re all
the rage these days!).</p>

You’ll no doubt find [HSL] easier to work with as a developer, since it was
designed to manipulate colors more directly. However, just because it’s easy to
edit doesn’t mean it’s a superior format. In fact, quite the opposite.

## HSL is missing a lot more than it gives

There’s not a 1:1 conversion between HSL and RGB. In one sense this is obvious,
because HSL’s appeal is that it’s _not_ RGB. But in another sense, just _how_
different they are can often be overlooked, and you’d be forgiven for not
realizing HSL is as bad as it is.

| format |            formula             |       values | spread |
| ------ | :----------------------------: | -----------: | -----: |
| RGB    |     <small>256 ^ 3</small>     | `16,777,216` | 100.0% |
| HSL    | <small>360 ✕ 100 ✕ 100</small> |  `3,600,000` |  21.5% |

Just comparing the possible values, HSL is missing almost 80% of RGB’s. But if
throwing away 80% of colors weren’t bad enough, it’s actually worse! Not every
HSL value maps to a _unique_ RGB color, and there are multiple ways to express
the same color in HSL. For example, when saturation is `0`, HSL has 36,000
different values that generate only `100` grays. When you remove all the
duplicates, HSL is missing closer to
**~85%** of RGB’s colors
([source](https://gist.github.com/drwpow/0fabf0cc932285ad023ca39e6f9ed35d)).
And when is an 85% loss in quality ever acceptable?

> When is an 85% loss in quality ever acceptable?

_HSL can accept decimals, though!_ you may think. However, when you try to
manage HSL values with a single decimal place, it skyrockets to 3.6 _billion_
possible values and becomes a barren wasteland of mostly-duplicated colors.
Since now most adjustments won’t end up changing the color at all, it means
using HSL with decimals makes it worthless.

So back to our original premise: when **storing colors,** HSL is a terrible
format to use because it’s missing so much of the RGB colorspace. And
attempting to fill in those gaps results in mostly-useless values.

## The “L” stands for “Ludicrous”

If missing colors weren’t bad enough, the colors that _are_ there are widly
distorted. It’s assumed that the `L` in HSL designates the lightness of a color,
right? Well, in theory, yes, but in practice…

<figure>
  <img alt="the dips in the graph represent impossible colors" src="/assets/posts/dont-use-hsl-for-anything/sitnik_hsl_twitter.png">
  <figcaption>via <a href="https://twitter.com/sitnikcode/status/1470755010464161794">@sitnik</a></figcaption>
</figure>

Turns out lightness as expressed in HSL is really useless when translating from
one hue to another. Compare all these values that have 50% lightness in HSL,
when compared to their grayscale equivalents:

<div style="display:grid;grid-template-columns:33.333% 33.333% 33.333%;height:8rem">
  <div style="background:hsl(0, 100%, 50%)"></div>
  <div style="background:hsl(60, 100%, 50%)"></div>
  <div style="background:hsl(240, 100%, 50%)"></div>
  <div style="background:rgb(135, 135, 135)"></div>
  <div style="background:rgb(237, 237, 237)"></div>
  <div style="background:rgb(82, 82, 82)"></div>
</div>

_Calculated using [better-color-tools](https://github.com/drwpow/better-color-tools)_

Not even close. Yellow is significantly brighter than the other colors! While
`L` does have a purpose, it’s usually not what people think.

## HSL isn’t even _that_ good of an interface

<p>In case you’re tempted to store color values as RGB, then convert to HSL,
there’s a better interface: the <a
href="https://developer.mozilla.org/en-US/docs/Web/CSS/color_value/color()">CSS
<code>color() function</code></a> Though it’s been teased for years, and is
<em>still</em> not available in 2021, when it finally is released will provide
all the usefulness of HSL and then some. And it even lets
you use &nbsp;<em><span style="color:#f00">A</span><span
style="color:#f80">L</span><span
style="color:#ff0">L</span>&nbsp;&nbsp;<span
style="color:#8f0">T</span><span style="color:#0f0">H</span><span
style="color:#0f8">E</span>&nbsp;&nbsp;<span
style="color:#0ff">C</span><span style="color:#08f">O</span><span
style="color:#00f">L</span><span style="color:#80f">O</span><span
style="color:#f0f">R</span><span style="color:#f08">S</span></em>&nbsp; of RGB.</p>

And until that’s released, please just use [Sass’ color function][sass] today.
You can run all valid CSS through Sass, it only takes a few milliseconds, and it
lets you perform more complex color manipulation without any of HSL’s
limitations.

I know that 16.7 million colors sounds like a lot, but it pales in comparison to
the actual number of colors the human eye can perceive (for goodness’ sake; we
can’t even recreate [brown digitally][brown]!). So please don’t reduce the
palette any further than necessary just because it makes a button hover effect
easier to manage.

[brown]: https://youtube.com/v/wh4aWZRtTwU
[hsl]: https://developer.mozilla.org/en-US/docs/Web/CSS/color_value/hsl()
[sass]: https://sass-lang.com/documentation/modules/color
