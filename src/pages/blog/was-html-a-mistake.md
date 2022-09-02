---
title: Is it time to retire HTML?
date: 2020-04-19
updated: 2021-09-18
description: |
  HTML was designed for basic text editing. How is it still holding up in a world where we’re building rich interactive experiences?
tags: ['dev']
layout: ../../layouts/post.astro
---

OK, hear me out. Even if [Betteridge is right][betteridge] and the answer at the end of this blog
post ends up being “no,” let’s treat the question “is it time to retire HTML?” purely as a thought
experiment. And it may shed light on some of the more frustrating parts of making websites.

## why was HTML created?

<figure><img src="/assets/posts/was-html-a-mistake/tims_editor.gif" alt="Tim Berners Lee’s WorldWideWeb (Nexus) browser editor" /><figcaption>Tim Berners Lee’s “WorldWideWeb” browser editor (1993) <a href="https://www.w3.org/People/Berners-Lee/WorldWideWeb.html" target="_blank" rel="noopener noreferrer">source</a></figcaption></figure>

Tim Berners Lee open-sourced the first browser in 1993 as a [WYSIWYG][wysiwyg] editor. So basically
an internet-connected Microsoft Word.

…that’s it. That’s why it was invented. To share docs with other people online. You thought there
was going to be more history to it? No; it’s not that old.

Now we’ll fast-forward a few years. Please explain to me how the _fuck_ you might accomplish
something like this in a WYSIWYG editor:

<figure>
  <video autoplay="true" controls muted loop playsinline width="800" height="500">
    <source src="/publci/posts/was-html-a-mistake/rino-pelle.mp4" type="video/mp4" />
  </video>
  <figcaption>The actual homepage of <a href="https://rino-pelle.com" target="_blank" rel="noopener noreferrer">rino-pelle.com</a>. An actual work of animation art that people actually made, somehow.</figcaption>
</figure>

If your answer is “that looks hard to do,” you are absolutely correct. It’s _hard_ trying to trick
HTML a.k.a. “Microsoft Word Online” into doing something this awesome.

I, too, bemoan the fact that the [average website today weighs `2 MB`][http-archive]. And it’s easy
to blame JavaScript, or images, or whatever for that weight. But we’re fooling ourselves if we think
we can achieve 👆 in under `2 MB` with our current tools (Rino & Pelle, since you’re wondering, is
`1.87 MB` gzipped, unpacking to `2.07 MB`—pretty close to average, wouldn’t ya say?).

If the weight of the average website comes from lobbing enough JS at the DOM until we trick it into
animating, we have 2 paths forward to solve this: either we ditch the JS frameworks and revert the
web into mostly static documents like _The Good Lee_ intended. Or we don’t use HTML & JS and serve
something compiled instead.

## if not HTML, then what?

Once upon a time, long before Apple made decisions about the internet, [Flash][flash] existed. And
it was great. Flash was the defacto way you made cool, rich, interactive experiences. It not only
delivered futuristic, fun, imaginative, and creative interfaces, it did so on a budget, back in the
days of dial-up. On computers that had _way_ less memory and resources than our phones do now.

<figure>
  <div class="post-yt"><iframe width="560" height="315" src="https://www.youtube-nocookie.com/embed/UHbQmqmmIFk" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div>
  <figcaption>The <strong>2Advanced</strong> site in 2001, the gold standard for cutting-edge web design at the time</figcaption>
</figure>

I’m not saying that Flash itself was the pinnacle of what the web could be, no. There were reasons
for its demise, and it did compromise a core principle of the web: _openness_ (it not only had
critical security issues; it was proprietary technology owned by a private corporation and thus not
a web standard). Still, you have to give Flash credit for giving us the the most imaginative
interfaces we’ve ever seen outside of sci-fi films.

I’ll summarize our journey up to this point in a few true, albeit conflicting, statements:

- HTML was invented primarily for **text documents**
- HTML was **not designed** to be highly-interactive
- Full rendering control is best done in a **compiled native application**, like Flash or a
  video game
- Compiled applications are **closed-source** experiences that violate key principles of the
  internet’s open, safe design.

So how do we reconcile this—how do we have our cake and eat it too?

## …HTML5 canvas?

[HTML5 canvas][canvas] is a pretty-darn smart spec. It leverages CPU & GPU efficiently for
rendering, has an OK-ish footprint, and **keeps the source open**. Mind you, it’ll never replace
native code, but it’s essentially the correct answer to all the above problems—it lets us deliver
rich, interactive experiences for the web without compromising security or openness.

But to our earlier point, **canvas isn’t typically smaller than HTML,** so that’s a dead-end
already. Even if it makes animating & rendering _easier and more fun_, it’s still JavaScript, except
you have to build your rendering tools from scratch compared to HTML + CSS.

<figure>
  <video autoplay="true" controls muted loop playsinline width="800" height="500">
    <source src="/assets/posts/was-html-a-mistake/zoomquilt.mp4" type="video/mp4" />
  </video>
  <figcaption>Zoomquilt, the greatest Flash experiment ever made, was <a href="https://zoomquilt.org" target="_blank" rel="noopener noreferrer">revived in HTML5 canvas form!</a><br />Full disclosure: I know this isn’t 100% relevant to this post, but when am I going to get another opportunity to reminisce about Zoomquilt?</figcaption>
</figure>

But let’s assume (thought experiment) there _was_ a way to render crazy-awesome experiences with
canvas, and it was faster, lighter, and better all-around than HTML. We _still_ couldn’t switch to a
canvas-dominated internet because **it’s not screen reader-friendly** (unless you [use HTML as a
base and overlay canvas on top][firstborn]). That would mean most of the internet would be
unreachable to people with visual impairments. Just how many sites _is_ that?

## what is the web now? what will it be?

For as many statistical reports as I read, like “the average weight of websites” and “your users are
all using mobile phones” and “video is the way to market” ([debunked][fb-video], BTW), I can’t
remember reading a report that summarized **breakdown of the internet by industry.**

As of Apr 2020, there are an estimated **1.7 billion websites** ([Internet Live Stats][ils]) online.
Assuming that’s true…

- If there are [**600 million**](https://growthbadger.com/blog-stats/) blogs (most of which are on
  Tumblr), that would mean blogs make up **35% of websites** (_this is moving fast—only 65% to
  go!_).
- Thanks to monopolistic mergers and acquisitions, there are only a handful of popular social media
  sites, so that’s only, like, what? 10? 15?
- There are also a countable number of video/entertainment websites that serve online content, too
  (probably about 100 or so, counting the naughty stuff)… but we’re still probably at **35%**
  (_shoot; what are the rest?_).
- If [**64%**][clutch] of small businesses have a website, and there are… uh… hm. I have no idea how
  many businesses there are on Earth. At least 1%–65% of websites according to my estimates.
- If [WordPress powers 35% of all websites][wp], and WordPress sites mean blogs, editorial sites,
  and business sites… wait that overlaps with “blogs” above doesn’t it? Crap.

I honestly have no idea what the internet is made up of 🤷‍♂️, but we can make some sweeping
generalizations.

Going by _quantity_ (sheer number of websites), I would guess it’s mostly blogs + brochure websites
(businesses, restaurants, etc.). The vast majority of these are text-based (HTML).

When it comes to _bandwidth_, the data seems to point toward video content (Netflix, YouTube, etc.)
And video doesn’t apply to our current convo.

When it comes to _users’ time spent online_, a good amount is spent on the major social networking
sites like _Instagram_, _Twitter_, _TikTok_, etc. And that’s a mixture of video and text.

So all that to say, while it’s hard (impossible?) to give an accurate number of the web that must be
screen-reader friendly, and thus text-based, it’s safe to say “most.” And if screen reader support
is essential for most of the internet, **HTML is still the best foundation we have.**

## …so Betteridge was right, then? HTML still works for now?

Lately I’ve been spending more time with compiled languages (like Rust—which was used to make this
blog!) and loving them. And I wish we could make the internet more efficient by compiling more (I
know WebAssembly exists, but that’s not going to replace the DOM). Maybe the love affair the
internet had with its biggest compiled language to-date, Flash, had its heyday and it’s time to move
on. Maybe canvas is neat, but shouldn’t upend HTML as the _lingua franca_ of the web.

Maybe there’s something better on the horizon—but I don’t know what, or how it’ll give us everything
HTML, CSS, and JS does in a smaller package—but maybe we can serve the same creative, accessible
internet in under `2 MB` per page.

Until then, **HTML appears to still be the best delivery method for serving text-based content.**
But it doesn’t mean I have to enjoy animating it. And you can bet your bippy if I don’t need screen
reader support I’m going to be doing some [fun stuff in canvas][js1k].

[betteridge]: https://en.wikipedia.org/wiki/Betteridge%27s_law_of_headlines
[canvas]: https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API
[clutch]: https://clutch.co/website-builders/resources/small-business-websites-2018
[fb-video]: https://www.theverge.com/2018/10/17/17989712/facebook-inaccurate-video-metrics-inflation-lawsuit
[flash]: https://en.wikipedia.org/wiki/Adobe_Flash
[firstborn]: https://twitter.com/meusPartum/status/1143186195494658048?s=20
[http-archive]: https://httparchive.org/reports/page-weight
[ils]: https://www.internetlivestats.com/
[js1k]: https://js1k.com/2019-x/demo/4130
[patience]: ../playfulness-budget.html
[wp]: https://w3techs.com/
[wysiwyg]: https://en.wikipedia.org/wiki/WYSIWYG
