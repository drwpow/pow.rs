---
title: media queries are (still) a hack
date: 2020-01-18
description: |
  Media queries are janky. No, it’s not just you.
tags: ['dev']
layout: ../../layouts/post.astro
---

After 15 years of working with CSS, media queries still don’t do enough for me to create responsive
designs. To express my frustrations, I had written about half of a blog post under the title _Media
Queries are a Hack_ before I discovered [that title had been taken][ist]. In **2013**. Clearly I’m
not as original as I think I am.

Ian Storm Taylor, the author of that post, summarizes the major failing of media queries:

> I want **write-once, use-anywhere**—that’s what modular code is.
>
> Media queries are not that. They’re **write-everywhere**. They’re relative to your screen, so
> every time you write a media query for max-width or min-width, you’re connecting the appearance of
> your module to the width of the entire canvas—exactly what you were trying to avoid.

This has only become more true and more of a problem in our React-influenced,
_everything-is-modular_ landscape of contemporary web design. And this lack of component-oriented
thinking lead Ian to pine for what we all do—Container Queries.

## container queries?

If, for example, I have a user card component that I want to rearrange when there’s not enough room,
I can only do that based on the browser width, **not the component width itself.**

<figure>
  <img src="/assets/posts/media-queries-are-still-a-hack/user-cards.svg" alt="A horizontally-laid out user card next to a vertical one" />
  <figcaption>What if I wanted to stack a card vertically not based on screen width, but based on whether or not the text and image will fit side-by-side? In 2020, I still can’t.</figcaption>
</figure>

Container Queries seem to check off all the boxes:

- ✅ Modular and composable
- ✅ Attack the root problem of responsive design: resizing based on **content**
- ✅ CSS-based

But perfect as they may be, Container Queries are not happening anytime soon. In Zach Leatherman’s
recent article [_The Origin Story of Container Queries_][zl], after much research, he even admits
the grim reality of our beloved Container Queries:

> [Container Queries] become almost cliché to mention it when talking about problems we’d like the
> web platform to solve… Everyone wants it, but it sure seems like no one is actively working on it.

So what’s a person to do?

## css grid repeat(auto-fit, minmax())?

If you’ve used CSS Grid, you may be familiar with this wonderful snippet:

```css
.grid {
  display: grid;
  grid-gap: 1rem;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
}
```

I was first introduced to this by [Jen Simmons][js]’ wonderful demo. With only 3 lines of CSS, we
have something that used to take hundreds:

- Responsive without any media queries
- Gutters built-in 😍
- And last, but most importantly, **items that resize based on their width** (kinda sounds like
  Container Queries, don’t it?)

But despite being incredibly-useful, CSS Grid’s `repeat(auto-fit, minmax())` has 2 major drawbacks:

- 🚫 It can’t be used on the component level like a Container Query could, so components can’t
  declare their own widths and breakpoints; their parents must.
- 🚫 It doesn’t allow for columns of different widths. Neither can you tell items to responsively
  span multiple columns without media queries (and if we’re using media queries we’re all the way
  back to where we started).

## container queries.

It’s really hard to make a better pitch than Container Queries as a solution to the problem of
modular responsive design, after **7 years** and hundreds of great minds have all shared their
collective vision of how this holy-grail-of-a-CSS-selector should work. There are no downsides to
Container Queries, other than the belabored point that _they don’t exist_.

So in parting, as I alluded to earlier, I will leave you, dear reader, with nary an original
thought, instead, rehashing my favorite line from Phillip Walton’s well-referenced [_Responsive
Components: A Solution to the Container Queries Problem_][pw]:

> While I think we’d all agree a pure CSS solution is the ultimate goal, I hope we as a community
> are able prevent the perfect from becoming the enemy of the good.
>
> In matters like this, I like to remind myself of this quote from the [W3C’s HTML design
> principles][w3c]: “In case of conflict, consider users over authors over implementors over
> specifiers over theoretical purity.”

In other words, in 2020, **the best solution we have to media queries’ failings is JavaScript.**

But not JavaScript for the sake of JavaScript; JavaScript for the sake of users.

It’s been 7 years since Ian Storm Taylor published _Media Queries are a Hack_. And unfortunately, in
2020, they’re _still_ a hack. And we’re still waiting on Container Queries.

I may not have any original ideas on this subject, but at least we’re all on the same page.

## more reading

- [Media Queries are a Hack][ist] (the real one)
- [Responsive Components: A Solution to the Container Queries Problem][pw]
- [Let’s Not Forget About Container Queries][css]
- [The Origin Story of Container Queries][zl]

[@zachleat]: https://twitter.com/zachleat
[cs]: https://github.com/joecritch/container-queries
[css]: https://css-tricks.com/lets-not-forget-about-container-queries/
[js]: https://labs.jensimmons.com/2017/03-009.html
[ist]: https://ianstormtaylor.com/media-queries-are-a-hack/
[pw]:
  https://philipwalton.com/articles/responsive-components-a-solution-to-the-container-queries-problem/
[w3c]: https://www.w3.org/TR/html-design-principles/
[zl]: https://www.zachleat.com/web/origin-container-queries/
