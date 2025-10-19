---
title: There’s no such thing as multi-axis modes
description: Modes, themes, collections, whatever you call it, doesn’t solve your busted design token setup.
pubDate: 2025-06-22
img: /assets/posts/theres-no-such-thing-as-multi-axis-modes/dts-01.jpg
categories: ["design"]
---

The two best days in a design system designer’s life is the day they inherit the design system, and the day they get rid of it. Or so the saying goes.

## A la mode

When you start managing design tokens for your system, there comes a point when you make the leap from light mode to dark mode (or the rarer dark-to-light). Figma makes this simple—just click that little plus sign in the Variables panel and get to work!

<figure>
  <img alt="screenshot of the Figma UI, hovering over the plus sign in the Variables panel. The tooltip reads “New variable mode.”" src="/assets/posts/theres-no-such-thing-as-multi-axis-modes/001.png" width="1684" height="906" />
  <figcaption>“It’s one button, Michael. What could it cost? 10 hours?”</figcaption>
</figure>

But by the time the third and then fourth mode rolls around, you start feeling the pain. <i>“That’s ridiculous!”</i> some of you may be thinking. <i>“When would you even need a third mode after Dark Mode?”</i> Glad you asked! Here are several common scenarios that lead to multiplying modes:

- **Accessibility.** Need a high contrast theme? Now you need alternate versions of light and dark mode that pass WCAG standards.
- **Color blindness.** Protanopia/deuteranopia and tritanopia users exist! Good news is protanopia and deuteranopia are similar enough they can share a set. Bad news is that all your existing color tokens still multiplied by 3.
- **Multi-brand.** That new startup your company acquired had _its_ own design system you need to incorporate.

Mind you, these are not exclusive scenarios—some companies undergo all 3, or more. And every time you add on a new layer, it _multiplies_ the number of existing color tokens you have.

<figure>
  <img alt="same variables panel in figma, only showing 4 columns now—Light, Dark, Light H.C., and Dark H.C." src="/assets/posts/theres-no-such-thing-as-multi-axis-modes/002.png" width="1610" height="898" />
  <figcaption>Starting from light + dark modes, adding one additional “high contrast” layer increased the number of modes not by 1, but by 2! Additional layers also have the same multiplying effect, resulting in exponential growth.</figcaption>
</figure>

```
Editor’s note: I was going to make another graphic here that had 8+ columns, and
the columns would have increasingly-desperate sounding names like “oh god,”
“oh fuck,” etc. But I got paywalled by Figma (yes, my own company), because even
they have a limit on how many values they can maintain before charging more $$$.

The problem exists on both sides—it turns out having a button that when clicked
multiplies your number of database records isn’t great software architecture
either. At least both devs and designers agree on this!
```

You can see how 0 → 1 layers, or “axes,” was a non-issue. But going 1 → 2 and beyond starts to topple your system. It accelerates to a point that you can’t hire fast enough to maintain it, even assuming you had the budget in the first place (you don’t). “There must be a better way,” you say.

## Multi-axis-whosie-whatsie?

There isn’t a better way. Thanks for reading! Bye-bye!

<i>“…What? Are you serious?”</i>

Unfortunately, yes. Let’s take another look at trying to come up with a “clever” solution, and we’ll see it doesn’t work.

We’ll keep the scenario of going from 1 → 2 axes, the first being Dark mode and the second being High Contrast mode.

### Failed attempt 1: the cascade, but worse

Breaking out of Figma, and going into CSS, we realize the problem immediately: trying to declare a [2×2 matrix](https://en.wikipedia.org/wiki/Punnett_square) in only 3 selectors proves to be a challenge:

```css
[data-theme="light"] {
  --color-text: #101010;
  --color-bg: #ffffff;
  --color-action: #0049e8;
}

[data-theme="dark"] {
  --color-text: #e5e5e5;
  --color-bg: #202020;
  --color-action: #1265e2;
}

[data-highcontrast="true"] {
  --color-text: #000000;
  --color-bg: #ffffff;
  --color-action: #0034a5;
}

/* ❌ What happens for <div data-theme="dark" data-highcontrast="true">?  */
```

We realize `data-highcontrast` only works for light mode, and not dark mode. We shaved down our modes from 4 → 3 by _\*checks notes\*_ deleting one. We were trying to handle `<div data-theme="light" data-highcontrast="true">`, and wanted to get `<div data-theme="dark" data-highcontrast="true">` for free, but it didn’t seem to happen this go-round. <i>“Hm. I’ll have another go.”</i>

```css
[data-theme="light"] {
  /* … */
  [data-highcontrast="true"] {
    /* … */
  }
}

[data-theme="dark"] {
  /* … */
  [data-highcontrast="true"] {
    /* … */
  }
}
```

<i>”I’ve done it!”</i> you say, a half-second before realizing you are back at the number of tokens you started with. What’s more, you’ve created a scenario where now `[data-theme]` and `[data-highcontrast]` can’t even be on the same HTML element! <i>“No, no, wait—I’ve got it,”</i> you say.

```css
[data-theme="light"]:not([data-highcontrast="true"]) {
  /* … */
}
[data-theme="light"][data-highcontrast="true"] {
  /* … */
}
[data-theme="dark"]:not([data-highcontrast="true"]) {
  /* … */
}
[data-highcontrast="true"][data-highcontrast="true"] {
  /* … */
}
```

You’ve fixed your cascade issue, but are still stuck at the same number of tokens. In fact, try this at home—try and come up with a scenario where you can express a 2-axis system (2×2 matrix) in CSS with only 3 selectors. Any system you engineer will have some problem with cascading, or have colors ultimately missing that will lead to a bad experience.

### Failed attempt 2: in color space, no one can hear you scream

<i>“Well, of course you wound up with the same number of tokens—you had created all those hex codes manually in the first place! The <em>real</em> solution is in generation.”</i>

Asking color science to fix your problems has historically never worked for anyone. But maybe it will work for us here!

```css
:root {
  --color-text-h: 0;
  --color-text-s: 0;
  --color-text-l-light: 6;
  --color-text-l-dark: 90;
  --color-bg-h: 0;
  --color-bg-s: 0;
  --color-bg-l-light: 100;
  --color-bg-l-dark: 12;
  --color-action-h: 221;
  --color-action-h-dark: 216; /* wait, fuck, the designer shifted the hue? fuck */
  --color-action-s: 100;
  --color-action-l-light: 45;
  --color-action-l-dark: 45;
}

:root {
  --color-text: hsl(
    var(--color-text-h),
    var(--color-text-s),
    var(--color-text-l)
  );
  --color-bg: hsl(var(--color-bg-h), var(--color-bg-s), var(--color-bg-l));
  --color-action: hsl(
    var(--color-action-h),
    var(--color-action-s),
    var(--color-action-l)
  );
}

[data-theme="light"] {
  --color-text-l: var(--color-text-l-light);
  --color-bg-l: var(--color-bg-l-light);
  --color-action-l: var(--color-action-l-light);
}

[data-theme="dark"] {
  --color-text-l: var(--color-text-l-light);
  --color-bg-l: var(--color-bg-l-dark);
  --color-action-h: var(--color-action-h-dark);
  --color-action-l: var(--color-action-l-dark);
}

[data-highcontrast="true"] {
  --color-text-l: calc(1.2 * var(--color-text-1));
  --color-bg-l: calc(1.2 * var(--color-bg-1));
  --color-action-l: calc(1.2 * var(--color-action-1));
}
```

<i>“I am so clever,”</i> you say, before realizing this doesn’t work at all. Not only is it an incomprehensible _mess_ (for only 3 tokens), this is not how CSS works.

- When CSS variables compose other CSS variables, they have to be redeclared. In `:root`, `--color-text` doesn’t work because `var(--color-text-l)` isn’t defined until later. `--color-text` has to be redeclared in every selector to resolve to a color (which means, _ding ding ding_ we need that 4th selector back)
- You can’t simply `calc()` into Mordor. `undefined × anything = undefined`.
- Further, even if `calc()` did work in some alternate universe, [HSL is dogshit](/blog/dont-use-hsl-for-anything), so any formula that works in light mode won’t work at all for dark mode. It’s a completely different calculation.

I know you already get the point, but just to drive the nail through to the absolute center of the earth:

<i>“Oh, it was just the HSL space that’s bad. What if we used LAB?”</i>

<p style="text-align:right">LAB is <a href="https://bottosson.github.io/posts/oklab/" target="_blank">not perceptually-uniform like Oklab/Oklch</a></p>

<i>“OK, we’ll use Oklab/Oklch, then.”</i>

<p style="text-align:right">The WCAG 2.2 standard is based on LAB (D65 whitepoint) so we won’t pass</p>

<i>“Is there a better standard than WCAG?”</i>

<p style="text-align:right">Not at the moment, unless you count APCA, which is a candidate for WCAG 3 but is currently proprietary/closed license. Also WCAG 3 doesn’t exist yet.</p>

The TL;DR about color science is human eyeballs are weird, and RGB screens are limited. That means **there is no magic math that will produce 2 axes’ worth of colors, let alone more.** You are welcome to try and prove me wrong! But beware it will take a bigger time investment than you realize.

<figure>
  <img alt="visualization of the OKLCH color space, which looks like someone on an acid trip tried to draw the batman logo. It has so many curves and bumps it can’t even be described by a simple mathematical formula." src="/assets/posts/theres-no-such-thing-as-multi-axis-modes/oklch.png" width="732" height="576" />
  <figcaption>Do you see this ridiculous shape? Simply <em>looking</em> at it is only the tip of the iceberg, my friend. Try creating math that successfully navigates it! (<a href="https://evilmartians.com/chronicles/oklch-in-css-why-quit-rgb-hsl" target="_blank">© Evil Martians</a>)</figcaption>
</figure>

### Failed attempt 3: magic?

I’m now an author on the [Design Tokens Spec](https://designtokens.org) which happened because I read every kooky comment posted [on the GitHub repo](https://github.com/design-tokens/community-group). The kookiest of which was [#210: Native modes and theming support](https://github.com/design-tokens/community-group/issues/210), a 60-comment discussion where the smartest design systems thinkers on the internet collectively descended into the depths of madness trying to solve this problem.

I was mentioned in comment #1 on that thread which meant I was dragged down to the pit of hell along with everyone else. For those that haven’t read it, here’s a brief 3-part visual summary:

![screencap of the psychedelic boat scene from Willy Wonka & the Chocolate Factory (1971), where Gene Wilder (Willy Wonka)’s face is overlaid with the GitHub avatar of the original thread starter, and a screenshot of the comment beside him](/assets/posts/theres-no-such-thing-as-multi-axis-modes/dts-01.jpg)

![screencap of the same psychedelic boat scene, where Charlie turns, concerned, to Grandpa. There are 2 screenshots from the GitHub thread showing diagrams](/assets/posts/theres-no-such-thing-as-multi-axis-modes/dts-02.jpg)

![screencap of the same psychedelic boat scene, where Mike TV is screaming, toy gun in hand, raised to shoot the apparitions that appear next to the boat. About 8 GitHub comments are overlaid around Mike TV’s gun, as if he is screaming and shooting at the complex GitHub comments that appear longer, and more complex, than the last, each person showing intense debate over the topic](/assets/posts/theres-no-such-thing-as-multi-axis-modes/dts-03.jpg)

Anyway, about a year later, all of that debate coagulated into a proposal to solve this problem called [The [Token] Resolver proposal](https://resolver-spec.netlify.app/). It describes a mechanism by which token themes can be declared using the absolute minimal syntax possible. It came from Tokens Studio and folks that had dealt with this problem at scale, for years. It has been reviewed by many smart folks. It has also been reviewed by me (not a smart folks). I even [made a working interactive implementation of it](https://dts-playground.pages.dev).

What it does solve:

- Token duplication across modes
- Theme support for people using the Design Tokens Spec in a backwards-compatible way
- A code-friendly way to describe Figma Variables and Tokens Studio variables

What it does not solve:

- The problem outlined at the beginning of this blog post

The rub is, even with really fancy abstractions on top, in the end the computer is still going to ask “what color does this need to be?” And if you don’t know, neither will it.

The Resolver spec _is_ really cool. And it _is_ magic how it can remove all duplicate tokens in your system, leaving the minimum number necessary to manage. But removing duplicates doesn’t change that underlying 2D “spreadsheet” like how Figma Variables works today. That’s just the system itself.

---

<i>“No, no, no! You’re just not getting it! Instead of multiplying every token in a single plane, we’ll just create a new ‘axis!’ Then we only have to declare 1 token per plane!”</i>

Brilliant. You’ve succeeded in breaking out of the 2D token spreadsheet, and have entered the 5th dimension. Have fun organizing 5-dimensional tokens into your 2-dimensional UI. Idiot.

## No, really. help.

Multiple axes may have been a dead end, but that doesn’t mean we can’t make some slight improvements to the 2D spreadsheet to make it a little more manageable. Perhaps this will happen in Figma Variables, perhaps it won’t. But either way, the 2D spreadsheet is here to stay. If the spreadsheet feels complex, it’s because _you’re doing a lot!_ And it _is_ complex. And you should feel amazed at yourself for handling such a complex thing.

<figure>
  <img alt="“you’re doing amazing sweetie” meme, but with Kim covered up by 12 modes: light mode, dark mode, high contrast, high contrast dark, brand 2, brand 3, 2.0 beta, protanopia, deuteranopia, some fuggin last-minute CEO idea" src="/assets/posts/theres-no-such-thing-as-multi-axis-modes/doing-amazing-sweetie.jpg" width="800" height="937" />
  <figcaption>Complexity is complex. More at 7.</figcaption>
</figure>

The best we can do for now is declare **mode fallbacks**. A “fallback” is different from an <dfn>alias</dfn>, where one token value points to another. A <dfn>mode fallback</dfn> allows a mode to leave “gaps” in token definitions, but declares “if a token is not defined here, try Mode 𝑥. If Mode 𝑥 doesn’t have it, try Mode 𝑦,” and so on, until we eventually hit a value. Figma Variables doesn’t support this yet, but is actively working on a similar mechanism (name TBD). To visualize it in the Figma Variable table, it would look something like this:

<figure>
  <img alt="the same 4-column Figma Variables screenshot from before, but 2 color values are empty, with arrows pointing to other modes indicating their fallbacks." src="/assets/posts/theres-no-such-thing-as-multi-axis-modes/003.png" width="1610" height="898" />
  <figcaption>For most practical applications, design token fallbacks only work if you can specify multiple. Like ranked choice voting. If anyone ever figures out how to make that happen.</figcaption>
</figure>

Mode fallbacks are like a [swiss cheese model](https://en.wikipedia.org/wiki/Swiss_cheese_model) of sorts, where each mode is allowed to have “holes.” But when you have multiple layers, with the holes being in different places, you cover all the gaps across all modes.

Sure, it’s maybe not the revolutionary change you were hoping for. But it’s about as simple as any system can get while leaving you in full control.
