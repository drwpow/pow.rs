---
title: Bazel is incompatible with JavaScript
description: If you don’t know what Bazel is, you not only can skip this blog post; I envy you greatly.
pubDate: 2024-10-13
updated: 2026-02-21
categories: ["dev"]
---

[Bazel](https://bazel.build/) is an open source fork of Google’s internal tooling, Blaze, that I’ve had the misfortune of fighting with for the past year. It promises a mouthwatering smorgasboard of:

- Incremental builds
- Build caching
- Remote build caching
- Support for any programming language, any codebase, and any possible deploy target

Bazel has a passionate fanbase. It has great reviews from C++ devs. It seems well-maintained, has a full-time company supporting development, and even has conferences and meetups. There's just one itty-bitty problem that gets overlooked by the people opting for it: _it's useless for JavaScript_. In this blog post we’ll dig into why Bazel shouldn’t touch ANY JavaScript, TypeScript, or Node.js at all.

![@BenLesh on x.com: “I loved Blaze (Bazel) at Google... But your company will never, ever be able to do Bazel like Google does Blaze. And while it probably helps the build  pipeline for your JVM-based whatever backend, it's an absolute hinderance for TypeScript/JavaScript development.”](/assets/posts/bazel-is-incompatible-with-javascript/ben-lesh.png)

## TL;DR

“I don’t use Bazel and don’t care. I found this Googling and just want to know what I _should_ use.” Use [Turborepo + pnpm](https://turbo.build/repo). Turborepo is designed for how JS works from the ground-up, and does a lovely job at delivering on all of Bazel’s promises but tailored to the JS ecosystem. Though I won’t mention Turborepo again in this blog post, just know for every criticism levied against Bazel, I can’t say the same for Turborepo.

“What about Nx?” I've had a lot more papercuts with Nx because they try and follow Bazel philosophy more closely, but compromise on what parts don't fit into JS. So while you don’t have the full-on headaches, you have a _compromise_ of the headaches.

## The problem with Bazel

---

_Update (18 months later): the original arguments were rewritten from specific anecdotal points, to more general points, for the sake of being more approachable. The overall sentiment has not changed. You can find the old version on [archive.org](https://web.archive.org/web/20250423012139/https://pow.rs/blog/bazel-is-incompatible-with-javascript/)._

---

The fundamental problem of using Bazel outside the original C++ ecosystem it was designed for is it exerts strong opinions over JavaScript that are not only dumb, they’re _incorrect_—the worst kind of dumb.

## Problem 1: cloning node_modules

![Homer’s clones](/assets/posts/bazel-is-incompatible-with-javascript/homers-clones.jpg)

How Node.js has worked from version 0.x is relying on specific placements of `package.json` and `node_modules` in a project. Through the years we’ve gotten incremental improvements like [Yarn](https://yarnpkg.com/), then [pnpm](https://pnpm.io/) that make this architecture simpler, safer, and better optimized. But the underlying architecture hasn’t changed: Node.js _needs_ `node_modules` located in its current working directory to load the libraries and runtimes it needs.

This also extends to Electron apps like VS Code and Cursor—these, too, rely on local `node_modules` in your project to load the exact versions of everything your project needs (they’re Node.js-powered too, after all!). Many mature extensions like Prettier take this even further, using `node_modules` as a local cache to save work.

So what does Bazel do? Why, it ignores it and tries to make its own secret `node_modules` folder in a location on your computer it doesn’t want you to find because of “hermeticity.” This is dumb for all the following reasons:

- **Disk space.** All those memes of `node_modules` being heavier than a black hole are way worse with Bazel. `node_modules` are copied **once per rule,** mind you (a “rule” is sort of a package or macro for Bazel), since every rule is in its own hermetic sandbox. This means in an average Bazel setup, your `node_modules` take up 4× the disk space (or more) than they need to.
- **Network usage.** Bazel re-downloads all your local `node_modules` again, just because it doesn’t “trust” them. This is not only unkind to your network, it’s unkind to registry hosts.
- **Incorrectness from Bazel bugs.** This is where we really get into harmful architecture—Bazel rearranges `node_modules` and splits them up into hundreds and hundreds of locations. It then tries to symlink them together, but it doesn’t even symlink it correctly in the way Node.js programs expect. The end result is [unfixable bugs > 4 years old where JS programs don’t execute correctly](https://github.com/aspect-build/rules_js/issues/362).
  - The most common result of this I’ve seen is teams patching npm packages. This is not only a maintenance nightmare, it also leads your whole team down a dark path where they’re now debugging issues they’ve introduced that don’t exist in the core libraries.
- **Incorrectness from Bazel design.** It’s an encouraged pattern for Bazel configs to redeclare every `node_modules` package manually. Hope you didn’t miss a single package somewhere! Otherwise your Bazel build will be broken or incorrect from local Node.js execution, which always has all local `node_modules` packages available.
  - The scary part is this doesn’t always fail loudly—sometimes it will silently build the wrong thing because TypeScript types were missing and what should have been a type error was ignored.
- **Slowness.** Think about all the above points of duplicating `node_modules`, duplicating your local code (oh–it does that too, by the way), and symlinking everything—it can take minutes to do all this _pre-work_ before any actual building happens. This means that apples-to-apples, Bazel **always slows down every JS system it touches.** No exception.
  - The counterargument is “the first run is slower, but subsequent runs cache!” However, **even Bazel’s cache evaluation is painfully slow** (often a hot Bazel cache check takes longer than a cold JS run it was trying to skip). Expect that cache to be invalidated > 50% of the time, so I’d ask you to run the numbers if it’s _actually_ saving time if every command is slower. Especially if you’re using Rust-powered JS tools like [Vite](https://vite.dev).
- **No debug-ability.** It’s helpful for a JIT language to be able to inject breakpoints in `node_modules` packages, or even debug a package yourself by changing a line or two. Bazel prevents this from happening, which means using Bazel is asking all of your expert JS devs to throw away all their debugging tools they’ve relied on for over a decade.

<figure>
  <img alt="classic meme node_modules, showing it’s so heavy it affects space–time curvature more than the Sun, a neutrino star, and a black hole. The original meme has been modified with an additional “sandbox rules_js node_modules,“ “sandbox rules_ts node_modules,” “NpmLifecycleHook node_modules,” and it cuts off suggesting even more are out-of-frame." src="/assets/posts/bazel-is-incompatible-with-javascript/node-modules.jpg" width="1149" height="497" />
  <figcaption>“I wish more of my disk space belonged to node_modules” says every user of Bazel</figcaption>
</figure>

The end result is not only execution bugs and lack of Node.js safety, it’s also… *dumb*. It’s an utter waste of resources, duplicating `node_modules` _and_ putting them in the wrong places,

_But wait—there’s more!_

## Problem 2: not in my sandbox!

<figure>
  <img alt="Ralph Wiggum and Bart Simpson" src="/assets/posts/bazel-is-incompatible-with-javascript/my-sandbox.webp" width="942" height="524" />
  <figcaption>“This is my sandbox. I’m not allowed to go in the deep end.”</figcaption>
</figure>

Bazel’s roots are in building for compiled languages, namely C++. It’s engineered to produce only one compiled binary, or at most a couple outputs. The Bazel mind can’t even begin to conceive what all of JavaScript’s modern bundlers and build tools are capable of.

When Bazel builds files in its sandbox, it requires you to specify [build targets](https://bazel.build/run/build#specifying-build-targets) that are a list of every file that will be added to disk after a build run. If you’ve ever inspected the output from webpack, you know what a nightmare this is listing out _every. file. and hash. it spits out._ But Bazel needs thousands of filenames in order for any build to happen (and, yes, there are a few [prebuilt rules](https://github.com/aspect-build/rules_webpack) or helper functions like [glob](https://bazel.build/reference/be/functions#glob), but inevitably you have to deal with the [configuration drift](https://spacelift.io/blog/what-is-configuration-drift) of teaching Bazel about everything your JS build tool is already doing).

But what’s more, Bazel won’t let you do common sense things, including:

- ❌ You can’t add anything into `dist/` if another command has built anything there. This means no 2nd build job, no custom scripts. Pick a new folder.
- ❌ You can’t generate any files into `src/` (like Next.js, Astro, and SvelteKit do updating types) because Bazel can’t treat `src/` as a build output
- ❌ You can’t run a formatter, or otherwise autofix `src/` files in any way (for the same reason)

And the real kicker is [**Bazel is single-threaded**](https://github.com/bazel-contrib/rules_foreign_cc/issues/329). One build job at a time. Even opening multiple terminal commands, you’ll see the error `Another Bazel command is running…` and it will wait for its single-job queue to complete before starting anything new. Even if the commands have no dependency relation at all, it will simply refuse to parallelize anything. So it not only executes individual tasks more slowly than Node.js does (Problem 1), it also takes potentially-parallelizable streams of work and shoves them into a single-file queue to ensure that everything slows to a crawl as much as possible.

“But Bazel can only build the minimal dependency tree needed for any job!” Yes, but so can [pnpm run](https://pnpm.io/cli/run), a tool that most JS devs are using already (see [--filter ...](https://pnpm.io/filtering#--filter-package_name-4) and [--resume-from](https://pnpm.io/cli/run#--resume-from-package_name)). So we’re back to Bazel providing slower, buggier execution, with no functionality or advantages over simple Node.js tooling, in exchange for an occasional cache hit.

## Problem 3: sunk cost fallacy

The previous problems would be more forgivable if Bazel allowed for incremental adoption, or some way to intelligently reuse all the work that native Node.js tools (and VS Code and Cursor extensions) are already doing. But that would make too much sense.

In a dependency chain of **Internal Package A → Internal Package B → Internal Package C**, say you wanted to cache Package C’s build with Bazel. Unfortunately you can’t, because Bazel doesn’t know about any builds in the local filesystem—it only cares about builds that happened in its special sandbox. So in order to even _evaluate_ if Bazel saves you time (unlikely), you have to spend weeks converting Package A, B, and C over to Bazel.

![2 weeks later](/assets/posts/bazel-is-incompatible-with-javascript/2-weeks-later.jpg)

Assuming you didn’t run into any serious issues, and all three packages were Bazelified successfully, you hit a huge problem with Internal Package D (or if not D, then E, F, G or somewhere along the line). At some point you have to make the commitment to walk away completely, or go all in, usually before you even got your evaluation.

When the cost of evaluation requires a full implementation, and full buy-in from the start, you’re not so much _evaluating_ as _taking a blind leap of faith_ that all the time invested will someday be worth it in the long run.

It won’t.

At least, not for JavaScript.

## JS != C++

At the end of the day, JavaScript is not C++. JavaScript is not a compiled language, and when you remember that JavaScript builds server-side, frontend code, and even native app code, the build targets are so vast and complex that a tool made for C++ can’t scratch the surface in covering all the use cases. And love it or hate it, JavaScript and Node.js are inseparable at this point, which all require things that Bazel continues to reject:

1. Local `node_modules`
2. Treatment of `package.json` (and the lockfile) as the source of truth for package management and versioning
3. Treatment of the npm/pnpm workspace as the source of truth for the dependency graph

But in case you need further convincing from someone other than me, remember that [Vercel, back in 2021](https://github.com/vercel/next.js/issues/14778#issuecomment-971596723), evaluated Bazel, and came to these conclusions years ago:

> After doing a proof of concept leveraging Bazel there were too many breaking changes / hacks required to make it work.

What did they do? [They acquired Turborepo](https://turborepo.dev/), and invested in its development to actually deliver on Bazel’s failed promises, in a significantly-better way. Not that Vercel is perfect, but when one of the most prolific JavaScript/Node.js teams in history has already done this exact evaluation in public, posted their findings, and came up with a better solution, it’s at least worth paying attention to.
