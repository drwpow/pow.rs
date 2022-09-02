---
title: 'Stylable: the good, the bad, the weird'
description: taking the new CSS preprocessor from Wix for a spin
date: 2017-11-27
tags: ['dev']
layout: ../../layouts/post.astro
---

<figure><img src="https://miro.medium.com/max/1400/1*Sb40yvgs-8Kx-fCyLCSXCQ.png"></figure>

[Stylable](https://stylable.io/) is a CSS preprocessor for modern web development. Although it’s a
newcomer to the current CSS-in-JS’ _Looney Tunes_-style fight cloud, it’s not really _CSS-in-JS_ so
much as a thoughtful iteration of the new philosophy of
[CSS Modules](https://github.com/css-modules/css-modules). If you’ve been screaming for all those
CSS-in-JS kids to get off your CSS3 lawn, Stylable might be just the old tune that takes you back to
the good ol’ days.

<figure><img src="https://miro.medium.com/freeze/max/60/1*jJ5CfRjUYLAbppibMQHIfw.gif?q=20"><figcaption>Current CSS-in-JS solutions: an orderly graph</figcaption></figure>

Everything is a JavaScript module in 2017 web development. To say CSS has had a tough time keeping
up with this shift is an understatement. To name a few problems:

1. **CSS is (still) global: **JavaScript modules only expose their names via export &
   import—otherwise everything is isolated. In CSS, every name is global. Of course the simple
   add-a-CSS-file-anywhere-to-access-it was an intentional design decision of CSS that made it
   simple to implement. But that simplicity introduces a lot of technical debt at large scale, and
   so front-end developers responded by inventing invisible rulesets such as
   [SMACSS](https://smacss.com/) and [BEM](http://getbem.com/). While these are viable solutions,
   all of these exhaustive naming structures must be rigidly enforced on a team, otherwise it breaks
   down.
1. **CSS (still) doesn’t tree shak\*\***e:\*\* If you wrote it somewhere, it’s being downloaded and
   inserted. CSS has no clue what styles you are / aren’t using. Better to leave it alone than risk
   breaking something, right? Welcome to the gigabytes and gigabytes of unused CSS that make up the
   web.
1. **CSS (still) doesn’t understand state:** CSS is a brilliant tool for _styling_ state, but it’s
   never had a built-in method for managing state. CSS can only apply styles based on class names;
   it can’t add or remove classes itself. For this reason, JavaScript or server-side rendering is
   required to show state, which means anything generating markup has to know about your CSS class
   names. Now there are invisible threads running all through your application, and when the CSS
   class names change, so must all of these external files. There must be a saner way to manage
   user-facing state that your application actually understands.

Every new styling solution for modern JS frameworks must address these problems.
[Styled Components](https://github.com/styled-components/styled-components),
[Glamorous](https://github.com/paypal/glamorous), and [Aphrodite](https://github.com/Khan/aphrodite)
attempt to solve these problems using JS’s native language solutions to render CSS as it does HTML.
But often, this re-imagining of CSS leaves features by the wayside in pursuit of these problems. For
example, in most of these, it’s hard to write global styles, hard to add webfonts, hard to nest
selectors, hard to use CSS3 animations, and—most dreaded of
all—[the ](https://github.com/styled-components/styled-components/issues/142)`[:hover](https://github.com/styled-components/styled-components/issues/142)`[ + child selector declaration](https://github.com/styled-components/styled-components/issues/142)
(a longstanding problem in CSS-in-JS that’s only been effectively addressed very recently).

Stylable, on the other hand, attacks this problem from the CSS end, and does a pretty good job of
preserving CSS while pushing the language forward. There are pros and cons to both approaches, which
we’ll cover, but Stylable offers some compelling new solutions that make it a worthwhile addition.

# The good

## Stylable is 100% CSS, and then some

In case I didn’t say it before, I’ll say it again: with Stylable, you get CSS, and every part of
CSS. This seems like a “duh” observation, but this is significant if you’ve ever battled with a
CSS-in-JS framework over a lost or “hacky” implementation of a basic CSS feature. If this is all
you’re looking for, stop reading here and try it out!

## CSS in React has never been simpler

Stylable has a [React helper](https://github.com/wix/wix-react-tools) that wraps components, and
gives you a hook for styling. Here’s the Header component from
[Stylable’s create-react-app](https://stylable.io/docs/getting-started/install-configure) example:

```jsx
import React from 'react';
import { properties, stylable } from 'wix-react-tools';
import style from './header.st.css';

…

const Header = stylable(style)(properties((props: HeaderProps) => (
  <header>
    <img src={reactLogo} className="reactLogo" alt="logo" />
    <img src={stylableLogo} className="stylableLogo" alt="logo" />
    <h1 className="title">{props.message}</h1>
  </header>
)));
```

See the `className="reactLogo"`? You can string together CSS classes just like the good-old days!
Uh-oh—that means `reactLogo` is global, right? Nope! The final output class is
`.header1839991338--reactLogo`. Not only is it scoped to this component only, but it’s also kept its
human-readable name so we can easily debug our style tree if something goes awry.

Adding additional classes is exactly as you’d expect:

```html
<div className="someClass otherClass"></div>
```

That’s it—simple, manageable, predictable.

## Stylable plays nicely with other systems

Still using wix-react-tools, let’s add a `.notInFile` class that’s missing from the `header.st.css`
Stylable file (the `.st.css` file extension connotes a Stylable CSS file):

```html
<div className="fromFile1 fromFile2 notInFile"></div>
```

If you expected `.notInFile` to be namespaced, or if you expected it to be stripped out entirely,
you’d be wrong! This is the output markup:

```html
<div class="header1839991338--fromFile1 header1839991338--fromFile2 notInFile"></div>
```

It didn’t namespace `notInFile` because it knows it’s not a part of your Stylable file. Not only is
it flexible; Stylable plays nicely with other systems, too.

## CSS gets brilliant state management ✨

So what about dynamic classes / props like Styled Components has? Getting to props is actually my
favorite part of Stylable. For dynamic classes, of course you can use template literals if that’s
your jam:

```html
<div className="{`defaultClass" ${dynamicClass}`} />
```

But Stylable has something far more powerful built-in: a tool they call
[custom pseudo-classes](https://stylable.io/docs/references/pseudo-classes). It’s so smart I hope
this actually becomes part of the CSS spec. Now you have things like this:

```css
.root {
  -st-states: toggled, loading;
  color: black;
}
.root:loading {
  color: green;
}
.root:toggled {
  color: red;
}
.root:loading:toggled {
  color: blue;
}
```

One glance at this, and you can tell exactly what every element’s styling should be! No boilerplate
`if / else` operators or ternaries, or wondering if `.loading` is a state class or a standalone
element.

The React side is every bit as clean thanks to the `style-state` prop helper:

```jsx
<div style-state={{ loading: false, toggled: true }}>
```

Stylable uses CSS’s own syntax to encapsulate class names while exposing an API for JS. Your JS
doesn’t have to manage CSS classes, and your CSS is completely free from logical `if / else`
operators. Because Pseudo-classes are chainable, every state can be accounted for and styled, with
the fallbacks evident as well. And chained classes are always applied with their higher specificity,
to boot, no matter what order they appear in. Very clever!

# The bad

## No nested styles

This is a tough downgrade from Sass and the other libraries: no nesting. Even
[cssnext](http://cssnext.io/features/#nesting) has nesting, which allows you to do things like:

```css
.link {
  color: #0f0;
  transition: color 200ms;

  &:hover {
    color: #080;
  }
}
```

Which is so much more readable and composable. In this regard, Stylable throws you back to the
stone-age, where you have to re-declare selectors over and over again for every single block, like
some stone-age peasant.

## Doesn’t (totally) tree shake

In Stylable, if I have the following:

```css
.unused-class {
  font-family: fantasy;
}
```

That’s going to make it into production assuming its containing file is `import`ed somewhere,
whether or not I end up using that class. Compare that to Styled Components in a separate file:

```jsx
import styled from 'styled-components';
const UnusedClass = styled.div`
  font-family: fantasy;
`;
export { UnusedClass };
```

If that `UnusedClass` wasn’t imported anywhere, or if it was `import`ed but never called, it will be
stripped from production. JS still holds the advantage here.

# The weird

## Magical roots

Consider the following Stylable CSS for one component:

```css
.root img {
  height: 100px;
}
.logo {
  height: 80px;
}
```

You’d expect `.root img` to override `.logo`, right? Class selector + element selector &gt; class
selector, right? Wrong! Stylable invisibly prefixes every non-`.root`. So even though it reads as
`.logo`, it’s actually `.root .logo`. Even though we’d expect `100px` to be the final value, the
actual value is `80px`.

Once you realize this, it’s a trivial detail, but this magic can be a real head-scratcher if you’re
not anticipating it. You can avoid this altogether by trying to never use the `.root` class, but
there are many scenarios where this is unavoidable.

## Modifiers using…pseudo-elements?

For as much as I love Stylable’s use of custom pseudo-classes, I’m a bit puzzled as to how they
handle component modifiers:

```css
:import {
  -st-from: './video-player.st.css';
  -st-default: VideoPlayer;
}
.mainVideo {
  -st-extends: VideoPlayer; /* define mainVideo as VideoPlayer */
}
.mainVideo::playbutton {
  /* override mainVideo playButton */
  background: green;
  color: purple;
}
```

The gist here is that you’re creating a new modifier of a base component, `VideoPlayer`, and
overriding its `.playButton` child class. This implementation is curious not only because of how
pseudo-elements are used in CSS, but also because this seems to break single-file dependency. While
this file makes it clear it’s depending on `VideoPlayer`, the same can’t be said for the
`video-player.st.css` file—it’s likely another developer could edit that file unaware it’s silently
affecting other files. This is an anti-pattern, especially in the world of JS models.

On the other hand, I do see some potential in this, but perhaps only if you kept it to very, very
low-level utility components. Overall, I’m just not sure what to think about this feature yet.

## The variables are okay

Importing variables is very JS-like:

```css
:import {
  -st-from: './colors.css';
  -st-named: black, blue;
}
.root {
  color: value(black);
}
.link {
  color: value(blue);
}
```

That’s basically the equivalent of writing `import { black, blue } from './colors.css';`. It becomes
a bit tedious (and strange) manually importing/exporting named variables, but overall I respect the
design decision behind it. I think this approach is a wash compared to the escaped template literals
(`color: ${black}`) in Styled Components, et al.

# So, is Stylable worth using?

There’s a lot to love about Stylable, and it brings a lot of new concepts to the table. In its
current state, I think I still prefer Styled Components when it comes to styling in React. I’ve
gotten used to composing CSS dynamically using JS, and I personally love the simplicity of having
`.js` files that store all your styling constants like colors, typography, grid, and responsive
settings—you never know when JS needs access to these values for animations and transitions.

That said, I do think the current generation of CSS-in-JS isn’t sustainable, at least for CSS. It’s
currently a bastardization of many of CSS’ original design decisions, and I believe CSS will evolve
and adapt in time. In that regard, I have very high hopes that Stylable will be a viable option and
will grow and adapt with CSS. Stylable is very pro-CSS, which I think is the safest bet long-term.
So while I may not be hopping on the Stylable bandwagon just yet, I think either a future version of
Stylable or something born directly from it will someday be the new standard.

In short:

## Stylable is great for:

- Developers that just miss plain-ol’ CSS
- Legacy apps with lots of existing (non-Sass) CSS that are currently being upgraded to Reactlandia
- Developers who want to invest long-term into a CSS system that will be around for years, and
  aren’t satisfied with the current CSS-in-JS landscape.

## Stylable is not so great for:

- Developers that have established a good workflow with Styled Components or similar CSS-in-JS
  libraries
- Developers that prefer JS to CSS in general (disregarding the fact your animations should all
  happen in CSS whenever possible)
