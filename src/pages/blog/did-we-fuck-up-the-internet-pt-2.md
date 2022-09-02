---
title: Did we fuck up the internet? part 2
date: 2020-10-17
updated: 2021-10-30
description: |
  As the philosopher Thom Yorke once said, “where do we go from here?”
tags: ['dev']
layout: ../../layouts/post.astro
---

I took a month from [my last post][pt1] to reflect on what the future of the internet might be. To
recap, the internet _is_ in a precarious state, from but not limited to the following:

- it’s [lost many of its great protectors][mozilla]
- it’s [being actively exploited as the ultimate propaganda machine][facebook]
- it’s [frustrating and burning out its maintainers][webdev]

The [first][protectors] and [second][propaganda] problems are not only beyond my pay grade, they’ve
been covered at length elsewhere. But I am here to speak on “frustrating and burning out its
maintainers.” What better way to save the internet than to make its barrier to entry as low as
possible?

In that vein, I think the internet is long overdue for a (realistic) reimagining. Keep in mind what
follows is complete imagination; an utter shot in the dark. Assume HTTP and the underlying protocols
all still exist, but what if we could reinvent the fragmented HTML/CSS/JS mega-ecosystem with all
the server-side languages, frameworks, preprocessors, and bells and whistles that come with it? And
if we did, could we make lives easier? Here are 4 ideas to make web dev more maintainable:

## future 1: overhaul HTML

HTML was originally created to easily create rich documents. Problem is [we’ve been building
highly-interactive web apps for years][html]. And because of that disconnect, we have to build the
same UI components, over, and over, and over (and over) again.

<figure>
  <img src="/assets/posts/4-possible-futures-for-the-internet/npm-ui-components.png" alt="search for “ui component” on npm" />
  <figcaption>
    Searching for “ui component” on npm yields over 11,000 results. I can’t help but feel that too many of those were made out of necessity rather than preference.
  </figcaption>
</figure>

Although one solution to alleviate this sisyphean task would be to ditch HTML and the “document”
idea altogether,
[HTML is responsible for some of the most accessible interfaces we’ve ever built](/blog/was-html-a-mistake/).
Screen readers and a suite of tools revolve around HTML’s design, so simply throwing it away would
mean decades of setback for less-abled individuals.

What if we kept HTML, but made it do more out-of-the-box? What if instead of building the 5,672nd
multiselect in [framework of choice], we could instead add a `<input type="multiselect" />` to the
page and be done? Or how many terrabytes of npm packages could be reduced if browsers shipped a
decent built-in `<dialog>`?

_“But there IS `<select multiple>` already!“_ some will say. But I _know_ you’ve never used that—and
only that—to add that interaction to your site. It hasn’t worked for mobile devices in years. And I
_know_ you’ve never used an unstyled `<input type="date">` to fully power your hotel or
airline-booking website. Google—the biggest advocate for the `<dialog>` element—doesn’t even use it
anymore in its Material Design for web.

_“But the Web Components spec!” “But HTML5 was designed to create custom interactions!”_ I’m not
saying that there’s been no reason, or thinking, that led us to where we are now. I’m simply
disagreeing with it.

Look at how far native development has come—both iOS and Android have common UI that works, and
works well. Why are the default HTML elements so garbage? And why is it impossible to style most of
them?

### how it will help

For web we spend so much time setting up projects, build tools, and remaking the same UI components
as others with almost the exact same results, it feels like we’re all too tired by the time we get
to the actual work. By having a much more usable set of UI components baked into the browser, we
could more quickly create sites and content.

### how to get there

We need a new community-oriented HTML spec that saves us from building the same UI elements over and
over and over again. And we need a new browser that supports all of these. We need [all the 1300+
proposed elements][html-proposals] not _only_ to ship, not _only_ to be stylable (looking at _you_,
`<progress>`), but primarily **to be usable without styling**.

One better future for the internet is if politely, and with all due respect, the HTMLWG takes a seat
while the community builds one central UI solution to serve the needs of the modern web. We _can_
have it if we build it (and if you want to build it, <a href="mailto:drew@pow.rs">contact me</a>!).

## future 2: bye bye browsers, hello native

[JavaScript is _hard_][js-is-hard]. No, not because of the language design. Not because of the
community. It’s hard _in spite_ of the countless contributions from brilliant individuals _who make
it workable._ It’s hard because to make a simple experience for users, one must wield HTML, CSS, and
JS deftly to cobble together… what? An experience that can be [slow to load][cost-of-js], [bad for
users][nng-js], and was an absolute nightmare to assemble.

What if we ditched all that? What if, instead, we shipped experiences like apps in iOS or Android?
Consider:

- Native apps have **built-in offline mode** (unlike the web, which requires complicated setups like
  service workers)
- Native apps have **unmatched performance,** being compiled rather than runtime scripts
- Native apps are **more bandwidth-efficient** since they don’t have to be redownloaded every time
  they’re used
- Native apps can offer **similar accessibility** because more of the device can be used
- Native apps can offer **a wider range of experiences,** partly by way of being closer to the
  hardware; partly due to the increased performance.

I know I’m guilty here of comparing _the best_ native apps to _the average_ website, and there’s not
a clear winner (I would be out of a job if that were the case!). The Web vs Native debate has been
talked about [ever since the arrival of the Apple App Store][web-is-dead] (arguably as a
continuation of the classic [desktop application vs web software debate][other-road-ahead]). But I’m
just saying I believe _Native Apps conceptually make more sense than web for task-based
applications_.

Assume there’s a development environment that lets you build native applications for every target
(for example, [Flutter][flutter]). Assume that one codebase could generate native clients for all
major desktop and mobile OSs. Also assume there arises some open way to produce apps that’s not
gatekept by a corporation like Apple or Google (like npm or GitHub—though corporate entities— have
fostered an open, community-powered marketplace where anything may be published for free).

Assuming all those roadblocks were removed, what’s stopping us?

### how it will help

Much of [JavaScript fatigue][js-is-hard] and the mountain of complexity comes from us fighting with
the internet’s original [document model][html] that we have outgrown, and abused to all hell to try
and make rich interactive experiences. The weird place we’re in only came from a (very) winding path
to where we are now. If we had to recreate web development based on our needs today, I’m convinced
JavaScript wouldn’t be a part of it. So if we could start over and save everyone’s time, why don’t
we?

### how to get there

So the trade I’m proposing here is a _vastly_ simpler web environment, and the next-generation of
experiences. In exchange? We only need to give up the archaic yoke of browsers that have hindered
progress. We employ a model to experiences similar to npm or GitHub, where experiences can not only
be downloaded; they can be examined for security.

_“That’ll never happen,”_ some may say. But let’s put a spin on the current reality for a bit: isn’t
Google the only way you can use the internet today? Isn’t Google just a shittier app store in its
current form? What if we could improve everything across the board? We could with native, if we
solved the discovery and oversight problems.

## future 3: jamstack, except it works

In possibly the least sci-fi future, we forge full ahead on the _Jamstack_ (originally *J*avaScript,
*A*PIs, and *M*arkup—”JAM”—which has [since been broadened][jamstack-jamstack]), [despite
oppositions to it][jamstack-vs-wp]. This means that we double-down on our current bets that
everything will work out, despite billions of dollars being sunk into all its inefficiencies, in the
hopes that it’ll get better. _Why?_

- **Static Typing in JS**: What if TypeScript became a part of the language spec? It would not only
  mean more reliable applications; it would also [drastically simplify and speed up build
  tools][deno-ts]
- **ESM is now a thing**: A huge point of complexity [and headaches][webpack-headaches] has been the
  CommonJS (Node) vs ES Modules divide. With Node.js and JavaScript (and Deno) all moving to one
  module system, it could change the web (we’re also [betting on this with Skypack][skypack]).
- **WASM enters the mainstream**: though WebAssembly didn’t change everything about the web on its
  release, doesn’t mean it isn’t slowly making strides. [wasm-powered tools][wasm] have been
  skyrocketing lately. [Rust is the new darling of software][rust]. Arguably the biggest flaw in the
  web’s design is demanding that JavaScript always be used for the client (even as a Node developer
  myself, I realize Node has limitations and can’t realistically power many servers). HTML and CSS
  aside, wouldn’t the web be much easier to build for if the client and server could be written in
  one language?

All of these are signs towards progress, but there’s one fatal, fatal flaw in this approach:
**server-side rendering.** Browsers are designed to work best with JavaScript as an accessory; not
as a foundation. HTML is still queen. Regardless of whether _your_ site can get away with being a
pure SPA, [that won’t cut it for the rest of the web][no-js].

### how it will help

One could argue this is our current path, merely a projection. This makes the bet that it’ll get
_even worse_ before it gets better in terms of complexity and knowledge required. But the payoff
some, new, “holy grail” future framework that will make everyone’s lives easier.

### how to get there

Several things need to fall in place to [pay down the debt we’ve been accumulating for a while][kj].
If we _do_ decide that JS is the foundation, and not HTML, then we need build tooling that handles
all of the above:

- Can turn JavaScript templates into static HTML easily (in _any_ JavaScript solution, not just My
  Popular Framework™). Also it wouldn’t require Node.js.
- Doesn’t load any JS to the client if it’s not needed.
- When JS does load to make the page interactive, [it only re-renders the interactive
  parts][islands], rather than blocking the main thread and hijacking everything in the browser.
- Doesn’t require [agonizing compile times][webpack-slow] that cost time, money, and headaches.

While this the closest direction to the one we‘re heading in, it’s a humbling reminder that some of
the biggest, hardest pieces have yet to fall in place—mostly the SSR part. And it’ll take a lot of
work yet before the “bet on JS” has actually paid off.

## future 4: a tale of two webs

Tom MacWright’s [_A clean start for the Web_][tm] outlines a _Document Web_ and an _Application Web_
coexisting, a little like combining futures #1 and #2 above. While this is an idea that I’ve been
thinking about for a while, I have to give Tom the credit, because he wrote it down and I didn’t
(also he puts things into words better than me; why are you even reading my blog again? Go read
his!).

So one could argue that this is either a _migration_ or _experiment_ towards an alternate future,
but it may end up being a viable path for longer than Tom devotes space for in his blog post. In
summary:

- **Document web** is for reading. Wikipedia, news, blogs, etc. Basically squarely inline with
  HTML’s original design.
- **Application web** is for everything else: mapping, shopping, games, entertainment. All the rich
  interactive experiences do back to native.

In this world, JavaScript plays a much-reduced role, or even goes away entirely. Browsers become
more pure “readers,” centralized around delivering static content. Meanwhile, interactive
experiences become richer and more widespread as thousands of web creatives finally make the leap to
native development.

### how it will help

This pays down the technical debt we’ve been mired in for over a decade, by splitting apart
concerns. This recognizes that the load we’ve placed upon HTML, CSS, and JS has been too great for
too long. But rather than force documents to live in native-land (solution #2), we give documents
their own environment, perfect for them: _Document Web_. And all the “web app” stuff we architect a
new medium for.

### how to get there

I think in this future, too, browsers go away (out of my predictions, that’s 3/4 futures, if you’re
counting at home). Something _browserlike_ will replace it, sure, but would be so reduced in purpose
I’m not calling it a browser.

Similarly, we have the same stalemate as future #2 where there is no central service to deliver
applications other than Apple’s App Store and Google’s Android marketplace. What could that look
like? What could an app “standard” resemble? And could it be openly-governed?

## we desperately need a new future

Above all else, we really need to change how we build the web not for ourselves, but for those who
will come after us. The internet was architected to be a bastion of free speech and radical
democracy, but that light has been fading for some time. I believe the central contributor to this
is that **only privileged, educated, wealthy individuals have been building on the web**. And so,
historically, the web has looked, sounded, and gatekept by these elite few.

Likely none of these will come to pass; likely each of these has a mountain of hidden complexity
that is harder to overcome and contains more problems than our current system. But I’m a big
believer in taking a step back, and looking what we have. And I believe that anyone that does this,
honestly, can’t be satisfied with the web ecosystem we’ve built for ourselves.

Being dissatisfied with the status quo of _how_ the web is built isn’t just a good idea; _it’s
necessary_. **We need it to change.** This web development shit is difficult enough for experts with
years of experience and education to pull off. Imagine how alienating and frustrating it must be for
newcomers! And with all that’s going on in the world, we have never needed the internet to be less
white, and less male, than it is now. [But sadly, that’s not changing.][diversity].

Reducing the complexity of the web isn’t just a “nice to have” for our own sakes. It’s the very
thing that will save our souls.

[cost-of-js]: https://timkadlec.com/remembers/2020-04-21-the-cost-of-javascript-frameworks/
[deno-ts]: https://github.com/denoland/deno/issues/5432
[diversity]: https://www.cnbc.com/2020/06/12/six-years-into-diversity-reports-big-tech-has-made-little-progress.html
[esm]: /blog/the-state-of-es-modules-in-2020/
[facebook]: https://techcrunch.com/2019/09/26/voter-manipulation-on-social-media-now-a-global-problem-report-finds/
[html-proposals]: https://github.com/whatwg/html
[html]: /blog/was-html-a-mistake/
[gatsby]: https://twitter.com/tesseralis/status/1293649015020457984?s=20
[kj]: https://www.youtube.com/watch?v=rvoZKQn2Go8&list=PLk0Uo6Nr8Xhl7rJggs0d1mdiWZlokMCFm&t=5m22s
[flutter]: https://flutter.dev/
[islands]: https://jasonformat.com/islands-architecture/
[jamstack-jamstack]: https://css-tricks.com/jamstack-vs-jamstack/
[jamstack-vs-wp]: https://www.theregister.com/2020/10/13/wordpress_matt_vs_netlify_matt/
[js-is-hard]: https://lea.verou.me/2020/05/todays-javascript-from-an-outsiders-perspective/
[mozilla]: https://www.enterprisetimes.co.uk/2020/08/13/will-mozilla-layoffs-affect-security-of-firefox-browser/
[nng-js]: https://www.nngroup.com/articles/the-need-for-speed/
[no-js]: https://www.smashingmagazine.com/2018/05/using-the-web-with-javascript-turned-off/
[other-road-ahead]: http://www.paulgraham.com/road.html
[protectors]: https://www.wired.co.uk/article/google-chrome-browser-data
[propaganda]: https://www.thesocialdilemma.com/
[pt1]: /blog/did-we-fuck-up-the-internet-pt-1
[rust]: https://thenewstack.io/microsoft-rust-is-the-industrys-best-chance-at-safe-systems-programming/#
[skypack]: https://www.skypack.dev
[tm]: https://macwright.com/2020/08/22/clean-starts-for-the-web.html
[wasm]: https://2ality.com/2020/10/js-plus-other-languages.html
[web-is-dead]: https://www.wired.com/2010/08/ff-webrip/
[webpack-slow]: https://blog.box.com/how-we-improved-webpack-build-performance-95
[webpack-headaches]: https://blog.sindresorhus.com/webpack-5-headache-b6ac24973bf1
[webdev]: https://macwright.com/2020/05/10/spa-fatigue.html
