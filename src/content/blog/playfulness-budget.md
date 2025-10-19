---
title: 4 tips for setting a playfulness budget
pubDate: 2019-11-06
updated: 2019-04-19
description: |
  At what point does whimsy and “delight” turn into user frustration?
categories: ["design"]
---

All of us can recall being frustrated by a website or app, as well as inspired and entertained.
Sometimes both happen in the same app, either at different points in the journey, or if we revisit
in a a different state of mind. Application design walks a tightrope between utility and whimsy. An
app must use **usable,** drawing from familiar patterns. But if _everything_ is copy-and-pasted from
elsewhere the experience will be forgettable. However, if _everything_ reinvents the wheel you’ve
created a frustrating experience that users are lost in (fine for an experiential art exhibit;
terrible for an app). How do you find a balance?

I’ve always imagined this problem as having an imaginary bank or budget of “playfulness points” to
draw from. If you don’t spend any points, the experience at best ends up flat and dull; at worst
being a waste of users’ time. But going deep into debt trying to be _too_ whimsical and novel (a
tendency that both novice and ego-driven designers have) is worse as it’s practically unusable. I’ve
tried to distill things I’ve learned over the years into 4 tips to spend that “budget” wisely.

## 1. spend playfulness points during slow tasks

Every user when using your application will be in varying states of panic.

Booking a hotel, tickets for a show, or flight? These can feel **rushed**, sometimes intentionally,
and even feature anxiety-inducing timers, _BOOK NOW!_ calls to action, and the impending sense that
someone will snag this before you do (_23 people have looked at this Airbnb in the last hour_).

This is **not a good time to test the user’s patience with playfulness.**

However, based on the task, state of mind, and precise point in the process a user finds themself,
there can be opportunities to slow down and deliver something unexpected.

<figure>
  <img src="/assets/posts/playfulness-budget/pizza-tracker.jpg" alt="Domino’s Pizza Tracker" />
  <figcaption>The Domino’s Pizza Tracker: probably my favorite example of a playful time-passer</figcaption>
</figure>

The Domino’s Pizza Tracker is a legendary UX experience that gets everything right. It’s a fun,
animated tool that appends _at the end of a user’s task_, almost like the after-credits scenes in a
Marvel movie where it’s optional to stick around. What better way to kill a 30-minute wait for a
pizza to arrive than stare at the pizza tracker’s wfun themes, creative animations, voice acting,
and music?

Now imagine what that experience would be like while you’re trying to _order_ the pizza, with kids
screaming and no time to spare. One experience is a lot of fun; the other, not so much. And context
is the only difference.

## 2. spend playfulness points during frustrating tasks

<figure>
  <video autoplay="true" controls muted loop playsinline width="1376" height="600">
    <source src="/assets/posts/playfulness-budget/little-known-goods-carousel.mp4" type="video/mp4" />
  </video>
  <figcaption>Little Known Goods Carousel animation</figcaption>
</figure>

Two pain points are the bane of my online shopping experience: image carousels and zoom views
(usually which are baked into the same component). I find it unwieldy on particular devices—usually
it‘s built with largely mobile or desktop in mind at the expense of the other. Further, the actions
aren’t always clear, with hover, click, and manual zoom yielding wildly different outcomes depending
on the site you’re on.

For a recent [ecommerce site I built][lkg], I wanted to break the paradigm people were used to with
carousels so they put no prior expectations on it (save for the arrow keys). Using the metaphor of a
folding roadmap, I created a carousel that animates folding and unfolding as you click through the
slides. For the zoom view, hover reveals a larger image, while on mobile the zoom is disabled and
users intuitively pinch-zoom to enhance (with all positioning JS disabled so your image doesn’t fly
off into space while pinch-zooming).

While you can be the judge on how well I did, the intent was to deliver a component that people
hadn’t seen before—a 3D, folded carousel—in order to not have expectations be placed upon it. And in
injecting a bit of whimsy, hopefully it saves most visitors from a bad carousel experience by
turning it on its head and making it playful.

## 3. spend playfulness points on first impressions

<figure>
  <video autoplay="true" controls muted loop playsinline width="1375" height="600">
    <source src="/assets/posts/playfulness-budget/playdate.mp4" type="video/mp4" />
  </video>
  <figcaption>A 3D, rotatable portable game console right at the top of the page? Yes, please.</figcaption>
</figure>

A user’s first several seconds on a site is a critical time for them. They’re orienting to the
site—to the layout, colors, language, etc.—while also having something they want to accomplish.
While often times this is a winding path for the user to clarify what they want while orienting
themselves to a new interface, that first few seconds that a user suspends judgment can be just the
right moment for playfulness.

Greeting a user, for instance, with a fun animation on page load doesn’t disrupt their task while
they figure out where it is they need to go.

Granted, there are good and bad types of animation. A good animation would simply be adding motion
to the hero graphic, where a bad animation would be hiding the top menu and animating in items
one-by-one so the user has to wait painfully to even start their task. But assuming you executed the
former, setting an impression for playfulness right off the bat can pay dividends later.

## 4. spend playfulness points during successes

Errors are frustrating. Messages like `Oops! Something went wrong!` can be flippant and tone-deaf,
especially when it resulted in data loss. Believe it or not, that was an actual error message I
encountered that left me unable to pay a bill! _Oops!?_ More like “Oops! I accidentally cancelled
your horrible service!”

In light of so many failures we encounter on the web, successes are something that should be
celebrated! 🎉 Did a user finish sending an email? Add a fun illustration and some congratulatory
copy on that success page! Has a user reached a certain milestone in your app (miles walked,
achievement reached, numbers hit)? Add a cool badge to their profile.

Unexpected rewards may result in the most positively-perceived experiences. So let’s try and help
the humans that use our application feel appreciated because they’re worth it.

## so how big is my “playfulness budget?”

The natural question after reading all this is—”how much can I spend?” “How far is too far?” You
probably saw this coming: **it depends**.

Just like our personal relationships, sometimes a loved one reaching out to talk can be a
life-saver; other times a burden because you just really don’t have the time right now. In app
design, “moments of delight” can either be a joy or a nightmare depending on the mindset of the
user, the “panic level” they’re feeling, and what you’re offering them.

When we’re dealing with people, _too much_ efficiency can be boring and detrimental to the squishy
humans you’re guiding. Sometimes the straightest roads can have us feeling sleepy behind the wheel a
bit. Sometimes the little detours, the fun little dips and curves, _make_ the journey memorable.

[lkg]: https://littleknowngoods.com
