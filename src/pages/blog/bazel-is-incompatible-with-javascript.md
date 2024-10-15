---
title: Bazel is incompatible with JavaScript
description: If you don’t know what Bazel is, you not only can skip this blog post; I envy you greatly.
date: 2024-10-13
tags:
  - dev
layout: ../../layouts/post.astro
---

[Bazel](https://bazel.build/) is an open source fork of Google’s internal tooling, Blaze, that I’ve had the misfortune of fighting with for the past year. It promises a mouthwatering smorgasboard of:

- Incremental builds
- Build caching
- Remote build caching
- Support for any programming language, any codebase, and any possible deploy target

The reviews are great. It has a passionate fanbase. It’s well-maintained and supported.

But its promises fall completely flat for the JS ecosystem, to the point I’ve developed the strong opinion it shouldn’t touch ANY JavaScript, TypeScript, or Node.js at all. And it’s not just me that thinks this; people like [Ben Lesh](https://x.com/BenLesh) and companies like Vercel [also feel it’s incompatible](https://github.com/vercel/next.js/issues/14778#issuecomment-971596723). But I’ll explain why I am pleading for folks to ensure that never the twain shall meet.

![@BenLesh on x.com: “I loved Blaze (Bazel) at Google... But your company will never, ever be able to do Bazel like Google does Blaze. And while it probably helps the build  pipeline for your JVM-based whatever backend, it's an absolute hinderance for TypeScript/JavaScript development.”](/assets/posts/bazel-is-incompatible-with-javascript/ben-lesh.png)

## TL;DR

“Blah, blah; I don’t use Bazel and don’t care. I found this Googling and just want to know what I _should_ use.” Use [Turborepo + pnpm](https://turbo.build/repo). Turborepo is designed for how JS works from the ground-up, and does an absolutely lovely job at delivering on all of Bazel’s promises for the JS ecosystem. Though I won’t mention Turborepo again in this blog post, just know for every criticism levied against Bazel, I can’t say the same for Turborepo.

“What about Nx?” I have no clue. I haven’t tried it. This is about my hatred for Bazel, not about my passion for cached build systems.

Anyways, with that out of the way…

## Inputs and outputs

Let’s back up a bit and lay some groundwork. The underlying principle of skipping work is **determinism.** Or more specifically, the idea that **if the inputs don’t change, the outputs shouldn’t,** therefore, no reason to rebuild (assuming it’s a [pure system](https://en.wikipedia.org/wiki/)).

Bazel—and any other build system for that matter—operates off this principle of “identify the inputs, and you can determine whether or not a rebuild is necessary.” Fair enough. However, _how_ it determines that is not only time-consuming; it’s philosophically opposed to how JS works.

## Problem 1: I won’t do what you tell me

Bazel uses a proprietary syntax called [Starlark](https://bazel.build/rules/language) that is based on Python. All packages require writing Starlark for config. I don’t really mind it (better than MAKEFILEs), but it can be… a lot. Here’s a simple example:

```starlark
# BUILD

load("@aspect_bazel_lib//lib:copy_to_directory.bzl", "copy_to_directory")
load("@aspect_bazel_lib//lib:write_source_files.bzl", "write_source_files")
load("@aspect_rules_js//npm:defs.bzl", "npm_package")
load("@aspect_rules_ts//npm:defs.bzl", "ts_project")
load("@npm//:defs.bzl", "npm_link_all_packages")

# 1. Bazel will pretend like the entire `node_modules` folder doesn’t exist,
#    unless we do work telling it about these files
npm_link_all_packages(name = "node_modules")

# 2. This tries to run `tsc` but it’s way worse, and it will forget half your
#    settings
ts_project(
  name = "ts",

  # 2a. You’ll need to redeclare your `includes` from tsconfig
  srcs = glob(
    [
      "src/**/*.cjs",
      "src/**/*.cts",
      "src/**/*.js",
      "src/**/*.mjs",
      "src/**/*.mts",
      "src/**/*.ts",
      "src/**/*.tsx",
      "**/*.json",
    ]
  ),

  transpiler = "tsc",

  # 2b. You’ll also need to redeclare many TSConfig settings, even if they’re
  # already in tsconfig.json
  declaration = True,
  tsconfig = "tsconfig.json",

  # 2c. You’ll need to redeclare all your package.json dependencies, too
  deps = [
    ":node_modules/@types",
    ":node_modules/date-fns",
    ":node_modules/lodash-es",
    ":node_modules/react",
    ":node_modules/react-dom",
  ],
)

# 3. You’ll need to actually tell Bazel you want it to write SOMETHING to disk
copy_to_directory(
  name = "dist",
  srcs = [":ts"],
  replace_prefixes = {
     # But due to limitations in Bazel, it will write it IN THE WRONG DIRECTORY
     # so we have to hack it by rewriting paths back to where they should have
     # been in the first place
    "src/": "/",
  },
)

# 4. Oh also did we mention where Bazel writes files to disk isn’t in your
#    project? You’ll need even more code to tell Bazel to move the files it
#    wrote back into the project
write_source_files(
  name = "build_dist",
  diff_test = False,
  files = {"dist": "dist"],
  visibility = ["//visibility:public"],
)

# 5. ALSO if you’re using a monorepo it will pretend like local packages don’t
#    exist, so we’ll have to do even more work just to create a broken system
#    for locally-linked packages
npm_package(
  name = "npm_package",
  srcs = [":ts"],
  visibiliity = ["//visibility:public"],
)
```

You don’t have to read or understand any of that, but some of the commentary will explain what’s happening. I mainly wanted to give a realistic example of what every package in a monorepo requires **at a minimum.**

Putting complexity and learning curve aside, the damning design flaw is **Bazel requires all this work and configuration so it can run commands differently.** Different environment, different processes. Even using a forked version of Node.js where it can [hijack node:fs](https://github.com/aspect-build/rules_js/blob/main/docs/js_run_binary.md#user-content-js_run_binary-patch_node_fs) if it wants to. The issue isn’t that Starlark requires a little repetition from `package.json` and `tsconfig.json`. It’s the issue of _running different underlying processes entirely, that don’t map 1:1 with `package.json` and `tsconfig.json`_, masquerading as repetition. This, as you fear, results in different (or missing) output, different errors, and a different end result than just using Node.js. If you have ever worked with a bundler before, you know how scary it is dealing with the uncertainty of a complex thing ending up in a different shape than what you had predicted.

<figure>
  <img width="656" height="401" src="/assets/posts/bazel-is-incompatible-with-javascript/normal.gif" alt="Mom: “Why can’t you just be normal!?” Kid: *screams*" />
  <figcaption>Me: “why can’t you just run <code>pnpm run build</code>?”<br />Bazel: <em>*screams*</em></figcaption>
</figure>

“It’s just a knowledge issue! This can be configured to work the same as Node.” Some might say. No, no it can’t. If that were the case, then Bazel wouldn’t need the Starlark files, rules, macros, and thousands of lines of code wrapping the original processes. All the information already exists to build the project outside Starlark, but there’s a reason that’s being discarded (and Bazel devs, if you’re reading this and want to prove me wrong, _I love being wrong!_ Nothing would make me happier than if JS projects could be built with mere npm scripts and no other config).

If different outputs wasn’t enough, it also results in the slow death of the local dev setup. _When_—not _if_—Bazel disagrees with Node, CI wins (because Bazel is what runs in CI). After all, you _have_ to ship, and short-term we can sacrifice a little DX. “We’ll fix it later,” you say. Slowly but surely, more and more IDE extensions stop working as Bazel “wins” more and more disagreements with Node and the native toolchain, until the entire thing is unusable outside of Bazel. All because Bazel refuses to just run npm scripts directly.

## Problem 2: the hermetic upside-down

Bazel has a concept of [_hermeticity_](https://bazel.build/basics/hermeticity) where it tries to isolate the inputs and create as “pure” a build as possible. In this isolated environment, nothing gets loaded you don’t explicitly let in. This is useful in general, and not completely unlike working with containers. But where this hermetic layer throws a wrench into everything is in its inability to mirror your working project—it will subtly transform things in the process. It doesn’t respect other things happening in the monorepo and other local packages. And you have to so much work transforming things in-and-out of that hermetic layer, you’re 99.9% likely to make a simple error that blows everything up (or worse—_silently_ blows everything up).

As a simple example, I want to go back to just part of the Starlark config earlier:

```starlark
# 3. You’ll need to actually tell Bazel you want it to write _something_ to disk
copy_to_directory(
  name = "dist",
  srcs = [":ts"],
  replace_prefixes = {
     # But due to limitations in Bazel, it will write it IN THE WRONG DIRECTORY
     # so we have to hack it by rewriting paths back to where they should have
     # been in the first place
    "src/": "/",
  },
)

# 4. Oh also did we mention where Bazel writes files to disk isn’t in your
#    project? You’ll need even more code to tell Bazel to move the files it
#    wrote back into the project
write_source_files(
  name = "build_dist",
  diff_test = False,
  files = {"dist": "dist"],
  visibility = ["//visibility:public"],
)
```

After you even get Bazel producing something remotely similar to what you want, you have to use not one but TWO macros to copy the files back to the original source directory where they should have been in the first place. Notice that `replace_prefixes` line—it will actually build files to `/dist/src` rather than `/dist` (see point #1; I won‘t restate it), so you have to fix all the mistakes it made in rebuilding those underlying Node processes from scratch. In a scary shadow dimension filled with monsters.

<figure>
  <img width="800" height="448" src="/assets/posts/bazel-is-incompatible-with-javascript/upside-down.gif" alt="Will looking at the arcade in the Upside Down (Stranger Things, Season 2)" />
  <figcaption>Bazel’s hermeticity is basically “The Upside Down” in Stranger Things: a fucked-up horror version of the real world. That probably shouldn’t exist in the first place.</figcaption>
</figure>

When we look at Bazel in the context of, say, a C++ app it’s more forgivable. Building a single binary only has one output that’s easy to calculate. It doesn’t need access to the whole file system. And I’m not arguing at all that Node.js doesn’t have any design flaws. But Node.js is what it is, and it is realistic to expect tens of thousands of files go into the input, and the output could be dozens or hundreds of files of varying extensions and types. The output _is_ deterministic, but is so complex only the bundler is capable of calculating. And the output varies wildly by project type (Node.js app, frontend app, JS library, CLI, and Electron app will all produce different outputs from one another). Bazel is ill-equipped to deal with this scale of number of files, yet it’s designed to be a closed system, so it gets stuck in an unusable limbo between not being a bundler, but also not deferring file handling to the underlying Node.js processes and doing a piss-poor job of half-managing everything.

## Problem 3: top-down builds

This is a short-but-sweet complaint: Bazel should be using bottom-up builds rather than top-down. What I mean is: for a Bazel monorepo, you have one WORKSPACE. One version of rules for the entire monorepo, one version of Bazel. Top-down. However, this fundamentally disagrees with how Node.js works: each package in a monorepo can have different dependencies at different versions. Some projects are newer, and have upgraded dependencies from older projects. Each handles its own needs, and it’s responsible for building itself without concern for the larger system. Bottom-up. In any large codebase, not all packages get equal maintenance, and often lag behind others in their dependencies (which isn’t a bad thing—they’ve stabilized). The Node.js ecosystem can handle this just fine.

But not so with Bazel—because you only have one `rules_js` that acts on the entire project, all packages are bound to the limitations and flaws of the rule at that version. Even just getting it _working_ requires an incredible effort. And once it’s working, often updating a single dependency in the monorepo can be enough to break it. You wind up in a tenuous state where any update to `rules_js` may break everything. And so it is with any individual package update. Now teams that may be responsible for updating their packages can’t, if updating their dependency breaks Bazel. All this could be avoided if Bazel would just defer responsibility to individual packages to manage building themselves.

<figure>
  <img width="800" height="448" src="/assets/posts/bazel-is-incompatible-with-javascript/zazu.gif" alt="Zazu getting crushed by Rhino (The Lion King)" />
  <figcaption>Developer managing Bazel in a JS monorepo. 2024, colorized.</figcaption>
</figure>

## Summary

<figure>
  <img width="660" height="396" src="/assets/posts/bazel-is-incompatible-with-javascript/tacky.gif" alt="“You’re tacky, and I hate you.” (School of Rock)" />
  <figcaption>In summary, Bazel, you’re tacky and I hate you.</figcaption>
</figure>

At the end of the day, a build system just won’t work for all languages, and that’s OK. Bazel was designed for a different usecase than JS. And it’s natural that Bazel tried to solve a problem for everyone, especially with the growing popularity and maturation of JS. And I applaud all the lovely contributors and maintainers that are making an effort at making Bazel better! But that doesn’t mean I’d touch Bazel with a 10 foot pole for handling JS right now.

But rather than end on a sour note and be a downer, I know a natural question is “well if all that is true, then what _would_ make Bazel compatible with JS?” And to give a more concrete answer than “make it like Turbopack” (OK, I lied—I did end up mentioning it again), only 3 changes would be required:

1. **Bazel only runs npm scripts.** The entire Node.js world operates off npm scripts. Everything meaningful happens in npm scripts—building, linting, testing. All the problems of bottom-up building, working local dev setup, and reliability are all handled by Bazel deferring to… the thing that already existed and is already working as expected.
2. **Bazel automatically writes files to source.** Any build step in a Node.js package already has all the information it needs to put the files in its proper place. In fact, most of the time this is also statically set in the `package.json` under the [main](https://docs.npmjs.com/cli/v10/configuring-npm/package-json) or [exports](https://docs.npmjs.com/cli/v10/configuring-npm/package-json#exports) fields, and sometimes even [files](https://docs.npmjs.com/cli/v10/configuring-npm/package-json#files). Node.js **ALWAYS** requires files to exist in the source tree, so Bazel needs to just start assuming that.
3. **No TS rules.** To ensure better interop with the Node ecosystem at large, there shouldn’t be such a thing as `rules_ts` (separate from `rules_js`). If Bazel only ran Node.js/npm/pnpm commands, TS is just another package like any other. This would automatically improve support across the board for all Node.js projects because Bazel would be deferring builds to the things that should be building in the first place.

Will all these changes happen? Who can say. The Bazel project and its devs doesn’t owe me, or anyone else for that matter, anything. And these changes would probably disrupt all the things it’s doing properly. But until these changes are made, I’ll personally be using anything _but_ Bazel for JS. And you should too.
