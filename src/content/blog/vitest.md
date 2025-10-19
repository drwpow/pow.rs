---
title: Why aren’t you using Vitest for testing yet?
description: Throw away whatever you’re using already and use this for testing.
pubDate: 2022-10-19
categories: ['dev']
---

[Vitest](https://vitest.dev) is the hottest thing to happen in testing since … _ever_. And that’s not an exaggeration! It’s truly a milestone in web dev that no one could have predicted. I’ll admit that when I heard Vite could be used as a test runner I had a knee-jerk <a href="https://www.youtube.com/watch?v=O7oD_oX-Gio" target="_blank" rel="noreferrer" ><i>you-got-peanut-butter-in-my-chocolate</i></a> reaction where it felt like two things got combined by accident. But the more I’ve used it and thought about it, the more I’ve realized the combination is absolutely perfect for each other and it’s been a crucial missing piece in the webdev workflow that can’t be overstated.

And, _yes_, you should be using Vitest.

## Why Vitest is historically significant

As one of the core maintainers of <a href="https://github.com/FredKSchott/snowpack" target="_blank">Snowpack</a> (it was real hot before Vite came along) and one of the creators of <a href="https://github.com/withastro/astro" target="_blank" rel="noreferrer">Astro</a>, I can say with experience that dealing with CommonJS vs ESM interop code is _hard_. And until Vite, the defacto way of managing it was to avoid it. Mainly by way of backporting everything into legacy CommonJS. Which, in the year of our Lord 2022—<a href="/blog/the-state-of-es-modules-in-2020">seven years after ESM has been standardized</a>—Jest is still transpiling modern ESM code back to legacy CommonJS with no end in sight. And when it comes to testing, **it makes no sense to execute your code in a different language from the one it was written in**. And yet that’s what Jest has been doing this entire time.

So point one in Vitest’s favor over Jest: **It executes your code as it was written**.

But it gets even better: not only is your test runner _closer_ to your production build than Jest—which is significant on its own. **Your test runner actually _is_ your production build.** And this is something we’ve never seen before (not without running true, heavy E2E tests, that is).

Gone are the days of fighting with Jest, spending time setting up your env vars, build plugins, configuration settings, … And after everything is done, still having to mock some of your modules that Jest just won’t run.

Vitest extending Vite means you don’t have to reconfigure env vars, plugins, settings, and all the implementation nuances of your production build. You reuse everything quite literally. And as your production app changes, so does your test runner! It’s this subtle brilliance that makes me wonder why no one has thought of this before. Argue as you might that Jest and webpack handled code the same, they were never truly unified, and you always had to maintain each’s ecosystem separately. And it’s Vitest’s prometheal revelation that your builder and test env should have been the same all along, feels like critical step toward the holy grail of a <a href="https://rome.tools/" target="_blank" rel="noreferrer">unified JS toolchain</a>. And that’s point two in Vitest’s favor: **you use your _exact_ production build config in your tests—with no setup and no maintenance**.

<i>But wait, there’s more!</i> Because Vitest is built on Vite’s powerful transpilation engine, you can also import **any type of file in your tests**. Anything your production app supports, so does your test runner. No more mocking critical parts of your app just because your test runner doesn’t understand it—no setup needed. So point three for Vitest: **you can use any language, any tool, without any additional setup**.

The last stroke of brilliance Vitest had was **matching Jest’s API**. It was quite literally designed from the ground-up to replace Jest, which is something all other test runners since Jest have struggled with. Love or hate Jest, having used (almost) every Node.js test runner under the sun, there’s still a level of maturity to Jest that makes it difficult to replace in real-world test suites. So the fourth point in Vitest’s favor: **you only get benefits switching from Jest with nothing asked for in return**.

So though it may seem counterintuitive or overcomplicated to use your production build tool for testing, nothing could be further from the truth: <i>Vitest is the simplest testing setup we’ve ever had.</i>

## Vitest is the future of testing

On any team I’ve been on in recent memory, I’ve had the ~misfortune~ <i>pleasure</i> of setting up testing because of my knowledge and experience. And that’s come hard-earned by wrestling with Jest, Mocha, and every other attempted replacement for longer than most people have. And it’s Vitest’s holistic approach to loading and running files that has made me such a believer that Vitest is the future of testing.

I think Vite has now become the gold standard in build tooling for JS, and is now an essential part of every web stack. And Vitest is part of that.

And if Vite is ever replaced as the go-to build tool, then Vitest should also be replaced with a new runner built on the build tool. Because that hard-coupling of builder and test runner is such a good paradigm shift for the web platform I hope we all opt in to and never look back.
