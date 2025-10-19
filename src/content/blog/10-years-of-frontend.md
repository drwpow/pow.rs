---
title: 10 Years of Frontend
description: Plus another 6 of whatever you called it before that.
pubDate: 2023-12-31
categories: ['dev']
---

<img width="800" height="600" src="/assets/posts/10-years-of-frontend/year-2000.jpg" alt="Conan O’Brien and Andy Richter’s “In the Year 2000” sketch." />

It’s fun to try and <a href="https://www.youtube.com/watch?v=AukA-kDNSNc" target="_blank" rel="noreferrer">guess what the future holds</a>. And what better time to do it than on New Year’s Eve?

This year marks a decade of frontend development for me. Which is as long as anyone could say they’ve done it, because it wasn’t a job title before then (at least not in my part of the world).

In the past 10 years the web has undergone some really wild changes. Many were as pointless and frustrating as a <a href="https://twitter.com/meltedmasks/status/1036751916196192257?lang=en" target="_blank" rel="noreferrer">tailing mission in a video game</a>. Others may point to the future of civilization as we know it. In this blog post I’ll take a look back on the past decade of frontend to try and guess where we’ll be in 2033, while trying my best to avoid my Grandpa-mode-back-in-my-day ramblings about hacking CSS floats and putting Web 2.0 peeling stickers everywhere (hate to break it to you, but table layouts and image rounded corners—which I also did—are even older than that).

## 2015: The rise of React

It’s no secret that Facebook’s JS framework had a monumental impact on how the web is built and experienced. It opened our eyes to what’s possible—we could have true, interactive, animated, desktop-app-like experiences in a browser! No
longer are we limited to simple brochure sites and form-submission-powered dashboards.

React spread like wildfire, becoming “the way to do things”<sup>1</sup> within a few short years of its public release.

<figure>
  <img width="2716" height="1124" src="/assets/posts/10-years-of-frontend/npm.png" alt="Timeseries graph of npm downloads comparing React, Angular, Vue, and Svelte." />
  <figcaption>
    It’s not even close—React (orange) is downloaded 5× more than the runner-up framework (Vue, in red), and almost 10× more than 3rd place (Angular, in blue). And the gap is <em>widening</em>!<br /><br />Sidenote: ignore the spikes;
    those are reporting errors. Also please excuse the lines not matching their respective brand colors (the chart wasn’t configurable 😛)
  </figcaption>
</figure>

_Why_ React became so widely-used (and so quickly) is complex, and doesn’t fit into a neat answer. It wasn’t the first popular <abbr title="JavaScript">JS</abbr> framework, nor was it the most advanced. But answering that question isn’t interesting to me; I just chalk it up to “<a href="https://en.wiktionary.org/wiki/in_the_right_place_at_the_right_time" target="_blank" rel="noreferrer">right place, right time</a>” and move on. A far more interesting analysis is reflecting on React’s lasting impact, not only on the **content** of the internet, but the **developers** who build it as well.

<figure>
  <img width="2392" height="1434" src="/assets/posts/10-years-of-frontend/page-weight.png" alt="Timeseries graph of page weight, according to HTTP Archive’s State of the Web report." />
  <figcaption>
    From 2013–2023, the average page weight increased from ~0.8MB to ~2.5MB, according to <a href="https://httparchive.org/reports/state-of-the-web" target="_blank" rel="noreferrer">State of the Web report</a>
  </figcaption>
</figure>

<hr />

<i><sup>1</sup> While many frameworks like Backbone.js/Angular/batman.js/Ember.js/etc. predated React, they paled in comparison to React’s adoption and widespread usage.</i>

### React’s impact on the content of the internet

In <b>content terms</b>, **the internet has gotten (much) heavier**. I won’t belabor the point as it’s been <a href="https://medium.com/@addyosmani/the-cost-of-javascript-in-2018-7d8950fbb5d4" target="_blank" rel="noreferrer">already</a> <a href="https://infrequently.org/2018/09/the-developer-experience-bait-and-switch/" target="_blank" rel="noreferrer">been</a> <a href="https://web.dev/case-studies/vitals-business-impact" target="_blank" rel="noreferrer">covered</a> <a href="https://macwright.com/2020/05/10/spa-fatigue" target="_blank" rel="noreferrer">at</a> <a href="https://infrequently.org/2023/02/the-market-for-lemons/" target="_blank" rel="noreferrer">length</a>. But it’s still worth not forgetting React was a large cause of this: by shifting the interactivity from the backend to the frontend, it also increases the code weight by its fundamental design. But frameworks like <a href="https://qwik.builder.io/" target="_blank" rel="noreferrer">Qwik</a> (and <a href="https://astro.build/" target="_blank" rel="noreferrer">Astro</a>!) have led the charge in executing that client code in the server (or not at all). Which is a feat of engineering, to say the least.

The good news is devs have been receptive to tools that basically provide “free speed” while still getting to write React (or React-adjacent) code, so in the spirit of optimism I’m calling it early: we’ve turned the tide, and tooling has caught up to React and counterbalanced the weight it introduces. _Mischief managed_. Good work, everyone.

### React’s impact on frontend

<figure class="two-up">
  <img width="1280" height="819" src="/assets/posts/getting-started-with-webpack/old-way.png" style="background:#fff" />
  <img width="1280" height="819" src="/assets/posts/getting-started-with-webpack/new-way.png" style="background:#fff" />
</figure>

In <b>dev terms</b>, we couldn’t be in a more different place than where we were 10 years ago. I diagrammed this major paradigm shift in a blog post <a href="/blog/getting-started-with-webpack">I wrote in 2016 on webpack</a>: we shifted from a workflow where a frontend developer would have to manually manage the inputs & outputs of every file type they were using (which was complex and brittle), to a new workflow where everything ran through JavaScript, and the tooling determined all the outputs from a single entry file (which was JS).

While this was an improvement, it meant everything had to shift. In what felt like an overnight change, everything built before React was being rapidly thrown out in favor of this new gospel. And though we called this new tool <i>webpack</i>, it was really React pulling the strings<sup>2</sup>. After all, we had no reason to run everything through JS in a world before we wrote all our markup in JS (<abbr title="JavaScript + XML">JSX</abbr>).

<img width="1200" height="776" src="/assets/posts/10-years-of-frontend/everything.jpg" alt="Apple Keynote 2015: Tim Cook standing on stage in front of this year’s theme message: “The Only Thing That’s Changed Is Everything”" />

Mind you, it wasn’t the _templating_ power of JSX that led to this paradigm shift<sup>3</sup>. Rather, it was the <a href="https://youtu.be/wyKQe_i9yyo" target="_blank" rel="noreferrer">volatile mixing of HTML and JS</a> that enabled so many breakthroughs while completely upending every frontend dev’s knowledge, toolchain, and workflow. Not to mention <a href="https://www.pentalog.com/blog/front-end-development/react-front-end-development/" target="_blank" rel="noreferrer">job requirements</a>. This rift was described accurately in Chris Coyier’s oft-quoted 2019 post <i><a href="https://css-tricks.com/the-great-divide/" target="_blank" rel="noreferrer">The Great Divide</a></i>. Through one lens, there was a rift between “front-of-the-frontend” CSS devs and “back-of-the-frontend” JS devs. But through another, the rift was between frontend devs stuck in “the old way” (HTML, CSS, and JS are separate) vs “the new way” (HTML and JS are one; CSS gets ignored, but we’ll get back to that in the next section on styling).

However you choose to interpret the schism of frontend devs, React was the so-to-speak <a href="https://en.wikipedia.org/wiki/Ninety-five_Theses" target="_blank" rel="noreferrer">95 Theses</a> that instigated it. And we can’t go back to a world without React at this point.

<b>Summary:</b> React defined the last 10 years of frontend.<br />
<b>Prediction:</b> React will define the next 10, too?<sup>4</sup>

---

<i><sup>2</sup> Even Tobias Koppers admits <a href="https://levelup.gitconnected.com/tobias-koppers-on-upcoming-webpack-changes-we-are-not-changing-just-to-annoy-users-11c0b234d7b3" target="_blank" rel="noreferrer">webpack’s popularity had early adoption from Facebook’s dev team to thank</a>.</i><br />
<i><sup>3</sup> HTML partials and programmatic HTML had been around for nearly all of the internet’s history (going back to the days of Perl and CGI).</i><br />
<i><sup>4</sup> Despite the rise of competitors, React still seems to be pulling ahead at even greater speeds. At this rate, for something else to catch up to React, it’ll most likely have to be a direct replacement (i.e. not requiring teams to divest from React entirely).</i>

---

## 2015: Styling is the (most/least) important thing

_“So if HTML + JS = JSX, where does that leave CSS?”_ _Where,_ indeed!

While React was gaining popularity in 2015 and unifying the JS ecosystem, CSS was in a very different place. Despite (very) vocal advocates of BEM/OOCSS/SMACSS, they didn’t effectively solve styling problems at scale<sup>5</sup>. And
React didn’t help with that at all, instead, entirely punting on the decision and leaving it up to the individual developer.

And so, largely _as a direct result_ of the rise of React, CSS kicked off its Battle Royale to fight for the top spot (that’s still going on till this day). And while React was probably correct not picking a side for styling (React couldn’t have predicted its own impact on styling and <a href="https://en.wikipedia.org/wiki/Ouroboros" target="_blank" rel="noreferrer">incorporate that change</a> in its initial design), it still leaves JSX users in limbo, waiting to see what styling solution(s) will rise to the top.

<figure>
  <img width="2178" height="1100" src="/assets/posts/10-years-of-frontend/state-of-css.png" alt="Timeseries chart comparing CSS solutions" />
  <figcaption>
    CSS Modules has just barely eked out as the most popular solution for now, but it’s still neck-and-neck with Styled Components and others (<a href="https://2023.stateofcss.com/en-US/css-in-js/" target="_blank" rel="noreferrer">source</a>). Also, I personally take this with a grain of salt, since this survey skews heavily toward North American devs working on bleeding-edge software and doesn’t represent the global community of frontend devs.
  </figcaption>
</figure>

Collectively, we’ve tried CSS Modules, CSS-in-JS, Atomic CSS, Scoped CSS, Utility CSS, and more. And there’s still no clear direction<sup>6</sup>. With all the <a href="https://developer.chrome.com/blog/css-wrapped-2023" target="_blank" rel="noreferrer">rapid improvements in CSS</a>, the answer may end up just being “vanilla CSS was actually good enough after all.” But even now, as of 2023, the dust hasn’t settled, and we’re still figuring out collectively how to do styling<sup>7</sup>. But as a result, it’s the biggest factor (still) dividing frontend developers. Odd how CSS—one of the 3 pillars of frontend—is also one of its most controversial, most-often-neglected parts.

<b>Summary:</b> CSS underwent its most extreme metamorphosis the last 10 years, and it’s not finished yet.<br />
<b>Prediction:</b> The next 10 years will see the (re) rise of vanilla CSS. And a whole new generation of haters. And probably another decade of failed experiments trying to replace it.

---

<i><sup>5</sup> Its biggest criticisms were a) it required 100% manual human enforcement and was 0% automatable, b) required too much of a learning curve only to result in what was still a subjective solution (e.g. having pedantic arguments over whether sub-“elements” are allowed or whether that’s a new “block”), and c) it still assumed global CSS, which meant one accidental line of CSS could break the entire app. If you need further proof, watch <a href="https://blog.vjeux.com/2014/javascript/react-css-in-js-nationjs.html" target="_blank" rel="noreferrer">Vjeux’s 2014 talk introducing CSS-in-JS</a> that covers these points.</i><br />
<i><sup>6</sup> No. The future of styling <em>isn’t</em> Tailwind.<br />
<img width="320" height="179" src="/assets/posts/10-years-of-frontend/tailwind.png" alt="Gabe from “The Office”: ”Shut up about [Tailwind]. Shut up about [Tailwind]”" /></i><br />
<i><sup>7</sup> It’s easy to point out “Vue and Svelte had built-in styling solutions; why didn’t React?” while forgetting the timeline. Vue didn’t even have the <code>.vue</code> syntax with `&lt;style&gt;` tags until its 2.0 release in late 2016, after many new styling ideas had come about. And even then, support was limited, and buggy (I still think Vue’s decision to “leak” the top-level element into parent styling in scoped styles is a mistake, but that’s another discussion). Svelte came later, and got to reap the benefit of years of failed experiments in React and Vue-land.</i>

## 2018: TypeScript is good, actually

Angular never achieved the adoption of React<sup>8</sup>, but it did have just as big of an impact on JavaScript—if not moreso—through TypeScript. In one of my favorite examples of reviving a concept that many felt was obsolete, introducing the old idea of static typing to JavaScript has been a boon for improved developer experience, and even won over longtime critics of JS.

There are lots of nuances and details of _how_ TypeScript made all the right choices I’ll skip over (raising the bar on what’s possible with inference, and generics, and the whole brilliance of statically typing a non-compiled language<sup>9</sup>). But the reality is that **TypeScript is here to stay**, and once you buy into TypeScript you’ll never go back<sup>10</sup> <sup>11</sup>.

<b>Summary:</b> TypeScript isn’t what anyone asked for, but ended up being what we needed all along.<br />
<b>Prediction:</b> next decade’s forecast calls for TypeScript, TypeScript, and *even more* TypeScript.

---

<i><sup>8</sup> I keep hearing <a href="https://www.youtube.com/watch?v=zTLDv5YIpqc" target="_blank" rel="noreferrer">Angular is going to have its heyday again</a>, but I’ll believe it when I see it. May the odds be ever in its favor.</i><br />
<i><sup>9</sup> Runtime typechecking is for chumps. Static typechecking is where it’s at.</i><br />
<i><sup>10</sup> 2 examples of notable projects switching off TypeScript I’m sick of hearing of: <a href="https://github.com/sveltejs/svelte/pull/8569" target="_blank" rel="noreferrer">Svelte’s “abandoning” of TS</a> (they actually didn’t—they still encourage user TS usage; they just stopped running the TS compiler on internal code as an implementation detail), and <a href="https://github.com/hotwired/turbo/pull/971" target="_blank" rel="noreferrer">Rails’ Turbo removing TS</a> (I don’t care about Rails—and DHH for that matter—after years of being out-of-touch with reality).</i ><br />
<i><sup>11</sup> As <a href="https://openapi-ts.pages.dev" target="_blank" rel="noreferrer">the maintainer of a popular TS project</a>, I may be biased.</i>

---

## 2020: Design Tokens are… what, again?

I know I’m bad at blogging when I haven’t written a single post on design tokens. But if you’ve had the displeasure of having to talk to me in any form, I haven’t shut up about them for the last 3+ years.

If you have never heard the term before, UX Lord has a great <a href="https://www.youtube.com/watch?v=wtTstdiBuUk" target="_blank" rel="noreferrer">6 minute explainer</a> that’s the complete idea. In fact, most devs have been using “design tokens” without realizing it. The intent of design tokens is essentially codifying where the source of truth lies between design and dev, and seeks to rapidly accelerate cycle time between the two.

<div class="yt">
  <iframe
    width="1280"
    height="720"
    src="https://www.youtube-nocookie.com/embed/wtTstdiBuUk?si=vW2OkZ4MQsensATW"
    title="YouTube video player"
    frameborder="0"
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
    allowfullscreen></iframe>
</div>

I’m stealing something my buddy <a href="https://mas.to/@nmoo" target="_blank" rel="noreferrer">Nate Moore</a> said to me privately, on Tailwind’s popularity, that’s too good to keep to myself:

> My long-running hypothesis has been that people turn to [Tailwind] because it has an opinionated take on design token management. The other stuff is incidental. Funny enough, I think the Tailwind team thinks the situation is flipped and everyone _really_ cares about utility classes.

There are even more popular things in dev-land _because_ they solve design token-related problems people have, even if some devs don’t know what design tokens are (and often the library creators don’t realize it, either).

But the current disconnect with devs and design tokens is not only the immaturity of the concept itself, but there is almost no tooling that handles it<sup>12</sup>. So it’s not devs to blame for not understanding this concept—there’s no sense in explaining an abstract concept to a dev, only to tell them “now the solution is 100% on you, and you won’t get any heavy lifting done by a popular library.” The burden is still on designers (and hybrid designer/devs) to advocate for this <b>AND</b> build <a href="https://cobalt-ui.pages.dev/" target="_blank" rel="noreferrer">sensible tooling</a> to make it possible.

<b>Summary:</b> design tokens are great… once people actually hear about them.<br />
<b>Prediction:</b> the design token renaissance is coming! Tooling, integrations—the works.

---

<i><sup>12</sup><a href="https://amzn.github.io/style-dictionary/" target="_blank" rel="noreferrer">Style Dictionary</a> is basically the only common design token tool that exists, but it has a brutal learning curve and still requires quite a bit of manual code to string together. The alternative is <a href="https://cobalt-ui.pages.dev/" target="_blank" rel="noreferrer">Cobalt</a>, my little library, which almost no one uses yet.</i>

---

## Wrap-up and hot takes

The past 10 years we’ve seen some of programming’s biggest leaps and bounds, ever. The web platform feels _very_ different to develop for today than it did 10 years ago. And though we’re still collectively recovering from whiplash, I think it’s in the best place it’s ever been. Sure, we have our work cut out for us. And we’re not even <em>close</em> to understanding what the next 10 years will bring. But given all that, I still think we’re heading in the right direction overall.

Still, in the sake of making this a worthwhile thought experiment, I’ll restate my previous predictions, take them even further, and throw a few new ones in the mix:

1. ~React will define the next 10 years~ **Every JS framework will become a JSX framework**<br />
   If the trend continues with React’s adoption, it’s only a matter of time before the dissidents cave and consolidate on JSX. I’ll even go one step further and say any new framework that <em>doesn’t</em> bet on JSX is making a mistake<sup>13</sup>. Note that I’m saying “JSX” and not “React”—React may still fall by the wayside. But I think it will take a 1:1 migration path to replace it.
1. ~The next 10 years will see the (re) rise of vanilla CSS~ **A new library will make using vanilla CSS even easier**<br />
   Sure, Vue and Svelte allow `&lt;style&gt;` tags, but don’t lift a finger in bridging the gap between markup and CSS. A new library could solve that, while taking advantage of all the new features like <a href="https://css-tricks.com/css-cascade-layers/" target="_blank" rel="noreferrer">layers</a>, <a href="https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_container_queries" target="_blank" rel="noreferrer">container queries</a>, and <a href="https://developer.mozilla.org/en-US/docs/Web/CSS/@property" target="_blank" rel="noreferrer">@property defs</a>. I’m imagining something like <a href="https://c.im/@matthewp" target="_blank" rel="noreferrer">Matthew Phillips</a>’ <a href="https://corset.dev/learn/concepts/" target="_blank" rel="noreferrer">Corset</a>, but taken even further, with a simpler syntax. I’d love to see more libraries “get weird” with the raw power CSS has like Corset did. And I think there’s a ton of untapped potential here.
1. ~TypeScript usage will increase~ **TypeScript will be added to ECMAScript**<br />
   OK—maybe not _that_ exciting a take, given <a href="https://github.com/tc39/proposal-type-annotations" target="_blank" rel="noreferrer">this has been officially proposed</a> and is in Stage 1. But my spicy prediction is that this proposal will be revisited within the next 10 years and pushed forward. Either that, or the <a href="https://github.com/dudykr/stc" target="_blank" rel="noreferrer">Rust-powered TypeScript typechecker project</a> will become so mature and good we won’t care if typechecking becomes part of V8 or not.
1. ~Design token tooling will improve~ **Design tokens will become an essential part of the frontend pipeline**<br />
1. (new) **We’ll see the rise and fall of an AI programming metalanguage**. <abbr title="In case you missed it">ICYMI</abbr>, <a href="https://www.cnbc.com/2023/11/30/chatgpts-one-year-anniversary-how-the-viral-ai-chatbot-has-changed.html" target="_blank" rel="noreferrer">AI had a breakthrough in 2022–2023</a>, and people <a href="https://www.economist.com/business/2023/06/01/chief-executives-cannot-shut-up-about-ai" target="_blank" rel="noreferrer">won’t shut up about it</a>. In one short year we saw nearly everyone and their grandma <a href="https://www.producthunt.com/topics/artificial-intelligence" target="_blank" rel="noreferrer">trying to cash in on an AI-powered-whatever</a><sup>15</sup>. We haven’t seen the end of it yet, and I think we’ll see someone try and make a hot new metalanguage that incorporates AI to write code for you. I think it’ll get some traction, then quickly turn into a dumpsterfire as we hit the technical ceiling of the recent LLM breakthrough and realize it doesn’t work for production code (and won’t for a very long time). And we’ll return once more to our primitive, non-AI-powered toolchains (at least until the next AI revolution).
1. (new) **<a href="https://arstechnica.com/gadgets/2023/04/free-software-group-decries-google-dropping-space-saving-jpeg-xl-format/" target="_blank" rel="noreferrer">JPEGXL is the future</a>**. Chrome and Firefox will come around. _You’ll see—you’ll all see!_
1. (new) **<a href="https://qwik.builder.io/" target="_blank" rel="noreferrer">Qwik</a> will replace React.**<br />
   This is mostly wishful thinking on my part, but I think if anything will replace React at this point, it’s Qwik. It checks off all the boxes—it’s insanely performant, does more out-of-the-box than React, has SSR built-in, and even _reduces client JS just by using it_ (“fast by default”). While there have been other React-like frameworks (Preact, SolidJS, etc.), none have solved SSR as well, nor provided monumentally-better payoffs, as Qwik has. I think the biggest threat to Qwik is the scale of the project. But if the maintainers keep developing it, the sky’s the limit.

---

<i><sup>13</sup> In fact, back in 2021, when we were developing the concept of Astro, I like to think one of my main contributions (other than the styling engine) was strongly advocating for a familiar JSX-like syntax for the new `.astro` format in our internal discussions (I call this the <a href="https://tastecooking.com/strawberry-and-kiwi-why/" target="_blank" rel="noreferrer">“strawberry–kiwi strategy”</a> taken from old branding playbooks—introduce a new thing paired with a familiar thing). I’ve seen the JSX-like syntax often cited as a key factor why it’s so easy to jump on board with Astro.</i><br />
<i><sup>14</sup> I name Figma specifically—not “design programs” in general—because <a href="https://uxtools.co/survey/2023/basic-prototyping" target="_blank" rel="noreferrer">Figma is eating the design world</a> right now.</i><br />
<i><sup>15</sup> Yes, I <em>did</em> work at an AI startup for 2022–2023. And yes, I <em>am</em> cynical about AI. Are those 2 things related, you ask? (yes)</i>

---

What do _you_ think the next 10 years will bring?

<style lang="scss">
  .two-up {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1.5rem;

    @media (width >= 800px) {
      .two-up {
        grid-template-columns: 1fr 1fr;

        figcaption {
          grid-column-end: 2;
        }
      }
    }
  }
</style>
