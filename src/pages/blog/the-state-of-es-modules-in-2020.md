---
title: not enough people are talking about ES Modules
date: 2020-03-08
updated: 2020-04-21
description: |
  JavaScript changed forever in 2019. Did you miss it?
tags: ['dev']
layout: ../../layouts/post.astro
---

**In 2019, a revolution happened in JS.** You may have missed it. All [major browsers][esm-browser]
and [Node.js][esm-node] added native support for ES Modules (ESM)—no Babel, transpiling,
preprocessing, or trickery needed.

If you’ve written JavaScript in the time before React & webpack, you remember how much of a mess it
was without `import` or `require()`. You had to be intimately familiar with `this` and lexical
scoping, otherwise it’d come back to bite you. All JS having global scope (even vendor scripts) was
_hard_ to do well, which often meant you limited its reach. JavaScript was maligned in other
programming communities for the things it lacked compared to more mature languages, chiefly of all,
a module system.

That changed in 2019, when the ESM proposal became a reality, not something that only lived in the
make-believe world of webpack & Babel. JavaScript _finally_ got the thing everyone had been asking
for.

So why didn’t more people notice?

## the land of make-believe

In preparing [for a talk I gave][pika-web] last year, I realized just how much JS has changed over
the last decade. Node.js was released in 2010 with the CommonJS module system, and as a result, npm.
That’s over 10 years of CommonJS we’ve been writing, and we’re not slowing down there (if this is
all mumbo-jumbo to you, hopefully [my talk][pika-web] will help).

In the land of Node, we got Gulp, Grunt, Babel, webpack, Browserify, and Rollup. These are all tools
that fundamentally changed how we wrote JS. And they all, in their own unique ways, compensated for
JS’ lack of a module system. Gulp and Grunt gave you more tools to invent your own bundle, whereas
Browserify and webpack embraced the idea of a JS module system by completely simulating it, and
abstracting it away from you. Babel made everything possible.

But the point is: all of these tools over the past 10 years created a land of make-believe that JS
itself (or browsers) didn’t support. This wasn’t a bad thing, as it let us code more, faster, and we
got to stress-test the future before actually arriving—all good things.

But now we don’t need it anymore, and it’s hard to change everything and start over again. And
perhaps that fear of starting over—again—has kept us from recognizing the exciting new future. Yet
we must move forward.

## why switch to ESM

So, why switch to ESM? What do we stand to gain by changing everything?

### universal JS

The same JavaScript you write for the browser, works in the server. While that was the _promise_ of
Node.js, over time it’s shifted away from ECMAScript to become its own language. ESM would bring
everything back under one roof again.

### remote imports

This is _huge_. We can import any module from anywhere on the internet, and **are no longer bound to
npm.** Consider [Deno][deno], a new V8/Rust/Tokio runtime that might replace Node.js. This is a line
from the [docs][deno-docs]:

> **Comparison to Node.js**<br/> Deno does not use `npm`

This single, understated line is a huge shift. How can you just… _move away_ from the most popular
package repository in history? Well thanks to ESM, you can load modules from any URL, whether that
be locally, or a CDN. `npm install` is now no longer needed; the language itself supports
cross-domain modules!

### no bundling or transpilation needed

Imagine a world where you don’t need to run any CLI command whatsoever to start a front-end
application. No runtime, webpack, build times… _nothing_.

To learn more about this, check out _[A future without webpack][pika-webpack]_.

### near-perfect caching

In the webpack world before ESM, you had to make trade-offs: rolling everything into one giant
bundle meant no load times after initializing, but that initial download is brutal. Conversely,
“code splitting” into tiny chunks made each chunk easily-downloadable but code is almost certainly
duplicated across those chunks and a user will be paying for the same weight over and over again (🤔
not entirely unlike buying a home with cash or paying it off over 30 years, now that I think about
it).

With ESM, the entire dependency tree is exposed to the browser, so the browser can perfectly cache
what it needs, and nothing more (imagine if you paid nothing on your home to start, zero interest
ever, and you only paid for the parts of the home you used, as you used them). Of course, _cache
invalidation_ is a separate problem that will be with us until the end of time. But that aside, ESM
truly is the perfect caching story for JS.

## making the switch

So let’s say you’re sold on ESM… how do you make the leap? Well, it may be your tools that are to
blame:

- **React:** doesn’t ship an ESM-ready package (as of [Mar 2020][esm-react])
- **npm:** `< 8%` of npm packages [ship ESM][esm-npm] (as of [Oct 2019][esm-npm])
- **Node.js:** though it supports ESM, it’s not in a stable LTS release yet (as of [Nov
  2019][esm-node])
- **webpack**: can’t ship your code as ESM, nor can it take advantage of ESM features like remote
  imports.

By choosing these tools even in new projects, you’re shipping legacy code that already has a limited
lifespan. But some of that isn’t within your control, sure—maybe your company, or client demands
these. Or you just can’t accomplish what you need to with alternatives; that’s understandable.

But there are also some new, exciting projects on the horizon that are shaping up to replace
now-legacy CommonJS tools:

### Snowpack

[Snowpack][snowpack] (a play on ”no pack”) is an install tool (disclosure: that I’m one of the [lead
contributers for][snowpack-contrib]) that lets you ship ESM-ready code straight to the browser
**and** use npm. You can `npm install` like normal, and lets you use Preact, Vue, Svelte, and more
but with **zero build time** and **no configuration.**

[snowpack.dev][snowpack]

### Pika CDN

[Pika Registry][pika-registry] does all the work of finding ESM-ready packages for you. Search for
any keyword like you would on npm, except Pika Registry can tell you instantly whether or not that
package supports ESM.

[pika.dev/registry][pika-registry]

### Deno

[Deno][deno] is a new competitor to Node.js, built with V8, Rust, and Tokio and features native
TypeScript and ESM support out-of-the-box. Its guiding principle is to more closely mirror
ECMAScript in the areas where Node departed, principally only allowing ESM rather than CommonJS.
Though the project is in beta, it’s already gathering community attention and shows tons of promise.

[deno.land][deno]

To recap, the current state of ESM in 2020 is: **it’s ready to use everywhere,** but **it’s up to
you to opt-in!** Give some of the new ESM tools a try, and you might find yourself dealing with less
tooling, less configuration, and other great benefits while helping the community at large unify
around ESM.

[deno]: https://deno.land/
[deno-docs]: https://deno.land/std/manual.md#introduction
[esm-browser]: https://caniuse.com/#feat=es6-module
[esm-node]:
  https://medium.com/@nodejs/announcing-core-node-js-support-for-ecmascript-modules-c5d6dc29b663
[esm-npm]: https://www.pika.dev/about/stats
[esm-react]: https://github.com/facebook/react/issues/11503
[pika-registry]: https://www.pika.dev/registry
[pika-webpack]: https://dev.to/pika/a-future-without-webpack-ago
[snowpack]: https://www.snowpack.dev/
[snowpack-contrib]: https://github.com/pikapkg/snowpack/graphs/contributors
[pika-web]: https://www.youtube.com/watch?v=Sn2e62CZ41g
