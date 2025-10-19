---
title: Don’t use HSL
description: HSL is great in theory, but worse than you realize in practice
pubDate: 2021-11-14
updated_at: 2023-07-19
categories: ["design", "dev"]
---

Making websites usually involves _<span style="color:#f00">C</span><span style="color:#f80">O</span><span style="color:#ff0">L</span><span style="color:#0f0">O</span><span style="color:#0ff">R</span><span style="color:#f0f">S</span>_ (they’re all the rage these days!).

You’ll no doubt find <a href="https://developer.mozilla.org/en-US/docs/Web/CSS/color_value/hsl()" target="_blank" rel="noreferrer">HSL</a> easier to work with as a developer, since it was designed to manipulate colors more directly. However, just because it’s easy to edit doesn’t mean it’s a superior format. In fact, quite the opposite.

## HSL is missing a lot more than it gives

Though HSL derives from sRGB, there’s not a 1:1 conversion of colors. In one sense this is obvious, because HSL’s appeal is that it’s _not_ sRGB. But in another sense, just _how_ different they are can often be overlooked, and you’d be forgiven for not realizing HSL is as bad as it is.

| format |            formula             |       values | spread |
| :----- | :----------------------------: | -----------: | -----: |
| sRGB   |     <small>256 ^ 3</small>     | `16,777,216` |   100% |
| HSL    | <small>360 ✕ 100 ✕ 100</small> |  `3,600,000` |    22% |

Just comparing the possible values, HSL is missing almost 80% of sRGB’s. But if throwing away 80% of colors weren’t bad enough, it’s actually worse! Not every HSL value maps to a _unique_ sRGB color, and there are multiple ways to express the same color in HSL. For example, when saturation is <code>0</code>, HSL has 36,000 different values that generate only `100` grays. When you remove all the duplicates, HSL is missing closer to <b>85%</b> of sRGB’s colors (<a href="https://gist.github.com/drwpow/0fabf0cc932285ad023ca39e6f9ed35d" target="_blank" rel="noreferrer">source</a>). And when is an 85% loss in quality ever acceptable?

> When is an 85% loss in quality ever acceptable?

<i>HSL can accept decimals, though!</i> you may think. However, when you try to manage HSL values with a single decimal place, it skyrockets to 3.6 _billion_ possible values and becomes a barren wasteland of mostly-duplicated colors. Since now most adjustments won’t end up changing the color at all, it means using HSL with decimals makes it worthless.

So back to our original premise: when <b>storing colors,</b> HSL is a terrible format to use because it’s missing so much of the sRGB color space. And attempting to fill in those gaps results in mostly-useless values.

## The “L” stands for “Ludicrous”

If missing colors weren’t bad enough, the colors that _are_ there are widly distorted. It’s assumed that the <code>L</code> in HSL designates the lightness of a color, right? Well, in theory, yes, but in practice…

<figure>
  <img alt="the dips in the graph represent impossible colors" src="/assets/posts/dont-use-hsl-for-anything/sitnik_hsl_twitter.png" />
  <figcaption>via <a href="https://twitter.com/sitnikcode/status/1470755010464161794">@sitnik</a></figcaption>
</figure>

Turns out lightness as expressed in HSL is really useless when translating from one hue to another. Compare all these values that have 50% lightness in HSL, when compared to their grayscale equivalents:

<div style="display:grid;grid-template-columns:33.333% 33.333% 33.333%;height:8rem">
  <div style="background:hsl(0, 100%, 50%)"></div>
  <div style="background:hsl(60, 100%, 50%)"></div>
  <div style="background:hsl(240, 100%, 50%)"></div>
  <div style="background:rgb(135, 135, 135)"></div>
  <div style="background:rgb(237, 237, 237)"></div>
  <div style="background:rgb(82, 82, 82)"></div>
</div>

<i>Calculated using <a href="https://github.com/drwpow/better-color-tools" target="_blank" rel="noreferrer">better-color-tools</a></i>

Not even close. Yellow is significantly brighter than the other colors! While <code>L</code> does have a purpose, it’s usually not what people think.

## Use OKLCH instead

<a href="https://oklch.com" target="_blank" rel="noreferrer">OKLCH</a> is a perceptually-consistent color space that can be used today in all major browsers. It works exactly like HSL, except _it actually works_. The “LCH” part of it stands for <b>L</b>ightness, <b>C</b>hroma, and <b>H</b>ue. If you rearranged it to <i>HCL</i>, you’d realize it’s only off by one letter from <i>HSL</i>. Rather than <b>S</b>aturation, you’re dealing with <i><b>C</b>hroma</i> which is the same basic concept, just modified to be a little more honest (some colors can achieve higher chroma than others because of the <a href="https://en.wikipedia.org/wiki/RGB_color_spaces" target="_blank" rel="noreferrer">asymmetric gamut of RGB monitors</a>, thus, it’s a linear scale rather than a percentage).

Picking OKLCH colors is simple using online an online tool like <a href="https://oklch.com" target="_blank" rel="noreferrer">oklch.com</a> or <a href="https://better-color-tools.pages.dev" target="_blank" rel="noreferrer">better-color-tools</a >. Using it in CSS is possible through the <a href="https://developer.mozilla.org/en-US/docs/Web/CSS/color_value/oklch">oklch()</a> function which has wide browser support as of 2023.

```css
.button {
  --color: oklch(70% 0.16 240); /* 240° blue hue, 70% lightness, 0.6 chroma */

  background-color: var(--color);
  color: white;
}

/* on hover, lighten 10% via OKLAB’s algorithm */
.button:hover {
  background-color: color-mix(in oklab, var(--color), 10% white);
}
```

> ✨ <b>Tip</b>: always use `in oklab` as the mixing space for <a href="https://developer.mozilla.org/en-US/docs/Web/CSS/color_value/color-mix" target="_blank" rel="noreferrer">color-mix()</a>, even when using OKLCH colors. It will outperform any other blending mode almost every time (<a href="https://better-color-tools.pages.dev/mix" target="_blank" rel="noreferrer">comparison</a>).

So again, it’s not that the _premise_ of manipulating color via hue, lightness, and chroma/saturation are flawed; it’s simply that HSL’s _implementation_ of it is unusable if you care about color integrity even a little bit. But OKLCH fits the bill.

So please, for the love of everyone’s eyeballs, don’t use HSL.
