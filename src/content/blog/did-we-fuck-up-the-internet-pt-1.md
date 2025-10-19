---
title: Did we fuck up the internet? part 1
pubDate: 2020-08-26
updated: 2021-09-17
description: |
  The principal designs of the internet were made a long time ago, for different uses than what we use it for today. Are keeping those old designs hurting the internet long-term?
categories: ['dev']
layout: ../../layouts/post.astro
---

“Learn the fundamentals” is a common piece of advice given to beginners when starting out. And
usually for web pages, it’s some form of “learn HTML, CSS, and JS.” Those three will never go away,
and will outlast any flavor-of-the-month framework (but full disclosure: I actually do tell
beginners to learn a flavor-of-the-month framework because it’s motivating, it’s what gets them
hired, and you can still learn the fundamentals at the same time).

But what if the fundamentals… aren’t so fundamental? What were to happen if the fundamentals
changed?

I’ve never written a “was the internet a mistake?” blog post (it’s either a cheap laugh—“we’re
monkeys that tricked rocks to think; we deserve what we get! ha ha”—or a bit melodramatic). But I
guess 2020 is the year I start.

## backstory: why I’m questioning the web

When I say I’m questioning the fundamentals of the web, I basically mean the HTML/CSS/JS + browsers
combo. Or at least this current version of it. Part 1 (this post) will outline what led to this. The
following parts will try and soothsay a little.

### the Mozilla layoffs

Our journey begins with [Mozilla laying off 25% of its staff in August 2020][mozilla-layoffs].
Software layoffs suck in general, but they _really_ suck when they carry global impact. An extreme
(but possible) take on the outcome is: this is the [death of Firefox][cc] and MDN as we know it
([Rust may be OK][mozilla-rust]).

If Firefox goes, then the burden of the internet rests practically on the shoulders of Chromium (if
you’re reading this in the far future, remember that [Microsoft recently abandoned their historic
browser project in favor of Chromium][microsoft-chromium]).

At worst, such monopolistic control over the internet is so dangerous it had to be held in check by
a [2001 Supreme Court ruling][microsoft-v-us]. At best, the responsibility of stewarding the
development of _the entire internet_ is so monumental, it crushes any mere team of mortals tasked
with it. Either way, if Chromium is the last browser standing, it’s bad news for all.

> Do you think the web has almost 'priced itself out of the market' in terms of complexity if only
> 1-2 organisations are capable of building rendering engines for it?
>
> Microsoft gave up, Mozilla will struggle as you say.
>
> — [Mike Healey on Aug 20](https://twitter.com/i/status/1296573362223759361)

I guess there’s WebKit still 🤷‍♂️. Until Apple remembers they’re supposed to maintain it.

### maybe JS isn’t the answer

We pause there, and join the developer discussion in another part of the dev sphere, where people
(like myself) are having existential career questions. _[Second-guessing the modern
web][second-guessing-modern-web]_ by Tom MacWright comes to mind as a post at the center of the
discussion around whether or not our current JS-heavy trajectory is healthy.

JS has always had nay-sayers. [JavaScript fatigue][js-fatigue] had been questioning this direction
since 2015. And there have been no shortage of the “get off my lawn“ old guard complaining about any
attempt at replacing jQuery ([link][fuchs-react]). However, MacWright’s post came across as a
concerned insider rather than an outside detractor that [even got the React folk thinking][abramov]
(and yes, there’s a world of difference between the two).

I’d wager that if React is under question, the larger JS direction (React + webpack, built by
Node.js) is under question by extension. Of course they aren’t the same thing, but nothing has come
close to React’s popularity and staying power for the web (especially when you factor in React
Native and other targets). If React goes, there’s no clear replacement, which means further
splintering.

In rough chronological order, here are a few notable discussions/milestones that amount to some key
players in tech all rethinking reliance in JS:

- 2019: Web Components gain widespread browser support, and are basically standardized React
  components, but [devs don’t like them][wc-rh]
- 2019–2020: websites are over 2MB and [getting bigger][page-weight] thanks to more JS
- Apr 2020: a [pretty damning study of JS frameworks][cost-of-js] comes out
- May 2020: Tom Wright’s [Second-guessing the modern web][second-guessing-modern-web] post

### our tools are (still) fractured

From time to time we all need to step outside our bubbles (JS, Rails, PHP, etc.) and be reminded
that the web development community is (still) fractured. HTML, CSS, and JS are inadequate in their
current form, so we turn to ellaborate tools to fill in their shortcomings.

We can’t simply write HTML, so we turn to template languages: _Nunjucks_, _Jinja_, _Handlebars_,
_Pug_, and _Liquid_, to name only a few (there are dozens and dozens I missed). But to compile these
non-standard templates, we need a compiler that’s likely built in Ruby, Node.js, Go, Python, or
Rust, depending on our choices (and the language used has sweeping consequences).

Or perhaps you need to generate markup dynamically, in which case you’ll need a server. Again you’ll
have to pick a language (Ruby, Node.js, Go, PHP, Python, or Rust) as well as a framework (Rails,
Nest.js, Django, Laravel, Rocket, etc.). Your choice here will have further sweeping consequences.

And then there’s writing JS, which may or may not get types (TypeScript), and which will likely be
built in a framework (Svelte, React, Vue, Angular, etc.). All of these choices will require setting
up tooling (webpack / Rollup / Snowpack), as well as the connection to the server from your earlier
choices.

By now, we’ve been divided and subdivided and subdivided again by our choices. I want to be clear:
I’m not at all advocating that we need to use one programming language for anything, or that
different problems need different solutions. But I am wondering why, if webpages are supposed to be
a standardized concept, there are so many splintered ways to assemble them that I fear we’re losing
knowledge (and people) in between the gaps.

**There shouldn’t be so many ways to do one standard thing.**

## where do we go from here?

To recap, I’m questioning current webdev practices because:

- we might be back to a browser monopoly again
- all of us hate writing HTML/CSS/JS so much we invent new ways every year to avoid it
- React + Node.js bundlers are cool but didn’t live up to promises
- our savior, web components, wasn’t received well (also worth mentioning it was championed by our
  Chromium overlords so we’ll see if they ever do anything nice for us again)

All signs that cast doubt on our current direction. But even though the future is uncertain and
there’s no clear answer to how we solve all this, we can still make some intelligent bets. So in
part 2, we’ll do exactly that.

[abramov]: https://twitter.com/dan_abramov/status/1259614150386425858?s=20
[cc]: https://twitter.com/chriscoyier/status/1296573362223759361?s=20
[clean-start]: https://macwright.com/2020/08/22/clean-starts-for-the-web.html
[cost-of-js]: https://twitter.com/tkadlec/status/1252613423361376256?s=20
[fuchs-react]: https://twitter.com/search?q=%40thomasfuchs%20react&src=typed_query
[js-fatigue]: https://medium.com/@ericclemmons/javascript-fatigue-48d4011b6fc4
[laurie-voss]: https://seldo.com/posts/you-will-never-be-a-full-stack-developer
[page-weight]: https://twitter.com/scottjehl/status/1263492890979979264?s=20
[plan-e]: https://www.youtube.com/embed/PPEbmbWuBx4?start=8&end=25&rel=0
[microsoft-chromium]: https://www.theverge.com/2019/5/6/18527550/microsoft-chromium-edge-google-history-collaboration
[microsoft-v-us]: https://en.wikipedia.org/wiki/United_States_v._Microsoft_Corp.
[mozilla-layoffs]: https://www.theverge.com/2020/8/11/21363424/mozilla-layoffs-quarter-staff-250-people-new-revenue-focus
[mozilla-rust]: https://blog.rust-lang.org/2020/08/18/laying-the-foundation-for-rusts-future.html?ref=hvper.com
[second-guessing-modern-web]: https://macwright.com/2020/05/10/spa-fatigue.html
[so-survey]: https://insights.stackoverflow.com/survey/2020
[social-media]: https://www.apa.org/members/content/social-media-research
[svelte]: https://github.com/sveltejs/svelte
[wc-rh]: https://twitter.com/Rich_Harris/status/1198332398561353728?s=20
