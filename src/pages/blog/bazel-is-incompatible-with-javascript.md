---
title: Bazel is incompatible with JavaScript
description: If you don’t know what Bazel is, you not only can skip this blog post; I envy you greatly.
date: 2024-10-13
updated: 2024-01-24
tags:
  - dev
layout: ../../layouts/post.astro
---

[Bazel](https://bazel.build/) is an open source fork of Google’s internal tooling, Blaze, that I’ve had the misfortune of fighting with for the past year. It promises a mouthwatering smorgasboard of:

- Incremental builds
- Build caching
- Remote build caching
- Support for any programming language, any codebase, and any possible deploy target

The reviews are great. It has a passionate fanbase. It’s well-maintained and supported. There's just one itty-bitty problem that gets overlooked by the people opting for it: _it's useless for JavaScript_. In this blog post we’ll dig into why Bazel shouldn’t touch ANY JavaScript, TypeScript, or Node.js at all.

![@BenLesh on x.com: “I loved Blaze (Bazel) at Google... But your company will never, ever be able to do Bazel like Google does Blaze. And while it probably helps the build  pipeline for your JVM-based whatever backend, it's an absolute hinderance for TypeScript/JavaScript development.”](/assets/posts/bazel-is-incompatible-with-javascript/ben-lesh.png)

## TL;DR

“I don’t use Bazel and don’t care. I found this Googling and just want to know what I _should_ use.” Use [Turborepo + pnpm](https://turbo.build/repo). Turborepo is designed for how JS works from the ground-up, and does a lovely job at delivering on all of Bazel’s promises but tailored to the JS ecosystem. Though I won’t mention Turborepo again in this blog post, just know for every criticism levied against Bazel, I can’t say the same for Turborepo.

“What about Nx?” I've had a lot more papercuts with Nx because they try and follow Bazel philosophy more closely, but compromise on what parts don't fit into JS. So while you don’t have the full-on headaches, you have a _compromise_ of the headaches.

Anyways, with that out of the way…

## Inputs and outputs

Let’s back up a bit and lay some groundwork. The underlying principle of skipping work is **determinism.** Or more specifically, the idea that **if the inputs don’t change, the outputs shouldn’t,** therefore, no reason to rebuild (assuming it’s a [pure system](https://en.wikipedia.org/wiki/Pure_function)).

Bazel—and any other build system for that matter—operates off this principle of “identify the inputs, and you can determine whether or not a rebuild is necessary.” Everyone is on board at this point. But where it oversteps is it needs to know the _outputs_ ahead of time, too, Which doesn't work for JS.

## Problem 1: Assistant to the Micromanager

Much of the existing Bazel + JS systems have focused on `tsc` generation: for every `.ts` file, build one `.js` file. While that is a common usecase, friend, if you think that's all JS build tools do, I've got really bad news.

There are 2 really common patterns in JS that are currently unsolved problems in Bazel: npm packages, and bundled sites.

An npm package needs to build `.mjs`/`.js`, `.cjs`, corresponding `.d.mts` and `.d.cjs` declarations, as well as `*.map` files for all of the above. And based on the environments it runs in, they likely won’t be 1:1 with the source `.ts` files. But in a package, **the inputs alone do not determine the outputs; they are only half of the equation.** You may bundle your CJS build into one file, or your ESM, or both. You may choose to even have a “lite” version of your package that leaves out heavy modules. In both cases the output, structure, filenames, and everything are fluid and not predictable, and are a product of the inputs **+ the build system** (Rollup, etc.). Bazel would want me to give it a full list of every file in my package ahead of time. Which means I have to manually write down a list of possibly hundreds of files before any build will work.

For the bundled site, consider an Astro site (like this one!). It can handle any filetype the web can (because we’re building a website). But what’s more, we have things like PageFind, where based on the contents of other files, we will get about 50+ `.pf_meta`/`.pf_index`/`.pf_fragment` files, randomly-hashed, indexing the site for search. Bazel would want me to tell it ahead of time what all those random files will be named I have no control over that are critical to the functioning of my site.

No.

## Problem 2: What we have is a failure to communicate

If typing out lists of filenames doesn't sound that bad to you, I've got even worse news: _you can’t run npm CLIs._ That’s right. All your favorite npm tools? _Poof._ Gone.

Let's say you have an existing Rollup build you want to Bazelify. You describe all your inputs and outputs, but… how do you run `rollup -c`? You can’t!

After hours of research you‘ll find:

- `rules_js` kinda has a thing where you can point to a `bin` inside an npm package. But it blows up for many packages.
- You find a `js_binary` macro, but that's for running JS scripts _you_ own, not npm CLIs (but you can spawn child processes to run npm CLIs except you might as well not use Bazel at that point).

You come to the realization that you can’t just run commands like you used to. You have to write an entire [Starlark](https://bazel.build/rules/language) wrapper for the npm package you use. You find `rules_rollup`, thinking you’re saved, except it only has a placeholder test that’s just a proof of concept. So you write your Starlark wrapper, taking an extra week or two to work on this. And in the end, out of tiredness, you’ve skipped recreating all the features you didn't use. It works. Barely.

![2 weeks later](/assets/posts/bazel-is-incompatible-with-javascript/2-weeks-later.jpg)

Now onto your 2nd npm CLI. Oh God. Weeks have gone by, just trying to get a thing running that normally takes 15 minutes. You claw your way back to normalcy, with it barely running. Then you change your Rollup config and your rules_gen breaks. You break.

## Problem 3: Dante’s 9 circles of hermeticity

Even assuming you are able to get a JS project running exactly as it did, the final boss is [_hermeticity_](https://bazel.build/basics/hermeticity) where it doesn't do anything in your local `node_modules` (of course not! That would be silly). It copies everything into a secret location on disk where it does work.

“What’s that error?” you say. You forgot to copy your `node_modules` into the secret location. “It’s still blowing up.” No, _all_ of your `node_modules`. List them out. Every single one. Even the sub-dependencies. “OK it ran… where are my files?” Still in the super-secret location we can’t tell you about. What are their names? What are their contents? Who knows!

“Just tell me how to get my files back.” You have to create a _build target_ selecting those files. “Then what—they’ll appear locally?” No, silly! A target only gives Bazel a list of files; you have to import and run another `copy_to_directory` macro to write those files back to your local workspace. “OK that worked but the files are in the wrong locations?” Oh, right, right—it actually didn’t build them like Node.js would have so you’ll need to rename and remap all the files back to their correct locations (and maybe fix some broken JS imports too).

“OK all that is done; now I want to run a followup command that generates my next set of files to the same location.” Nope! _Bzzzzzt_. Not possible at this time. You may only run one build task per output directory. Please try again later.

## Problem 4: the times they are a-changin’

Some of the afore-mentioned would be workable if your investments in Bazel paid dividends down the line. But the biggest mistake I see Bazel users making is **underestimating how quickly the JS exosystem evolves.**

The sad truth is Bazel requires _increasing_ amounts of time and energy to maintain your infrastructure of Starlark wrappers and shim code teaching Bazel about JS. Imagine having to redo this every month. Every time a major version of an npm package is released. Every time a Rust counterpart is released that’s orders of magnitude faster (that’s [Rolldown](https://rolldown.rs/guide/)). Every generation of JS tooling requires _more_ time plugging into Bazel because it’s evolutionarily more complex. But you’ll never benefit from all these new tools because you’re too busy trying to catch up to the previous generation and get it running in Bazel.

But the _real_ pointlessness is in the payoff—you think your Bazel wrappers actually improve the tool by caching output. But the reality is the tool that just came out completes its builds in less time than it takes to spin up a Bazel server and analyze the existing cache. It’s over. The JS ecosystem won. There’s no need to even use Bazel anymore with new tools.

## Summary

<figure>
  <img width="660" height="396" src="/assets/posts/bazel-is-incompatible-with-javascript/tacky.gif" alt="“You’re tacky, and I hate you.” (School of Rock)" />
  <figcaption>In summary, Bazel, you’re tacky and I hate you.</figcaption>
</figure>

At the end of the day, a build system just won’t work for all languages, and that’s OK. Bazel was designed for a different usecase than JS. And it’s natural that Bazel tried to solve a problem for everyone, especially with the growing popularity and maturation of JS. And I applaud all the lovely contributors and maintainers that are making an effort at making Bazel better! But that doesn’t mean I’d touch Bazel with a 10 foot pole for handling JS right now.

But rather than end on a sour note and be a downer, I know a natural question is “well if all that is true, then what _would_ make Bazel compatible with JS?” And to give a more concrete answer than “make it like Turbopack” (OK, I lied—I did end up mentioning it again), only 3 changes would be required:

1. **Bazel runs npm executables with zero config.** The entire Node.js world operates off npm executables. Everything meaningful happens in npm scripts—building, linting, testing. All the problems of bottom-up building, working local dev setup, and reliability are all handled by Bazel deferring to… the thing that already existed and is already working as expected. Bszel needs to run zero-config commands just like Turborepo does.
2. **Bazel treats local `node_modules` as the canonical source.** All Node.js tools rely on the `node_modules` local directory to share cache, and talk to other packahes. This is what powers Electon ecosystems like VS Code. Don’t overlook all the optimizations npm packages are using that all happen in that local folder—not in the hermetic layer.
3. **No rules_ts.** In case it hasn’t clicked, evidence of Bazel’s incompatibility has been right under your nose the whole time. If Bazel Just Worked™ with the npm ecosystem, rules_ts goes away. After all, TypeScript is just another package. The fact that Bazel requires a heavyweight wrapper for every tool you use is not a sustainable development model. Bazel will always be playing catchup to JS’ ecosystem. But if Bazel truly integrated with JS, `rules_js` would be the end-all be-all.

Will all these changes happen? Who can say. The Bazel project and its devs doesn’t owe me, or anyone else for that matter, anything. And these changes would probably disrupt all the things it’s doing properly. But until these changes are made, I’ll personally be using anything _but_ Bazel for JS. And you should too.
