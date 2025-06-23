---
title: There’s no such thing as multi-axis modes
description: Modes, themes, collections, whatever you call it, doesn’t solve your busted design token setup.
date: 2026-06-22
tags:
  - design
layout: ../../layouts/post.astro
---

The two best days in a design system designer’s life is the day they inherit the design system, and the day they get rid of it. Or so the saying goes.

## A la mode

When you start managing design tokens for your system, there comes a point when you make the leap from light mode to dark mode (or the rarer dark-to-light). Figma makes this fairly manageable—just click that little plus sign in the Variables panel and get to work!

<figure>
  <img alt="screenshot of the Figma UI, hovering over the plus sign in the Variables panel. The tooltip reads “New variable mode.”" src="/assets/posts/theres-no-such-thing-as-multi-axis-modes/001.png" width="1684" height="906" />
  <figcaption>“It’s one button, Michael. What could it cost? 10 hours?”</figcaption>
</figure>

But by the time the third and then fourth mode rolls around, you start feeling the pain. “That’s ridiculous!” Some of you may be thinking. “What’s there even to do after dark mode?” Glad you asked! Here are several common scenarios that lead to multiplying modes:

- **Accessibility.** Need a high contrast theme? Now you need alternate versions of light and dark mode that pass WCAG standards.
- **Color blindness.** Protanopia/deuteranopia and tritanopia users exist! Good news is protanopia and deuteranopia are similar enough they can share a set. Bad news is that all your existing color tokens just multiplied by 2.
- **Multi-brand.** _Oopsie!_ That new startup your company acquired had _its_ own design system you need to incorporate.

Mind you, these are not exclusive scenarios! Some companies undergo all 3, or more. And every time you add on a new layer, it _multiplies_ the number of existing color tokens you have.

<figure>
  <img alt="same variables panel in figma, only showing 4 columns now—Light, Dark, Light H.C., and Dark H.C." src="/assets/posts/theres-no-such-thing-as-multi-axis-modes/002.png" width="1610" height="898" />
  <figcaption>Starting from light + dark modes, adding an additional “high contrast” layer increased your number of modes to <em>4</em>! Not <em>3</em>! It multiplied.</figcaption>
</figure>

You can see how 1 → 2 layers, or “axes,” was a non-issue. But going beyond 2 layers to 3, 4, or even 5 or more, quickly starts to topple your entire system. It accelerates to a point that you can’t even hire a design systems team fast enough to maintain it, even assuming you had the budget in the first place (you don’t). “There must be a better way,” you say.

```
Editor’s note: I was going to make another graphic here that had 8+ columns, and
the columns would have increasingly-desparate sounding names like “oh god,”
“oh fuck,” etc. But I got paywalled by Figma (yes, my own company), because even
they have a limit on how many values they can maintain before charging more $$$.

The problem exists on both sides. It turns out having a button that multiplies
your number of database records exponentially isn’t great software architecture
either. At least both devs and designers agree on this!
```

## Multi-axis-whosie-whatsie?

There isn’t a better way. Thanks for reading! Bye-bye!

<i>“…What? Are you serious?”</i>

Unfortunately, yes. Let’s take another look at trying to come up with a “clever” solution, and we’ll see it doesn’t work.

We’ll keep the scenario of going from 1 → 2 axes, the first being “light/dark” and the second being high contrast mode.

### Failed attempt 1: the cascade, but worse

Breaking out of Figma, and going into CSS, we realize the problem immediately: trying to only declare tokens in 3 sets proves to be a challenge:

```css
[data-theme='light'] {
  --color-text: #101010;
  --color-bg: #ffffff;
  --color-action: #0049e8;
}

[data-theme='dark'] {
  --color-text: #e5e5e5;
  --color-bg: #202020;
  --color-action: #1265e2;
}

[data-highcontrast='true'] {
  --color-text: #000000;
  --color-bg: #ffffff;
  --color-action: #0034a5;
}

/* ❌ What happens for <div data-theme="dark" data-highcontrast="true">?  */
```

We realize immediately that `data-highcontrast` only works for light mode, and not dark mode. So we shaved down our modes from 4 → 3 by _\*checks notes\*_ deleting one. <i>“Hm. I’ll have another go.”</i>

```css
[data-theme='light'] {
  /* … */
  [data-highcontrast='true'] {
    /* … */
  }
}

[data-theme='dark'] {
  /* … */
  [data-highcontrast='true'] {
    /* … */
  }
}
```

<i>”I’ve done it!”</i> you say, a half-second before realizing you are back at the number of tokens you started with. What’s more, you’ve created a scenario where now `[data-theme]` and `[data-highcontrast]` can’t even be on the same HTML element! <i>“No, no, wait—I’ve got it,”</i> you say.

```css
[data-theme='light']:not([data-highcontrast='true']) {
  /* … */
}
[data-theme='light'][data-highcontrast='true'] {
  /* … */
}
[data-theme='dark']:not([data-highcontrast='true']) {
  /* … */
}
[data-highcontrast='true'][data-highcontrast='true'] {
  /* … */
}
```

You’ve fixed your cascade issue, but are still stuck at the same number of tokens. In fact, try this at home—try and come up with a scenario where you can express a 2-axis system in CSS with only 3 selectors. Any system you engineer will have some problem with cascading, or have colors ultimately missing that will lead to a bad experience.

### Failed attempt 2: in colorspace, no one can hear you scream

<i>“Well, of course you wound up with the same number of tokens—you had created all those hex codes manually in the first place! The <em>real</em> solution is in multiplying.”</i>

Asking color science to fix your problems has historically never worked for anyone, and it is no help to us here, either. We could try and use HSL, but in addition to our developers hating us forever, we also reach a dead even more quickly:

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
  --color-text: hsl(var(--color-text-h), var(--color-text-s), var(--color-text));
  --color-bg: hsl(var(--color-bg-h), var(--color-bg-s), var(--color-bg-l));
  --color-action: hsl(var(--color-action-h), var(--color-action-s), var(--color-action-l));
}

[data-theme='light'] {
  --color-text-l: var(--color-text-l-light);
  --color-bg-l: var(--color-bg-l-light);
  --color-action-l: var(--color-action-l-light);
}

[data-theme='dark'] {
  --color-text-l: var(--color-text-l-light);
  --color-bg-l: var(--color-bg-l-dark);
  --color-action-h: var(--color-action-h-dark);
  --color-action-l: var(--color-action-l-dark);
}

[data-highcontrast='true'] {
  --color-text-l: calc(1.2 * var(--color-text-1));
  --color-bg-l: calc(1.2 * var(--color-bg-1));
  --color-action-l: calc(1.2 * var(--color-action-1));
}
```

<i>“I am so clever,”</i> you say, before realizing this doesn’t work at all. Not only is it a tangled _mess_ (for only 3 tokens), this is not how CSS works.

- When CSS variables compose other CSS variables, they have to be redeclared. In `:root`, `--color-text` isn’t even valid because those variables don’t exist, therefore it’s not a color. Defining them later in the stylesheet doesn’t count; you have to copy + paste that entire line again.
- You can’t simply `calc()` into Mordor. `undefined × anything = undefined`.
- Further, even if `calc()` did work in some alternate universe, HSL is [absolute dogshit](/blog/dont-use-hsl-for-anything) so what works for light high contrast won’t work at all for dark high contrast

I know you already get the point, but just to drive the nail through to the absolute center of the earth:

- <i>“Oh, it was just the HSL space that’s bad. What if we used LAB?”</i>
- LAB is [not perceptually-uniform like Oklab/Oklch](https://bottosson.github.io/posts/oklab/)
- <i>“OK, we’ll use Oklab/Oklch then.”</i>
- The WCAG 2.2 standard is based on LAB (D65 whitepoint) so we won’t pass
- <i>“Is there a better standard than WCAG?”</i>
- Not at the moment, unless you count APCA, which is a candidate for WCAG 3 but is closed-license and WCAG 3 doesn’t exist yet.

The TL;DR about color science is human eyeballs are weird, and RGB screens are limited. That means \*\*there is no magic math that will produce even 2 axes’ worth of colors, let alone more. You are welcome to try and prove me wrong! But beware it will take a bigger time investment than you realize.

<figure>
  <img alt="visualization of the OKLCH colorspace, which looks like someone on an acid trip tried to draw the batman logo. It has so many curves and bumps it can’t even be described by a simple mathmatical formula." src="/assets/posts/theres-no-such-thing-as-multi-axis-modes/oklch.png" width="732" height="576" />
  <figcaption>Do you see this ridiculous shape? Simply looking at it is just the tip of the iceberg, my friend. Try creating math that successfully navigates it. (© Evil Martians)</figcaption>
</figure>

### Failed attempt 3: magic?

I’m now an author on the [Design Tokens Spec](https://designtokens.org) which happened because I read every kooky comment posted [on the GitHub repo](https://github.com/design-tokens/community-group), the kookiest of which was [#210: Native modes and theming support](https://github.com/design-tokens/community-group/issues/210), a 60-comment discussion where the smartest design systems thinkers on the internet collectively descended into the depths of madness trying to solve this issue.

I was mentioned in comment #1 on that thread which meant I was dragged down to the pit of hell along with everyone else. For those that haven’t read it, here’s a brief 3-part visual summary:

![screencap of the psychedelic boat scene from Willy Wonka & the Chocolate Factory (1971), where Gene Wilder (Willy Wonka)’s face is overlaid with the GitHub avatar of the original thread starter, and a screenshot of the comment beside him](/assets/posts/theres-no-such-thing-as-multi-axis-modes/dts-01.jpg)

![screencap of the same psychedelic boat scene, where Charlie turns, concerned, to Grandpa. There are 2 screenshots from the GitHub thread showing diagrams](/assets/posts/theres-no-such-thing-as-multi-axis-modes/dts-02.jpg)

![screencap of the same psychedelic boat scene, where Mike TV is screaming, toy gun in hand, raised to shoot the apparitions that appear next to the boat. About 8 GitHub comments are overlaid around Mike TV’s gun, as if he is screaming and shooting at the complex GitHub comments that appear longer, and more complex, than the last, each person showing intense debate over the topic](/assets/posts/theres-no-such-thing-as-multi-axis-modes/dts-03.jpg)

Anyway, about a year later, all of that debate coagulated into a proposal to solve this problem called [The [Token] Resolver proposal](https://resolver-spec.netlify.app/). It describes a mechanism by which token themes can be declared using the absolute minimal syntax possible. It came from Tokens Studio and folks that had dealt with this problem at scale, for years. It has been reviewed by many smart folks. It has also been reviewed by me (not a smart folks). I even [made a working interactive implementation of it](https://dts-playground.pages.dev).

What it does solve:

- Token duplication across modes
- Theme support for people using the Design Tokens spec in a backwards-compatible way
- A code-friendly way to describe Figma Variables and Tokens Studio variables

What it does not solve:

- The problem outlined at the beginning of this blog post

The rub is, even with really fancy abstractions on top, in the end the computer is still going to ask “what color does this need to be?” And if you don’t know, neither does it.

The Resolver spec _is_ really cool. And it _is_ magic how it can remove all duplicate tokens in your system, leaving the minimum number necessary to manage. But removing duplicates doesn’t change that underlying 2D “spreadsheet” like how Figma Variables works today. That’s just the system itself.

---

<i>“No, no, no! You’re just not getting it! Instead of multiplying every token in a single plane, we’ll just create a new ‘axis!’ Then we only have to declare 1 token per plane!”</i>

Brilliant. You’ve succeeded in breaking out of the 2D token spreadsheet, and have entered the 5th dimension. Have fun organizing 5th-dimensional tokens with your 3rd-dimensional brain. Idiot.

## No, really. help.

Figma Variables will get some exciting expansions, _someday_, but ultimately, I think the 2D spreadsheet is here to stay. It is the single most helpful visualization of your system. If it feels complex, it’s because _you’re doing a lot!_ And it _is_ complex. And you should feel amazed at yourself for handling such a complex thing.

<figure>
  <img alt="“you’re doing amazing sweeite” meme, but with Kim covered up by 12 modes: light mode, dark mode, high contrast, high contrast dark, brand 2, brand 3, 2.0 beta, protanopia, deuteranopia, some fuggin last-minute CEO idea" src="/assets/posts/theres-no-such-thing-as-multi-axis-modes/doing-amazing-sweetie.jpg" width="800" height="937" />
  <figcaption>Complexity is complex. More at 7.</figcaption>
</figure>

The best we can do for now is try and declare **layered fallbacks** for each mode. Figma Variables doesn’t support this (yet), but here’s the basic idea. Imagine we are starting from our **Dark High Contrast mode** again, but instead of having to list out every token, we had more of a system like so:

1. If there’s a color defined in `Dark High Contrast`, use that.
2. If not, check `Dark`
3. If not, check `Default (Light)`.

In doing so, we end up with more of a [swiss cheese model](https://en.wikipedia.org/wiki/Swiss_cheese_model) of sorts, only having to declare the absolute minimum number of tokens. But in a way where it’s still dead simple to understand what the color of something will be in any mode.

If you were to think of it in Figma Variable terms, here’s what it may look like: if we found values that were already declared elsewhere, we can simply specify a fallback order in where to look if the value isn’t defined. This means that **only a single mode has to be fully described,** and you only have to manage **the minimum possible number of tokens.**

<figure>
  <img alt="the same 4-column Figma Variables screenshot from before, but 2 color values are empty, with arrows pointing to other modes indicating their fallbacks." src="/assets/posts/theres-no-such-thing-as-multi-axis-modes/003.png" width="1610" height="898" />
  <figcaption>For most practical applications, design token fallbacks only work if you can specify multiple. Like ranked choice voting. If anyone ever figures out how to make that happen.</figcaption>
</figure>

Sure, it’s maybe not the revolutionary change you were hoping for. But it’s as simple as any system can get. And it still leaves you in full control.
