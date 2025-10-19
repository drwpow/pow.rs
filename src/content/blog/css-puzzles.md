---
title: 'CSS puzzles: a mentorship program for better styling'
description: How a 12-week program resulted in open-source education
pubDate: 2019-01-17
categories: ['dev']
layout: ../../layouts/post.astro
---

Manifold’s internal mentorship program provides opportunities for coworkers to learn from one
another over a three month period. The relationship doesn’t imply relative seniority between the
mentor and mentee, but simply a desire to share and learn. We do this to foster continuous growth
and to stay committed to our goal to raise up all employees to a senior-level regardless of where
they started. But above all, it’s a way for us to connect with one another outside of pure work
assignments.

For the summer 2018 session, Nicole Tibaldi and I paired up to dive into the finer points of CSS. We
ended up splitting our time into a 2-track process: homework assignments to learn the concepts, and
work projects for Nicole to apply the knowledge.

## CSS Puzzles

It’s hard to identify difficult problems in CSS until you’re forced to recreate a design that—for
some special reason—is just hard to pull off. Oftentimes the final result is subpar, merely because
there was another clever approach that you didn’t know was an option. Thinking back to all the CSS
I’ve written over the last 13 years or so, I tried to dig up some of the hardest problems I’ve
encountered and extract an isolated example for each.

For each of the following exercises, you can find the code here:
[https://github.com/drwpow/css-exercises](https://github.com/drwpow/css-exercises)

### Exercise 1: Markup & Grid

<figure>
  <img src="/assets/posts/css-puzzles/01-a.png">
  <img src="/assets/posts/css-puzzles/01-b.png">
  <figcaption>Exercise 1 screenshots</figcaption>
</figure>

Sometimes you can control markup; sometimes you can’t. Exercise 1 forces you to use CSS Grid to
realize you can rearrange and re-set layout without touching markup.

### Exercise 2: perfect design, imperfect content

<figure>
  <img src="/assets/posts/css-puzzles/02.png">
  <figcaption>Exercise 2 screenshot</figcaption>
</figure>

We’ve all gotten a design with a perfect layout… that only fits a very specific content length. This
exercise is all about dealing with missing content, and different lengths, as elegantly as possible.

### Exercise 3: interactive CSS

<figure>
  <img src="/assets/posts/css-puzzles/03.gif">
  <figcaption>Exercise 3 screenshot</figcaption>
</figure>

Bug, or feature? This exercise forces the user to abuse CSS to create interactivity most would only
think is possible with JavaScript. Even though this may not be best practices, understanding what’s
possible with CSS is the goal.

### Exercise 4: perceived performance

<figure>
  <img src="/assets/posts/css-puzzles/04.png">
  <figcaption>Exercise 4 screenshot</figcaption>
</figure>

This exercise forces you to load large assets over a slow connection, and figure out how HTML & CSS
can solve slow-loading fonts and images (hint:
[font-display](https://developer.mozilla.org/en-US/docs/Web/CSS/@font-face/font-display) and fixing
image heights can smooth the experience).

### Exercise 5: layering

<figure>
  <img src="/assets/posts/css-puzzles/05.png">
  <figcaption>Exercise 5 screenshot</figcaption>
</figure>

Exercise 5 explores the nature of browser layering, and how to fix the “unexpected” scenario of
layering by DOM order (in the photo above, notice how the blue glow tucks under the card to the
right). Once you’ve figured out the layering part, you’ll have to figure out how to apply that to
animations!

### Exercise 6: nth child selectors

<figure>
  <img src="/assets/posts/css-puzzles/06.gif">
  <figcaption>Exercise 6 screenshot</figcaption>
</figure>

Nth-child and sibling selectors in CSS are a classic examples of not using them because you don’t
know they’re an option. They can be powerful tools in managing styling when used effectively.

### Exercise 7: CSS animation

<figure>
  <img src="/assets/posts/css-puzzles/07.gif">
  <figcaption>Exercise 7 screenshot</figcaption>
</figure>

This is where things start to get fun, and we add interactivity, animation, and 3D perspective with
only a few lines of CSS

### Exercise 8: ratio resizing

<figure>
  <img src="/assets/posts/css-puzzles/08.gif">
  <figcaption>Exercise 8 screenshot</figcaption>
</figure>

There are many times where ratios need to be locked in, especially when media is present or design
demands it. This exercise explores how to lock in ratios to responsive layout using only a sprinkle
of CSS.

## Nicole’s projects

After a few months of mentorship and working on projects together, Nicole threw the following
together:

<figure>
  <img src="/assets/posts/css-puzzles/n-01.gif">
  <figcaption>Cube animation by Nicole Tibaldi</figcaption>
</figure>

<figure>
  <img src="/assets/posts/css-puzzles/n-02.gif">
  <figcaption>SVG pricing animation</figcaption>
</figure>

<figure>
  <img src="/assets/posts/css-puzzles/n-03.gif">
  <figcaption>Manifold invoices concept by Nicole Tibaldi and me</figcaption>
</figure>

Together we tackled CSS & SVG animations, and even got into interactive dataviz with D3.js (which
was a _little_ sidetrack outside of styling, but who can say no to dataviz?).

## How to set up your own mentorship program

Most would say mentorship is important for their own growth as well as their company’s, but few feel
equipped to start it themselves. Here at Manifold we’ve found the following small steps help equip
even hesitant mentors:

1. **Set an end date, and meeting times**. Set boundaries. Determine a duration of weeks (ideally
   8–12 weeks) to run the program, and determine hourly commitment for the mentor and mentee each
   week. Set a regular meeting to stay on track. Be mindful of both mentor’s and mentee’s time and
   don’t overcommit!

1. **Ask the mentee to set goals.** Ask the mentee what they would like to learn by the end of the
   program. The mentor should help with this. Aim for a real challenge that pushes comfort zones
   without being unrealistic. Shoot for ~90% of goals met—you set a real challenge that pushes
   limits but the mentee doesn’t feel like they’ve mostly failed.

1. **Check in each week on those goals**. The mentor should constantly level-set, and make sure the
   mentee feels like they’re getting closer. Be wary of goal-shifting! As the mentee gains
   experience, minor details and focus may shift, but you should still stay roughly within the
   original parameters set.

1. **At the end, ask for improvement**. After the program is over, get a third party to ask both the
   mentor and mentee how the program went. Was it too much work? Not enough? Did the mentee feel
   they leveled up? Was the mentor overworked? How was communication? Every organization has
   different dynamics, so running a “trial” mentorship program and gathering data will set up
   subsequent runs for success.

How would your org benefit from such a program? How was ours? Please leave a comment with your
thoughts & experience with mentorship programs.
