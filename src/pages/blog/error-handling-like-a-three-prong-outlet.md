---
title: error handling like a three-prong outlet
description: the hidden part of programming
date: 2016-08-24
tags: ['dev']
layout: ../../layouts/post.astro
---

# Error handling like a three-prong outlet

For the first 50 years or so, this is what electrical outlets in homes looked like (at least in
America and some other places):

<figure><img src="https://miro.medium.com/max/600/1*GkGrKCKeWzkCG8A6tcquqw.jpeg"><figcaption>What outlets used to look like until the 1960s (now illegal to put in new homes in the US as of 1971)</figcaption></figure>

This particular design allows 120V of electricity to power any electronic device with a plug of this
shape, while the plastic and rubber protect our fragile meat-flesh from its consuming power.
Ideally, electricity flows out of one end (the _hot_ wire — usually black), through a device to
power it, and flows out into the _neutral_ wire (usually white). Like water flowing downhill. Does
it work? Yes. _Most_ of the time.

The reality is that electricity _could_ go through anything that comes in contact with those wires,
be it floors, walls, ceilings, furniture, pets—you name it. Yet it doesn’t, because the effort
required for electricity to move through rubber, plastic, and wood is
~1,000,000,000,000,000,000,000× harder than to just move through the metal wiring. At least, it
_should_ be.

<figure><img src="https://miro.medium.com/max/60/1*-7tVwboVey9FvCPcIRliCA.jpeg?q=20"><figcaption>so electricity IRL, amirite?</figcaption></figure>

_However _(you probably saw this coming), there are some instances where electricity’s path from hot
to neutral is _not_ the path of least resistance. Sometimes this is because a pet chewed a cord and
the wiring is exposed. Sometimes something breaks or overheats in a device. Sometimes it’s just
cheap manufacturing. There are virtually infinite non-ideal scenarios where electricity doesn’t go
where expect it to. And that usually leads to…

<figure><img src="https://miro.medium.com/freeze/max/60/1*52bMDs2J_kJjaTiirWinsw.gif?q=20"><figcaption>Ooh girl, shock me like an electric eel</figcaption></figure>

Often in software development, we write code for **perfect scenarios** that work _most_ of the time.
When everything behaves perfectly and users do what we expect them to, our application runs without
errors. But often people may do silly things like have
[_Null_ as their last name](http://www.wired.com/2015/11/null/). Or enter a
[database query](https://xkcd.com/327/) into a field.

For electricity, all we really needed to do to solve this problem is add a third prong: _the
ground_. 99% of the time it isn’t needed, but for that 1% of the time something goes wrong, a ground
wire provides electricity an escape route with a resistance so low that conceivably nothing would be
an easier path. And even though ground prongs exist for < 1% of scenarios, they are a necessary part
of every physical outlet and medium-to-large device plug.

<figure><img src="https://miro.medium.com/max/60/1*jKuAJ_heEEha6n50WMy1_g.jpeg?q=20"><figcaption>Ground wires account for < 1% of scenarios but are still a necessary part of every physical outlet and device plug.</figcaption></figure>

Back to software: errors and bad user input are **much** more common than electrical grounds being
used. Yet, why do we continue to build programs that spit out stupid/unhelpful error messages? Why
doesn’t every API return proper HTTP status codes? Why do core navigations of so many sites depend
on third-party tracking scripts to load? Why do web forms omit _actions_ making it impossible to
submit when there’s a JavaScript error? Why is it so, so easy to unravel a large application
oftentimes by just pulling on one thread? Often it’s due to sloppy/non-existant error handling.

<figure><img src="https://miro.medium.com/max/60/1*iij3dPvKv2yXmwzF5T-vmg.jpeg?q=20"><figcaption>Error: a suitable error message could not be found</figcaption></figure>

Sure, sure—unless you’re the developer responsible for developing an Internet-capable fire sprinkler
(which I wouldn’t wish upon any human), you’re not going to cause house fires if you don’t handle
errors gracefully. But like a ground prong in an outlet, error handling should be so _ingrained_ in
your development process that to skip it should feel like using a
[cheater plug](https://en.wikipedia.org/wiki/Cheater_plug) (TL;DR they’re bad and dangerous). You
_cheater_.

<figure><img src="https://miro.medium.com/max/60/1*XqfwnPSRTg7T5bHtgo6MkA.jpeg?q=20"><figcaption>Don’t be a cheater. You’re better than that.</figcaption></figure>

In the _dynamically-typed_ languages like JavaScript that so many of us rely on, you can’t exert
complete control over what your data is or becomes. You may expect _myNumber_ to be an integer, but
if you expose that, the language itself can’t prevent bad user input or a program error to reassign
that numeric variable to be _corndog_ or _Guy Fieri_. So it’s essential in your error handling
process you use things like
[try…catch](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/try...catch)
and [switch](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/switch),
as well as [validation libraries](https://github.com/chriso/validator.js) if your language/framework
doesn’t handle that on its own.

Whatever you incorporate into your process, always write code that _expects_ errors to arise.
