---
title: Hey now, you’re an AI Star
description: My world’s on fire, how ’bout yours?
pubDate: 2026-05-25
categories: ["dev"]
---

<q>AI is the next great Industrial Revolution,</q> an out-of-touch millionaire says [to a recent graduating class](https://www.theguardian.com/technology/2026/may/12/florida-students-boo-graduation-speaker-ai) as she’s booed to temporary silence (that was my school! and I know that lady—the boos were deserved!). Eric Schmidt, co-founder of Google and name in the Epstein files, [also received similar treatment](https://www.nbcnews.com/tech/tech-news/former-google-ceo-booed-graduation-speech-ai-rcna345585). Every story run about AI in the past year seems to deepen a divide between two groups: the hands trying to shove it down everyone’s throats, and said throats gagging on it.

<q>Just give it time.</q> <q>The models will get better.</q> <q>You just have to learn how to use it.</q> <q>Once we figure out better workflows, creativity is going to be superpowered.</q>

Shut up, no, fuck you.

These tools are not only [complete](https://www.reddit.com/r/programming/comments/1r9xd58/aws_suffered_at_least_two_outages_caused_by_ai/) [ass](https://www.theguardian.com/technology/2026/apr/29/claude-ai-deletes-firm-database) [at](https://www.axios.com/2026/04/26/ai-cost-human-workers) [coding](https://fortune.com/article/does-ai-increase-workplace-productivity-experiment-software-developers-task-took-longer/) (yes, in 2026, with the fancy models), they are telling people [to end themselves](https://www.psychologytoday.com/us/blog/urban-survival/202507/the-emerging-problem-of-ai-psychosis). Call me crazy, but a tool that not only slows down developers, but makes them go insane, may be a bad deal. But execs are already one step ahead of that, and they’re [firing staff like crazy in the name of AI](https://tech.yahoo.com/general/article/tech-layoffs-2026-update-over-142000-people-have-been-laid-off-from-meta-linkedin-cisco-and-more-144545654.html) to lock in those headlines. Give it a few years, and nobody will remember that teeny little detail that all of these layoffs are fueled by greed, not because AI is actually replacing developers’ work.

## No, this is weird, Ok?

It’s been three years, give-or-take, that I’ve followed LLM adoption in software, and I can’t shake just how… _artificial_ this AI push has seemed. Like, this _reeks_ of astroturfing.

I’ve been writing code since CSS2 days, and have seen firsthand the shift from FTP to [CI/CD](https://www.redhat.com/en/topics/devops/what-is-continuous-delivery), the rise of version control, [12 factor apps](https://12factor.net/), the creation of the term “frontend” leading to its [“split,”](https://www.axios.com/2026/04/26/ai-cost-human-workers) watched JavaScript get types and a [module system](https://css-tricks.com/life-with-esm/) and [bundlers](/blog/getting-started-with-webpack) that led to all of it, and I lived through HTTP/1 → HTTP/2 → HTTP/3. The web was built differently in 2025 [than 2015](https://www.reddit.com/r/ProgrammerHumor/comments/127i1gn/php_is_frankenstein/) [than 2005](https://www.youtube.com/watch?v=iV8MATpZuZg) (IDK what was before 2005–to my knowledge it was only [SpaceJam](https://www.reddit.com/r/90s/comments/1i8kvcw/space_jam_website_from_1996_is_still_online/) and [PizzaNet](https://www.reddit.com/r/90s/comments/1iwnmk1/pizzanet_in_1994_pizza_huts_experimental_online/)). It has _always_ been moving at breakneck speed: blink, and you’re left behind. The way we think about code, and ship it, has fundamentally changed _again, and again, and again,_ with tools and resources expanding rapidly.

<q>AI is just the next big wave in software development! Get on board, or get left behind.</q>

Shut up, no, fuck you.

_I was there_ through so many huge shifts in the ecosystem. I was [working on an ESM CDN to change the internet](https://www.pika.dev/about) when [Google Chrome killed it](https://www.peakhour.io/blog/cache-partitioning-firefox-chrome/). I was working on [speeding up JS delivery in an HTTP/2 world](https://dev.to/pika/a-future-without-webpack-ago), even being invited to [a TC39 proposal on this](https://github.com/tc39/proposal-module-expressions) and being an [early contributor to Vite](https://www.youtube.com/watch?v=OrxmtDw4pVI) (all the parts where Fred talks—I was there helping him!). I was a co-creator on the [Astro language syntax](https://astro.build/blog/introducing-astro/) that now powers over 1 million websites. I helped contribute to [the W3C Design Token Community Group’s first stable version](https://www.designtokens.org/). (OK OK OK now I’m just bragging about myself).

My point is, I was invited to sit at the cool kids table a few times over the years, and not once did it feel anything like how this AI bullshit is unfolding. Because it was just a bunch of overworked, underpaid nerds trying to solve a problem for humanity, not multiple multi-billion-dollar companies at the center of it trying to force their products into every nook-and-cranny, humanity be damned.

## Ok Mr. “I-can-pass-a-Turing-test” Powers, what makes you so smart? Why aren’t you using AI to code?

I may not be the sharpest tool in the shed, but I can try and sketch how my brain works anecdotally for writing software, and how AI is useless in my process. But I think this anecdote is important, because it’s not something that’s going to bubble up in data or surveys, at least not soon.

My general process is:

1. **Goalset.** AI can’t help me with that. There’s also a joke about how AI can’t replace creatives, because clients don’t even know what they want to know what to ask the AI to do. “I’ll know it when I see it” is a myth (on the contrary—[the struggle toward taste may be necessary](https://bookshop.org/p/books/so-good-they-can-t-ignore-you-why-skills-trump-passion-in-the-quest-for-work-you-love-cal-newport/5d39759b0612b79d)). But this is a “gimme,” even AI-pilled folk say they start with this, too.
2. **Research.** Dig up the prior art. The _good_ prior art. The giants whose shoulders are _worth_ standing on. AI can help a little here, but not much—it can get some basic starting points, but not great ones. AI will never get you [elite ball knowledge that blows peoples’ minds](https://www.youtube.com/watch?v=QZP8OwCdO1E).
   - On an even deeper level, it’s the internalization, and the following in others’ footsteps, where the real growth happens. It is in this step that you actually begin to question your framing of the question. You start realizing your original perspectives were naïve. By outsourcing this, you forego the most crucial part of your own growth here, and you really gain nothing from it other than shitty slop code at the end.
3. **Strategize.** Figure out the “budget” here for solving the problem—what does 100% quality cost, vs 90% vs 50%? What can be delivered incrementally? Where are the solved vs unsolved problems here, and what is our budget for trailblazing? Who is on your team, and how does the expected budget and trailblaziness cater to your teammates individual strengths and weaknesses? Lastly, am I framing this for middle management, exec, an external client, or public audience, and does that affect the strategy?
   - This is why I get paid the big bucks. If you are not asking these questions yourself, don’t talk to me about how AI can write software the same, because it is _not_ thinking through these. At all. Also, AI doesn’t know your teammates, doesn’t know that Greg has crippling ADHD and will waste everyone’s time doing untimeboxed discovery, but will fucking 100x everyone else if the tickets are written in a way that make sense to their brain.
4. **Code.** Write the code that slots into my goal-oriented (i), researched (ii), strategic (iii) plan. Here’s where you can argue AI can do as good a job as any software engineer, and I don’t care. What I _do_ care about is people pretending like this one step is the bulk of the work. That’s some junior dev shit. This is the stuff that is frankly OK to delegate out to whatever makes most sense.
5. **Present.** The thing that leaves the lasting impact is after we’ve hit our goals, answering “what does that mean for folks” and tying a ribbon on it and hand-delivering it to them. <q>There’s 20k more lines of software… *so what*?</q> <q>Those 20k lines are a new product and revenue stream.</q> <q>Those 20k lines mean your app is accessible to unsighted users.</q> <q>Those 20k lines just reduced your operating costs by 30%.</q> Really knocking the delivery out of the park is ultimately about relationships with the humans you’re delivering it to, and understanding what they care about. There is not a context window big enough to navigate this infinitely-deep human problem.

Out of all these steps, AI is trash at all of these, except maybe #3. Which is 20% of the process, being generous.

<q><i>pRoMpT BeTtEr!</i></q>

Shut up, no, fuck you.

Pay attention to how software is written at a larger scale than your bullshit ticket-punching team run by incompetent management. And learn how to expect more from the code you have to spend your precious time on earth reading.

## No, seriously, this is astroturfing

There’s no better way to end a “get off my lawn” rant than to end it with “and the next morning, I went out and all my grass was gone! Replaced with astroturf!” conspiracy. After seeing just [how much money](https://www.bloodinthemachine.com/p/the-ai-bubble-is-so-big-its-propping) is flowing through these big AI companies, them spending unprecedented amounts on ads, DevRel content, and even Hacker News posts, wouldn’t even register as an ink spill on their balance sheet. I mean, why am I being served Reddit and Tik Tok ads for Open AI, when the only subreddits I’m subscribed to right now are [arcade controller porn](https://www.reddit.com/r/fightsticks/) and [Highlights for Children](https://www.reddit.com/r/FindTheSniper/)? Why does something _sO SuCcESsFuL_ need this much ad spend, if it sells itself?

I’m not going to go as far as say [LLMs are a dead-end technology](https://www.theargumentmag.com/p/ais-biggest-critic-has-lost-the-plot), but I am saying you all are fucking crazy if you think that most of this usage in 2026 is all organic and the result of good product–market fit.

Either way, whether you are a believer in it or not, I hate the way it’s destroying the [software environment](https://www.404media.co/software-developers-say-ai-is-rotting-their-brains/) and [_environment_-environment](https://www.reddit.com/r/Georgia/comments/1tkerep/aoc_this_is_what_drinking_water_in_georgia_looks/). Count me out of AI usage for the next, oh, 3–4 years or so. Maybe I’ll [emerge as a “Sara”](https://www.stvn.sh/writing/programming-still-sucks-fqffhyp), but more than likely I won’t [emerge at all](https://ky.fyi/posts/ai-burnout).

_This blog post, and website, don’t contain a single character of AI-generated content._
