---
title: Bazel is incompatible with JavaScript
description: If you don’t know what Bazel is, you not only can skip this blog post; I envy you greatly.
pubDate: 2024-10-13
updated: 2025-06-22
tags:
  - dev
layout: ../../layouts/post.astro
---

[Bazel](https://bazel.build/) is an open source fork of Google’s internal tooling, Blaze, that I’ve had the misfortune of fighting with for the past year. It promises a mouthwatering smorgasboard of:

- Incremental builds
- Build caching
- Remote build caching
- Support for any programming language, any codebase, and any possible deploy target

The reviews are great. It has a passionate fanbase. It’s well-maintained, has a full-time company supporting development, and even has conferences and meetups. There's just one itty-bitty problem that gets overlooked by the people opting for it: _it's useless for JavaScript_. In this blog post we’ll dig into why Bazel shouldn’t touch ANY JavaScript, TypeScript, or Node.js at all.

![@BenLesh on x.com: “I loved Blaze (Bazel) at Google... But your company will never, ever be able to do Bazel like Google does Blaze. And while it probably helps the build  pipeline for your JVM-based whatever backend, it's an absolute hinderance for TypeScript/JavaScript development.”](/assets/posts/bazel-is-incompatible-with-javascript/ben-lesh.png)

## TL;DR

“I don’t use Bazel and don’t care. I found this Googling and just want to know what I _should_ use.” Use [Turborepo + pnpm](https://turbo.build/repo). Turborepo is designed for how JS works from the ground-up, and does a lovely job at delivering on all of Bazel’s promises but tailored to the JS ecosystem. Though I won’t mention Turborepo again in this blog post, just know for every criticism levied against Bazel, I can’t say the same for Turborepo.

“What about Nx?” I've had a lot more papercuts with Nx because they try and follow Bazel philosophy more closely, but compromise on what parts don't fit into JS. So while you don’t have the full-on headaches, you have a _compromise_ of the headaches.

## Inputs and outputs

Let’s back up a bit and lay some groundwork. The underlying principle of skipping work is **determinism.** Or more specifically, the idea that **if the inputs don’t change, the outputs shouldn’t,** therefore, no reason to rebuild (assuming it’s a [pure system](https://en.wikipedia.org/wiki/Pure_function)). Most build systems strive for determinism, and Bazel is no different.

But where Bazel oversteps for JavaScript is it needs to know the _outputs_ ahead of time, too. That is very reasonable in most compiled languages which only output a handful of things. But in the JavaScript ecosystem, a build can produce anywhere from 1 to 1,000+ outputs, which is untenable. It’s almost like saying “before we run this mathematical equation, we first have to know what the answer is to run it.” It doesn’t make any sense. At this point why do we even have math? Needless to say, it’s at the “knowing the outputs ahead of time” part that JS has now jumped ship.

## Problem 1: no boundaries

Much of the existing Bazel JS tooling has tunnel vision on a single TypeScript usecase: for every `.ts` file, build one `.js` file. While that is _one_ usecase, friend, if you think that's all JS build tools do, I've got really bad news.

Look into any medium-size npm package and you’ll find `.mjs`, `.js`, and `.cjs` to support ESM and CommonJS, corresponding `.d.mts` and `.d.cjs` declarations to satisfy TypeScript, as well as `*.map` files for all of the above so debugging is easy. Of course, all these outputs likely won’t be 1:1 with the source `.ts` files—sometimes CommonJS will be bundled or vice-versa. Sometimes there are “lite” builds for clients. There really is no association with the entry files because it’s hand-tailored to what the package does and the philosophy it embodies. In other words, the package’s contents are a product of both the **inputs _AND_ the build system**. Bazel oversteps its boundaries by trying to _be_ the build system, but without providing any possible way for that to even happen.

For npm packages it’s _borderline_ unmaintainable.

For the bundled site, consider an Astro site (like this one!). It can handle any filetype the web can (because we’re building a website). But what’s more, we have things like PageFind, where based on the contents of other files, we will get about 50+ `.pf_meta`/`.pf_index`/`.pf_fragment` files, randomly-hashed, indexing the site for search. Bazel would want me to tell it ahead of time what all those random files will be named I have no control over that are critical to the functioning of my site.

For bundled sites, it’s _outright_ unmaintainable.

## Problem 2: anything you can do, I refuse to do in the first place

If generating hundreds of filenames doesn't sound that bad to you, I've got even worse news: _you can’t run npm executables._ That’s right. All your favorite npm CLIs? _Poof._ Gone.

Let's say you have an existing Rollup build you want to Bazelify. You describe all your inputs and outputs, but… how do you run `rollup -c`? You can’t!

After hours of research you‘ll find:

- `rules_js` kinda has a thing where you can point to a `bin` inside an npm package, but it doesn’t work half the time. Or if it does, you find that it escapes the sandbox half the time anyway unless you patch it or turn off half of the settings.
- You find a `js_binary` macro, but that's for running JS scripts _you_ own, not npm CLIs (but you can spawn child processes to run npm CLIs except you might as well not use Bazel at that point).
- You find `rules_rollup`, thinking you’re saved, except it only has a placeholder test that’s just a flimsy proof of concept.

You slowly come to the realization you’re going to have to make an entire [Starlark](https://bazel.build/rules/language) wrapper. taking a week or two to work on this. You run into dead end after dead end. You fear the reason you can’t find others have paved this path before you is because it’s a bad idea. In the end, you get it working, but out of tiredness you’ve skipped recreating all the features you didn’t use.

![2 weeks later](/assets/posts/bazel-is-incompatible-with-javascript/2-weeks-later.jpg)

Now onto your 2nd npm executable. Oh God. Weeks have gone by, just trying to get a thing running that normally takes 15 minutes. You claw your way back to normalcy, with it barely running. Then you change your Rollup config and your `rules_gen` breaks. You break.

## Problem 3: Dante’s 9 circles of hermeticity

Even assuming you are able to get a JS project running exactly as it did, the final boss is [_hermeticity_](https://bazel.build/basics/hermeticity) where it doesn't do anything in your local `node_modules` (of course not! That would be silly). It copies everything into a secret location on disk where it does work, which if you’ve worked with Node.js in any capacity you’d know is the single dumbest thing you can do.

“What’s that error?” you say. You forgot to copy your `node_modules` into the secret location. “It’s still blowing up.” No, _all_ of your `node_modules`. List them out. Every single one. Even the sub-dependencies. “OK it ran… where are my files?” Still in the super-secret location we can’t tell you about. What are their names? What are their contents? Who knows!

“Just tell me how to get my files back.” You have to create a _build target_ selecting those files. “Then what—they’ll appear locally?” No, silly! A target only gives Bazel a list of files; you have to import and run another `copy_to_directory` macro to write those files back to your local workspace. “OK that worked but the files are in the wrong locations?” Oh, right, right—it actually didn’t build them like Node.js would have so you’ll need to rename and remap all the files back to their correct locations (and maybe fix some broken JS imports too).

“OK all that is done; now I want to run a followup command that generates my next set of files to the same location.” Nope! _Bzzzzzt_. You can only perform one task per output directory. Idiot.

## Problem 4: the times they are a-changin’

Some of the afore-mentioned would be workable if investments in Bazel paid dividends down the line. But the biggest mistake I see Bazel users making is **underestimating how quickly the JS ecosystem evolves.**

Smart technical decisions require less investment over time. Bazel requires _increasing_ amounts of time and energy to maintain your infrastructure of Starlark wrappers and shim code teaching Bazel about JS. Imagine having to redo this every month. Every time a major version of an npm package is released. Every time an OSS project fails out of maintenance and a new one takes its place. Every time a quantum leap forward happens in research. Every generation of JS tooling requires _more_ time plugging into Bazel because it’s evolutionarily more complex. But you’ll never benefit from all these new tools because you’re (still) trying to catch up to the previous generation.

But the _real_ pointlessness is the fact that the JS ecosystem gets orders of magnitude faster every generation. All that work you spent building a wrapper for the slow JS tool that sped it up by 25% would have been better served upgrading to its successor that’s 1,000% faster. I’m not even talking hypothetically: webpack was replaced by [Vite](https://vite.dev), [esbuild](https://esbuild.github.io/), and soon [Turbopack](https://turbo.build/pack/docs), Rollup with [Rolldown](https://rolldown.rs/guide/), ESLint with [Biome](https://biomejs.dev/), PostCSS with [Lightning CSS](https://lightningcss.dev). If you’re using Bazel to **speed up CI,** then compare apples to apples. Focus on speeding up CI. And usually that fast track is leaning into the hundreds of thousands of smart JS devs that would absolutely love to help you with that.

## Summary

<figure>
  <img width="660" height="396" src="/assets/posts/bazel-is-incompatible-with-javascript/tacky.gif" alt="“You’re tacky, and I hate you.” (School of Rock)" />
  <figcaption>In summary, Bazel, you’re tacky and I hate you.</figcaption>
</figure>

At the end of the day, a build system just won’t work for all languages, and that’s OK. Bazel was designed for a completely different ecosystem than a JIT scriping language. And it’s natural that Bazel tried to solve a problem for everyone, especially with the growing popularity and maturation of JS. And I applaud all the lovely contributors and maintainers that are making an effort at making Bazel better! But that doesn’t mean I’d touch Bazel with a 10 foot pole for handling JS right now.

But rather than end on a sour note and be a downer, I can sum up what _would_ make Bazel compatible with JS with a more concrete answer than “make it like Turbopack” (OK, I lied—I did end up mentioning it again), only 3 changes would be required:

1. **Bazel runs npm executables with zero config.** The most important tools in the ecosystem——build systems, linters, test runners—run via CLI and npm bins. Having to rewrite every CLI we want to use in Starlark is insane; we should just be able to use the damn thing.
2. **Bazel treats local `node_modules` as the canonical source.** That’s right, no sandbox, no hermiticity. All Node.js tools rely on the nested `node_modules` all the way up the file tree to share caches and resolve packages. Node.js has never been sandboxed, and never will be. You’re only lighting compute on fire going against a decade of how Node.js has worked from day 1, and has millions of developers relying on this system.
3. **No `rules_ts`.** Evidence of Bazel’s incompatibility has been right under your nose the whole time. If Bazel Just Worked™ with the npm ecosystem, `rules_ts` goes away. After all, TypeScript is a package just like any other. The fact that Bazel requires a heavyweight wrapper for every tool you use is not a sustainable development model. Bazel will always be playing catchup to JS’ ecosystem. But if Bazel truly integrated with JS, `rules_js` would have everything you needed.

Will all these changes happen? I don’t know. And I’m not making ’em. But until these changes are made, I’ll personally be using anything _but_ Bazel for JS. And you should, too.
