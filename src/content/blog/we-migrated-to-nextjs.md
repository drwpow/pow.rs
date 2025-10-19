---
title: We migrated to Next.js to serve our home page 7.5× faster
description: server-side rendering by the numbers
pubDate: 2018-05-07
categories: ['dev']
---

<figure><img src="https://miro.medium.com/max/5000/1*pQBGo34dZ3IRdPeAu4JhNA.png"></figure>

We migrated [our home page](https://manifold.co) from a basic React boilerplate
([React Boilerplate](https://github.com/react-boilerplate/react-boilerplate)) to
[Next.js](https://github.com/zeit/next.js/), a progressive web app framework for React. We made no
other changes, and the switch was basically invisible. The load times were better than we
expected—it was basically free performance:

On a fast connection, fast CPU, our site load time went from 1.5 seconds to 0.2 seconds — 7.5×
faster! On an average connection and device, our site load time went from 7.5 seconds down to 1.3
seconds.

## Free performance, you say?

To understand what a progressive web app (PWA) does, it’ll take a bit of understanding what happens
in the time between a user visiting a URL (our website), and seeing something rendered on the page
(in this case, our React app).

<figure><img src="https://miro.medium.com/max/2000/1*D8PNFy422av8nZlQVJpaMg.jpeg"><figcaption>Timeline of the 5 stages of browser rendering (outlined below)</figcaption></figure>

### The stages

1. Once a user hits a URL, the network request is a flat cost in resolving the DNS and requesting
   that path from the server. It’s pretty quick, usually happening in < 100 milliseconds, but it’s
   mentioned because it does take _some_ time.
1. From there, the server returns the HTML for the page, but the page will stay blank while every
   `<script>` and `<link>` tag inside `<head>` is downloaded
   ([unless it’s marked ](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/script#Notes)`[async](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/script#Notes)`).
   There’s more going on in this step than the diagram shows, but for our purposes we’ll lump these
   processes together.
1. With the HTML and critical assets loaded, the browser starts to paint what it can, while
   downloading the rest (images, etc.) in the background. Ever wonder why images sometimes “pop” in
   or sometimes take a while to load? This is why! This lets you look at pages sooner.
1. JavaScript can only parse & execute after it’s downloaded. Depending on how much JS there is
   (which can be a lot for a normal React app if it’s bundled into one file), this could take
   several seconds or more (_note: JS doesn’t have to wait until everything else downloads to begin
   executing, despite the diagram layout_).
1. In the case of a React app, it has to now modify the DOM, which will trigger another browser
   paint after it’s all done, and another cycle of asset downloads. The time this will take will
   depend on the complexity of the page.

### Sooner is better!

Because a progressive web app takes React and spits out static HTML and CSS, that means** users are
looking at your React app at Stage 3 rather than Stage 5.** Which, in our tests, took anywhere from
**0.2–4 seconds **depending on your connection and device speed, compared to 1.5–22 seconds.

_…seriously—free performance? No catch?_

<figure><img src="https://miro.medium.com/freeze/max/60/1*8lUcPLHE-AUPsC7LSaKEEQ.gif?q=20"><figcaption>Obligatory skeptical Steve Urkel</figcaption></figure>

No catch! PWAs are a bulletproof way to serve your React app faster.

The reason why progressive web apps and PWA frameworks like Next.js are still catching on is
because, traditionally, JS frameworks didn’t make it easy to generate static HTML. Today, the
landscape is much different, with React, Vue, Angular, and the rest having first-class support for
server-side-rendering. However, a deep understanding of bundlers and build tooling is still required
to make it happen, and it’s not without its fair share of pain points. The recent appearance of PWA
frameworks like Next.js and Gatsby (both late 2016/early 2017) have become a boon to PWA adoption by
lowering the barrier to entry (and arguably making it _fun!_).

While not every application will fit into Next.js, for many React applications it boasts free
performance and bandwidth boosts.

## How bad is the move?

All-in-all, our migration of [manifold.co](https://manifold.co) wasn’t too bad, but we did run into
the following pain points because of our unique setup:

### 🏎 React Router gets left in the dust

React Router had to go, because Next.js has its own built-in router that communicates better with
its code splitting optimizations—_on top_ of the PWA architecture I just described—to load pages
much faster than any client-side router could do on its own.

<figure><img src="https://miro.medium.com/freeze/max/60/1*17oPXNxsT36rXTHptxURxQ.gif?q=20"><figcaption>Next.js’ router is basically React Router + speed! …But it’s still not React Router.</figcaption></figure>

In practice, because we weren’t doing a lot of complicated routing that React Router offers, for us
it was as simple as replacing React Router’s standard `<Link />` component with Next.js’s:

<script src="https://gist.github.com/drwpow/d55337c3a87dbe41c7e0cd81f973aa14.js"></script>

Overall, not too bad! We basically renamed a prop and added an `<a>` tag for SSR. Because we’re
using Styled Components as well, I also found adding the `passHref` prop was necessary in most
instances to make sure the `href` always made it to the generated `<a>` tag.

<figure><img src="https://miro.medium.com/max/60/1*RfsGwE-ktpixF7hhXJPgGQ.png?q=20"><figcaption>Network requests for manifold.co</figcaption></figure>

To see Next.js’ fancy router optimizations in action, pop open your **Network Tab **on
[manifold.co](https://manifold.co)\*\* \*\*and click a link. In the image above, clicking a link to
`/services` returns an XHR request for `services.js` rather than a normal `200` request for
`/services`.

I’m not just talking about client-side routing—of course React Router exists for this—I’m talking
about the actual `.js` chunk that was intelligently split out, and loaded on demand. That’s just a
nice bundler feature Next.js does automatically for you out-of-the-box. This is _much_ better than
our old method of lobbing `1.7 MB` of JavaScript at the client before they see anything. Although
it’s not perfect, this is much closer to users’ only downloading code for pages they’re viewing than
before.

### ⬛️ Blackboxed Redux

Continuing from the previous point, all that fancy Next.js optimization and code-splitting comes at
a price: because it handles code-splitting at the `page` level, it won’t let you access the root
React component or React DOM’s render method. If you’ve set up Redux yourself before, you’ll notice
this poses a problem: where does the Redux `<Provider />` sit?

In Next.js, they made a special
`[withRedux](https://github.com/zeit/next.js/tree/canary/examples/with-redux)`[ HOC wrapper](https://github.com/zeit/next.js/tree/canary/examples/with-redux)
you must wrap every top level component with, on every page:

```js
export default withRedux(HomePage);
```

While that’s not too bad, if you need shimmed `createStore()` methods like in the case of
[redux-reducer-injectors](https://github.com/GuillaumeCisco/redux-reducers-injector), plan on some
extra time debugging their wrapper (sidenote: don’t use reducer injectors—ever).

Also because of its blackboxed nature, using [Immutable](https://facebook.github.io/immutable-js/)
with Redux becomes problematic. Although Immutable is supposed to work with this, I ran into
problems with either the top-level state not being immutable (`“get is not a function”`), or the
wrapper trying to use JS object dot notation rather than `.get()`
(`“Can’t get catalog of undefined”`). And I had to dive into source code to debug this. After all,
Next makes you use their provider for a reason.

In general, this highlights a key problem with Next.js:** very little is documented**. They have
[many examples to draw from](https://github.com/zeit/next.js/tree/canary/examples/), but if your
usecase isn’t there, good luck!

<figure><img src="https://miro.medium.com/freeze/max/60/1*jIPpDxpwCCD3yEx2NX9DWQ.gif?q=20"><figcaption>If you do not have a relevant Next.js example to pull from, godspeed.</figcaption></figure>

### 🐶 Stop trying to make `fetch` happen

We were using [react-inlinesvg](https://github.com/gilbarbara/react-inlinesvg), which offers the
stylability of inline SVGs and the cacheability of remote requests. Only problem is: there’s no such
thing as an XHR request when server-side rendering (at least, not in the sense of webpack URLs like
it was expecting), so this blew up trying to SSR.

<figure><img src="https://miro.medium.com/freeze/max/60/1*-0-1ee1Oun7_WeJreOkgAQ.gif?q=20"><figcaption>It’s not going to happen.</figcaption></figure>

While there are some other inline SVG libraries that support SSR, I decided to drop it since most
our SVGs were one-off illustrations anyway. I either swapped them out to an `<img>` tag if it didn’t
need styling, or embedded them as React JSX. This might be a win-win, as the JSX illustrations are
now delivered in the initial page load, and the client bundle had 1 library removed.

If you do need fetch in general (I did end up needing it for another library), you can configure
that via `next.config.js` using `whatwg-fetch` and `node-fetch`:

<script src="https://gist.github.com/drwpow/dea6347ae6415b82da47e5d811807401.js"></script>

### 👯‍ Client JS & server JS: the dynamic duo

The last confusing part of Next.js is it runs twice — once for server, and again for client. This
blurs the lines a bit between client JS and Node JS in the same codebase, resulting in errors you’re
not used to like `fs is undefined` when Node’s `fs` tool is trying to run in the client.

<figure><img src="https://miro.medium.com/max/60/1*Na1eBHKPPsnYGikdN0b6OQ.jpeg?q=20"><figcaption>Client-side JS battles with server-side JS (2018, colorized)</figcaption></figure>

As a result, you’ll have to engineer shims like this within `next.js.config`:

The `config.isServer` flag within webpack becomes your best friend when the same code has to run in
multiple environments.

You also have Next.js’ propretary `getInitialProps()` lifecycle addition to React, which only runs
in server-mode, as well:

Oh, and let’s not forget about our good friend `window`, needed for event listening, window
measurement, and a plethora of useful functions, which is Node.js’ greatest weakness:

Wrapping your head around when the same JavaScript is either executing in Node.js or the client can
be one tricky mindgame even Next.js can’t save you from. But using `config.isServer` and
`getInitialProps()` to your advantage will serve you well.

## What’s next, after Next?

For the short-term, Next.js more than meets our needs of server-side rendering for performance,
delivering our site to non-JavaScript-enabled devices, and now allowing
[rich meta tags](https://css-tricks.com/essential-meta-tags-social-media/).

We may, in the future, explore other options if and when our application needs server-side-rendering
_and_ has a more complicated server layer (we’ve talked about integrating single-sign-on between
[manifold.co](https://manifold.co) and [dashboard.manifold.co](https://dashboard.manifold.co)). But
until then, Next.js was a huge payoff for little time investment.

<figure><img src="https://miro.medium.com/max/2000/1*Ykcw1iepXAGjSVSXQDPsdg.png"></figure>
