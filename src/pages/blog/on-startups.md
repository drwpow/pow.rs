---
title: On Startups
description: How to burn out your employees AND bridges all at the same time!
layout: ../../layouts/post.astro
date: 2024-09-21
tags:
  - dev
---

I recently grabbed lunch with a former coworker to catch up, and was sad to hear the unhealthy working environment I left hadn’t improved much. As we talked, I realized I had strong opinions about what NOT to do having run on the early-stage hamster wheel 4 times now. While I am but a mere grunt—a pawn in the grand game of venture capital chess—I still have experiences of what didn’t work well from the ground-level perspective. Follow this advice if you want to fail, and fail spectacularly:

## Change your fundamental values constantly

I’ve said for years the main thing that stresses me out in a startup environment is _not_ the pivots, and taking wandering paths to reach a goal. It’s when the North Star is in a different hemisphere every quarter. The moment the fundamental vision and values change, you’ve lost. Combine that with no carrot, all stick from execs, trying to drive everybody at full speed while not having the courage to admit mistakes, and you have all the ingredients of the worst possible work environment.

But more than that, let’s look at it from a customer perspective—_they know_. If you’ve ever had trouble breaking through to a market, it may have been your track record. They look at how likely you’re going to pull the rug on them. They can _see_ you’re trying to sell a 5-year product on a 2-year runway to them. Have some guts, and have conviction your product is worth staying the course for, and customers will respect that. And don’t blame them if they also want to wait you out, and see if you’ll even be around in a year or two. If your approach to solving a problem is worth it, you’ll dedicate all your resources to it, and in the process you’ll overtake the competition that’s one foot out, distracted trying to capture other markets when they haven’t even captured their first.

Sometimes execs get brainworms and confuse life with business. Founder mentality and all that, sure. _Life_ is as mysterious as it is wonderful. And it’s a journey with infinite paths to explore, and infinite possibilities. But despite what is enshrined in US law, your business entity is _not_ a person and is _not_ on a journey of discovery; it’s fucking <abbr title="software as a service">SaaS</abbr>. Make thing, sell thing. Unga bunga.

## Hire (or be) assholes

Software development is a social job, despite its reputation for being filled with smelly basement-dwellers (which isn’t far from reality—I myself am a stinky cave troll). You do have to have a bare-minimum level of human empathy and semi-comprehensible communication skills to make a career out of it. And yet, [gestures broadly] …

Who knows why people are the way they are? But also, who cares? If we’re looking through the ice-cold capitalistic lens of business, you want to hire 2 types of software developers so your business can deliver shareholder value:

1. Good engineers: build thing
2. Good communicators: organize efforts to build thing faster

Ideally most engineers have some bits of both. But it’s when you have people who disrupt every meeting they’re in, steamroll decisions, stonewall input, _AND_ don’t deliver anything of technical value to the company, they are causing more destruction in your eng org than anything else. Which brings us to the next point:

## Leave engineering unchecked

I came into early-stage startups from agencies, and I was delighted that it was a lot of the same of what I had been doing—building greenfield apps—but for much higher pay (over double, in fact!). And where I would frequently see the highest burn of engineering time was when engineers from Big Tech™ would do it a certain way, because that solved a problem for their billion dollar company that served a completely different customer vertical. Said Big Tech engineers wouldn’t be challenged, because after all, who am I to argue with Salesforce/Google/Facebook/Apple/Uber/etc.? But what happened in reality would be that developer carrying over all their previous company’s technical debt to new infrastructure that didn’t have any of the maturity or value produced by that debt.

It always ended up in 1 of 2 ways: if the Big Tech™ engineer had some integrity and courage, they’d admit their mistake and we’d only have lost about 6–12 mos of work as we rebuilt parts of the system that were overengineered _AND_ underengineered in all the wrong areas. Or, they’d go down fighting tooth-and-nail, and the eng org would struggle to ship anything on a reasonable schedule until the runway was gone. In both scenarios, an unrecoverable amount of time was wasted, not as a hindsight thing, but as an open secret that everyone in the eng org saw coming, and raised, but weren’t listened to.

One startup I worked at had an unusably-slow dev environment running on mostly-custom tooling that was unlike anything I had ever worked with. Many weeks I struggled getting a single PR in because my local environment either wouldn’t run, or the thing I was working on had such a complex feedback loop it would take me multiple days to figure out how I could test it. But all that custom tooling served a purpose… _right_? After months of pain and frustration, and trudging along at 1/4 of my usual speed, I talked to the engineer responsible.

“X, Y, and Z is all needed to deploy on our custom infrastructure. It’s all highly scalable.”<br>
“…So we _need_ that scale, right?”<br>
“Oh, not really. We barely even need 1 instance right now; I don’t even know when we’ll need a 2nd.”

It took everything within me to not reach through the Zoom call to strangle them. Why we were lighting money on fire, and burning out engineers, for a problem that didn’t even exist will haunt me for the rest of my days.

![Quote from the end scene of The Warriors (1979), modified for humor. Swan: “Why’d you do it? Why’d you waste everybody’s time?” Luther: “No reason. I just LIKE doing things like that!”](/assets/posts/on-startups/warriors-whyd-you-do-it.jpg)

Now I won’t say that doing the _opposite_ of overengineering is significantly better, having an app barely held together with duct tape and prayers. Both extremes will burn out your engineers and result in attrition. And obviously I’m not saying Big Tech™ engineers aren’t good hires, either; they ABSOLUTELY are—at later stages. But if you have to err on one side or the other, learning your own lessons (and challenging “Big Tech did it that way so we have to”) rather than being burdened with your predecessors’ during the early stages is far more recoverable.

## Hire the product scapegoat halfway through runway

Usually the tipping point of any early-stage startup is after some failed deliveries, as that runway is drawing closer, they introduce a new product role to right the ship. Said product person either may or may not have had any success with the current customer vertical (usually depends on the budget allocated). This person shows up with fanfare and applause, spends several months “learning the company” and shadowing meetings, not having an impact. Then the next quarter or half, the more influence they start exerting (usually with some new processes, or new feature idea), the more the execs start to feel their vision is being compromised, and in turn undermine and sometimes publicly blame the product person for every failure in the company.

Mind you, product roles that existed from the start are fundamentally different. The difference is my first point—of moving that North Star around every quarter. Having a solid, unwaivering product vision from the get-go is fundamental. But it’s when the execs are completely at a loss at how to hold onto a vision that they try and “buy one,” it’s a good signal to start dusting off the resumes.

---

I like working in startups. I love having a smaller, tight-knit group of people that have genuine fun working with one another, and wasting company money at fancy offsites several times a year. There are so many startups doing it well. In fact, I get nostalgic for the first startup I worked at. Mistakes were made, sure, but I still think it would have been around longer had an almost-guaranteed funding round / end of runway not fallen on the early stages of pandemic when most VCs’ coin purses closed tight.

But if I could boil it down to one belief that I find problematic: it’s the _quick cash grab_. It’s not what the world needs. It’s causing mental anguish to your own employees and engineers. Underneath all the flowery speeches, All-Hands presentations, and marketing pushes, execs know deep-down when they’re trying to make a cash grab. And all the decisions that result from not taking the harder, slower, steadier path toward a consistent vision ultimately aren’t even worth pursuing in the first place.

<figure>
  <img src="/assets/posts/on-startups/8-1-2.jpg" alt="black-and-white screengrab of 8 1/2 by Federico Fellini (1963)" />
  <figcaption>“There are already too many superfluous things in the world. It’s not a good idea to add more disorder to disorder. Believe me, you should feel neither nostalgia nor remorse. It is better to destroy than create when you’re not creating those few things that are truly necessary.” —Federico Fellini</figcaption>
</figure>

Would I work in an early-stage startup again? Maybe. Truthfully, every startup I’ve worked in has taken some toll on me mentally. Of the 4 early-stage startups I’ve worked at, half I left because we were at end of runway (which can’t be helped); the other half was because the North Star moved so much I found myself doing a completely different job than what I had been hired for (and how I was evaluated, and how I was _perceived_ to deliver, constantly-moved with it). But if I work at one again, it’ll have to have some skin in the game. It’ll have to be so committed to a singular vision so deeply it either succeeds out of sheer tenacity, or fails but leaves a lasting impression of what could have been. And even in the worst-case scenario, _someone_ will be inspired to carry the torch, if the vision was worth it in the first place.
