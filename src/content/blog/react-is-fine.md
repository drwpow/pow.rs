---
title: React is… fine
description: |
  The year of React’s demise should be coming the same year as the Linux Desktop.
pubDate: 2025-07-28
updated: 2025-08-12
categories: ["dev"]
---

What happened to Vue and Svelte? Weren’t they supposed to overtake React any year now? What happened?

I’ve been asking every year since about, oh, 2019 “when can I stop using React?” yet I find myself still within its throes 6 years later, feeling like not much has changed. The most succinct answer I have is: we’re in the stone ages of the internet. We’re banging rocks together trying to make fire, praying Prometheus will be stupid enough to just give it to us instead. I don’t really think React _is_ that fire, because I think I would know fucking fire if it descended from the heavens. But it’s the best we’ve got for now.

<figure>
  <img src="/assets/posts/react-is-fine/npm-trends-react.png" alt="npmtrends.com showing a line graph of React steadily climbing into 40M downloads/week, while Vue, Svelte, Lit, and Angular dwindle in the low millions, a mere fraction." />
  <figcaption>I look at <a href="https://npmtrends.com" target="_blank">npm trends</a> a couple times each year only to be more disappointed</figcaption>
</figure>

## What’s your deal with React?

Getting to complain about React is an absolute blessing and privilege, because I do so for work and I get paid to write React. But I never write React for _fun_. In no universe do I enjoy solving problems with it. If I had to organize my gripes, I’m chiefly grumpy about:

## i. Inconsistent design

React hooks’ design is horriffic. The point of having a reactive framework is to have state manipulation automatically figure out what the final DOM mutations should be. Requiring users to manually redeclare reactive dependency arrays everywhere while shipping [linters discouraging you from touching any of them](https://www.npmjs.com/package/eslint-plugin-react-hooks) is an absolute shitshow.

Why would you take away granular rerender hooks like `shouldComponentUpdate()` and replace with a magic solution and say “don’t control re-rendering,” except, _actually do_ require users to control rerendering on an even more granular level than before? The design is confused at best, broken at worst, and is getting even more muddied with [React Compiler](https://react.dev/learn/react-compiler/introduction) rollout threatening to break core APIs you “should have known not to use” (despite no deprecation warnings).

Throughout, the maintainer team’s general stance of [“you’re just holding it wrong,”](https://react.dev/learn/you-might-not-need-an-effect) was just the cherry on top of this giant mudpie to leave a bad taste in my mouth. The end result was one of the most confusing, expensive, dragged-out migrations in software history. And I personally would have rather had a simple breaking version, or, heck, [a different library name](https://v17.angular.io/guide/upgrade) instead.

### ii. Incomplete vision

When React was unveiled to the world in 2015, it got a pass for not having opinions on how to use CSS. By 2025, though, it has no excuse. Just ship with _some_ sort of support for CSS, for the love of god. And stop making me write `className`. React is the only JS framework to pretend like CSS didn’t exist and leave up to the user to implement everything, and we’ve [wasted much time with dead ends](https://dev.to/srmagura/why-were-breaking-up-wiht-css-in-js-4g9b) as a result.

### iii. Pseudoscience core

All of the previous points would be nitpicks in an otherwise successful system if the core principles were intact. But the main reason React was successful (JSX) is unrelated to some longstanding juju [some argue is worthless](https://svelte.dev/blog/virtual-dom-is-pure-overhead). Whichever side you take short term, the cold hard truth is **the Virtual DOM is useless long term.** In a world where all browsers benefit from a Virtual DOM today, browsers can and should be motivated to treat this as a platform-level concern, and provide APIs and enhancements so that this becomes worthless eventually. Changing this means a full-scale, bottom-up rewrite of React.

In fact, React and Preact are two of the only JS frameworks that even bother with this, the other dozens of popular frameworks just skip this, [and consistently post better benchmarks](https://github.com/krausest/js-framework-benchmark). And in a world where we really invest in the right tools, we should choose solutions that prioritize real-world, general needs and are not burdened by experiments or optimizations of the past.

## So, what JS framework should we all be using?

Weirdly, React has been working _fine_, because the flaws I just mentioned are “bandaid-able.” Smart enough engineers can paper over all these grievances in a way that’s more cost-effective than switching to a solution that has these fixed. And so we stay on React for another year, and another. And we… never switch? That’s where I get hung up on.

Because when you take a step back and realize that teams, knowing full well alternatives exist, still invest in React, is one of the strongest endorsements one can make about its design. Companies are putting their money where their mouth is, and deciding, monetarily, React is still the best investment. Sure, some of it is circular—making a framework change means reinvesting in hiring and staffing and training, and expensive software rewrites—but even accounting for that, many companies can and do make similar switches in other areas when there’s enough of a perceived payoff.

And then I wonder “is this just me?” until I go and look at what other JS frameworks are doing and remember I’m not alone. Despite popularity, in spite of capitalism, open source communities are still creating and building more JS frameworks that are solving React failures _and_ pushing the needle forward in significant ways.

[**Lit**](https://lit.dev/) is taking all the best ideas of JS frameworks in the last 10+ years, and tying them as closely to the web platform as possible, to yield the best blend of developer ergonomics with raw performance and future-proofing. [**Svelte**](https://svelte.dev) continues to produce innovation after innovation in imagining what a JS framework _could_ be, all while leaning into its successes. Other frameworks like [**Solid**](https://www.solidjs.com/) are trying to provide a stepping stone from our current React world to the future.

All of these ideas are great, and an improvement over modern React. But none are fucking fire sent from heaven. And they’re not _that_ much better than the mediocrity we deal with.

No, I think the shift will happen not by doing “React, but better.” I think the shift will happen when[the web platform itself does](/blog/did-we-fuck-up-the-internet-pt-1), or some substantial part of the browser stack changes like direct Wasm DOM manipulation such that React becomes impossible to follow. I think we’re stuck until then.
