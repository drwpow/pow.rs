---
title: The great(er) divide in front-end
pubDate: 2020-02-17
description: |
  A year of reflecting on Chris Coyier’s “The Great Divide” post. I think it holds up, but requires a little more nuance.
categories: ["dev"]
updated: 2020-04-19
---

It’s been about a year since Chris Coyier’s post [_The Great Divide_][css-gd] came out. The
“divide,” of course, being between 2 armies within front-end development that had been forming:

> On one side, an army of developers whose interests, responsibilities, and skill sets are heavily
> revolved around JavaScript. On the other, an army of developers whose interests, responsibilities,
> and skill sets are focused on other areas of the front end, like HTML, CSS, design, interaction,
> patterns, accessibility, etc.

If you‘re unfamiliar with what he’s talking about, I’d read that post, but a quick-and-dirty history
of front-end is that it’s a profession that was once a league of ex-designers muddling their way
through code, that’s recently transformed into a proper programming discipline (with some design
skills remaining a part of the job requirement). Chris’ post is somewhat of a flag post marking that
slow, subtle shift that had been happening in the profession for years.

My initial reaction to this was to reject it—not that the divide wasn‘t happening, but the idea that
these should be 2 different professions. To be blunt, I saw it as someone who made their career on
CSS attacking the good work that JavaScript folks had been doing because it threatened his career (I
say that as someone respects Chris immensely, but people are allowed to be wrong in blog posts). I
even wrote an earlier draft of this post arguing that there’s no divide; that’s just how front-end
_is_ now. Get used to it. _Git gud_.

I now don’t see it that way, and I think Chris (rightly) was just pointing out a concern that he had
about this divide forming.

As a result, I began to recognize my own limitations. I saw myself as someone that was good at both
CSS and JS. But if I’m being honest, I’m not _that_ good at CSS; I just am good _enough_ at design
where it seems like I am. I’m also not _that_ good at JS, as someone without a Computer Science
background, I am not the master architect that well-educated CS students tend to be (to be clear—I’m
strongly in the “you don’t need a degree to be a dev” camp as a member myself, but there is
nonetheless a value in a CS education that I do not possess).

In short, the past couple months have been me coming to terms with not being able to do it all. And
do it all well.

But all that musing aside, the core content of this blog post hasn’t changed, because it was drafted
from notes I wrote to a coworker wanting to learn more about front-end, and as I was ennumerating
all there is to learn today I noticed the knowledge started to pool into 3 rough areas of expertise,
which I still stand by. _Will these become 3 different jobs eventually?_ I don’t know. The older I
get the less I’m sure of. But I do know that each of these groups are substantial learning efforts
each their own, and I do now think it’s impossible to master all three of them.

Treat this like a DnD skill tree or something—up to you to spread points evenly or be a glass cannon
in one.

## 👨‍🎨 I. Browser APIs & Rendering (HTML/CSS)

The area of expertise of Browser APIs & Rendering revolves around two central questions: **On the
web, how do I make things look like things?** and **How does a browser work to help me accomplish
this?**

At beginner levels, browser rendering involves understanding the fundamentals of HTML & CSS to get
code to look like a design. At intermediate levels, this gets into animations, render profiling, and
making interactive things perform adequately in a browser environment. At the highest levels,
mastery of browser rendering means being able to describe in great detail how assets are requested
and the priority of their loading, the browser paint API, and how to render anything—even 3D—at 60
frames per second (the [maximum a browser will allow][surma-120fps]).

For the traditional CS student, the browser is something that often gets underestimated. This
results in the common “I don’t understand CSS” state of confusion that so many backend developers
find themselves in. And it _is_ confusing, until you treat the browser as the special, weird runtime
environment that it is. Often times it’s what you’re fighting with here—your own misconceptions of
what the browser is doing.

Take the following with a grain of salt, but here is roughly how you might track growth of your
knowledge in this area:

### Beginner

| Skill                             | Example                                                                                       |
| :-------------------------------- | :-------------------------------------------------------------------------------------------- |
| Fundamentals of HTML              | _I understand what different HTML tags do_                                                    |
| Fundamentals of CSS               | _I understand how to use & apply CSS to HTML to style pages_                                  |
| Fundamentals of Browser Resources | _I understand where to put CSS & JS files and reference them in the HTML for them to show up_ |

### Intermediate

| Skill                        | Example                                                                                                                                                                     |
| :--------------------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Accessibility                | _I can ensure sites are usable for people that use screen readers and other assistive technologies_                                                                         |
| Animations                   | _I can animate objects using either [CSS][css-animation] or a JavaScript framework like [Three.js][three]_                                                                  |
| Hardware acceleration        | _I understand certain properties & animations can [use the GPU][gpu-acceleration] for performance_                                                                          |
| Render profiling²            | _I can use tools like [Lighthouse](lighthouse) to understand what is slowing down browser rendering & performance_                                                          |
| Image formats                | _I understand when to use each image format (`JPG`, `PNG`, `WebP`, …), and how to [optimize them][imageoptim]_                                                              |
| Common Browser API knowledge | _I understand common [browser APIs][browser-api] like [`fetch`][fetch] and [`history`][history], and know when to leverage the browser and when to write my own JavaScript_ |

### Master

| Skill                                | Example                                                                                                                                                                             |
| :----------------------------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Resource prioritization² ³           | _I understand [resource prioritization][resource-prioritization] and the steps from streaming initial HTML payload, to fetching the resources, to rendering them in priority order_ |
| Render debugging²                    | _I understand how the browser performs [paint operations][simplify-paint] and how to optimize them_                                                                                 |
| Comprehensive Browser API Knowledge² | _I understand more invisible APIs like [WebGL][webgl-api], [Paint][paint-api], and the [DOM][dom] and understand how they differ or can work in sync to render parts of a page_     |
| Browser processes                    | _I understand the [Browser, Renderer, and GPU processes][browser-processes] that lie underneath the higher-level APIs_                                                              |

_² related to II / ³ related to II_

You may find that much of the “CSS Dev” from the _Great Divide_ post fits in here, with the addition
of JavaScript like `fetch` and `history`, and the omission of CSS frameworks like [SMACSS][smacss].
So already we’re breaking up that division! As for CSS framework knowledge, that fits more neatly
in…

## 👩‍🔬 II. JS Programming & Architecture

The knowledge of JavaScript & Architecture is the recent development of front-end into a more
formal, proper software environment from web dev’s _laissez-faire_ “just throw that code anywhere”
beginnings. This roughly correlates with the JavaScript-oriented type in Chris’ post somewhat, and
is closer to the comfort sphere of a traditional Computer Science education. Whereas Camp 1 trends
toward static display, Camp 2 adds dynamism, automation, and interaction. You could even call this
“the backend of front-end.”

This area of knowledge is concerned with **How should this application be interacted with?** and
**How should code for the front-end be organized for delivery and team maintainability?** The
pursuit of these 2 questions, together, have led to many milestones such as that React thing you’ve
heard so much about (along with Node.js, which we’ll cover more in the last section).

Though JavaScript is one of the most popular programming ecosystems, it’s still developing. And for
that reason I don’t feel comfortable dividing intermediate- and master-level topics. Everyone’s
journey through here will differ, and for that reason, I only distinguish between basics and
non-basics.

In your rebuttal of this blog post, please be gentle with this section ;)

### Beginner

| Skill                             | Example                                                                                                                                      |
| :-------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------- |
| Fundamentals of JavaScript        | _I can build basic things with vanilla JS and don’t always need a library (only sometimes)_                                                  |
| JavaScript quirks                 | _I understand the basics of [working with objects][objects] in JS, the basics of [`this`][js-this], and a rough understanding of scopes_     |
| Async knowledge                   | _I understand the basics of [`Promise()`][promise] and can write code to fetch remote data (AJAX) or deal with async operations_             |
| Fundamentals of Frameworks³       | _I understand how to spin up a React / Vue / Svelte / whatever project and get something visible_                                            |
| Fundamentals of CSS organization¹ | _I have some basic strategies to organize styles, whether that’s a methodology like [SMACSS][smacss] or a utility like [Tailwind][tailwind]_ |

### Intermediate/Master

| Skill                       | Example                                                                                                                                                                                                         |
| :-------------------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Comprehensive JS knowledge³ | _I can solve any common problem in JS (when sensible), and I possess up-to-date knowledge of the latest [ECMAScript 20xx][ecma] features_                                                                       |
| Front-end philosophy        | _I have cursory-to-advanced knowledge of how strategies like [State Machines][xstate], [Observables][rxjs], [Component-based architecture][react], etc. solve different problems for building web applications_ |
| Performance profiling       | _I understand how to profile JavaScript’s performance, even moving operations [off the main thread][js-main-thread] where needed_                                                                               |
| Inheritance and prototypes  | _Beyond data types, I understand JavaScript’s [prototypal inheritance][prototypes] design_                                                                                                                      |
| Type System                 | _I understand JavaScript’s type system and [coercion][coercion], and know how best to leverage it (and potentially possess TypeScript knowledge)_                                                               |
| Testing                     | _I ensure all JavaScript is tested, whether with [unit / E2E][jest] tests, [headless browser tests][puppeteer], or [VRT][vrt]_                                                                                  |
| Advanced network knowledge¹ | _I have comprehensive strategies for consuming API data and feel comfortable using client like [Apollo][apollo] or rolling my own._                                                                             |
| DOM manipulation¹           | _I understand JavaScript’s role in DOM manipulation, and strategies for managing this such as [React][react] (related to Camp 1)_                                                                               |
| WebAssembly                 | _I understand how JavaScript interops with [WebAssembly][wasm] and know when to leverage it_                                                                                                                    |

_¹ related to I / ³ related to III_

In JavaScript’s strange, strange development, something very weird happened that few could have
predicted: _JavaScript turned into a backend language with Node.js._ This not only changed how we
_prepared_ JavaScript for the browser (Camp 1); it also changed how we wrote it (Camp 2).

Let’s be clear: _Node.js is a backend language._ In this post we’re not talking about the backend,
but we can’t deny that Node.js has changed the front-end ecosystem forever with advanced tooling to
npm. And this knowledge makes up the final area.

## 👷‍♀️ III: The Toolchain (Node.js, npm, Babel, bundlers)

The final area of expertise is one you won’t see outlined often, if at all, as separate from JS
(II). It likely got lumped in with the “JS devs” in _The Great Divide_ post. Though it seems like a
part of JS, the toolchain is more “meta”, and its concern more aligns with: **Can the way we develop
web applications be improved?** and it’s given rise to [module systems][esm], [package
managers][npm], [transpilers][babel], [bundlers][webpack], and even [new languages][jsx].

So while web dev today is largely JS, thus explaining the confusion between II and III, perhaps it
won’t be for long with things like [WebAssembly][wasm] on the rise. And you can contribute to the
toolchain without being a JS dev whatsoever (for example, though Babel is central to JS dev these
days, Babel plugins themselves apply generic principles of [AST][ast]s that apply to any language,
and nothing about it is uniquely JS other than the syntax used to write it).

This area of knowledge is also hard to outline because by its nature it questions the ontology of
front-end development. But it’s also the most powerful because it has the ability to transform how
we work. And as it also requires at least an intermediate understanding of _some_ programming
language (even if not JS), the “Beginner” section was omitted entirely here.

### Intermediate

| Skill                    | Example                                                                                                                 |
| :----------------------- | :---------------------------------------------------------------------------------------------------------------------- |
| Configuration            | _I can configure a local development without a boilerplate, working directly with tools like Gulp, webpack, and Parcel_ |
| Transpilation¹           | _I can configure Babel and PostCSS to transpile code for specific targets_                                              |
| Bundling & optimization² | _I can set up build pipelines to ship production-ready code and optimize delivery of those bundles_                     |
| Advanced npm             | _I’ve deployed my own packages to npm_                                                                                  |

### Master

| Skill                   | Example                                                                                                       |
| :---------------------- | :------------------------------------------------------------------------------------------------------------ |
| Architect               | _I can build front-end boilerplates for other people to use_                                                  |
| AST understanding       | _I can create my own [Babel][babel-plugin] or ESLint plugins_                                                 |
| Bundler understanding   | _I can create my own webpack plugins_                                                                         |
| Code Generation         | _I can generate JS programmatically_                                                                          |
| CI²                     | _I create automated pipelines for deploying npm packages as well as shipping optimized bundles to production_ |
| Ecosystem understanding | _I understand how to deploy npm packages for Node.js, web browsers, and CLI tools, and how to target each_    |

_¹ related to I / ² related to II_

Usually when complaints arise about the state of front-end development, whether that’s how much it’s
changed, or if it’s too complicated, usually JavaScript gets the blame when really it’s the
toolchain. Of course, this is confusing, since JavaScript is both the engine that runs the toolchain
(Node.js) and the input/output of the toolchain itself (browser JS).

This is also the area of expertise that’s undergone the biggest changes of front-end development,
and it won’t be settling any time soon. Still, now’s the perfect time to jump in and contribute
_because_ all these things aren’t settled yet.

## A final note on mastery

Recently, a coworker used the term “Platypus” to refer to an engineering problem which is difficult
to classify (obviously based off an animal that lays eggs, is aquatic, has fur, and poison), and I
love that. He didn’t remember the origin (and I Googling it only gave me the results you might
expect), so I apologize for not being able to source this (if you know where this originates from
please contact me).

In a similar vein, you probably you noticed the superscript ¹s, ²s, and ³s linking skills in one
area to another. This is a natural failing of any taxonomic system to be perfect. While there’s
always overlap, there’s still enough net value to drawing lines that it’s worth doing.

Mastery of any of these areas is a slippery thing, too. I’m reminded of Matt Might’s post, [_The
illustrated guide to a Ph.D._][phd] To merely reach the limits of human knowledge is not enough;
we’re all pushing to try and make that little “dent” in the shape of what’s possible. And with that
act, we leave behind a bigger world to explore for the next generation.

Even theoretically if you could master something, it would only last for a short time until someone
came along and changed what’s possible with their dent. And I can’t say this enough: **the internet
is a fledgeling industry**. We’re still figuring everything out.

Above all else, **be kind to yourself,** and pursue mastery only to the extent it’s rewarding for
you and others around you. And if you do write an “us vs them” post, write it with the intent of
unifying, not dividing. God knows we have too much division going on as it is.

[apollo]: https://www.apollographql.com/
[ast]: https://en.wikipedia.org/wiki/Abstract_syntax_tree
[babel]: https://babeljs.io/
[babel-plugin]: https://github.com/jamiebuilds/babel-handbook/blob/master/translations/en/plugin-handbook.md
[browser-api]: https://developer.mozilla.org/en-US/docs/Web/API
[browser-processes]: https://developers.google.com/web/updates/2018/09/inside-browser-part2
[coercion]: https://developer.mozilla.org/en-US/docs/Glossary/Type_coercion
[css-animation]: https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Animations/Using_CSS_animations
[css-gd]: https://css-tricks.com/the-great-divide/
[dom]: https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model
[ecma]: https://developer.mozilla.org/en-US/docs/Archive/Web/JavaScript/ECMAScript_Next_support_in_Mozilla
[es-lexer]: https://github.com/guybedford/es-module-lexer
[esm]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules
[fetch]: https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API
[gpu-acceleration]: https://www.smashingmagazine.com/2016/12/gpu-animation-doing-it-right/
[history]: https://developer.mozilla.org/en-US/docs/Web/API/History_API
[imageoptim]: http://imageoptim.com/
[jest]: https://jestjs.io/
[js-main-thread]: https://developers.google.com/web/fundamentals/performance/rendering/optimize-javascript-execution
[js-profiling]: https://developers.google.com/web/tools/chrome-devtools/rendering-tools
[js-this]: https://github.com/getify/You-Dont-Know-JS/blob/2nd-ed/objects-classes/ch1.md
[jsx]: https://reactjs.org/docs/introducing-jsx.html
[lighthouse]: https://developers.google.com/web/tools/lighthouse/
[npm]: https://www.npmjs.com/
[objects]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Working_with_Objects
[paint-api]: https://developer.mozilla.org/en-US/docs/Web/API/CSS_Painting_API
[phd]: http://matt.might.net/articles/phd-school-in-pictures/
[promise]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise
[prototypes]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Inheritance_and_the_prototype_chain
[puppeteer]: https://developers.google.com/web/tools/puppeteer/
[react]: https://reactjs.org/docs/design-principles.html
[resource-prioritization]: https://developers.google.com/web/fundamentals/performance/resource-prioritization
[rxjs]: https://www.learnrxjs.io/
[simplify-paint]: https://developers.google.com/web/fundamentals/performance/rendering/simplify-paint-complexity-and-reduce-paint-areas
[smacss]: http://smacss.com/
[surma-120fps]: https://dassur.ma/things/120fps/
[tailwind]: https://tailwindcss.com
[three]: https://github.com/mrdoob/three.js/
[vue-cli]: https://cli.vuejs.org/
[vrt]: https://happo.io/
[wasm]: https://webassembly.org/
[webgl-api]: https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API
[webpack]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules
[xstate]: https://xstate.js.org/
