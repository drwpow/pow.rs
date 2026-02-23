---
title: Bazel is incompatible with JavaScript
description: If you don’t know what Bazel is, you not only can skip this blog post; I envy you greatly.
pubDate: 2024-10-13
updated: 2026-02-21
categories: ["dev"]
---

[Bazel](https://bazel.build/) is an open source fork of Google’s internal tooling, Blaze, that I’ve had the misfortune of fighting with for over 2 years. It promises a mouthwatering smorgasboard of:

- Incremental builds
- Build caching
- Remote build caching
- Support for any programming language, any codebase, and any possible deploy target

Bazel has a passionate fanbase. It has great reviews. It seems well-maintained, has a full-time company supporting development, and even has conferences and meetups. There's just one itty-bitty problem: _it's made for C++, not JavaScript_. In this blog post we’ll dig into how Bazel’s decisions are incompatible with JavaScript (and Node.js and TypeScript by extension).

![@BenLesh on x.com: “I loved Blaze (Bazel) at Google... But your company will never, ever be able to do Bazel like Google does Blaze. And while it probably helps the build  pipeline for your JVM-based whatever backend, it's an absolute hinderance for TypeScript/JavaScript development.”](/assets/posts/bazel-is-incompatible-with-javascript/ben-lesh.png)

## TL;DR

<q>I don’t use Bazel and don’t care. I found this Googling and just want to know what I <em>should</em> use.</q> Use [Turborepo + pnpm](https://turbo.build/repo). Turborepo is designed for how JS works from the ground-up, and does a lovely job at delivering on all of Bazel’s promises but tailored to the JS ecosystem.

<q>What about Nx?</q> I've had a lot more papercuts with Nx because they try and follow Bazel philosophy more closely, but compromise on what parts don't fit into JS. So while you don’t have the full-on headaches, you have a _compromise_ of the headaches.

## The problem with Bazel

_Update (18 months later): the original arguments have been clarified to go a little more in-depth, and sound less like a rant (it’s still a bit of a rant). You can find the old version on [archive.org](https://web.archive.org/web/20250423012139/https://pow.rs/blog/bazel-is-incompatible-with-javascript/)._

The fundamental problem of using Bazel outside the original C++ ecosystem it was designed for is it exerts strong opinions over JavaScript that are not only dumb, they’re _incorrect_—the worst kind of dumb.

## Problem 1: this is how you draw node_modules right?

![Ralph Wiggum drawing on his face](/assets/posts/bazel-is-incompatible-with-javascript/ralph-drawing-face.jpg)

From day one, Node.js has relied on `package.json` and `node_modules` to resolve modules. More specifically, it requires _precise locations_ of `package.json` and `node_modules` in relationship to the local source code. Though this is all by design and is still true today, the JS ecosystem has gotten palpable improvements through things like [Yarn](https://yarnpkg.com/) and [pnpm](https://pnpm.io/) that achieve the original design goals, while deduping `node_modules` and keeping disk usage minimal.

Then along comes [Electron](https://www.electronjs.org/), which powers many apps like VS Code and Cursor. These apps, built on Node.js architecture, also need local `node_modules` in that same, untouched location. Extensions like Prettier take this further, using `node_modules` as a local cache to save work. After all, it’s an established part of the ecosystem that’s been around for > 15 years, why not change it?

Bazel rejected the assignment, instead attempting to redraw `node_modules` onto its own face. Bazel does this in the name of “[hermeticity](https://blog.aspect.build/hermetic-c-toolchain),” a concept from C++ that yields all the following problems in JavaScript:

- **Disk space.** All those memes of `node_modules` being [heavier than a black hole](https://medium.com/s/silicon-satire/i-peeked-into-my-node-modules-directory-and-you-wont-believe-what-happened-next-b89f63d21558) are way worse with Bazel. `node_modules` are copied **once per rule,** (a “rule” is sort of a package or macro for Bazel), since every rule is in its own hermetic sandbox. This means in an average Bazel setup, your `node_modules` take up 4× the disk space (or more) than they need to (Bazel users may be surprised to find there aren’t as many symlinks inside the sandbox as they thought there were).
- **Network usage.** Bazel re-downloads all your local `node_modules` again, because [“it should be Bazel’s job.”](https://github.com/aspect-build/rules_js?tab=readme-ov-file#installing-third-party-libraries) This is not only unkind to your network, it’s unkind to registry hosts.
- **Incorrectness from Bazel bugs.** This is where we really get into harmful architecture—Bazel rearranges `node_modules` and splits them up into hundreds and hundreds of locations. It then tries to symlink them together, but it doesn’t even symlink it correctly in the way Node.js programs expect. The end result is [unfixable bugs > 4 years old where JS programs don’t execute correctly](https://github.com/aspect-build/rules_js/issues/362).
  - The most common result of this I’ve seen is teams patching npm packages. This is not only a maintenance nightmare, it also leads your whole team down a dark path where they’re now debugging issues they’ve introduced in multiple libraries beyond their own source code.
- **Incorrectness from Bazel conventions.** It’s an encouraged pattern for Bazel configs to redeclare every `node_modules` package manually. Hope you didn’t miss a single package somewhere! Otherwise your Bazel build will be broken or incorrect from local Node.js execution, which always has all local `node_modules` packages available (however, if you only ever glob import `":node_modules"` everywhere, you’re safe from this).
  - The scary part is this doesn’t always fail loudly—sometimes it will silently build the wrong thing because TypeScript types were missing and what should have been a type error was ignored.
- **Slowness.** Think about all the above points of duplicating `node_modules`, duplicating your local code (oh–it does that too, by the way), and symlinking everything—it can take minutes to do all this _pre-work_ before any actual building happens. This means that apples-to-apples, Bazel **always slows down every JS system it touches.** No exception.
  - The counterargument is “the first run is slower, but subsequent runs cache!” However, **Bazel’s cache evaluation is painfully slow**, and often it takes Bazel longer to determine a build should be skipped than just building every time in Node.js. Further, expect that cache to be invalidated > 50% of the time, so run the numbers if it’s _actually_ saving time if every command is slower. Especially if you’re using Rust-powered JS tools like [Vite](https://vite.dev).
- **No debug-ability.** It’s helpful for a JIT language to be able to inject breakpoints in `node_modules` packages, or even debug a package yourself by changing a line or two. Bazel prevents this from happening, which means using Bazel is asking all of your expert JS devs to throw away all their debugging tools they’ve relied on for over a decade.

<figure>
  <img alt="classic meme node_modules, showing it’s so heavy it affects space–time curvature more than the Sun, a neutrino star, and a black hole. The original meme has been modified with an additional “sandbox rules_js node_modules,“ “sandbox rules_ts node_modules,” “NpmLifecycleHook node_modules,” and it cuts off suggesting even more are out-of-frame." src="/assets/posts/bazel-is-incompatible-with-javascript/node-modules.jpg" width="1149" height="497" />
  <figcaption><q>I wish more of my disk space belonged to node_modules</q> says every user of Bazel</figcaption>
</figure>

The end result is not only execution bugs and lack of Node.js safety, it’s also… *dumb*. It’s an utter waste of resources, duplicating `node_modules` _and_ putting them in the wrong places, causing incorrect program execution.

_But wait—there’s more!_

### Sidenote: Additional thoughts on hermeticity

![Principal Skinner: “No, it’s the official maintainers who are wrong about their own language”](/assets/posts/bazel-is-incompatible-with-javascript/skinner-children-are-wrong.jpg)

Bazel apologists may feel that Bazel’s approach to `node_modules` handling is actually correct, and Node.js itself is wrong. For those that don’t find this assertion ridiculous at face value, and need more convincing:

- The original rules_nodejs was so bad [they had to deprecate it](https://github.com/aspect-build/rules_js?tab=readme-ov-file#relationship-to-rules_nodejs) and force everyone to move to rules_js.
- The current version of rules_js still has design flaws, as [Aspect explains](https://github.com/aspect-build/rules_js?tab=readme-ov-file#running-nodejs-programs) (note the “Bazel rules/macro authors must re-path inputs and outputs” part—this is fundamentally broken!).
- Bazel’s default settings are to [patch node:fs](https://registry.bazel.build/docs/aspect_rules_js/3.0.0-rc4). If you need to patch Node.js to get your software to run, it’s probably poorly architected.

The recurring theme here is **Node.js was designed to NOT be hermetic by its design,** because it doesn’t need hermeticity. This alternate approach would be taken more seriously if it hadn’t had such a horrible track record of being able to run _anything_. Node.js already creates its own isolated, portable build system with `node_modules` out-of-the-box (with the few OS deviations [well-documented and with workarounds](https://nodejs.org/api/url.html#urlfileurltopathurl-options)). Node.js users have always known this. But someone should tell the Bazel team.

</details>

---

## Problem 2: not in my sandbox!

<figure>
  <img alt="Ralph Wiggum and Bart Simpson" src="/assets/posts/bazel-is-incompatible-with-javascript/my-sandbox.webp" width="942" height="524" />
  <figcaption><q>This is my sandbox. I’m not allowed to go in the deep end.</q></figcaption>
</figure>

Bazel’s roots are in building for compiled languages, namely C++. It’s engineered to produce only one compiled binary, or at most a couple outputs. The Bazel mind can’t even begin to conceive what all of JavaScript’s modern bundlers and build tools are capable of.

When Bazel builds files in its sandbox, it requires you to specify [build targets](https://bazel.build/run/build#specifying-build-targets) that are a list of every file that will be added to disk after a build run. If you’ve ever inspected the output from webpack, you know what a nightmare this is listing out _every. file. and hash. it spits out._ But Bazel needs thousands of filenames in order for any build to happen (and, yes, there are a few [prebuilt rules](https://github.com/aspect-build/rules_webpack) or helper functions like [glob](https://bazel.build/reference/be/functions#glob), but inevitably you have to deal with the [configuration drift](https://spacelift.io/blog/what-is-configuration-drift) of teaching Bazel about everything your JS build tool is already doing).

But what’s more, Bazel won’t let you do common sense things, including:

- ❌ You can’t add anything into `dist/` if another command has built anything there. This means no 2nd build job, no custom scripts. Pick a new folder.
- ❌ You can’t generate any files into `src/` (like Next.js, Astro, and SvelteKit do updating types) because Bazel can’t treat `src/` as a build output
- ❌ You can’t run a formatter, or otherwise autofix `src/` files in any way (for the same reason)

And the real kicker is [**Bazel is single-threaded**](https://github.com/bazel-contrib/rules_foreign_cc/issues/329). One build job at a time. Even opening multiple terminal commands, you’ll see the error `Another Bazel command is running…` and it will wait for its single-job queue to complete before starting anything new. Even if the commands have no dependency relation at all, it will simply refuse to parallelize anything. So it not only executes individual tasks more slowly than Node.js does (Problem 1), it also takes potentially-parallelizable streams of work and shoves them into a single-file queue to ensure that everything slows to a crawl as much as possible.

<q>But Bazel can only build the minimal dependency tree needed for any job!</q> Yes, but so can [pnpm run](https://pnpm.io/cli/run), a tool that most JS devs are using already (see [--filter ...](https://pnpm.io/filtering#--filter-package_name-4) and [--resume-from](https://pnpm.io/cli/run#--resume-from-package_name)). So we’re back to Bazel providing slower, buggier execution, with no functionality or advantages over simple Node.js tooling, in exchange for an occasional cache hit.

## Problem 3: sunk cost fallacy

![Ralph Wiggum: (chuckles) I’m in danger](/assets/posts/bazel-is-incompatible-with-javascript/ralph-wiggum-im-in-danger.jpg)

The [Amazon decision framework](https://www.forbes.com/sites/bryancollinseurope/2019/03/07/jeff-bezos-says-successful-people-make-these-two-types-of-decisions/) outlines 2 types of decisions:

- **Type 1**: “one-way doors,” permanent commitments or decisions that are so costly to reverse they are effectively permanent
- **Type 2**: “two-way doors,” trivially-reversible and cheap experiments

Bazel is far closer to a Type 1 decision, because it requires full buy-in from the start.

Imagine you had a dependency chain of **Internal Package A → Internal Package B → Internal Package C** in a monorepo. Also say you wanted to cache Package C’s build with Bazel. Because Bazel doesn’t know about any builds outside its special sandbox, it requires you to fully Bazelify all three modules before you can see the results of one (unlike alternatives like Turborepo, which can be adopted incrementally—even in Bazel monorepos!). Requiring 100% implementation to evaluate should be a deal breaker on its own.

When the cost of evaluation requires a full implementation, and full buy-in from the start, you’re not so much _evaluating_ as _taking a blind leap of faith_ that all the time invested will someday be worth it in the long run.

It won’t. _At least, not for JavaScript._

## JS != C++

At the end of the day, JavaScript is not C++. JavaScript is not a compiled language, rather, designed to run on the server, on frontend code, and even natively. JS and Node.js were designed from the ground-up to be portable and universal. A tool designed for C++ can’t even begin to scratch the surface in covering all the different use cases. So all of the things Bazel rejects, are equivalent to rejecting the JS ecosystem itself:

1. Local `node_modules`
2. Treatment of `package.json` (and the lockfile) as the source of truth for package management and versioning
3. Treatment of the npm/pnpm workspace as the source of truth for the dependency graph

Remove any one of these pillars, and you have a broken mess. Commit to all three, and you’re not using Bazel, because Bazel refuses to allow these rules.

In case you need further convincing from someone other than me, remember that [Vercel, back in 2021](https://github.com/vercel/next.js/issues/14778#issuecomment-971596723), evaluated Bazel, and came to these conclusions years ago:

> After doing a proof of concept leveraging Bazel there were too many breaking changes / hacks required to make it work.

What did they do? [They acquired Turborepo](https://turborepo.dev/), and invested in its development to actually deliver on Bazel’s failed promises, in a significantly-better way. Not that Vercel is perfect, but when one of the most prolific JavaScript/Node.js teams in history has already done this exact evaluation in public, posted their findings, and came up with a better solution, it’s at least worth paying attention to.

If I had to leave a parting thought, it’s just **be honest with yourself.** If you’re evaluating apples-to-apples, then really think through:

- Is Bazel better at caching JS than Turborepo?
- Is Bazel slower at evaluating its own cache than building in JS every time?
- Are we prepared to take on the maintenance of patching half the npm packages we use, just to get them to work in Bazel?
- Do we want to spend weeks of research and fighting against Bazel, every time we want to try a new JS tool?

And if I’m wrong, then please try and convince me (and Vercel, and [VoidZero](https://voidzero.dev/)) that Bazel is really better than the best the JS ecosystem has to offer! But until then, I’m sticking with Turborepo for JS (at least until [Vite+](https://viteplus.dev/) comes out!).
