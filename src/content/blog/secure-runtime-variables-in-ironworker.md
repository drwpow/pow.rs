---
title: Secure runtime variables in IronWorker with Manifold
description: Docker secrets with minimal code & configuration
pubDate: 2018-06-10
categories: ['dev']
---

<figure>
  <img src="https://cdn-images-1.medium.com/max/7226/1*2BCrhl0gjpHVeGYGOKROmg.png">
  <figcaption>IronWorker visualization by Meg Smith</figcaption>
</figure>

[IronWorker](https://www.iron.io/worker) is a containerized background job manager that gives you
incredibly fast, super-scalable architecture with almost no code. Because it handles tasks
asynchronously, any web app can offload heavy lifting such as slow database operations or large data
processing to IronWorker without slowing down your users’ experience.

But there’s one problem—if a background worker is talking to all of these services, _where do the
secrets go?_ Docker containers are fantastic packages for consistent code runtime, but it’s no place
for secrets to live—cached and available to everyone that can access that Docker image.

[Manifold](https://manifold.co) gives you [a 2-minute setup to IronWorker](https://manifold.co/iron)
(and many other cloud services) — and it can also solve the problem of secrets for you, completely
free. As developers ourselves, we built the tools _we’d_ like to exist. We’ve been using this
internally for over a year, and think it’s a pretty great solution.

For extra fun—and to see how secrets work in practice—we’ll hook up IronWorker to another Manifold
marketplace service, [LogDNA](https://logdna.com), to enhance the experience with realtime logs. On
IronWorker, you don’t get to view a single log until _after_ a task is finished running (or erring
🙃). So taking advantage of a cloud-based logging service to give you realtime updates is a huge
win, especially for large tasks.

### What can I use IronWorker for?

IronWorker is just one piece of the [Iron.io](https://www.iron.io) devops suite of products. Using
IronWorker, you can handle several incoming tasks at once from multiple sources, sort the queue by
priority, and monitor the status of all of those concurrent tasks.

It takes care of big, slow, heavy stuff.

<figure>
  <img src="https://cdn-images-1.medium.com/max/2000/1*ToDYSlX_9Rg1IW8GHBLUFA.gif">
  <figcaption>IronWorker is basically like that “*I Love Lucy“ scene, but if Lucy operated at 100% efficiency at top conveyor belt speed and didn’t eat any chocolates</figcaption>
</figure>

Iron.io’s post _[Top 10 Uses of a Worker System](https://blog.iron.io/top-10-uses-of-ironworker/)_
explains why workers are simply _better_ for heavy tasks like image processing, transactional
emails, and data sifting. Give it a read to, as the author put it: “Change the way you think and
program.”

## Setup

You’ll need a few things to set up for this blog post:

1. Sign up for an [account on Manifold](https://dashboard.manifold.co/register) (it’s secure, free,
   and you can cancel at any time).
1. Install the [Manifold CLI](https://docs.manifold.co/docs/install-77T6auwaaIQcgA4QGouO0), and log
   in with manifold login
1. Install the [Iron.io CLI](http://dev.iron.io/worker/cli/) (Manifold will log in for us!)
1. Install [Docker](https://docs.docker.com/install/), create a [Docker ID](https://hub.docker.com)
   if you haven’t already, and log in with docker login

## 1. Provisioning LogDNA and IronWorker

From your Manifold account, create [a new project](https://dashboard.manifold.co/projects/create).
We’ll call it **iron-example** in our post, but name it any kebab-case name you’d like!

<figure>
  <img src="https://cdn-images-1.medium.com/max/2000/1*lIS7UwI9STjAHIJ6DwRylQ.png">
  <figcaption>Creating a new project in Manifold</figcaption>
</figure>

From there, provision **LogDNA **and **IronWorker** plans to the project.

![](https://cdn-images-1.medium.com/max/2000/1*sthOlMScOxe391X7_ZqVtQ.png)

<figure>
  <img src="https://cdn-images-1.medium.com/max/2974/1*Wk107m2jbYgnB6btuaUMQg.png">
  <figcaption>Discover and manage cloud services in the Manifold Dashboard, most of which have free plans.</figcaption>
</figure>

### Already have an existing IronWorker or LogDNA plan?

If possible, we’d recommend signing up through our Dashboard to take advantage of single sign-on and
aggregated billing, but you can still power your pre-Manifold account with our integrations.

To integrate your existing accounts, click the “Bring your own service” button and entering your
credentials: IRON_TOKEN and IRON_WORKER_PROJECT_ID for IronWorker; KEY for LogDNA.

<figure>
  <img src="https://cdn-images-1.medium.com/max/2908/1*cEAzC0wHf3fYjIeS7_D1Cw.png">
  <figcaption>Bring your own service” when creating a new resource</figcaption>
</figure>

<figure>
  <img src="https://cdn-images-1.medium.com/max/2332/1*w3GeZQ8Z93sPac1YYiVylA.png">
  <figcaption>Enter your creds to your service here. You can control access to these if you create a Team, and make a Team project!</figcaption>
</figure>

### Signing into LogDNA

Back in our project, we can now see the new LogDNA and IronWorker services present. Click **Open
LogDNA Dashboard**.

![Hovering over LogDNA in our project shows us a one-click Dashboard sign-in button](https://cdn-images-1.medium.com/max/2000/1*u_ubWDKbtT5HDpKan7XDsA.png)_Hovering
over LogDNA in our project shows us a one-click Dashboard sign-in button_

With Manifold’s single sign-on we get to skip signup and go straight to our project’s LogDNA
dashboard. Click the **Everything** tab to see our app’s logs.

It’s empty for now, but we’ll come back to this screen in just a moment to see our logs.

![](https://cdn-images-1.medium.com/max/2000/1*EruusW_4ypgQfwk_z4yPxw.png)

## 2. Uniting the workers on Iron.io

### Building a worker in Node.js

Now that we have LogDNA and IronWorker accounts managed in Manifold, let’s get some worker code up.

We’re starting with a bare-bones
[example Node.js app](https://github.com/manifoldco/iron-example-app) that’s already configured for
Manifold + IronWorker. To view this code locally, run the following in a terminal window:

```
git clone git@github.com:manifoldco/iron-example-app.git
cd iron-example-app
npm i
```

This is our entire app, minus config:

<iframe src="https://medium.com/media/2d134bb926e6ee3700d6157baadf4059" frameborder=0></iframe>

So our app…

1. …authenticates with LogDNA using Manifold CLI’s injected KEY
1. …doesn’t authenticate with IronWorker because that’s where our code will be running
1. …logs some simple text first,
1. …followed by our IronWorker payload with IronWorker.params() (we’ll get back to that)
1. …and a final log showing us the job’s complete.

### 🐳 Containerizing with Docker

IronWorker runs off [Docker Hub](https://hub.docker.com), which is great news for the many dev teams
already using it. And if you’re new to containerization, Manifold can help make adoption relatively
painless.

Our
[app uses a custom Dockerfile](https://github.com/manifoldco/iron-example-app/blob/master/Dockerfile)
(first letter uppercase, no extension) in the root folder of our application, configured for
Manifold CLI within IronWorker.

Assuming Docker is running, and we’re logged in with docker login, we’ll build a new Docker
container and **tag** with -t. You can think of tags like versions of your code, so every time you
make a change, you should give it a new tag. A common format is DOCKER_USERNAME/APP_NAME:VERSION
(e.g.: manifold/iron-example:0.0.1). In the following examples, replace USERNAME with your Docker
username. After it’s built, we’ll send it to Docker Hub.

```
docker build -t USERNAME/iron-example:0.0.1
docker push USERNAME/iron-example:0.0.1
```

💁 _Tip: testing stuff, or pushing an unstable version? Append -rc.0, -rc.1, etc. to the end of your
tag to keep your versions clean._

### 🏋️‍ Pushing to Iron.io

We’re letting Manifold handle our credentials, but IronWorker will need to authenticate into
Manifold to pull secrets. Rather than give out our Manifold email & password—_that’s not secure!_—we
can create a special token just for this worker with **read-credentials** permissions just for this
case:

```
manifold tokens create
```

**Keep it secret, keep it safe!** You won’t be able to retrieve this later. But you can generate a
new token, or deprecate an old token at any time with manifold tokens --help.

With that token, we can use Manifold to inject the IRON_TOKEN and IRON_PROJECT_ID secrets as runtime
variables. To alert Iron.io to our image on Docker hub, run the following:

```
manifold run -p iron-example -- iron register -e "MANIFOLD_API_TOKEN=MY_MANIFOLD_TOKEN" USERNAME/iron-example:0.0.1
```

This is using manifold run to inject variables attached to our **iron-example** project (-p). It’s
running the iron register command, injecting a single runtime variable (-e): our Manifold token from
the previous step. Our final argument is the tag of the image we just pushed to Docker Hub.

_Note: to improve security and performance, Manifold isn’t a proxy; it only injects the secrets.
Your app connects directly to all these services with no middleman._

### Checking our work

If we go back to our **iron-project** in the Manifold Dashboard, we can click the **Open IronWorker
Dashboard** button to see our Dashboard:

![Sign into IronWorker straight from Manifold](https://cdn-images-1.medium.com/max/2000/1*zjREoiSus9K6Sqmd-gZ_6g.png)_Sign
into IronWorker straight from Manifold_

Once signed in, we should see our Docker image on the home screen:

![Iron.io dashboard](https://cdn-images-1.medium.com/max/2340/1*2I5szNnGMKqlqJcensGCrA.png)_Iron.io
dashboard_

🎉 Woo! 🎉 Iron.io is now running our worker code, ready to be assigned tasks.

### Recap for deployment

Say we make a change in our app, and need to update IronWorker to USERNAME/iron-example:0.0.2.
Here’s a recap of what to do:

```
docker build -t USERNAME/iron-example:0.0.2 .
docker push USERNAME/iron-example:0.0.2
manifold run -- iron register -e "MANIFOLD_API_TOKEN=MY_MANIFOLD_TOKEN" USERNAME/iron-example:0.0.2
```

1. Re-build with docker build

1. Push to Docker Hub with docker push

1. Tell Iron.io about the new Docker Hub image with iron register (with manifold run logging in for
   us)

You can add a deploy NPM Script in package.json to automate this, and save a little typing:

```
TAG="USERNAME/iron-example:0.0.2" MANIFOLD_TOKEN="MY_TOKEN" npm run deploy
```

This is what the script looks like in our [package.json](http://(already present in our example,
actually!):) (we’re also using
[a .manifold.yml file](https://docs.manifold.co/docs/config-38vPGWk1N6egqMwKEwcCAi) to set the
project & team):

<iframe src="https://medium.com/media/642f17f77464c0116958cb415aed83f5" frameborder=0></iframe>

_Note: this was the shortest amount of typing I could think of without committing a sensitive secret
to version control. If you can think of an even shorter way to run this, leave a comment!_

## 3. Queueing for everyone

Now comes the good part: actually seeing our app run. Sign in to your LogDNA dashboard again from
your Manifold project, and navigate to **Everything**. Also sign into your IronWorker dashboard, and
click on the name of your image.

![Clicking on an image in IronWorker shows you all your tasks, along with the version that ran them, logs, and other pertinent data.](https://cdn-images-1.medium.com/max/2558/1*0KQVobBBXbEX8dvJVtirYA.png)_Clicking
on an image in IronWorker shows you all your tasks, along with the version that ran them, logs, and
other pertinent data._

You’ll see a screen that shows you all your queued tasks, and which tasks ran successfully and which
erred (green and red in the screenshot). This will be blank if you haven’t queued any. From that
screen, click the **Queue Task** button to test our code.

![IronWorker’s Queue Task screen](https://cdn-images-1.medium.com/max/2558/1*-FjePu0EntAvfkSKYF2vjQ.png)_IronWorker’s
Queue Task screen_

For now, all you need to fill out is **Payload**, in JSON format. For our example, we’ll feed it the
time-honored, classic dish:

```json
{
  "foo": "bar"
}
```

Click **Queue Task** and you’ll see it run. Now, if everything worked as intended, pop over to
LogDNA to see:

![](https://cdn-images-1.medium.com/max/2406/1*bUzT-Ad3AN3Dotu19KI6xw.png)

We see the thing we typed! That’s a very good sign!

<iframe src="https://medium.com/media/c5ee627c67ff4ec3e4e0d897500ee961" frameborder=0></iframe>

Our app now takes the payload received from IronWorker through IronWorker.params(), and logs it to
LogDNA. This means that your code can be dynamic, accepting a wide range of inputs and tasks based
on the data it’s given. IronWorker.params() will be your entrypoint to any kind of data needed for
your super special task.

Your worker is basically now an endpoint, ready for any task large or small. The secure connections
are handled thanks to Manifold, and the parallelism is handled for you thanks to Iron. ✨

## Next Steps

Running tasks manually gets old real quick, especially because we’re developers and will automate
anything we have to do three times 😎. Now that we have a worker with running code and able to
handle payloads, we’re getting into serious territory. I’ll end the post here, showing how to
schedule tasks from the IronWorker dashboard, as well as programmatically from another application.

### Scheduling Tasks from within IronWorker

IronWorker has a handy dashboard to create and manage scheduled tasks just one tab away! Click
**scheduled tasks in **the navigation, followed by the **Schedule Task** in the top-right to be met
with a familiar screen:

<figure>
  <img src="https://cdn-images-1.medium.com/max/2364/1*Hj9ucUDM9OAzNzRTEmZfrQ.png">
  <figcaption>IronWorker’s real power is in its scheduling</figcaption>
</figure>

Here, we can also take a payload as with the manual task, but now we can schedule automatically
recurring tasks, like a cron job on a server but with no server or cron jobs to manage.

If your app can run automatically, such as a newsletter or scraper, this is probably the best place
to manage that schedule.

### Queueing tasks from outside of IronWorker

Scheduled tasks are great, but most cases will usually involve some other application that needs to
queue a job to our worker. Fortunately, the iron_worker NPM module we were using also comes with a
.Client() built in:

<iframe src="https://medium.com/media/e561c557853cd80e57a0114af851c843" frameborder=0></iframe>

_Note: remember we didn’t have to authenticate for our worker running on IronWorker, but we will
have to for outside apps._

So for any large, arduous, async job, we can simply kick it to IronWorker from any app, and go about
our business. In case your stack isn’t in Node.js, fret not: IronWorker client has first-class
support for Golang, Ruby, Java, PHP, Python, and .NET too!

We can’t **schedule** from outside our app, because ideally scheduling should be self-managing! To
recap: you can **schedule** from the IronWorker CLI or the Dashboard, or you can **queue** from
anywhere using the IronWorker client. Consider a different approach if you’re trying to schedule a
repeat event programatically.

To learn more about queueing, see the
[docs on IronWorker client](http://dev.iron.io/worker/libraries/).

From here, _the sky’s the limit!_

![Just keep on pressin’ on](https://cdn-images-1.medium.com/max/2000/1*DbcxApmoaW_m2TR9c1Z15Q.gif)_Just
keep on pressin’ on_

### Further Reading

- [Building a Scheduled Newsletter in Ruby with IronWorker and Mailgun](https://medium.com/@rbnpercy/d20d91676463)
  by Robin Percy
- [Top 10 uses of IronWorker](https://blog.iron.io/top-10-uses-of-ironworker/) by Dylan Starnat
- [IronWorker webhooks](http://dev.iron.io/worker/webhooks/) on the Iron.io docs
- [Arguments and variables in Docker](https://blog.manifold.co/arguments-and-variables-in-docker-94746642f64b)
  by Tim Speed

![](https://cdn-images-1.medium.com/max/4000/1*yjQxpcurS6C8nHXJST-7Zw.png)
